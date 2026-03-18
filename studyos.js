// ================================
// STUDYOS - Lógica principal
// ================================

// ================================
// ASIGNATURAS
// ================================

let asignaturas = JSON.parse(localStorage.getItem('asignaturas')) || [];

function saveAsignaturas() {
  localStorage.setItem('asignaturas', JSON.stringify(asignaturas));
}

function guardarEstadoUI() {
  const abiertos = [];
  document.querySelectorAll('.asig-accordion-body').forEach((body, i) => {
    if (body.classList.contains('open')) abiertos.push(i);
  });
  const detailsAbiertos = [];
  document.querySelectorAll('details').forEach((d, i) => {
    if (d.open) detailsAbiertos.push(i);
  });
  return { abiertos, detailsAbiertos };
}

function restaurarEstadoUI({ abiertos, detailsAbiertos }) {
  abiertos.forEach(i => {
    const b = document.getElementById(`body-${i}`);
    const a = document.getElementById(`arrow-${i}`);
    if (b) b.classList.add('open');
    if (a) a.classList.add('open');
  });
  document.querySelectorAll('details').forEach((d, i) => {
    if (detailsAbiertos.includes(i)) d.open = true;
  });
}

function renderAsignaturas() {
  const list = document.getElementById('asignaturas-list');
  list.innerHTML = '';

  if (asignaturas.length === 0) {
    list.innerHTML = '<p style="color:var(--muted);font-size:0.9rem">No hay asignaturas todavía.</p>';
    return;
  }

  asignaturas.forEach((asig, asigIndex) => {
    const tareas = (studyTasks || []).filter(t => t.subject === asig.nombre && !t.temaId);
    const pendientes = tareas.filter(t => !t.done).length;
    const temas = asig.temas || [];
    const pct = asig.progreso || 0;

    const div = document.createElement('div');
    div.className = 'asig-accordion';
    div.innerHTML = `
      <div class="asig-accordion-header" onclick="toggleAccordion(${asigIndex})">
        <span class="asig-accordion-title">${asig.nombre}</span>
        <div class="asig-accordion-meta">
          ${pendientes > 0 ? `<span class="asig-badge">${pendientes} pendientes</span>` : ''}
          <div class="asig-mini-bar">
            <div class="asig-mini-fill" style="width:${pct}%"></div>
          </div>
          <span style="color:var(--accent);font-size:0.8rem;min-width:32px;text-align:right">${pct}%</span>
        </div>
        <button class="btn-delete-asig" onclick="event.stopPropagation();deleteAsignatura(${asigIndex})">✕</button>
        <span class="asig-accordion-arrow" id="arrow-${asigIndex}">▼</span>
      </div>

      <div class="asig-accordion-body" id="body-${asigIndex}">

        <!-- TEMAS -->
        <div class="asig-section-label" style="margin-top:16px">
          📖 Temas
          <button class="asig-add-btn" onclick="showAddTema(${asigIndex})">+ Añadir tema</button>
        </div>
        <div id="add-tema-form-${asigIndex}" style="display:none" class="asig-form-inline">
          <input type="text" id="tema-input-${asigIndex}" placeholder="Nombre del tema..." />
          <button class="btn-complete" style="padding:8px 14px;font-size:0.85rem"
            onclick="addTema(${asigIndex})">Añadir</button>
        </div>
        <div id="temas-list-${asigIndex}">
          ${renderTemasHTML(asigIndex)}
        </div>

        <!-- TAREAS SUELTAS -->
        <div class="asig-section-label" style="margin-top:16px">
          ✅ Tareas generales
          <button class="asig-add-btn" onclick="showAddTarea(${asigIndex})">+ Añadir</button>
        </div>
        <div id="add-tarea-form-${asigIndex}" style="display:none" class="asig-form-inline">
          <input type="text" id="tarea-input-${asigIndex}" placeholder="Nueva tarea..." />
          <input type="date" id="tarea-date-${asigIndex}" style="max-width:130px" />
          <button class="btn-complete" style="padding:8px 14px;font-size:0.85rem"
            onclick="addTareaAsig(${asigIndex})">Añadir</button>
        </div>
        <div id="tareas-asig-${asigIndex}">
          ${renderTareasAsigHTML(asigIndex)}
        </div>

      </div>
    `;
    list.appendChild(div);
  });

  renderStudyTasks();
}

