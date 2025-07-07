import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { ChevronRight } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

interface SwipeToActionProps {
  onCheckIn: () => void;
  onCheckOut: () => void;
  isCheckedIn: boolean;
  containerWidth?: number;
}

const SwipeToAction: React.FC<SwipeToActionProps> = ({
  onCheckIn,
  onCheckOut,
  isCheckedIn,
  containerWidth = 300,
}) => {
  const translateX = useSharedValue(0);
  const buttonWidth = 60;
  const maxTranslateX = containerWidth - buttonWidth - 8; // 8 for padding
  const swipeThreshold = maxTranslateX * 0.7; // 70% of max travel distance

  const handleCheckIn = () => {
    onCheckIn();
  };

  const handleCheckOut = () => {
    onCheckOut();
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
    },
    onActive: (event, context: any) => {
      const newTranslateX = context.startX + event.translationX;
      translateX.value = Math.max(0, Math.min(newTranslateX, maxTranslateX));
    },
    onEnd: () => {
      if (translateX.value > swipeThreshold) {
        translateX.value = withSpring(maxTranslateX, {}, () => {
          runOnJS(isCheckedIn ? handleCheckOut : handleCheckIn)();
        });
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    const progress = translateX.value / maxTranslateX;
    return {
      width: `${Math.max(0, Math.min(progress * 100, 100))}%`,
    };
  });

  const backgroundColorStyle = useAnimatedStyle(() => {
    const progress = translateX.value / maxTranslateX;
    const backgroundColor = interpolateColor(
      progress,
      [0, 0.7, 1],
      ['#e5e7eb', '#10b981', '#059669']
    );
    return {
      backgroundColor,
    };
  });

  const resetSwipe = () => {
    translateX.value = withSpring(0);
  };

  // Reset swipe position when state changes
  useEffect(() => {
    resetSwipe();
  }, [isCheckedIn]);

  return (
    <Animated.View 
      className="w-full rounded-full overflow-hidden p-2 relative"
      style={[{ height: 70 }, backgroundColorStyle]}
    >
      <Animated.View 
        className="absolute top-0 left-0 h-[70px] rounded-full opacity-30"
        style={[progressStyle, { backgroundColor: '#ffffff' }]}
      />
      
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View 
          style={[
            animatedStyle,
            {
              position: 'absolute',
              top: 5,
              left: 4,
              zIndex: 10,
            }
          ]}
        >
          <View 
            className="bg-black rounded-full flex-row items-center justify-center"
            style={{ 
              width: buttonWidth, 
              height: buttonWidth,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <ChevronRight size={20} color="white" />
            <ChevronRight
              size={20}
              color="#ffffff80"
              style={{ marginLeft: -12 }}
            />
            <ChevronRight
              size={20}
              color="#ffffff60"
              style={{ marginLeft: -12 }}
            />
          </View>
        </Animated.View>
      </PanGestureHandler>

      <View 
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingLeft: buttonWidth + 20 }}
      >
        <Text
          className="text-black text-center text-lg font-medium"
          style={{ fontFamily: 'Poppins-Medium' }}
        >
          {isCheckedIn ? 'Swipe to check out' : 'Swipe to check in'}
        </Text>
      </View>
    </Animated.View>
  );
};

export default SwipeToAction; 