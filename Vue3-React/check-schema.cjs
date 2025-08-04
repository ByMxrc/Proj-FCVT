// Verificar el esquema de la tabla usuario
const SUPABASE_URL = 'https://pijowuuofyevtcphiaxv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8'

async function checkSchema() {
  try {
    console.log('🔍 Verificando esquema de la tabla usuario...')
    
    // Intentar insertar un registro mínimo para ver qué campos son requeridos
    const testData = {
      nombres: 'Test',
      apellidos: 'Test'
    }
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/usuario`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testData)
    })
    
    const responseText = await response.text()
    console.log('📄 Respuesta del servidor:', response.status)
    console.log('📄 Detalles:', responseText)
    
    if (!response.ok) {
      console.log('\n💡 Probando con campos básicos...')
      
      // Probar con diferentes combinaciones de campos comunes
      const basicFields = [
        { nombre: 'Test' },
        { name: 'Test' },
        { nombres: 'Test', correo: 'test@test.com' },
        { nombres: 'Test', email: 'test@test.com' },
        { nombres: 'Test', apellidos: 'Test', correo: 'test@test.com' },
        { nombres: 'Test', apellidos: 'Test', email: 'test@test.com' }
      ]
      
      for (let i = 0; i < basicFields.length; i++) {
        console.log(`\n🧪 Prueba ${i + 1}:`, JSON.stringify(basicFields[i]))
        
        const testResponse = await fetch(`${SUPABASE_URL}/rest/v1/usuario`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(basicFields[i])
        })
        
        const testResponseText = await testResponse.text()
        console.log(`   Status: ${testResponse.status}`)
        console.log(`   Respuesta: ${testResponseText}`)
        
        if (testResponse.ok) {
          console.log('✅ ¡Campos correctos encontrados!')
          break
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkSchema()
