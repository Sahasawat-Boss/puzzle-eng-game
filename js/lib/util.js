/* ============================================================
   LEX — global namespace. Plain scripts on purpose: the game
   must run from a double-clicked file:// page, no server, no build.
   ============================================================ */
window.LEX = window.LEX || {};

(function (LEX) {
  "use strict";

  var U = {

    $: function (sel, root) { return (root || document).querySelector(sel); },
    $$: function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); },

    /** 754 -> "12:34" */
    fmt: function (sec) {
      sec = Math.max(0, Math.floor(sec));
      return String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0");
    },

    /** Fisher–Yates, in place. */
    shuffle: function (a) {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    },

    /** Shuffle, but never hand back the original order (for word banks). */
    shuffleHard: function (a) {
      if (a.length < 2) return a.slice();
      var original = a.join(""), out;
      for (var guard = 0; guard < 24; guard++) {
        out = U.shuffle(a.slice());
        if (out.join("") !== original) return out;
      }
      return out;
    },

    esc: function (s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    },

    /** Loose comparison for typed English: case, spacing and punctuation don't count. */
    same: function (a, b) {
      var norm = function (s) {
        return String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
      };
      return norm(a) === norm(b);
    },

    /** Type a line of text out, character by character. */
    typeOut: function (el, text, speed) {
      var i = 0;
      var id = setInterval(function () {
        el.innerHTML = U.esc(text.slice(0, ++i)) + '<span class="caret">&nbsp;</span>';
        if (i >= text.length) clearInterval(id);
      }, speed || 34);
      return function stop() { clearInterval(id); };
    },

    /** Add a class, strip it after ms. Returns nothing. */
    flash: function (el, cls, ms) {
      if (!el) return;
      el.classList.add(cls);
      setTimeout(function () { el.classList.remove(cls); }, ms || 340);
    }
  };

  LEX.util = U;
})(window.LEX);
