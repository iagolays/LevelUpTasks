# LevelUp Tasks

> Convierte tus tareas y hábitos en experiencia. Sube de nivel. Desbloquea recompensas.

**LevelUp Tasks** es una app de productividad gamificada donde completar tareas y mantener hábitos te da puntos de experiencia (XP). Al subir de nivel desbloqueas nuevos temas visuales y funcionalidades, convirtiendo tu rutina diaria en un RPG.

---
---

## © Licencia

Este proyecto es de uso personal y está protegido por derechos de autor.

© 2025 Iago Leis Fernández — Todos los derechos reservados.

Queda prohibida la copia, distribución o uso del código fuente, diseño o concepto de esta aplicación sin permiso expreso del autor.

---

Es un proyecto **para aprender**, no pretende ser perfecto ni mucho menos, es una forma de pasar el tiempo y formarme en aspectos que la carrera (al menos por ahora) no cubre.
Está bastante vibecodeado, si ves algo raro o tienes alguna duda puedes preguntar sin fallo (otra cosa es q esté capacitado para resolver la duda)

## 🚀 Demo

Puedes probar la app directamente en: [leveluptasks en GitHub Pages](https://iago-leis.github.io/LevelTasksUp)

---

## ⚙️ Instalación y uso en local

No requiere instalación ni dependencias. Lo mas sencillo y recomendable es crearte un acceso directo del link de arriba. En caso de querer una copia que funcione en 
 local sin conexión a internet, solo necesitas un navegador y un servidor local:

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

- **Sistema de tareas** — Crea tareas con 5 niveles de dificultad. Al completarlas ganas XP proporcional a su dificultad.
- **Sistema de hábitos** — Crea hábitos diarios con racha y mejor racha. Marcarlos cada día mantiene y aumenta tu racha.
- **XP y niveles** — Cada acción completada suma XP. Al llegar al umbral subes de nivel automáticamente.
- **Categorías** — Asigna categorías (Deporte, Estudio, Ocio, Hogar, Creatividad, Otros) a tareas y hábitos.
- **Gráfico de habilidades** — Hexágono en el perfil que muestra visualmente en qué categorías estás más activo.
- **Desbloqueos por nivel** — Al subir de nivel se desbloquean estadísticas avanzadas y temas visuales.
- **Temas por nivel** — Tema azul en nivel 3, tema dorado en nivel 5.
- **Estadísticas** — Racha media y mejor hábito (disponibles desde nivel 2).
- **Edición de nombre** — Personaliza el nombre de tu jugador.
- **Modal de novedades** — Al lanzar una nueva versión, los usuarios ven un resumen de los cambios al entrar.
- **Persistencia** — Todos los datos se guardan en `localStorage`, sin necesidad de cuenta ni servidor.

---

## 🗺️ Roadmap

Funcionalidades planeadas para próximas versiones:

- [ ] Fechas límite para tareas
- [ ] Reducir ruido visual de las tareas completadas
- [ ] Más temas visuales desbloqueables
- [ ] Sistema de logros y medallas
- [ ] Exportar / importar datos
- [ ] Modo oscuro / claro
- [ ] Se admiten sugerencias al correo iago.leis@rai.usc.es

---

## 🛠️ Tecnologías

Proyecto 100% frontend, sin dependencias externas:

- HTML5
- CSS3 (variables, grid, flexbox, media queries)
- JavaScript vanilla (sin frameworks)
- Canvas API para el gráfico de habilidades
- localStorage para persistencia de datos
