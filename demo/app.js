/* ==========================================================================
   China Cheat Sheet — demo app
   Hash router + render. No build step, no dependencies.
   ========================================================================== */

(function () {
  "use strict";

  var app = document.getElementById("app");
  var screen = document.getElementById("cardscreen");

  /* ---------------- helpers ---------------- */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
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

  var done = store.get("ccs.done", {});   // { "taxi:3": true }
  function isDone(sceneId, i) { return !!done[sceneId + ":" + i]; }
  function toggleDone(sceneId, i) {
    var k = sceneId + ":" + i;
    if (done[k]) delete done[k]; else done[k] = true;
    store.set("ccs.done", done);
  }

  var checks = store.get("ccs.checks", {});
  function isChecked(sceneId, i) { return !!checks[sceneId + ":" + i]; }

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

  /* cards of a scene = merged card groups, de-duplicated by chinese text */
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

  function go(hash) { location.hash = hash; }

  /* ---------------- top bar ---------------- */

  function topbar(title, opts) {
    opts = opts || {};
    return '' +
      '<header class="topbar">' +
        (opts.back
          ? '<button class="topbar__back" data-go="' + opts.back + '" aria-label="Back">‹</button>'
          : '') +
        '<div class="topbar__title">' + esc(title) + "</div>" +
        '<div class="topbar__spacer"></div>' +
        (opts.badge ? '<span class="topbar__badge">' + esc(opts.badge) + "</span>" : "") +
      "</header>";
  }

  /* ---------------- pages ---------------- */

  function pageHome() {
    var tiles = SCENES.map(function (s) {
      return '' +
        '<button class="tile" data-go="/s/' + s.id + '">' +
          (s.priority === "P0" ? '<span class="tile__p0">P0</span>' : "") +
          '<span class="tile__emoji">' + s.icon + "</span>" +
          '<span class="tile__title">' + esc(s.title) + "</span>" +
          '<span class="tile__sub">' + esc(s.subtitle) + "</span>" +
        "</button>";
    }).join("");

    var nums = EMERGENCY_NUMBERS.map(function (n) {
      return '<a href="tel:' + n.num + '"><div class="n">' + n.num + '</div><div class="l">' +
        esc(n.label) + "</div></a>";
    }).join("");

    return '' +
      topbar("China Cheat Sheet", { badge: "DEMO" }) +
      '<section class="hero">' +
        '<div class="hero__brand"><span>🇨🇳</span> China Cheat Sheet</div>' +
        "<h1>Your 3-minute guide to surviving daily life in China</h1>" +
        "<p>Not a travel guide. A step-by-step tool for the thing you need to do <em>right now</em>.</p>" +
        '<div class="meta">' +
          '<span class="chip">English first</span>' +
          '<span class="chip">No download</span>' +
          '<span class="chip">No sign-up</span>' +
          '<span class="chip">Works offline</span>' +
        "</div>" +
      "</section>" +

      '<div class="search">' +
        '<div class="search__box">' +
          '<input id="q" type="search" placeholder="Search: taxi, Alipay, 火车票, hotel…" autocomplete="off" aria-label="Search">' +
        "</div>" +
        '<div class="search__results" id="results" hidden></div>' +
      "</div>" +

      '<section class="section">' +
        '<div class="section__h"><h2>I want to…</h2><a href="#/cards">All help cards →</a></div>' +
        '<div class="grid">' + tiles + "</div>" +
      "</section>" +

      '<section class="section">' +
        '<div class="section__h"><h2>Emergency</h2><a href="#/emergency">Help page →</a></div>' +
        '<div class="emergency-strip">' + nums + "</div>" +
      "</section>" +

      '<section class="section">' +
        '<div class="section__h"><h2>Before you ask</h2><a href="#/faq">All FAQ →</a></div>' +
        '<div class="panel"><div class="trouble">' +
          '<div class="trouble__row"><div class="trouble__p">Cash is still the universal Plan B</div>' +
            '<div class="trouble__a">Foreign cards fail at small vendors. Keep 200–500 yuan with you.</div></div>' +
          '<div class="trouble__row"><div class="trouble__p">Your passport is also your ticket</div>' +
            '<div class="trouble__a">Trains, hotels and many payments need it. Carry it, and keep a photo on your phone.</div></div>' +
          '<div class="trouble__row"><div class="trouble__p">Ask the hotel front desk first</div>' +
            '<div class="trouble__a">They can call, translate, book and write notes. It is their job to help guests.</div></div>' +
        "</div></div>" +
      "</section>" +

      '<p class="footnote">' +
        "Demo build · content last reviewed 2026-09-23. Policy, payment and ticketing rules change — " +
        "always confirm in the official app. This tool gives operating steps only, not legal, medical or financial advice." +
      "</p>";
  }

  function pageScene(scene) {
    var total = scene.steps.length;
    var doneCount = scene.steps.filter(function (_, i) { return isDone(scene.id, i); }).length;
    var pct = total ? Math.round((doneCount / total) * 100) : 0;

    var before = (scene.before || []).map(function (b, i) {
      var ck = isChecked(scene.id, i) ? " checked" : "";
      return '<li><label><input type="checkbox" data-check="' + scene.id + ":" + i + '"' + ck +
        "><span>" + md(b) + "</span></label></li>";
    }).join("");

    var steps = scene.steps.map(function (s, i) {
      return '<button class="step" data-step="' + scene.id + ":" + i + '" data-done="' +
        (isDone(scene.id, i) ? "1" : "0") + '">' +
        '<span class="step__n"><span>' + (i + 1) + "</span></span>" +
        '<span class="step__body">' +
          '<span class="step__t">' + md(s.t) + "</span>" +
          (s.d ? '<span class="step__d">' + md(s.d) + "</span>" : "") +
        "</span>" +
      "</button>";
    }).join("");

    var mistakes = (scene.mistakes || []).length
      ? '<div class="panel"><div class="panel__h">Common mistakes</div><div class="table-wrap"><table class="mistakes">' +
          "<thead><tr><th>Mistake</th><th>Why it hurts</th><th>Do this instead</th></tr></thead><tbody>" +
          scene.mistakes.map(function (m) {
            return "<tr><td>" + md(m.m) + "</td><td>" + md(m.w) + "</td><td>" + md(m.d) + "</td></tr>";
          }).join("") +
        "</tbody></table></div></div>"
      : "";

    var cards = sceneCards(scene);
    var cardList = cards.map(function (c, i) {
      return '<button class="cardrow" data-card="' + scene.id + ":" + i + '">' +
        '<span class="cardrow__txt">' +
          '<span class="cardrow__en">' + esc(c.en) + "</span>" +
          '<span class="cardrow__zh">' + esc(c.zh) + "</span>" +
        "</span>" +
        '<span class="cardrow__go">Show ›</span>' +
      "</button>";
    }).join("");

    var showCard = scene.showCard
      ? '<div class="panel panel--tip">' +
          '<div class="panel__h">' + esc(scene.showCard.title) + "</div>" +
          '<button class="btn btn--primary btn--block" data-show="' + scene.id + '">Open full screen 🗣️</button>' +
        "</div>"
      : "";

    var planB = (scene.planB || []).length
      ? '<div class="panel"><div class="panel__h">Plan B — if the main path fails</div><ul class="plain plain--plan">' +
          scene.planB.map(function (p) { return "<li>" + md(p) + "</li>"; }).join("") +
        "</ul></div>"
      : "";

    var trouble = (scene.trouble || []).length
      ? '<div class="panel"><div class="panel__h">If something goes wrong</div><div class="trouble">' +
          scene.trouble.map(function (t) {
            return '<div class="trouble__row"><div class="trouble__p">' + md(t.p) +
              '</div><div class="trouble__a">' + md(t.a) + "</div></div>";
          }).join("") +
        "</div></div>"
      : "";

    var sources = (scene.sources || []).length
      ? '<p class="footnote" style="padding:0 20px">Official sources: ' +
          scene.sources.map(function (s) {
            return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>";
          }).join(" · ") + "</p>"
      : "";

    return '' +
      topbar(scene.title, { back: "/", badge: scene.priority }) +
      '<section class="section">' +
        '<div class="panel">' +
          '<div class="panel__h">Task</div>' +
          '<p class="task">' + md(scene.task) + "</p>" +
          '<div class="meta">' +
            '<span class="chip">' + esc(scene.category) + "</span>" +
            '<span class="chip">' + esc(scene.eta) + "</span>" +
            '<span class="chip">' + scene.steps.length + " steps</span>" +
            '<span class="chip">Last updated ' + esc(scene.lastUpdated) + "</span>" +
          "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section">' +
        '<div class="panel">' +
          '<div class="panel__h">Before you start</div>' +
          '<ul class="checklist">' + before + "</ul>" +
        "</div>" +
        (scene.tip ? '<div class="panel panel--tip"><div class="panel__h">💡 Tip</div><p style="margin:0;font-size:14.5px;line-height:1.55">' + md(scene.tip) + "</p></div>" : "") +
      "</section>" +

      '<section class="section">' +
        '<div class="panel">' +
          '<div class="panel__h">Step by step<span class="n" id="stepcount">' + doneCount + " / " + total + " done</span></div>" +
          '<div class="steps__progress"><i id="stepbar" style="width:' + pct + '%"></i></div>' +
          '<div class="steps">' + steps + "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section"><div class="panel">' +
        '<div class="panel__h">Show this screen</div>' +
        showCard +
        '<div class="panel__h" style="margin-top:18px">Useful Chinese cards<span class="n">' + cards.length + " cards</span></div>" +
        "<div>" + cardList + "</div>" +
      "</div></section>" +

      '<section class="section">' + mistakes + "</section>" +
      '<section class="section">' + planB + "</section>" +
      '<section class="section">' + trouble + "</section>" +

      (scene.disclaimer
        ? '<section class="section"><div class="panel panel--warn"><div class="panel__h">⚠️ Please note</div>' +
          '<p style="margin:0;font-size:14px;line-height:1.55">' + md(scene.disclaimer) + "</p></div></section>"
        : "") +

      sources +

      '<section class="section">' +
        '<div class="btn-row stale">' +
          '<button class="btn btn--sm" data-stale="' + scene.id + '">This info is outdated</button>' +
          '<button class="btn btn--sm" data-go="/">Back to all tasks</button>' +
        "</div>" +
      "</section>";
  }

  function pageCards() {
    var groups = CARD_ORDER.map(function (key) {
      var g = CARD_GROUPS[key];
      if (!g) return "";
      var preview = g.cards.slice(0, 2).map(function (c) { return esc(c.zh); }).join(" · ");
      return '<button class="search__hit" data-go="/cards/' + key + '">' +
        '<span class="emoji">' + g.icon + "</span>" +
        "<span><b>" + esc(g.zh) + " · " + esc(g.title) + "</b>" +
        "<small>" + esc(g.hint || "") + " — " + g.cards.length + " cards</small>" +
        "<small>" + preview + "…</small></span>" +
      "</button>";
    }).join("");

    return '' +
      topbar("Help cards", { back: "/", badge: CARD_ORDER.length + " sets" }) +
      '<section class="section">' +
        '<div class="panel panel--tip"><div class="panel__h">How to use a card</div>' +
          '<p style="margin:0;font-size:14.5px;line-height:1.6">Tap any card to open it full screen. ' +
          "The Chinese is shown large — hand your phone to the person you are talking to. " +
          "Tap <b>Hide English</b> if the English line distracts them.</p>" +
          '<p style="margin:10px 0 0;font-size:13.5px;color:var(--muted);line-height:1.6">' +
          "Sets are ordered from <b>most urgent to least urgent</b> — if you don't know where to look, start at the top." +
          "</p></div>" +
      "</section>" +
      '<section class="section"><div class="panel">' + groups + "</div></section>";
  }

  function pageFaq() {
    return '' +
      topbar("FAQ", { back: "/" }) +
      '<section class="section"><div class="faq">' +
        FAQ.map(function (f) {
          return "<details><summary>" + esc(f.q) + '</summary><div class="a">' + esc(f.a) + "</div></details>";
        }).join("") +
      "</div></section>" +
      '<p class="footnote">Answers describe the common case. Rules change — confirm in the official app.</p>';
  }

  function pageEmergency() {
    var s = sceneById("emergency");
    return pageScene(s);
  }

  /* ---------------- full screen card ---------------- */

  var cs = { list: [], i: 0, label: "", from: "#/" };

  function openCardScreen(list, index, label) {
    if (!list || !list.length) return;
    cs.list = list;
    cs.i = Math.max(0, Math.min(index || 0, list.length - 1));
    cs.label = label || "Show this to them";
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
    $("#cs-label").textContent = cs.label;
    $("#cs-zh").textContent = c.zh;
    $("#cs-en").textContent = c.en;
    $("#cs-count").textContent = (cs.i + 1) + " / " + cs.list.length;
    $("#cs-prev").style.visibility = cs.i === 0 ? "hidden" : "visible";
    $("#cs-next").style.visibility = cs.i === cs.list.length - 1 ? "hidden" : "visible";
  }

  /* ---------------- router ---------------- */

  var lastPath = "/";

  function render() {
    var hash = (location.hash || "#/").replace(/^#/, "");
    var parts = hash.split("/").filter(Boolean);
    var page = parts[0] || "";

    if (page === "s" && sceneById(parts[1])) {
      app.innerHTML = pageScene(sceneById(parts[1]));
      window.scrollTo(0, 0);
      return;
    }

    if (page === "cards") {
      var key = parts[1];
      if (key && CARD_GROUPS[key]) {
        app.innerHTML = pageCards();
        var g = CARD_GROUPS[key];
        openCardScreen(g.cards, 0, g.icon + " " + g.title + " · " + g.zh);
      } else {
        app.innerHTML = pageCards();
      }
      window.scrollTo(0, 0);
      return;
    }

    if (page === "faq") { app.innerHTML = pageFaq(); window.scrollTo(0, 0); return; }
    if (page === "emergency") { app.innerHTML = pageEmergency(); window.scrollTo(0, 0); return; }

    app.innerHTML = pageHome();
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
    var t = e.target.closest("[data-go], [data-step], [data-card], [data-show], [data-stale]");
    if (!t) return;

    if (t.dataset.go !== undefined && t.hasAttribute("data-go")) {
      go("#" + t.dataset.go);
      return;
    }

    if (t.hasAttribute("data-step")) {
      var p = t.dataset.step.split(":");
      toggleDone(p[0], +p[1]);
      var wasDone = isDone(p[0], +p[1]);
      t.dataset.done = wasDone ? "1" : "0";

      // step counter + progress bar, without a full re-render
      var all = $$('[data-step^="' + p[0] + ':"]');
      var count = all.filter(function (el) { return el.dataset.done === "1"; }).length;
      var bar = $("#stepbar"), cnt = $("#stepcount");
      if (bar) bar.style.width = Math.round((count / all.length) * 100) + "%";
      if (cnt) cnt.textContent = count + " / " + all.length + " done";
      if (count === all.length && all.length) toast("All steps done 🎉");
      return;
    }

    if (t.hasAttribute("data-card")) {
      var pc = t.dataset.card.split(":");
      var sc = sceneById(pc[0]);
      openCardScreen(sceneCards(sc), +pc[1], "🗣️ " + sc.title + " · useful card");
      return;
    }

    if (t.hasAttribute("data-show")) {
      var s2 = sceneById(t.dataset.show);
      var lines = s2.showCard.lines.map(function (l) { return { zh: l, en: "" }; });
      openCardScreen(lines, 0, "🗣️ " + s2.showCard.title);
      return;
    }

    if (t.hasAttribute("data-stale")) {
      toast("Thanks — logged for review");
      return;
    }
  });

  /* checklist persistence */
  document.addEventListener("change", function (e) {
    var el = e.target;
    if (!el || !el.hasAttribute || !el.hasAttribute("data-check")) return;
    var k = el.dataset.check;
    if (el.checked) checks[k] = true; else delete checks[k];
    store.set("ccs.checks", checks);
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
    this.textContent = on ? "Show English" : "Hide English";
  });
  $("#cs-copy").addEventListener("click", function () {
    var self = this;
    var text = cs.list[cs.i] ? cs.list[cs.i].zh : "";
    function ok() {
      self.textContent = "Copied ✓";
      self.classList.add("done");
      setTimeout(function () { self.textContent = "Copy 中文"; self.classList.remove("done"); }, 1400);
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
    try { document.execCommand("copy"); ok(); } catch (e) { toast("Copy failed — select manually"); }
    document.body.removeChild(ta);
  }

  document.addEventListener("keydown", function (e) {
    if (screen.hidden) return;
    if (e.key === "Escape") closeFrom();
    if (e.key === "ArrowRight") { cs.i = Math.min(cs.i + 1, cs.list.length - 1); paintCard(); }
    if (e.key === "ArrowLeft") { cs.i = Math.max(cs.i - 1, 0); paintCard(); }
  });

  /* search */
  var q = $("#q");
  if (q) {
    q.addEventListener("input", function () {
      var v = q.value.trim().toLowerCase();
      var box = $("#results");
      if (!v) { box.hidden = true; box.innerHTML = ""; return; }

      var hits = [];
      SCENES.forEach(function (s) {
        var hay = (s.title + " " + s.subtitle + " " + s.task + " " + s.category).toLowerCase();
        if (hay.indexOf(v) > -1) {
          hits.push({ go: "/s/" + s.id, emoji: s.icon, title: s.title, sub: s.subtitle });
        }
      });
      CARD_ORDER.forEach(function (k) {
        var g = CARD_GROUPS[k];
        if (!g) return;
        var matched = g.cards.filter(function (c) {
          return (c.en + c.zh).toLowerCase().indexOf(v) > -1;
        });
        if (matched.length || (g.title + g.zh).toLowerCase().indexOf(v) > -1) {
          hits.push({ go: "/cards/" + k, emoji: g.icon, title: g.title, sub: matched.length + " matching cards" });
        }
      });

      box.hidden = false;
      box.innerHTML = hits.length
        ? hits.map(function (h) {
            return '<button class="search__hit" data-go="' + h.go + '"><span class="emoji">' + h.emoji +
              "</span><span><b>" + esc(h.title) + "</b><small>" + esc(h.sub) + "</small></span></button>";
          }).join("")
        : '<div class="panel"><p style="margin:0;color:var(--muted);font-size:14px">No match. Try “taxi”, “payment”, “train” or a Chinese word like “火车”.</p></div>';
    });
  }

  /* ---------------- boot ---------------- */

  if (!location.hash) location.hash = "#/";
  render();
})();
