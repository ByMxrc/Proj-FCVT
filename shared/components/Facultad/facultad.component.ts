import { Facultad } from '../../types/Facultad';
// ...resto del código...
// Componente CRUD genérico para Facultad
class FacultadCRUD {
    private facultades: Facultad[] = [];
    private nextId: number = 1;

    // Crear
    crear(facultad: Omit<Facultad, 'id_facultad'>): Facultad {
        const nuevo: Facultad = { id_facultad: this.nextId++, ...facultad };
        this.facultades.push(nuevo);
        return nuevo;
    }

    // Leer (todos)
    obtenerTodos(): Facultad[] {
        return [...this.facultades];
    }

    // Leer (por id)
    obtenerPorId(id: number): Facultad | undefined {
        return this.facultades.find(e => e.id_facultad === id);
    }

    // Actualizar
    actualizar(id: number, datos: Partial<Omit<Facultad, 'id_facultad'>>): Facultad | undefined {
        const facultad = this.facultades.find(e => e.id_facultad === id);
        if (facultad) {
            Object.assign(facultad, datos);
            return facultad;
        }
        return undefined;
    }

    // Eliminar
    eliminar(id: number): boolean {
        const idx = this.facultades.findIndex(e => e.id_facultad === id);
        if (idx !== -1) {
            this.facultades.splice(idx, 1);
            return true;
        }
        return false;
    }
}

// Ejemplo de uso
const crud = new FacultadCRUD();
crud.crear({ nombre_facultad: 'Facultad de Ingeniería', ubicacion: 'Edificio A' });
crud.crear({ nombre_facultad: 'Facultad de Medicina', ubicacion: 'Edificio B' });
console.log(crud.obtenerTodos());
crud.actualizar(1, { ubicacion: 'Edificio C' }); // Asegúrate de que 'ubicacion' existe en el tipo Facultad
crud.eliminar(2);
console.log(crud.obtenerTodos());