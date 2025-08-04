<template>
  <div class="estudiante-dashboard">
    <!-- Header/Navbar -->
    <nav class="navbar-superior">
      <img :src="mini" alt="LogoMini" class="navbar-logo" />
      <div class="navbar-titulo">
        <h2>Sistema Académico - Estudiante</h2>
      </div>
      <div class="navbar-user">
        <span class="user-info">{{ usuarioActual?.nombres }} {{ usuarioActual?.apellidos }}</span>
        <button @click="logout" class="btn-logout">Cerrar Sesión</button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="dashboard-main">
      <div class="dashboard-container">
        <!-- Saludo y bienvenida -->
        <div class="welcome-section">
          <h1 class="welcome-title">¡Bienvenido, {{ usuarioActual?.nombres }}! 👋</h1>
          <p class="welcome-subtitle">Accede a tus servicios académicos</p>
        </div>

        <!-- Opciones principales -->
        <div class="options-grid">
          <div class="option-card" @click="irARegistroMatricula">
            <div class="option-icon">📚</div>
            <h3>Registro de Matrícula</h3>
            <p>Inscríbete a las materias disponibles para el semestre</p>
          </div>

          <div class="option-card" @click="irAIngresoAula">
            <div class="option-icon">🏫</div>
            <h3>Ingreso al Aula</h3>
            <p>Consulta tus horarios y ubicación de clases</p>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="info-section">
          <div class="info-card">
            <h4>Información Académica</h4>
            <p><strong>Correo:</strong> {{ usuarioActual?.correo }}</p>
            <p><strong>Cédula:</strong> {{ usuarioActual?.cedula }}</p>
            <p><strong>Estado:</strong> Estudiante Activo</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import mini from '@/assets/images/LogoMini Uleam.png'
import type { Usuario } from '../interfaces/Usuario'

const router = useRouter()
const usuarioActual = ref<Usuario | null>(null)

// Funciones de navegación
const irARegistroMatricula = () => {
  router.push({ name: 'RegistroMatricula' })
}

const irAIngresoAula = () => {
  router.push({ name: 'MenuEstudiante' })
}

const logout = () => {
  localStorage.removeItem('currentUser')
  router.push({ name: 'Login' })
}

// Inicialización
onMounted(() => {
  // Obtener usuario actual desde localStorage o route params
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) {
    usuarioActual.value = JSON.parse(savedUser)
  }
  
  console.log('👤 Usuario estudiante:', usuarioActual.value)
})
</script>

<style scoped>
.estudiante-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.navbar-superior {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-logo {
  height: 40px;
  width: auto;
}

.navbar-titulo h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  color: #333;
  font-weight: 500;
}

.btn-logout {
  background: #e53935;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c62828;
}

.dashboard-main {
  padding: 2rem;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-title {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.option-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.option-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.option-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.option-card h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.4rem;
}

.option-card p {
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.info-section {
  display: flex;
  justify-content: center;
}

.info-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.info-card h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.info-card p {
  margin: 0.5rem 0;
  color: #555;
}

@media (max-width: 768px) {
  .navbar-superior {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-main {
    padding: 1rem;
  }
}
</style>
