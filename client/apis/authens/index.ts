import api from '@/utils/api';
import * as SecureStore from 'expo-secure-store';
// declare key in expo
const AI_KEY_STORAGE = 'AI_SECRET_KEY';
class AuthensAPI {
  //GET
  async getAIKey() {
    try {
      return await SecureStore.getItemAsync(AI_KEY_STORAGE);
    } catch (error) {
      console.error('Failed to load AI Key:', error);
      return null;
    }
  }
  //SAVE
 async saveAIKey() {
  try {
    const response: any = await api.get('/api/v1/authens/get-ai-key');

    if (!response.data || !response.data.apiKey) {
      throw new Error('AI Key is missing in response');
    }

    const aiKey: string = response.data.apiKey;

    if (typeof aiKey === 'string' && aiKey.trim() !== '') {
      await SecureStore.setItemAsync(AI_KEY_STORAGE, aiKey);
    }

    return aiKey;
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
