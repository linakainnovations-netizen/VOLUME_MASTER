(function () {
  'use strict';

  var toastEl = document.getElementById('toast');
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }

  var HISTORY_KEY = 'vm_quotes';
  var COUNTER_KEY = 'vm_quote_count';

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

  function nextQuoteNumber() {
    var n = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10) + 1;
    localStorage.setItem(COUNTER_KEY, String(n));
    var d = new Date();
    return 'Q-' + d.getFullYear() + '-' + String(n).padStart(3, '0');
  }

  function addLine(desc, qty, price) {
    var wrap = document.getElementById('lineItems');
    var row = document.createElement('div');
    row.className = 'line-item';
    row.innerHTML =
      '<div class="li-desc"><input type="text" class="li-desc-input" placeholder="Service e.g. Studio Session (per hour)" value="' + (desc || '') + '"></div>' +
      '<div class="li-qty"><input type="number" class="li-qty-input" min="1" value="' + (qty || 1) + '"></div>' +
      '<div class="li-price"><input type="number" class="li-price-input" min="0" step="0.01" placeholder="Price (K)" value="' + (price || '') + '"></div>' +
      '<button type="button" class="li-del" title="Remove" aria-label="Remove item">&times;</button>';
    row.querySelector('.li-del').addEventListener('click', function () { row.remove(); });
    wrap.appendChild(row);
  }

  function parseDiscount(input) {
    var raw = (input.value || '').trim();
    if (!raw) return { type: 'none', value: 0 };
    if (raw.slice(-1) === '%') {
      return { type: 'percent', value: parseFloat(raw) || 0 };
    }
    return { type: 'flat', value: parseFloat(raw) || 0 };
  }

  function collectData() {
    var items = Array.prototype.map.call(
      document.querySelectorAll('#lineItems .line-item'),
      function (row) {
        return {
          desc: row.querySelector('.li-desc-input').value.trim(),
          qty: parseInt(row.querySelector('.li-qty-input').value, 10) || 1,
          price: parseFloat(row.querySelector('.li-price-input').value) || 0
        };
      }
    ).filter(function (it) { return it.desc; });

    return {
      number: document.getElementById('qNumber').value,
      date: document.getElementById('qDate').value,
      client: document.getElementById('qClient').value.trim(),
      contact: document.getElementById('qClientContact').value.trim(),
      items: items,
      discount: parseDiscount(document.getElementById('qDiscount')),
      tax: parseFloat(document.getElementById('qTax').value) || 0,
      valid: document.getElementById('qValid').value || 14,
      notes: document.getElementById('qNotes').value.trim()
    };
  }

  function computeTotals(items, discount, tax) {
    var subtotal = items.reduce(function (s, it) { return s + it.qty * it.price; }, 0);
    var disc = discount.type === 'percent' ? subtotal * discount.value / 100 : discount.value;
    disc = Math.min(disc, subtotal);
    var afterDisc = subtotal - disc;
    var taxAmt = afterDisc * tax / 100;
    return {
      subtotal: subtotal,
      discount: disc,
      taxAmount: taxAmt,
      total: afterDisc + taxAmt
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
      '  <div class="doc-title">QUOTE</div>' +
      '</div>';
  }

  function buildDoc(data) {
    var t = computeTotals(data.items, data.discount, data.tax);

    var rows = data.items.map(function (it) {
      var lineTotal = it.qty * it.price;
      return '<tr>' +
        '<td>' + it.desc + '</td>' +
        '<td>' + it.qty + '</td>' +
        '<td>' + money(it.price) + '</td>' +
        '<td><strong>' + money(lineTotal) + '</strong></td>' +
        '</tr>';
    }).join('');

    var totalsHtml = '<div class="doc-totals">' +
      '<div class="total-row"><span>Subtotal</span><span>' + money(t.subtotal) + '</span></div>';
    if (t.discount > 0) {
      var discLabel = data.discount.type === 'percent'
        ? 'Discount (' + data.discount.value + '%)'
        : 'Discount';
      totalsHtml += '<div class="total-row"><span>' + discLabel + '</span><span>- ' + money(t.discount) + '</span></div>';
    }
    if (t.taxAmount > 0) {
      totalsHtml += '<div class="total-row"><span>Tax (' + data.tax + '%)</span><span>' + money(t.taxAmount) + '</span></div>';
    }
    totalsHtml += '<div class="total-row grand"><span>TOTAL</span><span>' + money(t.total) + '</span></div></div>';

    var validityHtml = data.valid
      ? '<p class="doc-notes"><strong>Validity:</strong> This quote is valid for ' + data.valid + ' days.</p>'
      : '';

    var notesHtml = data.notes
      ? '<p class="doc-notes"><strong>Notes:</strong> ' + data.notes.replace(/</g, '&lt;') + '</p>'
      : '';

    var contactHtml = data.contact
      ? '<td colspan="2"><strong>Client:</strong> ' + data.client + ' &middot; ' + data.contact.replace(/</g, '&lt;') + '</td>'
      : '<td colspan="2"><strong>Client:</strong> ' + data.client + '</td>';

    return brandHeader() +
      '<table class="doc-meta"><tr>' + contactHtml + '</tr>' +
      '<tr><td><strong>Quote No:</strong> ' + data.number + '</td><td><strong>Date:</strong> ' + data.date + '</td></tr></table>' +
      '<table class="doc-table">' +
      '<thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table>' +
      totalsHtml +
      notesHtml + validityHtml +
      '<div class="doc-footer">' +
      '  <div><strong>THE VOLUME MASTER</strong><br>+260 975 047 925<br>Djcobzambia@gmail.com</div>' +
      '  <div class="doc-contact">' +
      '    <div>instagram.com/djcob_zambia</div>' +
      '    <div>Zambia</div>' +
      '  </div>' +
      '</div>' +
      '<div class="doc-sign"><div class="sig-line"></div><div class="sig-label">Authorized Signature</div></div>';
  }

  function render() {
    var data = collectData();
    if (!data.items.length) {
      document.getElementById('quoteDoc').innerHTML =
        '<div class="doc-placeholder">Add at least one item to generate the quote.</div>';
      return;
    }
    document.getElementById('quoteDoc').innerHTML = buildDoc(data);
  }

  function saveToHistory(data, total) {
    var list = [];
    try { list = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) { list = []; }
    list.unshift({ number: data.number, client: data.client, date: data.date, total: total });
    list = list.slice(0, 12);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
    renderHistory(list);
  }

  function renderHistory(list) {
    var wrap = document.getElementById('quoteHistory');
    if (!wrap) return;
    if (!list || !list.length) {
      wrap.innerHTML = '<div class="history-empty">No quotes generated yet.</div>';
      return;
    }
    wrap.innerHTML = list.map(function (q) {
      return '<div class="history-item">' +
        '<div><div class="h-title">' + q.client + '</div>' +
        '<div class="h-sub">' + q.number + ' &middot; ' + q.date + '</div></div>' +
        '<div class="h-sub">' + money(q.total) + '</div>' +
        '</div>';
    }).join('');
  }

  document.getElementById('qNumber').value = nextQuoteNumber();
  document.getElementById('qDate').value = todayStr();
  addLine('Studio Session (per hour)', 1, 250);
  addLine('Beat Lease', 1, 150);

  document.getElementById('addLine').addEventListener('click', function () { addLine(); });
  document.getElementById('quoteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    render();
    var data = collectData();
    if (data.items.length) {
      var t = computeTotals(data.items, data.discount, data.tax);
      saveToHistory(data, t.total);
      toast('Quote ' + data.number + ' generated');
    }
  });
  document.getElementById('printQuote').addEventListener('click', function () {
    window.print();
  });

  renderHistory([]);
  try {
    renderHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'));
  } catch (e) { /* ignore */ }
})();
