import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Screens
import APODScreen from '../presentation/screens/APODScreen';
import EPICScreen from '../presentation/screens/EPICScreen';
import NASALibraryScreen from '../presentation/screens/NASALibraryScreen';
import NASADetailScreen from '../presentation/screens/NASADetailScreen';
import AsteroidsScreen from '../presentation/screens/AsteroidsScreen';
import AsteroidDetailScreen from '../presentation/screens/AsteroidDetailScreen';
import TechTransferScreen from '../presentation/screens/TechTransferScreen';
import RegisterScreen from '../presentation/screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === 'APOD' ? 'images' :
            route.name === 'EPIC' ? 'globe' :
            route.name === 'Library' ? 'albums' : 'planet';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="APOD" component={APODScreen} />
      <Tab.Screen name="EPIC" component={EPICScreen} />
      <Tab.Screen name="Library" component={NASALibraryScreen} />
      <Tab.Screen name="Asteroids" component={AsteroidsScreen} />
      <Tab.Screen name="TechTransfer" component={TechTransferScreen} />
      <Tab.Screen name="Registro" component={RegisterScreen} />
    </Tab.Navigator>
  );
}

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={NASADetailScreen} />
        <Stack.Screen name="AsteroidDetail" component={AsteroidDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
