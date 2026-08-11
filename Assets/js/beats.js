(function () {
  'use strict';

  var toastEl = document.getElementById('toast');
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }

  var beats = [
    { title: 'Midnight Wave', genre: 'Trap', bpm: '140', key: 'F#m', lease: 150, exclusive: 600, img: '../Assets/img/beat_market.jpg' },
    { title: 'Afro Soul', genre: 'Afrobeat', bpm: '100', key: 'C#m', lease: 150, exclusive: 600, img: '../Assets/img/beats.jpg' },
    { title: 'Club Anthem', genre: 'Amapiano', bpm: '112', key: 'G#m', lease: 200, exclusive: 800, img: '../Assets/img/beats/beater.jpg' },
    { title: 'Night Rider', genre: 'Trap', bpm: '150', key: 'Am', lease: 200, exclusive: 800, img: '../Assets/img/beats/show.jpg' },
    { title: 'Golden Hour', genre: 'R&B', bpm: '88', key: 'F#m', lease: 150, exclusive: 600, img: '../Assets/img/beats.jpg' },
    { title: 'Lusaka Lights', genre: 'Drill', bpm: '142', key: 'Dm', lease: 250, exclusive: 800, img: '../Assets/img/beats/beater.jpg' }
  ];

  var currentGenre = 'all';
  var maxPrice = 0;

  function cardHTML(b) {
    return '' +
      '<article class="beat-card">' +
      '  <div class="beat-cover-wrap">' +
      '    <img src="' + b.img + '" alt="' + b.title + '" loading="lazy">' +
      '    <span class="beat-genre">' + b.genre + '</span>' +
      '    <button class="beat-play play-single" data-title="' + b.title + '" aria-label="Preview ' + b.title + '">&#9658;</button>' +
      '  </div>' +
      '  <div class="beat-info">' +
      '    <h3>' + b.title + '</h3>' +
      '    <div class="beat-meta">' + b.bpm + ' BPM &middot; Key of ' + b.key + '</div>' +
      '    <div class="beat-pricing">' +
      '      <div class="lease-price">Lease<br><strong>K' + b.lease + '</strong></div>' +
      '      <div class="exclusive-price">Exclusive<br><strong>K' + b.exclusive + '</strong></div>' +
      '    </div>' +
      '    <div class="beat-actions">' +
      '      <button class="btn btn-neon btn-sm buy-lease" data-title="' + b.title + '">Buy Lease</button>' +
      '      <button class="btn btn-outline btn-sm buy-exclusive" data-title="' + b.title + '">Exclusive</button>' +
      '    </div>' +
      '  </div>' +
      '</article>';
  }

  function render() {
    var grid = document.getElementById('beatGrid');
    if (!grid) return;
    var list = beats.filter(function (b) {
      var okGenre = currentGenre === 'all' || b.genre === currentGenre;
      var okPrice = maxPrice === 0 || b.lease <= maxPrice;
      return okGenre && okPrice;
    });
    if (!list.length) {
      grid.innerHTML = '<div class="empty-state">No beats match those filters.</div>';
      return;
    }
    grid.innerHTML = list.map(cardHTML).join('');
  }

  document.querySelectorAll('#genreFilters .filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('#genreFilters .filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentGenre = btn.getAttribute('data-filter');
      render();
    });
  });

  document.getElementById('priceFilter').addEventListener('change', function () {
    maxPrice = parseInt(this.value, 10) || 0;
    render();
  });

  document.addEventListener('click', function (e) {
    var play = e.target.closest('.play-single');
    if (play) {
      toast('Audio preview coming soon — "' + play.getAttribute('data-title') + '"');
      return;
    }
    var lease = e.target.closest('.buy-lease');
    if (lease) {
      toast('Lease of "' + lease.getAttribute('data-title') + '" — contact me to complete payment');
      return;
    }
    var excl = e.target.closest('.buy-exclusive');
    if (excl) {
      toast('Exclusive rights for "' + excl.getAttribute('data-title') + '" — let\'s talk');
    }
  });

  render();
})();
