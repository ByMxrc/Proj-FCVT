import { Materia} from '../../types/Materia';
// ...resto del código...
// Componente CRUD genérico para Materia
class MateriaCRUD {
    private materias: Materia[] = [];
    private nextId: number = 1;

    // Crear
    crear(materia: Omit<Materia, 'id_materia'>): Materia {
        const nuevo: Materia = { id_materia: this.nextId++, ...materia };
        this.materias.push(nuevo);
        return nuevo;
    }

    // Leer (todos)
    obtenerTodos(): Materia[] {
        return [...this.materias];
    }

    // Leer (por id)
    obtenerPorId(id: number): Materia | undefined {
        return this.materias.find(e => e.id_materia === id);
    }

    // Actualizar
    actualizar(id: number, datos: Partial<Omit<Materia, 'id_materia'>>): Materia | undefined {
        const materia = this.materias.find(e => e.id_materia === id);
        if (materia) {
            Object.assign(materia, datos);
            return materia;
        }
        return undefined;
    }

    // Eliminar
    eliminar(id: number): boolean {
        const idx = this.materias.findIndex(e => e.id_materia === id);
        if (idx !== -1) {
            this.materias.splice(idx, 1);
            return true;
        }
        return false;
    }
}

// Ejemplo de uso
const crud = new MateriaCRUD();
crud.crear({ nombre: 'Matemáticas', nivel: 1, paralelo: 'A' });
crud.crear({ nombre: 'Historia', nivel: 2, paralelo: 'B' });
console.log(crud.obtenerTodos());
crud.actualizar(1, { nombre: 'Matemáticas Avanzadas' });
crud.eliminar(2);
console.log(crud.obtenerTodos());