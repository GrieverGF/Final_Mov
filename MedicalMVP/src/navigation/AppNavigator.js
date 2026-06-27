import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RegistroControlScreen from '../screens/RegistroControlScreen';
import HistorialPacienteScreen from '../screens/HistorialPacienteScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#007bff' }, headerTintColor: '#fff' }}>
        {user == null ? (
          // Rutas no autenticadas
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          // Rutas autenticadas
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Inicio' }} />
            <Stack.Screen name="RegistroControl" component={RegistroControlScreen} options={{ title: 'Nuevo Control' }} />
            <Stack.Screen name="HistorialPaciente" component={HistorialPacienteScreen} options={{ title: 'Historial Clínico' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
