import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { FIREBASE_DB } from '@/config/firebaseConfig.ts';
import { getAuth } from 'firebase/auth';
import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  setDoc,
} from 'firebase/firestore';
import axios from 'axios';
import { receiptsAPI } from '@/apis/receipts/index.ts';
import { formatAmount } from '@/utils';
interface MoneyDB {
  Spended: number;
  Income: number;
}

const Chat_Speech = () => {
  const [aiKey, setAiKey] = useState<string | null>(null);
  const [visionKey, setVisionKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchAIKey = async () => {
      try {
        // Fetch key from API
        const key = await receiptsAPI.setAIKey();
        if (key) {
          setAiKey(key);
        }
      } catch (error) {
        console.error('Failed to fetch AI KEY:', error);
      }
    };

    const loadAIKey = async () => {
      if (aiKey) {
        setAiKey(aiKey);
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
      if (visionKey) {
        setVisionKey(visionKey);
      } else {
        fetchVisionKey();
      }
    };

    loadVisionKey();
  }, []);
  // Initialize GoogleGenerativeAI
  const genAI = aiKey ? new GoogleGenerativeAI(aiKey) : null;

  const [data, setData] = useState<any>({});
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<
    Array<{ sender: string; message: string }>
  >([]);

  const [onclickRecord, setOnclickRecord] = useState<boolean>(false);
  const [input, setInput] = useState<boolean>(false);
  const date = new Date();
  const [MoneyDB, setMoneyDB] = useState<MoneyDB[]>([]);
  const [totalSpended, setTotalSpended] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const updateMoney = async (generatedData: any) => {
    if (!generatedData || !generatedData.type || !generatedData.totalAmount) {
      console.error('Dữ liệu không hợp lệ!');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error('Người dùng chưa đăng nhập!');
        return;
      }

      const userId = user.uid;
      const moneyRef = doc(FIREBASE_DB, 'Money', userId);
      const moneySnap = await getDoc(moneyRef);

      let newIncome = 0;
      let newSpended = 0;

      if (moneySnap.exists()) {
        const moneyData = moneySnap.data() as MoneyDB;
        newIncome = moneyData.Income || 0;
        newSpended = moneyData.Spended || 0;
      }

      if (generatedData.type.toLowerCase() === 'thu nhập') {
        newIncome += generatedData.totalAmount;
      } else if (generatedData.type.toLowerCase() === 'chi tiêu') {
        newSpended += generatedData.totalAmount;
      }

      if (moneySnap.exists()) {
        await updateDoc(moneyRef, {
          Income: newIncome,
          Spended: newSpended,
        });
      } else {
        await setDoc(moneyRef, {
          Income: newIncome,
          Spended: newSpended,
        });
      }

      console.log('Cập nhật thành công!');
    } catch (error) {
      console.error('Lỗi cập nhật Firestore:', error);
    }
  };

  const Save = async (data: any) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error('Người dùng chưa đăng nhập!');
        return;
      }

      const userId = user.uid;

      const docRef = await addDoc(collection(FIREBASE_DB, 'transactions'), {
        userId,
        date: new Date(),
        category: data.category,
        totalAmount: data.totalAmount,
        items: data.items,
        type: data.type,
      });

      await updateMoney(data);
      console.log('Lưu lịch sử thành công:', docRef.id);
    } catch (e) {
      console.error('Lỗi khi thêm tài liệu:', e);
    }
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () =>
      setInput(true)
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () =>
      setInput(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const toggleRecord = () => {
    setOnclickRecord((prev) => {
      const newState = !prev;

      if (newState) {
        startRecording();
      } else {
        stopRecording();
      }

      return newState;
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          sender: 'bot',
          message: 'Hello, I am OggyBot! 👋. How can I help you?',
        },
      ]);
    }, 1300);
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setMessages([]);
        setTimeout(() => {
          setMessages([
            {
              sender: 'bot',
              message: 'Hello, I am OggyBot! 👋. How can I help you?',
            },
          ]);
        }, 1300);
      };
    }, [])
  );

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'bot',
        message: 'Hello, I am OggyBot! 👋. How can I help you?',
      },
    ]);
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Ứng dụng cần quyền ghi âm!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync({
        isMeteringEnabled: true,
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });

      await newRecording.startAsync();
      console.log(newRecording);
      setRecording(newRecording);
    } catch (error) {
      console.error('Lỗi khi ghi âm:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    if (uri) {
      console.log('🎤 Ghi âm hoàn tất:', uri);
      convertToText(uri);
    } else {
      Alert.alert('Lỗi', 'Không tìm thấy file ghi âm!');
    }
  };

  const convertToText = async (uri: string) => {
    setIsLoading(true);
    console.log('🔊 Đang nhận diện giọng nói...');
    try {
      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const requestBody = {
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 44100,
          languageCode: 'vi-VN',
        },
        audio: {
          content: fileBase64,
        },
      };

      console.log(
        '📤 Gửi dữ liệu đến API:',
        JSON.stringify(requestBody, null, 2)
      );

      const response = await axios.post(
        `https://speech.googleapis.com/v1/speech:recognize?key=${visionKey}`,
        requestBody
      );

      console.log('📩 Phản hồi từ Google:', response.data);

      if (response.data.results) {
        setTranscription(response.data.results[0].alternatives[0].transcript);
      } else {
        setTranscription('Không nhận diện được âm thanh.');
      }
    } catch (error) {
      console.error('🚨 Lỗi nhận diện giọng nói:', error);
      Alert.alert('Lỗi', 'Không thể gửi dữ liệu đến API.');
    } finally {
      setIsLoading(false);
    }
  };
  const formatVND = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleSendMessage = async () => {
    if (!transcription.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: 'user', message: transcription },
    ]);
    setTranscription('');

    const generatedData = await generateText(transcription);

    if (generatedData && generatedData.type != 'undefined') {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            message: `Bot: bạn đã ${generatedData.type} ${formatAmount(generatedData.totalAmount)} thuộc danh mục ${
              Array.isArray(generatedData.category)
                ? generatedData.category.map((item: any, index: number) => (
                    <Text key={index}>
                      {item}
                      {index < generatedData.category.length - 1 ? ', ' : ''}
                    </Text>
                  ))
                : generatedData.category
            }`,
          },
        ]);
      }, 1500);
      Save(generatedData);
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            message: `Bot: không thể nhận diện được dữ liệu.`,
          },
        ]);
      }, 1500);
    }
  };

  const generateText = async (text: string) => {
    try {
      const prompt = `
        Chuyển đổi đoạn văn bản sau thành định dạng JSON .
        ${text} Đảm bảo JSON chỉ bao gồm các trường:
         'items' (mỗi item có 'productName', 'quantity', 'price'),'totalAmount','category','type'.
        nếu price là giá tiền nước khác thì chuyển thành định dạng số tiền price thành VND.
        1Baht(B) =757,76VND
        Type: thu nhập, chi tiêu
        Đảm bảo có phân loại "category" thể loại giao dịch ví dụ như ( đồ ăn , vui chơi , mua sắm, sinh hoạt ,...)
        Nếu text không có gì hoặc không xác định cho type:underfine
        Bạn chỉ cần viết ra mỗi json không cần giải thích thêm
      `;

      const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const response = await model?.generateContent([prompt]);

      const result =
        response?.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const Json = 'text:' + result;
      const cleanedResult = Json.replace(/text:\s*```json|```/g, '').trim();

      const json = JSON.parse(cleanedResult);
      setData(json);
      console.log('🔥 Dữ liệu JSON:', json);
      return json;
    } catch (error) {
      console.error('Error generating text:', error);
      return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="m-3 flex-1">
          <View className="h-fit static flex-row justify-between bg-white pb-2">
            <View className="flex-row w-[75%] h-fit">
              <View className="bg-[#907fff58] p-3 py-4 rounded-full">
                <FontAwesome5 name="robot" size={20} color="#7a6fbb" />
              </View>
              <View className="ml-3">
                <Text className="text-xl font-bold font-inriaRegular">
                  Chatbot
                </Text>
                <View className="flex-row items-center h-fit">
                  <Entypo name="controller-record" size={10} color="#48ff00" />
                  <Text className="text-slate-500">Always active</Text>
                </View>
              </View>
            </View>
            <View className="w-[25%] h-fit flex-row justify-end items-center">
              <TouchableOpacity onPress={() => {}}>
                <Ionicons
                  name="create"
                  size={30}
                  color="#7a6fbb"
                  className="px-2"
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            className={`${input ? 'h-[46vh]' : 'h-[75vh]'} mt-3 overflow-y-auto`}
          >
            <Text className="w-full text-slate-500 text-center">
              {new Date().toLocaleString()}
            </Text>
            <View className="w-full justify-between">
              <View className="flex-1">
                {messages.map((item, index) => (
                  <View
                    key={index}
                    className={`flex-row w-full mx-2 mt-2 ${item.sender === 'user' ? 'justify-end' : ''}`}
                  >
                    {item.sender === 'bot' && (
                      <View className="bg-[#907fff58] flex-row justify-center items-center mr-4 h-12 w-fit px-4 rounded-full">
                        <FontAwesome5 name="robot" size={12} color="#7a6fbb" />
                      </View>
                    )}
                    <Text
                      className={`p-4 mr-4 max-w-[85%] ${
                        item.sender === 'user'
                          ? 'bg-blue-400 text-white rounded-l-2xl rounded-br-2xl'
                          : 'bg-slate-200 rounded-r-2xl rounded-bl-2xl'
                      }`}
                    >
                      {item.message}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
          <View
            className={`w-full  bg-white p-2 h-fit flex-row items-center justify-between ${
              input ? 'absolute bottom-20 mb-5' : ''
            }`}
          >
            <TextInput
              placeholder="Type a message..."
              value={transcription}
              onChangeText={(e) => setTranscription(e)}
              className="border w-[85%] pr-10 border-slate-500 p-3 rounded-3xl z-40"
            />
            <TouchableOpacity
              className="absolute w-fit z-50 right-[75px]"
              onPress={toggleRecord}
            >
              {!onclickRecord ? (
                <Feather name="mic" size={24} color="#7a6fbb" />
              ) : (
                <MaterialCommunityIcons
                  name="stop-circle"
                  size={24}
                  color="#b51b1b"
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSendMessage}
              className="h-fit ml-2  flex-row items-center w-fit  "
            >
              <Entypo name="paper-plane" size={30} color="#7a6fbb" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Chat_Speech;
