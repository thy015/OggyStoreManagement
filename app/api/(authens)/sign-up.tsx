import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import CustomButton from "@/app/components/customButton";
import { Link, router } from "expo-router";
import { ThemedText } from "@/app/components/ThemedText";
import { ThemedView } from "@/app/components/ThemedView";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [focusUserName, setFocusUserName] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const onFocusEmail = () => setFocusEmail(true);
  const onBlurEmail = () => setFocusEmail(false);

  const onFocusPassword = () => setFocusPassword(true);
  const onBlurPassword = () => setFocusPassword(false);

  const onFocusUserName = () => setFocusUserName(true);
  const onBlurUserName = () => setFocusUserName(false);

  const submit = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill in all fields");
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      Alert.alert("sign-up success");
      router.replace("/api/(authens)/sign-in");
    } catch (e) {
      const error = e as Error;
      console.error("Error during signup:", error.message || e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 h-full w-full">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className=" h-full overflow-y-auto"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: 20,
          }}
        >
          <View
            className={`w-full flex px-4 h-full  ${
              focusEmail || focusPassword || focusUserName
                ? "mt-2"
                : "justify-center"
            }`}
            style={{
              minHeight: Dimensions.get("window").height,
              justifyContent:
                focusEmail || focusPassword ? "flex-start" : "center",
            }}
          >
            <ThemedView className="ml-2">
              <ThemedView className="flex-row items-center justify-center w-full h-fit mt-10">
                <Image
                  source={require("@/assets/images/logo.png")}
                  className="w-32 h-32"
                  resizeMode="contain"
                />
                <Text className="text-5xl text-[#FF8C00] font-bold text-center">
                  DOG FARM
                </Text>
              </ThemedView>
              <ThemedText className="text-white text-3xl font-bold mt-4">
                Sign Up to Dog Farm
              </ThemedText>
            </ThemedView>
            <ThemedView className="mt-4">
              <ThemedText className=" text-gray-200 m-2 text-xl">
                User Name
              </ThemedText>
              <ThemedView
                className={`w-full h-16 px-4 rounded-2xl border-2 flex flex-row items-center ${
                  focusUserName ? "border-[#FF9C01]" : "border-[#232533]"
                }`}
              >
                <TextInput
                  onFocus={onFocusUserName}
                  onBlur={onBlurUserName}
                  className="flex-1 w-full text-white font-psemibold text-base"
                  placeholder="User Name"
                  placeholderTextColor="#7B7B8B"
                />
              </ThemedView>
            </ThemedView>
            <ThemedView className="mt-4">
              <ThemedText className=" text-gray-200 m-2 text-xl">
                Email
              </ThemedText>
              <ThemedView
                className={`w-full h-16 px-4 rounded-2xl border-2 flex flex-row items-center ${
                  focusEmail ? "border-[#FF9C01]" : "border-[#232533]"
                }`}
              >
                <TextInput
                  onFocus={onFocusEmail}
                  onBlur={onBlurEmail}
                  onChangeText={(text) => setEmail(text)}
                  className="flex-1 w-full text-white font-psemibold text-base"
                  placeholder="Email"
                  placeholderTextColor="#7B7B8B"
                />
              </ThemedView>
            </ThemedView>
            <ThemedView className="mt-4">
              <ThemedText className=" text-gray-200 m-2 text-xl">
                Password
              </ThemedText>
              <ThemedView
                className={`w-full h-16 px-4 rounded-2xl border-2 flex flex-row items-center ${
                  focusPassword ? "border-[#FF9C01]" : "border-[#232533]"
                }`}
              >
                <TextInput
                  onFocus={onFocusPassword}
                  onBlur={onBlurPassword}
                  onChangeText={(text) => setPassword(text)}
                  className="flex-1 w-full text-white font-psemibold text-base"
                  placeholder="Password"
                  placeholderTextColor="#7B7B8B"
                  secureTextEntry
                />
              </ThemedView>
            </ThemedView>
            <ThemedView className="flex flex-row justify-end w-full mt-4  ">
              <ThemedText className="text-white text-lg">
                {" "}
                Have an account already?,
              </ThemedText>
              <Link
                href="/api/(authens)/sign-in"
                className="font-bold text-[#FF9C01] text-lg"
              >
                {" "}
                LogIn
              </Link>
            </ThemedView>
            <CustomButton
              isLoading={loading}
              title="SignUp"
              handlePress={submit}
              containerStyles="w-full mt-7 px-4"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
