// ===============================
// CONFIGURACION BASICA
// ===============================

// Una constante es una variable que no puede cambiar de valor.
// STORAGE_KEY es el "nombre del cajón" donde guardaremos los datos
// en el navegador (localStorage). Así siempre usamos el mismo nombre.
const STORAGE_KEY = "levelup_tasks_app";

// Nombre de la moneda de la tienda. Cámbialo aquí para que se actualice en toda la app.
const CURRENCY_NAME = "PaupeDolars";
const CURRENCY_ICON = "🤑";

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

// Monedas que se ganan al completar tareas según dificultad
const TASK_COINS = {
  1: 5,
  2: 8,
  3: 12,
  4: 16,
  5: 20
};

// Monedas que se ganan al completar hábitos según dificultad
const HABIT_COINS = {
  1: 3,
  2: 5,
  3: 8
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

// Catálogo de artículos de la tienda.
// type: "font" | "border" | "title"
// value: el valor CSS o texto que se aplica al equiparlo
const SHOP_ITEMS = [
  // Tipografías
  { id: "font_mono",      type: "font",   label: "Monospace",   icon: "⌨️",  price: 50,  value: "'Courier New', monospace",  description: "Fuente de programador" },
  { id: "font_serif",     type: "font",   label: "Serif",       icon: "📜",  price: 50,  value: "Georgia, serif",             description: "Fuente clásica con serifa" },
  { id: "font_minecraft", type: "font",   label: "Minecraft",   icon: "⛏️",  price: 120, value: "'Press Start 2P', cursive",  description: "Chicken Jockye" },
  { id: "font_comicsans", type: "font",   label: "Comic Sans",  icon: "...", price: 1,   value: "'Comic Neue', cursive",      description: "Realmente vas a comprar esto?" },
  { id: "font_skyrim",    type: "font",   label: "Skyrim",      icon: "🐉",  price: 120, value: "'Cinzel', serif",            description: "Fus Ro Dah" },
  { id: "font_burgerking",type: "font",   label: "Burger King", icon: "🍔",  price: 90,  value: "'Lilita One', cursive",      description: "Gabilol trae una whooper" },
  // Marcos del perfil
  { id: "border_gold",     type: "border", label: "Dorado",    icon: "🥇", price: 50,  value: "gold",      description: "Un marco digno de un campeón" },
  { id: "border_rainbow",  type: "border", label: "Arcoíris",  icon: "🌈", price: 200, value: "rainbow",   description: "Hay un enano pelirrojo al final del arcoiris" },
  { id: "border_latido",   type: "border", label: "Latido",    icon: "💗", price: 120, value: "latido",    description: "Pulsante" },
  { id: "border_electrico",type: "border", label: "Eléctrico", icon: "⚡", price: 180, value: "electrico", description: "Zap" },
  { id: "border_hielo",    type: "border", label: "Hielo",     icon: "❄️", price: 150, value: "hielo",     description: "Tutorial de como ser frio como Saske" },
  { id: "border_sombra",   type: "border", label: "Sombra",    icon: "🌑", price: 170, value: "sombra",    description: "Edgy malita de la cabeza" },
  { id: "border_neon",     type: "border", label: "Neón",      icon: "🟢", price: 130, value: "neon",      description: "Brilla en la oscuridad" },
  // Títulos
  { id: "title_noob",    type: "title", label: "Novato",        icon: "🌱", price: 0,   value: "Novato",        description: "Lvl-1 Rookie" },
  { id: "title_grinder", type: "title", label: "El Incansable", icon: "⚙️", price: 80,  value: "El Incansable", description: "Para los que nunca paran" },
  { id: "title_legend",  type: "title", label: "Leyenda",       icon: "👑", price: 300, value: "Leyenda",       description: "Lvl-100 Mafia Boss" },
  { id: "title_paupero", type: "title", label: "El Paupérrimo", icon: "💸", price: 1,   value: "El Paupérrimo", description: "Estamos dando vueltas en círculos" }
];

// Versión actual de la app. Cámbiala cada vez que hagas una update
// para que el modal se muestre de nuevo a todos los usuarios.
const APP_VERSION = "1.5";

// Mensaje que se mostrará en el modal para esta versión.
// Puedes usar saltos de línea con \n o escribir HTML directamente.
const UPDATE_NOTES = `
  <h3>¡Bienvenido a LevelUp Tasks!</h3>
  <h4>Update!! Mas recompensas!! </h4>
  <ul>
    <li> Antes de nada, anunciar que tenemos a una nueva developer con nosotros (está trabajando en algo guapo), Nuria!! Aqui su github: https://github.com/nuriaguerra/nuriaguerra </li>
    <li> A partir de ahora, cada vez que veais una update recomendamos recargar con Ctrl+Shift+R para asegurarse de que teneis la última versión sin caché (en el movil debereis borrar los datos de navegación). </li>
    <li> Hemos añadido la pestaña de tienda!! Explorala, investiga como conseguir dinero (y gastalo), (queremos vuestra opinión sobre que debería estar en la tienda y que se debería desbloquear con niveles)</li>
    <li> No mas coming soon en la sección de estadísticas, ve a comprobarlo tu mismo!! </li>
    <li> Se han solucionado algunos aspectos estéticos que me daban toc </li>
    <li> Se buscan ideas para la próxima update, sobre todo sobre desbloqueos y estadísticas que os gustaría poder comprobar. Cualquier sugerencia al correo: iago.leis@rai.usc.es </li>
    <li> No nos hemos olvidada del resto de peticiones! Seguiremos trayendo updates cuando la fokin universidad nos deje un hueco, y seguiremos añadiendo mejoras poco a poco. 
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
      paupeDolars: 0, // Moneda para la tienda
      totalPaupeDolars: 0, // Total histórico de PaupeDolars ganados (para estadísticas)
      ownedItems: ["title_noob"], // siempre tiene el título inicial
      equippedItems: { // que lleva equipado en cada slot
        font: null,
        border: null,
        title: "title_noob"
      },
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
// Protección: si el state guardado no tiene paupeDolárs, lo añadimos
if (state.user.paupeDolárs === undefined) state.user.paupeDolárs = 0;
if (state.user.paupeDolars === undefined) state.user.paupeDolars = 0;
// Protección: total histórico de PaupeDolars para estadísticas
if (state.user.totalPaupeDolars === undefined) state.user.totalPaupeDolars = 0;
// Protección: si no tiene ownedItems, lo inicializamos con el título inicial
if (!state.user.ownedItems) state.user.ownedItems = ["title_noob"];
// Protección: si no tiene equippedItems, lo inicializamos
if (!state.user.equippedItems) state.user.equippedItems = { font: null, border: null, title: "title_noob" };

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

// Referencia para la fecha límite de las tareas (opcional)
const taskDueDate = document.getElementById("taskDueDate");

// ===============================
// NAVEGACIÓN ENTRE PÁGINAS
// ===============================
// navigateTo() oculta todas las páginas y muestra solo la activa.
// También actualiza el botón activo en el navbar.

function navigateTo(page) {
  // Lista de todas las páginas disponibles
  const pages = ["inicio", "stats", "compra", "tienda"];

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

  // Si navegamos a estadísticas, re-renderizamos para que estén actualizadas
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

// Calcula los días que quedan hasta la fecha límite de una tarea.
// Devuelve un número positivo si queda tiempo, 0 si es hoy, negativo si ha vencido.
function getDaysRemaining(dueDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignoramos la hora, solo comparamos fechas
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = due - today;
  return Math.round(diff / (1000 * 60 * 60 * 24)); // Convertimos ms a días
}

// Comprueba si hay tareas con fecha límite vencida y aplica penalización de XP.
// Se llama al arrancar la app para detectar vencimientos mientras estaba cerrada.
function checkTaskPenalties() {
  let penalized = false;

  state.tasks.forEach(task => {
    // Solo penalizamos tareas pendientes con fecha límite vencida
    // y que no hayan sido penalizadas ya (evita penalizar dos veces)
    if (!task.completed && task.dueDate && !task.penalized) {
      const days = getDaysRemaining(task.dueDate);
      if (days < 0) {
        // Restamos XP pero nunca por debajo de 0
        state.user.xp = Math.max(0, state.user.xp - task.xpReward);
        state.user.totalXp = Math.max(0, state.user.totalXp - task.xpReward);
        task.penalized = true; // Marcamos para no penalizar dos veces
        penalized = true;
      }
    }
  });

  if (penalized) {
    saveState();
    alert("⚠️ Tienes tareas vencidas. Has perdido XP por no completarlas a tiempo.");
  }
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

// Registra que el usuario ha abierto la app hoy.
// Guarda la fecha en localStorage y calcula los días consecutivos de uso.
function trackAppUsage() {
  const today = getTodayString();
  const lastOpen = localStorage.getItem("levelup_last_open");
  let streak = parseInt(localStorage.getItem("levelup_app_streak") || "0");

  if (lastOpen === today) {
    // Ya se abrió hoy, no hacemos nada
    return;
  }

  // Calculamos si fue ayer para mantener la racha
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split("T")[0];

  if (lastOpen === yesterdayString) {
    streak++; // La racha continúa
  } else {
    streak = 1; // Se rompe la racha, empezamos de 1
  }

  localStorage.setItem("levelup_last_open", today);
  localStorage.setItem("levelup_app_streak", streak.toString());
}

// Devuelve los días consecutivos que el usuario ha abierto la app
function getAppStreak() {
  return parseInt(localStorage.getItem("levelup_app_streak") || "0");
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
  state.user.xp -= xpNeededForLevel(state.user.level);
  state.user.level++;

  // Cada 5 niveles se dan 50 PaupeDolars como recompensa
  if (state.user.level % 5 === 0) {
    state.user.paupeDolars += 50;
    state.user.totalPaupeDolars = (state.user.totalPaupeDolars || 0) + 50;
    alert(`¡Has subido a nivel ${state.user.level}! 🎉 +50 PaupeDolars de recompensa`);
  } else {
    alert(`¡Has subido a nivel ${state.user.level}!`);
  }
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
    dueDate: taskDueDate.value || null, // Fecha límite (opcional, null si no se ha establecido)
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

  // Damos monedas según la dificultad y las sumamos también al total histórico
  const coins = TASK_COINS[task.difficulty] || 5;
  state.user.paupeDolars += coins;
  state.user.totalPaupeDolars = (state.user.totalPaupeDolars || 0) + coins;
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
    streak: 0,           // Racha actual de días consecutivos
    bestStreak: 0,       // La mejor racha que ha tenido este hábito
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

  // Damos monedas según la dificultad y las sumamos al total histórico
  const coins = HABIT_COINS[habit.difficulty] || 3;
  state.user.paupeDolars += coins;
  state.user.totalPaupeDolars = (state.user.totalPaupeDolars || 0) + coins;

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

  // Guardamos la categoría antes de resetear y la restauramos después
  const savedCategory = shoppingCategory.value;
  shoppingForm.reset();
  shoppingCategory.value = savedCategory;
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

function buyItem(itemId) {
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  // Comprobamos que no lo tenga ya
  if (!state.user.ownedItems) state.user.ownedItems = [];
  if (state.user.ownedItems.includes(itemId)) {
    alert("Ya tienes este artículo.");
    return;
  }

  // Comprobamos que tenga suficientes monedas
  if (state.user.paupeDolars < item.price) {
    alert(`No tienes suficientes ${CURRENCY_NAME}. Necesitas ${item.price} ${CURRENCY_ICON}`);
    return;
  }

  // Realizamos la compra
  state.user.paupeDolars -= item.price;
  state.user.ownedItems.push(itemId);
  saveState();
  renderShop();
  renderProfile();
  alert(`¡${item.icon} ${item.label} comprado!`);
}

function equipItem(itemId) {
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  // Solo se pueden equipar artículos que se posean
  if (!state.user.ownedItems.includes(itemId)) return;

  // Guardamos el artículo equipado en su slot
  if (!state.user.equippedItems) state.user.equippedItems = { font: null, border: null, title: null };
  state.user.equippedItems[item.type] = itemId;

  // Aplicamos el efecto visual
  applyEquippedItems();
  saveState();
  renderShop();
  renderProfile();
}

function unequipItem(type) {
  if (!state.user.equippedItems) return;

  // Quitamos el artículo equipado en ese slot
  state.user.equippedItems[type] = null;

  applyEquippedItems();
  saveState();
  renderShop();
  renderProfile();
}

function applyEquippedItems() {
  if (!state.user.equippedItems) return;

  // --- Tipografía ---
  const fontId = state.user.equippedItems.font;
  if (fontId) {
    const fontItem = SHOP_ITEMS.find(i => i.id === fontId);
    if (fontItem) document.body.style.fontFamily = fontItem.value;
  } else {
    document.body.style.fontFamily = "Arial, Helvetica, sans-serif";
  }

  // --- Marco del perfil ---
  const borderId = state.user.equippedItems.border;
  const profileCard = document.querySelector(".profile-card");
  if (profileCard) {
    // Limpiamos todos los marcos anteriores
    profileCard.classList.remove(
      "border-rainbow", "border-latido", "border-electrico",
      "border-hielo", "border-sombra", "border-neon"
    );
    profileCard.style.borderWidth = "";
    profileCard.style.borderStyle = "";
    profileCard.style.borderColor = "";

    if (borderId) {
      const borderItem = SHOP_ITEMS.find(i => i.id === borderId);
      if (borderItem) {
        if (borderItem.value === "gold") {
          // Marco dorado: aplicamos estilo inline directamente
          profileCard.style.borderWidth = "3px";
          profileCard.style.borderStyle = "solid";
          profileCard.style.borderColor = "#facc15";
        } else {
          // Todos los demás usan clases CSS con animación
          profileCard.classList.add("border-" + borderItem.value);
        }
      }
    }
  }
}

function renderShop() {
  const container = document.getElementById("shopItemsGrid");
  const coinsDisplay = document.getElementById("shopCoinsDisplay");

  // Actualizamos el saldo de monedas en la cabecera de la tienda
  if (coinsDisplay) {
    coinsDisplay.textContent = `${CURRENCY_ICON} ${state.user.paupeDolars} ${CURRENCY_NAME}`;
  }

  // Inyectamos la tabla informativa de recompensas en el desplegable
  const infoBox = document.getElementById("shopRewardsInfo");
  if (infoBox) {
    infoBox.innerHTML = `
      <h4>💡 ¿Cómo ganar ${CURRENCY_NAME}?</h4>
      <div class="shop-rewards-grid">
        <div>
          <strong>Tareas</strong>
          <ul>
            <li>Ez → ${TASK_COINS[1]} ${CURRENCY_ICON}</li>
            <li>Sencillito → ${TASK_COINS[2]} ${CURRENCY_ICON}</li>
            <li>Media → ${TASK_COINS[3]} ${CURRENCY_ICON}</li>
            <li>Difícil → ${TASK_COINS[4]} ${CURRENCY_ICON}</li>
            <li>Job Finding → ${TASK_COINS[5]} ${CURRENCY_ICON}</li>
          </ul>
        </div>
        <div>
          <strong>Hábitos</strong>
          <ul>
            <li>Ez → ${HABIT_COINS[1]} ${CURRENCY_ICON}</li>
            <li>Media → ${HABIT_COINS[2]} ${CURRENCY_ICON}</li>
            <li>Job Finding → ${HABIT_COINS[3]} ${CURRENCY_ICON}</li>
          </ul>
        </div>
        <div>
          <strong> Subiendo de nivel</strong>
          <ul>
            <li>Cada 5 niveles → ${CURRENCY_ICON} 50 ${CURRENCY_NAME}</li>
          </ul>
        </div>
      </div>
    `;
  }

  if (!container) return;
  container.innerHTML = "";

  // Agrupamos los artículos por tipo para mostrarlos en secciones
  const types = {
    font:   { label: "Tipografías",      icon: "🔤" },
    border: { label: "Marcos de perfil", icon: "🖼️" },
    title:  { label: "Títulos",          icon: "📛" }
  };

  Object.entries(types).forEach(([type, info]) => {
    const items = SHOP_ITEMS.filter(i => i.type === type);

    // Cabecera de categoría
    const header = document.createElement("h3");
    header.className = "shop-category-header";
    header.textContent = `${info.icon} ${info.label}`;
    container.appendChild(header);

    // Cuadrícula de artículos
    const grid = document.createElement("div");
    grid.className = "shop-grid";

    items.forEach(item => {
      const owned = state.user.ownedItems?.includes(item.id);
      const equipped = state.user.equippedItems?.[item.type] === item.id;

      const card = document.createElement("div");
      card.className = "shop-card" + (owned ? " shop-card-owned" : "") + (equipped ? " shop-card-equipped" : "");

      card.innerHTML = `
        <div class="shop-card-icon">${item.icon}</div>
        <div class="shop-card-label">${item.label}</div>
        <div class="shop-card-desc">${item.description}</div>
        <div class="shop-card-price">${item.price === 0 ? "Gratis" : CURRENCY_ICON + " " + item.price}</div>
        <div class="shop-card-actions">
          ${!owned
            ? `<button class="btn-buy" onclick="buyItem('${item.id}')">Comprar</button>`
            : equipped
              ? `<button class="btn-unequip" onclick="unequipItem('${item.type}')">Desequipar</button>`
              : `<button class="btn-equip" onclick="equipItem('${item.id}')">Equipar</button>`
          }
        </div>
      `;

      grid.appendChild(card);
    });

    container.appendChild(grid);
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
  renderSkillChart(); // Actualiza el gráfico de habilidades
  renderShop();       // Actualiza la tienda (por si cambian monedas o artículos)
}

function renderProfile() {
  // Usamos getElementById en vez de variables globales porque el perfil
  // está en page-inicio y puede no estar visible en otras páginas.
  const playerName = document.getElementById("playerName");
  const levelText = document.getElementById("levelText");
  const xpText = document.getElementById("xpText");
  const xpFill = document.getElementById("xpFill");
  const unlockList = document.getElementById("unlockList");

  if (playerName) playerName.textContent = state.user.name;
  if (levelText) levelText.textContent = `Nivel ${state.user.level}`;

  // Mostramos el título equipado si hay uno
  const playerTitle = document.getElementById("playerTitle");
  if (playerTitle) {
    const titleId = state.user.equippedItems?.title;
    if (titleId) {
      const titleItem = SHOP_ITEMS.find(i => i.id === titleId);
      if (titleItem) playerTitle.textContent = titleItem.value;
    } else {
      playerTitle.textContent = "";
    }
  }

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

      // Calculamos el estado de la fecha límite si la tarea tiene una
      let dueDateHTML = "";
      let urgencyClass = "";

      if (task.dueDate) {
        const days = getDaysRemaining(task.dueDate);
        if (days < 0) {
          // Tarea vencida
          dueDateHTML = `<div class="item-meta due-date due-date-expired">❌ Vencida hace ${Math.abs(days)} día${Math.abs(days) !== 1 ? "s" : ""}</div>`;
          urgencyClass = "task-expired";
        } else if (days <= 2) {
          // Quedan 2 días o menos → urgente
          dueDateHTML = `<div class="item-meta due-date due-date-urgent">⚠️ ${days === 0 ? "Vence hoy" : `${days} día${days !== 1 ? "s" : ""} restante${days !== 1 ? "s" : ""}`}</div>`;
          urgencyClass = "task-urgent";
        } else {
          // Queda tiempo suficiente
          dueDateHTML = `<div class="item-meta due-date">📅 ${days} días restantes</div>`;
        }
      }

      // Añadimos la clase de urgencia al div si corresponde
      if (urgencyClass) div.classList.add(urgencyClass);

      div.innerHTML = `
        <div class="item-top">
          <div>
            <div class="item-title">${task.title}</div>
            <div class="item-meta">
              Dificultad: ${difficultyLabel(task.difficulty)} | Recompensa: ${task.xpReward} XP | Categoría: ${CATEGORIES[task.category] || task.category}
            </div>
            ${dueDateHTML}
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

// ===============================
// RENDER DE ESTADÍSTICAS
// ===============================
// Genera toda la página de estadísticas con resumen general,
// gráfico de actividad de hábitos y distribución de XP por categoría.

function renderStats() {
  const habits = state.habits;

  // ---- RESUMEN GENERAL ----
  // Actualizamos las tarjetas de resumen con los datos actuales del jugador
  const statTotalXp = document.getElementById("statTotalXp");
  const statTotalCoins = document.getElementById("statTotalCoins");
  const statTasksDone = document.getElementById("statTasksDone");
  const statTasksPending = document.getElementById("statTasksPending");
  const statDaysStreak = document.getElementById("statDaysStreak");

  if (statTotalXp) statTotalXp.textContent = state.user.totalXp;
  if (statTotalCoins) statTotalCoins.textContent = state.user.totalPaupeDolars || 0;
  if (statTasksDone) statTasksDone.textContent = state.tasks.filter(t => t.completed).length;
  if (statTasksPending) statTasksPending.textContent = state.tasks.filter(t => !t.completed).length;
  if (statDaysStreak) statDaysStreak.textContent = getAppStreak();

  // ---- GRÁFICO DE ACTIVIDAD DE HÁBITOS ----
  // Generamos los últimos 30 días en formato "YYYY-MM-DD"
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  // Construimos el HTML de la cuadrícula al estilo GitHub
  let activityHtml = '<div class="activity-grid">';

  // Cabecera con los números de día del mes
  activityHtml += '<div class="activity-row">';
  activityHtml += '<div class="activity-habit-label"></div>'; // celda vacía para alinear
  days.forEach(day => {
    const dayNum = day.split("-")[2]; // solo el número del día
    activityHtml += `<div class="activity-day-header">${dayNum}</div>`;
  });
  activityHtml += '</div>';

  if (habits.length === 0) {
    activityHtml += '<p style="color: var(--muted); margin-top: 12px;">No hay hábitos todavía.</p>';
  } else {
    habits.forEach(habit => {
      const completedDates = habit.completedDates || [];

      activityHtml += '<div class="activity-row">';
      // Etiqueta con el nombre del hábito truncado si es muy largo
      activityHtml += `<div class="activity-habit-label" title="${habit.title}">${habit.title}</div>`;

      // Un cuadrado por cada día, coloreado si fue completado
      days.forEach(day => {
        const done = completedDates.includes(day);
        activityHtml += `<div class="activity-cell ${done ? "activity-cell-done" : ""}" title="${day}"></div>`;
      });

      activityHtml += '</div>';
    });
  }
  activityHtml += '</div>';

  // Racha media y mejor hábito (solo disponibles desde nivel 2)
  if (state.user.level >= 2 && habits.length > 0) {
    const totalStreak = habits.reduce((acc, h) => acc + h.streak, 0);
    const avgStreak = (totalStreak / habits.length).toFixed(1);
    let bestHabit = habits[0];
    for (let i = 1; i < habits.length; i++) {
      if (habits[i].bestStreak > bestHabit.bestStreak) bestHabit = habits[i];
    }
    activityHtml += `
      <div class="activity-summary">
        <p>Racha media: <strong>${avgStreak} días</strong></p>
        <p>Mejor hábito: <strong>${bestHabit.title}</strong> (${bestHabit.bestStreak} días)</p>
      </div>
    `;
  } else if (state.user.level < 2) {
    activityHtml += `<p style="color: var(--muted); margin-top: 12px; font-size: 14px;">🔒 Racha media y mejor hábito disponibles desde nivel 2.</p>`;
  }

  // Inyectamos el gráfico en su contenedor
  const activityCard = document.getElementById("statsActivityCard");
  if (activityCard) activityCard.innerHTML = activityHtml;

  // ---- DISTRIBUCIÓN DE XP POR CATEGORÍA ----
  const catXp = state.user.categoryXp || {};
  const totalCatXp = Object.values(catXp).reduce((acc, val) => acc + val, 0);

  let categoryHtml = "";

  if (totalCatXp === 0) {
    categoryHtml = `<p style="color: var(--muted); font-size: 14px;">Completa tareas y hábitos para ver la distribución de XP.</p>`;
  } else {
    // Ordenamos las categorías de mayor a menor XP
    const sortedCategories = Object.entries(catXp)
      .filter(([, xp]) => xp > 0)
      .sort(([, a], [, b]) => b - a);

    sortedCategories.forEach(([key, xp]) => {
      const percent = Math.round((xp / totalCatXp) * 100);
      categoryHtml += `
        <div class="stats-category-row">
          <div class="stats-category-label">${CATEGORIES[key] || key}</div>
          <div class="stats-category-bar-wrap">
            <div class="stats-category-bar" style="width: ${percent}%"></div>
          </div>
          <div class="stats-category-value">${xp} XP (${percent}%)</div>
        </div>
      `;
    });
  }

  const categoryCard = document.getElementById("statsCategoryCard");
  if (categoryCard) categoryCard.innerHTML = categoryHtml;
}

// ===============================
// INICIO DE LA APLICACIÓN
// ===============================
// DOMContentLoaded garantiza que este bloque se ejecuta solo cuando
// el HTML está 100% cargado y todos los elementos existen en el DOM.
// Esto evita errores de "elemento no encontrado" al arrancar.

document.addEventListener("DOMContentLoaded", function () {
  applyThemeByLevel();
  applyEquippedItems();
  trackAppUsage();      // Registra que el usuario ha abierto la app hoy
  checkTaskPenalties(); // Verifica si hay tareas vencidas y aplica penalizaciones
  render();
  renderStats();        // Renderizamos las estadísticas al arrancar
  checkUpdateModal();   // Muestra el modal de novedades si hay una versión nueva

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