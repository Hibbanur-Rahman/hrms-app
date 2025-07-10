import React from 'react';
import { TouchableOpacity, View, Text, SafeAreaView } from 'react-native';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Notification = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1  items-center px-4 py-3">
        {/**header */}
        <View className="bg-white  border-b border-gray-100 w-full pb-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="flex-row items-center gap-2 bg-gray-100 rounded-full p-2"
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
            <Text
              className="text-gray-900 text-xl font-semibold"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Notification
            </Text>
            <View></View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Notification;
