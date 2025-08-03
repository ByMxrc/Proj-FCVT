export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  contraseña: string;
  fecha_nacimiento: Date;
  cedula: string;
  edad: number;
  rol: 'alumno' | 'profesor' | 'admin';
}
