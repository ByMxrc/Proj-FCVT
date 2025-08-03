import React, { useState, useEffect } from 'react';
import { usuarioService, initializeUsuarioData } from './usuario.component';
import { Usuario } from '../../types/Usuario';

// Hook personalizado para usar el servicio de Usuario
const useUsuario = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        // Función para actualizar la lista
        const updateUsuarios = () => {
            setUsuarios(usuarioService.obtenerTodos());
        };

        // Agregar listener
        usuarioService.addListener(updateUsuarios);

        // Inicializar datos
        updateUsuarios();

        // Cleanup
        return () => {
            usuarioService.removeListener(updateUsuarios);
        };
    }, []);

    return {
        usuarios,
        crear: (usuario: Omit<Usuario, 'id_usuario'>) => usuarioService.crear(usuario),
        actualizar: (id: number, datos: Partial<Omit<Usuario, 'id_usuario'>>) => usuarioService.actualizar(id, datos),
        eliminar: (id: number) => usuarioService.eliminar(id),
        obtenerPorId: (id: number) => usuarioService.obtenerPorId(id)
    };
};

// Función auxiliar para obtener el ícono según el rol
const getIconoRol = (rol: 'alumno' | 'profesor' | 'admin'): string => {
    switch (rol) {
        case 'alumno': return '🎓';
        case 'profesor': return '👨‍🏫';
        case 'admin': return '⚙️';
        default: return '👤';
    }
};

// Función auxiliar para obtener el color según el rol
const getColorRol = (rol: 'alumno' | 'profesor' | 'admin'): string => {
    switch (rol) {
        case 'alumno': return '#e3f2fd';
        case 'profesor': return '#f3e5f5';
        case 'admin': return '#ffebee';
        default: return '#f5f5f5';
    }
};

// Función auxiliar para calcular la edad
const calcularEdad = (fechaNacimiento: Date): number => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
};

