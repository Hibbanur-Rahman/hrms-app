import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';

interface LoadingAnimationProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  type?: 'dots' | 'pulse' | 'spinner' | 'skeleton';
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = 'medium',
  color = '#4F46E5',
  text,
  type = 'dots',
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { dotSize: 8, spacing: 4, containerSize: 60 };
      case 'large':
        return { dotSize: 16, spacing: 8, containerSize: 120 };
      default:
        return { dotSize: 12, spacing: 6, containerSize: 80 };
    }
  };

  const { dotSize, spacing, containerSize } = getDimensions();

  if (type === 'dots') {
    return <DotsLoading size={dotSize} color={color} text={text} />;
  }

  if (type === 'pulse') {
    return <PulseLoading size={containerSize} color={color} text={text} />;
  }

  if (type === 'spinner') {
    return <SpinnerLoading size={containerSize} color={color} text={text} />;
  }

  if (type === 'skeleton') {
    return <SkeletonLoading />;
  }

  return <DotsLoading size={dotSize} color={color} text={text} />;
};

const DotsLoading: React.FC<{ size: number; color: string; text?: string }> = ({
  size,
  color,
  text,
}) => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const animateDots = () => {
      dot1.value = withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 600 })
      );
      dot2.value = withDelay(
        200,
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0, { duration: 600 })
        )
      );
      dot3.value = withDelay(
        400,
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0, { duration: 600 })
        )
      );
    };

    const interval = setInterval(animateDots, 1500);
    animateDots(); // Start immediately

    return () => clearInterval(interval);
  }, []);

  const createDotStyle = (dotValue: Animated.SharedValue<number>) =>
    useAnimatedStyle(() => ({
      transform: [
        {
          scale: interpolate(
            dotValue.value,
            [0, 1],
            [0.5, 1.2],
            Extrapolate.CLAMP
          ),
        },
      ],
      opacity: interpolate(dotValue.value, [0, 1], [0.3, 1], Extrapolate.CLAMP),
    }));

  return (
    <View className="flex-1 justify-center items-center py-8">
      <View className="flex-row items-center gap-2 mb-4">
        <Animated.View
          style={[
            createDotStyle(dot1),
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
          ]}
        />
        <Animated.View
          style={[
            createDotStyle(dot2),
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
          ]}
        />
        <Animated.View
          style={[
            createDotStyle(dot3),
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      {text && (
        <Text
          className="text-gray-600 text-sm text-center"
          style={{ fontFamily: 'Poppins-Regular' }}
        >
          {text}
        </Text>
      )}
    </View>
  );
};

const PulseLoading: React.FC<{ size: number; color: string; text?: string }> = ({
  size,
  color,
  text,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View className="flex-1 justify-center items-center py-8">
      <Animated.View
        style={[
          animatedStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            marginBottom: 16,
          },
        ]}
      />
      {text && (
        <Text
          className="text-gray-600 text-sm text-center"
          style={{ fontFamily: 'Poppins-Regular' }}
        >
          {text}
        </Text>
      )}
    </View>
  );
};

const SpinnerLoading: React.FC<{ size: number; color: string; text?: string }> = ({
  size,
  color,
  text,
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="flex-1 justify-center items-center py-8">
      <Animated.View style={[animatedStyle, { marginBottom: 16 }]}>
        <Feather name="loader" size={size * 0.6} color={color} />
      </Animated.View>
      {text && (
        <Text
          className="text-gray-600 text-sm text-center"
          style={{ fontFamily: 'Poppins-Regular' }}
        >
          {text}
        </Text>
      )}
    </View>
  );
};

const SkeletonLoading: React.FC = () => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.7], Extrapolate.CLAMP),
  }));

  return (
    <View className="w-full p-0 space-y-4">
     

      {/* Cards Skeleton */}
      {[1, 2, 3].map((index) => (
        <View key={index} className="w-full bg-white rounded-3xl p-0 overflow-hidden border border-gray-200 my-4">
          {/* Image Skeleton */}
          <Animated.View
            style={[shimmerStyle]}
            className="w-full h-[150px] bg-gray-200"
          />
          
          {/* Content Skeleton */}
          <View className="p-4 space-y-3">
            <Animated.View
              style={[shimmerStyle]}
              className="w-3/4 h-5 bg-gray-200 rounded"
            />
            <Animated.View
              style={[shimmerStyle]}
              className="w-1/2 h-4 bg-gray-200 rounded"
            />
            <Animated.View
              style={[shimmerStyle]}
              className="w-full h-4 bg-gray-200 rounded"
            />
            <Animated.View
              style={[shimmerStyle]}
              className="w-4/5 h-4 bg-gray-200 rounded"
            />
            
            {/* Action Row Skeleton */}
            <View className="flex-row items-center justify-between pt-2">
              <Animated.View
                style={[shimmerStyle]}
                className="w-24 h-8 bg-gray-200 rounded-xl"
              />
              <View className="flex-row gap-2">
                <Animated.View
                  style={[shimmerStyle]}
                  className="w-8 h-8 bg-gray-200 rounded-full"
                />
                <Animated.View
                  style={[shimmerStyle]}
                  className="w-8 h-8 bg-gray-200 rounded-full"
                />
                <Animated.View
                  style={[shimmerStyle]}
                  className="w-8 h-8 bg-gray-200 rounded-full"
                />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default LoadingAnimation; 