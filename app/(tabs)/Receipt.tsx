import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FIREBASE_DB } from '../../config/firebaseConfig.ts';
import { collection, addDoc } from 'firebase/firestore';

const Receipt = () => {
  const [image, setImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [imageURI, setImageURI] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [items, setItems] = useState<string[]>([]);
  const [dateTime, setDateTime] = useState<string>('');
  const [textImage, setTextImage] = useState<string>(``);
  const [isImageFullScreen, setIsImageFullScreen] = useState<Boolean>(false);

  const toggleImageView = () => {
    if (loading == false) {
      setIsImageFullScreen(!isImageFullScreen);
    }
  };

  const acceptImage = async () => {
    try {
      const docRef = await addDoc(collection(FIREBASE_DB, 'TextImage'), {
        text: textImage,
        image: imageURI,
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
      const response = await fetch(`http://192.168.2.34:5000/upload`, {
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
      currency: 'VND',
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
        const response = await fetch('http://192.168.2.34:5000/image', {
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

  const total_listProduct = (text) => {
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
        break;
      }
    }

    const match = text.match(/list of items[:\s]*([\s\S]*?)\s*total amount:/i);
    let items = [];

    if (match) {
      const itemLines = match[1].trim().split('\n');
      items = itemLines.map((item) => item.replace(/^\*\s*/, '').trim());
    } else {
      console.log('Không tìm thấy danh sách mục!');
    }

    const match2 = text.match(
      /date:\s*(\d{2}[-\/]\d{2}[-\/]\d{4})(?:,\s*(\d{2}:\d{2}(?::\d{2})?))?|time:\s*(\d{2}:\d{2}(?::\d{2})?)/
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
    const { totalAmount, items } = total_listProduct(textImage);
    setTotalAmount(totalAmount);
    setItems(items);
    console.log(totalAmount, items);
  }, [textImage]);

  return (
    <View className="w-full bg-slate-100 h-full relative">
      <View className="mt-3 px-2">
        {textImage ? (
          <View>
            <View className="w-full h-fit px-2 bg-white py-4 rounded-lg ">
              <View className=" border-b border-b-gray-500 ">
                <Text className="text-2xl text-green-600">
                  * TOTAL INVOICE AMOUNT:
                </Text>
                <Text className="m-2 text-3xl text-red-500 ml-6">
                  {formatVND(totalAmount)}
                </Text>
              </View>
              <View className="mt-2">
                <View className="flex-row w-full justify-between">
                  <Text className="text-lg text-gray-500 font-bold">
                    TOTAL AMOUNT:{' '}
                  </Text>
                  <Text className="text-lg  font-bold">
                    {formatVND(totalAmount)}
                  </Text>
                </View>
                <View className="flex-row w-full justify-between">
                  <Text className="text-lg text-gray-500 font-bold">
                    PAYMENT DATE:{' '}
                  </Text>
                  <Text className="text-lg  font-bold">
                    {dateTime ? dateTime : 'Không xác định'}
                  </Text>
                </View>
              </View>
            </View>
            <View className="w-full h-fit px-2 bg-white py-4 rounded-lg mt-2">
              <Text className="text-2xl text-green-600">* PRODUCT LIST:</Text>
              <View className="mt-2">
                {items.map((item, index) => (
                  <View key={index} className="flex-row w-full justify-between">
                    <Text className="text-2xl">{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View className={`flex items-center relative w-full h-[100vh] mt-44`}>
            <Text
              className="text-6xl font-inriaRegular mt-6 text-purpleDark"
              style={{ display: loading ? 'none' : 'flex' }}
            >
              Oggy
            </Text>
            <Text
              className="text-3xl font-inriaRegular mt-2 text-purpleDark"
              style={{ display: loading ? 'none' : 'flex' }}
            >
              Financial Mangement
            </Text>
            {loading && (
              <View className="w-full h-screen mt-20 items-center absolute  flex-1">
                <ActivityIndicator size="large" color="#8477d8" />
              </View>
            )}
          </View>
        )}
      </View>
      <SafeAreaView className="w-full flex-1 h-full ">
        <ScrollView className="overflow-y-auto w-full">
          {image && isImageFullScreen && (
            <TouchableOpacity
              onPress={toggleImageView}
              activeOpacity={0.7}
              className="ml-4 top-10 z-20"
            >
              <FontAwesome name="close" size={30} color="#a294f9" />
            </TouchableOpacity>
          )}
          {isImageFullScreen && (
            <View className="w-full h-[60vh] ">
              <TouchableOpacity onPress={toggleImageView} className="mb-3">
                <Image
                  source={{ uri: image }}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                    marginBottom: 10,
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      {!isImageFullScreen && (
        <View className="absolute bottom-1 w-full px-1 h-fit z-0">
          <View className="bg-[#f3f3f3] z-0 w-full py-4 rounded-xl flex justify-end border border-[#a294f9]">
            {image && (
              <TouchableOpacity onPress={toggleImageView} className="mb-3">
                <Image
                  source={{ uri: image }}
                  style={{
                    width: '100%',
                    height: 200,
                    resizeMode: 'contain',
                    marginBottom: 10,
                  }}
                />
              </TouchableOpacity>
            )}
            <View className="flex-row w-full items-center">
              <TouchableOpacity
                onPress={takePhoto}
                activeOpacity={0.7}
                className="ml-3"
              >
                <FontAwesome name="camera" size={30} color="#a294f9" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={pickImage}
                activeOpacity={0.7}
                className="ml-auto"
              >
                <AntDesign name="pluscircleo" size={35} color="#a294f9" />
              </TouchableOpacity>

              {image && (
                <TouchableOpacity
                  onPress={() => setImage('')}
                  activeOpacity={0.7}
                  disabled={loading}
                  className="ml-auto mr-5"
                >
                  <FontAwesome name="close" size={38} color="#a294f9" />
                </TouchableOpacity>
              )}
              {textImage && (
                <TouchableOpacity
                  onPress={() => setTextImage('')}
                  activeOpacity={0.7}
                  className="ml-auto mr-5"
                >
                  <FontAwesome name="close" size={35} color="#a294f9" />
                </TouchableOpacity>
              )}
              {textImage ? (
                <TouchableOpacity
                  onPress={acceptImage}
                  activeOpacity={0.7}
                  className="ml-auto mr-6"
                >
                  <AntDesign name="check" size={32} color="#a294f9" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={async () => {
                    if (!loading) {
                      await sendImage();
                    }
                  }}
                  activeOpacity={0.7}
                  disabled={loading}
                  className="ml-auto mr-6 opacity-80"
                >
                  <FontAwesome
                    name="send"
                    size={30}
                    color={loading ? '#ccc' : '#a294f9'}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Receipt;
