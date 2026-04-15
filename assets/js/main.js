
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const mobilePanel = document.querySelector('.mobile-panel');
let lastY = window.scrollY;

const updateHeader = () => {
  if (!header) return;
  const currentY = window.scrollY;
  header.classList.toggle('scrolled', currentY > 18);
  if (currentY > 140 && currentY > lastY && !document.body.classList.contains('menu-open')) {
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }
  lastY = currentY;
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (toggle && mobilePanel) {
  toggle.addEventListener('click', () => {
    const open = mobilePanel.classList.toggle('open');
    toggle.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    header.style.transform = 'translateY(0)';
  });

  mobilePanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobilePanel.classList.remove('open');
      toggle.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    });
  });
}

const revealItems = [...document.querySelectorAll('.reveal')];
const revealModes = ['up', 'left', 'right', 'zoom'];
revealItems.forEach((item, index) => {
  item.style.setProperty('--i', index % 8);
  if (!item.dataset.reveal) item.dataset.reveal = revealModes[index % revealModes.length];
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      const split = entry.target.querySelectorAll?.('.split-words');
      if (entry.target.classList.contains('split-words')) entry.target.classList.add('is-visible');
      split?.forEach(el => el.classList.add('is-visible'));
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.14,
  rootMargin: '0px 0px -40px 0px'
});

revealItems.forEach((item) => observer.observe(item));

document.querySelectorAll('.split-words').forEach((element) => {
  if (element.dataset.splitReady === 'true') return;
  const text = element.textContent.trim();
  if (!text) return;
  element.dataset.splitReady = 'true';
  const words = text.split(/(\s+)/).map((part, index) => {
    if (/^\s+$/.test(part)) return part;
    return `<span class="word" style="--word-index:${index};">${part}</span>`;
  }).join('');
  element.innerHTML = words;
});

const forms = document.querySelectorAll('[data-demo-form]');
forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('[data-form-status]');
    const button = form.querySelector('button[type="submit"]');
    const originalLabel = button ? button.dataset.originalLabel || button.textContent : '';
    if (button) {
      button.dataset.originalLabel = originalLabel;
      button.classList.add('is-sent');
      button.textContent = 'Mensaje preparado';
    }
    if (status) {
      status.textContent = 'Mensaje preparado. En un proyecto real aquí conectaría con tu email, WhatsApp o CRM.';
      status.style.color = 'rgba(103,232,249,.92)';
    }
    setTimeout(() => {
      form.reset();
      if (button) button.textContent = originalLabel;
    }, 1800);
  });
});

const video = document.querySelector('[data-hero-video]');
if (video) {
  video.play().catch(() => {
    video.setAttribute('controls', 'controls');
  });
}

const progress = document.createElement('div');
progress.className = 'scroll-progress';
document.body.appendChild(progress);
const setProgress = () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = total > 0 ? (window.scrollY / total) * 100 : 0;
  progress.style.width = `${Math.min(scrolled, 100)}%`;
};
setProgress();
window.addEventListener('scroll', setProgress, { passive: true });

const glow = document.createElement('div');
glow.className = 'cursor-glow';
document.body.appendChild(glow);
let glowX = window.innerWidth / 2;
let glowY = window.innerHeight / 2;
let targetX = glowX;
let targetY = glowY;
window.addEventListener('pointermove', (event) => {
  targetX = event.clientX;
  targetY = event.clientY;
});
const animateGlow = () => {
  glowX += (targetX - glowX) * 0.09;
  glowY += (targetY - glowY) * 0.09;
  glow.style.left = `${glowX}px`;
  glow.style.top = `${glowY}px`;
  requestAnimationFrame(animateGlow);
};
animateGlow();
window.addEventListener('mouseleave', () => glow.style.opacity = '0');
window.addEventListener('mouseenter', () => glow.style.opacity = '.6');

const tiltSelectors = '.value-item, .service-card, .demo-teaser, .price-card, .testimonial, .timeline-card, .contact-card, .portfolio-card, .shot';
document.querySelectorAll(tiltSelectors).forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.innerWidth < 900) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 6;
    const ry = (px - 0.5) * 8;
    card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

