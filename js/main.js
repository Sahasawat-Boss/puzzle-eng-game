/* ============================================================
   Boot. Wire the frame, throw the dust in the air, open on the title.
   ============================================================ */
(function (LEX) {
  "use strict";

  var U = LEX.util;

  function start() {
    LEX.chrome.init();
    LEX.shop.init();
    LEX.fx.dust(28);

    U.$("#mutebtn").onclick = function () {
      LEX.audio.toggle();
      LEX.chrome.paint();
    };

    LEX.chrome.paint();
    LEX.game.intro();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})(window.LEX);
