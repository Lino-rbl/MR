/* =============================================
   RIFA — app.js
   ============================================= */

//  Cambia esta URL por la de tu proyecto en Vercel
const API_URL = 'https://rifa-psi-ten.vercel.app/api/boletos';

const TOTAL = 999;

// --- Estado ---
//let taken    = JSON.parse(localStorage.getItem('rifa_taken') || '[]');

let taken = [];

async function loadTaken() {
  try {
    const res = await fetch(`${API_URL}?taken=true`);
    const data = await res.json();
    taken = data.taken || [];
    // Sincronizar localStorage con los datos reales
    localStorage.setItem('rifa_taken', JSON.stringify(taken));
  } catch (err) {
    // Si falla el servidor, usar localStorage como respaldo
    taken = JSON.parse(localStorage.getItem('rifa_taken') || '[]');
    console.warn('Usando localStorage como respaldo:', err);
  } finally {
    renderGrid();
    updateUI();
  }
}
let selected = [];
let pendingNums = []; // números en espera de confirmación de nombre

// --- Referencias al DOM ---
const grid        = document.getElementById('grid');
const counter     = document.getElementById('counter');
const selBar      = document.getElementById('sel-bar');
const genBtn      = document.getElementById('gen-btn');
const searchInput = document.getElementById('search');
const overlay     = document.getElementById('ticket-overlay');
const closeBtn    = document.getElementById('close-btn');
const saveBtn     = document.getElementById('save-btn');
const toast       = document.getElementById('toast');

// Modal de nombre
const nameModal    = document.getElementById('name-modal');
const buyerInput   = document.getElementById('buyer-name');
const nameError    = document.getElementById('name-error');
const modalCancel  = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');
const emailInput = document.getElementById('buyer-email');
const phoneInput = document.getElementById('buyer-phone');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');

// -----------------------------------------------
// Utilidades
// -----------------------------------------------

function pad(n) {
  return String(n).padStart(3, '0');
}

function saveTaken() {
  localStorage.setItem('rifa_taken', JSON.stringify(taken));
}

function generateFolio() {
  return 'F-' + Date.now().toString(36).toUpperCase().slice(-6);
}

function formatDate() {
  const now   = new Date();
  const fecha = now.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
  const hora  = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  return `${fecha} · ${hora}`;
}

/** Muestra un mensaje flotante por 3 segundos */
function showToast(msg, type = 'ok') {
  toast.textContent = msg;
  toast.className   = `toast toast--${type} toast--visible`;
  setTimeout(() => toast.classList.remove('toast--visible'), 3000);
}

// -----------------------------------------------
// Renderizado de la cuadrícula
// -----------------------------------------------

