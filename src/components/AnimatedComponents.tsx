import React from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  className?: string;
  scaleValue?: number;
  springConfig?: {
    damping?: number;
    stiffness?: number;
  };
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onPress,
  style,
  className,
  scaleValue = 0.95,
  springConfig = { damping: 15, stiffness: 300 },
  disabled = false,
  ...props
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const gesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withTiming(scaleValue, { duration: 100 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, springConfig);
      if (!disabled) {
        runOnJS(onPress)();
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[animatedStyle, style]} className={className} {...props}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: any;
  className?: string;
  delay?: number;
  index?: number;
  onPress?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  style,
  className,
  delay = 0,
  index = 0,
  onPress,
  ...props
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 }, () => {
      // Animation completed
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      {
        translateY: (1 - opacity.value) * 50,
      },
    ],
  }));

  const handlePress = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15 }, () => {
        scale.value = withSpring(1, { damping: 15 });
      });
      onPress();
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <Animated.View style={[animatedStyle, style]} className={className} {...props}>
          {children}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]} className={className} {...props}>
      {children}
    </Animated.View>
  );
};

interface PulseProps {
  children: React.ReactNode;
  pulseScale?: number;
  duration?: number;
  style?: any;
  className?: string;
}

export const PulseAnimation: React.FC<PulseProps> = ({
  children,
  pulseScale = 1.05,
  duration = 1000,
  style,
  className,
  ...props
}) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    const pulse = () => {
      scale.value = withSpring(pulseScale, { damping: 15 }, () => {
        scale.value = withSpring(1, { damping: 15 }, () => {
          // Repeat animation
          setTimeout(pulse, duration);
        });
      });
    };
    pulse();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} className={className} {...props}>
      {children}
    </Animated.View>
  );
};

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
  delay?: number;
  style?: any;
  className?: string;
}

export const SlideInAnimation: React.FC<SlideInProps> = ({
  children,
  direction = 'up',
  distance = 50,
  delay = 0,
  style,
  className,
  ...props
}) => {
  const translateX = useSharedValue(direction === 'left' ? -distance : direction === 'right' ? distance : 0);
  const translateY = useSharedValue(direction === 'up' ? distance : direction === 'down' ? -distance : 0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      translateX.value = withSpring(0, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 600 });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} className={className} {...props}>
      {children}
    </Animated.View>
  );
};

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: any;
  className?: string;
}

export const FadeInAnimation: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 600,
  style,
  className,
  ...props
}) => {
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]} className={className} {...props}>
      {children}
    </Animated.View>
  );
}; 