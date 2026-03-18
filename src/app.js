/* =============================================
   RIFA — app.js
   ============================================= */

const API_URL = 'https://rifa-psi-ten.vercel.app/api/boletos';
const TOTAL   = 999;
const WA_TEL  = '5218148071448';

// --- Estado ---
let taken = [];

async function loadTaken() {
  try {
    const res  = await fetch(`${API_URL}?taken=true`);
    const data = await res.json();
    taken = data.taken || [];
    localStorage.setItem('rifa_taken', JSON.stringify(taken));
  } catch (err) {
    taken = JSON.parse(localStorage.getItem('rifa_taken') || '[]');
    console.warn('Usando localStorage como respaldo:', err);
  } finally {
    renderGrid();
    updateUI();
  }
}

let selected    = [];
let pendingNums = [];

// --- Referencias al DOM ---
const grid        = document.getElementById('grid');
const counter     = document.getElementById('counter');
const selBar      = document.getElementById('sel-bar');
const genBtn      = document.getElementById('gen-btn');
const searchInput = document.getElementById('search');
const overlay     = document.getElementById('ticket-overlay');
const closeBtn    = document.getElementById('close-btn');
const saveBtn     = document.getElementById('save-btn');
const waBtn       = document.getElementById('wa-btn');
const toast       = document.getElementById('toast');

// Modal de nombre
const nameModal    = document.getElementById('name-modal');
const buyerInput   = document.getElementById('buyer-name');
const nameError    = document.getElementById('name-error');
const modalCancel  = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');
const emailInput   = document.getElementById('buyer-email');
const phoneInput   = document.getElementById('buyer-phone');
const emailError   = document.getElementById('email-error');
const phoneError   = document.getElementById('phone-error');

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
// -----------------------------------------------

function openNameModal() {
  pendingNums              = [...selected].sort((a, b) => a - b);
  buyerInput.value         = '';
  emailInput.value         = '';
  phoneInput.value         = '';
  nameError.style.display  = 'none';
  emailError.style.display = 'none';
  phoneError.style.display = 'none';
  nameModal.classList.add('open');
  setTimeout(() => buyerInput.focus(), 150);
}

