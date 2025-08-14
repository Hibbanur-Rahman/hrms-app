import React, { useEffect, useState } from 'react';
import { 
  Modal, 
  ScrollView, 
  TouchableWithoutFeedback, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { 
  X, 
  User, 
  Phone, 
  Users, 
  GraduationCap, 
  School, 
  Hash, 
  Camera,
  Upload
} from 'lucide-react-native';
import DocumentPicker,{pick,types} from '@react-native-documents/picker';

interface AddStudentModalProps {
  onSubmit: (payload: FormData) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  editingStudent?: any;
  onClose?: () => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  loading,
  setLoading,
  onSubmit,
  editingStudent,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: 'Male',
    presentClass: '',
    curriculum: '',
    studentId: '',
    parentName: '',
    parentNumber: '',
    schoolName: '',
  });
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || '',
        phone: editingStudent.phone || '',
        gender: editingStudent.gender || 'Male',
        presentClass: editingStudent.presentClass || '',
        curriculum: editingStudent.curriculum || '',
        studentId: editingStudent.studentId || '',
        parentName: editingStudent.parentName || '',
        parentNumber: editingStudent.parentNumber || '',
        schoolName: editingStudent.schoolName || '',
      });
      if (editingStudent.image) {
        setSelectedImage({ uri: editingStudent.image });
      }
    } else {
      // Reset form for new student
      setFormData({
        name: '',
        phone: '',
        gender: 'Male',
        presentClass: '',
        curriculum: '',
        studentId: '',
        parentName: '',
        parentNumber: '',
        schoolName: '',
      });
      setSelectedImage(null);
    }
    setErrors({});
  }, [editingStudent, isModalOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const handleImagePicker = async () => {
    try {
      const result = await pick({
        type: [types.images],
        allowMultiSelection: false,
      });
      
      if (result && result[0]) {
        setSelectedImage({
          uri: result[0].uri,
          type: result[0].type,
          name: result[0].name,
        });
      }
    } catch (error: any) {
      if (error?.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('User cancelled image picker');
      } else {
        console.log('Error picking image:', error);
        Alert.alert('Error', 'Failed to pick image');
      }
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload = new FormData();
    
    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    // Append image if selected
    if (selectedImage && selectedImage.uri && !selectedImage.uri.startsWith('http')) {
      payload.append('image', {
        uri: selectedImage.uri,
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.name || 'student-image.jpg',
      } as any);
    }

    onSubmit(payload);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };

  return (
    <Modal
      visible={isModalOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="w-[100%] h-full flex justify-center items-center bg-black/50">
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()} className='w-full'>
            <View className="w-[90%] max-h-[90%] bg-white rounded-3xl" 
            style={{
                height:'90%',
                width:'90%'
            }}
            >
              {/* Header */}
              <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
                <Text 
                  className="text-xl font-semibold text-gray-800"
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                >
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
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
                {/* Image Upload */}
                <View className="items-center mb-6">
                  <TouchableOpacity
                    className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 items-center justify-center mb-3"
                    onPress={handleImagePicker}
                    activeOpacity={0.7}
                  >
                    {selectedImage ? (
                      <Image
                        source={{ uri: selectedImage.uri }}
                        className="w-full h-full rounded-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="items-center">
                        <Camera size={24} color="#9CA3AF" />
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleImagePicker} activeOpacity={0.7}>
                    <Text className="text-blue-500 font-medium" style={{ fontFamily: 'Poppins-Medium' }}>
                      {selectedImage ? 'Change Photo' : 'Add Photo'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View className="gap-4">
                  {/* Name */}
                  <View>
                    <Text className="text-gray-700 font-medium mb-2" style={{ fontFamily: 'Poppins-Medium' }}>
                      Full Name *
                    </Text>
                    <View className="flex-row items-center border border-gray-200  rounded-2xl p-1 px-4">
                      <User size={20} color="#9CA3AF" />
                      <TextInput
                        className="flex-1 ml-3 text-gray-700"
                        placeholderTextColor={"#9CA3AF"}
                        placeholder="Enter student's full name"
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        style={{ fontFamily: 'Poppins-Regular' }}
                      />
                    </View>
                    {errors.name && (
                      <Text className="text-red-500 text-sm mt-1" style={{ fontFamily: 'Poppins-Regular' }}>
                        {errors.name}
                      </Text>
                    )}
                  </View>

                  {/* Phone */}
                  <View>
                    <Text className="text-gray-700 font-medium mb-2" style={{ fontFamily: 'Poppins-Medium' }}>
                      Phone Number *
                    </Text>
                    <View className="flex-row items-center border border-gray-200  rounded-2xl p-1 px-4">
                      <Phone size={20} color="#9CA3AF" />
                      <TextInput
                        className="flex-1 ml-3 text-gray-700"
                        placeholderTextColor={"#9CA3AF"}
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        keyboardType="phone-pad"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      />
                    </View>
                    {errors.phone && (
                      <Text className="text-red-500 text-sm mt-1" style={{ fontFamily: 'Poppins-Regular' }}>
                        {errors.phone}
                      </Text>
                    )}
                  </View>

                  {/* Gender */}
                  <View>
                    <Text className="text-gray-700 font-medium mb-2" style={{ fontFamily: 'Poppins-Medium' }}>
                      Gender
                    </Text>
                    <View className="flex-row gap-3 mb-2">
                      {['Male', 'Female'].map((gender) => (
                        <TouchableOpacity
                          key={gender}
                          className={`flex-1 p-2 px-4 rounded-xl border ${
                            formData.gender === gender
                              ? 'border-blue-400 bg-blue-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                          onPress={() => handleInputChange('gender', gender)}
                          activeOpacity={0.7}
                        >
                          <Text
                            className={`text-center font-medium ${
                              formData.gender === gender ? 'text-blue-600' : 'text-gray-600'
                            }`}
                            style={{ fontFamily: 'Poppins-Medium' }}
                          >
                            {gender}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Student ID */}
                  <View>
                    <Text className="text-gray-700 font-medium mb-2" style={{ fontFamily: 'Poppins-Medium' }}>
                      Student ID *
                    </Text>
                    <View className="flex-row items-center border border-gray-200  rounded-2xl p-1 px-4">
                      <Hash size={20} color="#9CA3AF" />
                      <TextInput
                        className="flex-1 ml-3 text-gray-700"
                        placeholderTextColor={"#9CA3AF"}
                        placeholder="Enter student ID"
                        value={formData.studentId}
                        onChangeText={(value) => handleInputChange('studentId', value)}
                        style={{ fontFamily: 'Poppins-Regular' }}
                      />
                    </View>
                    {errors.studentId && (
                      <Text className="text-red-500 text-sm mt-1" style={{ fontFamily: 'Poppins-Regular' }}>
                        {errors.studentId}
                      </Text>
                    )}
                  </View>

                  {/* Present Class */}
                  <View>
                    <Text className="text-gray-700 font-medium mb-2" style={{ fontFamily: 'Poppins-Medium' }}>
                      Present Class
                    </Text>
                    <View className="flex-row items-center border border-gray-200  rounded-2xl p-1 px-4">
                      <GraduationCap size={20} color="#9CA3AF" />
                      <TextInput
                        className="flex-1 ml-3 text-gray-700"
                        placeholderTextColor={"#9CA3AF"}
                        placeholder="Enter class (e.g., 10th, 12th)"
                        value={formData.presentClass}
                        onChangeText={(value) => handleInputChange('presentClass', value)}
                        style={{ fontFamily: 'Poppins-Regular' }}
                      />
                    </View>
                  </View>

                  {/* Curriculum */}
                  <View>
                    <Text className="text-gray-700 font-medium mb-2" style={{ fontFamily: 'Poppins-Medium' }}>
                      Curriculum
                    </Text>
                    <View className="bg-white flex-row items-center border rounded-2xl p-1 px-4" style={{
                        borderColor:"#e5e7eb"
                    }}>
                      <GraduationCap size={20} color="#9CA3AF" />
                      <TextInput
                        className="flex-1 ml-3 text-gray-700"
                        placeholderTextColor={"#9CA3AF"}
                        placeholder="Enter curriculum (e.g., Science, Commerce)"
                        value={formData.curriculum}
                        onChangeText={(value) => handleInputChange('curriculum', value)}
                        style={{ fontFamily: 'Poppins-Regular' }}
                      />
                    </View>
                  </View>

                  {/* Parent Name */}
                  <View>
                    <Text className="text-gray-700 font-medium mb-2" style={{ fontFamily: 'Poppins-Medium' }}>
                      Parent Name
                    </Text>
                    <View className="flex-row items-center border border-gray-200  rounded-2xl p-1 px-4">
                      <Users size={20} color="#9CA3AF" />
                      <TextInput
                        className="flex-1 ml-3 text-gray-700"
                        placeholderTextColor={"#9CA3AF"}
                        placeholder="Enter parent's name"
                        value={formData.parentName}
                        onChangeText={(value) => handleInputChange('parentName', value)}
                        style={{ fontFamily: 'Poppins-Regular' }}
                      />
                    </View>
                  </View>

                  {/* Parent Number */}
                  <View>
                    <Text className="text-gray-700 font-medium mb-2" style={{ fontFamily: 'Poppins-Medium' }}>
                      Parent Number
                    </Text>
                    <View className="flex-row items-center border border-gray-200  rounded-2xl p-1 px-4">
                      <Phone size={20} color="#9CA3AF" />
                      <TextInput
                        className="flex-1 ml-3 text-gray-700"
                        placeholderTextColor={"#9CA3AF"}
                        placeholder="Enter parent's phone number"
                        value={formData.parentNumber}
                        onChangeText={(value) => handleInputChange('parentNumber', value)}
                        keyboardType="phone-pad"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      />
                    </View>
                  </View>

                  {/* School Name */}
                  <View>
                    <Text className="text-gray-700 font-medium mb-2" style={{ fontFamily: 'Poppins-Medium' }}>
                      School Name
                    </Text>
                    <View className="flex-row items-center border border-gray-200  rounded-2xl p-1 px-4">
                      <School size={20} color="#9CA3AF" />
                      <TextInput
                        className="flex-1 ml-3 text-gray-700"
                        placeholderTextColor={"#9CA3AF"}
                        placeholder="Enter school name"
                        value={formData.schoolName}
                        onChangeText={(value) => handleInputChange('schoolName', value)}
                        style={{ fontFamily: 'Poppins-Regular' }}
                      />
                    </View>
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  className={`mt-8 py-4 rounded-2xl ${
                    loading ? 'bg-gray-300' : 'bg-blue-500'
                  }`}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text className="text-white font-semibold ml-2" style={{ fontFamily: 'Poppins-SemiBold' }}>
                        {editingStudent ? 'Updating...' : 'Creating...'}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-white text-center font-semibold" style={{ fontFamily: 'Poppins-SemiBold' }}>
                      {editingStudent ? 'Update Student' : 'Add Student'}
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddStudentModal;
