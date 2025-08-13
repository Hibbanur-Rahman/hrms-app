import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import {
  ArrowLeft,
  Download,
  DollarSign,
  Calendar,
  FileText,
  Eye,
  Share,
  Filter,
  IndianRupee,
} from 'lucide-react-native';
import { useSelector } from 'react-redux';
import SalarySlipService from '../../services/SalarySlipService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SalarySlipData {
  _id: string;
  month: string;
  year: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  downloadUrl: string;
  viewUrl: string;
  paymentStatus: string;
}

interface SalarySlipsResponse {
  employeeId: string;
  year: string;
  totalSlips: number;
  totalEarnings: number;
  slips: SalarySlipData[];
}

interface SalarySlipProps {
  slip: SalarySlipData;
  onDownload: (id: string) => void;
  onView: (id: string) => void;
  onShare: (id: string) => void;
}

const SalarySlipCard: React.FC<SalarySlipProps> = ({
  slip,
  onDownload,
  onView,
  onShare,
}) => {
  const grossSalary =
    slip.basicSalary + slip.hra + slip.allowances + slip.bonus;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'payment done':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'processing':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'payment done':
        return '#ECFDF5';
      case 'pending':
        return '#FFFBEB';
      case 'processing':
        return '#EFF6FF';
      default:
        return '#F9FAFB';
    }
  };

  const formatDate = (month: string, year: number) => {
    const monthNames = {
      January: 'Jan',
      February: 'Feb',
      March: 'Mar',
      April: 'Apr',
      May: 'May',
      June: 'Jun',
      July: 'Jul',
      August: 'Aug',
      September: 'Sep',
      October: 'Oct',
      November: 'Nov',
      December: 'Dec',
    };
    return `${monthNames[month as keyof typeof monthNames]} ${year}`;
  };

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-xl bg-[#7563F7]/10 items-center justify-center mr-3">
            <FileText size={20} color="#7563F7" />
          </View>
          <View>
            <Text
              className="text-gray-900 text-base font-semibold"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              {slip.month} {slip.year}
            </Text>
            <Text
              className="text-gray-500 text-sm"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              {formatDate(slip.month, slip.year)}
            </Text>
          </View>
        </View>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: getStatusBgColor(slip.paymentStatus) }}
        >
          <Text
            className="text-xs font-medium"
            style={{
              fontFamily: 'Poppins-Medium',
              color: getStatusColor(slip.paymentStatus),
            }}
          >
            {slip.paymentStatus}
          </Text>
        </View>
      </View>

      {/* Salary Details */}
      <View className="bg-gray-50 rounded-xl p-3 mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text
            className="text-gray-600 text-sm"
            style={{ fontFamily: 'Poppins-Regular' }}
          >
            Basic Salary
          </Text>
          <Text
            className="text-gray-900 text-sm font-medium"
            style={{ fontFamily: 'Poppins-Medium' }}
          >
            ₹{slip.basicSalary.toLocaleString()}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mb-2">
          <Text
            className="text-gray-600 text-sm"
            style={{ fontFamily: 'Poppins-Regular' }}
          >
            HRA + Allowances + Bonus
          </Text>
          <Text
            className="text-green-600 text-sm font-medium"
            style={{ fontFamily: 'Poppins-Medium' }}
          >
            +₹{(slip.hra + slip.allowances + slip.bonus).toLocaleString()}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mb-2">
          <Text
            className="text-gray-600 text-sm"
            style={{ fontFamily: 'Poppins-Regular' }}
          >
            Deductions
          </Text>
          <Text
            className="text-red-600 text-sm font-medium"
            style={{ fontFamily: 'Poppins-Medium' }}
          >
            -₹{slip.deductions.toLocaleString()}
          </Text>
        </View>
        <View className="border-t border-gray-200 pt-2 mt-2">
          <View className="flex-row justify-between items-center">
            <Text
              className="text-gray-900 text-base font-semibold"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Net Salary
            </Text>
            <Text
              className="text-[#7563F7] text-lg font-bold"
              style={{ fontFamily: 'Poppins-Bold' }}
            >
              ₹{slip.netSalary.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row space-x-3">
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center bg-[#7563F7] rounded-xl p-3"
          activeOpacity={0.8}
          onPress={() => onDownload(slip._id)}
        >
          <Download size={16} color="white" />
          <Text
            className="text-white text-sm font-medium ml-2"
            style={{ fontFamily: 'Poppins-Medium' }}
          >
            Download
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center bg-gray-100 rounded-xl p-3"
          activeOpacity={0.7}
          onPress={() => onView(slip._id)}
        >
          <Eye size={16} color="#6B7280" />
          <Text
            className="text-gray-700 text-sm font-medium ml-2"
            style={{ fontFamily: 'Poppins-Medium' }}
          >
            View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-gray-100 rounded-xl p-3"
          activeOpacity={0.7}
          onPress={() => onShare(slip._id)}
        >
          <Share size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SalarySlips = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [salarySlipsData, setSalarySlipsData] =
    useState<SalarySlipsResponse | null>(null);
  const [loading, setLoading] = useState(false);
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

  // Safely get navigation with fallback
  let navigation: any = null;
  try {
    navigation = useNavigation<NavigationProp>();
  } catch (error) {
    console.log('Navigation context not available:', error);
  }

  // Safely get user with fallback
  let user: any = null;
  try {
    const authState = useSelector((state: any) => state.auth);
    user = authState?.user;
  } catch (error) {
    console.log('Redux context not available:', error);
  }

  const years = ['2025', '2024', '2023', '2022'];

  console.log(new Date().getMonth());
  // Get current month salary (most recent slip)
  const currentMonthSalary =
    salarySlipsData?.slips?.find(
      item => item?.month === months[new Date().getMonth()]?.label,
    ) ||
    salarySlipsData?.slips?.[0] ||
    null;
  //handle get salary slips list
  const handleGetSalarySlipsList = async () => {
    try {
      if (!user?._id) {
        console.log('User ID not available');
        return;
      }

      setLoading(true);
      const response = await SalarySlipService.GetAllSalarySlip(
        user._id,
        selectedYear,
      );
      console.log('salary slips list', response);
      if (response?.status === 200) {
        setSalarySlipsData(response?.data?.data);
      }
    } catch (error) {
      console.log('error', error);
      Alert.alert('Error', 'Failed to fetch salary slips');
    } finally {
      setLoading(false);
    }
  };

  // Handle download
  const handleDownload = async (id: string) => {
    try {
      Alert.alert(
        'Download Started',
        'Your salary slip is being downloaded...',
      );
      // Add your download logic here using the same logic from home.tsx
      console.log('Downloading slip with ID:', id);
    } catch (error) {
      Alert.alert('Error', 'Failed to download salary slip');
    }
  };

  // Handle view
  const handleView = async (id: string) => {
    try {
      console.log('Viewing slip with ID:', id);
      // Add your view logic here using the same logic from home.tsx
    } catch (error) {
      Alert.alert('Error', 'Failed to view salary slip');
    }
  };

  // Handle share
  const handleShare = async (id: string) => {
    try {
      console.log('Sharing slip with ID:', id);
      // Add your share logic here
    } catch (error) {
      Alert.alert('Error', 'Failed to share salary slip');
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user?._id) {
        handleGetSalarySlipsList();
      }
    }, [selectedYear, user]),
  );

  // Show loading state
  if (loading && !salarySlipsData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#7563F7" />
          <Text
            className="mt-4 text-gray-600"
            style={{ fontFamily: 'Poppins-Regular' }}
          >
            Loading salary slips...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if no user
  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text
            className="text-gray-600"
            style={{ fontFamily: 'Poppins-Regular' }}
          >
            User information not available
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
              Salary Slips
            </Text>
            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              activeOpacity={0.7}
            >
              <Filter size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Current Month Summary */}
          {currentMonthSalary ? (
            <LinearGradient
              colors={['#7563F7', '#9333EA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="mx-4 mt-4 rounded-3xl p-6 "
              style={{
                borderRadius: 24,
              }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text
                    className="text-white text-sm opacity-90"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Current Month
                  </Text>
                  <Text
                    className="text-white text-xl font-bold"
                    style={{ fontFamily: 'Poppins-Bold' }}
                  >
                    {currentMonthSalary.month} {currentMonthSalary.year}
                  </Text>
                </View>
                <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
                  <IndianRupee size={28} color="white" />
                </View>
              </View>

              <View className="bg-white/20 rounded-2xl p-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text
                    className="text-white/80 text-sm"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Net Salary
                  </Text>
                  <Text
                    className="text-white text-2xl font-bold"
                    style={{ fontFamily: 'Poppins-Bold' }}
                  >
                    ₹{currentMonthSalary.netSalary.toLocaleString()}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text
                    className="text-white/60 text-xs"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Basic: ₹{currentMonthSalary.basicSalary.toLocaleString()}
                  </Text>
                  <Text
                    className="text-white/60 text-xs"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Deductions: ₹
                    {currentMonthSalary.deductions.toLocaleString()}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          ) : (
            <View className="mx-4 mt-4 bg-gray-200 rounded-3xl p-6">
              <Text className="text-gray-500 text-center">
                No salary slips available
              </Text>
            </View>
          )}

          {/* Year Filter */}
          <View className="px-4 mt-6">
            <Text
              className="text-gray-900 text-lg font-semibold mb-3"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Select Year
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {years.map(year => (
                <TouchableOpacity
                  key={year}
                  onPress={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-full mr-3 ${
                    selectedYear === year ? 'bg-[#7563F7]' : 'bg-gray-100'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedYear === year ? 'text-white' : 'text-gray-600'
                    }`}
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Salary Slips List */}
          <View className="px-4">
            <Text
              className="text-gray-900 text-lg font-semibold mb-4"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              All Salary Slips ({selectedYear})
            </Text>
            {salarySlipsData?.slips
              ?.filter(
                (slip: SalarySlipData) => slip.year.toString() === selectedYear,
              )
              ?.map((slip: SalarySlipData, index: number) => (
                <SalarySlipCard
                  key={slip._id}
                  slip={slip}
                  onDownload={handleDownload}
                  onView={handleView}
                  onShare={handleShare}
                />
              )) || (
              <View className="bg-white rounded-2xl p-6 text-center">
                <Text className="text-gray-500 text-center">
                  No salary slips found for {selectedYear}
                </Text>
              </View>
            )}
          </View>

          {/* Summary Stats */}
          <View className="px-4 mt-6">
            <Text
              className="text-gray-900 text-lg font-semibold mb-4"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Year Summary ({selectedYear})
            </Text>
            {salarySlipsData?.slips && salarySlipsData.slips.length > 0 ? (
              <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
                <View className="flex-row justify-between items-center mb-3">
                  <Text
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Total Basic Salary
                  </Text>
                  <Text
                    className="text-gray-900 text-base font-semibold"
                    style={{ fontFamily: 'Poppins-SemiBold' }}
                  >
                    ₹
                    {salarySlipsData.slips
                      .filter(slip => slip.year.toString() === selectedYear)
                      .reduce((sum, slip) => sum + slip.basicSalary, 0)
                      .toLocaleString()}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center mb-3">
                  <Text
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Total Deductions
                  </Text>
                  <Text
                    className="text-red-600 text-base font-semibold"
                    style={{ fontFamily: 'Poppins-SemiBold' }}
                  >
                    ₹
                    {salarySlipsData.slips
                      .filter(slip => slip.year.toString() === selectedYear)
                      .reduce((sum, slip) => sum + slip.deductions, 0)
                      .toLocaleString()}
                  </Text>
                </View>
                <View className="border-t border-gray-200 pt-3">
                  <View className="flex-row justify-between items-center">
                    <Text
                      className="text-gray-900 text-base font-bold"
                      style={{ fontFamily: 'Poppins-Bold' }}
                    >
                      Total Net Salary
                    </Text>
                    <Text
                      className="text-[#7563F7] text-xl font-bold"
                      style={{ fontFamily: 'Poppins-Bold' }}
                    >
                      ₹
                      {salarySlipsData.slips
                        .filter(slip => slip.year.toString() === selectedYear)
                        .reduce((sum, slip) => sum + slip.netSalary, 0)
                        .toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View className="bg-white rounded-2xl p-6 text-center">
                <Text className="text-gray-500 text-center">
                  No data available for summary
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SalarySlips;
