import type { Horario } from '../types/Horario';

export interface CreateHorario {
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  id_paralelo: number;
  id_aula: number;
}

const SUPABASE_URL = 'https://db.pijowuuofyevtcphiaxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1/horario`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export const horarioService = {
  async getAllHorarios(): Promise<Horario[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los horarios');
      }

      const horarios = await response.json();
      return horarios;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getHorarioById(id: string): Promise<Horario> {
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

  async createHorario(horario: CreateHorario): Promise<Horario> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(horario),
      });

      if (!response.ok) {
        throw new Error('Error al crear el horario');
      }

      const createdHorarios = await response.json();
      return createdHorarios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async updateHorario(id: string, horario: CreateHorario): Promise<Horario> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_horario=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(horario),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el horario');
      }

      const updatedHorarios = await response.json();
      if (updatedHorarios.length === 0) {
        throw new Error('Horario no encontrado para actualizar');
      }

      return updatedHorarios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async deleteHorario(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_horario=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el horario');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getHorariosByParalelo(idParalelo: string): Promise<Horario[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_paralelo=eq.${idParalelo}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los horarios por paralelo');
      }

      const horarios = await response.json();
      return horarios;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getHorariosByAula(idAula: string): Promise<Horario[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_aula=eq.${idAula}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los horarios por aula');
      }

      const horarios = await response.json();
      return horarios;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getHorariosByDia(dia: string): Promise<Horario[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?dia_semana=eq.${dia}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los horarios por día');
      }

      const horarios = await response.json();
      return horarios;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};