document.querySelectorAll('.magnetic').forEach((button) => {
  button.addEventListener('pointermove', (event) => {
    if (window.innerWidth < 900) return;
    const rect = button.getBoundingClientRect();
    const moveX = (event.clientX - rect.left - rect.width / 2) * 0.12;
    const moveY = (event.clientY - rect.top - rect.height / 2) * 0.18;
    button.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
  button.addEventListener('pointerleave', () => {
    button.style.transform = '';
  });
});

const parallaxTargets = document.querySelectorAll('.hero-media video, .hero-media img, .portfolio-media img, .page-hero .visual img, .barber-gallery img, .floating-preview img');
const parallax = () => {
  const viewportH = window.innerHeight;
  parallaxTargets.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const offset = ((rect.top + rect.height / 2) - viewportH / 2) / viewportH;
    element.style.transform = `scale(1.06) translate3d(0, ${offset * -18}px, 0)`;
  });
};
parallax();
window.addEventListener('scroll', parallax, { passive: true });
window.addEventListener('resize', parallax);


// === V3 premium enhancements ===
document.documentElement.classList.add('js-ready');
window.addEventListener('load', () => {
  setTimeout(() => document.body.classList.add('page-ready'), 320);
  setTimeout(() => document.body.classList.remove('is-preload'), 980);
});

const transitionLinks = document.querySelectorAll('a[href$=".html"], a[href^="demo-"]');
transitionLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || link.target === '_blank' || event.metaKey || event.ctrlKey) return;
    if (href.includes('mailto:') || href.includes('tel:')) return;
    event.preventDefault();
    document.body.classList.add('is-transitioning');
    setTimeout(() => { window.location.href = href; }, 520);
  });
});

// cursor dot
if (window.matchMedia('(pointer:fine)').matches) {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);
  let dx = window.innerWidth / 2, dy = window.innerHeight / 2, tx = dx, ty = dy;
  window.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; dot.style.opacity = '1'; });
  window.addEventListener('pointerleave', () => { dot.style.opacity = '0'; });
  const dotTick = () => {
    dx += (tx - dx) * 0.24;
    dy += (ty - dy) * 0.24;
    dot.style.left = `${dx}px`;
    dot.style.top = `${dy}px`;
    requestAnimationFrame(dotTick);
  };
  dotTick();
}

// ambient particles for hero sections
const particleHosts = document.querySelectorAll('.hero, .page-hero, .barber-hero');
particleHosts.forEach((host, idx) => {
  const wrap = document.createElement('div');
  wrap.className = 'ambient-particles';
  const count = window.innerWidth > 900 ? 18 : 10;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.style.left = `${Math.random() * 100}%`;
    p.style.bottom = `${-5 - Math.random() * 24}%`;
    p.style.setProperty('--delay', `${Math.random() * 12}s`);
    p.style.setProperty('--duration', `${11 + Math.random() * 12}s`);
    p.style.setProperty('--x-end', `${-40 + Math.random() * 80}px`);
    p.style.width = p.style.height = `${2 + Math.random() * 4}px`;
    wrap.appendChild(p);
  }
  host.appendChild(wrap);
});

// smarter stagger delays
const staggerParents = document.querySelectorAll('[data-stagger]');
staggerParents.forEach((parent) => {
  [...parent.children].forEach((child, index) => {
    child.style.setProperty('--i', index);
  });
});

// focus states
const fields = document.querySelectorAll('.field');
fields.forEach((field) => {
  const input = field.querySelector('input, textarea, select');
  if (!input) return;
  const sync = () => field.classList.toggle('is-active', document.activeElement === input || !!input.value);
  input.addEventListener('focus', sync);
  input.addEventListener('blur', sync);
  input.addEventListener('input', sync);
  sync();
});

// section active narrative
const sections = [...document.querySelectorAll('main section')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('is-active', entry.isIntersecting));
}, { threshold: 0.28 });
sections.forEach((section) => sectionObserver.observe(section));

