import React from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Home from '../screens/home/home';
import Profile from '../screens/profile/profile';

// Placeholder components - replace these with your actual components
const Offers = () => <View />;
const Pharmacy = () => <View />;

type TabBarProps = {
  state: TabNavigationState<ParamListBase>;
  descriptors: Record<string, { options: BottomTabNavigationOptions }>;
  navigation: any;
};

const Tab = createBottomTabNavigator();

const RenderTabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  return (
    <View className={`w-full flex flex-row justify-center pb-${Platform.OS === 'ios' ? '8' : '3'} pt-1 bg-white shadow-lg`}>
      <View className="flex flex-row justify-between items-center w-11/12 p-1 bg-white rounded-2xl border border-[#7563F7]/20">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
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
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              className={`flex-1 items-center justify-center py-2.5 ${isFocused ? 'relative' : ''}`}
            >
              {isFocused && (
                <View className="absolute top-0 left-1/4 right-1/4 h-1 rounded-full bg-[#7563F7] w-1/2" />
              )}
              <View className={`p-2 rounded-full mb-1 overflow-hidden ${isFocused ? 'bg-[#f0edff]' : 'bg-transparent'}`}>
                {renderIcon(route.name, isFocused)}
              </View>
              <Text 
                className={`text-sm ${isFocused ? 'font-[Lexend-Medium]' : 'font-[Lexend-Regular]'} text-slate-700`}
              >
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const renderIcon = (routeName: string, isFocused: boolean) => {
  const activeColor = '#7563F7';
  const inactiveColor = '#64748b'; // slate-500
  const iconSize = 22;

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
    case 'Pharmacy':
      return (
        <Feather
          name="shopping-bag"
          size={iconSize}
          color={isFocused ? activeColor : inactiveColor}
        />
      );
    case 'Offers':
      return (
        <Feather
          name="tag"
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

const Layout = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide the default tab bar
      }}
      tabBar={props => <RenderTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Offers" component={Offers} />
      <Tab.Screen name="Pharmacy" component={Pharmacy} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Layout;