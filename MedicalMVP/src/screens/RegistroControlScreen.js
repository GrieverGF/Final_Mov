import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../services/api';

export default function RegistroControlScreen({ navigation }) {
  const [pacienteId, setPacienteId] = useState('');
  const [presionArterial, setPresionArterial] = useState('');
  const [peso, setPeso] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!pacienteId || !presionArterial || !peso || !temperatura) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        pacienteId,
        fecha: new Date().toISOString(),
        presionArterial,
        peso,
        temperatura,
        observaciones
      };
      
      const response = await api.post('/controles', payload);
      
      if (response.status === 201) {
        Alert.alert('Éxito', 'Control médico registrado correctamente');
        // Limpiar formulario
        setPacienteId(''); setPresionArterial(''); setPeso(''); setTemperatura(''); setObservaciones('');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el control.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nuevo Control Médico</Text>
      
      <TextInput style={styles.input} placeholder="ID del Paciente *" value={pacienteId} onChangeText={setPacienteId} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Presión Arterial (ej. 120/80) *" value={presionArterial} onChangeText={setPresionArterial} />
      <TextInput style={styles.input} placeholder="Peso (kg) *" value={peso} onChangeText={setPeso} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Temperatura (°C) *" value={temperatura} onChangeText={setTemperatura} keyboardType="numeric" />
      
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Observaciones" 
        value={observaciones} 
        onChangeText={setObservaciones} 
        multiline={true} 
        numberOfLines={4} 
      />

      <TouchableOpacity style={styles.button} onPress={handleGuardar} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar Control'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 30, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  input: { height: 60, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 20, paddingHorizontal: 15, fontSize: 18 },
  textArea: { height: 120, textAlignVertical: 'top', paddingTop: 15 },
  button: { backgroundColor: '#007bff', padding: 20, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' }
});
