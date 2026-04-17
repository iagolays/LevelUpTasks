# Changelog

Todos los cambios notables de LevelUp Tasks se documentan aquí.

---

## [1.8] - 2025

### ✨ Nuevo
- **Modo claro/oscuro** — Alterna entre el modo oscuro por defecto y el modo claro desde el botón ☀️ de la barra superior. Para los psicópatas que prefieren el fondo blanco.

### 🐛 Correcciones
- Corregido bug por el que los botones de editar nombre, ajustes y modo claro/oscuro no respondían en móvil cuando la lista de tareas estaba vacía.

---

## [1.7] - 2025

### ✨ Nuevo
- **Edición de tareas** — Modifica el título, dificultad, categoría y fecha límite de cualquier tarea pendiente sin perder su progreso ni su XP acumulada.
- **Edición de hábitos** — Modifica el título, dificultad y categoría de cualquier hábito sin resetear su racha ni su historial de actividad.

### 🐛 Correcciones
- Corregido bug por el que las etiquetas de dificultad de hábitos no coincidían con las opciones del formulario.

---

## [1.6] - 2025

### ✨ Nuevo
- **Sincronización entre dispositivos** — Sistema de cuentas con Firebase. Inicia sesión con correo y contraseña para sincronizar tu progreso entre dispositivos. Al detectar datos distintos en local y en la nube, se ofrece elegir cuál conservar.
- **Estadísticas completas** — La pestaña de estadísticas ya no es "Coming Soon". Incluye resumen general, gráfico de actividad de hábitos al estilo GitHub y distribución de XP por categoría en barras.
- **Días usando la app** — Contador de días consecutivos abriendo la app, visible en estadísticas.
- **Recompensa por nivel** — Cada 5 niveles se dan 50 PaupeDolars automáticamente.
- **Marcos animados** — Nuevos marcos de perfil: Latido 💗, Eléctrico ⚡, Hielo ❄️, Sombra 🌑 y Neón 🟢.
- **Nuevas tipografías** — Comic Sans, Skyrim (Cinzel) y Burger King (Lilita One) disponibles en la tienda.
- **Total histórico de PaupeDolars** — Se lleva un registro de todos los PaupeDolars ganados para estadísticas.

### 🔧 Mejoras
- El resumen general se ha movido de la página de inicio a la pestaña de estadísticas para reducir el ruido visual.

### 🐛 Correcciones
- Corregido el símbolo `$` que aparecía en los precios de la tienda.

---

## [1.5] - 2025

### ✨ Nuevo
- **Tienda** — Nueva sección con catálogo de cosméticos comprables con PaupeDolars.
- **PaupeDolars** — Moneda de la app que se gana completando tareas y hábitos según dificultad.
- **Tipografías** — Monospace, Serif y Minecraft disponibles en la tienda.
- **Marcos de perfil** — Dorado y Arcoíris disponibles en la tienda.
- **Títulos de jugador** — Novato, El Incansable, Leyenda y El Paupérrimo.
- **Selector de temas mejorado** — Los temas ya no se aplican automáticamente, se eligen desde ajustes ⚙️.
- **Nuevos temas** — Rojo (nivel 7) y Morado (nivel 10).

### 🔧 Mejoras
- El panel de ajustes ⚙️ centraliza todas las opciones de personalización.
- La última categoría seleccionada en la lista de la compra se recuerda al añadir un artículo.

---

## [1.4] - 2025

### ✨ Nuevo
- **Fechas límite** — Las tareas pueden tener fecha límite opcional con aviso visual cuando quedan ≤2 días.
- **Penalización por vencimiento** — Si una tarea vence sin completarse, se pierde la XP que habría dado.

### 🔧 Mejoras
- Colores de borde en tareas según urgencia: naranja (≤2 días) y rojo (vencida).

---

## [1.3] - 2025

### ✨ Nuevo
- **Rachas visuales** — Los hábitos evolucionan visualmente cada 7 días con emoji y color de borde: 🌱→🔥→⚡→👑.
- **Barra de progreso de racha** — Cada hábito muestra el progreso hacia el siguiente hito de racha.
- **Gráfico de actividad** — Cuadrícula de actividad de hábitos al estilo GitHub en las estadísticas.
- **Lista de la compra** — Nueva sección con categorías y recompensa de XP al completarla.
- **Navegación por pestañas** — La app se reestructura con navbar y páginas independientes.

### 🔧 Mejoras
- El color del gráfico de habilidades se adapta al tema activo.
- Corrección del tema azul a un azul más diferenciado del verde por defecto.

---

## [1.2] - 2025

### ✨ Nuevo
- **Selector de temas** — Los temas se desbloquean al subir de nivel y se pueden elegir libremente.
- **Nuevos temas** — Rojo (nivel 7) y Morado (nivel 10).
- **Panel de ajustes** — Modal accesible desde el botón ⚙️ del perfil.
- **Nuevas categorías** — Salud y Trabajo.
- **Tareas completadas en desplegable** — Las tareas completadas se separan de las pendientes.
- **Desbloqueos en desplegable** — La lista de desbloqueos del perfil es ahora un desplegable.

### 🐛 Correcciones
- Corregido bug por el que el modal de novedades no aparecía al cargar la app.
- Corregido bug por el que el botón de editar nombre no respondía.

---

## [1.1] - 2025

### ✨ Nuevo
- **Modal de novedades** — Al entrar tras una actualización se muestra un resumen de los cambios.
- **Categorías** — Tareas y hábitos tienen categoría (Deporte, Estudio, Ocio, Hogar, Creatividad, Otros).
- **Gráfico de habilidades** — Octógono en el perfil que muestra la XP acumulada por categoría.
- **Edición de nombre** — El jugador puede personalizar su nombre desde el botón ✏️.
- **Temas por nivel** — Azul (nivel 3) y Dorado (nivel 5).

---

## [1.0] - 2025

### 🎉 Lanzamiento inicial
- Sistema de tareas con 5 niveles de dificultad y recompensa de XP.
- Sistema de hábitos diarios con racha y mejor racha.
- Sistema de XP y niveles con subida automática al alcanzar el umbral.
- Barra de progreso de XP en el perfil.
- Estadísticas básicas de racha media y mejor hábito.
- Persistencia de datos con localStorage.