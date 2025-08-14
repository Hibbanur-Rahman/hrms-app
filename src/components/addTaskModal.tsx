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
import { formatDate } from '../utils/dateTimeFormater';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import tw from 'twrnc';
const AddTaskModal = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  employees,
  onSubmit,
  loading,
  setLoading,
  editTask,
  handleEdit,
}: {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (value: boolean) => void;
  employees: any[];
  onSubmit: (payload: any) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  editTask: any;
  handleEdit: (payload: any) => void;
}) => {
  const [name, setName] = useState(editTask?.name || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [startDate, setStartDate] = useState(editTask?.startDate || '');
  const [endDate, setEndDate] = useState(editTask?.endDate || '');
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [assignee, setAssignee] = useState(editTask?.assignee || []);
  const [priority, setPriority] = useState(editTask?.priority || 'Medium');
  const [status, setStatus] = useState(editTask?.status || 'Active');

  const handleSubmit = useCallback(() => {
    if (!name || !description || !startDate || !endDate || !assignee.length) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    setLoading(true);
    const payload = {
      title: name,
      description,
      startDate,
      dueDate: endDate,
      assignee,
      priority:priority?.value,
      state: status?.value,
    };
    if (editTask?._id) {
      handleEdit({ ...payload, _id: editTask._id });
    } else {
      onSubmit(payload);
    }
    setIsCreateDialogOpen(false);
    setLoading(false);
  }, [
    name,
    description,
    startDate,
    endDate,
    assignee,
    priority,
    status,
    editTask,
    onSubmit,
    handleEdit,
    setLoading,
  ]);
  return (
    <Modal
      visible={isCreateDialogOpen}
      transparent={true}
      animationType="slide"
      className="flex-1 justify-center items-center"
      onRequestClose={() => setIsCreateDialogOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsCreateDialogOpen(false)}>
        <View className="w-full h-full flex justify-center items-center bg-black/50">
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View className="w-[90%] h-[500px] bg-white rounded-3xl p-4">
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="w-full flex flex-col relative">
                  <TouchableOpacity
                    className="absolute  top-[20px] w-min z-10"
                    style={{
                      right: 10,
                    }}
                    onPress={() => setIsCreateDialogOpen(false)}
                  >
                    <Feather name="x" size={20} color="gray" />
                  </TouchableOpacity>
                  <Text
                    className="text-gray-700 text-xl"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    {editTask?.name ? 'Edit Task' : 'Create New Task'}
                  </Text>
                  <Text
                    className="text-gray-700 text-sm mt-3"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    {editTask?.name
                      ? 'Update Project Details with filled fields and click submit to update the project'
                      : 'Fill in the project details below to create a new project and start collaborating with your team'}
                  </Text>

                  <View className="w-full flex flex-col gap-y-3 mt-4">
                    <View className="w-full flex flex-col">
                      <Text
                        className="text-gray-700 text-sm mb-2"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Task Name
                      </Text>
                      <TextInput
                        placeholder="Enter Task Name..."
                        placeholderTextColor="gray"
                        value={name}
                        onChangeText={text => setName(text)}
                        className="text-gray-700 text-sm border border-gray-200 rounded-2xl p-3 w-full"
                        style={{ fontFamily: 'Lexend-Regular' }}
                      />
                    </View>
                    <View className="w-full flex flex-col">
                      <Text
                        className="text-gray-700 text-sm mb-2"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Description
                      </Text>
                      <TextInput
                        placeholder="Enter task Description..."
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
                    <View className="w-full flex flex-col">
                      <Text
                        className="text-gray-700 text-sm mb-2"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Start Date
                      </Text>
                      <TouchableOpacity
                        className="w-full flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-3"
                        onPress={() => setStartDateOpen(true)}
                      >
                        <Feather name="calendar" size={20} color="gray" />
                        <DatePicker
                          modal
                          open={startDateOpen}
                          date={startDate ? new Date(startDate) : new Date()}
                          onConfirm={date => {
                            setStartDateOpen(false);
                            setStartDate(date.toISOString().split('T')[0]);
                            console.log(startDate);
                          }}
                          onCancel={() => {
                            setStartDateOpen(false);
                          }}
                          theme="light"
                        />
                        <Text className="text-gray-700 text-sm">
                          {startDate
                            ? formatDate(startDate)
                            : 'Select Start Date'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="w-full flex flex-col">
                      <Text
                        className="text-gray-700 text-sm mb-2"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        End Date
                      </Text>
                      <TouchableOpacity
                        className="w-full flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-3"
                        onPress={() => setEndDateOpen(true)}
                      >
                        <Feather name="calendar" size={20} color="gray" />
                        <DatePicker
                          modal
                          open={endDateOpen}
                          date={endDate ? new Date(endDate) : new Date()}
                          onConfirm={date => {
                            setEndDateOpen(false);
                            setEndDate(date.toISOString().split('T')[0]);
                            console.log(endDate);
                          }}
                          theme="light"
                        />
                        <Text className="text-gray-700 text-sm">
                          {endDate ? formatDate(endDate) : 'Select End Date'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="w-full flex flex-col">
                      <Text
                        className="text-gray-700 text-sm mb-2"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Assignees
                      </Text>
                      <View className="w-full flex flex-row items-center gap-2">
                        <View className="w-full">
                          <View className="flex-row flex-wrap gap-2 mb-3">
                            {assignee.map((memberId, index) => {
                              const member = employees.find(
                                emp => emp.value === memberId,
                              );
                              return member ? (
                                <View
                                  key={index}
                                  className="flex-row items-center bg-indigo-100 rounded-full px-3 py-1"
                                >
                                  <Text
                                    className="text-indigo-700 text-sm mr-2"
                                    style={{ fontFamily: 'Poppins-Medium' }}
                                  >
                                    {member?.label}
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() =>
                                      setAssignee(prev =>
                                        prev.filter(t => t !== memberId),
                                      )
                                    }
                                  >
                                    <Feather
                                      name="x"
                                      size={14}
                                      color="#4F46E5"
                                    />
                                  </TouchableOpacity>
                                </View>
                              ) : null;
                            })}
                          </View>
                          <MultiSelect
                            style={[
                              tw`w-full h-[46px] p-3 py-1 flex flex-row items-center text-white border border-[1px] border-gray-200 rounded-2xl bg-white`,
                            ]}
                            placeholderStyle={[
                              tw`text-[#A4A4A4] text-xs`,
                              { fontFamily: 'Lexend-Regular' },
                            ]}
                            containerStyle={tw`rounded-2xl bg-white border border-gray-200 overflow-hidden`}
                            selectedTextStyle={tw`bg-white text-gray-700`}
                            inputSearchStyle={tw`bg-white text-gray-700`}
                            iconStyle={tw``}
                            data={employees}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Add assignee..."
                            searchPlaceholder="Search..."
                            value={assignee}
                            onChange={item => {
                              console.log(item);
                              setAssignee(item);
                            }}
                            renderItem={item => (
                              <View
                                style={tw`px-4 py-3 bg-white border-b border-gray-200 ${
                                  assignee.includes(item?.value)
                                    ? 'bg-indigo-100'
                                    : 'bg-white'
                                }`}
                              >
                                <Text
                                  style={[
                                    tw`text-gray-700 text-base text-sm`,
                                    { fontFamily: 'Poppins-Regular' },
                                  ]}
                                >
                                  {item?.label}
                                </Text>
                              </View>
                            )}
                            renderSelectedItem={item => (
                              <View className="flex-row items-center"></View>
                            )}
                          />
                        </View>
                      </View>
                      <View className="w-full flex flex-col">
                        <Text
                          className="text-gray-700 text-sm mb-2"
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          Status
                        </Text>
                        <Dropdown
                          style={[
                            tw`w-full h-[46px] p-3 py-1 flex flex-row items-center text-white border border-[1px] border-gray-200 rounded-2xl bg-white text-xs`,
                          ]}
                          placeholderStyle={[
                            tw`text-[#A4A4A4] text-xs`,
                            { fontFamily: 'Lexend-Regular' },
                          ]}
                          containerStyle={tw`rounded-2xl bg-white border border-gray-200 overflow-hidden`}
                          selectedTextStyle={[
                            tw`bg-white text-gray-700 text-xs text-left`,
                            { fontFamily: 'Lexend-Regular' },
                          ]}
                          inputSearchStyle={tw`bg-white text-gray-700`}
                          iconStyle={tw``}
                          data={[
                            { value: 'todo', label: 'To do' },
                            { value: 'in-progress', label: 'In Progress' },
                            { value: 'on-hold', label: 'On Hold' },
                            { value: 'completed', label: 'Completed' },
                          ]}
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder="Select Status..."
                          searchPlaceholder="Search..."
                          value={status}
                          onChange={item => {
                            console.log(item);
                            setStatus(item);
                          }}
                          renderItem={item => (
                            <View
                              style={tw`px-4 py-3 bg-white border-b border-gray-200 bg-white`}
                            >
                              <Text
                                style={[
                                  tw`text-gray-700 text-base text-sm`,
                                  { fontFamily: 'Poppins-Regular' },
                                ]}
                              >
                                {item?.label}
                              </Text>
                            </View>
                          )}
                        />
                      </View>
                      <View className="w-full flex flex-col">
                        <Text
                          className="text-gray-700 text-sm mb-2"
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          Priority
                        </Text>
                        <Dropdown
                          style={[
                            tw`w-full h-[46px] p-3 py-1 flex flex-row items-center text-white border border-[1px] border-gray-200 rounded-2xl bg-white text-xs`,
                          ]}
                          placeholderStyle={[
                            tw`text-[#A4A4A4] text-xs`,
                            { fontFamily: 'Lexend-Regular' },
                          ]}
                          containerStyle={tw`rounded-2xl bg-white border border-gray-200 overflow-hidden`}
                          selectedTextStyle={[
                            tw`bg-white text-gray-700 text-xs text-left`,
                            { fontFamily: 'Lexend-Regular' },
                          ]}
                          inputSearchStyle={tw`bg-white text-gray-700`}
                          iconStyle={tw``}
                          data={[
                            { label: 'High', value: 'high' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'Low', value: 'low' },
                          ]}
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder="Select Priority..."
                          searchPlaceholder="Search..."
                          value={priority}
                          onChange={item => {
                            console.log(item);
                            setPriority(item);
                          }}
                          renderItem={item => (
                            <View
                              style={tw`px-4 py-3 bg-white border-b border-gray-200 bg-white`}
                            >
                              <Text
                                style={[
                                  tw`text-gray-700 text-base text-sm`,
                                  { fontFamily: 'Poppins-Regular' },
                                ]}
                              >
                                {item?.label}
                              </Text>
                            </View>
                          )}
                        />
                      </View>
                    </View>
                  </View>
                  <View className="w-full flex flex-row items-center justify-end gap-2 mt-4">
                    <TouchableOpacity
                      className=" flex flex-row items-center gap-2 border border-gray-200 rounded-xl p-3 px-8"
                      onPress={() => {
                        setIsCreateDialogOpen(false);
                        setName('');
                        setDescription('');
                        setStartDate('');
                        setEndDate('');
                        setAssignee([]);
                      }}
                    >
                      <Text className="text-gray-700 text-sm">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className=" flex flex-row items-center gap-2 border border-gray-200 rounded-xl p-3 px-8"
                      onPress={() => handleSubmit()}
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
    </Modal>
  );
};

export default AddTaskModal;
