import { Aulas } from '../../types/Aula';
// ...resto del código...
// Componente CRUD genérico para Aula
class AulaCRUD {
    private aulas: Aulas[] = [];
    private nextId: number = 1;

    // Crear
    crear(aula: Omit<Aulas, 'id_aula'>): Aulas {
        const nuevo: Aulas = { id_aula: this.nextId++, ...aula };
        this.aulas.push(nuevo);
        return nuevo;
    }

    // Leer (todos)
    obtenerTodos(): Aulas[] {
        return [...this.aulas];
    }

    // Leer (por id)
    obtenerPorId(id: number): Aulas | undefined {
        return this.aulas.find(e => e.id_aula === id);
    }

    // Actualizar
    actualizar(id: number, datos: Partial<Omit<Aulas, 'id_aula'>>): Aulas | undefined {
        const aula = this.aulas.find(e => e.id_aula === id);
        if (aula) {
            Object.assign(aula, datos);
            return aula;
        }
        return undefined;
    }

    // Eliminar
    eliminar(id: number): boolean {
        const idx = this.aulas.findIndex(e => e.id_aula === id);
        if (idx !== -1) {
            this.aulas.splice(idx, 1);
            return true;
        }
        return false;
    }
}

// Ejemplo de uso
const crud = new AulaCRUD();
crud.crear({ nombre_aula: 'Matemáticas', id_piso: 1 });
crud.crear({ nombre_aula: 'Historia', id_piso: 2 });
console.log(crud.obtenerTodos());
crud.actualizar(1, { nombre_aula: 'Matemáticas Avanzadas' });
crud.eliminar(2);
console.log(crud.obtenerTodos());