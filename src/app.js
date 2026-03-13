/* =============================================
   RIFA — app.js
   ============================================= */

const TOTAL = 5999;

// --- Estado ---
let taken = JSON.parse(localStorage.getItem('rifa_taken') || '[]');
let selected = [];

// --- Referencias al DOM ---
const grid       = document.getElementById('grid');
const counter    = document.getElementById('counter');
const selBar     = document.getElementById('sel-bar');
const genBtn     = document.getElementById('gen-btn');
const searchInput= document.getElementById('search');
const overlay    = document.getElementById('ticket-overlay');
const closeBtn   = document.getElementById('close-btn');
const printBtn   = document.getElementById('print-btn');

// -----------------------------------------------
// Utilidades
// -----------------------------------------------

/**
 * Formatea un número como string de 4 dígitos con ceros a la izquierda.
 * @param {number} n
 * @returns {string}
 */
function pad(n) {
  return String(n).padStart(4, '0');
}

/**
 * Guarda el arreglo de números tomados en localStorage.
 */
function saveTaken() {
  localStorage.setItem('rifa_taken', JSON.stringify(taken));
}

/**
 * Genera un folio único basado en el timestamp actual.
 * @returns {string}
 */
function generateFolio() {
  return 'F-' + Date.now().toString(36).toUpperCase().slice(-6);
}

/**
 * Formatea la fecha y hora actual en español (México).
 * @returns {string}
 */
function formatDate() {
  const now = new Date();
  const fecha = now.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
  const hora  = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  return `${fecha} · ${hora}`;
}

// -----------------------------------------------
// Renderizado de la cuadrícula
// -----------------------------------------------

/**
 * Construye los botones de número en la cuadrícula.
 * Si se pasa un filtro, solo muestra números cuyo string lo contenga.
 * @param {string} [filter='']
 */
function renderGrid(filter = '') {
  grid.innerHTML = '';

  for (let i = 1; i <= TOTAL; i++) {
    const str = pad(i);
    if (filter && !str.includes(filter)) continue;

    const btn = document.createElement('button');
    btn.className = 'num-btn';
    btn.textContent = str;
    btn.dataset.n = i;

    if (taken.includes(i)) {
      btn.classList.add('taken');
      btn.disabled = true;
      btn.title = 'Número ya tomado';
    } else if (selected.includes(i)) {
      btn.classList.add('selected');
      btn.addEventListener('click', () => toggle(i));
    } else {
      btn.addEventListener('click', () => toggle(i));
    }

    grid.appendChild(btn);
  }
}

// -----------------------------------------------
// Lógica de selección
// -----------------------------------------------

/**
 * Agrega o quita un número de la selección activa.
 * No permite más de 4 selecciones.
 * @param {number} n
 */
function toggle(n) {
  if (selected.includes(n)) {
    selected = selected.filter(x => x !== n);
  } else {
    if (selected.length >= 4) return;
    selected.push(n);
  }
  updateUI();
  syncButtonState(n);
}

/**
 * Actualiza el estado visual de un botón individual sin re-renderizar la cuadrícula completa.
 * @param {number} n
 */
function syncButtonState(n) {
  const btn = grid.querySelector(`[data-n="${n}"]`);
  if (!btn) return;
  btn.classList.toggle('selected', selected.includes(n));
}

/**
 * Quita un número de la selección (llamado desde el chip × ).
 * @param {number} n
 */
function removeNum(n) {
  selected = selected.filter(x => x !== n);
  updateUI();
  syncButtonState(n);
}

// Exponer removeNum globalmente para los onclick inline de los chips
window.removeNum = removeNum;

// -----------------------------------------------
// Actualización de la UI
// -----------------------------------------------

/**
 * Refresca el contador, los chips de selección y el estado del botón de generar.
 */
function updateUI() {
  // Contador
  counter.textContent = `${selected.length} / 4 seleccionados`;

  // Botón principal
  genBtn.disabled = selected.length !== 4;

  // Chips
  if (selected.length === 0) {
    selBar.innerHTML = '<span class="sel-hint">No has seleccionado ningún número aún.</span>';
    return;
  }

  const sorted = [...selected].sort((a, b) => a - b);
  selBar.innerHTML = sorted
    .map(n => `
      <span class="sel-chip">
        ${pad(n)}
        <span class="rm" onclick="removeNum(${n})">×</span>
      </span>
    `)
    .join('');
}

// -----------------------------------------------
// Generación del boleto
// -----------------------------------------------

/**
 * Genera el boleto con los 4 números seleccionados,
 * los marca como tomados y muestra el overlay.
 */
function generateTicket() {
  const nums = [...selected].sort((a, b) => a - b);

  // Marcar como tomados
  taken = taken.concat(nums);
  saveTaken();

  // Rellenar boleto
  document.getElementById('ticket-nums').innerHTML = nums
    .map(n => `<div class="ticket-num">${pad(n)}</div>`)
    .join('');

  document.getElementById('ticket-date').textContent = formatDate();
  document.getElementById('ticket-id').textContent = `Folio: ${generateFolio()}`;

  // Mostrar overlay
  overlay.classList.add('open');

  // Limpiar selección y re-renderizar cuadrícula
  selected = [];
  renderGrid(searchInput.value.trim());
  updateUI();
}

// -----------------------------------------------
// Eventos
// -----------------------------------------------

genBtn.addEventListener('click', generateTicket);

closeBtn.addEventListener('click', () => overlay.classList.remove('open'));

printBtn.addEventListener('click', () => window.print());

// Cerrar overlay al hacer clic en el fondo oscuro
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.remove('open');
});

// Búsqueda en tiempo real
searchInput.addEventListener('input', () => {
  renderGrid(searchInput.value.trim());
});

// Evitar que se introduzca un número mayor a 5999
searchInput.addEventListener('change', () => {
  const val = parseInt(searchInput.value, 10);
  if (val > TOTAL) searchInput.value = TOTAL;
  if (val < 1) searchInput.value = '';
});

// -----------------------------------------------
// Inicialización
// -----------------------------------------------
renderGrid();
updateUI();