async function confirmName() {
  const name  = buyerInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  const soloLetras     = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/.test(name);
  const dospalabras    = name.split(/\s+/).filter(w => w.length > 1).length >= 2;
  const emailValido    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const telefonoValido = /^\+?[\d\s\-]{8,15}$/.test(phone);

  let hasError = false;

  if (!name) {
    nameError.textContent   = 'Por favor ingresa tu nombre.';
    nameError.style.display = 'block';
    hasError = true;
  } else if (!soloLetras) {
    nameError.textContent   = 'Solo letras, sin números ni símbolos.';
    nameError.style.display = 'block';
    hasError = true;
  } else if (!dospalabras) {
    nameError.textContent   = 'Ingresa nombre y apellido.';
    nameError.style.display = 'block';
    hasError = true;
  } else {
    nameError.style.display = 'none';
  }

  if (email && !emailValido) {
    emailError.textContent   = 'Correo no válido.';
    emailError.style.display = 'block';
    hasError = true;
  } else {
    emailError.style.display = 'none';
  }

  if (!phone) {
    phoneError.textContent   = 'Por favor ingresa tu teléfono.';
    phoneError.style.display = 'block';
    hasError = true;
  } else if (!telefonoValido) {
    phoneError.textContent   = 'Teléfono no válido (mín. 8 dígitos).';
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

// Reintentar hasta 3 veces
  let saved = false;
  for (let intento = 1; intento <= 3; intento++) {
    try {
      await saveToBackend({ name, email, phone, nums: pendingNums, folio, date });
      saved = true;
      break;
    } catch (err) {
      console.warn(`Intento ${intento} fallido:`, err);
      if (intento < 3) await new Promise(r => setTimeout(r, 1000 * intento));
    }
  }

  if (!saved) {
    showToast('No se pudo guardar. Verifica tu conexión e intenta de nuevo.', 'warn');
    modalConfirm.disabled    = false;
    modalConfirm.textContent = 'Confirmar →';
    return; // ← se detiene aquí, no genera boleto
  }

  // Solo si se guardó correctamente:
  showToast('Boleto registrado correctamente', 'ok');
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
// Backend
// -----------------------------------------------

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

// -----------------------------------------------
// Guardar boleto como JPG  — compatible con iPhone
// -----------------------------------------------

saveBtn.addEventListener('click', async () => {
  const nums    = [...document.querySelectorAll('.ticket-num')].map(el => el.textContent.trim());
  const buyer   = document.getElementById('ticket-buyer').textContent;
  const folio   = document.getElementById('ticket-id').textContent;
  const date    = document.getElementById('ticket-date').textContent;

  const W = 900, H = 620;
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // --- Fondo general ---
  ctx.fillStyle = '#f5f6f8';
  ctx.fillRect(0, 0, W, H);

  // --- Header azul ---
  ctx.fillStyle = '#185FA5';
  roundRect(ctx, 0, 0, W, 200, { tl: 14, tr: 14, bl: 0, br: 0 });
  ctx.fill();

  // --- "BOLETO OFICIAL" ---
  ctx.fillStyle = '#B5D4F4';
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '4px';
  ctx.fillText('BOLETO OFICIAL', W / 2, 60);

  // --- Título ---
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 38px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '0px';
  ctx.fillText('Tu boleto de rifa', W / 2, 120);

  // --- Fecha ---
  ctx.fillStyle = '#B5D4F4';
  ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(date, W / 2, 165);

  // --- Divisor con estrella ---
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(60, 228); ctx.lineTo(W/2 - 20, 228); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W/2 + 20, 228); ctx.lineTo(W - 60, 228); ctx.stroke();
  ctx.fillStyle = '#9ca3af';
  ctx.font = '18px sans-serif';
  ctx.fillText('★', W / 2, 234);

  // --- Números ---
  const boxW = 140, boxH = 140, gap = 24;
  const totalW = nums.length * boxW + (nums.length - 1) * gap;
  const startX = (W - totalW) / 2;
  const startY = 260;

  nums.forEach((num, i) => {
    const x = startX + i * (boxW + gap);
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, x, startY, boxW, boxH, 10);
    ctx.fill();
    ctx.strokeStyle = '#B5D4F4';
    ctx.lineWidth = 2;
    roundRect(ctx, x, startY, boxW, boxH, 10);
    ctx.stroke();
    ctx.fillStyle = '#0C447C';
    ctx.font = '600 36px "DM Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(num, x + boxW / 2, startY + boxH / 2 + 13);
  });

  // --- Footer blanco ---
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, 0, 430, W, H - 430, { tl: 0, tr: 0, bl: 14, br: 14 });
  ctx.fill();

  // --- Nombre ---
  ctx.fillStyle = '#1a1a1a';
  ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(buyer, W / 2, 500);

  // --- Folio ---
  ctx.fillStyle = '#9ca3af';
  ctx.font = '500 20px "DM Mono", monospace';
  ctx.fillText(folio, W / 2, 565);

  // --- Exportar ---
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const folioClean = folio.replace('Folio: ', '');

  canvas.toBlob((blob) => {
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `boleto-${folioClean}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (isIOS) {
      showToast('Mantén presionada la imagen para guardarla 📲', 'ok');
      setTimeout(() => { window.open(url, '_blank'); URL.revokeObjectURL(url); }, 300);
    } else {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }, 'image/jpeg', 0.95);
});

// Helper para rectángulos redondeados
function roundRect(ctx, x, y, w, h, r) {
  if (typeof r === 'number') r = { tl: r, tr: r, bl: r, br: r };
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
}

// -----------------------------------------------
// WhatsApp
// -----------------------------------------------

function abrirWhatsApp() {
  const nombre  = document.getElementById('ticket-buyer').textContent;
  const folio   = document.getElementById('ticket-id').textContent.replace('Folio: ', '');
  const numeros = [...document.querySelectorAll('.ticket-num')].map(el => el.textContent.trim());

  const msg =
`¡Hola! Quiero confirmar mi boleto de rifa.

*Nombre:* ${nombre}
*Números:* ${numeros.join(', ')}
*Folio:* ${folio}

Buen día, le envío el número de cuenta para transferencias o depósitos:
*BBVA:*
183884938262717

*MercadoPago:*
183884938262717
*A nombre de:* Ricardo Bravo Lino

Por favor envía tu comprobante de pago para confirmar tus boletos.`;

  window.open(`https://wa.me/${WA_TEL}?text=${encodeURIComponent(msg)}`, '_blank');
}
waBtn.addEventListener('click', abrirWhatsApp);

// -----------------------------------------------
// Eventos
// -----------------------------------------------

genBtn.addEventListener('click', openNameModal);

modalConfirm.addEventListener('click', confirmName);

modalCancel.addEventListener('click', () => {
  nameModal.classList.remove('open');
  pendingNums = [];
});

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
loadTaken();
updateUI();