<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Iniciar Sesión</h1>
        <p>Accede a tu cuenta del sistema académico</p>
        <div class="demo-info">
          <small>
            <strong>Conectado a Supabase:</strong><br>
            Admin: admin@live.uleam.edu.ec / Admin123!
          </small>
        </div>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="loginData.email"
            placeholder="e1234567890@live.uleam.edu.ec (admin@live.uleam.edu.ec para admin)"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="loginData.password"
            placeholder="••••••••"
            required
          />
        </div>
        
        <div class="form-options">
          <label class="checkbox-container">
            <input type="checkbox" v-model="rememberMe">
            <span class="checkmark"></span>
            Recordarme
          </label>
          
          <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <button type="submit" class="login-btn" :disabled="isLoading">
          <span v-if="!isLoading">Iniciar Sesión</span>
          <span v-else>Iniciando...</span>
        </button>
        
        <div class="register-link">
          <p>¿No tienes cuenta? <a href="#" @click="goToRegister">Regístrate aquí</a></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from './components/useLogin'

const {
  loginData,
  rememberMe,
  isLoading,
  errorMessage,
  handleLogin,
  goToRegister
} = useLogin()
</script>

<style src="./styles/Login.css" scoped></style>
