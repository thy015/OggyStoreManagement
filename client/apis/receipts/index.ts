import {
  GetAIKeyResponse,
  GetVisionKeyResponse,
  ImageRequestProps,
  PromptRequestProps,
} from '@/share/types/receipts';
import api, { ApiRequestOptions } from '@/utils/api';
import * as SecureStore from 'expo-secure-store';
// declare key in expo
const AI_KEY_STORAGE = 'AI_SECRET_KEY';
const VISION_API_KEY = 'VISION_SECRET_KEY';

class ReceiptsAPI {
  // POST
  async sendPrompt(requestBody: PromptRequestProps) {
    const options: ApiRequestOptions = { data: requestBody };
    return await api.post('/api/v1/receipts/prompts', options);
  }

  async sendImage(requestBody: ImageRequestProps) {
    const options: ApiRequestOptions = { data: requestBody };
    return await api.post('/api/v1/receipts/images-convert', options);
  }
  //GET
  async setAIKey(options?: ApiRequestOptions) {
    try {
      const response = await api.get<GetAIKeyResponse>(
        '/api/v1/receipts/get-ai-key',
        { ...options }
      );

      await SecureStore.setItemAsync(AI_KEY_STORAGE, response.data.apiKey);
      return response.data.apiKey;
    } catch (error) {
      console.error('Failed to fetch AI Key:', error);
      return null;
    }
  }

  async setVisionKey(options?: ApiRequestOptions) {
    try {
      const response = await api.get<GetVisionKeyResponse>(
        '/api/v1/receipts/get-vision-key',
        { ...options }
      );
      await SecureStore.setItemAsync(VISION_API_KEY, response.data.visionKey);
      return response.data.visionKey;
    } catch (error) {
      console.error('Failed to fetch Vision Key:', error);
      return null;
    }
  }
}
export const receiptsAPI = new ReceiptsAPI();
