import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import AuthService from '../../services/AuthService';
import logo from '../../assets/images/spirit.png';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleUserLogin,
  handleIsAuthenticated,
} from '../../redux/slices/auth/authSlice';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Login = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { companyInfo } = useSelector((state: any) => state.config);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsEmailValid(validateEmail(text));
    setIsFormValid(validateEmail(text) && isPasswordValid);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setIsPasswordValid(text.length >= 4);
    setIsFormValid(validateEmail(email) && text.length >= 4);
  };

  const handleSubmit = async () => {
    if (isFormValid) {
      setIsLoading(true);
      setError('');
      const payload = {
        email,
        password,
      };
      try {
        const response = await AuthService.Login(payload);
        if (response.status === 200) {
          await AsyncStorage.setItem('access_token', response?.data?.token);
          const user = response?.data?.user;
          await AsyncStorage.setItem('user', JSON.stringify(user));
          dispatch(handleUserLogin(user));
          dispatch(handleIsAuthenticated({ isAuthenticated: true }));
          navigation.navigate('Layout');
          console.log(response);
          setIsLoading(false);
          setError('');
        }
      } catch (error) {
        setError('Invalid email or password');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6">
          {/* Logo and Header Section */}
          <View className="items-center mt-12 mb-8">
            <View
              className="w-32 h-32 rounded-full bg-white shadow-lg items-center justify-center mb-6"
              style={{
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Image
                source={companyInfo?.companyLogo ? { uri: companyInfo?.companyLogo } : logo}
                className="w-24 h-24 rounded-full"
                resizeMode="contain"
              />
            </View>
            <Text
              className="text-3xl text-gray-800 text-center mb-2"
              style={{ fontFamily: 'Poppins-Bold' }}
            >
              Welcome Back
            </Text>
            <Text
              className="text-gray-500 text-center text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              Sign in to continue
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-6">
            {/* Email Input */}
            <View>
              <Text
                className="text-gray-700 mb-2 text-base"
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                Email
              </Text>
              <View
                className={`flex-row items-center border-2 rounded-full px-4 py-2 ${
                  focusedInput === 'email'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <Mail
                  size={20}
                  color={focusedInput === 'email' ? '#7C3AED' : '#6B7280'}
                />
                <TextInput
                  placeholder="Enter your email"
                  className="flex-1 ml-3 text-base text-gray-800"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={handleEmailChange}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ fontFamily: 'Lexend-Regular' }}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mt-4">
              <Text
                className="text-gray-700 mb-2 text-base"
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                Password
              </Text>
              <View
                className={`flex-row items-center border-2 rounded-full px-4 py-2 ${
                  focusedInput === 'password'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <Lock
                  size={20}
                  color={focusedInput === 'password' ? '#7C3AED' : '#6B7280'}
                />
                <TextInput
                  placeholder="Enter your password"
                  className="flex-1 ml-3 text-base text-gray-800"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={handlePasswordChange}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showPassword}
                  style={{ fontFamily: 'Lexend-Regular' }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="p-2"
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Message */}
            {error ? (
              <Text
                className="text-red-500 text-center"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                {error}
              </Text>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity
              className={`rounded-full py-4 px-6 mt-8 ${
                isFormValid && !isLoading ? 'bg-purple-600' : 'bg-gray-300'
              }`}
              onPress={handleSubmit}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="#fff" />
                  <Text className="text-white text-center text-lg ml-2">
                    Signing in...
                  </Text>
                </View>
              ) : (
                <Text
                  className="text-white text-center text-lg"
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                >
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password Link */}
            <TouchableOpacity className="mt-4">
              <Text
                className="text-purple-600 text-center text-base"
                style={{ fontFamily: 'Poppins-Medium' }}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
