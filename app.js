(function () {
  'use strict';

  // Supported languages and markets for M-T440-V3.
  // LU and DK labels originate from data/turn2-locale-additions.json.
  var SUPPORTED_LANGS = ['en', 'nl'];
  var SUPPORTED_MARKETS = ['NL', 'DE', 'LU', 'DK'];
  var DEFAULT_LANG = 'en';    // safe default when lang is missing or invalid
  var DEFAULT_MARKET = 'NL';  // safe default when market is missing or invalid

  // This script is shared by / and /explainer/.
  var inExplainer = location.pathname.indexOf('/explainer/') !== -1;
  var base = inExplainer ? '../' : './';

  // Hydrate state from the query string. An invalid or missing language falls
  // back to English for display only; the URL is intentionally not rewritten
  // on load (open decision R24: canonicalization of invalid lang values).
  var params = new URLSearchParams(location.search);
  var lang = SUPPORTED_LANGS.indexOf(params.get('lang')) !== -1 ? params.get('lang') : DEFAULT_LANG;
  var market = SUPPORTED_MARKETS.indexOf(params.get('market')) !== -1 ? params.get('market') : DEFAULT_MARKET;

  var strings = {};

  // Build a query string from the CURRENT URL, overriding only lang/market so
  // unrelated keys (utm_source, ref, ...) are always preserved.
  function buildQuery() {
    var p = new URLSearchParams(location.search);
    p.set('lang', lang);
    p.set('market', market);
    return p.toString();
  }

  function syncUrl() {
    history.replaceState(null, '', location.pathname + '?' + buildQuery() + location.hash);
  }

  // Home <-> explainer links carry the full current query (lang, market and
  // unrelated keys) so state survives the round trip.
  function syncNavLinks() {
    var q = '?' + buildQuery();
    document.querySelectorAll('a[data-nav="explainer"]').forEach(function (a) { a.href = 'explainer/' + q; });
    document.querySelectorAll('a[data-nav="home"]').forEach(function (a) { a.href = '../' + q; });
  }

  function populateControls() {
    var langSel = document.getElementById('lang');
    var marketSel = document.getElementById('market');
    var i, opt;
    if (langSel) {
      langSel.innerHTML = '';
      for (i = 0; i < SUPPORTED_LANGS.length; i++) {
        opt = document.createElement('option');
        opt.value = SUPPORTED_LANGS[i];
        opt.textContent = SUPPORTED_LANGS[i].toUpperCase();
        langSel.appendChild(opt);
      }
      langSel.value = lang;
    }
    if (marketSel) {
      marketSel.innerHTML = '';
      for (i = 0; i < SUPPORTED_MARKETS.length; i++) {
        opt = document.createElement('option');
        opt.value = SUPPORTED_MARKETS[i];
        opt.textContent = strings['market_' + SUPPORTED_MARKETS[i]] || SUPPORTED_MARKETS[i];
        marketSel.appendChild(opt);
      }
      marketSel.value = market;
    }
  }

  function applyStrings() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (strings[key]) { el.textContent = strings[key]; }
    });
    var titleKey = document.body.getAttribute('data-title-key') || 'title';
    if (strings[titleKey]) { document.title = strings[titleKey]; }
    populateControls();
  }

  function loadStrings() {
    fetch(base + 'locales/' + lang + '.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { strings = data; applyStrings(); })
      .catch(function () { populateControls(); /* static English markup remains as fallback */ });
  }

  // Language changes words only: the selected market and every existing query
  // key are preserved. A language change must never select another market.
  function onLangChange(e) {
    var v = e.target.value;
    if (SUPPORTED_LANGS.indexOf(v) === -1) { return; }
    lang = v;
    syncUrl();
    syncNavLinks();
    loadStrings();
  }

  // Market changes context only: the language and all query keys are preserved.
  function onMarketChange(e) {
    var v = e.target.value;
    if (SUPPORTED_MARKETS.indexOf(v) === -1) { return; }
    market = v;
    syncUrl();
    syncNavLinks();
  }

  var langSel = document.getElementById('lang');
  var marketSel = document.getElementById('market');
  if (langSel) { langSel.addEventListener('change', onLangChange); }
  if (marketSel) { marketSel.addEventListener('change', onMarketChange); }

  loadStrings();
  syncNavLinks();
})();
