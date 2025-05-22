// Importaciones principales de React y navegación
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Íconos para las pestañas

// Importación de las pantallas principales del proyecto
import APODScreen from '../presentation/screens/APODScreen';
import EPICScreen from '../presentation/screens/EPICScreen';
import NASALibraryScreen from '../presentation/screens/NASALibraryScreen';
import NASADetailScreen from '../presentation/screens/NASADetailScreen';
import AsteroidsScreen from '../presentation/screens/AsteroidsScreen';
import AsteroidDetailScreen from '../presentation/screens/AsteroidDetailScreen';
import TechTransferScreen from '../presentation/screens/TechTransferScreen';
import RegisterScreen from '../presentation/screens/RegisterScreen';

// Instanciamos los navegadores: tabs inferiores y stack general
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Componente que representa las pestañas inferiores
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Asignamos un ícono diferente según la ruta
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === 'APOD' ? 'images' :
            route.name === 'EPIC' ? 'globe' :
            route.name === 'Library' ? 'albums' :
            route.name === 'Asteroids' ? 'planet' :
            route.name === 'TechTransfer' ? 'construct' :
            route.name === 'Registro' ? 'person-add' :
            'alert'; // fallback en caso de error

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        headerShown: false, // Ocultamos encabezado de cada tab
      })}
    >
      {/* Cada pestaña representa un módulo principal */}
      <Tab.Screen name="APOD" component={APODScreen} />
      <Tab.Screen name="EPIC" component={EPICScreen} />
      <Tab.Screen name="Library" component={NASALibraryScreen} />
      <Tab.Screen name="Asteroids" component={AsteroidsScreen} />
      <Tab.Screen name="TechTransfer" component={TechTransferScreen} />
      <Tab.Screen name="Registro" component={RegisterScreen} />
    </Tab.Navigator>
  );
}

// Componente principal que contiene el contenedor de navegación
const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          ...TransitionPresets.FadeFromBottomAndroid, // Animación predeterminada
          gestureEnabled: true, // Permitir gesto para volver
        }}
      >
        {/* Pantalla principal con pestañas */}
        <Stack.Screen name="Home" component={Tabs} />

        {/* Pantalla de detalle para imágenes NASA */}
        <Stack.Screen
          name="Detail"
          component={NASADetailScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS, // animación tipo modal
          }}
        />

        {/* Pantalla de detalle para asteroides */}
        <Stack.Screen
          name="AsteroidDetail"
          component={AsteroidDetailScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS, // animación tipo modal
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Exportamos el navegador principal
export default MainNavigator;
