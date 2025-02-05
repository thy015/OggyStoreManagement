import { Text, Image } from "react-native";
import React, { useEffect } from "react";
import "../global.css";
import { ThemedText } from "@/app/components/ThemedText";
import { ThemedView } from "@/app/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import CustomButton from "./components/customButton";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "@/config/firebaseConfig";
import * as Font from "expo-font";
const Index = () => {
  const auth = FIREBASE_AUTH;
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/Home");
      }
    });

    return () => unsubscribe();
  }, []);
  
  const loadFonts = async () => {
    await Font.loadAsync({
      "Inria-Bold": require("@/assets/fonts/InriaSerif-Bold.ttf"),
      "Inria-Light": require("@/assets/fonts/InriaSerif-Light.ttf"),
      "Inria-Regular": require("@/assets/fonts/InriaSerif-Regular.ttf"),
      "Oswald-Regular": require("@/assets/fonts/Oswald-Regular.ttf"),
      "Oswald-Light": require("@/assets/fonts/Oswald-Light.ttf"),
    });
  }
  
  useEffect(() => {
    const loadResources = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (err:any) {
        setError(err); 
      }
    };

    loadResources();
  }, []);

  if (error) {
    return <Text>Error loading fonts: {error.message}</Text>;
  }

  // if (!fontsLoaded) {
  //   return <AppLoading />; // Show loading screen while fonts are loading
  // }

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
        
        <CustomButton
          isLoading={false}
          title="Get Started"
          handlePress={() => router.push("/api/(authens)/sign-in")}
          containerStyles="w-full mt-7 px-4"
        />
      </ThemedView>
    </SafeAreaView>
  );
};

export default Index;
