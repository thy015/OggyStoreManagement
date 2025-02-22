import { localReceipts } from '@/app/localData/fakedata';
import { ReceiptProps } from '@/app/types';
import React from 'react';
import { View, Text, FlatList } from 'react-native';

const ReceiptCard: React.FC<ReceiptProps> = ({ amount, date, category, action }) => {
  return (
    <View className='bg-white rounded-md w-[94%] items-center justify-center mt-4 h-16'>
      <View className='p-4 flex flex-row'>
        <View className='flex-[0.3]'>
          <Text className='italic'>{date.toLocaleDateString()}</Text>
        </View>
        <View className='flex-[0.4]'>
          <Text>{category} Receipt</Text>
        </View>
        <View className='flex-[0.3]'>
          <Text className={`text-sm font-bold ${action === 'Expense' ? 'text-red-500' : 'text-green-500'}`}>
            {action === 'Expense' ? `-${amount} VND` : `+${amount} VND`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const ReceiptList: React.FC = () => {
  return (
    <FlatList
      data={localReceipts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ReceiptCard {...item} />}
    />
  );
};

export default ReceiptList;
