import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, Bell } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();
  const handleLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('user');
    navigation.navigate('Login');
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1  items-center px-4 py-3">
        {/**header */}
        <View className="bg-white  border-b border-gray-100 w-full pb-4">
          <View className="flex-row items-center justify-between">
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
              Profile
            </Text>
            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              onPress={() => navigation.navigate('Notification')}
            >
              <Bell size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 w-full"
        >
          <View>
            <TouchableOpacity onPress={handleLogout}>
              <Text>Logout</Text>
            </TouchableOpacity>
            <Text>Profile</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
