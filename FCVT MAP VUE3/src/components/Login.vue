<template>
    <div class="navbar-superior">
        <img :src="mini" alt="LogoMini" />
    </div>
  <div class="login-container">
    <img :src="logo" alt="Logo" />
    <div v-if="showError" class="login-error">
            Acceso invalido. Porfavor, intentelo otra vez.
        </div>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="username"></label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Nombre de Usuario"
          required
          autocomplete="username"
        />
      </div>
      <div class="form-group">
        <label for="password"></label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Contraseña"
          required
          autocomplete="current-password"
        />
      </div>
      <button type="submit" class="login-button">Acceder</button>
      <p class="registro-link">
        ¿No tienes cuenta?
        <span @click="goToRegister">Regístrate aquí</span>
     </p>
     <p class="recuperar-link">
        ¿Olvidaste tu contraseña?
        <span @click="goToRecuperar">Recupera tu cuenta</span>
     </p>
    </form>
  </div>
</template>

<script lang="ts" setup>
import logo from '@/assets/images/Logo Uleam.png';
import mini from '@/assets/images/LogoMini Uleam.png';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const username = ref('');
const password = ref('');
const showError = ref(false);
const router = useRouter();

function goToRegister() {
  router.push({ name: 'Register' });
}

function goToRecuperar() {
  router.push({ name: 'Recuperar' });
}

async function handleLogin() {
  showError.value = false;
  if (!username.value.endsWith('@live.uleam.edu.ec')) {
    showError.value = true;
    return;
  }
  try {
    const response = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo: username.value,
        contrasena: password.value
      })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      showError.value = true;
      return;
    }

    // Redirige según el rol
    const rol = data.usuario.rol;
    if (rol === 'estudiante') {
      router.push({ name: 'Menu', query: { correo: username.value } });
    } else if (rol === 'docente') {
      router.push({ name: 'MenuDocente', query: { correo: username.value } });
    } else if (rol === 'administrador') {
      router.push({ name: 'MenuAdmin', query: { correo: username.value } });
    } else {
      showError.value = true;
    }
  } catch (error) {
    showError.value = true;
  }
}
</script>

<style scoped>

* {
  font-family: 'Poppins', Arial, Helvetica, sans-serif;
}

.login-error {
  background: #ffeaea;
  color: #c00;
  border: 1px solid #f5c2c7;
  border-radius: 6px;
  padding: 10px 16px;
  margin: 18px 0 10px 0;
  text-align: center;
  font-size: 1rem;
}

.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}

.login-container img {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.registro-link {
  margin-top: 18px;
  font-size: 0.97rem;
  text-align: left;
}
.registro-link span {
  color: #e53935;
  cursor: pointer;
  text-decoration: underline;
}

.recupear-link {
  margin-top: 18px;
  font-size: 0.97rem;
  text-align: left;
}
.recuperar-link span {
  color: #e53935;
  cursor: pointer;
  text-decoration: underline;
}

.navbar-superior {
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background: #424242;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 700;
  text-align: left;
  padding: 0 0 0 16px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  height: 50px;
}

.navbar-superior img {
  height: 32px;      
  width: auto;
  margin: 0;
  padding: 0;
  display: block;
}

body {
  background-color: #dee2e6;
}

img {
  max-width: 200px;
  height: auto;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}

input {
  padding: 10px 12px;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #ccc;
  outline: none;
}


.login-button {
  padding: 15px 15px;
  background-color: #333;
  color: white;
  font-weight: 525;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.95rem;
  margin-top: 6px;
  align-self: flex-start;
  display: inline-block;
}

.login-button:hover {
  background-color: #EC3237;
}
</style>