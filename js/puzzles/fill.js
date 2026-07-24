/* ============================================================
   fill — a cloze sentence. Tap a gap, then tap a word.
   The tray is not consumed: a word can serve two gaps.
   ============================================================ */
(function (LEX) {
  "use strict";

  var U = LEX.util;
  LEX.puzzles = LEX.puzzles || {};

  LEX.puzzles.fill = {

    render: function (room) {
      /* "…set out {0} dawn…" -> text + <button class="gap"> */
      var html = room.sentence.replace(/\{(\d+)\}/g, function (_, n) {
        return '<button class="gap" data-g="' + n + '">?</button>';
      });

      return '<p class="cloze">' + html + "</p>" +
        '<div class="bank" id="bank">' + room.bank.map(function (w, i) {
          return '<button class="chip" data-w="' + U.esc(w) + '" style="animation-delay:' + (i * 45) + 'ms">' +
                 U.esc(w) + "</button>";
        }).join("") + "</div>" +
        '<p class="progress" id="prog">0 OF ' + room.gaps.length + " PLACED</p>";
    },

    mount: function (room, api) {
      var gaps = U.$$(".gap");
      var prog = U.$("#prog");
      var sel = null;
      var done = 0;

      function pick(g) {
        if (sel) sel.classList.remove("sel");
        sel = g;
        g.classList.add("sel");
        LEX.audio.play("click");
      }

      function nextOpen() {
        return gaps.filter(function (g) { return !g.classList.contains("done"); })[0] || null;
      }

      function paintProg() {
        prog.textContent = done + " OF " + room.gaps.length + " PLACED";
      }

      function seat(g, word, quiet) {
        g.textContent = word;
        g.classList.remove("sel");
        g.classList.add("done");
        done++;
        paintProg();
        if (!quiet) LEX.audio.play("good");
        api.say(room.gaps[+g.dataset.g].why, "good");
        if (sel === g) sel = null;
        if (done === room.gaps.length) setTimeout(function () { api.solved(); }, 760);
      }

      function tryWord(word) {
        var g = sel || nextOpen();
        if (!g) return;
        if (word.toLowerCase() === room.gaps[+g.dataset.g].a.toLowerCase()) { seat(g, word); return; }
        g.textContent = word;
        U.flash(g, "miss", 420);
        setTimeout(function () { if (!g.classList.contains("done")) g.textContent = "?"; }, 430);
        api.wrong("That word will not sit there.");
      }

      gaps.forEach(function (g) {
        g.onclick = function () { pick(g); };
      });
      U.$("#bank").addEventListener("click", function (e) {
        var chip = e.target.closest && e.target.closest(".chip");
        if (chip) tryWord(chip.dataset.w);
      });

      pick(gaps[0]);
      paintProg();

      return {
        assist: function () {
          var g = nextOpen();
          if (!g) return false;
          api.say("The loupe fills one gap for you.", "gold");
          seat(g, room.gaps[+g.dataset.g].a, true);
          return true;
        }
      };
    }
  };
})(window.LEX);
