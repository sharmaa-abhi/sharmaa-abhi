/**
 * GitSkins Terminal Banner Component - Vanilla JS Engine
 * Exact GitSkins wordmark font for full name: ABHISHEK SHARMA
 */

const ABHISHEK_SHARMA_WORDMARK = [
  "      SSSSSSSS       SSSSSSSSSSSS    SSS         SS  SSSSSSSSSSSSSSS   SSSSSSSSSSSSSS   SSS         SS  SSSSSSSSSSSSSSS  SSS         SSS        SSSSSSSSSSSSSS   SSS         SS        SSSSSSSS       SSSSSSSSSSSS    SSS   SSSS   SS        SSSSSSSS  ",
  "    :+++++++`        :SS++++++++`    ::`         :-` :+++++SSS+++++`   :+++++++++++`    ::`         :-` ::S+++++++++++`  :S`         -:+`       :+++++++++++`    ::`         :-`     :+++++++`        :SS++++++++`    ::`   :SS:   :-`     :+++++++`   ",
  "--`-+++++++--S`      :S`++++++++--S` ::`         :-` ++++++:S`+++++-  -S`++++++++++-    ::`         :-` ::`++++++++++-   :S`       --++-       -S`++++++++++-    ::`         :-`  --`-+++++++--S` :S`++++++++--S` ::`  :S`:S`  :-`  --`-+++++++--S`",
  ":-``        :S`      :S`SSSSSSSS:+`  ::``SSSSSSS:-`        :S`        :S`               ::``SSSSSSS:-`  ::`SSSSSSS       :S`   SS+:+`      :S`               ::``SSSSSSS:-`   :-``        :S` :S`SSSSSSSS:+`  ::` :S`  :S` :-`  :-``        :S`",
  ":-`         :S`      :SS++++++++S`   ::SS++++++++S`        :S`        :+`               ::SS++++++++S`  ::S+++++++`      :S`   :+`         :+`               ::SS++++++++S`   :-`         :S` :SS++++++++S`   ::`:S`    :S`:-`  :-`         :S`",
  ":-`SSSSSSSS:S`       :S`++++++++-:S` ::`+++++++++-:`       :S`        ++-:SSSSSSS`      ::`+++++++++-:` ::`++++++++-     :S`SS`++-         ++-:SSSSSSS`      ::`+++++++++-:`  :-`SSSSSSSS:S`  :S`++++++++-:S` ::SS`     :SS-`   :-`SSSSSSSS:S`",
  ":-`+++++++++:S`      :S`         :S` ::`         :-`       :S`          :+++++++`SSS    ::`         :-` ::`              :S`++`SS            :+++++++`SSS    ::`         :-`  :-`+++++++++:S` :S`  S:+`       ::`        ::-`   :-`+++++++++:S`",
  ":-`         :S`      :S`         :S` ::`         :-`       :S`                  :S`     ::`         :-` ::`              :S`  S:+`                   :S`     ::`         :-`  :-`         :S` :S`   ++-:``    ::`        ::-`   :-`         :S`",
  ":-`         :S`      :S`         :S` ::`         :-`       :S`                  :S`     ::`         :-` ::`SSSSSSSSSSSS  :S`   ++-:``            :S`     ::`         :-`  :-`         :S` :S`     +:+'SS  ::`        ::-`   :-`         :S`",
  ":-`         :S`      :S`SSSSSSSS:+`  ::`         :-` SSSSSS:S`SSSSSS  SSSSSSSSSS:S`     ::`         :-` ::+++++++++++++` :S`     +:+'SS  SSSSSSSSSS:S`     ::`         :-`  :-`         :S` :S`        +:+` ::`        ::-`   :-`         :S`",
  ":+`         :+`      :++++++++++`    :+`         :+` :+++++++++++++`  :+++++++++++`     :+`         :+`                  :+`        +:+` :+++++++++++`     :+`         :+`  :+`         :+` :+`        +:+` :+`        ::+`   :+`         :+`"
];

class TerminalEngine {
  constructor() {
    this.bannerElem = document.getElementById("ascii-banner");
    this.animationTimer = null;
    this.init();
  }

  init() {
    this.playAnimation();
  }

  playAnimation() {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }

    const lines = ABHISHEK_SHARMA_WORDMARK;
    const maxCols = Math.max(...lines.map(l => l.length));
    
    let currentCol = 0;
    this.renderColumns(lines, 0);

    const totalDuration = 2400; // 2.4 seconds reveal
    const intervalTime = Math.max(8, Math.floor(totalDuration / maxCols));

    this.animationTimer = setInterval(() => {
      currentCol++;
      this.renderColumns(lines, currentCol);

      if (currentCol >= maxCols) {
        clearInterval(this.animationTimer);
        this.animationTimer = null;
        this.appendBlinkingCursor();
      }
    }, intervalTime);
  }

  renderColumns(lines, revealedCols) {
    const renderedLines = lines.map(line => line.slice(0, revealedCols));
    this.bannerElem.textContent = renderedLines.join("\n");
  }

  appendBlinkingCursor() {
    const currentText = this.bannerElem.textContent;
    this.bannerElem.innerHTML = this.escapeHtml(currentText) + '<span class="cursor"></span>';
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.terminalInstance = new TerminalEngine();
});
