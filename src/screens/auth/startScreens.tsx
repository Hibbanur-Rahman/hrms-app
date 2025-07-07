import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  useSharedValue,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

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
  
  const slideAnimation = useSharedValue(0);
  const imageScale = useSharedValue(1);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(imageScale.value, [0, 1], [0.8, 1]) },
      ],
    };
  });

  const updateStep = useCallback((step: number) => {
    setCurrentStep(step);
    setCurrentData(onboardingData[step - 1]);
  }, []);

  const handleNext = () => {
    if (isNavigating) return;
    if (currentStep === 3) {
      handleGetStarted();
      return;
    }
    
    const next = currentStep + 1;
    imageScale.value = withSpring(0.8, {}, () => {
      runOnJS(updateStep)(next);
      imageScale.value = withSpring(1);
    });
    
    slideAnimation.value = withTiming(1, {
      duration: 500,
    }, () => {
      slideAnimation.value = 0;
    });
  };

  const handlePrevious = () => {
    if (isNavigating) return;
    if (currentStep > 1) {
      const prev = currentStep - 1;
      imageScale.value = withSpring(0.8, {}, () => {
        runOnJS(updateStep)(prev);
        imageScale.value = withSpring(1);
      });
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

  const renderProgressDots = () => {
    return (
      <View className="flex-row justify-center space-x-2 mb-8">
        {onboardingData.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${
              currentStep === index + 1
                ? 'w-6 bg-purple-600'
                : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={['#ffffff', '#f3f4f6', '#ffffff']}
        className="flex-1"
      >
        <StatusBar barStyle="dark-content" />
        
        <View className="absolute top-4 right-6 z-10">
          <TouchableOpacity
            onPress={handleGetStarted}
            disabled={isNavigating}
            className="bg-gray-50 px-4 py-2 rounded-full shadow-sm"
          >
            <Text className="text-gray-600" style={{fontFamily: 'Poppins-Medium'}}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center items-center px-6">
          <Animated.View 
            className="justify-center items-center mb-12"
            style={animatedImageStyle}
          >
            <View className="rounded-[40px] border-2 border-purple-100 overflow-hidden shadow-2xl bg-white p-2">
              <Image
                source={currentData.image}
                className="w-[280px] h-[280px] rounded-[32px]"
                resizeMode="cover"
              />
            </View>
          </Animated.View>

          <Animated.View className="items-center">
            <Text
              className="text-3xl  text-gray-800 text-center mb-4 leading-tight px-4"
              style={{fontFamily: 'Poppins-Bold'}}
            >
              {currentData.title}
            </Text>
            <Text
              className="text-gray-600 text-center text-lg leading-relaxed px-6"
              style={{fontFamily: 'Poppins-Regular'}}
            >
              {currentData.description}
            </Text>
          </Animated.View>
        </View>

        {renderProgressDots()}

        <View className="p-8">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              onPress={handlePrevious}
              disabled={currentStep === 1 || isNavigating}
              className={`p-3 rounded-full ${
                currentStep === 1 ? 'opacity-50' : ''
              } bg-gray-100`}
            >
              <ChevronLeft color="#4B5563" size={24} />
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-purple-600 rounded-full shadow-lg shadow-purple-300"
              onPress={handleNext}
              disabled={isNavigating}
            >
              <View className="flex-row items-center justify-center gap-2 px-8 py-4">
                <Text
                  className="text-white text-lg"
                  style={{fontFamily: 'Poppins-SemiBold'}}
                >
                  {currentStep === 3 ? 'Get Started' : 'Next'}
                </Text>
                {currentStep === 3 ? (
                  <Check color="white" size={24} />
                ) : (
                  <ChevronRight color="white" size={24} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
