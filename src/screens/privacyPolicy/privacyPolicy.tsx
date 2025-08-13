import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Bell } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const PrivacyPolicy = () => {
  const navigation = useNavigation<NavigationProp>();
  const openWebsite = () => {
    Linking.openURL('https://www.mithilastack.com/');
  };

  const openEmail = () => {
    Linking.openURL('mailto:business@mithilastack.com');
  };

  const openPhone = () => {
    Linking.openURL('tel:+918579009245');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
         {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-200">
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
              Privacy Policy
            </Text>
            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              onPress={() => navigation.navigate('Notification')}
              activeOpacity={0.7}
            >
              <Bell size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      <ScrollView className="flex-1 px-4 py-4">
       

        {/* Company Info Card */}
        <View className="bg-white rounded-3xl shadow-lg mb-6 p-6 border border-gray-200">
          <Text className="text-xl  text-gray-800 mb-4 text-center" style={{ fontFamily: 'Poppins-Medium' }}>
            Mithilastack Pvt. Ltd.
          </Text>

          <View className="gap-y-4">
            {/* Email */}
            <TouchableOpacity
              onPress={openEmail}
              className="flex-row items-center"
            >
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Text className="text-blue-600 font-bold" style={{ fontFamily: 'Poppins-Bold' }}>@</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500" style={{ fontFamily: 'Poppins-Regular' }}>Email</Text>
                <Text className="text-blue-600 font-medium underline" style={{ fontFamily: 'Poppins-Medium' }}>
                  business@mithilastack.com
                </Text>
              </View>
            </TouchableOpacity>

            {/* Phone */}
            <TouchableOpacity
              onPress={openPhone}
              className="flex-row items-center"
            >
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
                <Text className="text-green-600 font-bold" style={{ fontFamily: 'Poppins-Bold' }}>📞</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500" style={{ fontFamily: 'Poppins-Regular' }}>Business Phone</Text>
                <Text className="text-green-600 font-medium underline" style={{ fontFamily: 'Poppins-Medium' }}>
                  +91 8579009245
                </Text>
              </View>
            </TouchableOpacity>

            {/* Address */}
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4">
                <Text className="text-purple-600 font-bold" style={{ fontFamily: 'Poppins-Bold' }}>📍</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500" style={{ fontFamily: 'Poppins-Regular' }}>Address</Text>
                <Text className="text-gray-700 font-medium" style={{ fontFamily: 'Poppins-Medium' }}>
                  Darbhanga, Mithila, Bihar
                </Text>
              </View>
            </View>

            {/* Website */}
            <TouchableOpacity
              onPress={openWebsite}
              className="flex-row items-center"
            >
              <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-4">
                <Text className="text-orange-600 font-bold" style={{ fontFamily: 'Poppins-Bold' }}>🌐</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500" style={{ fontFamily: 'Poppins-Regular' }}>Website</Text>
                <Text className="text-orange-600 font-medium underline" style={{ fontFamily: 'Poppins-Medium' }}>
                  www.mithilastack.com
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy Policy Content */}
        <View className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins-Bold' }}>
            Information Collection and Use
          </Text>
          <Text className="text-gray-600 leading-6 mb-4" style={{ fontFamily: 'Poppins-Regular' }}>
            We collect information you provide directly to us, such as when you
            create an account, use our HRMS services, or contact us for support.
            This may include your name, email address, phone number, and other
            professional information necessary for HR management.
          </Text>
        </View>

        <View className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins-Bold' }}>
            Data Security
          </Text>
          <Text className="text-gray-600 leading-6 mb-4" style={{ fontFamily: 'Poppins-Regular' }}>
            We implement appropriate security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or
            destruction. Your data is encrypted and stored securely in
            compliance with industry standards.
          </Text>
        </View>

        <View className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins-Bold' }}>
            Location Information
          </Text>
          <Text className="text-gray-600 leading-6 mb-4" style={{ fontFamily: 'Poppins-Regular' }}>
            Our app may collect location information to enable attendance
            tracking and other location-based features. This information is used
            solely for the intended HR functions and is not shared with third
            parties without your consent.
          </Text>
        </View>

        <View className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins-Bold' }}>
            Data Retention
          </Text>
          <Text className="text-gray-600 leading-6 mb-4" style={{ fontFamily: 'Poppins-Regular' }}>
            We retain your personal information for as long as necessary to
            provide our services and comply with legal obligations. You may
            request deletion of your data at any time, subject to applicable
            legal requirements.
          </Text>
        </View>

        <View className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins-Bold' }}>
            Third-Party Services
          </Text>
          <Text className="text-gray-600 leading-6 mb-4" style={{ fontFamily: 'Poppins-Regular' }}>
            Our app may integrate with third-party services for enhanced
            functionality. These services have their own privacy policies, and
            we encourage you to review them. We are not responsible for the
            privacy practices of third-party services.
          </Text>
        </View>

        <View className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins-Bold' }}>
            Your Rights
          </Text>
          <Text className="text-gray-600 leading-6 mb-4" style={{ fontFamily: 'Poppins-Regular' }}>
            You have the right to access, update, or delete your personal
            information. You may also opt out of certain communications and data
            processing activities. To exercise these rights, please contact us
            using the information provided above.
          </Text>
        </View>

        <View className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins-Bold' }}>
            Changes to This Policy
          </Text>
          <Text className="text-gray-600 leading-6 mb-4" style={{ fontFamily: 'Poppins-Regular' }}>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date. Your continued use of our
            services constitutes acceptance of the updated policy.
          </Text>
        </View>

        {/* Contact Us Section */}
        <View className="bg-blue-600 rounded-3xl p-6 mb-8">
          <Text className="text-xl font-bold text-white text-center mb-4" style={{ fontFamily: 'Poppins-Bold' }}>
            Have Questions?
          </Text>
          <Text className="text-blue-100 text-center mb-4" style={{ fontFamily: 'Poppins-Regular' }}>
            If you have any questions about this Privacy Policy, please don't
            hesitate to contact us.
          </Text>
          <TouchableOpacity
            onPress={openEmail}
            className="bg-white rounded-lg py-3 px-6 mx-4"
          >
            <Text className="text-blue-600 font-bold text-center" style={{ fontFamily: 'Poppins-Bold' }}>
              Contact Us
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center mb-6">
          <Text className="text-gray-500 text-sm text-center" style={{ fontFamily: 'Poppins-Regular' }}>
            Last updated: August 13, 2025
          </Text>
          <Text className="text-gray-400 text-xs text-center mt-2" style={{ fontFamily: 'Poppins-Regular' }}>
            © 2025 Mithilastack Pvt. Ltd. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
