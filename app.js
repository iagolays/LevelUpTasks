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

// Aquí definimos las categorias de los habitos y las tareas
const CATEGORIES = {
  otros: "Otros",
  deporte: "Deporte",
  estudio: "Estudio",
  ocio: "Ocio",
  hogar: "Tareas del hogar",
  creatividad: "Creatividad"
};

// Array (lista) de objetos. Cada objeto tiene el nivel mínimo necesario
// y el texto que se mostrará al desbloquearlo.
const UNLOCKS = [
  { level: 1, text: "Tema base desbloqueado" },
  { level: 2, text: "Estadísticas mejoradas desbloqueadas" },
  { level: 3, text: "Tema azul desbloqueado" },
  { level: 5, text: "Tema dorado desbloqueado" }
];

// Versión actual de la app. Cámbiala cada vez que hagas una update
// para que el modal se muestre de nuevo a todos los usuarios.
const APP_VERSION = "1.0";

// Mensaje que se mostrará en el modal para esta versión.
// Puedes usar saltos de línea con \n o escribir HTML directamente.
const UPDATE_NOTES = `
  <h3>¡Bienvenido a LevelUp Tasks!</h3>
  <h4> Milagro!! He subido una update!! </h4>
  <ul>
    <li> Lo primero es esta pantalla de novedades que deberías estar viendo ahora mismo! </li>
    <li> Tambien hemos solucionado algunos bug que habia con los hábitos! </li>
    <li> Hemos añadido el cambio de nombre del jugador! </li>
    <li> Ahora puedes asignar categorías a tus tareas y hábitos! </li>
    <li> Hemos añadido un gráfico de habilidades por categoría en el perfil! </li>
    <li> ¡Y muchas mejoras más que te invitamos a descubrir! </li>
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
      categoryXp: { // Aquí guardaremos la XP acumulada por categoría
        otros: 0,
        deporte: 0,
        estudio: 0,
        ocio: 0,
        hogar: 0,
        creatividad: 0
      }
    },
    tasks: [],   // Lista vacía de tareas
    habits: []   // Lista vacía de hábitos
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

const playerName = document.getElementById("playerName");
const levelText = document.getElementById("levelText");
const xpText = document.getElementById("xpText");
const xpFill = document.getElementById("xpFill");
const unlockList = document.getElementById("unlockList");

const pendingTasksCount = document.getElementById("pendingTasksCount");
const completedTasksCount = document.getElementById("completedTasksCount");
const habitCount = document.getElementById("habitCount");
const totalXpText = document.getElementById("totalXpText");

const avgStreakText = document.getElementById("avgStreakText");
const bestHabitText = document.getElementById("bestHabitText");
const statsCard = document.getElementById("statsCard");

// Referencias para las categorías
const taskCategory = document.getElementById("taskCategory");
const habitCategory = document.getElementById("habitCategory");

// Referencia al botón de editar nombre
const editNameBtn = document.getElementById("editNameBtn");

// ===============================
// EVENTOS DE LA INTERFAZ
// ===============================

// Edición del nombre del jugador.
// Comprobamos que el botón existe antes de añadir el evento,
// así evitamos errores si por algún motivo no se encuentra en el HTML.


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

// ===============================
// SISTEMA DE XP Y NIVELES
// ===============================

function addXp(amount, category) {
  // Suma XP al nivel actual Y al total histórico
  state.user.xp += amount;      // += es lo mismo que: state.user.xp = state.user.xp + amount
  state.user.totalXp += amount;

  // Protección: si el usuario ya tenía datos guardados sin categoryXp
  if (!state.user.categoryXp) {
    state.user.categoryXp = { otros: 0, deporte: 0, estudio: 0, ocio: 0, hogar: 0, creatividad: 0 };
  }

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
  // Primero eliminamos cualquier tema anterior para no acumularlos
  document.body.classList.remove("theme-blue", "theme-gold");

  // Luego añadimos el tema correspondiente al nivel actual
  if (state.user.level >= 5) {
    document.body.classList.add("theme-gold");
  } else if (state.user.level >= 3) {
    document.body.classList.add("theme-blue");
  }
  // Si es nivel 1 o 2, no se añade ninguna clase (queda el tema por defecto)
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
    lastCompleted: null // Última vez que se completó (null = nunca)
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
// RENDER DEL GRÁFICO DE HABILIDADES
// ===============================
// Dibuja el hexágono de categorías en el <canvas> del perfil.
// Se llama cada vez que render() se ejecuta.

function renderSkillChart() {
  const canvas = document.getElementById("skillChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 90;

  const keys   = ["otros","deporte", "estudio", "ocio", "hogar", "creatividad"];
  const labels = ["Otros","Deporte", "Estudio", "Ocio", "Hogar", "Creatividad"];

  // Protección por si no existe categoryXp aún (datos guardados antiguos)
  const catXp = state.user.categoryXp || {};

  // Calculamos el máximo para normalizar (mínimo 1 para evitar dividir por 0)
  const maxXp = Math.max(1, ...keys.map(k => catXp[k] || 0));

  // Calculamos los ángulos: empezamos arriba (-90°) y repartimos 360° entre 6
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
  ctx.fillStyle = "rgba(34, 197, 94, 0.25)"; // Verde semitransparente
  ctx.fill();
  ctx.strokeStyle = "#22c55e";
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
// RENDER DE LA INTERFAZ
// ===============================
// "Render" significa actualizar lo que se ve en pantalla para que
// refleje el estado actual de los datos. Se llama cada vez que algo cambia.

function render() {
  renderProfile();    // Actualiza el panel de usuario
  renderTasks();      // Actualiza la lista de tareas
  renderHabits();     // Actualiza la lista de hábitos
  renderStats();      // Actualiza las estadísticas
  renderSkillChart(); // Actualiza el gráfico de habilidades
}

function renderProfile() {
  // .textContent cambia el texto visible de un elemento HTML
  playerName.textContent = state.user.name;
  levelText.textContent = `Nivel ${state.user.level}`;

  const needed = xpNeededForLevel(state.user.level);
  xpText.textContent = `${state.user.xp} / ${needed} XP`;

  // Calculamos el porcentaje para la barra de progreso
  const percent = (state.user.xp / needed) * 100;
  xpFill.style.width = `${percent}%`;
  // .style.width modifica directamente el CSS del elemento desde JavaScript

  // Regeneramos la lista de desbloqueos
  unlockList.innerHTML = ""; // Limpiamos la lista antes de rellenarla
  const unlocked = getUnlockedItems();

  // .forEach() recorre cada elemento del array y ejecuta la función para él
  unlocked.forEach(item => {
    const li = document.createElement("li"); // Creamos un nuevo elemento <li>
    li.textContent = item.text;              // Le ponemos el texto
    unlockList.appendChild(li);             // Lo añadimos al <ul> del HTML
  });

  // Actualizamos el resumen con los contadores
  pendingTasksCount.textContent = state.tasks.filter(t => !t.completed).length;
  // .filter() filtra las no completadas → .length cuenta cuántas son
  completedTasksCount.textContent = state.tasks.filter(t => t.completed).length;
  habitCount.textContent = state.habits.length;
  totalXpText.textContent = state.user.totalXp;
}

function renderTasks() {
  taskList.innerHTML = ""; // Limpiamos la lista antes de regenerarla

  if (state.tasks.length === 0) {
    taskList.innerHTML = "<p>No hay tareas todavía.</p>";
    return; // Salimos de la función, no hace falta seguir
  }

  state.tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "item"; // Le asignamos la clase CSS

    // innerHTML nos permite insertar HTML completo como texto.
    // Usamos template literals (comillas invertidas) para insertar
    // los datos de cada tarea de forma legible.
    div.innerHTML = `
      <div class="item-top">
        <div>
          <div class="item-title ${task.completed ? "done" : ""}">
            ${task.title}
          </div>
          <!-- Operador ternario: condición ? si_true : si_false -->
          <!-- Si está completada añade la clase "done", si no, nada -->
          <div class="item-meta">
            Dificultad: ${difficultyLabel(task.difficulty)} | Recompensa: ${task.xpReward} XP | Categoría: ${CATEGORIES[task.category] || task.category}
          </div>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-complete" ${task.completed ? "disabled" : ""}>
          ${task.completed ? "Completada" : "Completar"}
        </button>
        <!-- "disabled" es un atributo HTML que desactiva el botón -->
        <button class="btn-delete">Eliminar</button>
      </div>
    `;

    // Buscamos los botones DENTRO de este div concreto
    const completeBtn = div.querySelector(".btn-complete");
    const deleteBtn = div.querySelector(".btn-delete");

    // Asignamos las funciones que se ejecutarán al hacer clic
    // Las arrow functions (=>) son una forma compacta de escribir funciones
    completeBtn.addEventListener("click", () => completeTask(task.id));
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    taskList.appendChild(div); // Añadimos la tarjeta al contenedor del HTML
  });
}

function renderHabits() {
  habitList.innerHTML = "";

  if (state.habits.length === 0) {
    habitList.innerHTML = "<p>No hay hábitos todavía.</p>";
    return;
  }

  state.habits.forEach(habit => {
    const div = document.createElement("div");
    div.className = "item";

    // Comprobamos si el hábito ya fue completado hoy
    const completedToday = habit.lastCompleted === getTodayString();

    div.innerHTML = `
      <div class="item-top">
        <div>
          <div class="item-title">${habit.title}</div>
          <div class="item-meta">
            Dificultad: ${difficultyLabel(habit.difficulty)} | Recompensa: ${habit.xpReward} XP | Categoría: ${CATEGORIES[habit.category] || habit.category}
          </div>
          <div class="item-meta">
            Racha actual: ${habit.streak} | Mejor racha: ${habit.bestStreak}
          </div>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-habit" ${completedToday ? "disabled" : ""}>
          ${completedToday ? "Hecho hoy" : "Marcar hoy"}
        </button>
        <button class="btn-delete">Eliminar</button>
      </div>
    `;

    const completeBtn = div.querySelector(".btn-habit");
    const deleteBtn = div.querySelector(".btn-delete");

    completeBtn.addEventListener("click", () => completeHabit(habit.id));
    deleteBtn.addEventListener("click", () => deleteHabit(habit.id));

    habitList.appendChild(div);
  });
}

function renderStats() {
  const habits = state.habits;

  // Las estadísticas avanzadas están bloqueadas hasta nivel 2
  if (state.user.level < 2) {
    avgStreakText.textContent = "Bloqueado";
    bestHabitText.textContent = "Bloqueado";
    return;
  }

  if (habits.length === 0) {
    avgStreakText.textContent = "0";
    bestHabitText.textContent = "Ninguno";
    return;
  }

  // .reduce() recorre el array acumulando un valor.
  // Empieza con 0 (el segundo argumento) y va sumando el streak de cada hábito.
  const totalStreak = habits.reduce((acc, habit) => acc + habit.streak, 0);
  // acc = acumulador (empieza en 0), habit = elemento actual del array

  const avgStreak = (totalStreak / habits.length).toFixed(1);
  // .toFixed(1) redondea a 1 decimal → "3.7" en vez de "3.666666..."

  // Buscamos el hábito con la mejor racha histórica
  let bestHabit = habits[0]; // Empezamos asumiendo que el primero es el mejor
  for (let i = 1; i < habits.length; i++) {
    // Recorremos el resto del array comparando rachas
    if (habits[i].bestStreak > bestHabit.bestStreak) {
      bestHabit = habits[i]; // Actualizamos si encontramos uno mejor
    }
  }

  avgStreakText.textContent = avgStreak;
  bestHabitText.textContent = bestHabit.title;
}


// Edición del nombre del jugador
// Se registra al final para asegurar que todo el DOM está listo
editNameBtn.addEventListener("click", function () {
  const newName = prompt("Introduce tu nombre:", state.user.name);
  if (newName && newName.trim()) {
    state.user.name = newName.trim();
    saveState();
    render();
  }
});

// ===============================
// MODAL DE ACTUALIZACIÓN
// ===============================
// Este código muestra un modal con las novedades cada vez que se actualiza la app.
function checkUpdateModal() {
  // Leemos la última versión que el usuario ya vio
  const seenVersion = localStorage.getItem("levelup_seen_version");

  // Si ya vio esta versión, no hacemos nada
  if (seenVersion === APP_VERSION) return;

  // Inyectamos el contenido del mensaje
  const notes = document.getElementById("updateNotes");
  if (notes) notes.innerHTML = UPDATE_NOTES;
  
  // Mostramos el modal
  const overlay = document.getElementById("updateOverlay");
  if (overlay) overlay.style.display = "flex";
}

function closeUpdateModal() {
  // Guardamos la versión actual para no volver a mostrarla
  localStorage.setItem("levelup_seen_version", APP_VERSION);

  const overlay = document.getElementById("updateOverlay");
  if (overlay) overlay.style.display = "none";
}

// ===============================
// INICIO DE LA APLICACIÓN
// ===============================
// Este código se ejecuta UNA SOLA VEZ cuando la página carga.
// Aplica el tema según el nivel guardado y pinta la interfaz inicial.

applyThemeByLevel();
render();
checkUpdateModal(); // Comprueba si hay que mostrar el modal de actualización al cargar la app