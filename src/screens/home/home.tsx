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
  Bell,
  Calendar,
  CalendarRange,
  ChevronRight,
  CircleArrowOutDownLeft,
  CircleArrowOutUpRight,
  Clock,
  FileBadge,
  FileDigit,
  MapPin,
  SquareCheckBig,
  Timer,
  Watch,
} from 'lucide-react-native';
import React, { useState } from 'react';
import SwipeToAction from '../../components/SwipeToAction';
import Quote from '../../components/quote';
import { RootStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Home = () => {
  const navigation = useNavigation<NavigationProp>();
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
          <View className="flex-row items-center justify-between w-full ">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Layout', { screen: 'Profile' } as any)
              }
              className="flex-row items-center gap-2"
            >
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
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Notification')}
                className="p-2 rounded-full border border-gray-300"
              >
                <Bell size={20} color="#374151" />
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
          {/**salary slips */}
          <View className="w-full mt-8 border border-gray-200 rounded-2xl p-4">
            <View className="w-full flex flex-row  justify-between items-center">
              <Text
                className="text-gray-700 text-xl"
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                Recent Salary Slips
              </Text>
              <TouchableOpacity>
                <Text
                  className="text-blue-800"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-full mt-4 gap-y-3 flex flex-col">
              <View className="w-full flex flex-row  justify-between items-center p-2 border border-gray-200 rounded-2xl">
                <View className="flex-row items-center gap-2">
                  <View className="p-3 rounded-full bg-violet-200">
                    <FileDigit size={30} color="#5658e6" />
                  </View>
                  <View>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      June 2025
                    </Text>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      Net Salary: ₹10,500
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity>
                    <Feather name="eye" size={24} color="gray" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Feather name="download" size={24} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="w-full flex flex-row  justify-between items-center p-2 border border-gray-200 rounded-2xl">
                <View className="flex-row items-center gap-2">
                  <View className="p-3 rounded-full bg-violet-200">
                    <FileDigit size={30} color="#5658e6" />
                  </View>
                  <View>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      June 2025
                    </Text>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      Net Salary: ₹10,500
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity>
                    <Feather name="eye" size={24} color="gray" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Feather name="download" size={24} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="w-full flex flex-row  justify-between items-center p-2 border border-gray-200 rounded-2xl">
                <View className="flex-row items-center gap-2">
                  <View className="p-3 rounded-full bg-violet-200">
                    <FileDigit size={30} color="#5658e6" />
                  </View>
                  <View>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      June 2025
                    </Text>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      Net Salary: ₹10,500
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity>
                    <Feather name="eye" size={24} color="gray" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Feather name="download" size={24} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/**leave history */}
          <View className="w-full mt-8 border border-gray-200 rounded-2xl p-4">
            <View className="w-full flex flex-row  justify-between items-center">
              <Text
                className="text-gray-700 text-xl"
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                Leave History
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Layout', { screen: 'Leaves' } as any)
                }
              >
                <Text
                  className="text-blue-800"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              className="text-gray-500"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              Track and Manage leave records
            </Text>
            <View className="w-full mt-4 gap-y-3 flex flex-col">
              <View className="w-full flex flex-col   items-start  border border-gray-200 rounded-2xl gap-y-3 p-4">
                <View className="flex-row items-center gap-2 justify-between w-full">
                  <View>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Application ID
                    </Text>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      1234567890
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2 bg-gray-100 rounded-lg p-2 py-1">
                    <CalendarRange size={18} color="black" />
                    <Text
                      className="text-black text-sm"
                      style={{ fontFamily: 'Lexend-Regular' }}
                    >
                      Pending
                    </Text>
                  </View>
                </View>
                <View className="w-full h-[1px] bg-gray-200 my-0"></View>
                <View className="flex-row items-center gap-2 justify-between w-full">
                  <View>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Apply Date
                    </Text>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      Tue, jul 8
                    </Text>
                  </View>
                  <View>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Leave Days
                    </Text>
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      6 days
                    </Text>
                  </View>
                </View>
                <View className="w-full">
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Reason
                  </Text>
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Personal
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/**attendance history */}
          <View className="w-full mt-8 border border-gray-200 rounded-2xl p-4">
            <View className="w-full flex flex-row  justify-between items-center">
              <Text
                className="text-gray-700 text-xl"
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                Attendance History
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Layout', { screen: 'Attendance' } as any)
                }
              >
                <Text
                  className="text-blue-800"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              className="text-gray-500"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              Track and Manage attendance records
            </Text>
            <View className="w-full mt-4 gap-y-3 flex flex-col">
              <View className="w-full flex flex-col   items-start  border border-gray-200 rounded-2xl gap-y-3 p-4">
                <View className="flex-row items-center gap-2">
                  <Calendar size={24} color="gray" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Tue, jul 8
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Clock size={24} color="green" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    check In: 10:00 AM
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <MapPin size={24} color="gray" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    MDR,Bariaul, Keotiranway, Darbhanga
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Timer size={24} color="red" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    check Out: 10:00 AM
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <MapPin size={24} color="gray" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    MDR,Bariaul, Keotiranway, Darbhanga
                  </Text>
                </View>
                <View className="w-full h-[1px] bg-gray-200 my-3"></View>
                <View className="flex-row items-center gap-2">
                  <Watch size={24} color="gray" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Total Working Hours: 8h 3m{' '}
                  </Text>
                </View>
              </View>
              <View className="w-full flex flex-col   items-start  border border-gray-200 rounded-2xl gap-y-3 p-4">
                <View className="flex-row items-center gap-2">
                  <Calendar size={24} color="gray" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Tue, jul 8
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Clock size={24} color="green" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    check In: 10:00 AM
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <MapPin size={24} color="gray" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    MDR,Bariaul, Keotiranway, Darbhanga
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Timer size={24} color="red" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    check Out: 10:00 AM
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <MapPin size={24} color="gray" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    MDR,Bariaul, Keotiranway, Darbhanga
                  </Text>
                </View>
                <View className="w-full h-[1px] bg-gray-200 my-3"></View>
                <View className="flex-row items-center gap-2">
                  <Watch size={24} color="gray" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Total Working Hours: 8h 3m{' '}
                  </Text>
                </View>
              </View>
              <View className="w-full flex flex-col   items-start  border border-gray-200 rounded-2xl gap-y-3 p-4">
                <View className="flex-row items-center gap-2">
                  <Calendar size={24} color="gray" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Tue, jul 8
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Clock size={24} color="green" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    check In: 10:00 AM
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <MapPin size={24} color="gray" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    MDR,Bariaul, Keotiranway, Darbhanga
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Timer size={24} color="red" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    check Out: 10:00 AM
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <MapPin size={24} color="gray" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    MDR,Bariaul, Keotiranway, Darbhanga
                  </Text>
                </View>
                <View className="w-full h-[1px] bg-gray-200 my-3"></View>
                <View className="flex-row items-center gap-2">
                  <Watch size={24} color="gray" />
                  <Text
                    className="text-gray-700"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    Total Working Hours: 8h 3m{' '}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Home;
