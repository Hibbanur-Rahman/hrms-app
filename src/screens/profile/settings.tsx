import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { 
  ArrowLeft, 
  Settings as SettingsIcon,
  Bell,
  Lock,
  Globe,
  Moon,
  Smartphone,
  Download,
  HelpCircle,
  Shield
} from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  iconBgColor?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  iconBgColor = '#F3F4F6'
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-50"
    activeOpacity={0.7}
  >
    <View 
      className="w-12 h-12 rounded-xl items-center justify-center mr-4"
      style={{ backgroundColor: iconBgColor }}
    >
      {icon}
    </View>
    <View className="flex-1">
      <Text 
        className="text-gray-900 text-base font-medium"
        style={{ fontFamily: 'Poppins-Medium' }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text 
          className="text-gray-500 text-sm mt-1"
          style={{ fontFamily: 'Poppins-Regular' }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);

const Settings = () => {
  const navigation = useNavigation<NavigationProp>();

  const settingItems = [
    {
      icon: <Bell size={20} color="#7563F7" />,
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      onPress: () => {
        // TODO: Navigate to notification settings
      },
      iconBgColor: '#F3F4F6',
    },
    {
      icon: <Lock size={20} color="#EF4444" />,
      title: 'Privacy & Security',
      subtitle: 'Password, biometrics, and more',
      onPress: () => {
        // TODO: Navigate to privacy settings
      },
      iconBgColor: '#FEF2F2',
    },
    {
      icon: <Globe size={20} color="#10B981" />,
      title: 'Language & Region',
      subtitle: 'English (US)',
      onPress: () => {
        // TODO: Navigate to language settings
      },
      iconBgColor: '#ECFDF5',
    },
    {
      icon: <Moon size={20} color="#6B7280" />,
      title: 'Display & Theme',
      subtitle: 'Light mode, text size',
      onPress: () => {
        // TODO: Navigate to display settings
      },
      iconBgColor: '#F9FAFB',
    },
    {
      icon: <Smartphone size={20} color="#3B82F6" />,
      title: 'App Preferences',
      subtitle: 'Default behavior and features',
      onPress: () => {
        // TODO: Navigate to app preferences
      },
      iconBgColor: '#EFF6FF',
    },
    {
      icon: <Download size={20} color="#8B5CF6" />,
      title: 'Storage & Data',
      subtitle: 'Manage downloaded content',
      onPress: () => {
        // TODO: Navigate to storage settings
      },
      iconBgColor: '#F5F3FF',
    },
    {
      icon: <HelpCircle size={20} color="#F59E0B" />,
      title: 'Help & Support',
      subtitle: 'FAQ, contact support',
      onPress: () => {
        // TODO: Navigate to help
      },
      iconBgColor: '#FFFBEB',
    },
    {
      icon: <Shield size={20} color="#059669" />,
      title: 'About App',
      subtitle: 'Version 1.0.0',
      onPress: () => {
        // TODO: Show app info
      },
      iconBgColor: '#ECFDF5',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
            <Text
              className="text-gray-900 text-xl font-semibold"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Settings
            </Text>
            <View className="w-10 h-10" />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Header Card */}
          <View className="bg-gradient-to-br from-[#7563F7] to-[#9333EA] mx-4 mt-4 rounded-3xl p-6">
            <View className="flex-row items-center">
              <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mr-4">
                <SettingsIcon size={28} color="white" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-white text-xl font-bold"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  App Settings
                </Text>
                <Text
                  className="text-white/80 text-sm"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  Customize your experience
                </Text>
              </View>
            </View>
          </View>

          {/* Settings Items */}
          <View className="px-4 mt-6">
            {settingItems.map((item, index) => (
              <SettingItem
                key={index}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                onPress={item.onPress}
                iconBgColor={item.iconBgColor}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
