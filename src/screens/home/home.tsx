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
import React, { useCallback, useState } from 'react';
import SwipeToAction from '../../components/SwipeToAction';
import Quote from '../../components/quote';
import { RootStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { add } from '@hibbanur-rahman/sum-package';
import AttendanceService from '../../services/AttendanceService';
import LocationService from '../../services/LocationService';
import { Alert } from 'react-native';
import LocationTest from '../../components/LocationTest';
import CheckInLoadingModal from '../../components/CheckInLoadingModal';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Home = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useSelector((state: any) => state.auth);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingType, setLoadingType] = useState<'checkin' | 'checkout'>(
    'checkin',
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [checkInLocation, setCheckInLocation] = useState('');
  const [checkOutLocation, setCheckOutLocation] = useState('');
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isOnLeave, setIsOnLeave] = useState(false);

  const handleCheckIn = async () => {
    try {
      setLoadingType('checkin');
      setShowLoadingModal(true);
      setIsProcessing(true);
      setIsCheckedIn(true);

      // Get location with address
      const locationData = await LocationService.getLocationWithAddress();
      console.log('locationData', locationData);
      const payload = {
        address: locationData.address || 'Address not available',
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      };

      console.log('Checked in with location:', payload);
      const response = await AttendanceService.CheckIn(payload);

      if (response.status === 201) {
        setIsProcessing(false);
        setIsCheckedIn(true);
        // Modal will handle the completion animation
        // The onComplete callback will be called when animation finishes
      }
    } catch (error) {
      setShowLoadingModal(false);
      setIsProcessing(false);
      setIsCheckedIn(false);
      console.log('Error checking in:', error);
      Alert.alert(
        'Failed to check-in',
        (error as any)?.data?.message ||
          (error as any)?.message ||
          'Unknown error',
      );
    }
  };

  const handleCheckInComplete = () => {
    setShowLoadingModal(false);
    Alert.alert(
      'Check-in Successful',
      'Your attendance has been recorded successfully!',
      [{ text: 'OK' }],
    );
    setIsCheckedIn(false);
  };

  const handleCheckOut = async () => {
    try {
      setLoadingType('checkout');
      setShowLoadingModal(true);
      setIsProcessing(true);

      // Get location with address for check-out
      const locationData = await LocationService.getLocationWithAddress();

      const payload = {
        address: locationData.address || 'Address not available',
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      };

      const response = await AttendanceService.CheckOut(payload);
      setIsCheckedIn(false);
      console.log('Checked out with location:', payload);

      setIsProcessing(false);
      
    } catch (error) {
      setShowLoadingModal(false);
      setIsProcessing(false);
      console.log('Error checking out:', error);

      Alert.alert(
        'Check-out Failed',
        'Unable to get your location. Please ensure location permissions are enabled.',
        [{ text: 'OK' }],
      );
    }
  };

  const handleCheckOutComplete = () => {
    setShowLoadingModal(false);
    Alert.alert(
      'Check-out Successful',
      'Your attendance has been recorded successfully!',
      [{ text: 'OK' }],
    );
  };

  const handleFetchTodayAttendance = async () => {
    try {
      const response = await AttendanceService.GetTodayAttendance(user?._id);
      if (response.status === 200) {
        console.log('today attendance', response.data);
        setTodayAttendance(response.data?.data);
        const todayData = response.data?.data;
        if (todayData) {
          console.log("Today's attendance data:", todayData);

          // Set check-in status if checked in
          if (todayData.checkIn && todayData.checkIn.time) {
            setIsCheckedIn(true);
            setCheckInTime(
              new Date(todayData.checkIn.time).toLocaleTimeString(),
            );
            setCheckInLocation(
              todayData.checkIn.location?.address || 'Unknown location',
            );

            if (!todayData.checkOut || !todayData.checkOut.time) {
              // Check-in status is set via isCheckedIn state
            }
          } else {
            setIsCheckedIn(false);
            setCheckInTime('');
            setCheckInLocation('');
          }

          // Set check-out status if checked out
          if (todayData.checkOut && todayData.checkOut.time) {
            setIsCheckedOut(true);
            // Convert UTC time to local time with AM/PM format
            const localTime = new Date(
              todayData.checkOut.time,
            ).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });
            setCheckOutTime(localTime);

            // Handle auto-checkout specifically
            if (todayData.checkOut.isAutoCheckout) {
              setCheckOutLocation('Auto Checkout (System)');
            } else {
              setCheckOutLocation(
                todayData.checkOut.location?.address || 'Unknown location',
              );
            }
          } else {
            setIsCheckedOut(false);
            setCheckOutTime('');
            setCheckOutLocation('');
          }

          // Set leave status if on leave
          if (
            todayData.status === 'Leave' ||
            (todayData.status === 'Absent' &&
              todayData.checkIn &&
              todayData.checkIn.location &&
              todayData.checkIn.location.address === 'On Leave')
          ) {
            setIsOnLeave(true);
          } else {
            setIsOnLeave(false);
          }
        } else {
          // Reset all states if no record found
          setIsCheckedIn(false);
          setIsCheckedOut(false);
          setIsOnLeave(false);
          setCheckInTime('');
          setCheckOutTime('');
          setCheckInLocation('');
          setCheckOutLocation('');
        }
      }
    } catch (error) {
      console.log('error while fetch today attendance', error);
      Alert.alert(
        'Error',
        "Failed to fetch today's attendance. Please try again later.",
      );
    }
  };
  console.log(user);
  console.log(add(1, 2));
  useFocusEffect(
    useCallback(() => {
      handleFetchTodayAttendance();
    }, []),
  );
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Loading Modal */}
      <CheckInLoadingModal
        visible={showLoadingModal}
        type={loadingType}
        onClose={() => setShowLoadingModal(false)}
        onComplete={
          loadingType === 'checkin'
            ? handleCheckInComplete
            : handleCheckOutComplete
        }
        isProcessing={isProcessing}
      />

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
                className="w-16 h-16 rounded-full border border-gray-200"
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
