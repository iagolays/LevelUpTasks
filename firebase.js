// ===============================
// FIREBASE.JS — Autenticación y sincronización en la nube
// ===============================
// Gestiona TODO lo relacionado con Firebase:
//   1. Inicializa la app de Firebase
//   2. Login / registro / logout (email+contraseña y Google)
//   3. Sube y descarga datos a Firestore:
//        · state (app principal: tareas, hábitos, tienda, XP...)
//        · studyData (StudyOS: asignaturas, tareas de estudio, exámenes)
//   4. Resuelve conflictos entre datos locales y datos de la nube
//
// COMUNICACIÓN CON app.js Y studyos.js (scripts clásicos):
//   Como este archivo es un módulo ES (import/export), no puede acceder
//   a variables de los otros scripts directamente. Lo solucionamos así:
//     · Este módulo expone funciones en window (window.openAuthModal, etc.)
//     · app.js y studyos.js exponen sus datos en window (window.getAppState, etc.)


// ---- Imports de Firebase SDK ----
import { initializeApp }
  from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";


// ---- Configuración del proyecto Firebase ----
const firebaseConfig = {
  apiKey:            "AIzaSyBRpD2R_yzvTkB9G6qgUUNWPWKVoYHd7qM",
  authDomain:        "levelup-tasks-d7013.firebaseapp.com",
  projectId:         "levelup-tasks-d7013",
  storageBucket:     "levelup-tasks-d7013.firebasestorage.app",
  messagingSenderId: "884529208466",
  appId:             "1:884529208466:web:962c7842de15102c931a4b",
  measurementId:     "G-QRNF19PZQZ"
};

// ---- Inicialización ----
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ---- Estado interno del módulo ----
// Controla si la sincronización en la nube está activa.
// Es false hasta que el usuario inicia sesión.
let syncEnabled = false;

// Cola de subidas pendientes: si llegan varias saveState() seguidas
// (por ejemplo al subir de nivel), esperamos 1,5 s antes de subir
// para no saturar Firestore con llamadas innecesarias.
let uploadTimer = null;
const UPLOAD_DEBOUNCE_MS = 1500;


// ===============================
// SECCIÓN 1: FIRESTORE — SUBIDA Y BAJADA DE DATOS
// ===============================
// En Firestore guardamos UN documento por usuario, con esta estructura:
//
//   users/{uid}/
//     appState:  string (JSON del state de app.js)
//     studyData: string (JSON de asignaturas + studyTasks + exams)
//     updatedAt: Timestamp (para saber qué copia es más reciente)

/**
 * Sube datos a Firestore CON debounce (1.5s).
 * Se usa en el guardado normal (completar tareas, hábitos, etc.)
 * para evitar saturar Firestore con escrituras continuas.
 *
 * type === "appState"  → data es el state de app.js
 * type === "studyData" → data es { asignaturas, studyTasks, exams }
 */
async function uploadState({ type, data }) {
  if (!syncEnabled) return;

  const user = auth.currentUser;
  if (!user) return;

  // Cancelamos el timer anterior y arrancamos uno nuevo (debounce)
  clearTimeout(uploadTimer);
  uploadTimer = setTimeout(async () => {
    try {
      setSyncIndicator("syncing");

      const userDoc = doc(db, "users", user.uid);
      const payload = { updatedAt: serverTimestamp() };

      if (type === "appState") {
        payload.appState = JSON.stringify(data);
      } else if (type === "studyData") {
        payload.studyData = JSON.stringify(data);
      }

      // merge:true → no borramos el otro campo al actualizar solo uno
      await setDoc(userDoc, payload, { merge: true });

      setSyncIndicator("synced");

    } catch (err) {
      console.error("[Firebase] Error al subir datos:", err);
      setSyncIndicator("error");
    }
  }, UPLOAD_DEBOUNCE_MS);
}

/**
 * Sube datos a Firestore SIN debounce, de forma inmediata.
 * Se usa en situaciones urgentes donde los datos deben llegar
 * a la nube garantizadamente: primer login, elección de conflicto, etc.
 * Al ser async/await, la llamada no termina hasta que Firestore confirma.
 */
