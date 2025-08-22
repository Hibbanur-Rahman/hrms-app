import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Platform } from 'react-native';

import ModernLoadingScreen from './src/components/ModernLoadingScreen';

import store from './src/redux/store';
import {
  handleIsAuthenticated,
  handleUserLogin,
} from './src/redux/slices/auth/authSlice';
import { validateEnv } from './src/config/env';
import './global.css';

import Login from './src/screens/auth/login';
import Register from './src/screens/auth/register';
import StartScreen from './src/screens/auth/startScreens';
import Layout from './src/layout/dashboardLayout';
import ForgotPassword from './src/screens/auth/forgotPassword';
import AuthService from './src/services/AuthService';
import Notification from './src/screens/notification/notification';
import ProfileView from './src/screens/profile/profileView';
import Settings from './src/screens/profile/settings';
import StudentPortal from './src/screens/students/studentPortal';
import SalarySlips from './src/screens/salarySlips/salarySlips';
import Holidays from './src/screens/holidays/holidays';
import PrivacyPolicy from './src/screens/privacyPolicy/privacyPolicy';
import Expense from './src/screens/expense/expense';
import Sessions from './src/screens/sessions/sessions';
import StudentDetails from './src/screens/students/studentDetails';
import Tasks from './src/screens/projects/tasks';
import TaskDetails from './src/screens/projects/taskDetails';

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
  Students: undefined;
  StudentDetails: { student: any } | undefined;
  SalarySlips: undefined;
  Holidays: undefined;
  PrivacyPolicy: undefined;
  Expense: undefined;
  Sessions: undefined;
  Tasks: {
    projectId: string;
  };
  TaskDetails:{
    taskId: string;
  }
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

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
    // Validate environment variables
    validateEnv();
    checkAuthStatus();
  }, []);

  if (loading || !initialRoute) {
    return <ModernLoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="StartScreen"
          component={StartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Layout"
          component={Layout}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Tasks"
          component={Tasks}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileView"
          component={ProfileView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Students"
          component={StudentPortal}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentDetails"
          component={StudentDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sessions"
          component={Sessions}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SalarySlips"
          component={SalarySlips}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Expense"
          component={Expense}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Holidays"
          component={Holidays}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <GestureHandlerRootView style={{ flex: 1,paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0 }}>
        <Provider store={store}>
          <AppContent />
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
