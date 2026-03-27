/* =============================================
   RIFA — app.js  (v4 · flujo simplificado)
   ============================================= */

const API_URL = 'https://rifa-psi-ten.vercel.app/api/boletos';
const TOTAL   = 999;
const WA_TEL  = '5218148071448';
const PRECIO  = { 2: 50, 4: 100 };

// ── Estado global ──────────────────────────────
let taken      = [];   // números vendidos (backend)
let selected   = [];   // selección en curso
let ticketType = 4;    // 2 ó 4 números
let cart       = [];   // [{ nums, tipo }]

// ── DOM ───────────────────────────────────────
const grid        = document.getElementById('grid');
const counter     = document.getElementById('counter');
const selBar      = document.getElementById('sel-bar');
const genBtn      = document.getElementById('gen-btn');
const searchInput = document.getElementById('search');
const overlay     = document.getElementById('ticket-overlay');
const closeBtn    = document.getElementById('close-btn');
const saveBtn     = document.getElementById('save-btn');
const randomBtn   = document.getElementById('random-btn');
const toast       = document.getElementById('toast');

// Selector de tipo
const typeToggle = document.getElementById('type-toggle');
const typeBtns   = typeToggle.querySelectorAll('.type-btn');

// Modal comprador
const buyerModal    = document.getElementById('buyer-modal');
const buyerInput    = document.getElementById('buyer-name');
const buyerPhone    = document.getElementById('buyer-phone');
const buyerNameErr  = document.getElementById('name-error');
const buyerPhoneErr = document.getElementById('phone-error');
const buyerCancel   = document.getElementById('modal-cancel');
const buyerConfirm  = document.getElementById('modal-confirm');

// Carrito
const cartBar     = document.getElementById('cart-bar');
const cartCount   = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const cartPanel   = document.getElementById('cart-panel');
const cartItems   = document.getElementById('cart-items');
const cartSummary = document.getElementById('cart-summary');
const cartWaBtn   = document.getElementById('cart-wa-btn');
const cartClose   = document.getElementById('cart-close');
const cartClear   = document.getElementById('cart-clear');

// ── Utilidades ────────────────────────────────

function pad(n) { return String(n).padStart(3, '0'); }
function saveTaken() { localStorage.setItem('rifa_taken', JSON.stringify(taken)); }
function generateFolio() { return 'F-' + Date.now().toString(36).toUpperCase().slice(-6); }
function formatDate() {
  const now = new Date();
  return now.toLocaleDateString('es-MX', { day:'2-digit', month:'long', year:'numeric' })
       + ' · ' + now.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' });
}
function showToast(msg, type = 'ok') {
  toast.textContent = msg;
  toast.className   = `toast toast--${type} toast--visible`;
  setTimeout(() => toast.classList.remove('toast--visible'), 1500);
}
function allReserved() {
  return [...taken, ...cart.flatMap(b => b.nums)];
}

// ── Carga inicial ─────────────────────────────

async function loadTaken() {
  try {
    const res  = await fetch(`${API_URL}?taken=true`);
    const data = await res.json();
    taken = data.taken || [];
    localStorage.setItem('rifa_taken', JSON.stringify(taken));
  } catch {
    taken = JSON.parse(localStorage.getItem('rifa_taken') || '[]');
  } finally {
    renderGrid();
    updateUI();
  }
}

// ── Grid ──────────────────────────────────────

function renderGrid(filter = '') {
  grid.innerHTML = '';
  const inCartNums  = cart.flatMap(b => b.nums);
  const available   = [];
  const unavailable = [];

  for (let i = 0; i <= TOTAL; i++) {
    const str = pad(i);
    if (filter && !str.includes(filter)) continue;
    if ((taken.includes(i) || inCartNums.includes(i)) && !selected.includes(i)) {
      unavailable.push(i);
    } else {
      available.push(i);
    }
  }

  [...available, ...unavailable].forEach(i => {
    const btn = document.createElement('button');
    btn.className   = 'num-btn';
    btn.textContent = pad(i);
    btn.dataset.n   = i;

    if (taken.includes(i)) {
      btn.classList.add('taken');
      btn.disabled = true;
      btn.title    = 'Número ya vendido';
    } else if (inCartNums.includes(i)) {
      btn.classList.add('in-cart');
      btn.disabled = true;
      btn.title    = 'Ya está en tu carrito';
    } else if (selected.includes(i)) {
      btn.classList.add('selected');
      btn.addEventListener('click', () => toggle(i));
    } else {
      btn.addEventListener('click', () => toggle(i));
    }

    grid.appendChild(btn);
  });
}

