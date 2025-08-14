import { useFocusEffect } from '@react-navigation/native';
import { X, Search, Calendar, Clock, User, Book, FileText, MessageSquare } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import StudentService from '../services/StudentService';
import { format, subDays } from 'date-fns';
import DatePicker from 'react-native-date-picker';

interface Student {
  _id: string;
  name: string;
  phone?: string;
  studentId?: string;
}

interface SessionData {
  studentId: string;
  date: string;
  day: string;
  timeIn: string;
  timeOut: string;
  topicCovered: string;
  homework: string;
  otherComments: string;
}

const AddSessionModal = ({
  isModalOpen,
  setIsModalOpen,
  loading,
  setLoading,
  onSubmit,
  editingSession,
  onClose,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
  onSubmit: (data: any) => void;
  editingSession: any;
  onClose: () => void;
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateType, setDateType] = useState<'today' | 'yesterday' | 'custom'>('today');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeInHour, setTimeInHour] = useState('');
  const [timeInMinute, setTimeInMinute] = useState('');
  const [timeOutHour, setTimeOutHour] = useState('');
  const [timeOutMinute, setTimeOutMinute] = useState('');
  const [formData, setFormData] = useState<SessionData>({
    studentId: '',
    date: '',
    day: '',
    timeIn: '',
    timeOut: '',
    topicCovered: '',
    homework: '',
    otherComments: '',
  });

  // Handle get student list
  const handleGetStudentList = async () => {
    try {
      const response = await StudentService.GetStudentByEmployee({ page, limit });
      console.log('response of GetStudentByEmployee:', response);
      if (response?.status === 200) {
        setStudentList(response.data?.data || []);
        setFilteredStudents(response.data?.data || []);
        setPagination(response.data?.pagination);
      }
    } catch (error) {
      console.error('Error fetching student list:', error);
    }
  };

  const handleSearchStudent = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredStudents(studentList);
    } else {
      const filtered = studentList.filter((student) =>
        student.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  };

  const selectStudent = (student: Student) => {
    setSelectedStudent(student);
    setFormData(prev => ({ ...prev, studentId: student._id }));
    setShowStudentDropdown(false);
    setSearchQuery('');
  };

  const handleDateTypeChange = (type: 'today' | 'yesterday' | 'custom') => {
    setDateType(type);
    let date = new Date();
    
    if (type === 'yesterday') {
      date = subDays(new Date(), 1);
    } else if (type === 'custom') {
      setShowDatePicker(true);
      return;
    }
    
    setSelectedDate(date);
    updateFormDate(date);
  };

  const updateFormDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setFormData(prev => ({
      ...prev,
      date: date.toISOString(),
      day: days[date.getDay()],
    }));
  };

  const formatTime = (hour: string, minute: string) => {
    if (!hour || !minute) return '';
    const h = hour.padStart(2, '0');
    const m = minute.padStart(2, '0');
    return `${h}:${m}`;
  };

  const handleTimeChange = (type: 'timeIn' | 'timeOut', part: 'hour' | 'minute', value: string) => {
    // Validate input
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    
    if (part === 'hour' && (numValue < 0 || numValue > 23)) return;
    if (part === 'minute' && (numValue < 0 || numValue > 59)) return;

    if (type === 'timeIn') {
      if (part === 'hour') {
        setTimeInHour(value);
        setFormData(prev => ({ ...prev, timeIn: formatTime(value, timeInMinute) }));
      } else {
        setTimeInMinute(value);
        setFormData(prev => ({ ...prev, timeIn: formatTime(timeInHour, value) }));
      }
    } else {
      if (part === 'hour') {
        setTimeOutHour(value);
        setFormData(prev => ({ ...prev, timeOut: formatTime(value, timeOutMinute) }));
      } else {
        setTimeOutMinute(value);
        setFormData(prev => ({ ...prev, timeOut: formatTime(timeOutHour, value) }));
      }
    }
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setSelectedDate(new Date());
    setDateType('today');
    setTimeInHour('');
    setTimeInMinute('');
    setTimeOutHour('');
    setTimeOutMinute('');
    setFormData({
      studentId: '',
      date: '',
      day: '',
      timeIn: '',
      timeOut: '',
      topicCovered: '',
      homework: '',
      otherComments: '',
    });
    setSearchQuery('');
    setShowStudentDropdown(false);
    updateFormDate(new Date());
  };

  const handleClose = () => {
    setIsModalOpen(false);
    resetForm();
    if (onClose) onClose();
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.studentId) {
      Alert.alert('Error', 'Please select a student');
      return;
    }
    if (!formData.timeIn) {
      Alert.alert('Error', 'Please enter time in');
      return;
    }
    if (!formData.timeOut) {
      Alert.alert('Error', 'Please enter time out');
      return;
    }
    if (!formData.topicCovered.trim()) {
      Alert.alert('Error', 'Please enter topic covered');
      return;
    }

    onSubmit(formData);
  };

  // Initialize form data when editing
  useEffect(() => {
    if (editingSession) {
      setSelectedStudent({
        _id: editingSession.studentId._id,
        name: editingSession.studentId.name,
      });
      
      const sessionDate = new Date(editingSession.date);
      setSelectedDate(sessionDate);
      setDateType('custom');
      
      // Parse time
      const [inHour, inMinute] = editingSession.timeIn.split(':');
      const [outHour, outMinute] = editingSession.timeOut.split(':');
      
      setTimeInHour(inHour);
      setTimeInMinute(inMinute);
      setTimeOutHour(outHour);
      setTimeOutMinute(outMinute);
      
      setFormData({
        studentId: editingSession.studentId._id,
        date: editingSession.date,
        day: format(sessionDate, 'EEEE'),
        timeIn: editingSession.timeIn,
        timeOut: editingSession.timeOut,
        topicCovered: editingSession.topicCovered,
        homework: editingSession.homework || '',
        otherComments: editingSession.otherComments || '',
      });
    } else {
      resetForm();
    }
  }, [editingSession, isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      handleGetStudentList();
    }
  }, [isModalOpen]);

  return (
    <Modal
      visible={isModalOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="w-[100%] h-full flex justify-center items-center bg-black/50">
          <TouchableWithoutFeedback
            onPress={e => e.stopPropagation()}
            className="w-full"
          >
            <View
              className="w-[90%] max-h-[90%] bg-white rounded-3xl"
              style={{
                height: '90%',
                width: '90%',
              }}
            >
              {/* Header */}
              <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
                <Text
                  className="text-xl font-semibold text-gray-800"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  {editingSession ? 'Edit Session' : 'Add Session'}
                </Text>
                <TouchableOpacity
                  className="bg-gray-100 rounded-full p-2"
                  onPress={handleClose}
                  activeOpacity={0.7}
                >
                  <X size={20} color="#374151" />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
                contentContainerStyle={{ padding: 24 }}
              >
                {/* Student Selection */}
                <View className="mb-6">
                  <View className="flex-row items-center gap-2 mb-3">
                    <User size={18} color="#3B82F6" />
                    <Text className="text-lg font-medium text-gray-800" style={{ fontFamily: 'Poppins-Medium' }}>
                      Name of Student <Text className="text-red-500">*</Text>
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => setShowStudentDropdown(!showStudentDropdown)}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-2 px-3 flex-row items-center justify-between"
                  >
                    <Text className={`${selectedStudent ? 'text-gray-800' : 'text-gray-500'}`} style={{ fontFamily: 'Poppins-Regular' }}>
                      {selectedStudent ? selectedStudent.name : 'Select a student'}
                    </Text>
                    <Search size={20} color="#6B7280" />
                  </TouchableOpacity>

                  {/* Student Dropdown */}
                  {showStudentDropdown && (
                    <View className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48">
                      <View className="p-3 border-b border-gray-100">
                        <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-0">
                          <Search size={16} color="#6B7280" />
                          <TextInput
                            className="flex-1 ml-2 text-gray-800"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChangeText={handleSearchStudent}
                            style={{ fontFamily: 'Poppins-Regular' }}
                            placeholderTextColor={"#6B7280"}
                          />
                        </View>
                      </View>
                      <ScrollView className="max-h-32">
                        {filteredStudents.map((student) => (
                          <TouchableOpacity
                            key={student._id}
                            onPress={() => selectStudent(student)}
                            className={`p-3 border-b border-gray-100 ${
                              selectedStudent?._id === student._id ? 'bg-blue-50' : ''
                            }`}
                          >
                            <Text className="text-gray-800" style={{ fontFamily: 'Poppins-Regular' }}>
                              {student.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Date Selection */}
                <View className="mb-6">
                  <View className="flex-row items-center gap-2 mb-3">
                    <Calendar size={18} color="#3B82F6" />
                    <Text className="text-lg font-medium text-gray-800" style={{ fontFamily: 'Poppins-Medium' }}>
                      Date <Text className="text-red-500">*</Text>
                    </Text>
                  </View>
                  
                  <View className="flex-row gap-3 mb-3">
                    <TouchableOpacity
                      onPress={() => handleDateTypeChange('today')}
                      className={`flex-1 py-2 px-4 rounded-xl border ${
                        dateType === 'today' 
                          ? 'bg-blue-500 border-blue-400' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Text className={`text-center font-medium ${
                        dateType === 'today' ? 'text-white' : 'text-gray-700'
                      }`} style={{ fontFamily: 'Poppins-Medium' }}>
                        Today
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => handleDateTypeChange('yesterday')}
                      className={`flex-1 py-2 px-4 rounded-xl border ${
                        dateType === 'yesterday' 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Text className={`text-center font-medium ${
                        dateType === 'yesterday' ? 'text-white' : 'text-gray-700'
                      }`} style={{ fontFamily: 'Poppins-Medium' }}>
                        Yesterday
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-2 px-3 flex-row items-center justify-between"
                  >
                    <Text className="text-gray-800" style={{ fontFamily: 'Poppins-Regular' }}>
                      {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                    </Text>
                    <Calendar size={20} color="#6B7280" />
                  </TouchableOpacity>

                  {dateType === 'custom' && (
                    <Text className="text-sm text-blue-600 mt-2" style={{ fontFamily: 'Poppins-Regular' }}>
                      Day will be auto-filled
                    </Text>
                  )}
                </View>

                {/* Time In and Time Out */}
                <View className="mb-6">
                  <View className="flex-row gap-4">
                    {/* Time In */}
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-3">
                        <Clock size={18} color="#10B981" />
                        <Text className="text-lg font-medium text-gray-800" style={{ fontFamily: 'Poppins-Medium' }}>
                          Time In <Text className="text-red-500">*</Text>
                        </Text>
                      </View>
                      <View className="flex-row gap-2">
                        <TextInput
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2 px-3 text-center text-gray-800"
                          placeholder="HH"
                          value={timeInHour}
                          onChangeText={(value) => handleTimeChange('timeIn', 'hour', value)}
                          keyboardType="numeric"
                          maxLength={2}
                          style={{ fontFamily: 'Poppins-Regular' }}
                           placeholderTextColor={"#6B7280"}
                        />
                        <Text className="text-2xl text-gray-400 pt-3">:</Text>
                        <TextInput
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2 px-3 text-center text-gray-800"
                          placeholder="MM"
                          value={timeInMinute}
                          onChangeText={(value) => handleTimeChange('timeIn', 'minute', value)}
                          keyboardType="numeric"
                          maxLength={2}
                          style={{ fontFamily: 'Poppins-Regular' }}
                           placeholderTextColor={"#6B7280"}
                        />
                      </View>
                    </View>

                    {/* Time Out */}
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-3">
                        <Clock size={18} color="#EF4444" />
                        <Text className="text-lg font-medium text-gray-800" style={{ fontFamily: 'Poppins-Medium' }}>
                          Time Out <Text className="text-red-500">*</Text>
                        </Text>
                      </View>
                      <View className="flex-row gap-2">
                        <TextInput
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2 px-3 text-center text-gray-800"
                          placeholder="HH"
                          value={timeOutHour}
                          onChangeText={(value) => handleTimeChange('timeOut', 'hour', value)}
                          keyboardType="numeric"
                          maxLength={2}
                          style={{ fontFamily: 'Poppins-Regular' }}
                           placeholderTextColor={"#6B7280"}
                        />
                        <Text className="text-2xl text-gray-400 pt-3">:</Text>
                        <TextInput
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2 px-3 text-center text-gray-800"
                          placeholder="MM"
                          value={timeOutMinute}
                          onChangeText={(value) => handleTimeChange('timeOut', 'minute', value)}
                          keyboardType="numeric"
                          maxLength={2}
                          style={{ fontFamily: 'Poppins-Regular' }}
                           placeholderTextColor={"#6B7280"}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Topic Covered */}
                <View className="mb-6">
                  <View className="flex-row items-center gap-2 mb-3">
                    <Book size={18} color="#8B5CF6" />
                    <Text className="text-lg font-medium text-gray-800" style={{ fontFamily: 'Poppins-Medium' }}>
                      Topic Covered <Text className="text-red-500">*</Text>
                    </Text>
                  </View>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl p-2 px-3 text-gray-800"
                    placeholder="Describe the topics covered in this session..."
                    value={formData.topicCovered}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, topicCovered: text }))}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    style={{ fontFamily: 'Poppins-Regular' }}
                     placeholderTextColor={"#6B7280"}
                  />
                </View>

                {/* Homework */}
                <View className="mb-6">
                  <View className="flex-row items-center gap-2 mb-3">
                    <FileText size={18} color="#F59E0B" />
                    <Text className="text-lg font-medium text-gray-800" style={{ fontFamily: 'Poppins-Medium' }}>
                      Homework
                    </Text>
                  </View>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl p-2 px-3 text-gray-800"
                    placeholder="Assignments or tasks given to the student..."
                    value={formData.homework}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, homework: text }))}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    style={{ fontFamily: 'Poppins-Regular' }}
                     placeholderTextColor={"#6B7280"}
                  />
                </View>

                {/* Other Comments */}
                <View className="mb-6">
                  <View className="flex-row items-center gap-2 mb-3">
                    <MessageSquare size={18} color="#10B981" />
                    <Text className="text-lg font-medium text-gray-800" style={{ fontFamily: 'Poppins-Medium' }}>
                      Other Comments
                    </Text>
                  </View>
                  
                  {/* Tags */}
                  <View className="flex-row flex-wrap mb-3 gap-2">
                    {['Skills', 'Upcoming Tests', 'Strategy'].map((tag) => (
                      <TouchableOpacity
                        key={tag}
                        className="bg-blue-100 px-3 py-1 rounded-full mb-2"
                        onPress={() => {
                          const current = formData.otherComments;
                          const newText = current ? `${current}\n${tag}: ` : `${tag}: `;
                          setFormData(prev => ({ ...prev, otherComments: newText }));
                        }}
                      >
                        <Text className="text-blue-700 text-sm" style={{ fontFamily: 'Poppins-Medium' }}>
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl p-2 px-3 text-gray-800"
                    placeholder="Additional comments about skills, upcoming tests, strategies, or any other observations... (Optional)"
                    value={formData.otherComments}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, otherComments: text }))}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    style={{ fontFamily: 'Poppins-Regular' }}
                     placeholderTextColor={"#6B7280"}
                  />
                </View>
              </ScrollView>

              {/* Footer Buttons */}
              <View className="p-6 border-t border-gray-100">
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={handleClose}
                    className="flex-1 bg-gray-100 py-2 rounded-xl"
                  >
                    <Text className="text-center text-gray-700 font-semibold" style={{ fontFamily: 'Poppins-Medium' }}>
                      Clear Form
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-blue-500 py-2 rounded-xl flex-row items-center justify-center"
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text className="text-center text-white font-semibold" style={{ fontFamily: 'Poppins-Medium' }}>
                        {editingSession ? 'Update Session' : 'Add Session'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date Picker Modal */}
              <DatePicker
                modal
                theme='light'
                open={showDatePicker}
                date={selectedDate}
                mode="date"
                onConfirm={(date) => {
                  setShowDatePicker(false);
                  setSelectedDate(date);
                  setDateType('custom');
                  updateFormDate(date);
                }}
                onCancel={() => setShowDatePicker(false)}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddSessionModal;
