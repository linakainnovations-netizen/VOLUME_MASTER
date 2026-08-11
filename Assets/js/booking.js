(function () {
  'use strict';

  var toastEl = document.getElementById('toast');
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(function () { toastEl.classList.remove('show'); }, 3000);
  }

  var form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('bName').value.trim();
    var contact = document.getElementById('bContact').value.trim();
    var service = document.getElementById('bService').value;
    var date = document.getElementById('bDate').value;
    var time = document.getElementById('bTime').value;
    var notes = document.getElementById('bNotes').value.trim();

    var lines = ['*New Booking Request — THE VOLUME MASTER*'];
    lines.push('Name: ' + name);
    lines.push('Contact: ' + contact);
    lines.push('Service: ' + service);
    if (date) lines.push('Date: ' + date + (time ? ' at ' + time : ''));
    if (notes) lines.push('Details: ' + notes);

    var message = encodeURIComponent(lines.join('\n'));
    window.open('https://wa.me/260975047925?text=' + message, '_blank');
    toast('Opening WhatsApp — press send to confirm your booking!');
  });
})();
