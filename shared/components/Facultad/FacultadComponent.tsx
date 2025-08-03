import React, { useState, useEffect } from 'react';
import { facultadService, initializeFacultadData } from './facultad.component';
import { Facultad } from '../../types/Facultad';

// Hook personalizado para usar el servicio de Facultad
const useFacultad = () => {
    const [facultades, setFacultades] = useState<Facultad[]>([]);

    useEffect(() => {
        // Función para actualizar la lista
        const updateFacultades = () => {
            setFacultades(facultadService.obtenerTodos());
        };

        // Agregar listener
        facultadService.addListener(updateFacultades);

        // Inicializar datos
        updateFacultades();

        // Cleanup
        return () => {
            facultadService.removeListener(updateFacultades);
        };
    }, []);

    return {
        facultades,
        crear: (facultad: Omit<Facultad, 'id_facultad'>) => facultadService.crear(facultad),
        actualizar: (id: number, datos: Partial<Omit<Facultad, 'id_facultad'>>) => facultadService.actualizar(id, datos),
        eliminar: (id: number) => facultadService.eliminar(id),
        obtenerPorId: (id: number) => facultadService.obtenerPorId(id)
    };
};

// Componente React para Facultad
const FacultadComponent: React.FC = () => {
    const { facultades, crear, actualizar, eliminar } = useFacultad();
    const [isInitialized, setIsInitialized] = useState(false);

    // Inicializar datos de ejemplo
    useEffect(() => {
        if (!isInitialized) {
            initializeFacultadData();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const handleActualizar = () => {
        actualizar(1, { nombre_facultad: 'Facultad de Ingeniería Actualizada' });
    };

    const handleEliminar = () => {
        eliminar(2);
    };

    const handleAgregar = () => {
        crear({ 
            nombre_facultad: 'Facultad de Ciencias'
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Facultades</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleAgregar} style={{ marginRight: '10px' }}>
                    Agregar Facultad
                </button>
                <button onClick={handleActualizar} style={{ marginRight: '10px' }}>
                    Actualizar Facultad 1
                </button>
                <button onClick={handleEliminar}>
                    Eliminar Facultad 2
                </button>
            </div>
            
            <div>
                <h3>Lista de Facultades:</h3>
                {facultades.length === 0 ? (
                    <p>No hay facultades registradas</p>
                ) : (
                    facultades.map(facultad => (
                        <div 
                            key={facultad.id_facultad} 
                            style={{ 
                                border: '1px solid #ccc', 
                                padding: '10px', 
                                margin: '10px 0',
                                borderRadius: '5px'
                            }}
                        >
                            <p><strong>ID:</strong> {facultad.id_facultad}</p>
                            <p><strong>Nombre:</strong> {facultad.nombre_facultad}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FacultadComponent;
