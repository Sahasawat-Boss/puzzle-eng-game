/* ============================================================
   Sound — tiny WebAudio synth. No files to ship, no loading.
   Every cue is a couple of oscillators and an envelope.
   ============================================================ */
(function (LEX) {
  "use strict";

  var ctx = null;
  var muted = false;

  function ac() {
    if (ctx) return ctx;
    var C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    try { ctx = new C(); } catch (e) { ctx = null; }
    return ctx;
  }

  /** One shaped tone. */
  function tone(opt) {
    var a = ac();
    if (!a || muted) return;
    if (a.state === "suspended" && a.resume) a.resume();

    var t0 = a.currentTime + (opt.at || 0);
    var osc = a.createOscillator();
    var gain = a.createGain();
    var dur = opt.dur || 0.12;
    var vol = (opt.vol == null ? 0.16 : opt.vol);

    osc.type = opt.type || "sine";
    osc.frequency.setValueAtTime(opt.f, t0);
    if (opt.to) osc.frequency.exponentialRampToValueAtTime(opt.to, t0 + dur);

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(gain); gain.connect(a.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  var CUES = {
    click:  function () { tone({ f: 320, to: 260, dur: 0.06, type: "triangle", vol: 0.08 }); },
    place:  function () { tone({ f: 520, to: 660, dur: 0.08, type: "triangle", vol: 0.09 }); },
    good:   function () { tone({ f: 660, dur: 0.1, type: "sine", vol: 0.13 });
                          tone({ f: 990, dur: 0.16, type: "sine", vol: 0.1, at: 0.09 }); },
    bad:    function () { tone({ f: 190, to: 110, dur: 0.26, type: "sawtooth", vol: 0.09 }); },
    coin:   function () { tone({ f: 1180, dur: 0.06, type: "square", vol: 0.05 });
                          tone({ f: 1760, dur: 0.12, type: "square", vol: 0.045, at: 0.05 }); },
    unlock: function () { [523, 659, 784, 1046].forEach(function (f, i) {
                            tone({ f: f, dur: 0.34, type: "sine", vol: 0.1, at: i * 0.1 });
                          }); },
    drum:   function () { tone({ f: 140, to: 420, dur: 0.4, type: "triangle", vol: 0.1 }); },
    buy:    function () { tone({ f: 880, dur: 0.07, type: "square", vol: 0.06 });
                          tone({ f: 1320, dur: 0.1, type: "square", vol: 0.05, at: 0.06 }); },
    use:    function () { tone({ f: 740, to: 1480, dur: 0.2, type: "sine", vol: 0.1 }); },
    lose:   function () { [330, 262, 208, 155].forEach(function (f, i) {
                            tone({ f: f, dur: 0.5, type: "triangle", vol: 0.11, at: i * 0.18 });
                          }); }
  };

  LEX.audio = {
    play: function (name) { var c = CUES[name]; if (c) c(); },
    toggle: function () { muted = !muted; return muted; },
    get muted() { return muted; }
  };
})(window.LEX);
