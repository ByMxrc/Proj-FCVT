import React, { useState, useEffect } from 'react';
import { paraleloService, initializeParaleloData } from './paralelo.component';
import { Paralelo } from '../../types/Paralelo';

// Hook personalizado para usar el servicio de Paralelo
const useParalelo = () => {
    const [paralelos, setParalelos] = useState<Paralelo[]>([]);

    useEffect(() => {
        // Función para actualizar la lista
        const updateParalelos = () => {
            setParalelos(paraleloService.obtenerTodos());
        };

        // Agregar listener
        paraleloService.addListener(updateParalelos);

        // Inicializar datos
        updateParalelos();

        // Cleanup
        return () => {
            paraleloService.removeListener(updateParalelos);
        };
    }, []);

    return {
        paralelos,
        crear: (paralelo: Omit<Paralelo, 'id_paralelo'>) => paraleloService.crear(paralelo),
        actualizar: (id: number, datos: Partial<Omit<Paralelo, 'id_paralelo'>>) => paraleloService.actualizar(id, datos),
        eliminar: (id: number) => paraleloService.eliminar(id),
        obtenerPorId: (id: number) => paraleloService.obtenerPorId(id)
    };
};

// Función auxiliar para obtener el color según la letra del paralelo
const getParaleloColor = (nombre: string): string => {
    const letra = nombre.charAt(nombre.length - 1).toUpperCase();
    const colors = {
        'A': '#ffebee', // Rojo claro
        'B': '#e3f2fd', // Azul claro
        'C': '#e8f5e8', // Verde claro
        'D': '#fff3e0', // Naranja claro
        'E': '#f3e5f5', // Púrpura claro
        'F': '#fffde7', // Amarillo claro
    };
    return colors[letra as keyof typeof colors] || '#f5f5f5';
};

// Función auxiliar para obtener el ícono según la letra del paralelo
const getParaleloIcon = (nombre: string): string => {
    const letra = nombre.charAt(nombre.length - 1).toUpperCase();
    const icons = {
        'A': '🅰️',
        'B': '🅱️', 
        'C': '©️',
        'D': '🇩',
        'E': '🇪',
        'F': '🇫',
    };
    return icons[letra as keyof typeof icons] || '📝';
};

// Componente React para Paralelo
const ParaleloComponent: React.FC = () => {
    const { paralelos, crear, actualizar, eliminar } = useParalelo();
    const [isInitialized, setIsInitialized] = useState(false);

    // Inicializar datos de ejemplo
    useEffect(() => {
        if (!isInitialized) {
            initializeParaleloData();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const handleActualizar = () => {
        actualizar(1, { nombre_paralelo: 'Paralelo A - Grupo Avanzado' });
    };

    const handleEliminar = () => {
        eliminar(2);
    };

    const handleAgregar = () => {
        crear({ 
            nombre_paralelo: 'Paralelo E'
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Paralelos</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleAgregar} style={{ marginRight: '10px' }}>
                    Agregar Paralelo
                </button>
                <button onClick={handleActualizar} style={{ marginRight: '10px' }}>
                    Actualizar Paralelo 1
                </button>
                <button onClick={handleEliminar}>
                    Eliminar Paralelo 2
                </button>
            </div>
            
            <div>
                <h3>Lista de Paralelos:</h3>
                {paralelos.length === 0 ? (
                    <p>No hay paralelos registrados</p>
                ) : (
                    <>
                        {/* Vista en grid de paralelos */}
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                            gap: '15px',
                            marginBottom: '30px'
                        }}>
                            {paralelos.map(paralelo => (
                                <div 
                                    key={paralelo.id_paralelo} 
                                    style={{ 
                                        border: '2px solid #ddd', 
                                        padding: '20px', 
                                        borderRadius: '12px',
                                        backgroundColor: getParaleloColor(paralelo.nombre_paralelo),
                                        textAlign: 'center',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.2s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <div style={{ fontSize: '2em', marginBottom: '10px' }}>
                                        {getParaleloIcon(paralelo.nombre_paralelo)}
                                    </div>
                                    <p><strong>ID:</strong> {paralelo.id_paralelo}</p>
                                    <p style={{ 
                                        fontSize: '1.2em', 
                                        fontWeight: 'bold',
                                        color: '#2c3e50',
                                        margin: '10px 0'
                                    }}>
                                        {paralelo.nombre_paralelo}
                                    </p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Vista de tabla alternativa */}
                        <div style={{ 
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6'
                        }}>
                            <h4>Vista de Tabla:</h4>
                            <table style={{ 
                                width: '100%', 
                                borderCollapse: 'collapse',
                                backgroundColor: 'white',
                                borderRadius: '5px',
                                overflow: 'hidden'
                            }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
                                        <th style={{ padding: '12px', textAlign: 'center' }}>Ícono</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paralelos.map((paralelo, index) => (
                                        <tr key={paralelo.id_paralelo} style={{ 
                                            backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                                        }}>
                                            <td style={{ padding: '12px' }}>{paralelo.id_paralelo}</td>
                                            <td style={{ padding: '12px' }}>{paralelo.nombre_paralelo}</td>
                                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '1.5em' }}>
                                                {getParaleloIcon(paralelo.nombre_paralelo)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Resumen */}
                        <div style={{ 
                            marginTop: '20px', 
                            padding: '15px', 
                            backgroundColor: '#e9ecef',
                            borderRadius: '5px',
                            border: '1px solid #ced4da'
                        }}>
                            <h4>Resumen:</h4>
                            <p><strong>Total de paralelos:</strong> {paralelos.length}</p>
                            <p><strong>Paralelos disponibles:</strong> {paralelos.map(p => p.nombre_paralelo.split(' ').pop()).join(', ')}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ParaleloComponent;
