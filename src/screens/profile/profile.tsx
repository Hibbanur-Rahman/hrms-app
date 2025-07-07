import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();
  const handleLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('user');
    navigation.navigate('Login');
  }
  return (
    <View>
      <TouchableOpacity
      onPress={handleLogout}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
      <Text>Profile</Text>
    </View>
  )
}

export default Profile
