import { ImageRequestProps, PromptRequestProps } from '@/share/types/receipts';
import api, { ApiRequestOptions } from '@/utils/api';

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
}
export const receiptsAPI = new ReceiptsAPI();
