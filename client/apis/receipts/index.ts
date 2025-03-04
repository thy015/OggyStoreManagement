import {
  GetAIKeyResponse,
  GetMoneyKeyResponse,
  GetVisionKeyResponse,
  ImageRequestProps,
  PromptRequestProps,
} from '@/share/types/receipts';
import api, { ApiRequestOptions } from '@/utils/api';
import axios from 'axios';

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
  async setAIKey() {
    try {
      const response = await axios.get<GetAIKeyResponse>(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/v1/receipts/get-ai-key`
      );
      console.log('AI key', response.data.apiKey);
      return response.data.apiKey;
    } catch (error) {
      console.error('Failed to fetch AI Key:', error);
      return null;
    }
  }
  //GET
  async setMoneyKey() {
    try {
      const response = await axios.get<GetMoneyKeyResponse>(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/v1/receipts/get-money-key`
      );
      console.log('Money key', response.data.moneyKey);
      return response.data.moneyKey;
    } catch (error) {
      console.error('Failed to fetch AI Key:', error);
      return null;
    }
  }

  async setVisionKey() {
    try {
      const response = await axios.get<GetVisionKeyResponse>(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/v1/receipts/get-vision-key`
      );
      console.log('Vision key', response.data.visionKey);
      return response.data.visionKey;
    } catch (error) {
      console.error('Failed to fetch Vision Key:', error);
      return null;
    }
  }
}
export const receiptsAPI = new ReceiptsAPI();
