import { ref } from 'vue'
import { 
  CoursesIcon, 
  StudentsIcon, 
  GradesIcon, 
  ScheduleIcon, 
  AttendanceIcon, 
  MaterialsIcon, 
  ReportsIcon, 
  MessagesIcon 
} from './MenuIcons'

export function useMenuDocente() {
  // Datos del docente
  const teacherData = ref({
    name: 'Dr. Carlos Martínez',
    codigo: 'DOC001234'
  })

  // Estadísticas del docente
  const teacherStats = ref({
    courses: 4,
    students: 126,
    pendingEvaluations: 8,
    weeklyHours: 18
  })

  // Opciones del menú
  const menuOptions = ref([
    {
      id: 'courses',
      title: 'Mis Cursos',
      description: 'Gestionar materias y contenidos',
      icon: CoursesIcon,
      iconClass: 'courses',
      route: '/docente/cursos'
    },
    {
      id: 'students',
      title: 'Estudiantes',
      description: 'Lista y gestión de estudiantes',
      icon: StudentsIcon,
      iconClass: 'students',
      route: '/docente/estudiantes'
    },
    {
      id: 'grades',
      title: 'Calificaciones',
      description: 'Registrar y consultar notas',
      icon: GradesIcon,
      iconClass: 'grades',
      route: '/docente/calificaciones'
    },
    {
      id: 'schedule',
      title: 'Horarios',
      description: 'Ver horarios de clases',
      icon: ScheduleIcon,
      iconClass: 'schedule',
      route: '/docente/horarios'
    },
    {
      id: 'attendance',
      title: 'Asistencia',
      description: 'Control de asistencia',
      icon: AttendanceIcon,
      iconClass: 'attendance',
      route: '/docente/asistencia'
    },
    {
      id: 'materials',
      title: 'Material Didáctico',
      description: 'Subir y gestionar materiales',
      icon: MaterialsIcon,
      iconClass: 'materials',
      route: '/docente/materiales'
    },
    {
      id: 'reports',
      title: 'Reportes',
      description: 'Generar reportes académicos',
      icon: ReportsIcon,
      iconClass: 'reports',
      route: '/docente/reportes'
    },
    {
      id: 'messages',
      title: 'Comunicaciones',
      description: 'Mensajes y avisos',
      icon: MessagesIcon,
      iconClass: 'messages',
      route: '/docente/comunicaciones'
    }
  ])

  const navigateTo = (route: string) => {
    console.log('Navigating to:', route)
    // Aquí iría la lógica de navegación
  }

  const goBack = () => {
    console.log('Going back to main menu')
    // Aquí iría la navegación al menú principal
  }

  const logout = () => {
    console.log('Logging out...')
    // Aquí iría la lógica de cierre de sesión
  }

  return {
    teacherData,
    teacherStats,
    menuOptions,
    navigateTo,
    goBack,
    logout
  }
}
