import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react"

const StackLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#333",
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="DetailReceipt" options={{ headerShown: true }} />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default StackLayout;
