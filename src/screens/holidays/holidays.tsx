import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Dimensions,
} from 'react-native';
import HolidayService from '../../services/HolidayService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  Star,
  Home,
  Clock,
  Briefcase,
  User,
  Menu,
  Filter,
  Bell,
} from 'lucide-react-native';
import { Holiday } from '../../types/holiday';
import { formatDate } from '../../utils/dateTimeFormater';
import tw from 'twrnc';
import Animated, {
  FadeInUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const Holidays = () => {
  const navigation = useNavigation<NavigationProp>();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const calendarScale = useSharedValue(0.8);

  // Get month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Month names
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Day names
  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  //get holidays
  const handleGetHolidays = async () => {
    try {
      setLoading(true);
      const response = await HolidayService.GetAllHolidays();
      console.log('response of holidays:', response);
      if (response?.status == 200) {
        const holidayData = response?.data?.data || [];
        setHolidays(holidayData);
      }
    } catch (error) {
      console.log('error while getting the holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get holidays for current month
  const getCurrentMonthHolidays = () => {
    return holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getMonth() === currentMonth &&
        holidayDate.getFullYear() === currentYear
      );
    });
  };

  // Get holidays for selected date
  const getSelectedDateHolidays = () => {
    if (!selectedDate) return [];

    return holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.toDateString() === selectedDate.toDateString();
    });
  };

  // Get calendar stats
  const getCalendarStats = () => {
    const currentMonthHolidays = getCurrentMonthHolidays();
    const customHolidays = currentMonthHolidays.filter(h => h.isCustom);
    const officialHolidays = currentMonthHolidays.filter(h => !h.isCustom);

    // Get total days in month
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Get Sundays in current month
    let sundays = 0;
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentYear, currentMonth, day);
      if (date.getDay() === 0) sundays++;
    }

    // Working days = Total days - Sundays - Holidays
    const workingDays = totalDays - sundays - currentMonthHolidays.length;

    return {
      totalDays,
      holidays: currentMonthHolidays.length,
      sundays,
      workingDays,
      customHolidays: customHolidays.length,
      officialHolidays: officialHolidays.length,
    };
  };

  // Check if date has holiday
  const hasHoliday = (date: Date) => {
    return holidays.some(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.toDateString() === date.toDateString();
    });
  };

  // Get holiday for date
  const getHolidayForDate = (date: Date) => {
    return holidays.find(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.toDateString() === date.toDateString();
    });
  };

  // Navigate month
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);

    // Adjust to start from Monday (1) instead of Sunday (0)
    const dayOfWeek = firstDay.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - mondayOffset);

    const days = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === currentMonth;
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const holiday = isCurrentMonth ? getHolidayForDate(date) : null;
      const isSunday = date.getDay() === 0;

      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        holiday,
        isSunday,
      });
    }

    return days;
  };

  // Refresh function
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleGetHolidays();
    setRefreshing(false);
  }, []);

  // Animation styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const calendarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: calendarScale.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      handleGetHolidays();

      // Animate components
      headerOpacity.value = 1;
      calendarScale.value = 1;
    }, []),
  );

  const stats = getCalendarStats();
  const calendarDays = generateCalendarDays();
  const selectedDateHolidays = getSelectedDateHolidays();
  const currentMonthHolidays = getCurrentMonthHolidays();

  const renderHolidayCard = ({
    item: holiday,
    index,
  }: {
    item: Holiday;
    index: number;
  }) => {
    const isCustom = holiday.isCustom;

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100).springify()}
        layout={Layout.springify()}
        className="bg-white rounded-xl p-3 mb-3 border border-gray-100"
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center gap-2 mb-1">
              <Text
                className="text-base font-semibold text-gray-900"
                style={{ fontFamily: 'Poppins-SemiBold' }}
              >
                {new Date(holiday.date).getDate().toString().padStart(2, '0')}
              </Text>
              <Text
                className="text-sm text-gray-900 flex-1"
                style={{ fontFamily: 'Poppins-Medium' }}
                numberOfLines={1}
              >
                {holiday.name}
              </Text>
            </View>
            {holiday.description && (
              <Text
                className="text-xs text-gray-600"
                style={{ fontFamily: 'Poppins-Regular' }}
                numberOfLines={2}
              >
                {holiday.description}
              </Text>
            )}
          </View>
          <View className="flex-row items-center gap-2">
            {isCustom && <Star size={14} color="#3b82f6" fill="#3b82f6" />}
            <View
              className={`px-2 py-1 rounded-full ${
                isCustom ? 'bg-blue-100' : 'bg-green-100'
              }`}
            >
              <Text
                className={`text-xs ${
                  isCustom ? 'text-blue-700' : 'text-green-700'
                }`}
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                {isCustom ? 'Custom' : 'Official'}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              onPress={() => {
                if (navigation) {
                  navigation.goBack();
                } else {
                  console.log('Navigation not available');
                }
              }}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
            <Text
              className="text-gray-900 text-xl font-semibold"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Holidays
            </Text>
            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              activeOpacity={0.7}
            >
              <Bell size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Cards */}
          <View className="px-4 py-4">
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 border border-gray-200 bg-red-50 rounded-xl p-3">
                <Text
                  className="text-lg font-bold text-red-600"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  Total Days
                </Text>
                <Text
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  {stats.totalDays}
                </Text>
              </View>
              <View className="flex-1 border border-gray-200 bg-red-100 rounded-xl p-3">
                <Text
                  className="text-lg font-bold text-red-700"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  Holidays
                </Text>
                <Text
                  className="text-2xl font-bold text-red-600"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  {stats.holidays}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1 border border-gray-200 bg-yellow-50 rounded-xl p-3">
                <Text
                  className="text-lg font-bold text-yellow-600"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  Sundays
                </Text>
                <Text
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  {stats.sundays}
                </Text>
              </View>
              <View className="flex-1 border border-gray-200 bg-green-50 rounded-xl p-3">
                <Text
                  className="text-lg font-bold text-green-600"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  Working
                </Text>
                <Text
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  {stats.workingDays}
                </Text>
              </View>
            </View>
          </View>

          {/* Calendar Header */}
          <Animated.View
            style={calendarAnimatedStyle}
            className="bg-white mx-4 rounded-xl shadow-sm border border-gray-100"
          >
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <TouchableOpacity
                onPress={() => navigateMonth('prev')}
                className="p-2"
              >
                <ChevronLeft size={20} color="#374151" />
              </TouchableOpacity>

              <Text
                className="text-lg font-bold text-gray-900"
                style={{ fontFamily: 'Poppins-Bold' }}
              >
                {monthNames[currentMonth]} {currentYear}
              </Text>

              <TouchableOpacity
                onPress={() => navigateMonth('next')}
                className="p-2"
              >
                <ChevronRight size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Day Headers */}
            <View className="flex-row">
              {dayNames.map((day, index) => (
                <View
                  key={index}
                  className="flex-1 items-center py-3 border-b border-gray-100"
                >
                  <Text
                    className="text-xs font-medium text-gray-600"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View className="pb-4">
              {Array.from({ length: 6 }, (_, weekIndex) => (
                <View key={weekIndex} className="flex-row">
                  {calendarDays
                    .slice(weekIndex * 7, (weekIndex + 1) * 7)
                    .map((dayObj, dayIndex) => {
                      const {
                        date,
                        day,
                        isCurrentMonth,
                        isToday,
                        isSelected,
                        holiday,
                        isSunday,
                      } = dayObj;

                      return (
                        <TouchableOpacity
                          key={dayIndex}
                          onPress={() => {
                            if (isCurrentMonth) {
                              setSelectedDate(isSelected ? null : date);
                            }
                          }}
                          className="flex-1 items-center justify-center py-2 relative"
                          style={{ height: 40 }}
                        >
                          {/* Day number */}
                          <Text
                            className={`text-sm ${
                              !isCurrentMonth
                                ? 'text-gray-300'
                                : isToday
                                ? 'text-blue-600 font-bold'
                                : isSelected
                                ? 'text-white font-bold'
                                : isSunday
                                ? 'text-red-500'
                                : 'text-gray-900'
                            }`}
                            style={{
                              fontFamily:
                                isToday || isSelected
                                  ? 'Poppins-Bold'
                                  : 'Poppins-Medium',
                            }}
                          >
                            {day}
                          </Text>

                          {/* Today indicator */}
                          {isToday && (
                            <View className="absolute inset-0 rounded-lg border-2 border-blue-600" />
                          )}

                          {/* Selected indicator */}
                          {isSelected && (
                            <View className="absolute inset-0 rounded-lg bg-blue-600" />
                          )}

                          {/* Holiday indicators */}
                          {holiday && isCurrentMonth && (
                            <View className="absolute bottom-1 flex-row gap-1">
                              {holiday.isCustom ? (
                                <View className="w-2 h-2 rounded-full bg-blue-500" />
                              ) : (
                                <View className="w-2 h-2 rounded-full bg-red-500" />
                              )}
                            </View>
                          )}

                          {/* Sunday label */}
                          {isSunday && isCurrentMonth && !holiday && (
                            <Text
                              className="absolute bottom-0 text-xs text-red-500"
                              style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: 8,
                              }}
                            >
                              Sunday
                            </Text>
                          )}

                          {/* Holiday name for custom holidays */}
                          {holiday && isCurrentMonth && (
                            <Text
                              className={`absolute bottom-0 text-xs ${
                                holiday.isCustom
                                  ? 'text-blue-600'
                                  : 'text-red-600'
                              }`}
                              style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: 8,
                              }}
                              numberOfLines={1}
                            >
                              {holiday.name.split(' ')[0]}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Holidays List */}
          <View className="px-4 mt-4">
            <Text
              className="text-lg font-bold text-gray-900 mb-3"
              style={{ fontFamily: 'Poppins-Bold' }}
            >
              {selectedDate
                ? `Holidays for ${formatDate(selectedDate.toISOString())}`
                : `Holidays for ${monthNames[currentMonth]} ${currentYear}`}
            </Text>

            {selectedDate ? (
              selectedDateHolidays.length > 0 ? (
                selectedDateHolidays.map((holiday, index) => (
                  <View key={holiday._id}>
                    {renderHolidayCard({ item: holiday, index })}
                  </View>
                ))
              ) : (
                <View className="bg-white rounded-xl p-6 items-center">
                  <Calendar size={32} color="#9ca3af" />
                  <Text
                    className="text-gray-500 mt-2"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    No holidays on this date
                  </Text>
                </View>
              )
            ) : (
              <>
                {/* Custom Holidays Section */}
                {currentMonthHolidays.filter(h => h.isCustom).length > 0 && (
                  <View className="mb-4">
                    <Text
                      className="text-base font-semibold text-gray-800 mb-2"
                      style={{ fontFamily: 'Poppins-SemiBold' }}
                    >
                      Custom Holidays
                    </Text>
                    {currentMonthHolidays
                      .filter(h => h.isCustom)
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime(),
                      )
                      .map((holiday, index) => (
                        <View key={holiday._id}>
                          {renderHolidayCard({ item: holiday, index })}
                        </View>
                      ))}
                  </View>
                )}

                {/* Official Holidays Section */}
                {currentMonthHolidays.filter(h => !h.isCustom).length > 0 && (
                  <View className="mb-4">
                    <Text
                      className="text-base font-semibold text-gray-800 mb-2"
                      style={{ fontFamily: 'Poppins-SemiBold' }}
                    >
                      Official Holidays
                    </Text>
                    {currentMonthHolidays
                      .filter(h => !h.isCustom)
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime(),
                      )
                      .map((holiday, index) => (
                        <View key={holiday._id}>
                          {renderHolidayCard({ item: holiday, index })}
                        </View>
                      ))}
                  </View>
                )}

                {/* Empty state */}
                {currentMonthHolidays.length === 0 && (
                  <Animated.View
                    entering={FadeInUp.delay(300).springify()}
                    className="bg-white rounded-xl p-8 items-center"
                  >
                    <Calendar size={48} color="#9ca3af" />
                    <Text
                      className="text-lg font-medium text-gray-700 mt-3 mb-1"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      No holidays this month
                    </Text>
                    <Text
                      className="text-gray-500 text-center"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      There are no holidays scheduled for{' '}
                      {monthNames[currentMonth]} {currentYear}
                    </Text>
                  </Animated.View>
                )}
              </>
            )}
          </View>
        </ScrollView>

        {/* Bottom Navigation (matching your design) */}
        <View className="bg-white border-t border-gray-200 px-4 py-2">
          <View className="flex-row items-center justify-around">
            <TouchableOpacity className="items-center py-2">
              <Home size={24} color="#3b82f6" />
              <Text
                className="text-xs text-blue-600 mt-1"
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center py-2">
              <Clock size={24} color="#9ca3af" />
              <Text
                className="text-xs text-gray-500 mt-1"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                Projects
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center py-2">
              <Calendar size={24} color="#9ca3af" />
              <Text
                className="text-xs text-gray-500 mt-1"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                Leave
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center py-2">
              <User size={24} color="#9ca3af" />
              <Text
                className="text-xs text-gray-500 mt-1"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center py-2">
              <Menu size={24} color="#9ca3af" />
              <Text
                className="text-xs text-gray-500 mt-1"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                Menu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Holidays;
