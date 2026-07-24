/* ============================================================
   Screen effects — dust, flying coins, brass sparks, toasts.
   Purely decorative: nothing here owns game state.
   ============================================================ */
(function (LEX) {
  "use strict";

  var U = LEX.util;
  var layer = null;

  function fxLayer() { return layer || (layer = U.$("#fxlayer")); }

  var FX = {

    /** Fill the fixed dust layer with slow-rising motes. */
    dust: function (count) {
      var host = U.$("#dust");
      if (!host) return;
      var html = "";
      for (var i = 0; i < (count || 26); i++) {
        var dur = 14 + Math.random() * 20;
        html += '<i style="left:' + (Math.random() * 100).toFixed(2) + '%;' +
                'top:' + (55 + Math.random() * 55).toFixed(2) + '%;' +
                'animation-duration:' + dur.toFixed(1) + 's;' +
                'animation-delay:-' + (Math.random() * dur).toFixed(1) + 's;' +
                'opacity:0"></i>';
      }
      host.innerHTML = html;
    },

    /**
     * Coins arcing from a source point up into the purse meter.
     * @param {number} n     how many coins
     * @param {Element} from element they fly out of (defaults: screen centre)
     */
    coinBurst: function (n, from) {
      var host = fxLayer(), purse = U.$("#coins");
      if (!host || !purse) return;

      var target = purse.getBoundingClientRect();
      var src = from ? from.getBoundingClientRect() : null;
      var x0 = src ? src.left + src.width / 2 : window.innerWidth / 2;
      var y0 = src ? src.top + src.height / 2 : window.innerHeight / 2;
      var total = Math.max(1, Math.min(n, 14));

      for (var i = 0; i < total; i++) {
        (function (i) {
          setTimeout(function () {
            var c = document.createElement("div");
            c.className = "flycoin";
            c.style.left = (x0 - 7 + (Math.random() * 60 - 30)) + "px";
            c.style.top = (y0 - 7 + (Math.random() * 30 - 15)) + "px";
            host.appendChild(c);
            LEX.audio.play("coin");

            var dx = target.left + target.width / 2 - parseFloat(c.style.left);
            var dy = target.top + target.height / 2 - parseFloat(c.style.top);
            requestAnimationFrame(function () {
              c.style.transform = "translate(" + dx + "px," + dy + "px) scale(.45)";
              c.style.opacity = "0";
            });
            setTimeout(function () { c.remove(); }, 1100);
          }, i * 65);
        })(i);
      }

      U.flash(purse, "bump", 460);
    },

    /** Brass sparks thrown outward from an element (or the screen middle). */
    sparks: function (n, from) {
      var host = fxLayer();
      if (!host) return;
      var r = from ? from.getBoundingClientRect() : null;
      var x0 = r ? r.left + r.width / 2 : window.innerWidth / 2;
      var y0 = r ? r.top + r.height / 2 : window.innerHeight / 3;

      for (var i = 0; i < (n || 26); i++) {
        var s = document.createElement("div");
        s.className = "spark";
        s.style.left = x0 + "px";
        s.style.top = y0 + "px";
        host.appendChild(s);
        var ang = Math.random() * Math.PI * 2;
        var dist = 70 + Math.random() * 240;
        (function (s, ang, dist) {
          requestAnimationFrame(function () {
            s.style.transform = "translate(" + Math.cos(ang) * dist + "px," +
                                (Math.sin(ang) * dist + 120) + "px) scale(" + (0.4 + Math.random()) + ")";
            s.style.opacity = "0";
          });
          setTimeout(function () { s.remove(); }, 1250);
        })(s, ang, dist);
      }
    },

    /** Small line of text near the lock. kind: "" | "good" | "bad" */
    toast: function (text, kind) {
      var host = fxLayer();
      if (!host) return;
      var t = document.createElement("div");
      t.className = "toast " + (kind || "");
      t.textContent = text;
      host.appendChild(t);
      setTimeout(function () { t.remove(); }, 2500);
    }
  };

  LEX.fx = FX;
})(window.LEX);
