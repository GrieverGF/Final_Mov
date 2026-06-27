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
    console.log(`   ✅ Administrador creado: ${admin.username}`);

    const admin2 = await Usuario.create({
      username: 'admin2',
      password: 'admin123',
      nombre_completo: 'Sandra Milena Patiño Zuluaga',
      role: 'Administrador',
      activo: true
    });
    console.log(`   ✅ Administrador secundaria creada: ${admin2.username}`);

    const profesional = await Usuario.create({
      username: 'profesional',
      password: 'prof123',
      nombre_completo: 'María Isabel Torres Gómez',
      role: 'Profesional de Salud',
      activo: true
    });
    console.log(`   ✅ Profesional de Salud creado: ${profesional.username}`);

    const profesional2 = await Usuario.create({
      username: 'medico_lucia',
      password: 'prof123',
      nombre_completo: 'Diana Lucía Gómez Restrepo',
      role: 'Profesional de Salud',
      activo: true
    });
    console.log(`   ✅ Profesional de Salud creado: ${profesional2.username}`);

    const profesional3 = await Usuario.create({
      username: 'medico_camilo',
      password: 'prof123',
      nombre_completo: 'Juan Camilo Restrepo Londoño',
      role: 'Profesional de Salud',
      activo: true
    });
    console.log(`   ✅ Profesional de Salud creado: ${profesional3.username}\n`);

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
      },
      {
        cedula: '1043210987',
        nombre: 'Jorge Eliecer',
        apellido: 'Giraldo Hoyos',
        fecha_nacimiento: '1961-04-12',
        genero: 'Masculino',
        direccion: 'Vía antigua al pueblo, Km 2',
        telefono: '3145678901',
        comunidad: 'Vereda La Cristalina'
      },
      {
        cedula: '1032109876',
        nombre: 'Martha Cecilia',
        apellido: 'Ocampo Uribe',
        fecha_nacimiento: '1970-12-05',
        genero: 'Femenino',
        direccion: 'Finca El Recreo',
        telefono: '3167890123',
        comunidad: 'Vereda La Cristalina'
      },
      {
        cedula: '1021098765',
        nombre: 'Carlos Mario',
        apellido: 'Díaz Cardona',
        fecha_nacimiento: '1983-07-25',
        genero: 'Masculino',
        direccion: 'Finca Buenos Aires, sector alto',
        telefono: '3189012345',
        comunidad: 'Vereda El Placer'
      },
      {
        cedula: '1010987654',
        nombre: 'Doris Emilse',
        apellido: 'Salazar Marín',
        fecha_nacimiento: '1958-09-09',
        genero: 'Femenino',
        direccion: 'Callejón de las Flores, casa 3',
        telefono: '3123450987',
        comunidad: 'Corregimiento El Salado'
      },
      {
        cedula: '1009876543',
        nombre: 'Francisco Javier',
        apellido: 'Gómez Henao',
        fecha_nacimiento: '1949-02-28',
        genero: 'Masculino',
        direccion: 'Finca La Judea',
        telefono: '3117654321',
        comunidad: 'Vereda San Isidro'
      },
      {
        cedula: '1019283746',
        nombre: 'Gloria Inés',
        apellido: 'Montoya Bedoya',
        fecha_nacimiento: '1967-10-14',
        genero: 'Femenino',
        direccion: 'Lote 15, sector bajo',
        telefono: '3109876521',
        comunidad: 'Vereda San Isidro'
      },
      {
        cedula: '1029384756',
        nombre: 'Hernán Darío',
        apellido: 'Restrepo Rojas',
        fecha_nacimiento: '1974-05-03',
        genero: 'Masculino',
        direccion: 'Finca El Socorro',
        telefono: '3136549872',
        comunidad: 'Vereda El Carmen'
      }
    ]);

    pacientes.forEach((p) => {
      console.log(`   ✅ Paciente registrado: ${p.nombre} ${p.apellido} (Cédula: ${p.cedula})`);
    });
    console.log('');

    // ==========================================
    // Paso 4: Crear controles médicos de ejemplo (Seguimientos Cronológicos)
    // ==========================================
    console.log('📋 Creando controles médicos de ejemplo...');

    const controles = await ControlMedico.bulkCreate([
      // --- Historial del Paciente 0: José Antonio Pérez Muñoz ---
      {
        paciente_id: pacientes[0].id,         // José Antonio Pérez
        usuario_id: profesional.id,
        fecha: new Date('2024-10-15T09:30:00'),
        presion_arterial: '145/95',
        peso: 80.20,
        temperatura: 36.8,
        observaciones: 'Primer control en la brigada. Presión arterial significativamente elevada. Reporta cefalea ocasional. Se inicia orientación en dieta baja en sodio y se le pide volver en 15 días.'
      },
      {
        paciente_id: pacientes[0].id,         // José Antonio Pérez (Seguimiento 1)
        usuario_id: profesional.id,
        fecha: new Date('2024-11-02T10:00:00'),
        presion_arterial: '138/88',
        peso: 79.10,
        temperatura: 36.6,
        observaciones: 'Segundo control. Muestra mejoría en la presión. Ha seguido recomendaciones nutricionales de reducción de sal. Peso disminuye ligeramente.'
      },
      {
        paciente_id: pacientes[0].id,         // José Antonio Pérez (Seguimiento 2)
        usuario_id: profesional2.id,
        fecha: new Date('2024-11-20T08:45:00'),
        presion_arterial: '125/82',
        peso: 78.30,
        temperatura: 36.5,
        observaciones: 'Tercer control de seguimiento. Presión arterial dentro de rangos normales. Paciente asintomático. Se le da de alta del seguimiento intensivo, programando control de rutina en 3 meses.'
      },

      // --- Historial del Paciente 1: Luz Marina González Ospina ---
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
        paciente_id: pacientes[1].id,          // Luz Marina González (Seguimiento)
        usuario_id: profesional3.id,
        fecha: new Date('2024-12-16T11:00:00'),
        presion_arterial: '118/76',
        peso: 64.80,
        temperatura: 36.4,
        observaciones: 'Control de rutina mensual. Todo se mantiene bajo parámetros saludables.'
      },

      // --- Historial del Paciente 2: Pedro Pablo Hernández Castillo ---
      {
        paciente_id: pacientes[2].id,          // Pedro Pablo Hernández (Adulto Mayor)
        usuario_id: profesional2.id,
        fecha: new Date('2024-09-01T14:30:00'),
        presion_arterial: '160/100',
        peso: 71.00,
        temperatura: 37.0,
        observaciones: 'Paciente con antecedentes de hipertensión crónica. Presión crítica en consulta. Refiere mareos. Se le suministra dosis de emergencia y se remite al puesto de salud municipal.'
      },
      {
        paciente_id: pacientes[2].id,          // Pedro Pablo (Seguimiento 1)
        usuario_id: profesional2.id,
        fecha: new Date('2024-09-15T09:00:00'),
        presion_arterial: '142/90',
        peso: 70.50,
        temperatura: 36.7,
        observaciones: 'Retorna a control luego de atención en el hospital. Presión en descenso bajo medicación prescrita (Losartán). Se le recuerda rigurosidad en los horarios de los medicamentos.'
      },
      {
        paciente_id: pacientes[2].id,          // Pedro Pablo (Seguimiento 2)
        usuario_id: profesional3.id,
        fecha: new Date('2024-10-15T15:20:00'),
        presion_arterial: '130/80',
        peso: 70.10,
        temperatura: 36.5,
        observaciones: 'Control de control satisfactorio. Adherencia al tratamiento farmacológico excelente. Presión controlada.'
      },

      // --- Otros pacientes con controles iniciales ---
      {
        paciente_id: pacientes[4].id,          // Luis Fernando Martínez
        usuario_id: admin.id,
        fecha: new Date('2024-11-17T14:00:00'),
        presion_arterial: '150/95',
        peso: 82.30,
        temperatura: 37.2,
        observaciones: 'Paciente adulto mayor con hipertensión. Temperatura ligeramente elevada. Se remite a valoración por medicina general en el hospital municipal.'
      },
      {
        paciente_id: pacientes[5].id,          // Jorge Eliecer Giraldo
        usuario_id: profesional3.id,
        fecha: new Date('2024-11-18T10:00:00'),
        presion_arterial: '135/85',
        peso: 74.00,
        temperatura: 36.9,
        observaciones: 'Paciente con dolor en articulaciones. Presión en el límite superior. Se sugiere control de consumo de grasas.'
      },
      {
        paciente_id: pacientes[6].id,          // Martha Cecilia Ocampo
        usuario_id: profesional.id,
        fecha: new Date('2024-11-20T11:30:00'),
        presion_arterial: '115/75',
        peso: 62.50,
        temperatura: 36.6,
        observaciones: 'Control prenatal preventivo. Signos vitales estables. Se hace entrega de micronutrientes.'
      },
      {
        paciente_id: pacientes[7].id,          // Carlos Mario Díaz
        usuario_id: profesional2.id,
        fecha: new Date('2024-11-21T09:00:00'),
        presion_arterial: '125/80',
        peso: 85.00,
        temperatura: 36.8,
        observaciones: 'Control general. Paciente con sobrepeso moderado. Se le da asesoría sobre actividad física regular.'
      },
      {
        paciente_id: pacientes[8].id,          // Doris Emilse Salazar
        usuario_id: profesional.id,
        fecha: new Date('2024-11-22T08:15:00'),
        presion_arterial: '130/82',
        peso: 68.90,
        temperatura: 36.6,
        observaciones: 'Paciente asintomática. Signos dentro del estándar.'
      },
      {
        paciente_id: pacientes[9].id,          // Francisco Javier Gómez
        usuario_id: profesional3.id,
        fecha: new Date('2024-11-23T14:45:00'),
        presion_arterial: '145/90',
        peso: 77.00,
        temperatura: 36.7,
        observaciones: 'Paciente de la tercera edad. Presenta presión alta en la tarde. Recomienda control en la mañana para descartar picos.'
      },
      {
        paciente_id: pacientes[10].id,         // Gloria Inés Montoya
        usuario_id: profesional2.id,
        fecha: new Date('2024-11-24T10:30:00'),
        presion_arterial: '120/78',
        peso: 59.40,
        temperatura: 36.4,
        observaciones: 'Paciente en rango normal de salud general.'
      }
    ]);

    controles.forEach((c, index) => {
      console.log(`   ✅ Control registrado: Paciente ID ${c.paciente_id} -> PA: ${c.presion_arterial} - Peso: ${c.peso}kg`);
    });

    // ==========================================
    // Resumen final
    // ==========================================
    console.log('\n========================================');
    console.log('🎉 Seed completado exitosamente');
    console.log('========================================');
    console.log(`   👤 Usuarios creados: 5`);
    console.log(`   🏥 Pacientes creados: ${pacientes.length}`);
    console.log(`   📋 Controles creados: ${controles.length}`);
    console.log('========================================');
    console.log('\n📌 Credenciales de acceso:');
    console.log('   Admin Principal:   admin / admin123');
    console.log('   Admin Secundario:  admin2 / admin123');
    console.log('   Profesional 1:     profesional / prof123');
    console.log('   Profesional 2:     medico_lucia / prof123');
    console.log('   Profesional 3:     medico_camilo / prof123');
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
