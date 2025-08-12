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
    const [todayAttendance, setTodayAttendance] = useState<any>(null);
    const [checkInTime, setCheckInTime] = useState('');
    const [checkOutTime, setCheckOutTime] = useState('');
    const [checkInLocation, setCheckInLocation] = useState('');
    const [checkOutLocation, setCheckOutLocation] = useState('');
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isOnLeave, setIsOnLeave] = useState(false);
    const [attendanceCountData, setAttendanceCountData] = useState<any>(null);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
  
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
  
    //fetch today attendance
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
  
    //fetch attendance count
    const handleFetchAttendanceCount = async () => {
      try {
        const response = await AttendanceService.AttendanceCount(
          user?._id,
          month,
          year,
        );
        if (response.status === 200) {
          console.log('attendance count', response.data);
          setAttendanceCountData(response?.data?.data);
        }
      } catch (error) {
        console.log('error while fetch attendance count', error);
        Alert.alert(
          'Error',
          'Failed to fetch attendance count. Please try again later.',
        );
      }
    };
    console.log(user);
    console.log(add(1, 2));
    useFocusEffect(
      useCallback(() => {
        handleFetchTodayAttendance();
        handleFetchAttendanceCount();
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
                         {todayAttendance?.checkIn?.time 
                           ? new Date(todayAttendance.checkIn.time).toLocaleTimeString('en-US', {
                               hour: 'numeric',
                               minute: '2-digit',
                               hour12: true,
                             })
                           : '--:--'
                         }
                       </Text>
                       <Text
                         className="text-gray-700"
                         style={{ fontFamily: 'Poppins-Regular' }}
                       >
                         Checked In
                       </Text>
                       {todayAttendance?.checkIn?.distance && (
                         <Text
                           className="text-gray-500 text-xs"
                           style={{ fontFamily: 'Poppins-Regular' }}
                         >
                           {Math.round(todayAttendance.checkIn.distance)}m away
                         </Text>
                       )}
                     </View>
                     <CircleArrowOutDownLeft
                       size={24}
                       color={todayAttendance?.checkIn ? "green" : "gray"}
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
                         {todayAttendance?.checkOut?.time 
                           ? new Date(todayAttendance.checkOut.time).toLocaleTimeString('en-US', {
                               hour: 'numeric',
                               minute: '2-digit',
                               hour12: true,
                             })
                           : '--:--'
                         }
                       </Text>
                       <Text
                         className="text-gray-700"
                         style={{ fontFamily: 'Poppins-Regular' }}
                       >
                         Checked Out
                       </Text>
                       {todayAttendance?.checkOut?.distance && (
                         <Text
                           className="text-gray-500 text-xs"
                           style={{ fontFamily: 'Poppins-Regular' }}
                         >
                           {Math.round(todayAttendance.checkOut.distance)}m away
                         </Text>
                       )}
                     </View>
                     <CircleArrowOutUpRight
                       size={24}
                       color={todayAttendance?.checkOut ? "red" : "gray"}
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
                        {attendanceCountData?.attendance?.totalWorkingHours
                          ?.formatted || '0 hrs'}
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
                        {attendanceCountData?.attendance?.attendanceCount || '0 '}{' '}
                        days
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
                 {todayAttendance ? (
                   <View className="w-full flex flex-col   items-start  border border-gray-200 rounded-2xl gap-y-3 p-4">
                     <View className="flex-row items-center gap-2">
                       <Calendar size={24} color="gray" />
                       <Text
                         className="text-gray-700"
                         style={{ fontFamily: 'Poppins-Medium' }}
                       >
                         {new Date(todayAttendance.createdAt).toLocaleDateString('en-US', {
                           weekday: 'short',
                           month: 'short',
                           day: 'numeric'
                         })}
                       </Text>
                     </View>
                     {todayAttendance.checkIn && (
                       <>
                         <View className="flex-row items-center gap-2">
                           <Clock size={24} color="green" />
                           <Text
                             className="text-gray-700"
                             style={{ fontFamily: 'Poppins-Medium' }}
                           >
                             Check In: {new Date(todayAttendance.checkIn.time).toLocaleTimeString('en-US', {
                               hour: 'numeric',
                               minute: '2-digit',
                               hour12: true,
                             })}
                           </Text>
                         </View>
                         <View className="flex-row items-center gap-2">
                           <MapPin size={24} color="gray" />
                           <Text
                             className="text-gray-700"
                             style={{ fontFamily: 'Poppins-Regular' }}
                             numberOfLines={2}
                           >
                             {todayAttendance.checkIn.location?.address || 'Unknown location'}
                           </Text>
                         </View>
                       </>
                     )}
                     {todayAttendance.checkOut && (
                       <>
                         <View className="flex-row items-center gap-2">
                           <Timer size={24} color="red" />
                           <Text
                             className="text-gray-700"
                             style={{ fontFamily: 'Poppins-Medium' }}
                           >
                             Check Out: {new Date(todayAttendance.checkOut.time).toLocaleTimeString('en-US', {
                               hour: 'numeric',
                               minute: '2-digit',
                               hour12: true,
                             })}
                           </Text>
                         </View>
                         <View className="flex-row items-center gap-2">
                           <MapPin size={24} color="gray" />
                           <Text
                             className="text-gray-700"
                             style={{ fontFamily: 'Poppins-Regular' }}
                             numberOfLines={2}
                           >
                             {todayAttendance.checkOut.location?.address || 'Unknown location'}
                           </Text>
                         </View>
                       </>
                     )}
                     <View className="w-full h-[1px] bg-gray-200 my-3"></View>
                     <View className="flex-row items-center gap-2">
                       <Watch size={24} color="gray" />
                       <Text
                         className="text-gray-700"
                         style={{ fontFamily: 'Poppins-Medium' }}
                       >
                         Total Working Hours: {todayAttendance.duration || 0}h{' '}
                       </Text>
                     </View>
                     <View className="flex-row items-center gap-2">
                       <View className="px-2 py-1 rounded-full bg-green-100">
                         <Text
                           className="text-green-800 text-xs"
                           style={{ fontFamily: 'Poppins-Medium' }}
                         >
                           {todayAttendance.status}
                         </Text>
                       </View>
                       <View className="px-2 py-1 rounded-full bg-blue-100">
                         <Text
                           className="text-blue-800 text-xs"
                           style={{ fontFamily: 'Poppins-Medium' }}
                         >
                           {todayAttendance.workMode}
                         </Text>
                       </View>
                     </View>
                   </View>
                 ) : (
                   <View className="w-full flex flex-col items-center justify-center border border-gray-200 rounded-2xl gap-y-3 p-8">
                     <Calendar size={48} color="gray" />
                     <Text
                       className="text-gray-500 text-center"
                       style={{ fontFamily: 'Poppins-Medium' }}
                     >
                       No attendance record for today
                     </Text>
                     <Text
                       className="text-gray-400 text-center text-sm"
                       style={{ fontFamily: 'Poppins-Regular' }}
                     >
                       Check in to start tracking your attendance
                     </Text>
                   </View>
                 )}
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
  