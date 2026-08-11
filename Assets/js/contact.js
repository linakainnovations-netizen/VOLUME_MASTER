(function () {
  'use strict';

  var toastEl = document.getElementById('toast');
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(function () { toastEl.classList.remove('show'); }, 3000);
  }

  var form = document.getElementById('contactForm');

  function buildMessage() {
    var name = document.getElementById('cName').value.trim();
    var contact = document.getElementById('cContact').value.trim();
    var subject = document.getElementById('cSubject').value.trim();
    var msg = document.getElementById('cMsg').value.trim();
    var lines = ['*' + subject + '*'];
    lines.push('Name: ' + name);
    if (contact) lines.push('Contact: ' + contact);
    lines.push('Message: ' + msg);
    return lines.join('\n');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var message = encodeURIComponent(buildMessage());
      window.open('https://wa.me/260975047925?text=' + message, '_blank');
      toast('Opening WhatsApp with your message!');
    });

    document.getElementById('emailBtn').addEventListener('click', function () {
      var msg = buildMessage();
      var href = 'mailto:Djcobzambia@gmail.com?subject=' +
        encodeURIComponent(document.getElementById('cSubject').value) +
        '&body=' + encodeURIComponent(msg);
      window.location.href = href;
      toast('Opening your email app...');
    });
  }
})();
