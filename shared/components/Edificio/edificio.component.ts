import { Edificio } from '../../types/Edificio';
// ...resto del código...
// Componente CRUD genérico para Edificio
class EdificioCRUD {
    private edificios: Edificio[] = [];
    private nextId: number = 1;

    // Crear
    crear(edificio: Omit<Edificio, 'id_edificio'>): Edificio {
        const nuevo: Edificio = { id_edificio: this.nextId++, ...edificio };
        this.edificios.push(nuevo);
        return nuevo;
    }

    // Leer (todos)
    obtenerTodos(): Edificio[] {
        return [...this.edificios];
    }

    // Leer (por id)
    obtenerPorId(id: number): Edificio | undefined {
        return this.edificios.find(e => e.id_edificio === id);
    }

    // Actualizar
    actualizar(id: number, datos: Partial<Omit<Edificio, 'id_edificio'>>): Edificio | undefined {
        const edificio = this.edificios.find(e => e.id_edificio === id);
        if (edificio) {
            Object.assign(edificio, datos);
            return edificio;
        }
        return undefined;
    }

    // Eliminar
    eliminar(id: number): boolean {
        const idx = this.edificios.findIndex(e => e.id_edificio === id);
        if (idx !== -1) {
            this.edificios.splice(idx, 1);
            return true;
        }
        return false;
    }
}

// Ejemplo de uso
const crud = new EdificioCRUD();
// Asegúrate de que las propiedades coincidan con las definidas en Edificio (excepto id_edificio)
crud.crear({ nombre_edificio: 'Edificio A', direccion: 'Calle 123' });
crud.crear({ nombre: 'Edificio B', direccion: 'Avenida 456' });
console.log(crud.obtenerTodos());
crud.actualizar(1, { direccion: 'Calle 789' });
crud.eliminar(2);
console.log(crud.obtenerTodos());