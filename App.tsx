import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enableScreens } from 'react-native-screens';

import store from './src/redux/store';
import {
  handleIsAuthenticated,
  handleUserLogin,
} from './src/redux/slices/auth/authSlice';

import Login from './src/screens/auth/login';
import Register from './src/screens/auth/register';
import StartScreen from './src/screens/auth/startScreens';
import Layout from './src/layout/dashboardLayout';
import ForgotPassword from './src/screens/auth/forgotPassword';
import AuthService from './src/services/AuthService';

// Enable react-native-screens for better performance
enableScreens();

// Define navigation types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  StartScreen: undefined;
  Layout: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  const dispatch = useDispatch();
  const [authInitialRouteName, setAuthInitialRouteName] = useState<
    keyof RootStackParamList | undefined
  >(undefined);

  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated,
  );

  // Handle token fetch
  const handleFetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('access_token');
      const user = await AsyncStorage.getItem('user');
      if (storedToken) {
        dispatch(handleIsAuthenticated({ isAuthenticated: true }));
        handleGetUserDetails();
        // dispatch(handleUserLogin(JSON.parse(user)));
        setAuthInitialRouteName('Layout');
      } else {
        dispatch(handleIsAuthenticated({ isAuthenticated: false }));
        setAuthInitialRouteName('StartScreen');
      }
    } catch (error) {
      console.error('Error fetching token:', error);
      setAuthInitialRouteName('StartScreen');
    }
  };

  const handleGetUserDetails = async () => {
    try {
      const response = await AuthService.GetUserDetail();
      if (response?.status === 200) {
        const userJson = JSON.stringify(response.data.data);
        await AsyncStorage.setItem('user', userJson);
        dispatch(handleUserLogin(response.data.data));
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    handleFetchToken();
  }, []);

  useEffect(() => {
    setAuthInitialRouteName(isAuthenticated ? 'Layout' : 'StartScreen');
  }, [isAuthenticated]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <SafeAreaView className="flex-1 bg-white">
          {authInitialRouteName && (
            <Stack.Navigator initialRouteName={authInitialRouteName}>
              <Stack.Screen
                name="Layout"
                component={Layout}
                options={{ headerShown: false }}
              />
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
            </Stack.Navigator>
          )}
        </SafeAreaView>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
