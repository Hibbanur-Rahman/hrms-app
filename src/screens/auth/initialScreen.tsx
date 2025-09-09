import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
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

  const [list, setList] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedCompanyInfo, setSelectedCompanyInfo] =
    useState<CompanyInfo | null>(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [fetchingCompanyInfo, setFetchingCompanyInfo] = useState(false);

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

  const renderUrlCard = (item: Item, index: number) => (
    <TouchableOpacity
      key={item._id}
      className="bg-white rounded-xl mb-4 p-5 flex-row items-center shadow-sm"
      onPress={() => handleSelectItem(item)}
      activeOpacity={0.7}
    >
      <View className="flex-1 flex-row items-center gap-x-4">
        <Image
          source={{ uri: item?.logoUrl }}
          className="h-[50px] w-[50px] border border-gray-200 rounded-full"
        />
        <View>
          <Text
            className="text-lg text-gray-900 mb-1"
            style={{ fontFamily: 'Poppins-SemiBold' }}
          >
            {item.name}
          </Text>
          <Text
            className="text-sm text-gray-600 mb-2"
            style={{ fontFamily: 'Poppins-Regular' }}
          >
            {item.description}
          </Text>
        </View>
      </View>
      <View className="ml-3">
        <Text className="text-xl text-blue-500 font-bold">→</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCompanyModal = () => (
    <Modal
      visible={showCompanyModal}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancelSelection}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 mx-5 max-h-[90%] w-[90%]">
          <Text
            className="text-2xl text-gray-900 text-center mb-5"
            style={{ fontFamily: 'Poppins-Bold' }}
          >
            Company Details
          </Text>

          {fetchingCompanyInfo ? (
            <View className="flex-1 justify-center items-center py-10">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text
                className="mt-3 text-base text-gray-600"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                Fetching company information...
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="items-center mb-6">
                {selectedCompanyInfo?.companyLogo && (
                  <Image
                    source={{ uri: selectedCompanyInfo.companyLogo }}
                    className="w-24 h-24 mb-4 rounded-full border-2 border-gray-200"
                    resizeMode="contain"
                  />
                )}

                <Text
                  className="text-xl text-gray-900 text-center mb-2"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  {selectedCompanyInfo?.companyName ||
                    selectedItem?.name ||
                    'Company Name'}
                </Text>

                {selectedCompanyInfo?.address && (
                  <Text
                    className="text-sm text-gray-600 text-center mb-3 leading-5"
                    style={{ fontFamily: 'Poppins-Regular' }}
                  >
                    {selectedCompanyInfo.address}
                  </Text>
                )}
              </View>

              {/* Contact Information */}
              <View className="bg-gray-50 p-4 rounded-xl mb-4">
                <Text
                  className="text-lg text-gray-900 mb-3"
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                >
                  Contact Information
                </Text>

                {selectedCompanyInfo?.contactEmail && (
                  <View className="flex-row items-center mb-2">
                    <Text className="text-blue-500 text-base mr-2">✉️</Text>
                    <Text
                      className="text-sm text-gray-700"
                      style={{ fontFamily: 'Poppins-Regular' }}
                    >
                      {selectedCompanyInfo.contactEmail}
                    </Text>
                  </View>
                )}
              </View>

              {/* Location Information */}
              <View className="bg-gray-50 p-4 rounded-xl mb-4">
                <Text
                  className="text-lg text-gray-900 mb-3"
                  style={{ fontFamily: 'Poppins-SemiBold' }}
                >
                  Location
                </Text>

                <View className="flex-row items-start">
                  <Text className="text-blue-500 text-base mr-2 mt-0.5">
                    📍
                  </Text>
                  <View className="flex-1">
                    {selectedCompanyInfo?.city && (
                      <Text
                        className="text-sm text-gray-700 mb-1"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        {selectedCompanyInfo.city}
                        {selectedCompanyInfo?.state &&
                          `, ${selectedCompanyInfo.state}`}
                      </Text>
                    )}

                    {selectedCompanyInfo?.pinCode && (
                      <Text
                        className="text-sm text-gray-600"
                        style={{ fontFamily: 'Poppins-Regular' }}
                      >
                        PIN: {selectedCompanyInfo.pinCode}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

            </ScrollView>
          )}

          <View className="flex-row justify-between gap-3 mt-4">
            <TouchableOpacity
              className="flex-1 py-3.5 rounded-lg bg-gray-50 border border-gray-200 items-center"
              onPress={handleCancelSelection}
            >
              <Text
                className="text-base text-gray-600"
                style={{ fontFamily: 'Poppins-SemiBold' }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 py-3.5 rounded-lg bg-blue-500 items-center"
              onPress={handleConfirmSelection}
              disabled={fetchingCompanyInfo}
            >
              <Text
                className="text-base text-white"
                style={{ fontFamily: 'Poppins-SemiBold' }}
              >
                {fetchingCompanyInfo ? 'Loading...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-5 pt-15 pb-8 bg-white border-b border-gray-200">
        <Text
          className="text-3xl text-gray-900 mb-2"
          style={{ fontFamily: 'Poppins-Bold' }}
        >
          Select Organization
        </Text>
        <Text
          className="text-base text-gray-600"
          style={{ fontFamily: 'Poppins-Regular' }}
        >
          Choose your organization to continue
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-5"
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text
              className="mt-3 text-base text-gray-600"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              Loading organizations...
            </Text>
          </View>
        ) : Array.isArray(list) && list.length > 0 ? (
          list.map((item, index) => renderUrlCard(item, index))
        ) : (
          <View className="flex-1 justify-center items-center py-15">
            <Text
              className="text-base text-gray-600 mb-5"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              No organizations available
            </Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-lg"
              onPress={handleGetList}
            >
              <Text
                className="text-white text-base"
                style={{ fontFamily: 'Poppins-SemiBold' }}
              >
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {renderCompanyModal()}
    </View>
  );
};

export default InitialScreen;
