import { View, Text, Button } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const DetailHis = () => {
  const toggleDetailhis = () => {
    router.push({
      pathname: '/(tabs)/History',
      params: { check: 'false' },
    });
  };

  return (
    <View>
      <Text>DetailHis</Text>
      <Button title="Back" onPress={toggleDetailhis} />
    </View>
  );
};

export default DetailHis;
