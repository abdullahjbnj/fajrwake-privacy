/* Fajr Wake website: picks the page language (Arabic RTL or English LTR) and keeps it across pages.
   Order: ?lang=ar|en in the address, then the visitor's earlier choice, then the browser's language.
   Loaded in <head> without defer, so the language is set before the page is drawn (no flash).
   Without JavaScript the "no-js" class stays and both languages are shown. */
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');

  function valid(l) { return l === 'ar' || l === 'en' ? l : null; }
  function stored() { try { return valid(localStorage.getItem('fajr-lang')); } catch (e) { return null; } }
  function store(l) { try { localStorage.setItem('fajr-lang', l); } catch (e) { /* private mode: ignore */ } }
  function fromUrl() { try { return valid(new URLSearchParams(location.search).get('lang')); } catch (e) { return null; } }
  function fromBrowser() {
    var list = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i]).toLowerCase();
      if (l.indexOf('ar') === 0) return 'ar';
      if (l.indexOf('en') === 0) return 'en';
    }
    return 'en';
  }

  function apply(lang) {
    root.setAttribute('data-lang', lang);
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    var t = root.getAttribute('data-title-' + lang);
    if (t) document.title = t;
    var buttons = document.querySelectorAll('.lang-switch button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', buttons[i].getAttribute('data-set-lang') === lang ? 'true' : 'false');
    }
    // Internal links carry the language, so a shared link opens in the language it was copied from.
    var links = document.querySelectorAll('a[data-internal]');
    for (var j = 0; j < links.length; j++) {
      var a = links[j], base = a.getAttribute('data-href') || a.getAttribute('href');
      a.setAttribute('data-href', base);
      var hash = '', at = base.indexOf('#');
      if (at >= 0) { hash = base.slice(at); base = base.slice(0, at); }
      a.setAttribute('href', base + (base.indexOf('?') >= 0 ? '&' : '?') + 'lang=' + lang + hash);
    }
  }

  var lang = fromUrl() || stored() || fromBrowser();
  if (fromUrl()) store(lang);
  apply(lang);

  document.addEventListener('DOMContentLoaded', function () {
    apply(root.getAttribute('data-lang'));
    // Phones: the contents list starts folded, so the page itself comes first.
    if (window.matchMedia && window.matchMedia('(max-width: 979px)').matches) {
      var tocs = document.querySelectorAll('details.toc');
      for (var t = 0; t < tocs.length; t++) tocs[t].removeAttribute('open');
    }
    // Copy email (support page): for devices where mailto: opens no email app.
    var copies = document.querySelectorAll('button[data-copy]');
    for (var c = 0; c < copies.length; c++) {
      copies[c].addEventListener('click', function () {
        var btn = this, text = btn.getAttribute('data-copy'), status = btn.parentNode.querySelector('.copy-status');
        function done(ok) {
          if (!ok) { // the browser refused: select the address so it can be copied by hand
            var shown = btn.parentNode.querySelector('strong');
            try { var r = document.createRange(); r.selectNodeContents(shown); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) { /* nothing to select */ }
          }
          if (status) status.textContent = btn.getAttribute(ok ? 'data-done' : 'data-fail');
        }
        function legacy() {
          var area = document.createElement('textarea');
          area.value = text; area.setAttribute('readonly', ''); area.style.position = 'fixed'; area.style.opacity = '0';
          document.body.appendChild(area); area.select();
          var ok = false;
          try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
          document.body.removeChild(area);
          done(ok);
        }
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, legacy);
        } else {
          legacy();
        }
      });
    }
    var buttons = document.querySelectorAll('.lang-switch button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        var l = this.getAttribute('data-set-lang');
        store(l);
        apply(l);
        try {
          var u = new URL(location.href);
          u.searchParams.set('lang', l);
          history.replaceState(null, '', u.pathname + u.search + u.hash);
        } catch (e) { /* old browser: the address keeps its old language */ }
      });
    }
  });
})();
