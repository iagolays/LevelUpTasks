// ===============================
// CONFIGURACION BASICA
// ===============================

// Una constante es una variable que no puede cambiar de valor.
// STORAGE_KEY es el "nombre del cajón" donde guardaremos los datos
// en el navegador (localStorage). Así siempre usamos el mismo nombre.
const STORAGE_KEY = "levelup_tasks_app";

// Objeto que relaciona cada nivel de dificultad con su XP.
// Ejemplo: una tarea de dificultad 3 da 35 XP.
// La sintaxis { clave: valor } se llama "objeto literal" en JavaScript.
const TASK_XP = {
  1: 10,
  2: 20,
  3: 35,
  4: 55,
  5: 80
};

// Lo mismo para hábitos, pero con menos XP (son repetibles cada día)
const HABIT_XP = {
  1: 5,
  2: 10,
  3: 15
};

// XP que da completar la lista de la compra según categoría
const SHOPPING_XP = {
  hogar: 15,
  trabajo: 20,
  salud: 15,
  otros: 10
};

// Aquí definimos las categorias de los habitos y las tareas
const CATEGORIES = {
  otros: "Otros",
  deporte: "Deporte",
  estudio: "Estudio",
  ocio: "Ocio",
  hogar: "Tareas del hogar",
  creatividad: "Creatividad",
  salud: "Salud",
  trabajo: "Trabajo"
};

// Array (lista) de objetos. Cada objeto tiene el nivel mínimo necesario
// y el texto que se mostrará al desbloquearlo.
const UNLOCKS = [
  { level: 1, text: "Tema base desbloqueado" },
  { level: 2, text: "Estadísticas mejoradas desbloqueadas" },
  { level: 3, text: "Tema azul desbloqueado" },
  { level: 5, text: "Tema dorado desbloqueado" }
];

// Define los niveles visuales de racha.
// Cada 7 días el hábito sube de tier cambiando su emoji y color de borde.
const STREAK_TIERS = [
  { minDays: 0,  emoji: "🌱", borderClass: "streak-tier-0", label: "Iniciado"  },
  { minDays: 7,  emoji: "🔥", borderClass: "streak-tier-1", label: "En racha"  },
  { minDays: 14, emoji: "⚡", borderClass: "streak-tier-2", label: "Imparable" },
  { minDays: 21, emoji: "👑", borderClass: "streak-tier-3", label: "Leyenda"   }
];

// Objeto con todos los temas disponibles.
// key: nombre interno, label: texto visible, level: nivel mínimo para desbloquearlo,
// className: clase CSS que se aplica al <body>
const THEMES = {
  verde:  { label: "Verde",       level: 1,  className: ""             },
  azul:   { label: "Azul",        level: 3,  className: "theme-blue"   },
  dorado: { label: "Dorado",      level: 5,  className: "theme-gold"   },
  rojo:   { label: "Rojo/Sangre", level: 7,  className: "theme-red"    },
  morado: { label: "Morado",      level: 10, className: "theme-purple" }
};

// Versión actual de la app. Cámbiala cada vez que hagas una update
// para que el modal se muestre de nuevo a todos los usuarios.
const APP_VERSION = "1.3";

// Mensaje que se mostrará en el modal para esta versión.
// Puedes usar saltos de línea con \n o escribir HTML directamente.
const UPDATE_NOTES = `
  <h3>¡Bienvenido a LevelUp Tasks!</h3>
  <h4>Update, puta uni </h4>
  <ul>
    <li> Hemos solucionado el bug realativo a que el gráfico no se actualizaba con ciertas categorias (creo) </li>
    <li> El tema desbloqueado en el nivel 3 ahora es azul puro, para que se note más la diferencia con el verde inicial. </li>
    <li> DOPAMINA, hemos añadido progreso visual en tus rachas de habitos para engancharte a completarlos. </li>
    <li> Hemos cambiado la sección de estadísticas que era un mierdon vibecodeado por otras vibecodedas pero mas guapas e útiles, un gráfico al estilo github </li>
    <li> La app ha sido reestructurada, hemos decidido tener secciones independientes para organizalo todo mejor, por ahora son escasas pero iremos añadiendo más poco a poco. </li>
    <li> Se ha añadido una sección de la compra, para que puedas organizar tu lista de la compra y ganar XP al completarla. </li>
    <li> Se buscan ideas para la próxima update, sobre todo sobre desbloqueos y estadísticas que os gustaría poder comprobar. Cualquier sugerencia al correo: iago.leis@rai.usc.es </li>
    <li> No nos hemos olvidade del resto de peticiones! Seguiremos trayendo updates cuando la fokin universidad nos deje un hueco, y seguiremos añadiendo mejoras poco a poco. 
    Podeis comprobar que features ya estan planeadas para próximas updates en el README de este proyecto: https://github.com/iagolays/LevelUpTasks</li>
  </ul>
`;

