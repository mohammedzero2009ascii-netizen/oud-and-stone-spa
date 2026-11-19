import '@fontsource-variable/bodoni-moda/opsz.css';
import '@fontsource-variable/bodoni-moda/opsz-italic.css';
import '@fontsource/jost/latin-400.css';
import '@fontsource/jost/latin-500.css';
import './styles.css';
import { CATEGORIES, SERVICES, TEAM, OPEN_HOUR, CLOSE_HOUR } from './data.js';

document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const aed = (n) => `AED ${n.toLocaleString('en-US')}`;
const dur = (m) => (m >= 60 ? `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const load = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Header ---------- */
const header = $('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
const navBtn = $('#nav-toggle');
function setNav(open) {
  $('#site-nav').classList.toggle('open', open);
  navBtn.setAttribute('aria-expanded', String(open));
  navBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
navBtn.addEventListener('click', () => setNav(navBtn.getAttribute('aria-expanded') !== 'true'));
$('#site-nav').addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && navBtn.getAttribute('aria-expanded') === 'true') { setNav(false); navBtn.focus(); } });
$('#year').textContent = new Date().getFullYear();

/* ---------- Reveal ---------- */
const io = 'IntersectionObserver' in window && !reduceMotion
  ? new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
  : null;
const observe = (root = document) => $$('.reveal:not(.in)', root).forEach((el) => (io ? io.observe(el) : el.classList.add('in')));

/* ---------- Services ---------- */
let filter = 'all';
function renderFilters() {
  $('#filters').innerHTML = CATEGORIES.map((c) => `<button class="filter" type="button" role="tab" id="filter-${c.id}" data-filter="${c.id}" aria-selected="${c.id === filter}" tabindex="${c.id === filter ? 0 : -1}" aria-controls="service-grid">${c.name}</button>`).join('');
  $('#service-grid').setAttribute('aria-labelledby', `filter-${filter}`);
}
function renderServices(animate) {
  const list = SERVICES.filter((s) => filter === 'all' || s.cat === filter);
  $('#service-grid').innerHTML = list.map((s, i) => `
    <article class="svc" style="${animate ? `animation-delay:${i * 50}ms` : 'animation:none'}">
      <div class="svc-img">
        <img src="/img/${s.img}-480.webp" srcset="/img/${s.img}-480.webp 480w, /img/${s.img}-800.webp 800w" sizes="(min-width: 1100px) 390px, (min-width: 640px) 50vw, 100vw" width="480" height="360" loading="lazy" alt="${esc(s.name)}">
        ${s.tag ? `<span class="svc-tag">${s.tag}</span>` : ''}
      </div>
      <div class="svc-body">
        <p class="svc-meta">${dur(s.mins)} · ${CATEGORIES.find((c) => c.id === s.cat).name}</p>
        <h3>${s.name}</h3>
        <p>${s.desc}</p>
        <div class="svc-foot">
          <span class="svc-price"><small>AED</small>${s.price.toLocaleString('en-US')}</span>
          <button class="btn btn-line btn-sm" type="button" data-book="${s.id}" aria-label="Book ${esc(s.name)}">Book</button>
        </div>
      </div>
    </article>`).join('');
}
$('#filters').addEventListener('click', (e) => {
  const b = e.target.closest('[data-filter]');
  if (!b || b.dataset.filter === filter) return;
  filter = b.dataset.filter;
  renderFilters();
  renderServices(true);
  $(`#filter-${filter}`).focus();
});
$('#filters').addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  e.preventDefault();
  const i = CATEGORIES.findIndex((c) => c.id === filter);
  filter = CATEGORIES[(i + (e.key === 'ArrowRight' ? 1 : -1) + CATEGORIES.length) % CATEGORIES.length].id;
  renderFilters();
  renderServices(true);
  $(`#filter-${filter}`).focus();
});
$('#service-grid').addEventListener('click', (e) => {
  const b = e.target.closest('[data-book]');
  if (!b) return;
  state.service = b.dataset.book;
  state.time = null;
  renderOptions();
  goTo(2, false);
  $('#book').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  setTimeout(() => $('[data-panel="2"] .panel-title').focus({ preventScroll: true }), reduceMotion ? 0 : 600);
});

/* ---------- Booking wizard ---------- */
const state = { step: 1, service: null, date: null, time: null };
const svc = () => SERVICES.find((s) => s.id === state.service);

