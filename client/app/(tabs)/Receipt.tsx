import { useState, useEffect, useRef } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FIREBASE_DB } from '../../config/firebaseConfig.ts';
import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { GoogleGenerativeAI } from '@google/generative-ai';
<<<<<<< HEAD
import { AI_KEY, GOOGLE_VISION_API_KEY, AI_KEY_MONNEY } from '@env';
=======
>>>>>>> b9bbca9 (Merge branch feat/unit-test to main  (#23))
import { ArrowDownCircle } from 'lucide-react-native';
import { receiptsAPI } from '@/apis/receipts/index.ts';
import * as SecureStore from "expo-secure-store";
import axios from 'axios';

interface MoneyDB {
  Spended: number;
  Income: number;
}

const Receipt = () => {

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [visionKey, setVisionKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchAIKey = async () => {
      try {
        // Fetch key from API
        const key=await receiptsAPI.setAIKey()
        if (key) {
          setApiKey(key);
        }
      } catch (error) {
        console.error('Failed to fetch AI KEY:', error);
      }
    };

    const loadAIKey = async () => {
      const storedKey = await SecureStore.getItemAsync('AI_KEY_STORAGE');
      if (storedKey) {
        setApiKey(storedKey);
      } else {
        fetchAIKey();
      }
    };

    loadAIKey();
  }, []);

  useEffect(() => {
    const fetchVisionKey = async () => {
      try {
        // Fetch key from API
        const key = await receiptsAPI.setVisionKey();
        if (key) {
          setVisionKey(key);
        }
      } catch (error) {
        console.error('Failed to fetch Vision KEY:', error);
      }
    };

    const loadVisionKey = async () => {
      const storedKey = await SecureStore.getItemAsync('VISION_KEY_STORAGE');
      if (storedKey) {
        setVisionKey(storedKey);
      } else {
        fetchVisionKey();
      }
    };

    loadVisionKey();
  }, []);
  // Initialize GoogleGenerativeAI 
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

  const [MoneyDB, setMoneyDB] = useState<MoneyDB[]>([]);
  const [image, setImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [textImage, setTextImage] = useState<string>(``);
  interface ReceiptData {
    category: string;
    Date: string;
    items: { productName: string; quantity: number; price: number }[];
    totalAmount: number;
    currency_code: string;
  }

  const [data, setData] = useState<ReceiptData>({
    category: '',
    Date: '',
    items: [],
    totalAmount: 0,
    currency_code: '',
  });
  const [isImageFullScreen, setIsImageFullScreen] = useState<Boolean>(false);
  const [switchCategory, setSwitchCategory] = useState(false);
  const [switchTextCategory, setSwitchTextCategory] = useState(false);
  const colorAnim = useRef(new Animated.Value(0)).current;
  const textColorAnim = useRef(new Animated.Value(0)).current;
  const [show, setShow] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [totalSpended, setTotalSpended] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [moneyConverted, setMoneyConverted] = useState(0);

  // TODO: write API transfer money func for others price
  const generateText = async (text: string) => {
    try {
      const prompt = `
      Chuyển đổi đoạn văn bản sau thành định dạng JSON của hóa đơn thanh toán.
      ghi là 'json {....}'
       ${text} Đảm bảo JSON chỉ bao gồm các trường:  'items' (mỗi item có 'productName', 'quantity', 'price'), 'totalAmount', 'Date','category','currency_code' currency_code là mã tiền tệ của nước đó .
      Đảm bảo có phân loại "category" thể loại giao dịch ví dụ như ( đồ ăn , vui chơi , mua sắm, sinh hoạt ,...)
      Bạn chỉ cần viết ra mỗi json không cần giải thích thêm.
    `;

      const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const response = await model?.generateContent([prompt]);

      const result =
        response?.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      setGeneratedText(result || '');
      setTextImage(result || '');
      const Json = 'text:' + result;
      const cleanedResult = Json.replace(/text:\s*```json|```/g, '').trim();

      const json = JSON.parse(cleanedResult);
      console.log('Json:', json);
      setData(json);
    } catch (error) {
      console.error('Error generating text:', error);
      setGeneratedText('Lỗi khi gọi API!');
    }
  };

  const toggleShow = () => {
    setShow(!show);
  };

  const toggleImageView = () => {
    setImage('');
    setTextImage('');
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

  useEffect(() => {
    const MoneyConverted = async () => {
      console.log('Converting money:', data.currency_code);

      try {
        const response = await axios.get(
          `https://api.fastforex.io/fetch-multi?from=${data.currency_code}&to=VND&api_key=${AI_KEY_MONNEY}`
        );

        const vndValue = response.data.results.VND;
        setMoneyConverted(vndValue);
      } catch (error) {
        console.error('Error converting money:', error);
      }
    };
    MoneyConverted();
  }, [data.currency_code]);

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

  const SaveReceipt = async () => {
    try {
      const docRef = await addDoc(collection(FIREBASE_DB, 'History'), {
        date: new Date(),
        category: data.category,
        totalAmount:
          data.currency_code === 'VND'
            ? data.totalAmount
            : data.totalAmount * moneyConverted,
        items: data.items,
        type: 'chi tiêu',
      });
      updateMoney();
      setImage('');
      setTextImage('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const updateMoney = async () => {
    try {
      const moneyRef = doc(FIREBASE_DB, 'Money', '01');
      const moneySnap = await getDoc(moneyRef);

      if (moneySnap.exists()) {
        const moneyData = moneySnap.data() as MoneyDB;
        let newIncome = moneyData.Income || 0;
        let newSpended = moneyData.Spended || 0;

        newSpended += data.totalAmount;
        await updateDoc(moneyRef, {
          Income: newIncome,
          Spended: newSpended,
        });

        console.log('Cập nhật thành công!');
      } else {
        console.error('Không tìm thấy dữ liệu!');
      }
    } catch (error) {
      console.error('Lỗi cập nhật Firestore:', error);
    }
  };

  const formatVND = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const pickImage = async () => {
    setTextImage('');
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

  const convertImageToBase64 = async (imageUri: string): Promise<string> => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result?.toString().split(',')[1];
        resolve(base64data || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const recognizeText = async () => {
    try {
      if (!image) {
        throw new Error('Image is not defined');
      }
      const base64Image = await convertImageToBase64(image);

      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${visionKey}`,
        {
          requests: [
            {
              image: { content: base64Image },
              features: [{ type: 'TEXT_DETECTION' }],
            },
          ],
        }
      );
     
      const textAnnotations = response.data.responses[0].textAnnotations;
      if (textAnnotations && textAnnotations.length > 0) {
        generateText(textAnnotations[0].description);
      } else {
        setTextImage('Không tìm thấy văn bản nào!');
      }
    } catch (error) {
      console.error('Lỗi OCR:', error);
      setTextImage('Lỗi khi nhận diện văn bản.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full h-full">
      <ScrollView
        className="w-full h-full overflow-y-auto bg-slate-100 "
        keyboardShouldPersistTaps="handled"
      >
        {!image ? (
          <View>
            <View className="w-full bg-[#907fff8d] h-fit  px-2 py-4 mb-3 rounded-b-lg">
              <View className="w-full mt-3">
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
            <View className="w-full h-fit">
              <View>
                {textImage ? (
                  <View className="h-full w-full"></View>
                ) : (
                  <View className="h-fit flex flex-row items-center w-full justify-center">
                    <Text className="text-lg text-purpleDark mr-2">
                      Up load your receipt picture below
                    </Text>
                    <ArrowDownCircle color={'#cfcfcf'} />
                    {loading && (
                      <View className="w-full h-screen mt-20 items-center absolute flex-1">
                        <ActivityIndicator size="large" color="#8477d8" />
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View className="w-full h-full bg-[#8477d875]">
            <View className="relative w-full h-fit z-40">
              <Image
                style={{ resizeMode: 'contain' }}
                source={{ uri: image }}
                className="w-full h-[80vh] justify-center items-center"
              />
            </View>
            {textImage && (
              <ScrollView className="absolute w-full h-3/4 bg-white bottom-0 rounded-t-lg p-4 z-50">
                <View className="border-b p-2  border-gray-300">
                  <Text className="text-lg text-[#8477d8] font-inriaRegular">
                    Category
                  </Text>
                  <Text className="text-xl ml-2 font-inriaRegular">
                    {data.category}
                  </Text>
                </View>
                <View className="border-b p-2  border-gray-300">
                  <Text className="text-lg text-[#8477d8] font-inriaRegular">
                    Date
                  </Text>
                  <Text className="text-xl ml-2 font-inriaRegular">
                    {data.Date}
                  </Text>
                </View>
                <View className="border-b p-2 border-gray-300">
                  <Text className="text-lg text-[#8477d8] font-inriaRegular">
                    List of items
                  </Text>
                  <View className="ml-2 ">
                    {data.items.length > 0 &&
                      data.items.map((item: any, index: number) => (
                        <View
                          key={index}
                          className="flex-row justify-between items-center my-2"
                        >
                          <Text className="text-xl font-inriaRegular">
                            {item.productName}
                            {'   '}SL: {item.quantity}
                            {'   '}
                            {data.currency_code === 'VND'
                              ? formatVND(item.price)
                              : formatVND(item.price * moneyConverted)}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>
                <View className="border-b p-2  border-gray-300">
                  <Text className="text-lg text-[#8477d8] font-inriaRegular">
                    Total Amount
                  </Text>
                  <Text className="text-xl ml-2 font-inriaRegular font-bold text-red-600">
                    {data.currency_code === 'VND'
                      ? formatVND(data.totalAmount)
                      : formatVND(data.totalAmount * moneyConverted)}
                  </Text>
                </View>
                <View className="flex-row mt-8  w-full  justify-between h-fit items-end ">
                  <TouchableOpacity
                    className="w-1/2"
                    onPress={SaveReceipt}
                    activeOpacity={0.7}
                  >
                    <Text className="text-center p-2 border-r border-[#8477d8] text-green-700">
                      Accept Receipt
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className=" w-1/2"
                    onPress={toggleImageView}
                    activeOpacity={0.7}
                  >
                    <Text className="text-center text-red-500 p-2 border-l border-[#8477d8]">
                      Delete Receipt
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        )}
      </ScrollView>
      {!textImage && (
        <View>
          <View
            className={`absolute right-0 bottom-3 flex-row justify-between items-center rounded-l-lg p-4 ${image ? 'bg-white' : 'bg-[#bg-[#907fff37]]'} z-10`}
          >
            <View className="flex-row w-fit items-center">
              <TouchableOpacity
                onPress={toggleShow}
                activeOpacity={0.7}
                className={`${show ? 'mx-3' : ''}`}
              >
                {!show ? (
                  <AntDesign name="leftcircleo" size={30} color="#a294f9" />
                ) : (
                  <AntDesign name="rightcircleo" size={30} color="#a294f9" />
                )}
              </TouchableOpacity>
              {show && !image && (
                <TouchableOpacity
                  onPress={takePhoto}
                  activeOpacity={0.7}
                  className="mx-3"
                >
                  <FontAwesome name="camera" size={30} color="#a294f9" />
                </TouchableOpacity>
              )}
              {show && !image && (
                <TouchableOpacity
                  onPress={pickImage}
                  activeOpacity={0.7}
                  className="mx-3"
                >
                  <AntDesign name="pluscircleo" size={30} color="#a294f9" />
                </TouchableOpacity>
              )}
              {show && image && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={recognizeText}
                  className="mx-3"
                >
                  <MaterialCommunityIcons
                    name="send"
                    size={30}
                    color="#a294f9"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
      {image && !textImage && (
        <TouchableOpacity
          className="absolute top-0 left-0 w-fit h-fit z-50"
          onPress={toggleImageView}
        >
          <Text className="text-[#a294f9] text-xl bg-[#fff] p-2 rounded-lg font-bold absolute top-3 left-5 z-20">
            <AntDesign name="left" size={19} color="a#294f9" />
            Cancel
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Receipt;
