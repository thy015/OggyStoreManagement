import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { formatAmount } from '@/app/utils';
import { localReceipts } from '@/app/localData/fakedata';

const DetailReceipt: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const receipt = localReceipts.find((item) => item.id === id);
  if (!receipt) return <Text>Receipt not found</Text>;

  return (
    <View className="bg-white rounded-md w-[94%] items-center justify-center mt-4 h-auto">
      <View className="p-4 flex flex-row">
        <View className="flex-[0.3]">
          <Text className="italic">{receipt.date.toLocaleDateString()}</Text>
        </View>
        <View className="flex-[0.4] flex-wrap">
          <Text>{receipt.category} {receipt.action}</Text>
          <FlatList
            data={receipt.items}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <Text>{item.name} - {formatAmount(item.price)} VND x {item.quantity}</Text>
            )}
          />
        </View>
        <View className="flex-[0.3] items-end">
          <Text className={`text-sm font-bold ${receipt.action === 'Expense' ? 'text-red-500' : 'text-green-500'}`}>
            {receipt.action === 'Expense' ? `-${formatAmount(receipt.amount)} VND` : `+${formatAmount(receipt.amount)} VND`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DetailReceipt;
