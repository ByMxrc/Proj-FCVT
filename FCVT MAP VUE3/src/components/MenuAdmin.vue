<template>
  <div>
    <!-- ========== NAVBAR SUPERIOR ========== -->
        <nav class="navbar-superior">
            <button class="btn-logout" @click="logout">Cerrar sesión</button>
            <img :src="mini" alt="LogoMini" class="navbar-logo" />
          <ul class="navbar-menu">
            <li :class="{ active: activeTab === 'principal' }" @click="activeTab = 'principal'">Página Principal</li>
            <li :class="{ active: activeTab === 'usuarios' }" @click="activeTab = 'usuarios'">Usuarios</li>
            <li :class="{ active: activeTab === 'materias' }" @click="activeTab = 'materias'">Materias</li>
            <li :class="{ active: activeTab === 'aulas' }" @click="activeTab = 'aulas'">Aulas</li>
          </ul>
          <div class="navbar-user">
            <span class="navbar-user-icon" @click="toggleMenu">{{ userInitials }}</span>
            <div v-if="showMenu" class="dropdown-menu" @click.stop>
              <div class="dropdown-item">Perfil</div>
              <div class="dropdown-item">Preferencias</div>
              <div class="dropdown-item" @click="logout">Cerrar sesión</div>
            </div>
          </div>
        </nav>
    <!-- ========== FIN NAVBAR SUPERIOR ========== -->

    <!-- ========== MODAL DE HORARIOS ========== -->
    <div v-if="mostrarModalHorario" class="modal-overlay">
      <div class="modal-content modal-wide">
        <h2>Editar Horario de {{ materiaSeleccionada.nombre_materia }} ({{ materiaSeleccionada.paralelo }})</h2>
        <form @submit.prevent="guardarHorario">
          <div class="modal-form-row">
            <label>Docente:</label>
            <select v-model="horarioEdit.id_usuario" required>
              <option disabled value="">Selecciona un docente</option>
              <option
                v-for="docente in docentesOrdenados"
                :key="docente.id_usuario"
                :value="docente.id_usuario"
              >
                {{ docente.nombres }} {{ docente.apellidos }}
              </option>
            </select>
            <div class="modal-form-row">
              <label>Aula:</label>
              <select v-model="horarioEdit.id_aula" required>
                <option disabled value="">Selecciona un aula</option>
                <option v-for="aula in aulasFull" :key="aula.id_aula" :value="aula.id_aula">
                  {{ aula.nombre_aula }} - Piso {{ aula.numero_piso }} - {{ aula.nombre_edificio }} - {{ aula.nombre_facultad }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-form-row">
            <label>Día:</label>
            <select v-model="horarioEdit.dia" required>
              <option disabled value="">Selecciona un día</option>
              <option>Lunes</option>
              <option>Martes</option>
              <option>Miércoles</option>
              <option>Jueves</option>
              <option>Viernes</option>
              <option>Sábado</option>
            </select>
          </div>
          <div class="modal-form-row">
            <label>Hora inicio:</label>
            <input v-model="horarioEdit.hora_inicio" type="time" required />
          </div>
          <div class="modal-form-row">
            <label>Hora fin:</label>
            <input v-model="horarioEdit.hora_fin" type="time" required />
          </div>
          <div class="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" @click="cerrarModalHorario">Cancelar</button>
          </div>
        </form>
        <!-- Lista de horarios actuales -->
        <div v-if="horariosMateria.length">
          <h3 style="margin-top:18px;">Horarios asignados:</h3>
          <table class="horarios-table">
            <thead>
              <tr>
                <th>Día</th>
                <th>Hora inicio</th>
                <th>Hora fin</th>
                <th>Docente</th>
                <th>Aula</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in horariosMateria" :key="h.id_horario">
                <td>{{ h.dia_semana }}</td>
                <td>{{ h.hora_inicio }}</td>
                <td>{{ h.hora_fin }}</td>
                <td>
                  {{ docentes.find(d => d.id_usuario === h.id_usuario)?.nombres || 'Docente' }}
                </td>
                <td>
                  {{ aulasFull.find(a => a.id_aula === h.id_aula)?.nombre_aula || 'Aula' }}
                </td>
                <td>
                  <button @click="eliminarHorario(h.id_horario)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- ========== FIN MODAL DE HORARIOS ========== -->

    <main class="menu-main">
      <div class="menu-container">
        <h1 class="menu-saludo">¡Hola, <span class="menu-nombre">{{ correo.toUpperCase() }}</span>! 👋</h1>

        <!-- ========== GESTIÓN DE USUARIOS ========== -->
        <div v-if="activeTab === 'usuarios'">
          <div class="menu-subtitulo">Gestión de Usuarios</div>
          <table class="usuarios-table">
            <thead>
              <tr>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuarios" :key="usuario.id_usuario">
                <td>{{ usuario.nombres }}</td>
                <td>{{ usuario.apellidos }}</td>
                <td>{{ usuario.correo }}</td>
                <td>
                  <button @click="abrirModal(usuario)">Editar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- ========== FIN GESTIÓN DE USUARIOS ========== -->

        <!-- ========== GESTIÓN DE AULAS ========== -->
        <div v-if="activeTab === 'aulas'">
          <div class="menu-subtitulo">Gestión de Aulas</div>
          <!-- Añadir Facultad -->
          <form @submit.prevent="crearFacultad" class="materia-form" style="margin-bottom:10px;">
            <input v-model="nuevaFacultad" placeholder="Nueva Facultad" required />
            <button type="submit">Añadir Facultad</button>
          </form>
          <!-- Añadir Edificio -->
          <form @submit.prevent="crearEdificio" class="materia-form" style="margin-bottom:10px;">
            <select v-model="nuevoEdificio.id_facultad" required>
              <option disabled value="">Facultad</option>
              <option v-for="f in facultades" :key="f.id_facultad" :value="f.id_facultad">{{ f.nombre_facultad }}</option>
            </select>
            <input v-model="nuevoEdificio.nombre_edificio" placeholder="Nuevo Edificio" required />
            <button type="submit">Añadir Edificio</button>
          </form>
          <!-- Añadir Piso -->
          <form @submit.prevent="crearPiso" class="materia-form" style="margin-bottom:10px;">
            <select v-model="nuevoPiso.id_facultad" @change="cargarEdificiosParaPiso" required>
              <option disabled value="">Facultad</option>
              <option v-for="f in facultades" :key="f.id_facultad" :value="f.id_facultad">{{ f.nombre_facultad }}</option>
            </select>
            <select v-model="nuevoPiso.id_edificio" required>
              <option disabled value="">Edificio</option>
              <option v-for="e in edificiosParaPiso" :key="e.id_edificio" :value="e.id_edificio">{{ e.nombre_edificio }}</option>
            </select>
            <input v-model.number="nuevoPiso.numero_piso" type="number" min="1" placeholder="Número de Piso" required />
            <button type="submit">Añadir Piso</button>
          </form>
          <!-- Crear Aula -->
          <form @submit.prevent="crearAula" class="materia-form">
            <select v-model="nuevaAula.id_facultad" @change="cargarEdificios" required>
              <option disabled value="">Facultad</option>
              <option v-for="f in facultades" :key="f.id_facultad" :value="f.id_facultad">{{ f.nombre_facultad }}</option>
            </select>
            <select v-model="nuevaAula.id_edificio" @change="cargarPisos" required>
              <option disabled value="">Edificio</option>
              <option v-for="e in edificios" :key="e.id_edificio" :value="e.id_edificio">{{ e.nombre_edificio }}</option>
            </select>
            <select v-model="nuevaAula.id_piso" required>
              <option disabled value="">Piso</option>
              <option v-for="p in pisos" :key="p.id_piso" :value="p.id_piso">Piso {{ p.numero_piso }}</option>
            </select>
            <input v-model="nuevaAula.nombre_aula" placeholder="Nombre del aula" required />
            <button type="submit">Crear Aula</button>
          </form>
          <table class="usuarios-table" style="margin-top:16px;">
            <thead>
              <tr>
                <th>Nombre Aula</th>
                <th>Piso</th>
                <th>Edificio</th>
                <th>Facultad</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aula in aulasFull" :key="aula.id_aula">
                <td>{{ aula.nombre_aula }}</td>
                <td>{{ aula.numero_piso }}</td>
                <td>{{ aula.nombre_edificio }}</td>
                <td>{{ aula.nombre_facultad }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- ========== FIN GESTIÓN DE AULAS ========== -->

        <!-- ========== GESTIÓN DE MATERIAS ========== -->
        <div v-if="activeTab === 'materias'">
          <div class="menu-subtitulo">Gestión de Materias</div>
          <form @submit.prevent="agregarMateria" class="materia-form">
            <input v-model="nuevaMateria.nombre_materia" placeholder="Nombre de la materia" required />
            <input v-model.number="nuevaMateria.nivel" type="number" min="1" placeholder="Nivel" required />
            <input v-model="nuevaMateria.paralelo" placeholder="Paralelo (ej: A, B, C)" maxlength="1" required />
            <button type="submit">Añadir Materia</button>
          </form>
          <table class="usuarios-table" style="margin-top:16px;">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Materia</th>
                <th>Nivel</th>
                <th>Paralelo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="materia in materias" :key="materia.id_materia">
                <td>{{ materia.id_materia }}</td>
                <td>{{ materia.nombre_materia }}</td>
                <td>{{ materia.nivel }}</td>
                <td>{{ materia.paralelo }}</td>
                <td>
                  <button @click="abrirModalHorario(materia)">Editar horario</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- ========== FIN GESTIÓN DE MATERIAS ========== -->

        <!-- ========== BIENVENIDA ========== -->
        <div v-else-if="activeTab === 'principal'">
          <div class="menu-subtitulo">Bienvenido al panel de administración</div>
        </div>
        <!-- ========== FIN BIENVENIDA ========== -->
      </div>

      <!-- ========== MODAL DE EDICIÓN DE USUARIO ========== -->
      <div v-if="mostrarModal" class="modal-overlay">
        <div class="modal-content modal-wide">
          <h2>Editar Usuario</h2>
          <form @submit.prevent="guardarCambiosUsuario">
            <div class="modal-form-row">
              <label>Nombres:</label>
              <input v-model="usuarioSeleccionado.nombres" required />
            </div>
            <div class="modal-form-row">
              <label>Apellidos:</label>
              <input v-model="usuarioSeleccionado.apellidos" required />
            </div>
            <div class="modal-form-row">
              <label>Correo:</label>
              <input v-model="usuarioSeleccionado.correo" readonly style="background:#eee;" />
            </div>
            <div class="modal-form-row">
              <label>Contraseña:</label>
              <input v-model="usuarioSeleccionado.contrasena" readonly style="background:#eee;" />
            </div>
            <div class="modal-form-row">
              <label>Fecha Nacimiento:</label>
              <input v-model="usuarioSeleccionado.fecha_nacimiento" type="date" />
            </div>
            <div class="modal-form-row">
              <label>Cédula:</label>
              <input v-model="usuarioSeleccionado.cedula" />
            </div>
            <div class="modal-form-row">
              <label>Edad:</label>
              <input v-model="usuarioSeleccionado.edad" type="number" min="0" />
            </div>
            <div class="modal-form-row">
              <label>Rol:</label>
              <select v-model="usuarioSeleccionado.rol">
                <option value="estudiante">Estudiante</option>
                <option value="docente">Docente</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            <div class="modal-form-row" v-if="usuarioSeleccionado.rol === 'docente'">
              <label>Materias Impartidas:</label>
              <div v-for="materia in materias" :key="materia.id_materia">
                <input
                  type="checkbox"
                  :id="'imp-'+materia.id_materia"
                  :value="materia.id_materia"
                  v-model="usuarioSeleccionado.materiasImpartidas"
                />
                <label :for="'imp-'+materia.id_materia">
                  {{ materia.nombre_materia }} ({{ materia.paralelo }})
                </label>
              </div>
            </div>

            <!-- Para estudiantes -->
            <div class="modal-form-row" v-if="usuarioSeleccionado.rol === 'estudiante'">
              <label>Materias Recibidas:</label>
              <div v-for="materia in materias" :key="materia.id_materia">
                <input
                  type="checkbox"
                  :id="'rec-'+materia.id_materia"
                  :value="materia.id_materia"
                  v-model="usuarioSeleccionado.materiasRecibidas"
                />
                <label :for="'rec-'+materia.id_materia">
                  {{ materia.nombre_materia }} ({{ materia.paralelo }})
                </label>
              </div>
            </div>
            <div class="modal-actions">
              <button type="submit">Guardar</button>
              <button type="button" @click="cerrarModal">Cancelar</button>
                <button type="button"  @click="eliminarUsuario" style="background:#b71c1c;color:#fff;margin-left:auto;" >Eliminar usuario</button>
            </div>
          </form>
        </div>
      </div>
      <!-- ========== FIN MODAL DE EDICIÓN DE USUARIO ========== -->

    </main>
  </div>
</template>

<script setup lang="ts">
import mini from '@/assets/images/LogoMini Uleam.png';
import { useRoute, useRouter } from 'vue-router';
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

////////////////////////////////////////////////////////////////////////////////
// ========== VARIABLES DE RUTA Y ESTADO GENERAL ==========
////////////////////////////////////////////////////////////////////////////////
const route = useRoute();
const router = useRouter();
const correo = route.query.correo || 'Usuario';
const activeTab = ref('principal');
const showMenu = ref(false);

////////////////////////////////////////////////////////////////////////////////
// ========== USUARIO ACTUAL Y NAVBAR ==========
////////////////////////////////////////////////////////////////////////////////
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

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function logout() {
  showMenu.value = false;
  router.push({ name: 'Login' }); // O la ruta de tu login
}

function handleClickOutside(event: MouseEvent) {
  const menu = document.querySelector('.navbar-user');
  if (menu && !menu.contains(event.target as Node)) {
    showMenu.value = false;
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  cargarUsuarios();
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

////////////////////////////////////////////////////////////////////////////////
// ========== USUARIOS: LISTADO, MODAL Y EDICIÓN ==========
////////////////////////////////////////////////////////////////////////////////
const usuarios = ref<any[]>([]);
const mostrarModal = ref(false);
const usuarioSeleccionado = ref<any>({});

async function cargarUsuarios() {
  try {
    const res = await fetch('http://localhost:3001/api/usuarios');
    const data = await res.json();
    usuarios.value = data;
  } catch (e) {
    usuarios.value = [];
  }
}

async function abrirModal(usuario: any) {
  usuarioSeleccionado.value = { ...usuario };

  try {
    await cargarMaterias();

    if (usuario.rol === 'docente') {
      const res = await fetch(`http://localhost:3001/api/docentes/${usuario.id_usuario}/materias`);
      usuarioSeleccionado.value.materiasImpartidas = (await res.json()).map(Number);
    }
    if (usuario.rol === 'estudiante') {
      const res = await fetch(`http://localhost:3001/api/estudiantes/${usuario.id_usuario}/materias`);
      usuarioSeleccionado.value.materiasRecibidas = (await res.json()).map(Number);
    }
  } catch (e) {
    alert('Error cargando datos del usuario: ' + e.message);
  }

  mostrarModal.value = true;
}
function cerrarModal() {
  mostrarModal.value = false;
}

async function guardarCambiosUsuario() {
  try {
    // Actualiza los datos básicos del usuario
    await fetch(`http://localhost:3001/api/usuarios/${usuarioSeleccionado.value.id_usuario}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarioSeleccionado.value)
    });

    // Si es docente, actualiza materias impartidas
    if (usuarioSeleccionado.value.rol === 'docente') {
      await fetch(`http://localhost:3001/api/docentes/${usuarioSeleccionado.value.id_usuario}/materias`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materias: usuarioSeleccionado.value.materiasImpartidas || [] })
      });
    }

    // Si es estudiante, actualiza materias recibidas
    if (usuarioSeleccionado.value.rol === 'estudiante') {
      await fetch(`http://localhost:3001/api/estudiantes/${usuarioSeleccionado.value.id_usuario}/materias`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materias: usuarioSeleccionado.value.materiasRecibidas || [] })
      });
    }

    alert('Usuario actualizado');
    cerrarModal();
    cargarUsuarios();
  } catch (e) {
    alert('Error al guardar');
  }
}

