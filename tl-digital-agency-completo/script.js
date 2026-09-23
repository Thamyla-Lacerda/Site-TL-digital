// ============ MENU HAMBÚRGUER (MOBILE) ============
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Fecha o menu ao clicar num link (mobile)
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============ SCROLL SUAVE COM OFFSET DO HEADER ============
const header = document.querySelector('.site-header');

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId.length < 2) return;
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const headerHeight = header ? header.offsetHeight : 0;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  });
});

// ============ ANIMAÇÃO DOS NÚMEROS (CONTADOR) ============
const statNumbers = document.querySelectorAll('.stat-number');

function animateNumber(el) {
  const target = parseInt(el.dataset.target, 10) || 0;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${prefix}${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if ('IntersectionObserver' in window && statNumbers.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  statNumbers.forEach((el) => observer.observe(el));
} else {
  statNumbers.forEach(animateNumber);
}

// ============ ANO ATUAL NO RODAPÉ ============
const anoAtual = document.getElementById('anoAtual');
if (anoAtual) anoAtual.textContent = new Date().getFullYear();

// ============ COOKIES + GOOGLE ANALYTICS ============
// TODO: substituir pelo ID de medição real do Google Analytics (formato G-XXXXXXXXXX)
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

function loadGoogleAnalytics() {
  if (window.gaLoaded || GA_MEASUREMENT_ID.includes('XXXXXXXXXX')) return;
  window.gaLoaded = true;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}

function initCookieConsent() {
  const consent = localStorage.getItem('tl_cookie_consent');

  if (consent === 'accepted') {
    loadGoogleAnalytics();
    return;
  }
  if (consent === 'rejected') return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p>Usamos cookies para melhorar a sua experiência e, com a sua autorização, analisar o tráfego do site. <a href="cookies.html">Saiba mais</a>.</p>
    <div class="cookie-banner-actions">
      <button class="btn btn-outline btn-sm" id="cookieReject" type="button">Recusar</button>
      <button class="btn btn-accent btn-sm" id="cookieAccept" type="button">Aceitar</button>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('cookieAccept').addEventListener('click', () => {
    localStorage.setItem('tl_cookie_consent', 'accepted');
    loadGoogleAnalytics();
    banner.remove();
  });
  document.getElementById('cookieReject').addEventListener('click', () => {
    localStorage.setItem('tl_cookie_consent', 'rejected');
    banner.remove();
  });
}

initCookieConsent();