// enhanced mouse parallax
const floatTargets = document.querySelectorAll('[data-float], .hero-sidecard, .visual, .portfolio-media, .floating-preview');
const heroDecor = document.querySelectorAll('.hero-ring, .hero-beam, .orb, .grid-glow');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; });
const mouseTick = () => {
  const cx = (mx / window.innerWidth - 0.5);
  const cy = (my / window.innerHeight - 0.5);
  floatTargets.forEach((el, i) => {
    if (window.innerWidth < 900) return;
    const factor = (i % 5 + 1) * 2.2;
    el.style.transform = `translate3d(${cx * factor}px, ${cy * factor * 0.8}px, 0)`;
  });
  heroDecor.forEach((el, i) => {
    const factor = (i % 4 + 1) * 8;
    el.style.transform = `translate3d(${cx * factor}px, ${cy * factor}px, 0)`;
  });
  requestAnimationFrame(mouseTick);
};
mouseTick();

// animate metrics if present
const metrics = document.querySelectorAll('.metric strong');
const metricObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.textContent.trim();
    const numeric = parseInt(raw, 10);
    if (!Number.isNaN(numeric)) {
      let frame = 0; const total = 36;
      const run = () => {
        frame += 1;
        const value = Math.round((numeric * frame) / total).toString().padStart(raw.length, '0');
        el.textContent = value;
        if (frame < total) requestAnimationFrame(run); else el.textContent = raw;
      };
      run();
    }
    metricObs.unobserve(el);
  });
}, { threshold: .7 });
metrics.forEach((el) => metricObs.observe(el));


// === V4 reviews + mascot ===
const reviewKey = 'atelier-reviews-v1';
const defaultReviews = [
  { name: 'Marta · Restaurante', role: 'Experiencia', rating: 5, text: 'Consiguió que la web pareciera tan cuidada como el local. La diferencia se nota en segundos.' },
  { name: 'Diego · Barbería', role: 'Precisión', rating: 5, text: 'No parecía una plantilla. Parecía una marca de verdad. Eso cambia cómo te perciben.' },
  { name: 'Andrea · Estudio wellness', role: 'Calma', rating: 5, text: 'Visualmente transmite mucho más nivel y mucha más confianza que una web normal.' }
];

const readReviews = () => {
  try {
    const raw = localStorage.getItem(reviewKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return [...parsed, ...defaultReviews].slice(0, 12);
  } catch (e) {
    return [...defaultReviews];
  }
};

const writeReview = (review) => {
  try {
    const raw = localStorage.getItem(reviewKey);
    const parsed = raw ? JSON.parse(raw) : [];
    parsed.unshift(review);
    localStorage.setItem(reviewKey, JSON.stringify(parsed.slice(0, 9)));
  } catch (e) {}
};

const stars = (n) => '★'.repeat(n) + '·'.repeat(Math.max(0, 5 - n));

document.querySelectorAll('[data-review-wall]').forEach((wall) => {
  const reviews = readReviews();
  wall.innerHTML = '';
  if (!reviews.length) {
    wall.innerHTML = '<div class="review-empty">Todavía no hay reseñas guardadas.</div>';
    return;
  }
  reviews.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'review-wall-item reveal in-view';
    article.innerHTML = `
      <strong>${item.name} <span class="review-stars">${stars(item.rating)}</span></strong>
      <div style="color:var(--cyan);font-size:.84rem;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">${item.role || 'Cliente'}</div>
      <p>${item.text}</p>
    `;
    wall.appendChild(article);
  });
});

document.querySelectorAll('[data-review-orbit]').forEach((wrap) => {
  const reviews = readReviews().slice(0, 5);
  wrap.innerHTML = '';
  reviews.forEach((item, index) => {
    const node = document.createElement('article');
    node.className = `review-node pos-${index + 1}`;
    node.innerHTML = `
      <p>“${item.text}”</p>
      <strong>${item.name}</strong>
      <small>${item.role || 'Cliente'} · ${stars(item.rating).replace(/·/g,'')}</small>
    `;
    wrap.appendChild(node);
  });
});

