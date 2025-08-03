import { piso as Piso } from '../../types/Piso';
// ...resto del código...
// Componente CRUD genérico para Piso
class PisoCRUD {
    private pisos: Piso[] = [];
    private nextId: number = 1;

    // Crear
    crear(piso: Omit<Piso, 'id_piso'>): Piso {
        const nuevo: Piso = { id_piso: this.nextId++, ...piso };
        this.pisos.push(nuevo);
        return nuevo;
    }

    // Leer (todos)
    obtenerTodos(): Piso[] {
        return [...this.pisos];
    }

    // Leer (por id)
    obtenerPorId(id: number): Piso | undefined {
        return this.pisos.find(e => e.id_piso === id);
    }

    // Actualizar
    actualizar(id: number, datos: Partial<Omit<Piso, 'id_piso'>>): Piso | undefined {
        const piso = this.pisos.find(e => e.id_piso === id);
        if (piso) {
            Object.assign(piso, datos);
            return piso;
        }
        return undefined;
    }

    // Eliminar
    eliminar(id: number): boolean {
        const idx = this.pisos.findIndex(e => e.id_piso === id);
        if (idx !== -1) {
            this.pisos.splice(idx, 1);
            return true;
        }
        return false;
    }
}

// Ejemplo de uso
const crud = new PisoCRUD();
// Ajusta las propiedades según el tipo Piso definido en '../../types/Piso'
crud.crear({ numero: 101 }); // Agrega aquí las propiedades requeridas por Piso excepto 'id_piso'
crud.crear({ numero: 102 }); // Agrega aquí las propiedades requeridas por Piso excepto 'id_piso'
console.log(crud.obtenerTodos());
crud.actualizar(1, { capacidad: 35 });
crud.eliminar(2);
console.log(crud.obtenerTodos());