import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import {
  MapPin,
  Clock,
  CheckCircle,
  Wifi,
  Shield,
  Loader,
  X,
  AlertCircle,
} from 'lucide-react-native';

interface CheckInLoadingModalProps {
  visible: boolean;
  onClose?: () => void;
  type?: 'checkin' | 'checkout';
  onComplete?: () => void;
  isProcessing?: boolean;
}

const { width, height } = Dimensions.get('window');

const CheckInLoadingModal: React.FC<CheckInLoadingModalProps> = ({
  visible,
  onClose,
  type = 'checkin',
  onComplete,
  isProcessing = true,
}) => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  const steps = [
    {
      icon: MapPin,
      text: 'Getting your location...',
      color: '#3B82F6',
      duration: 2000,
    },
    {
      icon: Wifi,
      text: 'Connecting to server...',
      color: '#10B981',
      duration: 1500,
    },
    {
      icon: Shield,
      text: 'Verifying credentials...',
      color: '#F59E0B',
      duration: 1800,
    },
    {
      icon: CheckCircle,
      text: 'Check-in successful!',
      color: '#10B981',
      duration: 1000,
    },
  ];

  const checkoutSteps = [
    {
      icon: Clock,
      text: 'Calculating work hours...',
      color: '#3B82F6',
      duration: 1500,
    },
    {
      icon: Wifi,
      text: 'Sending data to server...',
      color: '#10B981',
      duration: 2000,
    },
    {
      icon: Shield,
      text: 'Securing your session...',
      color: '#F59E0B',
      duration: 1200,
    },
    {
      icon: CheckCircle,
      text: 'Check-out successful!',
      color: '#10B981',
      duration: 1000,
    },
  ];

  const activeSteps = type === 'checkin' ? steps : checkoutSteps;

  useEffect(() => {
    if (visible) {
      startAnimation();
    } else {
      resetAnimation();
    }
  }, [visible]);

  useEffect(() => {
    if (!isProcessing && visible) {
      // API call completed, show success
      setTimeout(() => {
        setIsCompleted(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 1500);
      }, 500);
    }
  }, [isProcessing, visible]);

  const startAnimation = () => {
    setCurrentIconIndex(0);
    setCurrentText(activeSteps[0].text);
    setIsCompleted(false);
    
    // Start the icon sequence animation
    animateIconSequence();
    
    // Start the progress animation
    progress.value = withTiming(1, { duration: 6000 });
    
    // Start pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
  };

  const resetAnimation = () => {
    setCurrentIconIndex(0);
    setCurrentText('');
    setIsCompleted(false);
    progress.value = 0;
    scale.value = 1;
    opacity.value = 1;
    rotation.value = 0;
    pulseScale.value = 1;
  };

  const animateIconSequence = () => {
    let currentIndex = 0;
    
    const animateNext = () => {
      if (currentIndex < activeSteps.length - 1) { // Don't show success icon yet
        setCurrentIconIndex(currentIndex);
        setCurrentText(activeSteps[currentIndex].text);
        
        // Icon entrance animation
        scale.value = 0;
        opacity.value = 0;
        rotation.value = -180;
        
        scale.value = withTiming(1, { duration: 300 });
        opacity.value = withTiming(1, { duration: 300 });
        rotation.value = withTiming(0, { duration: 300 });
        
        // Schedule next icon
        setTimeout(() => {
          currentIndex++;
          if (currentIndex < activeSteps.length - 1) {
            animateNext();
          }
        }, activeSteps[currentIndex].duration);
      }
    };
    
    animateNext();
  };

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progress.value, [0, 1], [0, 100], Extrapolate.CLAMP)}%`,
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const CurrentIcon = isCompleted 
    ? CheckCircle 
    : activeSteps[currentIconIndex]?.icon || Loader;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <Animated.View 
          style={pulseAnimatedStyle}
          className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
        >
          {/* Close button */}
          {onClose && !isCompleted && (
            <TouchableOpacity
              onPress={onClose}
              className="absolute top-4 right-4 z-10"
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          )}

          {/* Main content */}
          <View className="items-center">
            {/* Animated Icon */}
            <View className="w-24 h-24 bg-gray-50 rounded-full justify-center items-center mb-6 border-4 border-gray-100">
              <Animated.View style={iconAnimatedStyle}>
                <CurrentIcon 
                  size={48} 
                  color={isCompleted ? '#10B981' : (activeSteps[currentIconIndex]?.color || '#6B7280')} 
                />
              </Animated.View>
            </View>

            {/* Title */}
            <Text
              className="text-2xl font-bold text-gray-800 mb-2 text-center"
              style={{ fontFamily: 'Poppins-Bold' }}
            >
              {isCompleted 
                ? (type === 'checkin' ? 'Check-in Complete!' : 'Check-out Complete!')
                : (type === 'checkin' ? 'Checking In' : 'Checking Out')
              }
            </Text>

            {/* Current step text */}
            <Text
              className="text-gray-600 text-center mb-6"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              {isCompleted 
                ? 'Your attendance has been recorded successfully'
                : currentText
              }
            </Text>

            {/* Progress bar */}
            <View className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
              <Animated.View
                style={[
                  progressAnimatedStyle,
                  {
                    height: 8,
                    backgroundColor: isCompleted 
                      ? '#10B981' 
                      : (activeSteps[currentIconIndex]?.color || '#6B7280'),
                    borderRadius: 4,
                  },
                ]}
              />
            </View>

            {/* Step indicator */}
            <View className="flex-row items-center gap-2 mb-6">
              {activeSteps.map((_, index) => (
                <View
                  key={index}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: isCompleted || index <= currentIconIndex
                      ? activeSteps[index]?.color || '#6B7280'
                      : '#E5E7EB',
                  }}
                />
              ))}
            </View>

            {/* Additional info */}
            {!isCompleted && (
              <View className="p-4 bg-blue-50 rounded-2xl w-full border border-blue-100">
                <View className="flex-row items-center gap-2">
                  <AlertCircle size={16} color="#3B82F6" />
                  <Text
                    className="text-blue-800 text-sm flex-1"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Please don't close the app during this process
                  </Text>
                </View>
              </View>
            )}

            {/* Success message */}
            {isCompleted && (
              <View className="p-4 bg-green-50 rounded-2xl w-full border border-green-100">
                <View className="flex-row items-center gap-2">
                  <CheckCircle size={16} color="#10B981" />
                  <Text
                    className="text-green-800 text-sm flex-1"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Your attendance has been recorded successfully
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CheckInLoadingModal;
