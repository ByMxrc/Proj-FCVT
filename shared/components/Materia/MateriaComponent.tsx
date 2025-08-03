import React, { useState, useEffect } from 'react';
import { materiaService, initializeMateriaData } from './materia.component';
import { Materia } from '../../types/Materia';

// Hook personalizado para usar el servicio de Materia
const useMateria = () => {
    const [materias, setMaterias] = useState<Materia[]>([]);

    useEffect(() => {
        // Función para actualizar la lista
        const updateMaterias = () => {
            setMaterias(materiaService.obtenerTodos());
        };

        // Agregar listener
        materiaService.addListener(updateMaterias);

        // Inicializar datos
        updateMaterias();

        // Cleanup
        return () => {
            materiaService.removeListener(updateMaterias);
        };
    }, []);

    return {
        materias,
        crear: (materia: Omit<Materia, 'id_materia'>) => materiaService.crear(materia),
        actualizar: (id: number, datos: Partial<Omit<Materia, 'id_materia'>>) => materiaService.actualizar(id, datos),
        eliminar: (id: number) => materiaService.eliminar(id),
        obtenerPorId: (id: number) => materiaService.obtenerPorId(id)
    };
};

// Función auxiliar para obtener el color según el nivel
const getNivelColor = (nivel: number): string => {
    const colors = {
        1: '#e3f2fd', // Azul claro para nivel 1
        2: '#f3e5f5', // Púrpura claro para nivel 2
        3: '#e8f5e8', // Verde claro para nivel 3
        4: '#fff3e0', // Naranja claro para nivel 4
    };
    return colors[nivel as keyof typeof colors] || '#f5f5f5';
};

// Componente React para Materia
const MateriaComponent: React.FC = () => {
    const { materias, crear, actualizar, eliminar } = useMateria();
    const [isInitialized, setIsInitialized] = useState(false);

    // Inicializar datos de ejemplo
    useEffect(() => {
        if (!isInitialized) {
            initializeMateriaData();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const handleActualizar = () => {
        actualizar(1, { nivel: 2, paralelo: 'B' });
    };

    const handleEliminar = () => {
        eliminar(2);
    };

    const handleAgregar = () => {
        crear({ 
            nombre: 'Programación Web',
            nivel: 3,
            paralelo: 'A'
        });
    };

    // Agrupar materias por nivel
    const materiasPorNivel = materias.reduce((acc, materia) => {
        if (!acc[materia.nivel]) {
            acc[materia.nivel] = [];
        }
        acc[materia.nivel].push(materia);
        return acc;
    }, {} as Record<number, Materia[]>);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Materias</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleAgregar} style={{ marginRight: '10px' }}>
                    Agregar Materia
                </button>
                <button onClick={handleActualizar} style={{ marginRight: '10px' }}>
                    Actualizar Materia 1
                </button>
                <button onClick={handleEliminar}>
                    Eliminar Materia 2
                </button>
            </div>
            
            <div>
                <h3>Lista de Materias:</h3>
                {materias.length === 0 ? (
                    <p>No hay materias registradas</p>
                ) : (
                    <>
                        {/* Vista por nivel */}
                        {Object.keys(materiasPorNivel)
                            .sort((a, b) => parseInt(a) - parseInt(b))
                            .map(nivel => (
                            <div key={nivel} style={{ marginBottom: '20px' }}>
                                <h4 style={{ 
                                    color: '#2c3e50', 
                                    borderBottom: '2px solid #3498db',
                                    paddingBottom: '5px'
                                }}>
                                    Nivel {nivel}
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {materiasPorNivel[parseInt(nivel)].map(materia => (
                                        <div 
                                            key={materia.id_materia} 
                                            style={{ 
                                                border: '1px solid #ddd', 
                                                padding: '15px', 
                                                borderRadius: '8px',
                                                backgroundColor: getNivelColor(materia.nivel),
                                                minWidth: '250px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <p><strong>ID:</strong> {materia.id_materia}</p>
                                            <p><strong>Nombre:</strong> {materia.nombre}</p>
                                            <p><strong>Nivel:</strong> {materia.nivel}</p>
                                            <p><strong>Paralelo:</strong> {materia.paralelo}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        {/* Resumen */}
                        <div style={{ 
                            marginTop: '30px', 
                            padding: '15px', 
                            backgroundColor: '#f8f9fa',
                            borderRadius: '5px',
                            border: '1px solid #dee2e6'
                        }}>
                            <h4>Resumen:</h4>
                            <p><strong>Total de materias:</strong> {materias.length}</p>
                            <p><strong>Niveles disponibles:</strong> {Object.keys(materiasPorNivel).sort().join(', ')}</p>
                            <p><strong>Paralelos:</strong> {[...new Set(materias.map(m => m.paralelo))].sort().join(', ')}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MateriaComponent;
