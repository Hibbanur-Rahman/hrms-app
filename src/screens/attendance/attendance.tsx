import Feather from 'react-native-vector-icons/Feather';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Calendar,
  Clock,
  MapPin,
  Timer,
  TrendingUp,
  Watch,
} from 'lucide-react-native';
import AttendanceService from '../../services/AttendanceService';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import tw from 'twrnc';
import {
  calculateDurationInMinutes,
  formatDate,
  formatDateTime,
  formatDuration,
  formatTime,
} from '../../utils/dateTimeFormater';
import {
  AttendanceRecord,
  AttendanceCountData,
  AttendanceListResponse,
  AttendanceCountResponse,
} from '../../types/attendance';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Attendance = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useSelector((state: any) => state.auth);
  const filterScale = useSharedValue(0);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [attendanceCountData, setAttendanceCountData] =
    useState<AttendanceCountData | null>(null);

  //months
  const months = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ];
  //years
  const years = [
    { label: '2022', value: '2022' },
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
  ];

  const [selectedMonth, setSelectedMonth] = useState<any>(
    months[new Date().getMonth()] || null,
  );
  const [selectedYear, setSelectedYear] = useState<any>(
    years.find(year => year.value === new Date().getFullYear().toString()) ||
      null,
  );

  const handleGetAttendanceList = async (
    pageNumber = 1,
    isLoadMore = false,
  ) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const payload = {
        employeeId: user?._id,
        month: selectedMonth?.value || new Date().getMonth() + 1,
        year: selectedYear?.value || new Date().getFullYear(),
        page: pageNumber,
        limit: 10,
      };

      const response = await AttendanceService.GetAttendanceList(payload);
      console.log(response);

      if (response?.status === 200 && response?.data?.success) {
        const responseData: AttendanceListResponse = response.data;
        const newAttendanceList = responseData.data || [];

        if (isLoadMore) {
          // Append new data for pagination
          setAttendanceList(prev => [...prev, ...newAttendanceList]);
        } else {
          // Replace data for initial load or filter change
          setAttendanceList(newAttendanceList);
        }

        const pagination = responseData.pagination;
        setTotalPages(pagination?.totalPages || 1);
        setPage(pagination?.currentPage || 1);
        setLimit(pagination?.limit || 10);
        setHasNextPage(pagination?.hasNextPage || false);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreAttendance = () => {
    if (hasNextPage && !loadingMore) {
      const nextPage = page + 1;
      handleGetAttendanceList(nextPage, true);
    }
  };

  const handleFetchAttendanceCount = async () => {
    try {
      const response = await AttendanceService.AttendanceCount(
        user?._id,
        selectedMonth?.value || new Date().getMonth() + 1,
        selectedYear?.value || new Date().getFullYear(),
      );
      if (response.status === 200) {
        console.log('attendance count', response.data);
        const countData: AttendanceCountData = response.data?.data;
        setAttendanceCountData(countData);
      }
    } catch (error) {
      console.log('error while fetch attendance count', error);
      Alert.alert(
        'Error',
        'Failed to fetch attendance count. Please try again later.',
      );
    }
  };
  useFocusEffect(
    useCallback(() => {
      // Reset pagination when filters change
      setPage(1);
      setAttendanceList([]);
      handleGetAttendanceList(1, false);
      handleFetchAttendanceCount();
    }, [selectedMonth, selectedYear]),
  );

  //animated styles
  const filterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: filterScale.value }],
  }));
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center px-4 py-3">
        {/**header */}
        <View className="bg-white border-b border-gray-100 w-full pb-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="flex-row items-center gap-2 bg-gray-100 rounded-full p-2"
              onPress={() => navigation.goBack()}
              style={{ backgroundColor: '#f3f4f6' }}
            >
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
            <Text
              className="text-gray-900 text-xl font-semibold"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Attendance
            </Text>
            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              onPress={() => navigation.navigate('Notification')}
            >
              <Bell size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={attendanceList}
          keyExtractor={(item, index) => item?.id || index.toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreAttendance}
          onEndReachedThreshold={0.5}
          className="w-full"
          ListHeaderComponent={() => (
            <View className="w-full">
              {/**stats section */}
              <View className="w-full flex flex-col mt-4 gap-y-3">
                <View className="w-full flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-2 py-4">
                  <View className="bg-blue-100 rounded-[50%] p-2 overflow-hidden">
                    <Clock size={24} color="#155dfc" />
                  </View>
                  <View>
                    <Text
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Attendance Count
                    </Text>
                    <Text
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      {attendanceCountData?.attendance?.attendanceCount || 0}
                    </Text>
                  </View>
                </View>
                <View className="w-full flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-2 py-4">
                  <View className="bg-green-100 rounded-[50%] p-2 overflow-hidden">
                    <TrendingUp size={24} color="#16a34a" />
                  </View>
                  <View>
                    <Text
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Average Hours
                    </Text>
                    <Text
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      {attendanceCountData?.attendance?.averageWorkingHours
                        ?.formatted || '0h 0m'}
                    </Text>
                  </View>
                </View>
                <View className="w-full flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-2 py-4">
                  <View className="bg-purple-100 rounded-[50%] p-2 overflow-hidden">
                    <BarChart3 size={24} color="#9810fa" />
                  </View>
                  <View>
                    <Text
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Total Working Hours
                    </Text>
                    <Text
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      {attendanceCountData?.attendance?.totalWorkingHours
                        ?.formatted || '0h 0m'}
                    </Text>
                  </View>
                </View>
                <View className="w-full flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-2 py-4">
                  <View className="bg-orange-100 rounded-[50%] p-2 overflow-hidden">
                    <Timer size={24} color="#f59e0b" />
                  </View>
                  <View>
                    <Text
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Total Leave Requests
                    </Text>
                    <Text
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      {attendanceCountData?.leave?.totalLeaveRequests || 0}
                    </Text>
                  </View>
                </View>
              </View>

              {/**attendance list section */}
              <View className="w-full flex flex-col mt-4 gap-y-3">
                <Text
                  className="text-gray-700 text-lg"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  Attendance List
                </Text>
                {/* Filters */}
                <Animated.View
                  className="mt-2 mb-2"
                  style={filterAnimatedStyle}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="flex-1">
                      <Dropdown
                        style={tw`w-full h-12 px-4 bg-white border border-gray-200 rounded-xl`}
                        placeholderStyle={[
                          tw`text-gray-500 text-sm`,
                          { fontFamily: 'Poppins-Regular' },
                        ]}
                        containerStyle={tw`rounded-xl bg-white border border-gray-200 overflow-hidden`}
                        selectedTextStyle={[
                          tw`text-gray-900 text-sm`,
                          { fontFamily: 'Poppins-Medium' },
                        ]}
                        data={months}
                        maxHeight={300}
                        renderLeftIcon={() => (
                          <Calendar
                            size={18}
                            color="#6b7280"
                            style={{ marginRight: 8 }}
                          />
                        )}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Month"
                        value={selectedMonth}
                        onChange={item => setSelectedMonth(item)}
                        renderItem={item => (
                          <View className="px-4 py-3 border-b border-gray-100">
                            <Text
                              className="text-gray-700 text-sm"
                              style={{ fontFamily: 'Poppins-Regular' }}
                            >
                              {item?.label}
                            </Text>
                          </View>
                        )}
                      />
                    </View>
                    <View className="flex-1">
                      <Dropdown
                        style={tw`w-full h-12 px-4 bg-white border border-gray-200 rounded-xl`}
                        placeholderStyle={[
                          tw`text-gray-500 text-sm`,
                          { fontFamily: 'Poppins-Regular' },
                        ]}
                        containerStyle={tw`rounded-xl bg-white border border-gray-200 overflow-hidden`}
                        selectedTextStyle={[
                          tw`text-gray-900 text-sm`,
                          { fontFamily: 'Poppins-Medium' },
                        ]}
                        data={years}
                        maxHeight={300}
                        renderLeftIcon={() => (
                          <Calendar
                            size={18}
                            color="#6b7280"
                            style={{ marginRight: 8 }}
                          />
                        )}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Year"
                        value={selectedYear}
                        onChange={item => setSelectedYear(item)}
                        renderItem={item => (
                          <View className="px-4 py-3 border-b border-gray-100">
                            <Text
                              className="text-gray-700 text-sm"
                              style={{ fontFamily: 'Poppins-Regular' }}
                            >
                              {item?.label}
                            </Text>
                          </View>
                        )}
                      />
                    </View>
                  </View>
                </Animated.View>

                {loading && attendanceList.length === 0 && (
                  <View className="w-full flex flex-col items-center justify-center py-8">
                    <ActivityIndicator size="large" color="#155dfc" />
                    <Text
                      className="text-gray-700 text-sm mt-2"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      Loading attendance records...
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={() =>
            !loading ? (
              <View className="items-center mt-4">
                <Calendar size={48} color="#d1d5db" />
                <Text
                  className="text-gray-500 text-base mt-3"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  No attendance records found
                </Text>
                <Text
                  className="text-gray-400 text-sm mt-1 text-center"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  Try adjusting your filters or check back later
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={() =>
            loadingMore ? (
              <View className="w-full flex flex-col items-center justify-center py-4">
                <ActivityIndicator size="small" color="#155dfc" />
                <Text
                  className="text-gray-700 text-xs mt-1"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  Loading more...
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item, index }) => (
            <View
              key={index}
              className="relative w-full flex flex-col items-start border border-gray-200 rounded-2xl gap-y-3 p-4 mb-3"
            >
              {item?.checkOut?.isAutoCheckOut && (
                <View className="right-2 top-4 flex-row items-center gap-2 absolute border border-blue-400 rounded-lg p-2 bg-blue-100">
                  <Text
                    className="text-blue-700 text-xs"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Auto Checkout
                  </Text>
                </View>
              )}
              <View className="flex-row items-center gap-2">
                <Calendar size={24} color="gray" />
                <Text
                  className="text-gray-700"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  {formatDate(
                    item?.dailyCheckIn?.date || '2025-07-03T00:00:00.000Z',
                  )}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Clock size={24} color="green" />
                <Text
                  className="text-gray-700"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  Check In:{' '}
                  {formatTime(
                    item?.checkIn?.time || '2025-07-03T05:25:53.549Z',
                  )}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <MapPin size={24} color="gray" />
                <Text
                  className="text-gray-700 flex-1"
                  style={{ fontFamily: 'Poppins-Medium' }}
                  numberOfLines={2}
                >
                  {item?.checkIn?.location?.address}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Timer size={24} color="red" />
                <Text
                  className="text-gray-700"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  Check Out:{' '}
                  {item?.checkOut?.isAutoCheckOut
                    ? 'Auto Checkout'
                    : formatTime(
                        item?.checkOut?.time || '2025-07-03T05:25:53.549Z',
                      )}
                </Text>
              </View>
              {!item?.checkOut?.isAutoCheckOut &&
                item?.checkOut?.location?.address !== 'Auto Checkout' && (
                  <View className="flex-row items-center gap-2">
                    <MapPin size={24} color="gray" />
                    <Text
                      className="text-gray-700 flex-1"
                      style={{ fontFamily: 'Poppins-Medium' }}
                      numberOfLines={2}
                    >
                      {item?.checkOut?.location?.address}
                    </Text>
                  </View>
                )}
              <View className="w-full h-[1px] bg-gray-200 my-3"></View>
              <View className="flex-row items-center gap-2">
                <Watch size={24} color="gray" />
                <Text
                  className="text-gray-700"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  Total Working Hours:{' '}
                  {item?.duration ? formatDuration(item.duration) : '0h 0m'}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};
export default Attendance;
