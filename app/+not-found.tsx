import { Stack, Link } from "expo-router";
import { Button, StyleSheet } from "react-native";
import React from "react"
import { Image } from "react-native";
import { ThemedText } from "@/app/components/ThemedText";
import { ThemedView } from "@/app/components/ThemedView";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <Image
          source={require('@/assets/icons/404-page-not-found.svg')}
        />
        <Link href="/" style={styles.link}>
          <Button title="Go to home" /> 
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
