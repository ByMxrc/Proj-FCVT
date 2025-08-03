import { Estudiante } from '../../types/Estudiante';
// ...resto del código...
// Componente CRUD genérico para Estudiante
class EstudianteCRUD {
    private estudiantes: Estudiante[] = [];
    private nextId: number = 1;

    // Crear
    crear(estudiante: Omit<Estudiante, 'id_estudiante'>): Estudiante {
        const nuevo: Estudiante = { id_estudiante: this.nextId++, ...estudiante };
        this.estudiantes.push(nuevo);
        return nuevo;
    }

    // Leer (todos)
    obtenerTodos(): Estudiante[] {
        return [...this.estudiantes];
    }

    // Leer (por id)
    obtenerPorId(id: number): Estudiante | undefined {
        return this.estudiantes.find(e => e.id_estudiante === id);
    }

    // Actualizar
    actualizar(id: number, datos: Partial<Omit<Estudiante, 'id_estudiante'>>): Estudiante | undefined {
        const estudiante = this.estudiantes.find(e => e.id_estudiante === id);
        if (estudiante) {
            Object.assign(estudiante, datos);
            return estudiante;
        }
        return undefined;
    }

    // Eliminar
    eliminar(id: number): boolean {
        const idx = this.estudiantes.findIndex(e => e.id_estudiante === id);
        if (idx !== -1) {
            this.estudiantes.splice(idx, 1);
            return true;
        }
        return false;
    }
}

// Ejemplo de uso
const crud = new EstudianteCRUD();
crud.crear({ cedula: 12345678, carrera: 'Ingeniería' });
crud.crear({ cedula: 87654321, carrera: 'Medicina' });
console.log(crud.obtenerTodos());
crud.actualizar(1, { carrera: 'Arquitectura' });
crud.eliminar(2);
console.log(crud.obtenerTodos());