import type { Docente } from '../types/Docente';

export interface CreateDocente {
  id_docente: number;
  titulo_academico: string;
  experiencia_anos: number;
  especialidad?: string;
}

const SUPABASE_URL = 'https://db.pijowuuofyevtcphiaxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1/docente`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export const docenteService = {
  async getAllDocentes(): Promise<Docente[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los docentes');
      }

      const docentes = await response.json();
      return docentes;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getDocenteById(id: string): Promise<Docente> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_docente=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el docente');
      }

      const docentes = await response.json();
      if (docentes.length === 0) {
        throw new Error('Docente no encontrado');
      }

      return docentes[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async createDocente(docente: CreateDocente): Promise<Docente> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(docente),
      });

      if (!response.ok) {
        throw new Error('Error al crear el docente');
      }

      const createdDocentes = await response.json();
      return createdDocentes[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async updateDocente(id: string, docente: CreateDocente): Promise<Docente> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_docente=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(docente),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el docente');
      }

      const updatedDocentes = await response.json();
      if (updatedDocentes.length === 0) {
        throw new Error('Docente no encontrado para actualizar');
      }

      return updatedDocentes[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async deleteDocente(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_docente=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el docente');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getDocentesByEspecialidad(especialidad: string): Promise<Docente[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?especialidad=eq.${especialidad}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los docentes por especialidad');
      }

      const docentes = await response.json();
      return docentes;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getDocentesByExperiencia(experienciaMinima: number): Promise<Docente[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?experiencia_anos=gte.${experienciaMinima}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los docentes por experiencia');
      }

      const docentes = await response.json();
      return docentes;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};