function renderTemasHTML(asigIndex) {
  const temas = asignaturas[asigIndex].temas || [];
  if (temas.length === 0) return '<p style="font-size:0.85rem;color:var(--muted);margin:6px 0">Sin temas todavía.</p>';

  return temas.map((tema, temaIndex) => {
    const estadoInfo = getTemaEstadoInfo(tema.estado || 'none');
    const tareasTema = (studyTasks || []).filter(t => t.subject === asignaturas[asigIndex].nombre && t.temaId === temaIndex);
    const pendientesTema = tareasTema.filter(t => !t.done).length;

    return `
      <div class="tema-row">
        <button class="tema-estado-btn" onclick="cycleTemaEstado(${asigIndex}, ${temaIndex})"
          title="Cambiar estado">${estadoInfo.icon}</button>
        <div class="tema-info">
          <span class="tema-nombre">${tema.nombre}</span>
          ${pendientesTema > 0 ? `<span class="tema-badge">${pendientesTema} tareas</span>` : ''}
        </div>
        <span class="tema-estado-label ${estadoInfo.cls}">${estadoInfo.label}</span>
        <button class="asig-add-btn" onclick="showAddTareaTema(${asigIndex}, ${temaIndex})">+ Tarea</button>
        <button class="asig-add-btn" onclick="showNotaTema(${asigIndex}, ${temaIndex})">📝</button>
        <button class="btn-delete-asig" onclick="deleteTema(${asigIndex}, ${temaIndex})">✕</button>
      </div>
      <div id="nota-tema-form-${asigIndex}-${temaIndex}" style="display:none;padding:6px 0 6px 28px">
        <textarea class="asig-notes" style="min-height:60px"
          placeholder="Notas del tema..."
          onchange="saveNotaTema(${asigIndex}, ${temaIndex}, this.value)">${tema.notas || ''}</textarea>
      </div>
      <div id="add-tarea-tema-form-${asigIndex}-${temaIndex}" style="display:none" class="asig-form-inline" style="margin-left:32px">
      <input type="text" id="tarea-tema-input-${asigIndex}-${temaIndex}" placeholder="Nueva tarea del tema..." />
        <input type="date" id="tarea-tema-date-${asigIndex}-${temaIndex}" style="max-width:130px" />
        <button class="btn-complete" style="padding:8px 14px;font-size:0.85rem"
          onclick="addTareaTema(${asigIndex}, ${temaIndex})">Añadir</button>
      </div>
      <div id="tareas-tema-${asigIndex}-${temaIndex}">
        ${renderTareasTemaHTML(asigIndex, temaIndex)}
      </div>
    `;
  }).join('');
}

function renderTareasTemaHTML(asigIndex, temaIndex) {
  const todas = (studyTasks || []).filter(
    t => t.subject === asignaturas[asigIndex].nombre && t.temaId === temaIndex
  );
  const pendientes = todas.filter(t => !t.done);
  const completadas = todas.filter(t => t.done);

  if (todas.length === 0) return '';

  let html = '';

  pendientes.forEach(t => {
    const gi = studyTasks.indexOf(t);
    const days = getDaysLeft(t.dueDate);
    const { dateLabel, dateClass } = formatDate(days);
    html += `
      <div class="asig-task-item">
        <input type="checkbox" onchange="toggleStudyTask(${gi})"
          style="accent-color:var(--accent);cursor:pointer">
        <span style="flex:1;font-size:0.85rem">${t.title}</span>
        ${dateLabel ? `<span class="asig-task-date ${dateClass}">📅 ${dateLabel}</span>` : ''}
        <button class="asig-add-btn" onclick="showNotaTarea(${gi})" title="Notas">📝</button>
        <button class="btn-delete" style="padding:4px 8px;font-size:0.75rem"
          onclick="deleteStudyTask(${gi})">🗑️</button>
      </div>
      <div id="nota-tarea-${gi}" style="display:${t.notas ? 'block' : 'none'};padding:4px 0 4px 4px">
        <textarea class="asig-notes" style="min-height:50px"
          placeholder="Notas de la tarea..."
          onchange="saveNotaTarea(${gi}, this.value)">${t.notas || ''}</textarea>
      </div>
    `;
  });

  if (completadas.length > 0) {
    html += `
      <details style="margin-top:4px;margin-left:28px">
        <summary style="font-size:0.8rem;color:var(--muted);cursor:pointer;user-select:none;padding:4px 0">
          Completadas (${completadas.length})
        </summary>
        <div style="margin-top:4px">
          ${completadas.map(t => {
            const gi = studyTasks.indexOf(t);
            return `
              <div class="asig-task-item done-task">
                <input type="checkbox" checked onchange="toggleStudyTask(${gi})"
                  style="accent-color:var(--accent);cursor:pointer">
                <span style="flex:1;font-size:0.85rem;text-decoration:line-through;opacity:0.5">${t.title}</span>
                <button class="btn-delete" style="padding:4px 8px;font-size:0.75rem"
                  onclick="deleteStudyTask(${gi})">🗑️</button>
              </div>
            `;
          }).join('')}
        </div>
      </details>
    `;
  }

  return html;
}