function renderOptions() {
  $('#svc-options').innerHTML = SERVICES.map((s) => `
    <button class="opt" type="button" role="radio" aria-checked="${s.id === state.service}" tabindex="${s.id === state.service || (!state.service && s === SERVICES[0]) ? 0 : -1}" data-svc="${s.id}">
      <span class="opt-name">${s.name}</span>
      <span class="opt-meta">${dur(s.mins)}</span>
      <span class="opt-price">${aed(s.price)}</span>
    </button>`).join('');
}
function nextDays(n = 14) {
  const out = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) { const x = new Date(d); x.setDate(d.getDate() + i); out.push(x); }
  return out;
}
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function slots(dateStr) {
  const s = svc();
  if (!s || !dateStr) return [];
  const taken = new Set(load('oudstone.bookings', []).filter((b) => b.date === dateStr).map((b) => b.time));
  const now = new Date();
  const isToday = dateStr === iso(now);
  const out = [];
  for (let m = OPEN_HOUR * 60; m + s.mins <= CLOSE_HOUR * 60 && m <= 20 * 60 + 30; m += 30) {
    const t = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
    const past = isToday && m < now.getHours() * 60 + now.getMinutes() + 60;
    const busy = hash(dateStr + t) % 4 === 0 || taken.has(t);
    out.push({ t, available: !past && !busy });
  }
  return out;
}
const fmtTime = (t) => { const [h, m] = t.split(':').map(Number); return new Date(2026, 0, 1, h, m).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); };
const fmtDay = (ds, opts = { weekday: 'long', day: 'numeric', month: 'long' }) => { const [y, m, d] = ds.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-GB', opts); };
const endTime = (t, mins) => { const [h, m] = t.split(':').map(Number); const e = h * 60 + m + mins; return fmtTime(`${pad(Math.floor(e / 60))}:${pad(e % 60)}`); };

function renderDays() {
  const days = nextDays();
  $('#days').innerHTML = days.map((d, i) => {
    const ds = iso(d);
    const open = slots(ds).some((x) => x.available);
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'short' });
    return `<button class="day" type="button" role="radio" aria-checked="${ds === state.date}" tabindex="${ds === state.date || (!state.date && i === 0) ? 0 : -1}" data-day="${ds}" ${open ? '' : 'disabled aria-disabled="true"'}
      aria-label="${fmtDay(ds)}${open ? '' : ', fully booked'}">
      <span class="dw">${label}</span><span class="dd">${d.getDate()}</span><span class="dm">${open ? d.toLocaleDateString('en-GB', { month: 'short' }) : 'Full'}</span>
    </button>`;
  }).join('');
}
function renderTimes() {
  const list = slots(state.date);
  $('#time-hint').textContent = `${svc().name}, ${dur(svc().mins)} · ${fmtDay(state.date)}. Greyed-out times are already booked.`;
  $('#times').innerHTML = list.map((x, i) => `<button class="time" type="button" role="radio" aria-checked="${x.t === state.time}" data-time="${x.t}" ${x.available ? '' : 'disabled'}
    tabindex="${x.t === state.time || (!state.time && i === list.findIndex((y) => y.available)) ? 0 : -1}" aria-label="${fmtTime(x.t)}${x.available ? '' : ', unavailable'}">${fmtTime(x.t)}</button>`).join('');
}
function summaryHTML(extra = '') {
  const s = svc();
  return `<div><span class="k">Treatment</span><span>${s.name}</span></div>
    <div><span class="k">When</span><span>${fmtDay(state.date, { weekday: 'short', day: 'numeric', month: 'short' })}, ${fmtTime(state.time)} – ${endTime(state.time, s.mins)}</span></div>
    ${extra}
    <div class="total"><span>Total, incl. VAT</span><span>${aed(s.price)}</span></div>`;
}

