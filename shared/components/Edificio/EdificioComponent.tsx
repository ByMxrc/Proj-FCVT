import React, { useState, useEffect } from 'react';
import { edificioService, initializeEdificioData } from './edificio.component';
import { Edificio } from '../../types/Edificio';

// Hook personalizado para usar el servicio de Edificio
const useEdificio = () => {
    const [edificios, setEdificios] = useState<Edificio[]>([]);

    useEffect(() => {
        // Función para actualizar la lista
        const updateEdificios = () => {
            setEdificios(edificioService.obtenerTodos());
        };

        // Agregar listener
        edificioService.addListener(updateEdificios);

        // Inicializar datos
        updateEdificios();

        // Cleanup
        return () => {
            edificioService.removeListener(updateEdificios);
        };
    }, []);

    return {
        edificios,
        crear: (edificio: Omit<Edificio, 'id_edificio'>) => edificioService.crear(edificio),
        actualizar: (id: number, datos: Partial<Omit<Edificio, 'id_edificio'>>) => edificioService.actualizar(id, datos),
        eliminar: (id: number) => edificioService.eliminar(id),
        obtenerPorId: (id: number) => edificioService.obtenerPorId(id)
    };
};

// Componente React para Edificio
const EdificioComponent: React.FC = () => {
    const { edificios, crear, actualizar, eliminar } = useEdificio();
    const [isInitialized, setIsInitialized] = useState(false);

    // Inicializar datos de ejemplo
    useEffect(() => {
        if (!isInitialized) {
            initializeEdificioData();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const handleActualizar = () => {
        actualizar(1, { nombre_edificio: 'Edificio Principal Actualizado' });
    };

    const handleEliminar = () => {
        eliminar(2);
    };

    const handleAgregar = () => {
        crear({ 
            nombre_edificio: 'Edificio de Arte',
            id_facultad: 3
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Edificios</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleAgregar} style={{ marginRight: '10px' }}>
                    Agregar Edificio
                </button>
                <button onClick={handleActualizar} style={{ marginRight: '10px' }}>
                    Actualizar Edificio 1
                </button>
                <button onClick={handleEliminar}>
                    Eliminar Edificio 2
                </button>
            </div>
            
            <div>
                <h3>Lista de Edificios:</h3>
                {edificios.length === 0 ? (
                    <p>No hay edificios registrados</p>
                ) : (
                    edificios.map(edificio => (
                        <div 
                            key={edificio.id_edificio} 
                            style={{ 
                                border: '1px solid #ccc', 
                                padding: '10px', 
                                margin: '10px 0',
                                borderRadius: '5px'
                            }}
                        >
                            <p><strong>ID:</strong> {edificio.id_edificio}</p>
                            <p><strong>Nombre:</strong> {edificio.nombre_edificio}</p>
                            <p><strong>ID Facultad:</strong> {edificio.id_facultad}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EdificioComponent;
