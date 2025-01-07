import { Text, Image } from "react-native";
import React, { useEffect } from "react";
import "../global.css";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import CustomButton from "./Components/CustomButton";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "@/config/firebaseConfig";

const Index = () => {
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/Home");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView className="w-full h-screen overflow-auto px-4">
      <ThemedView className="flex-row items-center justify-center w-full h-fit mt-10 ">
        <Image
          source={require("../assets/images/logo.png")}
          className="w-32 h-32"
          resizeMode="contain"
        />
        <Text className="text-5xl text-[#FF8C00] font-bold text-center">
          DOG FARM
        </Text>
      </ThemedView>

      <ThemedView className="flex items-center relative w-full h-fit mt-3">
        <Image
          source={require("../assets/images/cards.png")}
          className="max-w-[380px] w-full h-[380px]"
          resizeMode="contain"
        />
        <ThemedText className="text-3xl font-bold mt-4">
          WELCOME DOGGYAPP
        </ThemedText>
        <ThemedText className="text-2xl text-center mt-4">
          App nơi hội tụ những chú chó xuất sắc và đặc biệt
        </ThemedText>
        <CustomButton
          isLoading={false}
          title="Get Started"
          handlePress={() => router.push("/sign-in")}
          containerStyles="w-full mt-7 px-4"
        />
      </ThemedView>
    </SafeAreaView>
  );
};

export default Index;
