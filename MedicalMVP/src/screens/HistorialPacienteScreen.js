import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';

export default function HistorialPacienteScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [controles, setControles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingControles, setLoadingControles] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Búsqueda', 'Por favor ingresa un nombre o cédula para buscar.');
      return;
    }
    
    setLoading(true);
    setSelectedPaciente(null);
    setControles([]);
    try {
      const response = await api.get(`/pacientes?search=${searchQuery.trim()}`);
      if (response.data && response.data.pacientes) {
        setPacientes(response.data.pacientes);
        if (response.data.pacientes.length === 0) {
          Alert.alert('Sin Resultados', 'No se encontraron pacientes que coincidan con la búsqueda.');
        }
      } else {
        setPacientes([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo buscar pacientes.');
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPaciente = async (paciente) => {
    setSelectedPaciente(paciente);
    setLoadingControles(true);
    try {
      const response = await api.get(`/pacientes/${paciente.id}`);
      if (response.data && response.data.paciente && response.data.paciente.controles) {
        setControles(response.data.paciente.controles);
      } else {
        setControles([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo cargar el historial del paciente.');
      setControles([]);
    } finally {
      setLoadingControles(false);
    }
  };

  const renderPacienteItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSelectPaciente(item)}>
      <Text style={styles.patientName}>{item.nombre} {item.apellido}</Text>
      <Text style={styles.patientInfo}>Cédula: {item.cedula} | Comunidad: {item.comunidad}</Text>
      <Text style={styles.patientControlsCount}>Controles Registrados: {item.total_controles || 0}</Text>
    </TouchableOpacity>
  );

  const renderControlItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.dateText}>Fecha: {new Date(item.fecha).toLocaleString()}</Text>
      <Text style={styles.infoText}>
        Presión: {item.presion_arterial} | Peso: {item.peso} kg | Temp: {item.temperatura} °C
      </Text>
      {item.observaciones ? (
        <Text style={styles.obsText}>Observaciones: {item.observaciones}</Text>
      ) : (
        <Text style={styles.noObsText}>Sin observaciones registradas.</Text>
      )}
      {item.profesional && (
        <Text style={styles.profText}>Registrado por: {item.profesional.nombre_completo}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedPaciente ? (
        <View style={{ flex: 1 }}>
          <View style={styles.selectedHeader}>
            <Text style={styles.selectedTitle}>{selectedPaciente.nombre} {selectedPaciente.apellido}</Text>
            <Text style={styles.selectedSub}>Cédula: {selectedPaciente.cedula} | {selectedPaciente.comunidad}</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => setSelectedPaciente(null)}>
              <Text style={styles.backButtonText}>← Volver al Listado</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.historyTitle}>Historial de Controles Médicos</Text>

          {loadingControles ? (
            <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 30 }} />
          ) : (
            <FlatList
              data={controles}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderControlItem}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Este paciente no tiene controles registrados aún.</Text>
              }
            />
          )}
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.searchContainer}>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Buscar por cédula o nombre..." 
              value={searchQuery} 
              onChangeText={setSearchQuery} 
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Buscar</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />
          ) : (
            <FlatList
              data={pacientes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderPacienteItem}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Ingresa un criterio de búsqueda para ver los resultados.</Text>
              }
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  searchContainer: { flexDirection: 'row', marginBottom: 20 },
  searchInput: { flex: 1, height: 50, borderColor: '#ced4da', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 18, backgroundColor: '#fff' },
  searchButton: { marginLeft: 10, backgroundColor: '#007bff', justifyContent: 'center', paddingHorizontal: 20, borderRadius: 8 },
  searchButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22 },
  patientName: { fontSize: 20, fontWeight: 'bold', color: '#343a40', marginBottom: 5 },
  patientInfo: { fontSize: 15, color: '#495057', marginBottom: 5 },
  patientControlsCount: { fontSize: 13, color: '#007bff', fontWeight: '600' },
  selectedHeader: { backgroundColor: '#e9ecef', padding: 15, borderRadius: 10, marginBottom: 20 },
  selectedTitle: { fontSize: 22, fontWeight: 'bold', color: '#212529' },
  selectedSub: { fontSize: 15, color: '#6c757d', marginBottom: 10 },
  backButton: { backgroundColor: '#6c757d', padding: 8, borderRadius: 6, alignSelf: 'flex-start' },
  backButtonText: { color: '#fff', fontWeight: 'bold' },
  historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#495057', marginBottom: 15 },
  dateText: { fontSize: 15, fontWeight: 'bold', color: '#495057', marginBottom: 5 },
  infoText: { fontSize: 15, color: '#212529', marginBottom: 5 },
  obsText: { fontSize: 14, color: '#6c757d', fontStyle: 'italic', marginBottom: 5 },
  noObsText: { fontSize: 13, color: '#adb5bd', fontStyle: 'italic', marginBottom: 5 },
  profText: { fontSize: 12, color: '#007bff', alignSelf: 'flex-end' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6c757d' }
});
