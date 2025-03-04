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
  image: { content: string };
  features: { type: 'TEXT_DETECTION' }[];
}
export interface ImageRequestProps {
  requests: ImageRequest[];
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
