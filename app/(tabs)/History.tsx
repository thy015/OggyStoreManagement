import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FIREBASE_DB } from '../../config/firebaseConfig.ts';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import Entypo from '@expo/vector-icons/Entypo';
interface Transaction {
  DateTime: string;
  Monney: number;
  Type: string;
}

const History = () => {
  const [image, setImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [imageURI, setImageURI] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [items, setItems] = useState<string[]>([]);
  const [dateTime, setDateTime] = useState<string>('');
  const [textImage, setTextImage] = useState<string>(`  *List of items*
  Lorem Ipsum: $25
  Lorem Dolor: $15
  Sit Amet: $10
  Consectetur: $20
  Adipiscing Elit: $10
  Sed Diam: $15
  Total Amount: $95
  Date ~ Time: March 22, 2023 ~ 10:45 AM`);

  const [isImageFullScreen, setIsImageFullScreen] = useState<Boolean>(false);
  const [switchCategory, setSwitchCategory] = useState(false);
  const [switchTextCategory, setSwitchTextCategory] = useState(false);
  const colorAnim = useRef(new Animated.Value(0)).current;
  const textColorAnim = useRef(new Animated.Value(0)).current;
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
          (item) => item.Type === 'Spended'
        );

        setTransactions(spendedTransactions);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    getData();
  }, []);

  const toggleImageView = () => {
    if (loading == false) {
      setIsImageFullScreen(!isImageFullScreen);
    }
  };

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

  const acceptImage = async () => {
    try {
      const docRef = await addDoc(collection(FIREBASE_DB, 'History'), {
        DateTime: dateTime,
        Monney: totalAmount,
        Type: 'Spended',
      });

      // const docRef2 = await addDoc(collection(FIREBASE_DB, 'InvoiceTotal'), {
      //   total: total_listProduct(textImage).totalAmount,
      //   listProduct: total_listProduct(textImage).items,
      // });
      console.log('Send data to firebase success', docRef.id);
      setImage('');
      setTextImage('');
      setImageURI('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const sendImage = async () => {
    if (!image) {
      alert('Please select an image');
      return;
    }

    console.log('Uploading image');

    setLoading(true);

    const formData = new FormData();

    if (image) {
      formData.append('file', {
        uri: image,
        name: 'uploaded_image.jpg',
        type: 'image/jpeg',
      } as any);
    }

    try {
      const response = await fetch(`http://172.20.10.8:5000/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setImageURI(data.url);
        console.log('Uploaded image URL:', data.url);
      } else {
        console.error('Error uploading image:', data);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  const formatVND = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  useEffect(() => {
    if (imageURI) {
      (async () => {
        try {
          await processingChange();
        } catch (error) {
          console.error('Error in processingChange:', error);
        }
      })();
    }
  }, [imageURI]);

  const processingChange = async () => {
    console.log('Processing image:', imageURI);
    if (imageURI) {
      try {
        const response = await fetch('http://172.20.10.8:5000/image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ image_path: imageURI }),
          mode: 'cors',
        });

        const data = await response.json();

        if (response.ok) {
          setTextImage(data);
          setImage('');
          setLoading(false);
        }
        console.log('Fetch success: send image to text', data);
      } catch (error) {
        setLoading(false);
        console.log('Fetch error: send image to text fail', error);
      }
    }
  };

  const pickImage = async () => {
    setTextImage('');
    setImageURI('');
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    setTextImage('');
    setImageURI('');
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const total_listProduct = (text: string) => {
    console.log('Text:', typeof text, text);
    if (!text || typeof text !== 'string') {
      console.log('Không có dữ liệu hợp lệ!');
      return { totalAmount: 0, items: '' };
    }

    text = text.toLowerCase();
    text = text.replace(/\*/g, '');

    console.log('\n Text of lower:', text);
    let totalAmount = 0;
    const lines = text.split('\n');

    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('total amount:')) {
        totalAmount = parseInt(line.replace(/\D/g, ''), 10) || 0;
        console.log('Total Amount:', totalAmount);
        break;
      } else {
        console.log('Không tìm thấy Total Amount!');
      }
    }

    text = text.toLowerCase();
    text = text.replace(/\*/g, '');
    const match = text.match(/list of items[?:\s]*([\s\S]*?)\s*total amount:/i);

    let items: string[] = [];

    if (match) {
      const itemLines = match[1]
        .trim()
        .split('\n')
        .filter((line) => line.trim() !== '');
      items = itemLines.map((item) => item.replace(/^\d+\.\s*/, '').trim());
      console.log(items);
    } else {
      console.log('Không tìm thấy danh sách mục!');
    }

    const match2 = text.match(
      /date\s*~\s*time:\s*([a-zA-Z]+\s+\d{1,2},\s*\d{4})\s*~\s*([\d:]+\s*(?:am|pm)?)/i
    );

    if (match2) {
      const date = match2[1];
      const time = match2[2];
      setDateTime(`${date}~${time}`);
      console.log('Date:', date, 'Time:', time);
    } else {
      console.log('Không tìm thấy Date hoặc Time!');
    }

    return { totalAmount, items };
  };

  useEffect(() => {
    if (textImage) {
      const { totalAmount, items } = total_listProduct(textImage);
      setTotalAmount(totalAmount);
      setItems(Array.isArray(items) ? items : []);
      console.log(totalAmount, items);
    }
  }, [textImage]);

  return (
    <View className="w-full bg-slate-100 h-screen relative">
      <View className="relative w-full h-fit">
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
                      ? `+${formatVND(320)}`
                      : `-${formatVND(200)}`}
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
      </View>
      <View className="w-full flex-row justify-center items-center">
        <View className="p-3 mt-3 w-[98%] border border-gray-300 rounded-lg  bg-white flex-row justify-between">
          <Text className="w-[90%] text-gray-300">search</Text>
        </View>
      </View>
      <ScrollView className="h-full  overflow-y-auto">
        <View className="mb-20 pb-36">
          {transactions.map((item, index) => (
            <View
              key={index}
              className="bg-white p-2 my-3 rounded-lg flex-row justify-between"
            >
              <Entypo
                name="wallet"
                size={50}
                color="#7a6fbb"
                className="w-[10%]"
              />
              <View className="w-[87%]">
                <Animated.Text
                  style={{
                    color: '#7a6fbb',
                    fontSize: 18,
                    fontFamily: 'oswaldLight',
                    opacity: fadeAnim,
                  }}
                >
                  {switchTextCategory ? 'Income' : 'Spending'}
                </Animated.Text>
                <View className="flex-row my-2 justify-between">
                  <Animated.Text
                    style={{
                      color: '#6b7280',
                      fontSize: 14,
                      fontFamily: 'inriaRegular',
                      opacity: fadeAnim,
                    }}
                  >
                    DateTime
                  </Animated.Text>
                  <Animated.Text
                    style={{
                      color: '#6b7280',
                      fontSize: 14,
                      fontFamily: 'inriaRegular',
                      opacity: fadeAnim,
                    }}
                  >
                    {item.DateTime}
                  </Animated.Text>
                </View>
                <View className="flex-row justify-between">
                  <Animated.Text
                    style={{
                      color: '#7a6fbb',
                      fontSize: 14,
                      fontFamily: 'oswaldLight',
                      opacity: fadeAnim,
                    }}
                  >
                    Total
                  </Animated.Text>
                  <Animated.Text
                    style={{
                      color: textColor,
                      fontSize: 14,
                      fontFamily: 'oswaldLight',
                      opacity: fadeAnim,
                    }}
                  >
                    {formatVND(item.Monney)}
                  </Animated.Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default History;
