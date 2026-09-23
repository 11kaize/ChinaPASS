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

  /* Are any scene bodies still English-only? When they are all translated
     this flips to false on its own and every "not translated yet" notice
     disappears without anyone remembering to remove it. */
  function bodyIncomplete() {
    for (var i = 0; i < SCENES.length; i++) {
      var s = SCENES[i];
      var v = [s.task, s.tip, s.disclaimer];
      (s.before || []).forEach(function (x) { v.push(x); });
      (s.steps || []).forEach(function (x) { v.push(x.t, x.d); });
      (s.mistakes || []).forEach(function (x) { v.push(x.m, x.w, x.d); });
      (s.planB || []).forEach(function (x) { v.push(x); });
      (s.trouble || []).forEach(function (x) { v.push(x.p, x.a); });
      for (var j = 0; j < v.length; j++) if (typeof v[j] === "string") return true;
    }
    return false;
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

    var c = cityByKey(city);
    var cityChip = c
      ? '<button class="chip chip--city" data-go="/city">📍 ' + esc(t("citySet")) + " " + esc(L(cityLabel(c))) + "</button>"
      : '<button class="chip chip--city" data-go="/city">📍 ' + esc(t("cityTitle")) + "</button>";

    return '' +
      topbar("China Cheat Sheet", { badge: "DEMO" }) +
      '<section class="hero">' +
        '<div class="hero__brand"><span>🇨🇳</span> China Cheat Sheet</div>' +
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
          '<button class="chip chip--how" data-go="/how">❓ ' + esc(t("howToUse")) + "</button>" +
        "</div>" +
      "</section>" +

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

    return '' +
      topbar(L(scene.title), { back: "/", badge: scene.priority }) +
      partialBanner(scene) +
      '<section class="section">' +
        '<div class="panel">' +
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

      '<section class="section">' +
        '<div class="panel">' +
          '<div class="panel__h">' + esc(t("beforeYouStart")) + '</div>' +
          '<ul class="checklist">' + before + "</ul>" +
        "</div>" +
        (scene.tip
          ? '<div class="panel panel--tip"><div class="panel__h">' + esc(t("tipLabel")) + '</div>' +
            '<p style="margin:0;font-size:14.5px;line-height:1.55">' + md(L(scene.tip)) + "</p></div>"
          : "") +
      "</section>" +

      '<section class="section">' +
        '<div class="panel">' +
          '<div class="panel__h">' + esc(t("stepByStep")) + '<span class="n" id="stepcount">' + doneCount + " / " + total + " " + esc(t("done")) + "</span></div>" +
          '<div class="steps__progress"><i id="stepbar" style="width:' + pct + '%"></i></div>' +
          '<div class="steps">' + steps + "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section"><div class="panel">' +
        '<div class="panel__h">' + esc(t("showThisScreen")) + "</div>" +
        showCard +
        "<div>" + '<button class="btn btn--block btn--loc" data-loc="1">' + esc(t("showLocationCard")) + "</button>" + "</div>" +
        '<div class="panel__h" style="margin-top:18px">' + esc(t("usefulCards")) + '<span class="n">' + cards.length + " " + esc(t("cards")) + "</span></div>" +
        "<div>" + cardList + "</div>" +
      "</div></section>" +

      '<section class="section">' + mistakes + "</section>" +
      '<section class="section">' + planB + "</section>" +
      '<section class="section">' + trouble + "</section>" +
      '<section class="section">' + note + "</section>" +

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

  function pageCards() {
    var groups = CARD_ORDER.map(function (key) {
      var g = CARD_GROUPS[key];
      if (!g) return "";
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

    return '' +
      topbar(t("helpCards"), { back: "/", badge: CARD_ORDER.length + " " + t("sets") }) +
      '<section class="section">' +
        '<div class="panel panel--tip"><div class="panel__h">' + esc(t("howToUseCard")) + "</div>" +
          '<p style="margin:0;font-size:14.5px;line-height:1.6">' + md(t("howToUseCardB")) + "</p>" +
          '<p style="margin:10px 0 0;font-size:13.5px;color:var(--muted);line-height:1.6">' + md(t("howToUseCardC")) + "</p>" +
        "</div>" +
      "</section>" +
      '<section class="section"><div class="panel">' + groups + "</div></section>";
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

  function pageLang() {
    var partial = bodyIncomplete();
    var rows = LANGS.map(function (l) {
      var on = l.code === lang ? " is-on" : "";
      /* Say it here, before they switch — not after. Once the scene bodies
         are translated, `partial` is false and this marker disappears. */
      var note = partial && l.code !== "en"
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
  }

  /* ---------------- router ---------------- */

  function render() {
    var hash = (location.hash || "#/").replace(/^#/, "");
    var parts = hash.split("/").filter(Boolean);
    var page = parts[0] || "";

    if (page === "s" && sceneById(parts[1])) {
      app.innerHTML = pageScene(sceneById(parts[1]));
    } else if (page === "cards") {
      app.innerHTML = pageCards();
      var key = parts[1];
      if (key && CARD_GROUPS[key]) {
        var g = CARD_GROUPS[key];
        openCardScreen(g.cards, 0, g.icon + " " + L(g.title), g.icon);
      }
    } else if (page === "faq") {
      app.innerHTML = pageFaq();
    } else if (page === "emergency") {
      app.innerHTML = pageEmergency();
    } else if (page === "how") {
      app.innerHTML = pageHow();
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

  document.addEventListener("click", function (e) {
    var t2 = e.target.closest("[data-go], [data-step], [data-card], [data-show], [data-stale], [data-loc], [data-pick-lang], [data-pick-city], [data-detect], [data-install]");
    if (!t2) return;

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
  });

  /* checklist persistence */
  document.addEventListener("change", function (e) {
    var el = e.target;
    if (!el || !el.hasAttribute || !el.hasAttribute("data-check")) return;
    toggleChecked(el.dataset.check, el.checked);
  });

  /* card screen controls */
  $("#cs-close").addEventListener("click", closeFrom);
  function closeFrom() {
    // if the card was opened over a page, go back to that page
    if (cs.from && cs.from !== location.hash) { go(cs.from); return; }
    closeCardScreen();
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
    if (!q || q.id !== "q") return;
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
    CARD_ORDER.forEach(function (k) {
      var g = CARD_GROUPS[k];
      if (!g) return;
      /* search every language, so "トイレ" and "厕所" both land somewhere */
      var matched = g.cards.filter(function (c) { return cardHay(c).indexOf(v) > -1; });
      if (matched.length || groupHay(g).indexOf(v) > -1) {
        hits.push({
          go: "/cards/" + k, emoji: g.icon, title: L(g.title),
          sub: matched.length + " " + t("matchingCards"),
        });
      }
    });

    box.hidden = false;
    box.innerHTML = hits.length
      ? hits.map(function (h) {
          return '<button class="search__hit" data-go="' + h.go + '"><span class="emoji">' + h.emoji +
            "</span><span><b>" + esc(h.title) + "</b><small>" + esc(h.sub) + "</small></span></button>";
        }).join("")
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