// ===============================
// FUNCIONES DE CARGA Y GUARDADO
// ===============================
// IMPORTANTE: loadState() debe estar definida ANTES de llamarla,
// por eso movemos estas funciones arriba del todo.

function loadState() {
  // localStorage es un almacén de datos del navegador que persiste
  // aunque cierres la pestaña. Guarda pares clave-valor de texto.
  const saved = localStorage.getItem(STORAGE_KEY);
  // getItem devuelve null si no existe nada con esa clave

  if (saved) {
    // JSON.parse convierte el texto guardado de vuelta a un objeto JavaScript.
    // (Los datos se guardan como texto, JSON es el formato estándar para eso)
    return JSON.parse(saved);
  }

  // Si no hay nada guardado, devolvemos el estado inicial por defecto
  return {
    user: {
      name: "Jugador",
      level: 1,
      xp: 0,       // XP dentro del nivel actual (se resetea al subir)
      totalXp: 0,  // XP acumulada de toda la vida del personaje
      selectedTheme: "verde", // Tema inicial por defecto
      categoryXp: { // Aquí guardaremos la XP acumulada por categoría
        otros: 0,
        deporte: 0,
        estudio: 0,
        ocio: 0,
        hogar: 0,
        creatividad: 0,
        salud: 0,
        trabajo: 0
      }
    },
    tasks: [],    // Lista vacía de tareas
    habits: [],   // Lista vacía de hábitos
    shopping: []  // Lista vacía de artículos de la compra
  };
}

function saveState() {
  // JSON.stringify convierte el objeto "state" a texto para poder guardarlo.
  // localStorage solo puede guardar texto, no objetos JavaScript directamente.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ===============================
// ESTADO DE LA APP
// ===============================

// "state" es el objeto central que guarda TODOS los datos de la app
// mientras está abierta en el navegador.
// Se inicializa llamando a loadState(), que intenta cargar datos guardados.
// IMPORTANTE: loadState() debe estar definida antes de esta línea.
let state = loadState();

// Protección: si el state guardado no tiene shopping, lo añadimos
if (!state.shopping) state.shopping = [];

// ===============================
// REFERENCIAS AL DOM
// ===============================
// El DOM es la representación del HTML que el navegador crea en memoria.
// Con document.getElementById("id") cogemos un elemento HTML por su id
// y lo guardamos en una variable para usarlo después sin tener que
// buscarlo cada vez.

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDifficulty = document.getElementById("taskDifficulty");
const taskList = document.getElementById("taskList");

const habitForm = document.getElementById("habitForm");
const habitTitle = document.getElementById("habitTitle");
const habitDifficulty = document.getElementById("habitDifficulty");
const habitList = document.getElementById("habitList");

// Referencias para las categorías
const taskCategory = document.getElementById("taskCategory");
const habitCategory = document.getElementById("habitCategory");

// Referencias de la lista de la compra
const shoppingForm = document.getElementById("shoppingForm");
const shoppingItem = document.getElementById("shoppingItem");
const shoppingCategory = document.getElementById("shoppingCategory");
const shoppingList = document.getElementById("shoppingList");
const completeShoppingBtn = document.getElementById("completeShoppingBtn");
const clearShoppingBtn = document.getElementById("clearShoppingBtn");

// ===============================
// NAVEGACIÓN ENTRE PÁGINAS
// ===============================
// navigateTo() oculta todas las páginas y muestra solo la activa.
// También actualiza el botón activo en el navbar.

function navigateTo(page) {
  // Lista de todas las páginas disponibles
  const pages = ["inicio", "stats", "compra"];

  // Ocultamos todas las páginas
  pages.forEach(p => {
    const el = document.getElementById(`page-${p}`);
    if (el) el.style.display = "none";
  });

  // Mostramos la página activa
  const activePage = document.getElementById(`page-${page}`);
  if (activePage) activePage.style.display = "block";

  // Actualizamos el botón activo en el navbar
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("nav-btn-active");
  });
  // El botón activo es el que llama a navigateTo con esta página
  const activeBtn = document.querySelector(`.nav-btn[onclick="navigateTo('${page}')"]`);
  if (activeBtn) activeBtn.classList.add("nav-btn-active");

  // Si navegamos al perfil o estadísticas, re-renderizamos para que estén actualizados
  if (page === "stats") {
    renderStats();
  }
}

