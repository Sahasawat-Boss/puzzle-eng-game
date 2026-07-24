/* ============================================================
   The pedlar's tray — buying, and what each purchase does.
   ============================================================ */
(function (LEX) {
  "use strict";

  var U = LEX.util;

  /* What an item does when tapped in the satchel.
     Return false to refuse the use — the item is then not consumed. */
  var EFFECTS = {

    watch: function () {
      LEX.state.grant(60);
      LEX.fx.toast("The watch winds 60 seconds back on", "good");
      return true;
    },

    note: function () {
      LEX.S.hints++;
      LEX.S.freeHints++;
      LEX.chrome.paint();
      LEX.fx.toast("One more hint, and this one is free of time", "good");
      return true;
    },

    seal: function () {
      LEX.S.shield++;
      LEX.fx.toast("A wax seal will absorb your next mistake", "good");
      return true;
    },

    sand: function () {
      LEX.state.holdClock(LEX.RULES.freezeSpan);
      LEX.fx.toast("The clock is held for " + LEX.RULES.freezeSpan + " seconds", "good");
      return true;
    },

    loupe: function () { return LEX.game.assist(); },

    key: function () { return LEX.game.masterKey(); }
  };

  var shop = {

    init: function () {
      U.$("#shopbtn").onclick = function () { shop.open(); };
      U.$("#shopclose").onclick = function () { shop.close(); };
      U.$("#shop").addEventListener("click", function (e) {
        if (e.target.id === "shop") shop.close();          // click the shade
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !U.$("#shop").hidden) shop.close();
      });

      /* delegated: satchel items + every "SHOP" chip in the page body */
      document.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-item],[data-openshop]") : null;
        if (!t) return;
        if (t.hasAttribute("data-openshop")) { shop.open(); return; }
        if (!t.disabled) shop.use(t.getAttribute("data-item"), t);
      });
    },

    open: function () {
      if (LEX.S.over) return;
      LEX.state.pause();
      U.$("#shop").hidden = false;
      shop.paint();
      LEX.audio.play("click");
    },

    close: function () {
      U.$("#shop").hidden = true;
      if (!LEX.S.over) LEX.state.resume();
      LEX.chrome.refreshSatchel();
    },

    paint: function () {
      var S = LEX.S;
      U.$("#purse").textContent = "◉ " + S.coins;
      U.$("#shopgrid").innerHTML = LEX.ITEMS.map(function (it) {
        var poor = S.coins < it.price;
        var own = S.inv[it.id] || 0;
        return '<div class="card' + (poor ? " poor" : "") + '" data-card="' + it.id + '">' +
          (own ? '<span class="own">OWNED ×' + own + "</span>" : "") +
          '<span class="ico">' + it.glyph + "</span>" +
          "<h3>" + it.name + "</h3>" +
          "<p>" + it.desc + "</p>" +
          '<div class="foot"><span class="price">◉ ' + it.price + "</span>" +
            '<button class="card-buy" data-buy="' + it.id + '"' + (poor ? " disabled" : "") + ">Buy</button>" +
          "</div></div>";
      }).join("");

      U.$$("[data-buy]").forEach(function (b) {
        b.onclick = function () { shop.buy(b.getAttribute("data-buy")); };
      });
    },

    buy: function (id) {
      var it = LEX.item(id);
      if (!it) return;
      if (!LEX.state.spend(it.price)) { LEX.fx.toast("Not enough coin", "bad"); return; }
      LEX.state.give(id, 1);
      LEX.audio.play("buy");
      var card = U.$('[data-card="' + id + '"]');
      U.flash(card, "bought", 520);
      shop.paint();
      LEX.fx.toast(it.name + " into the satchel", "good");
    },

    /** Use an owned item. */
    use: function (id, btn) {
      if (!LEX.state.count(id)) return;
      var fn = EFFECTS[id];
      if (!fn) return;
      var ok = fn();
      if (ok === false) { LEX.fx.toast("Nothing here for that item", "bad"); return; }
      LEX.state.take(id);
      LEX.audio.play("use");
      if (btn) U.flash(btn, "spend", 520);
      LEX.chrome.refreshSatchel();
      LEX.chrome.paint();
    }
  };

  LEX.shop = shop;
})(window.LEX);
