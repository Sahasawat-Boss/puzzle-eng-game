/* ============================================================
   Flow — title, rooms, rewards, the exit lever, endings.
   ============================================================ */
(function (LEX) {
  "use strict";

  var U = LEX.util;
  var R = LEX.RULES;
  var st = LEX.state;

  /* whatever the player is standing in front of right now */
  var cur = { room: null, ctrl: null };

  /* ---------------- the little API handed to puzzle modules ---------------- */
  var api = {
    say: function (html, kind) {
      var s = U.$("#say");
      if (!s) return;
      s.className = "say " + (kind || "");
      s.innerHTML = html;
    },

    /** Book a wrong answer: tally it, take the seconds, say so. */
    wrong: function (msg) {
      st.countWrong();
      LEX.audio.play("bad");
      api.say((msg || "Wrong.") + " −" + R.wrongCost + " seconds.", "bad");
    },

    solved: function () { game.solved(cur.room, false); }
  };

  var game = {

    /* ================= title ================= */
    intro: function () {
      LEX.chrome.showChrome(false);
      LEX.chrome.full(
        '<section class="intro">' +
        '<div class="introtext">' +
          '<p class="sub" id="typed">&nbsp;<span class="caret">&nbsp;</span></p>' +
          '<h1 class="title">THE<br>LEXI<span>CON</span></h1>' +
          '<div class="prose">' +
            "<p>You came to the archive for one book. The door closed on its own, and every lock in the building " +
            "is spelled rather than cut — a code broken into brass chips, one lever at the end.</p>" +
            "<p>A hint costs " + R.hintCost + " seconds, a wrong answer " + R.wrongCost + ". Rooms pay " +
            '<span class="coin">◉ coin</span> for clean English, the treasure rooms pay nothing else, and the ' +
            "pedlar in the corridor sells minutes back to you.</p>" +
          "</div>" +
          '<p class="pick">CHOOSE YOUR WAY IN</p>' +
          '<div class="modes">' + LEX.MODES.map(game.modeCard).join("") + "</div>" +
        "</div>" +
        /* two plates salvaged from an earlier visitor's run, the second pinned over the corner */
        '<div class="platewrap">' +
          '<figure class="plate">' +
            '<img src="assets/images/sample-game-image1.png" width="1246" height="706" ' +
              'alt="The Lexicon in play: the vault door with its dial turning, the doors listed down the left, ' +
              'the satchel panel on the right.">' +
            "<figcaption>SALVAGED PLATE · DOOR VII, THE VAULT</figcaption>" +
          "</figure>" +
          '<figure class="plate inset">' +
            '<img src="assets/images/sample-game-image2.png" width="533" height="262" ' +
              'alt="A chart table with a dashed route across it and a turning globe beside it.">' +
            "<figcaption>PLATE V · THE MAP ROOM</figcaption>" +
          "</figure>" +
        "</div>" +
        "</section>"
      );
      U.typeOut(U.$("#typed"), "AN ENGLISH ESCAPE · NINE ROOMS · TWO WAYS THROUGH");
      U.$$(".mode").forEach(function (b) {
        b.onclick = function () { game.begin(b.dataset.mode); };
      });
    },

    /** One brass plaque per mode, on the title screen. */
    modeCard: function (mode) {
      var frags = LEX.fragmentCount(mode);
      var treasure = mode.rooms.filter(function (i) { return LEX.ROOMS[i].treasure; }).length;
      return '<button class="mode mode-' + mode.id + '" data-mode="' + mode.id + '">' +
        '<span class="mtag">' + mode.tag + "</span>" +
        "<b>" + mode.label + "</b>" +
        '<span class="mfig">' + mode.rooms.length + " rooms · " + U.fmt(mode.time) + " · " +
          mode.hints + " hints</span>" +
        "<p>" + mode.blurb + "</p>" +
        '<span class="mfoot">' + frags + " fragments to find" +
          (treasure ? " · " + treasure + " treasure room" + (treasure > 1 ? "s" : "") : "") + "</span>" +
      "</button>";
    },

    begin: function (modeId) {
      st.beginRun(modeId);
      LEX.chrome.showChrome(true);
      LEX.chrome.buildDrums();
      LEX.chrome.paint();
      st.startClock();
      LEX.audio.play("unlock");
      game.render();
    },

    /* ================= a room ================= */
    render: function () {
      var S = LEX.S;
      if (S.room >= LEX.RUN.rooms.length) return game.exitDoor();

      var r = LEX.RUN.rooms[S.room];
      var mod = LEX.puzzles[r.type];
      st.enterRoom();
      cur.room = r;
      cur.ctrl = null;

      var eyebrow = r.treasure
        ? "DOOR " + r.numeral + " · TREASURE — PAYS COIN, NO FRAGMENT"
        : "DOOR " + r.numeral;

      LEX.chrome.shell(
        '<p class="eyebrow">' + eyebrow + "</p>" +
        '<h1 class="room">' + r.name + "</h1>" +
        LEX.scene(r.scene) +
        '<div class="prose"><p>' + r.intro + "</p></div>" +
        '<div class="rule"></div>' +
        '<p class="task prose"><strong>' + r.task + "</strong></p>" +
        mod.render(r) +
        '<p class="say" id="say"></p>' +
        '<div id="hintslot"></div>' +
        '<div class="actions"><button class="btn ghost" id="hint">Ask for a hint · −' + R.hintCost + "s</button></div>"
      );

      cur.ctrl = mod.mount(r, api) || {};
      LEX.chrome.refreshSide();      // the loupe only knows now whether it has work

      U.$("#hint").onclick = function () {
        var how = st.useHint();
        if (!how) { api.say("No hints left. You are on your own.", "bad"); return; }
        U.$("#hintslot").innerHTML = '<div class="hintbox">' + r.hint + "</div>";
        U.$("#hint").remove();
        LEX.audio.play("use");
        if (how === "free") LEX.fx.toast("The curator's note costs you no time", "good");
      };
    },

    /* ================= reward ================= */
    solved: function (r, viaKey) {
      var S = LEX.S;
      S.cleared[S.room] = true;
      cur.room = null;               // no second turn of the master key
      cur.ctrl = null;

      if (r.slot) {
        S.fragments[r.slot] = r.digit;
        LEX.chrome.spinDrum(r.slot, r.digit);
      }

      var pay = st.reward(r, viaKey);
      var last = S.room + 1 >= LEX.RUN.rooms.length;

      var prize = r.slot
        ? '<div class="chipdrop" id="prize">' + r.digit + "</div>" +
          "<p>The lock gives. A brass chip falls into your hand, stamped <b>" + r.digit +
          '</b> with a smaller mark on the reverse: <b style="font-family:var(--mono);color:var(--brass)">slot ' +
          r.slot + "</b>. It has taken its place on the lock below.</p>"
        : '<div class="chipdrop" id="prize">◉</div>' +
          "<p>No lock, no chip — the balance simply tips your way and the coin is yours. " +
          "Spend it well; the doors ahead do not.</p>";

      var ledger = pay.viaKey
        ? '<div class="ledger"><div>Master key used<b>—</b></div>' +
          '<div class="tot">Coin from this room<b>◉ 0</b></div></div>'
        : '<div class="ledger">' +
            "<div>Room fee<b>◉ " + pay.base + "</b></div>" +
            '<div class="' + (pay.noHint ? "" : "zero") + '">No hint taken<b>◉ ' + pay.noHint + "</b></div>" +
            '<div class="' + (pay.clean ? "" : "zero") + '">Not one wrong answer<b>◉ ' + pay.clean + "</b></div>" +
            '<div class="tot">Paid into your purse<b>◉ ' + pay.total + "</b></div>" +
          "</div>";

      LEX.chrome.shell(
        '<p class="eyebrow">DOOR ' + r.numeral + (viaKey ? " — FORCED" : " — OPEN") + "</p>" +
        '<h1 class="room">' + r.name + "</h1>" +
        '<div class="prose">' + prize + "</div>" +
        ledger +
        '<div class="actions">' +
          '<button class="btn" id="next">' + (last ? "Go to the exit" : "Open the next door") + "</button>" +
          '<button class="btn ghost" data-openshop="1">Visit the pedlar</button>' +
        "</div>"
      );

      LEX.audio.play(r.slot ? "unlock" : "coin");
      if (pay.total > 0) {
        setTimeout(function () { st.addCoins(pay.total, U.$("#prize")); }, 420);
      }

      U.$("#next").onclick = function () { LEX.S.room++; game.render(); };
    },

    /* ================= exit ================= */
    exitDoor: function () {
      var dots = new Array(LEX.RUN.slots + 1).join("·");
      cur.room = null;

      LEX.chrome.shell(
        '<p class="eyebrow">THE LAST DOOR</p>' +
        '<h1 class="room">Exit</h1>' +
        '<div class="prose"><p>' + LEX.RUN.slots + " drums, " + LEX.RUN.slots + " slots. Read the marks on your chips and key " +
        "the code in <em>slot order</em> — which is not the order you found them in.</p></div>" +
        '<div class="rule"></div>' +
        '<div class="readout" id="read">' + dots + "</div>" +
        '<div class="keypad" id="pad">' +
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) {
            return '<button class="key" data-k="' + n + '">' + n + "</button>";
          }).join("") +
          '<button class="key wide" data-k="del">DEL</button>' +
          '<button class="key" data-k="0">0</button>' +
          '<button class="key wide" data-k="ok">PULL</button>' +
        "</div>" +
        '<p class="say" id="say"></p>'
      );

      var buf = "";
      var read = U.$("#read");
      var paint = function () { read.textContent = (buf + dots).slice(0, LEX.RUN.slots); };

      U.$("#pad").onclick = function (e) {
        var k = e.target.dataset && e.target.dataset.k;
        if (!k) return;
        if (k === "del") { buf = buf.slice(0, -1); paint(); LEX.audio.play("click"); return; }
        if (k === "ok") {
          if (buf.length < LEX.RUN.slots) return;
          if (buf === LEX.RUN.code) { read.classList.add("good"); return game.win(); }
          U.flash(read, "bad", 360);
          api.wrong("The lever will not move.");
          buf = ""; paint();
          return;
        }
        if (buf.length < LEX.RUN.slots) { buf += k; paint(); LEX.audio.play("place"); }
      };
      paint();

      /* the loupe still has one job down here */
      cur.ctrl = {
        assist: function () {
          api.say("The loupe reads the tumblers: <b>" + LEX.RUN.code + "</b>.", "gold");
          return true;
        }
      };
      LEX.chrome.refreshSide();
    },

    /* ================= items ================= */
    /** Can this item be tapped on the current screen? */
    canUse: function (id) {
      if (LEX.S.over) return false;
      var it = LEX.item(id);
      if (!it) return false;
      if (it.scope === "anywhere") return true;
      if (id === "loupe") return !!(cur.ctrl && cur.ctrl.assist);
      if (id === "key") return !!cur.room;
      return false;
    },

    assist: function () {
      if (!cur.ctrl || !cur.ctrl.assist) return false;
      return cur.ctrl.assist() !== false;
    },

    masterKey: function () {
      if (!cur.room) return false;
      LEX.fx.toast("The master key turns — the room pays nothing", "");
      game.solved(cur.room, true);
      return true;
    },

    /* ================= endings ================= */
    win: function () {
      var S = LEX.S;
      S.over = true;
      st.stopClock();
      LEX.audio.play("unlock");

      LEX.chrome.full(
        '<section class="center">' +
          '<p class="sub">DOOR OPEN · ' + LEX.RUN.mode.label + "</p>" +
          '<h1 class="title win">YOU\'RE<br><span>OUT</span></h1>' +
          '<div class="prose"><p>Cold air, a street, and the book still in your coat — with ' +
            '<span class="coin">◉ ' + S.coins + "</span> of the archive's coin in your pocket. " +
            "The lock spells something new for the next visitor.</p></div>" +
          '<div class="stats">' +
            '<div class="stat"><b>' + U.fmt(LEX.RUN.mode.time - S.time) + "</b><span>TIME TAKEN</span></div>" +
            '<div class="stat"><b>' + LEX.RUN.rooms.length + "</b><span>ROOMS CLEARED</span></div>" +
            '<div class="stat coin"><b>' + S.earned + "</b><span>COIN EARNED</span></div>" +
            '<div class="stat"><b>' + S.spent + "</b><span>COIN SPENT</span></div>" +
            '<div class="stat"><b>' + S.hintsUsed + "</b><span>HINTS USED</span></div>" +
            '<div class="stat"><b>' + S.wrong + "</b><span>WRONG TRIES</span></div>" +
          "</div>" +
          '<div><button class="btn" onclick="location.reload()">Play again</button></div>' +
        "</section>"
      );
      U.$("#lock").hidden = true;
      LEX.fx.sparks(40);
      setTimeout(function () { LEX.fx.sparks(28); }, 500);
    },

    lose: function () {
      var S = LEX.S;
      if (S.over) return;
      S.over = true;
      st.stopClock();
      LEX.audio.play("lose");
      LEX.shop.close();

      LEX.chrome.full(
        '<section class="center">' +
          '<p class="sub" style="color:var(--rust)">TIME OUT · ' + LEX.RUN.mode.label + "</p>" +
          '<h1 class="title">STILL<br><span style="color:var(--rust)">INSIDE</span></h1>' +
          '<div class="prose"><p>The lamps cut out one by one. You reached ' +
            st.fragmentsFound() + " of " + LEX.RUN.slots + " fragments" +
            (S.coins ? ' and are holding <span class="coin">◉ ' + S.coins + "</span> you can no longer spend" : "") +
            ".</p><p>" +
            (LEX.RUN.mode.id === "hard"
              ? "Next time: spend the coin on Pocket Watches while you still have rooms left to run — " +
                "or take the short way out."
              : "Next time: spend the coin on Pocket Watches while you still have rooms left to run.") +
            "</p></div>" +
          '<div class="actions"><button class="btn" onclick="location.reload()">Try again</button></div>' +
        "</section>"
      );
      U.$("#lock").hidden = true;
    }
  };

  LEX.game = game;
})(window.LEX);
