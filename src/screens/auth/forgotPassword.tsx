import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react-native';
import { TextInput } from 'react-native';
import logo from '../../assets/images/spirit.png';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AuthService from '../../services/AuthService';
import { useSelector } from 'react-redux';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const ForgotPassword = () => {
  const navigation = useNavigation<NavigationProp>();
  const { companyInfo } = useSelector((state: any) => state.config);

  const [email, setEmail] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setError('');
    setSuccess('');
    setEmail(text);
    setIsEmailValid(validateEmail(text));
    setIsFormValid(validateEmail(text));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const payload = {
        email,
      };
      const response = await AuthService.ForgotPassword(payload);
      if (response.status === 200) {
        setIsLoading(false);
        setError('');
        setEmail('');
        setIsEmailValid(false);
        setIsFormValid(false);
        setSuccess('Reset link sent to your email');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setError(error?.data?.message || 'Invalid email');
    } finally {
      setIsLoading(false);
      setEmail('');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-purple-50 to-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Back Button */}
          <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              className="w-10 h-10 rounded-full bg-white shadow-sm items-center justify-center"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <ArrowLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            <View className="flex-1" />
          </View>

          <View className="flex-1 px-6">
            {/* Logo and Header Section */}
            <View className="items-center mt-8 mb-12">
              <View
                className="w-32 h-32 rounded-full bg-white shadow-lg items-center justify-center mb-6 p-1"
                style={{
                  shadowColor: '#7C3AED',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Image
                  source={
                    companyInfo?.companyLogo
                      ? { uri: companyInfo?.companyLogo }
                      : logo
                  }
                  className="w-full h-full rounded-full"
                  resizeMode="contain"
                />
              </View>

              <Text
                className="text-3xl text-gray-800 mb-2"
                style={{ fontFamily: 'Poppins-Bold' }}
              >
                Forgot Password?
              </Text>

              <Text
                className="text-gray-500 text-center text-base leading-6 px-4"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                Don't worry! Enter your email address and we'll send you a link
                to reset your password.
              </Text>
            </View>

            {/* Form Section */}
            <View className="space-y-6">
              {/* Email Input */}
              <View>
                <Text
                  className="text-gray-700 mb-3 text-base ml-2"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  Email Address
                </Text>

                <View
                  className={`flex-row items-center border-2 rounded-full px-4 py-2 transition-all duration-200 ${
                    focusedInput === 'email'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Mail
                    size={22}
                    color={focusedInput === 'email' ? '#7C3AED' : '#6B7280'}
                  />
                  <TextInput
                    placeholder="Enter your email address"
                    className="flex-1 ml-4 text-base text-gray-800 "
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={handleEmailChange}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ fontFamily: 'Lexend-Regular' }}
                  />
                  {isEmailValid && <CheckCircle size={20} color="#10B981" />}
                </View>

                {/* Error Message */}
                {error && (
                  <View
                    className="flex-row items-center mt-3 p-3 bg-red-50 rounded-xl border border-red-200"
                    style={{
                      shadowColor: '#EF4444',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 2,
                    }}
                  >
                    <AlertCircle size={18} color="#EF4444" />
                    <Text
                      className="text-red-600 text-sm ml-2 flex-1"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      {error}
                    </Text>
                  </View>
                )}

                {/* Success Message */}
                {success && (
                  <View
                    className="flex-row items-center mt-3 p-3 bg-green-50 rounded-xl border border-green-200"
                    style={{
                      shadowColor: '#10B981',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 2,
                    }}
                  >
                    <CheckCircle size={18} color="#10B981" />
                    <Text
                      className="text-green-600 text-sm ml-2 flex-1"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      {success}
                    </Text>
                  </View>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                className={`rounded-full py-4 px-6 mt-8 transition-all duration-200 ${
                  isFormValid && !isLoading ? 'bg-purple-600' : 'bg-gray-300'
                }`}
                onPress={handleSubmit}
                disabled={!isFormValid || isLoading}
                style={{
                  shadowColor: isFormValid && !isLoading ? '#7C3AED' : '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isFormValid && !isLoading ? 0.3 : 0.1,
                  shadowRadius: 8,
                  elevation: isFormValid && !isLoading ? 6 : 2,
                }}
              >
                {isLoading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#fff" />
                    <Text
                      className="text-white text-center text-lg ml-3"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Sending...
                    </Text>
                  </View>
                ) : (
                  <Text
                    className="text-white text-center text-lg"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Send Reset Link
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Bottom Section */}
            <View className=" justify-end pb-8 mt-8">
              <TouchableOpacity
                className="flex-row items-center justify-center p-4"
                onPress={() => navigation.navigate('Login')}
              >
                <Text
                  className="text-purple-600 text-center text-base"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  Remember your password?
                </Text>
                <Text
                  className="text-purple-700 text-center text-base ml-1"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
