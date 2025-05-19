import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import APODScreen from '../presentation/screens/APODScreen';
import EPICScreen from '../presentation/screens/EPICScreen';
import NASALibraryScreen from '../presentation/screens/NASALibraryScreen';
import NASADetailScreen from '../presentation/screens/NASADetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Tabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const iconName =
          route.name === 'APOD' ? 'images' :
          route.name === 'EPIC' ? 'globe' : 'albums';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="APOD" component={APODScreen} />
    <Tab.Screen name="EPIC" component={EPICScreen} />
    <Tab.Screen name="Library" component={NASALibraryScreen} />
  </Tab.Navigator>
);

const MainNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="Detail" component={NASADetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default MainNavigator;
