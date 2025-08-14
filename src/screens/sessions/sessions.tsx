import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import SessionService from '../../services/SessionService';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import {
  ArrowLeft,
  Bell,
  Plus,
  Calendar,
  Clock,
  User,
  Book,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  Search,
  MessageSquare,
} from 'lucide-react-native';
import AddSessionModal from '../../components/addSessionModal';
import { format, isToday, isYesterday, startOfDay, subDays } from 'date-fns';
import DatePicker from 'react-native-date-picker';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Session {
  _id: string;
  studentId: {
    _id: string;
    name: string;
  };
  date: string;
  timeIn: string;
  timeOut: string;
  topicCovered: string;
  homework: string;
  otherComments: string;
  status: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdByRole: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: {
    _id: string;
    email: string;
  };
  updatedByRole?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalSessions: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const Sessions = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateFilterType, setDateFilterType] = useState<
    'today' | 'yesterday' | 'custom'
  >('today');
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalSessions: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessionDetailVisible, setSessionDetailVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getFormattedDate = () => {
    if (dateFilterType === 'today') {
      return new Date().toISOString();
    } else if (dateFilterType === 'yesterday') {
      return subDays(new Date(), 1).toISOString();
    } else {
      return selectedDate.toISOString();
    }
  };

  const handleGetSessions = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await SessionService.GetSessionByEmployeeId({
        employeeId: user?._id,
        date: getFormattedDate(),
        page: pageNum,
        limit,
        status: '',
        month: '',
        year: '',
        startDate: '',
        endDate: '',
      });
      console.log('response of GetSessionByEmployeeId:', response);
      if (response?.status === 200) {
        if (pageNum === 1) {
          setSessions(response.data?.data || []);
        } else {
          setSessions(prev => [...prev, ...(response.data?.data || [])]);
        }
        setPagination(
          response?.data?.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalSessions: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        );
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      Alert.alert('Error', 'Failed to fetch sessions. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    handleGetSessions(1);
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      handleGetSessions(nextPage);
    }
  };

  //create sessions
  const handleCreateSession = async (payload: any) => {
    try {
      setCreateLoading(true);
      const response = await SessionService.CreateSession(payload);
      console.log('response of CreateSession:', response);
      if (response?.status === 201) {
        Alert.alert('Success', 'Session created successfully');
        setAddModalVisible(false);
        setPage(1);
        handleGetSessions(1); // Refresh the session list
      }
    } catch (error) {
      console.error('Error creating session:', error);
      Alert.alert('Error', 'Failed to create session. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditSession = async (payload: any) => {
    if (!editingSession) return;

    try {
      setCreateLoading(true);
      const response = await SessionService.UpdateSession(
        editingSession._id,
        payload,
      );
      console.log('response of UpdateSession:', response);
      if (response?.status === 200) {
        Alert.alert('Success', 'Session updated successfully');
        setAddModalVisible(false);
        setEditingSession(null);
        setPage(1);
        handleGetSessions(1); // Refresh the session list
      }
    } catch (error) {
      console.error('Error updating session:', error);
      Alert.alert('Error', 'Failed to update session. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteSession = (session: Session) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await SessionService.DeleteSession(session._id);
              if (response?.status === 200) {
                Alert.alert('Success', 'Session deleted successfully');
                setPage(1);
                handleGetSessions(1);
              }
            } catch (error) {
              console.error('Error deleting session:', error);
              Alert.alert(
                'Error',
                'Failed to delete session. Please try again.',
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleDateFilterChange = (
    type: 'today' | 'yesterday' | 'custom',
    customDate?: Date,
  ) => {
    setDateFilterType(type);
    if (customDate) {
      setSelectedDate(customDate);
    }
    setPage(1);
    setTimeout(() => {
      handleGetSessions(1);
    }, 100);
  };

  const openSessionDetail = (session: Session) => {
    setSelectedSession(session);
    setSessionDetailVisible(true);
  };

  const openEditModal = (session: Session) => {
    setEditingSession(session);
    setAddModalVisible(true);
  };

  const openAddModal = () => {
    setEditingSession(null);
    setAddModalVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      handleGetSessions(1);
    }, [dateFilterType, selectedDate]),
  );

  const renderDateFilters = () => (
    <View className="bg-white mx-4 my-3 rounded-2xl p-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between mb-4">
        <Text
          className="text-lg font-semibold text-gray-800"
          style={{ fontFamily: 'Poppins-SemiBold' }}
        >
          Filter by Date
        </Text>
        <View className='flex flex-row gap-3 items-center'>
          {/* Floating Action Button */}
          <TouchableOpacity
            onPress={openAddModal}
            className=" bg-blue-500 rounded-2xl p-1 px-6 shadow-lg flex flex-row items-center gap-2"
            style={{
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
            }}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text className='text-white' style={{
              fontFamily: 'Poppins-Medium'
            }}>
              Add
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            className="bg-blue-50 rounded-full p-2"
          >
            <Filter size={18} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => handleDateFilterChange('today')}
          className={`flex-1 py-1 px-4 rounded-xl border ${
            dateFilterType === 'today'
              ? 'bg-blue-500 border-blue-400'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <Text
            className={`text-center font-medium ${
              dateFilterType === 'today' ? 'text-white' : 'text-gray-700'
            }`}
            style={{ fontFamily: 'Poppins-Medium' }}
          >
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDateFilterChange('yesterday')}
          className={`flex-1 py-1 px-4 rounded-xl border ${
            dateFilterType === 'yesterday'
              ? 'bg-blue-500 border-blue-400'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <Text
            className={`text-center font-medium ${
              dateFilterType === 'yesterday' ? 'text-white' : 'text-gray-700'
            }`}
            style={{ fontFamily: 'Poppins-Medium' }}
          >
            Yesterday
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onLongPress={() => setFilterModalVisible(true)}
          onPress={() => setShowDatePicker(true)}
          className={`flex-1 py-1 px-4 rounded-xl border ${
            dateFilterType === 'custom'
              ? 'bg-blue-500 border-blue-400'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <View className="flex-row items-center justify-center gap-1">
            <Calendar
              size={16}
              color={dateFilterType === 'custom' ? '#FFFFFF' : '#6B7280'}
            />
            <Text
              className={`font-medium ${
                dateFilterType === 'custom' ? 'text-white' : 'text-gray-700'
              }`}
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              {dateFilterType === 'custom'
                ? format(selectedDate, 'MMM dd')
                : 'Custom'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Helper Text */}
      <Text
        className="text-xs text-gray-500 text-center mt-2"
        style={{ fontFamily: 'Poppins-Regular' }}
      >
        Long press "Custom" for quick date picker
      </Text>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6 max-h-[70%]">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text
              className="text-xl font-semibold text-gray-800"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Select Date
            </Text>
            <TouchableOpacity
              onPress={() => setFilterModalVisible(false)}
              className="bg-gray-100 rounded-full p-2"
            >
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Quick Date Options */}
          <View className="mb-6">
            <Text
              className="text-lg font-semibold text-gray-800 mb-3"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Quick Select
            </Text>
            <View className="gap-3">
              <TouchableOpacity
                onPress={() => {
                  handleDateFilterChange('today');
                  setFilterModalVisible(false);
                }}
                className={`p-4 rounded-xl border ${
                  dateFilterType === 'today'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text
                  className={`font-medium ${
                    dateFilterType === 'today'
                      ? 'text-blue-700'
                      : 'text-gray-700'
                  }`}
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  Today ({format(new Date(), 'MMM dd, yyyy')})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleDateFilterChange('yesterday');
                  setFilterModalVisible(false);
                }}
                className={`p-4 rounded-xl border ${
                  dateFilterType === 'yesterday'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text
                  className={`font-medium ${
                    dateFilterType === 'yesterday'
                      ? 'text-blue-700'
                      : 'text-gray-700'
                  }`}
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  Yesterday ({format(subDays(new Date(), 1), 'MMM dd, yyyy')})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  const customDate = selectedDate;
                  handleDateFilterChange('custom', customDate);
                  setFilterModalVisible(false);
                }}
                onLongPress={() => {
                  setFilterModalVisible(false);
                  setShowDatePicker(true);
                }}
                className={`p-4 rounded-xl border ${
                  dateFilterType === 'custom'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    className={`font-medium ${
                      dateFilterType === 'custom'
                        ? 'text-blue-700'
                        : 'text-gray-700'
                    }`}
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Custom Date ({format(selectedDate, 'MMM dd, yyyy')})
                  </Text>
                  <Calendar
                    size={20}
                    color={dateFilterType === 'custom' ? '#1D4ED8' : '#6B7280'}
                  />
                </View>
                <Text
                  className="text-xs text-gray-500 mt-1"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  Long press to open date picker
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Picker */}
          <View className="mb-6">
            <Text
              className="text-lg font-semibold text-gray-800 mb-3"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Pick a Date
            </Text>
            <TouchableOpacity
              onPress={() => {
                setFilterModalVisible(false);
                setShowDatePicker(true);
              }}
              className="bg-blue-500 py-4 rounded-xl flex-row items-center justify-center gap-2"
            >
              <Calendar size={20} color="#FFFFFF" />
              <Text
                className="text-white font-semibold"
                style={{ fontFamily: 'Poppins-SemiBold' }}
              >
                Open Date Picker
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSessionCard = (session: Session, index: number) => (
    <View
      key={session._id}
      className="bg-white mx-4 mb-3 rounded-2xl shadow-sm border border-gray-100"
    >
      <View className="p-4">
        {/* Header with student name and status */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <View className="bg-blue-50 rounded-full p-2 mr-3">
              <User size={18} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text
                className="text-lg font-semibold text-gray-800"
                style={{ fontFamily: 'Poppins-SemiBold' }}
              >
                {session.studentId.name}
              </Text>
              <Text
                className="text-sm text-gray-500"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                {format(new Date(session.date), 'EEEE, MMM dd, yyyy')}
              </Text>
            </View>
          </View>
          <View
            className={`px-3 py-1 rounded-full ${
              session.status === 'approved'
                ? 'bg-green-100'
                : session.status === 'pending'
                ? 'bg-yellow-100'
                : 'bg-red-100'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                session.status === 'approved'
                  ? 'text-green-700'
                  : session.status === 'pending'
                  ? 'text-yellow-700'
                  : 'text-red-700'
              }`}
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Time Information */}
        <View className="flex-row items-center gap-4 mb-3">
          <View className="flex-row items-center">
            <Clock size={16} color="#10B981" />
            <Text
              className="text-sm text-gray-600 ml-2"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              In: {session.timeIn}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={16} color="#EF4444" />
            <Text
              className="text-sm text-gray-600 ml-2"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              Out: {session.timeOut}
            </Text>
          </View>
        </View>

        {/* Topic and Homework Preview */}
        <View className="gap-2 mb-4">
          <View className="flex-row items-start">
            <Book size={16} color="#8B5CF6" />
            <Text
              className="text-sm text-gray-600 ml-2 flex-1"
              style={{ fontFamily: 'Poppins-Regular' }}
              numberOfLines={2}
            >
              Topic: {session.topicCovered}
            </Text>
          </View>
          {session.homework && (
            <View className="flex-row items-start">
              <FileText size={16} color="#F59E0B" />
              <Text
                className="text-sm text-gray-600 ml-2 flex-1"
                style={{ fontFamily: 'Poppins-Regular' }}
                numberOfLines={2}
              >
                Homework: {session.homework}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => openSessionDetail(session)}
            className="flex-1 bg-blue-50 py-2 px-3 rounded-xl flex-row items-center justify-center gap-1"
          >
            <Eye size={16} color="#3B82F6" />
            <Text
              className="text-blue-600 font-medium text-sm"
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              View
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openEditModal(session)}
            className="flex-1 bg-green-50 py-2 px-3 rounded-xl flex-row items-center justify-center gap-1"
          >
            <Edit size={16} color="#10B981" />
            <Text
              className="text-green-600 font-medium text-sm"
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteSession(session)}
            className="bg-red-50 py-2 px-3 rounded-xl flex-row items-center justify-center"
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSessionDetailModal = () => (
    <Modal
      visible={sessionDetailVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setSessionDetailVisible(false)}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-3xl mx-4 w-full max-w-md max-h-[80%]">
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
            <Text
              className="text-xl font-semibold text-gray-800"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Session Details
            </Text>
            <TouchableOpacity
              onPress={() => setSessionDetailVisible(false)}
              className="bg-gray-100 rounded-full p-2"
            >
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            {selectedSession && (
              <View className="gap-4">
                {/* Student Info */}
                <View className="bg-blue-50 rounded-2xl p-4">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-blue-500 rounded-full p-3">
                      <User size={20} color="#FFFFFF" />
                    </View>
                    <View>
                      <Text
                        className="text-lg font-semibold text-gray-800"
                        style={{ fontFamily: 'Poppins-SemiBold' }}
                      >
                        {selectedSession.studentId.name}
                      </Text>
                      <Text
                        className="text-sm text-gray-600"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        {format(
                          new Date(selectedSession.date),
                          'EEEE, MMMM dd, yyyy',
                        )}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Time Information */}
                <View className="bg-gray-50 rounded-2xl p-4">
                  <Text
                    className="text-lg font-semibold text-gray-800 mb-3"
                    style={{ fontFamily: 'Poppins-SemiBold' }}
                  >
                    Session Time
                  </Text>
                  <View className="flex-row justify-between">
                    <View className="flex-row items-center">
                      <Clock size={18} color="#10B981" />
                      <Text
                        className="text-gray-700 ml-2"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        In: {selectedSession.timeIn}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Clock size={18} color="#EF4444" />
                      <Text
                        className="text-gray-700 ml-2"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        Out: {selectedSession.timeOut}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Topic Covered */}
                <View className="bg-purple-50 rounded-2xl p-4">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Book size={18} color="#8B5CF6" />
                    <Text
                      className="text-lg font-semibold text-gray-800"
                      style={{ fontFamily: 'Poppins-SemiBold' }}
                    >
                      Topic Covered
                    </Text>
                  </View>
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    {selectedSession.topicCovered}
                  </Text>
                </View>

                {/* Homework */}
                {selectedSession.homework && (
                  <View className="bg-yellow-50 rounded-2xl p-4">
                    <View className="flex-row items-center gap-2 mb-2">
                      <FileText size={18} color="#F59E0B" />
                      <Text
                        className="text-lg font-semibold text-gray-800"
                        style={{ fontFamily: 'Poppins-SemiBold' }}
                      >
                        Homework
                      </Text>
                    </View>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      {selectedSession.homework}
                    </Text>
                  </View>
                )}

                {/* Other Comments */}
                {selectedSession.otherComments && (
                  <View className="bg-green-50 rounded-2xl p-4">
                    <View className="flex-row items-center gap-2 mb-2">
                      <MessageSquare size={18} color="#10B981" />
                      <Text
                        className="text-lg font-semibold text-gray-800"
                        style={{ fontFamily: 'Poppins-SemiBold' }}
                      >
                        Other Comments
                      </Text>
                    </View>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      {selectedSession.otherComments}
                    </Text>
                  </View>
                )}

                {/* Status and Created By */}
                <View className="bg-gray-50 rounded-2xl p-4">
                  <Text
                    className="text-lg font-semibold text-gray-800 mb-3"
                    style={{ fontFamily: 'Poppins-SemiBold' }}
                  >
                    Session Info
                  </Text>
                  <View className="gap-2">
                    <View className="flex-row justify-between">
                      <Text
                        className="text-gray-600"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        Status:
                      </Text>
                      <View
                        className={`px-3 py-1 rounded-full ${
                          selectedSession.status === 'approved'
                            ? 'bg-green-100'
                            : selectedSession.status === 'pending'
                            ? 'bg-yellow-100'
                            : 'bg-red-100'
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            selectedSession.status === 'approved'
                              ? 'text-green-700'
                              : selectedSession.status === 'pending'
                              ? 'text-yellow-700'
                              : 'text-red-700'
                          }`}
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          {selectedSession.status.charAt(0).toUpperCase() +
                            selectedSession.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row justify-between">
                      <Text
                        className="text-gray-600"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        Created by:
                      </Text>
                      <Text
                        className="text-gray-800 font-medium"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        {selectedSession.createdBy.name}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text
                        className="text-gray-600"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        Created at:
                      </Text>
                      <Text
                        className="text-gray-800"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        {format(
                          new Date(selectedSession.createdAt),
                          'MMM dd, yyyy HH:mm',
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <View className="bg-gray-100 rounded-full p-6 mb-4">
        <Calendar size={48} color="#9CA3AF" />
      </View>
      <Text
        className="text-xl font-semibold text-gray-600 mb-2"
        style={{ fontFamily: 'Poppins-SemiBold' }}
      >
        No Sessions Found
      </Text>
      <Text
        className="text-gray-500 text-center mb-6 px-8"
        style={{ fontFamily: 'Poppins-Regular' }}
      >
        {dateFilterType === 'today'
          ? "No sessions scheduled for today. Tap '+' to create a new session."
          : dateFilterType === 'yesterday'
          ? 'No sessions found for yesterday.'
          : `No sessions found for ${format(selectedDate, 'MMM dd, yyyy')}.`}
      </Text>
      <TouchableOpacity
        onPress={openAddModal}
        className="bg-blue-500 py-3 px-6 rounded-xl flex-row items-center gap-2"
      >
        <Plus size={20} color="#FFFFFF" />
        <Text
          className="text-white font-semibold"
          style={{ fontFamily: 'Poppins-SemiBold' }}
        >
          Add Session
        </Text>
      </TouchableOpacity>
    </View>
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
              Sessions
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
        {/* Date Filters */}
        {renderDateFilters()}
        {/* Filter Modal */}
        {renderFilterModal()} {/* Sessions List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onMomentumScrollEnd={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } =
              nativeEvent;
            if (
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - 20
            ) {
              handleLoadMore();
            }
          }}
        >
          {/* Summary Card */}
          <View className="bg-white mx-4 mb-3 rounded-2xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  className="text-2xl font-bold text-gray-800"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  {pagination.totalSessions}
                </Text>
                <Text
                  className="text-sm text-gray-600"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  Total Sessions{' '}
                  {dateFilterType === 'today'
                    ? 'Today'
                    : dateFilterType === 'yesterday'
                    ? 'Yesterday'
                    : format(selectedDate, 'MMM dd')}
                </Text>
              </View>
              <View className="bg-blue-50 rounded-full p-3">
                <Book size={24} color="#3B82F6" />
              </View>
            </View>
          </View>

          {/* Sessions List or Empty State */}
          {loading && sessions.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text
                className="text-gray-600 mt-4"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                Loading sessions...
              </Text>
            </View>
          ) : sessions.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              {sessions.map((session, index) =>
                renderSessionCard(session, index),
              )}

              {/* Load More Indicator */}
              {loading && sessions.length > 0 && (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color="#3B82F6" />
                  <Text
                    className="text-gray-500 mt-2"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Loading more sessions...
                  </Text>
                </View>
              )}

              {/* Pagination Info */}
              {pagination.totalPages > 1 && (
                <View className="mx-4 mt-4 p-4 bg-white rounded-2xl border border-gray-100">
                  <Text
                    className="text-center text-gray-600"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>

      {/* Session Detail Modal */}
      {renderSessionDetailModal()}

      {/* Add/Edit Session Modal */}
      <AddSessionModal
        isModalOpen={addModalVisible}
        setIsModalOpen={setAddModalVisible}
        onClose={() => {
          setAddModalVisible(false);
          setEditingSession(null);
        }}
        onSubmit={editingSession ? handleEditSession : handleCreateSession}
        loading={createLoading}
        setLoading={setCreateLoading}
        editingSession={editingSession}
      />

      {/* Date Picker Modal */}
      <DatePicker
        modal
        theme="light"
        open={showDatePicker}
        date={selectedDate}
        mode="date"
        title="Select Date"
        confirmText="Confirm"
        cancelText="Cancel"
        maximumDate={new Date()}
        minimumDate={subDays(new Date(), 365)} // Allow selection up to 1 year back
        onConfirm={date => {
          setShowDatePicker(false);
          setSelectedDate(date);
          handleDateFilterChange('custom', date);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </SafeAreaView>
  );
};

export default Sessions;
