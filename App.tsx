import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    image: require('../../assets/images/slide-img1.jpg'),
    title: 'Easy way to confirm your attendance',
    description: 'Streamline your attendance tracking with our intuitive and user-friendly interface designed for modern workplaces.',
  },
  {
    id: 2,
    image: require('../../assets/images/slide-img2.jpg'),
    title: 'Disciplinary in your hand',
    description: 'Take control of workplace discipline management with powerful tools at your fingertips, anytime, anywhere.',
  },
  {
    id: 3,
    image: require('../../assets/images/slide-img3.jpg'),
    title: 'Reduce HR management workload',
    description: 'Automate routine HR tasks and focus on what matters most - building a great workplace culture.',
  },
];

const StartScreens = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGetStarted = () => {
    // Navigate to main app or login screen
    console.log('Get Started pressed');
  };

  const currentData = onboardingData[currentStep - 1];

  return (
    <View className="flex-1 bg-gradient-to-b from-purple-50 to-white">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Skip Button */}
      <View className="absolute top-12 right-6 z-10">
        <TouchableOpacity 
          className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm"
          onPress={handleGetStarted}
        >
          <Text className="text-gray-600 font-medium">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Image Section */}
      <View className="flex-1 justify-center items-center pt-16 pb-8">
        <View className="relative">
          {/* Background Circle */}
          <View className="absolute -inset-8 bg-purple-100 rounded-full opacity-20" />
          <View className="absolute -inset-4 bg-purple-200 rounded-full opacity-30" />
          
          {/* Image Container */}
          <View className="w-80 h-80 rounded-full overflow-hidden shadow-2xl bg-white">
            <Image 
              source={currentData.image} 
              className="w-full h-full" 
              resizeMode="cover" 
            />
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View className="px-8 pb-8">
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-gray-800 text-center mb-4 leading-tight">
            {currentData.title}
          </Text>
          <Text className="text-gray-600 text-center text-base leading-relaxed px-4">
            {currentData.description}
          </Text>
        </View>

        {/* Progress Indicators */}
        <View className="flex-row justify-center items-center mb-8">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              className={`h-2 mx-1 rounded-full transition-all duration-300 ${
                index + 1 === currentStep 
                  ? 'w-8 bg-purple-600' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row justify-between items-center">
          {/* Previous Button */}
          <TouchableOpacity
            className={`flex-row items-center justify-center w-12 h-12 rounded-full ${
              currentStep === 1 
                ? 'bg-gray-100' 
                : 'bg-white shadow-md border border-gray-200'
            }`}
            onPress={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft 
              size={20} 
              color={currentStep === 1 ? '#9CA3AF' : '#6B7280'} 
            />
          </TouchableOpacity>

          {/* Next/Get Started Button */}
          <TouchableOpacity
            className="bg-purple-600 rounded-full px-8 py-4 shadow-lg flex-row items-center justify-center min-w-[140px]"
            onPress={currentStep === 3 ? handleGetStarted : handleNext}
            activeOpacity={0.8}
          >
            {currentStep === 3 ? (
              <>
                <Check size={20} color="white" />
                <Text className="text-white font-semibold ml-2 text-base">
                  Get Started
                </Text>
              </>
            ) : (
              <>
                <Text className="text-white font-semibold mr-2 text-base">
                  Next
                </Text>
                <ChevronRight size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Safe Area */}
      <View className="h-8" />
    </View>
  );
};

export default StartScreens;