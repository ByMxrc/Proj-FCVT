# 🎓 Sistema de Gestión Universitaria FCVT

Un sistema completo de gestión académica desarrollado con Vue 3, TypeScript y Supabase que permite administrar toda la infraestructura universitaria, usuarios, materias y horarios de manera eficiente y escalable.

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

- **Frontend**: Vue 3 + Composition API + TypeScript
- **Backend**: Supabase (PostgreSQL + REST API)
- **Build Tool**: Vite
- **UI/UX**: CSS3 modular con sistema de componentes responsive
- **Autenticación**: Sistema propio con encriptación bcrypt

### Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
├── interfaces/           # Interfaces TypeScript del dominio
│   ├── Usuario.ts       # Interface para usuarios y roles
│   ├── Facultad.ts      # Interface para facultades
│   ├── Edificio.ts      # Interface para edificios
│   ├── Piso.ts          # Interface para pisos
│   ├── Aula.ts          # Interface para aulas
│   ├── Materia.ts       # Interface para materias
│   ├── Horario.ts       # Interface para horarios y calendarios
│   ├── Paralelo.ts      # Interface para paralelos/grupos
│   ├── Matricula.ts     # Interface para matrículas
│   ├── Estudiante.ts    # Interface específica para estudiantes
│   ├── Docente.ts       # Interface específica para docentes
│   ├── Administrador.ts # Interface específica para administradores
│   └── index.ts         # Exportación centralizada
├── services/            # Servicios de API y lógica de negocio
│   ├── UsuarioService.ts
│   ├── FacultadService.ts
│   ├── EdificioService.ts
│   ├── PisoService.ts
│   ├── AulaService.ts
│   ├── MateriaService.ts
│   ├── HorarioService.ts
│   ├── ParaleloService.ts
│   ├── MatriculaService.ts
│   ├── EstudianteService.ts
│   ├── DocenteService.ts
│   ├── AdministradorService.ts
│   └── index.ts
├── pages/               # Páginas principales del sistema
│   ├── LoginPage.vue    # Página de autenticación
│   ├── MenuEstudiante.vue # Portal del estudiante
│   ├── MenuAdmin.vue    # Panel de administración
│   └── components/      # Composables específicos por página
│       ├── useLogin.ts
│       ├── useMenuEstudiante.ts
│       └── useMenuAdmin.ts
├── router/              # Configuración de rutas
└── styles/              # Estilos CSS modulares
```

## 🎯 Funcionalidades Principales

### 👤 Sistema de Autenticación y Usuarios

- **Login seguro** con validación de credenciales
- **Gestión de roles**: Estudiante, Docente, Administrador
- **Perfiles de usuario** con información completa
- **Encriptación de contraseñas** con bcrypt
- **Sesiones persistentes** con localStorage

### 🏢 Gestión de Infraestructura Jerárquica

#### Estructura Organizacional
- **Facultades** → **Edificios** → **Pisos** → **Aulas**
- Navegación jerárquica con filtros inteligentes
- CRUD completo para cada nivel de infraestructura
- Validaciones de integridad referencial

#### Características Avanzadas
- **Modales contextuales** que muestran la jerarquía completa
- **Filtros dinámicos** por facultad, edificio y piso
- **Formateo inteligente** de números de piso (Planta Baja, 1er Piso, etc.)
- **Selección cascada** en formularios de creación

### 📚 Gestión Académica

#### Materias y Horarios
- **CRUD de materias** por semestre
- **Sistema de horarios completo** con:
  - Asignación de docentes
  - Ubicación específica (facultad → edificio → piso → aula)
  - Días de la semana y rangos horarios
  - Paralelos/grupos
  - Validación de conflictos

#### Matrículas y Estudiantes
- **Sistema de matrículas** por estudiante y materia
- **Seguimiento académico** por semestre
- **Historial de inscripciones**

### 🎓 Portal del Estudiante

#### Dashboard Personalizado
- **Calendario académico interactivo** con materias del día
- **Vista semanal** de horarios personalizados
- **Modal de detalles** emergente al hacer clic en materias
- **Información completa** por materia:
  - Nombre de la materia y semestre
  - Docente asignado (con nombres reales)
  - Ubicación exacta (facultad, edificio, piso, aula)
  - Horario específico
  - Paralelo asignado

#### Características UX
- **Interfaz responsive** adaptable a diferentes dispositivos
- **Navegación intuitiva** con breadcrumbs
- **Filtros por fecha** y navegación temporal
- **Estados de carga** y feedback visual

### ⚙️ Panel de Administración

#### Dashboard Ejecutivo
- **Estadísticas del sistema** en tiempo real
- **Métricas clave**: usuarios totales, materias activas, aulas disponibles
- **Información consolidada** por facultades

#### Gestión Avanzada de Usuarios
- **CRUD completo** de usuarios con todos los roles
- **Búsqueda y filtrado** por nombre, rol, cédula
- **Sincronización automática** de docentes
- **Validaciones de integridad** de datos

#### Gestión de Horarios Completa
- **Creación de horarios** con selección jerárquica de ubicación
- **Asignación de docentes** con lista de disponibles
- **Gestión de paralelos** y grupos
- **Validación de horarios** y conflictos
- **Vista consolidada** de todos los horarios

## 🔧 Arquitectura Técnica

### Interfaces TypeScript

El sistema utiliza un robusto sistema de interfaces TypeScript que define:

#### Interfaces de Dominio
```typescript
// Usuario base con sistema de roles
interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: 'estudiante' | 'docente' | 'administrador' | null;
  // ... más campos
}

