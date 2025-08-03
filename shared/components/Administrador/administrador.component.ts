import { Administrador } from '../../types/Administrador';
// Componente CRUD genérico para Administrador
export class AdministradorCRUD {
    private administradores: Administrador[] = [];
    private nextId: number = 1;

    // Crear
    crear(administrador: Omit<Administrador, 'id_administrador'>): Administrador {
        const nuevo: Administrador = { id_administrador: this.nextId++, ...administrador };
        this.administradores.push(nuevo);
        return nuevo;
    }

    // Leer (todos)
    obtenerTodos(): Administrador[] {
        return [...this.administradores];
    }

    // Leer (por id)
    obtenerPorId(id: number): Administrador | undefined {
        return this.administradores.find(e => e.id_administrador === id);
    }

    // Actualizar
    actualizar(id: number, datos: Partial<Omit<Administrador, 'id_administrador'>>): Administrador | undefined {
        const administrador = this.administradores.find(e => e.id_administrador === id);
        if (administrador) {
            Object.assign(administrador, datos);
            return administrador;
        }
        return undefined;
    }

    // Eliminar
    eliminar(id: number): boolean {
        const idx = this.administradores.findIndex(e => e.id_administrador === id);
        if (idx !== -1) {
            this.administradores.splice(idx, 1);
            return true;
        }
        return false;
    }
}

// Ejemplo de uso
const crud = new AdministradorCRUD();
crud.crear({ cedula: 12345678, carrera: 'Ingeniería' });
crud.crear({ cedula: 87654321, carrera: 'Medicina' });
console.log(crud.obtenerTodos());
crud.actualizar(1, { carrera: 'Arquitectura' });
crud.eliminar(2);
console.log(crud.obtenerTodos());