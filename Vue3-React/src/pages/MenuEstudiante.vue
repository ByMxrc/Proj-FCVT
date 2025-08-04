<template>
  <div class="dashboard-container">
    <!-- Header -->
    <nav class="navbar-superior">
      <img :src="mini" alt="LogoMini" class="navbar-logo" />
      <div class="navbar-title">
        <h2>Portal Estudiante</h2>
      </div>
      <div class="navbar-user">
        <span class="navbar-user-name">{{ usuarioData.nombres }} {{ usuarioData.apellidos }}</span>
        <span class="navbar-user-icon" @click="toggleMenu">{{ userInitials }}</span>
        <div v-if="showMenu" class="dropdown-menu" @click.stop>
          <div class="dropdown-item">Perfil</div>
          <div class="dropdown-item">Configuración</div>
          <div class="dropdown-item" @click="logout">Cerrar sesión</div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="dashboard-main">
      <!-- Dashboard View -->
      <div v-if="vistaActual === 'dashboard'" class="dashboard-content">
        <div class="welcome-section">
          <h1 class="welcome-title">
            ¡Bienvenido, <span class="user-name">{{ usuarioData.nombres }}</span>! 👋
          </h1>
          <p class="welcome-subtitle">¿Qué deseas hacer hoy?</p>
          <!-- TEMPORAL: Botón para limpiar datos -->
          <button @click="limpiarDatos" class="btn-temporal" style="background: #ff6b6b; color: white; padding: 8px 16px; border: none; border-radius: 6px; margin-top: 15px; cursor: pointer; font-size: 14px;">
            🧹 Limpiar y Recargar Datos
          </button>
        </div>

        <div class="dashboard-cards">
          <div class="dashboard-card" @click="irARegistroMatricula">
            <div class="card-icon">📚</div>
            <h3 class="card-title">Registro de Matrícula</h3>
            <p class="card-description">Inscríbete en materias disponibles para el período académico</p>
            <div class="card-action">Acceder →</div>
          </div>

          <div class="dashboard-card" @click="irAIngresoAula">
            <div class="card-icon">🚪</div>
            <h3 class="card-title">Ingreso al Aula</h3>
            <p class="card-description">Accede a tus clases virtuales y contenido académico</p>
            <div class="card-action">Acceder →</div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="info-section">
          <div class="info-card">
            <h4>📊 Resumen Académico</h4>
            <p><strong>Semestre:</strong> {{ usuarioData.semestre || 'N/A' }}</p>
            <p><strong>Carrera:</strong> {{ usuarioData.carrera || 'N/A' }}</p>
            <p><strong>Estado:</strong> <span class="status-active">Activo</span></p>
          </div>
          <div class="info-card">
            <h4>📅 Período Actual</h4>
            <p><strong>Período:</strong> 2024-2025</p>
            <p><strong>Matrícula abierta:</strong> <span class="status-open">Sí</span></p>
            <p><strong>Fecha límite:</strong> 15 de Agosto, 2025</p>
          </div>
        </div>
      </div>

      <!-- Registro de Matrícula View -->
      <div v-if="vistaActual === 'matricula'" class="matricula-content">
        <div class="section-header">
          <button @click="volverDashboard" class="btn-back">← Volver</button>
          <h2>Registro de Matrícula</h2>
        </div>

        <div class="matricula-form">
          <div class="form-section">
            <h3>Seleccionar Materia y Paralelo</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Materia</label>
                <select v-model="formularioMatricula.id_materia" @change="onMateriaChange">
                  <option value="">Seleccionar Materia</option>
                  <option v-for="materia in materias" :key="materia.id_materia" :value="materia.id_materia">
                    {{ materia.nombre_materia }} ({{ materia.semestre }}° Semestre)
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>Paralelo</label>
                <select v-model="formularioMatricula.id_paralelo" :disabled="!formularioMatricula.id_materia">
                  <option value="">Seleccionar Paralelo</option>
                  <option v-for="paralelo in paralelosDisponibles" :key="paralelo.id_paralelo" :value="paralelo.id_paralelo">
                    Paralelo {{ paralelo.nombre_paralelo }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Información del horario seleccionado -->
            <div v-if="horarioSeleccionado" class="horario-info">
              <h4>📅 Información del Horario</h4>
              <div class="horario-details">
                <p><strong>Materia:</strong> {{ horarioSeleccionado.nombre_materia }}</p>
                <p><strong>Paralelo:</strong> {{ horarioSeleccionado.nombre_paralelo }}</p>
                <p><strong>Docente:</strong> {{ horarioSeleccionado.nombre_docente }}</p>
                <p><strong>Día:</strong> {{ horarioSeleccionado.dia_semana }}</p>
                <p><strong>Horario:</strong> {{ horarioSeleccionado.hora_inicio }} - {{ horarioSeleccionado.hora_fin }}</p>
                <p><strong>Aula:</strong> {{ horarioSeleccionado.nombre_aula }}</p>
              </div>
            </div>

            <div class="form-actions">
              <button 
                @click="registrarMatricula" 
                :disabled="!formularioMatricula.id_materia || !formularioMatricula.id_paralelo || guardandoMatricula"
                class="btn-primary"
              >
                {{ guardandoMatricula ? 'Registrando...' : 'Registrar Matrícula' }}
              </button>
            </div>
          </div>

          <!-- Matrículas existentes -->
          <div class="matriculas-existentes">
            <h3>Mis Matrículas</h3>
            <div v-if="matriculasEstudiante.length === 0" class="no-matriculas">
              No tienes matrículas registradas aún.
            </div>
            <div v-else class="matriculas-list">
              <div v-for="matricula in matriculasEstudiante" :key="matricula.id_matricula" class="matricula-item">
                <div class="matricula-info">
                  <h4>{{ matricula.nombre_materia }}</h4>
                  <p>Paralelo: {{ matricula.nombre_paralelo }}</p>
                  <p>{{ matricula.dia_semana }} | {{ matricula.hora_inicio }} - {{ matricula.hora_fin }}</p>
                  <p>Aula: {{ matricula.nombre_aula }}</p>
                </div>
                <button @click="eliminarMatricula(matricula)" class="btn-danger">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ingreso al Aula View - Calendario -->
      <div v-if="vistaActual === 'aula'" class="aula-content">
        <div class="section-header">
          <button @click="volverDashboard" class="btn-back">← Volver</button>
          <h2>Horario de Clases</h2>
        </div>
        
        <div class="calendario-container">
          <div class="calendario-header">
            <h3>📅 Semana Actual</h3>
            <p class="fecha-actual">{{ new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) }}</p>
          </div>
          
          <div class="calendario-grid-wrapper">
            <table class="calendario-grid">
              <thead>
                <tr>
                  <th class="hora-header">Hora</th>
                  <th v-for="dia in diasSemana" :key="dia" class="dia-header">
                    {{ dia }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hora in horasCalendario" :key="hora" class="fila-hora">
                  <td class="celda-hora">{{ hora }}</td>
                  <td 
                    v-for="dia in diasSemana" 
                    :key="`${dia}-${hora}`" 
                    class="celda-calendario"
                    :class="{
                      'celda-actual': esCeldaActual(dia, hora),
                      'celda-ocupada': obtenerMatriculasEnCelda(dia, hora).length > 0
                    }"
                  >
                    <div 
                      v-for="matricula in obtenerMatriculasEnCelda(dia, hora)" 
                      :key="matricula.id_matricula"
                      class="materia-bloque"
                      :title="`${matricula.nombre_materia} - ${matricula.nombre_paralelo} (${matricula.hora_inicio} - ${matricula.hora_fin})`"
                      @click="abrirDetalleMateria(matricula)"
                    >
                      <div class="materia-nombre">{{ matricula.nombre_materia }}</div>
                      <div class="materia-paralelo">Paralelo {{ matricula.nombre_paralelo }}</div>
                      <div class="materia-horario">{{ matricula.hora_inicio }} - {{ matricula.hora_fin }}</div>
                      <div class="materia-aula">{{ matricula.nombre_aula }}</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="calendario-leyenda">
            <div class="leyenda-item">
              <div class="leyenda-color celda-actual-ejemplo"></div>
              <span>Hora actual</span>
            </div>
            <div class="leyenda-item">
              <div class="leyenda-color celda-ocupada-ejemplo"></div>
              <span>Clase programada</span>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Modal de Detalles de Materia -->
    <div v-if="modalDetalle" class="modal-overlay" @click="cerrarModalDetalle">
      <div class="modal-detalle" @click.stop>
        <div class="modal-header">
          <h2>📚 Detalles de la Materia</h2>
          <button @click="cerrarModalDetalle" class="btn-close">×</button>
        </div>
        
        <div v-if="materiaSeleccionada" class="modal-body">
          <div class="detalle-section">
            <h3>📖 Información Académica</h3>
            <div class="detalle-grid">
              <div class="detalle-item">
                <span class="detalle-label">Materia:</span>
                <span class="detalle-value">{{ materiaSeleccionada.nombre_materia }}</span>
              </div>
              <div class="detalle-item">
                <span class="detalle-label">Paralelo:</span>
                <span class="detalle-value">{{ materiaSeleccionada.nombre_paralelo }}</span>
              </div>
              <div class="detalle-item">
                <span class="detalle-label">Docente:</span>
                <span class="detalle-value">{{ materiaSeleccionada.nombre_docente }}</span>
              </div>
            </div>
          </div>
          
          <div class="detalle-section">
            <h3>⏰ Horario</h3>
            <div class="detalle-grid">
              <div class="detalle-item">
                <span class="detalle-label">Día:</span>
                <span class="detalle-value">{{ materiaSeleccionada.dia_semana }}</span>
              </div>
              <div class="detalle-item">
                <span class="detalle-label">Hora de inicio:</span>
                <span class="detalle-value">{{ materiaSeleccionada.hora_inicio }}</span>
              </div>
              <div class="detalle-item">
                <span class="detalle-label">Hora de fin:</span>
                <span class="detalle-value">{{ materiaSeleccionada.hora_fin }}</span>
              </div>
            </div>
          </div>
          
          <div class="detalle-section">
            <h3>📍 Ubicación</h3>
            <div class="detalle-grid">
              <div class="detalle-item">
                <span class="detalle-label">Facultad:</span>
                <span class="detalle-value">{{ materiaSeleccionada.facultad }}</span>
              </div>
              <div class="detalle-item">
                <span class="detalle-label">Edificio:</span>
                <span class="detalle-value">{{ materiaSeleccionada.edificio }}</span>
              </div>
              <div class="detalle-item">
                <span class="detalle-label">Piso:</span>
                <span class="detalle-value">{{ materiaSeleccionada.piso }}</span>
              </div>
              <div class="detalle-item">
                <span class="detalle-label">Aula:</span>
                <span class="detalle-value">{{ materiaSeleccionada.aula }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import mini from '@/assets/images/LogoMini Uleam.png';
import { useMenuEstudiante } from './components/useMenuEstudiante';

const {
  // Estados básicos
  usuarioData,
  vistaActual,
  showMenu,
  userInitials,
  
  // Navegación
  toggleMenu,
  logout,
  irARegistroMatricula,
  irAIngresoAula,
  volverDashboard,
  
  // Matrícula
  materias,
  paralelosDisponibles,
  formularioMatricula,
  horarioSeleccionado,
  matriculasEstudiante,
  guardandoMatricula,
  onMateriaChange,
  registrarMatricula,
  eliminarMatricula,
  
  // Calendario
  diasSemana,
  horasCalendario,
  esCeldaActual,
  obtenerMatriculasEnCelda,
  
  // Modal de detalles
  modalDetalle,
  materiaSeleccionada,
  abrirDetalleMateria,
  cerrarModalDetalle,
  
  // TEMPORAL: Función de limpieza
  limpiarDatos
} = useMenuEstudiante();
</script>

<style scoped>
@import url('./styles/MenuEstudiante.css');
</style>