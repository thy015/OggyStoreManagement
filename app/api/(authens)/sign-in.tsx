import {
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import CustomButton from "@/app/components/customButton";
import { Link, router } from "expo-router";
import { ThemedView } from "@/app/components/ThemedView";
import { ThemedText } from "@/app/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const auth = getAuth();
  const [formField, setFormField] = useState({ Email: "", Password: "" });
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const onFocusEmail = () => setFocusEmail(true);
  const onBlurEmail = () => setFocusEmail(false);

  const onFocusPassword = () => setFocusPassword(true);
  const onBlurPassword = () => setFocusPassword(false);
  const [loading, setLoading] = useState<boolean>(false);

  const submit = async () => {
    if (!formField.Email || !formField.Password) {
      return Alert.alert("Error", "Please fill in all fields");
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        formField.Email,
        formField.Password
      )
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user)
          router.replace("/Home");
        })
        .catch((error) => {
          const errorMessage = error.message;
          Alert.alert("Please check your email and password " + errorMessage);
        });
    } catch (e) {
      Alert.alert("error of signin" + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: 20,
          }}
        >
          <ThemedView
            className="w-full flex px-4"
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
                Log in to Dog Farm
              </ThemedText>
            </ThemedView>
            <ThemedView className="mt-4">
              <ThemedText className=" text-gray-200 m-2 text-xl">
                Email
              </ThemedText>
              <ThemedText
                className={`w-full h-16 px-4  rounded-2xl border-2 flex flex-row items-center ${
                  focusEmail ? "border-[#FF9C01]" : "border-[#232533]"
                }`}
              >
                <TextInput
                  onFocus={onFocusEmail}
                  onBlur={onBlurEmail}
                  className="flex-1 w-full py-4 text-white font-psemibold text-base"
                  placeholder="Email"
                  onChangeText={(e) => setFormField({ ...formField, Email: e })}
                  placeholderTextColor="#7B7B8B"
                />
              </ThemedText>
            </ThemedView>
            <ThemedView className="mt-4">
              <ThemedText className="text-gray-200 m-2 text-xl">
                Password
              </ThemedText>
              <ThemedView
                className={`w-full h-16 px-4  rounded-2xl border-2 flex flex-row items-center ${
                  focusPassword ? "border-[#FF9C01]" : "border-[#232533]"
                }`}
              >
                <TextInput
                  onFocus={onFocusPassword}
                  onBlur={onBlurPassword}
                  value={formField.Password}
                  className="flex-1 w-full text-white font-psemibold text-base"
                  placeholder="Password"
                  placeholderTextColor="#7B7B8B"
                  secureTextEntry
                  onChangeText={(e) =>
                    setFormField({ ...formField, Password: e })
                  }
                />
              </ThemedView>
            </ThemedView>
            <ThemedView className="flex flex-row justify-end w-full mt-4  ">
              <ThemedText className="text-white text-lg">
                Don't have account,
              </ThemedText>
              <Link
                href="/api/(authens)/sign-up"
                className="font-bold text-[#FF9C01] text-lg"
              >
                {" "}
                Create Account
              </Link>
            </ThemedView>
            <CustomButton
              isLoading={loading}
              title={loading ? "..." : "Login"}
              handlePress={submit}
              containerStyles="w-full mt-7 px-4"
            />
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
