import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { FontAwesome5 } from '@expo/vector-icons';
import { Swords } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeColor = '#FF0055';
  const inactiveColor = isDark ? '#8A8A93' : '#A0A0A0';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 30 : 20,
          left: 20,
          right: 20,
          backgroundColor: '#FFFFFF',
          borderRadius: 30,
          height: 70,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          borderTopWidth: 0.5,
          elevation: 30,
          shadowColor: '#000000ff',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 1,
          shadowRadius: 20,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 'bold',
          marginTop: 4,
        }
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 size={focused ? 26 : 24} name="map-marked-alt" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pvp"
        options={{
          title: 'Arena PvP',
          tabBarIcon: ({ color, focused }) => (
            <Swords size={focused ? 28 : 24} color={color} {...({ color: color } as any)} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 size={focused ? 26 : 24} name="user-alt" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