// ===============================
// UTILIDADES
// ===============================

function generateId() {
  // Genera un ID único combinando la hora actual (Date.now() en milisegundos)
  // con un número aleatorio en base 16 (hexadecimal).
  // Esto hace casi imposible que dos IDs sean iguales.
  return Date.now() + Math.random().toString(16).slice(2);
}

// Calcula cuánta XP hace falta para subir al siguiente nivel.
// Fórmula: 100 * nivel_actual. Nivel 1→2 cuesta 100 XP, 2→3 cuesta 200 XP, etc.
function xpNeededForLevel(level) {
  return 100 * level;
}

// Convierte el número de dificultad en texto legible para mostrarlo en pantalla
function difficultyLabel(value) {
  const diff = Number(value); // Aseguramos que sea un número
  if (diff === 1) return "Fácil";
  if (diff === 2) return "Normal";
  if (diff === 3) return "Media";
  if (diff === 4) return "Difícil";
  if (diff === 5) return "Muy difícil";
  return "Desconocida";
}

// Devuelve la fecha de hoy en formato "YYYY-MM-DD" (ej: "2024-03-15")
// Esto nos permite comparar fechas como texto simple
function getTodayString() {
  return new Date().toISOString().split("T")[0];
  // new Date() → fecha y hora actual
  // .toISOString() → "2024-03-15T10:30:00.000Z"
  // .split("T")[0] → coge solo la parte antes de la T → "2024-03-15"
}

// Devuelve el tier de racha correspondiente a los días actuales.
// Recorre los tiers de mayor a menor y devuelve el primero que se cumple.
function getStreakTier(streak) {
  for (let i = STREAK_TIERS.length - 1; i >= 0; i--) {
    if (streak >= STREAK_TIERS[i].minDays) {
      return STREAK_TIERS[i];
    }
  }
  return STREAK_TIERS[0]; // Por defecto, tier inicial
}

// ===============================
// SISTEMA DE XP Y NIVELES
// ===============================

function addXp(amount, category) {
  // Suma XP al nivel actual Y al total histórico
  state.user.xp += amount;      // += es lo mismo que: state.user.xp = state.user.xp + amount
  state.user.totalXp += amount;

  // Protección: si el usuario ya tenía datos guardados sin categoryXp
  if (!state.user.categoryXp) {
    state.user.categoryXp = { otros: 0, deporte: 0, estudio: 0, ocio: 0, hogar: 0, creatividad: 0, salud: 0, trabajo: 0 };
  }

  // Añade claves que falten por si el usuario tiene datos de una versión anterior
  const allKeys = ["otros", "deporte", "estudio", "ocio", "hogar", "creatividad", "salud", "trabajo"];
  allKeys.forEach(key => {
    if (state.user.categoryXp[key] === undefined) {
      state.user.categoryXp[key] = 0;
    }
  });

  // Suma XP a la categoría correspondiente
  if (category && state.user.categoryXp[category] !== undefined) {
    state.user.categoryXp[category] += amount;
  }

  // Bucle "while": se repite MIENTRAS la condición sea verdadera.
  // Esto permite subir varios niveles a la vez si se gana mucha XP de golpe.
  while (state.user.xp >= xpNeededForLevel(state.user.level)) {
    // Si la XP actual supera lo necesario para el nivel actual:
    state.user.xp -= xpNeededForLevel(state.user.level); // Resta la XP del nivel
    state.user.level++;                                   // Sube un nivel (++ suma 1)
    alert(`¡Has subido a nivel ${state.user.level}!`);
    // Las comillas invertidas ` ` permiten meter variables dentro con ${variable}
  }

  applyThemeByLevel(); // Actualiza el tema visual según el nuevo nivel
  saveState();         // Guarda el estado actualizado en localStorage
  render();            // Redibuja toda la interfaz
}

function getUnlockedItems() {
  // .filter() recorre el array UNLOCKS y devuelve solo los elementos
  // donde la condición es verdadera (los que el jugador ya ha desbloqueado)
  return UNLOCKS.filter(unlock => state.user.level >= unlock.level);
}

function applyThemeByLevel() {
  // Protección: si no hay tema guardado, usamos el verde por defecto
  if (!state.user.selectedTheme) state.user.selectedTheme = "verde";

  // Eliminamos todas las clases de tema anteriores
  document.body.classList.remove("theme-blue", "theme-gold", "theme-red", "theme-purple");

  // Aplicamos la clase CSS del tema elegido (verde no tiene clase, es el default)
  const theme = THEMES[state.user.selectedTheme];
  if (theme && theme.className) {
    document.body.classList.add(theme.className);
  }
}

