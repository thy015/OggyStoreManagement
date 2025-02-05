import React from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { ThemedText } from "@/app/components/ThemedText";

type Props = {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading: boolean;
};

const CustomButton: React.FC<Props> = ({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-[#fdab40] min-h-[62px] rounded-xl justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <ThemedText className={`font-semibold text-lg ${textStyles}`}>
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
