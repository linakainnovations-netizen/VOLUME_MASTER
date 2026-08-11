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
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    headerEl.querySelectorAll('.nav-link').forEach(function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (page === 'index.html') {
        if (href === 'index.html') a.classList.add('active');
      } else if (href === page || href === '../' + page) {
        a.classList.add('active');
      }
    });
    var toggle = headerEl.querySelector('.nav-toggle');
    var list = headerEl.querySelector('.nav-list');
    if (toggle && list) {
      toggle.addEventListener('click', function () {
        var open = list.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  });

  load('constants/footer.html', footerEl, function () {
    var yearEl = footerEl.querySelector('#footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
