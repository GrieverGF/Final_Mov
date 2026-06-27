import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { user, role, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bienvenido, {user}</Text>
      <Text style={styles.roleText}>Rol: {role}</Text>

      <View style={styles.buttonContainer}>
        {/* Botones para ambos roles */}
        <TouchableOpacity style={styles.button} onPress={() => {/* Navegar a Registrar Paciente */}}>
          <Text style={styles.buttonText}>Registrar Paciente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RegistroControl')}>
          <Text style={styles.buttonText}>Nuevo Control Médico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HistorialPaciente')}>
          <Text style={styles.buttonText}>Historial Clínico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => {/* Sincronizar / Refrescar */}}>
          <Text style={styles.buttonText}>Sincronizar / Refrescar</Text>
        </TouchableOpacity>

        {/* Botón exclusivo para Administradores */}
        {role === 'Administrador' && (
          <TouchableOpacity style={[styles.button, styles.adminButton]} onPress={() => {/* Ir a Configuración */}}>
            <Text style={styles.buttonText}>Configuración</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  roleText: { fontSize: 18, color: '#666', marginBottom: 30, textAlign: 'center' },
  buttonContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: { backgroundColor: '#007bff', padding: 20, borderRadius: 10, marginBottom: 15, width: '80%', alignItems: 'center' },
  adminButton: { backgroundColor: '#dc3545' },
  logoutButton: { backgroundColor: '#6c757d', padding: 20, borderRadius: 10, width: '80%', alignSelf: 'center', alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
