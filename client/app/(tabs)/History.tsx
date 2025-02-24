import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { FIREBASE_DB } from '../../config/firebaseConfig.ts';
import {
  collection,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import AntDesign from '@expo/vector-icons/AntDesign';
import DetailHis from '../(page)/detailHis.tsx';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react-native';
import { black } from 'tailwindcss/colors';

interface Transaction {
  category: string;
  date: Timestamp;
  items: any;
  totalAmount: number;
  type: string;
}

interface MoneyDB {
  Spended: number;
  Income: number;
}

const History = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [switchCategory, setSwitchCategory] = useState(false);
  const [switchTextCategory, setSwitchTextCategory] = useState(false);
  const colorAnim = useRef(new Animated.Value(0)).current;
  const textColorAnim = useRef(new Animated.Value(0)).current;
  const [spend, setSpend] = useState<Transaction[]>([]);
  const [income, setIncome] = useState<Transaction[]>([]);
  const [moneyDB, setMoneyDB] = useState<MoneyDB[]>([]);
  const [totalSpended, setTotalSpended] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [detail, setDetail] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(FIREBASE_DB, 'Money'),
      (querySnapshot) => {
        const fetchedData: MoneyDB[] = [];

        let totalSpendedCalc = 0;
        let totalIncomeCalc = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data() as MoneyDB;
          fetchedData.push(data);
          totalSpendedCalc += data.Spended || 0;
          totalIncomeCalc += data.Income || 0;
        });

        setMoneyDB(fetchedData);
        setTotalSpended(totalSpendedCalc);
        setTotalIncome(totalIncomeCalc);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(FIREBASE_DB, 'History'),
      (querySnapshot) => {
        const fetchedData: Transaction[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Transaction;
          fetchedData.push(data);
        });
        const spendedTransactions = fetchedData.filter(
          (transaction) => transaction.type === 'chi tiêu'
        );
        const incomeTransactions = fetchedData.filter(
          (transaction) => transaction.type === 'thu nhập'
        );
        setSpend(spendedTransactions);
        setIncome(incomeTransactions);
        console.log(spend);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: switchCategory ? 1 : 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    Animated.timing(textColorAnim, {
      toValue: switchCategory ? 1 : 0,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [switchCategory]);

  const togleDetail = () => {
    setDetail(!detail);
  };

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 900,
      useNativeDriver: false,
    }).start(() => {
      setSwitchTextCategory((prev) => !prev);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: false,
      }).start();
    });
  };

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', '#8d7fdb'],
  });

  const textColor = textColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['red', '#31ef0b'],
  });

  const textColor2 = textColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#7a6fbb', 'white'],
  });

  const formatVND = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#e9e9e9' }}>
      {detail ? (
        <View>
          <TouchableOpacity onPress={togleDetail}>
            <Text>aaaa</Text>
          </TouchableOpacity>
          <DetailHis />
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#e9e9e9' }}>
          <View className='w-full bg-purpleLight rounded-b-md h-64 p-4'
          >
            {/* Toolbar */}
            <View className='w-full flex flex-row justify-between color-white my-2'>
              <ArrowLeftIcon color={black}/>
              <View>
                <Text className='text-lg font-semibold '>Feb 2025</Text>
                <View className='w-full border-black border-b'></View>
              </View>
              <ArrowRightIcon color={black}/>
            </View>
            {/* Toggle Button */}
            <View
              style={{ width: '100%', marginTop: 12, alignItems: 'center' }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  setSwitchCategory(!switchCategory);
                  handlePress();
                }}
              >
                <Animated.View
                  style={{
                    backgroundColor,
                    borderRadius: 10,
                    padding: 20,
                    width: '90%',
                  }}
                >
                  <Animated.Text
                    style={{
                      color: textColor2,
                      fontSize: 21,
                      textAlign: 'center',
                      opacity: fadeAnim,
                    }}
                  >
                    {switchTextCategory ? 'Total Income' : 'Total Spending'}
                  </Animated.Text>
                  <Animated.Text
                    style={{
                      color: textColor,
                      fontSize: 21,
                      textAlign: 'center',
                      opacity: fadeAnim,
                    }}
                  >
                    {switchTextCategory
                      ? `+${formatVND(totalIncome)}`
                      : `-${formatVND(totalSpended)}`}
                  </Animated.Text>
                  <Animated.Text
                    style={{
                      color: textColor2,
                      fontSize: 12,
                      textAlign: 'center',
                      opacity: fadeAnim,
                      marginTop: 3,
                    }}
                  >
                    Please press to switch to{' '}
                    {switchTextCategory ? 'Spended' : 'Income'}
                  </Animated.Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </View>

          <View style={{ flex: 1, padding: 8, paddingHorizontal: 16 }}>
            {switchTextCategory ? (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {income.map((item, index) => (
                  <TouchableOpacity onPress={togleDetail} key={index}>
                    <Animated.Text
                      style={{
                        fontSize: 20,
                        marginTop: 8,
                        color: '#7468b6',
                        fontWeight: 'bold',
                        opacity: fadeAnim,
                      }}
                    >
                      {item.date.toDate().toLocaleString('vi-VN', {
                        month: 'long',
                        timeZone: 'Asia/Ho_Chi_Minh',
                      })}
                    </Animated.Text>
                    <View
                      style={{
                        marginTop: 12,
                        width: '100%',
                        backgroundColor: 'white',
                        padding: 16,
                        borderRadius: 8,
                        flexDirection: 'row',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                      }}
                    >
                      <AntDesign
                        name="pay-circle-o1"
                        size={24}
                        color="#7468b6"
                        style={{ marginTop: 4 }}
                      />
                      <View style={{ marginLeft: 12, width: '90%' }}>
                        <Animated.Text
                          style={{
                            fontSize: 18,
                            color: '#7468b6',
                            fontWeight: 'bold',
                            opacity: fadeAnim,
                          }}
                        >
                          {item.category}
                        </Animated.Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                          className="my-2"
                        >
                          <Animated.Text
                            style={{
                              fontSize: 16,
                              color: 'gray',
                              opacity: fadeAnim,
                            }}
                          >
                            Thời gian giao dịch
                          </Animated.Text>
                          <Animated.Text
                            style={{
                              fontSize: 16,
                              color: 'gray',
                              opacity: fadeAnim,
                            }}
                          >
                            {item.date.toDate().toLocaleString('vi-VN', {
                              timeZone: 'Asia/Ho_Chi_Minh',
                            })}
                          </Animated.Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <Animated.Text
                            style={{
                              opacity: fadeAnim,
                              fontSize: 16,
                              color: 'green',
                            }}
                          >
                            Tổng tiền đã kiếm được
                          </Animated.Text>
                          <Animated.Text
                            style={{
                              fontSize: 16,
                              color: 'green',
                              opacity: fadeAnim,
                            }}
                          >
                            {formatVND(item.totalAmount)}
                          </Animated.Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {spend.map((item, index) => (
                  <View key={index}>
                    <Animated.Text
                      style={{
                        fontSize: 20,
                        marginTop: 8,
                        color: '#7468b6',
                        fontWeight: 'bold',
                        opacity: fadeAnim,
                      }}
                    >
                      {item.date.toDate().toLocaleString('vi-VN', {
                        month: 'long',
                        timeZone: 'Asia/Ho_Chi_Minh',
                      })}
                    </Animated.Text>
                    <View
                      style={{
                        marginTop: 12,
                        width: '100%',
                        backgroundColor: 'white',
                        padding: 16,
                        borderRadius: 8,
                        flexDirection: 'row',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                      }}
                    >
                      <AntDesign
                        name="pay-circle-o1"
                        size={24}
                        color="#7468b6"
                        style={{ marginTop: 4 }}
                      />
                      <View style={{ marginLeft: 12, width: '90%' }}>
                        <Animated.Text
                          style={{
                            fontSize: 18,
                            color: '#7468b6',
                            fontWeight: 'bold',
                            opacity: fadeAnim,
                          }}
                        >
                          {item.category}
                        </Animated.Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                          className="my-2"
                        >
                          <Animated.Text
                            style={{
                              fontSize: 16,
                              color: 'gray',
                              opacity: fadeAnim,
                            }}
                          >
                            Thời gian giao dịch
                          </Animated.Text>
                          <Animated.Text
                            style={{
                              fontSize: 16,
                              color: 'gray',
                              opacity: fadeAnim,
                            }}
                          >
                            {item.date.toDate().toLocaleString('vi-VN', {
                              timeZone: 'Asia/Ho_Chi_Minh',
                            })}
                          </Animated.Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <Animated.Text
                            style={{
                              fontSize: 16,
                              color: 'red',
                              opacity: fadeAnim,
                            }}
                          >
                            Tổng tiền đã sử dụng
                          </Animated.Text>
                          <Animated.Text
                            style={{
                              fontSize: 16,
                              color: 'red',
                              opacity: fadeAnim,
                            }}
                          >
                            {formatVND(item.totalAmount)}
                          </Animated.Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default History;
