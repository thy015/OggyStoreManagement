import api from '@/utils/api';
import axios from 'axios';
import { Alert } from 'react-native';
import { date } from 'zod';

class AuthensAPI {
  setAIKey() {
    throw new Error('Method not implemented.');
  }
  //POST
  async signUp(email: string, password: string) {
    try {
      const response = await axios.post(
        `http://localhost:8082/api/v1/authens/sign-up`,
        { email, password }
      );

      console.log('Success response:', response.data);
      return response.data; // Trả về data khi thành công
    } catch (error: any) {
      console.log('Error response:', error.response);

      const errorMessage =
        error.response?.data?.message || 'An unknown error occurred';
      console.error(errorMessage);

      throw new Error(errorMessage);
    }
  }

  async signIn(email: string, password: string) {
    const response = await axios.post(
      `https://oggy-store-management-be.vercel.app/api/v1/authens/sign-in`,
      {
        email,
        password,
      }
    );
    if (response.status >= 200 && response.status <= 300) {
      return {
        ok: true,
        data: response.data,
      };
    } else {
      Alert.alert('Sign-up failed. Please check your email and password.');
    }
  }
}
export const authensAPI = new AuthensAPI();
