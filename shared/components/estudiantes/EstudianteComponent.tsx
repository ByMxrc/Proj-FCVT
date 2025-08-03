import React, { useState, useEffect } from 'react';
import { estudianteService, initializeEstudianteData } from './estudiante.component';
import { Estudiante } from '../../types/Estudiante';

// Hook personalizado para usar el servicio de Estudiante
const useEstudiante = () => {
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

    useEffect(() => {
        // Función para actualizar la lista
        const updateEstudiantes = () => {
            setEstudiantes(estudianteService.obtenerTodos());
        };

        // Agregar listener
        estudianteService.addListener(updateEstudiantes);

        // Inicializar datos
        updateEstudiantes();

        // Cleanup
        return () => {
            estudianteService.removeListener(updateEstudiantes);
        };
    }, []);

    return {
        estudiantes,
        crear: (estudiante: Omit<Estudiante, 'id_estudiante'>) => estudianteService.crear(estudiante),
        actualizar: (id: number, datos: Partial<Omit<Estudiante, 'id_estudiante'>>) => estudianteService.actualizar(id, datos),
        eliminar: (id: number) => estudianteService.eliminar(id),
        obtenerPorId: (id: number) => estudianteService.obtenerPorId(id)
    };
};

// Componente React para Estudiante
const EstudianteComponent: React.FC = () => {
    const { estudiantes, crear, actualizar, eliminar } = useEstudiante();
    const [isInitialized, setIsInitialized] = useState(false);

    // Inicializar datos de ejemplo
    useEffect(() => {
        if (!isInitialized) {
            initializeEstudianteData();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const handleActualizar = () => {
        actualizar(1, { carrera: 'Ingeniería Mecánica' });
    };

    const handleEliminar = () => {
        eliminar(2);
    };

    const handleAgregar = () => {
        crear({ 
            cedula: 1111111111,
            carrera: 'Derecho'
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Estudiantes</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleAgregar} style={{ marginRight: '10px' }}>
                    Agregar Estudiante
                </button>
                <button onClick={handleActualizar} style={{ marginRight: '10px' }}>
                    Actualizar Estudiante 1
                </button>
                <button onClick={handleEliminar}>
                    Eliminar Estudiante 2
                </button>
            </div>
            
            <div>
                <h3>Lista de Estudiantes:</h3>
                {estudiantes.length === 0 ? (
                    <p>No hay estudiantes registrados</p>
                ) : (
                    estudiantes.map(estudiante => (
                        <div 
                            key={estudiante.id_estudiante} 
                            style={{ 
                                border: '1px solid #ccc', 
                                padding: '10px', 
                                margin: '10px 0',
                                borderRadius: '5px'
                            }}
                        >
                            <p><strong>ID:</strong> {estudiante.id_estudiante}</p>
                            <p><strong>Cédula:</strong> {estudiante.cedula}</p>
                            <p><strong>Carrera:</strong> {estudiante.carrera}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EstudianteComponent;