async function uploadStateNow({ type, data }) {
  if (!syncEnabled) return;

  const user = auth.currentUser;
  if (!user) return;

  try {
    setSyncIndicator("syncing");

    const userDoc = doc(db, "users", user.uid);
    const payload = { updatedAt: serverTimestamp() };

    if (type === "appState") {
      payload.appState = JSON.stringify(data);
    } else if (type === "studyData") {
      payload.studyData = JSON.stringify(data);
    }

    // merge:true → no borramos el otro campo al actualizar solo uno
    await setDoc(userDoc, payload, { merge: true });

    setSyncIndicator("synced");

  } catch (err) {
    console.error("[Firebase] Error al subir datos (urgente):", err);
    setSyncIndicator("error");
  }
}

/**
 * Descarga el documento del usuario desde Firestore y devuelve
 * un objeto { appState, studyData } con los datos ya parseados.
 * Devuelve null si el usuario no tiene datos en la nube todavía.
 */
async function downloadAllDataFromCloud() {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const snapshot = await getDoc(doc(db, "users", user.uid));

    if (!snapshot.exists()) return null;

    const raw = snapshot.data();
    return {
      appState:  raw.appState  ? JSON.parse(raw.appState)  : null,
      studyData: raw.studyData ? JSON.parse(raw.studyData) : null
    };

  } catch (err) {
    console.error("[Firebase] Error al descargar datos:", err);
    return null;
  }
}


// ===============================
// SECCIÓN 2: UI DEL MODAL DE AUTENTICACIÓN
// ===============================

/** Abre el modal de autenticación mostrando la pestaña indicada */
function openAuthModal(tab = "login") {
  const overlay = document.getElementById("authOverlay");
  if (overlay) overlay.style.display = "flex";
  switchAuthTab(tab);
  clearAuthError();
}

/** Cierra el modal de autenticación */
function closeAuthModal() {
  const overlay = document.getElementById("authOverlay");
  if (overlay) overlay.style.display = "none";
  clearAuthError();
}

/** Cambia entre las pestañas Login / Registro */
function switchAuthTab(tab) {
  const loginTab     = document.getElementById("authTabLogin");
  const registerTab  = document.getElementById("authTabRegister");
  const loginForm    = document.getElementById("authLoginForm");
  const registerForm = document.getElementById("authRegisterForm");
  if (!loginTab) return;

  if (tab === "login") {
    loginTab.classList.add("auth-tab-active");
    registerTab.classList.remove("auth-tab-active");
    loginForm.style.display    = "flex";
    registerForm.style.display = "none";
  } else {
    registerTab.classList.add("auth-tab-active");
    loginTab.classList.remove("auth-tab-active");
    registerForm.style.display = "flex";
    loginForm.style.display    = "none";
  }
  clearAuthError();
}

/** Muestra un mensaje de error en el modal */
function showAuthError(msg) {
  const errEl = document.getElementById("authError");
  if (errEl) { errEl.textContent = msg; errEl.style.display = "block"; }
}

/** Limpia el mensaje de error */
function clearAuthError() {
  const errEl = document.getElementById("authError");
  if (errEl) { errEl.textContent = ""; errEl.style.display = "none"; }
}

/** Traduce los códigos de error de Firebase a mensajes en español */
function translateFirebaseError(code) {
  const map = {
    "auth/email-already-in-use":   "Este correo ya tiene una cuenta. Inicia sesión.",
    "auth/invalid-email":          "El formato del correo no es válido.",
    "auth/weak-password":          "La contraseña debe tener al menos 6 caracteres.",
    "auth/user-not-found":         "No existe ninguna cuenta con ese correo.",
    "auth/wrong-password":         "Contraseña incorrecta.",
    "auth/invalid-credential":     "Correo o contraseña incorrectos.",
    "auth/too-many-requests":      "Demasiados intentos fallidos. Espera un momento.",
    "auth/popup-closed-by-user":   "Cerraste la ventana de Google antes de terminar.",
    "auth/network-request-failed": "Sin conexión a internet. Comprueba tu red.",
  };
  return map[code] || `Error inesperado (${code}). Inténtalo de nuevo.`;
}

