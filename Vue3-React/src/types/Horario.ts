export type DiaSemanaEnum = 
  | 'lunes' 
  | 'martes' 
  | 'miercoles' 
  | 'jueves' 
  | 'viernes' 
  | 'sabado' 
  | 'domingo';

export interface Horario {
  id_horario: number;
  id_materia: number;
  id_docente: number;
  id_aula: number;
  id_paralelo: number;
  dia_semana: DiaSemanaEnum;
  hora_inicio: string; // Time as string "HH:MM:SS"
  hora_fin: string; // Time as string "HH:MM:SS"
}