document.querySelectorAll('[data-review-form]').forEach((form) => {
  let selectedRating = 5;
  const ratingButtons = form.querySelectorAll('[data-rating]');
  const ratingInput = form.querySelector('input[name="rating"]');
  ratingButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedRating = Number(button.dataset.rating);
      if (ratingInput) ratingInput.value = selectedRating;
      ratingButtons.forEach((b) => b.classList.toggle('is-selected', b === button));
    });
  });
  if (ratingButtons[4]) ratingButtons[4].classList.add('is-selected');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fd = new FormData(form);
    const review = {
      name: fd.get('name')?.toString().trim() || 'Cliente',
      role: fd.get('role')?.toString().trim() || 'Cliente',
      text: fd.get('text')?.toString().trim() || '',
      rating: Number(fd.get('rating') || selectedRating || 5)
    };
    if (!review.text) return;
    writeReview(review);
    const status = form.querySelector('[data-review-status]');
    if (status) status.textContent = 'Reseña guardada en esta demo local. En producción se conectaría con base de datos o panel.';
    form.reset();
    selectedRating = 5;
    if (ratingInput) ratingInput.value = '5';
    ratingButtons.forEach((b, index) => b.classList.toggle('is-selected', index === 4));
    document.querySelectorAll('[data-review-wall], [data-review-orbit]').forEach((el) => {
      if (el.hasAttribute('data-review-wall')) {
        const reviews = readReviews();
        el.innerHTML = '';
        reviews.forEach((item) => {
          const article = document.createElement('article');
          article.className = 'review-wall-item';
          article.innerHTML = `
            <strong>${item.name} <span class="review-stars">${stars(item.rating)}</span></strong>
            <div style="color:var(--cyan);font-size:.84rem;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">${item.role || 'Cliente'}</div>
            <p>${item.text}</p>
          `;
          el.appendChild(article);
        });
      } else {
        const reviews = readReviews().slice(0, 5);
        el.innerHTML = '';
        reviews.forEach((item, index) => {
          const node = document.createElement('article');
          node.className = `review-node pos-${index + 1}`;
          node.innerHTML = `
            <p>“${item.text}”</p>
            <strong>${item.name}</strong>
            <small>${item.role || 'Cliente'} · ${stars(item.rating).replace(/·/g,'')}</small>
          `;
          el.appendChild(node);
        });
      }
    });
  });
});

const mascot = document.querySelector('[data-mascot]');
if (mascot) {
  const bubble = mascot.querySelector('.mascot-bubble');
  const bodyPage = document.body.dataset.page || 'index';
  const pages = {
    index: ['Hola, soy ATELIER.', 'Esto podría ser la primera impresión de tu negocio.'],
    servicios: ['Aquí no hay packs genéricos.', 'Cada servicio está pensado para elevar percepción y presencia.'],
    proceso: ['Un buen resultado también necesita un proceso claro.', 'Orden y dirección visual desde el inicio.'],
    demos: ['Cada demo tiene su propio carácter.', 'La idea no es enseñar plantillas. Es enseñar criterio.'],
    contacto: ['Si quieres, aquí empieza el proyecto.', 'Cuanto mejor se entienda tu negocio, mejor se diseña su web.'],
    'demo-barberia': ['Una demo no tiene por qué parecer una demo.', 'Puede sentirse como una marca real desde la primera pantalla.'],
    'reseñas': ['Aquí se va guardando la voz del proyecto.', 'Haz que las reseñas también formen parte de la experiencia.']
  };
  const queue = pages[bodyPage] || pages.index;
  let msgIndex = 0;
  let hideTimer = null;
  const showBubble = (title, text) => {
    if (!bubble) return;
    bubble.innerHTML = `<strong>${title}</strong><p>${text}</p>`;
    bubble.classList.add('is-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => bubble.classList.remove('is-visible'), 5200);
  };
  const nextMessage = () => {
    const first = queue[msgIndex % queue.length];
    const second = queue[(msgIndex + 1) % queue.length];
    showBubble(first, second);
    msgIndex += 1;
  };
  setTimeout(nextMessage, 1800);
  mascot.querySelector('.mascot-core')?.addEventListener('click', nextMessage);
  mascot.querySelector('.mascot-close')?.addEventListener('click', () => {
    mascot.setAttribute('data-hidden', 'true');
    try { sessionStorage.setItem('atelier-mascot-hidden', '1'); } catch (e) {}
  });
  try {
    if (sessionStorage.getItem('atelier-mascot-hidden') === '1') mascot.setAttribute('data-hidden', 'true');
  } catch (e) {}
  let mascotShownOnScroll = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 420 && !mascotShownOnScroll && mascot.getAttribute('data-hidden') !== 'true') {
      mascotShownOnScroll = true;
      nextMessage();
    }
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector("video");
  if(video){
    video.playbackRate = 0.5;
  }
});


