<template>
  <div class="admin-container">
    <!-- Header -->
    <div class="admin-header">
      <div class="header-content">
        <div class="breadcrumb">
          <span class="breadcrumb-separator">|</span>
          <span class="current-page">Panel de Administración</span>
        </div>
        
        <div class="user-section">
          <div class="user-info">
            <span class="admin-name">{{ adminData.name }}</span>
            <span class="admin-role">Administrador</span>
          </div>
          
          <button @click="logout" class="logout-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation Bar -->
    <nav class="admin-navbar">
      <div class="navbar-content">
        <div class="nav-sections">
          <button 
            v-for="section in navSections" 
            :key="section.id"
            @click="setActiveSection(section.id)"
            :class="['nav-section', { active: activeSection === section.id }]"
          >
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="section.id === 'dashboard'" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <path v-else-if="section.id === 'usuarios'" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle v-if="section.id === 'usuarios'" cx="9" cy="7" r="4"></circle>
                <path v-else-if="section.id === 'infraestructura'" d="M3 21h18"></path>
                <path v-if="section.id === 'infraestructura'" d="M5 21V7l8-4v18"></path>
                <path v-if="section.id === 'infraestructura'" d="M19 21V11l-6-4"></path>
                <path v-else-if="section.id === 'materias'" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path v-if="section.id === 'materias'" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                <path v-else-if="section.id === 'horarios'" d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"></path>
                <circle v-if="section.id === 'horarios'" cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <span class="nav-label">{{ section.label }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <div class="admin-content">
      <!-- Dashboard Overview -->
      <div v-if="activeSection === 'dashboard'" class="dashboard-section">
        <div class="welcome-section">
          <h1>Panel de Administración</h1>
          <p>Control total del sistema académico universitario</p>
        </div>

        <!-- System Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon users">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ systemStats.totalUsers }}</span>
              <span class="stat-label">Usuarios Totales</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon courses">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ systemStats.activeCourses }}</span>
              <span class="stat-label">Materias Activas</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon facilities">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 21h18"></path>
                <path d="M5 21V7l8-4v18"></path>
                <path d="M19 21V11l-6-4"></path>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ systemStats.facilities }}</span>
              <span class="stat-label">Aulas Disponibles</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon faculties">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ systemStats.facultiesCount }}</span>
              <span class="stat-label">Facultades</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Dynamic Content Sections -->
      <div v-if="activeSection === 'usuarios'" class="crud-section">
        <div class="section-header">
          <h2>Gestión de Usuarios</h2>
          <button @click="abrirModalCrearUsuario" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Agregar Usuario
          </button>
        </div>

        <!-- Filtros de usuarios -->
        <div class="filters-section">
          <div class="search-box">
            <input 
              v-model="busquedaUsuarios" 
              placeholder="Buscar usuarios..." 
              class="search-input"
            />
          </div>
          <select v-model="filtroRolUsuarios" class="filter-select">
            <option value="">Todos los roles</option>
            <option value="estudiante">Estudiantes</option>
            <option value="docente">Docentes</option>
            <option value="administrador">Administradores</option>
            <option value="null">Sin rol</option>
          </select>
        </div>

        <!-- Tabla de usuarios -->
        <div class="table-container">
          <table class="crud-table">
            <thead>
              <tr>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>Cédula</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuariosFiltrados" :key="usuario.id_usuario">
                <td>{{ usuario.nombres }}</td>
                <td>{{ usuario.apellidos }}</td>
                <td>{{ usuario.correo }}</td>
                <td>{{ usuario.cedula }}</td>
                <td>
                  <span :class="['role-badge', usuario.rol]">
                    {{ formatRol(usuario.rol) }}
                  </span>
                </td>
                <td class="actions">
                  <button @click="editarUsuario(usuario)" class="btn-edit">Editar</button>
                  <button @click="eliminarUsuario(usuario)" class="btn-delete">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Infraestructura Management Section -->
      <div v-if="activeSection === 'infraestructura'" class="crud-section">
        <div class="section-header">
          <h2>Gestión de Infraestructura</h2>
        </div>

        <!-- Navegación de infraestructura -->
        <div class="filters-section">
          <select v-model="tipoInfraestructuraActivo" class="filter-select">
            <option value="facultades">Facultades</option>
            <option value="edificios">Edificios</option>
            <option value="pisos">Pisos</option>
            <option value="aulas">Aulas</option>
          </select>
          
          <button 
            @click="abrirModalCrearInfraestructura(tipoInfraestructuraActivo)" 
            class="btn-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Agregar {{ obtenerNombreSingular(tipoInfraestructuraActivo) }}
          </button>
        </div>

        <!-- Filtros jerárquicos -->
        <div v-if="tipoInfraestructuraActivo !== 'facultades'" class="filters-section">
          <!-- Filtros para Edificios -->
          <select v-if="tipoInfraestructuraActivo === 'edificios'" v-model="facultadSeleccionada" class="filter-select">
            <option value="">Mostrar todas las facultades</option>
            <option v-for="facultad in facultades" :key="facultad.id_facultad" :value="facultad.id_facultad">
              {{ facultad.nombre_facultad }}
            </option>
          </select>
          
          <!-- Filtros para Pisos -->
          <template v-if="tipoInfraestructuraActivo === 'pisos'">
            <select v-model="facultadSeleccionada" class="filter-select">
              <option value="">Mostrar todas las facultades</option>
              <option v-for="facultad in facultades" :key="facultad.id_facultad" :value="facultad.id_facultad">
                {{ facultad.nombre_facultad }}
              </option>
            </select>
            
            <select v-model="edificioSeleccionado" class="filter-select">
              <option value="">Mostrar todos los edificios</option>
              <option v-for="edificio in edificiosFiltrados" :key="edificio.id_edificio" :value="edificio.id_edificio">
                {{ edificio.nombre_edificio }}
              </option>
            </select>
          </template>
          
          <!-- Filtros para Aulas -->
          <template v-if="tipoInfraestructuraActivo === 'aulas'">
            <select v-model="facultadSeleccionada" class="filter-select">
              <option value="">Mostrar todas las facultades</option>
              <option v-for="facultad in facultades" :key="facultad.id_facultad" :value="facultad.id_facultad">
                {{ facultad.nombre_facultad }}
              </option>
            </select>
            
            <select v-model="edificioSeleccionado" class="filter-select">
              <option value="">Mostrar todos los edificios</option>
              <option v-for="edificio in edificiosFiltrados" :key="edificio.id_edificio" :value="edificio.id_edificio">
                {{ edificio.nombre_edificio }}
              </option>
            </select>
            
            <select v-model="pisoSeleccionado" class="filter-select">
              <option value="">Mostrar todos los pisos</option>
              <option v-for="piso in pisosFiltrados" :key="piso.id_piso" :value="piso.id_piso">
                {{ formatearNumeroPiso(piso.numero_piso) }}
              </option>
            </select>
          </template>
        </div>

        <!-- Tabla de Facultades -->
        <div v-if="tipoInfraestructuraActivo === 'facultades'" class="table-container">
          <table class="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="facultad in facultades" :key="facultad.id_facultad">
                <td>{{ facultad.id_facultad }}</td>
                <td>{{ facultad.nombre_facultad }}</td>
                <td class="actions">
                  <button class="btn-edit">Editar</button>
                  <button class="btn-delete">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tabla de Edificios -->
        <div v-if="tipoInfraestructuraActivo === 'edificios'" class="table-container">
          <table class="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Facultad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="edificio in edificiosFiltrados" :key="edificio.id_edificio">
                <td>{{ edificio.id_edificio }}</td>
                <td>{{ edificio.nombre_edificio }}</td>
                <td>{{ facultades.find(f => f.id_facultad === edificio.id_facultad)?.nombre_facultad }}</td>
                <td class="actions">
                  <button class="btn-edit">Editar</button>
                  <button class="btn-delete">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tabla de Pisos -->
        <div v-if="tipoInfraestructuraActivo === 'pisos'" class="table-container">
          <table class="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Número</th>
                <th>Edificio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="piso in pisosFiltrados" :key="piso.id_piso">
                <td>{{ piso.id_piso }}</td>
                <td>{{ formatearNumeroPiso(piso.numero_piso) }}</td>
                <td>{{ edificios.find(e => e.id_edificio === piso.id_edificio)?.nombre_edificio }}</td>
                <td class="actions">
                  <button class="btn-edit">Editar</button>
                  <button class="btn-delete">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tabla de Aulas -->
        <div v-if="tipoInfraestructuraActivo === 'aulas'" class="table-container">
          <table class="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Piso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aula in aulasFiltradas" :key="aula.id_aula">
                <td>{{ aula.id_aula }}</td>
                <td>{{ aula.nombre_aula }}</td>
                <td>{{ formatearNumeroPiso(pisos.find(p => p.id_piso === aula.id_piso)?.numero_piso || 0) }}</td>
                <td class="actions">
                  <button class="btn-edit">Editar</button>
                  <button class="btn-delete">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal para Infraestructura -->
      <div v-if="mostrarModalInfraestructura" class="modal-overlay" @click="cerrarModalInfraestructura">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ modoEdicionInfraestructura ? 'Editar' : 'Crear' }} {{ obtenerNombreSingular(tipoInfraestructuraActivo) }}</h3>
            <button @click="cerrarModalInfraestructura" class="modal-close">&times;</button>
          </div>
          <form @submit.prevent="guardarInfraestructura" class="modal-form">
            <!-- Formulario Facultad -->
            <div v-if="tipoInfraestructuraActivo === 'facultades'" class="form-grid">
              <div class="form-group">
                <label>Nombre de la Facultad</label>
                <input v-model="formularioFacultad.nombre_facultad" type="text" required />
              </div>
            </div>

            <!-- Formulario Edificio -->
            <div v-if="tipoInfraestructuraActivo === 'edificios'" class="form-grid">
              <div class="form-group">
                <label>Nombre del Edificio</label>
                <input v-model="formularioEdificio.nombre_edificio" type="text" required />
              </div>
              <div class="form-group">
                <label>Facultad</label>
                <select v-model="formularioEdificio.id_facultad" required>
                  <option value="">Seleccionar Facultad</option>
                  <option v-for="facultad in facultades" :key="facultad.id_facultad" :value="facultad.id_facultad">
                    {{ facultad.nombre_facultad }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Formulario Piso -->
            <div v-if="tipoInfraestructuraActivo === 'pisos'" class="form-grid">
              <div class="form-group">
                <label>Número de Piso</label>
                <select v-model="formularioPiso.numero_piso" required>
                  <option value="">Seleccionar Piso</option>
                  <option v-for="opcion in opcionesPisos" :key="opcion.valor" :value="opcion.valor">
                    {{ opcion.texto }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Edificio</label>
                <select v-model="formularioPiso.id_edificio" required>
                  <option value="">Seleccionar Edificio</option>
                  <option v-for="edificio in edificios" :key="edificio.id_edificio" :value="edificio.id_edificio">
                    {{ edificio.nombre_edificio }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Formulario Aula -->
            <div v-if="tipoInfraestructuraActivo === 'aulas'" class="form-grid">
              <div class="form-group">
                <label>Nombre del Aula</label>
                <input v-model="formularioAula.nombre_aula" type="text" required />
              </div>
              <div class="form-group">
                <label>Piso</label>
                <select v-model="formularioAula.id_piso" required>
                  <option value="">Seleccionar Piso</option>
                  <option v-for="piso in pisos" :key="piso.id_piso" :value="piso.id_piso">
                    {{ formatearNumeroPiso(piso.numero_piso) }} - {{ edificios.find(e => e.id_edificio === piso.id_edificio)?.nombre_edificio }}
                  </option>
                </select>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="cerrarModalInfraestructura" class="btn-secondary">Cancelar</button>
              <button type="submit" :disabled="guardandoInfraestructura" class="btn-primary">
                {{ guardandoInfraestructura ? 'Guardando...' : (modoEdicionInfraestructura ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Gestión de Materias -->
      <div v-if="activeSection === 'materias'" class="crud-section">
        <div class="section-header">
          <h2>Gestión de Materias</h2>
          <button @click="abrirModalCrearMateria" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Agregar Materia
          </button>
        </div>

        <!-- Tabla de Materias -->
        <div class="table-container">
          <table class="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Materia</th>
                <th>Semestre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="materia in materias" :key="materia.id_materia">
                <td>{{ materia.id_materia }}</td>
                <td>{{ materia.nombre_materia }}</td>
                <td>{{ materia.semestre }}°</td>
                <td class="actions">
                  <button @click="editarMateria(materia)" class="btn-edit">Editar</button>
                  <button @click="eliminarMateria(materia)" class="btn-delete">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal para Materias -->
      <div v-if="mostrarModalMateria" class="modal-overlay" @click="cerrarModalMateria">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ modoEdicionMateria ? 'Editar Materia' : 'Crear Materia' }}</h3>
            <button @click="cerrarModalMateria" class="modal-close">&times;</button>
          </div>
          <form @submit.prevent="guardarMateria" class="modal-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre de la Materia</label>
                <input v-model="formularioMateria.nombre_materia" type="text" required placeholder="Ej: Matemáticas I" />
              </div>
              <div class="form-group">
                <label>Semestre</label>
                <select v-model="formularioMateria.semestre" required>
                  <option value="0">Seleccionar Semestre</option>
                  <option v-for="semestre in semestresDisponibles" :key="semestre" :value="semestre">
                    {{ semestre }}° Semestre
                  </option>
                </select>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="cerrarModalMateria" class="btn-secondary">Cancelar</button>
              <button type="submit" :disabled="guardandoMateria" class="btn-primary">
                {{ guardandoMateria ? 'Guardando...' : (modoEdicionMateria ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Gestión de Horarios -->
      <div v-if="activeSection === 'horarios'" class="crud-section">
        <div class="section-header">
          <h2>Gestión de Horarios</h2>
          <button @click="abrirModalCrearHorario" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Crear Horario
          </button>
        </div>

        <!-- Tabla de Horarios -->
        <div class="table-container">
          <table class="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Materia</th>
                <th>Docente</th>
                <th>Paralelo</th>
                <th>Día</th>
                <th>Hora</th>
                <th>Aula</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="horario in horarios" :key="horario.id_horario">
                <td>{{ horario.id_horario }}</td>
                <td>{{ materias.find(m => m.id_materia === horario.id_materia)?.nombre_materia || 'N/A' }}</td>
                <td>{{ obtenerNombreDocente(horario.id_docente) }}</td>
                <td>{{ paralelos.find(p => p.id_paralelo === horario.id_paralelo)?.nombre_paralelo || 'N/A' }}</td>
                <td>{{ horario.dia_semana.charAt(0).toUpperCase() + horario.dia_semana.slice(1) }}</td>
                <td>{{ horario.hora_inicio }} - {{ horario.hora_fin }}</td>
                <td>{{ aulas.find(a => a.id_aula === horario.id_aula)?.nombre_aula || 'N/A' }}</td>
                <td class="actions">
                  <button @click="editarHorario(horario)" class="btn-edit">Editar</button>
                  <button @click="eliminarHorario(horario)" class="btn-delete">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal para Horarios -->
      <div v-if="mostrarModalHorario" class="modal-overlay" @click="cerrarModalHorario">
        <div class="modal-content modal-large" @click.stop>
          <div class="modal-header">
            <h3>{{ modoEdicionHorario ? 'Editar Horario' : 'Crear Horario' }}</h3>
            <button @click="cerrarModalHorario" class="modal-close">&times;</button>
          </div>
          <form @submit.prevent="guardarHorario" class="modal-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Materia</label>
                <select v-model="formularioHorario.id_materia" required>
                  <option value="">Seleccionar Materia</option>
                  <option v-for="materia in materias" :key="materia.id_materia" :value="materia.id_materia">
                    {{ materia.nombre_materia }} ({{ materia.semestre }}° Semestre)
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Docente</label>
                <select v-model="formularioHorario.id_docente" required>
                  <option value="">Seleccionar Docente</option>
                  <option v-for="docente in docentesDisponibles" :key="docente.id_usuario" :value="docente.id_usuario">
                    {{ docente.nombres }} {{ docente.apellidos }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Paralelo</label>
                <select v-model="formularioHorario.id_paralelo">
                  <option value="">Seleccionar Paralelo</option>
                  <option v-for="paralelo in paralelos" :key="paralelo.id_paralelo" :value="paralelo.id_paralelo">
                    {{ paralelo.nombre_paralelo }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Día de la Semana</label>
                <select v-model="formularioHorario.dia_semana" required>
                  <option value="">Seleccionar Día</option>
                  <option v-for="dia in diasSemana" :key="dia" :value="dia">
                    {{ dia.charAt(0).toUpperCase() + dia.slice(1) }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Hora de Inicio</label>
                <select v-model="formularioHorario.hora_inicio" required>
                  <option value="">Seleccionar Hora</option>
                  <option v-for="hora in horariosDisponibles" :key="hora" :value="hora">
                    {{ hora }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Hora de Fin</label>
                <select v-model="formularioHorario.hora_fin" required>
                  <option value="">Seleccionar Hora</option>
                  <option v-for="hora in horariosDisponibles" :key="hora" :value="hora">
                    {{ hora }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Selección de Ubicación Jerárquica -->
            <div class="location-section">
              <h4>Ubicación del Aula</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Facultad</label>
                  <select v-model="formularioHorario.id_facultad" required>
                    <option value="">Seleccionar Facultad</option>
                    <option v-for="facultad in facultades" :key="facultad.id_facultad" :value="facultad.id_facultad">
                      {{ facultad.nombre_facultad }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Edificio</label>
                  <select v-model="formularioHorario.id_edificio" required :disabled="!formularioHorario.id_facultad">
                    <option value="">Seleccionar Edificio</option>
                    <option v-for="edificio in edificiosFiltradosHorario" :key="edificio.id_edificio" :value="edificio.id_edificio">
                      {{ edificio.nombre_edificio }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Piso</label>
                  <select v-model="formularioHorario.id_piso" required :disabled="!formularioHorario.id_edificio">
                    <option value="">Seleccionar Piso</option>
                    <option v-for="piso in pisosFiltradosHorario" :key="piso.id_piso" :value="piso.id_piso">
                      {{ formatearNumeroPiso(piso.numero_piso) }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Aula</label>
                  <select v-model="formularioHorario.id_aula" required :disabled="!formularioHorario.id_piso">
                    <option value="">Seleccionar Aula</option>
                    <option v-for="aula in aulasFiltradosHorario" :key="aula.id_aula" :value="aula.id_aula">
                      {{ aula.nombre_aula }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="cerrarModalHorario" class="btn-secondary">Cancelar</button>
              <button type="submit" :disabled="guardandoHorario" class="btn-primary">
                {{ guardandoHorario ? 'Guardando...' : (modoEdicionHorario ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal para Usuarios -->
      <div v-if="mostrarModalUsuario" class="modal-overlay" @click="cerrarModalUsuario">"
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ modoEdicionUsuario ? 'Editar Usuario' : 'Crear Usuario' }}</h3>
            <button @click="cerrarModalUsuario" class="modal-close">&times;</button>
          </div>
          <form @submit.prevent="guardarUsuario" class="modal-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombres</label>
                <input v-model="formularioUsuario.nombres" type="text" required />
              </div>
              <div class="form-group">
                <label>Apellidos</label>
                <input v-model="formularioUsuario.apellidos" type="text" required />
              </div>
              <div class="form-group">
                <label>Cédula</label>
                <input v-model="formularioUsuario.cedula" type="text" required />
              </div>
              <div class="form-group">
                <label>Correo</label>
                <input v-model="formularioUsuario.correo" type="email" required />
              </div>
              <div class="form-group">
                <label>Fecha de Nacimiento</label>
                <input v-model="formularioUsuario.fecha_nacimiento" type="date" required />
              </div>
              <div class="form-group">
                <label>Rol</label>
                <select v-model="formularioUsuario.rol" required>
                  <option value="">Estudiante (por defecto)</option>
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              <div v-if="!modoEdicionUsuario" class="form-group">
                <label>Contraseña</label>
                <input v-model="formularioUsuario.contrasena" type="password" required />
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" @click="cerrarModalUsuario" class="btn-secondary">Cancelar</button>
              <button type="submit" :disabled="guardandoUsuario" class="btn-primary">
                {{ guardandoUsuario ? 'Guardando...' : (modoEdicionUsuario ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Genérico - Pendiente para futuras secciones -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenuAdmin } from './components/useMenuAdmin'

const {
  adminData,
  systemStats,
  navSections,
  activeSection,
  setActiveSection,
  logout,
  // Funciones de usuarios
  usuariosFiltrados,
  busquedaUsuarios,
  filtroRolUsuarios,
  mostrarModalUsuario,
  modoEdicionUsuario,
  formularioUsuario,
  guardandoUsuario,
  abrirModalCrearUsuario,
  editarUsuario,
  eliminarUsuario,
  cerrarModalUsuario,
  guardarUsuario,
  formatRol,
  // Infraestructura
  facultades,
  edificios,
  pisos,
  aulas,
  tipoInfraestructuraActivo,
  mostrarModalInfraestructura,
  modoEdicionInfraestructura,
  guardandoInfraestructura,
  formularioFacultad,
  formularioEdificio,
  formularioPiso,
  formularioAula,
  facultadSeleccionada,
  edificioSeleccionado,
  pisoSeleccionado,
  edificiosFiltrados,
  pisosFiltrados,
  aulasFiltradas,
  abrirModalCrearInfraestructura,
  cerrarModalInfraestructura,
  guardarInfraestructura,
  opcionesPisos,
  formatearNumeroPiso,
  obtenerNombreSingular,
  // Materias
  materias,
  mostrarModalMateria,
  modoEdicionMateria,
  guardandoMateria,
  formularioMateria,
  semestresDisponibles,
  abrirModalCrearMateria,
  editarMateria,
  cerrarModalMateria,
  guardarMateria,
  eliminarMateria,
  obtenerNombreDocente,
  // Horarios (sección separada)
  horarios,
  paralelos,
  mostrarModalHorario,
  modoEdicionHorario,
  guardandoHorario,
  formularioHorario,
  diasSemana,
  horariosDisponibles,
  docentesDisponibles,
  edificiosFiltradosHorario,
  pisosFiltradosHorario,
  aulasFiltradosHorario,
  abrirModalCrearHorario,
  editarHorario,
  cerrarModalHorario,
  guardarHorario,
  eliminarHorario
} = useMenuAdmin()
</script>

<style src="./styles/MenuAdmin.css" scoped></style>

