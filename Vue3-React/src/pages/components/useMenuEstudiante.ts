import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { materiaService } from '../../services/MateriaService'
import { horarioService } from '../../services/HorarioService'

// Interfaces
interface Usuario {
  id_usuario: number
  nombres: string
  apellidos: string
  correo: string
  semestre?: number
  carrera?: string
  [key: string]: any
}

interface Materia {
  id_materia: number
  nombre_materia: string
  semestre: number
}

interface Paralelo {
  id_paralelo: number
  nombre_paralelo: string
}

interface Horario {
  id_horario: number
  id_materia: number
  id_paralelo: number
  id_docente: number
  id_aula: number
  dia_semana: string
  hora_inicio: string
  hora_fin: string
  nombre_materia?: string
  nombre_paralelo?: string
  nombre_docente?: string
  nombre_aula?: string
  nombre_facultad?: string
  nombre_edificio?: string
  nombre_piso?: string
}

interface Matricula {
  id_matricula: number
  id_estudiante: number
  id_materia: number
  id_paralelo: number
  nombre_materia: string
  nombre_paralelo: string
  dia_semana: string
  hora_inicio: string
  hora_fin: string
  nombre_aula: string
}

interface DetalleMateria {
  nombre_materia: string
  nombre_paralelo: string
  nombre_docente: string
  dia_semana: string
  hora_inicio: string
  hora_fin: string
  facultad: string
  edificio: string
  piso: string
  aula: string
}

