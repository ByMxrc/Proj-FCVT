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
                <td class="hora-label">{{ hora }}</td>
                <td
                  v-for="(dia, dIdx) in diasSemana"
                  :key="dIdx"
                  :class="{ actual: esAhora(dIdx, hIdx) }"
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import mini from '@/assets/images/LogoMini Uleam.png';
import { useRoute, useRouter } from 'vue-router';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const route = useRoute();
const router = useRouter();
const correo = route.query.correo || 'Usuario';

const activeTab = ref('cursos');
const showMenu = ref(false);

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function logout() {
  showMenu.value = false;
  router.push({ name: 'Login' });
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

function handleClickOutside(event: MouseEvent) {
  const menu = document.querySelector('.navbar-user');
  if (menu && !menu.contains(event.target as Node)) {
    showMenu.value = false;
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Calendario semanal
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const horasDia = [
  '7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00', '10:00 - 11:00',
  '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00',
  '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00',
  '19:00 - 20:00'
];

const ahora = ref(new Date());

function actualizarAhora() {
  ahora.value = new Date();
}
let intervalo: number | undefined;
onMounted(() => {
  intervalo = window.setInterval(actualizarAhora, 60000);
});
onBeforeUnmount(() => {
  if (intervalo) clearInterval(intervalo);
});

function esAhora(diaIdx: number, horaIdx: number) {
  const diaActual = ahora.value.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
  // En diasSemana, 0=Lunes, ..., 5=Sábado
  // getDay: Lunes=1, ..., Sábado=6
  if (diaActual === 0) return false; // Domingo fuera del calendario
  if (diaIdx !== diaActual - 1) return false;

  const horaActual = ahora.value.getHours();
  // horaIdx=0 → 7:00-8:00, ..., horaIdx=12 → 19:00-20:00
  if (horaActual >= 7 + horaIdx && horaActual < 8 + horaIdx) return true;
  return false;
}
</script>

<style scoped>
body {
  background: #fff;
}

*{
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
.navbar-menu li[style*="background"] {
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
  box-shadow: 0 4px 16px rgba(0,0,0,0.13);
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

.menu-container {
  max-width: 1100px;
  margin: 32px auto 0 auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  padding: 32px 24px;
}

.menu-saludo {
  color: #e53935;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.menu-nombre {
  text-transform: uppercase;
}

.menu-subtitulo {
  color: #e53935;
  font-weight: 600;
  margin-bottom: 18px;
  font-size: 1.1rem;
}

/* Calendario semanal estilos */
.calendario-semanal {
  overflow-x: auto;
  margin-top: 24px;
}
.calendario-semanal table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}
.calendario-semanal th,
.calendario-semanal td {
  border: 1px solid #e0e0e0;
  text-align: center;
  padding: 10px 6px;
  min-width: 90px;
}
.calendario-semanal th {
  background: #e53935;
  color: #fff;
  font-weight: 600;
}
.hora-label {
  background: #f5f5f5;
  font-weight: 500;
}
.calendario-semanal td.actual {
  background: #ffd54f !important;
  color: #222;
  font-weight: bold;
  border: 2px solid #e53935;
}
</style>