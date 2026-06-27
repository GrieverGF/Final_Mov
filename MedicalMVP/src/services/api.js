import axios from 'axios';
import { Alert } from 'react-native';

// ============================================================
// Configuración del Cliente HTTP (Axios)
// MVP Controles Médicos Rurales
// ============================================================

// URL BASE DEL BACKEND:
// - Desarrollo local:     http://10.0.2.2:3000/api   (Emulador Android)
// - Docker (contenedor):  http://backend:3000/api
// - Producción (ngrok):   https://xxxx-xxxx.ngrok-free.app/api
//
// Cambia esta URL según tu entorno actual.
// Cuando uses ngrok, ejecuta: ngrok http 3000
// y copia la URL HTTPS generada aquí.
const API_BASE_URL = 'http://10.0.2.2:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// Gestión del Token de Autenticación
// ============================================================
let currentToken = null;

export const setAuthToken = (token) => {
  currentToken = token;
};

export const getAuthToken = () => currentToken;

// ============================================================
// Interceptor de PETICIONES (Request)
// Adjunta automáticamente el Bearer Token a cada petición
// ============================================================
api.interceptors.request.use(
  (config) => {
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// Interceptor de RESPUESTAS (Response)
// Manejo centralizado de errores de red, autenticación y servidor
// ============================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Sin respuesta del servidor = sin conexión a Internet o servidor caído
      Alert.alert(
        'Sin Conexión',
        'No se puede conectar con el servidor. Verifique su conexión a Internet e intente nuevamente.',
        [{ text: 'Entendido' }]
      );
    } else if (error.response.status === 401) {
      // Token expirado o credenciales inválidas
      Alert.alert(
        'Sesión Expirada',
        'Su sesión ha caducado. Por favor, inicie sesión nuevamente.',
        [{ text: 'Aceptar' }]
      );
    } else if (error.response.status === 403) {
      // Sin permisos para esta acción
      Alert.alert(
        'Acceso Denegado',
        'No tiene permisos para realizar esta acción.',
        [{ text: 'Aceptar' }]
      );
    } else if (error.response.status >= 500) {
      // Error interno del servidor
      Alert.alert(
        'Error del Servidor',
        'Ocurrió un error interno. Intente nuevamente más tarde.',
        [{ text: 'Aceptar' }]
      );
    }
    return Promise.reject(error);
  }
);

export default api;
