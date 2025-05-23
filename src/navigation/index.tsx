import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import TabNavigator from './TabNavigator';
import ShoppingResultsScreen from '../screens/ShoppingResultsScreen';
import OSINTResultsScreen from '../screens/OSINTResultsScreen';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen 
          name="ShoppingResults" 
          component={ShoppingResultsScreen} 
          options={{
            gestureEnabled: true,
            animationEnabled: true,
          }}
        />
        <Stack.Screen 
          name="OSINTResults" 
          component={OSINTResultsScreen}
          options={{
            gestureEnabled: true,
            animationEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator; 