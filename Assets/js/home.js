(function () {
  'use strict';

  var toastEl = document.getElementById('toast');
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }

  var sampleSessions = [
    {
      title: 'Recording Session — Kamo',
      date: '2026-08-08',
      tags: ['Recording'],
      desc: 'Tracking vocals for a brand new single. Full chain processing on the way in.',
      img: 'Assets/img/studio/stu.jpg'
    },
    {
      title: 'Mix & Master — Album Cut',
      date: '2026-08-03',
      tags: ['Mixing', 'Mastering'],
      desc: 'Final polish on a club-ready mix. Loud, clean, radio friendly.',
      img: 'Assets/img/studio/beats.jpg'
    },
    {
      title: 'Beat Making — 4 Track EP',
      date: '2026-07-28',
      tags: ['Production'],
      desc: 'Built 4 custom instrumentals for an artist’s upcoming EP.',
      img: 'Assets/img/volume.jpeg'
    }
  ];

  function renderSessions() {
    var grid = document.getElementById('homeSessions');
    if (!grid) return;
    grid.innerHTML = sampleSessions.slice(0, 3).map(function (s) {
      return '' +
        '<article class="session-card">' +
        '  <img src="' + s.img + '" alt="' + s.title + '" loading="lazy">' +
        '  <div class="session-body">' +
        '    <div class="session-tags">' + s.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div>' +
        '    <h3>' + s.title + '</h3>' +
        '    <div class="session-date">' + s.date + '</div>' +
        '    <p>' + s.desc + '</p>' +
        '  </div>' +
        '</article>';
    }).join('');
  }

  var sampleBeats = [
    { title: 'Midnight Wave', meta: 'Trap · 140 BPM · F#m', price: '150', img: 'Assets/img/beat_market.jpg' },
    { title: 'Afro Soul', meta: 'Afrobeat · 100 BPM · C#m', price: '150', img: 'Assets/img/beats.jpg' },
    { title: 'Club Anthem', meta: 'Amapiano · 112 BPM · G#m', price: '200', img: 'Assets/img/beats/beater.jpg' }
  ];

  function renderBeats() {
    var strip = document.getElementById('homeBeats');
    if (!strip) return;
    strip.innerHTML = sampleBeats.map(function (b) {
      return '' +
        '<article class="beat-card">' +
        '  <div class="beat-cover-wrap">' +
        '    <img src="' + b.img + '" alt="' + b.title + '" loading="lazy">' +
        '    <button class="beat-play play-single" data-title="' + b.title + '" aria-label="Preview ' + b.title + '">&#9658;</button>' +
        '  </div>' +
        '  <div class="beat-info">' +
        '    <h3>' + b.title + '</h3>' +
        '    <div class="beat-meta">' + b.meta + '</div>' +
        '    <span class="beat-price">K' + b.price + '</span>' +
        '  </div>' +
        '</article>';
    }).join('');
  }

  function heroSlideshow() {
    var wrap = document.getElementById('heroSlideshow');
    if (!wrap) return;
    var images = [
      { src: 'Assets/img/home.jpeg', alt: 'DJ C.O.B in the studio — THE VOLUME MASTER' },
      { src: 'Assets/img/home1.jpg', alt: 'Studio session with DJ C.O.B' },
      { src: 'Assets/img/home2.jpg', alt: 'Recording with THE VOLUME MASTER' },
      { src: 'Assets/img/home3.jpg', alt: 'Studio vibes — DJ C.O.B' },
      { src: 'Assets/img/home4.jpg', alt: 'Making hits — THE VOLUME MASTER' }
    ];
    wrap.innerHTML = images.map(function (img, i) {
      var attrs = i === 0 ? ' fetchpriority="high"' : ' loading="lazy"';
      return '<img class="hero-slide' + (i === 0 ? ' active' : '') + '" src="' + img.src + '" alt="' + img.alt + '"' + attrs + '>';
    }).join('');
    var current = 0;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setInterval(function () {
      var slides = wrap.querySelectorAll('.hero-slide');
      if (!slides.length) return;
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, reduced ? 8000 : 4000);
  }

  function renderGallery() {
    var track = document.getElementById('galleryMarquee');
    if (!track) return;
    var items = [
      { img: 'Assets/img/home.jpeg', cap: 'The Studio' },
      { img: 'Assets/img/home1.jpg', cap: 'In the Studio' },
      { img: 'Assets/img/home2.jpg', cap: 'Session Time' },
      { img: 'Assets/img/home3.jpg', cap: 'Studio Vibes' },
      { img: 'Assets/img/home4.jpg', cap: 'Making Hits' }
    ];
    var html = items.concat(items).map(function (it) {
      return '<figure class="gallery-item">' +
        '  <img src="' + it.img + '" alt="' + it.cap + '" loading="lazy">' +
        '  <figcaption class="gallery-cap">' + it.cap + '</figcaption>' +
        '</figure>';
    }).join('');
    track.innerHTML = html;
  }

  function animateStats() {
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
    if (!('IntersectionObserver' in window)) { run(); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(); obs.disconnect(); } });
    }, { threshold: 0.4 });
    obs.observe(document.querySelector('.hero-stats'));
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.play-single');
    if (!btn) return;
    toast('Sample preview coming soon — "' + btn.getAttribute('data-title') + '"');
  });

  renderSessions();
  renderBeats();
  heroSlideshow();
  animateStats();
})();