// Infraestructura jerárquica
interface Facultad {
  id_facultad: number;
  nombre_facultad: string;
}

interface Edificio {
  id_edificio: number;
  nombre_edificio: string;
  id_facultad: number;
}

// Horarios con relaciones complejas
interface Horario {
  id_horario: number;
  id_materia: number;
  id_docente: number;
  id_aula: number;
  dia_semana: DiaSemanaEnum;
  hora_inicio: string;
  hora_fin: string;
}
```

### Servicios y API

#### Patrón Service Layer
- **Abstracción de datos** con servicios especializados
- **Operaciones CRUD** estandarizadas
- **Manejo de errores** centralizado
- **Queries complejas** con joins múltiples

#### Integración con Supabase
- **REST API** completa con autenticación
- **Queries optimizadas** con selects específicos
- **Relaciones complejas** entre tablas
- **Estrategias de fallback** para datos faltantes

### Composables Vue 3

#### Patrón Composable
- **Lógica reutilizable** entre componentes
- **Estado reactivo** con Vue 3 Composition API
- **Separación de responsabilidades** clara
- **Testing más sencillo** y mantenible

#### Composables Especializados
- `useLogin.ts` - Autenticación y sesiones
- `useMenuEstudiante.ts` - Portal estudiantil
- `useMenuAdmin.ts` - Panel administrativo

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm/yarn
- Cuenta de Supabase configurada
- Base de datos PostgreSQL con schema universitario

### Instalación

```bash
# Clonar el repositorio
git clone [repository-url]
cd Vue3-React

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de Supabase

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

### Configuración de Base de Datos

El sistema requiere las siguientes tablas en Supabase:
- `usuario` - Usuarios del sistema
- `estudiante`, `docente`, `administrador` - Roles específicos
- `facultad`, `edificio`, `piso`, `aula` - Infraestructura
- `materia`, `paralelo`, `horario` - Académico
- `matricula` - Relaciones estudiante-materia

## 📱 Características de la Interfaz

### Diseño Responsive
- **Mobile-first approach** para dispositivos móviles
- **Breakpoints adaptativos** para tablet y desktop
- **Navegación optimizada** para touch y mouse

### Sistema de Modales
- **Modales contextuales** con información jerárquica
- **Formularios dinámicos** según el contexto
- **Validación en tiempo real** con feedback visual

### Experiencia de Usuario
- **Loading states** durante operaciones async
- **Error handling** con mensajes descriptivos
- **Feedback visual** para acciones del usuario
- **Navegación intuitiva** con breadcrumbs y filtros

## 🔒 Seguridad y Performance

### Seguridad
- **Autenticación robusta** con tokens seguros
- **Validación de roles** en frontend y backend
- **Sanitización de inputs** para prevenir XSS
- **Encriptación de contraseñas** con bcrypt

### Performance
- **Lazy loading** de componentes pesados
- **Queries optimizadas** con selects específicos
- **Cache de datos** en estado local
- **Bundling optimizado** con Vite

## 🎯 Casos de Uso Principales

1. **Estudiante consulta su horario**
   - Login → Portal Estudiante → Ver calendario → Click en materia → Ver detalles completos

2. **Administrador crea nueva infraestructura**
   - Login → Panel Admin → Infraestructura → Seleccionar tipo → Modal contextual → Crear

