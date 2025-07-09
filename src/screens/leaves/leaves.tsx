import { ArrowLeft, Bell, Calendar, Search, Filter, Clock, User, Mail, Phone, Calendar as CalendarIcon, CheckCircle, XCircle, Clock as ClockIcon, File } from 'lucide-react-native';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
  Dimensions,
  Linking,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import LeaveService from '../../services/LeaveService';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import tw from 'twrnc';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  FadeInUp,
  FadeInDown,
  SlideInRight,
  Layout,
} from 'react-native-reanimated';
import { format, parseISO } from 'date-fns';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const Leaves = () => {
  const navigation = useNavigation<NavigationProp>();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useSelector((state: any) => state.auth);
  const [selectedMonth, setSelectedMonth] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<any>(null);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const filterScale = useSharedValue(0.8);
  const searchOpacity = useSharedValue(0);

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

  const years = [
    { label: '2022', value: '2022' },
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
  ];

  //handle get leaves
  const handleGetLeaves = async () => {
    try {
      setLoading(true);
      const response = await LeaveService.GetLeaves({
        employeeId: user?.employeeId,
        month: selectedMonth?.value || '07',
        year: selectedYear?.value || '2025',
        page: currentPage,
        limit: 10,
      });
      console.log(response);
      if (response.status === 200) {
        setLeaves(response.data.data);
        setTotalPages(response.data.pagination.pages);
        setCurrentPage(response.data.pagination.currentPage);
      }
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleGetLeaves();
    setRefreshing(false);
  }, [selectedMonth, selectedYear]);

  useFocusEffect(
    useCallback(() => {
      // Animate header on focus
      headerOpacity.value = withSpring(1, { damping: 15, stiffness: 100 });
      filterScale.value = withSpring(1, { damping: 15, stiffness: 100 });
      searchOpacity.value = withTiming(1, { duration: 800 });
      
      handleGetLeaves();
    }, [selectedMonth, selectedYear]),
  );

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [20, 0]) }],
  }));

  const filterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: filterScale.value }],
  }));

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
    transform: [{ translateX: interpolate(searchOpacity.value, [0, 1], [50, 0]) }],
  }));

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return { bg: '#dcfce7', text: '#166534', icon: '#16a34a' };
      case 'rejected':
        return { bg: '#fef2f2', text: '#dc2626', icon: '#ef4444' };
      case 'pending':
        return { bg: '#fef3c7', text: '#d97706', icon: '#f59e0b' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280', icon: '#9ca3af' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle size={16} color={getStatusColor(status).icon} />;
      case 'rejected':
        return <XCircle size={16} color={getStatusColor(status).icon} />;
      case 'pending':
        return <ClockIcon size={16} color={getStatusColor(status).icon} />;
      default:
        return <ClockIcon size={16} color={getStatusColor(status).icon} />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const LeaveCard = ({ leave, index }: { 
    leave: {
      applyDate: string;
      approvedDate: string;
      approverName: string;
      createdAt: string;
      email: string;
      employeeId: string;
      fileUrl: string;
      fromDate: string;
      leaveDays: number;
      mobile: string;
      name: string;
      reason: string;
      rejectedDate: string | null;
      rejectedDates: string[] | null;
      selectedDates: string[] | null;
      status: string;
      toDate: string;
      _id: string;
    };
    index: number;
  }) => {
    const statusColors = getStatusColor(leave.status);
    
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100).springify()}
        layout={Layout.springify()}
        className="w-full bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Header with status */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins-SemiBold' }}>
              {leave.name}
            </Text>
            <View className="flex-row items-center gap-2">
              <User size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600" style={{ fontFamily: 'Poppins-Regular' }}>
                {leave.employeeId}
              </Text>
            </View>
          </View>
          <View 
            className="px-3 py-1 rounded-full flex-row items-center gap-1"
            style={{ backgroundColor: statusColors.bg }}
          >
            {getStatusIcon(leave.status)}
            <Text 
              className="text-xs font-medium"
              style={{ color: statusColors.text, fontFamily: 'Poppins-Medium' }}
            >
              {leave.status}
            </Text>
          </View>
        </View>

        {/* Contact Info */}
        <View className="flex-row items-center gap-4 mb-3">
          <View className="flex-row items-center gap-2">
            <Mail size={14} color="#6b7280" />
            <Text className="text-sm text-gray-600" style={{ fontFamily: 'Poppins-Regular' }}>
              {leave.email}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Phone size={14} color="#6b7280" />
            <Text className="text-sm text-gray-600" style={{ fontFamily: 'Poppins-Regular' }}>
              {leave.mobile}
            </Text>
          </View>
        </View>

        {/* Date Range */}
        <View className="bg-gray-50 rounded-xl p-3 mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <CalendarIcon size={16} color="#3b82f6" />
              <Text className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Poppins-Medium' }}>
                From: {formatDate(leave.fromDate)}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <CalendarIcon size={16} color="#3b82f6" />
              <Text className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Poppins-Medium' }}>
                To: {formatDate(leave.toDate)}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2 mt-2">
            <Clock size={14} color="#6b7280" />
            <Text className="text-sm text-gray-600" style={{ fontFamily: 'Poppins-Regular' }}>
              {leave.leaveDays} day(s)
            </Text>
          </View>
        </View>

        {/**file */}
        {leave.fileUrl && (
          <View className="mb-3">
            <Text className="text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Poppins-Medium' }}>
              File:
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL(leave.fileUrl)} className='flex-row items-center gap-2'>
              <File size={16} color="#3b82f6" />
              <Text className="text-sm text-blue-600" style={{ fontFamily: 'Poppins-Medium' }}>
                View File
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Reason */}
        {leave.reason && (
          <View className="mb-3">
            <Text className="text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Poppins-Medium' }}>
              Reason:
            </Text>
            <Text className="text-sm text-gray-600 leading-5" style={{ fontFamily: 'Poppins-Regular' }}>
              {leave.reason}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
          <Text className="text-xs text-gray-500" style={{ fontFamily: 'Poppins-Regular' }}>
            Applied: {formatDate(leave.applyDate)}
          </Text>
          {leave.approverName && (
            <Text className="text-xs text-gray-500" style={{ fontFamily: 'Poppins-Regular' }}>
              Approved by: {leave.approverName}
            </Text>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.View 
        className="flex-1"
        style={headerAnimatedStyle}
      >
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-100">
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
              Leave Applications
            </Text>
            <TouchableOpacity className="bg-gray-100 rounded-full p-2">
              <Bell size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          className="flex-1 px-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          

          {/* Filters */}
          <Animated.View 
            className="mt-4"
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
                    <Calendar size={18} color="#6b7280" style={{ marginRight: 8 }} />
                  )}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Month"
                  value={selectedMonth}
                  onChange={item => setSelectedMonth(item)}
                  renderItem={item => (
                    <View className="px-4 py-3 border-b border-gray-100">
                      <Text className="text-gray-700 text-sm" style={{ fontFamily: 'Poppins-Regular' }}>
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
                    <Calendar size={18} color="#6b7280" style={{ marginRight: 8 }} />
                  )}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Year"
                  value={selectedYear}
                  onChange={item => setSelectedYear(item)}
                  renderItem={item => (
                    <View className="px-4 py-3 border-b border-gray-100">
                      <Text className="text-gray-700 text-sm" style={{ fontFamily: 'Poppins-Regular' }}>
                        {item?.label}
                      </Text>
                    </View>
                  )}
                />
              </View>
            </View>
          </Animated.View>

          

          {/* Leaves List */}
          <View className="mt-6 pb-6">
            {loading && (
              <Animated.View 
                entering={FadeInUp.springify()}
                className="w-full items-center py-8"
              >
                <Text className="text-gray-500 text-sm" style={{ fontFamily: 'Poppins-Regular' }}>
                  Loading leaves...
                </Text>
              </Animated.View>
            )}

            {!loading && Array.isArray(leaves) && leaves.length > 0 && (
              <Animated.View entering={FadeInUp.delay(300).springify()}>
                {leaves.map((leave, index) => (
                  <LeaveCard key={leave._id} leave={leave} index={index} />
                ))}
              </Animated.View>
            )}

            {!loading && Array.isArray(leaves) && leaves.length === 0 && (
              <Animated.View 
                entering={FadeInUp.delay(300).springify()}
                className="w-full items-center py-12"
              >
                <View className="items-center">
                  <Calendar size={48} color="#d1d5db" />
                  <Text className="text-gray-500 text-base mt-3" style={{ fontFamily: 'Poppins-Medium' }}>
                    No leaves found
                  </Text>
                  <Text className="text-gray-400 text-sm mt-1 text-center" style={{ fontFamily: 'Poppins-Regular' }}>
                    Try adjusting your filters or check back later
                  </Text>
                </View>
              </Animated.View>
            )}

            {error && (
              <Animated.View 
                entering={FadeInUp.springify()}
                className="w-full items-center py-8"
              >
                <Text className="text-red-500 text-sm" style={{ fontFamily: 'Poppins-Regular' }}>
                  {error}
                </Text>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Leaves;