function renderTareasAsigHTML(asigIndex) {
  const todas = (studyTasks || []).filter(
    t => t.subject === asignaturas[asigIndex].nombre && !t.temaId && t.temaId !== 0
  );
  const pendientes = todas.filter(t => !t.done);
  const completadas = todas.filter(t => t.done);

  let html = '';

  if (pendientes.length === 0 && completadas.length === 0) {
    return '<p style="font-size:0.85rem;color:var(--muted);margin:6px 0">Sin tareas generales.</p>';
  }

  pendientes.forEach(t => {
    const gi = studyTasks.indexOf(t);
    const days = getDaysLeft(t.dueDate);
    const { dateLabel, dateClass } = formatDate(days);
    html += `
      <div class="asig-task-item">
        <input type="checkbox" onchange="toggleStudyTask(${gi})"
          style="accent-color:var(--accent);cursor:pointer">
        <span style="flex:1;font-size:0.85rem">${t.title}</span>
        ${dateLabel ? `<span class="asig-task-date ${dateClass}">📅 ${dateLabel}</span>` : ''}
        <button class="asig-add-btn" onclick="showNotaTarea(${gi})" title="Notas">📝</button>
        <button class="btn-delete" style="padding:4px 8px;font-size:0.75rem"
          onclick="deleteStudyTask(${gi})">🗑️</button>
      </div>
      <div id="nota-tarea-${gi}" style="display:${t.notas ? 'block' : 'none'};padding:4px 0 4px 4px">
        <textarea class="asig-notes" style="min-height:50px"
          placeholder="Notas de la tarea..."
          onchange="saveNotaTarea(${gi}, this.value)">${t.notas || ''}</textarea>
      </div>
    `;
  });

  if (completadas.length > 0) {
    html += `
      <details style="margin-top:8px">
        <summary style="font-size:0.8rem;color:var(--muted);cursor:pointer;user-select:none;padding:4px 0">
          Completadas (${completadas.length})
        </summary>
        <div style="margin-top:6px">
          ${completadas.map(t => {
            const gi = studyTasks.indexOf(t);
            return `
              <div class="asig-task-item done-task">
                <input type="checkbox" checked onchange="toggleStudyTask(${gi})"
                  style="accent-color:var(--accent);cursor:pointer">
                <span style="flex:1;font-size:0.85rem;text-decoration:line-through;opacity:0.5">${t.title}</span>
                <button class="btn-delete" style="padding:4px 8px;font-size:0.75rem"
                  onclick="deleteStudyTask(${gi})">🗑️</button>
              </div>
            `;
          }).join('')}
        </div>
      </details>
    `;
  }

  return html;
}

function getTemaEstadoInfo(estado) {
  const map = {
    none:     { icon: '⚪', label: 'No empezado', cls: 'estado-none' },
    leyendo:  { icon: '📖', label: 'Leyendo',     cls: 'estado-leyendo' },
    repasar:  { icon: '🔄', label: 'Repasar',     cls: 'estado-repasar' },
    sabido:   { icon: '✅', label: 'Me lo sé',    cls: 'estado-sabido' },
  };
  return map[estado] || map['none'];
}

