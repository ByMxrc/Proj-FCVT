<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>Crear Cuenta</h1>
        <p>Regístrate en el sistema académico</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">Nombres</label>
            <input
              type="text"
              id="firstName"
              v-model="registerData.firstName"
              placeholder="Juan Carlos"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="lastName">Apellidos</label>
            <input
              type="text"
              id="lastName"
              v-model="registerData.lastName"
              placeholder="García López"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="cedula">Cédula</label>
            <input
              type="text"
              id="cedula"
              v-model="registerData.cedula"
              placeholder="1234567890"
              maxlength="10"
              pattern="[0-9]{10}"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="fechaNacimiento">Fecha de Nacimiento</label>
            <input
              type="date"
              id="fechaNacimiento"
              v-model="registerData.fechaNacimiento"
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">Correo Electrónico (Generado automáticamente)</label>
          <input
            type="email"
            id="email"
            :value="registerData.cedula ? `e${registerData.cedula}@live.uleam.edu.ec` : ''"
            placeholder="Se generará con tu cédula"
            readonly
            disabled
          />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              type="password"
              id="password"
              v-model="registerData.password"
              placeholder="••••••••"
              minlength="6"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="registerData.confirmPassword"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div class="terms-container">
          <label class="checkbox-container">
            <input type="checkbox" v-model="acceptTerms" required>
            <span class="checkmark"></span>
            Acepto los <a href="#" class="terms-link">términos y condiciones</a>
          </label>
        </div>
        
        <button type="submit" class="register-btn" :disabled="isLoading || !acceptTerms">
          <span v-if="!isLoading">Crear Cuenta</span>
          <span v-else>Creando cuenta...</span>
        </button>
        
        <div class="login-link">
          <p>¿Ya tienes cuenta? <a href="#" @click="goToLogin">Inicia sesión aquí</a></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegister } from './components/useRegister'

const {
  registerData,
  acceptTerms,
  isLoading,
  errorMessage,
  handleRegister,
  goToLogin
} = useRegister()
</script>

<style src="./styles/Register.css" scoped></style>

