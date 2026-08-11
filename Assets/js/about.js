(function () {
  'use strict';

  var nums = document.querySelectorAll('.stat-num[data-count]');
  var started = false;

  function run() {
    if (started) return;
    started = true;
    nums.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var step = Math.max(1, Math.round(target / 40));
      var cur = 0;
      var timer = setInterval(function () {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(timer); }
        el.textContent = cur;
      }, 24);
    });
  }

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    run();
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(); obs.disconnect(); }
      });
    }, { threshold: 0.4 });
    var statsEl = document.querySelector('.about-stats');
    if (statsEl) obs.observe(statsEl);
  }

  if (window.VM) window.VM.reveal();
})();