function cycleTemaEstado(asigIndex, temaIndex) {
  const orden = ['none', 'leyendo', 'repasar', 'sabido'];
  const actual = asignaturas[asigIndex].temas[temaIndex].estado || 'none';
  const siguiente = orden[(orden.indexOf(actual) + 1) % orden.length];
  asignaturas[asigIndex].temas[temaIndex].estado = siguiente;
  saveAsignaturas();
  recalcularProgreso();
  const wasOpen = document.getElementById(`body-${asigIndex}`).classList.contains('open');
  renderAsignaturas();
  if (wasOpen) {
    document.getElementById(`body-${asigIndex}`).classList.add('open');
    document.getElementById(`arrow-${asigIndex}`).classList.add('open');
  }
}

function showAddTema(asigIndex) {
  const form = document.getElementById(`add-tema-form-${asigIndex}`);
  form.style.display = form.style.display === 'none' ? 'flex' : 'none';
  if (form.style.display === 'flex') document.getElementById(`tema-input-${asigIndex}`).focus();
}

function addTema(asigIndex) {
  const input = document.getElementById(`tema-input-${asigIndex}`);
  const nombre = input.value.trim();
  if (!nombre) return;
  if (!asignaturas[asigIndex].temas) asignaturas[asigIndex].temas = [];
  asignaturas[asigIndex].temas.push({ nombre, estado: 'none', notas: '' });
  saveAsignaturas();
  recalcularProgreso();
  const wasOpen = true;
  renderAsignaturas();
  document.getElementById(`body-${asigIndex}`).classList.add('open');
  document.getElementById(`arrow-${asigIndex}`).classList.add('open');
}

function deleteTema(asigIndex, temaIndex) {
  if (!confirm('¿Eliminar este tema y sus tareas?')) return;
  asignaturas[asigIndex].temas.splice(temaIndex, 1);
  studyTasks = studyTasks.filter(t => !(t.subject === asignaturas[asigIndex].nombre && t.temaId === temaIndex));
  saveAsignaturas();
  saveStudyTasks();
  recalcularProgreso();
  renderAsignaturas();
  document.getElementById(`body-${asigIndex}`).classList.add('open');
  document.getElementById(`arrow-${asigIndex}`).classList.add('open');
}

function showAddTarea(asigIndex) {
  const form = document.getElementById(`add-tarea-form-${asigIndex}`);
  form.style.display = form.style.display === 'none' ? 'flex' : 'none';
  if (form.style.display === 'flex') document.getElementById(`tarea-input-${asigIndex}`).focus();
}

function showAddTareaTema(asigIndex, temaIndex) {
  const form = document.getElementById(`add-tarea-tema-form-${asigIndex}-${temaIndex}`);
  form.style.display = form.style.display === 'none' ? 'flex' : 'none';
  if (form.style.display === 'flex') document.getElementById(`tarea-tema-input-${asigIndex}-${temaIndex}`).focus();
}

function addTareaAsig(asigIndex) {
  const input = document.getElementById(`tarea-input-${asigIndex}`);
  const dateInput = document.getElementById(`tarea-date-${asigIndex}`);
  const title = input.value.trim();
  if (!title) return;
  studyTasks.push({
    title,
    subject: asignaturas[asigIndex].nombre,
    done: false,
    dueDate: dateInput.value || null,
    temaId: null
  });
  saveStudyTasks();
  recalcularProgreso();
  renderAsignaturas();
  document.getElementById(`body-${asigIndex}`).classList.add('open');
  document.getElementById(`arrow-${asigIndex}`).classList.add('open');
}

function addTareaTema(asigIndex, temaIndex) {
  const input = document.getElementById(`tarea-tema-input-${asigIndex}-${temaIndex}`);
  const dateInput = document.getElementById(`tarea-tema-date-${asigIndex}-${temaIndex}`);
  const title = input.value.trim();
  if (!title) return;
  studyTasks.push({
    title,
    subject: asignaturas[asigIndex].nombre,
    done: false,
    dueDate: dateInput.value || null,
    temaId: temaIndex
  });
  saveStudyTasks();
  recalcularProgreso();
  renderAsignaturas();
  document.getElementById(`body-${asigIndex}`).classList.add('open');
  document.getElementById(`arrow-${asigIndex}`).classList.add('open');
}

function toggleAccordion(index) {
  const body = document.getElementById(`body-${index}`);
  const arrow = document.getElementById(`arrow-${index}`);
  body.classList.toggle('open');
  arrow.classList.toggle('open');
}

