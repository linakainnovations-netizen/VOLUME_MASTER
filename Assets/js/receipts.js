(function () {
  'use strict';

  var toastEl = document.getElementById('toast');
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }

  var HISTORY_KEY = 'vm_receipts';
  var COUNTER_KEY = 'vm_receipt_count';

  function money(n) {
    var v = Math.round((n + Number.EPSILON) * 100) / 100;
    return 'K' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function todayStr() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function nextReceiptNumber() {
    var n = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10) + 1;
    localStorage.setItem(COUNTER_KEY, String(n));
    var d = new Date();
    return 'R-' + d.getFullYear() + '-' + String(n).padStart(3, '0');
  }

  function collectData() {
    return {
      number: document.getElementById('rNumber').value,
      date: document.getElementById('rDate').value,
      client: document.getElementById('rClient').value.trim(),
      amount: parseFloat(document.getElementById('rAmount').value) || 0,
      method: document.getElementById('rMethod').value,
      service: document.getElementById('rService').value,
      notes: document.getElementById('rNotes').value.trim(),
      balance: parseFloat(document.getElementById('rBalance').value) || 0
    };
  }

  function brandHeader() {
    var logo = '<img src="../Assets/img/logo.jpg">';
    return '' +
      '<div class="doc-head">' +
      '  <div class="doc-brand">' + logo +
      '    <div>' +
      '      <div class="doc-brand-name">THE VOLUME MASTER</div>' +
      '      <div class="doc-brand-sub">DJ C.O.B &middot; Music Producer &amp; DJ</div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="doc-title">RECEIPT</div>' +
      '</div>';
  }

  function buildDoc(d) {
    var paid = d.amount - d.balance;
    var statusHtml = d.balance > 0
      ? '<span class="r-status balance">Balance Due: ' + money(d.balance) + '</span>'
      : '<span class="r-status">PAID IN FULL</span>';

    var notesHtml = d.notes
      ? '<p class="doc-notes"><strong>Notes:</strong> ' + d.notes.replace(/</g, '&lt;') + '</p>'
      : '';

    var lines = [
      { label: 'Amount Received', value: money(paid) },
      { label: 'Payment Method', value: d.method },
      { label: 'Date', value: d.date }
    ];

    return brandHeader() +
      '<div class="receipt-hero">' +
      '  <div>' +
      '    <div class="r-paid">Payment Received From</div>' +
      '    <div class="r-amount">' + money(paid) + '</div>' +
      '  </div>' +
      '  ' + statusHtml +
      '</div>' +
      '<table class="doc-meta">' +
      '  <tr><td><strong>Receipt No:</strong> ' + d.number + '</td><td><strong>Client:</strong> ' + d.client + '</td></tr>' +
      '</table>' +
      '<table class="doc-table">' +
      '  <thead><tr><th>Description</th><th>Amount</th></tr></thead>' +
      '  <tbody>' +
      '    <tr><td>' + d.service + '</td><td><strong>' + money(d.amount) + '</strong></td></tr>' +
      '  </tbody>' +
      '</table>' +
      '<table class="doc-meta">' +
      lines.map(function (l) {
        return '<tr><td>' + l.label + '</td><td>' + l.value + '</td></tr>';
      }).join('') +
      '</table>' +
      notesHtml +
      '<div class="doc-footer">' +
      '  <div><strong>THE VOLUME MASTER</strong><br>+260 975 047 925<br>Djcobzambia@gmail.com</div>' +
      '  <div class="doc-contact">' +
      '    <div>instagram.com/djcob_zambia</div>' +
      '    <div>Zambia</div>' +
      '  </div>' +
      '</div>' +
      '<div class="doc-thanks">THANK YOU FOR YOUR BUSINESS!</div>';
  }

  function render() {
    var d = collectData();
    if (!d.client || d.amount <= 0) {
      document.getElementById('receiptDoc').innerHTML =
        '<div class="doc-placeholder">Enter the client name and amount paid to generate the receipt.</div>';
      return;
    }
    document.getElementById('receiptDoc').innerHTML = buildDoc(d);
  }

  function saveToHistory(d) {
    var list = [];
    try { list = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) { list = []; }
    list.unshift({ number: d.number, client: d.client, date: d.date, amount: d.amount });
    list = list.slice(0, 12);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
    renderHistory(list);
  }

  function renderHistory(list) {
    var wrap = document.getElementById('receiptHistory');
    if (!wrap) return;
    if (!list || !list.length) {
      wrap.innerHTML = '<div class="history-empty">No receipts generated yet.</div>';
      return;
    }
    wrap.innerHTML = list.map(function (r) {
      return '<div class="history-item">' +
        '<div><div class="h-title">' + r.client + '</div>' +
        '<div class="h-sub">' + r.number + ' &middot; ' + r.date + '</div></div>' +
        '<div class="h-sub">' + money(r.amount) + '</div>' +
        '</div>';
    }).join('');
  }

  document.getElementById('rNumber').value = nextReceiptNumber();
  document.getElementById('rDate').value = todayStr();

  document.getElementById('receiptForm').addEventListener('submit', function (e) {
    e.preventDefault();
    render();
    var d = collectData();
    if (d.client && d.amount > 0) {
      saveToHistory(d);
      toast('Receipt ' + d.number + ' generated');
    }
  });
  document.getElementById('printReceipt').addEventListener('click', function () {
    window.print();
  });

  renderHistory([]);
  try {
    renderHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'));
  } catch (e) { /* ignore */ }
})();