// ── Selección ─────────────────────────────────

function toggle(n) {
  if (selected.includes(n)) {
    selected = selected.filter(x => x !== n);
  } else {
    if (selected.length >= ticketType) {
      showToast(`Este boleto lleva ${ticketType} números. Agrégalo al carrito o quita uno.`, 'warn');
      return;
    }
    selected.push(n);
  }
  updateUI();
  syncButtonState(n);
}

function syncButtonState(n) {
  const btn = grid.querySelector(`[data-n="${n}"]`);
  if (btn) btn.classList.toggle('selected', selected.includes(n));
}

function removeNum(n) {
  selected = selected.filter(x => x !== n);
  updateUI();
  syncButtonState(n);
}
window.removeNum = removeNum;

function pickRandom() {
  const reserved  = allReserved();
  const available = [];
  for (let i = 0; i <= TOTAL; i++) {
    if (!reserved.includes(i) && !selected.includes(i)) available.push(i);
  }
  const needed = ticketType - selected.length;
  for (let i = 0; i < needed; i++) {
    if (!available.length) break;
    const idx = Math.floor(Math.random() * available.length);
    selected.push(available.splice(idx, 1)[0]);
  }
  renderGrid(searchInput.value.trim());
  updateUI();
}

// ── UI general ────────────────────────────────

function updateUI() {
  counter.textContent = `${selected.length} / ${ticketType} seleccionados`;
  const ready = selected.length === ticketType;
  genBtn.disabled    = !ready;
  genBtn.textContent = ready ? 'Agregar al carrito 🛒' : `Selecciona ${ticketType} números`;

  if (selected.length === 0) {
    selBar.innerHTML = '<span class="sel-hint">No has seleccionado ningún número aún.</span>';
    return;
  }
  selBar.innerHTML = [...selected].sort((a,b) => a-b).map(n => `
    <span class="sel-chip">${pad(n)}<span class="rm" onclick="removeNum(${n})">×</span></span>
  `).join('');
}

// ── Tipo de boleto ────────────────────────────

typeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const t = parseInt(btn.dataset.type, 10);
    if (t === ticketType) return;
    ticketType = t;
    selected   = [];
    typeBtns.forEach(b => b.classList.toggle('active', parseInt(b.dataset.type, 10) === ticketType));
    renderGrid(searchInput.value.trim());
    updateUI();
  });
});

// ── Carrito ───────────────────────────────────

function addToCart() {
  if (selected.length !== ticketType) return;
  cart.push({ nums: [...selected].sort((a,b) => a-b), tipo: ticketType });
  selected = [];
  renderGrid(searchInput.value.trim());
  updateUI();
  updateCartUI();
  showToast('Boleto agregado al carrito 🛒', 'ok');
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  renderGrid(searchInput.value.trim());
  updateCartUI();
  updateUI();
}
window.removeFromCart = removeFromCart;

function cartTotal$() {
  return cart.reduce((sum, b) => sum + PRECIO[b.tipo], 0);
}

