<template>
  <div class="navbar-superior">
    <img :src="mini" alt="LogoMini" />
  </div>
  <div class="login-container">
    <img :src="logo" alt="Logo" />
    <div v-if="showError" class="login-error">
      {{ errorMsg }}
    </div>
    <div v-if="showSuccess" class="login-success">
      ¡Registro exitoso! Ahora puedes iniciar sesión.
    </div>
    <form @submit.prevent="onSubmit" class="login-form">
      <div class="form-group">
        <input v-model="nombres" type="text" placeholder="Nombres" required />
      </div>
      <div class="form-group">
        <input v-model="apellidos" type="text" placeholder="Apellidos" required />
      </div>
      <div class="form-group">
        <input v-model="edad" type="number" min="1" placeholder="Edad" required />
      </div>
      <div class="form-group">
        <input v-model="cedula" type="text" placeholder="Cédula" required />
      </div>
      <div class="form-group">
        <input v-model="fechaNacimiento" type="date" placeholder="Fecha de nacimiento" required />
      </div>
      <div class="form-group">
        <input v-model="contrasena" type="password" placeholder="Contraseña" required />
      </div>
      <button type="submit" class="login-button">Registrarse</button>
    </form>
    <p class="registro-link">
      ¿Ya tienes cuenta?
      <span @click="goToLogin">Inicia sesión aquí</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/images/Logo Uleam.png';
import mini from '@/assets/images/LogoMini Uleam.png';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const nombres = ref('');
const apellidos = ref('');
const edad = ref('');
const cedula = ref('');
const fechaNacimiento = ref('');
const contrasena = ref('');
const showError = ref(false);
const errorMsg = ref('');
const showSuccess = ref(false);
const router = useRouter();

function limpiarCampos() {
  nombres.value = '';
  apellidos.value = '';
  edad.value = '';
  cedula.value = '';
  fechaNacimiento.value = '';
  contrasena.value = '';
}

function validarDatos() {
  if (
    !nombres.value ||
    !apellidos.value ||
    !edad.value ||
    !cedula.value ||
    !fechaNacimiento.value ||
    !contrasena.value
  ) {
    errorMsg.value = 'Por favor, completa todos los campos.';
    showError.value = true;
    return false;
  }
  if (contrasena.value.length < 5) {
    errorMsg.value = 'La contraseña debe tener al menos 5 caracteres.';
    showError.value = true;
    return false;
  }
  showError.value = false;
  return true;
}

async function onSubmit() {
  showError.value = false;
  showSuccess.value = false;

  if (!validarDatos()) return;

  const usuario = {
    nombres: nombres.value,
    apellidos: apellidos.value,
    edad: edad.value,
    cedula: cedula.value,
    fechaNacimiento: fechaNacimiento.value,
    correo: `e${cedula.value}@live.uleam.edu.ec`,
    contrasena: contrasena.value
  };

  try {
    const response = await fetch('http://localhost:3001/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });

    if (!response.ok) {
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Error inesperado en el servidor');
      }
      throw new Error(data.error || 'Error al registrar usuario');
    }

    limpiarCampos();
    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
      router.replace({ name: 'Login' });
    }, 2000);
  } catch (error: any) {
    errorMsg.value = error.message;
    showError.value = true;
    showSuccess.value = false;
  }
}

function goToLogin() {
  router.replace({ name: 'Login' });
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

.login-success {
  background: #e6ffed;
  color: #1b5e20;
  border: 1.5px solid #81c784;
  border-radius: 6px;
  padding: 10px 16px;
  margin: 18px 0 10px 0;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
}

.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}
img {
  max-width: 200px;
  height: auto;
}
.login-container img {
  display: block;
  margin-left: auto;
  margin-right: auto;
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
</style>