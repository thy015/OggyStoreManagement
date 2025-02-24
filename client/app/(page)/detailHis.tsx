import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import { useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

interface Transaction {
  category: string;
  date: Timestamp;
  items: any;
  totalAmount: number;
  type: string;
}

interface DetailHisProps {
  data: Transaction;
  type: 'spend' | 'income';
}

const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const DetailHis: React.FC<DetailHisProps> = ({ type, data }) => {
  return (
    <ScrollView className=" p-4  bg-white h-screen mt-2">
      <View className="w-full bg-[#907fff8d] h-fit  px-2 py-4 mb-3 rounded-lg">
        <Text className="text-5xl font-inriaRegular mt-6 text-white">
          Welcome back,
        </Text>
        <Text className="text-3xl font-inriaRegular mt-2 text-white">
          Oggy Financial Management!
        </Text>
        <View className="w-full mt-3">
          <View className="w-full flex-row justify-center items-center">
            <View className="w-[90%] bg-white rounded-lg">
              <View style={[{ borderRadius: 10, padding: 20, width: '100%' }]}>
                <Text className="text-2xl text-center font-inriaRegular text-[#907fff]">
                  Total {type == 'spend' ? 'Spending' : 'Income'}
                </Text>
                <Text
                  className={`text-4xl text-center font-inriaRegular mt-2 ${type == 'spend' ? 'text-red-500' : 'text-green-500'}`}
                >
                  {formatVND(data.totalAmount)}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row justify-center items-center">
            <View className="bg-[#907fff8d] p-2 rounded-b-lg w-[80%]"></View>
          </View>
        </View>
      </View>
      <View className="border-b p-2 border-gray-300">
        <Text className="text-lg text-[#8477d8] font-inriaRegular">
          Category
        </Text>
        <Text className="text-xl ml-2 font-inriaRegular">
          {Array.isArray(data.category)
            ? data.category.map((item: any, index: number) => (
                <Text key={index}>
                  {item}
                  {index < data.category.length - 1 ? ', ' : ''}
                </Text>
              ))
            : data.category}
        </Text>
      </View>
      <View className="border-b p-2 border-gray-300">
        <Text className="text-lg text-[#8477d8] font-inriaRegular">Date</Text>
        <Text className="text-xl ml-2 font-inriaRegular">
          {data?.date ? data.date.toDate().toLocaleDateString() : 'N/A'}
        </Text>
      </View>
      <View className="border-b p-2 border-gray-300">
        <Text className="text-lg text-[#8477d8] font-inriaRegular">
          List of items
        </Text>
        <View className="ml-2">
          {data?.items?.length > 0 &&
            data.items.map((item: any, index: number) => (
              <View
                key={index}
                className="flex-row justify-between items-center my-2"
              >
                <Text className="text-xl font-inriaRegular">
                  {item.productName} {'   '}SL: {item.quantity} {'   '}
                  {formatVND(item.price)}
                </Text>
              </View>
            ))}
        </View>
      </View>
      <View className="pb-72">
        <Text className="text-lg text-[#8477d8] font-inriaRegular">Total</Text>
        <Text
          className={`text-xl ml-2 font-inriaRegular font-bold ${
            data?.type == 'thu nhập' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {formatVND(data?.totalAmount || 0)}
        </Text>
      </View>
    </ScrollView>
  );
};

export default DetailHis;
