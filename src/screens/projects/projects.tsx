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
import ProjectService from '../../services/ProjectService';
import { Calendar, User2 } from 'lucide-react-native';
import { formatDate } from '../../utils/dateTimeFormater';
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

const Projects = () => {
  const currentUser = useSelector((state: any) => state.auth?.user);
  const [projects, setProjects] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    team: [] as string[],
  });
  const [editProject, setEditProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
    team: [] as string[],
  });

  const [editEndDateOpen, setEditEndDateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [employees, setEmployees] = useState<
    Array<{ _id: string; name: string; value: string; label: string }>
  >([]);

  console.log(currentUser);
  const [viewAll, setViewAll] = useState(false);
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];
  const handleGetAllEmployees = async () => {
    try {
      const response = await ProjectService.GetAllEmployees();
      console.log(response);
      if (response.status === 200) {
        const list = response?.data?.data;
        const listWithId = list.map((item: any) => ({
          ...item,
          value: item?._id,
          label: item?.name,
        }));
        setEmployees(listWithId);
      }
    } catch (error) {
      console.log('Error in fetching employees', error);
    }
  };

  const handleGetAllProjects = async () => {
    try {
      setLoading(true);
      const response = await ProjectService.GetAllProjects();
      console.log(response);
      if (response.status === 200) {
        setProjects(response?.data?.data);
      }
    } catch (error) {
      console.log('Error in fetching projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async ({
    name,
    description,
    startDate,
    endDate,
    team,
    coverImage,
  }: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    team: string[];
    coverImage: any;
  }) => {
    try {
      setLoading(true);
      const payload = new FormData();
      payload.append('name', name);
      payload.append('description', description);
      payload.append('startDate', startDate);
      payload.append('endDate', endDate);
      payload.append('coverImage', coverImage);
      console.log(team);
      team.forEach(member => {
        payload.append('team', member);
      });
      const response = await ProjectService.CreateProject(payload);
      console.log(response);
      if (response.status === 201) {
        setIsCreateDialogOpen(false);
        setNewProject({
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          team: [],
        });
        setLoading(false);
        handleGetAllProjects();
      }
    } catch (error) {
      console.log('Error in creating project', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await ProjectService.DeleteProject(id);
      console.log(response);
      if (response.status === 200) {
        handleGetAllProjects();
      }
    } catch (error) {
      console.log('Error in deleting project', error);
    }
  };
  const handleEditProject = async (id: string) => {
    try {
      setLoading(true);
      console.log('Editing project:', editProject);
      const payload = new FormData();
      payload.append('name', editProject.name);
      payload.append('description', editProject.description);
      payload.append('startDate', editProject?.startDate);
      payload.append('endDate', editProject.endDate);
      payload.append('status', editProject.status);
      editProject.team.forEach(member => {
        payload.append('team', member);
      });
      console.log('Payload for editing project:', payload);
      const response = await ProjectService.UpdateProject(id, payload);
      console.log(response);
      if (response.status === 200) {
        setIsEditDialogOpen(false);
        setEditProject({
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          status: '',
          team: [],
        });
        setEditEndDateOpen(false);
        setLoading(false);
        handleGetAllProjects();
      }
    } catch (error) {
      console.log('Error in editing project', error);
    } finally {
      setLoading(false);
    }
  };
  const openEditDialog = (project: any) => {
    const selectedTeamIds =
      project.team?.map((member: any) => member._id) || [];
    console.log('Selected team members for editing:', selectedTeamIds);
    setEditingProject(project);
    setEditProject({
      name: project.name,
      description: project.description,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      status: project.status,
      team: selectedTeamIds,
    });
    setIsEditDialogOpen(true);
  };

  useFocusEffect(
    useCallback(() => {
      handleGetAllEmployees();
      handleGetAllProjects();
    }, [viewAll]),
  );

  const ProjectCard = ({ project }: { project: any }) => {
    return (
      <View className="w-full flex flex-col items-start border border-gray-200 rounded-3xl p-0 overflow-hidden shadow-sm bg-white">
        <View className="relative w-full">
          <ImageBackground
            source={{ uri: project?.coverImage }}
            className="flex-row items-center gap-2 justify-between w-full h-[150px]"
          >
            <View className="absolute top-3 right-3 flex-row gap-2">
              <TouchableOpacity
                className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                onPress={() => openEditDialog(project)}
              >
                <Feather name="edit-2" size={16} color="#4F46E5" />
              </TouchableOpacity>
              <TouchableOpacity
                className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                onPress={() => handleDeleteProject(project._id)}
              >
                <Feather name="trash-2" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </ImageBackground>

          {/* Status Badge */}
          <View className="absolute bottom-3 left-3">
            <View
              className={`px-3 py-1 rounded-full ${
                project?.status === 'Active'
                  ? 'bg-green-100'
                  : project?.status === 'Completed'
                  ? 'bg-blue-100'
                  : project?.status === 'On Hold'
                  ? 'bg-yellow-100'
                  : 'bg-red-100'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  project?.status === 'Active'
                    ? 'text-green-700'
                    : project?.status === 'Completed'
                    ? 'text-blue-700'
                    : project?.status === 'On Hold'
                    ? 'text-yellow-700'
                    : 'text-red-700'
                }`}
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                {project?.status || 'Active'}
              </Text>
            </View>
          </View>
        </View>

        <View className="w-full flex flex-col items-start p-4 space-y-3">
          <View className="w-full">
            <Text
              className="text-gray-900 text-lg font-semibold mb-1"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              {project?.name}
            </Text>
            <View className="flex flex-row items-center gap-2 mb-2">
              <User2 size={16} color="#6B7280" />
              <Text
                className="text-gray-600 text-sm"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                Created by{' '}
                {project?.createdBy?.name ||
                  project?.createdBy?.username ||
                  project?.createdBy?.fullName ||
                  'Unknown'}
              </Text>
            </View>
          </View>

          <Text
            className="text-gray-600 text-sm leading-5"
            style={{ fontFamily: 'Poppins-Regular' }}
            numberOfLines={2}
          >
            {project?.description}
          </Text>

          <View className="w-full flex flex-row items-center gap-2">
            <Calendar size={16} color="#6B7280" />
            <Text
              className="text-gray-600 text-sm"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              {formatDate(project?.startDate)} - {formatDate(project?.endDate)}
            </Text>
          </View>

          <View className="w-full flex flex-row items-center justify-between gap-2 pt-2">
            <TouchableOpacity className="flex-row items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5">
              <Feather name="eye" size={16} color="#4F46E5" />
              <Text
                className="text-indigo-700 text-sm font-medium"
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                View Details
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center gap-3">
              <View className="flex flex-row -space-x-2">
                {project.team?.slice(0, 3).map((member: any, index: any) => (
                  <View
                    key={`${project._id}-${member._id}-${index}`}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white flex items-center justify-center shadow-sm"
                  >
                    <Text
                      className="text-white text-xs font-medium"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      {member.name?.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                ))}
                {project.team?.length > 3 && (
                  <View className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center shadow-sm">
                    <Text
                      className="text-gray-600 text-xs font-medium"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      +{project.team.length - 3}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                className="text-gray-500 text-xs"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                {project.team?.length || 0} member
                {(project.team?.length || 0) !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const AddProjectDialog = () => {
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1  items-center px-4 py-3">
        {/**header */}
        <View className="w-full flex flex-row items-center justify-between">
          <TouchableOpacity className="flex-row items-center gap-2 border border-gray-200 rounded-2xl p-2 py-1">
            <Feather name="arrow-left" size={20} color="gray" />
            <Text
              className="text-gray-700 text-sm"
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              Back
            </Text>
          </TouchableOpacity>
          <View>
            <Text
              className="text-gray-700 text-xl"
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              Projects
            </Text>
          </View>
          <View>
            <TouchableOpacity className="p-2 rounded-full border border-gray-300">
              <Feather name="bell" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        {/**search bar */}
        <View className="w-full flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-2 py-1 mt-4 px-4">
          <Feather name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search Projects..."
            placeholderTextColor="gray"
            className="flex-1 text-sm text-gray-700"
            style={{ fontFamily: 'Lexend-Regular' }}
          />
        </View>

        <View className="w-full flex flex-row items-center justify-between mt-4">
          <View className="flex-row items-center gap-2">
            <Text
              className="text-gray-700 text-sm"
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              Projects
            </Text>
            <Text
              className="text-gray-700 text-sm"
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              10
            </Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center gap-2 border border-gray-200 rounded-2xl p-2"
            onPress={() => setIsCreateDialogOpen(true)}
          >
            <Feather name="plus" size={20} color="gray" />
            <Text
              className="text-gray-700 text-sm"
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              Add Project
            </Text>
          </TouchableOpacity>
        </View>
        {/**projects list */}
        <View className="w-full flex flex-col gap-y-3 mt-4 h-full flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="w-full h-full flex-1"
            contentContainerStyle={{ gap: 16 }}
            scrollEnabled={true}
          >
            {loading ? (
              <ActivityIndicator size="large" color="blue" />
            ) : projects?.length > 0 ? (
              projects.map((project: any) => <ProjectCard project={project} />)
            ) : (
              <Text className="text-gray-700 text-sm">No projects found</Text>
            )}
          </ScrollView>
        </View>
      </View>
      {isCreateDialogOpen && <AddProjectDialog />}
    </SafeAreaView>
  );
};

export default Projects;
