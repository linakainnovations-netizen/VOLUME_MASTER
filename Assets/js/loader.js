(function () {
  'use strict';

  var inPages = location.pathname.indexOf('/pages/') !== -1;
  var pre = inPages ? '../' : '';

  function rewritePaths(root) {
    if (inPages) return;
    var refs = root.querySelectorAll('[href^="../"], [src^="../"]');
    Array.prototype.forEach.call(refs, function (el) {
      ['href', 'src'].forEach(function (attr) {
        if (el.getAttribute(attr) && el.getAttribute(attr).indexOf('../') === 0) {
          el.setAttribute(attr, el.getAttribute(attr).slice(3));
        }
      });
    });
  }

  function load(url, el, done) {
    if (!el) return;
    fetch(pre + url)
      .then(function (res) { return res.text(); })
      .then(function (html) {
        el.innerHTML = html;
        rewritePaths(el);
        if (done) done();
      })
      .catch(function () {
        el.innerHTML = '<div class="load-error">Could not load component.</div>';
      });
  }

  var headerEl = document.getElementById('site-header');
  var footerEl = document.getElementById('site-footer');

  load('constants/header.html', headerEl, function () {
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
      var header = headerEl.querySelector('.site-header');
      function closeNav() {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      }
      toggle.addEventListener('click', function () {
        var open = header.classList.toggle('nav-open');
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
  });

  load('constants/footer.html', footerEl, function () {
    var yearEl = footerEl.querySelector('#footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
