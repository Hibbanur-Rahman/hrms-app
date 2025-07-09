import Feather from 'react-native-vector-icons/Feather';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Attendance = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1  items-center px-4 py-3">
        {/**header */}
        <View className="w-full flex flex-row items-center justify-between">
          <TouchableOpacity
            className="flex-row items-center gap-2 border border-gray-200 rounded-2xl p-2 py-1"
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={20} color="gray" />
            <Text
              className="text-gray-700 text-sm"
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              Back
            </Text>
          </TouchableOpacity>
          <View>
            <Text
              className="text-gray-700 text-xl"
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              Attendance
            </Text>
          </View>
          <View>
            <TouchableOpacity className="p-2 rounded-full border border-gray-300">
              <Feather name="bell" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Attendance;
