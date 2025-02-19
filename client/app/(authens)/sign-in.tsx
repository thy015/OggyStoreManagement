import {
  ScrollView,
  Dimensions,
  TextInput,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import React, { useState } from 'react';
import { Link, useLocalSearchParams, useRouter} from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {UserIcon} from 'lucide-react-native'
import { Button, ButtonText } from '@/components/ui/button';
import Spinner from '@/components/spinner';
import { authensAPI } from '../apis/authens';

const SignIn = () => {
  const auth = getAuth();
  const router=useRouter();
  const [formField, setFormField] = useState({ Email: '', Password: '' });
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  //auto fill 
  const { email, password } = useLocalSearchParams();

  React.useEffect(() => {
    if (email || password) {
      setFormField({
        Email: Array.isArray(email) ? email[0] : email || '',
        Password: Array.isArray(password) ? password[0] : password || '',
      });
    }
  }, [email, password]);

  const submit = async () => {
    if (!formField.Email || !formField.Password) {
      return Alert.alert('Error', 'Please fill in all fields');
    }
    setLoading(true)
    try {
      const response = await authensAPI.signIn(formField.Email, formField.Password) as { status: number };
      if (response.status === 200) {
        router.push('./(tabs)/Home');
      }
      else{
        Alert.alert('Check your email and password');
      }
    } catch (e) {
      Alert.alert('error of signin' + e);
    } finally{
      setLoading(false)
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
                className={`w-[90%] h-16 px-4  rounded-2xl border flex flex-row items-center ${
                  focusEmail ? 'border-purple' : 'border-[#e1e2ef]'
                }`}
              >
                <UserIcon color={'#a294f9'} className="w-6 h-6"/>
                <TextInput
                  onFocus={()=>setFocusEmail(true)}
                  onBlur={()=>setFocusEmail(false)}
                  className="flex-1 w-full py-4 ml-4 text-black text-base"
                  placeholder="Email"
                  onChangeText={(e) => setFormField({ ...formField, Email: e })}
                  placeholderTextColor="#7B7B8B"
                />
              </ThemedView>
            </ThemedView>

            <ThemedView className="mt-8 items-center">
              <ThemedView
                className={`w-[90%] h-16 px-4  rounded-2xl border flex flex-row items-center ${
                  focusPassword ? 'border-purple' : 'border-[#e1e2ef]'
                }`}
              >
                 <UserIcon color={'#a294f9'} className="w-6 h-6"/>
                <TextInput
                  onFocus={()=>setFocusPassword(true)}
                  onBlur={()=>setFocusPassword(false)}
                  value={formField.Password}
                  className="flex-1 w-full ml-4 text-black text-base"
                  placeholder="Password"
                  placeholderTextColor="#7B7B8B"
                  secureTextEntry
                  onChangeText={(e) =>
                    setFormField({ ...formField, Password: e })
                  }

                />
              </ThemedView>
            </ThemedView>
            <ThemedView className="items-center justify-center mt-6 flex">
              {loading && <Spinner />}
              <Button style={{
                  width: '90%', 
                  height: 50, 
                  borderRadius: 10, 
                  backgroundColor: '#a294f9', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                }}
                onPress={submit}
                >
                <ButtonText className="text-white text-lg">SIGN IN</ButtonText>
              </Button>

              <Link
                href="./(authens)/sign-up"
                className="text-[#8a8a91] text-md mt-6 font-semibold"
              >
                {' '}
                FORGOT PASSWORD? 
              </Link>
            </ThemedView>
            
            <ThemedView className="items-center justify-center mt-6 flex flex-row">
                <Text className="text-[#8a8a91] text-md font-semibold mr-3">Don't have an account?</Text>
                <Link
                  href="./(authens)/sign-up"
                  className="text-[#a294f9] text-md font-semibold underline"
                >
                  {' '}
                  SIGN UP
                </Link>
            </ThemedView>
            <ThemedView className="flex items-center relative w-full h-fit opacity-[0.5] mt-4">
              <Image source={require('@/assets/images/money-investment.png')}
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

export default SignIn;
