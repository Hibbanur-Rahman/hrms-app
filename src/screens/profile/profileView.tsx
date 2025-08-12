import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ArrowLeft, 
  Camera, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Save,
  X
} from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEditing?: boolean;
  onChangeText?: (text: string) => void;
  placeholder?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ 
  icon, 
  label, 
  value, 
  isEditing = false, 
  onChangeText,
  placeholder 
}) => (
  <View className="flex-row items-start bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-50">
    <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center mr-4 mt-1">
      {icon}
    </View>
    <View className="flex-1">
      <Text 
        className="text-gray-500 text-sm mb-1"
        style={{ fontFamily: 'Poppins-Regular' }}
      >
        {label}
      </Text>
      {isEditing ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          className="text-gray-900 text-base border-b border-gray-200 pb-1"
          style={{ fontFamily: 'Poppins-Medium' }}
        />
      ) : (
        <Text 
          className="text-gray-900 text-base"
          style={{ fontFamily: 'Poppins-Medium' }}
        >
          {value || 'Not provided'}
        </Text>
      )}
    </View>
  </View>
);

const ProfileView = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    department: user?.department || '',
    position: user?.position || '',
    employeeId: user?.employeeId || '',
    joinDate: user?.joinDate || '',
  });

  useEffect(() => {
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

  const handleImagePicker = () => {
    Alert.alert(
      'Update Profile Photo',
      'Choose an option',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Camera',
          onPress: () => {
            Alert.alert('Camera', 'Camera functionality will be implemented');
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            Alert.alert('Gallery', 'Gallery functionality will be implemented');
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save user data
      await AsyncStorage.setItem('user_profile', JSON.stringify(editedUser));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      department: user?.department || '',
      position: user?.position || '',
      employeeId: user?.employeeId || '',
      joinDate: user?.joinDate || '',
    });
    setIsEditing(false);
  };

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
              Profile Details
            </Text>
            {isEditing ? (
              <View className="flex-row">
                <TouchableOpacity
                  className="bg-red-100 rounded-full p-2 mr-2"
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <X size={20} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-green-100 rounded-full p-2"
                  onPress={handleSave}
                  activeOpacity={0.7}
                >
                  <Save size={20} color="#10B981" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="bg-[#7563F7]/10 rounded-full p-2"
                onPress={() => setIsEditing(true)}
                activeOpacity={0.7}
              >
                <Edit3 size={20} color="#7563F7" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Profile Header */}
          <View className="bg-gradient-to-br from-[#7563F7] to-[#9333EA] mx-4 mt-4 rounded-3xl p-6 shadow-lg">
            <View className="items-center">
              {/* Profile Image */}
              <View className="relative mb-4">
                <View className="w-32 h-32 rounded-full bg-white/20 items-center justify-center overflow-hidden border-4 border-white/30">
                  {profileImage ? (
                    <Image 
                      source={{ uri: profileImage }} 
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <User size={48} color="white" />
                  )}
                </View>
                <TouchableOpacity
                  onPress={handleImagePicker}
                  className="absolute -bottom-2 -right-2 bg-white rounded-full p-3"
                  activeOpacity={0.8}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  <Camera size={20} color="#7563F7" />
                </TouchableOpacity>
              </View>

              {/* User Info */}
              <Text
                className="text-white text-2xl font-bold mb-2"
                style={{ fontFamily: 'Poppins-Bold' }}
              >
                {editedUser.name || 'User Name'}
              </Text>
              <Text
                className="text-white/80 text-base mb-1"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                {editedUser.position || 'Position'}
              </Text>
              <Text
                className="text-white/70 text-sm"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                ID: {editedUser.employeeId || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Profile Information */}
          <View className="px-4 mt-6">
            <Text
              className="text-gray-900 text-lg font-semibold mb-4"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Personal Information
            </Text>
            
            <InfoRow
              icon={<User size={18} color="#7563F7" />}
              label="Full Name"
              value={editedUser.name}
              isEditing={isEditing}
              onChangeText={(text) => setEditedUser({...editedUser, name: text})}
              placeholder="Enter your full name"
            />

            <InfoRow
              icon={<Mail size={18} color="#10B981" />}
              label="Email Address"
              value={editedUser.email}
              isEditing={isEditing}
              onChangeText={(text) => setEditedUser({...editedUser, email: text})}
              placeholder="Enter your email"
            />

            <InfoRow
              icon={<Phone size={18} color="#F59E0B" />}
              label="Phone Number"
              value={editedUser.phone}
              isEditing={isEditing}
              onChangeText={(text) => setEditedUser({...editedUser, phone: text})}
              placeholder="Enter your phone number"
            />

            <InfoRow
              icon={<MapPin size={18} color="#EF4444" />}
              label="Address"
              value={editedUser.address}
              isEditing={isEditing}
              onChangeText={(text) => setEditedUser({...editedUser, address: text})}
              placeholder="Enter your address"
            />

            <Text
              className="text-gray-900 text-lg font-semibold mb-4 mt-6"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Work Information
            </Text>

            <InfoRow
              icon={<User size={18} color="#8B5CF6" />}
              label="Department"
              value={editedUser.department}
              isEditing={isEditing}
              onChangeText={(text) => setEditedUser({...editedUser, department: text})}
              placeholder="Enter your department"
            />

            <InfoRow
              icon={<User size={18} color="#3B82F6" />}
              label="Position"
              value={editedUser.position}
              isEditing={isEditing}
              onChangeText={(text) => setEditedUser({...editedUser, position: text})}
              placeholder="Enter your position"
            />

            <InfoRow
              icon={<Calendar size={18} color="#06B6D4" />}
              label="Join Date"
              value={editedUser.joinDate}
              isEditing={false} // Date field should use date picker
            />
          </View>

          {/* Action Buttons */}
          {!isEditing && (
            <View className="px-4 mt-6">
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="bg-[#7563F7] rounded-2xl p-4 flex-row items-center justify-center"
                activeOpacity={0.8}
                style={{
                  shadowColor: '#7563F7',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Edit3 size={20} color="white" />
                <Text
                  className="text-white text-base font-semibold ml-2"
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                >
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ProfileView;
