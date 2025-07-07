import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const onboardingData = [
  {
    id: 1,
    image: require('../../assets/images/slide-img1.jpg'),
    title: 'Easy way to confirm your attendance',
    description:
      'Streamline your attendance tracking with our intuitive and user-friendly interface designed for modern workplaces.',
  },
  {
    id: 2,
    image: require('../../assets/images/slide-img2.jpg'),
    title: 'Disciplinary in your hand',
    description:
      'Take control of workplace discipline management with powerful tools at your fingertips, anytime, anywhere.',
  },
  {
    id: 3,
    image: require('../../assets/images/slide-img3.jpg'),
    title: 'Reduce HR management workload',
    description:
      'Automate routine HR tasks and focus on what matters most - building a great workplace culture.',
  },
];

export default function StartScreens() {
  const navigation = useNavigation<NavigationProp>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);

  const [currentData, setCurrentData] = useState(onboardingData[0]);

  const handleNext = () => {
    if (isNavigating) return;
    if (currentStep === 3) {
      handleGetStarted();
      return;
    }
    console.log('currentStep', currentStep);
    const next = currentStep + 1;
    setCurrentStep(next);
    setCurrentData(onboardingData[next - 1]);
  };

  const handlePrevious = () => {
    if (isNavigating) return;
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      setCurrentData(onboardingData[prev - 1]);
    }
  };

  const handleGetStarted = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('access_token').then(token => {
      if (token && !isNavigating) {
        setIsNavigating(true);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Layout' }],
        });
      }
    });
  }, [isNavigating, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <StatusBar barStyle="dark-content" />
        <View className="absolute top-12 right-6">
          <TouchableOpacity onPress={handleGetStarted} disabled={isNavigating}>
            <Text>Skip</Text>
          </TouchableOpacity>
        </View>

          <View className=" justify-center items-center flex-1" >
          <View className="justify-center items-center rounded-[50%] border-4 border-gray-300 overflow-hidden"> 
            <Image source={currentData.image} className='w-[250px] h-[250px]' />
          </View>
          <Text className='text-2xl font-bold text-gray-800 text-center mb-4 mt-8 leading-tight' style={{fontFamily: 'Poppins-SemiBold'}}>{currentData.title}</Text>
          <Text className='text-gray-600 text-center text-base leading-relaxed px-4' style={{fontFamily: 'Poppins-Regular'}}>{currentData.description}</Text>
        </View>

        <View className="p-8">
          <View className="flex-row justify-between">
            <TouchableOpacity onPress={handlePrevious} disabled={currentStep === 1 || isNavigating}>
              <ChevronLeft />
            </TouchableOpacity>
            <TouchableOpacity className='bg-purple-600 p-2 rounded-full' onPress={handleNext} disabled={isNavigating}>
              <View className='flex-row items-center justify-center gap-2 px-4 py-2'>
                <Text className='text-white text-base' style={{fontFamily: 'Poppins-SemiBold'}}>{currentStep === 3 ? 'Get Started' : 'Next'}</Text>
                {currentStep === 3 ? <Check className='text-white' color='white' /> : <ChevronRight className='text-white' color='white' />}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