async function eliminarUsuario() {
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
  try {
    await fetch(`http://localhost:3001/api/usuarios/${usuarioSeleccionado.value.id_usuario}`, {
      method: 'DELETE'
    });
    alert('Usuario eliminado');
    cerrarModal();
    cargarUsuarios();
  } catch (e) {
    alert('Error al eliminar usuario');
  }
}

////////////////////////////////////////////////////////////////////////////////
// ========== DOCENTES PARA HORARIOS ==========
////////////////////////////////////////////////////////////////////////////////
const docentes = ref<any[]>([]);
const docentesOrdenados = computed(() =>
  docentes.value
    .filter(d => d.rol === 'docente')
    .sort((a, b) => a.id_usuario - b.id_usuario)
);

async function cargarDocentes() {
  try {
    const res = await fetch('http://localhost:3001/api/usuarios');
    const data = await res.json();
    docentes.value = data;
  } catch {
    docentes.value = [];
  }
}

////////////////////////////////////////////////////////////////////////////////
// ========== MODAL DE HORARIOS ==========
////////////////////////////////////////////////////////////////////////////////
const mostrarModalHorario = ref(false);
const materiaSeleccionada = ref<any>({});
const horarioEdit = ref({ dia: '', hora_inicio: '', hora_fin: '', id_usuario: '', id_aula: '' });
const horariosMateria = ref<any[]>([]);

