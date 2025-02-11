import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

const History = () => {
  const [loading, setLoading] = React.useState(true);
  return (
    <View>
      {loading && (
        <View className="w-full h-screen  flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#e80707" />
        </View>
      )}
      <Text>History</Text>
    </View>
  );
};

export default History;
