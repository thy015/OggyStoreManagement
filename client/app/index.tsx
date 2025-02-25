import { Text, Image } from 'react-native';
import { useEffect } from 'react';
import '../global.css';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/config/firebaseConfig';

const Index = () => {
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (user) {
          router.push('/(tabs)/Receipt');
        } else {
          router.push('/(authens)/sign-in');
        }
      }, 2000);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView className="w-full h-screen overflow-auto px-4 bg-white">
      <ThemedView className="flex-row items-center justify-center w-full h-fit mt-32 ml-4">
        <Image
          source={require('../assets/images/money-investment.png')}
          className="h-[320px]"
          resizeMode="contain"
        />
      </ThemedView>

      <ThemedView className="flex items-center relative w-full h-fit mt-3">
        <Text className="text-6xl font-inriaRegular mt-6 text-purpleDark">
          Oggy
        </Text>
        <Text className="text-3xl font-inriaRegular mt-2 text-purpleDark">
          Financial Mangement
        </Text>
      </ThemedView>
      <ThemedView className="flex items-center relative w-full h-fit mt-64">
        <Text className="text-2xl font-inriaRegular mt-6 text-purple opacity-[0.8]">
          EST. 2025
        </Text>
      </ThemedView>
    </SafeAreaView>
  );
};

export default Index;
