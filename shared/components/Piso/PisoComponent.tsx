import React, { useState, useEffect } from 'react';
import { pisoService, initializePisoData } from './piso.component';
import { Piso } from '../../types/Piso';

// Hook personalizado para usar el servicio de Piso
const usePiso = () => {
    const [pisos, setPisos] = useState<Piso[]>([]);

    useEffect(() => {
        // Función para actualizar la lista
        const updatePisos = () => {
            setPisos(pisoService.obtenerTodos());
        };

        // Agregar listener
        pisoService.addListener(updatePisos);

        // Inicializar datos
        updatePisos();

        // Cleanup
        return () => {
            pisoService.removeListener(updatePisos);
        };
    }, []);

    return {
        pisos,
        crear: (piso: Omit<Piso, 'id_piso'>) => pisoService.crear(piso),
        actualizar: (id: number, datos: Partial<Omit<Piso, 'id_piso'>>) => pisoService.actualizar(id, datos),
        eliminar: (id: number) => pisoService.eliminar(id),
        obtenerPorId: (id: number) => pisoService.obtenerPorId(id)
    };
};

// Función auxiliar para obtener el nombre del piso
const getNombrePiso = (numero: number): string => {
    if (numero === 0) return 'Planta Baja';
    if (numero < 0) return `Sótano ${Math.abs(numero)}`;
    return `Piso ${numero}`;
};

// Función auxiliar para obtener el ícono del piso
const getIconoPiso = (numero: number): string => {
    if (numero === 0) return '🏢'; // Planta baja
    if (numero < 0) return '🅿️'; // Sótano/Parking
    if (numero <= 3) return '🏠'; // Pisos bajos
    if (numero <= 6) return '🏘️'; // Pisos medios
    return '🏗️'; // Pisos altos
};

// Función auxiliar para obtener el color según el edificio
const getColorEdificio = (idEdificio: number): string => {
    const colors = {
        1: '#e3f2fd', // Azul claro - Edificio 1
        2: '#f3e5f5', // Púrpura claro - Edificio 2
        3: '#e8f5e8', // Verde claro - Edificio 3
        4: '#fff3e0', // Naranja claro - Edificio 4
        5: '#ffebee', // Rojo claro - Edificio 5
    };
    return colors[idEdificio as keyof typeof colors] || '#f5f5f5';
};

// Componente React para Piso
const PisoComponent: React.FC = () => {
    const { pisos, crear, actualizar, eliminar } = usePiso();
    const [isInitialized, setIsInitialized] = useState(false);

    // Inicializar datos de ejemplo
    useEffect(() => {
        if (!isInitialized) {
            initializePisoData();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const handleActualizar = () => {
        actualizar(1, { numero_piso: 0 }); // Cambiar a planta baja
    };

    const handleEliminar = () => {
        eliminar(2);
    };

    const handleAgregar = () => {
        crear({ 
            numero_piso: 4,
            id_edificio: 1
        });
    };

    // Agrupar pisos por edificio
    const pisosPorEdificio = pisos.reduce((acc, piso) => {
        if (!acc[piso.id_edificio]) {
            acc[piso.id_edificio] = [];
        }
        acc[piso.id_edificio].push(piso);
        return acc;
    }, {} as Record<number, Piso[]>);

    // Ordenar pisos por número dentro de cada edificio
    Object.keys(pisosPorEdificio).forEach(edificioId => {
        pisosPorEdificio[parseInt(edificioId)].sort((a, b) => b.numero_piso - a.numero_piso);
    });

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Pisos</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleAgregar} style={{ marginRight: '10px' }}>
                    Agregar Piso
                </button>
                <button onClick={handleActualizar} style={{ marginRight: '10px' }}>
                    Actualizar Piso 1
                </button>
                <button onClick={handleEliminar}>
                    Eliminar Piso 2
                </button>
            </div>
            
            <div>
                <h3>Lista de Pisos por Edificio:</h3>
                {pisos.length === 0 ? (
                    <p>No hay pisos registrados</p>
                ) : (
                    <>
                        {/* Vista por edificios */}
                        {Object.keys(pisosPorEdificio)
                            .sort((a, b) => parseInt(a) - parseInt(b))
                            .map(edificioId => (
                            <div key={edificioId} style={{ marginBottom: '30px' }}>
                                <h4 style={{ 
                                    color: '#2c3e50', 
                                    borderBottom: '3px solid #3498db',
                                    paddingBottom: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    🏢 Edificio {edificioId} 
                                    <span style={{ 
                                        fontSize: '0.8em', 
                                        color: '#7f8c8d',
                                        fontWeight: 'normal'
                                    }}>
                                        ({pisosPorEdificio[parseInt(edificioId)].length} pisos)
                                    </span>
                                </h4>
                                
                                {/* Torre vertical de pisos */}
                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '20px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '15px',
                                    border: '2px dashed #dee2e6'
                                }}>
                                    {pisosPorEdificio[parseInt(edificioId)].map((piso, index) => (
                                        <div 
                                            key={piso.id_piso} 
                                            style={{ 
                                                width: '300px',
                                                border: '2px solid #3498db', 
                                                padding: '15px', 
                                                borderRadius: '10px',
                                                backgroundColor: getColorEdificio(piso.id_edificio),
                                                textAlign: 'center',
                                                boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                                                position: 'relative',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.02)';
                                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.15)';
                                            }}
                                        >
                                            {/* Indicador de posición en el edificio */}
                                            <div style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '10px',
                                                backgroundColor: '#3498db',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '25px',
                                                height: '25px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.8em',
                                                fontWeight: 'bold'
                                            }}>
                                                {index + 1}
                                            </div>
                                            
                                            <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>
                                                {getIconoPiso(piso.numero_piso)}
                                            </div>
                                            <p><strong>ID:</strong> {piso.id_piso}</p>
                                            <p style={{ 
                                                fontSize: '1.3em', 
                                                fontWeight: 'bold',
                                                color: '#2c3e50',
                                                margin: '8px 0'
                                            }}>
                                                {getNombrePiso(piso.numero_piso)}
                                            </p>
                                            <p><strong>Número:</strong> {piso.numero_piso}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        {/* Resumen estadístico */}
                        <div style={{ 
                            marginTop: '30px', 
                            padding: '20px', 
                            backgroundColor: '#e9ecef',
                            borderRadius: '10px',
                            border: '1px solid #ced4da'
                        }}>
                            <h4>📊 Resumen del Sistema:</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                <div style={{ textAlign: 'center', padding: '10px' }}>
                                    <div style={{ fontSize: '2em', color: '#3498db' }}>🏢</div>
                                    <strong>Total de pisos:</strong> {pisos.length}
                                </div>
                                <div style={{ textAlign: 'center', padding: '10px' }}>
                                    <div style={{ fontSize: '2em', color: '#e74c3c' }}>🏗️</div>
                                    <strong>Edificios:</strong> {Object.keys(pisosPorEdificio).length}
                                </div>
                                <div style={{ textAlign: 'center', padding: '10px' }}>
                                    <div style={{ fontSize: '2em', color: '#27ae60' }}>📈</div>
                                    <strong>Piso más alto:</strong> {Math.max(...pisos.map(p => p.numero_piso))}
                                </div>
                                <div style={{ textAlign: 'center', padding: '10px' }}>
                                    <div style={{ fontSize: '2em', color: '#f39c12' }}>📉</div>
                                    <strong>Piso más bajo:</strong> {Math.min(...pisos.map(p => p.numero_piso))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PisoComponent;
