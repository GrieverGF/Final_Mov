import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function RegistroPacienteScreen({ navigation }) {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [genero, setGenero] = useState('Masculino');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [comunidad, setComunidad] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async () => {
    if (!cedula.trim() || !nombre.trim() || !apellido.trim() || !comunidad.trim()) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios (*).');
      return;
    }

    setCargando(true);
    try {
      const response = await api.post('/pacientes', {
        cedula: cedula.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        fecha_nacimiento: fechaNacimiento.trim() || null,
        genero,
        direccion: direccion.trim() || null,
        telefono: telefono.trim() || null,
        comunidad: comunidad.trim(),
      });

      Alert.alert('Éxito', 'Paciente registrado correctamente.', [
        { text: 'Aceptar', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || 'No se pudo registrar al paciente.';
      Alert.alert('Error', msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Nuevo Paciente</Text>
      <Text style={styles.subtitle}>Brigada Médica de Campo</Text>

      <Text style={styles.label}>Cédula / ID *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 1098765432"
        value={cedula}
        onChangeText={setCedula}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Nombre *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: María Clara"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Apellido *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Restrepo Alzate"
        value={apellido}
        onChangeText={setApellido}
      />

      <Text style={styles.label}>Comunidad / Vereda *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Vereda El Carmen"
        value={comunidad}
        onChangeText={setComunidad}
      />

      <Text style={styles.label}>Género</Text>
      <View style={styles.genderContainer}>
        {['Masculino', 'Femenino', 'Otro'].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.genderButton, genero === g && styles.genderButtonActive]}
            onPress={() => setGenero(g)}
          >
            <Text style={[styles.genderText, genero === g && styles.genderTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Fecha de Nacimiento (AAAA-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 1985-11-20"
        value={fechaNacimiento}
        onChangeText={setFechaNacimiento}
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 3124567890"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Dirección / Finca</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ej: Finca San Luis, sector bajo"
        value={direccion}
        onChangeText={setDireccion}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleRegistro} disabled={cargando}>
        {cargando ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Guardar Paciente</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#343a40', textAlign: 'center', marginTop: 10 },
  subtitle: { fontSize: 14, color: '#6c757d', textAlign: 'center', marginBottom: 25 },
  label: { fontSize: 16, fontWeight: '600', color: '#495057', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 8, padding: 12, marginBottom: 18, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  genderContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  genderButton: { flex: 1, backgroundColor: '#e9ecef', padding: 12, borderRadius: 8, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#dee2e6' },
  genderButtonActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  genderText: { fontSize: 14, color: '#495057', fontWeight: 'bold' },
  genderTextActive: { color: '#fff' },
  submitButton: { backgroundColor: '#28a745', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 15, marginBottom: 30 },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
