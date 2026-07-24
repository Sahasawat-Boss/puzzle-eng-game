/* ============================================================
   Shop stock. Data only — what each item actually does lives in
   js/shop.js under EFFECTS, keyed by these ids.
   scope: "anywhere" usable on any screen · "room" needs a puzzle
   ============================================================ */
(function (LEX) {
  "use strict";

  LEX.ITEMS = [
    {
      id: "watch", glyph: "⌛", name: "Pocket Watch", price: 45, scope: "anywhere",
      desc: "Winds sixty seconds back onto the clock. With eight minutes in the building, this is the one " +
            "thing money is really for.",
      short: "+60s"
    },
    {
      id: "note", glyph: "✎", name: "Curator's Note", price: 60, scope: "anywhere",
      desc: "One extra hint charge — and unlike your three free hints, using it costs no time at all.",
      short: "+1 HINT"
    },
    {
      id: "loupe", glyph: "◎", name: "Brass Loupe", price: 55, scope: "room",
      desc: "Reads the answer sideways: cuts two wrong options, seats one pair, places one word, " +
            "fills one gap, or reveals half the letters.",
      short: "ASSIST"
    },
    {
      id: "key", glyph: "⚿", name: "Master Key", price: 180, scope: "room",
      desc: "Opens the door you are standing at. You keep the fragment — but the room pays no coin.",
      short: "SKIP"
    }
  ];

  LEX.item = function (id) {
    for (var i = 0; i < LEX.ITEMS.length; i++) if (LEX.ITEMS[i].id === id) return LEX.ITEMS[i];
    return null;
  };
})(window.LEX);