/** Actualiza el botón de cuenta en el navbar según el estado de sesión */
function updateAccountButton(user) {
  const btn = document.getElementById("accountBtn");
  if (!btn) return;
  if (user) {
    const name = user.displayName || user.email.split("@")[0];
    btn.textContent = `👤 ${name}`;
    btn.title = `Sesión: ${user.email} — clic para gestionar`;
  } else {
    btn.textContent = "☁️ Sincronizar";
    btn.title = "Inicia sesión para sincronizar tu progreso entre dispositivos";
  }
}

/** Actualiza el pequeño icono de estado de sincronización */
function setSyncIndicator(status) {
  const el = document.getElementById("syncIndicator");
  if (!el) return;
  if (status === "synced") {
    el.textContent = "☁️✓"; el.title = "Datos sincronizados"; el.style.color = "var(--accent)";
  } else if (status === "syncing") {
    el.textContent = "☁️…"; el.title = "Sincronizando…";     el.style.color = "var(--warning)";
  } else if (status === "error") {
    el.textContent = "☁️✕"; el.title = "Error al sincronizar. Comprueba tu conexión."; el.style.color = "var(--danger)";
  } else {
    el.textContent = ""; el.title = "";
  }
}


// ===============================
// SECCIÓN 3: RESOLUCIÓN DE CONFLICTOS
// ===============================
// Si los datos locales y los de la nube difieren al iniciar sesión,
// mostramos un modal comparativo y el usuario elige cuál conservar.

/**
 * Muestra el modal de conflicto con un resumen de ambas copias.
 * Devuelve una Promise que se resuelve con "local" o "cloud".
 */
function askConflictResolution(localCloud, cloudData) {
  return new Promise((resolve) => {
    const overlay    = document.getElementById("conflictOverlay");
    const localInfo  = document.getElementById("conflictLocalInfo");
    const cloudInfo  = document.getElementById("conflictCloudInfo");

    // Extraemos datos de resumen de la app principal
    const la = localCloud.appState;
    const ca = cloudData.appState;
    // Extraemos datos de resumen de StudyOS
    const ls = localCloud.studyData;
    const cs = cloudData.studyData;

    if (localInfo) localInfo.innerHTML = `
      <strong>📱 Este dispositivo</strong><br>
      Nivel: ${la?.user?.level || 1} — XP: ${la?.user?.totalXp || 0}<br>
      Tareas: ${la?.tasks?.length || 0} — Hábitos: ${la?.habits?.length || 0}<br>
      Asignaturas: ${ls?.asignaturas?.length || 0} — Exámenes: ${ls?.exams?.length || 0}
    `;
    if (cloudInfo) cloudInfo.innerHTML = `
      <strong>☁️ En la nube</strong><br>
      Nivel: ${ca?.user?.level || 1} — XP: ${ca?.user?.totalXp || 0}<br>
      Tareas: ${ca?.tasks?.length || 0} — Hábitos: ${ca?.habits?.length || 0}<br>
      Asignaturas: ${cs?.asignaturas?.length || 0} — Exámenes: ${cs?.exams?.length || 0}
    `;

    if (overlay) overlay.style.display = "flex";

    const keepLocal = document.getElementById("conflictKeepLocal");
    const keepCloud = document.getElementById("conflictKeepCloud");

    const cleanup = (choice) => {
      if (overlay) overlay.style.display = "none";
      keepLocal.removeEventListener("click", onLocal);
      keepCloud.removeEventListener("click", onCloud);
      resolve(choice);
    };
    const onLocal = () => cleanup("local");
    const onCloud = () => cleanup("cloud");

    keepLocal.addEventListener("click", onLocal);
    keepCloud.addEventListener("click", onCloud);
  });
}


// ===============================
// SECCIÓN 4: FLUJO DE LOGIN
// ===============================

/**
 * Punto central que se llama tras cualquier login exitoso.
 * Compara los datos locales con los de la nube y actúa en consecuencia.
 * Usa uploadStateNow para garantizar que la subida se completa antes
 * de que la función termine.
 */
