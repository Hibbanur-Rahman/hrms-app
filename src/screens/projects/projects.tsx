import { View, Text, SafeAreaView } from 'react-native';
const Projects = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text
          className="text-2xl text-gray-700"
          style={{ fontFamily: 'Poppins-Bold' }}
        >
          Projects
        </Text>
      </View>
    </SafeAreaView>
  );
};
export default Projects;
