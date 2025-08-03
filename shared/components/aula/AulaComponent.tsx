import React, { useState, useEffect } from 'react';
import { aulaService, initializeAulaData } from './aula.component';
import { Aula } from '../../types/Aula';

// Hook personalizado para usar el servicio de Aula
const useAula = () => {
    const [aulas, setAulas] = useState<Aula[]>([]);

    useEffect(() => {
        // Función para actualizar la lista
        const updateAulas = () => {
            setAulas(aulaService.obtenerTodos());
        };

        // Agregar listener
        aulaService.addListener(updateAulas);

        // Inicializar datos
        updateAulas();

        // Cleanup
        return () => {
            aulaService.removeListener(updateAulas);
        };
    }, []);

    return {
        aulas,
        crear: (aula: Omit<Aula, 'id_aula'>) => aulaService.crear(aula),
        actualizar: (id: number, datos: Partial<Omit<Aula, 'id_aula'>>) => aulaService.actualizar(id, datos),
        eliminar: (id: number) => aulaService.eliminar(id),
        obtenerPorId: (id: number) => aulaService.obtenerPorId(id)
    };
};

// Componente React para Aula
const AulaComponent: React.FC = () => {
    const { aulas, crear, actualizar, eliminar } = useAula();
    const [isInitialized, setIsInitialized] = useState(false);

    // Inicializar datos de ejemplo
    useEffect(() => {
        if (!isInitialized) {
            initializeAulaData();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const handleActualizar = () => {
        actualizar(1, { nombre_aula: 'Aula 101 - Renovada' });
    };

    const handleEliminar = () => {
        eliminar(2);
    };

    const handleAgregar = () => {
        crear({ 
            nombre_aula: 'Aula 301',
            id_piso: 3
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Aulas</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleAgregar} style={{ marginRight: '10px' }}>
                    Agregar Aula
                </button>
                <button onClick={handleActualizar} style={{ marginRight: '10px' }}>
                    Actualizar Aula 1
                </button>
                <button onClick={handleEliminar}>
                    Eliminar Aula 2
                </button>
            </div>
            
            <div>
                <h3>Lista de Aulas:</h3>
                {aulas.length === 0 ? (
                    <p>No hay aulas registradas</p>
                ) : (
                    aulas.map(aula => (
                        <div 
                            key={aula.id_aula} 
                            style={{ 
                                border: '1px solid #ccc', 
                                padding: '10px', 
                                margin: '10px 0',
                                borderRadius: '5px'
                            }}
                        >
                            <p><strong>ID:</strong> {aula.id_aula}</p>
                            <p><strong>Nombre:</strong> {aula.nombre_aula}</p>
                            <p><strong>Piso:</strong> {aula.id_piso}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AulaComponent;