async function abrirModalHorario(materia: any) {
  materiaSeleccionada.value = { ...materia };
  horarioEdit.value = { dia: '', hora_inicio: '', hora_fin: '', id_usuario: '', id_aula: '' };
  try {
    const res = await fetch(`http://localhost:3001/api/materias/${materia.id_materia}/horarios`);
    horariosMateria.value = await res.json();
  } catch {
    horariosMateria.value = [];
  }
  await cargarDocentes();
  await cargarAulasFull();
  mostrarModalHorario.value = true;
}

function cerrarModalHorario() {
  mostrarModalHorario.value = false;
}

async function guardarHorario() {
  if (!horarioEdit.value.id_usuario || !horarioEdit.value.id_aula) {
    alert('Debes seleccionar un docente y un aula.');
    return;
  }
  try {
    const response = await fetch(`http://localhost:3001/api/materias/${materiaSeleccionada.value.id_materia}/horarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dia_semana: horarioEdit.value.dia,
        hora_inicio: horarioEdit.value.hora_inicio,
        hora_fin: horarioEdit.value.hora_fin,
        id_usuario: horarioEdit.value.id_usuario,
        id_aula: horarioEdit.value.id_aula
      })
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.error || 'Error al guardar horario');
      return;
    }
    alert('Horario guardado correctamente');
    cerrarModalHorario();
    // Recarga la lista de horarios
    const res = await fetch(`http://localhost:3001/api/materias/${materiaSeleccionada.value.id_materia}/horarios`);
    horariosMateria.value = await res.json();
  } catch (e) {
    alert('Error al guardar horario: ' + e.message);
  }
}

async function eliminarHorario(id_horario) {
  if (!confirm('¿Seguro que deseas eliminar este horario?')) return;
  try {
    const res = await fetch(`http://localhost:3001/api/horarios/${id_horario}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (res.ok) {
      alert('Horario eliminado');
      // Recarga la lista de horarios
      const horariosRes = await fetch(`http://localhost:3001/api/materias/${materiaSeleccionada.value.id_materia}/horarios`);
      horariosMateria.value = await horariosRes.json();
    } else {
      alert(data.error || 'Error al eliminar');
    }
  } catch (e) {
    alert('Error al eliminar: ' + e.message);
  }
}

////////////////////////////////////////////////////////////////////////////////
// ========== MATERIAS: LISTADO Y CREACIÓN ==========
////////////////////////////////////////////////////////////////////////////////
const materias = ref<any[]>([]);
const nuevaMateria = ref({ nombre_materia: '', nivel: 1, paralelo: '' });

async function cargarMaterias() {
  try {
    const res = await fetch('http://localhost:3001/api/materias');
    materias.value = await res.json();
  } catch (e) {
    materias.value = [];
  }
}

async function agregarMateria() {
  try {
    await fetch('http://localhost:3001/api/materias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaMateria.value)
    });
    nuevaMateria.value = { nombre_materia: '', nivel: 1, paralelo: '' };
    cargarMaterias();
    alert('Materia añadida');
  } catch (e) {
    alert('Error al añadir materia');
  }
}

