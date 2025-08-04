<template>
  <div>
    <nav class="navbar-superior">
      <img :src="mini" alt="LogoMini" class="navbar-logo" />
      <ul class="navbar-menu">
        <li :class="{ active: activeTab === 'principal' }">Página Principal</li>
        <li :class="{ active: activeTab === 'personal' }">Área personal</li>
        <li :class="{ active: activeTab === 'personal' }">Curso</li>
        <li :class="{ active: activeTab === 'cursos' }" style="color:#fff;background:#e53935;">Calendario</li>
      </ul>
      <div class="navbar-user">
        <span class="navbar-user-icon" @click="toggleMenu">{{ userInitials }}</span>
        <div v-if="showMenu" class="dropdown-menu" @click.stop>
          <div class="dropdown-item">Perfil</div>
          <div class="dropdown-item">Preferencias</div>
          <div class="dropdown-item" @click="logout">Cerrar sesión</div>
        </div>
        <span class="navbar-user-icon">AC</span>
      </div>
    </nav>
        <main class="menu-main">
      <div class="menu-container">
        <h1 class="menu-saludo">¡Hola, <span class="menu-nombre">{{ correo.toUpperCase() }}</span>! 👋</h1>
        <div class="menu-subtitulo">Calendario semanal</div>
        <div class="calendario-semanal">
          <table>
            <thead>
              <tr>
                <th>Hora</th>
                <th v-for="(dia, idx) in diasSemana" :key="idx">{{ dia }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(hora, hIdx) in horasDia" :key="hIdx">
                <td class="hora-label">{{ hora.inicio }} - {{ hora.fin }}</td>
                <td
                  v-for="(dia, dIdx) in diasSemana"
                  :key="dIdx"
                  :class="{ actual: esAhora(dIdx, hIdx) }"
                >
                  <div
                    v-for="horario in horariosParaDiaHora(dia, hora.inicio)"
                    :key="horario.id_horario"
                    class="materia-calendario"
                    @click="abrirModalMateria(horario)"
                    style="cursor:pointer"
                  >
                    {{ horario.nombre_materia }} ({{ horario.paralelo }})<br />
                    {{ horario.nombre_aula }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
        <!-- MODAL DE INFORMACIÓN DE MATERIA -->
          <div v-if="mostrarModalMateria" class="modal-overlay">
        <div class="modal-content">
          <h2>Información de la materia</h2>
          <div v-if="materiaSeleccionada">
            <p><strong>Materia:</strong> {{ materiaSeleccionada.nombre_materia }} Nivel {{ materiaSeleccionada.nivel }} ({{ materiaSeleccionada.paralelo }})</p>
            <p><strong>Profesor:</strong> {{ materiaSeleccionada.nombres_docente }} {{ materiaSeleccionada.apellidos_docente }}</p>
            <p><strong>Facultad:</strong> {{ materiaSeleccionada.nombre_facultad }}</p>
            <p><strong>Edificio:</strong> {{ materiaSeleccionada.nombre_edificio }}</p>
            <p><strong>Piso:</strong> {{ materiaSeleccionada.numero_piso }}</p>
            <p><strong>Aula:</strong> {{ materiaSeleccionada.nombre_aula }}</p>
            <div style="margin-top:16px;">
              <strong>Mapa de referencia:</strong><br>
              <img
                :src="obtenerRutaMapa(materiaSeleccionada.numero_piso)"
                alt="Mapa de referencia"
                style="max-width:100%;border-radius:8px;border:1px solid #ccc;"

              />
            </div>
          </div>
          <div class="modal-actions">
            <button @click="cerrarModalMateria">Cerrar</button>
          </div>
        </div>
      </div>
    <!-- FIN MODAL DE INFORMACIÓN DE MATERIA -->
  </div>
</template>

<script setup lang="ts">
import mini from '@/assets/images/LogoMini Uleam.png';
import { useMenu } from './components/useMenuEstudiante';

const {
  correo,
  activeTab,
  showMenu,
  mostrarModalMateria,
  materiaSeleccionada,
  diasSemana,
  horasDia,
  userInitials,
  toggleMenu,
  logout,
  abrirModalMateria,
  cerrarModalMateria,
  obtenerRutaMapa,
  horariosParaDiaHora,
  esAhora
} = useMenu();
</script>

<style scoped>
@import url('./styles/MenuEstudiante.css');
</style>