/* ==========================================================================
   China Cheat Sheet — demo app
   Hash router + render. No build step, no dependencies.

   Reading order, if you are new here:
     1. helpers            — esc / md / store
     2. language           — t() chrome, L() content, missing() banner
     3. progress + city    — persisted state
     4. pages              — home / scene / cards / faq / how / lang / city
     5. card screen        — the full-screen Chinese card you hand to someone
     6. router + events    — including the onboarding overlay
   ========================================================================== */

(function () {
  "use strict";

  var app = document.getElementById("app");
  var screen = document.getElementById("cardscreen");
  var onboard = document.getElementById("onboarding");

  /* The browser hands us an install prompt exactly once, and only on a secure
     origin. Chrome fires this on http://localhost too, so the local server
     path can be tested; file:// never fires it, which is why the install
     button falls back to telling the user where the browser menu is. */
  var installer = null;
  var canInstall = false;

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    installer = e;
    canInstall = true;
    paintInstallButton();
  });

  window.addEventListener("appinstalled", function () {
    installer = null;
    canInstall = false;
    paintInstallButton();
  });

  function paintInstallButton() {
    var b = document.getElementById("install-btn");
    if (b) b.hidden = !canInstall;
  }

  function install() {
    if (!installer) {
      alert(t("installHint"));
      return;
    }
    installer.prompt();
    installer.userChoice.then(function () {
      installer = null;
      canInstall = false;
      paintInstallButton();
    });
  }

  /* ---------------- helpers ---------------- */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* Resolves a {en,zh,ja,ko} field before escaping it. Every call site is
     supposed to pass L(v) already, but the failure mode of forgetting is
     silent — the page renders "[object Object]" — so the net stays. */
  function esc(s) {
    if (s != null && typeof s === "object") s = L(s);
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* minimal inline markdown: **bold** and `code` */
  function md(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  }

  var store = (function () {
    var ok = true;
    try { window.localStorage.setItem("__ccs", "1"); window.localStorage.removeItem("__ccs"); }
    catch (e) { ok = false; }
    var mem = {};
    return {
      get: function (k, fallback) {
        try {
          var raw = ok ? window.localStorage.getItem(k) : mem[k];
          return raw == null ? fallback : JSON.parse(raw);
        } catch (e) { return fallback; }
      },
      set: function (k, v) {
        var raw = JSON.stringify(v);
        try { if (ok) window.localStorage.setItem(k, raw); else mem[k] = raw; } catch (e) { /* quota / private mode */ }
      }
    };
  })();

  /* ---------------- language ----------------
     The Chinese line on a card is the *payload* — the sentence you hand to a
     Chinese speaker. It is never translated. Switching language changes the
     gloss printed under it and the interface around it, nothing else.
     A card is { zh: <payload>, en/ja/ko: <gloss> }. */

  var LANGS = [
    { code: "en", label: "English", short: "EN" },
    { code: "zh", label: "中文", short: "中" },
    { code: "ja", label: "日本語", short: "日" },
    { code: "ko", label: "한국어", short: "한" }
  ];

  function isLang(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return true;
    return false;
  }

  function detectLang() {
    var n = (navigator.language || "en").toLowerCase();
    if (n.indexOf("zh") === 0) return "zh";
    if (n.indexOf("ja") === 0) return "ja";
    if (n.indexOf("ko") === 0) return "ko";
    return "en";
  }

  var lang = (function () {
    var saved = store.get("ccs.lang", null);
    return isLang(saved) ? saved : detectLang();
  })();

  document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;

  function setLang(code) {
    if (!isLang(code)) return;
    lang = code;
    store.set("ccs.lang", code);
    document.documentElement.lang = code === "zh" ? "zh-CN" : code;
  }

  function langShort() {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === lang) return LANGS[i].short;
    return "EN";
  }

  /* interface chrome (buttons, headings) — keyed lookup, defined in data.js */
  function t(key) {
    var d = UI[lang] || {};
    if (d[key] != null) return d[key];
    return UI.en[key] != null ? UI.en[key] : key;
  }

  /* Every language of an interface key, for content that has to behave like a
     card group. `t()` returns only the current language, and the search index
     matches a group on its title in all four — so a group built out of `t()`
     would be the one group you cannot find by typing its name in another
     language. Only the two synthesised groups need this. */
  function tAll(key) {
    var out = {};
    for (var i = 0; i < LANGS.length; i++) {
      var d = UI[LANGS[i].code] || {};
      out[LANGS[i].code] = d[key] != null ? d[key] : UI.en[key];
    }
    return out;
  }

  /* one content field in four languages. Missing translation falls back to
     English so a partly-translated scene still reads end to end. */
  function L(v) {
    if (v == null) return "";
    if (typeof v === "string") return v;
    return v[lang] != null ? v[lang] : (v.en != null ? v.en : "");
  }

  /* Would this field fall back? Drives the "not translated yet" banner.
     A plain string means the field was authored in English only, so it is a
     fallback for every other language — that case matters as much as a text
     object with a hole in it. Get this backwards and the banner silently
     never appears, which is worse than showing it too often. */
  function missing(v) {
    if (v == null) return false;
    if (typeof v === "string") return lang !== "en";
    return v[lang] == null && v.en != null;
  }

  /* Does a language still fall back anywhere in the scene bodies? This is
     checked per language: Japanese and Korean can be complete while Chinese
     still intentionally falls back to English. */
  function bodyIncomplete(code) {
    if (code === "en") return false;
    for (var i = 0; i < SCENES.length; i++) {
      var s = SCENES[i];
      var v = [s.task, s.tip, s.disclaimer];
      (s.before || []).forEach(function (x) { v.push(x); });
      (s.steps || []).forEach(function (x) { v.push(x.t, x.d); });
      (s.mistakes || []).forEach(function (x) { v.push(x.m, x.w, x.d); });
      (s.planB || []).forEach(function (x) { v.push(x); });
      (s.trouble || []).forEach(function (x) { v.push(x.p, x.a); });
      if (s.showCard) v.push(s.showCard.title);
      for (var j = 0; j < v.length; j++) {
        if (typeof v[j] === "string" || (v[j] && v[j][code] == null && v[j].en != null)) return true;
      }
    }
    return false;
  }

  /* City arrival notes and the two extra guides are still English-only. Keep
     the language-picker warning honest even after the nine scene bodies have
     complete Japanese and Korean packs. */
  function exploreIncomplete(code) {
    return code !== "en" && (
      (typeof CITIES !== "undefined" && CITIES.length > 0) ||
      (typeof EXPLORE_GUIDES !== "undefined" && EXPLORE_GUIDES.length > 0)
    );
  }

  function anyMissing(vals) {
    for (var i = 0; i < vals.length; i++) if (missing(vals[i])) return true;
    return false;
  }

  /* every language of a field, for search — so "トイレ", "厕所" and "toilet"
     all find the same card */
  function allLangs(v) {
    if (v == null) return "";
    if (typeof v === "string") return v;
    return [v.en, v.zh, v.ja, v.ko].filter(Boolean).join(" ");
  }

  function cardHay(c) { return allLangs(c).toLowerCase(); }
  function groupHay(g) { return (allLangs(g.title) + " " + allLangs(g.hint)).toLowerCase(); }
  function sceneHay(s) {
    return [allLangs(s.title), allLangs(s.subtitle), allLangs(s.task), s.id].join(" ").toLowerCase();
  }

  /* A scene page is "partial" when any of its body fields has no translation
     for the current language. One banner for the page, never a marker per
     string — and never on the card screen, which is handed to a stranger. */
  function scenePartial(s) {
    var v = [s.title, s.subtitle, s.category, s.eta, s.task, s.tip, s.disclaimer];
    (s.before || []).forEach(function (x) { v.push(x); });
    (s.steps || []).forEach(function (x) { v.push(x.t, x.d); });
    (s.mistakes || []).forEach(function (x) { v.push(x.m, x.w, x.d); });
    (s.planB || []).forEach(function (x) { v.push(x); });
    (s.trouble || []).forEach(function (x) { v.push(x.p, x.a); });
    if (s.showCard) v.push(s.showCard.title);
    return anyMissing(v);
  }

  function partialBanner(s) {
    return scenePartial(s)
      ? '<section class="section"><p class="partial">' + esc(t("partialNotice")) + "</p></section>"
      : "";
  }

  /* ---------------- progress ----------------
     Progress is keyed by position ("taxi:3" = step 3 of the taxi scene), so
     adding or reordering any step silently re-attaches saved progress to a
     different step. Scene order changed in this version — drop the v1 keys
     once rather than show people the wrong steps ticked. */
  (function () {
    try {
      if (window.localStorage.getItem("ccs.v2.migrated")) return;
      window.localStorage.removeItem("ccs.done");
      window.localStorage.removeItem("ccs.checks");
      window.localStorage.setItem("ccs.v2.migrated", "1");
    } catch (e) { /* private mode — nothing to clean */ }
  })();

  var done = store.get("ccs.v2.done", {});   // { "taxi:3": true }
  function isDone(sceneId, i) { return !!done[sceneId + ":" + i]; }
  function toggleDone(sceneId, i) {
    var k = sceneId + ":" + i;
    if (done[k]) delete done[k]; else done[k] = true;
    store.set("ccs.v2.done", done);
  }

  var checks = store.get("ccs.v2.checks", {});
  function isChecked(sceneId, i) { return !!checks[sceneId + ":" + i]; }
  function toggleChecked(k, on) {
    if (on) checks[k] = true; else delete checks[k];
    store.set("ccs.v2.checks", checks);
  }

  /* The pre-flight checklist. Keyed by PREP id rather than by position, so
     reordering or inserting an item never moves a tick to a different row —
     the bug the position-keyed progress above had to be migrated for. */
  var prep = store.get("ccs.v2.prep", {});   // { documents: true }
  function isPrepDone(id) { return !!prep[id]; }
  function togglePrep(id, on) {
    if (on) prep[id] = true; else delete prep[id];
    store.set("ccs.v2.prep", prep);
  }
  function prepCount() {
    return PREP.filter(function (p) { return isPrepDone(p.id); }).length;
  }

  /* ---------------- city + location ----------------
     Coordinates are matched against the built-in boxes in data.js and then
     thrown away — no geocoding service, no network request, nothing leaves
     the device (docs/09: keep user-data collection minimal). */

  var city = store.get("ccs.city", null);            // "Shanghai"
  var loc = store.get("ccs.loc", null);              // { lat, lng }

  function cityByKey(k) {
    for (var i = 0; i < CITY_BOXES.length; i++) if (CITY_BOXES[i].city === k) return CITY_BOXES[i];
    return null;
  }

  function cityLabel(c) {
    return c ? { en: c.city, zh: c.zh, ja: c.ja, ko: c.ko } : null;
  }

  function matchCity(lat, lng) {
    for (var i = 0; i < CITY_BOXES.length; i++) {
      var c = CITY_BOXES[i];
      if (lat >= c.lat[0] && lat <= c.lat[1] && lng >= c.lng[0] && lng <= c.lng[1]) return c;
    }
    return null;
  }

  /* Why detection can fail, in the order it actually fails:
       file://  → Chrome refuses outright ("Only secure origins are allowed")
       denied   → the user said no, or a previous "no" is remembered
       nomatch  → we got a fix, but it is not near any city we ship
     None of these is an error worth shouting about. All three route to the
     manual picker — geolocation is a convenience, never a gate. */
  function detectCity(cb) {
    if (location.protocol === "file:") { cb(null, "insecure"); return; }
    if (!navigator.geolocation) { cb(null, "unsupported"); return; }
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var m = matchCity(pos.coords.latitude, pos.coords.longitude);
        if (!m) { cb(null, "nomatch"); return; }
        loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        city = m.city;
        store.set("ccs.loc", loc);
        store.set("ccs.city", city);
        cb(m, null);
      },
      function (err) { cb(null, err && err.code === 1 ? "denied" : "failed"); },
      { timeout: 9000, maximumAge: 600000 }
    );
  }

  function detectFailMsg(why) {
    if (why === "insecure") return t("locationNeedsHttps");
    if (why === "unsupported") return t("locationNeedsHttps");
    if (why === "denied") return t("locationDenied");
    return t("locationDenied");
  }

  /* The location card is the one thing on the site that is pure utility: two
     sentences you can show a stranger when you have no address to give. */
  function locationCards() {
    var c = cityByKey(city);
    var cn = c ? c.zh : "";
    var name = c ? L(cityLabel(c)) : "";
    var out = [];

    if (loc) {
      var coords = loc.lat.toFixed(5) + ", " + loc.lng.toFixed(5);
      out.push({
        zh: "你好，我迷路了。这是我现在的定位：" + coords + "。请帮我指一下路。",
        en: "I am lost. This is my current location. Please help me find my way.",
        ja: "道に迷いました。これが現在地です。道を教えてください。",
        ko: "길을 잃었어요. 여기가 제 현재 위치입니다. 길을 알려주세요."
      });
    }

    out.push({
      zh: "请带我去" + (cn || "市区") + "。" + (loc ? "我的定位是 " + loc.lat.toFixed(5) + ", " + loc.lng.toFixed(5) + "。" : ""),
      en: "Please take me to " + (name || "the city centre") + ".",
      ja: (name || "市内") + "までお願いします。",
      ko: (name || "시내") + "까지 가 주세요."
    });

    out.push({
      zh: "我不会说中文，请说慢一点，谢谢。",
      en: "I don't speak Chinese. Please speak slowly, thank you.",
      ja: "中国語が話せません。ゆっくり話してください。",
      ko: "중국어를 못합니다. 천천히 말해 주세요. 감사합니다."
    });

    return out;
  }

  function toast(msg) {
    var el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(function () { el.classList.add("on"); });
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("on"); }, 1600);
  }

  function sceneById(id) {
    for (var i = 0; i < SCENES.length; i++) if (SCENES[i].id === id) return SCENES[i];
    return null;
  }

  /* Scenes in the order a traveller actually meets them — arrival to daily
     life. Explicit array, same idea as CARD_ORDER: reorder there, not here. */
  function scenesInOrder() {
    return SCENE_ORDER.map(sceneById).filter(Boolean);
  }

  /* cards of a scene = merged card groups, de-duplicated by the Chinese
     payload (the same sentence may appear in more than one group) */
  function sceneCards(scene) {
    var seen = {}, out = [];
    (scene.cardGroups || []).forEach(function (g) {
      var grp = CARD_GROUPS[g];
      if (!grp) return;
      grp.cards.forEach(function (c) {
        if (seen[c.zh]) return;
        seen[c.zh] = 1;
        out.push(c);
      });
    });
    return out;
  }

  function go(hash) {
    var h = hash.charAt(0) === "#" ? hash : "#" + hash;
    /* Assigning the value location.hash already has fires no hashchange, so
       closing a card set and tapping the same set again used to do nothing —
       that route looked dead until you navigated somewhere else first. */
    if (h === location.hash) { render(); return; }
    location.hash = h;
  }

  /* ---------------- top bar ---------------- */

  function topbar(title, opts) {
    opts = opts || {};
    return '' +
      '<header class="topbar">' +
        (opts.back
          ? '<button class="topbar__back" data-go="' + opts.back + '" aria-label="' + esc(t("back")) + '">‹</button>'
          : '') +
        '<div class="topbar__title">' + esc(title) + "</div>" +
        '<div class="topbar__spacer"></div>' +
        (opts.badge ? '<span class="topbar__badge">' + esc(opts.badge) + "</span>" : "") +
        /* Rendered on every page, but `hidden` unless the browser actually
           offered an install prompt — a button that can never work is worse
           than no button. file:// and iOS Safari never fire it. */
        '<button class="topbar__install" id="install-btn" data-install="1"' +
          (canInstall ? "" : " hidden") + ">" + esc(t("installApp")) + "</button>" +
        '<button class="topbar__lang" data-go="/lang" aria-label="' + esc(t("language")) + '">' + esc(langShort()) + "</button>" +
      "</header>";
  }

  /* ---------------- pages ---------------- */

  function pageHome() {
    var tiles = scenesInOrder().map(function (s, i) {
      return '' +
        '<button class="tile" data-go="/s/' + s.id + '" style="--i:' + i + '">' +
          '<span class="tile__n">' + (i + 1) + "</span>" +
          (s.priority === "P0" ? '<span class="tile__p0">P0</span>' : "") +
          '<span class="tile__emoji">' + s.icon + "</span>" +
          '<span class="tile__title">' + esc(L(s.title)) + "</span>" +
          '<span class="tile__sub">' + esc(L(s.subtitle)) + "</span>" +
        "</button>";
    }).join("");

    var nums = EMERGENCY_NUMBERS.map(function (n) {
      return '<a href="tel:' + n.num + '"><div class="n">' + n.num + '</div><div class="l">' +
        esc(L(n.label)) + "</div></a>";
    }).join("");

    var pc = prepCount(), ptot = PREP.length;
    var ppct = ptot ? Math.round((pc / ptot) * 100) : 0;
    var prepTeaser =
      '<section class="section">' +
        '<button class="panel prep-teaser" data-go="/prep">' +
          '<span class="prep-teaser__icon" aria-hidden="true">🧳</span>' +
          '<span class="prep-teaser__body">' +
            '<span class="prep-teaser__t">' + esc(t("prepTitle")) + "</span>" +
            '<span class="prep-teaser__d">' + pc + " / " + ptot + " " + esc(t("prepDone")) + "</span>" +
            '<span class="prep-teaser__bar"><i style="width:' + ppct + '%"></i></span>' +
          "</span>" +
          '<span class="prep-teaser__go" aria-hidden="true">›</span>' +
        "</button>" +
      "</section>";

    var c = cityByKey(city);
    var cityChip = c
      ? '<button class="chip chip--city" data-go="/city">📍 ' + esc(t("citySet")) + " " + esc(L(cityLabel(c))) + "</button>"
      : '<button class="chip chip--city" data-go="/city">📍 ' + esc(t("cityTitle")) + "</button>";

    return '' +
      topbar("China Hand", { badge: "DEMO" }) +

      /* The lead block is the value proposition, not a destination. A travel
         hero ("your China travel companion / explore cities / plan my trip")
         briefly sat here and pushed every arrival task below the fold; the
         hero states what the tool is for instead. */
      '<section class="hero">' +
        '<div class="hero__brand"><span>🇨🇳</span> China Hand</div>' +
        "<h1>" + esc(t("heroH1")) + "</h1>" +
        "<p>" + md(t("heroP")) + "</p>" +
        '<div class="meta">' +
          '<span class="chip">' + esc(t("chipEnglishFirst")) + "</span>" +
          '<span class="chip">' + esc(t("chipNoDownload")) + "</span>" +
          '<span class="chip">' + esc(t("chipNoSignup")) + "</span>" +
          '<span class="chip">' + esc(t("chipOffline")) + "</span>" +
        "</div>" +
        '<div class="meta">' +
          cityChip +
          '<button class="chip chip--help" data-go="/help">🪪 ' + esc(t("helpCardChip")) + "</button>" +
          '<button class="chip chip--say" data-go="/mine">💬 ' + esc(t("sayTitle")) + "</button>" +
          '<button class="chip chip--how" data-go="/how">❓ ' + esc(t("howToUse")) + "</button>" +
        "</div>" +
      "</section>" +

      prepTeaser +

      '<div class="search">' +
        '<div class="search__box">' +
          '<input id="q" type="search" placeholder="' + esc(t("searchPlaceholder")) + '" autocomplete="off" aria-label="Search">' +
        "</div>" +
        '<div class="search__results" id="results" hidden></div>' +
      "</div>" +

      '<section class="section">' +
        '<div class="section__h"><h2>' + esc(t("wantTo")) + '</h2><a href="#/cards">' + esc(t("allHelpCards")) + "</a></div>" +
        '<div class="grid">' + tiles + "</div>" +
      "</section>" +

      /* The city module sits below the task grid on purpose. It is a lookup
         for names you may have to show someone, not a reason to open the app. */
      CPExplore.homeBlock(lang) +

      '<section class="section">' +
        '<div class="section__h"><h2>' + esc(t("emergency")) + '</h2><a href="#/emergency">' + esc(t("helpPage")) + "</a></div>" +
        '<div class="emergency-strip">' + nums + "</div>" +
      "</section>" +

      '<section class="section">' +
        '<div class="section__h"><h2>' + esc(t("beforeYouAsk")) + '</h2><a href="#/faq">' + esc(t("allFaq")) + "</a></div>" +
        '<div class="panel"><div class="trouble">' +
          troublerow("tip1t", "tip1b") +
          troublerow("tip2t", "tip2b") +
          troublerow("tip3t", "tip3b") +
        "</div></div>" +
      "</section>" +

      '<p class="footnote">' + esc(t("footnote")) + "</p>";
  }

  function troublerow(tk, bk) {
    return '<div class="trouble__row"><div class="trouble__p">' + esc(t(tk)) + '</div>' +
      '<div class="trouble__a">' + esc(t(bk)) + "</div></div>";
  }

  function pageScene(scene) {
    var total = scene.steps.length;
    var doneCount = scene.steps.filter(function (_, i) { return isDone(scene.id, i); }).length;
    var pct = total ? Math.round((doneCount / total) * 100) : 0;

    var before = (scene.before || []).map(function (b, i) {
      var ck = isChecked(scene.id, i) ? " checked" : "";
      return '<li><label><input type="checkbox" data-check="' + scene.id + ":" + i + '"' + ck +
        "><span>" + md(L(b)) + "</span></label></li>";
    }).join("");

    var steps = scene.steps.map(function (s, i) {
      return '<button class="step" data-step="' + scene.id + ":" + i + '" data-done="' +
        (isDone(scene.id, i) ? "1" : "0") + '" style="--i:' + i + '">' +
        '<span class="step__n"><span>' + (i + 1) + "</span></span>" +
        '<span class="step__body">' +
          '<span class="step__t">' + md(L(s.t)) + "</span>" +
          (s.d ? '<span class="step__d">' + md(L(s.d)) + "</span>" : "") +
        "</span>" +
      "</button>";
    }).join("");

    var mistakes = (scene.mistakes || []).length
      ? '<div class="panel"><div class="panel__h">' + esc(t("commonMistakes")) + '</div><div class="table-wrap"><table class="mistakes">' +
          "<thead><tr><th>" + esc(t("colMistake")) + "</th><th>" + esc(t("colWhy")) + "</th><th>" + esc(t("colDo")) + "</th></tr></thead><tbody>" +
          scene.mistakes.map(function (m) {
            return "<tr><td>" + md(L(m.m)) + "</td><td>" + md(L(m.w)) + "</td><td>" + md(L(m.d)) + "</td></tr>";
          }).join("") +
        "</tbody></table></div></div>"
      : "";

    var cards = sceneCards(scene);
    var cardList = cards.map(function (c, i) {
      return '<button class="cardrow" data-card="' + scene.id + ":" + i + '">' +
        '<span class="cardrow__txt">' +
          /* group icon is carrying the meaning here, so give it room */
          '<span class="cardrow__emoji">' + (groupIconFor(scene, c) || "🗣️") + "</span>" +
          '<span class="cardrow__lines">' +
            '<span class="cardrow__en">' + esc(L(c)) + "</span>" +
            /* the Chinese payload — deliberately last and largest */
            '<span class="cardrow__zh">' + esc(c.zh) + "</span>" +
          "</span>" +
        "</span>" +
        '<span class="cardrow__go">' + esc(t("show")) + "</span>" +
      "</button>";
    }).join("");

    var showCard = scene.showCard
      ? '<div class="panel panel--tip">' +
          '<div class="panel__h">' + esc(L(scene.showCard.title)) + "</div>" +
          '<button class="btn btn--primary btn--block" data-show="' + scene.id + '">' + esc(t("openFullScreen")) + "</button>" +
        "</div>"
      : "";

    var planB = (scene.planB || []).length
      ? '<div class="panel"><div class="panel__h">' + esc(t("planB")) + '</div><ul class="plain plain--plan">' +
          scene.planB.map(function (p) { return "<li>" + md(L(p)) + "</li>"; }).join("") +
        "</ul></div>"
      : "";

    var trouble = (scene.trouble || []).length
      ? '<div class="panel"><div class="panel__h">' + esc(t("trouble")) + '</div><div class="trouble">' +
          scene.trouble.map(function (x) {
            return '<div class="trouble__row"><div class="trouble__p">' + md(L(x.p)) +
              '</div><div class="trouble__a">' + md(L(x.a)) + "</div></div>";
          }).join("") +
        "</div></div>"
      : "";

    var sources = (scene.sources || []).length
      ? '<p class="footnote" style="padding:0 20px">' + esc(t("officialSources")) +
          scene.sources.map(function (s) {
            return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>";
          }).join(" · ") + "</p>"
      : "";

    var note = scene.disclaimer
      ? '<section class="section"><div class="panel panel--warn"><div class="panel__h">' + esc(t("pleaseNote")) + '</div>' +
        '<p style="margin:0;font-size:14px;line-height:1.55">' + md(L(scene.disclaimer)) + "</p></div></section>"
      : "";

    /* Jump links for the long scene pages. Built from what actually rendered,
       so a scene with no plan B simply gets no Plan B link.

       These are <button>s, not <a href="#...">, on purpose: render() reads
       location.hash as the route and ends with window.scrollTo(0, 0), so a
       bare "#steps" hash would look like an unknown route and yank the page
       back to the top before the jump could land. */
    var tocSections = [
      { key: "task", label: t("tocTask") },
      { key: "before", label: t("tocBefore") },
      { key: "steps", label: t("tocSteps") },
      { key: "cards", label: t("tocCards") }
    ];
    if (mistakes) tocSections.push({ key: "mistakes", label: t("tocMistakes") });
    if (planB) tocSections.push({ key: "planB", label: t("tocPlanB") });
    if (trouble) tocSections.push({ key: "trouble", label: t("tocTrouble") });
    if (note) tocSections.push({ key: "note", label: t("tocNote") });

    /* A single scrollable row, not a wrapping block. Counted up, an eight-item
       strip of chips ran to four rows on a phone. The visible "On this page"
       label is gone for the same reason — it ate the width the chips needed —
       and lives on as the nav's aria-label. */
    var toc = '<nav class="toc" aria-label="' + esc(t("onThisPage")) + '">' +
      tocSections.map(function (s) {
        return '<button class="toc__item" data-toc="' + s.key + '">' + esc(s.label) + "</button>";
      }).join("") +
      "</nav>";

    return '' +
      topbar(L(scene.title), { back: "/", badge: scene.priority }) +
      partialBanner(scene) +
      '<section class="section" id="sec-task">' +
        '<div class="panel panel--lead">' +
          '<div class="panel__h">' + esc(t("task")) + '</div>' +
          '<p class="task">' + md(L(scene.task)) + "</p>" +
          '<div class="meta">' +
            '<span class="chip">' + esc(L(scene.category)) + "</span>" +
            '<span class="chip">' + esc(L(scene.eta)) + "</span>" +
            '<span class="chip">' + scene.steps.length + " " + esc(t("steps")) + "</span>" +
            '<span class="chip">Last updated ' + esc(scene.lastUpdated) + "</span>" +
          "</div>" +
        "</div>" +
      "</section>" +

      toc +

      '<section class="section" id="sec-before">' +
        '<div class="panel">' +
          '<div class="panel__h">' + esc(t("beforeYouStart")) + '</div>' +
          '<ul class="checklist">' + before + "</ul>" +
        "</div>" +
        (scene.tip
          ? '<div class="panel panel--tip"><div class="panel__h">' + esc(t("tipLabel")) + '</div>' +
            '<p style="margin:0;font-size:14.5px;line-height:1.55">' + md(L(scene.tip)) + "</p></div>"
          : "") +
      "</section>" +

      '<section class="section" id="sec-steps">' +
        '<div class="panel">' +
          '<div class="panel__h">' + esc(t("stepByStep")) + '<span class="n" id="stepcount">' + doneCount + " / " + total + " " + esc(t("done")) + "</span></div>" +
          '<div class="steps__progress"><i id="stepbar" style="width:' + pct + '%"></i></div>' +
          '<div class="steps">' + steps + "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section" id="sec-cards"><div class="panel">' +
        '<div class="panel__h">' + esc(t("showThisScreen")) + "</div>" +
        showCard +
        "<div>" + '<button class="btn btn--block btn--loc" data-loc="1">' + esc(t("showLocationCard")) + "</button>" + "</div>" +
        '<div class="panel__h" style="margin-top:18px">' + esc(t("usefulCards")) + '<span class="n">' + cards.length + " " + esc(t("cards")) + "</span></div>" +
        "<div>" + cardList + "</div>" +
      "</div></section>" +

      /* These four wrappers are conditional. They used to be emitted empty
         whenever a scene had no such section, which left dead <section> nodes
         in the DOM; now that each carries an id, an empty one would also be a
         target the table of contents has no link for. */
      (mistakes ? '<section class="section" id="sec-mistakes">' + mistakes + "</section>" : "") +
      (planB ? '<section class="section" id="sec-planB">' + planB + "</section>" : "") +
      (trouble ? '<section class="section" id="sec-trouble">' + trouble + "</section>" : "") +
      (note ? '<section class="section" id="sec-note">' + note + "</section>" : "") +

      sources +

      '<section class="section">' +
        '<div class="btn-row stale">' +
          '<button class="btn btn--sm" data-stale="' + scene.id + '">' + esc(t("outdated")) + "</button>" +
          '<button class="btn btn--sm" data-go="/">' + esc(t("backToTasks")) + "</button>" +
        "</div>" +
      "</section>";
  }

  /* which group did this card come from? gives the row its icon */
  function groupIconFor(scene, card) {
    var groups = scene.cardGroups || [];
    for (var i = 0; i < groups.length; i++) {
      var g = CARD_GROUPS[groups[i]];
      if (!g) continue;
      for (var j = 0; j < g.cards.length; j++) if (g.cards[j].zh === card.zh) return g.icon;
    }
    return null;
  }

  /* ---------------- my cards ----------------
     Two keys, both under the `ccs.` prefix that already holds progress, so the
     two travel together. They go through `store` rather than a bare
     localStorage call because these are sentences the user typed by hand — a
     private-mode session must degrade to "lost on reload", never to an
     exception that swallows the card they just wrote.

     The Chinese sentence is the key. It is already a card's identity
     everywhere else (sceneCards de-duplicates on it, groupIconFor matches on
     it) and none of the 96 built-in cards carry an id — introducing one would
     mean editing all of them. The cost: rewriting a built-in sentence later
     orphans its favourite. That is why an unresolvable key is skipped on read
     and never written back — one bad match must not empty someone's shelf.

     `favs` is an ordered array. It is the favourite set AND the user's custom
     order — one list, two features, no second field to keep in sync. */

  function asArray(v) {
    return Object.prototype.toString.call(v) === "[object Array]" ? v : [];
  }

  function myCards() {
    return asArray(store.get("ccs.cards.mine", [])).filter(function (c) {
      return c && typeof c.zh === "string" && c.zh.trim();
    });
  }
  function setMyCards(list) { store.set("ccs.cards.mine", list); }

  function favKeys() {
    return asArray(store.get("ccs.cards.favs", [])).filter(function (k) {
      return typeof k === "string";
    });
  }
  function setFavKeys(list) { store.set("ccs.cards.favs", list); }

  /* ---------------- offline phrase bank ----------------
     PHRASE_BANK (demo/phrases.js) is a curated English → Chinese list. It is a
     lookup, not a translator: it never produces Chinese that a person did not
     write and check first. That is the whole point — the reader is standing in
     China, often with no usable network, and a static site has nowhere to hide
     an API key. A curated bank is the only honest way to get Chinese on screen
     in that moment.

     Templates carry a %s slot plus a list of fills. Expanding them here means
     the matcher, the favourites resolver and the card screen all work on one
     flat list of ordinary {zh, en} cards and none of them has to know that
     templates exist. Built once and cached: the bank is static data. */
  var _bankAll = null;
  function bankAllCards() {
    if (_bankAll) return _bankAll;
    /* Bare identifier, not window.PHRASE_BANK: phrases.js declares it with
       `const` at top level, which a classic script puts in the global lexical
       scope but *not* on window — so window.PHRASE_BANK is undefined and the
       whole bank would silently come back empty. typeof-guarded so that a
       missing or failed phrases.js degrades to "no matches" instead of a
       ReferenceError that would take the page down. */
    var list = (typeof PHRASE_BANK !== "undefined" && PHRASE_BANK) ? PHRASE_BANK : [];
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (!e || !e.zh || !e.en) continue;
      var base = e.keys || "";
      if (e.fill && e.fill.length) {
        for (var j = 0; j < e.fill.length; j++) {
          var f = e.fill[j];
          if (!f || !f.zh) continue;
          out.push({
            zh: e.zh.replace("%s", f.zh),
            en: e.en.replace("%s", f.en),
            /* the fill's own synonyms join the template's, so "shellfish"
               reaches "我对海鲜过敏。" as readily as "seafood" does */
            keys: base + " " + (f.keys || ""),
            icon: e.icon, cat: e.cat
          });
        }
      } else {
        out.push({ zh: e.zh, en: e.en, keys: base, icon: e.icon, cat: e.cat });
      }
    }
    _bankAll = out;
    return out;
  }

  /* Lowercase, drop punctuation, collapse runs of whitespace. Chinese
     characters survive — a user who types 洗手间 should find the card too. */
  function normQ(s) {
    return String(s == null ? "" : s).toLowerCase()
      .replace(/[^a-z0-9一-鿿]+/g, " ")
      .replace(/^\s+|\s+$/g, "")
      .replace(/\s+/g, " ");
  }
  function qTokens(q) { return q ? q.split(" ").filter(Boolean) : []; }

  /* Words that carry no meaning on their own. Without this list a query scores
     against dozens of cards on "is"/"to"/"my"/"do" alone, the tie breaks on
     bank order, and the top row is effectively arbitrary — "please take a photo
     of me" used to return 请带我去这个地址。 because please/take/me outscored the
     one word that mattered. Negations are deliberately NOT in here: "no sugar"
     and "not spicy" turn on them. */
  var SAY_STOP = {
    a: 1, an: 1, the: 1, is: 1, are: 1, am: 1, was: 1, were: 1, be: 1, been: 1,
    to: 1, of: 1, in: 1, on: 1, at: 1, for: 1, from: 1, with: 1, and: 1, or: 1,
    i: 1, me: 1, my: 1, mine: 1, we: 1, us: 1, our: 1, you: 1, your: 1,
    he: 1, she: 1, they: 1, it: 1, its: 1, this: 1, that: 1, these: 1, those: 1,
    do: 1, does: 1, did: 1, can: 1, could: 1, would: 1, will: 1, shall: 1,
    have: 1, has: 1, had: 1, there: 1, here: 1, please: 1, want: 1, like: 1,
    some: 1, any: 1, get: 1, go: 1, give: 1, make: 1, know: 1, would_like: 1
  };

  /* How many cards each word appears in. A word that shows up everywhere ("pay",
     "hotel") tells us almost nothing about which card is meant; a word that
     shows up once ("alipay", "vegetarian", "stomach") is nearly the whole
     answer. Weighting by rarity is what stops a pile of generic words from
     drowning out the one word the traveller actually cares about. Built once
     over the flat bank and cached. */
  var _bankIndex = null;
  function bankIndex() {
    if (_bankIndex) return _bankIndex;
    var all = bankAllCards(), df = {};
    for (var i = 0; i < all.length; i++) {
      var toks = (normQ(all[i].en) + " " + normQ(all[i].keys)).split(" ");
      var seen = {};
      for (var j = 0; j < toks.length; j++) {
        var t = toks[j];
        if (!t || t.length < 2 || SAY_STOP[t] || seen[t]) continue;
        seen[t] = 1;
        df[t] = (df[t] || 0) + 1;
      }
    }
    _bankIndex = { df: df, n: all.length };
    return _bankIndex;
  }

  /* Weight of one matched word: rare is worth a lot, ubiquitous is worth almost
     nothing. df === n gives zero on purpose — a word on every card cannot help
     choose between them. */
  function sayWeight(tok) {
    var idx = bankIndex();
    var df = idx.df[tok] || 1;
    return Math.round(30 * Math.log(idx.n / df));
  }

  /* A query word counts as found if it is the stored word, or if one is a stem
     of the other — "allergic"/"allergy", "reserve"/"reservation" are the same
     intent and a traveller will type either. The length guard keeps that from
     turning into substring soup. Returns the matched word so the caller can
     weight by that word's rarity rather than the query's. */
  function matchWord(list, t) {
    var stem = null;
    for (var i = 0; i < list.length; i++) {
      var w = list[i];
      if (!w) continue;
      if (w === t) return w;
      if (!stem && t.length >= 4 && w.length >= 4 && (w.indexOf(t) === 0 || t.indexOf(w) === 0)) stem = w;
    }
    return stem;
  }

  /* Zero means "no signal at all". The four fixed bonuses keep the ordering
     predictable and diagnosable by eye — an exact sentence always beats a
     phrase, which always beats loose word overlap. Below those, the score is
     the sum of its matched words' rarity weights, so the ranking is driven by
     whichever word in the query is most distinctive. */
  function sayScore(c, q, qRaw) {
    if (!q) return 0;
    var zh = String(c.zh || "");
    if (qRaw && zh.indexOf(qRaw) > -1) return 9000;
    var en = normQ(c.en), keys = normQ(c.keys);
    if (en === q) return 8000;
    if (en.indexOf(q) > -1) return 4000;
    if (keys && keys.indexOf(q) > -1) return 3000;

    var qt = qTokens(q), wEn = en.split(" "), wKeys = keys.split(" ");
    var s = 0;
    for (var i = 0; i < qt.length; i++) {
      var t = qt[i];
      if (t.length < 2 || SAY_STOP[t]) continue;
      var m = matchWord(wEn, t);
      if (m) { s += sayWeight(m); continue; }
      /* a hit on a curated synonym counts for a bit less than a hit on the
         sentence itself, so two otherwise equal cards are separated by which
         one says the thing outright */
      m = matchWord(wKeys, t);
      if (m) s += sayWeight(m) * 0.85;
    }
    return s;
  }

  /* Below this the only matched words were generic, and the top row would be a
     coin flip among near-identical scores. Better to say "nothing matches" and
     offer the blank card than to hand someone a sentence that means something
     else. */
  var SAY_MIN = 60;

  /* Ranked, de-duplicated by the Chinese sentence, capped. The cap is what
     keeps a one-word query like "hotel" from returning forty rows. */
  var SAY_MAX = 8;
  function saySearch(raw) {
    var q = normQ(raw);
    var qRaw = String(raw == null ? "" : raw).trim();
    if (!q) return [];
    var all = bankAllCards(), scored = [];
    for (var i = 0; i < all.length; i++) {
      var s = sayScore(all[i], q, qRaw);
      if (s >= SAY_MIN) scored.push({ c: all[i], s: s });
    }
    /* ties keep bank order, which is authored roughly by how often a first-week
       visitor needs the sentence */
    scored.sort(function (a, b) { return b.s - a.s; });
    var out = [], seen = {};
    for (var j = 0; j < scored.length && out.length < SAY_MAX; j++) {
      var zh = scored[j].c.zh;
      if (seen[zh]) continue;
      seen[zh] = 1;
      out.push(scored[j].c);
    }
    return out;
  }

  /* Resolve a favourite key to the card it names. Built-ins win over my own,
     so a sentence that was written by hand before it shipped as a built-in
     keeps pointing at one card instead of two; the bank comes last, so a card
     the user wrote themselves always wins over the generic one. Searching the
     bank here is what lets a favourited bank sentence survive a reload — the
     stored key is the finished Chinese, and the bank on disk only holds the
     template it was expanded from. */
  function cardByZh(zh) {
    for (var i = 0; i < CARD_ORDER.length; i++) {
      var g = CARD_GROUPS[CARD_ORDER[i]];
      if (!g) continue;
      for (var j = 0; j < g.cards.length; j++) if (g.cards[j].zh === zh) return g.cards[j];
    }
    var mine = myCards();
    for (var m = 0; m < mine.length; m++) if (mine[m].zh === zh) return mine[m];
    var bank = bankAllCards();
    for (var b = 0; b < bank.length; b++) if (bank[b].zh === zh) return bank[b];
    return null;
  }

  /* Keys that no longer resolve are dropped from the list, not from storage:
     the stored array is left exactly as it was. */
  function favCards() {
    return favKeys().map(cardByZh).filter(Boolean);
  }

  function isFav(zh) { return favKeys().indexOf(zh) > -1; }

  /* returns true when the card was just added, false when it was removed */
  function toggleFav(zh) {
    var keys = favKeys();
    var at = keys.indexOf(zh);
    if (at > -1) keys.splice(at, 1); else keys.push(zh);
    setFavKeys(keys);
    return at === -1;
  }

  /* Move a card one slot within the stored order. The index is the position in
     the *resolved* list the page just drew; the key it maps to is looked up
     again, so an unresolvable key earlier in the array cannot shift the wrong
     card. A no-op when the swap would fall outside the list. */
  function moveFav(i, dir) {
    var c = favCards()[i];
    if (!c) return;
    var keys = favKeys();
    var at = keys.indexOf(c.zh);
    var to = at + dir;
    if (at < 0 || to < 0 || to >= keys.length) return;
    keys.splice(at, 1);
    keys.splice(to, 0, c.zh);
    setFavKeys(keys);
  }

  /* Synthetic groups are shaped exactly like the real ones — {icon, title,
     hint, cards} — so the group tile, the /cards/<key> route and the search
     index all treat them as ordinary sets and none of those need a special
     case. The keys are kept out of CARD_ORDER so that a future group id can
     only collide if someone deliberately adds one of these two. */
  function allCardGroups() {
    var out = [];
    var favs = favCards();
    if (favs.length) {
      out.push(["favs", { icon: "⭐", title: tAll("myFavs"), hint: tAll("myFavsHint"), cards: favs }]);
    }
    var mine = myCards();
    if (mine.length) {
      out.push(["mine", { icon: "✏️", title: tAll("myCards"), hint: tAll("myCardsHint"), cards: mine }]);
    }
    CARD_ORDER.forEach(function (k) { if (CARD_GROUPS[k]) out.push([k, CARD_GROUPS[k]]); });
    return out;
  }

  function groupByKey(key) {
    var all = allCardGroups();
    for (var i = 0; i < all.length; i++) if (all[i][0] === key) return all[i][1];
    return null;
  }

  function pageCards() {
    var pairs = allCardGroups();

    var groups = pairs.map(function (pair) {
      var key = pair[0], g = pair[1];
      var preview = g.cards.slice(0, 2).map(function (c) { return esc(c.zh); }).join(" · ");
      return '<button class="search__hit" data-go="/cards/' + key + '">' +
        '<span class="emoji">' + g.icon + "</span>" +
        "<span><b>" + esc(L(g.title)) + "</b>" +
        "<small>" + esc(L(g.hint)) + " — " + g.cards.length + " " + esc(t("cards")) + "</small>" +
        "<small>" + preview + "…</small>" +
        /* a group may carry a caution about the cards themselves (hospital:
           "communication only, not medical advice") */
        (g.note ? '<small class="note">' + esc(L(g.note)) + "</small>" : "") +
        "</span>" +
      "</button>";
    }).join("");

    var ownCount = favCards().length + myCards().length;

    return '' +
      topbar(t("helpCards"), { back: "/", badge: pairs.length + " " + t("sets") }) +
      '<section class="section">' +
        '<div class="panel panel--tip"><div class="panel__h">' + esc(t("howToUseCard")) + "</div>" +
          '<p style="margin:0;font-size:14.5px;line-height:1.6">' + md(t("howToUseCardB")) + "</p>" +
          '<p style="margin:10px 0 0;font-size:13.5px;color:var(--muted);line-height:1.6">' + md(t("howToUseCardC")) + "</p>" +
        "</div>" +
      "</section>" +
      /* The way in to saying something of your own sits above the built-in
         sets. It is the answer when none of the 96 sentences is the sentence
         you need — both the lookup box and the blank card live behind it — and
         burying the escape hatch under fourteen tiles would hide it exactly
         when it matters. */
      '<section class="section"><div class="panel">' +
        '<button class="search__hit" data-go="/mine">' +
          '<span class="emoji">💬</span>' +
          "<span><b>" + esc(t("sayTitle")) + "</b>" +
          "<small>" + esc(t("myStuffHint")) + "</small>" +
          (ownCount ? "<small>" + ownCount + " " + esc(t("cards")) + "</small>" : "") +
          "</span>" +
        "</button>" +
      "</div></section>" +
      '<section class="section"><div class="panel">' + groups + "</div></section>";
  }

  /* ---------------- my cards page ----------------
     Deliberately in app.js rather than explore-ui.js: that module's get/put
     have no memory fallback and no `ccs.` prefix, so in private mode a
     hand-typed card would go missing without an error. These have to stand on
     the same footing as progress, and favourites have to be readable by
     pageCards() above, which lives here. */

  var mineDraft = { zh: "", en: "", note: "" };
  var mineEdit = -1;                    /* index into myCards(); -1 = writing a new one */

  function clearMineDraft() {
    mineEdit = -1;
    mineDraft = { zh: "", en: "", note: "" };
  }

  /* One row of either list. `kind` is what data-open carries back, so the row
     does not need to know which list it is in. */
  function mineRow(kind, i, c, acts) {
    return '<div class="minerow">' +
      '<button class="minerow__main" data-open="' + kind + ":" + i + '">' +
        '<span class="minerow__zh">' + esc(c.zh) + "</span>" +
        (c.en ? '<span class="minerow__en">' + esc(c.en) + "</span>" : "") +
        (c.note ? '<span class="minerow__note">' + esc(c.note) + "</span>" : "") +
      "</button>" +
      '<span class="minerow__acts">' + acts + "</span>" +
    "</div>";
  }

  /* ---------------- say it: English in, Chinese out ----------------
     The results live in a container that is rewritten in place on every
     keystroke. A full render() here would destroy the input and the caret
     mid-word, so this is the one place in the app that updates a subtree
     directly instead of redrawing the page. `sayHits` is the bridge between
     the two: a row carries an index into that array, not the card itself, so
     tapping a result opens the ordinary full-screen card with no special case
     in the card screen. */
  var sayQuery = "";
  var sayHits = [];

  /* Shown when the box is empty. Phrased the way someone would actually type
     the idea, not the way the bank stores it — typing "I am allergic to
     peanuts" and watching 我对花生过敏。 come back is what teaches the search. */
  var SAY_EXAMPLES = [
    "Where is the toilet?",
    "How much is this?",
    "I am allergic to peanuts",
    "Please take me to this address",
    "I don't eat pork",
    "Please call the police"
  ];

  function sayRow(c, i) {
    return '<button class="sayrow" data-say="' + i + '">' +
      '<span class="sayrow__zh">' + esc(c.zh) + "</span>" +
      '<span class="sayrow__en">' + esc(c.en) + "</span>" +
    "</button>";
  }

  /* Always present under the results: when eight rows are all close-but-wrong,
     the way out has to be visible without scrolling or clearing the box. */
  function sayOwnHtml() {
    return '<button class="btn btn--block" data-say-own="1">' + esc(t("sayWriteOwn")) + "</button>";
  }

  function sayExamplesHtml() {
    return '<p class="say-hint">' + esc(t("sayHint")) + "</p>" +
      '<div class="say-try"><span>' + esc(t("sayTry")) + "</span>" +
        SAY_EXAMPLES.map(function (e) {
          return '<button class="chip" data-say-eg="' + e + '">' + esc(e) + "</button>";
        }).join("") +
      "</div>";
  }

  /* Recomputes the hits every time it runs, so the row indices and the array
     can never drift apart. Everything that shows the box calls this. */
  function sayBoxHtml() {
    if (!sayQuery) { sayHits = []; return sayExamplesHtml(); }
    sayHits = saySearch(sayQuery);
    if (!sayHits.length) {
      return '<p class="say-hint">' + esc(t("sayNoMatch")) + "</p>" + sayOwnHtml();
    }
    return sayHits.map(sayRow).join("") + sayOwnHtml();
  }

  function paintSay() {
    var box = $("#say-results");
    if (box) box.innerHTML = sayBoxHtml();
  }

  function pageMine() {
    var favs = favCards();
    var mine = myCards();

    var favRows = favs.length
      ? favs.map(function (c, i) {
          return mineRow("fav", i, c,
            '<button class="minerow__btn" data-fav-up="' + i + '" aria-label="' + esc(t("moveUp")) + '">↑</button>' +
            '<button class="minerow__btn" data-fav-down="' + i + '" aria-label="' + esc(t("moveDown")) + '">↓</button>' +
            '<button class="minerow__btn is-on" data-fav-off="' + i + '" aria-label="' + esc(t("removeFav")) + '">★</button>');
        }).join("")
      : '<p class="mine-empty">' + esc(t("favsEmpty")) + "</p>";

    var mineRows = mine.length
      ? mine.map(function (c, i) {
          return mineRow("mine", i, c,
            '<button class="minerow__btn" data-mine-edit="' + i + '">' + esc(t("editCard")) + "</button>" +
            '<button class="minerow__btn" data-mine-del="' + i + '">' + esc(t("delCard")) + "</button>");
        }).join("")
      : '<p class="mine-empty">' + esc(t("mineEmpty")) + "</p>";

    var editing = mineEdit > -1 && mine[mineEdit];

    return '' +
      topbar(t("sayTitle"), { back: "/", badge: (favs.length + mine.length) + " " + t("cards") }) +

      /* The box comes first, above anything the user has saved. Someone who
         opened this page because they need to say something right now should
         not have to scroll past their own archive to reach it. */
      '<section class="section"><div class="panel">' +
        '<input id="say-q" class="say-input" type="search" autocomplete="off" ' +
          'aria-label="' + esc(t("sayPlaceholder")) + '" ' +
          'placeholder="' + esc(t("sayPlaceholder")) + '" value="' + esc(sayQuery) + '">' +
        '<div id="say-results">' + sayBoxHtml() + "</div>" +
      "</div></section>" +

      '<section class="section">' +
        '<div class="section__h"><h2>' + esc(t("myFavs")) + "</h2></div>" +
        '<div class="panel">' + favRows + "</div>" +
      "</section>" +

      '<section class="section" id="sec-mine">' +
        '<div class="section__h"><h2>' + esc(t("myCards")) + "</h2></div>" +
        '<div class="panel panel--tip">' +
          '<p style="margin:0;font-size:14.5px;line-height:1.6">' + md(t("mineIntro")) + "</p>" +
        "</div>" +
        '<div class="panel">' +
          '<div class="help-form">' +
            '<label><span>' + esc(t("cardZhField")) + "</span>" +
              '<textarea id="mine-zh" rows="3" maxlength="240" placeholder="例如：我对花生过敏。">' + esc(mineDraft.zh) + "</textarea></label>" +
            '<label><span>' + esc(t("cardEnField")) + "</span>" +
              '<input id="mine-en" maxlength="240" autocomplete="off" placeholder="I am allergic to peanuts." value="' + esc(mineDraft.en) + '"></label>' +
            '<label><span>' + esc(t("cardNoteField")) + "</span>" +
              '<input id="mine-note" maxlength="60" autocomplete="off" value="' + esc(mineDraft.note) + '"></label>' +
            '<div class="help-actions">' +
              '<button class="btn btn--primary" data-mine-save="1">' +
                esc(editing ? t("saveCard") : t("newCard")) + "</button>" +
              (editing ? '<button class="btn" data-mine-cancel="1">' + esc(t("cancel")) + "</button>" : "") +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="panel">' + mineRows + "</div>" +
      "</section>" +

      '<p class="footnote">' + esc(t("mineNote")) + "</p>";
  }

  function pageFaq() {
    return '' +
      topbar(t("faqTitle"), { back: "/" }) +
      '<section class="section"><div class="faq">' +
        FAQ.map(function (f) {
          return "<details><summary>" + esc(L(f.q)) + '</summary><div class="a">' + esc(L(f.a)) + "</div></details>";
        }).join("") +
      "</div></section>" +
      '<p class="footnote">' + esc(t("faqNote")) + "</p>";
  }

  /* The "how to use" page. Deliberately the same content as the first-run
     overlay — one source, two doors. The last block is the AI placeholder. */
  function pageHow() {
    var body = ONBOARDING.map(function (o) {
      return '<div class="howto">' +
        '<div class="howto__icon">' + o.icon + "</div>" +
        '<div class="howto__body"><h3>' + esc(L(o.title)) + "</h3>" +
        "<p>" + esc(L(o.body)) + "</p></div>" +
      "</div>";
    }).join("");

    return '' +
      topbar(t("howToUse"), { back: "/" }) +
      '<section class="section"><div class="panel">' + body + "</div></section>" +
      '<section class="section"><div class="panel panel--ai">' +
        '<div class="panel__h">' + esc(t("aiTitle")) + "</div>" +
        '<p style="margin:0;font-size:14.5px;line-height:1.6">' + esc(t("aiBody")) + "</p>" +
        '<button class="btn btn--block" data-ai="1" disabled>' + esc(t("aiCta")) + "</button>" +
      "</div></section>";
  }

  function pagePrep() {
    var n = prepCount(), total = PREP.length;
    var pct = total ? Math.round((n / total) * 100) : 0;

    var rows = PREP.map(function (p, i) {
      var on = isPrepDone(p.id);
      return '<li class="preprow" style="--i:' + i + '">' +
        '<label>' +
          '<input type="checkbox" data-prep="' + esc(p.id) + '"' + (on ? " checked" : "") + ">" +
          '<span class="preprow__icon" aria-hidden="true">' + p.icon + "</span>" +
          '<span class="preprow__body">' +
            '<span class="preprow__t">' + esc(L(p.title)) + "</span>" +
            '<span class="preprow__d">' + esc(L(p.body)) + "</span>" +
          "</span>" +
        "</label>" +
      "</li>";
    }).join("");

    /* Same counter + bar as the scene steps, and for the same reason: ticking
       a box should not re-render the page and throw away the scroll position. */
    return '' +
      topbar(t("prepTitle"), { back: "/" }) +
      '<section class="section">' +
        '<p class="prep__sub">' + esc(t("prepSub")) + "</p>" +
        '<div class="panel">' +
          '<div class="panel__h">' + esc(t("prepTitle")) +
            '<span class="n" id="prepcount">' + n + " / " + total + " " + esc(t("prepDone")) + "</span></div>" +
          '<div class="steps__progress"><i id="prepbar" style="width:' + pct + '%"></i></div>' +
          '<ul class="prep">' + rows + "</ul>" +
        "</div>" +
      "</section>" +
      '<section class="section"><div class="panel">' +
        '<div class="panel__h">' + esc(t("prepNoteTitle")) + "</div>" +
        '<p style="margin:0 0 10px;font-size:14.5px;line-height:1.6">' + esc(t("prepNoteBody")) + "</p>" +
        '<a class="btn btn--block" href="https://english.www.gov.cn/services/" target="_blank" rel="noopener">' +
          esc(t("prepNoteLink")) + "</a>" +
        /* The two surviving arrival guides are "before departure" content, so
           this page is their entry point. Without it the guide library is only
           reachable by typing the hash. */
        '<a class="prep__link" href="#/guides">' + esc(t("prepGuides")) + "</a>" +
        /* Same problem, same fix. The address help card is where the "save your
           hotel address in Chinese" item above actually gets done, and it had
           no inbound link from anywhere after the travel hero was removed. */
        '<a class="prep__link" href="#/help">' + esc(t("prepHelpCard")) + "</a>" +
      "</div></section>";
  }

  function pageLang() {
    var rows = LANGS.map(function (l) {
      var on = l.code === lang ? " is-on" : "";
      /* Say it here, before they switch — not after. The warning remains as
         long as either scene bodies or Explore content still falls back. */
      var note = bodyIncomplete(l.code) || exploreIncomplete(l.code)
        ? '<span class="langrow__note">' + esc(t("partialShort")) + "</span>"
        : "";
      return '<button class="langrow' + on + '" data-pick-lang="' + l.code + '">' +
        '<span class="langrow__label">' + esc(l.label) + note + "</span>" +
        '<span class="langrow__tick">' + (l.code === lang ? "✓" : "") + "</span>" +
      "</button>";
    }).join("");

    return '' +
      topbar(t("language"), { back: "/" }) +
      '<section class="section"><div class="panel">' + rows + "</div></section>" +
      (partial ? '<p class="footnote">' + esc(t("partialNotice")) + "</p>" : "");
  }

  function pageCity() {
    var c = cityByKey(city);
    var rows = CITY_BOXES.map(function (x) {
      var on = x.city === city ? " is-on" : "";
      return '<button class="cityrow' + on + '" data-pick-city="' + esc(x.city) + '">' +
        "<span>" + esc(L(cityLabel(x))) + "</span>" +
        '<span class="cityrow__zh">' + esc(x.zh) + "</span>" +
      "</button>";
    }).join("");

    return '' +
      topbar(t("city"), { back: "/" }) +
      '<section class="section"><div class="panel">' +
        '<div class="panel__h">' + esc(t("cityTitle")) + "</div>" +
        '<p style="margin:0 0 12px;font-size:13.5px;color:var(--muted);line-height:1.6">' + esc(t("cityHint")) + "</p>" +
        '<button class="btn btn--primary btn--block" data-detect="1">' +
          (c ? "🔄 " : "📍 ") + esc(t("cityDetect")) + "</button>" +
        '<p class="citynow" id="citynow">' +
          (c ? esc(t("citySet")) + " " + esc(L(cityLabel(c))) : esc(t("cityNone"))) +
        "</p>" +
      "</div></section>" +
      '<section class="section"><div class="panel">' +
        '<div class="panel__h">' + esc(t("cityPick")) + "</div>" + rows +
      "</div></section>";
  }

  function pageEmergency() {
    return pageScene(sceneById("emergency"));
  }

  /* ---------------- full screen card ---------------- */

  var cs = { list: [], i: 0, label: "", icon: "", from: "#/" };

  function openCardScreen(list, index, label, icon) {
    if (!list || !list.length) return;
    cs.list = list;
    cs.i = Math.max(0, Math.min(index || 0, list.length - 1));
    cs.label = label || t("showThisToThem");
    cs.icon = icon || "🗣️";
    screen.classList.toggle("is-address", label === "PERSONAL HELP CARD");
    cs.from = location.hash || "#/";
    paintCard();
    screen.hidden = false;
    screen.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeCardScreen() {
    screen.hidden = true;
    screen.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function paintCard() {
    var c = cs.list[cs.i];
    if (!c) return;

    /* Opening a card is a fresh event each time — restart the entry animation
       by removing the class and forcing a reflow. Without this the big icon
       would only ever pop on the very first card of the session. */
    var body = $(".cardscreen__body");
    if (body) {
      body.classList.remove("is-in");
      void body.offsetWidth;
      body.classList.add("is-in");
    }

    $("#cs-icon").textContent = cs.icon;
    $("#cs-label").textContent = cs.label;
    $("#cs-zh").textContent = c.zh;

    /* Language = Chinese means the reader of this screen is a Chinese
       speaker already, so the gloss is noise. Hide the line, and hide the
       toggle with it — a button that cannot change anything is worse than
       no button. The class is cleared in the other branch so that switching
       back to a glossed language does not leave the line stuck hidden. */
    var en = $("#cs-en");
    var isZh = lang === "zh";
    if (isZh) {
      en.textContent = "";
      en.hidden = true;
      screen.classList.add("hide-en");
    } else {
      en.hidden = false;
      en.textContent = L(c);
      screen.classList.remove("hide-en");
    }
    $("#cs-toggle").hidden = isZh;

    $("#cs-count").textContent = (cs.i + 1) + " / " + cs.list.length;
    $("#cs-prev").style.visibility = cs.i === 0 ? "hidden" : "visible";
    $("#cs-next").style.visibility = cs.i === cs.list.length - 1 ? "hidden" : "visible";
    $("#cs-toggle").textContent = screen.classList.contains("hide-en") ? t("showEnglish") : t("hideEnglish");
    $("#cs-copy").textContent = t("copyZh");

    /* The star makes any card on screen keepable — built-in, hand-written, or
       a line from a scene's showCard. It is the only place a favourite can be
       added, which is why it lives on the card itself and not in a list. */
    var star = $("#cs-star");
    if (star) {
      var on = isFav(c.zh);
      var lbl = on ? t("removeFav") : t("addFav");
      star.textContent = on ? "★" : "☆";
      star.classList.toggle("is-on", on);
      star.setAttribute("aria-label", lbl);
      star.setAttribute("title", lbl);
      star.setAttribute("aria-pressed", on ? "true" : "false");
    }
  }

  /* ---------------- router ---------------- */

  function render() {
    var hash = (location.hash || "#/").replace(/^#/, "");
    var parts = hash.split("/").filter(Boolean);
    var page = parts[0] || "";

    /* Drop the lookup the moment the user leaves the page. It survives
       re-renders within #/mine on purpose — saving a card or starring a result
       must not wipe a half-typed question — but once they have gone elsewhere
       there is no reason to keep it, and nothing about what they searched for
       should outlive the visit. */
    if (page !== "mine") { sayQuery = ""; sayHits = []; }

    var exploreView = CPExplore.render(hash.replace(/^\//, ""), lang);
    if (exploreView && !(page === "city" && !parts[1])) {
      var sectionTitle = L({
        cities: { en: "Cities", zh: "城市", ja: "都市", ko: "도시" },
        plan: { en: "My trip", zh: "我的行程", ja: "旅程", ko: "내 일정" },
        guides: { en: "Guides", zh: "攻略", ja: "ガイド", ko: "가이드" },
        help: { en: "Help card", zh: "地址求助卡", ja: "住所カード", ko: "주소 카드" }
      }[exploreView.active] || "Explore");
      var languageNote = lang === "en" || exploreView.active === "help" ? "" :
        '<p class="explore-language-note">' + esc({
          zh: "城市说明与新增攻略的正文暂为英文；中文地址卡可以直接使用。",
          ja: "都市情報と追加ガイドの本文は現在英語です。中国語の住所カードは利用できます。",
          ko: "도시 정보와 추가 가이드 본문은 현재 영어로 제공됩니다. 중국어 주소 카드는 사용할 수 있습니다."
        }[lang]) + "</p>";
      app.innerHTML = topbar(sectionTitle, { back: "/" }) +
        '<div class="explore-page">' + languageNote + exploreView.html + "</div>";
      CPExplore.bind(render, function (list, label) { openCardScreen(list, 0, label, "📍"); });
    } else if (page === "s" && sceneById(parts[1])) {
      app.innerHTML = pageScene(sceneById(parts[1]));
    } else if (page === "cards") {
      app.innerHTML = pageCards();
      /* resolved through allCardGroups(), not CARD_GROUPS: "favs" and "mine"
         are not in the data file, and looking them up there is what would make
         those two tiles open an empty card screen. */
      var key = parts[1];
      var g = key ? groupByKey(key) : null;
      if (g) openCardScreen(g.cards, 0, g.icon + " " + L(g.title), g.icon);
    } else if (page === "mine") {
      app.innerHTML = pageMine();
    } else if (page === "faq") {
      app.innerHTML = pageFaq();
    } else if (page === "emergency") {
      app.innerHTML = pageEmergency();
    } else if (page === "how") {
      app.innerHTML = pageHow();
    } else if (page === "prep") {
      app.innerHTML = pagePrep();
    } else if (page === "lang") {
      app.innerHTML = pageLang();
    } else if (page === "city") {
      app.innerHTML = pageCity();
    } else {
      app.innerHTML = pageHome();
    }

    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", function () {
    var hash = (location.hash || "#/").replace(/^#/, "");
    // leaving a card route closes the overlay
    if (hash.indexOf("/cards/") !== 0) closeCardScreen();
    render();
  });

  /* ---------------- events ---------------- */

  /* Scroll a long scene page to one of its sections. The reduced-motion check
     lives here rather than in CSS because the global prefers-reduced-motion
     rule only disables transitions and animations — it cannot reach a JS
     smooth scroll. */
  function jumpTo(key) {
    var el = document.getElementById("sec-" + key);
    if (!el) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  document.addEventListener("click", function (e) {
    var t2 = e.target.closest("[data-go], [data-step], [data-card], [data-show], [data-stale], [data-loc], [data-pick-lang], [data-pick-city], [data-detect], [data-install], [data-toc], [data-open], [data-fav-up], [data-fav-down], [data-fav-off], [data-say], [data-say-eg], [data-say-own], [data-mine-save], [data-mine-edit], [data-mine-del], [data-mine-cancel]");
    if (!t2) return;

    if (t2.hasAttribute("data-toc")) { jumpTo(t2.getAttribute("data-toc")); return; }

    if (t2.hasAttribute("data-install")) { install(); return; }

    if (t2.hasAttribute("data-go")) { go("#" + t2.dataset.go); return; }

    if (t2.hasAttribute("data-step")) {
      var p = t2.dataset.step.split(":");
      toggleDone(p[0], +p[1]);
      t2.dataset.done = isDone(p[0], +p[1]) ? "1" : "0";

      // step counter + progress bar, without a full re-render
      var all = $$('[data-step^="' + p[0] + ':"]');
      var count = all.filter(function (el) { return el.dataset.done === "1"; }).length;
      var bar = $("#stepbar"), cnt = $("#stepcount");
      if (bar) bar.style.width = Math.round((count / all.length) * 100) + "%";
      if (cnt) cnt.textContent = count + " / " + all.length + " " + t("done");
      if (count === all.length && all.length) toast(t("allStepsDone"));
      return;
    }

    if (t2.hasAttribute("data-card")) {
      var pc = t2.dataset.card.split(":");
      var sc = sceneById(pc[0]);
      var card = sceneCards(sc)[+pc[1]];
      openCardScreen(sceneCards(sc), +pc[1], "🗣️ " + L(sc.title) + " · " + t("usefulCard"), groupIconFor(sc, card) || sc.icon);
      return;
    }

    if (t2.hasAttribute("data-show")) {
      var s2 = sceneById(t2.dataset.show);
      var lines = s2.showCard.lines.map(function (l) { return { zh: l, en: "" }; });
      openCardScreen(lines, 0, "🗣️ " + L(s2.showCard.title), s2.icon);
      return;
    }

    /* the location card works with or without a GPS fix: with a fix it adds
       coordinates, without one it still names the city you picked */
    if (t2.hasAttribute("data-loc")) {
      openCardScreen(locationCards(), 0, "📍 " + t("showLocationCard"), "📍");
      return;
    }

    if (t2.hasAttribute("data-pick-lang")) {
      setLang(t2.dataset.pickLang);
      render();
      return;
    }

    if (t2.hasAttribute("data-pick-city")) {
      city = t2.dataset.pickCity;
      store.set("ccs.city", city);
      render();
      return;
    }

    if (t2.hasAttribute("data-detect")) {
      var now = $("#citynow");
      if (now) now.textContent = t("cityDetecting");
      detectCity(function (m, why) {
        if (m) { render(); return; }
        var el = $("#citynow");
        if (el) el.textContent = detectFailMsg(why);
      });
      return;
    }

    if (t2.hasAttribute("data-stale")) { toast(t("thanksLogged")); return; }

    /* ---- my cards page ----
       Every one of these ends in render(), which is why the new-card form
       mirrors its fields into `mineDraft` on every keystroke: a re-render must
       not eat a half-typed card. */

    if (t2.hasAttribute("data-open")) {
      var op = t2.dataset.open.split(":");
      var isFavList = op[0] === "fav";
      var rowList = isFavList ? favCards() : myCards();
      var rowI = +op[1];
      /* the DOM was drawn from this list one tick ago and nothing has changed
         it since, so the index still points at the row that was tapped */
      if (rowList[rowI]) {
        openCardScreen(rowList, rowI,
          (isFavList ? "⭐ " + t("myFavs") : "✏️ " + t("myCards")),
          isFavList ? "⭐" : "✏️");
      }
      return;
    }

    if (t2.hasAttribute("data-fav-off")) {
      var offCard = favCards()[+t2.dataset.favOff];
      if (!offCard) return;
      toggleFav(offCard.zh);
      render();
      toast(t("favRemoved"));
      return;
    }

    if (t2.hasAttribute("data-fav-up")) { moveFav(+t2.dataset.favUp, -1); render(); return; }
    if (t2.hasAttribute("data-fav-down")) { moveFav(+t2.dataset.favDown, 1); render(); return; }

    /* A lookup result is an ordinary card: the whole point is that it opens the
       same full-screen Chinese, with the same star, as a built-in one. */
    if (t2.hasAttribute("data-say")) {
      var sayI = +t2.dataset.say;
      if (sayHits[sayI]) openCardScreen(sayHits, sayI, "💬 " + t("sayTitle"), "💬");
      return;
    }

    /* An example chip fills the box rather than opening a card — the user is
       learning what to type, not committing to a sentence. */
    if (t2.hasAttribute("data-say-eg")) {
      sayQuery = t2.dataset.sayEg;
      var egBox = $("#say-q");
      if (egBox) egBox.value = sayQuery;
      paintSay();
      return;
    }

    /* Nothing came back, or nothing came back close enough. Carry what they
       typed into the new card's English field — so the card they are about to
       write already has their own sentence on it — and put the caret in the
       Chinese box, which is the only thing still missing. */
    if (t2.hasAttribute("data-say-own")) {
      mineEdit = -1;
      mineDraft = { zh: "", en: sayQuery.replace(/^\s+|\s+$/g, ""), note: "" };
      render();
      var ownSec = document.getElementById("sec-mine");
      if (ownSec) window.scrollTo(0, Math.max(0, ownSec.getBoundingClientRect().top + window.scrollY - 12));
      var ownZh = $("#mine-zh");
      if (ownZh) ownZh.focus();
      return;
    }

    if (t2.hasAttribute("data-mine-edit")) {
      var editCard = myCards()[+t2.dataset.mineEdit];
      if (!editCard) return;
      mineEdit = +t2.dataset.mineEdit;
      mineDraft = { zh: editCard.zh, en: editCard.en || "", note: editCard.note || "" };
      render();
      var zhBox = $("#mine-zh");
      if (zhBox) zhBox.focus();
      return;
    }

    if (t2.hasAttribute("data-mine-del")) {
      var delI = +t2.dataset.mineDel;
      var remaining = myCards();
      if (!remaining[delI]) return;
      remaining.splice(delI, 1);
      setMyCards(remaining);
      /* an index into a list that just changed has to be re-pointed, and if
         the card being edited was the one deleted, the form goes back to new */
      if (mineEdit === delI) clearMineDraft();
      else if (mineEdit > delI) mineEdit--;
      render();
      toast(t("deletedOk"));
      return;
    }

    if (t2.hasAttribute("data-mine-cancel")) { clearMineDraft(); render(); return; }

    if (t2.hasAttribute("data-mine-save")) {
      var zh = mineDraft.zh.trim();
      if (!zh) {
        toast(t("needZh"));
        var box = $("#mine-zh");
        if (box) box.focus();
        return;
      }
      var list = myCards();
      var entry = { zh: zh, en: mineDraft.en.trim(), note: mineDraft.note.trim() };
      if (mineEdit > -1 && list[mineEdit]) list[mineEdit] = entry; else list.push(entry);
      setMyCards(list);
      clearMineDraft();
      render();
      toast(t("savedOk"));
      /* the card just landed at the bottom of the list; render() has already
         scrolled to the top, so go to the list instead of leaving the user on
         the intro panel wondering whether it saved */
      var sec = document.getElementById("sec-mine");
      if (sec) window.scrollTo(0, Math.max(0, sec.getBoundingClientRect().top + window.scrollY - 12));
      return;
    }
  });

  /* checklist persistence */
  document.addEventListener("change", function (e) {
    var el = e.target;
    if (!el || !el.hasAttribute) return;

    if (el.hasAttribute("data-prep")) {
      togglePrep(el.dataset.prep, el.checked);

      /* Counter and bar update in place, exactly like the scene steps — a
         re-render here would scroll the list back to the top every tick. */
      var all = $$("[data-prep]");
      var n = all.filter(function (b) { return b.checked; }).length;
      var bar = $("#prepbar"), cnt = $("#prepcount");
      if (bar) bar.style.width = Math.round((n / all.length) * 100) + "%";
      if (cnt) cnt.textContent = n + " / " + all.length + " " + t("prepDone");
      if (all.length && n === all.length) toast(t("prepAllDone"));
      return;
    }

    if (!el.hasAttribute("data-check")) return;
    toggleChecked(el.dataset.check, el.checked);
  });

  /* card screen controls */
  $("#cs-close").addEventListener("click", closeFrom);
  function closeFrom() {
    // if the card was opened over a page, go back to that page
    if (cs.from && cs.from !== location.hash) { go(cs.from); return; }
    closeCardScreen();

    var here = (location.hash || "").replace(/^#/, "");

    /* #/mine opens its card screen without touching the hash, so closing it
       re-renders nothing on its own: the list would still show the star the
       card had before you pressed it. Re-render in place, keeping the scroll
       position that render() otherwise resets to the top. */
    if (here === "/mine") {
      var y = window.scrollY;
      render();
      window.scrollTo(0, y);
      return;
    }

    /* A group overlay leaves the hash on /cards/<key> while the tile list is
       what is actually on screen. Send it back to /cards: the address bar then
       matches the page, a reload no longer re-opens the card you just closed,
       and — the reason this matters for favourites — the list re-renders, so
       a group tile cannot sit there showing a card count that is one out of
       date. */
    if (here.indexOf("/cards/") === 0) go("/cards");
  }
  $("#cs-prev").addEventListener("click", function () { cs.i--; paintCard(); });
  $("#cs-next").addEventListener("click", function () { cs.i++; paintCard(); });
  $("#cs-toggle").addEventListener("click", function () {
    var on = screen.classList.toggle("hide-en");
    this.textContent = on ? t("showEnglish") : t("hideEnglish");
  });
  $("#cs-copy").addEventListener("click", function () {
    var self = this;
    var text = cs.list[cs.i] ? cs.list[cs.i].zh : "";
    function ok() {
      self.textContent = t("copied");
      self.classList.add("done");
      setTimeout(function () { self.textContent = t("copyZh"); self.classList.remove("done"); }, 1400);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () { fallbackCopy(text, ok); });
    } else {
      fallbackCopy(text, ok);
    }
  });
  $("#cs-star").addEventListener("click", function () {
    var c = cs.list[cs.i];
    if (!c || !c.zh) return;
    toast(toggleFav(c.zh) ? t("favAdded") : t("favRemoved"));
    paintCard();
  });

  function fallbackCopy(text, ok) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); ok(); } catch (e) { toast(t("copyFailed")); }
    document.body.removeChild(ta);
  }

  document.addEventListener("keydown", function (e) {
    if (!onboard.hidden && e.key === "Escape") { closeOnboarding(); return; }
    if (screen.hidden) return;
    if (e.key === "Escape") closeFrom();
    if (e.key === "ArrowRight") { cs.i = Math.min(cs.i + 1, cs.list.length - 1); paintCard(); }
    if (e.key === "ArrowLeft") { cs.i = Math.max(cs.i - 1, 0); paintCard(); }
  });

  /* search
     Delegated on document on purpose: render() replaces #app wholesale on every
     route change, so a listener bound to #q at boot dies the first time someone
     navigates away from home and comes back. */
  document.addEventListener("input", function (e) {
    var q = e.target;
    if (!q || !q.id) return;

    /* the new-card form. Every field is mirrored into mineDraft as it is typed
       so that an action click elsewhere on the page can re-render without
       discarding work that has not been saved yet. */
    if (q.id === "mine-zh" || q.id === "mine-en" || q.id === "mine-note") {
      mineDraft[q.id.slice(5)] = q.value;
      return;
    }

    /* the lookup box. Only the results subtree is replaced — re-rendering the
       page here would destroy this input and drop the caret mid-word. */
    if (q.id === "say-q") {
      sayQuery = q.value;
      paintSay();
      return;
    }

    if (q.id !== "q") return;
    var box = $("#results");
    if (!box) return;

    var v = q.value.trim().toLowerCase();
    if (!v) { box.hidden = true; box.innerHTML = ""; return; }

    var hits = [];
    scenesInOrder().forEach(function (s) {
      if (sceneHay(s).indexOf(v) > -1) {
        hits.push({ go: "/s/" + s.id, emoji: s.icon, title: L(s.title), sub: L(s.subtitle) });
      }
    });
    /* allCardGroups, not CARD_ORDER: a card you wrote yourself is otherwise
       the one thing on the site the search box cannot find. */
    allCardGroups().forEach(function (pair) {
      var k = pair[0], g = pair[1];
      /* search every language, so "トイレ" and "厕所" both land somewhere */
      var matched = g.cards.filter(function (c) { return cardHay(c).indexOf(v) > -1; });
      if (matched.length || groupHay(g).indexOf(v) > -1) {
        hits.push({
          go: "/cards/" + k, emoji: g.icon, title: L(g.title),
          sub: matched.length + " " + t("matchingCards"),
        });
      }
    });

    var exploreHits = CPExplore.search(v);
    box.hidden = false;
    box.innerHTML = hits.length || exploreHits.length
      ? hits.map(function (h) {
          return '<button class="search__hit" data-go="' + h.go + '"><span class="emoji">' + h.emoji +
            "</span><span><b>" + esc(h.title) + "</b><small>" + esc(h.sub) + "</small></span></button>";
        }).join("") + exploreHits.map(function (h) { return h.html; }).join("")
      : '<div class="panel"><p style="margin:0;color:var(--muted);font-size:14px">' + esc(t("noMatch")) + "</p></div>";
  });

  /* ---------------- onboarding overlay ----------------
     Shown once, on a first run. It reuses ONBOARDING, the same array the
     permanent #/how page renders — one source, two doors. */

  var ob = { i: 0 };

  function paintOnboarding() {
    var o = ONBOARDING[ob.i];
    if (!o) return;
    $("#ob-icon").textContent = o.icon;
    $("#ob-title").textContent = L(o.title);
    $("#ob-body").textContent = L(o.body);
    $("#ob-dots").innerHTML = ONBOARDING.map(function (_, i) {
      return '<i class="' + (i === ob.i ? "on" : "") + '"></i>';
    }).join("");
    $("#ob-next").textContent = ob.i === ONBOARDING.length - 1 ? t("onboardStart") : t("onboardNext");
    $("#ob-skip").textContent = ob.i === ONBOARDING.length - 1 ? t("close") : t("onboardSkip");
    var card = $(".onboard__card");
    if (card) {
      card.classList.remove("is-in");
      void card.offsetWidth;
      card.classList.add("is-in");
    }
  }

  function openOnboarding() {
    ob.i = 0;
    paintOnboarding();
    onboard.hidden = false;
    onboard.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeOnboarding() {
    onboard.hidden = true;
    onboard.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    store.set("ccs.seenIntro", true);
  }

  $("#ob-next").addEventListener("click", function () {
    if (ob.i === ONBOARDING.length - 1) { closeOnboarding(); return; }
    ob.i++;
    paintOnboarding();
  });
  $("#ob-skip").addEventListener("click", closeOnboarding);

  /* ---------------- boot ---------------- */

  if (!location.hash) location.hash = "#/";
  render();

  if (!store.get("ccs.seenIntro", false)) openOnboarding();

  /* Offline shell. There is no navigator.serviceWorker on file://, and
     register() rejects on any origin that is neither https nor localhost —
     so the catch is load-bearing. Without it the app throws on a plain
     double-click open, which is the main way this demo gets used. */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
