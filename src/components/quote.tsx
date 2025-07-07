import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const Quote = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');

  // Animated values
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8);
  const slideAnim = useSharedValue(50);
  const quoteOpacity = useSharedValue(0);
  const refreshRotation = useSharedValue(0);

  const quotes = {
    morning: [
      {
        text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
        author: 'Winston Churchill',
      },
      {
        text: 'The future depends on what you do today.',
        author: 'Mahatma Gandhi',
      },
      {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: 'Sam Levenson',
      },
    ],
    afternoon: [
      {
        text: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
      },
      {
        text: 'Success usually comes to those who are too busy to be looking for it.',
        author: 'Henry David Thoreau',
      },
      {
        text: 'The difference between ordinary and extraordinary is that little extra.',
        author: 'Jimmy Johnson',
      },
    ],
    evening: [
      {
        text: 'Reflect on your present blessings, of which every man has many.',
        author: 'Charles Dickens',
      },
      {
        text: 'The best preparation for tomorrow is doing your best today.',
        author: 'H. Jackson Brown Jr.',
      },
      {
        text: 'What you do today can improve all your tomorrows.',
        author: 'Ralph Marston',
      },
    ],
  };

  const getTimeBasedQuote = () => {
    const hour = new Date().getHours();
    let currentTimeOfDay: keyof typeof quotes;

    if (hour >= 5 && hour < 12) {
      currentTimeOfDay = 'morning';
    } else if (hour >= 12 && hour < 17) {
      currentTimeOfDay = 'afternoon';
    } else {
      currentTimeOfDay = 'evening';
    }

    setTimeOfDay(currentTimeOfDay);
    const timeQuotes = quotes[currentTimeOfDay];
    const randomQuote =
      timeQuotes[Math.floor(Math.random() * timeQuotes.length)];

    // Animate quote change
    quoteOpacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(setQuote)(randomQuote.text);
      runOnJS(setAuthor)(randomQuote.author);
      quoteOpacity.value = withTiming(1, { duration: 500 });
    });
  };

  const handleRefresh = () => {
    refreshRotation.value = withSequence(
      withTiming(360, { duration: 600 }),
      withTiming(0, { duration: 0 }),
    );
    getTimeBasedQuote();
  };

  useEffect(() => {
    getTimeBasedQuote();

    // Initial animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    scaleAnim.value = withSpring(1, { damping: 8, stiffness: 100 });
    slideAnim.value = withTiming(0, { duration: 600 });

    const interval = setInterval(getTimeBasedQuote, 3600000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'Good Morning';
      case 'afternoon':
        return 'Good Afternoon';
      case 'evening':
        return 'Good Evening';
      default:
        return 'Hello';
    }
  };

  const getTimeIcon = () => {
    const iconProps = { size: 32 };
    switch (timeOfDay) {
      case 'morning':
        return <FontAwesome6 name="sun" {...iconProps} color="#F59E0B" />;
      case 'afternoon':
        return <MaterialIcons name="wb-sunny" {...iconProps} color="#EF4444" />;
      case 'evening':
        return <FontAwesome6 name="moon" {...iconProps} color="#6366F1" />;
      default:
        return <FontAwesome6 name="sun" {...iconProps} color="#F59E0B" />;
    }
  };

  const getGradientColors = () => {
    switch (timeOfDay) {
      case 'morning':
        return ['#FEF3C7', '#FDE68A', '#F59E0B'];
      case 'afternoon':
        return ['#DBEAFE', '#93C5FD', '#3B82F6'];
      case 'evening':
        return ['#E0E7FF', '#C7D2FE', '#6366F1'];
      default:
        return ['#F3F4F6', '#E5E7EB', '#9CA3AF'];
    }
  };

  const getBackgroundGradient = () => {
    switch (timeOfDay) {
      case 'morning':
        return ['#FFFBEB', '#FEF3C7'];
      case 'afternoon':
        return ['#EFF6FF', '#DBEAFE'];
      case 'evening':
        return ['#EEF2FF', '#E0E7FF'];
      default:
        return ['#F9FAFB', '#F3F4F6'];
    }
  };

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: scaleAnim.value }, { translateY: slideAnim.value }],
  }));

  const quoteAnimatedStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
  }));

  const refreshAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${refreshRotation.value}deg` }],
  }));

  return (
    <View className="mt-5" style={{ flex: 1 }}>
      <Animated.View style={[containerAnimatedStyle]}>
        {/* Main Quote Card */}
        <View
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
          }}
        >
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          >
            {/* Header Section */}
            <View
              style={{
                paddingHorizontal: 24,
                paddingTop: 24,
                paddingBottom: 16,
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                {getTimeIcon()}
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: '#1F2937',
                    marginLeft: 12,
                    fontFamily: 'Poppins-Bold',
                  }}
                >
                  {getGreeting()}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleRefresh}
                style={{
                  position: 'absolute',
                  right: 20,
                  top: 20,
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <Animated.View style={refreshAnimatedStyle}>
                  <MaterialIcons name="refresh" size={24} color="#374151" />
                </Animated.View>
              </TouchableOpacity>
            </View>

            {/* Quote Section */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
              <View
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 20,
                  padding: 24,
                  elevation: 4,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}
              >
                {/* Quote Icon */}
                <View
                  style={{
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <FontAwesome6
                    name="quote-left"
                    size={28}
                    color="#6B7280"
                    style={{ opacity: 0.7 }}
                  />
                </View>

                <Animated.View style={quoteAnimatedStyle}>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 28,
                      textAlign: 'center',
                      color: '#1F2937',
                      marginBottom: 20,
                      fontFamily: 'Poppins-Medium',
                      fontStyle: 'italic',
                    }}
                  >
                    {quote}
                  </Text>

                  <View
                    style={{
                      height: 1,
                      backgroundColor: '#E5E7EB',
                      marginBottom: 16,
                      marginHorizontal: 40,
                    }}
                  />

                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: 'center',
                      color: '#6B7280',
                      fontFamily: 'Poppins-SemiBold',
                    }}
                  >
                    — {author}
                  </Text>
                </Animated.View>
              </View>
              {/* Image Section with Overlay */}
              <Image
                source={require('../assets/images/dashboard-employee.png')}
                style={{
                  width: '100%',
                  height: 400,
                }}
                resizeMode="cover"
              />
            </View>
          </LinearGradient>
        </View>
      </Animated.View>
    </View>
  );
};

export default Quote;
