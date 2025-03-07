import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Avatar, AvatarImage } from './ui/avatar';
import { LogOut } from 'lucide-react-native';
import { getAuth, signOut } from '@firebase/auth';
import { isIOS } from '@/utils';

const CustomHeader: React.FC = () => {
  const handleSignOut = async () => {
    try {
      await signOut(getAuth());
      Alert.alert('Successfully sign out');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <View style={styles.header}>
      <View className="flex justify-between flex-row py-3 px-12 items-center mt-10">
        <View className="flex flex-col">
          <Text className="text-[#bbbbbb] font-inriaRegular text-lg">
            Welcome,
          </Text>
          <View className="flex flex-row items-center">
            <Text className="text-2xl text-purpleDark font-inriaBold mr-3">
              Thy
            </Text>
            {/* Sign-out */}
            <LogOut
              size={24}
              color="#bbbbbb"
              onPress={handleSignOut}
              className="cursor-pointer"
            />
          </View>
        </View>
        <View className="flex flex-row items-center">
          <Avatar size="lg" className="ml-4">
            <AvatarImage source={require('@/assets/images/avatar.png')} />
          </Avatar>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height : isIOS ? 100 : 110,
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D8',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomHeader;