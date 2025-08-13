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
import Feather from 'react-native-vector-icons/Feather';

import { formatDate } from '../utils/dateTimeFormater';
import DatePicker from 'react-native-date-picker';
import tw from 'twrnc';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import DocumentPicker, {
  DocumentPickerResponse,
  pick,
  types,
} from '@react-native-documents/picker';
import { useSelector } from 'react-redux';
import { BrainCircuit, FileSpreadsheet, Trash2 } from 'lucide-react-native';
const AddExpenseModal = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  editExpense,
  handleSubmit,
  loading,
  setLoading,
}) => {
  const { user } = useSelector(state => state.auth);
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [dateOpen, setDateOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [expenses, setExpenses] = useState([
    {
      name: '',
      price: '',
      category: '',
    },
  ]);

  const expenseCategories = [
    { label: 'Transportation', value: 'Transportation' },
    { label: 'Accommodation', value: 'Accommodation' },
    { label: 'Meals', value: 'Meals' },
    { label: 'Software & Subscriptions', value: 'Software & Subscriptions' },
    { label: 'Medical & Health', value: 'Medical & Health' },
    { label: 'Courier & Postal', value: 'Courier & Postal' },
    { label: 'Utilities', value: 'Utilities' },
    { label: 'Other', value: 'Other' },
  ];

  // Add new expense item
  const addExpenseItem = () => {
    setExpenses([...expenses, { name: '', price: '', category: '' }]);
  };

  // Remove expense item
  const removeExpenseItem = (index) => {
    if (expenses.length > 1) {
      const updatedExpenses = expenses.filter((_, i) => i !== index);
      setExpenses(updatedExpenses);
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    return expenses.reduce((total, expense) => {
      const amount = parseFloat(expense.price) || 0;
      return total + amount;
    }, 0).toFixed(2);
  };

  // Reset form
  const resetForm = () => {
    setExpenseDate(new Date());
    setDescription('');
    setSelectedFiles([]);
    setExpenses([{ name: '', price: '', category: '' }]);
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    setIsCreateDialogOpen(false);
  };

  // Initialize form for editing
  useEffect(() => {
    if (editExpense && isCreateDialogOpen) {
      setExpenseDate(editExpense.date ? new Date(editExpense.date) : new Date());
      setDescription(editExpense.description || '');
      setExpenses(editExpense.expenses || [{ name: '', price: '', category: '' }]);
      setSelectedFiles([]);
    } else if (isCreateDialogOpen) {
      resetForm();
    }
  }, [editExpense, isCreateDialogOpen]);

  const handleFilePick = async () => {
    try {
      const results = await pick({
        type: [types.images, types.pdf],
        allowMultiSelection: true,
      });

      // Check file sizes
      for (const result of results) {
        if (result.size && result.size > 10 * 1024 * 1024) {
          Alert.alert('Error', `File ${result.name} size should not exceed 10MB`);
          return;
        }
      }

      console.log('Selected files:', results);
      setSelectedFiles(results);
      console.log('selectedFiles state after setting:', results);
    } catch (err) {
      if (err.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('File selection canceled');
      } else {
        Alert.alert('Error', 'Error selecting files');
      }
    }
  };

  // Remove selected file
  const removeFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  const onSubmit = () => {
    // Validate expenses
    if (expenses.length === 0) {
      Alert.alert('Error', 'Please add at least one expense item');
      return;
    }

    for (const expense of expenses) {
      if (!expense.name.trim() || !expense.price.trim() || !expense.category) {
        Alert.alert('Error', 'Please fill all expense details');
        return;
      }
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    const formData = new FormData();
    formData.append('employeeId', user?._id);
    formData.append('employeeName', user?.name || '');
    formData.append('employeeCode', user?.employeeId || '');
    formData.append('date', expenseDate.toISOString().split('T')[0]);
    formData.append('description', description);
    formData.append('expenses', JSON.stringify(expenses));
    formData.append('totalAmount', calculateTotal());

    // Append files
    selectedFiles.forEach((file, index) => {
      formData.append('files', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
    });

    handleSubmit(formData);
  };
  return (
    <Modal
      visible={isCreateDialogOpen}
      transparent={true}
      animationType="slide"
      className="flex-1 justify-center items-center"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="w-full h-full flex justify-center items-center bg-black/50">
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View className="w-[90%]  bg-white rounded-3xl p-4" style={{height:'75%'}}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="w-full flex flex-col relative">
                  <TouchableOpacity
                    className="absolute  top-[20px] w-min z-10"
                    style={{
                      right: 10,
                    }}
                    onPress={handleClose}
                  >
                    <Feather name="x" size={20} color="gray" />
                  </TouchableOpacity>

                  <Text
                    className="text-gray-700 text-xl"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    {editExpense?.name ? 'Edit Expense' : 'Create New Expense'}
                  </Text>
                  <Text
                    className="text-gray-700 text-sm mt-3"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    {editExpense?.name
                      ? 'Update Expense Details with filled fields and click submit to update the expense'
                      : 'Fill in the expense details below to create a new expense and start collaborating with your team'}
                  </Text>
                  <View className="w-full flex flex-col gap-y-3 mt-4">
                    <View className="w-full flex flex-col">
                      <Text
                        className="text-gray-700 text-sm mb-2"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Name
                      </Text>
                      <TextInput
                        placeholder="Enter Name..."
                        placeholderTextColor="gray"
                        value={user?.name}
                        editable={false}
                        className="text-gray-400 text-sm border border-gray-200 rounded-2xl p-3 w-full"
                        style={{ fontFamily: 'Lexend-Regular' }}
                      />
                    </View>
                    <View className="w-full flex flex-col">
                      <Text
                        className="text-gray-700 text-sm mb-2"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Employee ID
                      </Text>
                      <TextInput
                        placeholder="Enter Employee ID..."
                        placeholderTextColor="gray"
                        value={user?.employeeId}
                        editable={false}
                        className="text-gray-400 text-sm border border-gray-200 rounded-2xl p-3 w-full"
                        style={{ fontFamily: 'Lexend-Regular' }}
                      />
                    </View>
                    <View className="w-full flex flex-col">
                      <Text
                        className="text-gray-700 text-sm mb-2"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Date
                      </Text>
                      <TouchableOpacity
                        className="w-full flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-3"
                        onPress={() => setDateOpen(true)}
                      >
                        <Feather name="calendar" size={20} color="gray" />
                        <DatePicker
                          modal
                          mode="date"
                          open={dateOpen}
                          date={
                            expenseDate ? new Date(expenseDate) : new Date()
                          }
                          onConfirm={date => {
                            setDateOpen(false);
                            const selectedDate = date
                              .toISOString()
                              .split('T')[0];
                            setExpenseDate(selectedDate);
                            console.log('Selected date:', selectedDate);
                          }}
                          onCancel={() => {
                            setDateOpen(false);
                          }}
                          theme="light"
                        />
                        <Text className="text-gray-700 text-sm">
                          {expenseDate
                            ? formatDate(expenseDate)
                            : 'Select Date'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="w-full flex flex-col">
                      <Text
                        className="text-gray-700 text-sm mb-2"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Description
                      </Text>
                      <TextInput
                        placeholder="Enter Project Description..."
                        placeholderTextColor="gray"
                        className="text-gray-700 text-sm border border-gray-200 rounded-2xl p-3 w-full "
                        style={{
                          fontFamily: 'Lexend-Regular',
                          textAlignVertical: 'top',
                          minHeight: 120,
                        }}
                        multiline={true}
                        numberOfLines={4}
                        value={description}
                        onChangeText={text => setDescription(text)}
                      />
                    </View>
                    <View className="w-full flex flex-row justify-between items-center">
                      <Text
                        className="text-gray-700 text-sm mb-2"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Expense Details
                      </Text>
                      <TouchableOpacity
                        className="bg-blue-500 rounded-full px-4 py-2"
                        onPress={addExpenseItem}
                      >
                        <Text className="text-white text-xs">+ Add Item</Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      {expenses.map((expense, index) => (
                        <View key={index} className="border border-gray-200 rounded-xl p-4 mb-3">
                          <View className="w-full flex flex-row justify-between items-center mb-3">
                            <Text
                              className="text-gray-700 text-sm font-medium"
                              style={{ fontFamily: 'Poppins-Medium' }}
                            >
                              Expense Item {index + 1}
                            </Text>
                            {expenses.length > 1 && (
                              <TouchableOpacity
                                onPress={() => removeExpenseItem(index)}
                                className="p-2"
                              >
                                <Trash2 size={16} color="#ef4444" />
                              </TouchableOpacity>
                            )}
                          </View>
                          
                          <View className="w-full flex flex-col mb-3">
                            <Text
                              className="text-gray-700 text-sm mb-2"
                              style={{ fontFamily: 'Poppins-Medium' }}
                            >
                              Expense Name
                            </Text>
                            <TextInput
                              placeholder="Enter Expense Name..."
                              placeholderTextColor="gray"
                              value={expense?.name}
                              onChangeText={text => {
                                const updatedExpenses = [...expenses];
                                updatedExpenses[index].name = text;
                                setExpenses(updatedExpenses);
                              }}
                              className="text-gray-700 text-sm border border-gray-200 rounded-2xl p-3 w-full"
                              style={{ fontFamily: 'Lexend-Regular' }}
                            />
                          </View>
                          
                          <View className="w-full flex flex-col mb-3">
                            <Text
                              className="text-gray-700 text-sm mb-2"
                              style={{ fontFamily: 'Poppins-Medium' }}
                            >
                              Amount
                            </Text>
                            <TextInput
                              placeholder="Enter Price..."
                              placeholderTextColor="gray"
                              value={expense?.price}
                              keyboardType="numeric"
                              onChangeText={text => {
                                const updatedExpenses = [...expenses];
                                updatedExpenses[index].price = text;
                                setExpenses(updatedExpenses);
                              }}
                              className="text-gray-700 text-sm border border-gray-200 rounded-2xl p-3 w-full"
                              style={{ fontFamily: 'Lexend-Regular' }}
                            />
                          </View>
                          
                          <View className="w-full flex flex-col">
                            <Text
                              className="text-gray-700 text-sm mb-2"
                              style={{ fontFamily: 'Poppins-Medium' }}
                            >
                              Category
                            </Text>
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
                              data={expenseCategories}
                              maxHeight={300}
                              renderLeftIcon={() => (
                                <BrainCircuit
                                  size={18}
                                  color="#6b7280"
                                  style={{ marginRight: 8 }}
                                />
                              )}
                              labelField="label"
                              valueField="value"
                              placeholder="Select Category"
                              value={expense?.category}
                              onChange={item => {
                                const updatedExpenses = [...expenses];
                                updatedExpenses[index].category = item.value;
                                setExpenses(updatedExpenses);
                              }}
                              renderItem={item => (
                                <View className="px-4 py-3 border-b border-gray-100">
                                  <Text
                                    className="text-gray-700 text-sm"
                                    style={{ fontFamily: 'Poppins-Regular' }}
                                  >
                                    {item.label}
                                  </Text>
                                </View>
                              )}
                            />
                          </View>
                        </View>
                      ))}
                      
                      {/* Total Amount Display */}
                      <View className="w-full flex flex-row justify-between items-center bg-gray-50 rounded-xl p-4 mb-4">
                        <Text
                          className="text-gray-700 text-lg font-medium"
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          Total Amount:
                        </Text>
                        <Text
                          className="text-blue-600 text-lg font-bold"
                          style={{ fontFamily: 'Poppins-Bold' }}
                        >
                          ₹{calculateTotal()}
                        </Text>
                      </View>
                    </View>
                    <View className="w-full flex flex-col">
                      <Text
                        className="text-gray-700 text-sm mb-2"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Supporting Documents
                      </Text>
                      
                      {/* File Upload Area */}
                      <TouchableOpacity
                        className="w-full flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-xl p-6 transition-colors mb-3"
                        onPress={handleFilePick}
                      >
                        <View className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                          <Feather
                            name="upload"
                            size={24}
                            color="#3B82F6"
                          />
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
                          Tap to browse and select files
                        </Text>
                        <Text
                          className="text-gray-400 text-xs text-center"
                          style={{ fontFamily: 'Poppins-Regular' }}
                        >
                          Supported: JPG, PNG, PDF (Max 10MB each)
                        </Text>
                      </TouchableOpacity>

                      {/* Selected Files Display */}
                      {selectedFiles.length > 0 && (
                        <View className="w-full">
                          <Text
                            className="text-gray-700 text-sm mb-2"
                            style={{ fontFamily: 'Poppins-Medium' }}
                          >
                            Selected Files ({selectedFiles.length})
                          </Text>
                          {selectedFiles.map((file, index) => (
                            <View
                              key={index}
                              className="w-full flex flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-3 mb-2"
                            >
                              <View className="flex flex-row items-center flex-1">
                                {file.type?.startsWith('image') ? (
                                  <View className="w-10 h-10 mr-3">
                                    <Image
                                      source={{ uri: file.uri }}
                                      className="w-full h-full rounded-lg object-cover"
                                    />
                                  </View>
                                ) : (
                                  <View className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <FileSpreadsheet size={20} color="#3B82F6" />
                                  </View>
                                )}
                                <View className="flex-1">
                                  <Text
                                    className="text-gray-700 text-sm font-medium"
                                    style={{ fontFamily: 'Poppins-Medium' }}
                                    numberOfLines={1}
                                  >
                                    {file.name}
                                  </Text>
                                  <Text
                                    className="text-gray-500 text-xs"
                                    style={{ fontFamily: 'Poppins-Regular' }}
                                  >
                                    {file.size ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Unknown size'}
                                  </Text>
                                </View>
                              </View>
                              
                              <View className="flex flex-row items-center">
                                {!file.type?.startsWith('image') && (
                                  <TouchableOpacity
                                    className="p-2 mr-2"
                                    onPress={() => setPdfPreviewVisible(true)}
                                  >
                                    <Feather name="eye" size={16} color="#3B82F6" />
                                  </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                  className="p-2"
                                  onPress={() => removeFile(index)}
                                >
                                  <Feather name="x" size={16} color="#ef4444" />
                                </TouchableOpacity>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                    <View className="w-full flex flex-row items-center justify-end gap-2 mt-4">
                      <TouchableOpacity
                        className=" flex flex-row items-center gap-2 border border-gray-200 rounded-xl p-3 px-8 py-3"
                        onPress={handleClose}
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
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddExpenseModal;
