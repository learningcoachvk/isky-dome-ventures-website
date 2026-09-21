/* ============================================================
   iSky Dome Ventures — Site Script
   ============================================================ */

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- HERO VIDEO (desktop only, saves mobile data) ---------- */
(function initHeroVideo() {
  const media = document.querySelector('.hero-media');
  const video = document.getElementById('heroVideo');
  if (!media || !video) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (reduceMotion || saveData || window.innerWidth < 860) return;

  video.load();
  video.addEventListener('canplay', () => {
    media.classList.add('video-ready');
    video.play().catch(() => {});
  }, { once: true });
})();

/* ---------- NAV ---------- */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
}));

/* ---------- REVEAL ON SCROLL ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------- STAT COUNTERS ---------- */
const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-count'), 10);
    const isYear = target > 1000;
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = isYear
        ? Math.floor(2018 + (target - 2018) * (p < 1 ? 0 : 1)) // year: no counting, just settle
        : Math.floor(eased * target);
      el.textContent = isYear ? (p < 1 ? Math.floor(2018 + eased * (target - 2018)) : target) : val;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(el => countObserver.observe(el));

/* ---------- TYPOLOGY TABS ---------- */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
function activateTab(id) {
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === id));
  tabPanels.forEach(p => p.classList.toggle('active', p.id === id));
}
tabBtns.forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));
document.querySelectorAll('[data-tab-link]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    activateTab(link.getAttribute('data-tab-link'));
    document.getElementById('typologies').scrollIntoView({ behavior: 'smooth' });
  });
});

/* ---------- MATERIAL ACCORDION ---------- */
document.querySelectorAll('.material-item').forEach(item => {
  item.querySelector('.material-head').addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    item.parentElement.querySelectorAll('.material-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ---------- PORTFOLIO FILTER ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const pItems = document.querySelectorAll('.p-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    pItems.forEach(item => {
      const match = filter === 'all' || item.dataset.cat === filter;
      item.classList.toggle('hidden', !match);
    });
  });
});

/* ---------- LIGHTBOX ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCap = document.getElementById('lightboxCap');
document.querySelectorAll('.p-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const title = item.querySelector('h4')?.textContent || '';
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCap.textContent = title;
    lightbox.classList.add('open');
  });
});
document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('open'); });

/* ---------- PROCESS SCROLL FILL ---------- */
const processList = document.querySelector('.process-list');
const processFill = document.getElementById('processFill');
const processSteps = document.querySelectorAll('.process-step');

function updateProcessFill() {
  if (!processList) return;
  const rect = processList.getBoundingClientRect();
  const vh = window.innerHeight;
  const total = rect.height;
  const progressed = Math.min(Math.max(vh * 0.75 - rect.top, 0), total);
  const pct = total > 0 ? (progressed / total) * 100 : 0;
  processFill.style.height = pct + '%';

  processSteps.forEach(step => {
    const sRect = step.getBoundingClientRect();
    if (sRect.top < vh * 0.78) step.classList.add('in');
  });
}
window.addEventListener('scroll', updateProcessFill, { passive: true });
window.addEventListener('resize', updateProcessFill);
updateProcessFill();

/* ---------- PILL GROUPS (single-select) ---------- */
document.querySelectorAll('.pill-group').forEach(group => {
  group.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      group.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
    });
  });
});

/* ---------- LEAD FORM -> WHATSAPP ---------- */
const leadForm = document.getElementById('leadForm');
const formSuccess = document.getElementById('formSuccess');
const waFallback = document.getElementById('waFallback');
const WHATSAPP_NUMBER = '916382577181';

leadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(leadForm);
  const name = (data.get('name') || '').trim();
  const phone = (data.get('phone') || '').trim();
  const email = (data.get('email') || '').trim();
  const state = (data.get('state') || '').trim();
  const district = (data.get('district') || '').trim();

  const getSelected = (group) => {
    const el = leadForm.querySelector(`[data-group="${group}"] .pill.selected`);
    return el ? el.textContent.trim() : '';
  };
  const terrain = getSelected('terrain');
  const typology = getSelected('typology');
  const purpose = getSelected('purpose');
  const readiness = getSelected('readiness');

  let msg = `Hi iSky Dome Ventures, I'd like to scope a project.\n\n`;
  msg += `Name: ${name}\n`;
  msg += `Phone: ${phone}\n`;
  if (email) msg += `Email: ${email}\n`;
  if (state || district) msg += `Location: ${[district, state].filter(Boolean).join(', ')}\n`;
  if (terrain) msg += `Terrain Type: ${terrain}\n`;
  if (typology) msg += `Preferred Typology: ${typology}\n`;
  if (purpose) msg += `Target Purpose: ${purpose}\n`;
  if (readiness) msg += `Site Readiness: ${readiness}\n`;

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  waFallback.href = waUrl;

  leadForm.style.display = 'none';
  formSuccess.classList.add('show');

  window.open(waUrl, '_blank', 'noopener');
});

