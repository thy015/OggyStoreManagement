import { ReceiptProps } from "../types";

const avatar= require("@/assets/images/avatar.png");

const userFakeData = {
  UserName: "Nguyễn Hoài Thanh",
  Email: "Thanh@gmail.com",
  Password: "123",
  Avatar: avatar
};
export default userFakeData;

export const localReceipts: ReceiptProps[] = [
  {
    id: "r1",
    date: new Date("2024-08-27"),
    category: "Electronics",
    action: "Expense",
    amount: 1500000,
    items: [
      { name: "Laptop Stand", price: 50.0, quantity: 1 },
      { name: "Wireless Mouse", price: 25.5, quantity: 2 },
    ],
    executor: "John Doe",
  },
  {
    id: "r2",
    date: new Date("2024-08-26"),
    category: "Grocery",
    action: "Expense",
    amount: 550000,
    items: [
      { name: "Milk", price: 5.0, quantity: 2 },
      { name: "Bread", price: 3.0, quantity: 1 },
      { name: "Eggs", price: 6.0, quantity: 2 },
    ],
  },
  {
    id: "r3",
    date: new Date("2024-08-25"),
    category: "Clothing",
    action: "Expense",
    amount: 2000000,
    items: [
      { name: "Jeans", price: 100.0, quantity: 1 },
      { name: "T-Shirt", price: 50.0, quantity: 2 },
    ],
    executor: "Jane Smith",
  },
  {
    id: "r4",
    date: new Date("2024-08-24"),
    category: "Others",
    action: "Income",
    amount: 50000,
    items: [
      { name: "Freelance Payment", price: 500.0, quantity: 1 },
    ],
    executor: "Alice Johnson",
  },
  {
    id: "r5",
    date: new Date("2024-08-23"),
    category: "Electronics",
    action: "Income",
    amount: 1000000,
    items: [
      { name: "Sold Old Laptop", price: 1000.0, quantity: 1 },
    ],
    executor: "Bob Williams",
  },
];

