import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { useToken } from "@/context/TokenContext";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { userData } = useToken();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="(inicio)"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="home-filled" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person-search" color={color} />
          ),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="MyProfile"
        options={{
          title: userData?.username || "Mi Perfil", //Así el encabezado de dMyProfile depende del nombre del usuario
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="account-circle" color={color} />
          ),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: userData?.username || "logout", //Así el encabezado de dMyProfile depende del nombre del usuario
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="account-circle" color={color} />
          ),
          headerShown: true,
        }}
      />
    </Tabs>
  );
}
