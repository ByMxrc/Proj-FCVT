import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usuarioService } from '../../services/UsuarioService'
import { facultadService } from '../../services/FacultadService'
import { edificioService } from '../../services/EdificioService'
import { pisoService } from '../../services/PisoService'
import { aulaService } from '../../services/AulaService'
import { materiaService } from '../../services/MateriaService'
import { horarioService } from '../../services/HorarioService'
import { docenteService } from '../../services/DocenteService'
import type { Usuario, RolEnum } from '../../interfaces/Usuario'
import type { Facultad } from '../../interfaces/Facultad'
import type { Edificio } from '../../interfaces/Edificio'
import type { Piso } from '../../interfaces/Piso'
import type { Aula } from '../../interfaces/Aula'
import type { Materia } from '../../interfaces/Materia'
import type { Horario, DiaSemanaEnum } from '../../interfaces/Horario'
import type { Docente } from '../../interfaces/Docente'
import type { Paralelo } from '../../interfaces/Paralelo'
import { calculateAge } from '../../services/UsuarioService'

export function useMenuAdmin() {
  const router = useRouter()
  
  // =================== ESTADO GLOBAL ===================
  const adminData = ref({
    name: 'Admin. María López'
  })

  const systemStats = ref({
    totalUsers: 1547,
    activeCourses: 89,
    facilities: 45,
    facultiesCount: 8
  })

  // =================== NAVEGACIÓN ===================
  const activeSection = ref('dashboard')

  const navSections = ref([
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'DashboardIcon'
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: 'UsersIcon'
    },
    {
      id: 'infraestructura',
      label: 'Infraestructura',
      icon: 'BuildingIcon'
    },
    {
      id: 'materias',
      label: 'Materias',
      icon: 'BookIcon'
    },
    {
      id: 'horarios',
      label: 'Horarios',
      icon: 'ClockIcon'
    }
  ])

  const setActiveSection = (sectionId: string) => {
    activeSection.value = sectionId
    if (sectionId !== 'dashboard') {
      cargarDatosSeccion()
    }
  }

  // =================== GESTIÓN DE USUARIOS ===================
  const usuarios = ref<Usuario[]>([])
  const busquedaUsuarios = ref('')

  const usuariosFiltrados = computed(() => {
    let resultado = usuarios.value

    if (filtroRolUsuarios.value) {
      if (filtroRolUsuarios.value === 'null') {
        resultado = resultado.filter(usuario => usuario.rol === null)
      } else {
        resultado = resultado.filter(usuario => usuario.rol === filtroRolUsuarios.value)
      }
    }

    if (busquedaUsuarios.value) {
      resultado = resultado.filter(usuario =>
        usuario.nombres.toLowerCase().includes(busquedaUsuarios.value.toLowerCase()) ||
        usuario.apellidos.toLowerCase().includes(busquedaUsuarios.value.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(busquedaUsuarios.value.toLowerCase()) ||
        usuario.cedula.includes(busquedaUsuarios.value)
      )
    }

    return resultado
  })

  // Estados del modal de usuarios
  const mostrarModalUsuario = ref(false)
  const modoEdicionUsuario = ref(false)
  const usuarioEditando = ref<Usuario | null>(null)
  const guardandoUsuario = ref(false)
  const filtroRolUsuarios = ref('')

  const formularioUsuario = ref({
    nombres: '',
    apellidos: '',
    cedula: '',
    correo: '',
    contrasena: '',
    fecha_nacimiento: '',
    rol: '' as any
  })

  const cargarUsuarios = async () => {
    try {
      usuarios.value = await usuarioService.getAllUsuarios()
      console.log('✅ Usuarios cargados:', usuarios.value.length)
      console.log('📊 Usuarios por rol:', {
        estudiante: usuarios.value.filter(u => u.rol === 'estudiante').length,
        docente: usuarios.value.filter(u => u.rol === 'docente').length,
        administrador: usuarios.value.filter(u => u.rol === 'administrador').length,
        null: usuarios.value.filter(u => u.rol === null).length
      })
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    }
  }

  const abrirModalCrearUsuario = () => {
    modoEdicionUsuario.value = false
    usuarioEditando.value = null
    formularioUsuario.value = {
      nombres: '',
      apellidos: '',
      cedula: '',
      correo: '',
      contrasena: '',
      fecha_nacimiento: '',
      rol: '' as any
    }
    mostrarModalUsuario.value = true
  }

  const editarUsuario = (usuario: Usuario) => {
    modoEdicionUsuario.value = true
    usuarioEditando.value = usuario
    formularioUsuario.value = {
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      cedula: usuario.cedula,
      correo: usuario.correo,
      contrasena: '',
      fecha_nacimiento: usuario.fecha_nacimiento,
      rol: usuario.rol
    }
    mostrarModalUsuario.value = true
  }

  const guardarUsuario = async () => {
    guardandoUsuario.value = true
    try {
      // Si no se selecciona rol, asignar 'estudiante' por defecto para cumplir con la restricción de BD
      const rolParaGuardar = formularioUsuario.value.rol === '' ? 'estudiante' : formularioUsuario.value.rol
      console.log('🔍 Rol del formulario:', formularioUsuario.value.rol)
      console.log('🔍 Rol para guardar:', rolParaGuardar)
      
      if (modoEdicionUsuario.value && usuarioEditando.value) {
        const datosActualizacion: any = {
          nombres: formularioUsuario.value.nombres,
          apellidos: formularioUsuario.value.apellidos,
          fecha_nacimiento: formularioUsuario.value.fecha_nacimiento,
          edad: calculateAge(formularioUsuario.value.fecha_nacimiento),
          rol: rolParaGuardar
        }

        if (formularioUsuario.value.contrasena) {
          datosActualizacion.contrasena = formularioUsuario.value.contrasena
        }

        await usuarioService.updateUsuario(
          usuarioEditando.value.id_usuario.toString(),
          datosActualizacion
        )
      } else {
        await usuarioService.createUsuario({
          nombres: formularioUsuario.value.nombres,
          apellidos: formularioUsuario.value.apellidos,
          cedula: formularioUsuario.value.cedula,
          correo: formularioUsuario.value.correo,
          contrasena: formularioUsuario.value.contrasena,
          fecha_nacimiento: formularioUsuario.value.fecha_nacimiento,
          edad: calculateAge(formularioUsuario.value.fecha_nacimiento),
          rol: rolParaGuardar
        })
      }

      await cargarUsuarios()
      cerrarModalUsuario()
      alert(`Usuario ${modoEdicionUsuario.value ? 'actualizado' : 'creado'} exitosamente`)
    } catch (error) {
      console.error('Error al guardar usuario:', error)
      alert('Error al guardar usuario')
    } finally {
      guardandoUsuario.value = false
    }
  }

  const eliminarUsuario = async (usuario: Usuario) => {
    if (!confirm(`¿Está seguro de eliminar a ${usuario.nombres} ${usuario.apellidos}?`)) return

    try {
      await usuarioService.deleteUsuario(usuario.id_usuario.toString())
      await cargarUsuarios()
      alert('Usuario eliminado exitosamente')
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      alert('Error al eliminar usuario')
    }
  }

  const cerrarModalUsuario = () => {
    mostrarModalUsuario.value = false
    modoEdicionUsuario.value = false
    usuarioEditando.value = null
  }

  const formatRol = (rol: RolEnum | null): string => {
    const roles = {
      'estudiante': 'Estudiante',
      'docente': 'Docente', 
      'administrador': 'Administrador'
    }
    return roles[rol as keyof typeof roles] || 'Sin rol'
  }

  const cargarDatosSeccion = async () => {
    try {
      switch (activeSection.value) {
        case 'usuarios':
          await cargarUsuarios()
          break
        case 'infraestructura':
          await cargarInfraestructura()
          break
        case 'materias':
          await cargarUsuarios() // Cargar usuarios para obtener docentes
          await cargarMaterias()
          await cargarInfraestructura() // Necesario para las aulas
          break
        case 'horarios':
          await cargarUsuarios() // Necesario para los docentes
          await cargarMaterias()
          await cargarHorarios()
          await cargarParalelos() // Cargar paralelos para selección
          await cargarInfraestructura() // Necesario para las aulas
          break
      }
    } catch (error) {
      console.error('Error al cargar datos:', error)
    }
  }

  // =================== GESTIÓN DE INFRAESTRUCTURA ===================
  // Estados para infraestructura
  const facultades = ref<Facultad[]>([])
  const edificios = ref<Edificio[]>([])
  const pisos = ref<Piso[]>([])
  const aulas = ref<Aula[]>([])
  
  // Estados de UI para infraestructura
  const tipoInfraestructuraActivo = ref('facultades') // 'facultades', 'edificios', 'pisos', 'aulas'
  const mostrarModalInfraestructura = ref(false)
  const modoEdicionInfraestructura = ref(false)
  const guardandoInfraestructura = ref(false)
  
  // Formularios
  const formularioFacultad = ref({
    nombre_facultad: ''
  })
  
  const formularioEdificio = ref({
    nombre_edificio: '',
    id_facultad: ''
  })
  
  const formularioPiso = ref({
    numero_piso: '',
    id_edificio: '',
    id_facultad: ''
  })
  
  const formularioAula = ref({
    nombre_aula: '',
    id_piso: '',
    id_edificio: '',
    id_facultad: ''
  })
  
  // Filtros y selecciones
  const facultadSeleccionada = ref('')
  const edificioSeleccionado = ref('')
  const pisoSeleccionado = ref('')
  
  // Opciones predefinidas para pisos
  const opcionesPisos = [
    { valor: -2, texto: 'Subterráneo 2' },
    { valor: -1, texto: 'Subterráneo 1' },
    { valor: 0, texto: 'Planta Baja' },
    { valor: 1, texto: 'Piso 1' },
    { valor: 2, texto: 'Piso 2' },
    { valor: 3, texto: 'Piso 3' },
    { valor: 4, texto: 'Piso 4' },
    { valor: 5, texto: 'Piso 5' },
    { valor: 6, texto: 'Piso 6' },
    { valor: 7, texto: 'Piso 7' },
    { valor: 8, texto: 'Piso 8' },
    { valor: 9, texto: 'Piso 9' },
    { valor: 10, texto: 'Piso 10' }
  ]
  
  // Función para formatear el número de piso para mostrar
  const formatearNumeroPiso = (numero: number): string => {
    const opcion = opcionesPisos.find(op => op.valor === numero)
    return opcion ? opcion.texto : `Piso ${numero}`
  }
  
  // Función para convertir nombres de plural a singular
  const obtenerNombreSingular = (tipo: string): string => {
    const nombres = {
      'facultades': 'Facultad',
      'edificios': 'Edificio', 
      'pisos': 'Piso',
      'aulas': 'Aula'
    }
    return nombres[tipo as keyof typeof nombres] || tipo
  }

  // Función para obtener el título descriptivo del modal de infraestructura
  const obtenerTituloModalInfraestructura = (): string => {
    const accion = modoEdicionInfraestructura.value ? 'Editar' : 'Crear'
    const tipoSingular = obtenerNombreSingular(tipoInfraestructuraActivo.value)
    
    let contexto = ''
    
    switch (tipoInfraestructuraActivo.value) {
      case 'edificios':
        if (facultadSeleccionada.value) {
          const facultad = facultades.value.find(f => f.id_facultad === parseInt(facultadSeleccionada.value))
          contexto = ` en ${facultad?.nombre_facultad}`
        }
        break
      case 'pisos':
        if (edificioSeleccionado.value) {
          const edificio = edificios.value.find(e => e.id_edificio === parseInt(edificioSeleccionado.value))
          const facultad = edificio ? facultades.value.find(f => f.id_facultad === edificio.id_facultad) : null
          contexto = ` en ${edificio?.nombre_edificio}${facultad ? ` (${facultad.nombre_facultad})` : ''}`
        } else if (facultadSeleccionada.value) {
          const facultad = facultades.value.find(f => f.id_facultad === parseInt(facultadSeleccionada.value))
          contexto = ` en ${facultad?.nombre_facultad}`
        }
        break
      case 'aulas':
        if (pisoSeleccionado.value) {
          const piso = pisos.value.find(p => p.id_piso === parseInt(pisoSeleccionado.value))
          const edificio = piso ? edificios.value.find(e => e.id_edificio === piso.id_edificio) : null
          const facultad = edificio ? facultades.value.find(f => f.id_facultad === edificio.id_facultad) : null
          contexto = ` en ${formatearNumeroPiso(piso?.numero_piso || 0)}, ${edificio?.nombre_edificio}${facultad ? ` (${facultad.nombre_facultad})` : ''}`
        } else if (edificioSeleccionado.value) {
          const edificio = edificios.value.find(e => e.id_edificio === parseInt(edificioSeleccionado.value))
          const facultad = edificio ? facultades.value.find(f => f.id_facultad === edificio.id_facultad) : null
          contexto = ` en ${edificio?.nombre_edificio}${facultad ? ` (${facultad.nombre_facultad})` : ''}`
        } else if (facultadSeleccionada.value) {
          const facultad = facultades.value.find(f => f.id_facultad === parseInt(facultadSeleccionada.value))
          contexto = ` en ${facultad?.nombre_facultad}`
        }
        break
    }
    
    return `${accion} ${tipoSingular}${contexto}`
  }
  
  // Computed para filtros jerárquicos
  const edificiosFiltrados = computed(() => {
    if (!facultadSeleccionada.value) return edificios.value
    return edificios.value.filter(edificio => edificio.id_facultad === parseInt(facultadSeleccionada.value))
  })
  
  const pisosFiltrados = computed(() => {
    if (!edificioSeleccionado.value) return pisos.value
    return pisos.value.filter(piso => piso.id_edificio === parseInt(edificioSeleccionado.value))
  })
  
  const aulasFiltradas = computed(() => {
    if (!pisoSeleccionado.value) return aulas.value
    return aulas.value.filter(aula => aula.id_piso === parseInt(pisoSeleccionado.value))
  })

  // Computed properties para formularios modales
  const edificiosFiltradosPiso = computed(() => {
    if (!formularioPiso.value.id_facultad) return []
    return edificios.value.filter(edificio => edificio.id_facultad === parseInt(formularioPiso.value.id_facultad))
  })

  const edificiosFiltradosAula = computed(() => {
    if (!formularioAula.value.id_facultad) return []
    return edificios.value.filter(edificio => edificio.id_facultad === parseInt(formularioAula.value.id_facultad))
  })

  const pisosFiltradosAula = computed(() => {
    if (!formularioAula.value.id_edificio) return []
    return pisos.value.filter(piso => piso.id_edificio === parseInt(formularioAula.value.id_edificio))
  })

  // Funciones de cambio para formularios modales
  const onFacultadChangePiso = () => {
    // Limpiar edificio cuando cambia la facultad
    formularioPiso.value.id_edificio = ''
  }

  const onFacultadChangeAula = () => {
    // Limpiar edificio y piso cuando cambia la facultad
    formularioAula.value.id_edificio = ''
    formularioAula.value.id_piso = ''
  }

  const onEdificioChangeAula = () => {
    // Limpiar piso cuando cambia el edificio
    formularioAula.value.id_piso = ''
  }
  
  // Funciones de carga
  const cargarInfraestructura = async () => {
    try {
      await Promise.all([
        cargarFacultades(),
        cargarEdificios(),
        cargarPisos(),
        cargarAulas()
      ])
    } catch (error) {
      console.error('Error al cargar infraestructura:', error)
    }
  }
  
  const cargarFacultades = async () => {
    try {
      console.log('📚 Cargando facultades...')
      facultades.value = await facultadService.getAll()
      console.log('✅ Facultades cargadas:', facultades.value)
    } catch (error) {
      console.error('❌ Error al cargar facultades:', error)
    }
  }
  
  const cargarEdificios = async () => {
    try {
      console.log('🏢 Cargando edificios...')
      edificios.value = await edificioService.getAll()
      console.log('✅ Edificios cargados:', edificios.value)
    } catch (error) {
      console.error('❌ Error al cargar edificios:', error)
    }
  }
  
  const cargarPisos = async () => {
    try {
      pisos.value = await pisoService.getAll()
    } catch (error) {
      console.error('Error al cargar pisos:', error)
    }
  }
  
  const cargarAulas = async () => {
    try {
      aulas.value = await aulaService.getAll()
    } catch (error) {
      console.error('Error al cargar aulas:', error)
    }
  }
  
  // Funciones de modal
  const abrirModalCrearInfraestructura = (tipo: string) => {
    tipoInfraestructuraActivo.value = tipo
    modoEdicionInfraestructura.value = false
    limpiarFormularios()
    mostrarModalInfraestructura.value = true
  }
  
  const cerrarModalInfraestructura = () => {
    mostrarModalInfraestructura.value = false
    limpiarFormularios()
  }
  
  const limpiarFormularios = () => {
    formularioFacultad.value = { nombre_facultad: '' }
    formularioEdificio.value = { nombre_edificio: '', id_facultad: '' }
    formularioPiso.value = { numero_piso: '', id_edificio: '', id_facultad: '' }
    formularioAula.value = { nombre_aula: '', id_piso: '', id_edificio: '', id_facultad: '' }
  }
  
  // Funciones CRUD
  const guardarInfraestructura = async () => {
    guardandoInfraestructura.value = true
    try {
      switch (tipoInfraestructuraActivo.value) {
        case 'facultades':
          if (modoEdicionInfraestructura.value) {
            // Actualizar facultad
          } else {
            await facultadService.create(formularioFacultad.value)
            await cargarFacultades()
          }
          break
        case 'edificios':
          if (modoEdicionInfraestructura.value) {
            // Actualizar edificio
          } else {
            await edificioService.create({
              ...formularioEdificio.value,
              id_facultad: parseInt(formularioEdificio.value.id_facultad)
            })
            await cargarEdificios()
          }
          break
        case 'pisos':
          if (modoEdicionInfraestructura.value) {
            // Actualizar piso
          } else {
            await pisoService.create({
              numero_piso: parseInt(formularioPiso.value.numero_piso),
              id_edificio: parseInt(formularioPiso.value.id_edificio)
            })
            await cargarPisos()
          }
          break
        case 'aulas':
          if (modoEdicionInfraestructura.value) {
            // Actualizar aula
          } else {
            await aulaService.create({
              nombre_aula: formularioAula.value.nombre_aula,
              id_piso: parseInt(formularioAula.value.id_piso)
            })
            await cargarAulas()
          }
          break
      }
      cerrarModalInfraestructura()
    } catch (error) {
      console.error('Error al guardar:', error)
    } finally {
      guardandoInfraestructura.value = false
    }
  }

  // =================== GESTIÓN CRUD GENÉRICA ===================
  // (Pendiente para futuras secciones)

  // =================== GESTIÓN DE MATERIAS ===================
  // Estados para materias
  const materias = ref<Materia[]>([])
  const horarios = ref<Horario[]>([])
  const paralelos = ref<Paralelo[]>([])
  
  // Estados de UI para materias
  const mostrarModalMateria = ref(false)
  const modoEdicionMateria = ref(false)
  const guardandoMateria = ref(false)
  const materiaEditando = ref<Materia | null>(null)
  
  // Formulario de materia (simplificado - sin horarios)
  const formularioMateria = ref({
    nombre_materia: '',
    semestre: 0
  })
  
  // Opciones para los formularios
  const diasSemana: DiaSemanaEnum[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  const horariosDisponibles = computed(() => {
    const horas = []
    for (let i = 7; i <= 20; i++) {
      horas.push(`${i.toString().padStart(2, '0')}:00`)
      if (i < 20) {
        horas.push(`${i.toString().padStart(2, '0')}:30`)
      }
    }
    return horas
  })
  
  const semestresDisponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  
  // Computed para obtener solo docentes (usuarios con rol docente)
  const docentesDisponibles = computed(() => {
    const docentes = usuarios.value.filter(usuario => usuario.rol === 'docente')
    console.log('🧑‍🏫 Docentes disponibles:', docentes.length, docentes)
    console.log('👥 Total usuarios:', usuarios.value.length)
    return docentes
  })

  // Función para sincronizar tabla docente con usuarios con rol docente
  const sincronizarDocentes = async () => {
    try {
      console.log('🔄 Sincronizando tabla docente...')
      
      // Obtener usuarios con rol docente
      const usuariosDocentes = usuarios.value.filter(usuario => usuario.rol === 'docente')
      console.log('👥 Usuarios con rol docente encontrados:', usuariosDocentes.length, usuariosDocentes)
      
      // Obtener docentes existentes en la tabla docente
      const docentesExistentes = await docenteService.getAllDocentes()
      console.log('📋 Docentes existentes en tabla docente:', docentesExistentes.length, docentesExistentes)
      
      // Crear entradas faltantes en la tabla docente usando fetch directo
      for (const usuarioDocente of usuariosDocentes) {
        // Verificar si ya existe un docente con este ID
        const docenteExiste = docentesExistentes.find((d: Docente) => d.id_docente === usuarioDocente.id_usuario)
        
        if (!docenteExiste) {
          console.log(`➕ Creando entrada de docente para usuario ${usuarioDocente.id_usuario} (${usuarioDocente.nombres} ${usuarioDocente.apellidos})`)
          
          try {
            // Usar fetch directo para crear el docente
            const response = await fetch('https://pijowuuofyevtcphiaxv.supabase.co/rest/v1/docente', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8`,
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8',
                'Prefer': 'return=representation'
              },
              body: JSON.stringify({ id_docente: usuarioDocente.id_usuario })
            })
            
            if (response.ok) {
              console.log(`✅ Docente ${usuarioDocente.id_usuario} creado exitosamente`)
            } else {
              const errorText = await response.text()
              console.error(`❌ Error creando docente ${usuarioDocente.id_usuario}:`, response.status, errorText)
            }
          } catch (fetchError) {
            console.error(`❌ Error de red creando docente ${usuarioDocente.id_usuario}:`, fetchError)
          }
        } else {
          console.log(`✓ Docente ${usuarioDocente.id_usuario} ya existe`)
        }
      }
      
      console.log('✅ Sincronización de docentes completada')
    } catch (error) {
      console.error('❌ Error al sincronizar docentes:', error)
    }
  }
  
  // Funciones para materias
  const cargarMaterias = async () => {
    console.log('🔄 Cargando materias...')
    try {
      materias.value = await materiaService.getAll()
      console.log('✅ Materias cargadas:', materias.value.length, materias.value)
    } catch (error) {
      console.error('❌ Error al cargar materias:', error)
    }
  }
  
  const cargarHorarios = async () => {
    try {
      horarios.value = await horarioService.getAll()
      console.log('✅ Horarios cargados:', horarios.value.length)
    } catch (error) {
      console.error('Error al cargar horarios:', error)
    }
  }

  const cargarParalelos = async () => {
    try {
      // Primero intentar cargar paralelos existentes
      const response = await fetch('https://pijowuuofyevtcphiaxv.supabase.co/rest/v1/paralelo?select=id_paralelo,nombre_paralelo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8'
        }
      })
      
      if (response.ok) {
        paralelos.value = await response.json()
        console.log('✅ Paralelos cargados desde BD:', paralelos.value.length)
        
        // Si no hay paralelos básicos (A, B, C, D), crearlos
        const paralelosBasicos = ['A', 'B', 'C', 'D']
        const faltantes = paralelosBasicos.filter(nombre => 
          !paralelos.value.some(p => p.nombre_paralelo === nombre)
        )
        
        if (faltantes.length > 0) {
          console.log('🔄 Creando paralelos faltantes:', faltantes)
          for (const nombre of faltantes) {
            try {
              const createResponse = await fetch('https://pijowuuofyevtcphiaxv.supabase.co/rest/v1/paralelo', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8`,
                  'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8',
                  'Prefer': 'return=representation'
                },
                body: JSON.stringify({ nombre_paralelo: nombre })
              })
              
              if (createResponse.ok) {
                const nuevoParalelo = await createResponse.json()
                paralelos.value.push(...nuevoParalelo)
                console.log(`✅ Paralelo ${nombre} creado exitosamente`)
              } else {
                console.error(`❌ Error creando paralelo ${nombre}:`, await createResponse.text())
              }
            } catch (error) {
              console.error(`❌ Error de red creando paralelo ${nombre}:`, error)
            }
          }
        }
      } else {
        // Si no se pueden cargar, usar paralelos por defecto en memoria
        paralelos.value = [
          { id_paralelo: 1, nombre_paralelo: 'A' },
          { id_paralelo: 2, nombre_paralelo: 'B' },
          { id_paralelo: 3, nombre_paralelo: 'C' },
          { id_paralelo: 4, nombre_paralelo: 'D' }
        ]
        console.log('⚠️ Usando paralelos por defecto en memoria')
      }
    } catch (error) {
      console.error('❌ Error al cargar paralelos:', error)
      // En caso de error, usar paralelos por defecto
      paralelos.value = [
        { id_paralelo: 1, nombre_paralelo: 'A' },
        { id_paralelo: 2, nombre_paralelo: 'B' },
        { id_paralelo: 3, nombre_paralelo: 'C' },
        { id_paralelo: 4, nombre_paralelo: 'D' }
      ]
    }
  }
  
  const abrirModalCrearMateria = () => {
    console.log('🔄 Abriendo modal para crear materia...')
    modoEdicionMateria.value = false
    materiaEditando.value = null
    formularioMateria.value = {
      nombre_materia: '',
      semestre: 0
    }
    mostrarModalMateria.value = true
    console.log('✅ Modal abierto, formulario limpio')
  }
  
  const editarMateria = (materia: Materia) => {
    modoEdicionMateria.value = true
    materiaEditando.value = materia
    
    formularioMateria.value = {
      nombre_materia: materia.nombre_materia,
      semestre: materia.semestre
    }
    mostrarModalMateria.value = true
  }
  
  const cerrarModalMateria = () => {
    console.log('🔄 Cerrando modal de materia...')
    mostrarModalMateria.value = false
    formularioMateria.value = {
      nombre_materia: '',
      semestre: 0
    }
    console.log('✅ Modal cerrado, formulario limpio')
  }
  
  const guardarMateria = async () => {
    guardandoMateria.value = true
    console.log('🔄 Iniciando guardarMateria...')
    console.log('📝 Datos del formulario:', formularioMateria.value)
    console.log('✏️ Modo edición:', modoEdicionMateria.value)
    
    // Validación básica
    if (!formularioMateria.value.nombre_materia.trim()) {
      alert('Por favor ingrese el nombre de la materia')
      guardandoMateria.value = false
      return
    }
    
    if (formularioMateria.value.semestre <= 0) {
      alert('Por favor seleccione un semestre válido')
      guardandoMateria.value = false
      return
    }
    
    try {
      if (modoEdicionMateria.value && materiaEditando.value) {
        // Actualizar materia existente
        console.log('📝 Actualizando materia existente...')
        await materiaService.update(materiaEditando.value.id_materia.toString(), {
          nombre_materia: formularioMateria.value.nombre_materia,
          semestre: formularioMateria.value.semestre
        })
      } else {
        // Crear nueva materia
        console.log('✨ Creando nueva materia...')
        const nuevaMateria = await materiaService.create({
          nombre_materia: formularioMateria.value.nombre_materia,
          semestre: formularioMateria.value.semestre
        })
        console.log('✅ Materia creada:', nuevaMateria)
      }
      
      console.log('🔄 Recargando materias...')
      await cargarMaterias()
      cerrarModalMateria()
      alert(`Materia ${modoEdicionMateria.value ? 'actualizada' : 'creada'} exitosamente`)
    } catch (error) {
      console.error('❌ Error al guardar materia:', error)
      alert('Error al guardar materia: ' + (error as Error).message)
    } finally {
      guardandoMateria.value = false
      console.log('🏁 Proceso terminado')
    }
  }
  
  const eliminarMateria = async (materia: Materia) => {
    if (!confirm(`¿Está seguro de eliminar la materia "${materia.nombre_materia}"?`)) return
    
    try {
      // Eliminar horarios asociados primero
      const horariosMateria = horarios.value.filter(h => h.id_materia === materia.id_materia)
      for (const horario of horariosMateria) {
        await horarioService.delete(horario.id_horario.toString())
      }
      
      // Eliminar materia
      await materiaService.delete(materia.id_materia.toString())
      await cargarMaterias()
      await cargarHorarios()
      alert('Materia eliminada exitosamente')
    } catch (error) {
      console.error('Error al eliminar materia:', error)
      alert('Error al eliminar materia')
    }
  }
  
  // Función para obtener el nombre del docente
  const obtenerNombreDocente = (idDocente: number) => {
    const docente = usuarios.value.find(u => u.id_usuario === idDocente && u.rol === 'docente')
    return docente ? `${docente.nombres} ${docente.apellidos}` : 'Sin asignar'
  }
  
  // Función para obtener horarios de una materia
  const obtenerHorariosMateria = (idMateria: number) => {
    return horarios.value.filter(h => h.id_materia === idMateria)
  }
  
  // Función para formatear días y horarios
  const formatearHorario = (horario: Horario) => {
    const aula = aulas.value.find(a => a.id_aula === horario.id_aula)
    return `${horario.dia_semana} ${horario.hora_inicio.substring(0, 5)}-${horario.hora_fin.substring(0, 5)} (${aula?.nombre_aula || 'Sin aula'})`
  }

  // =================== GESTIÓN DE HORARIOS ===================
  // Estados de UI para horarios
  const mostrarModalHorario = ref(false)
  const modoEdicionHorario = ref(false)
  const guardandoHorario = ref(false)
  const horarioEditando = ref<Horario | null>(null)
  
  // Formulario de horario
  const formularioHorario = ref({
    id_materia: '',
    id_docente: '',
    id_paralelo: '',
    id_aula: '',
    dia_semana: 'lunes' as DiaSemanaEnum,
    hora_inicio: '07:00',
    hora_fin: '08:00',
    // Selección jerárquica para ubicación
    id_facultad: '',
    id_edificio: '',
    id_piso: ''
  })
  
  // Computed para filtros jerárquicos en horarios
  const edificiosFiltradosHorario = computed(() => {
    if (!formularioHorario.value.id_facultad) return edificios.value
    return edificios.value.filter(e => e.id_facultad === parseInt(formularioHorario.value.id_facultad))
  })
  
  const pisosFiltradosHorario = computed(() => {
    if (!formularioHorario.value.id_edificio) return pisos.value
    return pisos.value.filter(p => p.id_edificio === parseInt(formularioHorario.value.id_edificio))
  })
  
  const aulasFiltradosHorario = computed(() => {
    if (!formularioHorario.value.id_piso) return aulas.value
    return aulas.value.filter(a => a.id_piso === parseInt(formularioHorario.value.id_piso))
  })
  
  // Funciones para horarios
  const abrirModalCrearHorario = () => {
    modoEdicionHorario.value = false
    horarioEditando.value = null
    formularioHorario.value = {
      id_materia: '',
      id_docente: '',
      id_paralelo: '',
      id_aula: '',
      dia_semana: 'lunes',
      hora_inicio: '07:00',
      hora_fin: '08:00',
      id_facultad: '',
      id_edificio: '',
      id_piso: ''
    }
    mostrarModalHorario.value = true
  }
  
  const editarHorario = (horario: Horario) => {
    modoEdicionHorario.value = true
    horarioEditando.value = horario
    
    // Buscar aula y completar jerarquía
    const aula = aulas.value.find(a => a.id_aula === horario.id_aula)
    const piso = aula ? pisos.value.find(p => p.id_piso === aula.id_piso) : null
    const edificio = piso ? edificios.value.find(e => e.id_edificio === piso.id_edificio) : null
    
    formularioHorario.value = {
      id_materia: horario.id_materia.toString(),
      id_docente: horario.id_docente.toString(),
      id_paralelo: horario.id_paralelo?.toString() || '',
      id_aula: horario.id_aula.toString(),
      dia_semana: horario.dia_semana,
      hora_inicio: horario.hora_inicio.substring(0, 5),
      hora_fin: horario.hora_fin.substring(0, 5),
      id_facultad: edificio?.id_facultad.toString() || '',
      id_edificio: edificio?.id_edificio.toString() || '',
      id_piso: piso?.id_piso.toString() || ''
    }
    mostrarModalHorario.value = true
  }
  
  const cerrarModalHorario = () => {
    mostrarModalHorario.value = false
    formularioHorario.value = {
      id_materia: '',
      id_docente: '',
      id_paralelo: '',
      id_aula: '',
      dia_semana: 'lunes',
      hora_inicio: '07:00',
      hora_fin: '08:00',
      id_facultad: '',
      id_edificio: '',
      id_piso: ''
    }
  }
  
  const guardarHorario = async () => {
    guardandoHorario.value = true
    try {
      // Sincronizar docentes antes de crear el horario
      await sincronizarDocentes()
      
      const horarioData = {
        id_materia: parseInt(formularioHorario.value.id_materia),
        id_docente: parseInt(formularioHorario.value.id_docente),
        id_paralelo: formularioHorario.value.id_paralelo ? parseInt(formularioHorario.value.id_paralelo) : undefined,
        id_aula: parseInt(formularioHorario.value.id_aula),
        dia_semana: formularioHorario.value.dia_semana,
        hora_inicio: formularioHorario.value.hora_inicio + ':00',
        hora_fin: formularioHorario.value.hora_fin + ':00'
      }
      
      if (modoEdicionHorario.value && horarioEditando.value) {
        // Actualizar horario existente
        await horarioService.update(horarioEditando.value.id_horario.toString(), horarioData)
      } else {
        // Crear nuevo horario
        await horarioService.create(horarioData)
      }
      
      await cargarHorarios()
      cerrarModalHorario()
      alert(`Horario ${modoEdicionHorario.value ? 'actualizado' : 'creado'} exitosamente`)
    } catch (error) {
      console.error('Error al guardar horario:', error)
      alert('Error al guardar horario')
    } finally {
      guardandoHorario.value = false
    }
  }
  
  const eliminarHorario = async (horario: Horario) => {
    const materia = materias.value.find(m => m.id_materia === horario.id_materia)
    const docente = usuarios.value.find(u => u.id_usuario === horario.id_docente)
    
    if (!confirm(`¿Está seguro de eliminar el horario de "${materia?.nombre_materia}" con ${docente?.nombres} ${docente?.apellidos}?`)) return
    
    try {
      await horarioService.delete(horario.id_horario.toString())
      await cargarHorarios()
      alert('Horario eliminado exitosamente')
    } catch (error) {
      console.error('Error al eliminar horario:', error)
      alert('Error al eliminar horario')
    }
  }
  
  // Watchers para limpiar selecciones dependientes en horarios
  watch(() => formularioHorario.value.id_facultad, () => {
    formularioHorario.value.id_edificio = ''
    formularioHorario.value.id_piso = ''
    formularioHorario.value.id_aula = ''
  })
  
  watch(() => formularioHorario.value.id_edificio, () => {
    formularioHorario.value.id_piso = ''
    formularioHorario.value.id_aula = ''
  })
  
  watch(() => formularioHorario.value.id_piso, () => {
    formularioHorario.value.id_aula = ''
  })

  // =================== FUNCIONES DE NAVEGACIÓN ===================
  const goBack = () => {
    router.push('/menu')
  }

  const logout = () => {
    localStorage.removeItem('usuario')
    router.push('/login')
  }

  // =================== WATCHERS ===================
  // Limpiar filtros cuando cambia el tipo de infraestructura
  watch(tipoInfraestructuraActivo, () => {
    facultadSeleccionada.value = ''
    edificioSeleccionado.value = ''
    pisoSeleccionado.value = ''
  })

  // Limpiar filtros descendientes cuando cambia la facultad
  watch(facultadSeleccionada, () => {
    edificioSeleccionado.value = ''
    pisoSeleccionado.value = ''
  })

  // Limpiar piso cuando cambia el edificio
  watch(edificioSeleccionado, () => {
    pisoSeleccionado.value = ''
  })

  // =================== CICLO DE VIDA ===================
  onMounted(async () => {
    // Cargar datos iniciales de infraestructura para que estén disponibles
    console.log('🚀 Iniciando carga de infraestructura...')
    await cargarInfraestructura()
    console.log('📊 Datos cargados:', {
      facultades: facultades.value.length,
      edificios: edificios.value.length,
      pisos: pisos.value.length,
      aulas: aulas.value.length
    })
    
    // Cargar paralelos siempre disponibles
    await cargarParalelos()
    
    // Cargar usuarios y sincronizar docentes
    await cargarUsuarios()
    await sincronizarDocentes()
    
    if (activeSection.value === 'usuarios') {
      cargarDatosSeccion()
    }
  })

  return {
    // Estado global
    adminData,
    systemStats,
    
    // Navegación
    activeSection,
    navSections,
    setActiveSection,
    
    // Usuarios
    usuarios,
    usuariosFiltrados,
    filtroRolUsuarios,
    busquedaUsuarios,
    mostrarModalUsuario,
    modoEdicionUsuario,
    formularioUsuario,
    guardandoUsuario,
    abrirModalCrearUsuario,
    editarUsuario,
    guardarUsuario,
    eliminarUsuario,
    cerrarModalUsuario,
    formatRol,
    
    // Infraestructura
    facultades,
    edificios,
    pisos,
    aulas,
    tipoInfraestructuraActivo,
    mostrarModalInfraestructura,
    modoEdicionInfraestructura,
    guardandoInfraestructura,
    formularioFacultad,
    formularioEdificio,
    formularioPiso,
    formularioAula,
    facultadSeleccionada,
    edificioSeleccionado,
    pisoSeleccionado,
    edificiosFiltrados,
    pisosFiltrados,
    aulasFiltradas,
    edificiosFiltradosPiso,
    edificiosFiltradosAula,
    pisosFiltradosAula,
    onFacultadChangePiso,
    onFacultadChangeAula,
    onEdificioChangeAula,
    abrirModalCrearInfraestructura,
    cerrarModalInfraestructura,
    guardarInfraestructura,
    opcionesPisos,
    formatearNumeroPiso,
    obtenerNombreSingular,
    obtenerTituloModalInfraestructura,
    
    // Materias
    materias,
    horarios,
    paralelos,
    mostrarModalMateria,
    modoEdicionMateria,
    guardandoMateria,
    formularioMateria,
    diasSemana,
    horariosDisponibles,
    semestresDisponibles,
    docentesDisponibles,
    sincronizarDocentes,
    abrirModalCrearMateria,
    editarMateria,
    cerrarModalMateria,
    guardarMateria,
    eliminarMateria,
    obtenerNombreDocente,
    obtenerHorariosMateria,
    formatearHorario,
    
    // Horarios
    mostrarModalHorario,
    modoEdicionHorario,
    guardandoHorario,
    formularioHorario,
    edificiosFiltradosHorario,
    pisosFiltradosHorario,
    aulasFiltradosHorario,
    abrirModalCrearHorario,
    editarHorario,
    cerrarModalHorario,
    guardarHorario,
    eliminarHorario,
    
    // Funciones de navegación
    goBack,
    logout,
    
    // Funciones utilitarias
    cargarDatosSeccion
  }
}
