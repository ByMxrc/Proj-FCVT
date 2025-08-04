import { ref, computed, onMounted } from 'vue'

// Interfaces para tipado
interface Horario {
  id_horario: number
  dia_semana: string
  hora_inicio: string
  hora_fin: string
  nombre_materia: string
  paralelo: string
  nombre_aula: string
  nombres_docente: string
  apellidos_docente: string
  nombre_facultad: string
  nombre_edificio: string
  numero_piso: string
}

interface Usuario {
  id_usuario: number
  [key: string]: any
}

export function useMenu() {
  // Simulamos las rutas de manera más simple
  const correo = (window.location.search.includes('correo=') 
    ? new URLSearchParams(window.location.search).get('correo') 
    : 'Usuario') || 'Usuario'
  
  // Estados reactivos
  const activeTab = ref('principal')
  const showMenu = ref(false)
  const mostrarModalMateria = ref(false)
  const materiaSeleccionada = ref<any>(null)
  const usuario = ref<Usuario | null>(null)
  const horariosUsuario = ref<Horario[]>([])

  // Datos del calendario
  const diasSemana = ref(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])
  const horasDia = ref([
    { inicio: '07:00', fin: '08:00' },
    { inicio: '08:00', fin: '09:00' },
    { inicio: '09:00', fin: '10:00' },
    { inicio: '10:00', fin: '11:00' },
    { inicio: '11:00', fin: '12:00' },
    { inicio: '12:00', fin: '13:00' },
    { inicio: '13:00', fin: '14:00' },
    { inicio: '14:00', fin: '15:00' },
    { inicio: '15:00', fin: '16:00' },
    { inicio: '16:00', fin: '17:00' },
    { inicio: '17:00', fin: '18:00' },
    { inicio: '18:00', fin: '19:00' },
    { inicio: '19:00', fin: '20:00' },
    { inicio: '20:00', fin: '21:00' }
  ])

  // Computed
  const userInitials = computed(() => {
    if (typeof correo === 'string' && correo.length > 0) {
      const name = correo.split('@')[0]
      return name
        .split('.')
        .map(n => n[0]?.toUpperCase() || '')
        .join('')
        .slice(0, 2)
    }
    return 'US'
  })

  // Métodos
  const toggleMenu = () => {
    showMenu.value = !showMenu.value
  }

  const logout = () => {
    window.location.href = '/login' // Navegación simple
  }

  const abrirModalMateria = (horario: any) => {
    console.log('Abriendo modal para:', horario)
    materiaSeleccionada.value = horario
    mostrarModalMateria.value = true
  }

  const cerrarModalMateria = () => {
    mostrarModalMateria.value = false
  }

  const obtenerRutaMapa = (piso: string | number) => {
    try {
      return new URL(`../../assets/images/Piso ${piso}.png`, import.meta.url).href
    } catch (e) {
      return new URL('../../assets/images/Piso 1.png', import.meta.url).href
    }
  }

  const horariosParaDiaHora = (dia: string, horaInicio: string) => {
    const minutosCelda = parseInt(horaInicio.split(':')[0], 10) * 60 + parseInt(horaInicio.split(':')[1], 10)

    return horariosUsuario.value.filter((h: Horario) => {
      if ((h.dia_semana || '').toLowerCase() !== dia.toLowerCase()) return false
      const [hInicio, mInicio] = h.hora_inicio.split(':').map(Number)
      const [hFin, mFin] = h.hora_fin.split(':').map(Number)
      const minutosInicio = hInicio * 60 + mInicio
      const minutosFin = hFin * 60 + mFin
      return minutosCelda >= minutosInicio && minutosCelda < minutosFin
    })
  }

  const cargarUsuario = async () => {
    if (!correo) return
    try {
      const res = await fetch(`http://localhost:3001/api/usuarios?correo=${correo}`)
      const data = await res.json()
      if (data.length > 0) {
        usuario.value = data[0]
        if (usuario.value) {
          await cargarHorarios(usuario.value.id_usuario)
        }
      }
    } catch (e) {
      console.error('Error cargando usuario', e)
    }
  }

  const cargarHorarios = async (id_usuario: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/usuarios/${id_usuario}/horarios`)
      horariosUsuario.value = await res.json()
      console.log('Horarios cargados:', horariosUsuario.value)
    } catch (e) {
      console.error('Error cargando horarios', e)
    }
  }

  const esAhora = (dIdx: number, hIdx: number): boolean => {
    const now = new Date()
    const diaActual = now.getDay() // 0 (Domingo) - 6 (Sábado)
    const horaActual = now.getHours()

    // Lunes es 1, Martes es 2, ..., Sábado es 6
    const diaCalendario = dIdx + 1
    // Tomar la hora de inicio del bloque horario
    const horaCalendario = parseInt(horasDia.value[hIdx].inicio.split(':')[0], 10)

    // Ajuste para que coincida el día actual con el día del calendario
    const diaCoincide = (diaActual === 0 && diaCalendario === 6) || (diaActual === diaCalendario)

    // Verificar si la hora actual está dentro del rango de la hora del calendario
    const horaCoincide = horaActual === horaCalendario

    return diaCoincide && horaCoincide
  }

  // Lifecycle
  onMounted(() => {
    cargarUsuario()
  })

  return {
    // Estados
    correo,
    activeTab,
    showMenu,
    mostrarModalMateria,
    materiaSeleccionada,
    usuario,
    horariosUsuario,
    diasSemana,
    horasDia,
    
    // Computed
    userInitials,
    
    // Métodos
    toggleMenu,
    logout,
    abrirModalMateria,
    cerrarModalMateria,
    obtenerRutaMapa,
    horariosParaDiaHora,
    cargarUsuario,
    cargarHorarios,
    esAhora
  }
}
