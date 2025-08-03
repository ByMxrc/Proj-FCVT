import { Paralelo} from '../../types/Paralelo';
// ...resto del código...
// Componente CRUD genérico para Paralelo
class ParaleloCRUD {
    private paralelos: Paralelo[] = [];
    private nextId: number = 1;

    // Crear
    crear(paralelo: Omit<Paralelo, 'id_paralelo'>): Paralelo {
        const nuevo: Paralelo = { id_paralelo: this.nextId++, ...paralelo };
        this.paralelos.push(nuevo);
        return nuevo;
    }

    // Leer (todos)
    obtenerTodos(): Paralelo[] {
        return [...this.paralelos];
    }

    // Leer (por id)
    obtenerPorId(id: number): Paralelo | undefined {
        return this.paralelos.find(e => e.id_paralelo === id);
    }

    // Actualizar
    actualizar(id: number, datos: Partial<Omit<Paralelo, 'id_paralelo'>>): Paralelo | undefined {
        const paralelo = this.paralelos.find(e => e.id_paralelo === id);
        if (paralelo) {
            Object.assign(paralelo, datos);
            return paralelo;
        }
        return undefined;
    }

    // Eliminar
    eliminar(id: number): boolean {
        const idx = this.paralelos.findIndex(e => e.id_paralelo === id);
        if (idx !== -1) {
            this.paralelos.splice(idx, 1);
            return true;
        }
        return false;
    }
}

// Ejemplo de uso
const crud = new ParaleloCRUD();
crud.crear({ nombre: 'Paralelo 1', seccion: 'A' });
crud.crear({ nombre: 'Paralelo 2', seccion: 'B' });
console.log(crud.obtenerTodos());
crud.actualizar(1, { seccion: 'C' });
crud.eliminar(2);
console.log(crud.obtenerTodos());