function saveNota(asigIndex, value) {
  asignaturas[asigIndex].notas = value;
  saveAsignaturas();
}

function deleteAsignatura(index) {
  if (!confirm(`¿Eliminar "${asignaturas[index].nombre}" y todas sus tareas?`)) return;
  const nombre = asignaturas[index].nombre;
  asignaturas.splice(index, 1);
  studyTasks = studyTasks.filter(t => t.subject !== nombre);
  saveAsignaturas();
  saveStudyTasks();
  renderAsignaturas();
}

document.getElementById('asignaturaForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = document.getElementById('asignaturaName').value.trim();
  if (!nombre) return;
  asignaturas.push({ nombre, progreso: 0, temas: [], notas: '' });
  saveAsignaturas();
  renderAsignaturas();
  this.reset();
});


// ================================
// TAREAS DE ESTUDIO
// ================================

let studyTasks = JSON.parse(localStorage.getItem('studyTasks')) || [];

function saveStudyTasks() {
  localStorage.setItem('studyTasks', JSON.stringify(studyTasks));
}

function renderStudyTasks() {
  // Esta función ya no renderiza nada propio,
  // todo se muestra dentro de renderAsignaturas
}

function getDaysLeft(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + 'T00:00:00');
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

function formatDate(days) {
  if (days === null) return { dateLabel: '', dateClass: '' };
  if (days < 0)  return { dateLabel: 'Vencida', dateClass: 'vencida' };
  if (days === 0) return { dateLabel: '¡Hoy!',  dateClass: 'urgente' };
  if (days <= 3)  return { dateLabel: `${days}d`, dateClass: 'urgente' };
  return { dateLabel: `${days}d`, dateClass: '' };
}

function toggleStudyTask(index) {
  studyTasks[index].done = !studyTasks[index].done;
  saveStudyTasks();
  recalcularProgreso();
  const estado = guardarEstadoUI();
  renderAsignaturas();
  restaurarEstadoUI(estado);
}

function deleteStudyTask(index) {
  studyTasks.splice(index, 1);
  saveStudyTasks();
  recalcularProgreso();
  const estado = guardarEstadoUI();
  renderAsignaturas();
  restaurarEstadoUI(estado);
}

function recalcularProgreso() {
  asignaturas.forEach((asig, i) => {
    const temas = asig.temas || [];
    const tareas = studyTasks.filter(t => t.subject === asig.nombre);

    // 70% temas dominados
    let pctTemas = 0;
    if (temas.length > 0) {
      const sabidos = temas.filter(t => t.estado === 'sabido').length;
      pctTemas = (sabidos / temas.length) * 100;
    }

    // 30% tareas completadas
    let pctTareas = 0;
    if (tareas.length > 0) {
      const completadas = tareas.filter(t => t.done).length;
      pctTareas = (completadas / tareas.length) * 100;
    }

    // Si no hay temas, el 100% lo llevan las tareas y viceversa
    if (temas.length === 0 && tareas.length === 0) {
      asignaturas[i].progreso = 0;
    } else if (temas.length === 0) {
      asignaturas[i].progreso = Math.round(pctTareas);
    } else if (tareas.length === 0) {
      asignaturas[i].progreso = Math.round(pctTemas);
    } else {
      asignaturas[i].progreso = Math.round(pctTemas * 0.7 + pctTareas * 0.3);
    }
  });
  saveAsignaturas();
}

