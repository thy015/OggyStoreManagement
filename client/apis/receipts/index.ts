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

  //recongize text
  async recognizeText(image: string) {
    try {
      if (!image) {
        throw new Error('⚠️ No image provided');
      }

      console.log('🖼️ Image URI:', image);

      const formData = new FormData();
      formData.append('file', {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpeg',
      });

      // Gửi request
      const response = await fetch(
        `${process.env.EXPO_PRIVATE_SERVER_URL}/api/v1/receipts/upload-and-convert`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(
          `🚨 Server error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('✅ Success:', data);
      return data.result;
    } catch (error) {
      console.error('❌ Error in recognizeText:', error);
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
