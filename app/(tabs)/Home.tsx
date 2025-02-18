import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-gifted-charts';
import { Button, ButtonText } from '@/components/ui/button/index.tsx';
import ReceiptList from '@/components/receiptCard.tsx';
const Home = () => {
  const data = [
    { value: 50, label: 'Jan' },
    { value: 10, label: 'Feb' },
    { value: 90, label: 'Mar' },
    { value: 60, label: 'Apr' },
    { value: 80, label: 'May' },
    { value: 75, label: 'Jun' },
  ];
  const [loading, setLoading] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1, height: '100%' }}>
      <PanGestureHandler>
        <View className="w-full h-full relative">
          <SafeAreaView className="w-full flex-1 h-full ">
            <View className="w-full flex">
              {/* chart */}
              <View className="h-[310px] ml-4">
                <ScrollView>
                  <Text className="font-inriaBold text-2xl mb-3 text-center">
                    Monthly Paying - Year 2024
                  </Text>
                  {/* <BarChart
                    data={data}
                    barWidth={20} // Độ rộng của mỗi cột
                    height={200} // Chiều cao của biểu đồ
                    width={300} // Chiều rộng của biểu đồ
                    barBorderRadius={5} // Bo tròn góc cột
                    showGradient={true} // Hiệu ứng gradient
                    xAxisLabelTextStyle={{ color: 'gray' }} // Màu chữ trục X
                    yAxisTextStyle={{ color: 'gray' }} // Màu chữ trục Y
                    isAnimated={true} // Animation khi hiển thị
                    animationDuration={500} // Thời gian animation
                  /> */}
                </ScrollView>
              </View>

              <View className="bg-purpleLight h-full rounded-tl-[40px] rounded-tr-[40px] shadow-md">
                <View className="w-full h-full px-2 text-right mt-6 ml-3 flex flex-col">
                  {/* tool bar */}
                  <View className="flex flex-row">
                    <Button
                      style={{
                        width: '30%',
                        height: 50,
                        borderRadius: 10,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <ButtonText className="text-black text-sm font-roboto">
                        Change year
                      </ButtonText>
                    </Button>
                    <Button
                      style={{
                        width: '30%',
                        height: 50,
                        borderRadius: 10,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10,
                      }}
                    >
                      <ButtonText className="text-black text-sm font-roboto text-center">
                        View total income
                      </ButtonText>
                    </Button>

                    <Button
                      style={{
                        width: '30%',
                        height: 50,
                        borderRadius: 10,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10,
                      }}
                    >
                      <ButtonText className="text-black text-sm font-roboto text-center">
                        ...
                      </ButtonText>
                    </Button>
                  </View>
                  {/* display 10 recent cards */}

                  <View>
                    <ReceiptList />
                  </View>
                </View>
              </View>
            </View>
            {loading && (
              <View className="w-full h-screen  flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#ffffff" />
              </View>
            )}
          </SafeAreaView>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default Home;
