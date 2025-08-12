import store from "../redux/store";
import { handleLogout } from "../redux/slices/auth/authSlice";
import axios from "axios";
import { Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { ENV } from "./env";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Request = async (httpOptions: any) => {
  // const navigation =
  //   useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const token = await AsyncStorage.getItem("access_token");
  if (!httpOptions.exact) {
    httpOptions.url = ENV.API_URL + "/" + httpOptions.url;
    console.log("http header:", httpOptions);
  }
  httpOptions.headers = {
    "Content-Type": httpOptions.files
      ? "multipart/form-data"
      : "application/json",
    Accept: "application/json",
    ...httpOptions.headers,
  };

  if (httpOptions.secure) {
    httpOptions.headers.Authorization = `Bearer ${token}`;
  }

  const handleRequestErrors = async(error: any) => {
    if (error.response) {
      const { status, data } = error?.response;
      console.log("error response", data);
      if (status === 401 && data?.message === "Unauthorized: Invalid token") {
        store.dispatch(handleLogout({isAuthenticated:false}));
        await AsyncStorage.clear();
        // navigation.navigate("Login");
      } else if (status == 413) {
        Alert.alert("File size exceeds the limit");
      }
    } else if (error.request) {
      console.log("error in request", error);
      console.log("error request", error.request);
    } else {
      console.log("error message", error.message);
    }
  };

  return axios(httpOptions)
    .then((response) => response)
    .catch((error) => {
      handleRequestErrors(error);
      throw error?.response;
    });
};

export default Request;
