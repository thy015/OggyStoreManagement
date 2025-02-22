import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
const AuthLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f8f8f8' },
          headerTintColor: '#333',
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