function showNotaTema(asigIndex, temaIndex) {
  const el = document.getElementById(`nota-tema-form-${asigIndex}-${temaIndex}`);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function saveNotaTema(asigIndex, temaIndex, value) {
  asignaturas[asigIndex].temas[temaIndex].notas = value;
  saveAsignaturas();
}

function showNotaTarea(gi) {
  const el = document.getElementById(`nota-tarea-${gi}`);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function saveNotaTarea(gi, value) {
  studyTasks[gi].notas = value;
  saveStudyTasks();
}

// ================================
// POMODORO
// ================================

let pomodoroInterval = null;
let pomodoroWorking = true;
let pomodoroSeconds = 25 * 60;
let pomodoroTotal = 25 * 60;

const CIRCUMFERENCE = 2 * Math.PI * 54;
document.getElementById('ringProgress').style.strokeDasharray = CIRCUMFERENCE;
document.getElementById('ringProgress').style.strokeDashoffset = 0;

function updatePomodoroDisplay() {
  const min = String(Math.floor(pomodoroSeconds / 60)).padStart(2, '0');
  const sec = String(pomodoroSeconds % 60).padStart(2, '0');
  document.getElementById('pomodoroDisplay').textContent = `${min}:${sec}`;
  const progress = pomodoroSeconds / pomodoroTotal;
  const offset = CIRCUMFERENCE * (1 - progress);
  document.getElementById('ringProgress').style.strokeDashoffset = offset;
  const ring = document.getElementById('ringProgress');
  const style = getComputedStyle(document.documentElement);
  ring.style.stroke = pomodoroWorking
    ? style.getPropertyValue('--accent').trim()
    : style.getPropertyValue('--accent-2').trim();
}

function updatePomodoroButtons(state) {
  const btns = document.querySelectorAll('.pomodoro-btns button');
  btns[0].classList.remove('btn-active-start');
  btns[1].classList.remove('btn-active-pause');
  if (state === 'running') btns[0].classList.add('btn-active-start');
  else if (state === 'paused') btns[1].classList.add('btn-active-pause');
}

function startPomodoro() {
  if (pomodoroInterval) return;
  updatePomodoroButtons('running');
  pomodoroInterval = setInterval(() => {
    pomodoroSeconds--;
    updatePomodoroDisplay();
    if (pomodoroSeconds <= 0) {
      clearInterval(pomodoroInterval);
      pomodoroInterval = null;
      pomodoroWorking = !pomodoroWorking;
      const workMin = parseInt(document.getElementById('workMinutes').value) || 25;
      const breakMin = parseInt(document.getElementById('breakMinutes').value) || 5;
      pomodoroTotal = pomodoroWorking ? workMin * 60 : breakMin * 60;
      pomodoroSeconds = pomodoroTotal;
      document.getElementById('pomodoroStatus').textContent = pomodoroWorking ? 'Trabajo' : '☕ Descanso';
      updatePomodoroDisplay();
      startPomodoro();
    }
  }, 1000);
}

function pausePomodoro() {
  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
  updatePomodoroButtons('paused');
}

function resetPomodoro() {
  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
  pomodoroWorking = true;
  const workMin = parseInt(document.getElementById('workMinutes').value) || 25;
  pomodoroTotal = workMin * 60;
  pomodoroSeconds = pomodoroTotal;
  document.getElementById('pomodoroStatus').textContent = 'Trabajo';
  updatePomodoroDisplay();
  updatePomodoroButtons('stopped');
}

document.getElementById('workMinutes').addEventListener('change', resetPomodoro);
document.getElementById('breakMinutes').addEventListener('change', resetPomodoro);


// ================================
// EXÁMENES
// ================================

let exams = JSON.parse(localStorage.getItem('exams')) || [];

function renderExams() {
  const examList = document.getElementById('examList');
  examList.innerHTML = '';
  const today = new Date();

  if (exams.length === 0) {
    examList.innerHTML = '<p>No hay exámenes registrados todavía.</p>';
    return;
  }

  exams
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((exam, index) => {
      const examDate = new Date(exam.date + 'T00:00:00');
      const diff = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
      const pasado = diff < 0;
      const urgente = diff <= 7 && diff >= 0;

      // Temas de la asignatura del examen
      const asig = asignaturas.find(a => a.nombre === exam.subject);
      const temas = asig ? (asig.temas || []) : [];
      const temasHTML = temas.length > 0 ? `
        <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px">
          ${temas.map(t => {
            const info = getTemaEstadoInfo(t.estado || 'none');
            return `<span class="tema-chip ${info.cls}">${info.icon} ${t.nombre}</span>`;
          }).join('')}
        </div>
      ` : '';

      const div = document.createElement('div');
      div.className = 'item' + (urgente ? ' task-urgent' : '') + (pasado ? ' task-expired' : '');
      div.innerHTML = `
        <div class="item-top">
          <div style="width:100%">
            <div class="item-title">${pasado ? '✅' : urgente ? '🔴' : '📅'} ${exam.subject}</div>
            <div class="item-meta">Fecha: ${exam.date}</div>
            <div class="item-meta ${pasado ? 'due-date-expired' : urgente ? 'due-date-urgent' : 'due-date'}">
              ${pasado ? 'Ya pasó' : diff === 0 ? '¡Hoy!' : `En ${diff} días`}
            </div>
            ${temasHTML}
          </div>
        </div>
        <div class="item-actions">
          <button class="btn-delete">Eliminar</button>
        </div>
      `;
      div.querySelector('.btn-delete').addEventListener('click', () => deleteExam(index));
      examList.appendChild(div);
    });
}

document.getElementById('examForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const subject = document.getElementById('examSubject').value.trim();
  const date = document.getElementById('examDate').value;
  if (!subject || !date) return;
  exams.push({ subject, date });
  localStorage.setItem('exams', JSON.stringify(exams));
  renderExams();
  this.reset();
});

function deleteExam(index) {
  exams.splice(index, 1);
  localStorage.setItem('exams', JSON.stringify(exams));
  renderExams();
}


// ================================
// MODAL DE ACTUALIZACIONES STUDYOS
// ================================

const STUDYOS_VERSION = '1.1';

const studyosUpdates = {
  '1.1': {
    title: 'StudyOS v1.1 — Primera versión completa',
    changes: [
      'Asignaturas: puedes crear todas las asignaturas que necesites y eliminarlas cuando quieras. Cada una muestra su progreso y el número de tareas pendientes sin necesidad de abrirla.',
      'Temas por asignatura: dentro de cada asignatura puedes organizar el contenido en temas. Cada tema tiene un estado que puedes cambiar con un clic: No empezado, Leyendo, Repasar o Me lo sé.',
      'Progreso automático: el progreso de cada asignatura se calcula solo. El 70% depende de cuántos temas tienes en estado "Me lo sé" y el 30% restante de las tareas completadas.',
      'Tareas por tema y por asignatura: puedes añadir tareas dentro de un tema concreto o sueltas en la asignatura. Todas admiten fecha límite opcional. Las tareas urgentes se resaltan en naranja y las vencidas en rojo.',
      'Tareas completadas: al marcar una tarea como hecha desaparece de la lista principal y pasa a un desplegable de completadas dentro de cada asignatura, siguiendo la misma lógica que el resto de la app.',
      'Notas: puedes añadir notas independientes a cualquier tarea o tema pulsando el icono de nota. Las notas se guardan automáticamente mientras escribes.',
      'Exámenes: puedes registrar exámenes con fecha y asignatura. Al ver un examen, aparece automáticamente el estado de cada tema de esa asignatura para saber de un vistazo qué tienes preparado y qué no.',
      'Pomodoro: temporizador en formato circular con tiempo de trabajo y descanso configurables a tu gusto. El color del anillo cambia entre sesión de trabajo y descanso, y sigue el tema visual elegido en ajustes.',
      'Temas visuales: todos los colores de StudyOS, barras de progreso, botones, anillo del pomodoro y porcentajes, cambian automáticamente al cambiar el tema desde el panel de ajustes.',
      'Guardado automático: todos los datos, asignaturas, temas, tareas, notas y exámenes, se guardan en el navegador y permanecen aunque cierres o recargues la aplicación.',
      'Cualquier mejora o corrección que se te ocurra para futuras versiones, ¡soy toda oídos! Escríbeme a nuria.guerra.casal@rai.usc.es'
    ]
  }
};

function showStudyosUpdate() {
  const lastVersion = localStorage.getItem('studyosVersion');
  if (lastVersion === STUDYOS_VERSION) return;
  const update = studyosUpdates[STUDYOS_VERSION];
  if (!update) return;
  const html = `
    <h3>${update.title}</h3>
    <p style="color:var(--muted);font-size:14px">Novedades de esta versión:</p>
    <ul>${update.changes.map(c => `<li>${c}</li>`).join('')}</ul>
  `;
  document.getElementById('studyosUpdateNotes').innerHTML = html;
  document.getElementById('studyosUpdateOverlay').style.display = 'flex';
  localStorage.setItem('studyosVersion', STUDYOS_VERSION);
}

function closeStudyosUpdate() {
  document.getElementById('studyosUpdateOverlay').style.display = 'none';
}


// ================================
// INIT
// ================================

renderAsignaturas();
renderExams();
showStudyosUpdate();