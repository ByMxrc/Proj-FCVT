import type { Horario } from '../interfaces/Horario';
import { getSupabaseHeaders, getApiUrl } from './supabaseConfig';

export interface CreateHorario {
  id_materia: number;
  id_docente: number;
  id_aula: number;
  id_paralelo?: number;
  dia_semana: string; // USER-DEFINED type
  hora_inicio: string; // time format
  hora_fin: string; // time format
}

export interface UpdateHorario {
  id_horario?: number;
  id_materia?: number;
  id_docente?: number;
  id_aula?: number;
  id_paralelo?: number;
  dia_semana?: string;
  hora_inicio?: string;
  hora_fin?: string;
}

const API_BASE_URL = getApiUrl('horario');

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

export const horarioService = {
  async getAll(): Promise<Horario[]> {
    try {
      console.log('🔍 Obteniendo todos los horarios...');
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || 'Error al obtener los horarios'}`);
      }

      const horarios = await response.json();
      console.log('✅ Horarios obtenidos:', horarios.length);
      return horarios;
    } catch (error: any) {
      handleNetworkError(error, 'getAll');
      return [];
    }
  },

  async getAllWithDetails(): Promise<any[]> {
    try {
      console.log('🔍 Obteniendo horarios con detalles completos...');
      
      // Intentar consulta con joins paso a paso
      console.log('📡 Probando consulta con select completo: materia + docente + aula...');
      
      // Primero probar estructura de tabla usuario para docentes
      console.log('🔍 Probando estructura de tabla usuario...');
      try {
        const usuarioTestResponse = await fetch(`${API_BASE_URL.replace('horario', 'usuario')}?limit=1`, {
          method: 'GET',
          headers: getHeaders()
        });
        if (usuarioTestResponse.ok) {
          const usuarioTest = await usuarioTestResponse.json();
          console.log('📊 Estructura de usuario:', usuarioTest[0] ? Object.keys(usuarioTest[0]) : 'No hay usuarios');
        }
      } catch (e) {
        console.log('⚠️ No se pudo acceder a tabla usuario');
      }

      // Intentar join con tabla usuario para obtener datos del docente
      let urlWithSelect = `${API_BASE_URL}?select=*,materia:id_materia(nombre_materia),usuario:id_docente(nombres,apellidos,rol),aula:id_aula(nombre_aula)`;
      
      const response = await fetch(urlWithSelect, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response con joins completos:', errorText);
        console.log('🔄 Intentando con solo materia y aula...');
        
        // Fallback a consulta solo con materia y aula
        const materiaAulaResponse = await fetch(`${API_BASE_URL}?select=*,materia:id_materia(nombre_materia),aula:id_aula(nombre_aula)`, {
          method: 'GET',
          headers: getHeaders()
        });
        
        if (materiaAulaResponse.ok) {
          const horariosConMateriaAula = await materiaAulaResponse.json();
          console.log('✅ Horarios con materia y aula obtenidos (fallback):', horariosConMateriaAula.length);
          console.log('📊 Ejemplo fallback:', horariosConMateriaAula[0]);
          
          // Cargar docentes aquí en el fallback donde sabemos que funciona
          let usuariosDocentes = [];
          console.log('👨‍🏫 Cargando docentes en fallback...');
          try {
            const docentesResponse = await fetch(`${API_BASE_URL.replace('horario', 'usuario')}?rol=eq.docente`, {
              method: 'GET',
              headers: getHeaders()
            });
            if (docentesResponse.ok) {
              usuariosDocentes = await docentesResponse.json();
              console.log('✅ Docentes cargados en fallback:', usuariosDocentes.length);
              console.log('📋 Primer docente:', usuariosDocentes[0]);
            } else {
              console.log('❌ Error response docentes:', await docentesResponse.text());
            }
          } catch (e) {
            console.log('❌ Error cargando docentes en fallback:', e);
          }
          
          // Transformar con datos reales de docente si están disponibles
          const horariosTransformados = horariosConMateriaAula.map((horario: any) => {
            let nombreDocente = `Docente ${horario.id_docente}`;
            
            // Buscar el docente real
            if (usuariosDocentes.length > 0) {
              const docente = usuariosDocentes.find((u: any) => u.id_usuario === horario.id_docente);
              if (docente) {
                nombreDocente = `${docente.nombres} ${docente.apellidos}`.trim();
                console.log(`🔍 Docente encontrado para id ${horario.id_docente}: ${nombreDocente}`);
              } else {
                console.log(`⚠️ No se encontró docente para id ${horario.id_docente}`);
              }
            }
            
            return {
              ...horario,
              nombre_materia: horario.materia?.nombre_materia || `Materia ${horario.id_materia}`,
              nombre_docente: nombreDocente,
              nombre_aula: horario.aula?.nombre_aula || `Aula ${horario.id_aula}`,
              nombre_paralelo: horario.id_paralelo === 1 ? 'A' : horario.id_paralelo === 2 ? 'B' : horario.id_paralelo === 3 ? 'C' : 'D',
              nombre_facultad: 'Facultad de Ciencias',
              nombre_edificio: 'Edificio Principal',
              nombre_piso: `Piso ${Math.ceil(horario.id_aula / 100)}`
            };
          });
          
          console.log('🎯 Resultado final fallback:', {
            total_horarios: horariosTransformados.length,
            total_docentes: usuariosDocentes.length,
            primer_nombre_docente: horariosTransformados[0]?.nombre_docente,
            id_docente_original: horariosConMateriaAula[0]?.id_docente
          });
          
          return horariosTransformados;
        }
        
        // Ultimo fallback a consulta básica
        const basicResponse = await fetch(API_BASE_URL, {
          method: 'GET',
          headers: getHeaders()
        });
        
        const horariosBasicos = await basicResponse.json();
        console.log('✅ Horarios básicos obtenidos (último fallback):', horariosBasicos.length);
        console.log('📊 Ejemplo de horario básico:', horariosBasicos[0]);
        
        return horariosBasicos;
      }

      const horariosCompletos = await response.json();
      console.log('✅ Horarios completos obtenidos:', horariosCompletos.length);
      console.log('📊 Ejemplo completo:', horariosCompletos[0]);
      
      // Si no tenemos datos de usuario en el join, cargar docentes por separado
      let usuariosDocentes = [];
      if (!horariosCompletos[0]?.usuario) {
        console.log('⚠️ No hay datos de usuario en el join, cargando docentes por separado...');
        try {
          const docentesResponse = await fetch(`${API_BASE_URL.replace('horario', 'usuario')}?rol=eq.docente`, {
            method: 'GET',
            headers: getHeaders()
          });
          if (docentesResponse.ok) {
            usuariosDocentes = await docentesResponse.json();
            console.log('👨‍🏫 Docentes cargados por separado:', usuariosDocentes.length);
          }
        } catch (e) {
          console.log('❌ Error cargando docentes por separado');
        }
      }
      
      // Transformar los datos para extraer la información de los objetos anidados
      const horariosTransformados = horariosCompletos.map((horario: any) => {
        // Buscar el docente en los datos del join o en la carga separada
        let nombreDocente = `Docente ${horario.id_docente}`;
        
        if (horario.usuario) {
          // Si el join funcionó
          nombreDocente = `${horario.usuario.nombres} ${horario.usuario.apellidos}`.trim();
        } else if (usuariosDocentes.length > 0) {
          // Si cargamos docentes por separado
          const docente = usuariosDocentes.find((u: any) => u.id_usuario === horario.id_docente);
          if (docente) {
            nombreDocente = `${docente.nombres} ${docente.apellidos}`.trim();
          }
        }
          
        const nombreAula = horario.aula?.nombre_aula || `Aula ${horario.id_aula}`;
        
        return {
          ...horario,
          nombre_materia: horario.materia?.nombre_materia || `Materia ${horario.id_materia}`,
          nombre_docente: nombreDocente,
          nombre_aula: nombreAula,
          nombre_paralelo: horario.id_paralelo === 1 ? 'A' : horario.id_paralelo === 2 ? 'B' : horario.id_paralelo === 3 ? 'C' : 'D',
          nombre_facultad: 'Facultad de Ciencias',
          nombre_edificio: 'Edificio Principal',
          nombre_piso: `Piso ${Math.ceil(horario.id_aula / 100)}`
        };
      });
      
      console.log('🔄 Horarios transformados con datos reales:', horariosTransformados.length);
      console.log('📋 Ejemplo transformado:', horariosTransformados[0]);
      console.log('🔍 Nombres extraídos:', {
        materia: horariosTransformados[0]?.nombre_materia,
        docente: horariosTransformados[0]?.nombre_docente,
        aula: horariosTransformados[0]?.nombre_aula,
        tiene_join_usuario: !!horariosCompletos[0]?.usuario,
        docentes_separados: usuariosDocentes.length
      });
      
      return horariosTransformados;
    } catch (error: any) {
      console.warn('⚠️ Error al obtener horarios con detalles:', error);
      // Si falla, usar el método básico como fallback
      return this.getAll();
    }
  },

  async getById(id: string): Promise<Horario> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_horario=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el horario');
      }

      const horarios = await response.json();
      if (horarios.length === 0) {
        throw new Error('Horario no encontrado');
      }

      return horarios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getByDocenteId(docenteId: string): Promise<Horario[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_docente=eq.${docenteId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los horarios por docente');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getByMateriaId(materiaId: string): Promise<Horario[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_materia=eq.${materiaId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los horarios por materia');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getByAulaId(aulaId: string): Promise<Horario[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_aula=eq.${aulaId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los horarios por aula');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async create(horario: CreateHorario): Promise<Horario> {
    try {
      console.log('✏️ Creando horario:', horario);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(horario)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al crear horario:', errorText);
        throw new Error(`Error al crear el horario: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Horario creado:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'create');
      throw error;
    }
  },

  async update(id: string, horario: UpdateHorario): Promise<Horario> {
    try {
      console.log('📝 Actualizando horario:', id, horario);
      
      const response = await fetch(`${API_BASE_URL}?id_horario=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(horario)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al actualizar horario:', errorText);
        throw new Error(`Error al actualizar el horario: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Horario actualizado:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'update');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando horario:', id);
      
      const response = await fetch(`${API_BASE_URL}?id_horario=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al eliminar horario:', errorText);
        throw new Error(`Error al eliminar el horario: ${errorText}`);
      }

      console.log('✅ Horario eliminado');
    } catch (error: any) {
      handleNetworkError(error, 'delete');
      throw error;
    }
  }
};