async function handleUserLogin(user) {
  syncEnabled = true;
  updateAccountButton(user);
  setSyncIndicator("syncing");
  closeAuthModal();

  // Datos locales actuales (desde app.js y studyos.js)
  const localAppState  = window.getAppState  ? window.getAppState()  : null;
  const localStudyData = window.getStudyData ? window.getStudyData() : null;
  const localAll = { appState: localAppState, studyData: localStudyData };

  // Datos en la nube
  const cloudAll = await downloadAllDataFromCloud();

  if (!cloudAll || (!cloudAll.appState && !cloudAll.studyData)) {
    // El usuario nunca ha subido datos → subimos los locales directamente
    // Usamos uploadStateNow para garantizar que llegan a Firestore
    if (localAppState)  await uploadStateNow({ type: "appState",  data: localAppState });
    if (localStudyData) await uploadStateNow({ type: "studyData", data: localStudyData });
    setSyncIndicator("synced");
    return;
  }

  // Elegimos automáticamente los datos más recientes comparando el timestamp
  const localTs = localAll.appState?.lastModified || 0;
  const cloudTs = cloudAll.appState?.lastModified || 0;

  if (cloudTs >= localTs) {
    applyCloudData(cloudAll);
  } else {
    // Los locales son más recientes: los subimos a la nube
    if (localAppState)  await uploadStateNow({ type: "appState",  data: localAppState });
    if (localStudyData) await uploadStateNow({ type: "studyData", data: localStudyData });
  }

  setSyncIndicator("synced");
}

/**
 * Aplica los datos descargados de la nube a la app (app.js + studyos.js).
 * Solo actualiza cada parte si hay datos para ella.
 */
function applyCloudData(cloudAll) {
  if (cloudAll.appState && window.setAppState) {
    window.setAppState(cloudAll.appState);
  }
  if (cloudAll.studyData && window.setStudyData) {
    window.setStudyData(cloudAll.studyData);
  }
}

