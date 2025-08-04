# Sistema de Gestión Universitaria - Vue 3 + React

Este proyecto implementa una arquitectura híbrida innovadora que combina **Vue 3** y **React** de manera eficiente, donde:

- **React**: Maneja la lógica de negocio (componentes, hooks, servicios)
- **Vue 3**: Se enfoca únicamente en la interfaz visual de las páginas

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
src/
├── components/           # Componentes Vue (solo UI)
│   ├── react/           # Componentes React (lógica)
│   ├── UsuarioPage.vue  # Página Vue que envuelve React
│   └── MainApp.vue      # Aplicación principal
├── hooks/               # Hooks de React para lógica de estado
│   ├── useUsuarios.ts   # Hook para gestión de usuarios
│   └── useFacultades.ts # Hook para gestión de facultades
├── services/            # Servicios de API (TypeScript puro)
├── types/              # Interfaces TypeScript compartidas
└── main.ts             # Punto de entrada
```

### Tecnologías Utilizadas

- **Vue 3** (Composition API)
- **React 19** con hooks
- **TypeScript** para tipado estático
- **Vite** para bundling
- **vue-react-wrapper** para integración
- **Supabase** como backend

## 🔧 Características Implementadas

### Componentes React (Lógica de Negocio)

1. **UsuarioCard.tsx** - Tarjeta para mostrar información de usuario
2. **UsuarioList.tsx** - Lista completa de usuarios con acciones
3. **ReactUsuarioManager.tsx** - Gestor principal de usuarios
4. **FacultadCard.tsx** - Tarjeta para facultades

### Hooks React (Estado y Lógica)

1. **useUsuarios** - Gestión completa de usuarios (CRUD)
2. **useFacultades** - Gestión completa de facultades (CRUD)

### Componentes Vue (Interfaz Visual)

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