// Cargar materias cuando se selecciona la pestaña o abre modal docente
watch(activeTab, (tab) => {
  if (tab === 'materias' || tab === 'usuarios') cargarMaterias();
});

////////////////////////////////////////////////////////////////////////////////
// ========== AULAS, FACULTADES, EDIFICIOS Y PISOS ==========
////////////////////////////////////////////////////////////////////////////////
const facultades = ref([]);
const edificios = ref([]);
const pisos = ref([]);
const aulasFull = ref([]);
const nuevaAula = ref({ nombre_aula: '', id_facultad: '', id_edificio: '', id_piso: '' });
const nuevaFacultad = ref('');
const nuevoEdificio = ref({ nombre_edificio: '', id_facultad: '' });
const nuevoPiso = ref({ numero_piso: '', id_edificio: '' });
const edificiosParaAula = ref([]);
const edificiosParaPiso = ref([]);

async function cargarFacultades() {
  const res = await fetch('http://localhost:3001/api/facultades');
  facultades.value = await res.json();
}
async function cargarEdificios() {
  edificios.value = [];
  pisos.value = [];
  if (nuevaAula.value.id_facultad) {
    const res = await fetch(`http://localhost:3001/api/edificios?id_facultad=${nuevaAula.value.id_facultad}`);
    edificios.value = await res.json();
  }
  if (nuevoEdificio.id_facultad) {
    const res = await fetch(`http://localhost:3001/api/edificios?id_facultad=${nuevoEdificio.id_facultad}`);
    edificios.value = await res.json();
  }
}
async function cargarPisos() {
  pisos.value = [];
  nuevaAula.value.id_piso = '';
  if (nuevaAula.value.id_edificio) {
    const res = await fetch(`http://localhost:3001/api/pisos?id_edificio=${nuevaAula.value.id_edificio}`);
    pisos.value = await res.json();
  }
}
async function cargarAulasFull() {
  const res = await fetch('http://localhost:3001/api/aulas_full');
  aulasFull.value = await res.json();
}
async function cargarEdificiosParaAula() {
  edificiosParaAula.value = [];
  pisos.value = [];
  nuevaAula.value.id_edificio = '';
  nuevaAula.value.id_piso = '';
  if (nuevaAula.value.id_facultad) {
    const res = await fetch(`http://localhost:3001/api/edificios?id_facultad=${nuevaAula.value.id_facultad}`);
    edificiosParaAula.value = await res.json();
  }
}
async function cargarEdificiosParaPiso() {
  edificiosParaPiso.value = [];
  nuevoPiso.value.id_edificio = '';
  if (nuevoPiso.value.id_facultad) {
    const res = await fetch(`http://localhost:3001/api/edificios?id_facultad=${nuevoPiso.value.id_facultad}`);
    edificiosParaPiso.value = await res.json();
  }
}

