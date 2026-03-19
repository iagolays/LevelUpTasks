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

// Añade XP al perfil general de la app (el de tu compañero)
// Usa la función addXp() que está definida en app.js
function addXpGeneral(cantidad, categoria) {
  if (typeof addXp === 'function') {
    addXp(cantidad, categoria);
  }
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
          Temas
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
          Tareas generales
          <button class="asig-add-btn" onclick="showAddTarea(${asigIndex})">+ Añadir</button>
        </div>
        <div id="add-tarea-form-${asigIndex}" style="display:none" class="asig-form-inline">
          <input type="text" id="tarea-input-${asigIndex}" placeholder="Nueva tarea..." style="flex:2"/>
          <input type="date" id="tarea-date-${asigIndex}" style="max-width:130px" />
          <select id="tarea-dif-${asigIndex}" style="max-width:110px;background:var(--card-2);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:8px 10px;font-size:0.82rem">
            <option value="1">Fácil</option>
            <option value="2">Normal</option>
            <option value="3" selected>Media</option>
            <option value="4">Difícil</option>
            <option value="5">Muy difícil</option>
          </select>
          <input type="number" id="tarea-dias-${asigIndex}" placeholder="Días" min="0" max="30"
            style="width:70px;background:var(--card-2);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:8px 10px;font-size:0.82rem" title="Dividir en N días"/>
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
  renderExamSelect();
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
      <div id="add-tarea-tema-form-${asigIndex}-${temaIndex}" style="display:none" class="asig-form-inline">
        <input type="text" id="tarea-tema-input-${asigIndex}-${temaIndex}" placeholder="Nueva tarea del tema..." style="flex:2"/>
        <input type="date" id="tarea-tema-date-${asigIndex}-${temaIndex}" style="max-width:130px" />
        <select id="tarea-tema-dif-${asigIndex}-${temaIndex}"
          style="max-width:110px;background:var(--card-2);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:8px 10px;font-size:0.82rem">
          <option value="1">Fácil</option>
          <option value="2">Normal</option>
          <option value="3" selected>Media</option>
          <option value="4">Difícil</option>
          <option value="5">Muy difícil</option>
        </select>
        <input type="number" id="tarea-tema-dias-${asigIndex}-${temaIndex}" placeholder="Días" min="0" max="30"
          style="width:70px;background:var(--card-2);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:8px 10px;font-size:0.82rem"
          title="Dividir en N días"/>
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
    const estrellas = '★'.repeat(t.dificultad || 1);

    html += `
      <div class="asig-task-item">
        <input type="checkbox" onchange="toggleStudyTask(${gi})"
          style="accent-color:var(--accent);cursor:pointer">
        <span style="flex:1;font-size:0.85rem">${t.title}</span>
        <span style="font-size:0.7rem;color:var(--accent);opacity:0.8">${estrellas}</span>
        ${dateLabel ? `<span class="asig-task-date ${dateClass}">${dateLabel}</span>` : ''}
        <button class="asig-add-btn" onclick="showNotaTarea(${gi})" title="Notas">📝</button>
        <button class="btn-delete" style="padding:4px 8px;font-size:0.75rem"
          onclick="deleteStudyTask(${gi})">✕</button>
      </div>
      ${t.diasTotal > 0 ? `
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin:4px 0 6px 28px">
          ${t.diasMarcados.map((marcado, i) => `
            <div onclick="toggleCuadrado(${gi}, ${i})"
              title="Día ${i + 1}"
              style="width:16px;height:16px;border-radius:3px;cursor:pointer;
                border:1px solid var(--border);
                background:${marcado ? 'var(--accent)' : 'var(--card-2)'};
                transition:background 0.15s ease">
            </div>
          `).join('')}
        </div>
      ` : ''}
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
                  onclick="deleteStudyTask(${gi})">✕</button>
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
    const estrellas = '★'.repeat(t.dificultad || 1);

    html += `
      <div class="asig-task-item">
        <input type="checkbox" onchange="toggleStudyTask(${gi})"
          style="accent-color:var(--accent);cursor:pointer">
        <span style="flex:1;font-size:0.85rem">${t.title}</span>
        <span style="font-size:0.7rem;color:var(--accent);opacity:0.8">${estrellas}</span>
        ${dateLabel ? `<span class="asig-task-date ${dateClass}">${dateLabel}</span>` : ''}
        <button class="asig-add-btn" onclick="showNotaTarea(${gi})" title="Notas">📝</button>
        <button class="btn-delete" style="padding:4px 8px;font-size:0.75rem"
          onclick="deleteStudyTask(${gi})">✕</button>
      </div>
      ${t.diasTotal > 0 ? `
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin:4px 0 6px 28px">
          ${t.diasMarcados.map((marcado, i) => `
            <div onclick="toggleCuadrado(${gi}, ${i})"
              title="Día ${i + 1}"
              style="width:16px;height:16px;border-radius:3px;cursor:pointer;
                border:1px solid var(--border);
                background:${marcado ? 'var(--accent)' : 'var(--card-2)'};
                transition:background 0.15s ease">
            </div>
          `).join('')}
        </div>
      ` : ''}
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
                  onclick="deleteStudyTask(${gi})">✕</button>
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
    none:     { icon: '○', label: 'No empezado', cls: 'estado-none' },
    leyendo:  { icon: '◉', label: 'Leyendo',     cls: 'estado-leyendo' },
    repasar:  { icon: '◈', label: 'Repasar',     cls: 'estado-repasar' },
    sabido:   { icon: '●', label: 'Me lo sé',    cls: 'estado-sabido' },
  };
  return map[estado] || map['none'];
}
function cycleTemaEstado(asigIndex, temaIndex) {
  const orden = ['none', 'leyendo', 'repasar', 'sabido'];
  const actual = asignaturas[asigIndex].temas[temaIndex].estado || 'none';
  const siguiente = orden[(orden.indexOf(actual) + 1) % orden.length];
  asignaturas[asigIndex].temas[temaIndex].estado = siguiente;

  //Si el tema pasa a estado "sabido", añadimos XP al perfil general de la app
  if (siguiente === 'sabido' && actual !== 'sabido') {
    const nombreTema = asignaturas[asigIndex].temas[temaIndex].nombre;
    addXpGeneral(10, 'estudio');  // 10 XP por tema dominado, categoría estudio
  } else if (siguiente === 'leyendo') {
    addXpGeneral(2, 'estudio');
  } else if (siguiente === 'repasar') {
    addXpGeneral(3, 'estudio');
  }

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
  if (!form) return;
  form.style.display = form.style.display === 'none' ? 'flex' : 'none';
  if (form.style.display === 'flex') {
    const input = document.getElementById(`tema-input-${asigIndex}`);
    if (input) input.focus();
  }
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

// XP por dificultad (igual que en la app propia)
const XP_TAREA_STUDYOS = { 1: 5, 2: 10, 3: 15, 4: 25, 5: 35 };

function addTareaAsig(asigIndex) {
  const input = document.getElementById(`tarea-input-${asigIndex}`);
  const dateInput = document.getElementById(`tarea-date-${asigIndex}`);
  const difInput = document.getElementById(`tarea-dif-${asigIndex}`);
  const diasInput = document.getElementById(`tarea-dias-${asigIndex}`);
  const title = input.value.trim();
  if (!title) return;

  const dificultad = parseInt(difInput?.value) || 1;
  const dias = parseInt(diasInput?.value) || 0;

  studyTasks.push({
    title,
    subject: asignaturas[asigIndex].nombre,
    done: false,
    dueDate: dateInput.value || null,
    temaId: null,
    dificultad,
    xp: XP_TAREA_STUDYOS[dificultad] || 5,
    diasTotal: dias > 0 ? dias : 0,
    diasMarcados: dias > 0 ? new Array(dias).fill(false) : [],
    bonusCuadrados: false
  });
  saveStudyTasks();
  recalcularProgreso();
  const estado = guardarEstadoUI();
  renderAsignaturas();
  restaurarEstadoUI(estado);
  document.getElementById(`body-${asigIndex}`).classList.add('open');
  document.getElementById(`arrow-${asigIndex}`).classList.add('open');
}



function addTareaTema(asigIndex, temaIndex) {
  const input = document.getElementById(`tarea-tema-input-${asigIndex}-${temaIndex}`);
  const dateInput = document.getElementById(`tarea-tema-date-${asigIndex}-${temaIndex}`);
  const difInput = document.getElementById(`tarea-tema-dif-${asigIndex}-${temaIndex}`);
  const diasInput = document.getElementById(`tarea-tema-dias-${asigIndex}-${temaIndex}`);
  const title = input.value.trim();
  if (!title) return;

  const dificultad = parseInt(difInput?.value) || 1;
  const dias = parseInt(diasInput?.value) || 0;

  studyTasks.push({
    title,
    subject: asignaturas[asigIndex].nombre,
    done: false,
    dueDate: dateInput.value || null,
    temaId: temaIndex,
    dificultad,
    xp: XP_TAREA_STUDYOS[dificultad] || 5,
    diasTotal: dias > 0 ? dias : 0,
    diasMarcados: dias > 0 ? new Array(dias).fill(false) : [],
    bonusCuadrados: false
  });
  saveStudyTasks();
  recalcularProgreso();
  const estado = guardarEstadoUI();
  renderAsignaturas();
  restaurarEstadoUI(estado);
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
  const tarea = studyTasks[index];
  tarea.done = !tarea.done;

  // Solo damos XP al completar, no al descompletar
  if (tarea.done && tarea.xp) {
    addXpGeneral(tarea.xp, 'estudio');
  }

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

// Marca un cuadradito de una tarea prorateada
function toggleCuadrado(gi, cuadradoIndex) {
  const tarea = studyTasks[gi];
  if (!tarea || tarea.diasMarcados[cuadradoIndex]) return;

  tarea.diasMarcados[cuadradoIndex] = true;
  // XP pequeña por cada cuadradito
  addXpGeneral(2, 'estudio');

  // Si todos los cuadraditos están marcados, bonus y completar
  const todosCompletos = tarea.diasMarcados.every(d => d);
  if (todosCompletos && !tarea.bonusCuadrados) {
    tarea.bonusCuadrados = true;
    addXpGeneral(10, 'estudio');
    tarea.done = true;
  }

  saveStudyTasks();
  recalcularProgreso();
  const estado = guardarEstadoUI();
  renderAsignaturas();
  restaurarEstadoUI(estado);
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

// Observa cambios de tema no body e actualiza o pomodoro
const _themeObserver = new MutationObserver(() => {
  updatePomodoroDisplay();
});

_themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

function updatePomodoroDisplay() {
  const min = String(Math.floor(pomodoroSeconds / 60)).padStart(2, '0');
  const sec = String(pomodoroSeconds % 60).padStart(2, '0');
  document.getElementById('pomodoroDisplay').textContent = `${min}:${sec}`;
  const progress = pomodoroSeconds / pomodoroTotal;
  const offset = CIRCUMFERENCE * (1 - progress);
  document.getElementById('ringProgress').style.strokeDashoffset = offset;
  const ring = document.getElementById('ringProgress');
  const style = getComputedStyle(document.body);
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
    examList.innerHTML = '<p class="empty-msg" style="color:var(--muted);font-size:0.9rem">No hay exámenes registrados todavía.</p>';
    return;
  }

  exams
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((exam, index) => {
      const examDate = new Date(exam.date + 'T00:00:00');
      const diff = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
      const pasado = diff < 0;
      const urgente = diff <= 7 && diff >= 0;

      // Temas de la asignatura vinculada
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

      // Nota y XP
      let notaHTML = '';
      if (exam.nota !== null && exam.nota !== undefined) {
        const notaMax = exam.notaMax || 10;
        const aprobado = exam.nota >= notaMax / 2;
        const color = aprobado ? '#86efac' : '#f87171';
        notaHTML = `
          <div style="margin-top:8px;font-size:0.82rem;color:${color};font-weight:600">
            ${aprobado ? '✓' : '✗'} Nota: ${exam.nota}/${notaMax} — ${aprobado ? 'Aprobado' : 'Suspenso'}
          </div>
        `;
      } else if (pasado) {
        // Si ya pasó y no tiene nota, mostramos formulario para añadirla
        notaHTML = `
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <span style="font-size:0.8rem;color:var(--muted)">Añadir nota:</span>
            <input type="number" id="nota-${index}" placeholder="Nota" min="0" step="0.1"
              style="width:70px;background:var(--card-2);border:1px solid var(--border);border-radius:6px;color:var(--text);padding:4px 8px;font-size:0.82rem"/>
            <input type="number" id="notamax-${index}" placeholder="Sobre" value="10" min="1"
              style="width:60px;background:var(--card-2);border:1px solid var(--border);border-radius:6px;color:var(--text);padding:4px 8px;font-size:0.82rem"/>
            <button class="asig-add-btn" onclick="guardarNota(${index})">Guardar</button>
          </div>
        `;
      }

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
            ${notaHTML}
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

// Guarda la nota de un examen y da/resta XP
function guardarNota(index) {
  const notaInput = document.getElementById(`nota-${index}`);
  const notaMaxInput = document.getElementById(`notamax-${index}`);
  if (!notaInput) return;

  const nota = parseFloat(notaInput.value);
  const notaMax = parseFloat(notaMaxInput?.value) || 10;
  if (isNaN(nota)) return;

  exams[index].nota = nota;
  exams[index].notaMax = notaMax;

  const aprobado = nota >= notaMax / 2;
  // Calculamos XP proporcional a la nota: más nota = más XP
  const proporcion = nota / notaMax;
  const xp = Math.round(100 * proporcion * 2); // máximo 200 XP con un 10

  if (aprobado) {
    addXpGeneral(xp, 'estudio');
  } else {
    // Suspenso: restamos XP al perfil general
    // Usamos la función de app.js directamente
    if (typeof state !== 'undefined') {
      state.user.xp = Math.max(0, state.user.xp - xp);
      state.user.totalXp = Math.max(0, state.user.totalXp - xp);
      saveState();
      render();
    }
  }

  localStorage.setItem('exams', JSON.stringify(exams));
  renderExams();
}

// El formulario de exámenes ahora tiene un select con las asignaturas existentes
function renderExamSelect() {
  const select = document.getElementById('examSubject');
  if (!select) return;

  // Guardamos el valor actual para no perderlo al re-renderizar
  const valorActual = select.value;
  select.innerHTML = '<option value="">Selecciona asignatura...</option>';

  asignaturas.forEach(asig => {
    const opt = document.createElement('option');
    opt.value = asig.nombre;
    opt.textContent = asig.nombre;
    select.appendChild(opt);
  });

  // Si había un valor seleccionado lo restauramos
  if (valorActual) select.value = valorActual;
}

document.getElementById('examForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const subject = document.getElementById('examSubject').value.trim();
  const date = document.getElementById('examDate').value;
  if (!subject || !date) return;
  exams.push({ subject, date, nota: null, notaMax: 10 });
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

/* const STUDYOS_VERSION = '1.1';

const studyosUpdates = {
  '1.1': {
    title: 'StudyOS v1.1 — Primera versión',
    changes: [
      'Asignaturas: puedes crear todas las asignaturas que necesites y eliminarlas cuando quieras. Cada una muestra su progreso y el número de tareas pendientes sin necesidad de abrirla.',
      'Temas por asignatura: organiza cada asignatura en temas con estados propios. Cambia el estado con un clic: No empezado, Leyendo, Repasar o Me lo sé. Cada cambio de estado suma XP al perfil general de la app.',
      'Progreso mixto: el progreso de cada asignatura se calcula automáticamente. El 70% depende de los temas en estado "Me lo sé" y el 30% de las tareas completadas.',
      'Tareas con dificultad y XP: al añadir una tarea puedes elegir su dificultad. Cuanto más difícil, más XP recibes al completarla.',
      'Tareas divididas en días: cualquier tarea puede repartirse en N días. Cada día que marcas un cuadradito suma XP a tu perfil y mantiene tu racha activa. Al completar todos los cuadraditos recibes un bonus extra.',
      'Racha diaria integrada: cualquier acción en StudyOS cuenta para mantener tu racha activa.',
      'Tareas completadas: al marcar una tarea como hecha pasa a un desplegable de completadas, siguiendo la misma lógica que el resto de la app.',
      'Notas: puedes añadir notas independientes a cualquier tarea o tema. Las notas se guardan automáticamente mientras escribes.',
      'Exámenes vinculados a asignaturas: al registrar un examen seleccionas directamente una de tus asignaturas. Al verlo aparece el estado de cada tema para saber qué tienes preparado.',
      'Notas en exámenes: cuando un examen ya pasó puedes añadir tu nota. Si aprobaste recibes XP proporcional a la calificación. Si suspendiste, se resta XP como penalización.',
      'Pomodoro: temporizador circular con tiempo de trabajo y descanso configurables. El color del anillo sigue el tema visual elegido en ajustes.',
      'Nuevos temas de color: Burdeos, Pizarra, Tierra y Negro total, que se desbloquean progresivamente al subir de nivel y funcionan en toda la app.',
      'Guardado automático: todos los datos se guardan en el navegador y permanecen aunque cierres o recargues la aplicación.',
      'Cualquier mejora o corrección que se te ocurra, escríbeme a nuria.guerra.casal@rai.usc.es'
    ]
  }
}; */

/* function showStudyosUpdate() {
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
} */


// ================================
// INIT
// ================================

renderAsignaturas();
renderExams();
renderExamSelect();
//showStudyosUpdate();