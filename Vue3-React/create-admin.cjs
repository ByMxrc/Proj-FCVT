// Test simple para crear administrador en Supabase
const SUPABASE_URL = 'https://pijowuuofyevtcphiaxv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8'

async function createAdmin() {
  try {
    console.log('👑 Creando administrador en tabla usuario...')
    
    // Crear administrador
    const response = await fetch(`${SUPABASE_URL}/rest/v1/usuario`, {
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
        edad: 44,
        rol: 'administrador'
      })
    })
    
    if (response.ok) {
      const admin = await response.json()
      console.log('✅ Administrador creado exitosamente!')
      console.log('📄 Datos:', admin[0])
      
      // Verificar que se creó correctamente
      await verifyAdmin()
    } else {
      const errorText = await response.text()
      console.log('❌ Error al crear administrador:', response.status)
      console.log('Detalles:', errorText)
      
      if (response.status === 409 || errorText.includes('duplicate')) {
        console.log('ℹ️ El administrador ya existe')
        await verifyAdmin()
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

async function verifyAdmin() {
  try {
    console.log('🔍 Verificando administrador...')
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/usuario?correo=eq.admin@live.uleam.edu.ec`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    })
    
    if (response.ok) {
      const admins = await response.json()
      if (admins.length > 0) {
        console.log('✅ Administrador encontrado:')
        console.log(`   Nombre: ${admins[0].nombres} ${admins[0].apellidos}`)
        console.log(`   Email: ${admins[0].correo}`)
        console.log(`   Rol: ${admins[0].rol}`)
      } else {
        console.log('❌ No se encontró el administrador')
      }
    }
  } catch (error) {
    console.error('Error verificando admin:', error)
  }
}

createAdmin()