async function crearFacultad() {
  await fetch('http://localhost:3001/api/facultades', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre_facultad: nuevaFacultad.value })
  });
  nuevaFacultad.value = '';
  await cargarFacultades();
}

async function crearEdificio() {
  await fetch('http://localhost:3001/api/edificios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoEdificio.value)
  });
  nuevoEdificio.value = { nombre_edificio: '', id_facultad: '' };
  await cargarEdificios();
}

async function crearPiso() {
  await fetch('http://localhost:3001/api/pisos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoPiso.value)
  });
  nuevoPiso.value = { numero_piso: '', id_edificio: '' };
  await cargarPisos();
}

async function crearAula() {
  await fetch('http://localhost:3001/api/aulas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre_aula: nuevaAula.value.nombre_aula,
      id_piso: nuevaAula.value.id_piso
    })
  });
  nuevaAula.value = { nombre_aula: '', id_facultad: '', id_edificio: '', id_piso: '' };
  cargarAulasFull();
}

////////////////////////////////////////////////////////////////////////////////
// ========== WATCHERS PARA CARGA AUTOMÁTICA ==========
////////////////////////////////////////////////////////////////////////////////
watch(activeTab, (tab) => {
  if (tab === 'aulas') {
    cargarFacultades();
    cargarAulasFull();
    cargarEdificios();
  }
});
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

