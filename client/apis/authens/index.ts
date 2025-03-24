import api from "@/utils/api";
import axios from 'axios';
import { Alert } from 'react-native';


class AuthensAPI {
  setAIKey() {
    throw new Error('Method not implemented.');
  }
  //POST
  async signUp(email: string, password: string) {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/v1/authens/sign-up`,
        {
          email,
          password,
        }
      );
      if (response && response.data) {
        console.log(response.data);
        return response.data;
      }
      Alert.alert('Sign-up failed. Please check your email and password.');
      throw new Error('Sign-up failed. Please check your email and password.');
    } catch (error: any) {
      Alert.alert(
        'Sign-up error',
        error.response?.data?.message ||
          'If you have an account, please sign in'
      );
      return null;
    }
  }

  async signIn(email: string, password: string) {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_SERVER_URL}/api/v1/authens/sign-in`,
      {
        email,
        password,
      }
    );
    if (response && response.data) {
      return response.data;
    } else {
      Alert.alert('Sign-up failed. Please check your email and password.');
    }
  }
}
export const authensAPI = new AuthensAPI();