/* ---------- FIELD VIDEO SHOWCASE ---------- */
(function initPhoneShowcase() {
  const cards = document.querySelectorAll('.phone-card');
  if (!cards.length) return;

  let activeVideo = null;

  cards.forEach(card => {
    const frame = card.querySelector('.phone-frame');
    const video = card.querySelector('video');
    const playBtn = card.querySelector('.phone-play');

    function play() {
      if (!video.src) video.src = video.dataset.src;
      if (activeVideo && activeVideo !== video) {
        activeVideo.pause();
        activeVideo.closest('.phone-card')?.classList.remove('playing');
      }
      video.play().then(() => {
        card.classList.add('playing');
        activeVideo = video;
      }).catch(() => {});
    }
    function pause() {
      video.pause();
      card.classList.remove('playing');
      if (activeVideo === video) activeVideo = null;
    }

    frame.addEventListener('click', () => {
      video.paused ? play() : pause();
    });
    playBtn.addEventListener('click', (e) => { e.stopPropagation(); video.paused ? play() : pause(); });
  });
})();

/* ---------- 3D TILT ON HOVER (typology media, portfolio, phone cards) ---------- */
(function initTilt() {
  const els = document.querySelectorAll('[data-tilt], .typology-media, .p-item');
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (isCoarse) return;

  els.forEach(el => {
    const strength = el.classList.contains('phone-card') ? 10 : 6;
    el.style.transformStyle = 'preserve-3d';
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${px * strength}deg) rotateX(${-py * strength}deg) translateZ(0)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  });
})();

/* ============================================================
   HERO — 3D WIREFRAME GEODESIC DOME (Three.js)
   ============================================================ */
(function initHeroDome() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = window.innerWidth;
  let height = window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
  camera.position.set(0, 0.6, 8.5);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  /* Build a geodesic-like wireframe sphere (icosahedron subdivision) */
  const group = new THREE.Group();
  const geo = new THREE.IcosahedronGeometry(2.6, 2);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xd8b877,
    wireframe: true,
    transparent: true,
    opacity: 0.38
  });
  const domeMesh = new THREE.Mesh(geo, wireMat);
  domeMesh.position.set(2.6, -1.1, 0);
  group.add(domeMesh);

  /* faint inner fill for depth */
  const fillMat = new THREE.MeshBasicMaterial({ color: 0x11151b, transparent: true, opacity: 0.18, side: THREE.BackSide });
  const fillMesh = new THREE.Mesh(geo.clone(), fillMat);
  fillMesh.position.copy(domeMesh.position);
  fillMesh.scale.setScalar(0.99);
  group.add(fillMesh);

  scene.add(group);

  /* particle field — sparse "star" dust */
  const starCount = 140;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 16;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 9;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xf7f4ec, size: 0.028, transparent: true, opacity: 0.5 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / width - 0.5);
    mouseY = (e.clientY / height - 0.5);
  }, { passive: true });

  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);

  let scrollFactor = 0;
  window.addEventListener('scroll', () => {
    scrollFactor = Math.min(window.scrollY / window.innerHeight, 1.4);
  }, { passive: true });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (!reduceMotion) {
      group.rotation.y = t * 0.08;
      group.rotation.x = Math.sin(t * 0.15) * 0.06;
      stars.rotation.y = t * 0.01;
    }

    camera.position.x += (mouseX * 1.1 - camera.position.x) * 0.03;
    camera.position.y += (0.6 - mouseY * 0.8 - camera.position.y) * 0.03;
    camera.lookAt(domeMesh.position.x * 0.3, 0, 0);

    group.position.y = -scrollFactor * 1.4;
    canvas.style.opacity = Math.max(0.85 - scrollFactor * 0.9, 0);

    renderer.render(scene, camera);
  }
  animate();
})();

/* ============================================================
   MINI 3D WIREFRAME ACCENTS (Materials + Connect sections)
   ============================================================ */
function createMiniDome(canvasId, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof THREE === 'undefined') return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w = canvas.clientWidth || 160, h = canvas.clientHeight || 160;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 50);
  camera.position.set(0, 0, 5.2);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);

  const geo = new THREE.IcosahedronGeometry(1.7, 1);
  const mat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.55 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  let visible = true;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { visible = e.isIntersecting; });
  }, { threshold: 0.05 });
  io.observe(canvas);

  function onResize() {
    w = canvas.clientWidth || w; h = canvas.clientHeight || h;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (visible && !reduceMotion) {
      const t = clock.getElapsedTime();
      mesh.rotation.y = t * 0.25;
      mesh.rotation.x = t * 0.12;
      renderer.render(scene, camera);
    } else if (visible) {
      renderer.render(scene, camera);
    }
  }
  animate();
}

createMiniDome('materials-canvas', 0xc9973f);
createMiniDome('connect-canvas', 0xc9973f);
