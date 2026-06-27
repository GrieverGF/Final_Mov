import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = () => {
    if (username && password) {
      login(username, password);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controles Médicos Rurales</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity 
          style={[styles.button, (!username || !password) && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading || !username || !password}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#e9ecef' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#343a40' },
  formContainer: { backgroundColor: '#fff', padding: 30, borderRadius: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  input: { height: 60, borderColor: '#ced4da', borderWidth: 1, borderRadius: 8, marginBottom: 20, paddingHorizontal: 15, fontSize: 18 },
  button: { backgroundColor: '#28a745', padding: 20, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#6c757d' },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' }
});
