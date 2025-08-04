import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/AuthService'
import type { Usuario } from '../../interfaces/Usuario'

export function useLogin() {
  const router = useRouter()
  
  const loginData = ref({
    email: '',
    password: ''
  })

  const rememberMe = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const currentUser = ref<Usuario | null>(null)

  const handleLogin = async () => {
    if (!loginData.value.email || !loginData.value.password) {
      errorMessage.value = 'Por favor completa todos los campos'
      return
    }

    isLoading.value = true
    errorMessage.value = ''
    
    try {
      const result = await authService.login({
        correo: loginData.value.email,
        contrasena: loginData.value.password
      })

      if (result.success && result.user) {
        currentUser.value = result.user
        
        // Guardar usuario en localStorage si se seleccionó "recordarme"
        if (rememberMe.value) {
          localStorage.setItem('currentUser', JSON.stringify(result.user))
        }
        
        // Redirigir según el rol del usuario
        console.log(`Usuario logueado: ${result.user.nombres} ${result.user.apellidos} - Rol: ${result.user.rol}`)
        
        switch (result.user.rol) {
          case 'estudiante':
            router.push({ name: 'MenuEstudiante', query: { correo: result.user.correo } })
            break
          case 'docente':
            router.push({ name: 'MenuDocente', query: { correo: result.user.correo } })
            break
          case 'administrador':
            router.push({ name: 'MenuAdmin', query: { correo: result.user.correo } })
            break
          case null:
            // Este caso ya no debería llegar aquí debido a la validación en AuthService
            errorMessage.value = 'Tu cuenta está pendiente de activación. Contacta al administrador.'
            break
          default:
            errorMessage.value = 'Rol de usuario no reconocido. Contacta al administrador.'
        }
      } else {
        errorMessage.value = result.message || 'Error al iniciar sesión'
      }
    } catch (error: any) {
      console.error('Error en login:', error)
      errorMessage.value = 'Error de conexión. Intenta nuevamente.'
    } finally {
      isLoading.value = false
    }
  }

  const goToRegister = () => {
    router.push({ name: 'Register' })
  }

  // Inicializar sistema al cargar el componente
  onMounted(async () => {
    console.log('🚀 Iniciando aplicación del sistema académico...')
    await authService.initializeSystem()
    
    // Verificar si hay usuario guardado
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        currentUser.value = JSON.parse(savedUser)
        console.log('👤 Usuario previamente logueado encontrado:', currentUser.value?.nombres)
      } catch (error) {
        localStorage.removeItem('currentUser')
        console.log('🧹 Datos de usuario guardados inválidos, limpiando...')
      }
    }
    
    // Mostrar información útil en consola
    console.log('📋 Información del sistema:')
    console.log('   • Usuarios nuevos se registran con rol "none"')
    console.log('   • Solo usuarios con rol asignado pueden acceder')
    console.log('   • Admin por defecto: admin@live.uleam.edu.ec / Admin123!')
  })

  return {
    loginData,
    rememberMe,
    isLoading,
    errorMessage,
    currentUser,
    handleLogin,
    goToRegister
  }
}
