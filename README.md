# LevelUp Tasks

> Convierte tus tareas y hábitos en experiencia. Sube de nivel. Desbloquea recompensas.

**LevelUp Tasks** es una app de productividad donde completar tareas y mantener hábitos te da puntos de experiencia (XP). Al subir de nivel desbloqueas nuevos temas visuales y funcionalidades, convirtiendo tu rutina diaria en un RPG.

---

Es un proyecto **para aprender**, no pretende ser perfecto ni mucho menos, es una forma de pasar el tiempo y formarme en aspectos que la carrera (al menos por ahora) no cubre.

Está bastante vibecodeado, si ves algo raro o tienes alguna duda puedes preguntar sin fallo (otra cosa es q esté capacitado para resolver la duda)

---

## 👥 Equipo

- **Iago Leis** — Desarrollo principal · [GitHub](https://github.com/iago-leis)
- **Nuria Guerra** — StudyOS y colaboración · [GitHub](https://github.com/nuriaguerra/nuriaguerra)

---

## 🚀 Demo

Puedes probar la app directamente en: [LevelUp Tasks en GitHub Pages](https://iagolays.github.io/LevelUpTasks/)

---

## ⚙️ Instalación y uso en local

No requiere instalación ni dependencias. Lo más sencillo y recomendable es crearte un acceso directo del link de arriba. En caso de querer una copia que funcione en local sin conexión a internet, solo necesitas un navegador y un servidor local:

**1. Clona el repositorio:**
```bash
git clone https://github.com/iago-leis/LevelTasksUp.git
cd LevelTasksUp
```

**2. Lanza un servidor local:**
```bash
python3 -m http.server 8000
```

**3. Abre en el navegador:**
```
http://localhost:8000
```

> ⚠️ No abras el `index.html` directamente como archivo. Usa siempre un servidor local para que funcione correctamente.

---

## ✅ Funcionalidades actuales

- **Sincronización entre dispositivos** — Inicia sesión con tu correo y contraseña y tus datos estarán sincronizados entre dispositivos. Al iniciar sesión puedes elegir si conservar los datos locales o los de la nube.
- **Modo claro/oscuro** — Alterna entre el modo oscuro por defecto y el modo claro desde el botón ☀️ de la barra superior.
- **Sistema de tareas** — Crea tareas con 5 niveles de dificultad. Al completarlas ganas XP y PaupeDolars proporcionales a su dificultad. Las tareas completadas se acumulan en un desplegable para no mezclarlas con las pendientes.
- **Edición de tareas y hábitos** — Modifica el título, dificultad, categoría y fecha límite de cualquier tarea o hábito sin perder su progreso.
- **Fechas límite** — Las tareas pueden tener fecha límite opcional. Si no se completan a tiempo, se pierde la XP que habrían dado.
- **Sistema de hábitos** — Crea hábitos diarios con racha y mejor racha. Marcarlos cada día mantiene y aumenta tu racha.
- **Rachas visuales** — Los hábitos evolucionan visualmente cada 7 días: 🌱 Iniciado → 🔥 En racha → ⚡ Imparable → 👑 Leyenda.
- **XP y niveles** — Cada acción completada suma XP. Al llegar al umbral subes de nivel automáticamente. Cada 5 niveles recibes 50 PaupeDolars de regalo.
- **PaupeDolars** — Moneda de la app que se gana completando tareas y hábitos. Se usa en la tienda para comprar cosméticos.
- **Categorías** — Asigna categorías (Deporte, Estudio, Ocio, Hogar, Creatividad, Salud, Trabajo, Otros) a tareas y hábitos.
- **Gráfico de habilidades** — Octógono en el perfil que muestra visualmente la XP acumulada por categoría. El color se adapta al tema activo.
- **Tienda** — Gasta PaupeDolars en tipografías, marcos animados de perfil y títulos de jugador.
- **Marcos animados** — Dorado, Arcoíris, Latido, Eléctrico, Hielo, Sombra y Neón.
- **Tipografías** — Monospace, Serif, Minecraft, Comic Sans, Skyrim y Burger King.
- **Títulos de jugador** — Novato, El Incansable, Leyenda y El Paupérrimo.
- **Selector de temas** — Desbloquea temas visuales al subir de nivel y elige cuál usar desde el panel de ajustes ⚙️. Verde (nv.1), Azul (nv.3), Dorado (nv.5), Rojo (nv.7) y Morado (nv.10).
- **Estadísticas** — Página dedicada con resumen general, gráfico de actividad de hábitos al estilo GitHub y distribución de XP por categoría.
- **Días usando la app** — Contador de días consecutivos abriendo la app.
- **Lista de la compra** — Sección dedicada con categorías y recompensa de XP al completarla.
- **StudyOS** — Sección de estudio con gestión de asignaturas, temporizador Pomodoro y calendario de exámenes. Desarrollado por Nuria.
- **Panel de ajustes** — Accesible desde el botón ⚙️ del perfil.
- **Modal de novedades** — Al entrar por primera vez tras una actualización, se muestra un resumen de los cambios.
- **Persistencia** — Todos los datos se guardan en `localStorage` y opcionalmente en la nube mediante Firebase.

---

## 🗺️ Roadmap

Funcionalidades planeadas para próximas versiones:

- [ ] Sistema de penalizaciones por no completar hábitos
- [ ] Personaje customizable con cosméticos equipables
- [ ] Multiplicador de XP por racha
- [ ] Sistema de logros y medallas
- [ ] Historial de actividad
- [ ] Exportar / importar datos
- [ ] Se admiten sugerencias al correo iago.leis@rai.usc.es

---

## 🛠️ Tecnologías

- HTML5
- CSS3 (variables, grid, flexbox, media queries, animaciones)
- JavaScript vanilla (sin frameworks)
- Canvas API para el gráfico de habilidades
- localStorage para persistencia de datos
- Firebase Authentication y Firestore para sincronización entre dispositivos

---

## © Licencia

Este proyecto es de uso personal y está protegido por derechos de autor.

© 2025 Iago Leis Fernández — Todos los derechos reservados.

Queda prohibida la copia, distribución o uso del código fuente, diseño o concepto de esta aplicación sin permiso expreso del autor.