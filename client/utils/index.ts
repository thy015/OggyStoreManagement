import { Dimensions } from "react-native";

//100000=>100,000
export const formatAmount = (amount: number): string => {
  return amount.toLocaleString('vi-VN');
};

export const screenWidth = Dimensions.get('window').width;
export const heightWidth=Dimensions.get('window').height;