function goTo(step, focus = true) {
  state.step = step;
  $$('.step-panel').forEach((p) => { p.hidden = Number(p.dataset.panel) !== step; });
  $$('#steps li').forEach((li) => {
    const n = Number(li.dataset.step);
    li.classList.toggle('active', n === step);
    li.classList.toggle('complete', n < step);
    if (n === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
  });
  $$('.error[id^="err-"]').forEach((e) => { e.textContent = ''; });
  if (step === 2) renderDays();
  if (step === 3) renderTimes();
  if (step === 4) $('#summary').innerHTML = summaryHTML();
  $('#wizard-nav').hidden = step === 5;
  $('#prev').disabled = step === 1;
  $('#prev').style.visibility = step === 1 ? 'hidden' : 'visible';
  $('#next').textContent = step === 4 ? `Confirm booking · ${aed(svc().price)}` : 'Continue';
  if (focus) $(`[data-panel="${step}"] .panel-title`).focus({ preventScroll: false });
}

function radioGroup(container, attr, onPick) {
  container.addEventListener('click', (e) => {
    const b = e.target.closest(`[${attr}]`);
    if (!b || b.disabled) return;
    onPick(b.getAttribute(attr));
  });
  container.addEventListener('keydown', (e) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
    if (!keys.includes(e.key)) return;
    const items = $$(`[${attr}]:not([disabled])`, container);
    const i = items.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const n = items[(i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length];
    onPick(n.getAttribute(attr));
  });
}
radioGroup($('#svc-options'), 'data-svc', (id) => {
  if (state.service !== id) state.time = null;
  state.service = id;
  renderOptions();
  $(`[data-svc="${id}"]`).focus();
  $('#err-1').textContent = '';
});
radioGroup($('#days'), 'data-day', (d) => {
  if (state.date !== d) state.time = null;
  state.date = d;
  renderDays();
  $(`[data-day="${d}"]`).focus();
  $('#err-2').textContent = '';
});
radioGroup($('#times'), 'data-time', (t) => {
  state.time = t;
  renderTimes();
  $(`[data-time="${t}"]`).focus();
  $('#err-3').textContent = '';
});

$('#prev').addEventListener('click', () => goTo(Math.max(1, state.step - 1)));
$('#next').addEventListener('click', () => {
  if (state.step === 1) {
    if (!state.service) { $('#err-1').textContent = 'Please choose a treatment to continue.'; return; }
    return goTo(2);
  }
  if (state.step === 2) {
    if (!state.date) { $('#err-2').textContent = 'Please choose a day to continue.'; return; }
    return goTo(3);
  }
  if (state.step === 3) {
    const ok = slots(state.date).some((x) => x.t === state.time && x.available);
    if (!ok) { $('#err-3').textContent = 'Please choose an available time.'; return; }
    return goTo(4);
  }
  if (state.step === 4) submitBooking();
});

function setErr(input, msg) {
  const field = input.closest('.field') || input.closest('.check');
  const err = document.getElementById(`${input.id}-err`);
  field?.classList.toggle('invalid', !!msg);
  input.setAttribute('aria-invalid', String(!!msg));
  if (err) { err.textContent = msg || ''; msg ? input.setAttribute('aria-describedby', err.id) : input.removeAttribute('aria-describedby'); }
  return !msg;
}
function normalizeUAE(v) {
  const d = String(v || '').replace(/[\s\-()]/g, '');
  const m = d.match(/^(?:\+971|00971|971|0)(5[0-9]{8})$/);
  return m ? `+971 ${m[1].slice(0, 2)} ${m[1].slice(2, 5)} ${m[1].slice(5)}` : null;
}
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

function submitBooking() {
  const f = $('#details');
  const name = f.name.value.trim();
  const phone = normalizeUAE(f.phone.value);
  const email = f.email.value.trim();
  let ok = setErr(f.name, name.length >= 2 ? '' : 'Please enter your full name.');
  ok = setErr(f.phone, phone ? '' : 'Enter a UAE mobile number, e.g. 050 123 4567.') && ok;
  ok = setErr(f.email, emailOk(email) ? '' : 'Enter a valid email address.') && ok;
  ok = setErr(f.policy, f.policy.checked ? '' : 'Please confirm the cancellation policy.') && ok;
  if (!ok) { f.querySelector('[aria-invalid="true"]')?.focus(); return; }
  // Slot may have been taken in another tab
  if (!slots(state.date).some((x) => x.t === state.time && x.available)) { goTo(3); $('#err-3').textContent = 'Sorry, that time was just booked. Please pick another.'; return; }

  const ref = 'OS-' + Date.now().toString(36).slice(-5).toUpperCase();
  const s = svc();
  const prefLabel = f.pref.options[f.pref.selectedIndex].text;
  const booking = { ref, service: s.id, name: s.name, date: state.date, time: state.time, price: s.price, guest: name, phone, email, pref: f.pref.value, notes: f.notes.value.trim(), createdAt: new Date().toISOString() };
  const list = load('oudstone.bookings', []);
  list.push(booking);
  save('oudstone.bookings', list);
  $('#done-summary').innerHTML = `<div><span class="k">Reference</span><span>${ref}</span></div>` + summaryHTML(`
    <div><span class="k">Guest</span><span>${esc(name)}</span></div>
    <div><span class="k">Therapist</span><span>${esc(prefLabel)}</span></div>
    <div><span class="k">Confirmation to</span><span>${esc(email)}</span></div>`);
  goTo(5);
}
$('#details').addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') setErr(e.target, ''); });
$('#details').addEventListener('change', (e) => { if (e.target.type === 'checkbox' && e.target.checked) setErr(e.target, ''); });
$('#details').addEventListener('submit', (e) => { e.preventDefault(); submitBooking(); });
$('#book-again').addEventListener('click', () => {
  Object.assign(state, { service: null, date: null, time: null });
  $('#details').reset();
  renderOptions();
  goTo(1);
});

/* ---------- Team ---------- */
$('#team-grid').innerHTML = TEAM.map((t) => `
  <article class="member reveal">
    <figure><img src="/img/${t.img}-400.webp" srcset="/img/${t.img}-400.webp 400w, /img/${t.img}-640.webp 640w" sizes="(min-width: 768px) 25vw, 50vw" width="400" height="500" loading="lazy" alt="Portrait of ${t.name}, ${t.role}"></figure>
    <h3>${t.name}</h3>
    <p class="role">${t.role}</p>
    <p>${t.bio}</p>
  </article>`).join('');

/* ---------- Gallery + lightbox ---------- */
const GALLERY = [
  { img: 'room', cap: 'A treatment suite, warm wood and linen', cls: 'wide' },
  { img: 'smoke', cap: 'Oud burning in the entrance lounge', cls: 'tall' },
  { img: 'pool', cap: 'The relaxation pool' },
  { img: 'towels', cap: 'Fresh linen for every guest' },
  { img: 'robe', cap: 'Mint tea in the quiet lounge' },
  { img: 'sauna', cap: 'Steam rising from the sauna stones' },
  { img: 'bowls', cap: 'Singing bowls used to close each ritual', cls: 'wide' },
  { img: 'candle', cap: 'A treatment room set for the evening', cls: 'wide' },
];
$('#gallery-grid').innerHTML = GALLERY.map((g, i) => `
  <button class="g-item reveal ${g.cls || ''}" type="button" data-idx="${i}" aria-label="Open photo: ${g.cap}">
    <img src="/img/${g.img}-480.webp" srcset="/img/${g.img}-480.webp 480w, /img/${g.img}-800.webp 800w" sizes="(min-width: 1100px) ${g.cls === 'wide' ? '50vw' : '25vw'}, (min-width: 640px) 33vw, 50vw" width="480" height="360" loading="lazy" alt="">
  </button>`).join('');
const lb = $('#lightbox');
let lbIdx = 0;
let lbReturn = null;
function showLb(i) {
  lbIdx = (i + GALLERY.length) % GALLERY.length;
  const g = GALLERY[lbIdx];
  $('#lb-img').src = `/img/${g.img}-800.webp`;
  $('#lb-img').alt = g.cap;
  $('#lb-cap').textContent = `${g.cap} · ${lbIdx + 1} / ${GALLERY.length}`;
}
$('#gallery-grid').addEventListener('click', (e) => {
  const b = e.target.closest('[data-idx]');
  if (!b) return;
  lbReturn = b;
  showLb(Number(b.dataset.idx));
  lb.showModal();
  $('#lb-close').focus();
});
$('#lb-close').addEventListener('click', () => lb.close());
$('#lb-prev').addEventListener('click', () => showLb(lbIdx - 1));
$('#lb-next').addEventListener('click', () => showLb(lbIdx + 1));
lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
lb.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') showLb(lbIdx + 1);
  if (e.key === 'ArrowLeft') showLb(lbIdx - 1);
});
lb.addEventListener('close', () => lbReturn?.focus());

/* ---------- Contact ---------- */
const cf = $('#contact-form');
cf.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') setErr(e.target, ''); });
cf.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = setErr(cf.name, cf.name.value.trim().length >= 2 ? '' : 'Please enter your name.');
  ok = setErr(cf.email, emailOk(cf.email.value.trim()) ? '' : 'Enter a valid email address.') && ok;
  ok = setErr(cf.message, cf.message.value.trim().length >= 10 ? '' : 'Please write a short message (10+ characters).') && ok;
  if (!ok) { cf.querySelector('[aria-invalid="true"]')?.focus(); return; }
  const msgs = load('oudstone.messages', []);
  msgs.push({ name: cf.name.value.trim(), email: cf.email.value.trim(), topic: cf.topic.value, message: cf.message.value.trim(), createdAt: new Date().toISOString() });
  save('oudstone.messages', msgs);
  const name = cf.name.value.trim().split(' ')[0];
  cf.reset();
  const note = $('#c-ok');
  note.textContent = `Thank you, ${name}. We will reply within one working day.`;
  note.hidden = false;
});

/* ---------- Init ---------- */
renderFilters();
renderServices(false);
renderOptions();
goTo(1, false);
observe();
