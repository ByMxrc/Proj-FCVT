# 🎓 Sistema de Gestión Universitaria FCVT

Un sistema completo de gestión académica desarrollado con Vue 3/React, TypeScript y Supabase que permite administrar toda la infraestructura universitaria, usuarios, materias y horarios de manera eficiente y escalable.

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

- **Frontend**: Vue 3 + React (Arquitectura Híbrida)
- **Integración**: [vue-react-wrapper](https://github.com/Innei/vue-react-wrapper)
- **Backend**: Supabase (PostgreSQL + REST API)
- **Build Tool**: Vite
- **Lenguaje**: TypeScript
- **UI/UX**: CSS3 modular con sistema de componentes responsive
- **Autenticación**: Sistema propio con encriptación bcrypt

### Arquitectura Híbrida Vue + React

Este proyecto implementa una **arquitectura híbrida innovadora** que combina Vue 3 y React usando [vue-react-wrapper](https://github.com/Innei/vue-react-wrapper):

- **Vue 3**: Maneja las páginas principales, routing y estructura general
- **React**: Gestiona componentes complejos, lógica de negocio y estado
- **Integración perfecta** entre ambos frameworks sin conflictos
- **Compartición de servicios** y interfaces TypeScript

### Estructura del Proyecto

```
src/        # Componentes Vue (UI y layout)
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
├── services/            # Servicios de API y lógica de negocio (TypeScript)
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
├── pages/               # Páginas principales del sistema (Vue 3)
│   ├── LoginPage.vue    # Página de autenticación
│   ├── MenuEstudiante.vue # Portal del estudiante
│   ├── MenuAdmin.vue    # Panel de administración
│   └── components/      # Composables específicos por página
│       ├── useLogin.ts
│       ├── useMenuEstudiante.ts
│       └── useMenuAdmin.ts
├── router/              # Configuración de rutas Vue
└── styles/              # Estilos CSS modulares
```

## 🔗 Arquitectura Híbrida Vue + React

### Integración con vue-react-wrapper

Este proyecto utiliza [vue-react-wrapper](https://github.com/Innei/vue-react-wrapper) para lograr una integración perfecta entre Vue 3 y React:

#### ¿Cómo Funciona?

1. **Vue 3 como Base**: Maneja el routing, páginas principales y estructura general
2. **React como Lógica**: Gestiona componentes complejos, estado y lógica de negocio
3. **Wrapper Seamless**: vue-react-wrapper permite usar componentes React dentro de Vue sin conflictos

#### Ejemplo de Integración

```vue
<!-- Página Vue que integra React -->
<template>
  <div class="admin-panel">
    <h1>Panel de Administración</h1>
    <!-- Componente React integrado -->
    <ReactWrapper 
      :component="ReactAdminDashboard" 
      :props="dashboardProps"
      @data-update="handleDataUpdate"
    />
  </div>
</template>

<script setup>
import { ReactWrapper } from 'vue-react-wrapper'
import ReactAdminDashboard from '@/components/react/AdminDashboard'

const dashboardProps = ref({
  usuarios: usuarios.value,
  facultades: facultades.value
})
</script>
```

```tsx
// Componente React con lógica compleja
const ReactAdminDashboard: React.FC = ({ usuarios, facultades }) => {
  const { loading, error, updateData } = useAdminData()
  
  return (
    <div className="dashboard">
      <UserManagement users={usuarios} />
      <FacultyStats faculties={facultades} />
      <ComplexCharts data={processedData} />
    </div>
  )
}
```

#### Ventajas de esta Arquitectura

- **📊 Componentes React complejos**: Ideales para dashboards, tablas avanzadas y gráficos
- **🎯 Vue para páginas**: Simplicidad para routing y estructura general
- **🔄 Estado compartido**: Interfaces TypeScript funcionan en ambos frameworks
- **⚡ Performance**: Solo se carga React donde se necesita
- **🛠️ Ecosistema completo**: Acceso a librerías de ambos frameworks

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

### Composables Vue 3 + React Hooks

#### Patrón Híbrido
- **Vue Composables**: Lógica reutilizable entre componentes Vue
- **React Hooks**: Gestión de estado complejo y efectos
- **Estado reactivo** con Vue 3 Composition API y React useState/useEffect
- **Separación de responsabilidades** clara entre frameworks

#### Composables Vue Especializados
- `useLogin.ts` - Autenticación y sesiones (Vue)
- `useMenuEstudiante.ts` - Portal estudiantil (Vue)
- `useMenuAdmin.ts` - Panel administrativo (Vue)

#### React Hooks para Lógica Compleja
- `useUsuarios.tsx` - Gestión avanzada de usuarios
- `useInfraestructura.tsx` - Manejo de infraestructura jerárquica
- `useDashboard.tsx` - Analytics y estadísticas complejas

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

# Instalar dependencias (incluye vue-react-wrapper)
npm install

# Dependencias principales instaladas:
# - vue@^3.x (framework principal)
# - react@^18.x (para componentes complejos)
# - vue-react-wrapper (integración entre frameworks)
# - typescript (tipado estático)
# - vite (build tool)

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de Supabase

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

### Configuración de vue-react-wrapper

El proyecto ya incluye la configuración necesaria para vue-react-wrapper en:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    vue(),
    react(), // Soporte para React
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
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

## 🔗 Referencias y Créditos

- **[vue-react-wrapper](https://github.com/Innei/vue-react-wrapper)** - Biblioteca base para la integración Vue + React
- **[Vue 3](https://vuejs.org/)** - Framework principal para páginas y routing
- **[React](https://reactjs.org/)** - Biblioteca para componentes complejos y lógica
- **[Supabase](https://supabase.com/)** - Backend como servicio
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Vite](https://vitejs.dev/)** - Build tool y dev server
