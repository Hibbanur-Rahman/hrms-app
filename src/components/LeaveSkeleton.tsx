import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

interface LeaveSkeletonProps {
  count?: number;
}

const LeaveSkeleton: React.FC<LeaveSkeletonProps> = ({ count = 3 }) => {
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

  const SkeletonItem = () => (
    <View className="w-full bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
      {/* Header with status */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Animated.View
            style={[shimmerStyle]}
            className="w-3/4 h-5 bg-gray-200 rounded mb-2"
          />
          <View className="flex-row items-center gap-2">
            <Animated.View
              style={[shimmerStyle]}
              className="w-4 h-4 bg-gray-200 rounded"
            />
            <Animated.View
              style={[shimmerStyle]}
              className="w-24 h-4 bg-gray-200 rounded"
            />
          </View>
        </View>
        <Animated.View
          style={[shimmerStyle]}
          className="w-20 h-6 bg-gray-200 rounded-full"
        />
      </View>

      {/* Contact Info */}
      <View className="flex-row items-center gap-4 mb-3">
        <View className="flex-row items-center gap-2">
          <Animated.View
            style={[shimmerStyle]}
            className="w-4 h-4 bg-gray-200 rounded"
          />
          <Animated.View
            style={[shimmerStyle]}
            className="w-32 h-4 bg-gray-200 rounded"
          />
        </View>
        <View className="flex-row items-center gap-2">
          <Animated.View
            style={[shimmerStyle]}
            className="w-4 h-4 bg-gray-200 rounded"
          />
          <Animated.View
            style={[shimmerStyle]}
            className="w-24 h-4 bg-gray-200 rounded"
          />
        </View>
      </View>

      {/* Date Range */}
      <View className="bg-gray-50 rounded-xl p-3 mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Animated.View
              style={[shimmerStyle]}
              className="w-4 h-4 bg-gray-200 rounded"
            />
            <Animated.View
              style={[shimmerStyle]}
              className="w-28 h-4 bg-gray-200 rounded"
            />
          </View>
          <View className="flex-row items-center gap-2">
            <Animated.View
              style={[shimmerStyle]}
              className="w-4 h-4 bg-gray-200 rounded"
            />
            <Animated.View
              style={[shimmerStyle]}
              className="w-28 h-4 bg-gray-200 rounded"
            />
          </View>
        </View>
        <View className="flex-row items-center gap-2 mt-2">
          <Animated.View
            style={[shimmerStyle]}
            className="w-4 h-4 bg-gray-200 rounded"
          />
          <Animated.View
            style={[shimmerStyle]}
            className="w-20 h-4 bg-gray-200 rounded"
          />
        </View>
      </View>

      {/* File section (sometimes present) */}
      <View className="mb-3">
        <Animated.View
          style={[shimmerStyle]}
          className="w-16 h-4 bg-gray-200 rounded mb-2"
        />
        <View className="flex-row items-center gap-2">
          <Animated.View
            style={[shimmerStyle]}
            className="w-4 h-4 bg-gray-200 rounded"
          />
          <Animated.View
            style={[shimmerStyle]}
            className="w-20 h-4 bg-gray-200 rounded"
          />
        </View>
      </View>

      {/* Reason */}
      <View className="mb-3">
        <Animated.View
          style={[shimmerStyle]}
          className="w-16 h-4 bg-gray-200 rounded mb-2"
        />
        <Animated.View
          style={[shimmerStyle]}
          className="w-full h-4 bg-gray-200 rounded mb-1"
        />
        <Animated.View
          style={[shimmerStyle]}
          className="w-4/5 h-4 bg-gray-200 rounded"
        />
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
        <Animated.View
          style={[shimmerStyle]}
          className="w-32 h-3 bg-gray-200 rounded"
        />
        <Animated.View
          style={[shimmerStyle]}
          className="w-36 h-3 bg-gray-200 rounded"
        />
      </View>
    </View>
  );

  return (
    <View className="w-full">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </View>
  );
};

export default LeaveSkeleton; 