// Función auxiliar para formatear fecha
const formatearFecha = (fecha: Date): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Componente React para Usuario
const UsuarioComponent: React.FC = () => {
    const { usuarios, crear, actualizar, eliminar } = useUsuario();
    const [isInitialized, setIsInitialized] = useState(false);
    const [filtroRol, setFiltroRol] = useState<'todos' | 'alumno' | 'profesor' | 'admin'>('todos');
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<Usuario | null>(null);
    
    // Estado del formulario
    const [formData, setFormData] = useState({
        cedula: '',
        nombres: '',
        apellidos: '',
        correo: '',
        contraseña: '',
        fecha_nacimiento: '',
        edad: 0,
        rol: 'alumno' as 'alumno' | 'profesor' | 'admin'
    });

    // Inicializar datos de ejemplo
    useEffect(() => {
        if (!isInitialized) {
            initializeUsuarioData();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    // Limpiar formulario
    const limpiarFormulario = () => {
        setFormData({
            cedula: '',
            nombres: '',
            apellidos: '',
            correo: '',
            contraseña: '',
            fecha_nacimiento: '',
            edad: 0,
            rol: 'alumno'
        });
        setEditingUser(null);
        setShowForm(false);
    };

    // Manejar cambios en inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'edad' ? parseInt(value) || 0 : value
        }));
    };

    // Manejar envío del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingUser) {
            // Actualizar usuario existente
            actualizar(editingUser.id_usuario, {
                ...formData,
                fecha_nacimiento: new Date(formData.fecha_nacimiento)
            });
        } else {
            // Crear nuevo usuario
            crear({
                ...formData,
                fecha_nacimiento: new Date(formData.fecha_nacimiento)
            });
        }
        
        limpiarFormulario();
    };

    // Iniciar edición
    const iniciarEdicion = (usuario: Usuario) => {
        setEditingUser(usuario);
        setFormData({
            cedula: usuario.cedula,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            contraseña: usuario.contraseña,
            fecha_nacimiento: usuario.fecha_nacimiento.toISOString().split('T')[0],
            edad: usuario.edad,
            rol: usuario.rol
        });
        setShowForm(true);
    };

    // Eliminar usuario
    const eliminarUsuario = (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            eliminar(id);
        }
    };

    // Filtrar usuarios por rol
    const usuariosFiltrados = filtroRol === 'todos' 
        ? usuarios 
        : usuarios.filter(usuario => usuario.rol === filtroRol);

    // Agrupar usuarios por rol
    const usuariosPorRol = usuarios.reduce((acc, usuario) => {
        if (!acc[usuario.rol]) {
            acc[usuario.rol] = [];
        }
        acc[usuario.rol].push(usuario);
        return acc;
    }, {} as Record<string, Usuario[]>);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Usuarios</h2>
            
            {/* Botones de acción */}
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={() => setShowForm(true)} 
                    style={{ 
                        marginRight: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    ➕ Nuevo Usuario
                </button>
                
                {showForm && (
                    <button 
                        onClick={limpiarFormulario}
                        style={{ 
                            padding: '10px 20px',
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        ❌ Cancelar
                    </button>
                )}
            </div>

            {/* Formulario de creación/edición */}
            {showForm && (
                <div style={{ 
                    marginBottom: '30px', 
                    padding: '20px', 
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    border: '2px solid #3498db'
                }}>
                    <h3>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Cédula:
                                </label>
                                <input
                                    type="text"
                                    name="cedula"
                                    value={formData.cedula}
                                    onChange={handleInputChange}
                                    required
                                    style={{ 
                                        width: '100%', 
                                        padding: '8px', 
                                        borderRadius: '5px', 
                                        border: '1px solid #ccc',
                                        fontSize: '14px'
                                    }}
                                    placeholder="Ej: 1234567890"
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Nombres:
                                </label>
                                <input
                                    type="text"
                                    name="nombres"
                                    value={formData.nombres}
                                    onChange={handleInputChange}
                                    required
                                    style={{ 
                                        width: '100%', 
                                        padding: '8px', 
                                        borderRadius: '5px', 
                                        border: '1px solid #ccc',
                                        fontSize: '14px'
                                    }}
                                    placeholder="Ej: Juan Carlos"
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Apellidos:
                                </label>
                                <input
                                    type="text"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleInputChange}
                                    required
                                    style={{ 
                                        width: '100%', 
                                        padding: '8px', 
                                        borderRadius: '5px', 
                                        border: '1px solid #ccc',
                                        fontSize: '14px'
                                    }}
                                    placeholder="Ej: Pérez González"
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Correo:
                                </label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleInputChange}
                                    required
                                    style={{ 
                                        width: '100%', 
                                        padding: '8px', 
                                        borderRadius: '5px', 
                                        border: '1px solid #ccc',
                                        fontSize: '14px'
                                    }}
                                    placeholder="Ej: juan@universidad.edu.ec"
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Contraseña:
                                </label>
                                <input
                                    type="password"
                                    name="contraseña"
                                    value={formData.contraseña}
                                    onChange={handleInputChange}
                                    required
                                    style={{ 
                                        width: '100%', 
                                        padding: '8px', 
                                        borderRadius: '5px', 
                                        border: '1px solid #ccc',
                                        fontSize: '14px'
                                    }}
                                    placeholder="Ingrese contraseña"
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Fecha de Nacimiento:
                                </label>
                                <input
                                    type="date"
                                    name="fecha_nacimiento"
                                    value={formData.fecha_nacimiento}
                                    onChange={handleInputChange}
                                    required
                                    style={{ 
                                        width: '100%', 
                                        padding: '8px', 
                                        borderRadius: '5px', 
                                        border: '1px solid #ccc',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Edad:
                                </label>
                                <input
                                    type="number"
                                    name="edad"
                                    value={formData.edad}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    max="100"
                                    style={{ 
                                        width: '100%', 
                                        padding: '8px', 
                                        borderRadius: '5px', 
                                        border: '1px solid #ccc',
                                        fontSize: '14px'
                                    }}
                                    placeholder="Ej: 25"
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Rol:
                                </label>
                                <select
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleInputChange}
                                    required
                                    style={{ 
                                        width: '100%', 
                                        padding: '8px', 
                                        borderRadius: '5px', 
                                        border: '1px solid #ccc',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="alumno">🎓 Alumno</option>
                                    <option value="profesor">👨‍🏫 Profesor</option>
                                    <option value="admin">⚙️ Administrador</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <button 
                                type="submit"
                                style={{ 
                                    padding: '12px 30px',
                                    backgroundColor: '#27ae60',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    marginRight: '10px'
                                }}
                            >
                                {editingUser ? '✏️ Actualizar' : '➕ Crear Usuario'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filtros */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filtrar por rol:</label>
                <select 
                    value={filtroRol} 
                    onChange={(e) => setFiltroRol(e.target.value as any)}
                    style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    <option value="todos">Todos los roles</option>
                    <option value="alumno">Alumnos</option>
                    <option value="profesor">Profesores</option>
                    <option value="admin">Administradores</option>
                </select>
                <span style={{ marginLeft: '15px', color: '#666' }}>
                    ({usuariosFiltrados.length} usuarios mostrados)
                </span>
            </div>
            
            <div>
                <h3>Lista de Usuarios:</h3>
                {usuarios.length === 0 ? (
                    <p>No hay usuarios registrados</p>
                ) : (
                    <>
                        {/* Tarjetas de usuarios */}
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                            gap: '20px',
                            marginBottom: '30px'
                        }}>
                            {usuariosFiltrados.map(usuario => (
                                <div 
                                    key={usuario.id_usuario} 
                                    style={{ 
                                        border: '2px solid #3498db', 
                                        padding: '20px', 
                                        borderRadius: '15px',
                                        backgroundColor: getColorRol(usuario.rol),
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        transition: 'all 0.3s ease',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                                    }}
                                >
                                    {/* Badge del rol */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        backgroundColor: '#3498db',
                                        color: 'white',
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.8em',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}>
                                        {getIconoRol(usuario.rol)} {usuario.rol}
                                    </div>

                                    {/* Avatar */}
                                    <div style={{ 
                                        textAlign: 'center', 
                                        marginBottom: '15px' 
                                    }}>
                                        <div style={{ 
                                            fontSize: '3em', 
                                            marginBottom: '10px' 
                                        }}>
                                            {getIconoRol(usuario.rol)}
                                        </div>
                                    </div>

                                    {/* Información personal */}
                                    <div style={{ marginBottom: '15px' }}>
                                        <h4 style={{ 
                                            margin: '0 0 10px 0', 
                                            color: '#2c3e50',
                                            fontSize: '1.2em' 
                                        }}>
                                            {usuario.nombres} {usuario.apellidos}
                                        </h4>
                                        <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                                            <strong>ID:</strong> {usuario.id_usuario}
                                        </p>
                                        <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                                            <strong>Cédula:</strong> {usuario.cedula}
                                        </p>
                                    </div>

                                    {/* Información de contacto */}
                                    <div style={{ marginBottom: '15px' }}>
                                        <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                                            <strong>📧 Email:</strong> {usuario.correo}
                                        </p>
                                        <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                                            <strong>🎂 Nacimiento:</strong> {formatearFecha(usuario.fecha_nacimiento)}
                                        </p>
                                        <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                                            <strong>👤 Edad:</strong> {calcularEdad(usuario.fecha_nacimiento)} años
                                        </p>
                                    </div>

                                    {/* Botones de acción */}
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '10px', 
                                        justifyContent: 'center',
                                        marginTop: '15px',
                                        paddingTop: '15px',
                                        borderTop: '1px solid #dee2e6'
                                    }}>
                                        <button
                                            onClick={() => iniciarEdicion(usuario)}
                                            style={{
                                                padding: '8px 15px',
                                                backgroundColor: '#f39c12',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => eliminarUsuario(usuario.id_usuario)}
                                            style={{
                                                padding: '8px 15px',
                                                backgroundColor: '#e74c3c',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen estadístico */}
                        <div style={{ 
                            marginTop: '30px', 
                            padding: '20px', 
                            backgroundColor: '#f8f9fa',
                            borderRadius: '10px',
                            border: '1px solid #dee2e6'
                        }}>
                            <h4>📊 Estadísticas del Sistema:</h4>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                gap: '20px',
                                marginTop: '15px'
                            }}>
                                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '2.5em', color: '#3498db' }}>👥</div>
                                    <strong>Total:</strong> {usuarios.length} usuarios
                                </div>
                                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '2.5em', color: '#2ecc71' }}>🎓</div>
                                    <strong>Alumnos:</strong> {usuariosPorRol['alumno']?.length || 0}
                                </div>
                                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '2.5em', color: '#9b59b6' }}>👨‍🏫</div>
                                    <strong>Profesores:</strong> {usuariosPorRol['profesor']?.length || 0}
                                </div>
                                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '2.5em', color: '#e74c3c' }}>⚙️</div>
                                    <strong>Admins:</strong> {usuariosPorRol['admin']?.length || 0}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UsuarioComponent;
