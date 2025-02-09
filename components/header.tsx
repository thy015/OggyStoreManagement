import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, AvatarImage } from './ui/avatar';

const CustomHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>My Custom Header</Text>
      <View className='flex justify-between flex-row py-3 px-12 items-center'>
        <View className='flex flex-col'>
        <Text className='text-[#bbbbbb] font-inriaRegular'>Welcome,</Text>
        <Text className='text-2xl text-purpleDark font-inriaBold'>Thy</Text>
        </View>
        <Avatar size='lg'>
            <AvatarImage
             source={require('@/assets/images/avatar.png')}
            />
        </Avatar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 100,
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