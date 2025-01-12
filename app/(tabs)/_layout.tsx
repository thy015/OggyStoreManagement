import { StatusBar } from "expo-status-bar";
import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";

// Định nghĩa type cho TabIcon props
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
        marginTop: 6,
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
      className="w-32 pt-4"
    >
      {React.isValidElement(icon) ? (
        icon
      ) : (
        <Image
          source={icon}
          resizeMode="contain"
          style={{ width: 24, height: 24, tintColor: color }}
        />
      )}
      <Text
        style={{
          color: color,
          fontSize: 12,
          fontWeight: focused ? "600" : "400",
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout: React.FC = () => {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1, position: "relative" }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#FFA001",
            tabBarInactiveTintColor: "#CDCDE0",
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: "#161622",
              borderTopWidth: 1,
              borderTopColor: "#232533",
              height: 75,
            },
          }}
        >
          <Tabs.Screen
            name="Home"
            options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={require("../../components/Icons/home.png")}
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
              title: "History",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={require("../../components/Icons/clock.png")}
                  color={color}
                  name="History"
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="Infor"
            options={{
              title: "Infor",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={require("../../components/Icons/profile.png")}
                  color={color}
                  name="Infor"
                  focused={focused}
                />
              ),
            }}
          />
        </Tabs>
        <StatusBar backgroundColor="#161622" style="light" />
      </GestureHandlerRootView>
    </>
  );
};

export default TabLayout;
