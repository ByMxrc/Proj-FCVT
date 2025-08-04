import { usuarioService } from './UsuarioService'
import type { Usuario } from '../interfaces/Usuario';

export interface LoginCredentials {
  correo: string
  contrasena: string
}

export interface LoginResponse {
  success: boolean
  user?: Usuario
  message?: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('🔐 [AUTH] Intentando login para:', credentials.correo)
      
      // Buscar usuario por correo usando el método específico
      const usuario = await usuarioService.getUsuarioByEmail(credentials.correo)
      
      // Verificar contraseña (en un sistema real, esto debería estar encriptado)
      if (usuario.contrasena !== credentials.contrasena) {
        return {
          success: false,
          message: 'Contraseña incorrecta. Intenta nuevamente.'
        }
      }

      // Validar rol del usuario
      if (usuario.rol === null) {
        return {
          success: false,
          message: 'Tu cuenta está pendiente de activación. Un administrador debe asignarte un rol antes de que puedas acceder al sistema.'
        }
      }

      // Login exitoso
      console.log('✅ [AUTH] Login exitoso para:', usuario.nombres)
      return {
        success: true,
        user: usuario
      }
    } catch (error: any) {
      console.error('❌ [AUTH] Error en login:', error)
      
      // Si el error es que no se encontró el usuario
      if (error.message === 'Usuario no encontrado') {
        return {
          success: false,
          message: 'Usuario no encontrado. Verifica tu correo electrónico.'
        }
      }
      
      return {
        success: false,
        message: 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.'
      }
    }
  },

  async checkAdminExists(): Promise<boolean> {
    try {
      const usuarios = await usuarioService.getAllUsuarios()
      return usuarios.some(u => u.rol === 'administrador')
    } catch (error) {
      console.error('Error verificando admin:', error)
      return false
    }
  },

  async createDefaultAdmin(): Promise<Usuario | null> {
    try {
      console.log('👑 [MOCK] Creando administrador por defecto...')
      
      const adminData = {
        cedula: '0000000001',
        nombres: 'Administrador',
        apellidos: 'Sistema',
        correo: 'admin@live.uleam.edu.ec',
        fecha_nacimiento: '1980-01-01',
        contrasena: 'Admin123!',
        edad: 44,
        rol: null
      }

      const createdUser = await usuarioService.createUsuario(adminData)
      
      // Usar función específica del mock para actualizar rol
      if ('updateRole' in usuarioService) {
        const updatedUser = await (usuarioService as any).updateRole(createdUser.id_usuario, 'administrador')
        console.log('✅ [MOCK] Administrador creado con rol administrador')
        return updatedUser
      }
      
      console.log('✅ [MOCK] Administrador creado (rol pendiente de actualización)')
      return createdUser
    } catch (error: any) {
      // Si el admin ya existe, no es un error
      if (error.message.includes('Ya existe un usuario')) {
        console.log('ℹ️ [MOCK] Administrador ya existe')
        return null
      }
      console.error('❌ [MOCK] Error creando admin por defecto:', error)
      return null
    }
  },

  async initializeSystem(): Promise<void> {
    try {
      console.log('🔧 Inicializando sistema...')
      
      const adminExists = await this.checkAdminExists()
      
      if (!adminExists) {
        console.log('👤 No se encontró administrador, creando cuenta por defecto...')
        const admin = await this.createDefaultAdmin()
        
        if (admin) {
          console.log('✅ Sistema inicializado correctamente')
          console.log('📧 Credenciales del administrador:')
          console.log('   Email: admin@live.uleam.edu.ec')
          console.log('   Contraseña: Admin123!')
          console.log('   Rol:', admin.rol)
        } else {
          console.error('❌ Error al crear administrador por defecto')
        }
      } else {
        console.log('✅ Sistema ya inicializado - Administrador existente')
      }
    } catch (error) {
      console.error('❌ Error inicializando sistema:', error)
    }
  }
}
