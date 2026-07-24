/* ============================================================
   Room plates — hand-drawn inline SVG, one per room `scene` key.
   Paint (gradients) lives once in index.html; motion lives in
   css/scenes.css so reduced-motion can still the lot.
   ============================================================ */
(function (LEX) {
  "use strict";

  var BONE = "rgba(231,223,209,.14)";

  function open(caption) {
    return '<div class="scene"><svg class="sc" viewBox="0 0 320 150" ' +
           'preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + caption + '">' +
           '<rect width="320" height="150" fill="url(#g-panel)"/>';
  }
  function close(caption) {
    return '</svg><span class="caption">' + caption + '</span></div>';
  }

  var SCENES = {

    /* ---------------- I · The Foyer ---------------- */
    foyer: function () {
      return open("A sealed front door under a swinging lamp") +
        '<clipPath id="cp-foyer"><rect x="130" y="48" width="60" height="18"/></clipPath>' +
        /* floor */
        '<path d="M0 112H320V150H0Z" fill="#080f12"/>' +
        '<g stroke="' + BONE + '" fill="none">' +
          '<path d="M0 124H320M0 138H320"/>' +
          '<path d="M36 112V150M92 112V150M148 112V150M204 112V150M260 112V150"/>' +
        '</g>' +
        /* lamp + its light */
        '<g class="swing">' +
          '<line x1="160" y1="0" x2="160" y2="16" stroke="#8a6620" stroke-width="1.4"/>' +
          '<path d="M144 30 L176 30 L168 16 L152 16Z" fill="#152c33" stroke="#8a6620"/>' +
          '<circle cx="160" cy="28" r="3.4" fill="#ffd580" class="flick"/>' +
          '<ellipse cx="160" cy="84" rx="86" ry="74" fill="url(#glow-lamp)" class="flick"/>' +
        '</g>' +
        /* the door */
        '<rect x="118" y="34" width="84" height="78" fill="#122a30" stroke="#8a6620"/>' +
        '<rect x="126" y="72" width="68" height="34" fill="none" stroke="' + BONE + '"/>' +
        '<circle cx="192" cy="92" r="3" fill="#c9922e"/>' +
        /* brass plate, letters knocked loose */
        '<rect x="130" y="48" width="60" height="18" fill="url(#g-brass)" opacity=".9"/>' +
        '<text x="160" y="60.5" text-anchor="middle" font-family="IBM Plex Mono,monospace" ' +
          'font-size="8.5" fill="#0b171b" letter-spacing="1.6">RODIRCOR</text>' +
        '<g clip-path="url(#cp-foyer)"><rect class="glint" x="146" y="48" width="26" height="18" fill="url(#g-fade)"/></g>' +
        /* console table */
        '<path d="M214 96H286V99H214Z" fill="#1b3138" stroke="' + BONE + '"/>' +
        '<path d="M220 99V112M280 99V112" stroke="' + BONE + '"/>' +
        '<rect x="236" y="90" width="20" height="6" fill="#c9922e" opacity=".55" class="pulse"/>' +
        close("PLATE I · THE FOYER");
    },

    /* ---------------- II · The Study ---------------- */
    study: function () {
      return open("A desk with two chained ledgers and a candle") +
        '<ellipse cx="96" cy="70" rx="72" ry="58" fill="url(#glow-lamp)" class="flick"/>' +
        /* shelves behind */
        '<g stroke="' + BONE + '" fill="none"><path d="M196 22H312M196 58H312M196 94H312"/></g>' +
        '<g fill="#1e3a41">' +
          '<rect x="200" y="6" width="7" height="16"/><rect x="209" y="9" width="5" height="13"/>' +
          '<rect x="216" y="4" width="8" height="18"/><rect x="228" y="10" width="6" height="12"/>' +
          '<rect x="240" y="6" width="9" height="16"/><rect x="253" y="12" width="5" height="10"/>' +
          '<rect x="262" y="7" width="7" height="15"/><rect x="274" y="3" width="6" height="19"/>' +
          '<rect x="200" y="42" width="6" height="16"/><rect x="208" y="38" width="8" height="20"/>' +
          '<rect x="220" y="45" width="5" height="13"/><rect x="229" y="40" width="7" height="18"/>' +
          '<rect x="242" y="44" width="6" height="14"/><rect x="252" y="37" width="9" height="21"/>' +
          '<rect x="266" y="43" width="6" height="15"/><rect x="276" y="39" width="7" height="19"/>' +
        '</g>' +
        /* desk */
        '<path d="M18 100H190V106H18Z" fill="#1b3138" stroke="#8a6620"/>' +
        '<path d="M28 106V142M180 106V142" stroke="#8a6620"/>' +
        /* two ledgers */
        '<g>' +
          '<path d="M38 88 L86 88 L86 100 L38 100Z" fill="#16323a" stroke="' + BONE + '"/>' +
          '<path d="M42 92H82M42 96H74" stroke="rgba(231,223,209,.3)"/>' +
          '<path d="M104 86 L152 86 L152 100 L104 100Z" fill="#16323a" stroke="' + BONE + '"/>' +
          '<path d="M108 91H148M108 95H136" stroke="rgba(231,223,209,.3)"/>' +
        '</g>' +
        /* chain from ledgers to the wall ring */
        '<g class="swing-slow" stroke="#8a6620" fill="none">' +
          '<path d="M152 92 Q168 100 178 86 Q186 74 176 62" stroke-dasharray="3 3"/>' +
          '<circle cx="176" cy="58" r="4"/>' +
        '</g>' +
        /* candle */
        '<rect x="164" y="80" width="8" height="20" fill="#d8cfbe" opacity=".55"/>' +
        '<path d="M168 80 q4-6 0-11 q-4 5 0 11Z" fill="#ffd580" class="flick"/>' +
        /* motes over the candle */
        '<g fill="#ffd580" opacity=".5">' +
          '<circle class="rise" cx="166" cy="70" r="1.2"/>' +
          '<circle class="rise d2" cx="172" cy="72" r="1"/>' +
          '<circle class="rise d3" cx="169" cy="68" r="1.4"/>' +
        '</g>' +
        close("PLATE II · THE STUDY");
    },

    /* ---------------- III · The Gallery ---------------- */
    gallery: function () {
      var frames = "", x;
      for (var i = 0; i < 4; i++) {
        x = 26 + i * 70;
        frames +=
          '<g>' +
            '<rect x="' + x + '" y="26" width="52" height="60" fill="#0d1c21" stroke="#8a6620"/>' +
            '<rect x="' + (x + 5) + '" y="31" width="42" height="50" fill="#16323a"/>' +
            /* an abstract sitter */
            '<circle cx="' + (x + 26) + '" cy="50" r="9" fill="#24454d"/>' +
            '<path d="M' + (x + 10) + ' 81 q16-22 32 0Z" fill="#24454d"/>' +
            /* plaque, hung on the wrong frame */
            '<rect x="' + (x + 10) + '" y="92" width="32" height="9" fill="url(#g-brass)" opacity=".8"/>' +
          '</g>';
      }
      return open("Four portraits with their plaques swapped") +
        frames +
        /* spotlight crawling across the wall */
        '<g class="sweep"><ellipse cx="160" cy="56" rx="66" ry="62" fill="url(#glow-lamp)"/></g>' +
        /* picture rail + floor */
        '<path d="M0 18H320" stroke="#8a6620" opacity=".5"/>' +
        '<path d="M0 116H320V150H0Z" fill="#080f12"/>' +
        '<path d="M0 116H320" stroke="' + BONE + '"/>' +
        close("PLATE III · THE GALLERY");
    },

    /* ---------------- IV · The Countinghouse (treasure) ---------------- */
    counting: function () {
      function stack(x, y, n) {
        var s = "";
        for (var i = 0; i < n; i++) {
          s += '<ellipse cx="' + x + '" cy="' + (y - i * 5) + '" rx="15" ry="4.6" ' +
               'fill="url(#g-brass)" opacity="' + (0.55 + i * 0.06).toFixed(2) + '"/>';
        }
        return s;
      }
      return open("Coin stacks and a rocking balance") +
        '<ellipse cx="160" cy="112" rx="120" ry="46" fill="url(#glow-lamp)" class="pulse"/>' +
        /* counter */
        '<path d="M0 118H320V150H0Z" fill="#0a1519"/>' +
        '<path d="M0 118H320" stroke="#8a6620" opacity=".6"/>' +
        stack(52, 116, 6) + stack(96, 116, 4) + stack(266, 116, 5) +
        /* the glinting top coin */
        '<g><ellipse cx="52" cy="86" rx="15" ry="4.6" fill="#ffe6a8"/>' +
        '<ellipse class="pulse" cx="52" cy="86" rx="15" ry="4.6" fill="#fff6df" opacity=".5"/></g>' +
        /* balance scale */
        '<g>' +
          '<path d="M176 118V56" stroke="#8a6620" stroke-width="2"/>' +
          '<g class="rock">' +
            '<path d="M136 56H216" stroke="url(#g-brass)" stroke-width="2.4"/>' +
            '<path d="M140 56V70M212 56V70" stroke="#8a6620"/>' +
            '<path d="M126 70H154 L148 80H132Z" fill="#16323a" stroke="#8a6620"/>' +
            '<path d="M198 70H226 L220 80H204Z" fill="#16323a" stroke="#8a6620"/>' +
            '<ellipse cx="140" cy="70" rx="8" ry="2.6" fill="url(#g-brass)"/>' +
          '</g>' +
          '<circle cx="176" cy="52" r="4" fill="#c9922e"/>' +
        '</g>' +
        /* coins in the air */
        '<g fill="#e9bd5e">' +
          '<circle class="float" cx="232" cy="44" r="4"/>' +
          '<circle class="float d2" cx="248" cy="62" r="3"/>' +
          '<circle class="float d3" cx="218" cy="30" r="2.6"/>' +
        '</g>' +
        close("PLATE IV · THE COUNTINGHOUSE");
    },

    /* ---------------- V · The Map Room ---------------- */
    maproom: function () {
      return open("A chart table, a route in dashes, a turning globe") +
        '<ellipse cx="118" cy="96" rx="102" ry="52" fill="url(#glow-lamp)"/>' +
        /* map sheet */
        '<g transform="rotate(-2 118 100)">' +
          '<rect x="34" y="66" width="168" height="66" fill="#1d3238" stroke="#8a6620"/>' +
          '<g stroke="rgba(231,223,209,.10)" fill="none">' +
            '<path d="M34 88H202M34 110H202M78 66V132M122 66V132M166 66V132"/>' +
          '</g>' +
          /* coastline */
          '<path d="M44 122 q22-16 34-4 q14 14 30-2 q16-16 34 2 q18 18 44 4" ' +
            'fill="none" stroke="rgba(231,223,209,.34)"/>' +
          /* the animated route */
          '<path class="dash" d="M56 118 q40-34 70-16 q30 18 66-24" fill="none" stroke="#c9922e" stroke-width="1.6"/>' +
          '<circle cx="56" cy="118" r="2.6" fill="#4fa392"/>' +
          '<circle cx="192" cy="78" r="2.6" fill="#b8503c" class="pulse"/>' +
        '</g>' +
        /* armillary globe */
        '<g>' +
          '<circle cx="258" cy="70" r="30" fill="#12262c" stroke="#8a6620"/>' +
          '<g class="spin" opacity=".8">' +
            '<ellipse cx="258" cy="70" rx="11" ry="30" fill="none" stroke="#4fa392"/>' +
            '<ellipse cx="258" cy="70" rx="23" ry="30" fill="none" stroke="rgba(231,223,209,.25)"/>' +
          '</g>' +
          '<path d="M228 70H288" stroke="rgba(231,223,209,.25)"/>' +
          '<path d="M232 54H284M232 86H284" stroke="rgba(231,223,209,.14)"/>' +
          '<g class="spin-back"><path d="M258 34 L262 40 L254 40Z" fill="#c9922e"/></g>' +
          '<path d="M258 100V126M244 126H272" stroke="#8a6620" stroke-width="1.6"/>' +
        '</g>' +
        /* compass rose */
        '<g class="spin-back" opacity=".7">' +
          '<path d="M62 30 L66 44 L62 40 L58 44Z" fill="#c9922e"/>' +
          '<circle cx="62" cy="42" r="12" fill="none" stroke="#8a6620" stroke-dasharray="2 4"/>' +
        '</g>' +
        close("PLATE V · THE MAP ROOM");
    },

    /* ---------------- VI · The Menagerie ---------------- */
    menagerie: function () {
      var jars = "", x;
      for (var i = 0; i < 6; i++) {
        x = 206 + i * 18;
        jars += '<g><rect x="' + x + '" y="' + (86 - (i % 3) * 2) + '" width="12" height="' + (20 + (i % 3) * 2) + '" ' +
                'fill="#1b3a40" stroke="' + BONE + '"/>' +
                '<rect x="' + (x + 1) + '" y="' + (94 - (i % 3) * 2) + '" width="10" height="' + (12 + (i % 3) * 2) + '" ' +
                'fill="#2c5c58" opacity=".7"/></g>';
      }
      return open("A swinging birdcage over shelves of jars") +
        '<ellipse cx="96" cy="66" rx="76" ry="66" fill="url(#glow-cold)" class="pulse"/>' +
        /* the cage */
        '<g class="swing">' +
          '<line x1="96" y1="0" x2="96" y2="14" stroke="#8a6620"/>' +
          '<path d="M74 26 q22-16 44 0" fill="none" stroke="#8a6620" stroke-width="1.6"/>' +
          '<rect x="72" y="26" width="48" height="62" fill="rgba(18,38,44,.5)" stroke="#8a6620"/>' +
          '<g stroke="#8a6620" opacity=".75">' +
            '<path d="M80 26V88M88 26V88M96 26V88M104 26V88M112 26V88"/>' +
            '<path d="M72 44H120M72 66H120"/>' +
          '</g>' +
          '<path d="M70 88H122V93H70Z" fill="#16323a" stroke="#8a6620"/>' +
          /* the sitter */
          '<g class="flap">' +
            '<ellipse cx="98" cy="72" rx="8" ry="6" fill="#e7dfd1" opacity=".85"/>' +
            '<circle cx="105" cy="66" r="3.6" fill="#e7dfd1" opacity=".85"/>' +
            '<path d="M108 66 L113 68 L108 69Z" fill="#c9922e"/>' +
            '<path d="M90 72 q-8 4 0 7" fill="none" stroke="#e7dfd1" opacity=".7"/>' +
          '</g>' +
          '<circle cx="96" cy="94" r="2" fill="#c9922e"/>' +
        '</g>' +
        /* shelf of specimen jars */
        '<path d="M196 106H320" stroke="#8a6620"/>' + jars +
        /* a moth at the glass */
        '<g class="float d2"><path d="M172 46 q6-7 10 0 q-6 6-10 0Z" fill="#d8cfbe" opacity=".6"/></g>' +
        '<path d="M0 128H320V150H0Z" fill="#080f12"/>' +
        close("PLATE VI · THE MENAGERIE");
    },

    /* ---------------- VII · The Vault (treasure) ---------------- */
    vault: function () {
      var teeth = "", i, a;
      for (i = 0; i < 24; i++) {
        a = (i / 24) * Math.PI * 2;
        teeth += '<line x1="' + (160 + Math.cos(a) * 46).toFixed(1) + '" y1="' + (74 + Math.sin(a) * 46).toFixed(1) + '" ' +
                 'x2="' + (160 + Math.cos(a) * 52).toFixed(1) + '" y2="' + (74 + Math.sin(a) * 52).toFixed(1) + '" ' +
                 'stroke="#8a6620"/>';
      }
      return open("A round vault door, its dial turning") +
        '<ellipse cx="160" cy="74" rx="120" ry="82" fill="url(#glow-lamp)" class="pulse"/>' +
        /* frame */
        '<rect x="52" y="8" width="216" height="134" fill="#0e2126" stroke="#8a6620"/>' +
        '<circle cx="160" cy="74" r="62" fill="#12262c" stroke="#8a6620" stroke-width="2"/>' +
        '<circle cx="160" cy="74" r="56" fill="none" stroke="' + BONE + '"/>' +
        /* bolt heads */
        '<g fill="#c9922e" opacity=".7">' +
          '<circle cx="160" cy="20" r="2.6"/><circle cx="160" cy="128" r="2.6"/>' +
          '<circle cx="106" cy="74" r="2.6"/><circle cx="214" cy="74" r="2.6"/>' +
          '<circle cx="122" cy="36" r="2.2"/><circle cx="198" cy="36" r="2.2"/>' +
          '<circle cx="122" cy="112" r="2.2"/><circle cx="198" cy="112" r="2.2"/>' +
        '</g>' +
        /* the dial */
        '<g class="spin">' + teeth +
          '<circle cx="160" cy="74" r="34" fill="#16323a" stroke="url(#g-brass)" stroke-width="2"/>' +
          '<path d="M160 40V74" stroke="#c9922e" stroke-width="2"/>' +
          '<circle cx="160" cy="74" r="6" fill="url(#g-brass)"/>' +
        '</g>' +
        /* handle spokes, turning the other way */
        '<g class="spin-back" opacity=".85">' +
          '<path d="M160 46V102M132 74H188" stroke="#8a6620" stroke-width="3"/>' +
          '<circle cx="160" cy="46" r="3" fill="#c9922e"/><circle cx="160" cy="102" r="3" fill="#c9922e"/>' +
          '<circle cx="132" cy="74" r="3" fill="#c9922e"/><circle cx="188" cy="74" r="3" fill="#c9922e"/>' +
        '</g>' +
        /* spilled coins at the foot */
        '<g fill="url(#g-brass)" opacity=".85">' +
          '<ellipse cx="80" cy="136" rx="11" ry="3.4"/><ellipse cx="96" cy="140" rx="9" ry="3"/>' +
          '<ellipse cx="240" cy="138" rx="10" ry="3.2"/>' +
        '</g>' +
        close("PLATE VII · THE VAULT");
    },

    /* ---------------- VIII · The Cellar ---------------- */
    cellar: function () {
      var bricks = "", r, c, y, x, off;
      for (r = 0; r < 6; r++) {
        y = 14 + r * 20;
        off = (r % 2) ? -18 : 0;
        for (c = 0; c < 10; c++) {
          x = off + c * 36;
          bricks += '<rect x="' + x + '" y="' + y + '" width="34" height="18" fill="#132328" stroke="rgba(231,223,209,.07)"/>';
        }
      }
      return open("A brick cellar wall with a riddle scratched into it") +
        bricks +
        '<ellipse cx="160" cy="34" rx="96" ry="62" fill="url(#glow-lamp)" class="dying"/>' +
        /* failing bulb */
        '<line x1="160" y1="0" x2="160" y2="12" stroke="#8a6620"/>' +
        '<circle cx="160" cy="17" r="5.4" fill="#ffd580" class="dying"/>' +
        /* scratched lines of the riddle */
        '<g stroke="rgba(231,223,209,.42)" stroke-linecap="round">' +
          '<path d="M64 74 h58 M128 74 h34"/>' +
          '<path d="M64 86 h30 M100 86 h72"/>' +
          '<path d="M64 98 h84 M154 98 h22"/>' +
          '<path d="M198 74 l14 8 l-14 8" fill="none" opacity=".6"/>' +
        '</g>' +
        '<text x="64" y="118" font-family="IBM Plex Mono,monospace" font-size="11" ' +
          'fill="rgba(231,223,209,.5)" letter-spacing="3">? ? ? ? ? ? ? ?</text>' +
        /* water: a drop, then a ring in the puddle */
        '<g><circle class="drip" cx="252" cy="86" r="2" fill="#7fd8c6" opacity=".8"/></g>' +
        '<ellipse cx="252" cy="132" rx="26" ry="6" fill="#0d2a2c" opacity=".9"/>' +
        '<ellipse class="ripple" cx="252" cy="132" rx="16" ry="4" fill="none" stroke="#7fd8c6"/>' +
        '<path d="M0 138H320V150H0Z" fill="#070d10"/>' +
        close("PLATE VIII · THE CELLAR");
    }
  };

  /** @returns {string} html for a room's plate, or "" if it has none. */
  LEX.scene = function (key) {
    return SCENES[key] ? SCENES[key]() : "";
  };
})(window.LEX);
