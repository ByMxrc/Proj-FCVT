import React, { useState, useEffect } from 'react';
import { horarioService, initializeHorarioData } from './horario.component';
import { Horario } from '../../types/Horario';

// Hook personalizado para usar el servicio de Horario
const useHorario = () => {
    const [horarios, setHorarios] = useState<Horario[]>([]);

    useEffect(() => {
        // Función para actualizar la lista
        const updateHorarios = () => {
            setHorarios(horarioService.obtenerTodos());
        };

        // Agregar listener
        horarioService.addListener(updateHorarios);

        // Inicializar datos
        updateHorarios();

        // Cleanup
        return () => {
            horarioService.removeListener(updateHorarios);
        };
    }, []);

    return {
        horarios,
        crear: (horario: Omit<Horario, 'id_horario'>) => horarioService.crear(horario),
        actualizar: (id: string, datos: Partial<Omit<Horario, 'id_horario'>>) => horarioService.actualizar(id, datos),
        eliminar: (id: string) => horarioService.eliminar(id),
        obtenerPorId: (id: string) => horarioService.obtenerPorId(id)
    };
};

// Función auxiliar para formatear fecha y hora
const formatDateTime = (date: Date): string => {
    return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Componente React para Horario
const HorarioComponent: React.FC = () => {
    const { horarios, crear, actualizar, eliminar } = useHorario();
    const [isInitialized, setIsInitialized] = useState(false);

    // Inicializar datos de ejemplo
    useEffect(() => {
        if (!isInitialized) {
            initializeHorarioData();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const handleActualizar = () => {
        actualizar('H1', { descripcion: 'Álgebra Lineal' });
    };

    const handleEliminar = () => {
        eliminar('H2');
    };

    const handleAgregar = () => {
        crear({ 
            inicio: new Date('2025-08-03T16:30:00'),
            fin: new Date('2025-08-03T18:30:00'),
            descripcion: 'Seminario de Investigación'
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Horarios</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleAgregar} style={{ marginRight: '10px' }}>
                    Agregar Horario
                </button>
                <button onClick={handleActualizar} style={{ marginRight: '10px' }}>
                    Actualizar Horario H1
                </button>
                <button onClick={handleEliminar}>
                    Eliminar Horario H2
                </button>
            </div>
            
            <div>
                <h3>Lista de Horarios:</h3>
                {horarios.length === 0 ? (
                    <p>No hay horarios registrados</p>
                ) : (
                    horarios.map(horario => (
                        <div 
                            key={horario.id_horario} 
                            style={{ 
                                border: '1px solid #ccc', 
                                padding: '15px', 
                                margin: '10px 0',
                                borderRadius: '5px',
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            <p><strong>ID:</strong> {horario.id_horario}</p>
                            <p><strong>Descripción:</strong> {horario.descripcion}</p>
                            <p><strong>Inicio:</strong> {formatDateTime(horario.inicio)}</p>
                            <p><strong>Fin:</strong> {formatDateTime(horario.fin)}</p>
                            <p><strong>Duración:</strong> {formatTime(horario.inicio)} - {formatTime(horario.fin)}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HorarioComponent;