function selectTheme(themeKey) {
  const theme = THEMES[themeKey];
  if (!theme) return;
  if (state.user.level < theme.level) {
    alert(`Necesitas nivel ${theme.level} para desbloquear este tema.`);
    return;
  }

  state.user.selectedTheme = themeKey;
  applyThemeByLevel();
  saveState();
  render();
  renderThemeSelector();
}

// ===============================
// TAREAS
// ===============================

// addEventListener escucha eventos del navegador.
// Aquí escuchamos el evento "submit" del formulario de tareas.
// Se dispara cuando el usuario hace clic en "Añadir tarea" o pulsa Enter.
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  // Por defecto, un formulario recarga la página al enviarse.
  // preventDefault() cancela ese comportamiento para manejarlo nosotros.

  const title = taskTitle.value.trim();
  // .value → texto que el usuario escribió en el input
  // .trim() → elimina espacios en blanco al inicio y al final

  const difficulty = Number(taskDifficulty.value);
  // Number() convierte el texto del <select> al número correspondiente

  if (!title) return;
  // Si el título está vacío (aunque "required" lo previene), salimos de la función

  // Creamos el objeto de la nueva tarea con todos sus datos
  const task = {
    id: generateId(),              // ID único
    title,                         // Nombre de la tarea (equivale a title: title)
    difficulty,                    // Nivel de dificultad
    category: taskCategory.value,  // Categoría elegida por el usuario
    xpReward: TASK_XP[difficulty], // XP según la dificultad elegida
    completed: false               // Al crearla, aún no está completada
  };

  state.tasks.push(task); // .push() añade el nuevo objeto al final del array
  saveState();
  render();

  taskForm.reset(); // Limpia el formulario para poder añadir otra tarea
});

function completeTask(taskId) {
  // .find() busca en el array el primer elemento que cumple la condición
  // y devuelve ese elemento (o undefined si no lo encuentra)
  const task = state.tasks.find(t => t.id == taskId);

  if (!task || task.completed) return;
  // Si no existe la tarea, o ya está completada, no hacemos nada

  task.completed = true;                    // La marcamos como completada
  addXp(task.xpReward, task.category);      // Damos la XP correspondiente y la categoría
  saveState();
  render();
}

function deleteTask(taskId) {
  // .filter() devuelve un nuevo array CON todos los elementos EXCEPTO
  // el que tiene el id que queremos eliminar
  state.tasks = state.tasks.filter(t => t.id != taskId);
  saveState();
  render();
}

// ===============================
// HABITOS
// ===============================

habitForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = habitTitle.value.trim();
  const difficulty = Number(habitDifficulty.value);

  if (!title) return;

  const habit = {
    id: generateId(),
    title,
    difficulty,
    category: habitCategory.value,  // Categoría elegida por el usuario
    xpReward: HABIT_XP[difficulty],
    streak: 0,          // Racha actual de días consecutivos
    bestStreak: 0,      // La mejor racha que ha tenido este hábito
    lastCompleted: null, // Última vez que se completó (null = nunca)
    completedDates: []   // Array para guardar las fechas de cada vez que se completa el hábito
  };

  state.habits.push(habit);
  saveState();
  render();

  habitForm.reset();
});

function completeHabit(habitId) {
  const habit = state.habits.find(h => h.id == habitId);

  if (!habit) return;

  const today = getTodayString(); // "2024-03-15" por ejemplo

  // Comprobamos si ya se completó hoy
  if (habit.lastCompleted === today) {
    alert("Este hábito ya fue completado hoy.");
    return;
  }

  // Calculamos la fecha de ayer para saber si la racha continúa
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Restamos 1 día
  const yesterdayString = yesterday.toISOString().split("T")[0];

  // Si el último día completado fue ayer → racha continúa
  if (habit.lastCompleted === yesterdayString) {
    habit.streak++;        // Suma 1 a la racha actual
  } else {
    // Si no fue ayer (o nunca se completó), la racha se reinicia a 1
    habit.streak = 1;
  }

  // Actualizamos la mejor racha si la actual la supera
  if (habit.streak > habit.bestStreak) {
    habit.bestStreak = habit.streak;
  }

  habit.lastCompleted = today; // Guardamos que hoy fue completado

  // Guardamos la fecha en el historial si no está ya
  if (!habit.completedDates) habit.completedDates = []; // protección datos antiguos
  if (!habit.completedDates.includes(today)) {
    habit.completedDates.push(today);
  }

  addXp(habit.xpReward, habit.category); // Damos la XP correspondiente y la categoría
  saveState();
  render();
}

