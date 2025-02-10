export interface ReceiptProps {
  id: string;
  date: Date;
  category: 'Electronics' | 'Grocery' | 'Clothing' | 'Others';
  action: 'Income' | 'Expense';
  amount: number;
  items: Array<{ name: string; price: number; quantity: number }>;
  executor?: string;
}