.menu-nombre {
  text-transform: uppercase;
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

.menu-subtitulo {
  color: #e53935;
  font-weight: 600;
  margin-bottom: 18px;
  font-size: 1.1rem;
}

.usuarios-table th, .usuarios-table td {
  border: 1px solid #e0e0e0;
  padding: 8px 6px;
  text-align: center;
  font-size: 1rem;
}
.usuarios-table th {
  background: #424242;
  color: #fff;
  font-size: 1rem;
}
.usuarios-table input[readonly] {
  color: #888;
  cursor: not-allowed;
}
.usuarios-table input, .usuarios-table select {
  width: 100%;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 1rem;
}
.usuarios-table button {
  background: #424242;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
}
.usuarios-table button:hover {
  background: #e53935;
}
.materia-form {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}
.materia-form input, .materia-form button {
  padding: 6px 10px;
  font-size: 0.95rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}
.modal-content {
  background: #fff;
  border-radius: 10px;
  padding: 32px 24px;
  min-width: 480px;
  max-width: 95vw;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
}
.modal-content.modal-wide {
  min-width: 480px;
  max-width: 700px;
}
.modal-form-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.modal-form-row label {
  font-weight: 500;
  margin-bottom: 4px;
}
.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}
.modal-actions button {
  padding: 6px 18px;
  border-radius: 4px;
  border: none;
  background: #e53935;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.modal-actions button[type="button"] {
  background: #757575;
}

.btn-logout {
  background: transparent;
  border: 1.5px solid #fff;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  margin-right: 18px;
  transition: background 0.2s, color 0.2s;
}

.btn-logout:hover {
  background: #e53935;
  border-color: #e53935;
  color: #fff;
}
</style>