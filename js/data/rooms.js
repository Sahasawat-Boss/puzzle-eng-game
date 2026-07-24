/* ============================================================
   The nine doors. Every puzzle is an English task.
   Rooms with a `digit` drop a code fragment — which slot it goes
   in is dealt fresh each run. Rooms marked `treasure` pay coin
   instead: nothing but money in there.
   ============================================================ */
(function (LEX) {
  "use strict";

  LEX.ROOMS = [

    /* ---------------------------------------------------- I */
    {
      numeral: "I", name: "The Foyer", short: "FOYER", scene: "foyer", type: "scramble",
      intro: "The front door sealed behind you. On the console table lies a brass plate with eight letters knocked " +
             "loose from their slots, and a card in a curator's hand: <em>“A long passage inside a building.”</em>",
      task: "Tap the letters back into order.",
      letters: "RODIRCOR", answer: "CORRIDOR",
      hint: "Eight letters. It starts with C and holds three R's.",
      coins: 22, digit: "7"
    },

    /* --------------------------------------------------- II */
    {
      numeral: "II", name: "The Study", short: "STUDY", scene: "study", type: "choice",
      intro: "Two ledgers are chained to the desk, each with a sentence someone has already started to correct. " +
             "The chain will not release until both read properly.",
      task: "Choose the correct form.",
      questions: [
        { q: "If I <u></u> the key earlier, I would have opened this door hours ago.",
          opts: ["had found", "found", "have found", "would find"], a: 0,
          why: "Third conditional: <em>if</em> + past perfect, then <em>would have</em> + past participle." },
        { q: "The archivist, along with her two assistants, <u></u> this wing every night.",
          opts: ["lock", "locks", "are locking", "have locked"], a: 1,
          why: "<em>along with…</em> is an interruption. The subject is still singular: <em>archivist locks</em>." }
      ],
      hint: "One is a third conditional. The other is subject–verb agreement — ignore everything between the commas.",
      coins: 24, digit: "3"
    },

    /* -------------------------------------------------- III */
    {
      numeral: "III", name: "The Gallery", short: "GALLERY", scene: "gallery", type: "match",
      intro: "Four portraits, four small plaques — and someone has swapped every plaque with the wrong frame. " +
             "The gallery door watches, unimpressed.",
      task: "Pair each expression with what it means. Pick one from each column.",
      pairs: [
        ["Bite the bullet", "Face something painful because you must"],
        ["Let the cat out of the bag", "Reveal a secret by accident"],
        ["Under the weather", "Feeling slightly unwell"],
        ["Burn the midnight oil", "Work late into the night"]
      ],
      hint: "Start with the two about the body: one is courage, one is illness.",
      coins: 26, digit: "9"
    },

    /* --------------------------------------------------- IV */
    {
      numeral: "IV", name: "The Countinghouse", short: "COUNTING", scene: "counting", type: "order",
      treasure: true,
      intro: "No lock on the far side of this room — only a counter, three stacks of coin, and a clerk's balance " +
             "waiting to be satisfied. Sentences have been cut into words and tipped into the pan.",
      task: "Rebuild each sentence, word by word. The balance pays for correct English.",
      sentences: [
        { answer: "She has been working here since March",
          why: "Present perfect continuous: <em>has been</em> + <em>-ing</em>, with <em>since</em> + a point in time." },
        { answer: "By the time we arrived the door had already closed",
          why: "<em>By the time</em> + past simple, then past perfect for the earlier event." },
        { answer: "Rarely have I seen such a mess",
          why: "After a front-placed negative adverb like <em>rarely</em>, the auxiliary comes before the subject." }
      ],
      hint: "Find the subject first, then its verb group, then push the time expression to whichever end still reads naturally.",
      coins: 70
    },

    /* ---------------------------------------------------- V */
    {
      numeral: "V", name: "The Map Room", short: "MAPS", scene: "maproom", type: "fill",
      intro: "A chart of a voyage is pinned to the table, and the little brass words that belong in it have been " +
             "shaken out into a tray. The globe turns as if impatient.",
      task: "Tap a gap, then tap the word that belongs in it.",
      sentence: "The ship set out {0} dawn, slipped {1} the narrow strait, arrived {2} Lisbon {3} the third of May, " +
                "and has been anchored there {4} then.",
      gaps: [
        { a: "at",      why: "Points on the clock take <em>at</em>: at dawn, at noon, at 6.30." },
        { a: "through", why: "<em>Through</em> = in one side and out the other." },
        { a: "in",      why: "Cities and countries take <em>in</em>: in Lisbon, in Portugal." },
        { a: "on",      why: "Dates take <em>on</em>: on the third of May, on Monday." },
        { a: "since",   why: "<em>Since</em> + a point in time, with the present perfect." }
      ],
      bank: ["at", "by", "in", "into", "on", "through", "since", "for"],
      hint: "Two of the tray's words are traps: <em>for</em> wants a length of time, <em>into</em> wants entry without exit.",
      coins: 28, digit: "4"
    },

    /* --------------------------------------------------- VI */
    {
      numeral: "VI", name: "The Menagerie", short: "MENAGERIE", scene: "menagerie", type: "match",
      intro: "Stuffed things in jars, and a live bird in a cage who has clearly heard every English lesson given " +
             "in this building. Four labels have come off the shelf.",
      task: "Pair each phrasal verb with its plain meaning.",
      pairs: [
        ["Put up with", "Tolerate something unpleasant"],
        ["Run into", "Meet somebody by chance"],
        ["Call off", "Cancel a planned thing"],
        ["Look up to", "Admire and respect somebody"]
      ],
      hint: "<em>Off</em> tends to end things. <em>Up to</em> points at somebody above you.",
      coins: 28, digit: "8"
    },

    /* -------------------------------------------------- VII */
    {
      numeral: "VII", name: "The Vault", short: "VAULT", scene: "vault", type: "choice",
      treasure: true,
      intro: "The vault stands open a hand's width — enough for a hand, not for a person. Inside: coin, and a card " +
             "on top of it. <em>“Three sentences. Precise words only.”</em>",
      task: "Choose the precise word.",
      questions: [
        { q: "Her explanation was so <u></u> that nobody asked a single question.",
          opts: ["lucid", "luminous", "lucrative", "ludicrous"], a: 0,
          why: "<em>Lucid</em> = clear and easy to follow. The others mean bright, profitable and absurd." },
        { q: "The committee <u></u> the proposal after a long debate.",
          opts: ["turned down", "turned up", "turned in", "turned over"], a: 0,
          why: "<em>Turn down</em> = reject. <em>Turn up</em> = appear, <em>turn in</em> = hand over, <em>turn over</em> = flip." },
        { q: "Neither of the keys <u></u> the cellar door.",
          opts: ["fit", "fits", "are fitting", "have fitted"], a: 1,
          why: "<em>Neither of</em> + plural noun still takes a singular verb: <em>neither fits</em>." }
      ],
      hint: "Question one is about clarity, not brightness. Question three is grammar, not vocabulary.",
      coins: 80
    },

    /* ------------------------------------------------- VIII */
    {
      numeral: "VIII", name: "The Bindery", short: "BINDERY", scene: "bindery", type: "fill",
      intro: "Half-made books lie open on the sewing frame and a press stands in the corner, its screw wound down " +
             "on nothing at all. The workshop notice above the bench has had all its little words picked out of it.",
      task: "Tap a gap, then tap the word that belongs in it.",
      sentence: "This room keeps {0} unfinished manuscript, {1} thread, and {2} glue that has gone hard. " +
                "Sew {3} spine first, then give it {4} hour to dry.",
      gaps: [
        { a: "an",   why: "<em>An</em> before a vowel <em>sound</em>: an unfinished manuscript." },
        { a: "some", why: "Uncountable and unspecified: <em>some thread</em>. <em>A thread</em> would be one single strand." },
        { a: "the",  why: "The clause pins it down — <em>the</em> glue <em>that has gone hard</em>, not glue in general." },
        { a: "the",  why: "One particular book has one particular spine: <em>the</em> spine." },
        { a: "an",   why: "<em>An hour</em> — the <em>h</em> is silent, so the word opens on a vowel sound." }
      ],
      bank: ["a", "an", "the", "some", "any", "every"],
      hint: "Two of the five are decided by <em>sound</em>, not spelling. One is decided by the clause that follows it.",
      coins: 30, digit: "5"
    },

    /* --------------------------------------------------- IX */
    {
      numeral: "IX", name: "The Cellar", short: "CELLAR", scene: "cellar", type: "scramble",
      intro: "The last room is cold and the lamp is failing. Scratched into the wall, in a hand much less patient " +
             "than the curator's:<br><br><em>“I have keys but open no locks. I have space but no room. " +
             "You may enter, but you cannot go outside. What am I?”</em>",
      task: "Type the answer.",
      letters: null, answer: "KEYBOARD",
      hint: "You are almost certainly touching one right now — or looking at one on glass.",
      coins: 30, digit: "1"
    }
  ];

  /* ============================================================
     Two ways through the building. `rooms` indexes LEX.ROOMS, and
     everything else about a run — the number of tumblers, the code,
     the drums at the foot of the screen — is derived from it in
     LEX.state.beginRun().
     ============================================================ */
  LEX.MODES = [
    {
      id: "easy", label: "EASY MODE", tag: "THE SHORT WAY OUT",
      rooms: [0, 1, 2, 3],
      time: 6 * 60, hints: 4,
      blurb: "The first four rooms — a scramble, two ledgers, the plaques, and the countinghouse. " +
             "Room to think, and a fourth hint in your pocket."
    },
    {
      id: "hard", label: "HARD MODE", tag: "EVERY DOOR IN THE BUILDING",
      rooms: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      time: 9 * 60, hints: 3,
      blurb: "All nine rooms, both treasure rooms, and a minute a room. Expect to buy time from the pedlar."
    }
  ];

  LEX.mode = function (id) {
    for (var i = 0; i < LEX.MODES.length; i++) if (LEX.MODES[i].id === id) return LEX.MODES[i];
    return LEX.MODES[0];
  };

  /** How many rooms of a mode drop a code fragment (the rest are treasure). */
  LEX.fragmentCount = function (mode) {
    return mode.rooms.filter(function (i) { return !!LEX.ROOMS[i].digit; }).length;
  };

  /** Rules that hold whichever way you go. */
  LEX.RULES = {
    hintCost: 45,       // seconds per hint
    wrongCost: 15,      // seconds per wrong answer
    noHintBonus: 10,    // coins for clearing a room without a hint
    cleanBonus: 10      // coins for clearing a room with no wrong answers
  };
})(window.LEX);
