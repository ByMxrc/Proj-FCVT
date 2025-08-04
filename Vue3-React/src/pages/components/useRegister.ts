import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usuarioService, generateEmail, calculateAge } from '../../services/UsuarioService'
import type { CreateUsuario } from '../../services/UsuarioService'

export function useRegister() {
  const router = useRouter()
  
  const registerData = ref({
    firstName: '',
    lastName: '',
    cedula: '',
    fechaNacimiento: '',
    password: '',
    confirmPassword: ''
  })

  const acceptTerms = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const handleRegister = async () => {
    // Validaciones
    if (registerData.value.password !== registerData.value.confirmPassword) {
      errorMessage.value = 'Las contraseñas no coinciden'
      return
    }

    if (registerData.value.cedula.length < 10) {
      errorMessage.value = 'La cédula debe tener al menos 10 dígitos'
      return
    }

    if (!registerData.value.fechaNacimiento) {
      errorMessage.value = 'La fecha de nacimiento es requerida'
      return
    }
    
    isLoading.value = true
    errorMessage.value = ''
    
    try {
      // Preparar datos para enviar
      const usuarioData: CreateUsuario = {
        cedula: registerData.value.cedula,
        nombres: registerData.value.firstName,
        apellidos: registerData.value.lastName,
        correo: generateEmail(registerData.value.cedula),
        fecha_nacimiento: registerData.value.fechaNacimiento,
        contrasena: registerData.value.password,
        edad: calculateAge(registerData.value.fechaNacimiento),
        rol: 'estudiante' // Asignar rol por defecto en lugar de null
      }

      // Crear usuario
      await usuarioService.createUsuario(usuarioData)
      
      // Mostrar mensaje de éxito y instrucciones
      alert(`¡Cuenta creada exitosamente! 🎉\n\nTu correo generado es: ${usuarioData.correo}\n\nTu cuenta ha sido registrada como estudiante. Ahora puedes iniciar sesión en el sistema.\n\nSe te redirigirá al login para que puedas acceder con tus credenciales.`)
      
      // Redirigir al login después del registro exitoso
      router.push({ name: 'Login' })
    } catch (error: any) {
      console.error('Error en registro:', error)
      errorMessage.value = error.message || 'Error al crear la cuenta'
    } finally {
      isLoading.value = false
    }
  }

  const goToLogin = () => {
    router.push({ name: 'Login' })
  }

  return {
    registerData,
    acceptTerms,
    isLoading,
    errorMessage,
    handleRegister,
    goToLogin
  }
}
