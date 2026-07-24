/* ============================================================
   match — two columns, seat every plaque in the right frame.
   ============================================================ */
(function (LEX) {
  "use strict";

  var U = LEX.util;
  LEX.puzzles = LEX.puzzles || {};

  LEX.puzzles.match = {

    render: function (room) {
      var left = room.pairs.map(function (p, i) { return { t: p[0], i: i }; });
      var right = U.shuffle(room.pairs.map(function (p, i) { return { t: p[1], i: i }; }));

      function col(id, rows, extra) {
        return '<div id="' + id + '">' + rows.map(function (x) {
          return '<button class="pair ' + extra + '" data-i="' + x.i + '">' + U.esc(x.t) + "</button>";
        }).join("") + "</div>";
      }

      return '<div class="match">' + col("colA", left, "idiom") + col("colB", right, "") + "</div>";
    },

    mount: function (room, api) {
      var total = room.pairs.length;
      var sel = null;
      var found = 0;

      function seat(a, b, quiet) {
        a.classList.remove("sel");
        a.classList.add("locked");
        b.classList.add("locked");
        found++;
        if (!quiet) LEX.audio.play("good");
        api.say("Plaque seated. " + found + " of " + total + ".", "good");
        if (found === total) setTimeout(function () { api.solved(); }, 620);
      }

      U.$$(".pair").forEach(function (b) {
        b.onclick = function () {
          var col = b.parentElement.id;
          if (!sel) { sel = b; b.classList.add("sel"); LEX.audio.play("click"); return; }
          if (sel === b) { sel = null; b.classList.remove("sel"); return; }
          if (sel.parentElement.id === col) {
            sel.classList.remove("sel"); sel = b; b.classList.add("sel"); LEX.audio.play("click"); return;
          }
          if (sel.dataset.i === b.dataset.i) { var a = sel; sel = null; seat(a, b); return; }

          var miss = sel;
          sel = null;
          miss.classList.add("miss");
          b.classList.add("miss");
          setTimeout(function () {
            miss.classList.remove("miss", "sel");
            b.classList.remove("miss");
          }, 340);
          api.wrong("Wrong frame.");
        };
      });

      return {
        assist: function () {
          var open = U.$$("#colA .pair").filter(function (b) { return !b.classList.contains("locked"); });
          if (!open.length) return false;
          var a = open[0];
          var b = U.$('#colB .pair[data-i="' + a.dataset.i + '"]');
          if (sel) { sel.classList.remove("sel"); sel = null; }
          api.say("The loupe seats one plaque for you.", "gold");
          seat(a, b, true);
          return true;
        }
      };
    }
  };
})(window.LEX);
