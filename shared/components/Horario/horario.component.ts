// import { Horario } from '../../types/Estudiante';
// Asegúrate de importar Horario desde el módulo correcto o define la interfaz temporalmente aquí:
export interface Horario {
    id_horario: number;
    dia: string;
    hora_inicio: string;
    hora_fin: string;
}
// ...resto del código...
// Componente CRUD genérico para Horario
class HorarioCRUD {
    private horarios: Horario[] = [];
    private nextId: number = 1;

    // Crear
    crear(horario: Omit<Horario, 'id_horario'>): Horario {
        const nuevo: Horario = { id_horario: this.nextId++, ...horario };
        this.horarios.push(nuevo);
        return nuevo;
    }

    // Leer (todos)
    obtenerTodos(): Horario[] {
        return [...this.horarios];
    }

    // Leer (por id)
    obtenerPorId(id: number): Horario | undefined {
        return this.horarios.find(e => e.id_horario === id);
    }

    // Actualizar
    actualizar(id: number, datos: Partial<Omit<Horario, 'id_horario'>>): Horario | undefined {
        const horario = this.horarios.find(e => e.id_horario === id);
        if (horario) {
            Object.assign(horario, datos);
            return horario;
        }
        return undefined;
    }

    // Eliminar
    eliminar(id: number): boolean {
        const idx = this.horarios.findIndex(e => e.id_horario === id);
        if (idx !== -1) {
            this.horarios.splice(idx, 1);
            return true;
        }
        return false;
    }
}

// Ejemplo de uso
const crud = new HorarioCRUD();
crud.crear({ dia: 'Lunes', hora_inicio: '08:00', hora_fin: '10:00' });
crud.crear({ dia: 'Martes', hora_inicio: '10:00', hora_fin: '12:00' });
console.log(crud.obtenerTodos());
crud.actualizar(1, { dia: 'Lunes', hora_inicio: '09:00', hora_fin: '11:00' });
crud.eliminar(2);
console.log(crud.obtenerTodos());