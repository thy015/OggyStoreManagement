import { View, Image, Animated, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/config/firebaseConfig.ts';
import { FIREBASE_DB } from '../../config/firebaseConfig.ts';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import CustomButton from '@/components/customButton';
import { ThemedText } from '@/components/ThemedText';
import userFakeData from '@/app/localData/fakedata.tsx';
const Infor = () => {
  const db = FIREBASE_DB;
  const [data, setData] = React.useState<string[]>([]);
  const auth = FIREBASE_AUTH;
  const [email, setEmail] = useState<string>('');
  const { Avatar } = userFakeData;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setEmail(uid);
    }
  });

  const submitLogout = () => {
    signOut(auth).then(() => {
      router.replace({ pathname: '/' });
    });
  };

  const getDB = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'TextImage'));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
      });
      setData(querySnapshot.docs.map((doc) => doc.data().text));
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ Firestore:', error);
    }
  };

  const getTotal = async () => {
    const querySnapshot = await getDocs(collection(db, 'Total_Product'));
    const firstDoc = querySnapshot.docs[0].data();
    const total = firstDoc.Total;
    const items = firstDoc.Product;
    console.log('Total:', total);
    return { total, items };
  };

  useEffect(() => {
    getDB();
  }, []);

  const UpdateInvoice = async () => {
    try {
      if (!data[2]) {
        console.error('Không có dữ liệu hợp lệ để cập nhật!');
        return;
      }

      const { total, items } = await getTotal();
      console.log('\nItems:', items);
      const { totalAmount } = total_listProduct(data[2]);

      console.log(`Giá trị hiện tại: ${total}, Giá trị mới: ${totalAmount}`);

      // const docRef = doc(db, 'Total_Product', 'jHDJJ3TeAqliWDeruyza');
      // await updateDoc(docRef, {
      //   Total: total + totalAmount,
      // });

      // console.log('Đã cập nhật dữ liệu thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật dữ liệu:', error);
    }
  };

  const total_listProduct = (text: string) => {
    console.log('Text:', typeof text, text);
    if (!text || typeof text !== 'string') {
      console.log('Không có dữ liệu hợp lệ!');
      return { totalAmount: 0, items: '' };
    }

    text = text.toLowerCase();

    console.log('\n Text of lower:', text);
    let totalAmount = 0;
    const lines = text.split('\n');

    for (let line of lines) {
      line = line.trim();
      if (
        line.startsWith('total amount:') ||
        line.startsWith('**total amount:**') ||
        line.startsWith('* **total amount:**')
      ) {
        totalAmount = parseInt(line.replace(/\D/g, ''), 10) || 0;
        break;
      }
    }

    const match = text.match(
      /\*\*list of items:\*\*\s*([\s\S]*?)\s*\*\*total amount:\*\*/
    );
    let items: string[] = [];

    if (match) {
      const itemLines = match[1].trim().split('\n');
      items = itemLines.map((item) => item.replace(/^\*\s*/, '').trim());
    } else {
      console.log('Không tìm thấy danh sách mục!');
    }

    return { totalAmount, items };
  };

  useEffect(() => {
    const { totalAmount, items } = total_listProduct(data[2]);
    console.log(totalAmount, items);
  }, [data]);

  return (
    <SafeAreaView>
      <View className="w-full items-center mt-10">
        <Image
          style={{
            width: 140,
            height: 140,
            resizeMode: 'contain',
            borderRadius: '50%',
          }}
          source={Avatar}
        />
        <ThemedText className="mt-2 text-xl">{email}</ThemedText>
        <CustomButton
          isLoading={false}
          title={'Sign Out'}
          handlePress={submitLogout}
          containerStyles="w-full mt-7 px-4"
        />
      </View>
    </SafeAreaView>
  );
};

export default Infor;
