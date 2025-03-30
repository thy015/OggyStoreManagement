import {
  ScrollView,
  Dimensions,
  TextInput,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserIcon } from 'lucide-react-native';
import { Button, ButtonText } from '@/components/ui/button';
import Spinner from '@/components/spinner';
import { z } from 'zod';
import { authensAPI } from '@/apis/authens';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const SignUp = () => {
  const [formField, setFormField] = useState({ Email: '', Password: '' });
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  //validate
  const SignUpSchema = z.object({
    Email: z.string().email('Invalid email'),
    Password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  const submit = async () => {
    if (!formField.Email || !formField.Password) {
      if (Platform.OS === 'web') {
        window.alert('Error: Missing email or password');
        console.log('click');
      } else {
        return Alert.alert('Error: Missing email or password');
      }
    }
    try {
      // Validate input bằng Zod
      SignUpSchema.parse(formField);
      setLoading(true);

      const user = await authensAPI.signUp(formField.Email, formField.Password);
      console.log('Sign-up response:', user);

      if (Platform.OS === 'web') {
        window.alert('Sign-up successful');
      } else {
        Alert.alert('Sign-up successful');
      }
      router.replace('/(authens)/sign-in');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        Alert.alert('Validation Error', error.errors[0].message);
      } else {
        if (Platform.OS === 'web') {
          window.alert(error.message || 'Please check your email and password');
        } else {
          Alert.alert('Error: {0}', error.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className=" h-full overflow-y-auto"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
        >
          <ThemedView
            className="w-full flex px-4"
            style={{
              minHeight: Dimensions.get('window').height,
              justifyContent:
                focusEmail || focusPassword ? 'flex-start' : 'center',
            }}
          >
            <ThemedView className="ml-2">
              <ThemedView className="flex items-center relative w-full h-fit my-20">
                <Text className="text-6xl font-inriaRegular mt-6 text-purpleDark">
                  Oggy
                </Text>
                <Text className="text-3xl font-inriaRegular mt-2 text-purpleDark">
                  Financial Mangement
                </Text>
              </ThemedView>
            </ThemedView>

            <ThemedView className="mt-8 items-center">
              <ThemedView
                id="email-signup"
                className={`w-[90%] h-16 px-4  rounded-2xl border flex flex-row items-center ${
                  focusEmail ? 'border-purple' : 'border-[#e1e2ef]'
                }`}
              >
                <UserIcon color={'#a294f9'} className="w-6 h-6" />
                <TextInput
                  id="email-signup-input"
                  onFocus={() => setFocusEmail(true)}
                  onBlur={() => setFocusEmail(false)}
                  className="flex-1 w-full py-4 ml-4 text-black text-base"
                  placeholder="Email"
                  onChangeText={(e) => setFormField({ ...formField, Email: e })}
                  placeholderTextColor="#7B7B8B"
                />
              </ThemedView>
            </ThemedView>

            <ThemedView className="mt-8 items-center">
              <ThemedView
                id="password-signup"
                className={`w-[90%] h-16 px-4 rounded-2xl border flex flex-row items-center ${focusPassword ? 'border-purple' : 'border-[#e1e2ef]'}`}
              >
                <MaterialIcons
                  name="password"
                  className="w-6 h-6"
                  color={'#a294f9'}
                />
                <TextInput
                  id="password-signup-input"
                  onFocus={() => setFocusPassword(true)}
                  onBlur={() => setFocusPassword(false)}
                  className="flex-1 w-full py-4 ml-4 text-black text-base"
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={(e) =>
                    setFormField({ ...formField, Password: e })
                  }
                  placeholderTextColor="#7B7B8B"
                />
              </ThemedView>
            </ThemedView>
            <ThemedView className="items-center justify-center mt-6 flex">
              {loading && <Spinner />}
              <Button
                id="signup-button"
                style={{
                  width: '90%',
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: '#a294f9',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={submit}
              >
                <ButtonText className="text-white text-lg">SIGN UP</ButtonText>
              </Button>
            </ThemedView>

            <ThemedView className="items-center justify-center mt-6 flex flex-row">
              <Text className="text-[#8a8a91] text-md font-semibold mr-3">
                Already have an account?
              </Text>
              <Link
                href="/(authens)/sign-in"
                className="text-[#a294f9] text-md font-semibold underline"
              >
                {' '}
                SIGN IN
              </Link>
            </ThemedView>
            <ThemedView className="flex items-center relative w-full h-fit opacity-[0.5] mt-4">
              <Image
                source={require('@/assets/images/money-investment.png')}
                className="h-48 items-center justify-center flex"
                resizeMode="contain"
              />
            </ThemedView>
            <ThemedView className="flex items-center relative w-full h-fit mt-7">
              <Text className="text-2xl font-inriaRegular mt-6 text-purple opacity-[0.8]">
                EST. 2025
              </Text>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
