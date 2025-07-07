import React from 'react';
import { Text, View, TouchableOpacity, Platform, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Home from '../screens/home/home';
import Profile from '../screens/profile/profile';
import Projects from '../screens/projects/projects';
import Leaves from '../screens/leaves/leaves';
import Attendance from '../screens/attendance/attendance';

type TabBarProps = {
  state: TabNavigationState<ParamListBase>;
  descriptors: Record<string, { options: BottomTabNavigationOptions }>;
  navigation: any;
};

const Tab = createBottomTabNavigator();

const AnimatedTabItem = ({ 
  route, 
  index, 
  isFocused, 
  onPress, 
  onLongPress 
}: {
  route: any;
  index: number;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) => {
  const animatedValue = React.useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const scaleValue = React.useRef(new Animated.Value(isFocused ? 1.1 : 1)).current;
  const translateY = React.useRef(new Animated.Value(isFocused ? -2 : 0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: isFocused ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: isFocused ? 1.1 : 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: isFocused ? -2 : 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, [isFocused]);

  const indicatorScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const indicatorOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const textOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  return (
    <TouchableOpacity
      key={route.key}
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center py-3"
      activeOpacity={0.7}
    >
      {/* Animated Top Indicator */}
      <Animated.View 
        className="absolute top-0 h-1 rounded-full bg-[#7563F7] w-8"
        style={{
          transform: [{ scaleX: indicatorScale }],
          opacity: indicatorOpacity,
        }}
      />
      
      {/* Animated Background Circle */}
      <Animated.View
        className={`p-3 rounded-2xl mb-1 overflow-hidden ${isFocused ? 'bg-[#7563F7]/10' : 'bg-transparent'}`}
        style={{
          transform: [
            { scale: scaleValue },
            { translateY: translateY }
          ],
        }}
      >
        {renderIcon(route.name, isFocused, animatedValue)}
      </Animated.View>
      
      {/* Animated Text */}
      <Animated.Text 
        className={`text-xs ${isFocused ? 'font-[Lexend-SemiBold]' : 'font-[Lexend-Regular]'} text-slate-700`}
        style={{
          opacity: textOpacity,
          color: isFocused ? '#7563F7' : '#64748b',
        }}
      >
        {route.name}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const RenderTabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  const slideAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(slideAnimation, {
      toValue: 1,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View 
      className="w-full flex flex-row justify-center pt-2 pb-6 bg-white"
      style={{
        transform: [
          {
            translateY: slideAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0],
            })
          }
        ]
      }}
    >
      {/* Shadow Container */}
      <View className="flex flex-row justify-between items-center w-11/12 bg-white rounded-3xl shadow-2xl border border-[#7563F7]/10"
      style={{
        shadowColor: '#7563F7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
      }}
      >
        {/* Gradient Overlay */}
        <View className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white via-gray-50/50 to-white" />
        
        {/* Tab Items */}
        <View className="flex flex-row justify-between items-center w-full px-2 py-1 relative z-10">
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <AnimatedTabItem
                key={route.key}
                route={route}
                index={index}
                isFocused={isFocused}
                onPress={onPress}
                onLongPress={onLongPress}
              />
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
};

const renderIcon = (routeName: string, isFocused: boolean, animatedValue?: Animated.Value) => {
  const activeColor = '#7563F7';
  const inactiveColor = '#64748b';
  const iconSize = 24;

  const iconRotation = animatedValue?.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '12deg'],
  });

  const iconScale = animatedValue?.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const IconComponent = () => {
    switch (routeName) {
      case 'Home':
        return (
          <Feather
            name="home"
            size={iconSize}
            color={isFocused ? activeColor : inactiveColor}
          />
        );
      case 'Profile':
        return (
          <Feather
            name="user"
            size={iconSize}
            color={isFocused ? activeColor : inactiveColor}
          />
        );
      case 'Leaves':
        return (
          <Feather
            name="calendar"
            size={iconSize}
            color={isFocused ? activeColor : inactiveColor}
          />
        );
      case 'Projects':
        return (
          <Feather
            name="briefcase"
            size={iconSize}
            color={isFocused ? activeColor : inactiveColor}
          />
        );
      case 'Attendance':
        return (
          <Feather
            name="clock"
            size={iconSize}
            color={isFocused ? activeColor : inactiveColor}
          />
        );
      default:
        return (
          <Feather
            name="help-circle"
            size={iconSize}
            color={isFocused ? activeColor : inactiveColor}
          />
        );
    }
  };

  if (animatedValue) {
    return (
      <Animated.View
        style={{
          transform: [
            { rotate: iconRotation || '0deg' },
            { scale: iconScale || 1 }
          ],
        }}
      >
        <IconComponent />
      </Animated.View>
    );
  }

  return <IconComponent />;
};

const Layout = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={props => <RenderTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Projects" component={Projects} />
      <Tab.Screen name="Leaves" component={Leaves} />
      <Tab.Screen name="Attendance" component={Attendance} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Layout;