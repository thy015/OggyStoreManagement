import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-chart-kit';
import { Button, ButtonText } from '@/components/ui/button/index.tsx';
import ReceiptList from '@/components/receiptCard.tsx';
import { screenWidth } from '@/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_DB } from '@/config/firebaseConfig';
import {
  collection,
  onSnapshot,
  query,
  Query,
  Timestamp,
  where,
} from 'firebase/firestore';
interface Transaction {
  category: string;
  date: Timestamp | string;
  items: any;
  totalAmount: number;
  type: string;
}

const Home = () => {
  const [revenue, setRevenue] = useState<{ [month: string]: number }>({});

  const parseDateString = (dateString: string): Date | null => {
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);

    return isNaN(date.getTime()) ? null : date;
  };
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');

        if (!userId) {
          console.error('Không tìm thấy userId!');
          return;
        }

        const transactionsQuery = query(
          collection(FIREBASE_DB, 'transactions'),
          where('userId', '==', userId)
        );

        const unsubscribe = onSnapshot(transactionsQuery, (querySnapshot) => {
          const monthlyRevenue: { [month: string]: number } = {};

          querySnapshot.forEach((doc) => {
            const data = doc.data() as Transaction;

            let date: Date | null = null;
            if (data.date instanceof Timestamp) {
              date = data.date.toDate();
            } else if (typeof data.date === 'string') {
              date = parseDateString(data.date);
            }

            if (!date) {
              console.error('Lỗi: Ngày không hợp lệ!', data.date);
              return;
            }

            const monthKey = `${date.getMonth() + 1}`;

            if (!monthlyRevenue[monthKey]) {
              monthlyRevenue[monthKey] = 0;
            }
            monthlyRevenue[monthKey] += data.totalAmount;
          });

          const sortedRevenue = Object.entries(monthlyRevenue)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .reduce(
              (acc, [month, amount]) => {
                acc[month] = amount;
                return acc;
              },
              {} as { [month: string]: number }
            );

          setRevenue(sortedRevenue);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Lỗi khi lấy giao dịch:', error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    console.log('Revenue:', revenue);
  }, [revenue]);

  const labels = Object.keys(revenue).map((month) => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return monthNames[parseInt(month) - 1];
  });

  const dataValues = Object.values(revenue);

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
      },
    ],
  };

  const [loading, setLoading] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1, height: '100%' }}>
      <PanGestureHandler>
        <View className="w-full h-full relative">
          <SafeAreaView className="w-full flex-1 h-full ">
            <View className="w-full flex">
              {/* chart */}
              <View className="h-[310px] ml-4">
                <ScrollView>
                  <Text className="text-2xl mb-3 text-center text-[#e7e4e4bab]">
                    [ Monthly Paying - Year 2024 ]
                  </Text>

                  <BarChart
                    data={data}
                    width={screenWidth - 50} // Responsive width
                    height={250}
                    yAxisLabel=""
                    yAxisSuffix=" VND"
                    chartConfig={{
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: (opacity = 0.8) =>
                        `rgba(180, 141, 255, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(128, 128, 128, ${opacity})`,
                    }}
                    style={{
                      marginVertical: 10,
                      borderRadius: 5,
                    }}
                    fromZero
                    showValuesOnTopOfBars // Shows values on top
                  />
                </ScrollView>
              </View>

              <View className="bg-purpleLight h-full rounded-tl-[40px] rounded-tr-[40px] shadow-md">
                <View className="w-full h-full px-2 text-right mt-6 ml-3 flex flex-col">
                  {/* tool bar */}
                  <View className="flex flex-row">
                    <Button
                      style={{
                        width: '30%',
                        height: 50,
                        borderRadius: 10,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <ButtonText className="text-black text-sm font-roboto">
                        Change year
                      </ButtonText>
                    </Button>
                    <Button
                      style={{
                        width: '30%',
                        height: 50,
                        borderRadius: 10,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10,
                      }}
                    >
                      <ButtonText className="text-black text-sm font-roboto text-center">
                        View total income
                      </ButtonText>
                    </Button>

                    <Button
                      style={{
                        width: '30%',
                        height: 50,
                        borderRadius: 10,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10,
                      }}
                    >
                      <ButtonText className="text-black text-sm font-roboto text-center">
                        ...
                      </ButtonText>
                    </Button>
                  </View>
                  <View>
                    <ReceiptList />
                  </View>
                </View>
              </View>
            </View>
            {loading && (
              <View className="w-full h-screen  flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#ffffff" />
              </View>
            )}
          </SafeAreaView>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default Home;
