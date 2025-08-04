import type { Usuario, RolEnum } from '../interfaces/Usuario';
import { getSupabaseHeaders, getApiUrl } from './supabaseConfig';

export interface CreateUsuario {
  cedula: string;
  nombres: string;
  apellidos: string;
  correo: string;
  fecha_nacimiento: string;
  contrasena: string;
  edad: number;
  rol: RolEnum; // Permite cualquier rol válido
}

const API_BASE_URL = getApiUrl('usuario');

const getHeaders = getSupabaseHeaders;

// Función para manejar errores de red
const handleNetworkError = (error: any, operation: string) => {
  console.error(`Error en ${operation}:`, error);
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    throw new Error('Error de conexión. Verifica tu conexión a internet y que Supabase esté disponible.');
  }
  
  if (error.message.includes('CORS')) {
    throw new Error('Error de CORS. Verifica la configuración de Supabase.');
  }
  
  throw new Error(error.message || `Error desconocido en ${operation}`);
};

// Utilidades para el registro
export const generateEmail = (cedula: string): string => {
  return `e${cedula}@live.uleam.edu.ec`;
};

export const calculateAge = (fechaNacimiento: string): number => {
  const birthDate = new Date(fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const usuarioService = {
  async getAllUsuarios(): Promise<Usuario[]> {
    try {
      console.log('🔍 Obteniendo todos los usuarios...');
      console.log('📡 URL:', API_BASE_URL);
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      console.log('📊 Respuesta status:', response.status);
      console.log('📊 Respuesta ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || 'Error al obtener los usuarios'}`);
      }

      const usuarios = await response.json();
      console.log('✅ Usuarios obtenidos:', usuarios.length);
      return usuarios;
    } catch (error: any) {
      handleNetworkError(error, 'getAllUsuarios');
      return []; // Nunca se ejecutará por el throw en handleNetworkError
    }
  },

  async getUsuarioById(id: string): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_usuario=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el usuario');
      }

      const usuarios = await response.json();
      if (usuarios.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return usuarios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getUsuarioByCedula(cedula: string): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}?cedula=eq.${cedula}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el usuario');
      }

      const usuarios = await response.json();
      if (usuarios.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return usuarios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getUsuarioByEmail(correo: string): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}?correo=eq.${correo}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el usuario');
      }

      const usuarios = await response.json();
      if (usuarios.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return usuarios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async createUsuario(usuario: CreateUsuario): Promise<Usuario> {
    try {
      console.log('👤 Creando usuario:', usuario.nombres, usuario.apellidos);
      console.log('📧 Email:', usuario.correo);
      console.log('📡 URL:', API_BASE_URL);
      console.log('📊 Headers:', getHeaders());
      console.log('📊 Datos a enviar:', usuario);

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(usuario),
      });

      console.log('📊 Respuesta status:', response.status);
      console.log('📊 Respuesta ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || 'Error al crear el usuario'}`);
      }

      const createdUsuarios = await response.json();
      console.log('✅ Usuario creado:', createdUsuarios[0]);
      return createdUsuarios[0];
    } catch (error: any) {
      handleNetworkError(error, 'createUsuario');
      throw error; // Esta línea nunca se ejecutará por el throw en handleNetworkError
    }
  },

  async updateUsuario(id: string, usuario: CreateUsuario): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_usuario=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      const updatedUsuarios = await response.json();
      if (updatedUsuarios.length === 0) {
        throw new Error('Usuario no encontrado para actualizar');
      }

      return updatedUsuarios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async deleteUsuario(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_usuario=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};
