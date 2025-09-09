import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  useAnimatedStyle,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { Building2, ChevronRight, Star, MapPin, Phone, Mail, Globe, Sparkles } from 'lucide-react-native';
import ConfigService from '../../services/ConfigService';
import { useDispatch } from 'react-redux';
import {
  handleSetBaseUrl,
  handleSetCompanyInfo,
} from '../../redux/slices/config/configSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Item {
  _id: string;
  name: string;
  baseUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  logoUrl?: string;
}

interface CompanyInfo {
  companyName?: string;
  companyLogo?: string;
  contact?: string;
  contactEmail?: string;
  socialLinks?: {
    twitter?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    website?: string | null;
  };
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
}

const InitialScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { width: screenWidth } = Dimensions.get('window');

  const [list, setList] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedCompanyInfo, setSelectedCompanyInfo] =
    useState<CompanyInfo | null>(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [fetchingCompanyInfo, setFetchingCompanyInfo] = useState(false);

  // Animation values
  const headerAnimation = useSharedValue(0);
  const cardAnimations = useSharedValue(0);
  const sparkleAnimation = useSharedValue(0);
  const backgroundAnimation = useSharedValue(0);

  useEffect(() => {
    // Start animations
    headerAnimation.value = withSpring(1, { damping: 15, stiffness: 150 });
    cardAnimations.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
    sparkleAnimation.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    backgroundAnimation.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerAnimation.value,
    transform: [
      { translateY: interpolate(headerAnimation.value, [0, 1], [-50, 0]) },
      { scale: interpolate(headerAnimation.value, [0, 1], [0.8, 1]) },
    ],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardAnimations.value,
    transform: [
      { translateY: interpolate(cardAnimations.value, [0, 1], [30, 0]) },
    ],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sparkleAnimation.value, [0, 1], [0.3, 0.8]),
    transform: [
      { scale: interpolate(sparkleAnimation.value, [0, 1], [0.8, 1.2]) },
      { rotate: `${interpolate(sparkleAnimation.value, [0, 1], [0, 360])}deg` },
    ],
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(backgroundAnimation.value, [0, 1], [0.1, 0.3]),
    transform: [
      { scale: interpolate(backgroundAnimation.value, [0, 1], [1, 1.1]) },
    ],
  }));

  const handleGetList = async () => {
    setLoading(true);
    try {
      const response = await ConfigService.GetUrlList();
      console.log('response list', response);
      if (response?.status === 200) {
        setList(response?.data?.data || []);
      }
    } catch (error) {
      console.log('error while getting list', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = async (item: Item) => {
    setSelectedItem(item);
    setFetchingCompanyInfo(true);
    setShowCompanyModal(true);

    try {
      dispatch(handleSetBaseUrl({ baseUrl: item.baseUrl }));
      // await AsyncStorage.setItem('baseUrl', item.baseUrl);

      const response = await ConfigService.GetClientConfig();
      console.log('response company info', response);

      if (response?.status === 200) {
        setSelectedCompanyInfo(response?.data?.data || null);
        dispatch(
          handleSetCompanyInfo({ companyInfo: response?.data?.data || {} }),
        );
        await AsyncStorage.setItem(
          'companyInfo',
          JSON.stringify(response?.data?.data || {}),
        );
      }
    } catch (error) {
      console.log('error while getting company info', error);
    } finally {
      setFetchingCompanyInfo(false);
    }
  };

  const handleConfirmSelection = async () => {
    try {
      setShowCompanyModal(false);
      await AsyncStorage.setItem('baseUrl', selectedItem?.baseUrl || '');
      navigation.navigate('Login');
    } catch (error) {
      console.log('error in confirming company selection:', error);
    }
  };

  const handleCancelSelection = () => {
    setShowCompanyModal(false);
    setSelectedItem(null);
    setSelectedCompanyInfo(null);
  };

  useEffect(() => {
    handleGetList();
  }, []);

  const renderUrlCard = (item: Item, index: number) => {
    return (
      <Animated.View
        key={item._id}
        style={[
          cardAnimatedStyle,
          {
            marginBottom: 16,
            transform: [
              { translateY: interpolate(cardAnimations.value, [0, 1], [50 * (index + 1), 0]) }
            ]
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => handleSelectItem(item)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 20,
              padding: 20,
              marginHorizontal: 20,
              shadowColor: '#7563F7',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.12,
              shadowRadius: 20,
              elevation: 8,
              borderWidth: 1,
              borderColor: 'rgba(117, 99, 247, 0.08)',
            }}
          >
            <View className="flex-row items-center">
              <View className="relative">
                <LinearGradient
                  colors={['#7563F7', '#9333EA']}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#7563F7',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  {item?.logoUrl ? (
                    <Image
                      source={{ uri: item?.logoUrl }}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 18,
                        borderWidth: 2,
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Building2 size={32} color="white" />
                  )}
                </LinearGradient>
                <Animated.View
                  style={[
                    sparkleAnimatedStyle,
                    {
                      position: 'absolute',
                      top: -4,
                      right: -4,
                    }
                  ]}
                >
                  <Sparkles size={16} color="#F59E0B" />
                </Animated.View>
              </View>

              <View className="flex-1 ml-4">
                <Text
                  className="text-xl text-gray-900 mb-2"
                  style={{ 
                    fontFamily: 'Poppins-Bold',
                    letterSpacing: 0.3,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  className="text-gray-600 text-sm leading-5 mb-3"
                  style={{ fontFamily: 'Poppins-Regular' }}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
                <View className="flex-row items-center">
                  <View 
                    className="bg-green-100 px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                  >
                    <Text
                      className="text-green-700 text-xs"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Active
                    </Text>
                  </View>
                  <View className="flex-row items-center ml-3">
                    <Star size={12} color="#F59E0B" />
                    <Text
                      className="text-yellow-600 text-xs ml-1"
                      style={{ fontFamily: 'Poppins-Medium' }}
                    >
                      Verified
                    </Text>
                  </View>
                </View>
              </View>

              <View className="ml-3">
                <LinearGradient
                  colors={['#7563F7', '#9333EA']}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ChevronRight size={20} color="white" />
                </LinearGradient>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderCompanyModal = () => (
    <Modal
      visible={showCompanyModal}
      animationType="fade"
      transparent={true}
      onRequestClose={handleCancelSelection}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/60 justify-center items-center px-4">
        <Animated.View
          style={[
            {
              backgroundColor: 'white',
              borderRadius: 24,
              width: '100%',
              maxHeight: '85%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.25,
              shadowRadius: 25,
              elevation: 20,
            }
          ]}
        >
          <LinearGradient
            colors={['#7563F7', '#9333EA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingVertical: 24,
              paddingHorizontal: 24,
            }}
          >
            <Text
              className="text-2xl text-white text-center font-bold"
              style={{ 
                fontFamily: 'Poppins-Bold',
                letterSpacing: 0.5,
              }}
            >
              Company Details
            </Text>
            <Text
              className="text-white/80 text-center mt-2"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              Verify organization information
            </Text>
          </LinearGradient>

          {fetchingCompanyInfo ? (
            <View className="flex-1 justify-center items-center py-20">
              <LinearGradient
                colors={['#7563F7', '#9333EA']}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <ActivityIndicator size="large" color="white" />
              </LinearGradient>
              <Text
                className="text-lg text-gray-900 mb-2"
                style={{ fontFamily: 'Poppins-SemiBold' }}
              >
                Loading Details
              </Text>
              <Text
                className="text-gray-600 text-center px-8"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                Fetching company information and verifying credentials...
              </Text>
            </View>
          ) : (
            <ScrollView 
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 400 }}
              contentContainerStyle={{ padding: 24 }}
            >
              <View className="items-center mb-6">
                {selectedCompanyInfo?.companyLogo ? (
                  <View className="relative">
                    <LinearGradient
                      colors={['#F8FAFC', '#E2E8F0']}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 16,
                        shadowColor: '#7563F7',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <Image
                        source={{ uri: selectedCompanyInfo.companyLogo }}
                        style={{
                          width: 96,
                          height: 96,
                          borderRadius: 48,
                          borderWidth: 3,
                          borderColor: 'rgba(117, 99, 247, 0.1)',
                        }}
                        resizeMode="contain"
                      />
                    </LinearGradient>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 8,
                        backgroundColor: '#10B981',
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 3,
                        borderColor: 'white',
                      }}
                    />
                  </View>
                ) : (
                  <LinearGradient
                    colors={['#7563F7', '#9333EA']}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <Building2 size={48} color="white" />
                  </LinearGradient>
                )}

                <Text
                  className="text-2xl text-gray-900 text-center mb-2"
                  style={{ 
                    fontFamily: 'Poppins-Bold',
                    letterSpacing: 0.3,
                  }}
                >
                  {selectedCompanyInfo?.companyName ||
                    selectedItem?.name ||
                    'Company Name'}
                </Text>

                {selectedCompanyInfo?.address && (
                  <View className="flex-row items-center mb-3">
                    <MapPin size={16} color="#6B7280" />
                    <Text
                      className="text-gray-600 text-center ml-2 leading-5"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      {selectedCompanyInfo.address}
                    </Text>
                  </View>
                )}
              </View>

              {/* Enhanced Contact Information */}
              <LinearGradient
                colors={['#F8FAFC', '#EEF2FF']}
                style={{
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(117, 99, 247, 0.1)',
                }}
              >
                <Text
                  className="text-lg text-gray-900 mb-4"
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                >
                  Contact Information
                </Text>

                {selectedCompanyInfo?.contactEmail && (
                  <View className="flex-row items-center mb-3 bg-white p-3 rounded-xl">
                    <LinearGradient
                      colors={['#3B82F6', '#1D4ED8']}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                      }}
                    >
                      <Mail size={16} color="white" />
                    </LinearGradient>
                    <Text
                      className="text-gray-700 flex-1"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      {selectedCompanyInfo.contactEmail}
                    </Text>
                  </View>
                )}

                {selectedCompanyInfo?.socialLinks?.website && (
                  <View className="flex-row items-center bg-white p-3 rounded-xl">
                    <LinearGradient
                      colors={['#8B5CF6', '#7C3AED']}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                      }}
                    >
                      <Globe size={16} color="white" />
                    </LinearGradient>
                    <Text
                      className="text-gray-700 flex-1"
                      style={{ fontFamily: 'Poppins-Regular' }}
                      numberOfLines={1}
                    >
                      {selectedCompanyInfo.socialLinks.website}
                    </Text>
                  </View>
                )}
              </LinearGradient>

              {/* Enhanced Location Information */}
              {(selectedCompanyInfo?.city || selectedCompanyInfo?.state || selectedCompanyInfo?.pinCode) && (
                <LinearGradient
                  colors={['#ECFDF5', '#F0FDF4']}
                  style={{
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: 'rgba(34, 197, 94, 0.1)',
                  }}
                >
                  <Text
                    className="text-lg text-gray-900 mb-4"
                    style={{ fontFamily: 'Poppins-SemiBold' }}
                  >
                    Location Details
                  </Text>

                  <View className="bg-white p-4 rounded-xl">
                    <View className="flex-row items-start">
                      <LinearGradient
                        colors={['#EF4444', '#DC2626']}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 12,
                          marginTop: 2,
                        }}
                      >
                        <MapPin size={16} color="white" />
                      </LinearGradient>
                      <View className="flex-1">
                        {selectedCompanyInfo?.city && (
                          <Text
                            className="text-gray-900 text-base mb-1"
                            style={{ fontFamily: 'Poppins-Medium' }}
                          >
                            {selectedCompanyInfo.city}
                            {selectedCompanyInfo?.state &&
                              `, ${selectedCompanyInfo.state}`}
                          </Text>
                        )}

                        {selectedCompanyInfo?.pinCode && (
                          <Text
                            className="text-gray-600"
                            style={{ fontFamily: 'Poppins-Regular' }}
                          >
                            PIN: {selectedCompanyInfo.pinCode}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              )}
            </ScrollView>
          )}

          <View className="p-6 bg-gray-50" style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 py-4 rounded-xl border-2 border-gray-200 items-center"
                style={{ backgroundColor: 'white' }}
                onPress={handleCancelSelection}
                activeOpacity={0.8}
              >
                <Text
                  className="text-gray-600 text-base"
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmSelection}
                disabled={fetchingCompanyInfo}
                activeOpacity={0.8}
                className="flex-1"
              >
                <LinearGradient
                  colors={fetchingCompanyInfo ? ['#9CA3AF', '#6B7280'] : ['#7563F7', '#9333EA']}
                  style={{
                    paddingVertical: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    shadowColor: '#7563F7',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <Text
                    className="text-white text-base"
                    style={{ fontFamily: 'Poppins-Bold' }}
                  >
                    {fetchingCompanyInfo ? 'Loading...' : 'Continue'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7563F7" />
      <LinearGradient
        colors={['#7563F7', '#9333EA', '#C026D3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Background Pattern */}
        <Animated.View
          style={[
            backgroundAnimatedStyle,
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }
          ]}
        >
          <View
            style={{
              position: 'absolute',
              top: 100,
              right: 50,
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 300,
              left: 30,
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 200,
              right: 80,
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
            }}
          />
        </Animated.View>

        {/* Header Section */}
        <Animated.View
          style={[
            headerAnimatedStyle,
            {
              paddingTop: 60,
              paddingBottom: 40,
              paddingHorizontal: 20,
              alignItems: 'center',
            }
          ]}
        >
          <View className="items-center mb-6">
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              <Building2 size={40} color="white" />
            </LinearGradient>
            <Text
              className="text-white text-3xl text-center mb-3"
              style={{ 
                fontFamily: 'Poppins-Bold',
                letterSpacing: 0.5,
              }}
            >
              Select Organization
            </Text>
            <Text
              className="text-white/80 text-center text-base leading-6"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              Choose your organization to access {'\n'}your workspace and continue
            </Text>
          </View>
        </Animated.View>

        {/* Content Section */}
        <View
          style={{
            flex: 1,
            backgroundColor: '#F8FAFC',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            marginTop: -20,
            paddingTop: 30,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {loading ? (
              <View className="flex-1 justify-center items-center py-20">
                <LinearGradient
                  colors={['#7563F7', '#9333EA']}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                    shadowColor: '#7563F7',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <ActivityIndicator size="large" color="white" />
                </LinearGradient>
                <Text
                  className="text-xl text-gray-900 mb-2"
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                >
                  Loading Organizations
                </Text>
                <Text
                  className="text-gray-600 text-center px-8"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  Fetching available organizations for you...
                </Text>
              </View>
            ) : Array.isArray(list) && list.length > 0 ? (
              <Animated.View style={cardAnimatedStyle}>
                {list.map((item, index) => renderUrlCard(item, index))}
              </Animated.View>
            ) : (
              <View className="flex-1 justify-center items-center py-20">
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}
                >
                  <Building2 size={40} color="white" />
                </LinearGradient>
                <Text
                  className="text-xl text-gray-900 mb-2"
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                >
                  No Organizations Found
                </Text>
                <Text
                  className="text-gray-600 text-center mb-8 px-8"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  We couldn't find any organizations. Please try again or contact support.
                </Text>
                <TouchableOpacity
                  onPress={handleGetList}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#7563F7', '#9333EA']}
                    style={{
                      paddingHorizontal: 32,
                      paddingVertical: 16,
                      borderRadius: 12,
                      shadowColor: '#7563F7',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 6,
                    }}
                  >
                    <Text
                      className="text-white text-base"
                      style={{ fontFamily: 'Poppins-SemiBold' }}
                    >
                      Try Again
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>

        {renderCompanyModal()}
      </LinearGradient>
    </>
  );
};

export default InitialScreen;
