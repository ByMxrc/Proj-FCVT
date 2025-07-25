<template>
  <div>
    <nav class="navbar-superior">
      <img :src="mini" alt="LogoMini" class="navbar-logo" />
      <ul class="navbar-menu">
        <li :class="{ active: activeTab === 'principal' }">Página Principal</li>
        <li :class="{ active: activeTab === 'personal' }">Área personal</li>
        <li :class="{ active: activeTab === 'cursos' }" style="color:#fff;background:#e53935;">Mis cursos</li>
        
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
        <div class="menu-subtitulo">Vista general de curso</div>
        <div class="menu-filtros">
          <button>Todos</button>
          <input type="text" placeholder="Buscar" />
          <select>
            <option>Ordenar por nombre del curso</option>
          </select>
          <select>
            <option>Tarjeta</option>
          </select>
        </div>
        <div class="menu-cursos">
          <div class="curso-tarjeta" v-for="curso in cursos" :key="curso.id">
            <div class="curso-imagen" :style="{ background: curso.color }"></div>
            <div class="curso-info">
              <div class="curso-titulo">{{ curso.titulo }}</div>
              <div class="curso-carrera">{{ curso.carrera }}</div>
            </div>
          </div>
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

const cursos = [
  {
    id: 1,
    titulo: 'A -- REDES DE COMPUTADORAS',
    carrera: 'CARRERA: SOFTWARE 2024 - NS',
    color: 'linear-gradient(135deg,#bdbdbd 60%,#e0e0e0 100%)'
  },
  {
    id: 2,
    titulo: 'B -- APLICACIONES PARA EL CLIENTE WEB',
    carrera: 'CARRERA: SOFTWARE 2024 - NS',
    color: 'linear-gradient(135deg,#64b5f6 60%,#90caf9 100%)'
  },
  {
    id: 3,
    titulo: 'B -- BASES DE DATOS',
    carrera: 'CARRERA: SOFTWARE 2024 - NS',
    color: 'linear-gradient(135deg,#ffe082 60%,#ffd54f 100%)'
  },
  {
    id: 4,
    titulo: 'B -- PERSPECTIVA DE LA INTELIGENCIA ARTIFICIAL',
    carrera: 'CARRERA: SOFTWARE 2024 - NS',
    color: 'linear-gradient(135deg,#26c6da 60%,#80deea 100%)'
  }
];
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

.menu-filtros {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  align-items: center;
}

.menu-filtros button,
.menu-filtros select,
.menu-filtros input {
  padding: 7px 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.menu-filtros button {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #bdbdbd;
  font-weight: 500;
}

.menu-cursos {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.curso-tarjeta {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  width: 260px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

.curso-imagen {
  height: 70px;
  width: 100%;
  border-radius: 8px 8px 0 0;
}

.curso-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.curso-titulo {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}

.curso-carrera {
  font-size: 0.95rem;
  color: #757575;
}

.curso-progreso {
  font-size: 0.93rem;
  color: #e53935;
  font-weight: 500;
}
</style>