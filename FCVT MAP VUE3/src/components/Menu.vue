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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

onMounted(() => {
  cargarUsuario();
});

const mostrarModalMateria = ref(false);
const materiaSeleccionada = ref<any>(null);

function abrirModalMateria(horario: any) {
  console.log('Abriendo modal para:', horario);
  materiaSeleccionada.value = horario;
  mostrarModalMateria.value = true;
}

function cerrarModalMateria() {
  mostrarModalMateria.value = false;
}
function obtenerRutaMapa(piso: string | number) {
  try {
    return new URL(`../assets/images/Piso ${piso}.png`, import.meta.url).href;
  } catch (e) {
    return new URL('../assets/images/mapa-default.png', import.meta.url).href;
  }
}
const route = useRoute();
const router = useRouter();
const correo = route.query.correo || 'Usuario';
const activeTab = ref('principal');
const showMenu = ref(false);

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function logout() {
  router.push({ name: 'Login' }); // O la ruta de tu login
}
const userInitials = computed(() => {
  if (typeof correo === 'string' && correo.length > 0) {
    const name = correo.split('@')[0];
    return name
      .split('.')
      .map(n => n[0]?.toUpperCase() || '')
      .join('')
      .slice(0, 2);
  }
  return 'US';
});

function horariosParaDiaHora(dia: string, horaInicio: string) {
  const minutosCelda = parseInt(horaInicio.split(':')[0], 10) * 60 + parseInt(horaInicio.split(':')[1], 10);

  return horariosUsuario.value.filter(h => {
    // Normaliza ambos a minúsculas para comparar
    if ((h.dia_semana || '').toLowerCase() !== dia.toLowerCase()) return false;
    const [hInicio, mInicio] = h.hora_inicio.split(':').map(Number);
    const [hFin, mFin] = h.hora_fin.split(':').map(Number);
    const minutosInicio = hInicio * 60 + mInicio;
    const minutosFin = hFin * 60 + mFin;
    return minutosCelda >= minutosInicio && minutosCelda < minutosFin;
  });
}

// Variables para usuario y horarios
const usuario = ref(null);
const horariosUsuario = ref([]);
const diasSemana = ref(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']);
const horasDia = ref([
  { inicio: '07:00', fin: '08:00' },
  { inicio: '08:00', fin: '09:00' },
  { inicio: '09:00', fin: '10:00' },
  { inicio: '10:00', fin: '11:00' },
  { inicio: '11:00', fin: '12:00' },
  { inicio: '12:00', fin: '13:00' },
  { inicio: '13:00', fin: '14:00' },
  { inicio: '14:00', fin: '15:00' },
  { inicio: '15:00', fin: '16:00' },
  { inicio: '16:00', fin: '17:00' },
  { inicio: '17:00', fin: '18:00' },
  { inicio: '18:00', fin: '19:00' },
  { inicio: '19:00', fin: '20:00' },
  { inicio: '20:00', fin: '21:00' }
]);

async function cargarUsuario() {
  if (!correo) return;
  try {
    const res = await fetch(`http://localhost:3001/api/usuarios?correo=${correo}`);
    const data = await res.json();
    if (data.length > 0) {
      usuario.value = data[0];
      await cargarHorarios(usuario.value.id_usuario);
    }
  } catch (e) {
    console.error('Error cargando usuario', e);
  }
}

async function cargarHorarios(id_usuario) {
  try {
    const res = await fetch(`http://localhost:3001/api/usuarios/${id_usuario}/horarios`);
    horariosUsuario.value = await res.json();
    console.log('Horarios cargados:', horariosUsuario.value);
  } catch (e) {
    console.error('Error cargando horarios', e);
  }
}

function esAhora(dIdx: number, hIdx: number): boolean {
  const now = new Date();
  const diaActual = now.getDay(); // 0 (Domingo) - 6 (Sábado)
  const horaActual = now.getHours();

  // Lunes es 1, Martes es 2, ..., Sábado es 6
  const diaCalendario = dIdx + 1;
  // Tomar la hora de inicio del bloque horario
  const horaCalendario = parseInt(horasDia.value[hIdx].inicio.split(':')[0], 10);

  // Ajuste para que coincida el día actual con el día del calendario
  const diaCoincide = (diaActual === 0 && diaCalendario === 6) || (diaActual === diaCalendario);

  // Verificar si la hora actual está dentro del rango de la hora del calendario
  const horaCoincide = horaActual === horaCalendario;

  return diaCoincide && horaCoincide;
}
</script>

<style scoped>
body {
  background: #fff;
}

* {
  font-family: 'Poppins', Arial, Helvetica, sans-serif;
}

.navbar-superior {
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background: #424242;
  color: #fff;
  height: 60px;
  display: flex;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 0 24px;
  justify-content: space-between;
}

.navbar-logo {
  height: 40px;
  margin-right: 18px;
}

.navbar-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 18px;
  flex: 1;
}

.navbar-menu li {
  padding: 10px 18px;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-weight: 500;
  background: transparent;
  color: #fff;
  transition: background 0.2s;
}

.navbar-menu li.active,
.navbar-menu li[style*='background'] {
  background: #e53935 !important;
  color: #fff !important;
}

.navbar-user {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-menu {
  position: absolute;
  top: 48px;
  right: 0;
  background: #fff;
  color: #222;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.13);
  min-width: 170px;
  z-index: 2000;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  padding: 10px 18px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.15s;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.navbar-user-icon {
  background: #757575;
  color: #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.menu-main {
  background: #fff;
  min-height: 100vh;
  padding-top: 70px;
}

.menu-nombre {
  text-transform: uppercase;
}

.menu-container {
  max-width: 1100px;
  margin: 32px auto 0 auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  padding: 32px 24px;
}

.menu-saludo {
  color: #e53935;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.menu-subtitulo {
  color: #e53935;
  font-weight: 600;
  margin-bottom: 18px;
  font-size: 1.1rem;
}

.calendario-semanal {
  overflow-x: auto;
}

.calendario-semanal table {
  width: 100%;
  border-collapse: collapse;
}

.calendario-semanal th,
.calendario-semanal td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.calendario-semanal th {
  background-color: #f0f0f0;
}

.calendario-semanal .hora-label {
  font-weight: bold;
}

.calendario-semanal .actual {
  background-color: #ffcdd2;
}

.materia-calendario {
  background-color: #e53935;
  color: white;
  padding: 4px;
  margin: 2px;
  border-radius: 4px;
  font-size: 0.8em;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}
.modal-content {
  background: #fff;
  border-radius: 10px;
  padding: 32px 24px;
  min-width: 320px;
  max-width: 95vw;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  position: relative;
}
.modal-actions {
  margin-top: 24px;
  text-align: right;
}
.modal-actions button {
  background: #e53935;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 18px;
  font-weight: 600;
  cursor: pointer;
}

</style>