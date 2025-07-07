import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import logo from '../../assets/images/userImg.jpg';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import {
  CalendarRange,
  ChevronRight,
  CircleArrowOutDownLeft,
  CircleArrowOutUpRight,
  SquareCheckBig,
} from 'lucide-react-native';
import React, { useState } from 'react';
import SwipeToAction from '../../components/SwipeToAction';
import Quote from '../../components/quote';

const Home = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    // Add your check-in logic here
    console.log('Checked in!');
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    // Add your check-out logic here
    console.log('Checked out!');
  };

  console.log(user);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center items-center px-4 py-3">
          {/** header */}
          <View className="flex-row items-center justify-between w-full">
            <View className="flex-row items-center gap-2">
              <Image
                source={user?.profileImage ? { uri: user?.profileImage } : logo}
                className="w-16 h-16 rounded-full"
              />
              <View>
                <Text
                  className="text-gray-700"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  {user?.name}
                </Text>
                <Text
                  className="text-gray-700"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  {user?.designation}
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity className="p-2 rounded-full border border-gray-300">
                <Feather name="bell" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
         
          {/* Attendance dashboard data*/}
          <View className="flex-col items-center justify-center w-full rounded-3xl border border-gray-300 p-2 mt-8">
            <View className="flex-row items-center justify-between w-full">
              <View className="w-6/12 pe-2">
                <View className="relative p-2 border border-gray-300 rounded-2xl flex-row  justify-between w-full">
                  <View className="flex-col  gap-2">
                    <Text
                      className="text-gray-700 text-2xl"
                      style={{ fontFamily: 'Poppins-Bold' }}
                    >
                      09:46
                    </Text>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      Checked In
                    </Text>
                  </View>
                  <CircleArrowOutDownLeft
                    size={24}
                    color="gray"
                    style={{ position: 'absolute', right: 10, top: 10 }}
                  />
                </View>
              </View>
              <View className="w-6/12 ps-2">
                <View className="relative p-2 border border-gray-300 rounded-2xl flex-row  justify-between w-full">
                  <View className="flex-col  gap-2">
                    <Text
                      className="text-gray-700 text-2xl"
                      style={{ fontFamily: 'Poppins-Bold' }}
                    >
                      17:46
                    </Text>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      Checked Out
                    </Text>
                  </View>
                  <CircleArrowOutUpRight
                    size={24}
                    color="gray"
                    style={{ position: 'absolute', right: 10, top: 10 }}
                  />
                </View>
              </View>
            </View>
            <View className="flex-row items-center justify-between w-full mt-3">
              <View className="w-6/12 pe-2">
                <View className="relative p-2 border border-gray-300 rounded-2xl flex-row  justify-between w-full">
                  <View className="flex-col  gap-2">
                    <Text
                      className="text-gray-700 text-2xl"
                      style={{ fontFamily: 'Poppins-Bold' }}
                    >
                      10 hrs
                    </Text>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      Total Working Hours
                    </Text>
                  </View>
                  <SquareCheckBig
                    size={24}
                    color="gray"
                    style={{ position: 'absolute', right: 10, top: 10 }}
                  />
                </View>
              </View>
              <View className="w-6/12 ps-2">
                <View className="relative p-2 border border-gray-300 rounded-2xl flex-row  justify-between w-full">
                  <View className="flex-col  gap-2">
                    <Text
                      className="text-gray-700 text-2xl"
                      style={{ fontFamily: 'Poppins-Bold' }}
                    >
                      29 days
                    </Text>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      Total Attendance
                    </Text>
                  </View>
                  <CalendarRange
                    size={24}
                    color="gray"
                    style={{ position: 'absolute', right: 10, top: 10 }}
                  />
                </View>
              </View>
            </View>

            {/* Swipe to check in/out */}
            <View className="flex-row items-center justify-between w-full mt-3">
              <SwipeToAction
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                isCheckedIn={isCheckedIn}
                containerWidth={320}
              />
            </View>
          </View>
           {/**quote of the day */}
           <Quote />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Home;