// === V5 studio hero interaction ===
const hero = document.querySelector('.hero');
if (hero) {
  let hx = window.innerWidth * 0.5;
  let hy = window.innerHeight * 0.36;
  const moveHero = (clientX, clientY) => {
    const rect = hero.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const nx = rect.width ? x / rect.width : .5;
    const ny = rect.height ? y / rect.height : .5;
    hero.style.setProperty('--hero-mx', `${(nx * 100).toFixed(2)}%`);
    hero.style.setProperty('--hero-my', `${(ny * 100).toFixed(2)}%`);
    hero.style.setProperty('--cx', nx.toFixed(4));
    hero.style.setProperty('--cy', ny.toFixed(4));
  };
  moveHero(window.innerWidth * 0.52, window.innerHeight * 0.34);
  window.addEventListener('pointermove', (e) => moveHero(e.clientX, e.clientY), { passive: true });
  window.addEventListener('scroll', () => {
    const rect = hero.getBoundingClientRect();
    const drift = Math.max(-1, Math.min(1, rect.top / window.innerHeight));
    hero.style.setProperty('--hero-my', `${(36 + drift * -8).toFixed(2)}%`);
  }, { passive: true });
}

// smoother header state
const syncHeaderDepth = () => {
  if (!header) return;
  document.body.classList.toggle('header-deep', window.scrollY < 30);
};
syncHeaderDepth();
window.addEventListener('scroll', syncHeaderDepth, { passive: true });

// make mascot feel more alive
const mascotEl = document.querySelector('[data-mascot]');
if (mascotEl) {
  let phase = 0;
  const mascotTick = () => {
    phase += 0.018;
    mascotEl.style.transform = `translate3d(0, ${Math.sin(phase) * -4}px, 0)`;
    requestAnimationFrame(mascotTick);
  };
  mascotTick();
}


// Cursor parallax for hero
document.addEventListener("mousemove", (e) => {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  hero.style.transform = `translate(${x}px, ${y}px)`;
});

// Magnetic buttons
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    btn.style.transform = `translate(${x*0.2}px, ${y*0.2}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0,0)";
  });
});



// Inicio: movimiento sutil solo del elemento 3D
document.addEventListener("DOMContentLoaded", () => {
  const sigil = document.querySelector(".hero-sigil-3d");
  if (!sigil) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * 14;
    targetX = x;
    targetY = y;
  });

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || 0;
    targetY += Math.max(-8, Math.min(8, scrollY * -0.002));
  }, { passive: true });

  function animateSigil() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    sigil.style.transform = `translate3d(${currentX}px, calc(-50% + ${currentY}px), 0)`;
    requestAnimationFrame(animateSigil);
  }
  animateSigil();
});



// Segundo elemento 3D: movimiento distinto, más orbital y elástico
document.addEventListener("DOMContentLoaded", () => {
  const prism = document.querySelector(".hero-prism-3d");
  if (!prism) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  let mx = 0, my = 0, cx = 0, cy = 0;
  let t = 0;

  window.addEventListener("mousemove", (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 26;
    my = (e.clientY / window.innerHeight - 0.5) * 18;
  });

  function animatePrism() {
    t += 0.015;
    cx += (mx - cx) * 0.06;
    cy += (my - cy) * 0.06;

    const orbitX = Math.cos(t) * 8;
    const orbitY = Math.sin(t * 1.4) * 10;
    const rotY = cx * 0.8;
    const rotX = -cy * 0.8;

    prism.style.transform = `translate3d(${cx + orbitX}px, ${cy + orbitY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    requestAnimationFrame(animatePrism);
  }

  animatePrism();
});


