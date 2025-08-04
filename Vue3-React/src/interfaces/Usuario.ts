export type RolEnum = 'estudiante' | 'docente' | 'administrador' | null;

export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  fecha_nacimiento: string;
  cedula: string;
  edad: number;
  rol: RolEnum;
}