3. **Administrador programa horario**
   - Login → Panel Admin → Horarios → Crear → Selección jerárquica de ubicación → Guardar

4. **Docente consulta sus clases asignadas**
   - Login → Sistema muestra horarios donde está asignado como docente

## 🔄 Estado del Proyecto

### Completado ✅
- Sistema de autenticación completo
- Portal del estudiante funcional
- Panel de administración completo
- Gestión de infraestructura jerárquica
- Sistema de horarios con modales contextuales
- Integración completa con Supabase

### En Desarrollo 🔄
- Módulo de reportes académicos
- Sistema de notificaciones
- API para aplicación móvil

### Futuras Mejoras 📋
- Dashboard analítico con gráficos
- Sistema de calificaciones
- Módulo de asistencia
- Integración con sistemas externos

---

**Desarrollado para la Facultad de Ciencias y Tecnología** | **Universidad Tecnológica**

1. **UsuarioPage.vue** - Página que envuelve la gestión de usuarios
2. **MainApp.vue** - Aplicación principal con navegación

## 🚀 Cómo Funciona la Integración

### 1. Componente Vue envuelve React
```vue
<template>
  <div class="vue-wrapper">
    <h1>{{ pageTitle }}</h1>
    <ReactWrapper 
      :component="ReactUsuarioManager" 
      :props="reactProps"
      @usuario-select="handleUsuarioSelect"
    />
  </div>
</template>
```

### 2. React maneja toda la lógica
```tsx
const ReactUsuarioManager: React.FC = () => {
  const { usuarios, loading, error, deleteUsuario } = useUsuarios();
  
  return (
    <UsuarioList 
      usuarios={usuarios}
      onDelete={deleteUsuario}
      // ... más lógica
    />
  );
};
```

### 3. Servicios compartidos
```typescript
// Los servicios son TypeScript puro, usables desde React y Vue
export const usuarioService = {
  getAllUsuarios: () => Promise<Usuario[]>,
  createUsuario: (data: CreateUsuario) => Promise<Usuario>,
  // ... más métodos
};
```

## 🎯 Ventajas de esta Arquitectura

### ✅ Separación de Responsabilidades
- **Vue**: Solo se encarga del layout y navegación
- **React**: Maneja toda la lógica de negocio y estado

### ✅ Reutilización de Código
- Los hooks y componentes React son totalmente reutilizables
- Los servicios TypeScript funcionan en ambos frameworks

### ✅ Flexibilidad
- Fácil agregar nuevas páginas Vue que usen componentes React
- Posibilidad de migrar gradualmente entre frameworks

### ✅ Tipado Fuerte
- Interfaces TypeScript compartidas entre Vue y React
- IntelliSense completo en ambos ecosistemas

## 📦 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🔄 Cómo Agregar Nuevas Funcionalidades

### 1. Crear un nuevo Hook React
```typescript
// src/hooks/useNuevaEntidad.ts
export const useNuevaEntidad = () => {
  const [entidades, setEntidades] = useState([]);
  // ... lógica del hook
  return { entidades, crear, actualizar, eliminar };
};
```

### 2. Crear Componentes React
```tsx
// src/components/react/NuevaEntidadList.tsx
const NuevaEntidadList: React.FC = () => {
  const { entidades } = useNuevaEntidad();
  return <div>{/* Renderizar lista */}</div>;
};
```

### 3. Crear Página Vue
```vue
<!-- src/components/NuevaEntidadPage.vue -->
<template>
  <div>
    <h1>{{ titulo }}</h1>
    <ReactWrapper :component="NuevaEntidadManager" />
  </div>
</template>
```

## 🌐 API y Servicios

El proyecto se conecta a Supabase para datos reales. Cada servicio incluye:

- Operaciones CRUD completas
- Manejo de errores
- Tipado TypeScript
- Métodos de filtrado y búsqueda

## 🎨 Estilos y UI

- **Vue**: Maneja estilos de layout y navegación
- **React**: Estilos de componentes con CSS-in-JS
- Diseño responsivo y moderno
- Gradientes y animaciones suaves

## 🔍 Próximos Pasos

1. Agregar más entidades (Estudiantes, Docentes, Materias, Horarios)
2. Implementar formularios React para creación/edición
3. Agregar sistema de routing Vue
4. Implementar autenticación
5. Agregar tests unitarios

---

Esta arquitectura demuestra cómo combinar lo mejor de ambos frameworks, manteniendo Vue para la estructura de páginas y React para la lógica compleja de negocio.
