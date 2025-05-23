import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../types';
import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import ShoppingScreen from '../screens/ShoppingScreen';
import OSINTScreen from '../screens/OSINTScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarLabelStyle: FONTS.body2,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="Shopping"
        component={ShoppingScreen}
        options={{
          tabBarLabel: 'Shopping',
          headerTitle: 'AI Shopping Search',
          headerTitleStyle: FONTS.h2,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTitleAlign: 'center',
          headerTintColor: COLORS.white,
        }}
      />
      <Tab.Screen
        name="OSINT"
        component={OSINTScreen}
        options={{
          tabBarLabel: 'OSINT',
          headerTitle: 'OSINT Search',
          headerTitleStyle: FONTS.h2,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTitleAlign: 'center',
          headerTintColor: COLORS.white,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator; 