import { Usuario} from '../../types/Usuario';
// ...resto del código...
// Componente CRUD genérico para Usuario
class UsuarioCRUD {
    private usuarios: Usuario[] = [];
    private nextId: number = 1;

    // Crear
    crear(usuario: Omit<Usuario, 'id_usuario'>): Usuario {
        const nuevo: Usuario = { id_usuario: this.nextId++, ...usuario };
        this.usuarios.push(nuevo);
        return nuevo;
    }

    // Leer (todos)
    obtenerTodos(): Usuario[] {
        return [...this.usuarios];
    }

    // Leer (por id)
    obtenerPorId(id: number): Usuario | undefined {
        return this.usuarios.find(e => e.id_usuario === id);
    }

    // Actualizar
    actualizar(id: number, datos: Partial<Omit<Usuario, 'id_usuario'>>): Usuario | undefined {
        const usuario = this.usuarios.find(e => e.id_usuario === id);
        if (usuario) {
            Object.assign(usuario, datos);
            return usuario;
        }
        return undefined;
    }

    // Eliminar
    eliminar(id: number): boolean {
        const idx = this.usuarios.findIndex(e => e.id_usuario === id);
        if (idx !== -1) {
            this.usuarios.splice(idx, 1);
            return true;
        }
        return false;
    }
}

// Ejemplo de uso
const crud = new UsuarioCRUD();
crud.crear({ cedula: '12345678', nombre: 'Juan Pérez' });
crud.crear({ cedula: '87654321', nombre: 'María Gómez' });
console.log(crud.obtenerTodos());
crud.actualizar(1, { nombres: 'Juan Pérez' });
crud.eliminar(2);
console.log(crud.obtenerTodos());