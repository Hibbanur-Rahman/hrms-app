import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import ProjectService from '../../services/ProjectService';
import { ArrowLeft, Bell, Calendar, User2 } from 'lucide-react-native';
import { formatDate } from '../../utils/dateTimeFormater';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AddProjectDialog from '../../components/addProjectModal';
import { RootStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInDown,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LoadingAnimation } from '../../components/LoadingAnimation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Projects = () => {
  const navigation = useNavigation<NavigationProp>();
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
    _id: '',
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
    team: [] as string[],
    coverImage: '',
  });

  const [editEndDateOpen, setEditEndDateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [employees, setEmployees] = useState<
    Array<{ _id: string; name: string; value: string; label: string }>
  >([]);

  // Animation values
  const searchOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-50);
  const fabScale = useSharedValue(0);

  console.log(currentUser);
  const [viewAll, setViewAll] = useState(false);
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  // Initialize animations
  useEffect(() => {
    headerTranslateY.value = withSpring(0, { damping: 15 });
    searchOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    fabScale.value = withDelay(400, withSpring(1, { damping: 12 }));
  }, []);

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
        setProjects(response?.data?.data?.reverse());
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

  const handleEditProject = async ({
    _id,
    name,
    description,
    startDate,
    endDate,
    status,
    team,
    coverImage,
  }: {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    team: string[];
    coverImage: any;
  }) => {
    try {
      setLoading(true);
      console.log('Editing project:', editProject);
      const payload = new FormData();
      payload.append('name', name);
      payload.append('description', description);
      payload.append('startDate', startDate);
      payload.append('endDate', endDate);
      payload.append('status', status);
      team.forEach(member => {
        payload.append('team', member);
      });
      console.log('Payload for editing project:', payload);
      const response = await ProjectService.UpdateProject(_id, payload);
      console.log(response);
      if (response.status === 200) {
        setIsCreateDialogOpen(false);
        setEditProject({
          _id: '',
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          status: '',
          team: [],
          coverImage: '',
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
      _id: project._id,
      name: project.name,
      description: project.description,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      status: project.status,
      team: selectedTeamIds,
      coverImage: project?.coverImage,
    });
    setIsCreateDialogOpen(true);
  };

  useFocusEffect(
    useCallback(() => {
      handleGetAllEmployees();
      handleGetAllProjects();
    }, [viewAll]),
  );

  const filteredProjects = projects?.filter((project: any) => {
    const search = searchTerm.toLowerCase();
    return (
      project?.name?.toLowerCase().includes(search) ||
      project?.description?.toLowerCase().includes(search)
    );
  });

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
  }));

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  // Animated Button Component
  const AnimatedButton = ({ children, onPress, style, ...props }: any) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const gesture = Gesture.Tap()
      .onBegin(() => {
        scale.value = withTiming(0.95, { duration: 100 });
      })
      .onFinalize(() => {
        scale.value = withTiming(1, { duration: 100 });
        runOnJS(onPress)();
      });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[animatedStyle, style]} {...props}>
          {children}
        </Animated.View>
      </GestureDetector>
    );
  };

  const ProjectCard = ({ project, index }: { project: any; index: number }) => {
    const cardScale = useSharedValue(1);
    const cardOpacity = useSharedValue(0);

    useEffect(() => {
      cardOpacity.value = withDelay(
        index * 100,
        withTiming(1, { duration: 800 }),
      );
    }, [index]);

    const cardAnimatedStyle = useAnimatedStyle(() => ({
      opacity: cardOpacity.value,
      transform: [
        { scale: cardScale.value },
        {
          translateY: interpolate(
            cardOpacity.value,
            [0, 1],
            [50, 0],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }));

    const handleCardPress = () => {
      cardScale.value = withSequence(
        withTiming(0.98, { duration: 100 }),
        withTiming(1, { duration: 100 }),
      );
    };

    return (
      <Animated.View
        style={cardAnimatedStyle}
        entering={FadeInDown.delay(index * 100).springify()}
      >
        <TouchableOpacity
          onPress={handleCardPress}
          activeOpacity={0.9}
          className="w-full flex flex-col items-start border border-gray-200 rounded-3xl p-0 overflow-hidden shadow-sm bg-white"
        >
          <View className="relative w-full">
            <ImageBackground
              source={{ uri: project?.coverImage }}
              className="flex-row items-center gap-2 justify-between w-full h-[150px]"
            >
              {/* Gradient Overlay */}
              <Animated.View
                entering={FadeIn.delay(200)}
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
              />

              {(currentUser?.role === 'admin' ||
                project?.createdBy?._id === currentUser?._id) && (
                <Animated.View
                  entering={SlideInRight.delay(300)}
                  className="absolute top-3 right-3 flex-row gap-2"
                >
                  <AnimatedButton
                    className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                    onPress={() => openEditDialog(project)}
                  >
                    <Feather name="edit-2" size={16} color="#4F46E5" />
                  </AnimatedButton>
                  <AnimatedButton
                    className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                    onPress={() => handleDeleteProject(project._id)}
                  >
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </AnimatedButton>
                </Animated.View>
              )}
            </ImageBackground>

            {/* Status Badge */}
            <Animated.View
              entering={FadeInUp.delay(400)}
              className="absolute bottom-3 left-3"
            >
              <View
                className={`px-3 py-1 rounded-full backdrop-blur-sm ${
                  project?.status === 'Active'
                    ? 'bg-green-100/90'
                    : project?.status === 'Completed'
                    ? 'bg-blue-100/90'
                    : project?.status === 'On Hold'
                    ? 'bg-yellow-100/90'
                    : 'bg-red-100/90'
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
            </Animated.View>
          </View>

          <Animated.View
            entering={FadeInDown.delay(500)}
            className="w-full flex flex-col items-start p-4 space-y-3"
          >
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
                {formatDate(project?.startDate)} -{' '}
                {formatDate(project?.endDate)}
              </Text>
            </View>

            <View className="w-full flex flex-row items-center justify-between gap-2 pt-2">
              <AnimatedButton
                className="flex-row items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5"
                onPress={() => {}}
              >
                <Feather name="eye" size={16} color="#4F46E5" />
                <Text
                  className="text-indigo-700 text-sm font-medium"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  View Details
                </Text>
              </AnimatedButton>

              <View className="flex-row items-center gap-3">
                <View className="flex flex-row -space-x-2">
                  {project.team?.slice(0, 3).map((member: any, index: any) => (
                    <Animated.View
                      key={`${project._id}-${member._id}-${index}`}
                      entering={FadeIn.delay(600 + index * 100)}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white flex items-center justify-center shadow-sm"
                    >
                      <Text
                        className="text-white text-xs font-medium"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        {member.name?.charAt(0).toUpperCase()}
                      </Text>
                    </Animated.View>
                  ))}
                  {project.team?.length > 3 && (
                    <Animated.View
                      entering={FadeIn.delay(900)}
                      className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center shadow-sm"
                    >
                      <Text
                        className="text-gray-600 text-xs font-medium"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        +{project.team.length - 3}
                      </Text>
                    </Animated.View>
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
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center px-4 py-3">
        {/* Header */}
        <View className=" w-full flex-row items-center justify-between">
          <TouchableOpacity
            className="flex-row items-center gap-2 bg-gray-100 rounded-full p-2"
            onPress={() => navigation.goBack()}
            style={{ backgroundColor: '#f3f4f6' }}
          >
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text
            className="text-gray-900 text-xl font-semibold"
            style={{ fontFamily: 'Poppins-SemiBold' }}
          >
            Projects
          </Text>
          <TouchableOpacity className="bg-gray-100 rounded-full p-2">
            <Bell size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/**search bar */}
        <Animated.View
          style={searchAnimatedStyle}
          className="w-full flex flex-row items-center gap-2 border border-gray-200 rounded-2xl p-2 py-1 mt-4 px-4"
        >
          <Feather name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search Projects..."
            placeholderTextColor="gray"
            className="flex-1 text-sm text-gray-700"
            style={{ fontFamily: 'Lexend-Regular' }}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300)}
          className="w-full flex flex-row items-center justify-between mt-4"
        >
          <View className="flex-row items-center gap-2">
            <Text
              className="text-gray-700 text-sm"
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              Projects
            </Text>
            <Animated.View
              entering={FadeIn.delay(400)}
              className="bg-indigo-100 rounded-full px-2 py-1"
            >
              <Text
                className="text-indigo-700 text-xs font-medium"
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                {projects?.length || 0}
              </Text>
            </Animated.View>
          </View>
          <Animated.View style={fabAnimatedStyle}>
            <AnimatedButton
              className="flex-row items-center gap-2 bg-indigo-600 rounded-2xl px-4 py-2 shadow-lg"
              onPress={() => {
                setEditProject({
                  _id: '',
                  name: '',
                  description: '',
                  startDate: '',
                  endDate: '',
                  status: '',
                  team: [],
                  coverImage: '',
                });
                setIsCreateDialogOpen(true);
              }}
            >
              <Feather name="plus" size={20} color="white" />
              <Text
                className="text-white text-sm font-medium"
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                Add Project
              </Text>
            </AnimatedButton>
          </Animated.View>
        </Animated.View>

        {/**projects list */}
        <View className="w-full flex flex-col gap-y-3 mt-4 h-full flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="w-full h-full flex-1"
            contentContainerStyle={{ gap: 16 }}
            scrollEnabled={true}
          >
            {loading ? (
              <LoadingAnimation
                type="skeleton"
                text="Loading your amazing projects..."
              />
            ) : filteredProjects?.length > 0 ? (
              filteredProjects.map((project: any, index: number) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={index}
                />
              ))
            ) : (
              <Animated.View
                entering={FadeInDown.delay(500)}
                className="flex-1 justify-center items-center py-20"
              >
                <Feather name="folder" size={48} color="#9CA3AF" />
                <Text
                  className="text-gray-700 text-lg font-medium mt-4"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  No projects found
                </Text>
                <Text
                  className="text-gray-500 text-sm mt-1"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  Create your first project to get started
                </Text>
              </Animated.View>
            )}
          </ScrollView>
        </View>
      </View>
      {isCreateDialogOpen && (
        <AddProjectDialog
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          employees={employees}
          handleCreateProject={handleCreateProject}
          loading={loading}
          setLoading={setLoading}
          editProject={editProject}
          handleEditProject={handleEditProject}
        />
      )}
    </SafeAreaView>
  );
};

export default Projects;
