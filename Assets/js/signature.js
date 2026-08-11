(function () {
  'use strict';

  var KEY = 'vm_signature';

  function init(canvasEl, clearBtn, saveBtn, toastFn) {
    if (!canvasEl) return;
    var ctx = canvasEl.getContext('2d');
    var drawing = false;

    function pos(e) {
      var rect = canvasEl.getBoundingClientRect();
      var scaleX = canvasEl.width / rect.width;
      var scaleY = canvasEl.height / rect.height;
      var p = (e.touches && e.touches[0]) || e;
      return { x: (p.clientX - rect.left) * scaleX, y: (p.clientY - rect.top) * scaleY };
    }

    function start(e) {
      e.preventDefault();
      drawing = true;
      ctx.beginPath();
      var p = pos(e);
      ctx.moveTo(p.x, p.y);
    }

    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      var p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    function end() { drawing = false; }

    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    canvasEl.addEventListener('mousedown', start);
    canvasEl.addEventListener('mousemove', move);
    canvasEl.addEventListener('mouseup', end);
    canvasEl.addEventListener('mouseleave', end);
    canvasEl.addEventListener('touchstart', start, { passive: false });
    canvasEl.addEventListener('touchmove', move, { passive: false });
    canvasEl.addEventListener('touchend', end);

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
        if (toastFn) toastFn('Signature cleared');
      });
    }
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        try { localStorage.setItem(KEY, canvasEl.toDataURL('image/png')); } catch (e) { /* ignore */ }
        if (toastFn) toastFn('Signature saved — it will appear on your documents');
      });
    }

    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* ignore */ }
    if (saved) {
      var img = new Image();
      img.onload = function () {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.drawImage(img, 0, 0, canvasEl.width, canvasEl.height);
      };
      img.src = saved;
    }
  }

  function get() {
    try { return localStorage.getItem(KEY) || null; } catch (e) { return null; }
  }

  window.VM = window.VM || {};
  window.VM.signature = { init: init, get: get };
})();
