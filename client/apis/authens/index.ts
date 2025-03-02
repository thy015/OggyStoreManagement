import { GetAIKeyResponse } from '@/share/types/receipts';
import api, { ApiRequestOptions } from '@/utils/api';
import * as SecureStore from 'expo-secure-store';
// declare key in expo
const AI_KEY_STORAGE = 'AI_SECRET_KEY';
class AuthensAPI {
  //SET
  async setAIKey(options?: ApiRequestOptions) {
    try {
      const response = await api.get<GetAIKeyResponse>(
        '/api/v1/authens/get-ai-key',
        { ...options }
      );

      await SecureStore.setItemAsync(AI_KEY_STORAGE, response.data.apiKey);
      return response.data.apiKey;
    } catch (error) {
      console.error('Failed to fetch AI Key:', error);
      return null;
    }
  }

  //POST
  async signIn(email: string, password: string) {
    return await api.post('/api/v1/authens/sign-in', {
      data: {
        email,
        password,
      },
    });
  }
}
export const authensAPI = new AuthensAPI();
