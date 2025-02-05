import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { PanGestureHandler } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FIREBASE_DB } from "../../config/firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";

const Home: React.FC = () => {
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageURI, setImageURI] = useState<string>("");
  const [textImage, setTextImage] = useState<string>("");
  const [isImageFullScreen, setIsImageFullScreen] = useState<Boolean>(false);

  const toggleImageView = () => {
    setIsImageFullScreen(!isImageFullScreen);
  };

  const acceptImage = async () => {
    try {
      const docRef = await addDoc(collection(FIREBASE_DB, "TextImage"), {
        text: textImage,
        image: imageURI,
      });
      console.log("Send data to firebase success", docRef.id);
      setImage("");
      setTextImage("");
      setImageURI("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const sendImage = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    if (image) {
      formData.append("file", {
        uri: image,
        name: "uploaded_image.jpg",
        type: "image/jpeg",
      } as any);
    }

    try {
      const response = await fetch(`http://192.168.106.117:3000/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setImageURI(data.url);
        console.log("Uploaded image URL:", data.url);
      } else {
        console.error("Error uploading image:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (imageURI) {
      (async () => {
        try {
          await processingChange();
        } catch (error) {
          console.error("Error in processingChange:", error);
        }
      })();
    }
  }, [imageURI]);

  const processingChange = async () => {
    if (image) {
      try {
        while (true) {
          const response = await fetch(
            `http://192.168.106.117:3000/Image_To_Text`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                image: imageURI,
              }),
            }
          );
          const data = await response.json();

          if (response.ok) {
            setTextImage(data.text || "No text found");
            setImage("");
            setLoading(false);
            break;
          }
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    }
  };

  const pickImage = async () => {
    setTextImage("");
    setImageURI("");
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
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
    setTextImage("");
    setImageURI("");
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
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

  return (
    <GestureHandlerRootView style={{ flex: 1, height: "100%" }}>
      <PanGestureHandler>
        <View className="w-full h-full relative">
          <SafeAreaView className="w-full flex-1 h-full ">
            <ScrollView className="overflow-y-auto w-full">
              {image && isImageFullScreen && (
                <TouchableOpacity
                  onPress={toggleImageView}
                  activeOpacity={0.7}
                  className="absolute top-11 ml-2 z-20"
                >
                  <FontAwesome name="close" size={30} color="white" />
                </TouchableOpacity>
              )}
              {isImageFullScreen && (
                <View className="w-full h-full">
                  <TouchableOpacity onPress={toggleImageView} className="mb-3">
                    <Image
                      source={{ uri: image }}
                      style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "contain",
                        marginBottom: 10,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {textImage ? (
                <View className="w-full h-full px-2">
                  <Text className="text-white font-bold text-2xl mb-3 text-center">
                    BILL
                  </Text>
                  <Text className="text-yellow-400 px-2 pl-4 text-xl">
                    {textImage}
                  </Text>
                </View>
              ) : (
                <View className="w-full h-[80vh] flex justify-center items-center">
                  <Text className=" text-yellow-400 text-3xl">
                    WELCOME DOGGY APP
                  </Text>
                </View>
              )}
              {loading && (
                <View className="w-full h-screen  flex-1 justify-center items-center">
                  <ActivityIndicator size="large" color="#ffffff" />
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
          {!isImageFullScreen && (
            <View className="absolute bottom-1 w-full px-1 h-fit z-0">
              <View className="bg-[#161622] z-0 w-full py-4 rounded-xl flex justify-end border border-black">
                {image && (
                  <TouchableOpacity onPress={toggleImageView} className="mb-3">
                    <Image
                      source={{ uri: image }}
                      style={{
                        width: "100%",
                        height: 200,
                        resizeMode: "contain",
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
                    <FontAwesome name="camera" size={30} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={pickImage}
                    activeOpacity={0.7}
                    className="ml-auto"
                  >
                    <AntDesign name="pluscircleo" size={30} color="white" />
                  </TouchableOpacity>

                  {image && (
                    <TouchableOpacity
                      onPress={() => setImage("")}
                      activeOpacity={0.7}
                      className="ml-auto mr-5"
                    >
                      <FontAwesome name="close" size={30} color="white" />
                    </TouchableOpacity>
                  )}
                  {textImage && (
                    <TouchableOpacity
                      onPress={() => setTextImage("")}
                      activeOpacity={0.7}
                      className="ml-auto mr-5"
                    >
                      <FontAwesome name="close" size={30} color="white" />
                    </TouchableOpacity>
                  )}
                  {textImage ? (
                    <TouchableOpacity
                      onPress={acceptImage}
                      activeOpacity={0.7}
                      className="ml-auto mr-6"
                    >
                      <AntDesign name="check" size={32} color="white" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={sendImage}
                      activeOpacity={0.7}
                      className="ml-auto mr-6"
                    >
                      <FontAwesome name="send" size={30} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default Home;
