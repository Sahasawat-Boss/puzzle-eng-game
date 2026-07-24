/* ============================================================
   order — words tipped out of a sentence, put back in sequence.
   Several sentences, one at a time.
   ============================================================ */
(function (LEX) {
  "use strict";

  var U = LEX.util;
  LEX.puzzles = LEX.puzzles || {};

  var GHOST = '<span class="ghosttext">TAP THE WORDS BELOW</span>';

  LEX.puzzles.order = {

    render: function (room) {
      return '<p class="progress" id="prog">SENTENCE 1 OF ' + room.sentences.length + "</p>" +
        '<div class="line" id="line">' + GHOST + "</div>" +
        '<div class="bank" id="bank"></div>' +
        '<div class="actions" style="margin-top:0">' +
          '<button class="btn ghost" id="tip">Tip it out again</button>' +
        "</div>";
    },

    mount: function (room, api) {
      var line = U.$("#line"), bank = U.$("#bank"), prog = U.$("#prog");
      var idx = 0, words = [], settled = false;

      function build() {
        var s = room.sentences[idx];
        words = s.answer.split(/\s+/);
        prog.textContent = "SENTENCE " + (idx + 1) + " OF " + room.sentences.length;
        line.className = "line";
        line.innerHTML = GHOST;
        bank.innerHTML = U.shuffleHard(words.map(function (w, i) { return i; }))
          .map(function (i, pos) {
            return '<button class="chip" data-w="' + i + '" style="animation-delay:' + (pos * 45) + 'ms">' +
                   U.esc(words[i]) + "</button>";
          }).join("");
        settled = false;
      }

      function placed() { return U.$$(".chip", line); }

      function ghost() {
        var has = placed().length > 0;
        var g = line.querySelector(".ghosttext");
        if (has && g) g.remove();
        if (!has && !g) line.insertAdjacentHTML("afterbegin", GHOST);
      }

      function toLine(chip) {
        chip.classList.add("placed");
        line.appendChild(chip);
        ghost();
      }

      function toBank(chip) {
        chip.classList.remove("placed");
        var w = +chip.dataset.w, before = null;
        U.$$(".chip", bank).some(function (c) {
          if (+c.dataset.w > w) { before = c; return true; }
          return false;
        });
        bank.insertBefore(chip, before);
        ghost();
      }

      function read() {
        return placed().map(function (c) { return c.textContent; }).join(" ");
      }

      function check() {
        var s = room.sentences[idx];
        if (U.same(read(), s.answer)) {
          settled = true;
          line.classList.add("good");
          LEX.audio.play("good");
          api.say(s.why, "good");
          idx++;
          if (idx >= room.sentences.length) { setTimeout(function () { api.solved(); }, 900); return; }
          setTimeout(function () { build(); api.say("Next one. " + (room.sentences.length - idx) + " to go.", "gold"); }, 1100);
          return;
        }
        U.flash(line, "bad", 380);
        api.wrong("That is not English yet.");
        setTimeout(function () {
          placed().forEach(function (c) { if (!c.classList.contains("fixed")) toBank(c); });
        }, 420);
      }

      function tapped(chip) {
        if (settled || chip.classList.contains("fixed")) return;
        if (chip.parentElement === bank) {
          toLine(chip);
          LEX.audio.play("place");
          if (placed().length === words.length) setTimeout(check, 300);
        } else {
          toBank(chip);
          LEX.audio.play("click");
        }
      }

      [line, bank].forEach(function (host) {
        host.addEventListener("click", function (e) {
          var chip = e.target.closest && e.target.closest(".chip");
          if (chip) tapped(chip);
        });
      });

      U.$("#tip").onclick = function () {
        if (settled) return;
        placed().forEach(function (c) { if (!c.classList.contains("fixed")) toBank(c); });
        LEX.audio.play("click");
      };

      build();

      return {
        assist: function () {
          if (settled) return false;
          var want = words[placed().length];
          if (want == null) return false;
          var chip = U.$$(".chip", bank).filter(function (c) {
            return c.textContent.toLowerCase() === want.toLowerCase();
          })[0];
          if (!chip) return false;
          toLine(chip);
          chip.classList.add("fixed");
          api.say("The loupe sets one word in place: <b>" + U.esc(want) + "</b>.", "gold");
          if (placed().length === words.length) setTimeout(check, 320);
          return true;
        }
      };
    }
  };
})(window.LEX);
