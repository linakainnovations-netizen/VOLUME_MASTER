(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal() {
    var els = document.querySelectorAll('.reveal:not(.in)');
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  function fadeImages() {
    if (!('IntersectionObserver' in window)) return;
    var imgs = document.querySelectorAll('img.fade-img:not(.loaded)');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('loaded');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '200px 0px' });
    imgs.forEach(function (img) { io.observe(img); });
  }

  function backToTop() {
    var btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&uarr;';
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
    document.body.appendChild(btn);

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var show = (window.scrollY || document.documentElement.scrollTop) > 400;
        btn.classList.toggle('show', show);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function preloader() {
    var el = document.getElementById('preloader');
    if (!el) return;
    function hide() {
      el.classList.add('hide');
      setTimeout(function () { el.style.display = 'none'; }, 600);
    }
    if (document.readyState === 'complete') {
      setTimeout(hide, 300);
    } else {
      window.addEventListener('load', function () { setTimeout(hide, 300); });
      setTimeout(hide, 2200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      reveal();
      fadeImages();
      backToTop();
      preloader();
    });
  } else {
    reveal();
    fadeImages();
    backToTop();
    preloader();
  }

  window.VM = window.VM || {};
  window.VM.reveal = reveal;
  window.VM.fadeImages = fadeImages;
})();
