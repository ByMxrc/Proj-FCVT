// Configuración central de Supabase
export const SUPABASE_CONFIG = {
  URL: 'https://pijowuuofyevtcphiaxv.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8'
}

// Headers estándar para requests a Supabase
export const getSupabaseHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
  'apikey': SUPABASE_CONFIG.ANON_KEY
})

// Función para crear URL de API
export const getApiUrl = (tableName: string) => `${SUPABASE_CONFIG.URL}/rest/v1/${tableName}`
