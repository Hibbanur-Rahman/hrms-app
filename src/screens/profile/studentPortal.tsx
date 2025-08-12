import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { 
  ArrowLeft, 
  BookOpen,
  Award,
  Clock,
  FileText,
  TrendingUp,
  Calendar,
  Users,
  Target
} from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CourseCardProps {
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  color: string;
}

interface GradeItemProps {
  subject: string;
  grade: string;
  percentage: number;
  color: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  title, 
  instructor, 
  progress, 
  totalLessons, 
  completedLessons,
  color 
}) => (
  <TouchableOpacity
    className="bg-white rounded-2xl p-4 mr-4 shadow-sm border border-gray-50"
    style={{ width: 280 }}
    activeOpacity={0.7}
  >
    <View className="flex-row items-start justify-between mb-3">
      <View 
        className="w-12 h-12 rounded-xl items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <BookOpen size={20} color="white" />
      </View>
      <View className="bg-gray-100 px-2 py-1 rounded-full">
        <Text 
          className="text-gray-600 text-xs"
          style={{ fontFamily: 'Poppins-Medium' }}
        >
          {Math.round(progress)}% Complete
        </Text>
      </View>
    </View>
    
    <Text 
      className="text-gray-900 text-base font-semibold mb-1"
      style={{ fontFamily: 'Poppins-SemiBold' }}
    >
      {title}
    </Text>
    <Text 
      className="text-gray-500 text-sm mb-3"
      style={{ fontFamily: 'Poppins-Regular' }}
    >
      by {instructor}
    </Text>
    
    <View className="flex-row items-center justify-between mb-2">
      <Text 
        className="text-gray-600 text-xs"
        style={{ fontFamily: 'Poppins-Regular' }}
      >
        {completedLessons}/{totalLessons} lessons
      </Text>
    </View>
    
    <View className="w-full bg-gray-200 rounded-full h-2">
      <View 
        className="h-2 rounded-full"
        style={{ 
          width: `${progress}%`,
          backgroundColor: color 
        }}
      />
    </View>
  </TouchableOpacity>
);

const GradeItem: React.FC<GradeItemProps> = ({ subject, grade, percentage, color }) => (
  <View className="flex-row items-center bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-50">
    <View 
      className="w-12 h-12 rounded-xl items-center justify-center mr-4"
      style={{ backgroundColor: color }}
    >
      <Award size={20} color="white" />
    </View>
    <View className="flex-1">
      <Text 
        className="text-gray-900 text-base font-medium"
        style={{ fontFamily: 'Poppins-Medium' }}
      >
        {subject}
      </Text>
      <Text 
        className="text-gray-500 text-sm"
        style={{ fontFamily: 'Poppins-Regular' }}
      >
        {percentage}% - {grade}
      </Text>
    </View>
    <View className="items-end">
      <Text 
        className="text-2xl font-bold"
        style={{ 
          fontFamily: 'Poppins-Bold',
          color: color 
        }}
      >
        {grade}
      </Text>
    </View>
  </View>
);

const StudentPortal = () => {
  const navigation = useNavigation<NavigationProp>();

  const courses = [
    {
      title: 'Advanced React Native',
      instructor: 'John Smith',
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      color: '#7563F7',
    },
    {
      title: 'UI/UX Design Principles',
      instructor: 'Sarah Johnson',
      progress: 60,
      totalLessons: 16,
      completedLessons: 10,
      color: '#10B981',
    },
    {
      title: 'JavaScript Fundamentals',
      instructor: 'Mike Wilson',
      progress: 90,
      totalLessons: 20,
      completedLessons: 18,
      color: '#F59E0B',
    },
  ];

  const grades = [
    { subject: 'React Native Development', grade: 'A+', percentage: 95, color: '#10B981' },
    { subject: 'UI/UX Design', grade: 'A', percentage: 88, color: '#7563F7' },
    { subject: 'JavaScript Advanced', grade: 'B+', percentage: 82, color: '#F59E0B' },
    { subject: 'Mobile App Architecture', grade: 'A-', percentage: 91, color: '#3B82F6' },
  ];

  const stats = [
    { label: 'Courses Enrolled', value: '12', icon: <BookOpen size={20} color="#7563F7" />, color: '#F3F4F6' },
    { label: 'Hours Completed', value: '245', icon: <Clock size={20} color="#10B981" />, color: '#ECFDF5' },
    { label: 'Assignments Done', value: '38', icon: <FileText size={20} color="#F59E0B" />, color: '#FFFBEB' },
    { label: 'Average Grade', value: 'A-', icon: <TrendingUp size={20} color="#EF4444" />, color: '#FEF2F2' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
            <Text
              className="text-gray-900 text-xl font-semibold"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Student Portal
            </Text>
            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              activeOpacity={0.7}
            >
              <Calendar size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Welcome Card */}
          <View className="bg-gradient-to-br from-[#7563F7] to-[#9333EA] mx-4 mt-4 rounded-3xl p-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text
                  className="text-white text-xl font-bold mb-1"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  Welcome Back!
                </Text>
                <Text
                  className="text-white/80 text-sm"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  Continue your learning journey
                </Text>
              </View>
              <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
                <Users size={28} color="white" />
              </View>
            </View>
          </View>

          {/* Stats */}
          <View className="px-4 mt-6">
            <Text
              className="text-gray-900 text-lg font-semibold mb-4"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Overview
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {stats.map((stat, index) => (
                <View 
                  key={index}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 mb-3"
                  style={{ width: '48%' }}
                >
                  <View 
                    className="w-10 h-10 rounded-xl items-center justify-center mb-3"
                    style={{ backgroundColor: stat.color }}
                  >
                    {stat.icon}
                  </View>
                  <Text 
                    className="text-2xl font-bold text-gray-900 mb-1"
                    style={{ fontFamily: 'Poppins-Bold' }}
                  >
                    {stat.value}
                  </Text>
                  <Text 
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Current Courses */}
          <View className="mt-6">
            <View className="flex-row items-center justify-between px-4 mb-4">
              <Text
                className="text-gray-900 text-lg font-semibold"
                style={{ fontFamily: 'Poppins-SemiBold' }}
              >
                Current Courses
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text
                  className="text-[#7563F7] text-sm font-medium"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {courses.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
            </ScrollView>
          </View>

          {/* Recent Grades */}
          <View className="px-4 mt-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-gray-900 text-lg font-semibold"
                style={{ fontFamily: 'Poppins-SemiBold' }}
              >
                Recent Grades
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text
                  className="text-[#7563F7] text-sm font-medium"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            {grades.slice(0, 3).map((grade, index) => (
              <GradeItem key={index} {...grade} />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default StudentPortal;
