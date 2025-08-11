import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enableScreens } from 'react-native-screens';

import store from './src/redux/store';
import {
  handleIsAuthenticated,
  handleUserLogin,
} from './src/redux/slices/auth/authSlice';
import "./global.css"

import Login from './src/screens/auth/login';
import Register from './src/screens/auth/register';
import StartScreen from './src/screens/auth/startScreens';
import Layout from './src/layout/dashboardLayout';
import ForgotPassword from './src/screens/auth/forgotPassword';
import AuthService from './src/services/AuthService';
import Notification from './src/screens/notification/notification';
import ProfileView from './src/screens/profile/profileView';
import Settings from './src/screens/profile/settings';
import StudentPortal from './src/screens/profile/studentPortal';
import SalarySlips from './src/screens/profile/salarySlips';


enableScreens();

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  StartScreen: undefined;
  Layout: undefined;
  ForgotPassword: undefined;
  Notification: undefined;
  ProfileView: undefined;
  Settings: undefined;
  StudentPortal: undefined;
  SalarySlips: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList | null>(null);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        dispatch(handleIsAuthenticated({ isAuthenticated: true }));
        const response = await AuthService.GetUserDetail();
        if (response?.status === 200) {
          dispatch(handleUserLogin(response.data.data));
        }
        setInitialRoute('Layout');
      } else {
        setInitialRoute('StartScreen');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setInitialRoute('StartScreen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (loading || !initialRoute) {
    return (
      <View className='bg-white flex-1 justify-center items-center'>
        <ActivityIndicator size="large" color="#9333EA" />
        <Text className='text-gray-600 text-base' style={{fontFamily: 'Poppins-Regular'}}>Checking auth status...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Layout" component={Layout} options={{ headerShown: false }} />

        <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileView" component={ProfileView} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name="StudentPortal" component={StudentPortal} options={{ headerShown: false }} />
        <Stack.Screen name="SalarySlips" component={SalarySlips} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
}
