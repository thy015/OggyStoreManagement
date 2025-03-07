import { Dimensions, Platform } from 'react-native';

// 100000=>100,000
export const formatAmount = (amount: number): string => {
  return amount.toLocaleString('vi-VN');
};
// screen
export const screenWidth = Dimensions.get('window').width;
export const heightWidth=Dimensions.get('window').height;

//platform
export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';
