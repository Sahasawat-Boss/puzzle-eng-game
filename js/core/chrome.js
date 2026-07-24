/* ============================================================
   Chrome — status bar, door rail, tumbler drums, satchel, shell.
   Renders state; never changes it.
   ============================================================ */
(function (LEX) {
  "use strict";

  var U = LEX.util;
  var el = {};

  function cache() {
    el.app = U.$("#app");
    el.status = U.$("#status");
    el.clock = U.$("#clock");
    el.coins = U.$("#coins");
    el.dots = U.$("#dots");
    el.drums = U.$("#drums");
    el.lock = U.$("#lock");
    el.mute = U.$("#mutebtn");
  }

  var chrome = {

    init: function () { cache(); },

    /* ---------------- status bar ---------------- */
    paint: function () {
      var S = LEX.S;
      el.clock.innerHTML = "TIME <b>" + U.fmt(S.time) + "</b>" +
        (S.paused ? ' <span style="color:#9aa6a3">‖</span>' : "");
      el.clock.classList.toggle("urgent", S.time <= 60);
      el.clock.classList.toggle("paused", S.paused);

      el.coins.innerHTML = "◉ <b>" + S.coins + "</b>";

      var dots = "";
      var slots = LEX.RUN ? LEX.RUN.mode.hints : 0;   // no run yet on the title screen
      for (var i = 0; i < Math.max(slots, S.hints); i++) {
        dots += '<i class="' + (i < S.hints ? "on" : "") + '"></i>';
      }
      el.dots.innerHTML = dots;

      if (el.mute) el.mute.classList.toggle("off", LEX.audio.muted);

      var purse = U.$("#purse");
      if (purse) purse.textContent = "◉ " + S.coins;
      var side = U.$("#sidepurse");
      if (side) side.textContent = "◉ " + S.coins;
    },

    showChrome: function (on) {
      el.status.hidden = !on;
      el.lock.hidden = !on;
    },

    /* ---------------- tumbler lock ---------------- */
    buildDrums: function () {
      var cells = "";
      for (var n = 0; n <= 9; n++) cells += "<span>" + n + "</span>";
      var html = "";
      for (var p = 1; p <= LEX.RUN.slots; p++) {
        html += '<div class="drum" data-slot="' + p + '"><div class="reel">' +
                "<span>◆</span>" + cells + '</div><b class="pos">' + p + "</b></div>";
      }
      el.drums.innerHTML = html;
    },

    spinDrum: function (slot, digit) {
      var d = el.drums.querySelector('.drum[data-slot="' + slot + '"]');
      if (!d) return;
      d.classList.add("set");
      d.querySelector(".reel").style.transform = "translateY(-" + ((+digit + 1) * 52) + "px)";
      LEX.audio.play("drum");
    },

    /* ---------------- door rail ---------------- */
    rail: function () {
      var S = LEX.S;
      var items = LEX.RUN.rooms.map(function (r, i) {
        var cls = S.cleared[i] ? "done" : (i === S.room ? "here" : "");
        if (r.treasure) cls += " gold";
        var mark = r.treasure ? "◈" : r.numeral;
        return '<div class="door ' + cls + '"><span class="num">' + mark + "</span>" +
               '<span class="name">' + r.short + "</span></div>";
      }).join("");

      return '<aside class="rail"><p class="rail-h">DOORS</p><div class="rail-list">' + items +
        '<div class="door ' + (S.room >= LEX.RUN.rooms.length ? "here" : "") + '">' +
        '<span class="num">✕</span><span class="name">EXIT</span></div>' +
        "</div></aside>";
    },

    /* ---------------- right panel: satchel + the pedlar ---------------- */
    side: function () {
      var S = LEX.S;
      var owned = LEX.ITEMS.filter(function (it) { return S.inv[it.id]; });

      var items = owned.length
        ? owned.map(function (it) {
            var usable = LEX.game.canUse(it.id);
            return '<button class="item" data-item="' + it.id + '"' + (usable ? "" : " disabled") +
                   ' title="' + U.esc(it.desc) + '">' +
                   '<span class="g">' + it.glyph + "</span>" +
                   '<span class="t">' + it.short + "</span>" +
                   '<span class="n">×' + S.inv[it.id] + "</span></button>";
          }).join("")
        : '<p class="empty">Empty. Everything in here is bought.</p>';

      return '<aside class="side" id="side">' +
        '<p class="rail-h">SATCHEL</p>' +
        '<div class="satchel">' + items + "</div>" +
        '<button class="btn ghost wide" data-openshop="1">Pedlar\'s tray</button>' +
        '<p class="sidepurse">IN PURSE <b id="sidepurse">◉ ' + S.coins + "</b></p>" +
      "</aside>";
    },

    refreshSide: function () {
      var old = U.$("#side");
      if (!old) return;
      var box = document.createElement("div");
      box.innerHTML = chrome.side();
      old.replaceWith(box.firstChild);
    },

    /* ---------------- page shell ---------------- */
    shell: function (inner) {
      el.app.innerHTML = '<div class="stage">' + chrome.rail() +
                         '<section class="panel">' + inner + "</section>" +
                         chrome.side() + "</div>";
    },

    full: function (inner) { el.app.innerHTML = inner; }
  };

  LEX.chrome = chrome;
})(window.LEX);
