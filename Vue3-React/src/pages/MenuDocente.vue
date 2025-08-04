<template>
  <div class="teacher-menu-container">
    <!-- Header -->
    <div class="menu-header">
      <div class="header-content">
        <div class="breadcrumb">
          <button @click="goBack" class="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
            Volver
          </button>
          <span class="breadcrumb-separator">|</span>
          <span class="current-page">Área Docente</span>
        </div>
        
        <div class="user-section">
          <div class="user-info">
            <span class="teacher-name">{{ teacherData.name }}</span>
            <span class="teacher-id">Código: {{ teacherData.codigo }}</span>
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

    <!-- Main Content -->
    <div class="menu-content">
      <div class="welcome-section">
        <h1>¡Bienvenido, Prof. {{ teacherData.name }}!</h1>
        <p>Panel de control para gestión académica y docente</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon courses">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ teacherStats.courses }}</span>
            <span class="stat-label">Cursos Asignados</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon students">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ teacherStats.students }}</span>
            <span class="stat-label">Estudiantes Total</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon evaluations">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ teacherStats.pendingEvaluations }}</span>
            <span class="stat-label">Evaluaciones Pendientes</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon hours">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ teacherStats.weeklyHours }}</span>
            <span class="stat-label">Horas Semanales</span>
          </div>
        </div>
      </div>

      <!-- Menu Options -->
      <div class="menu-options">
        <div class="options-grid">
          <div 
            v-for="option in menuOptions" 
            :key="option.id"
            @click="navigateTo(option.route)"
            class="option-card"
          >
            <div class="option-icon" :class="option.iconClass">
              <component :is="option.icon" />
            </div>
            
            <div class="option-content">
              <h3>{{ option.title }}</h3>
              <p>{{ option.description }}</p>
            </div>
            
            <div class="option-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenuDocente } from './components/useMenuDocente'

const {
  teacherData,
  teacherStats,
  menuOptions,
  navigateTo,
  goBack,
  logout
} = useMenuDocente()
</script>

<style src="./styles/MenuDocente.css" scoped></style>