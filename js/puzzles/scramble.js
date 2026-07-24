/* ============================================================
   scramble — letters knocked out of their slots, or a riddle
   typed in free. Every puzzle module exposes:
     render(room) -> html
     mount(room, api) -> { assist? }
   ============================================================ */
(function (LEX) {
  "use strict";

  var U = LEX.util;
  LEX.puzzles = LEX.puzzles || {};

  LEX.puzzles.scramble = {

    render: function (room) {
      var answer = room.answer.toUpperCase();

      /* free-typing variant (the cellar riddle) */
      if (!room.letters) {
        return '<div class="field">' +
          '<input type="text" id="ans" placeholder="type your answer" autocomplete="off" spellcheck="false" ' +
            'maxlength="' + (answer.length + 6) + '">' +
          '<button class="btn" id="try">Try the lock</button>' +
        "</div>";
      }

      /* tile variant */
      var slots = "";
      for (var i = 0; i < answer.length; i++) {
        slots += '<button class="slot" data-slot="' + i + '" aria-label="letter ' + (i + 1) + '"></button>';
      }
      var tiles = room.letters.split("").map(function (c, i) {
        return '<button class="tile" data-tile="' + i + '" style="animation-delay:' + (i * 55) + 'ms">' + c + "</button>";
      }).join("");

      return '<div class="slots" id="slots">' + slots + "</div>" +
             '<div class="tiles" id="tiles">' + tiles + "</div>" +
             '<div class="actions" style="margin-top:0">' +
               '<button class="btn ghost" id="clear">Clear the slots</button>' +
             "</div>";
    },

    mount: function (room, api) {
      var answer = room.answer.toUpperCase();

      /* ---------------- typed ---------------- */
      if (!room.letters) {
        var inp = U.$("#ans");
        var check = function () {
          var v = inp.value.trim();
          if (!v) return;
          if (U.same(v, answer)) { LEX.audio.play("good"); api.solved(); return; }
          api.wrong("The lock does not move.");
          inp.value = "";
          inp.focus();
        };
        U.$("#try").onclick = check;
        inp.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
        inp.focus();

        return {
          assist: function () {
            var half = Math.ceil(answer.length / 2);
            inp.value = answer.slice(0, half);
            inp.focus();
            api.say("The loupe scratches out the first " + half + " letters: <b>" + answer.slice(0, half) + "</b>…", "gold");
            return true;
          }
        };
      }

      /* ---------------- tiles ---------------- */
      var slots = U.$$(".slot");
      var tiles = U.$$(".tile");
      var slotsBox = U.$("#slots");
      var owner = [];      // slot index -> tile index
      var locked = 0;      // how many leading slots the loupe has fixed

      function firstEmpty() {
        for (var i = 0; i < slots.length; i++) if (owner[i] == null) return i;
        return -1;
      }
      function full() { return firstEmpty() === -1; }

      function put(tileIdx, slotIdx) {
        owner[slotIdx] = tileIdx;
        slots[slotIdx].textContent = tiles[tileIdx].textContent;
        slots[slotIdx].classList.add("filled");
        tiles[tileIdx].classList.add("used");
      }
      function pull(slotIdx) {
        var t = owner[slotIdx];
        if (t == null) return;
        tiles[t].classList.remove("used");
        owner[slotIdx] = null;
        slots[slotIdx].textContent = "";
        slots[slotIdx].classList.remove("filled");
      }
      function clearAll() {
        for (var i = locked; i < slots.length; i++) pull(i);
        slotsBox.classList.remove("good", "bad");
      }
      function read() {
        return slots.map(function (s) { return s.textContent || " "; }).join("");
      }

      function check() {
        if (read() === answer) {
          slotsBox.classList.add("good");
          LEX.audio.play("good");
          setTimeout(function () { api.solved(); }, 480);
          return;
        }
        U.flash(slotsBox, "bad", 360);
        api.wrong("The plate rejects that word.");
        setTimeout(clearAll, 380);
      }

      tiles.forEach(function (t) {
        t.onclick = function () {
          var s = firstEmpty();
          if (s < 0) return;
          put(+t.dataset.tile, s);
          LEX.audio.play("place");
          if (full()) setTimeout(check, 260);
        };
      });
      slots.forEach(function (s) {
        s.onclick = function () {
          var i = +s.dataset.slot;
          if (i < locked) return;
          pull(i);
          LEX.audio.play("click");
        };
      });
      U.$("#clear").onclick = function () { clearAll(); LEX.audio.play("click"); };

      return {
        assist: function () {
          var half = Math.ceil(answer.length / 2);
          if (locked >= half) return false;
          clearAll();
          for (var i = 0; i < half; i++) {
            var want = answer[i], found = -1;
            for (var t = 0; t < tiles.length; t++) {
              if (!tiles[t].classList.contains("used") && tiles[t].textContent === want) { found = t; break; }
            }
            if (found < 0) continue;
            put(found, i);
            slots[i].classList.add("given");
          }
          locked = half;
          api.say("The loupe seats the first " + half + " letters for you.", "gold");
          return true;
        }
      };
    }
  };
})(window.LEX);
