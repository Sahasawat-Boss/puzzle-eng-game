/* ============================================================
   Run state — the single source of truth. Anything that mutates
   the clock, the purse or the satchel goes through here.
   ============================================================ */
(function (LEX) {
  "use strict";

  var R = LEX.RULES;

  var S = {
    room: 0,              // index into LEX.ROOMS (=== length -> the exit)
    time: R.time,
    hints: R.hints,
    coins: 0,
    earned: 0,            // lifetime coins, for the end screen
    spent: 0,
    wrong: 0,             // wrong answers this run
    hintsUsed: 0,
    roomWrong: 0,         // …and this room only
    roomHint: false,
    fragments: {},        // slot -> digit
    cleared: {},          // room index -> true (treasure rooms have no slot)
    inv: {},              // item id -> count
    freeHints: 0,         // hint charges bought as notes: no time cost
    paused: false,        // shop open
    over: false,
    tick: null
  };

  var state = {
    S: S,

    /* ---------------- clock ---------------- */
    startClock: function () {
      if (S.tick) clearInterval(S.tick);
      S.tick = setInterval(function () {
        if (S.over || S.paused) return;
        S.time--;
        LEX.chrome.paint();
        if (S.time <= 0) { S.time = 0; state.stopClock(); LEX.game.lose(); }
      }, 1000);
    },
    stopClock: function () { clearInterval(S.tick); S.tick = null; },
    pause: function () { S.paused = true; LEX.chrome.paint(); },
    resume: function () { S.paused = false; LEX.chrome.paint(); },

    /** Take seconds off the clock. */
    penalize: function (sec) {
      S.time = Math.max(0, S.time - sec);
      LEX.chrome.paint();
      if (S.time === 0 && !S.over) { state.stopClock(); LEX.game.lose(); }
    },

    /** Put seconds back on. */
    grant: function (sec) {
      S.time += sec;
      LEX.chrome.paint();
    },

    /* ---------------- purse ---------------- */
    addCoins: function (n, fromEl) {
      if (n <= 0) return;
      S.coins += n;
      S.earned += n;
      LEX.chrome.paint();
      LEX.fx.coinBurst(Math.ceil(n / 12), fromEl);
    },

    canAfford: function (n) { return S.coins >= n; },

    spend: function (n) {
      if (S.coins < n) return false;
      S.coins -= n;
      S.spent += n;
      LEX.chrome.paint();
      return true;
    },

    /* ---------------- satchel ---------------- */
    give: function (id, n) { S.inv[id] = (S.inv[id] || 0) + (n || 1); },
    count: function (id) { return S.inv[id] || 0; },
    take: function (id) {
      if (!S.inv[id]) return false;
      S.inv[id]--;
      if (!S.inv[id]) delete S.inv[id];
      return true;
    },
    satchelSize: function () {
      var n = 0;
      for (var k in S.inv) if (S.inv.hasOwnProperty(k)) n += S.inv[k];
      return n;
    },

    /* ---------------- hints ---------------- */
    /**
     * Spend a hint charge. A charge bought as a Curator's Note costs no time.
     * @returns {false|"free"|"paid"}
     */
    useHint: function () {
      if (S.hints <= 0) return false;
      S.hints--;
      S.hintsUsed++;
      S.roomHint = true;
      var free = false;
      if (S.freeHints > 0) { S.freeHints--; free = true; }
      if (!free) state.penalize(R.hintCost);
      LEX.chrome.paint();
      return free ? "free" : "paid";
    },

    /* ---------------- rooms ---------------- */
    enterRoom: function () { S.roomWrong = 0; S.roomHint = false; },

    /** Book a wrong answer: the run's tally, the room's tally, and the clock. */
    countWrong: function () {
      S.wrong++;
      S.roomWrong++;
      state.penalize(R.wrongCost);
    },

    /** Coins a room pays, itemised for the reward ledger. */
    reward: function (room, viaKey) {
      if (viaKey) return { base: 0, noHint: 0, clean: 0, total: 0, viaKey: true };
      var base = room.coins || 40;
      var noHint = S.roomHint ? 0 : R.noHintBonus;
      var clean = S.roomWrong === 0 ? R.cleanBonus : 0;
      return { base: base, noHint: noHint, clean: clean, total: base + noHint + clean, viaKey: false };
    },

    fragmentsFound: function () { return Object.keys(S.fragments).length; }
  };

  LEX.state = state;
  LEX.S = S;
})(window.LEX);
