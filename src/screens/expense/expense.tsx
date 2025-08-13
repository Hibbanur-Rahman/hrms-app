import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Bell,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  FlatList,
  TextInput,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInRight,
  Layout,
} from 'react-native-reanimated';
import { RootStackParamList } from '../../../App';
import ExpenseService from '../../services/ExpenseService';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import tw from 'twrnc';
import { Dropdown } from 'react-native-element-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import AddExpenseModal from '../../components/addExpenseModal';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ExpenseItem {
  name: string;
  price: number;
  category: string;
  _id: string;
}

interface FileItem {
  url: string;
  filename: string;
  uploadedAt: string;
  _id: string;
}

interface ExpenseData {
  _id: string;
  expenseId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  isAdmin: boolean;
  date: string;
  description: string;
  expenses: ExpenseItem[];
  totalAmount: number;
  approvedAmount: number | null;
  status: string;
  adminComment: string;
  files: FileItem[];
  updateHistory: any[];
  createdAt: string;
  updatedAt: string;
}

interface ExpenseResponse {
  success: boolean;
  expenses: ExpenseData[];
  currentPage: number;
  totalPages: number;
  totalExpenses: number;
  totalApprovedAmount: number;
}

const Expense = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [expenseList, setExpenseList] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 1,
    totalExpenses: 0,
    totalApprovedAmount: 0,
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [addExpenseModalVisible, setAddExpenseModalVisible] = useState(false);
  const [editExpense, setEditExpense] = useState<ExpenseData | null>(null);
  const [search, setSearch] = useState('');

  const filterScale = useSharedValue(0.8);
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

  const [selectedMonth, setSelectedMonth] = useState<any>(
    months[new Date().getMonth()] || null,
  );
  const [selectedYear, setSelectedYear] = useState<any>(
    years.find(year => year.value === new Date().getFullYear().toString()) ||
      null,
  );

  //handle get expenses
  const handleGetExpenses = async () => {
    try {
      setLoading(true);
      const payload = {
        id: user?._id,
        page,
        limit,
        search: '',
        month: Number(selectedMonth?.value).toString(),
        year: selectedYear?.value,
      };

      const response = await ExpenseService.GetAllExpenses(payload);
      console.log('response of expense list:', response);
      if (response?.status === 200) {
        const data: ExpenseResponse = response.data;
        setExpenseList(data.expenses);
        setPaginationData({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalExpenses: data.totalExpenses,
          totalApprovedAmount: data.totalApprovedAmount,
        });
      }
    } catch (error) {
      console.log('Error fetching expenses:', error);
      Alert.alert('Error', 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.totalPages) {
      setPage(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openImageViewer = (imageUrl: string) => {
    // You can implement image viewer here
    Linking.openURL(imageUrl);
  };

  const filterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: filterScale.value }],
  }));

  //handle create expense
  const handleCreateExpense = async (expenseData: any) => {
    try {
      setLoading(true);
      const response = await ExpenseService.CreateExpense(expenseData);
      console.log('response of create expense:', response);
      if (response?.status === 201) {
        Alert.alert('Success', 'Expense created successfully');
        setAddExpenseModalVisible(false);
        handleGetExpenses();
      }
    } catch (error) {
      console.log('Error creating expense:', error);
      Alert.alert('Error', 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetExpenses();
    }, [selectedMonth, selectedYear, page, search]),
  );

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
              Expense
            </Text>
            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              onPress={() => navigation.navigate('Notification')}
              activeOpacity={0.7}
            >
              <Bell size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Filters */}
          <View className="px-4 mt-4">
            <View
              style={[filterAnimatedStyle]}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              {/* Month and Year Filters */}
              <View className="flex-row items-center gap-3 mb-4">
                <View className="flex-1">
                  <Dropdown
                    style={tw`w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl`}
                    placeholderStyle={[
                      tw`text-gray-500 text-sm`,
                      { fontFamily: 'Poppins-Regular' },
                    ]}
                    containerStyle={tw`rounded-xl bg-white border border-gray-200 overflow-hidden shadow-lg`}
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
                    style={tw`w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl`}
                    placeholderStyle={[
                      tw`text-gray-500 text-sm`,
                      { fontFamily: 'Poppins-Regular' },
                    ]}
                    containerStyle={tw`rounded-xl bg-white border border-gray-200 overflow-hidden shadow-lg`}
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

              {/* Search and Add Button */}
              <View className="flex-row items-end gap-3">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <View className="flex-1">
                      <TextInput
                        placeholder="Search by ID or Description"
                        placeholderTextColor="#9CA3AF"
                        value={search}
                        onChangeText={text => setSearch(text)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      />
                    </View>
                    <TouchableOpacity
                      className="bg-blue-600 rounded-xl px-4 py-3 flex-row items-center justify-center shadow-sm"
                      onPress={() => {
                        filterScale.value = withSpring(1);
                        handleGetExpenses();
                      }}
                      activeOpacity={0.8}
                    >
                      <Feather name="search" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setEditExpense(null);
                    setAddExpenseModalVisible(true);
                  }}
                  activeOpacity={0.8}
                  style={{
                    shadowColor: '#4F46E5',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <LinearGradient
                    colors={['#4F46E5', '#7C3AED']} // indigo-600 to purple-600
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="px-6 py-3 flex-row items-center gap-2"
                    style={{ borderRadius: 12 }}
                  >
                    <Feather name="plus" size={20} color="white" />
                    <Text
                      className="text-white text-sm font-semibold"
                      style={{ fontFamily: 'Poppins-SemiBold' }}
                    >
                      Add Expense
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Summary Stats */}
          <Animated.View entering={FadeInUp.delay(200)} className="px-4 mt-4">
            <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text
                    className="text-gray-500 text-sm mb-1"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Total Expenses
                  </Text>
                  <Text
                    className="text-gray-900 text-lg font-semibold"
                    style={{ fontFamily: 'Poppins-SemiBold' }}
                  >
                    {paginationData.totalExpenses}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text
                    className="text-gray-500 text-sm mb-1"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Approved Amount
                  </Text>
                  <Text
                    className="text-green-600 text-lg font-semibold"
                    style={{ fontFamily: 'Poppins-SemiBold' }}
                  >
                    ₹{paginationData.totalApprovedAmount}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Expense List */}
          <View className="px-4 mt-4">
            {loading ? (
              <View className="flex-1 justify-center items-center py-20">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text
                  className="text-gray-500 mt-2"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  Loading expenses...
                </Text>
              </View>
            ) : expenseList.length === 0 ? (
              <Animated.View
                entering={FadeIn}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 items-center"
              >
                <FileText size={48} color="#9CA3AF" />
                <Text
                  className="text-gray-500 text-lg mt-4 text-center"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  No expenses found
                </Text>
                <Text
                  className="text-gray-400 text-sm mt-2 text-center"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  No expense records for the selected period
                </Text>
              </Animated.View>
            ) : (
              expenseList.map((expense, index) => (
                <Animated.View
                  key={expense._id}
                  entering={FadeInUp.delay(index * 100)}
                  className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
                >
                  {/* Header */}
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text
                        className="text-gray-900 text-lg font-semibold"
                        style={{ fontFamily: 'Poppins-SemiBold' }}
                      >
                        {expense.expenseId}
                      </Text>
                      <Text
                        className="text-gray-500 text-sm"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        {formatDate(expense.date)}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      {/* Edit Button - Only show for pending status */}
                      {expense.status.toLowerCase() === 'pending' && (
                        <TouchableOpacity
                          className="bg-blue-50 rounded-full p-2 mr-2"
                          onPress={() => {
                            setEditExpense(expense);
                            setAddExpenseModalVisible(true);
                          }}
                          activeOpacity={0.7}
                        >
                          <Edit3 size={16} color="#3B82F6" />
                        </TouchableOpacity>
                      )}
                      <View
                        className={`px-3 py-1 rounded-full ${getStatusColor(
                          expense.status,
                        )}`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            expense.status === 'Approved'
                              ? 'text-green-800'
                              : expense.status === 'Rejected'
                              ? 'text-red-800'
                              : 'text-yellow-800'
                          }`}
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          {expense.status}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Description */}
                  <Text
                    className="text-gray-700 text-sm mb-3"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    {expense.description}
                  </Text>

                  {/* Expense Items */}
                  <View className="mb-4">
                    <Text
                      className="text-gray-500 text-xs uppercase tracking-wide mb-3 font-medium"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Expense Details
                    </Text>
                    <View className="bg-gray-50 rounded-xl p-3">
                      {expense.expenses.map((item, itemIndex) => (
                        <View
                          key={item._id}
                          className={`flex-row justify-between items-center py-2 ${
                            itemIndex !== expense.expenses.length - 1
                              ? 'border-b border-gray-200'
                              : ''
                          }`}
                        >
                          <View className="flex-1">
                            <Text
                              className="text-gray-900 text-sm font-medium"
                              style={{ fontFamily: 'Poppins-Medium' }}
                            >
                              {item.name}
                            </Text>
                            <View className="flex-row items-center mt-1">
                              <View className="bg-blue-100 px-2 py-1 rounded-full">
                                <Text
                                  className="text-blue-700 text-xs font-medium"
                                  style={{ fontFamily: 'Poppins-Medium' }}
                                >
                                  {item.category}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View className="bg-white px-3 py-2 rounded-lg border border-gray-200">
                            <Text
                              className="text-gray-900 text-sm font-bold"
                              style={{ fontFamily: 'Poppins-Bold' }}
                            >
                              ₹{item.price}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Files */}
                  {expense.files.length > 0 && (
                    <View className="mb-4">
                      <Text
                        className="text-gray-500 text-xs uppercase tracking-wide mb-3 font-medium"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Attachments ({expense.files.length})
                      </Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="bg-gray-50 rounded-xl p-3 "
                      >
                        <View className="flex-row gap-3">
                          {expense.files.map((file, fileIndex) => (
                            <TouchableOpacity
                              key={file._id}
                              onPress={() => openImageViewer(file.url)}
                              className="relative bg-white rounded-lg border border-gray-200 overflow-hidden h-[70px]"
                              activeOpacity={0.8}
                            >
                              <Image
                                source={{ uri: file?.url }}
                                className="w-20 h-20"
                                resizeMode="cover"
                              />
                              <View className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <View className="bg-white/90 rounded-full p-1">
                                  <Eye size={14} color="#374151" />
                                </View>
                              </View>
                              <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                                <Text
                                  className="text-white text-xs font-medium text-center"
                                  style={{ fontFamily: 'Poppins-Medium' }}
                                  numberOfLines={1}
                                >
                                  {file?.filename}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </ScrollView>
                    </View>
                  )}

                  {/* Amount Summary */}
                  <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text
                        className="text-gray-600 text-sm font-medium"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Total Amount
                      </Text>
                      <Text
                        className="text-gray-900 text-xl font-bold"
                        style={{ fontFamily: 'Poppins-Bold' }}
                      >
                        ₹{expense.totalAmount}
                      </Text>
                    </View>

                    {/* Approved Amount */}
                    {expense.approvedAmount !== null && (
                      <View className="flex-row justify-between items-center pt-2 border-t border-blue-200">
                        <Text
                          className="text-green-600 text-sm font-medium"
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          Approved Amount
                        </Text>
                        <Text
                          className="text-green-600 text-xl font-bold"
                          style={{ fontFamily: 'Poppins-Bold' }}
                        >
                          ₹{expense.approvedAmount}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Admin Comment */}
                  {expense.adminComment &&
                    expense.adminComment.trim() !== '' && (
                      <View className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <Text
                          className="text-blue-600 text-xs uppercase tracking-wide mb-1"
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          Admin Comment
                        </Text>
                        <Text
                          className="text-blue-800 text-sm"
                          style={{ fontFamily: 'Poppins-Regular' }}
                        >
                          {expense.adminComment}
                        </Text>
                      </View>
                    )}
                </Animated.View>
              ))
            )}
          </View>

          {/* Pagination */}
          {!loading &&
            expenseList.length > 0 &&
            paginationData.totalPages > 1 && (
              <Animated.View
                entering={FadeInUp.delay(500)}
                className="px-4 mt-4"
              >
                <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <View className="flex-row justify-between items-center">
                    <TouchableOpacity
                      onPress={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`flex-row items-center px-4 py-2 rounded-lg ${
                        page === 1 ? 'bg-gray-100' : 'bg-blue-500'
                      }`}
                    >
                      <ChevronLeft
                        size={16}
                        color={page === 1 ? '#9CA3AF' : '#fff'}
                      />
                      <Text
                        className={`ml-1 text-sm font-medium ${
                          page === 1 ? 'text-gray-400' : 'text-white'
                        }`}
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Previous
                      </Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center">
                      <Text
                        className="text-gray-700 text-sm"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        Page {paginationData.currentPage} of{' '}
                        {paginationData.totalPages}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handlePageChange(page + 1)}
                      disabled={page === paginationData.totalPages}
                      className={`flex-row items-center px-4 py-2 rounded-lg ${
                        page === paginationData.totalPages
                          ? 'bg-gray-100'
                          : 'bg-blue-500'
                      }`}
                    >
                      <Text
                        className={`mr-1 text-sm font-medium ${
                          page === paginationData.totalPages
                            ? 'text-gray-400'
                            : 'text-white'
                        }`}
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Next
                      </Text>
                      <ChevronRight
                        size={16}
                        color={
                          page === paginationData.totalPages
                            ? '#9CA3AF'
                            : '#fff'
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            )}
        </ScrollView>
      </View>
      {/* Add Expense Modal */}
      {addExpenseModalVisible && (
        <AddExpenseModal
          isCreateDialogOpen={addExpenseModalVisible}
          setIsCreateDialogOpen={(visible: boolean) => {
            setAddExpenseModalVisible(visible);
            if (!visible) {
              setEditExpense(null);
            }
          }}
          loading={createLoading}
          setLoading={setCreateLoading}
          handleSubmit={handleCreateExpense}
          editExpense={editExpense}
        />
      )}
    </SafeAreaView>
  );
};

export default Expense;
