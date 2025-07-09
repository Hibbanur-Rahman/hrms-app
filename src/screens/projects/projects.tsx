import { useEffect, useState } from 'react';
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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import ProjectService from '../../services/ProjectService';
import { Calendar, User2 } from 'lucide-react-native';
import { formatDate } from '../../utils/dateTimeFormater';

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
    team: [],
  });
  const [editProject, setEditProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
    team: [],
  });
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [editEndDateOpen, setEditEndDateOpen] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [employees, setEmployees] = useState([]);

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
        setEmployees(response?.data?.data);
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

  const handleCreateProject = async () => {
    try {
      setLoading(true);
      const payload = new FormData();
      payload.append('name', newProject.name);
      payload.append('description', newProject.description);
      payload.append('startDate', newProject.startDate);
      payload.append('endDate', newProject.endDate);
      payload.append('coverImage', coverImage);
      console.log(newProject.team);
      newProject.team.forEach(member => {
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
        setCoverImage(null);
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

  useEffect(() => {
    handleGetAllEmployees();
    handleGetAllProjects();
  }, [viewAll]);

  const ProjectCard = ({ project }: { project: any }) => {
    return (
      <View className="w-full flex flex-col items-start border border-gray-200 rounded-3xl p-0 overflow-hidden">
        <ImageBackground
          source={{ uri: project?.coverImage }}
          className="flex-row items-center gap-2 justify-between w-full h-[150px]"
        ></ImageBackground>
        <View className="w-full flex flex-col items-start p-4">
          <Text
            className="text-gray-700 text-sm"
            style={{ fontFamily: 'Poppins-Medium' }}
          >
            {project?.name}
          </Text>
          <View className="w-full flex flex-row items-center gap-2">
            <User2 size={20} color="gray" />
            <Text
              className="text-gray-700 text-sm"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              Created by{' '}
              {project?.createdBy?.name ||
                project?.createdBy?.username ||
                project?.createdBy?.fullName ||
                'Unknown'}
            </Text>
          </View>
          <Text
            className="text-gray-700 text-sm"
            style={{ fontFamily: 'Poppins-Regular' }}
          >
            {project?.description}
          </Text>
          <View className="w-full flex flex-row items-center gap-2">
            <Calendar size={20} color="gray" />
            <Text
              className="text-gray-700 text-sm"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              {formatDate(project?.startDate)} - {formatDate(project?.endDate)}
            </Text>
          </View>
          <View className="w-full flex flex-row items-center  justify-between gap-2">
            <TouchableOpacity className="flex-row items-center gap-2 border border-gray-200 rounded-2xl p-2">
              <Feather name="eye" size={20} color="gray" />
              <Text
                className="text-gray-700 text-sm"
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                View Details
              </Text>
            </TouchableOpacity>
            <View className="flex-row items-center gap-2">
              <View className="flex flex-row  mr-2">
                {project.team?.slice(0, 3).map((member: any, index: any) => (
                  <TouchableOpacity
                    key={project.team._id}
                    className="w-8 h-8 rounded-full bg-violet-600 border-2 border-white flex items-center justify-center  transition-transform "
                  >
                    <Text
                      className="text-white text-xs"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      {member.name?.charAt(0).toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
                {project.team?.length > 3 && (
                  <View className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium ">
                    <Text
                      className="text-gray-700 text-xs"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      +{project.team.length - 3}
                    </Text>
                  </View>
                )}
              </View>
              <View className="text-xs text-gray-500">
                <Text
                  className="text-gray-700 text-xs"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  {project.team?.length || 0} member
                  {(project.team?.length || 0) !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const AddProjectDialog = () => {
    return (
      <Modal
        visible={isCreateDialogOpen}
        transparent={true}
        animationType="fade"
        className="flex-1 justify-center items-center"
        onRequestClose={() => setIsCreateDialogOpen(false)}
      >
        <View className="w-full h-full flex justify-center items-center bg-black/50">
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
                  Fill in the project details below to create a new project and
                  start collaborating with your team
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
                      value={newProject.name}
                      onChangeText={text =>
                        setNewProject({ ...newProject, name: text })
                      }
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
                      value={newProject.description}
                      onChangeText={text =>
                        setNewProject({ ...newProject, description: text })
                      }
                    />
                  </View>
                  <View className="w-full flex flex-col">
                    <Text
                      className="text-gray-700 text-sm mb-2"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Start Date
                    </Text>
                    <TouchableOpacity className="w-full flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-3">
                      <Text className="text-gray-700 text-sm">
                        {formatDate(newProject.startDate)}
                      </Text>
                      <Feather name="calendar" size={20} color="gray" />
                    </TouchableOpacity>
                  </View>
                  <View className="w-full flex flex-col">
                    <Text
                      className="text-gray-700 text-sm mb-2"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      End Date
                    </Text>
                    <TouchableOpacity className="w-full flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-3">
                      <Text className="text-gray-700 text-sm">
                        {formatDate(newProject.endDate)}
                      </Text>
                      <Feather name="calendar" size={20} color="gray" />
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
                      
                    </View>
                  </View>
                </View>
                <View className="w-full flex flex-row items-center justify-end gap-2 mt-4">
                  <TouchableOpacity className=" flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-3">
                    <Text className="text-gray-700 text-sm">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className=" flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-3">
                    <Text className="text-gray-700 text-sm">Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
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
