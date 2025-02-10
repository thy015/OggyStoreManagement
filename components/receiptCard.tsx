import { localReceipts } from '@/app/localData/fakedata';
import { ReceiptProps } from '@/app/types';
import { formatAmount } from '@/app/utils';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';


const ReceiptCard: React.FC<ReceiptProps> = ({id, amount, date, category, action }) => {
  const router = useRouter();
  return (
    <TouchableOpacity className='bg-white rounded-md w-[94%] items-center justify-center mt-4 h-auto'
      onPress={() => router.push(`/receipt/${id}`)}
    >
      <View className='p-4 flex flex-row'>
        <View className='flex-[0.3]'>
          <Text className='italic'>{date.toLocaleDateString()}</Text>
        </View>
        <View className='flex-[0.4] flex-wrap'>
          <Text>{category} {action}</Text>
        </View>
        <View className='flex-[0.3] items-end'>
          <Text className={`text-sm font-bold ${action === 'Expense' ? 'text-red-500' : 'text-green-500'}`}>
            {action === 'Expense' ? `-${formatAmount(amount)} VND` : `+${formatAmount(amount)} VND`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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