function deleteHabit(habitId) {
  state.habits = state.habits.filter(h => h.id != habitId);
  saveState();
  render();
}

// ===============================
// LISTA DE LA COMPRA
// ===============================

shoppingForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = shoppingItem.value.trim();
  const category = shoppingCategory.value;

  if (!title) return;

  // Creamos el objeto del artículo
  const item = {
    id: generateId(),
    title,
    category,
    checked: false // Al crearlo, aún no está tachado
  };

  state.shopping.push(item);
  saveState();
  renderShopping();

  shoppingForm.reset();
});

function toggleShoppingItem(itemId) {
  // Busca el artículo y cambia su estado entre marcado y no marcado
  const item = state.shopping.find(i => i.id == itemId);
  if (!item) return;
  item.checked = !item.checked; // Invierte el estado
  saveState();
  renderShopping();
}

function deleteShoppingItem(itemId) {
  state.shopping = state.shopping.filter(i => i.id != itemId);
  saveState();
  renderShopping();
}

function completeShoppingList() {
  // Solo completamos si hay artículos
  if (state.shopping.length === 0) {
    alert("La lista está vacía.");
    return;
  }

  // Calculamos la XP total según las categorías de los artículos
  // Agrupamos por categoría y damos XP una vez por categoría presente
  const categoriesPresent = [...new Set(state.shopping.map(i => i.category))];
  let totalXp = 0;
  categoriesPresent.forEach(cat => {
    totalXp += SHOPPING_XP[cat] || SHOPPING_XP.otros;
    addXp(SHOPPING_XP[cat] || SHOPPING_XP.otros, cat);
  });

  alert(`¡Lista completada! Has ganado ${totalXp} XP.`);

  // Vaciamos la lista
  state.shopping = [];
  saveState();
  renderShopping();
}

function clearShoppingList() {
  // Vaciamos la lista sin dar XP
  if (state.shopping.length === 0) return;
  if (!confirm("¿Seguro que quieres vaciar la lista?")) return;
  state.shopping = [];
  saveState();
  renderShopping();
}

// ===============================
// MODAL DE ACTUALIZACIÓN
// ===============================
// Muestra un modal con las novedades cada vez que APP_VERSION cambia.
// El usuario solo lo ve una vez por versión, gracias a localStorage.

function checkUpdateModal() {
  // Leemos la última versión que el usuario ya vio
  const seenVersion = localStorage.getItem("levelup_seen_version");

  // Si ya vio esta versión, no hacemos nada
  if (seenVersion === APP_VERSION) return;

  // Inyectamos el contenido del mensaje en el div del modal
  const notes = document.getElementById("updateNotes");
  if (notes) notes.innerHTML = UPDATE_NOTES;

  // Mostramos el modal
  const overlay = document.getElementById("updateOverlay");
  if (overlay) overlay.style.display = "flex";
}

function closeUpdateModal() {
  // Guardamos la versión actual para no volver a mostrarla
  // hasta que APP_VERSION cambie en una futura update
  localStorage.setItem("levelup_seen_version", APP_VERSION);

  const overlay = document.getElementById("updateOverlay");
  if (overlay) overlay.style.display = "none";
}

function openSettings() {
  // Renderizamos el selector de temas antes de mostrar el modal
  // para que siempre esté actualizado al abrirlo
  renderThemeSelector();

  const overlay = document.getElementById("settingsOverlay");
  if (overlay) overlay.style.display = "flex";
}

function closeSettings() {
  const overlay = document.getElementById("settingsOverlay");
  if (overlay) overlay.style.display = "none";
}

// ===============================
// RENDER DEL GRÁFICO DE HABILIDADES
// ===============================
// Dibuja el octógono de categorías en el <canvas> del perfil.
// Se llama cada vez que render() se ejecuta.

