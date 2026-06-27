import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';

export default function HistorialPacienteScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/pacientes?search=${searchQuery}`);
      // Suponemos que el backend devuelve un arreglo de controles en response.data
      setHistorial(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener el historial del paciente.');
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.dateText}>Fecha: {new Date(item.fecha).toLocaleString()}</Text>
      <Text style={styles.infoText}>Presión: {item.presionArterial} | Peso: {item.peso}kg | Temp: {item.temperatura}°C</Text>
      {item.observaciones ? <Text style={styles.obsText}>Obs: {item.observaciones}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Buscar por ID o Nombre..." 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay resultados para mostrar.</Text>}
        />
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
  dateText: { fontSize: 16, fontWeight: 'bold', color: '#495057', marginBottom: 5 },
  infoText: { fontSize: 16, color: '#343a40', marginBottom: 5 },
  obsText: { fontSize: 14, color: '#6c757d', fontStyle: 'italic' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#adb5bd' }
});