function updateCartUI() {
  const total = cartTotal$();
  const count = cart.length;

  if (count === 0) {
    cartBar.classList.remove('visible');
    document.body.style.paddingBottom = '';
  } else {
    cartBar.classList.add('visible');
    cartCount.textContent   = `${count} boleto${count > 1 ? 's' : ''}`;
    cartTotalEl.textContent = `$${total}`;
    document.body.style.paddingBottom = '5rem';
  }

  cartItems.innerHTML = count === 0
    ? '<p class="cart-empty">Tu carrito está vacío.</p>'
    : cart.map((b, i) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <span class="cart-item-badge">${b.tipo} núm · $${PRECIO[b.tipo]}</span>
            <span class="cart-item-nums">${b.nums.map(pad).join(' · ')}</span>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${i})">×</button>
        </div>
      `).join('');

  cartSummary.textContent = count > 0 ? `${count} boleto${count > 1 ? 's' : ''} · Total: $${total}` : '';
  cartWaBtn.disabled      = count === 0;
}

// ── Modal comprador ───────────────────────────

function openBuyerModal() {
  if (cart.length === 0) { showToast('Tu carrito está vacío.', 'warn'); return; }
  buyerInput.value            = '';
  buyerPhone.value            = '';
  buyerNameErr.style.display  = 'none';
  buyerPhoneErr.style.display = 'none';
  buyerModal.classList.add('open');
  cartPanel.classList.remove('open');
  setTimeout(() => buyerInput.focus(), 150);
}

async function confirmBuyer() {
  const name  = buyerInput.value.trim();
  const phone = buyerPhone.value.trim();

  const soloLetras  = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/.test(name);
  const dospalabras = name.split(/\s+/).filter(w => w.length > 1).length >= 2;
  const telValido   = /^\+?[\d\s\-]{8,15}$/.test(phone);

  let hasErr = false;

  if (!name || !soloLetras || !dospalabras) {
    buyerNameErr.textContent   = !name ? 'Por favor ingresa tu nombre.' : 'Ingresa nombre y apellido (solo letras).';
    buyerNameErr.style.display = 'block';
    hasErr = true;
  } else {
    buyerNameErr.style.display = 'none';
  }

  if (!phone || !telValido) {
    buyerPhoneErr.textContent   = !phone ? 'Por favor ingresa tu teléfono.' : 'Teléfono no válido (mín. 8 dígitos).';
    buyerPhoneErr.style.display = 'block';
    hasErr = true;
  } else {
    buyerPhoneErr.style.display = 'none';
  }

  if (hasErr) return;

  buyerConfirm.disabled    = true;
  buyerConfirm.textContent = 'Guardando…';

  const date   = formatDate();
  let allSaved = true;

  for (const boleto of cart) {
    // Pequeña pausa entre boletos para evitar race condition en el backend
    await new Promise(r => setTimeout(r, 300));

    const folio = generateFolio();
    let saved   = false;

    for (let intento = 1; intento <= 3; intento++) {
      try {
        await saveToBackend({ name, phone, nums: boleto.nums, folio, date, tipo: boleto.tipo });
        saved = true;
        break;
      } catch {
        if (intento < 3) await new Promise(r => setTimeout(r, 1000 * intento));
      }
    }

    if (!saved) { allSaved = false; break; }
  }

  if (!allSaved) {
    showToast('No se pudo guardar. Verifica tu conexión e intenta de nuevo.', 'warn');
    buyerConfirm.disabled    = false;
    buyerConfirm.textContent = 'Confirmar →';
    return;
  }

  taken = taken.concat(cart.flatMap(b => b.nums));
  saveTaken();
  showToast('¡Boletos registrados! Confirma por WhatsApp 🎉', 'ok');

  buyerModal.classList.remove('open');
  buyerConfirm.disabled    = false;
  buyerConfirm.textContent = 'Confirmar →';

  abrirWhatsApp(name, phone, cart);

  cart = []; selected = [];
  renderGrid(searchInput.value.trim());
  updateUI();
  updateCartUI();
}

// ── Backend ───────────────────────────────────

async function saveToBackend(data) {
  console.log('📤 enviando boleto:', JSON.stringify(data));
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });
  const text = await res.text();
  console.log(`📥 respuesta ${res.status}:`, text);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
  return JSON.parse(text);
}

// ── WhatsApp ──────────────────────────────────

function abrirWhatsApp(nombre, telefono, boletos) {
  const total  = boletos.reduce((s, b) => s + PRECIO[b.tipo], 0);
  const lineas = boletos.map((b, i) =>
    `*Boleto ${i+1}* (${b.tipo} núm · $${PRECIO[b.tipo]}): ${b.nums.map(pad).join(', ')}`
  );

  const msg =
`¡Hola! Quiero confirmar mis boletos de rifa.

*Comprador:* ${nombre}  ${telefono}

${lineas.join('\n')}

*Total a pagar: $${total}*
──────────────────────────────────
Buen día, ☀️ le envío el número de cuenta para transferencias o depósitos:
*Si es en efectivo indicar* 💰
*Cuenta NU:*
5101 2521 7769 5990

*MercadoPago:*
722 969 0154 0490 7524

*Ingrese su nombre en el concepto de pago*

*Por favor envía tu comprobante de pago para confirmar tus boletos.* ✨`;

  window.open(`https://wa.me/${WA_TEL}?text=${encodeURIComponent(msg)}`, '_blank');
}

cartWaBtn.addEventListener('click', openBuyerModal);

// ── Guardar imagen (desactivada — código preservado) ──
// Para reactivar: descomentar el bloque y agregar el botón al HTML