function enviarWhatsAppDemo(event, tipo = '') {
  if (event) event.preventDefault();
  const form = event && event.target ? event.target : null;
  const nombre = form ? (form.querySelector('input[name="nombre"]')?.value || '') : '';
  const servicio = form ? (form.querySelector('input[name="servicio"]')?.value || '') : '';
  const mensaje = form ? (form.querySelector('textarea[name="mensaje"]')?.value || '') : '';
  const asunto = tipo === 'pizzeria'
    ? 'una demo o web inspirada en la pizzería'
    : 'una web para mi negocio';

  const texto = `Hola, soy ${nombre || 'un cliente'}. Me interesa ${asunto}.%0A` +
                `Servicio o idea: ${servicio || 'Por definir'}.%0A` +
                `Mensaje: ${mensaje || 'Quiero más información y presupuesto.'}`;

  window.open(`https://wa.me/34684299357?text=${texto}`, '_blank');
  return false;
}


function enviarEmailContacto(event) {
  if (event) event.preventDefault();
  const form = event && event.target ? event.target : null;
  const nombre = form ? (form.querySelector('input[name="nombre"], input[id*="nombre"], input[type="text"]')?.value || '') : '';
  const servicio = form ? (form.querySelector('input[name="servicio"], input[id*="servicio"]')?.value || '') : '';
  const mensaje = form ? (form.querySelector('textarea[name="mensaje"], textarea')?.value || '') : '';

  const subject = `Solicitud web - ${nombre || 'Nuevo contacto'}`;
  const body = `Hola, te escribo desde la web de ATELIER.%0A%0A` +
               `Nombre: ${nombre || 'No indicado'}%0A` +
               `Servicio o idea: ${servicio || 'No indicado'}%0A` +
               `Mensaje: ${mensaje || 'Sin mensaje'}%0A`;

  const mailto = `mailto:gpinegrad@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  window.location.href = mailto;
  return false;
}


function recogerDatosContacto() {
  const nombre = document.getElementById('nombre')?.value || '';
  const negocio = document.getElementById('negocio')?.value || '';
  const email = document.getElementById('email')?.value || '';
  const tipo = document.getElementById('tipo')?.value || '';
  const mensaje = document.getElementById('mensaje')?.value || '';
  return { nombre, negocio, email, tipo, mensaje };
}

function enviarSolicitudWhatsapp(event) {
  if (event) event.preventDefault();
  const { nombre, negocio, email, tipo, mensaje } = recogerDatosContacto();
  const texto = `Hola, soy ${nombre || 'un cliente'}. Quiero información sobre una web para mi negocio.%0A` +
                `Negocio: ${negocio || 'No indicado'}%0A` +
                `Email: ${email || 'No indicado'}%0A` +
                `Qué necesito: ${tipo || 'No indicado'}%0A` +
                `Mensaje: ${mensaje || 'Sin mensaje'}`;
  window.open(`https://wa.me/34684299357?text=${texto}`, '_blank');
  return false;
}

function enviarSolicitudEmail() {
  const { nombre, negocio, email, tipo, mensaje } = recogerDatosContacto();
  const subject = `Solicitud web - ${nombre || 'Nuevo contacto'}`;
  const body = `Hola, te escribo desde la web de ATELIER.%0A%0A` +
               `Nombre: ${nombre || 'No indicado'}%0A` +
               `Negocio: ${negocio || 'No indicado'}%0A` +
               `Email: ${email || 'No indicado'}%0A` +
               `Qué necesito: ${tipo || 'No indicado'}%0A` +
               `Mensaje: ${mensaje || 'Sin mensaje'}%0A`;
  window.location.href = `mailto:gpinegrad@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
}
