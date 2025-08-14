import React, { useState } from 'react';
import { 
  Modal, 
  ScrollView, 
  TouchableWithoutFeedback, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Linking
} from 'react-native';
import { 
  X, 
  Upload, 
  FileText, 
  Download,
  AlertCircle,
  CheckCircle
} from 'lucide-react-native';
import DocumentPicker from '@react-native-documents/picker';

interface UploadStudentCSVModalProps {
  onSubmit: (payload: FormData) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const UploadStudentCSVModal: React.FC<UploadStudentCSVModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  loading,
  setLoading,
  onSubmit,
}) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.csv, DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      });
      
      if (result && result[0]) {
        // Validate file type
        const file = result[0];
        if (file.name && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
          setSelectedFile(file);
        } else {
          Alert.alert('Invalid File', 'Please select a CSV or Excel file');
        }
      }
    } catch (error: any) {
      if (error?.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('User cancelled file picker');
      } else {
        console.log('Error picking file:', error);
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      Alert.alert('No File Selected', 'Please select a CSV or Excel file to upload');
      return;
    }

    const payload = new FormData();
    payload.append('csvFile', {
      uri: selectedFile.uri,
      type: selectedFile.type,
      name: selectedFile.name,
    } as any);

    onSubmit(payload);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const downloadTemplate = (type: 'csv' | 'excel') => {
    // In a real app, you would implement the download functionality
    Alert.alert(
      'Download Template', 
      `${type.toUpperCase()} template download would be implemented here. The template includes columns: name, phone, gender, presentClass, curriculum, studentId, parentName, parentNumber, schoolName`
    );
  };

  return (
    <Modal
      visible={isModalOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="w-full h-full flex justify-center items-center bg-black/50">
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View className="w-[95%] bg-white rounded-3xl">
              {/* Header */}
              <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
                <Text 
                  className="text-xl font-semibold text-gray-800"
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                >
                  Upload Student Data
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
                {/* Instructions */}
                <View className="bg-blue-50 rounded-xl p-4 mb-6">
                  <View className="flex-row items-start">
                    <AlertCircle size={20} color="#3B82F6" />
                    <View className="flex-1 ml-3">
                      <Text className="text-blue-800 font-semibold mb-2" style={{ fontFamily: 'Poppins-SemiBold' }}>
                        Upload Instructions
                      </Text>
                      <Text className="text-blue-700 text-sm leading-5" style={{ fontFamily: 'Poppins-Regular' }}>
                        • Use the provided template to format your data{'\n'}
                        • Supported formats: CSV, Excel (.xlsx, .xls){'\n'}
                        • Required fields: name, phone, studentId{'\n'}
                        • Optional fields: gender, presentClass, curriculum, parentName, parentNumber, schoolName
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Download Templates */}
                <View className="mb-6">
                  <Text className="text-gray-700 font-semibold mb-3" style={{ fontFamily: 'Poppins-SemiBold' }}>
                    Download Template
                  </Text>
                  <View className="flex-row space-x-3">
                    <TouchableOpacity
                      className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 flex-row items-center justify-center"
                      onPress={() => downloadTemplate('csv')}
                      activeOpacity={0.7}
                    >
                      <FileText size={20} color="#22C55E" />
                      <Text className="text-green-600 font-medium ml-2" style={{ fontFamily: 'Poppins-Medium' }}>
                        CSV Template
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 flex-row items-center justify-center"
                      onPress={() => downloadTemplate('excel')}
                      activeOpacity={0.7}
                    >
                      <Download size={20} color="#3B82F6" />
                      <Text className="text-blue-600 font-medium ml-2" style={{ fontFamily: 'Poppins-Medium' }}>
                        Excel Template
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* File Upload */}
                <View className="mb-6">
                  <Text className="text-gray-700 font-semibold mb-3" style={{ fontFamily: 'Poppins-SemiBold' }}>
                    Select File
                  </Text>
                  
                  {selectedFile ? (
                    <View className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <CheckCircle size={20} color="#22C55E" />
                          <View className="ml-3 flex-1">
                            <Text className="text-green-800 font-medium" style={{ fontFamily: 'Poppins-Medium' }}>
                              {selectedFile.name}
                            </Text>
                            <Text className="text-green-600 text-sm" style={{ fontFamily: 'Poppins-Regular' }}>
                              {(selectedFile.size / 1024).toFixed(1)} KB
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          className="bg-green-100 rounded-lg p-2"
                          onPress={() => setSelectedFile(null)}
                          activeOpacity={0.7}
                        >
                          <X size={16} color="#22C55E" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center"
                      onPress={handleFilePicker}
                      activeOpacity={0.7}
                    >
                      <Upload size={32} color="#9CA3AF" />
                      <Text className="text-gray-600 font-medium mt-3" style={{ fontFamily: 'Poppins-Medium' }}>
                        Select CSV or Excel File
                      </Text>
                      <Text className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Poppins-Regular' }}>
                        Tap to browse files
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Sample Data Preview */}
                <View className="bg-gray-50 rounded-xl p-4 mb-6">
                  <Text className="text-gray-700 font-semibold mb-3" style={{ fontFamily: 'Poppins-SemiBold' }}>
                    Sample Data Format
                  </Text>
                  <View className="bg-white rounded-lg p-3">
                    <Text className="text-xs text-gray-600 font-mono leading-4" style={{ fontFamily: 'Courier' }}>
                      name,phone,gender,presentClass,curriculum,studentId,parentName,parentNumber,schoolName{'\n'}
                      John Doe,1234567890,Male,10th,Science,STU001,Robert Doe,1234567891,ABC High School{'\n'}
                      Jane Smith,2345678901,Female,12th,Commerce,STU002,Mary Smith,2345678902,XYZ Public School
                    </Text>
                  </View>
                </View>

                {/* Upload Button */}
                <TouchableOpacity
                  className={`py-4 rounded-xl ${
                    loading || !selectedFile ? 'bg-gray-300' : 'bg-green-500'
                  }`}
                  onPress={handleSubmit}
                  disabled={loading || !selectedFile}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text className="text-white font-semibold ml-2" style={{ fontFamily: 'Poppins-SemiBold' }}>
                        Uploading...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-white text-center font-semibold" style={{ fontFamily: 'Poppins-SemiBold' }}>
                      Upload Students Data
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

export default UploadStudentCSVModal;
