/* ============================================================
   RC Impressoras — main.js
   Pure vanilla JS — no dependencies
   ============================================================ */

'use strict';

/* ── Nav scroll effect ── */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile Nav Toggle ── */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close on nav link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

/* ── Active nav link highlight ── */
(function () {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const isHome = (href === 'index.html' || href === './') && (path === '/' || path.endsWith('index.html') || path.endsWith('/'));
    const isMatch = href !== 'index.html' && href !== './' && path.includes(href.replace('.html', ''));
    if (isHome || isMatch) {
      link.classList.add('active');
    }
  });
})();

/* ── FAQ Accordion ── */
(function () {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      questions.forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        const ans = q.nextElementSibling;
        if (ans) ans.classList.remove('open');
      });
      // Toggle current
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        const ans = btn.nextElementSibling;
        if (ans) ans.classList.add('open');
      }
    });
  });

  // Open first by default if exists
  if (questions.length > 0) {
    questions[0].setAttribute('aria-expanded', 'true');
    const firstAns = questions[0].nextElementSibling;
    if (firstAns) firstAns.classList.add('open');
  }
})();

/* ── Intersection Observer — animate-in elements ── */
(function () {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.animate-in').forEach(el => el.style.opacity = '1');
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animate-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    io.observe(el);
  });
})();

/* ── Stats counter animation ── */
(function () {
  const stats = document.querySelectorAll('.stat-number[data-target]');
  if (!stats.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateStat = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1600;
    const start = performance.now();
    const sup = el.querySelector('span');

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.childNodes[0].textContent = prefix + value.toLocaleString('pt-BR') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    stats.forEach(animateStat);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => io.observe(el));
})();

/* ── Contact Form — Formsubmit.co submission ── */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Validate required fields; let browser native submit handle the POST
  form.addEventListener('submit', (e) => {
    const name  = (form.querySelector('[name="nome"]')?.value || '').trim();
    const tel   = (form.querySelector('[name="telefone"]')?.value || '').trim();
    const marca = (form.querySelector('[name="marca"]')?.value || '').trim();
    const prob  = (form.querySelector('[name="problema"]')?.value || '').trim();

    if (!name || !tel || !marca || !prob) {
      e.preventDefault();
      const first = form.querySelector('[name="nome"],[name="telefone"],[name="marca"],[name="problema"]');
      if (first) first.focus();
      return;
    }
    // Validation passed — allow native form submit to Formsubmit.co
  });

  // Show success message if redirected back with ?enviado=1
  if (window.location.search.includes('enviado=1')) {
    const wrap = form.closest('.contact-form-wrap') || form.parentElement;
    const banner = document.createElement('div');
    banner.setAttribute('role', 'alert');
    banner.style.cssText = 'background:#1a3a28;border:2px solid #25d366;border-left:6px solid #25d366;padding:1.2rem 1.4rem;margin-bottom:1.2rem;font-family:var(--font-heading);font-size:1rem;color:#fff;';
    banner.innerHTML = '<strong style="color:#25d366;">Mensagem enviada!</strong> Retornaremos em breve pelo WhatsApp ou e-mail.';
    wrap.insertBefore(banner, form);
    form.style.opacity = '0.4';
    form.style.pointerEvents = 'none';
  }
})();

/* ── Smooth anchor scroll (legacy support) ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
