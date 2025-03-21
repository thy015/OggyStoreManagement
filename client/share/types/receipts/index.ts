export interface ReceiptProps {
  id: string;
  date: Date;
  category: 'Electronics' | 'Grocery' | 'Clothing' | 'Others';
  action: 'Income' | 'Expense';
  amount: number;
  items: Array<{ name: string; price: number; quantity: number }>;
  executor?: string;
}

export interface PromptRequestProps {
  config: {
    encoding: string;
    sampleRateHertz: number;
    languageCode: string;
  };
  audio: {
    content: any;
  };
}

interface ImageRequest {
  image: { image: string };
}
export interface ImageRequestProps {
  requests: ImageRequest;
}

export interface GetAIKeyResponse {
  apiKey: string;
}

export interface GetMoneyKeyResponse {
  moneyKey: string;
}

export interface GetVisionKeyResponse {
  visionKey: string;
}

export interface ReceiptData {
  category: string;
  Date: string;
  items: { productName: string; quantity: number; price: number }[];
  totalAmount: number;
  currency_code: string;
}
