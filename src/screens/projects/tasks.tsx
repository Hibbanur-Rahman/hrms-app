import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
  Dimensions,
  Linking,
  Modal,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import tw from 'twrnc';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInRight,
  Layout,
} from 'react-native-reanimated';
import {
  ArrowLeft,
  Bell,
  Calendar,
  Search,
  Filter,
  Clock,
  User,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  File,
  Plus,
  MoreVertical,
  Users,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  BarChart3,
  TrendingUp,
  Edit3,
  Trash2,
  Eye,
  UserCheck,
  Calendar as CalIcon,
  Target,
  Zap,
  RefreshCw,
  SortAsc,
  SortDesc,
} from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ProjectService from '../../services/ProjectService';
import { set } from 'date-fns';
import AddTaskModal from '../../components/addTaskModal';
import TaskService from '../../services/TaskService';
import { formatDate as utilFormatDate } from '../../utils/dateTimeFormater';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Task {
  _id: string;
  title: string;
  description: string;
  project: string;
  assignee: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  ownerRole: string;
  owner: {
    _id: string;
    email: string;
  };
  startDate: string;
  dueDate: string;
  state: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  parentTask: string | null;
  subtasks: string[];
  isSubtask: boolean;
  comments: Array<{
    content: string;
    authorRole: string;
    author: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
  }>;
  activityLog: Array<{
    action: string;
    performedByRole: string;
    performedBy: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

interface TaskCounts {
  all: number;
  todo: number;
  'in-progress': number;
  completed: number;
}

const { width: screenWidth } = Dimensions.get('window');

const Tasks = ({ route }: { route: any }) => {
  const navigation = useNavigation<NavigationProp>();
  const { projectId } = route?.params;
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [taskCounts, setTaskCounts] = useState<TaskCounts>({
    all: 0,
    todo: 0,
    'in-progress': 0,
    completed: 0,
  });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [limit, setLimit] = useState(10);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchFocused, setSearchFocused] = useState(false);
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(
    null,
  );

  // Animation values
  const headerOpacity = useSharedValue(0);
  const searchHeight = useSharedValue(0);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([handleGetProjectDetails(), handleGetTasks()]);
    setRefreshing(false);
  }, []);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      { translateY: interpolate(headerOpacity.value, [0, 1], [20, 0]) },
    ],
  }));

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    height: searchHeight.value,
    opacity: interpolate(searchHeight.value, [0, 60], [0, 1]),
  }));

  //handle get project details
  const handleGetProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await ProjectService.GetProjectById(projectId);
      console.log('Project details:', response);
      if (response?.status === 200) {
        const members = response?.data?.data?.team?.map((member: any) => ({
          label: member?.name,
          value: member?._id,
        }));
        setTeamMembers(members);
        setProjectDetails(response?.data?.data);
      }
    } catch (error) {
      console.log('Error in fetching project details', error);
    } finally {
      setLoading(false);
    }
  };

  //handle get tasks
  const handleGetTasks = async () => {
    try {
      const response = await ProjectService.GetProjectTasks({
        id: projectId,
        page,
        limit,
        search,
        status: activeFilter === 'all' ? '' : activeFilter,
        priority,
      });

      console.log('Tasks response:', response);
      if (response?.status === 200) {
        setTasks(response?.data?.data?.tasks);
        setPagination(response?.data?.data?.pagination);
        setTaskCounts(response?.data?.data?.counts);
      }
    } catch (error) {
      console.log('Error in fetching tasks', error);
    }
  };

  //handle create tasks
  const handleCreateTask = async (taskData: any) => {
    try {
      const payload = { ...taskData, projectId };
      const response = await TaskService.CreateTask(payload);
      if (response?.status === 201) {
        console.log('Task created successfully:', response.data);
        await handleGetTasks();
        setCreateModalOpen(false);
      }
    } catch (error) {
      console.log('Error in creating task', error);
    }
  };

  //handle edit task
  const handleEditTask = async (payload: any) => {
    try {
      const id = selectedTask?._id;
      if (!id) return;
      const response = await TaskService.UpdateTask(id, payload);
      if (response?.status === 200) {
        console.log('Task edited successfully:', response.data);
        await handleGetTasks();
        setSelectedTask(null);
      }
    } catch (error) {
      console.log('Error in editing task', error);
    }
  };

  // Handle task state update
  const handleTaskStateUpdate = async (taskId: string, newState: string) => {
    try {
      const response = await TaskService.UpdateTaskState(taskId, {
        state: newState,
      });
      if (response?.status === 200) {
        await handleGetTasks();
      }
    } catch (error) {
      console.log('Error updating task state:', error);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  // Handle search
  const handleSearch = (text: string) => {
    setSearch(text);
    setPage(1);
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  // Get state color
  const getStateColor = (state: string) => {
    switch (state) {
      case 'completed':
        return '#10B981';
      case 'in-progress':
        return '#3B82F6';
      case 'todo':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  // Get state icon
  const getStateIcon = (state: string) => {
    switch (state) {
      case 'completed':
        return CheckCircle;
      case 'in-progress':
        return Clock;
      case 'todo':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Check if task is overdue
  const isOverdue = (dueDate: string, state: string) => {
    if (state === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  useEffect(() => {
    handleGetTasks();
  }, [page, activeFilter, priority, sortBy, sortOrder, search]);

  useFocusEffect(
    useCallback(() => {
      handleGetProjectDetails();
      handleGetTasks();
    }, []),
  );
  // Render Task Card Component
  const TaskCard = ({ task, index }: { task: Task; index: number }) => {
    const StateIcon = getStateIcon(task.state);
    const isTaskOverdue = isOverdue(task.dueDate, task.state);

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100).springify()}
        layout={Layout.springify()}
        className="bg-white rounded-xl shadow-sm border border-gray-100 mb-3 overflow-hidden"
      >
        {/* Priority Bar */}
        <View
          style={[
            { height: 4, width: '100%' },
            { backgroundColor: getPriorityColor(task.priority) },
          ]}
        />

        <TouchableOpacity
          className="p-4"
          onPress={() => {
            navigation.navigate('TaskDetails', { taskId: task._id });
          }}
          activeOpacity={0.8}
        >
          {/* Header */}
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <Text
                style={[{ fontFamily: 'Poppins-SemiBold' }]}
                className="text-gray-900 text-base font-semibold mb-1"
                numberOfLines={2}
              >
                {task.title}
              </Text>
              <Text
                style={[{ fontFamily: 'Poppins-Regular' }]}
                className="text-gray-600 text-sm"
                numberOfLines={2}
              >
                {task.description}
              </Text>
            </View>

            <TouchableOpacity
              className="bg-gray-50 rounded-full p-2"
              onPress={() => {
                setSelectedTask(task);
                setCreateModalOpen(true);
              }}
            >
              <MoreVertical size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Status and Priority */}
          <View className="flex-row items-center mb-3">
            <View
              style={[{ backgroundColor: `${getStateColor(task.state)}20` }]}
              className="flex-row items-center px-2 py-1 rounded-full mr-2"
            >
              <StateIcon
                size={12}
                color={getStateColor(task.state)}
                className="mr-1"
              />
              <Text
                style={[
                  {
                    color: getStateColor(task.state),
                    fontFamily: 'Poppins-Medium',
                  },
                ]}
                className="text-xs font-medium capitalize"
              >
                {task.state.replace('-', ' ')}
              </Text>
            </View>

            <View
              style={[
                { backgroundColor: `${getPriorityColor(task.priority)}20` },
              ]}
              className="flex-row items-center px-2 py-1 rounded-full"
            >
              <Target
                size={12}
                color={getPriorityColor(task.priority)}
                className="mr-1"
              />
              <Text
                style={[
                  {
                    color: getPriorityColor(task.priority),
                    fontFamily: 'Poppins-Medium',
                  },
                ]}
                className="text-xs font-medium capitalize"
              >
                {task.priority}
              </Text>
            </View>
          </View>

          {/* Assignees */}
          <View className="flex-row items-center mb-3">
            <Users size={14} color="#6B7280" className="mr-2" />
            <View className="flex-row items-center flex-1">
              {task.assignee.slice(0, 3).map((assignee, idx) => (
                <View
                  key={assignee._id}
                  style={[{ zIndex: 10 - idx }, idx > 0 && { marginLeft: -8 }]}
                  className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center"
                >
                  <Text
                    style={[{ fontFamily: 'Poppins-Medium' }]}
                    className="text-white text-xs font-medium"
                  >
                    {assignee.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              ))}
              {task.assignee.length > 3 && (
                <View
                  style={[{ zIndex: 6, marginLeft: -8 }]}
                  className="w-6 h-6 rounded-full bg-gray-400 items-center justify-center"
                >
                  <Text
                    style={[{ fontFamily: 'Poppins-Medium' }]}
                    className="text-white text-xs font-medium"
                  >
                    +{task.assignee.length - 3}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Due Date and Comments */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <CalIcon
                size={14}
                color={isTaskOverdue ? '#EF4444' : '#6B7280'}
                className="mr-1"
              />
              <Text
                style={[{ fontFamily: 'Poppins-Regular' }]}
                className={`text-sm ${
                  isTaskOverdue ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                {formatDate(task.dueDate)}
              </Text>
              {isTaskOverdue && (
                <Text
                  style={[{ fontFamily: 'Poppins-Medium' }]}
                  className="text-xs text-red-500 ml-1"
                >
                  (Overdue)
                </Text>
              )}
            </View>

            <View className="flex-row items-center">
              <MessageCircle size={14} color="#6B7280" className="mr-1" />
              <Text
                style={[{ fontFamily: 'Poppins-Regular' }]}
                className="text-sm text-gray-600"
              >
                {task.comments.length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Filter Modal Component
  const FilterModal = () => (
    <Modal
      visible={filterModalOpen}
      transparent={true}
      animationType="slide"
      className="flex-1 justify-center items-center"
      onRequestClose={() => setFilterModalOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => setFilterModalOpen(false)}>
        <View className="w-full h-full flex justify-center items-center bg-black/50">
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View className="w-[90%] h-[500px] bg-white rounded-3xl p-4">
              <ScrollView showsVerticalScrollIndicator={false}>
                <Animated.View
                  entering={SlideInRight}
                  className="bg-white rounded-t-3xl p-6 max-h-96"
                >
                  <View className="flex-row items-center justify-between mb-6">
                    <Text
                      style={[{ fontFamily: 'Poppins-Bold' }]}
                      className="text-xl font-bold text-gray-900"
                    ></Text>
                    <TouchableOpacity
                      onPress={e => {
                        e.stopPropagation();
                        setFilterModalOpen(false);
                      }}
                      className="bg-gray-100 rounded-full p-2"
                    >
                      <XCircle size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Priority Filter */}
                    <View className="mb-6">
                      <Text
                        style={[{ fontFamily: 'Poppins-SemiBold' }]}
                        className="text-base font-semibold text-gray-900 mb-3"
                      >
                        Priority
                      </Text>
                      <View className="flex-row gap-2">
                        {['', 'high', 'medium', 'low'].map(prio => (
                          <TouchableOpacity
                            key={prio}
                            onPress={() => setPriority(prio)}
                            style={[
                              priority === prio
                                ? {
                                    backgroundColor: '#3B82F6',
                                    borderColor: '#3B82F6',
                                  }
                                : {
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#D1D5DB',
                                  },
                            ]}
                            className="px-4 py-2 rounded-full border"
                          >
                            <Text
                              style={[
                                {
                                  color:
                                    priority === prio ? '#FFFFFF' : '#6B7280',
                                  fontFamily: 'Poppins-Medium',
                                },
                              ]}
                              className="text-sm font-medium capitalize"
                            >
                              {prio || 'All'}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Sort Options */}
                    <View className="mb-6">
                      <Text
                        style={[{ fontFamily: 'Poppins-SemiBold' }]}
                        className="text-base font-semibold text-gray-900 mb-3"
                      >
                        Sort By
                      </Text>
                      <View className="gap-3">
                        {[
                          { key: 'createdAt', label: 'Created Date' },
                          { key: 'dueDate', label: 'Due Date' },
                          { key: 'priority', label: 'Priority' },
                          { key: 'title', label: 'Title' },
                        ].map(option => (
                          <TouchableOpacity
                            key={option.key}
                            onPress={() => setSortBy(option.key)}
                            style={[
                              sortBy === option.key
                                ? {
                                    backgroundColor: '#EFF6FF',
                                    borderColor: '#BFDBFE',
                                  }
                                : {
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E5E7EB',
                                  },
                            ]}
                            className="flex-row items-center justify-between p-3 rounded-xl border"
                          >
                            <Text
                              style={[
                                {
                                  color:
                                    sortBy === option.key
                                      ? '#3B82F6'
                                      : '#374151',
                                  fontFamily: 'Poppins-Medium',
                                },
                              ]}
                              className="text-sm font-medium"
                            >
                              {option.label}
                            </Text>
                            {sortBy === option.key && (
                              <TouchableOpacity
                                onPress={() =>
                                  setSortOrder(
                                    sortOrder === 'asc' ? 'desc' : 'asc',
                                  )
                                }
                              >
                                {sortOrder === 'asc' ? (
                                  <SortAsc size={16} color="#3B82F6" />
                                ) : (
                                  <SortDesc size={16} color="#3B82F6" />
                                )}
                              </TouchableOpacity>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Apply Button */}
                    <TouchableOpacity
                      onPress={() => {
                        setFilterModalOpen(false);
                        handleGetTasks();
                      }}
                      className="bg-blue-500 rounded-xl p-4 items-center"
                    >
                      <Text
                        style={[{ fontFamily: 'Poppins-SemiBold' }]}
                        className="text-white text-base font-semibold"
                      >
                        Apply Filters
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </Animated.View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={tw`h-full bg-gray-50`}>
      {/* Header */}
      <Animated.View
        style={[
          tw`bg-white px-4 py-3 border-b border-gray-100`,
          headerAnimatedStyle,
        ]}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <TouchableOpacity
            style={tw`flex-row items-center gap-2 bg-gray-100 rounded-full p-2`}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>

          <View style={tw`flex-1 items-center`}>
            <Text
              style={[
                tw`text-gray-900 text-xl font-semibold`,
                { fontFamily: 'Poppins-SemiBold' },
              ]}
            >
              Tasks
            </Text>
            {projectDetails && (
              <Text
                style={[
                  tw`text-gray-500 text-sm`,
                  { fontFamily: 'Poppins-Regular' },
                ]}
              >
                {projectDetails.name}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={tw`bg-gray-100 rounded-full p-2`}
            onPress={() => navigation.navigate('Notification')}
          >
            <Bell size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View style={[tw`px-4 py-3 bg-white border-b border-gray-100`]}>
        <View
          style={tw`flex-row items-center bg-gray-50 rounded-2xl px-4 py-0 border border-gray-200`}
        >
          <Search size={20} color="#6B7280" style={tw`mr-3`} />
          <TextInput
            style={[
              tw`flex-1 text-gray-900`,
              { fontFamily: 'Poppins-Regular' },
            ]}
            placeholder="Search tasks..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {search ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <XCircle size={20} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>
      </Animated.View>
      <View className="w-full">
        {/* Stats Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="bg-white border-b border-gray-100"
          contentContainerStyle={tw`px-4 py-4 gap-3 max-h-[130px]`}
        >
          {[
            {
              key: 'all',
              label: 'All Tasks',
              count: taskCounts.all,
              color: '#6B7280',
              icon: BarChart3,
            },
            {
              key: 'todo',
              label: 'To Do',
              count: taskCounts.todo,
              color: '#6B7280',
              icon: AlertCircle,
            },
            {
              key: 'in-progress',
              label: 'In Progress',
              count: taskCounts['in-progress'],
              color: '#3B82F6',
              icon: Clock,
            },
            {
              key: 'completed',
              label: 'Completed',
              count: taskCounts.completed,
              color: '#10B981',
              icon: CheckCircle,
            },
          ].map(stat => {
            const IconComponent = stat.icon;
            return (
              <TouchableOpacity
                key={stat.key}
                style={[
                  tw`bg-white rounded-xl p-4 border-2 `,
                  activeFilter === stat.key
                    ? tw`border-blue-500`
                    : tw`border-gray-200`,
                ]}
                onPress={() => handleFilterChange(stat.key)}
              >
                <View style={tw`flex-row items-center justify-between mb-2`}>
                  <IconComponent
                    size={20}
                    color={activeFilter === stat.key ? '#3B82F6' : stat.color}
                  />
                  <Text
                    style={[
                      tw`text-2xl font-bold`,
                      {
                        color:
                          activeFilter === stat.key ? '#3B82F6' : stat.color,
                        fontFamily: 'Poppins-Bold',
                      },
                    ]}
                  >
                    {stat.count}
                  </Text>
                </View>
                <Text
                  style={[
                    tw`text-sm font-medium`,
                    {
                      color: activeFilter === stat.key ? '#3B82F6' : '#6B7280',
                      fontFamily: 'Poppins-Medium',
                    },
                  ]}
                >
                  {stat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Action Bar */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100`}
      >
        <View style={tw`flex-row items-center gap-3`}>
          <TouchableOpacity
            style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 py-2`}
            onPress={() => setFilterModalOpen(true)}
          >
            <Filter size={16} color="#6B7280" style={tw`mr-2`} />
            <Text
              style={[
                tw`text-gray-700 font-medium`,
                { fontFamily: 'Poppins-Medium' },
              ]}
            >
              Filter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-gray-100 rounded-xl p-2`}
            onPress={() => handleGetTasks()}
          >
            <RefreshCw size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={tw`bg-blue-500 rounded-xl px-4 py-2 flex-row items-center`}
          onPress={() => setCreateModalOpen(true)}
        >
          <Plus size={16} color="#FFFFFF" style={tw`mr-2`} />
          <Text
            style={[
              tw`text-white font-semibold`,
              { fontFamily: 'Poppins-SemiBold' },
            ]}
          >
            Add Task
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      <ScrollView
        style={tw`px-4`}
        contentContainerStyle={tw`py-4`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading && tasks.length === 0 ? (
          <View style={tw`flex-1 items-center justify-center py-20`}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text
              style={[
                tw`text-gray-600 mt-4`,
                { fontFamily: 'Poppins-Regular' },
              ]}
            >
              Loading tasks...
            </Text>
          </View>
        ) : tasks.length === 0 ? (
          <Animated.View
            entering={FadeIn}
            style={tw`items-center justify-center py-20`}
          >
            <View style={tw`bg-gray-100 rounded-full p-6 mb-4`}>
              <BarChart3 size={48} color="#9CA3AF" />
            </View>
            <Text
              style={[
                tw`text-xl font-semibold text-gray-900 mb-2`,
                { fontFamily: 'Poppins-SemiBold' },
              ]}
            >
              No tasks found
            </Text>
            <Text
              style={[
                tw`text-gray-600 text-center mb-6`,
                { fontFamily: 'Poppins-Regular' },
              ]}
            >
              {search
                ? 'Try adjusting your search criteria'
                : 'Create your first task to get started'}
            </Text>
            <TouchableOpacity
              style={tw`bg-blue-500 rounded-xl px-6 py-3 flex-row items-center`}
              onPress={() => setCreateModalOpen(true)}
            >
              <Plus size={20} color="#FFFFFF" style={tw`mr-2`} />
              <Text
                style={[
                  tw`text-white font-semibold`,
                  { fontFamily: 'Poppins-SemiBold' },
                ]}
              >
                Create Task
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          tasks.map((task, index) => (
            <TaskCard key={task._id} task={task} index={index} />
          ))
        )}
      </ScrollView>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <View style={tw`bg-white border-t border-gray-100 px-4 py-3`}>
          <View style={tw`flex-row items-center justify-between`}>
            <TouchableOpacity
              style={[
                tw`flex-row items-center px-4 py-2 rounded-xl`,
                pagination.hasPrevPage ? tw`bg-blue-500` : tw`bg-gray-100`,
              ]}
              onPress={() =>
                pagination.hasPrevPage && handlePageChange(page - 1)
              }
              disabled={!pagination.hasPrevPage}
            >
              <ChevronLeft
                size={16}
                color={pagination.hasPrevPage ? '#FFFFFF' : '#9CA3AF'}
                style={tw`mr-2`}
              />
              <Text
                style={[
                  tw`font-medium`,
                  {
                    color: pagination.hasPrevPage ? '#FFFFFF' : '#9CA3AF',
                    fontFamily: 'Poppins-Medium',
                  },
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <View style={tw`flex-row items-center gap-2`}>
              {Array.from({ length: Math.min(5, pagination.totalPages) }).map(
                (_, idx) => {
                  const pageNum = Math.max(1, pagination.currentPage - 2) + idx;
                  if (pageNum > pagination.totalPages) return null;

                  return (
                    <TouchableOpacity
                      key={pageNum}
                      style={[
                        tw`w-10 h-10 rounded-xl items-center justify-center`,
                        pageNum === pagination.currentPage
                          ? tw`bg-blue-500`
                          : tw`bg-gray-100`,
                      ]}
                      onPress={() => handlePageChange(pageNum)}
                    >
                      <Text
                        style={[
                          tw`font-semibold`,
                          {
                            color:
                              pageNum === pagination.currentPage
                                ? '#FFFFFF'
                                : '#6B7280',
                            fontFamily: 'Poppins-SemiBold',
                          },
                        ]}
                      >
                        {pageNum}
                      </Text>
                    </TouchableOpacity>
                  );
                },
              )}
            </View>

            <TouchableOpacity
              style={[
                tw`flex-row items-center px-4 py-2 rounded-xl`,
                pagination.hasNextPage ? tw`bg-blue-500` : tw`bg-gray-100`,
              ]}
              onPress={() =>
                pagination.hasNextPage && handlePageChange(page + 1)
              }
              disabled={!pagination.hasNextPage}
            >
              <Text
                style={[
                  tw`font-medium mr-2`,
                  {
                    color: pagination.hasNextPage ? '#FFFFFF' : '#9CA3AF',
                    fontFamily: 'Poppins-Medium',
                  },
                ]}
              >
                Next
              </Text>
              <ChevronRight
                size={16}
                color={pagination.hasNextPage ? '#FFFFFF' : '#9CA3AF'}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              tw`text-center text-gray-600 text-sm mt-2`,
              { fontFamily: 'Poppins-Regular' },
            ]}
          >
            Page {pagination.currentPage} of {pagination.totalPages} •{' '}
            {pagination.totalTasks} total tasks
          </Text>
        </View>
      )}

      {/* Modals */}
      <FilterModal />

      {/* Add/Edit Task Modal */}
      <AddTaskModal
        isCreateDialogOpen={createModalOpen}
        setIsCreateDialogOpen={setCreateModalOpen}
        employees={teamMembers}
        onSubmit={handleCreateTask}
        loading={loading}
        setLoading={setLoading}
        editTask={selectedTask}
        handleEdit={handleEditTask}
      />
    </SafeAreaView>
  );
};

export default Tasks;
