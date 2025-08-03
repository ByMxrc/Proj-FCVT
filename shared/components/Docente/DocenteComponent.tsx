import React, { useState, useEffect } from 'react';
import { docenteService, initializeDocenteData } from './docente.component';
import { Docente } from '../../types/Docente';

// Hook personalizado para usar el servicio de Docente
const useDocente = () => {
    const [docentes, setDocentes] = useState<Docente[]>([]);

    useEffect(() => {
        // Función para actualizar la lista
        const updateDocentes = () => {
            setDocentes(docenteService.obtenerTodos());
        };

        // Agregar listener
        docenteService.addListener(updateDocentes);

        // Inicializar datos
        updateDocentes();

        // Cleanup
        return () => {
            docenteService.removeListener(updateDocentes);
        };
    }, []);

    return {
        docentes,
        crear: (docente: Omit<Docente, 'id_docente'>) => docenteService.crear(docente),
        actualizar: (id: number, datos: Partial<Omit<Docente, 'id_docente'>>) => docenteService.actualizar(id, datos),
        eliminar: (id: number) => docenteService.eliminar(id),
        obtenerPorId: (id: number) => docenteService.obtenerPorId(id)
    };
};

// Componente React para Docente
const DocenteComponent: React.FC = () => {
    const { docentes, crear, actualizar, eliminar } = useDocente();
    const [isInitialized, setIsInitialized] = useState(false);

    // Inicializar datos de ejemplo
    useEffect(() => {
        if (!isInitialized) {
            initializeDocenteData();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const handleActualizar = () => {
        actualizar(1, { materia: 'Cálculo Diferencial' });
    };

    const handleEliminar = () => {
        eliminar(2);
    };

    const handleAgregar = () => {
        crear({ 
            materia: 'Historia del Arte'
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Docentes</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleAgregar} style={{ marginRight: '10px' }}>
                    Agregar Docente
                </button>
                <button onClick={handleActualizar} style={{ marginRight: '10px' }}>
                    Actualizar Docente 1
                </button>
                <button onClick={handleEliminar}>
                    Eliminar Docente 2
                </button>
            </div>
            
            <div>
                <h3>Lista de Docentes:</h3>
                {docentes.length === 0 ? (
                    <p>No hay docentes registrados</p>
                ) : (
                    docentes.map(docente => (
                        <div 
                            key={docente.id_docente} 
                            style={{ 
                                border: '1px solid #ccc', 
                                padding: '10px', 
                                margin: '10px 0',
                                borderRadius: '5px'
                            }}
                        >
                            <p><strong>ID:</strong> {docente.id_docente}</p>
                            <p><strong>Materia:</strong> {docente.materia}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DocenteComponent;
