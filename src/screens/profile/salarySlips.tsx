import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  Filter
} from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SalarySlipProps {
  month: string;
  year: string;
  grossSalary: number;
  netSalary: number;
  deductions: number;
  status: 'paid' | 'pending' | 'processing';
  date: string;
}

const SalarySlipCard: React.FC<SalarySlipProps> = ({ 
  month, 
  year, 
  grossSalary, 
  netSalary, 
  deductions, 
  status,
  date
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'processing': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'paid': return '#ECFDF5';
      case 'pending': return '#FFFBEB';
      case 'processing': return '#EFF6FF';
      default: return '#F9FAFB';
    }
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
              {month} {year}
            </Text>
            <Text 
              className="text-gray-500 text-sm"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              Paid on {date}
            </Text>
          </View>
        </View>
        <View 
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: getStatusBgColor(status) }}
        >
          <Text 
            className="text-xs font-medium capitalize"
            style={{ 
              fontFamily: 'Poppins-Medium',
              color: getStatusColor(status)
            }}
          >
            {status}
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
            Gross Salary
          </Text>
          <Text 
            className="text-gray-900 text-sm font-medium"
            style={{ fontFamily: 'Poppins-Medium' }}
          >
            ${grossSalary.toLocaleString()}
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
            -${deductions.toLocaleString()}
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
              ${netSalary.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row space-x-3">
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center bg-[#7563F7] rounded-xl p-3"
          activeOpacity={0.8}
          onPress={() => Alert.alert('Download', 'Downloading salary slip...')}
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
          onPress={() => Alert.alert('View', 'Opening salary slip...')}
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
          onPress={() => Alert.alert('Share', 'Sharing salary slip...')}
        >
          <Share size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SalarySlips = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedYear, setSelectedYear] = useState('2024');

  const salarySlips = [
    {
      month: 'November',
      year: '2024',
      grossSalary: 5000,
      netSalary: 4200,
      deductions: 800,
      status: 'paid' as const,
      date: 'Nov 30, 2024',
    },
    {
      month: 'October',
      year: '2024',
      grossSalary: 5000,
      netSalary: 4200,
      deductions: 800,
      status: 'paid' as const,
      date: 'Oct 31, 2024',
    },
    {
      month: 'September',
      year: '2024',
      grossSalary: 5000,
      netSalary: 4200,
      deductions: 800,
      status: 'paid' as const,
      date: 'Sep 30, 2024',
    },
    {
      month: 'August',
      year: '2024',
      grossSalary: 5000,
      netSalary: 4200,
      deductions: 800,
      status: 'processing' as const,
      date: 'Aug 31, 2024',
    },
  ];

  const years = ['2024', '2023', '2022'];

  const currentMonthSalary = salarySlips[0];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              onPress={() => navigation.goBack()}
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
          <View className="bg-gradient-to-br from-[#7563F7] to-[#9333EA] mx-4 mt-4 rounded-3xl p-6">
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
                <DollarSign size={28} color="white" />
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
                  ${currentMonthSalary.netSalary.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text 
                  className="text-white/60 text-xs"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  Gross: ${currentMonthSalary.grossSalary.toLocaleString()}
                </Text>
                <Text 
                  className="text-white/60 text-xs"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  Deductions: ${currentMonthSalary.deductions.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

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
              {years.map((year) => (
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
            {salarySlips
              .filter(slip => slip.year === selectedYear)
              .map((slip, index) => (
                <SalarySlipCard key={index} {...slip} />
              ))}
          </View>

          {/* Summary Stats */}
          <View className="px-4 mt-6">
            <Text
              className="text-gray-900 text-lg font-semibold mb-4"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Year Summary ({selectedYear})
            </Text>
            <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <View className="flex-row justify-between items-center mb-3">
                <Text 
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  Total Gross Salary
                </Text>
                <Text 
                  className="text-gray-900 text-base font-semibold"
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                >
                  ${(salarySlips.length * 5000).toLocaleString()}
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
                  ${(salarySlips.length * 800).toLocaleString()}
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
                    ${(salarySlips.length * 4200).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SalarySlips;
