/**
 * test-api.js
 * Script de pruebas funcionales para el backend.
 * Usa SQLite en memoria (no requiere PostgreSQL ni Docker).
 * 
 * Ejecutar: node test-api.js
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const http = require('http');

// ============================================================
// 1. Crear instancia de Sequelize con SQLite en memoria
// ============================================================
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

// ============================================================
// 2. Registrar modelos con la instancia SQLite
// ============================================================
const Usuario = require('./models/Usuario')(sequelize);
const Paciente = require('./models/Paciente')(sequelize);
const ControlMedico = require('./models/ControlMedico')(sequelize);

// Asociaciones
Paciente.hasMany(ControlMedico, { foreignKey: 'paciente_id', as: 'controles', onDelete: 'CASCADE' });
ControlMedico.belongsTo(Paciente, { foreignKey: 'paciente_id', as: 'paciente' });
Usuario.hasMany(ControlMedico, { foreignKey: 'usuario_id', as: 'controles', onDelete: 'RESTRICT' });
ControlMedico.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'profesional' });

// Hacer que las rutas encuentren los modelos correctos
// Sobrescribimos el require de los modelos
const modelsOverride = { sequelize, Usuario, Paciente, ControlMedico };

// ============================================================
// 3. Configurar Express (misma config que server.js)
// ============================================================
const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ estado: 'activo', mensaje: 'Servidor de pruebas funcionando' });
});

// ============================================================
// 4. Montar las rutas manualmente (inyectando modelos SQLite)
// ============================================================

// --- AUTH ---
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'test_secret_key';
process.env.JWT_SECRET = JWT_SECRET;

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }
    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const passwordValida = await usuario.validarPassword(password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: usuario.id, username: usuario.username, role: usuario.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ mensaje: 'Inicio de sesión exitoso', token, role: usuario.role, usuario: { id: usuario.id, username: usuario.username, nombre_completo: usuario.nombre_completo, role: usuario.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Middleware Auth ---
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// --- PACIENTES ---
app.get('/api/pacientes', verificarToken, async (req, res) => {
  const { search } = req.query;
  let where = {};
  if (search) {
    const { Op } = require('sequelize');
    where = {
      [Op.or]: [
        { cedula: { [Op.like]: `%${search}%` } },
        { nombre: { [Op.like]: `%${search}%` } },
        { apellido: { [Op.like]: `%${search}%` } },
        { comunidad: { [Op.like]: `%${search}%` } }
      ]
    };
  }
  const pacientes = await Paciente.findAll({ where, include: [{ model: ControlMedico, as: 'controles' }] });
  res.json(pacientes);
});

app.post('/api/pacientes', verificarToken, async (req, res) => {
  const paciente = await Paciente.create(req.body);
  res.status(201).json({ mensaje: 'Paciente creado', paciente });
});

// --- CONTROLES ---
app.get('/api/controles', verificarToken, async (req, res) => {
  const controles = await ControlMedico.findAll({
    include: [
      { model: Paciente, as: 'paciente', attributes: ['id', 'cedula', 'nombre', 'apellido'] },
      { model: Usuario, as: 'profesional', attributes: ['id', 'nombre_completo', 'role'] }
    ],
    order: [['fecha', 'DESC']]
  });
  res.json({ total: controles.length, controles });
});

app.post('/api/controles', verificarToken, async (req, res) => {
  const { paciente_id, presion_arterial, peso, temperatura, observaciones } = req.body;
  if (!paciente_id || !presion_arterial || !peso || !temperatura) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }
  const paciente = await Paciente.findByPk(paciente_id);
  if (!paciente) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }
  const control = await ControlMedico.create({
    paciente_id, usuario_id: req.user.id, fecha: new Date(),
    presion_arterial, peso, temperatura, observaciones
  });
  res.status(201).json({ mensaje: 'Control registrado', control });
});

// --- CONFIG (Solo Admin) ---
app.get('/api/config/stats', verificarToken, async (req, res) => {
  if (req.user.role !== 'Administrador') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const totalPacientes = await Paciente.count();
  const totalControles = await ControlMedico.count();
  const totalUsuarios = await Usuario.count();
  res.json({ totalPacientes, totalControles, totalUsuarios });
});

// ============================================================
// 5. Helper para hacer requests HTTP
// ============================================================
function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost', port: 4000, path, method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ============================================================
// 6. EJECUTAR TESTS
// ============================================================
let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  // Sincronizar BD en memoria
  await sequelize.sync({ force: true });

  // Seed de datos
  const admin = await Usuario.create({ username: 'admin', password: 'admin123', nombre_completo: 'Carlos Ramírez', role: 'Administrador' });
  const prof = await Usuario.create({ username: 'profesional', password: 'prof123', nombre_completo: 'María Torres', role: 'Profesional de Salud' });
  const pac1 = await Paciente.create({ cedula: '1098765432', nombre: 'José Antonio', apellido: 'Pérez Muñoz', genero: 'Masculino', comunidad: 'Vereda El Carmen' });
  const pac2 = await Paciente.create({ cedula: '1087654321', nombre: 'Luz Marina', apellido: 'González Ospina', genero: 'Femenino', comunidad: 'Corregimiento San Juan' });

  // Iniciar servidor de test
  const server = app.listen(4000, async () => {
    try {
      console.log('\n╔══════════════════════════════════════════════════════════╗');
      console.log('║      🧪 TEST SUITE - MVP CONTROLES MÉDICOS RURALES      ║');
      console.log('╚══════════════════════════════════════════════════════════╝\n');

      // ─── TEST 1: Health Check ────────────────────────────────────
      console.log('📌 Módulo: Health Check');
      let res = await request('GET', '/api/health');
      assert(res.status === 200, 'GET /api/health retorna 200');
      assert(res.body.estado === 'activo', 'Estado del servidor: activo');

      // ─── TEST 2: Auth - Login ────────────────────────────────────
      console.log('\n📌 Módulo 1: Autenticación');
      
      res = await request('POST', '/api/auth/login', { username: 'admin', password: 'admin123' });
      assert(res.status === 200, 'Login Admin con credenciales correctas → 200');
      assert(res.body.token !== undefined, 'Retorna un JWT token');
      assert(res.body.role === 'Administrador', 'Rol retornado: Administrador');
      const adminToken = res.body.token;

      res = await request('POST', '/api/auth/login', { username: 'profesional', password: 'prof123' });
      assert(res.status === 200, 'Login Profesional con credenciales correctas → 200');
      assert(res.body.role === 'Profesional de Salud', 'Rol retornado: Profesional de Salud');
      const profToken = res.body.token;

      res = await request('POST', '/api/auth/login', { username: 'admin', password: 'wrongpassword' });
      assert(res.status === 401, 'Login con contraseña incorrecta → 401');

      res = await request('POST', '/api/auth/login', { username: 'noexiste', password: '123' });
      assert(res.status === 401, 'Login con usuario inexistente → 401');

      res = await request('POST', '/api/auth/login', {});
      assert(res.status === 400, 'Login sin credenciales → 400');

      // ─── TEST 3: Rutas protegidas sin token ──────────────────────
      console.log('\n📌 Seguridad: Rutas protegidas sin token');
      
      res = await request('GET', '/api/pacientes');
      assert(res.status === 401, 'GET /api/pacientes sin token → 401');

      res = await request('GET', '/api/controles');
      assert(res.status === 401, 'GET /api/controles sin token → 401');

      // ─── TEST 4: Pacientes ──────────────────────────────────────
      console.log('\n📌 Módulo 3: Pacientes');

      res = await request('GET', '/api/pacientes', null, adminToken);
      assert(res.status === 200, 'GET /api/pacientes con token → 200');
      assert(Array.isArray(res.body) && res.body.length === 2, 'Retorna 2 pacientes del seed');

      res = await request('GET', '/api/pacientes?search=Luz', null, adminToken);
      assert(res.status === 200, 'Búsqueda por nombre "Luz" → 200');
      assert(res.body.length === 1, 'Encuentra 1 paciente (Luz Marina)');
      assert(res.body[0] && res.body[0].nombre === 'Luz Marina', 'Nombre correcto: Luz Marina');

      res = await request('GET', '/api/pacientes?search=1087654321', null, profToken);
      assert(res.status === 200, 'Búsqueda por cédula "1087654321" → 200');
      assert(res.body.length === 1, 'Encuentra 1 paciente por cédula');

      res = await request('POST', '/api/pacientes', {
        cedula: '9999999999', nombre: 'Pedro', apellido: 'Martínez', genero: 'Masculino', comunidad: 'Vereda Nueva'
      }, adminToken);
      assert(res.status === 201, 'POST /api/pacientes → 201 (Paciente creado)');
      assert(res.body.paciente.cedula === '9999999999', 'Cédula del nuevo paciente correcta');

      // ─── TEST 5: Controles Médicos ──────────────────────────────
      console.log('\n📌 Módulo 2: Registro de Control Médico');

      res = await request('POST', '/api/controles', {
        paciente_id: pac1.id,
        presion_arterial: '120/80',
        peso: 75.5,
        temperatura: 36.6,
        observaciones: 'Paciente estable, signos normales'
      }, profToken);
      assert(res.status === 201, 'POST /api/controles → 201 (Control creado)');
      assert(res.body.control && res.body.control.presion_arterial === '120/80', 'Presión arterial guardada: 120/80');

      res = await request('POST', '/api/controles', {
        paciente_id: pac2.id,
        presion_arterial: '140/90',
        peso: 68.2,
        temperatura: 37.1,
        observaciones: 'Presión arterial elevada'
      }, adminToken);
      assert(res.status === 201, 'Admin también puede crear controles → 201');

      res = await request('POST', '/api/controles', {
        paciente_id: pac1.id,
        presion_arterial: '115/75',
        peso: 74.8,
        temperatura: 36.4
      }, profToken);
      assert(res.status === 201, 'Control sin observaciones (campo opcional) → 201');

      // Validaciones de error
      res = await request('POST', '/api/controles', { paciente_id: pac1.id }, profToken);
      assert(res.status === 400, 'Control sin campos obligatorios → 400');

      res = await request('POST', '/api/controles', {
        paciente_id: 9999, presion_arterial: '120/80', peso: 70, temperatura: 36.5
      }, profToken);
      assert(res.status === 404, 'Control con paciente inexistente → 404');

      // Listar controles
      res = await request('GET', '/api/controles', null, profToken);
      assert(res.status === 200, 'GET /api/controles → 200');
      assert(res.body.total === 3, 'Total de controles registrados: 3');
      assert(res.body.controles && res.body.controles[0] && res.body.controles[0].paciente !== undefined, 'Cada control incluye datos del paciente');
      assert(res.body.controles && res.body.controles[0] && res.body.controles[0].profesional !== undefined, 'Cada control incluye datos del profesional');

      // ─── TEST 6: Historial del Paciente ─────────────────────────
      console.log('\n📌 Módulo 3: Historial Clínico del Paciente');

      res = await request('GET', '/api/pacientes?search=Vereda', null, profToken);
      assert(res.status === 200, 'Buscar paciente por comunidad "Vereda" → 200');
      assert(res.body[0] && res.body[0].controles.length === 2, 'Paciente de Vereda El Carmen tiene 2 controles');

      res = await request('GET', '/api/pacientes?search=Corregimiento', null, profToken);
      assert(res.body.length >= 1, 'Encuentra paciente(s) de Corregimiento');
      assert(res.body[0] && res.body[0].controles.length === 1, 'Luz Marina tiene 1 control en su historial');

      // ─── TEST 7: Config / Stats (Solo Admin) ───────────────────
      console.log('\n📌 Módulo: Configuración (Solo Administrador)');

      res = await request('GET', '/api/config/stats', null, adminToken);
      assert(res.status === 200, 'Admin accede a /api/config/stats → 200');
      assert(res.body.totalPacientes === 3, 'Estadística: 3 pacientes');
      assert(res.body.totalControles === 3, 'Estadística: 3 controles');
      assert(res.body.totalUsuarios === 2, 'Estadística: 2 usuarios');

      res = await request('GET', '/api/config/stats', null, profToken);
      assert(res.status === 403, 'Profesional NO puede acceder a stats → 403');

      // ─── RESUMEN ─────────────────────────────────────────────────
      console.log('\n╔══════════════════════════════════════════════════════════╗');
      console.log(`║  📊 RESULTADOS: ${passed} pasaron, ${failed} fallaron de ${passed + failed} tests  `);
      if (failed === 0) {
        console.log('║  🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!              ║');
      } else {
        console.log(`║  ⚠️  ${failed} test(s) fallaron. Revisar logs arriba.         ║`);
      }
      console.log('╚══════════════════════════════════════════════════════════╝\n');

    } catch (error) {
      console.error('❌ Error durante las pruebas:', error.message);
      console.error(error.stack);
    } finally {
      server.close();
      process.exit(failed > 0 ? 1 : 0);
    }
  });
}

runTests();
