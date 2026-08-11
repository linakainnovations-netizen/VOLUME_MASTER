(function () {
  'use strict';

  function wireHeader() {
    var headerEl = document.querySelector('.site-header');
    if (!headerEl) return;

    var page = (location.pathname.split('/').pop() || 'main.html').toLowerCase();
    headerEl.querySelectorAll('.nav-link').forEach(function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (page === 'main.html') {
        if (href === 'main.html') a.classList.add('active');
      } else if (href === page || href === '../' + page) {
        a.classList.add('active');
      }
    });

    var toggle = headerEl.querySelector('.nav-toggle');
    if (toggle) {
      function closeNav() {
        headerEl.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      }
      toggle.addEventListener('click', function () {
        var open = headerEl.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('no-scroll', open);
      });
      var backdrop = headerEl.querySelector('.nav-backdrop');
      var closeBtn = headerEl.querySelector('.nav-close');
      if (backdrop) backdrop.addEventListener('click', closeNav);
      if (closeBtn) closeBtn.addEventListener('click', closeNav);
      headerEl.querySelectorAll('.nav-link').forEach(function (a) {
        a.addEventListener('click', closeNav);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
      });
    }
  }

  function wireFooter() {
    var footerEl = document.querySelector('.site-footer');
    if (!footerEl) return;
    var yearEl = footerEl.querySelector('#footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      wireHeader();
      wireFooter();
    });
  } else {
    wireHeader();
    wireFooter();
  }
})();