function renderGrid(filter = '') {
  grid.innerHTML = '';

  for (let i = 0; i <= TOTAL; i++) {
    const str = pad(i);
    if (filter && !str.includes(filter)) continue;

    const btn = document.createElement('button');
    btn.className   = 'num-btn';
    btn.textContent = str;
    btn.dataset.n   = i;

    if (taken.includes(i)) {
      btn.classList.add('taken');
      btn.disabled = true;
      btn.title    = 'Número ya tomado';
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

function syncButtonState(n) {
  const btn = grid.querySelector(`[data-n="${n}"]`);
  if (!btn) return;
  btn.classList.toggle('selected', selected.includes(n));
}

function removeNum(n) {
  selected = selected.filter(x => x !== n);
  updateUI();
  syncButtonState(n);
}

window.removeNum = removeNum;

// -----------------------------------------------
// Actualización de la UI
// -----------------------------------------------

function updateUI() {
  counter.textContent = `${selected.length} / 4 seleccionados`;
  genBtn.disabled     = selected.length !== 4;

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
// Flujo: Generar boleto
// 1. Click en "Generar boleto" → abrir modal de nombre
// 2. Confirmar nombre → guardar en backend + mostrar boleto
// -----------------------------------------------

/** Paso 1: abre el modal de nombre */
function openNameModal() {
  pendingNums        = [...selected].sort((a, b) => a - b);
  buyerInput.value   = '';
  nameError.style.display = 'none';
  nameModal.classList.add('open');
  setTimeout(() => buyerInput.focus(), 150);
}

/** Paso 2: valida nombre y lanza confirmación */
async function confirmName() {
  const name  = buyerInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  // Validaciones
  const soloLetras  = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/.test(name);
  const dospalabras = name.split(/\s+/).filter(w => w.length > 1).length >= 2;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const telefonoValido = /^\+?[\d\s\-]{8,15}$/.test(phone);

  let hasError = false;

  if (!name) {
    nameError.textContent = 'Por favor ingresa tu nombre.';
    nameError.style.display = 'block';
    hasError = true;
  } else if (!soloLetras) {
    nameError.textContent = 'Solo letras, sin números ni símbolos.';
    nameError.style.display = 'block';
    hasError = true;
  } else if (!dospalabras) {
    nameError.textContent = 'Ingresa nombre y apellido.';
    nameError.style.display = 'block';
    hasError = true;
  } else {
    nameError.style.display = 'none';
  }

  // Reemplaza el bloque de validación del email por este:
  if (email && !emailValido) {
    emailError.textContent = 'Correo no válido.';
    emailError.style.display = 'block';
    hasError = true;
  } else {
    emailError.style.display = 'none';
  }

  if (!phone) {
    phoneError.textContent = 'Por favor ingresa tu teléfono.';
    phoneError.style.display = 'block';
    hasError = true;
  } else if (!telefonoValido) {
    phoneError.textContent = 'Teléfono no válido (mín. 8 dígitos).';
    phoneError.style.display = 'block';
    hasError = true;
  } else {
    phoneError.style.display = 'none';
  }

  if (hasError) return;

  modalConfirm.disabled    = true;
  modalConfirm.textContent = 'Guardando…';

  const folio = generateFolio();
  const date  = formatDate();

  try {
    await saveToBackend({ name, email, phone, nums: pendingNums, folio, date });
    showToast('Boleto registrado correctamente', 'ok');
  } catch (err) {
    console.error('Backend error:', err);
    showToast('No se pudo guardar en servidor.', 'warn');
  }

  taken = taken.concat(pendingNums);
  saveTaken();

  nameModal.classList.remove('open');
  modalConfirm.disabled    = false;
  modalConfirm.textContent = 'Confirmar →';

  renderTicket({ nums: pendingNums, name, folio, date });

  selected    = [];
  pendingNums = [];
  renderGrid(searchInput.value.trim());
  updateUI();
}

/** Rellena y muestra el overlay del boleto */
function renderTicket({ nums, name, folio, date }) {
  document.getElementById('ticket-nums').innerHTML = nums
    .map(n => `<div class="ticket-num">${pad(n)}</div>`)
    .join('');

  document.getElementById('ticket-buyer').textContent = name;
  document.getElementById('ticket-date').textContent  = date;
  document.getElementById('ticket-id').textContent    = `Folio: ${folio}`;

  overlay.classList.add('open');
}

// -----------------------------------------------
// Backend: guardar boleto en Vercel
// -----------------------------------------------

/**
 * Envía el boleto al endpoint de Vercel.
 * @param {{ name: string, nums: number[], folio: string, date: string }} data
 */
async function saveToBackend(data) {
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }

  return res.json();
}

// -----------------------------------------------
// Guardar boleto como JPG
// -----------------------------------------------

saveBtn.addEventListener('click', async () => {
  const ticket  = document.getElementById('ticket-box');
  const actions = ticket.querySelector('.ticket-actions');
  actions.style.display = 'none';

  // Esperar un frame para que el DOM se actualice
  await new Promise(r => requestAnimationFrame(r));

  try {
    const blob = await domtoimage.toJpeg(ticket, {
      quality: 0.95,
      scale:   3,
      bgcolor: '#ffffff',
    });

    const folio = document.getElementById('ticket-id').textContent.replace('Folio: ', '');
    const link  = document.createElement('a');
    link.download = `boleto-${folio}.jpg`;
    link.href     = blob;
    link.click();

  } catch (err) {
    console.error('Error al generar imagen:', err);
    showToast('No se pudo generar la imagen.', 'warn');
  } finally {
    actions.style.display = '';
  }
});

// -----------------------------------------------
// Eventos
// -----------------------------------------------

genBtn.addEventListener('click', openNameModal);

modalConfirm.addEventListener('click', confirmName);

modalCancel.addEventListener('click', () => {
  nameModal.classList.remove('open');
  pendingNums = [];
});

// Enter en el input de nombre también confirma
buyerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') confirmName();
});

closeBtn.addEventListener('click', () => overlay.classList.remove('open'));

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.remove('open');
});

nameModal.addEventListener('click', (e) => {
  if (e.target === nameModal) nameModal.classList.remove('open');
});

searchInput.addEventListener('input', () => {
  renderGrid(searchInput.value.trim());
});

searchInput.addEventListener('change', () => {
  const val = parseInt(searchInput.value, 10);
  if (val > TOTAL) searchInput.value = TOTAL;
  if (val < 1)     searchInput.value = '';
});

// -----------------------------------------------
// Inicialización
// -----------------------------------------------
//renderGrid();
loadTaken();
updateUI();