// ---- Login con email y contraseña ----
async function loginWithEmail() {
  const email    = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) { showAuthError("Rellena todos los campos."); return; }
  clearAuthError();

  const btn = document.getElementById("loginSubmitBtn");
  if (btn) btn.disabled = true;
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await handleUserLogin(cred.user);
  } catch (err) {
    showAuthError(translateFirebaseError(err.code));
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ---- Registro de cuenta nueva ----
async function registerWithEmail() {
  const email    = document.getElementById("registerEmail")?.value.trim();
  const password = document.getElementById("registerPassword")?.value;
  const confirm  = document.getElementById("registerConfirm")?.value;

  if (!email || !password || !confirm) { showAuthError("Rellena todos los campos."); return; }
  if (password !== confirm)            { showAuthError("Las contraseñas no coinciden."); return; }
  if (password.length < 6)             { showAuthError("La contraseña debe tener al menos 6 caracteres."); return; }
  clearAuthError();

  const btn = document.getElementById("registerSubmitBtn");
  if (btn) btn.disabled = true;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await handleUserLogin(cred.user);
  } catch (err) {
    showAuthError(translateFirebaseError(err.code));
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ---- Login con Google ----
async function loginWithGoogle() {
  clearAuthError();
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    await handleUserLogin(cred.user);
  } catch (err) {
    if (err.code !== "auth/popup-closed-by-user") {
      showAuthError(translateFirebaseError(err.code));
    }
  }
}

// ---- Logout ----
async function logout() {
  if (!confirm("¿Cerrar sesión? Tus datos seguirán guardados localmente en este dispositivo.")) return;
  try {
    await signOut(auth);
    // syncEnabled se pone a false en el observer onAuthStateChanged
    if (typeof window.closeAccountModal === "function") window.closeAccountModal();
  } catch (err) {
    console.error("[Firebase] Error al cerrar sesión:", err);
  }
}

// ---- Recuperar contraseña ----
async function sendPasswordReset() {
  const email = document.getElementById("loginEmail")?.value.trim();
  if (!email) { showAuthError("Escribe tu correo en el campo de email primero."); return; }
  try {
    await sendPasswordResetEmail(auth, email);
    showAuthError("✅ Correo de recuperación enviado. Revisa tu bandeja de entrada.");
  } catch (err) {
    showAuthError(translateFirebaseError(err.code));
  }
}


// ===============================
// SECCIÓN 5: OBSERVER DE SESIÓN
// ===============================
// onAuthStateChanged se ejecuta automáticamente cada vez que cambia
// el estado de autenticación: al cargar la página, al iniciar sesión
// y al cerrar sesión. Es el punto de entrada principal del módulo.

onAuthStateChanged(auth, async (user) => {
  // Exponemos el email para que app.js pueda mostrarlo en el modal de cuenta
  window._firebaseCurrentUserEmail = user ? user.email : null;

  if (user) {
    // ---- Sesión activa ----
    syncEnabled = true;
    updateAccountButton(user);
    setSyncIndicator("syncing");

    // Descargamos los datos de la nube.
    // En una recarga normal (el usuario ya tenía sesión), SIEMPRE aplicamos
    // los datos de la nube si existen. Esto es lo que permite la sincronización
    // entre dispositivos: el ordenador carga lo que guardó el móvil y viceversa.
    const cloudAll = await downloadAllDataFromCloud();
    if (cloudAll && (cloudAll.appState || cloudAll.studyData)) {
      const localXp = window.getAppState?.()?.user?.totalXp || 0;
      const cloudXp = cloudAll.appState?.user?.totalXp || 0;

      if (Math.abs(localXp - cloudXp) > 10 && localXp > 0) {
        // Los datos divergen bastante Y el dispositivo local tiene progreso propio
        // (localXp > 0 evita mostrar el modal cuando el dispositivo está vacío)
        // → preguntamos al usuario cuál prefiere conservar
        const localStudyData = window.getStudyData ? window.getStudyData() : null;
        const localAll = { appState: window.getAppState?.(), studyData: localStudyData };
        const choice = await askConflictResolution(localAll, cloudAll);
        if (choice === "cloud") {
          applyCloudData(cloudAll);
        } else {
          // Los locales son los buenos: los subimos a la nube inmediatamente
          if (window.getAppState)  await uploadStateNow({ type: "appState",  data: window.getAppState() });
          if (window.getStudyData) await uploadStateNow({ type: "studyData", data: window.getStudyData() });
        }
      } else {
        // Sin conflicto significativo O dispositivo local vacío:
        // aplicamos siempre los datos de la nube (son los más recientes y fiables)
        applyCloudData(cloudAll);
      }
    } else if (!cloudAll) {
      // No hay datos en la nube todavía: subimos los locales
      const localAppState  = window.getAppState  ? window.getAppState()  : null;
      const localStudyData = window.getStudyData ? window.getStudyData() : null;
      if (localAppState)  await uploadStateNow({ type: "appState",  data: localAppState });
      if (localStudyData) await uploadStateNow({ type: "studyData", data: localStudyData });
    }
    setSyncIndicator("synced");

  } else {
    // ---- Sin sesión ----
    syncEnabled = false;
    updateAccountButton(null);
    setSyncIndicator("");
  }
});


// ===============================
// SECCIÓN 6: EXPOSICIÓN GLOBAL
// ===============================
// Funciones que necesitan ser accesibles desde el HTML (onclick="...") o
// desde app.js / studyos.js (scripts clásicos sin import/export).

window.firebase_isSyncEnabled = () => syncEnabled;
window.firebase_uploadState   = uploadState;   // llamada desde saveState() y saveStudyData()

// Funciones del modal de auth (llamadas desde onclick en el HTML)
window.openAuthModal     = openAuthModal;
window.closeAuthModal    = closeAuthModal;
window.switchAuthTab     = switchAuthTab;
window.loginWithEmail    = loginWithEmail;
window.registerWithEmail = registerWithEmail;
window.loginWithGoogle   = loginWithGoogle;
window.logout            = logout;
window.sendPasswordReset = sendPasswordReset;