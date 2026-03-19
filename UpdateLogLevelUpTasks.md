# Changelog

Todos los cambios notables de LevelUp Tasks se documentan aquí.

---

## [1.3] - 2025

### ✨ Nuevo
- **Navegación por secciones** — La app ahora tiene una barra de navegación superior con tres secciones: Inicio, Estadísticas y Lista de la compra.
- **Lista de la compra** — Nueva sección para gestionar la compra. Añade artículos con categoría, táchales al comprarlos, y completa la lista para ganar XP según las categorías presentes.
- **Rachas visuales** — Los hábitos evolucionan visualmente según su racha: 🌱 Iniciado → 🔥 En racha (7d) → ⚡ Imparable (14d) → 👑 Leyenda (21d). Incluye barra de progreso hacia el siguiente hito y color de borde según el tier.
- **Cuadrícula de actividad** — Nueva sección de estadísticas con un gráfico estilo GitHub que muestra los últimos 30 días de cada hábito.
- **Página de estadísticas avanzadas** — Sección dedicada con Coming Soon para las próximas features de estadísticas.

### 🔧 Mejoras
- Las categorías de la lista de la compra son las mismas que las de tareas y hábitos.
- El gráfico de actividad de hábitos pasa a estar en la pantalla principal junto al resumen.

### 🐛 Correcciones
- Corregido un bug por el que las categorías nuevas (Salud y Trabajo) no actualizaban el gráfico de habilidades en usuarios con datos guardados de versiones anteriores.
- Corregido el tema Azul que visualmente era demasiado similar al Verde inicial.

---

## [1.2] - 2025

### ✨ Nuevo
- **Selector de temas** — Los temas visuales ya no se aplican automáticamente al subir de nivel. Ahora se desbloquean y se pueden elegir libremente desde el panel de ajustes.
- **Nuevos temas** — Añadidos tema Rojo (nivel 7) y Morado (nivel 10).
- **Panel de ajustes** — Nueva ventana modal accesible desde el botón ⚙️ del perfil. Centraliza todas las opciones de personalización.
- **Nuevas categorías** — Añadidas las categorías Salud y Trabajo.
- **Tareas completadas en desplegable** — Las tareas completadas ya no se mezclan con las pendientes, se acumulan en un desplegable al final de la sección.
- **Desbloqueos en desplegable** — La lista de desbloqueos del perfil ahora es un desplegable para reducir el ruido visual.
- **Gráfico adaptativo** — El color del gráfico de habilidades ahora cambia según el tema activo.

### 🔧 Mejoras
- El modal de novedades ahora tiene scroll para no cortarse si el contenido es largo.
- Las opciones de dificultad de tareas y hábitos ahora tienen texto descriptivo en todas las opciones.
- El botón ⚙️ de ajustes aparece en el extremo derecho del panel de perfil.

### 🐛 Correcciones
- Corregido un bug por el que el modal de novedades no se mostraba correctamente al cargar la app.
- Corregido un bug por el que el botón de editar nombre no respondía al hacer clic.

---

## [1.1] - 2025

### ✨ Nuevo
- **Modal de novedades** — Al entrar a la app por primera vez tras una actualización, se muestra un modal con los cambios de la versión. Solo aparece una vez por versión.
- **Categorías** — Las tareas y hábitos ahora tienen categoría (Deporte, Estudio, Ocio, Hogar, Creatividad, Otros).
- **Gráfico de habilidades** — Octógono en el perfil que muestra visualmente la XP acumulada por categoría.
- **Edición de nombre** — El jugador puede personalizar su nombre desde el botón ✏️ del perfil.
- **Temas por nivel** — Tema azul al alcanzar nivel 3, tema dorado al alcanzar nivel 5.

### 🔧 Mejoras
- El formulario de tareas y hábitos incluye ahora un selector de categoría.
- La categoría se muestra en la tarjeta de cada tarea y hábito.

---

## [1.0] - 2025

### 🎉 Lanzamiento inicial
- Sistema de tareas con 5 niveles de dificultad y recompensa de XP.
- Sistema de hábitos diarios con racha y mejor racha.
- Sistema de XP y niveles con subida automática al alcanzar el umbral.
- Barra de progreso de XP en el perfil.
- Resumen de tareas pendientes, completadas y hábitos activos.
- Estadísticas de racha media y mejor hábito (disponibles desde nivel 2).
- Persistencia de datos con localStorage.
