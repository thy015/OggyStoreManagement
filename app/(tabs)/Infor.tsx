import { View, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/config/firebaseConfig.ts';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import CustomButton from '@/components/customButton';
import { ThemedText } from '@/components/ThemedText';
import userFakeData from '@/app/localData/fakedata.tsx';
const Infor = () => {
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
