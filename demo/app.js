/* ==========================================================================
   China Cheat Sheet — 双语应急卡片

   只有一件事：把中文放大，递给对方看。
   无依赖、无构建、无后端。
   ========================================================================== */

(function () {
  "use strict";

  var app = document.getElementById("app");
  var screen = document.getElementById("cardscreen");
  var body = document.getElementById("cs-body");
  var bar = document.getElementById("cs-bar");

  var HIDE_DELAY = 2500;   // 打开后自动隐藏按钮，递出去更干净

  /* ---------------- helpers ---------------- */

  function $(sel, root) { return (root || document).querySelector(sel); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var store = (function () {
    var ok = true;
    try { window.localStorage.setItem("__ccs", "1"); window.localStorage.removeItem("__ccs"); }
    catch (e) { ok = false; }
    var mem = {};
    return {
      get: function (k, d) {
        try {
          var raw = ok ? window.localStorage.getItem(k) : mem[k];
          return raw == null ? d : JSON.parse(raw);
        } catch (e) { return d; }
      },
      set: function (k, v) {
        var raw = JSON.stringify(v);
        try { if (ok) window.localStorage.setItem(k, raw); else mem[k] = raw; } catch (e) {}
      }
    };
  })();

  function groupById(id) {
    for (var i = 0; i < CARD_GROUPS.length; i++) if (CARD_GROUPS[i].id === id) return CARD_GROUPS[i];
    return null;
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

  /* ---------------- home ---------------- */

  function pageHome() {
    var nums = EMERGENCY_NUMBERS.map(function (n) {
      return '<a href="tel:' + n.num + '"><b>' + n.num + '</b><span>' + esc(n.zh) + "</span></a>";
    }).join("");

    var list = CARD_GROUPS.map(function (g) {
      return '' +
        '<button class="row" data-go="/g/' + g.id + '">' +
          '<span class="row__icon">' + g.icon + "</span>" +
          '<span class="row__body">' +
            '<span class="row__title">' + esc(g.zh) +
              '<em>' + esc(g.title) + "</em></span>" +
            '<span class="row__hint">' + esc(g.hint) + "</span>" +
          "</span>" +
          '<span class="row__meta">' + g.cards.length + " 张 ›</span>" +
        "</button>";
    }).join("");

    var total = CARD_GROUPS.reduce(function (n, g) { return n + g.cards.length; }, 0);

    return '' +
      '<header class="head">' +
        '<h1>应急卡片</h1>' +
        '<p>Show your phone. They read the Chinese.</p>' +
      "</header>" +

      '<section class="pad">' +
        '<button class="sos" data-go="/g/sos">' +
          '<span class="sos__icon">🆘</span>' +
          '<span class="sos__main">我现在需要帮助<em>I need help now</em></span>' +
        "</button>" +
      "</section>" +

      '<section class="pad">' +
        '<div class="nums">' + nums + "</div>" +
      "</section>" +

      '<section class="pad">' +
        '<div class="listhead">' + CARD_GROUPS.length + " 组 · " + total + " 张卡片</div>" +
        '<div class="list">' + list + "</div>" +
      "</section>" +

      '<p class="foot">' +
        "递出去之前，点一下屏幕可以隐藏英文和按钮，只留中文大字。<br>" +
        "本产品只提供沟通用语，不提供医疗、法律或政策建议。" +
      "</p>";
  }

  /* ---------------- full screen card ---------------- */

  var cs = { group: null, i: 0, hideEn: store.get("ccs.hideEn", false) };
  var barTimer = null;

  function showBar() {
    bar.classList.remove("is-hidden");
    clearTimeout(barTimer);
    barTimer = setTimeout(hideBar, HIDE_DELAY);
  }
  function hideBar() {
    clearTimeout(barTimer);
    bar.classList.add("is-hidden");
  }

  function paint() {
    var g = cs.group;
    if (!g) return;
    var c = g.cards[cs.i];
    $("#cs-from").textContent = g.icon + " " + g.zh;
    $("#cs-zh").textContent = c.zh;
    $("#cs-en").textContent = c.en;
    $("#cs-count").textContent = (cs.i + 1) + " / " + g.cards.length;
    $("#cs-prev").hidden = cs.i === 0;
    $("#cs-next").hidden = cs.i === g.cards.length - 1;
    screen.classList.toggle("hide-en", cs.hideEn);
  }

  function openGroup(id, index) {
    var g = groupById(id);
    if (!g) return;
    cs.group = g;
    cs.i = Math.max(0, Math.min(index || 0, g.cards.length - 1));
    paint();
    screen.hidden = false;
    screen.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
    showBar();
  }

  function closeScreen() {
    hideBar();
    screen.hidden = true;
    screen.setAttribute("aria-hidden", "true");
    document.body.classList.remove("locked");
  }

  function step(d) {
    var g = cs.group;
    if (!g) return;
    var n = cs.i + d;
    if (n < 0 || n >= g.cards.length) return;
    cs.i = n;
    paint();
    showBar();
  }

  /* ---------------- router ---------------- */

  function render() {
    var hash = (location.hash || "#/").replace(/^#/, "");
    var m = /^\/g\/([\w-]+)$/.exec(hash);

    app.innerHTML = pageHome();
    window.scrollTo(0, 0);

    if (m && groupById(m[1])) openGroup(m[1], 0);
    else closeScreen();
  }

  window.addEventListener("hashchange", render);

  /* ---------------- events ---------------- */

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-go]");
    if (t) {
      var to = t.getAttribute("data-go");
      if (("" + location.hash).replace(/^#/, "") === to) render();
      else location.hash = to;
      return;
    }
  });

  // 点屏幕空白处：切换按钮栏显隐
  body.addEventListener("click", function () {
    if (bar.classList.contains("is-hidden")) showBar();
    else hideBar();
  });

  $("#cs-close").addEventListener("click", function () {
    if (location.hash && location.hash !== "#/") location.hash = "/";
    else closeScreen();
  });
  $("#cs-prev").addEventListener("click", function () { step(-1); });
  $("#cs-next").addEventListener("click", function () { step(1); });

  $("#cs-toggle").addEventListener("click", function () {
    cs.hideEn = !cs.hideEn;
    store.set("ccs.hideEn", cs.hideEn);
    screen.classList.toggle("hide-en", cs.hideEn);
    this.textContent = cs.hideEn ? "显示英文" : "隐藏英文";
    showBar();
  });

  $("#cs-copy").addEventListener("click", function () {
    var self = this;
    var text = cs.group ? cs.group.cards[cs.i].zh : "";
    function ok() {
      self.textContent = "已复制 ✓";
      self.classList.add("done");
      setTimeout(function () { self.textContent = "复制中文"; self.classList.remove("done"); }, 1400);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () { legacy(text, ok); });
    } else { legacy(text, ok); }
    showBar();
  });

  function legacy(text, ok) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); ok(); } catch (e) { toast("复制失败，请手动选择"); }
    document.body.removeChild(ta);
  }

  // 左右滑动翻页
  var sx = 0, sy = 0;
  body.addEventListener("touchstart", function (e) {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  body.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener("keydown", function (e) {
    if (screen.hidden) return;
    if (e.key === "Escape") { location.hash = "/"; }
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  /* ---------------- boot ---------------- */

  $("#cs-toggle").textContent = cs.hideEn ? "显示英文" : "隐藏英文";
  if (!location.hash) location.hash = "#/";
  render();
})();
