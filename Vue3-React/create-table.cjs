// Script para crear la tabla usuarios en Supabase
const SUPABASE_URL = 'https://pijowuuofyevtcphiaxv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8'

async function createUsuariosTable() {
  try {
    console.log('🏗️ Creando tabla usuarios en Supabase...')
    
    // SQL para crear la tabla
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario SERIAL PRIMARY KEY,
        nombres VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        correo VARCHAR(150) UNIQUE NOT NULL,
        contrasena VARCHAR(255) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        cedula VARCHAR(20) UNIQUE NOT NULL,
        telefono VARCHAR(20),
        edad INTEGER,
        rol VARCHAR(20) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
    
    // Ejecutar SQL mediante RPC
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: createTableSQL
      })
    })
    
    if (response.ok) {
      console.log('✅ Tabla usuarios creada exitosamente!')
      
      // Crear administrador inicial
      await createAdminUser()
      
    } else {
      console.log('❌ Error al crear tabla:', response.status)
      const errorText = await response.text()
      console.log('Detalles:', errorText)
      
      console.log('\n📝 Necesitas crear la tabla manualmente en Supabase:')
      console.log('1. Ve al SQL Editor en tu dashboard de Supabase')
      console.log('2. Ejecuta este SQL:')
      console.log(createTableSQL)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    console.log('\n📝 Crea la tabla manualmente en Supabase SQL Editor con este código:')
    console.log(`
CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  edad INTEGER,
  rol VARCHAR(20) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear administrador inicial
INSERT INTO usuarios (nombres, apellidos, correo, contrasena, fecha_nacimiento, cedula, telefono, edad, rol)
VALUES ('Administrador', 'Sistema', 'admin@live.uleam.edu.ec', 'Admin123!', '1980-01-01', '0000000001', '0000000000', 44, 'administrador');
    `)
  }
}

async function createAdminUser() {
  try {
    console.log('👑 Creando usuario administrador...')
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        nombres: 'Administrador',
        apellidos: 'Sistema',
        correo: 'admin@live.uleam.edu.ec',
        contrasena: 'Admin123!',
        fecha_nacimiento: '1980-01-01',
        cedula: '0000000001',
        telefono: '0000000000',
        edad: 44,
        rol: 'administrador'
      })
    })
    
    if (response.ok) {
      const admin = await response.json()
      console.log('✅ Administrador creado:', admin[0].nombres)
    } else {
      console.log('⚠️ Error al crear admin (posiblemente ya existe):', response.status)
    }
    
  } catch (error) {
    console.error('Error creando admin:', error)
  }
}

createUsuariosTable()
