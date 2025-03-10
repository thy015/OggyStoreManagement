import { useState } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-chart-kit';
import { Button, ButtonText } from '@/components/ui/button/index.tsx';
import ReceiptList from '@/components/receiptCard.tsx';
import { screenWidth } from '@/utils';
const Home = () => {

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // X-axis labels
    datasets: [
      {
        data: [50, 70, -80, 90, 60, 100], // Y-axis values
      },
    ],
  };
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
                  <Text className="text-2xl mb-3 text-center text-[#e7e4e4bab]">
                   [ Monthly Paying - Year 2024 ]
                  </Text>
               
                  <BarChart
                    data={data}
                    width={screenWidth - 50} // Responsive width
                    height={250}
                    yAxisLabel=""
                    yAxisSuffix=" VND"
                    chartConfig={{
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: (opacity = 0.8) => `rgba(180, 141, 255, ${opacity})`,
                      labelColor:  (opacity = 1) =>
                        `rgba(128, 128, 128, ${opacity})`,
                    }}
                    style={{
                      marginVertical: 10,
                      borderRadius: 5,
                    }}
                    fromZero
                    showValuesOnTopOfBars // Shows values on top
                  />
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
