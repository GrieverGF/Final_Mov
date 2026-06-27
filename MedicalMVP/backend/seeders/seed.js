/**
 * seeders/seed.js
 * Script de semillas (seeds) para poblar la base de datos con datos de prueba.
 * Crea usuarios, pacientes y controles médicos de ejemplo.
 *
 * Uso: npm run seed
 *
 * ADVERTENCIA: Este script usa force:true, lo que elimina y recrea todas las tablas.
 * Usar únicamente en entornos de desarrollo.
 */

// Cargar variables de entorno
require('dotenv').config();

const { sequelize, Usuario, Paciente, ControlMedico } = require('../models');

/**
 * Función principal del seeder.
 * Sincroniza la base de datos y crea datos de prueba.
 */
const ejecutarSeed = async () => {
  try {
    // ==========================================
    // Paso 1: Sincronizar la base de datos (elimina y recrea las tablas)
    // ==========================================
    console.log('🔄 Sincronizando la base de datos (force: true)...');
    await sequelize.sync({ force: true });
    console.log('✅ Base de datos sincronizada correctamente.\n');

    // ==========================================
    // Paso 2: Crear usuarios del sistema
    // ==========================================
    console.log('👤 Creando usuarios del sistema...');

    const admin = await Usuario.create({
      username: 'admin',
      password: 'admin123',
      nombre_completo: 'Carlos Andrés Ramírez López',
      role: 'Administrador',
      activo: true
    });
    console.log(`   ✅ Administrador creado: ${admin.username} (ID: ${admin.id})`);

    const profesional = await Usuario.create({
      username: 'profesional',
      password: 'prof123',
      nombre_completo: 'María Isabel Torres Gómez',
      role: 'Profesional de Salud',
      activo: true
    });
    console.log(`   ✅ Profesional creado: ${profesional.username} (ID: ${profesional.id})\n`);

    // ==========================================
    // Paso 3: Crear pacientes de ejemplo con datos colombianos rurales
    // ==========================================
    console.log('🏥 Creando pacientes de ejemplo...');

    const pacientes = await Paciente.bulkCreate([
      {
        cedula: '1098765432',
        nombre: 'José Antonio',
        apellido: 'Pérez Muñoz',
        fecha_nacimiento: '1965-03-15',
        genero: 'Masculino',
        direccion: 'Finca La Esperanza, Km 5 vía principal',
        telefono: '3104567890',
        comunidad: 'Vereda El Carmen'
      },
      {
        cedula: '1087654321',
        nombre: 'Luz Marina',
        apellido: 'González Ospina',
        fecha_nacimiento: '1978-08-22',
        genero: 'Femenino',
        direccion: 'Casa 12, sector central',
        telefono: '3156789012',
        comunidad: 'Corregimiento San Juan'
      },
      {
        cedula: '1076543210',
        nombre: 'Pedro Pablo',
        apellido: 'Hernández Castillo',
        fecha_nacimiento: '1952-11-05',
        genero: 'Masculino',
        direccion: 'Parcela 8, sector norte',
        telefono: '3209876543',
        comunidad: 'Vereda Alto Bonito'
      },
      {
        cedula: '1065432109',
        nombre: 'Ana María',
        apellido: 'Rodríguez Vargas',
        fecha_nacimiento: '1990-01-30',
        genero: 'Femenino',
        direccion: 'Calle principal, casa sin número',
        telefono: '3178901234',
        comunidad: 'Caserío La Palmera'
      },
      {
        cedula: '1054321098',
        nombre: 'Luis Fernando',
        apellido: 'Martínez Ríos',
        fecha_nacimiento: '1945-06-18',
        genero: 'Masculino',
        direccion: 'Finca El Porvenir, salida al río',
        telefono: '3112345678',
        comunidad: 'Vereda Agua Clara'
      }
    ]);

    pacientes.forEach((p) => {
      console.log(`   ✅ Paciente: ${p.nombre} ${p.apellido} - Cédula: ${p.cedula} - Comunidad: ${p.comunidad}`);
    });
    console.log('');

    // ==========================================
    // Paso 4: Crear controles médicos de ejemplo
    // ==========================================
    console.log('📋 Creando controles médicos de ejemplo...');

    const controles = await ControlMedico.bulkCreate([
      {
        paciente_id: pacientes[0].id,         // José Antonio Pérez
        usuario_id: profesional.id,            // Registrado por la profesional
        fecha: new Date('2024-11-15T09:30:00'),
        presion_arterial: '140/90',
        peso: 78.50,
        temperatura: 36.8,
        observaciones: 'Paciente presenta presión arterial elevada. Se recomienda control de dieta baja en sodio y seguimiento en 15 días.'
      },
      {
        paciente_id: pacientes[1].id,          // Luz Marina González
        usuario_id: profesional.id,
        fecha: new Date('2024-11-16T10:15:00'),
        presion_arterial: '120/80',
        peso: 65.00,
        temperatura: 36.5,
        observaciones: 'Signos vitales dentro de parámetros normales. Paciente en buen estado general de salud.'
      },
      {
        paciente_id: pacientes[4].id,          // Luis Fernando Martínez
        usuario_id: admin.id,                  // Registrado por el administrador
        fecha: new Date('2024-11-17T14:00:00'),
        presion_arterial: '150/95',
        peso: 82.30,
        temperatura: 37.2,
        observaciones: 'Paciente adulto mayor con hipertensión. Temperatura ligeramente elevada. Se remite a valoración por medicina general en el hospital municipal.'
      }
    ]);

    controles.forEach((c, index) => {
      console.log(`   ✅ Control #${index + 1}: Paciente ID ${c.paciente_id} - PA: ${c.presion_arterial} - Peso: ${c.peso}kg - Temp: ${c.temperatura}°C`);
    });

    // ==========================================
    // Resumen final
    // ==========================================
    console.log('\n========================================');
    console.log('🎉 Seed completado exitosamente');
    console.log('========================================');
    console.log(`   👤 Usuarios creados: 2`);
    console.log(`   🏥 Pacientes creados: ${pacientes.length}`);
    console.log(`   📋 Controles creados: ${controles.length}`);
    console.log('========================================');
    console.log('\n📌 Credenciales de acceso:');
    console.log('   Admin:       admin / admin123');
    console.log('   Profesional: profesional / prof123');
    console.log('========================================\n');

    // Terminar el proceso con éxito
    process.exit(0);

  } catch (error) {
    console.error('❌ Error al ejecutar el seed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Ejecutar el script de semillas
ejecutarSeed();