export function useMenuEstudiante() {
  const router = useRouter()
  
  // Estados básicos
  const usuarioData = ref<Usuario>({
    id_usuario: 0,
    nombres: 'Estudiante',
    apellidos: 'Usuario',
    correo: '',
    semestre: 1,
    carrera: 'Ingeniería en Sistemas'
  })
  
  const vistaActual = ref('dashboard') // 'dashboard', 'matricula', 'aula'
  const showMenu = ref(false)
  
  // Estados para matrícula
  const materias = ref<Materia[]>([])
  const paralelos = ref<Paralelo[]>([])
  const horarios = ref<Horario[]>([])
  const matriculasEstudiante = ref<Matricula[]>([])
  const guardandoMatricula = ref(false)
  
  const formularioMatricula = ref({
    id_materia: '',
    id_paralelo: ''
  })
  
  // Estados para calendario de aulas
  const fechaActual = ref(new Date())
  
  // Estados para modal de detalles
  const modalDetalle = ref(false)
  const materiaSeleccionada = ref<DetalleMateria | null>(null)
  
  // Configuración del calendario
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const horasCalendario = Array.from({ length: 14 }, (_, i) => {
    const hora = 7 + i
    return `${hora.toString().padStart(2, '0')}:00`
  }) // Genera: 07:00, 08:00, 09:00, ..., 20:00
  
  // Computed
  const userInitials = computed(() => {
    return `${usuarioData.value.nombres.charAt(0)}${usuarioData.value.apellidos.charAt(0)}`.toUpperCase()
  })
  
  const paralelosDisponibles = computed(() => {
    if (!formularioMatricula.value.id_materia) return []
    
    // Obtener horarios de la materia seleccionada
    const horariosMateria = horarios.value.filter(h => h.id_materia === parseInt(formularioMatricula.value.id_materia))
    
    // Obtener paralelos únicos de esos horarios
    const paralelosUnicos = horariosMateria.reduce((acc: Paralelo[], horario) => {
      const paraleloExiste = acc.find(p => p.id_paralelo === horario.id_paralelo)
      if (!paraleloExiste && horario.id_paralelo) {
        const paralelo = paralelos.value.find(p => p.id_paralelo === horario.id_paralelo)
        if (paralelo) {
          acc.push(paralelo)
        }
      }
      return acc
    }, [])
    
    return paralelosUnicos
  })
  
  const horarioSeleccionado = computed(() => {
    if (!formularioMatricula.value.id_materia || !formularioMatricula.value.id_paralelo) return null
    
    const horario = horarios.value.find(h => 
      h.id_materia === parseInt(formularioMatricula.value.id_materia) && 
      h.id_paralelo === parseInt(formularioMatricula.value.id_paralelo)
    )
    
    if (!horario) return null
    
    const materia = materias.value.find(m => m.id_materia === horario.id_materia)
    const paralelo = paralelos.value.find(p => p.id_paralelo === horario.id_paralelo)
    
    return {
      ...horario,
      nombre_materia: materia?.nombre_materia || '',
      nombre_paralelo: paralelo?.nombre_paralelo || '',
      nombre_docente: 'Por asignar',
      nombre_aula: 'Por asignar'
    }
  })
  
  // Computed para calendario
  const esCeldaActual = computed(() => {
    return (dia: string, hora: string) => {
      const ahora = fechaActual.value
      const diaActual = ahora.getDay() // 0 = Domingo, 1 = Lunes, etc.
      const horaActual = ahora.getHours()
      
      // Convertir día de semana (1=Lunes, 6=Sábado)
      const diasMap: { [key: string]: number } = {
        'Lunes': 1,
        'Martes': 2,
        'Miércoles': 3,
        'Jueves': 4,
        'Viernes': 5,
        'Sábado': 6
      }
      
      const diaNum = diasMap[dia]
      const horaNum = parseInt(hora.split(':')[0])
      
      return diaActual === diaNum && horaActual === horaNum
    }
  })
  
  const matriculasCalendario = computed(() => {
    // Organizar las matrículas por día y hora para mostrar en el calendario
    const calendario: { [key: string]: Matricula[] } = {}
    
    // Mapeo de días desde la base de datos (minúsculas) al calendario (capitalizado)
    const mapaDias: { [key: string]: string } = {
      'lunes': 'Lunes',
      'martes': 'Martes',
      'miercoles': 'Miércoles', 
      'miércoles': 'Miércoles',
      'jueves': 'Jueves',
      'viernes': 'Viernes',
      'sabado': 'Sábado',
      'sábado': 'Sábado'
    }
    
    matriculasEstudiante.value.forEach(matricula => {
      // Convertir el día de la base de datos al formato del calendario
      const diaCalendario = mapaDias[matricula.dia_semana.toLowerCase()] || matricula.dia_semana
      
      // Normalizar la hora para que coincida con el formato del calendario (HH:mm)
      const horaInicio = matricula.hora_inicio.substring(0, 5) // Obtener solo HH:mm
      const key = `${diaCalendario}-${horaInicio}`
      
      if (!calendario[key]) {
        calendario[key] = []
      }
      calendario[key].push(matricula)
    })
    
    return calendario
  })
  
  // Funciones de navegación
  const toggleMenu = () => {
    showMenu.value = !showMenu.value
  }
  
  const logout = () => {
    localStorage.removeItem('usuario')
    router.push('/login')
  }
  
  const irARegistroMatricula = () => {
    vistaActual.value = 'matricula'
    cargarDatosMatricula()
  }
  
  const irAIngresoAula = () => {
    vistaActual.value = 'aula'
    cargarMatriculasEstudiante() // Cargar las matrículas del estudiante
  }
  
  const volverDashboard = () => {
    vistaActual.value = 'dashboard'
    limpiarFormulario()
  }
  
  const obtenerMatriculasEnCelda = (dia: string, hora: string): Matricula[] => {
    const key = `${dia}-${hora}`
    return matriculasCalendario.value[key] || []
  }
  
  const abrirDetalleMateria = async (matricula: Matricula) => {
    try {
      console.log('🔍 Abriendo detalles para matricula:', matricula)
      
      // Buscar el horario completo para obtener más información
      const horarioCompleto = horarios.value.find(h => 
        h.id_materia === matricula.id_materia && 
        h.id_paralelo === matricula.id_paralelo
      )
      
      console.log('🔍 Horario completo encontrado:', horarioCompleto)
      console.log('📚 Total horarios disponibles:', horarios.value.length)
      
      // Usar la información del horario completo si está disponible
      let infoCompleta = {
        nombre_docente: horarioCompleto?.nombre_docente || 'Por asignar',
        facultad: horarioCompleto?.nombre_facultad || 'Sin especificar',
        edificio: horarioCompleto?.nombre_edificio || 'Sin especificar',
        piso: horarioCompleto?.nombre_piso || 'Sin especificar',
        aula: horarioCompleto?.nombre_aula || matricula.nombre_aula || 'Sin asignar'
      }
      
      console.log('📋 Información completa construida:', infoCompleta)
      
      // Si no tenemos información completa del horario, usar la simulación como fallback
      if (!horarioCompleto?.nombre_facultad) {
        const obtenerInfoUbicacion = (nombreAula: string) => {
          if (nombreAula.includes('Lab')) {
            return {
              facultad: 'Facultad de Ciencias de la Computación',
              edificio: 'Edificio de Laboratorios',
              piso: 'Piso 1'
            }
          } else if (nombreAula.includes('Aula')) {
            return {
              facultad: 'Facultad de Ciencias Exactas',
              edificio: 'Edificio Principal',
              piso: nombreAula.includes('2') ? 'Piso 2' : nombreAula.includes('3') ? 'Piso 3' : 'Piso 1'
            }
          } else {
            return {
              facultad: 'Facultad de Ciencias de la Computación',
              edificio: 'Edificio Principal',
              piso: 'Piso 1'
            }
          }
        }
        
        const infoUbicacion = obtenerInfoUbicacion(matricula.nombre_aula)
        infoCompleta = {
          ...infoCompleta,
          facultad: infoUbicacion.facultad,
          edificio: infoUbicacion.edificio,
          piso: infoUbicacion.piso
        }
      }
      
      materiaSeleccionada.value = {
        nombre_materia: matricula.nombre_materia,
        nombre_paralelo: matricula.nombre_paralelo,
        nombre_docente: infoCompleta.nombre_docente,
        dia_semana: matricula.dia_semana,
        hora_inicio: matricula.hora_inicio,
        hora_fin: matricula.hora_fin,
        facultad: infoCompleta.facultad,
        edificio: infoCompleta.edificio,
        piso: infoCompleta.piso,
        aula: infoCompleta.aula
      }
      
      modalDetalle.value = true
    } catch (error) {
      console.error('Error al obtener detalles de la materia:', error)
    }
  }
  
  const cerrarModalDetalle = () => {
    modalDetalle.value = false
    materiaSeleccionada.value = null
  }
  
  // TEMPORAL: Función para limpiar datos y recargar
  const limpiarDatos = async () => {
    if (confirm('¿Estás seguro de que quieres limpiar y recargar todos los datos?')) {
      console.log('🧹 Limpiando todos los datos...')
      // Limpiar localStorage
      localStorage.removeItem(`matriculas_${usuarioData.value.id_usuario}`)
      localStorage.removeItem('data_updated_v3')
      // Recargar la página
      window.location.reload()
    }
  }
  
  // Funciones de datos
  const cargarUsuario = async () => {
    try {
      const usuarioGuardado = localStorage.getItem('usuario')
      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado)
        usuarioData.value = {
          ...usuarioData.value,
          ...usuario
        }
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error)
    }
  }
  
  const cargarMaterias = async () => {
    try {
      materias.value = await materiaService.getAll()
      console.log('✅ Materias cargadas:', materias.value.length)
    } catch (error) {
      console.error('Error al cargar materias:', error)
    }
  }
  
  const cargarParalelos = async () => {
    try {
      paralelos.value = [
        { id_paralelo: 1, nombre_paralelo: 'A' },
        { id_paralelo: 2, nombre_paralelo: 'B' },
        { id_paralelo: 3, nombre_paralelo: 'C' },
        { id_paralelo: 4, nombre_paralelo: 'D' }
      ]
      console.log('✅ Paralelos cargados:', paralelos.value.length)
    } catch (error) {
      console.error('Error al cargar paralelos:', error)
    }
  }
  
  const cargarHorarios = async () => {
    try {
      console.log('🔄 Iniciando carga de horarios...')
      
      // Usar el método con joins que ahora funciona correctamente
      horarios.value = await horarioService.getAllWithDetails()
      console.log('✅ Horarios cargados:', horarios.value.length)
      
      if (horarios.value.length > 0) {
        console.log('📊 Ejemplo de horario final:', horarios.value[0])
        console.log('🔍 Propiedades finales:', Object.keys(horarios.value[0]))
      }
      
    } catch (error) {
      console.error('❌ Error al cargar horarios:', error)
      // Fallback al método básico si hay problemas
      try {
        horarios.value = await horarioService.getAll()
        console.log('✅ Horarios básicos cargados como fallback:', horarios.value.length)
      } catch (fallbackError) {
        console.error('❌ Error en fallback:', fallbackError)
        horarios.value = []
      }
    }
  }

  const cargarMatriculasEstudiante = async () => {
    try {
      // FORZAR limpieza: Si los horarios tienen datos completos, limpiar matrículas antiguas
      const tienenDatosCompletos = horarios.value.length > 0 && horarios.value[0].nombre_materia
      if (tienenDatosCompletos) {
        console.log('🧹 FORZANDO limpieza de matrículas antiguas porque los horarios ahora tienen datos completos...')
        localStorage.removeItem(`matriculas_${usuarioData.value.id_usuario}`)
      }
      
      // Cargar las matrículas reales del localStorage (las que el estudiante registró)
      const matriculasGuardadas = localStorage.getItem(`matriculas_${usuarioData.value.id_usuario}`)
      let matriculasReales: Matricula[] = []
      
      if (matriculasGuardadas) {
        // Las matrículas ya están guardadas con toda la información del horario
        matriculasReales = JSON.parse(matriculasGuardadas)
        console.log('📂 Matrículas cargadas desde localStorage:', matriculasReales)
      } else {
        // Si no hay matrículas guardadas, agregar algunas de prueba usando horarios reales
        console.log('📝 No hay matrículas en localStorage, agregando matrículas de prueba con horarios reales...')
        
        // Asegurar que los horarios estén cargados
        if (horarios.value.length === 0) {
          await cargarHorarios()
        }
        
        // Crear matrículas de prueba basadas en horarios reales
        const horariosDisponibles = horarios.value.slice(0, 3) // Tomar los primeros 3 horarios
        console.log('📋 Horarios disponibles para matrículas de prueba:', horariosDisponibles)
        
        matriculasReales = horariosDisponibles.map((horario, index) => {
          console.log(`📝 Creando matrícula ${index + 1} con horario:`, {
            id_materia: horario.id_materia,
            nombre_materia: horario.nombre_materia,
            nombre_aula: horario.nombre_aula,
            nombre_docente: horario.nombre_docente
          })
          
          return {
            id_matricula: Date.now() + index + 1,
            id_estudiante: usuarioData.value.id_usuario,
            id_materia: horario.id_materia,
            id_paralelo: horario.id_paralelo,
            nombre_materia: horario.nombre_materia || `Materia ${horario.id_materia}`,
            nombre_paralelo: horario.nombre_paralelo || 'A',
            dia_semana: horario.dia_semana,
            hora_inicio: horario.hora_inicio,
            hora_fin: horario.hora_fin,
            nombre_aula: horario.nombre_aula || 'Aula por asignar'
          }
        })
        
        // Si no hay horarios disponibles, usar matrículas de prueba básicas
        if (matriculasReales.length === 0) {
          matriculasReales = [
            {
              id_matricula: Date.now() + 1,
              id_estudiante: usuarioData.value.id_usuario,
              id_materia: 1,
              id_paralelo: 1,
              nombre_materia: 'Programación I',
              nombre_paralelo: 'A',
              dia_semana: 'lunes',
              hora_inicio: '08:00',
              hora_fin: '10:00',
              nombre_aula: 'Lab-101'
            },
            {
              id_matricula: Date.now() + 2,
              id_estudiante: usuarioData.value.id_usuario,
              id_materia: 2,
              id_paralelo: 2,
              nombre_materia: 'Matemáticas I',
              nombre_paralelo: 'B',
              dia_semana: 'martes',
              hora_inicio: '10:00',
              hora_fin: '12:00',
              nombre_aula: 'Aula-201'
            },
            {
              id_matricula: Date.now() + 3,
              id_estudiante: usuarioData.value.id_usuario,
              id_materia: 3,
              id_paralelo: 1,
              nombre_materia: 'Física I',
              nombre_paralelo: 'A',
              dia_semana: 'miércoles',
              hora_inicio: '14:00',
              hora_fin: '16:00',
              nombre_aula: 'Aula-301'
            }
          ]
        }
        
        // Guardar las matrículas de prueba en localStorage
        localStorage.setItem(`matriculas_${usuarioData.value.id_usuario}`, JSON.stringify(matriculasReales))
      }
      
      // Si no hay matrículas guardadas, inicializar como array vacío
      matriculasEstudiante.value = matriculasReales
      
      console.log('✅ Matrículas del estudiante cargadas:', matriculasEstudiante.value.length)
      if (matriculasEstudiante.value.length > 0) {
        console.log('📚 Materias matriculadas:', matriculasEstudiante.value.map(m => `${m.nombre_materia} (${m.dia_semana} ${m.hora_inicio})`))
      } else {
        console.log('📝 No hay matrículas registradas. Registra materias en la sección de Matrícula.')
      }
    } catch (error) {
      console.error('Error al cargar matrículas:', error)
      matriculasEstudiante.value = []
    }
  }
  
  const cargarDatosMatricula = async () => {
    await Promise.all([
      cargarMaterias(),
      cargarParalelos(),
      cargarHorarios(),
      cargarMatriculasEstudiante() // Cargar las matrículas existentes del estudiante
    ])
  }
  
  // Funciones de matrícula
  const onMateriaChange = () => {
    formularioMatricula.value.id_paralelo = ''
  }
  
  const limpiarFormulario = () => {
    formularioMatricula.value = {
      id_materia: '',
      id_paralelo: ''
    }
  }
  
  const registrarMatricula = async () => {
    if (!formularioMatricula.value.id_materia || !formularioMatricula.value.id_paralelo) {
      alert('Por favor selecciona una materia y un paralelo')
      return
    }
    
    guardandoMatricula.value = true
    
    try {
      // Verificar si ya está matriculado en esta materia y paralelo
      const yaMatriculado = matriculasEstudiante.value.find(m => 
        m.id_materia === parseInt(formularioMatricula.value.id_materia) && 
        m.id_paralelo === parseInt(formularioMatricula.value.id_paralelo)
      )
      
      if (yaMatriculado) {
        alert('Ya estás matriculado en esta materia y paralelo')
        return
      }
      
      const materia = materias.value.find(m => m.id_materia === parseInt(formularioMatricula.value.id_materia))
      const paralelo = paralelos.value.find(p => p.id_paralelo === parseInt(formularioMatricula.value.id_paralelo))
      const horario = horarios.value.find(h => 
        h.id_materia === parseInt(formularioMatricula.value.id_materia) && 
        h.id_paralelo === parseInt(formularioMatricula.value.id_paralelo)
      )
      
      if (materia && paralelo && horario) {
        console.log('📋 Creando nueva matrícula con datos:', {
          materia: materia.nombre_materia,
          paralelo: paralelo.nombre_paralelo,
          horario: {
            dia: horario.dia_semana,
            inicio: horario.hora_inicio,
            fin: horario.hora_fin,
            aula: horario.nombre_aula,
            docente: horario.nombre_docente
          }
        })
        
        const nuevaMatricula: Matricula = {
          id_matricula: Date.now(),
          id_estudiante: usuarioData.value.id_usuario,
          id_materia: materia.id_materia,
          id_paralelo: paralelo.id_paralelo,
          nombre_materia: materia.nombre_materia,
          nombre_paralelo: paralelo.nombre_paralelo,
          dia_semana: horario.dia_semana,
          hora_inicio: horario.hora_inicio,
          hora_fin: horario.hora_fin,
          nombre_aula: horario.nombre_aula || 'Aula por asignar'
        }
        
        matriculasEstudiante.value.push(nuevaMatricula)
        
        // Guardar en localStorage para persistencia
        localStorage.setItem(`matriculas_${usuarioData.value.id_usuario}`, JSON.stringify(matriculasEstudiante.value))
        
        limpiarFormulario()
        alert('¡Matrícula registrada exitosamente!')
      }
    } catch (error) {
      console.error('Error al registrar matrícula:', error)
      alert('Error al registrar la matrícula')
    } finally {
      guardandoMatricula.value = false
    }
  }
  
  const eliminarMatricula = async (matricula: Matricula) => {
    if (!confirm(`¿Está seguro de eliminar la matrícula de ${matricula.nombre_materia}?`)) return
    
    try {
      const index = matriculasEstudiante.value.findIndex(m => m.id_matricula === matricula.id_matricula)
      if (index !== -1) {
        matriculasEstudiante.value.splice(index, 1)
        
        // Actualizar localStorage
        localStorage.setItem(`matriculas_${usuarioData.value.id_usuario}`, JSON.stringify(matriculasEstudiante.value))
        
        alert('Matrícula eliminada exitosamente')
      }
    } catch (error) {
      console.error('Error al eliminar matrícula:', error)
      alert('Error al eliminar la matrícula')
    }
  }
  
  // Ciclo de vida
  onMounted(async () => {
    await cargarUsuario()
    
    // TEMPORAL: Limpiar localStorage para forzar recarga con nuevos datos
    if (usuarioData.value.id_usuario) {
      const shouldClear = !localStorage.getItem('data_updated_v3')
      if (shouldClear) {
        console.log('🧹 Limpiando datos antiguos del localStorage...')
        localStorage.removeItem(`matriculas_${usuarioData.value.id_usuario}`)
        localStorage.setItem('data_updated_v3', 'true')
      }
    }
    
    // Cargar horarios primero, luego las matrículas para que puedan usar datos reales
    await cargarHorarios()
    await cargarMatriculasEstudiante()
  })
  
  return {
    // Estados básicos
    usuarioData,
    vistaActual,
    showMenu,
    userInitials,
    
    // Navegación
    toggleMenu,
    logout,
    irARegistroMatricula,
    irAIngresoAula,
    volverDashboard,
    
    // Matrícula
    materias,
    paralelosDisponibles,
    formularioMatricula,
    horarioSeleccionado,
    matriculasEstudiante,
    guardandoMatricula,
    onMateriaChange,
    registrarMatricula,
    eliminarMatricula,
    
    // Calendario
    diasSemana,
    horasCalendario,
    fechaActual,
    esCeldaActual,
    matriculasCalendario,
    obtenerMatriculasEnCelda,
    
    // Modal de detalles
    modalDetalle,
    materiaSeleccionada,
    abrirDetalleMateria,
    cerrarModalDetalle,
    
    // TEMPORAL: Función de limpieza
    limpiarDatos
  }
}
