(function () {
  const header = document.querySelector('[data-header]');
  const drawer = document.querySelector('[data-drawer]');
  const overlay = document.querySelector('[data-overlay]');
  const menuBtn = document.querySelector('[data-menu-btn]');
  const closeBtn = document.querySelector('[data-close-drawer]');

  function toggleMenu(force) {
    if (!drawer || !overlay) return;
    const willOpen = typeof force === 'boolean' ? force : !drawer.classList.contains('open');
    drawer.classList.toggle('open', willOpen);
    overlay.classList.toggle('show', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
  }

  if (menuBtn) menuBtn.addEventListener('click', function () { toggleMenu(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { toggleMenu(false); });
  if (overlay) overlay.addEventListener('click', function () { toggleMenu(false); });

  document.querySelectorAll('[data-drawer-link]').forEach(function (link) {
    link.addEventListener('click', function () { toggleMenu(false); });
  });

  function setScrolledState() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 12);
  }

  setScrolledState();
  window.addEventListener('scroll', setScrolledState, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  function initWhatsAppLinks() {
    if (!window.SITE_CONFIG || !window.getWhatsAppLink) return;

    document.querySelectorAll('[data-whatsapp-products]').forEach(function (anchor) {
      anchor.href = window.getWhatsAppLink(window.SITE_CONFIG.whatsappMessages.products);
    });

    document.querySelectorAll('[data-whatsapp-opportunity]').forEach(function (anchor) {
      anchor.href = window.getWhatsAppLink(window.SITE_CONFIG.whatsappMessages.opportunity);
    });

    document.querySelectorAll('[data-whatsapp-general]').forEach(function (anchor) {
      anchor.href = window.getWhatsAppLink(window.SITE_CONFIG.whatsappMessages.general);
    });

    document.querySelectorAll('[data-whatsapp-number]').forEach(function (el) {
      el.textContent = '+27 83 379 4532';
    });
  }

  function initStoreLinks() {
    if (!window.SITE_CONFIG) return;
    const links = document.querySelectorAll('[data-store-link]');
    const hasStoreLink = window.SITE_CONFIG.foreverStoreUrl && window.SITE_CONFIG.foreverStoreUrl.trim().length > 0;

    links.forEach(function (link) {
      if (hasStoreLink) {
        link.href = window.SITE_CONFIG.foreverStoreUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Shop Through Nomhle';
      } else {
        link.href = window.getWhatsAppLink(window.SITE_CONFIG.whatsappMessages.products);
        link.textContent = 'Ask Nomhle to Order';
      }
    });
  }

  function initSocialLinks() {
    if (!window.SITE_CONFIG) return;

    const socialMap = {
      facebook: window.SITE_CONFIG.socialLinks.facebook,
      tiktok: window.SITE_CONFIG.socialLinks.tiktok
    };

    document.querySelectorAll('[data-social]').forEach(function (anchor) {
      const key = anchor.getAttribute('data-social');
      const value = socialMap[key];
      if (value && value.trim().length > 0) {
        anchor.href = value;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      } else {
        anchor.removeAttribute('href');
        anchor.setAttribute('aria-disabled', 'true');
        anchor.classList.add('is-unavailable');
      }
    });
  }

  function initYearAndCredit() {
    const year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();

    const lzLink = document.querySelector('[data-lz-link]');
    if (lzLink && window.SITE_CONFIG && window.SITE_CONFIG.lzSolutionsUrl) {
      lzLink.href = window.SITE_CONFIG.lzSolutionsUrl;
      lzLink.target = '_blank';
      lzLink.rel = 'noopener noreferrer';
    }
  }

  function initCanonicalFallback() {
    if (!window.SITE_CONFIG) return;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) return;
    if (canonical.getAttribute('href').indexOf('your-domain.example') !== -1 && window.SITE_CONFIG.canonicalBaseUrl) {
      const path = window.location.pathname.split('/').pop() || 'index.html';
      canonical.setAttribute('href', window.SITE_CONFIG.canonicalBaseUrl.replace(/\/$/, '') + '/' + path);
    }
    if (!window.SITE_CONFIG.canonicalBaseUrl && canonical.getAttribute('href').indexOf('your-domain.example') !== -1) {
      canonical.remove();
    }
  }

  function initHeroParallax() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const visual = document.querySelector('.hero-visual');
    if (!visual) return;

    window.addEventListener('scroll', function () {
      const y = Math.min(window.scrollY * 0.06, 18);
      visual.style.transform = 'translateY(' + y + 'px)';
    }, { passive: true });
  }

  initWhatsAppLinks();
  initStoreLinks();
  initSocialLinks();
  initYearAndCredit();
  initCanonicalFallback();
  initHeroParallax();
})();
