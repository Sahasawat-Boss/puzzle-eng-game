# The Lexicon — An English Escape

<img width="1548" height="812" alt="Screenshot 2026-07-25 011823" src="https://github.com/user-attachments/assets/521388d5-a35d-4a33-a5de-c2dffc0aae66" />

An escape-room game where every lock is an English exercise. Nine rooms, brass code
fragments, a clock, coins, and a pedlar who sells minutes back to you.

Two ways in, chosen on the title screen:

| | rooms | clock | hints | fragments |
|---|---|---|---|---|
| **Easy** | 4 (I–IV) | 6:00 | 4 | 3 |
| **Hard** | all 9 | 9:00 | 3 | 7 |

Everything else about a run — how many tumblers appear on the lock, which slot each
chip belongs in, what the exit lever wants — is derived from the chosen mode in
`LEX.state.beginRun()`. Slots are dealt fresh each run, so the code is never simply
the order you found the chips in.

Open `index.html` — double-click is enough. No build step, no server, no dependencies
(the scripts are plain `<script>` tags on purpose, so `file://` works).

`puzzle-game-the-lexicon.html` is the original single-file, four-room version, kept for reference.

## Layout

```
index.html            markup shell: status bar, tumbler lock, shop modal, fx layer
css/
  tokens.css          colours, type, buttons, dust, reduced-motion switch
  layout.css          wrap, status bar, door rail, the brass tumbler lock
  scenes.css          the frame around each room plate + every scene animation
  puzzle.css          one block per puzzle type (slots, tiles, opts, pairs, chips, gaps, keypad)
  shop.css            shop modal, item cards, satchel, flying coins, toasts
  screens.css         title, reward ledger, win/lose screens
js/
  lib/util.js         $ / $$, fmt, shuffle, loose English comparison, typewriter
  lib/audio.js        WebAudio cues (no audio files); mutable from the status bar
  lib/fx.js           dust, coin bursts, sparks, toasts
  data/rooms.js       the nine rooms + LEX.MODES + LEX.RULES (costs, bonuses)
  data/items.js       shop stock (data only)
  data/scenes.js      one inline-SVG plate per room, keyed by room.scene
  core/state.js       LEX.S + every mutation of clock, purse and satchel
  core/chrome.js      renders status bar, door rail, drums, right-hand satchel panel, page shell
  puzzles/*.js        one module per puzzle type
  shop.js             buying, and what each item does (EFFECTS)
  game.js             flow: title -> rooms -> rewards -> exit -> endings
  main.js             boot
```

## Adding a room

Append to `LEX.ROOMS` in `js/data/rooms.js`:

- `type` must match a module in `js/puzzles/` (`scramble`, `choice`, `match`, `order`, `fill`).
- `scene` must match a key in `js/data/scenes.js` (or omit it for no plate).
- Give it a `digit` to make it drop a code fragment — the slot it lands in, the drum count
  and the exit keypad all derive from that, so nothing else needs touching.
- Or set `treasure: true` and no `digit`: the room pays coin only.
- Then add its index to the `rooms` array of whichever mode should include it.

## Adding a puzzle type

```js
LEX.puzzles.myType = {
  render: function (room) { return "<html string>"; },
  mount:  function (room, api) {
    // api.say(html, kind) · api.wrong(msg) · api.solved()
    return { assist: function () { /* what the Brass Loupe does here */ return true; } };
  }
};
```

Return no `assist` and the loupe simply greys out in that room.

## Adding a shop item

Add a record to `LEX.ITEMS` (`js/data/items.js`) and an entry with the same `id` in
`EFFECTS` (`js/shop.js`). Return `false` from the effect to refuse the use — the item is
then not consumed. `scope: "room"` items are greyed out where they make no sense.
