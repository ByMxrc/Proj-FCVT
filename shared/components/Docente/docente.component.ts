import { Docente } from '../../types/Docente';
// ...resto del código...
// Componente CRUD genérico para Docente
class DocenteCRUD {
    private docentes: Docente[] = [];
    private nextId: number = 1;

    // Crear
    crear(docente: Omit<Docente, 'id_docente'>): Docente {
        const nuevo: Docente = { id_docente: this.nextId++, ...docente };
        this.docentes.push(nuevo);
        return nuevo;
    }

    // Leer (todos)
    obtenerTodos(): Docente[] {
        return [...this.docentes];
    }

    // Leer (por id)
    obtenerPorId(id: number): Docente | undefined {
        return this.docentes.find(e => e.id_docente === id);
    }

    // Actualizar
    actualizar(id: number, datos: Partial<Omit<Docente, 'id_docente'>>): Docente | undefined {
        const docente = this.docentes.find(e => e.id_docente === id);
        if (docente) {
            Object.assign(docente, datos);
            return docente;
        }
        return undefined;
    }

    // Eliminar
    eliminar(id: number): boolean {
        const idx = this.docentes.findIndex(e => e.id_docente === id);
        if (idx !== -1) {
            this.docentes.splice(idx, 1);
            return true;
        }
        return false;
    }
}

// Ejemplo de uso
const crud = new DocenteCRUD();
crud.crear({ nombre: 'Juan Pérez', correo: 'juan.perez@example.com' });
crud.crear({ nombre: 'María Gómez', correo: 'maria.gomez@example.com' });
console.log(crud.obtenerTodos());
crud.actualizar(1, { correo: 'juan.perez@nuevoemail.com' });
crud.eliminar(2);
console.log(crud.obtenerTodos());