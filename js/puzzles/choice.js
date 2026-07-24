/* ============================================================
   choice — pick the correct form. One or more questions,
   each cleared independently.
   ============================================================ */
(function (LEX) {
  "use strict";

  var U = LEX.util;
  LEX.puzzles = LEX.puzzles || {};

  LEX.puzzles.choice = {

    render: function (room) {
      return room.questions.map(function (q, qi) {
        return '<div class="qblock" data-q="' + qi + '">' +
          '<p class="q">' + q.q + "</p>" +
          '<div class="opts">' + q.opts.map(function (o, oi) {
            return '<button class="opt" data-o="' + oi + '">' + U.esc(o) + "</button>";
          }).join("") + "</div></div>";
      }).join("");
    },

    mount: function (room, api) {
      var done = {};
      var count = 0;

      function finish(qi, btn) {
        done[qi] = true; count++;
        btn.classList.add("right");
        U.$$(".opt", btn.closest(".qblock")).forEach(function (x) { x.disabled = true; });
        LEX.audio.play("good");
        api.say(room.questions[qi].why, "good");
        if (count === room.questions.length) setTimeout(function () { api.solved(); }, 780);
      }

      U.$$(".opt").forEach(function (b) {
        b.onclick = function () {
          var qi = +b.closest(".qblock").dataset.q;
          if (done[qi]) return;
          if (+b.dataset.o === room.questions[qi].a) { finish(qi, b); return; }
          b.classList.add("wrong");
          b.disabled = true;
          api.wrong("Not that one.");
        };
      });

      return {
        assist: function () {
          /* cut two wrong options from the first unanswered question */
          for (var qi = 0; qi < room.questions.length; qi++) {
            if (done[qi]) continue;
            var block = U.$('.qblock[data-q="' + qi + '"]');
            var wrongs = U.$$(".opt", block).filter(function (b) {
              return +b.dataset.o !== room.questions[qi].a && !b.disabled;
            });
            if (!wrongs.length) return false;
            U.shuffle(wrongs).slice(0, 2).forEach(function (b) {
              b.classList.add("cut");
              b.disabled = true;
            });
            api.say("The loupe strikes through two impostors in question " + (qi + 1) + ".", "gold");
            return true;
          }
          return false;
        }
      };
    }
  };
})(window.LEX);
