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
import axios from 'axios';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { white } from 'tailwindcss/colors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_KEY, GOOGLE_VISION_API_KEY } from '@env';
const genAI = new GoogleGenerativeAI(AI_KEY);

const Receipt = () => {
  const [image, setImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [textImage, setTextImage] = useState<string>(``);
  // *List of items*
  // Lorem Ipsum: $25
  // Lorem Dolor: $15
  // Sit Amet: $10
  // Consectetur: $20
  // Adipiscing Elit: $10
  // Sed Diam: $15
  // Total Amount: $95
  // Date ~ Time: March 22, 2023 ~ 10:45 AM

  const [isImageFullScreen, setIsImageFullScreen] = useState<Boolean>(false);
  const [switchCategory, setSwitchCategory] = useState(false);
  const [switchTextCategory, setSwitchTextCategory] = useState(false);
  const colorAnim = useRef(new Animated.Value(0)).current;
  const textColorAnim = useRef(new Animated.Value(0)).current;
  const [show, setShow] = useState(false);
  const [generatedText, setGeneratedText] = useState('');

  const generateText = async (text: string) => {
    try {
      const imagebase64 = await convertImageToBase64(image);
      const prompt = `
        Chuyển đổi đoạn văn bản sau thành định dạng JSON của hóa đơn thanh toán.
         ${text} Đảm bảo JSON chỉ bao gồm các trường:  'items' (mỗi item có 'productName', 'quantity', 'price'), 'totalAmount', "Date.
        nếu price là giá tiền nước khác thì chuyển thành định dạng số tiền price thành VND.
        Đảm bảo định dạng hợp lệ. nếu không hợp lệ thì sẽ tạo mã JSON "note" thông báo rằng cái gì không hợp lệ theo mã json.
        Đảm bảo có phân loại "category" thể loại giao dịch ví dụ như ( đồ ăn , vui chơi , mua sắm, sinh hoạt ,...) 
      `;

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const response = await model.generateContent([prompt]);

      const result =
        response.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      setGeneratedText(result || '');
      setTextImage(result || '');
      console.log('Generated text:', result);
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

  const SaveReceipt = async () => {
    try {
      const docRef = await addDoc(collection(FIREBASE_DB, 'History'), {
        Receipt: textImage,
      });

      // const docRef2 = await addDoc(collection(FIREBASE_DB, 'InvoiceTotal'), {
      //   total: total_listProduct(textImage).totalAmount,
      //   listProduct: total_listProduct(textImage).items,
      // });
      console.log('Send data to firebase success', docRef.id);
      setImage('');
      setTextImage('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  // const sendImage = async () => {
  //   if (!image) {
  //     alert('Please select an image');
  //     return;
  //   }

  //   console.log('Uploading image');

  //   setLoading(true);

  //   const formData = new FormData();

  //   if (image) {
  //     formData.append('file', {
  //       uri: image,
  //       name: 'uploaded_image.jpg',
  //       type: 'image/jpeg',
  //     } as any);
  //   }

  //   try {
  //     const response = await fetch(`http://172.20.10.8:5000/upload`, {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       setImageURI(data.url);
  //       console.log('Uploaded image URL:', data.url);
  //     } else {
  //       console.error('Error uploading image:', data);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     console.error('Error:', error);
  //   }
  // };

  const formatVND = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // useEffect(() => {
  //   if (imageURI) {
  //     (async () => {
  //       try {
  //         await processingChange();
  //       } catch (error) {
  //         console.error('Error in processingChange:', error);
  //       }
  //     })();
  //   }
  // }, [imageURI]);

  // const processingChange = async () => {
  //   console.log('Processing image:', imageURI);
  //   if (imageURI) {
  //     try {
  //       const response = await fetch('http://172.20.10.8:5000/image', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Accept: 'application/json',
  //         },
  //         body: JSON.stringify({ image_path: imageURI }),
  //         mode: 'cors',
  //       });

  //       const data = await response.json();

  //       if (response.ok) {
  //         setTextImage(data);
  //         setImage('');
  //         setLoading(false);
  //       }
  //       console.log('Fetch success: send image to text', data);
  //     } catch (error) {
  //       setLoading(false);
  //       console.log('Fetch error: send image to text fail', error);
  //     }
  //   }
  // };

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
      console.log('Recognizing text from image:', image);
      if (!image) {
        throw new Error('Image is not defined');
      }
      const base64Image = await convertImageToBase64(image);

      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
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
        console.log('Text:', textAnnotations[0].description);
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

  // const total_listProduct = (text: string) => {
  //   console.log('Text:', typeof text, text);
  //   if (!text || typeof text !== 'string') {
  //     console.log('Không có dữ liệu hợp lệ!');
  //     return { totalAmount: 0, items: '' };
  //   }

  //   text = text.toLowerCase();
  //   text = text.replace(/\*/g, '');

  //   console.log('\n Text of lower:', text);
  //   let totalAmount = 0;
  //   const lines = text.split('\n');

  //   for (let line of lines) {
  //     line = line.trim();
  //     if (line.startsWith('total amount:')) {
  //       totalAmount = parseInt(line.replace(/\D/g, ''), 10) || 0;
  //       console.log('Total Amount:', totalAmount);
  //       break;
  //     } else {
  //       console.log('Không tìm thấy Total Amount!');
  //     }
  //   }

  //   text = text.toLowerCase();
  //   text = text.replace(/\*/g, '');
  //   const match = text.match(/list of items[?:\s]*([\s\S]*?)\s*total amount:/i);

  //   let items: string[] = [];

  //   if (match) {
  //     const itemLines = match[1]
  //       .trim()
  //       .split('\n')
  //       .filter((line) => line.trim() !== '');
  //     items = itemLines.map((item) => item.replace(/^\d+\.\s*/, '').trim());
  //     console.log(items);
  //   } else {
  //     console.log('Không tìm thấy danh sách mục!');
  //   }

  //   const match2 = text.match(
  //     /date\s*~\s*time:\s*([a-zA-Z]+\s+\d{1,2},\s*\d{4})\s*~\s*([\d:]+\s*(?:am|pm)?)/i
  //   );

  //   if (match2) {
  //     const date = match2[1];
  //     const time = match2[2];
  //     setDateTime(`${date}~${time}`);
  //     console.log('Date:', date, 'Time:', time);
  //   } else {
  //     console.log('Không tìm thấy Date hoặc Time!');
  //   }

  //   return { totalAmount, items };
  // };

  // useEffect(() => {
  //   if (textImage) {
  //     const { totalAmount, items } = total_listProduct(textImage);
  //     setTotalAmount(totalAmount);
  //     setItems(Array.isArray(items) ? items : []);
  //     console.log(totalAmount, items);
  //   }
  // }, [textImage]);

  return (
    <View className="w-full h-full">
      <ScrollView
        className="w-full h-full overflow-y-auto bg-slate-100 "
        keyboardShouldPersistTaps="handled"
      >
        {!image ? (
          <View>
            <View className="w-full bg-[#907fff8d] h-fit  px-2 py-4 mb-3 rounded-b-lg">
              <Text className="text-5xl font-inriaRegular mt-6 text-white">
                Welcome back,
              </Text>
              <Text className="text-3xl font-inriaRegular mt-2 text-white">
                Oggy Financial Management!
              </Text>
              <View className="w-full mt-3">
                <View className="w-full flex-row justify-center items-center">
                  <TouchableWithoutFeedback
                    className="w-[90%]"
                    onPress={() => {
                      setSwitchCategory(!switchCategory);
                      handlePress();
                    }}
                    accessible={false} // 🛠 Fix chặn sự kiện bấm
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
            <View className="w-full h-fit">
              <View>
                {textImage ? (
                  <View className="h-full w-full"></View>
                ) : (
                  <View className="h-fit flex items-center w-full justify-center">
                    <Text className="text-6xl font-inriaRegular mt-6 text-purpleDark">
                      Oggy
                    </Text>
                    <Text className="text-3xl font-inriaRegular mt-2 text-purpleDark">
                      Financial Management
                    </Text>
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
                <Text className="text-xl">{textImage}</Text>
                <View className="flex-row items-center w-full  justify-between h-fit ">
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
