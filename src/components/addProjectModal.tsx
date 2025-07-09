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
import { useSelector } from 'react-redux';
import ProjectService from '../services/ProjectService';
import { Calendar, User2 } from 'lucide-react-native';
import { formatDate } from '../utils/dateTimeFormater';
import DatePicker from 'react-native-date-picker';
import tw from 'twrnc';
import { useFocusEffect } from '@react-navigation/native';
import { MultiSelect } from 'react-native-element-dropdown';
import DocumentPicker, {
  DocumentPickerResponse,
  pick,
  types,
} from '@react-native-documents/picker';
import Password from '../../assets/images/dashboard-employee.png';

const AddProjectDialog = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  employees,
  handleCreateProject,
  loading,
  setLoading,
}: {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (value: boolean) => void;
  employees: any[];
  handleCreateProject: (payload: any) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [team, setTeam] = useState<string[]>([]);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [selectedFile, setSelectedFile] =
    useState<DocumentPickerResponse | null>(null);

  const handleFilePick = async () => {
    try {
      const [result] = await pick({
        type: [types.images],
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
                    Create New Project
                  </Text>
                  <Text
                    className="text-gray-700 text-sm mt-3"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Fill in the project details below to create a new project
                    and start collaborating with your team
                  </Text>
                  <View className="w-full flex flex-col gap-y-3 mt-4">
                    <View className="w-full flex flex-col">
                      <Text
                        className="text-gray-700 text-sm mb-2"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Project Name
                      </Text>
                      <TextInput
                        placeholder="Enter Project Name..."
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
                        Team Members
                      </Text>
                      <View className="w-full flex flex-row items-center gap-2">
                        <View className="w-full">
                          <View className="flex-row flex-wrap gap-2 mb-3">
                            {team.map((memberId, index) => {
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
                                      setTeam(prev =>
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
                            placeholder="Add team member..."
                            searchPlaceholder="Search..."
                            value={team}
                            onChange={item => {
                              console.log(item);
                              setTeam(item);
                            }}
                            renderItem={item => (
                              <View
                                style={tw`px-4 py-3 bg-white border-b border-gray-200 ${
                                  team.includes(item?.value)
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
                    </View>
                    <View className="w-full flex flex-col">
                      <Text
                        className="text-gray-700 text-sm mb-2"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Cover Image
                      </Text>
                      <View className="w-full flex flex-row items-center gap-2">
                        <TouchableOpacity
                          onPress={handleFilePick}
                          className="w-full flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-3"
                        >
                          <Feather name="image" size={20} color="gray" />
                          <Text className="text-gray-700 text-sm">
                            Upload Image
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {selectedFile?.uri && (
                        <View className="w-full h-[100px] object-cover rounded-2xl mt-4">
                          <Image
                            source={
                              selectedFile?.uri
                                ? { uri: selectedFile?.uri }
                                : Password
                            }
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        </View>
                      )}
                    </View>
                  </View>
                  <View className="w-full flex flex-row items-center justify-end gap-2 mt-4">
                    <TouchableOpacity
                      className=" flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-3"
                      onPress={() => {
                        setIsCreateDialogOpen(false);
                        setName('');
                        setDescription('');
                        setStartDate('');
                        setEndDate('');
                        setTeam([]);
                        setSelectedFile(null);
                      }}
                    >
                      <Text className="text-gray-700 text-sm">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className=" flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-3"
                      onPress={() =>
                        handleCreateProject({
                          name,
                          description,
                          startDate,
                          endDate,
                          team,
                          coverImage: selectedFile || null,
                        })
                      }
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


export default AddProjectDialog;