function renderSkillChart() {
  const canvas = document.getElementById("skillChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 90;

  const keys   = ["otros", "deporte", "estudio", "ocio", "hogar", "creatividad", "salud", "trabajo"];
  const labels = ["Otros", "Deporte", "Estudio", "Ocio", "Hogar", "Creatividad", "Salud", "Trabajo"];

  // Protección por si no existe categoryXp aún (datos guardados antiguos)
  const catXp = state.user.categoryXp || {};

  // Calculamos el máximo para normalizar (mínimo 1 para evitar dividir por 0)
  const maxXp = Math.max(1, ...keys.map(k => catXp[k] || 0));

  // Calculamos los ángulos: empezamos arriba (-90°) y repartimos 360° entre 8
  const angles = keys.map((_, i) => (Math.PI * 2 * i) / keys.length - Math.PI / 2);

  // Limpiamos el canvas antes de redibujar
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- Dibujamos la cuadrícula de fondo (3 niveles) ---
  for (let level = 1; level <= 3; level++) {
    const r = (radius * level) / 3;
    ctx.beginPath();
    angles.forEach((angle, i) => {
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // --- Dibujamos las líneas desde el centro a cada vértice ---
  angles.forEach(angle => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // --- Dibujamos el polígono de datos ---
  ctx.beginPath();
  keys.forEach((key, i) => {
    const value = (catXp[key] || 0) / maxXp;
    const x = cx + radius * value * Math.cos(angles[i]);
    const y = cy + radius * value * Math.sin(angles[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  const accentColor = getComputedStyle(document.body).getPropertyValue("--accent").trim();
  ctx.fillStyle = accentColor + "40"; // 40 en hex = ~25% de opacidad
  ctx.fill();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // --- Dibujamos las etiquetas ---
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  keys.forEach((key, i) => {
    const labelRadius = radius + 20;
    const x = cx + labelRadius * Math.cos(angles[i]);
    const y = cy + labelRadius * Math.sin(angles[i]) + 4;
    ctx.fillText(labels[i], x, y);
  });
}

// ===============================
// RENDER DEL SELECTOR DE TEMAS
// ===============================
// Dibuja los botones para elegir el tema visual, mostrando cuáles
// están desbloqueados y cuál es el activo. Se llama al abrir ajustes.

function renderThemeSelector() {
  const container = document.getElementById("themeSelector");
  if (!container) return;

  container.innerHTML = "";

  // Recorremos todos los temas y creamos un botón para cada uno
  Object.entries(THEMES).forEach(([key, theme]) => {
    const unlocked = state.user.level >= theme.level;
    const isActive = state.user.selectedTheme === key;

    const btn = document.createElement("button");
    btn.className = "theme-btn" +
      (isActive ? " theme-btn-active" : "") +
      (!unlocked ? " theme-btn-locked" : "");

    // Si está bloqueado mostramos el nivel necesario
    btn.textContent = unlocked ? theme.label : `🔒 ${theme.label} (Nv. ${theme.level})`;

    btn.addEventListener("click", () => selectTheme(key));
    container.appendChild(btn);
  });
}

// ===============================
// RENDER DE LA INTERFAZ
// ===============================
// "Render" significa actualizar lo que se ve en pantalla para que
// refleje el estado actual de los datos. Se llama cada vez que algo cambia.

function render() {
  renderProfile();    // Actualiza el panel de usuario
  renderTasks();      // Actualiza la lista de tareas
  renderHabits();     // Actualiza la lista de hábitos
  renderShopping();   // Actualiza la lista de la compra
  renderStats();      // Actualiza las estadísticas
  renderSkillChart(); // Actualiza el gráfico de habilidades
}

function renderProfile() {
  // Usamos getElementById en vez de variables globales porque el perfil
  // está en page-perfil y puede no estar visible. Si el elemento no existe
  // en el DOM activo simplemente no hacemos nada.
  const playerName = document.getElementById("playerName");
  const levelText = document.getElementById("levelText");
  const xpText = document.getElementById("xpText");
  const xpFill = document.getElementById("xpFill");
  const unlockList = document.getElementById("unlockList");
  const pendingTasksCount = document.getElementById("pendingTasksCount");
  const completedTasksCount = document.getElementById("completedTasksCount");
  const habitCount = document.getElementById("habitCount");
  const totalXpText = document.getElementById("totalXpText");

  if (playerName) playerName.textContent = state.user.name;
  if (levelText) levelText.textContent = `Nivel ${state.user.level}`;

  if (xpText && xpFill) {
    const needed = xpNeededForLevel(state.user.level);
    xpText.textContent = `${state.user.xp} / ${needed} XP`;
    const percent = (state.user.xp / needed) * 100;
    xpFill.style.width = `${percent}%`;
  }

  // Regeneramos la lista de desbloqueos
  if (unlockList) {
    unlockList.innerHTML = "";
    const unlocked = getUnlockedItems();
    unlocked.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.text;
      unlockList.appendChild(li);
    });
  }

  // Actualizamos el resumen con los contadores
  if (pendingTasksCount) pendingTasksCount.textContent = state.tasks.filter(t => !t.completed).length;
  if (completedTasksCount) completedTasksCount.textContent = state.tasks.filter(t => t.completed).length;
  if (habitCount) habitCount.textContent = state.habits.length;
  if (totalXpText) totalXpText.textContent = state.user.totalXp;
}

function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = "";

  const completedList = document.getElementById("completedTaskList");
  const completedCount = document.getElementById("completedTasksToggleCount");

  if (completedList) completedList.innerHTML = "";

  // Separamos las tareas en dos arrays: pendientes y completadas
  const pending = state.tasks.filter(t => !t.completed);
  const completed = state.tasks.filter(t => t.completed);

  // --- Tareas pendientes ---
  if (pending.length === 0) {
    taskList.innerHTML = "<p>No hay tareas pendientes.</p>";
  } else {
    pending.forEach(task => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div class="item-top">
          <div>
            <div class="item-title">${task.title}</div>
            <div class="item-meta">
              Dificultad: ${difficultyLabel(task.difficulty)} | Recompensa: ${task.xpReward} XP | Categoría: ${CATEGORIES[task.category] || task.category}
            </div>
          </div>
        </div>
        <div class="item-actions">
          <button class="btn-complete">Completar</button>
          <button class="btn-delete">Eliminar</button>
        </div>
      `;
      div.querySelector(".btn-complete").addEventListener("click", () => completeTask(task.id));
      div.querySelector(".btn-delete").addEventListener("click", () => deleteTask(task.id));
      taskList.appendChild(div);
    });
  }

  // --- Tareas completadas (dentro del desplegable) ---
  if (completedCount) completedCount.textContent = completed.length;

  if (completedList) {
    if (completed.length === 0) {
      completedList.innerHTML = "<p>Ninguna tarea completada todavía.</p>";
    } else {
      completed.forEach(task => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
          <div class="item-top">
            <div>
              <div class="item-title done">${task.title}</div>
              <div class="item-meta">
                Dificultad: ${difficultyLabel(task.difficulty)} | Recompensa: ${task.xpReward} XP | Categoría: ${CATEGORIES[task.category] || task.category}
              </div>
            </div>
          </div>
          <div class="item-actions">
            <button class="btn-delete">Eliminar</button>
          </div>
        `;
        div.querySelector(".btn-delete").addEventListener("click", () => deleteTask(task.id));
        completedList.appendChild(div);
      });
    }
  }
}

function renderHabits() {
  if (!habitList) return;
  habitList.innerHTML = "";

  if (state.habits.length === 0) {
    habitList.innerHTML = "<p>No hay hábitos todavía.</p>";
    return;
  }

  state.habits.forEach(habit => {
    const div = document.createElement("div");
    div.className = "item";

    const completedToday = habit.lastCompleted === getTodayString();

    // Obtenemos el tier actual y el siguiente para la barra de progreso
    const tier = getStreakTier(habit.streak);
    const nextTierIndex = STREAK_TIERS.indexOf(tier) + 1;
    const nextTier = STREAK_TIERS[nextTierIndex] || null;

    // Añadimos la clase de color de borde según el tier
    div.classList.add(tier.borderClass);

    // Calculamos el progreso hacia el siguiente hito
    let progressHTML = "";
    if (nextTier) {
      const daysInCurrentTier = habit.streak - tier.minDays;
      const daysNeeded = nextTier.minDays - tier.minDays;
      const percent = Math.min((daysInCurrentTier / daysNeeded) * 100, 100);
      progressHTML = `
        <div class="streak-progress-bar">
          <div class="streak-progress-fill" style="width: ${percent}%"></div>
        </div>
        <div class="streak-progress-label">
          ${nextTier.emoji} Siguiente hito: ${nextTier.label} en ${nextTier.minDays - habit.streak} días
        </div>
      `;
    } else {
      // Ya está en el tier máximo
      progressHTML = `<div class="streak-progress-label">👑 Hito máximo alcanzado</div>`;
    }

    div.innerHTML = `
      <div class="item-top">
        <div>
          <div class="item-title">
            ${tier.emoji} ${habit.title}
          </div>
          <div class="item-meta">
            Dificultad: ${difficultyLabel(habit.difficulty)} | Recompensa: ${habit.xpReward} XP | Categoría: ${CATEGORIES[habit.category] || habit.category}
          </div>
          <div class="item-meta">
            Racha actual: ${habit.streak} días | Mejor racha: ${habit.bestStreak} días
          </div>
          ${progressHTML}
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-habit" ${completedToday ? "disabled" : ""}>
          ${completedToday ? "Hecho hoy" : "Marcar hoy"}
        </button>
        <button class="btn-delete">Eliminar</button>
      </div>
    `;

    div.querySelector(".btn-habit").addEventListener("click", () => completeHabit(habit.id));
    div.querySelector(".btn-delete").addEventListener("click", () => deleteHabit(habit.id));

    habitList.appendChild(div);
  });
}

function renderShopping() {
  if (!shoppingList) return;
  shoppingList.innerHTML = "";

  if (state.shopping.length === 0) {
    shoppingList.innerHTML = "<p>La lista está vacía. ¡Añade artículos!</p>";
    return;
  }

  state.shopping.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <div class="item-top">
        <div class="shopping-item-left">
          <input type="checkbox" class="shopping-checkbox" ${item.checked ? "checked" : ""} />
          <div>
            <div class="item-title ${item.checked ? "done" : ""}">${item.title}</div>
            <div class="item-meta">Categoría: ${CATEGORIES[item.category] || item.category}</div>
          </div>
        </div>
        <button class="btn-delete shopping-delete">Eliminar</button>
      </div>
    `;

    // Al hacer clic en el checkbox, marcamos o desmarcamos el artículo
    div.querySelector(".shopping-checkbox").addEventListener("change", () => toggleShoppingItem(item.id));
    div.querySelector(".shopping-delete").addEventListener("click", () => deleteShoppingItem(item.id));

    shoppingList.appendChild(div);
  });
}

function renderStats() {
  const habits = state.habits;

  // Generamos los últimos 30 días en formato "YYYY-MM-DD"
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  // Construimos el HTML de la cuadrícula
  let html = '<div class="activity-grid">';

  // Cabecera con las fechas (solo mostramos el día del mes)
  html += '<div class="activity-row">';
  html += '<div class="activity-habit-label"></div>'; // celda vacía para alinear
  days.forEach(day => {
    const dayNum = day.split("-")[2]; // solo el número del día
    html += `<div class="activity-day-header">${dayNum}</div>`;
  });
  html += '</div>';

  if (habits.length === 0) {
    html += '<p style="color: var(--muted); margin-top: 12px;">No hay hábitos todavía.</p>';
  } else {
    habits.forEach(habit => {
      const completedDates = habit.completedDates || [];

      html += '<div class="activity-row">';
      // Etiqueta con el nombre del hábito
      html += `<div class="activity-habit-label" title="${habit.title}">${habit.title}</div>`;

      // Un cuadrado por cada día
      days.forEach(day => {
        const done = completedDates.includes(day);
        html += `<div class="activity-cell ${done ? "activity-cell-done" : ""}" title="${day}"></div>`;
      });

      html += '</div>';
    });
  }

  html += '</div>';

  // Racha media y mejor hábito solo si nivel >= 2
  if (state.user.level >= 2 && habits.length > 0) {
    const totalStreak = habits.reduce((acc, h) => acc + h.streak, 0);
    const avgStreak = (totalStreak / habits.length).toFixed(1);
    let bestHabit = habits[0];
    for (let i = 1; i < habits.length; i++) {
      if (habits[i].bestStreak > bestHabit.bestStreak) bestHabit = habits[i];
    }
    html += `
      <div class="activity-summary">
        <p>Racha media: <strong>${avgStreak}</strong></p>
        <p>Mejor hábito: <strong>${bestHabit.title}</strong></p>
      </div>
    `;
  }

  // Inyectamos todo en la tarjeta de estadísticas
  const card = document.getElementById("statsCard");
  if (card) card.innerHTML = '<h3>Estadísticas</h3>' + html;
}

// ===============================
// INICIO DE LA APLICACIÓN
// ===============================
// DOMContentLoaded garantiza que este bloque se ejecuta solo cuando
// el HTML está 100% cargado y todos los elementos existen en el DOM.
// Esto evita errores de "elemento no encontrado" al arrancar.

document.addEventListener("DOMContentLoaded", function () {
  applyThemeByLevel();
  render();
  checkUpdateModal(); // Muestra el modal de novedades si hay una versión nueva

  // Edición del nombre del jugador.
  // Se registra aquí dentro para asegurar que el botón ya existe en el DOM.
  const editNameBtn = document.getElementById("editNameBtn");
  if (editNameBtn) {
    editNameBtn.addEventListener("click", function () {
      const newName = prompt("Introduce tu nombre:", state.user.name);
      // prompt() abre una ventana emergente con un campo de texto.
      // Devuelve null si el usuario pulsa "Cancelar".
      if (newName && newName.trim()) {
        state.user.name = newName.trim();
        saveState();
        render();
      }
    });
  }

  // Abre el modal de ajustes al pulsar la tuerca
  const settingsBtn = document.getElementById("settingsBtn");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", function () {
      openSettings();
    });
  }

  // Botones de la lista de la compra
  if (completeShoppingBtn) completeShoppingBtn.addEventListener("click", completeShoppingList);
  if (clearShoppingBtn) clearShoppingBtn.addEventListener("click", clearShoppingList);
});