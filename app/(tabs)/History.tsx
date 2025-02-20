import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
} from 'react-native';
import { FIREBASE_DB } from '../../config/firebaseConfig.ts';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';

interface Transaction {
  DateTime: string;
  Monney: number;
  Type: string;
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [moneyDB, setMoneyDB] = useState<MoneyDB[]>([]);
  const [totalSpended, setTotalSpended] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

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

  //get data history from firebase
  useEffect(() => {
    const getData = async () => {
      try {
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'History'));
        const fetchedData: Transaction[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Transaction;
          fetchedData.push(data);
        });

        const spendedTransactions = fetchedData.filter(
          (item) => item.Type === 'spend'
        );

        setTransactions(spendedTransactions);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    getData();
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
    <View className="w-full bg-[#907fff8d] h-fit px-2 py-4  rounded-b-lg">
      <View className=" w-full mt-3">
        <View className="w-full flex-row justify-center items-center">
          <TouchableWithoutFeedback
            className="w-[90%]"
            onPress={() => {
              setSwitchCategory(!switchCategory), handlePress();
            }}
          >
            <Animated.View
              style={[
                { backgroundColor },
                { borderRadius: 10, padding: 20, width: '90%' },
              ]}
            >
              <Animated.Text
                style={{
                  color: textColor2,
                  fontSize: 21,
                  textAlign: 'center',
                  fontFamily: 'InriaSerif-Regular',
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
                  fontFamily: 'InriaSerif-Regular',
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
                  fontFamily: 'oswaldLight',
                  opacity: fadeAnim,
                  marginTop: 3,
                  width: '100%',
                }}
              >
                Please press to switch to{' '}
                {switchTextCategory ? 'Spended' : 'Income'}
              </Animated.Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
        <View className="flex-row justify-center items-center">
          <View className="bg-[#907fff8d] p-2 rounded-b-lg w-[80%]"></View>
        </View>
      </View>
    </View>
  );
};

export default History;
