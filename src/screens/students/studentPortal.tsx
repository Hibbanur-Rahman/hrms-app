import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import {
  ArrowLeft,
  Bell,
  Plus,
  Upload,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  User,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import StudentService from '../../services/StudentService';
import AddStudentModal from '../../components/addStudentModal';
import UploadStudentCSVModal from '../../components/uploadStudentCSVModal';
import { LoadingAnimation } from '../../components/LoadingAnimation';
import SwipeActions from '../../components/SwipeActions';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StudentPortal = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [students, setStudents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [pagination, setPagination] = useState<any>({});
  const [filters, setFilters] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [uploadCSVModalVisible, setUploadCSVModalVisible] = useState(false);
  const [uploadCSVLoading, setUploadCSVLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState<any>(null);

  //get students
  const handleGetAllStudents = async () => {
    try {
      setLoading(true);
      const response = await StudentService.GetStudentByEmployee({
        page,
        limit,
      });
      console.log('response while fetching students:', response);
      if (response?.status === 200) {
        setStudents(response.data?.data);
        setPagination(response.data?.pagination);
        setFilters(response.data?.filters);
      }
    } catch (error) {
      console.log('error while fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  //create or add students
  const handleCreateStudent = async (payload: any) => {
    try {
      setCreateLoading(true);
      const response = await StudentService.CreateStudent(payload);
      console.log('response while creating students:', response);
      if (response?.status === 201) {
        // Handle successful creation
        handleGetAllStudents();
        setAddModalVisible(false);
        setEditingStudent(null);
      }
    } catch (error) {
      console.log('error while creating students:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  //update student details
  const handleUpdateStudent = async (id: string, payload: any) => {
    try {
      setCreateLoading(true);
      const response = await StudentService.UpdateStudent(id, payload);
      console.log('response while updating students:', response);
      if (response?.status === 200) {
        // Handle successful update
        handleGetAllStudents();
        setAddModalVisible(false);
        setEditingStudent(null);
      }
    } catch (error) {
      console.log('error while updating students:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  //handle delete student
  const handleDeleteStudent = async (id: string) => {
    try {
      Alert.alert(
        'Delete Student',
        'Are you sure you want to delete this student?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              setLoading(true);
              const response = await StudentService.DeleteStudent(id);
              console.log('response while deleting students:', response);
              if (response?.status === 200) {
                // Handle successful deletion
                handleGetAllStudents();
              }
              setLoading(false);
            },
          },
        ],
      );
    } catch (error) {
      console.log('error while deleting students:', error);
      setLoading(false);
    }
  };

  //handle upload through csv
  const handleUploadCSV = async (file: any) => {
    try {
      setUploadCSVLoading(true);
      const response = await StudentService.UploadCSV(file);
      console.log('response while uploading csv:', response);
      if (response?.status === 200) {
        // Handle successful upload
        handleGetAllStudents();
        setUploadCSVModalVisible(false);
      }
    } catch (error) {
      console.log('error while uploading csv:', error);
    } finally {
      setUploadCSVLoading(false);
    }
  };

  // Handle edit student
  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
    setAddModalVisible(true);
  };

  // Handle view student details
  const handleViewStudent = (student: any) => {
    navigation.navigate('StudentDetails', { student });
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Filter students based on search query
  const filteredStudents = students.filter(
    student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  useFocusEffect(
    useCallback(() => {
      handleGetAllStudents();
    }, [page]),
  );

  // Refetch data when page changes
  React.useEffect(() => {
    handleGetAllStudents();
  }, [page]);

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
              Students
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
          {/* Stats Card */}
          <View className="mx-4 mt-4 mb-6">
            <LinearGradient
              colors={['#3B82F6', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-2xl p-6 shadow-lg"
              style={{
                borderRadius: 20,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text
                    className="text-white text-3xl font-bold"
                    style={{ fontFamily: 'Poppins-Bold' }}
                  >
                    {pagination?.totalStudents || 0}
                  </Text>
                  <Text
                    className="text-blue-100 text-base"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Total Students
                  </Text>
                </View>
                <View className="bg-white/20 rounded-full p-3">
                  <Users size={28} color="#ffffff" />
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Search Bar */}
          <View className="mx-4 mb-4">
            <View className="bg-white rounded-2xl p-0 px-4 shadow-sm border border-gray-200">
              <View className="flex-row items-center">
                <Search size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-3 text-gray-700"
                  placeholder="Search students by name, ID, or phone..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={{ fontFamily: 'Poppins-Regular' }}
                  placeholderTextColor={'#9CA3AF'}
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mx-4 mb-6">
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-xl p-2 px-4 flex-row items-center justify-center shadow-sm"
                onPress={() => setAddModalVisible(true)}
                activeOpacity={0.8}
              >
                <Plus size={20} color="#ffffff" />
                <Text
                  className="text-white font-semibold ml-2"
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                >
                  Add Student
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex rounded-xl p-2 px-4 flex-row items-center justify-center shadow-sm"
                onPress={() => setUploadCSVModalVisible(true)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#10B981',
                }}
              >
                <Upload size={20} color="#ffffff" />
                <Text
                  className="text-white font-semibold ml-2"
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                >
                  Upload CSV
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Students List */}
          <View className="mx-4">
            <Text
              className="text-gray-800 text-lg font-semibold mb-4"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Students List
            </Text>

            {loading ? (
              <View className="flex-1 justify-center items-center py-20">
                <LoadingAnimation type="dots" size="large" color="#3B82F6" />
                <Text
                  className="text-gray-500 mt-3"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  Loading students...
                </Text>
              </View>
            ) : filteredStudents.length === 0 ? (
              <View className="bg-white rounded-xl p-8 items-center shadow-sm border border-gray-100">
                <User size={48} color="#9CA3AF" />
                <Text
                  className="text-gray-500 text-lg font-medium mt-4"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  No students found
                </Text>
                <Text
                  className="text-gray-400 text-center mt-2"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  {searchQuery
                    ? 'Try adjusting your search criteria'
                    : 'Add your first student to get started'}
                </Text>
              </View>
            ) : (
              <>
                {filteredStudents.map((student, index) => (
                  <View
                    key={student._id}
                    className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-200"
                  >
                    <View className="flex-row items-start">
                      {/* Student Image */}
                      <View className="mr-4">
                        {student.image ? (
                          <Image
                            source={{ uri: student.image }}
                            className="w-16 h-16 rounded-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
                            <User size={24} color="#9CA3AF" />
                          </View>
                        )}
                      </View>

                      <View className="flex-row items-center justify-between mb-2 flex-1">
                        <View>
                          <Text
                            className="text-gray-800 text-lg font-semibold"
                            style={{ fontFamily: 'Poppins-SemiBold' }}
                          >
                            {student.name}
                          </Text>
                          <View className="flex-row items-center">
                            <Text
                              className="text-gray-500 text-sm"
                              style={{ fontFamily: 'Poppins-Regular' }}
                            >
                              Phone:
                            </Text>
                            <Text
                              className="text-gray-700 text-sm ml-1"
                              style={{ fontFamily: 'Poppins-Medium' }}
                            >
                              {student.phone}
                            </Text>
                          </View>
                        </View>
                        <View className="bg-blue-100 px-3 py-1 rounded-full">
                          <Text
                            className="text-blue-600 text-xs font-medium"
                            style={{ fontFamily: 'Poppins-Medium' }}
                          >
                            {student.studentId}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/* Student Details */}
                    <View className="flex-1 mt-2">
                      <View className="gap-1">
                      
                        {student.presentClass && (
                          <View className="flex-row items-center">
                            <Text
                              className="text-gray-500 text-sm"
                              style={{ fontFamily: 'Poppins-Regular' }}
                            >
                              Class:
                            </Text>
                            <Text
                              className="text-gray-700 text-sm ml-1"
                              style={{ fontFamily: 'Poppins-Medium' }}
                            >
                              {student.presentClass}
                            </Text>
                          </View>
                        )}

                        {student.curriculum && (
                          <View className="flex-row items-center">
                            <Text
                              className="text-gray-500 text-sm"
                              style={{ fontFamily: 'Poppins-Regular' }}
                            >
                              Curriculum:
                            </Text>
                            <Text
                              className="text-gray-700 text-sm ml-1"
                              style={{ fontFamily: 'Poppins-Medium' }}
                            >
                              {student.curriculum}
                            </Text>
                          </View>
                        )}

                        {student.schoolName && (
                          <View className="flex-row items-center overflow-hidden">
                            <Text
                              className="text-gray-500 text-sm"
                              style={{ fontFamily: 'Poppins-Regular' }}
                            >
                              School:
                            </Text>
                            <Text
                              className="text-gray-700 text-sm ml-1"
                              style={{ fontFamily: 'Poppins-Medium' }}
                            >
                              {student.schoolName}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Action Buttons */}
                      <View className="flex-row items-center justify-end mt-4">
                        <SwipeActions
                          onView={() => handleViewStudent(student)}
                          onEdit={() => handleEditStudent(student)}
                          onDelete={() => handleDeleteStudent(student._id)}
                        />
                      </View>
                    </View>
                  </View>
                ))}

                {/* Pagination */}
                {pagination?.totalPages > 1 && (
                  <View className="bg-white rounded-xl p-4 mt-4 shadow-sm border border-gray-100">
                    <View className="flex-row items-center justify-between">
                      <TouchableOpacity
                        className={`flex-row items-center px-4 py-2 rounded-lg ${
                          !pagination?.hasPrevPage
                            ? 'bg-gray-100'
                            : 'bg-blue-50'
                        }`}
                        onPress={() =>
                          pagination?.hasPrevPage && handlePageChange(page - 1)
                        }
                        disabled={!pagination?.hasPrevPage}
                        activeOpacity={0.7}
                      >
                        <ChevronLeft
                          size={18}
                          color={
                            pagination?.hasPrevPage ? '#3B82F6' : '#9CA3AF'
                          }
                        />
                        <Text
                          className={`ml-1 font-medium ${
                            pagination?.hasPrevPage
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          Previous
                        </Text>
                      </TouchableOpacity>

                      <View className="flex-row items-center space-x-2">
                        <Text
                          className="text-gray-600"
                          style={{ fontFamily: 'Poppins-Regular' }}
                        >
                          Page {pagination?.currentPage} of{' '}
                          {pagination?.totalPages}
                        </Text>
                      </View>

                      <TouchableOpacity
                        className={`flex-row items-center px-4 py-2 rounded-lg ${
                          !pagination?.hasNextPage
                            ? 'bg-gray-100'
                            : 'bg-blue-50'
                        }`}
                        onPress={() =>
                          pagination?.hasNextPage && handlePageChange(page + 1)
                        }
                        disabled={!pagination?.hasNextPage}
                        activeOpacity={0.7}
                      >
                        <Text
                          className={`mr-1 font-medium ${
                            pagination?.hasNextPage
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          Next
                        </Text>
                        <ChevronRight
                          size={18}
                          color={
                            pagination?.hasNextPage ? '#3B82F6' : '#9CA3AF'
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </View>

      {/**Add student Modal */}
      <AddStudentModal
        isModalOpen={addModalVisible}
        setIsModalOpen={setAddModalVisible}
        loading={createLoading}
        setLoading={setCreateLoading}
        onSubmit={
          editingStudent
            ? payload => handleUpdateStudent(editingStudent._id, payload)
            : handleCreateStudent
        }
        editingStudent={editingStudent}
        onClose={() => {
          setAddModalVisible(false);
          setEditingStudent(null);
        }}
      />

      {/** upload csv Modal */}
      <UploadStudentCSVModal
        isModalOpen={uploadCSVModalVisible}
        setIsModalOpen={setUploadCSVModalVisible}
        loading={uploadCSVLoading}
        setLoading={setUploadCSVLoading}
        onSubmit={handleUploadCSV}
      />
    </SafeAreaView>
  );
};

export default StudentPortal;
