(function () {
  'use strict';

  var PASS = 'volume';
  var FLAG = 'vm_unlocked';

  function isUnlocked() {
    try { return sessionStorage.getItem(FLAG) === '1'; } catch (e) { return false; }
  }

  function unlock() {
    try { sessionStorage.setItem(FLAG, '1'); } catch (e) { /* ignore */ }
  }

  function init() {
    var gate = document.getElementById('authGate');
    if (!gate) return;

    if (isUnlocked()) {
      gate.style.display = 'none';
      return;
    }

    var input = gate.querySelector('#authPass');
    var btn = gate.querySelector('#authBtn');
    var err = gate.querySelector('#authErr');

    function tryAuth() {
      if (!input.value) { input.focus(); return; }
      if (input.value.trim().toLowerCase() === PASS) {
        unlock();
        err.style.display = 'none';
        gate.classList.add('hide');
        setTimeout(function () { gate.style.display = 'none'; }, 500);
      } else {
        err.style.display = 'block';
        input.value = '';
        input.focus();
      }
    }

    if (btn) btn.addEventListener('click', tryAuth);
    if (input) {
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryAuth(); });
      input.focus();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
