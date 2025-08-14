import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeft,
  Bell,
  Camera,
  User,
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
  MapPin,
  Shield,
  LogOut,
  ChevronRight,
  Settings,
  Edit3,
} from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  iconBgColor?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  iconBgColor = '#F3F4F6',
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-50"
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    }}
    activeOpacity={0.7}
  >
    <View
      className="w-12 h-12 rounded-xl items-center justify-center mr-4"
      style={{ backgroundColor: iconBgColor }}
    >
      {icon}
    </View>
    <View className="flex-1">
      <Text
        className="text-gray-900 text-base font-medium"
        style={{ fontFamily: 'Poppins-Medium' }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          className="text-gray-500 text-sm mt-1"
          style={{ fontFamily: 'Poppins-Regular' }}
        >
          {subtitle}
        </Text>
      )}
    </View>
    {showChevron && <ChevronRight size={20} color="#9CA3AF" />}
  </TouchableOpacity>
);

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    // Load profile image from storage if exists
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profile_image');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('user');
          navigation.navigate('Login');
        },
      },
    ]);
  };

  const handleImagePicker = () => {
    Alert.alert('Update Profile Photo', 'Choose an option', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Camera',
        onPress: () => {
          // TODO: Implement camera functionality
          Alert.alert('Camera', 'Camera functionality will be implemented');
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          // TODO: Implement gallery functionality
          Alert.alert('Gallery', 'Gallery functionality will be implemented');
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: <User size={20} color="#7563F7" />,
      title: 'Personal Information',
      subtitle: 'View and edit your details',
      onPress: () => {
        navigation.navigate('ProfileView');
      },
      iconBgColor: '#F3F4F6',
    },

    {
      icon: <DollarSign size={20} color="#059669" />,
      title: 'Salary Slips',
      subtitle: 'Download your pay slips',
      onPress: () => {
        navigation.navigate('SalarySlips');
      },
      iconBgColor: '#ECFDF5',
    },
    {
      icon: <FileText size={20} color="#3B82F6" />,
      title: 'Expense Form',
      subtitle: 'Submit expense claims',
      onPress: () => {
        navigation.navigate('Expense');
      },
      iconBgColor: '#EFF6FF',
    },
    {
      icon: <MapPin size={20} color="#EF4444" />,
      title: 'Holiday Calendar',
      subtitle: 'View upcoming holidays',
      onPress: () => {
        navigation.navigate('Holidays');
      },
      iconBgColor: '#FEF2F2',
    },
    {
      icon: <BookOpen size={20} color="#10B981" />,
      title: 'Student Portal',
      subtitle: 'Access your courses and grades',
      onPress: () => {
        navigation.navigate('Students');
      },
      iconBgColor: '#ECFDF5',
    },
    {
      icon: <Calendar size={20} color="#F59E0B" />,
      title: 'Sessions',
      subtitle: 'Manage your class sessions',
     onPress: () => {
        navigation.navigate('Sessions');
      },
      iconBgColor: '#FFFBEB',
    },
    // {
    //   icon: <Settings size={20} color="#6B7280" />,
    //   title: 'Settings',
    //   subtitle: 'App preferences and more',
    //   onPress: () => {
    //     navigation.navigate('Settings');
    //   },
    //   iconBgColor: '#F9FAFB',
    // },
    {
      icon: <Shield size={20} color="#8B5CF6" />,
      title: 'Privacy Policy',
      subtitle: 'Read our privacy terms',
      onPress: () => {
        navigation.navigate('PrivacyPolicy');
      },
      iconBgColor: '#F5F3FF',
    },
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
              Profile
            </Text>
            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              onPress={() => navigation.navigate('Notification')}
              activeOpacity={0.7}
            >
              <Bell size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Profile Header */}
          <View className="bg-white mx-4 mt-4 rounded-3xl p-6 shadow-sm border border-gray-50">
            <View className="items-center">
              {/* Profile Image */}
              <View className="relative mb-4">
                <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <User size={32} color="#9CA3AF" />
                  )}
                </View>
                <TouchableOpacity
                  onPress={handleImagePicker}
                  className="absolute -bottom-1 -right-1 bg-[#7563F7] rounded-full p-2"
                  activeOpacity={0.8}
                  style={{
                    shadowColor: '#7563F7',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  <Camera size={16} color="white" />
                </TouchableOpacity>
              </View>

              {/* User Info */}
              <Text
                className="text-gray-900 text-xl font-semibold mb-1"
                style={{ fontFamily: 'Poppins-SemiBold' }}
              >
                {user?.name || 'User Name'}
              </Text>
              <Text
                className="text-gray-500 text-sm mb-2"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                {user?.email || 'user@example.com'}
              </Text>
              <View className="bg-[#7563F7]/10 px-3 py-1 rounded-full">
                <Text
                  className="text-[#7563F7] text-xs font-medium"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  {user?.role || 'Employee'}
                </Text>
              </View>
            </View>

            {/* Quick Action */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProfileView');
              }}
              className="flex-row items-center justify-center bg-gray-50 rounded-2xl p-3 mt-4"
              activeOpacity={0.7}
            >
              <Edit3 size={16} color="#7563F7" />
              <Text
                className="text-[#7563F7] text-sm font-medium ml-2"
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                View Full Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View className="px-4 mt-6">
            <Text
              className="text-gray-900 text-lg font-semibold mb-4"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Quick Access
            </Text>

            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                onPress={item.onPress}
                iconBgColor={item.iconBgColor}
              />
            ))}

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center bg-red-50 p-4 rounded-2xl mt-4 border border-red-100"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 rounded-xl items-center justify-center mr-4 bg-red-100">
                <LogOut size={20} color="#EF4444" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-red-600 text-base font-medium"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  Logout
                </Text>
                <Text
                  className="text-red-400 text-sm mt-1"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  Sign out of your account
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
