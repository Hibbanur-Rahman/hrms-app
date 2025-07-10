import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { formatDate } from '../utils/dateTimeFormater';
import DocumentPicker, {
  DocumentPickerResponse,
  pick,
  types,
} from '@react-native-documents/picker';
import { FileSpreadsheet } from 'lucide-react-native';
import PDFPreview from './PDFPreview';

const AddLeaveApplicationModal = ({
  modalVisible,
  setModalVisible,
  handleSubmit,
  loading,
  setLoading,
}: {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (payload: any) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useSelector((state: any) => state.auth);
  const [leaveDateOpen, setLeaveDateOpen] = useState(false);
  const [leaveDates, setLeaveDates] = useState<string[]>([]);
  const [reasonForLeave, setReasonForLeave] = useState('');
  const [selectedFile, setSelectedFile] =
    useState<DocumentPickerResponse | null>(null);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);

  const handleFilePick = async () => {
    try {
      const [result] = await pick({
        type: [types.images, types.pdf],
        allowMultiSelection: false,
      });

      if (result && result.size && result.size > 10 * 1024 * 1024) {
        Alert.alert('Error', 'File size should not exceed 10MB');
        return;
      }
      console.log('Selected file result:', result);
      setSelectedFile(result);
      console.log('selectedFile state after setting:', result);
    } catch (err: any) {
      if (err.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('File selection canceled');
      } else {
        Alert.alert('Error', 'Error selecting file');
      }
    }
  };
  const onSubmit = () => {
    if (leaveDates.length === 0) {
      Alert.alert('Error', 'Please select at least one leave date');
      return;
    }
    if (!reasonForLeave) {
      Alert.alert('Error', 'Please provide a reason for leave');
      return;
    }
    const payload = new FormData();
    payload.append('employeeId', user?.employeeId);
    payload.append('name', user?.name);
    payload.append('email', user?.email);
    payload.append('mobile', user?.mobile);
    payload.append('leaveDays', leaveDates.length.toString());
    payload.append('reason', reasonForLeave);
    // payload.append('selectedDates', leaveDates);
    payload.append('selectedDates', JSON.stringify(leaveDates));

    payload.append('file', selectedFile);
    handleSubmit(payload);
  };
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      className="flex-1 justify-center items-center"
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View className="w-full h-full flex justify-center items-center bg-black/50">
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View className="w-[90%] h-[500px] bg-white rounded-3xl p-4">
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="w-full flex flex-col relative">
                  <TouchableOpacity
                    className="absolute  top-[10px] w-min z-10"
                    style={{
                      right: 10,
                    }}
                    onPress={() => setModalVisible(false)}
                  >
                    <Feather name="x" size={20} color="gray" />
                  </TouchableOpacity>
                  <Text
                    className="text-gray-700 text-xl"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Apply for Leave
                  </Text>
                  <Text
                    className="text-gray-700 text-sm mt-3"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Fill in the leave application details below to apply for a
                    leave
                  </Text>
                </View>
                <View className="w-full flex flex-col gap-y-3 mt-4">
                  <View className="w-full flex flex-col">
                    <Text
                      className="text-gray-700 text-sm mb-2"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Name
                    </Text>
                    <TextInput
                      value={user?.name}
                      editable={false}
                      placeholder="Enter Name..."
                      placeholderTextColor="gray"
                      className="text-gray-700 opacity-70 text-sm border border-gray-200 rounded-2xl p-3 w-full"
                      style={{ fontFamily: 'Lexend-Regular' }}
                    />
                  </View>
                  <View className="w-full flex flex-col">
                    <Text
                      className="text-gray-700 text-sm mb-2"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Email
                    </Text>
                    <TextInput
                      value={user?.email}
                      editable={false}
                      placeholder="Enter Email..."
                      placeholderTextColor="gray"
                      className="text-gray-700 opacity-70 text-sm border border-gray-200 rounded-2xl p-3 w-full"
                      style={{ fontFamily: 'Lexend-Regular' }}
                    />
                  </View>
                  <View className="w-full flex flex-row">
                    <View className="w-6/12 flex flex-col pr-2">
                      <View className="w-full flex flex-col">
                        <Text
                          className="text-gray-700 text-sm mb-2"
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          Mobile
                        </Text>
                        <TextInput
                          value={user?.mobile}
                          editable={false}
                          placeholder="Enter Mobile..."
                          placeholderTextColor="gray"
                          className="text-gray-700 opacity-70 text-sm border border-gray-200 rounded-2xl p-3 w-full"
                          style={{ fontFamily: 'Lexend-Regular' }}
                        />
                      </View>
                    </View>
                    <View className="w-6/12 flex flex-col pl-2">
                      <View className="w-full flex flex-col">
                        <Text
                          className="text-gray-700 text-sm mb-2"
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          Employee ID
                        </Text>
                        <TextInput
                          value={user?.employeeId}
                          editable={false}
                          placeholder="Enter Employee ID..."
                          placeholderTextColor="gray"
                          className="text-gray-700 opacity-70 text-sm border border-gray-200 rounded-2xl p-3 w-full"
                          style={{ fontFamily: 'Lexend-Regular' }}
                        />
                      </View>
                    </View>
                  </View>
                  <View className="w-full flex flex-col">
                    <Text
                      className="text-gray-700 text-sm mb-2"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Leave Dates
                    </Text>
                    <TouchableOpacity
                      className="w-full flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-3"
                      onPress={() => setLeaveDateOpen(true)}
                    >
                      <Feather name="calendar" size={20} color="gray" />
                      <DatePicker
                        modal
                        mode="date"
                        open={leaveDateOpen}
                        date={new Date()}
                        onConfirm={date => {
                          setLeaveDateOpen(false);
                          const selectedDate = date.toISOString().split('T')[0];

                          // Check if date is already selected
                          if (leaveDates.includes(selectedDate)) {
                            // Remove date if already selected
                            setLeaveDates(
                              leaveDates.filter(d => d !== selectedDate),
                            );
                          } else {
                            // Check if we haven't reached the limit (let's say 30 days max)
                            if (leaveDates.length >= 30) {
                              Alert.alert(
                                'Limit Reached',
                                'You can select up to 30 days for leave.',
                              );
                              return;
                            }
                            // Add new date
                            setLeaveDates([...leaveDates, selectedDate]);
                          }
                          console.log('Selected dates:', leaveDates);
                        }}
                        onCancel={() => {
                          setLeaveDateOpen(false);
                        }}
                        theme="light"
                      />
                      <Text className="text-gray-700 text-sm">
                        {leaveDates.length > 0
                          ? `${leaveDates.length} date(s) selected`
                          : 'Select Leave Dates'}
                      </Text>
                    </TouchableOpacity>

                    {/* Help text */}
                    <Text
                      className="text-gray-500 text-xs mt-2"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      Tap to select/deselect dates. You can select up to 30
                      days.
                    </Text>

                    {/* Display selected dates */}
                    {leaveDates.length > 0 && (
                      <View className="w-full mt-3">
                        <View className="flex flex-row items-center justify-between mb-2">
                          <Text
                            className="text-gray-700 text-sm"
                            style={{ fontFamily: 'Poppins-Medium' }}
                          >
                            Selected Dates:
                          </Text>
                          <TouchableOpacity
                            onPress={() => setLeaveDates([])}
                            className="flex flex-row items-center gap-1"
                          >
                            <Feather name="trash-2" size={14} color="#EF4444" />
                            <Text className="text-red-500 text-xs">
                              Clear All
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View className="flex flex-row flex-wrap gap-2">
                          {leaveDates.map((date, index) => (
                            <TouchableOpacity
                              key={index}
                              className="flex flex-row items-center gap-1 bg-blue-100 px-3 py-2 rounded-lg"
                              onPress={() => {
                                setLeaveDates(
                                  leaveDates.filter((_, i) => i !== index),
                                );
                              }}
                            >
                              <Text className="text-blue-700 text-xs">
                                {formatDate(date)}
                              </Text>
                              <Feather name="x" size={12} color="#1D4ED8" />
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                  <View className="w-full flex flex-col">
                    <Text
                      className="text-gray-700 text-sm mb-2"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Reason for Leave
                    </Text>
                    <TextInput
                      placeholder="Please provide a detailed reason for your leave request..."
                      placeholderTextColor="gray"
                      className="text-gray-700 text-sm border border-gray-200 rounded-2xl p-3 w-full "
                      style={{
                        fontFamily: 'Lexend-Regular',
                        textAlignVertical: 'top',
                        minHeight: 120,
                      }}
                      multiline={true}
                      numberOfLines={4}
                      value={reasonForLeave}
                      onChangeText={text => setReasonForLeave(text)}
                    />
                  </View>
                  <View className="w-full flex flex-col">
                    <Text
                      className="text-gray-700 text-sm mb-2"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Supporting Documents
                    </Text>
                    <TouchableOpacity
                      className="w-full flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-xl p-6 transition-colors"
                      onPress={handleFilePick}
                    >
                      {selectedFile ? (
                        selectedFile.type?.startsWith('image') ? (
                          <View className="w-full h-[100px] flex flex-col items-center justify-center mt-2">
                            <Image
                              source={{ uri: selectedFile.uri }}
                              className="w-full h-full rounded-2xl object-cover"
                            />
                            <Text className="text-gray-700 text-sm text-center mb-1 font-medium">
                              {selectedFile.name}
                            </Text>
                          </View>
                        ) : (
                          <View className="w-full h-[100px] flex flex-col items-center justify-center">
                            <FileSpreadsheet size={30} color="#3B82F6" />
                            <Text className="text-gray-700 text-sm text-center mb-1 font-medium">
                              {selectedFile.name}
                            </Text>
                            <TouchableOpacity
                              className=" flex flex-row items-center gap-2 mt-2"
                              onPress={e => {
                                console.log('selectedFile', selectedFile);
                                console.log('preview');
                                e.stopPropagation();
                                setPdfPreviewVisible(true);
                              }}
                            >
                              <Feather name="eye" size={16} color="#3B82F6" />
                              <Text className="text-blue-600 text-xs text-center">
                                Tap to preview
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )
                      ) : (
                        <>
                          <View className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                            <Feather name="upload" size={24} color="#3B82F6" />
                          </View>
                          <Text
                            className="text-gray-700 text-sm text-center mb-1 font-medium"
                            style={{ fontFamily: 'Poppins-Medium' }}
                          >
                            Upload Supporting Documents
                          </Text>
                          <Text
                            className="text-gray-500 text-xs text-center mb-2"
                            style={{ fontFamily: 'Poppins-Regular' }}
                          >
                            Drag and drop files here or click to browse
                          </Text>
                          <Text
                            className="text-gray-400 text-xs text-center"
                            style={{ fontFamily: 'Poppins-Regular' }}
                          >
                            Supported: JPG, PNG, PDF(Max 5MB)
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                  <View className="w-full flex flex-row items-center justify-end gap-2 mt-4">
                    <TouchableOpacity
                      className=" flex flex-row items-center gap-2 border border-gray-200 rounded-xl p-3 px-8 py-3"
                      onPress={() => {
                        setModalVisible(false);
                      }}
                    >
                      <Text className="text-gray-700 text-sm">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className=" flex flex-row items-center gap-2 border border-gray-200 rounded-xl p-3 px-8 py-3"
                      onPress={onSubmit}
                      disabled={loading}
                      style={{
                        opacity: loading ? 0.5 : 1,
                      }}
                    >
                      <Text className="text-gray-700 text-sm">Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* PDF Preview Modal */}
      {selectedFile &&
        selectedFile.type === 'application/pdf' &&
        selectedFile.uri && (
          <PDFPreview
            visible={pdfPreviewVisible}
            onClose={() => setPdfPreviewVisible(false)}
            fileUri={selectedFile.uri}
            fileName={selectedFile.name || 'PDF Document'}
          />
        )}
    </Modal>
  );
};

export default AddLeaveApplicationModal;
