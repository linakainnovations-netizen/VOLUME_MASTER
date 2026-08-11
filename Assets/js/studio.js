(function () {
  'use strict';

  var toastEl = document.getElementById('toast');
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }

  var STORAGE_KEY = 'vm_sessions';
  var FALLBACK_IMG = '../Assets/img/studio/stu.jpg';

  function defaultSessions() {
    return [
      {
        title: 'Recording Session — Kamo',
        date: '2026-08-08',
        tags: ['Recording'],
        desc: 'Tracking vocals for a brand new single. Full chain processing on the way in.',
        img: '../Assets/img/studio/stu.jpg'
      },
      {
        title: 'Mix & Master — Album Cut',
        date: '2026-08-03',
        tags: ['Mixing', 'Mastering'],
        desc: 'Final polish on a club-ready mix. Loud, clean, radio friendly.',
        img: '../Assets/img/studio/beats.jpg'
      },
      {
        title: 'Beat Making — 4 Track EP',
        date: '2026-07-28',
        tags: ['Production'],
        desc: 'Built 4 custom instrumentals for an artist’s upcoming EP.',
        img: '../Assets/img/volume.jpeg'
      }
    ];
  }

  function loadSessions() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultSessions();
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length ? parsed : defaultSessions();
    } catch (e) {
      return defaultSessions();
    }
  }

  function saveSessions(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  }

  var currentFilter = 'all';
  var sessions = loadSessions();

  function cardHTML(s, i) {
    var tags = s.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
    return '' +
      '<article class="session-card" data-index="' + i + '">' +
      '  <img src="' + s.img + '" alt="' + s.title + '" loading="lazy" ' +
      '       onerror="this.onerror=null;this.src=\'' + FALLBACK_IMG + '\';">' +
      '  <div class="session-body">' +
      '    <div class="session-tags">' + tags + '</div>' +
      '    <h3>' + s.title + '</h3>' +
      '    <div class="session-date">' + s.date + '</div>' +
      '    <p>' + s.desc + '</p>' +
      '  </div>' +
      '</article>';
  }

  function render() {
    var grid = document.getElementById('sessionGrid');
    if (!grid) return;
    var filtered = currentFilter === 'all'
      ? sessions
      : sessions.filter(function (s) { return s.tags.indexOf(currentFilter) !== -1; });

    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state">No sessions here yet. Add one below!</div>';
      return;
    }
    grid.innerHTML = filtered.map(function (s) { return cardHTML(s); }).join('');
  }

  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      render();
    });
  });

  var form = document.getElementById('sessionForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var img = document.getElementById('sImg').value.trim();
      var session = {
        title: document.getElementById('sTitle').value.trim(),
        date: document.getElementById('sDate').value,
        tags: [document.getElementById('sTags').value],
        desc: document.getElementById('sDesc').value.trim() || 'No description provided.',
        img: img || FALLBACK_IMG
      };
      sessions.unshift(session);
      saveSessions(sessions);
      render();
      form.reset();
      toast('Session added!');
    });
  }

  render();
})();
