import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Linking,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Share,
} from 'react-native';
import logo from '../../assets/images/userImg.jpg';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import {
  Bell,
  Calendar,
  CalendarIcon,
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
  File,
  User,
  CheckCircle,
  XCircle,
  ClockIcon,
  Mail,
  Phone,
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
import LocationTest from '../../components/LocationTest';
import CheckInLoadingModal from '../../components/CheckInLoadingModal';
import tw from 'twrnc';
import { Dropdown } from 'react-native-element-dropdown';
import {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  calculateDurationInMinutes,
  formatDate,
  formatDateTime,
  formatDuration,
  formatISOToDate,
  formatTime,
} from '../../utils/dateTimeFormater';
import LeaveService from '../../services/LeaveService';
import SalarySlipService from '../../services/SalarySlipService';
import ReactNativeBlobUtil from 'react-native-blob-util';
import SalarySlipPDFViewer from '../../components/SalarySlipPDFViewer';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return { bg: '#dcfce7', text: '#166534', icon: '#16a34a' };
    case 'rejected':
      return { bg: '#fef2f2', text: '#dc2626', icon: '#ef4444' };
    case 'pending':
      return { bg: '#fef3c7', text: '#d97706', icon: '#f59e0b' };
    default:
      return { bg: '#f3f4f6', text: '#6b7280', icon: '#9ca3af' };
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return <CheckCircle size={16} color={getStatusColor(status).icon} />;
    case 'rejected':
      return <XCircle size={16} color={getStatusColor(status).icon} />;
    case 'pending':
      return <ClockIcon size={16} color={getStatusColor(status).icon} />;
    default:
      return <ClockIcon size={16} color={getStatusColor(status).icon} />;
  }
};

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
  const filterScale = useSharedValue(0);
  const [attendanceList, setAttendanceList] = useState<any>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [leavesList, setLeavesList] = useState<any>([]);
  const [salarySlipsList, setSalarySlipsList] = useState<any>([]);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [pdfUri, setPdfUri] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [currentSalarySlipId, setCurrentSalarySlipId] = useState('');
  const [downloadingSlipId, setDownloadingSlipId] = useState('');
  const [viewingSlipId, setViewingSlipId] = useState('');

  //months
  const months = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ];
  //years
  const years = [
    { label: '2022', value: '2022' },
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
  ];
  const [selectedMonth, setSelectedMonth] = useState<any>(
    months[new Date().getMonth()],
  );
  const [selectedYear, setSelectedYear] = useState<any>(
    years.find(year => year.value === new Date().getFullYear().toString()),
  );
  const [selectedLeaveMonth, setSelectedLeaveMonth] = useState<any>(
    months[new Date().getMonth()],
  );
  const [selectedLeaveYear, setSelectedLeaveYear] = useState<any>(
    years.find(year => year.value === new Date().getFullYear().toString()),
  );

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
    // Alert.alert(
    //   'Check-in Successful',
    //   'Your attendance has been recorded successfully!',
    //   [{ text: 'OK' }],
    // );
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
    // Alert.alert(
    //   'Check-out Successful',
    //   'Your attendance has been recorded successfully!',
    //   [{ text: 'OK' }],
    // );
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
        selectedMonth?.value,
        selectedYear?.value,
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

  const handleGetAttendanceList = async () => {
    try {
      setLoading(true);
      const payload = {
        employeeId: user?._id,
        month: selectedMonth?.value,
        year: selectedYear?.value,
        page: 1,
        limit: 10,
      };
      const response = await AttendanceService.GetAttendanceList(payload);
      console.log('attendance list', response);
      if (response?.status === 200) {
        setAttendanceList(response?.data?.data);
        setTotalPages(response?.data?.pagination?.totalPages);
        setPage(response?.data?.pagination?.currentPage);
        setLimit(response?.data?.pagination?.limit);
      }
    } catch (error) {
      console.log('error', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  //fetch leaves list
  const handleGetLeavesList = async () => {
    try {
      const payload = {
        employeeId: user?.employeeId,
        month: selectedLeaveMonth?.value,
        year: selectedLeaveYear?.value,
        page: 1,
        limit: 10,
      };
      const response = await LeaveService.GetLeaves(payload);
      console.log('leaves list', response);
      if (response?.status === 200) {
        setLeavesList(response?.data?.data);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  //handle get salary slips list
  const handleGetSalarySlipsList = async () => {
    try {
      const response = await SalarySlipService.GetAllSalarySlip(
        user?._id,
        new Date().getFullYear().toString(),
      );
      console.log('salary slips list', response);
      if (response?.status === 200) {
        setSalarySlipsList(response?.data?.data);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  //handle download slips
  const handleDownloadSlips = async (id: string) => {
    try {
      setDownloadingSlipId(id);
      console.log("downloading slip id:", id);
      
      // Request storage permission on Android
      if (Platform.OS === 'android') {
        // For Android 11+ (API 30+), we need to handle scoped storage differently
        const androidVersion = typeof Platform.Version === 'number' ? Platform.Version : parseInt(String(Platform.Version));
        
        if (androidVersion >= 30) {
          // Android 11+ uses scoped storage, check if we can write to downloads
          try {
            // Try to write a test file to see if we have access
            const { fs } = ReactNativeBlobUtil;
            const testPath = `${fs.dirs.DownloadDir}/test_write_permission.txt`;
            await fs.writeFile(testPath, 'test', 'utf8');
            await fs.unlink(testPath); // Clean up test file
          } catch (error) {
            Alert.alert(
              'Storage Access Required',
              'This app needs access to download folder. Please allow file access in the next dialog.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                  onPress: () => {
                    return;
                  }
                },
                {
                  text: 'Continue',
                  onPress: () => {
                    // For Android 11+, we'll try to download anyway as the system may handle it
                    console.log('Continuing with download on Android 11+');
                  }
                }
              ]
            );
          }
        } else {
          // For Android 10 and below, use traditional permissions
          const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
          
          if (!hasPermission) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'Storage Permission Required',
                message: 'This app needs access to storage to download salary slips to your device.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'Allow',
              },
            );
            
            console.log("permission granted:", granted);
            
            if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
              Alert.alert(
                'Permission Required',
                'Storage permission was denied. Please enable it manually in app settings to download files.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Open Settings',
                    onPress: () => {
                      Linking.openSettings();
                    },
                  },
                ]
              );
              return;
            } else if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              Alert.alert(
                'Permission Denied', 
                'Storage permission is required to download files. Please try again and allow the permission.'
              );
              return;
            }
          }
        }
      }

      Alert.alert('Download Started', 'Your salary slip is being downloaded...');
      
      const response = await SalarySlipService.DownloadSalarySlip(id);
      console.log("response of download slips response:", response?.data);
      
      // Configure download path - prefer Downloads folder for better accessibility
      const { fs } = ReactNativeBlobUtil;
      const currentDate = new Date();
      const fileName = `salary_slip_${currentDate.getFullYear()}_${(currentDate.getMonth() + 1).toString().padStart(2, '0')}_${id}.pdf`;
      
      let downloadPath;
      let downloadMethod = 'downloads';
      
      try {
        // Always try to use Downloads folder first for better file access
        downloadPath = `${fs.dirs.DownloadDir}/${fileName}`;
        downloadMethod = 'downloads';
      } catch (error) {
        // Fallback to app's document directory if Downloads folder is not accessible
        console.log('Downloads folder not accessible, using app directory:', error);
        downloadPath = `${fs.dirs.DocumentDir}/${fileName}`;
        downloadMethod = 'app_storage';
      }

      // If response data is available, save it directly
      if (response?.data) {
        // Handle different response formats
        let pdfData = response.data;
        
        // If the response is wrapped in another object, extract the PDF data
        if (typeof response.data === 'object' && response.data.data) {
          pdfData = response.data.data;
        }
        
        // Convert blob or other data formats to base64
        let base64Data = '';
        
        if (typeof pdfData === 'string') {
          if (pdfData.startsWith('%PDF')) {
            // Raw PDF data - convert to base64
            base64Data = ReactNativeBlobUtil.base64.encode(pdfData);
          } else if (pdfData.startsWith('data:application/pdf;base64,')) {
            // Data URL format - extract base64 part
            base64Data = pdfData.split(',')[1];
          } else {
            // Assume it's already base64
            base64Data = pdfData;
          }
        } else if (pdfData instanceof Blob) {
          // Handle Blob data by converting to base64
          try {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              base64Data = result.split(',')[1]; // Remove data URL prefix
            };
            reader.readAsDataURL(pdfData);
          } catch (error) {
            console.log('Error converting blob to base64:', error);
            Alert.alert('Error', 'Failed to process PDF data');
            return;
          }
        } else {
          // Handle other data types by converting to string first
          try {
            const stringData = JSON.stringify(pdfData);
            base64Data = ReactNativeBlobUtil.base64.encode(stringData);
          } catch (error) {
            console.log('Error processing PDF data:', error);
            Alert.alert('Error', 'Invalid PDF data format');
            return;
          }
        }
        
        // Write the base64 PDF data to the file
        if (base64Data && base64Data.length > 0) {
          await fs.writeFile(downloadPath, base64Data, 'base64');
        } else {
          Alert.alert('Error', 'Invalid PDF data format for download');
          return;
        }
        
        let downloadMessage = '';
        if (downloadMethod === 'app_storage') {
          downloadMessage = `Salary slip saved to app documents as ${fileName}`;
        } else {
          downloadMessage = `Salary slip downloaded to Downloads folder as ${fileName}`;
        }
        
        Alert.alert(
          'Download Complete', 
          downloadMessage,
          [
            {
              text: 'Open',
              onPress: async () => {
                try {
                  if (Platform.OS === 'android') {
                    console.log("Opening file path on Android:", downloadPath);
                    // Use react-native-blob-util's android method to open files safely
                    await ReactNativeBlobUtil.android.actionViewIntent(downloadPath, 'application/pdf');

                  } else {
                    // For iOS, use the file:// scheme
                    const filePath = `file://${downloadPath}`;
                    await Linking.openURL(filePath);
                  }
                } catch (error) {
                  console.log("error while opening file:", error);
                  
                  // Fallback: Try to share the file instead
                  try {
                    if (Platform.OS === 'android') {
                      // Use the Share API as a fallback
                      await Share.share({
                        title: 'Salary Slip',
                        message: 'Please find your salary slip attached',
                        url: `file://${downloadPath}`,
                      });
                    } else {
                      Alert.alert('Error', 'Could not open the downloaded file. Please check your Downloads folder.');
                    }
                  } catch (shareError) {
                    console.log("error while sharing file:", shareError);
                    Alert.alert(
                      'Cannot Open File', 
                      'The file was downloaded successfully, but could not be opened. Please check your file manager or install a PDF viewer app.',
                      [
                        {
                          text: 'Install PDF Viewer',
                          onPress: () => {
                            const storeUrl = Platform.OS === 'android' 
                              ? 'market://search?q=pdf+viewer'
                              : 'https://apps.apple.com/search?term=pdf+viewer';
                            Linking.openURL(storeUrl);
                          }
                        },
                        { text: 'OK' }
                      ]
                    );
                  }
                }
              },
            },
            { text: 'OK' },
          ]
        );
      } else {
        Alert.alert('Error', 'No data received for download');
      }
    } catch (error: any) {

      console.log("error while download slips:", error);
      Alert.alert(
        'Download Failed',
        error?.data?.message || error?.message || 'Failed to download salary slip'
      );
    } finally {
      setDownloadingSlipId('');
    }
  };

  //handle view slips
  const handleViewSlips = async (id: string) => {
    try {
      setViewingSlipId(id);
      
      const response = await SalarySlipService.ViewSalarySlip(id);
      console.log("response of view slips response:", response?.data);
      
      if (response?.data) {
        // Handle different response formats
        let pdfData = response.data;
        
        // If the response is wrapped in another object, extract the PDF data
        if (typeof response.data === 'object' && response.data.data) {
          pdfData = response.data.data;
        }
        
        // Check if we have valid PDF data
        if (typeof pdfData === 'string' && pdfData.length > 0) {
          // Create a temporary file for viewing in a more accessible location
          const { fs } = ReactNativeBlobUtil;
          const currentDate = new Date();
          const fileName = `temp_salary_slip_${currentDate.getTime()}.pdf`;
          
          // Use external cache directory which is more accessible for viewing
          let viewPath;
          try {
            // Try external cache first (more accessible)
            viewPath = `${fs.dirs.CacheDir}/${fileName}`;
          } catch (error) {
            // Fallback to regular cache
            viewPath = `${fs.dirs.CacheDir}/${fileName}`;
          }
          
          // Convert data to base64 if needed and write to file
          let base64Data = '';
          
          if (pdfData.startsWith('%PDF')) {
            // Raw PDF data - convert to base64
            base64Data = ReactNativeBlobUtil.base64.encode(pdfData);
          } else if (pdfData.startsWith('data:application/pdf;base64,')) {
            // Data URL format - extract base64 part
            base64Data = pdfData.split(',')[1];
          } else {
            // Assume it's already base64
            base64Data = pdfData;
          }
          
          // Write the base64 PDF data to a temporary file
          await fs.writeFile(viewPath, base64Data, 'base64');
          
          console.log('PDF saved for viewing at:', viewPath);
          
          // Set the PDF preview state
          setPdfUri(`file://${viewPath}`);
          setPdfFileName(`Salary Slip - ${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`);
          setCurrentSalarySlipId(id);
          setPdfPreviewVisible(true);
        } else if (pdfData instanceof Blob) {
          // Handle Blob data
          try {
            const { fs } = ReactNativeBlobUtil;
            const currentDate = new Date();
            const fileName = `temp_salary_slip_${currentDate.getTime()}.pdf`;
            const viewPath = `${fs.dirs.CacheDir}/${fileName}`;
            
            // Convert Blob to base64
            const reader = new FileReader();
            reader.onload = async () => {
              const result = reader.result as string;
              const base64Data = result.split(',')[1]; // Remove data URL prefix
              
              await fs.writeFile(viewPath, base64Data, 'base64');
              
              // Set the PDF preview state
              setPdfUri(`file://${viewPath}`);
              setPdfFileName(`Salary Slip - ${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`);
              setCurrentSalarySlipId(id);
              setPdfPreviewVisible(true);
            };
            reader.readAsDataURL(pdfData);
          } catch (error) {
            console.log('Error converting blob to base64:', error);
            Alert.alert('Error', 'Failed to process PDF data');
          }
        } else {
          Alert.alert('Error', 'Invalid PDF data format received');
        }
      } else {
        Alert.alert('Error', 'No PDF data received');
      }
    } catch (error: any) {
      console.log("error while viewing slips:", error);
      Alert.alert(
        'View Failed',
        error?.data?.message || error?.message || 'Failed to view salary slip'
      );
    } finally {
      setViewingSlipId('');
    }
  };

  //animated styles
  const filterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: filterScale.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      handleGetAttendanceList();
      handleFetchAttendanceCount();
    }, [selectedMonth, selectedYear]),
  );
  useFocusEffect(
    useCallback(() => {
      handleGetSalarySlipsList();
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      handleGetLeavesList();
    }, [selectedLeaveMonth, selectedLeaveYear]),
  );

  useFocusEffect(
    useCallback(() => {
      handleFetchTodayAttendance();
      handleFetchAttendanceCount();
    }, [isCheckedIn, isCheckedOut]),
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
                        ? new Date(
                            todayAttendance.checkIn.time,
                          ).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })
                        : '--:--'}
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
                    color={todayAttendance?.checkIn ? 'green' : 'gray'}
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
                        ? new Date(
                            todayAttendance.checkOut.time,
                          ).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })
                        : '--:--'}
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
                    color={todayAttendance?.checkOut ? 'red' : 'gray'}
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
              {!isCheckedOut && (
                <SwipeToAction
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                  isCheckedIn={isCheckedIn}
                  containerWidth={320}
                />
              )}
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
              {salarySlipsList?.slips?.length > 0 && salarySlipsList?.slips?.map((item: any, index: number) => (
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
                        {item?.month} {item?.year}
                      </Text>
                      <Text
                        className="text-gray-700"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        Net Salary: ₹{item?.netSalary || 0}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity 
                      onPress={() => {
                        handleViewSlips(item?._id)
                      }}
                      disabled={viewingSlipId === item?._id}
                      style={{
                        opacity: viewingSlipId === item?._id ? 0.5 : 1
                      }}
                    >
                      {viewingSlipId === item?._id ? (
                        <ActivityIndicator size="small" color="blue" />
                      ) : (
                        <Feather name="eye" size={24} color="gray" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => {
                        handleDownloadSlips(item?._id)
                      }}
                      disabled={downloadingSlipId === item?._id}
                      style={{
                        opacity: downloadingSlipId === item?._id ? 0.5 : 1
                      }}
                    >
                      {downloadingSlipId === item?._id ? (
                        <ActivityIndicator size="small" color="green" />
                      ) : (
                        <Feather name="download" size={24} color="gray" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {salarySlipsList?.slips?.length === 0 && (
                <View className="w-full flex flex-row  justify-between items-center p-2 border border-gray-200 rounded-2xl">
                  <Text className="text-gray-700" style={{ fontFamily: 'Poppins-Regular' }}>No salary slips found</Text>
                </View>
              )}
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

            {/* Filters */}
            <Animated.View className="mt-2" style={filterAnimatedStyle}>
              <View className="flex-row items-center gap-3">
                <View className="flex-1">
                  <Dropdown
                    style={tw`w-full h-12 px-4 bg-white border border-gray-200 rounded-xl`}
                    placeholderStyle={[
                      tw`text-gray-500 text-sm`,
                      { fontFamily: 'Poppins-Regular' },
                    ]}
                    containerStyle={tw`rounded-xl bg-white border border-gray-200 overflow-hidden`}
                    selectedTextStyle={[
                      tw`text-gray-900 text-sm`,
                      { fontFamily: 'Poppins-Medium' },
                    ]}
                    data={months}
                    maxHeight={300}
                    renderLeftIcon={() => (
                      <Calendar
                        size={18}
                        color="#6b7280"
                        style={{ marginRight: 8 }}
                      />
                    )}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Month"
                    value={selectedLeaveMonth}
                    onChange={item => setSelectedLeaveMonth(item)}
                    renderItem={item => (
                      <View className="px-4 py-3 border-b border-gray-100">
                        <Text
                          className="text-gray-700 text-sm"
                          style={{ fontFamily: 'Poppins-Regular' }}
                        >
                          {item?.label}
                        </Text>
                      </View>
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Dropdown
                    style={tw`w-full h-12 px-4 bg-white border border-gray-200 rounded-xl`}
                    placeholderStyle={[
                      tw`text-gray-500 text-sm`,
                      { fontFamily: 'Poppins-Regular' },
                    ]}
                    containerStyle={tw`rounded-xl bg-white border border-gray-200 overflow-hidden`}
                    selectedTextStyle={[
                      tw`text-gray-900 text-sm`,
                      { fontFamily: 'Poppins-Medium' },
                    ]}
                    data={years}
                    maxHeight={300}
                    renderLeftIcon={() => (
                      <Calendar
                        size={18}
                        color="#6b7280"
                        style={{ marginRight: 8 }}
                      />
                    )}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Year"
                    value={selectedLeaveYear}
                    onChange={item => setSelectedLeaveYear(item)}
                    renderItem={item => (
                      <View className="px-4 py-3 border-b border-gray-100">
                        <Text
                          className="text-gray-700 text-sm"
                          style={{ fontFamily: 'Poppins-Regular' }}
                        >
                          {item?.label}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </View>
            </Animated.View>
            <View className="w-full mt-4 gap-y-3 flex flex-col">
              {leavesList.map((leave, index) => (
                <View className="w-full flex flex-col   items-start  border border-gray-200 rounded-2xl gap-y-3 p-4">
                  {/* Header with status */}
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text
                        className="text-lg font-semibold text-gray-900 mb-1"
                        style={{ fontFamily: 'Poppins-SemiBold' }}
                      >
                        {leave?.name}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <User size={14} color="#6b7280" />
                        <Text
                          className="text-sm text-gray-600"
                          style={{ fontFamily: 'Poppins-Regular' }}
                        >
                          {leave?.employeeId}
                        </Text>
                      </View>
                    </View>
                    <View
                      className="px-3 py-1 rounded-full flex-row items-center gap-1"
                      style={{
                        backgroundColor: getStatusColor(leave?.status)?.bg,
                      }}
                    >
                      {getStatusIcon(leave.status)}
                      <Text
                        className="text-xs font-medium"
                        style={{
                          color: getStatusColor(leave?.status)?.text,
                          fontFamily: 'Poppins-Medium',
                        }}
                      >
                        {leave.status}
                      </Text>
                    </View>
                  </View>

                  {/* Contact Info */}
                  <View className="flex-row items-center gap-4 mb-3">
                    <View className="flex-row items-center gap-2">
                      <Mail size={14} color="#6b7280" />
                      <Text
                        className="text-sm text-gray-600"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        {leave?.email}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Phone size={14} color="#6b7280" />
                      <Text
                        className="text-sm text-gray-600"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        {leave?.mobile}
                      </Text>
                    </View>
                  </View>

                  {/* Date Range */}
                  <View className="bg-gray-50 rounded-xl p-3 mb-3">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <CalendarIcon size={16} color="#3b82f6" />
                        <Text
                          className="text-sm font-medium text-gray-700"
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          From: {formatISOToDate(leave?.fromDate || '')}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <CalendarIcon size={16} color="#3b82f6" />
                        <Text
                          className="text-sm font-medium text-gray-700"
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          To: {formatISOToDate(leave?.toDate || '')}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-2 mt-2">
                      <Clock size={14} color="#6b7280" />
                      <Text
                        className="text-sm text-gray-600"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        {leave?.leaveDays} day(s)
                      </Text>
                    </View>
                  </View>

                  {/**file */}
                  {leave?.fileUrl && (
                    <View className="mb-3">
                      <Text
                        className="text-sm font-medium text-gray-700 mb-1"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        File:
                      </Text>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(leave?.fileUrl)}
                        className="flex-row items-center gap-2"
                      >
                        <File size={16} color="#3b82f6" />
                        <Text
                          className="text-sm text-blue-600"
                          style={{ fontFamily: 'Poppins-Medium' }}
                        >
                          View File
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Reason */}
                  {leave?.reason && (
                    <View className="mb-3">
                      <Text
                        className="text-sm font-medium text-gray-700 mb-1"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Reason:
                      </Text>
                      <Text
                        className="text-sm text-gray-600 leading-5"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        {leave?.reason}
                      </Text>
                    </View>
                  )}

                  {/* Footer */}
                  <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                    <Text
                      className="text-xs text-gray-500"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      Applied: {formatDate(leave?.applyDate)}
                    </Text>
                    {leave?.approverName && (
                      <Text
                        className="text-xs text-gray-500"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        Approved by: {leave?.approverName}
                      </Text>
                    )}
                  </View>
                </View>
              ))}

              {Array.isArray(leavesList) && leavesList.length === 0 && (
                <Animated.View
                  entering={FadeInUp.delay(300).springify()}
                  className="w-full items-center py-12"
                >
                  <View className="items-center">
                    <Calendar size={48} color="#d1d5db" />
                    <Text
                      className="text-gray-500 text-base mt-3"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      No leaves found
                    </Text>
                    <Text
                      className="text-gray-400 text-sm mt-1 text-center"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      Try adjusting your filters or check back later
                    </Text>
                  </View>
                </Animated.View>
              )}
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
            {/* Filters */}
            <Animated.View className="mt-2" style={filterAnimatedStyle}>
              <View className="flex-row items-center gap-3">
                <View className="flex-1">
                  <Dropdown
                    style={tw`w-full h-12 px-4 bg-white border border-gray-200 rounded-xl`}
                    placeholderStyle={[
                      tw`text-gray-500 text-sm`,
                      { fontFamily: 'Poppins-Regular' },
                    ]}
                    containerStyle={tw`rounded-xl bg-white border border-gray-200 overflow-hidden`}
                    selectedTextStyle={[
                      tw`text-gray-900 text-sm`,
                      { fontFamily: 'Poppins-Medium' },
                    ]}
                    data={months}
                    maxHeight={300}
                    renderLeftIcon={() => (
                      <Calendar
                        size={18}
                        color="#6b7280"
                        style={{ marginRight: 8 }}
                      />
                    )}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Month"
                    value={selectedMonth}
                    onChange={item => setSelectedMonth(item)}
                    renderItem={item => (
                      <View className="px-4 py-3 border-b border-gray-100">
                        <Text
                          className="text-gray-700 text-sm"
                          style={{ fontFamily: 'Poppins-Regular' }}
                        >
                          {item?.label}
                        </Text>
                      </View>
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Dropdown
                    style={tw`w-full h-12 px-4 bg-white border border-gray-200 rounded-xl`}
                    placeholderStyle={[
                      tw`text-gray-500 text-sm`,
                      { fontFamily: 'Poppins-Regular' },
                    ]}
                    containerStyle={tw`rounded-xl bg-white border border-gray-200 overflow-hidden`}
                    selectedTextStyle={[
                      tw`text-gray-900 text-sm`,
                      { fontFamily: 'Poppins-Medium' },
                    ]}
                    data={years}
                    maxHeight={300}
                    renderLeftIcon={() => (
                      <Calendar
                        size={18}
                        color="#6b7280"
                        style={{ marginRight: 8 }}
                      />
                    )}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Year"
                    value={selectedYear}
                    onChange={item => setSelectedYear(item)}
                    renderItem={item => (
                      <View className="px-4 py-3 border-b border-gray-100">
                        <Text
                          className="text-gray-700 text-sm"
                          style={{ fontFamily: 'Poppins-Regular' }}
                        >
                          {item?.label}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </View>
            </Animated.View>
            <View className="w-full mt-4 gap-y-3 flex flex-col">
              {attendanceList.map((item, index) => (
                <View className="relative w-full flex flex-col   items-start  border border-gray-200 rounded-2xl gap-y-3 p-4">
                  {item?.checkOut?.isAutoCheckOut && (
                    <View className="right-2  top-4 flex-row items-center gap-2 absolute border border-blue-400 rounded-lg p-2 bg-blue-100">
                      <Text
                        className="text-blue-700 text-xs"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        Auto Checkout
                      </Text>
                    </View>
                  )}
                  <View className="flex-row items-center gap-2">
                    <Calendar size={24} color="gray" />
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      {formatDate(
                        item?.dailyCheckIn?.date || '2025-07-03T00:00:00.000Z',
                      )}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Clock size={24} color="green" />
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      check In:{' '}
                      {formatTime(
                        item?.checkIn?.time || '2025-07-03T05:25:53.549Z',
                      )}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <MapPin size={24} color="gray" />
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      {item?.checkIn?.location?.address}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Timer size={24} color="red" />
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      check Out:{' '}
                      {formatTime(
                        item?.checkOut?.time || '2025-07-03T05:25:53.549Z',
                      )}
                    </Text>
                  </View>
                  {!item?.checkOut?.isAutoCheckOut && (
                    <View className="flex-row items-center gap-2">
                      <MapPin size={24} color="gray" />
                      <Text
                        className="text-gray-700"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        {item?.checkOut?.location?.address}
                      </Text>
                    </View>
                  )}
                  <View className="w-full h-[1px] bg-gray-200 my-3"></View>
                  <View className="flex-row items-center gap-2">
                    <Watch size={24} color="gray" />
                    <Text
                      className="text-gray-700"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Total Working Hours:{' '}
                      {formatDuration(
                        calculateDurationInMinutes(
                          item?.checkIn?.time,
                          item?.checkOut?.time,
                        ),
                      )}{' '}
                    </Text>
                  </View>
                </View>
              ))}
              {attendanceList.length === 0 && (
                <View className="items-center">
                  <Calendar size={48} color="#d1d5db" />
                  <Text
                    className="text-gray-500 text-base mt-3"
                    style={{ fontFamily: 'Poppins-Medium' }}
                  >
                    No attendance found
                  </Text>
                  <Text
                    className="text-gray-400 text-sm mt-1 text-center"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    Try adjusting your filters or check back later
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* PDF Preview Modal */}
      <SalarySlipPDFViewer
        visible={pdfPreviewVisible}
        onClose={() => {
          setPdfPreviewVisible(false);
          setPdfUri('');
          setPdfFileName('');
          setCurrentSalarySlipId('');
        }}
        fileUri={pdfUri}
        fileName={pdfFileName}
        salarySlipId={currentSalarySlipId}
      />
    </SafeAreaView>
  );
};
export default Home;
