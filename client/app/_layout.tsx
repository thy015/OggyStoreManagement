import {
  ThemeProvider,
} from "@react-navigation/native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CustomDarkTheme, CustomDefaultTheme } from "@/config/themeConfig";
import { Provider } from "react-redux";
import { reduxStore } from "@/redux/store/store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Inria-Bold': require('@/assets/fonts/InriaSerif-Bold.ttf'),
    'Inria-Light': require('@/assets/fonts/InriaSerif-Light.ttf'),
    'Inria-Regular': require('@/assets/fonts/InriaSerif-Regular.ttf'),
    'Oswald-Regular': require('@/assets/fonts/Oswald-Regular.ttf'),
    'Oswald-Light': require('@/assets/fonts/Oswald-Light.ttf'),
    Poppins: require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Light': require('@/assets/fonts/Poppins-Light.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
 <Provider store={reduxStore}>
    <GluestackUIProvider mode="light"><ThemeProvider value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#f8f8f8" },
            headerTintColor: "#333",
            headerShown: false,
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(authens)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider></GluestackUIProvider>
</Provider>
  );
}
