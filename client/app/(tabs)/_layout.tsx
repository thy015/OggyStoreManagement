import { StatusBar } from 'expo-status-bar';
import { Tabs } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { Receipt } from 'lucide-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomHeader from '@/components/header';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type TabIconProps = {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
};

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View
      style={{
        flexDirection: focused ? 'row' : 'column',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        justifyContent: 'center',
        position: 'absolute',
        borderRadius: 30,
        backgroundColor: focused ? 'white' : 'transparent',
        shadowColor: focused ? '#000' : 'transparent',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: focused ? 3 : 0,
        top: 3,
      }}
      className="w-32 pt-4"
    >
      {/* focus or not */}
      {React.isValidElement(icon) ? (
        icon
      ) : (
        <Image
          source={icon}
          resizeMode="contain"
          style={{ width: 24, height: 24, tintColor: color }}
        />
      )}
      {focused && (
        <Text
          style={{
            color: color,
            fontSize: 12,
            fontWeight: focused ? '600' : '400',
          }}
        >
          {name}
        </Text>
      )}
    </View>
  );
};

const TabLayout: React.FC = () => {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1, position: 'relative' }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#7a6fbb',
            tabBarInactiveTintColor: '#CDCDE0',
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: '#fdfdfd',
              borderTopWidth: 0,
              position: 'relative',
              height: 75,
              paddingBottom: 10,
              elevation: 10,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 10,
              marginTop: 10,
            },
          }}
        >
          <Tabs.Screen
            name="Home"
            options={{
              title: 'Home',
              header: () => <CustomHeader />,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={require('@/assets/icons/home.png')}
                  color={color}
                  name="Home"
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="History"
            options={{
              title: 'History',
              header: () => <CustomHeader />,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={require('@/assets/icons/clock.png')}
                  color={color}
                  name="History"
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="Receipt"
            options={{
              title: 'Receipt',
              header: () => <CustomHeader />,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={<AntDesign name="qrcode" size={24} color={color} />}
                  color={color}
                  name="Receipt"
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="Chat_Speech"
            options={{
              title: 'Chat_Speech',
              header: () => <CustomHeader />,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={
                    <MaterialCommunityIcons
                      name="wallet-plus"
                      size={24}
                      color={color}
                    />
                  }
                  color={color}
                  name="Chat"
                  focused={focused}
                />
              ),
            }}
          />

          {/* <Tabs.Screen
            name="Profile"
            options={{
              title: 'Profile',
              header: () => false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={require('@/assets/icons/profile.png')}
                  color={color}
                  name="Profile"
                  focused={focused}
                />
              ),
            }}
          /> */}
        </Tabs>
        <StatusBar backgroundColor="#161622" style="light" />
      </GestureHandlerRootView>
    </>
  );
};

export default TabLayout;
