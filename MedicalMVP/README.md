# MVP - Controles Médicos Rurales (Proyecto Final)

Este proyecto es una aplicación web y móvil integrada para la gestión de controles médicos en zonas rurales de difícil acceso. Está diseñado para ser operado por brigadas de salud en tablets Android (online) y se conecta a una API REST centralizada para almacenar información de pacientes, signos vitales y controles.

El sistema cuenta con un control de roles integrado para garantizar la seguridad de los datos:
* **Administrador:** Acceso a métricas del sistema, configuraciones globales y reportes consolidados.
* **Profesional de Salud:** Registro de nuevos pacientes, toma de signos vitales (presión arterial, peso, temperatura) e historial clínico.

---

## 🛠️ Estructura del Proyecto

El repositorio está dividido en dos partes principales:
1. **`backend/`**: Servidor API REST construido con Node.js, Express y Sequelize ORM (soporta PostgreSQL y SQLite).
2. **Raíz (`./`)**: Aplicación móvil construida en React Native con navegación e integraciones listas.

---

## 🚀 Guía de Instalación e Inicialización

Sigue los siguientes pasos para poner en marcha tanto el servidor API como la aplicación móvil:

### Requisitos Previos
* **Node.js** (versión 16 o superior).
* **npm** o **yarn**.
* **Android SDK** y un emulador configurado (o un dispositivo físico en modo depuración USB).

---

### Paso 1: Configurar y Arrancar el Backend

1. Navega al directorio del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno creando un archivo `.env` en la carpeta `backend/`. 
   
   * **Opción A (Recomendada - SQLite local ligero sin configurar servidores):**
     Copia el siguiente contenido en tu `.env`:
     ```env
     PORT=3000
     JWT_SECRET=clave_secreta_super_segura_para_el_mvp_2024
     DB_DIALECT=sqlite
     ```
   
   * **Opción B (PostgreSQL en Docker o Servidor local):**
     Copia el siguiente contenido en tu `.env`:
     ```env
     PORT=3000
     JWT_SECRET=clave_secreta_super_segura_para_el_mvp_2024
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=medical_mvp
     DB_USER=postgres
     DB_PASSWORD=tu_contraseña_aqui
     ```

4. Ejecuta el script de semilla (Seeder) para crear las tablas y poblar la base de datos con los datos de prueba iniciales (5 usuarios de prueba, 12 pacientes y 15 controles):
   ```bash
   # Si usas SQLite local:
   DB_DIALECT=sqlite npm run seed
   
   # Si usas PostgreSQL:
   npm run seed
   ```

5. Inicia el servidor en modo desarrollo:
   ```bash
   # Si usas SQLite local:
   DB_DIALECT=sqlite npm run dev
   
   # Si usas PostgreSQL:
   npm run dev
   ```
   El servidor estará escuchando en: `http://localhost:3000`

---

### Paso 2: Configurar y Arrancar la App Móvil (React Native)

1. Regresa a la raíz del proyecto e instala las dependencias del frontend:
   ```bash
   cd ..
   npm install
   ```

2. Configura el enlace de conexión con la API en la variable `API_BASE_URL` dentro de del archivo:
   `src/services/api.js` (Línea 17)
   * Si usas el **emulador de Android**, configúralo como: `'http://10.0.2.2:3000/api'`
   * Si usas un **dispositivo móvil físico**, pon la IP local de tu computador (ej. `'http://192.168.1.15:3000/api'`).
   * Si expones tu backend con **Ngrok**, pon la URL HTTPS generada (ej. `'https://xxxx.ngrok-free.app/api'`).

3. Inicia el empaquetador de React Native (Metro Bundler):
   ```bash
   npm start
   ```

4. En una pestaña nueva de la terminal, arranca la aplicación en el emulador de Android:
   ```bash
   npm run android
   ```

---

## 🔑 Credenciales de Acceso para Pruebas

Usa las siguientes cuentas para acceder a la aplicación desde la pantalla de login:

* **Rol Administrador:**
  * **Usuario:** `admin` | **Contraseña:** `admin123`
  * **Usuario Secundario:** `admin2` | **Contraseña:** `admin123`
* **Rol Profesional de Salud:**
  * **Usuario:** `profesional` | **Contraseña:** `prof123`
  * **Usuario Secundario:** `medico_lucia` | **Contraseña:** `prof123`
  * **Usuario Terciario:** `medico_camilo` | **Contraseña:** `prof123`

---

## 🧪 Pruebas y Colección de Postman

### Ejecución de Pruebas Unitarias/Funcionales
El backend cuenta con una suite completa de 40 pruebas unitarias que evalúan el 100% de la lógica del negocio. Para ejecutarlas:
```bash
cd backend
DB_DIALECT=sqlite node test-api.js
```

### Colección de Postman
En la raíz del proyecto se encuentra el archivo **`Medical_MVP.postman_collection.json`**. 
Para utilizarlo:
1. Impórtalo en Postman.
2. Ejecuta la petición de **Iniciar Sesión (Login)** con cualquiera de las credenciales de prueba.
3. El script interno de la colección guardará automáticamente el token JWT para autorizar todas las demás llamadas de consulta y registro.