/*
saveBtn.addEventListener('click', () => {
  const nums  = [...document.querySelectorAll('.ticket-num')].map(el => el.textContent.trim());
  const buyer = document.getElementById('ticket-buyer').textContent;
  const folio = document.getElementById('ticket-id').textContent;
  const date  = document.getElementById('ticket-date').textContent;

  const W = 900, H = 620;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f5f6f8'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = '#185FA5'; roundRect(ctx,0,0,W,200,{tl:14,tr:14,bl:0,br:0}); ctx.fill();
  ctx.fillStyle='#B5D4F4'; ctx.font='600 22px "Plus Jakarta Sans",sans-serif';
  ctx.textAlign='center'; ctx.fillText('BOLETO OFICIAL',W/2,60);
  ctx.fillStyle='#ffffff'; ctx.font='700 38px "Plus Jakarta Sans",sans-serif';
  ctx.fillText('Tu boleto de rifa',W/2,120);
  ctx.fillStyle='#B5D4F4'; ctx.font='400 22px "Plus Jakarta Sans",sans-serif';
  ctx.fillText(date,W/2,165);
  ctx.strokeStyle='#d1d5db'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(60,228); ctx.lineTo(W/2-20,228); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W/2+20,228); ctx.lineTo(W-60,228); ctx.stroke();
  ctx.fillStyle='#9ca3af'; ctx.font='18px sans-serif'; ctx.fillText('★',W/2,234);

  const boxW=140,boxH=140,gap=24;
  const totalW=nums.length*boxW+(nums.length-1)*gap;
  const startX=(W-totalW)/2, startY=260;
  nums.forEach((num,i)=>{
    const x=startX+i*(boxW+gap);
    ctx.fillStyle='#ffffff'; roundRect(ctx,x,startY,boxW,boxH,10); ctx.fill();
    ctx.strokeStyle='#B5D4F4'; ctx.lineWidth=2; roundRect(ctx,x,startY,boxW,boxH,10); ctx.stroke();
    ctx.fillStyle='#0C447C'; ctx.font='600 36px "DM Mono",monospace'; ctx.textAlign='center';
    ctx.fillText(num,x+boxW/2,startY+boxH/2+13);
  });

  ctx.fillStyle='#ffffff'; roundRect(ctx,0,430,W,H-430,{tl:0,tr:0,bl:14,br:14}); ctx.fill();
  ctx.fillStyle='#1a1a1a'; ctx.font='700 32px "Plus Jakarta Sans",sans-serif'; ctx.textAlign='center';
  ctx.fillText(buyer,W/2,500);
  ctx.fillStyle='#9ca3af'; ctx.font='500 20px "DM Mono",monospace';
  ctx.fillText(folio,W/2,565);

  const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent);
  const folioClean=folio.replace('Folio: ','');
  canvas.toBlob(blob=>{
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=`boleto-${folioClean}.jpg`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    if(isIOS){
      showToast('Mantén presionada la imagen para guardarla 📲','ok');
      setTimeout(()=>{window.open(url,'_blank');URL.revokeObjectURL(url);},300);
    } else setTimeout(()=>URL.revokeObjectURL(url),1000);
  },'image/jpeg',0.95);
});

function roundRect(ctx,x,y,w,h,r){
  if(typeof r==='number') r={tl:r,tr:r,bl:r,br:r};
  ctx.beginPath();
  ctx.moveTo(x+r.tl,y); ctx.lineTo(x+w-r.tr,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r.tr);
  ctx.lineTo(x+w,y+h-r.br);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r.br,y+h);
  ctx.lineTo(x+r.bl,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r.bl);
  ctx.lineTo(x,y+r.tl);
  ctx.quadraticCurveTo(x,y,x+r.tl,y);
  ctx.closePath();
}
*/

// ── Eventos ───────────────────────────────────

genBtn.addEventListener('click', addToCart);
randomBtn.addEventListener('click', pickRandom);
buyerConfirm.addEventListener('click', confirmBuyer);
buyerCancel.addEventListener('click', () => buyerModal.classList.remove('open'));
buyerInput.addEventListener('keydown', e => { if (e.key === 'Enter') confirmBuyer(); });
buyerModal.addEventListener('click', e => { if (e.target === buyerModal) buyerModal.classList.remove('open'); });

closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

cartBar.addEventListener('click', () => cartPanel.classList.toggle('open'));
cartClose.addEventListener('click', () => cartPanel.classList.remove('open'));
cartClear.addEventListener('click', () => {
  if (!confirm('¿Vaciar el carrito?')) return;
  cart = []; selected = [];
  renderGrid(searchInput.value.trim());
  updateUI(); updateCartUI();
  cartPanel.classList.remove('open');
});

searchInput.addEventListener('input', () => renderGrid(searchInput.value.trim()));
searchInput.addEventListener('change', () => {
  const val = parseInt(searchInput.value, 10);
  if (val > TOTAL) searchInput.value = TOTAL;
  if (val < 1)     searchInput.value = '';
});

// ── Init ──────────────────────────────────────
loadTaken();
updateUI();
updateCartUI();