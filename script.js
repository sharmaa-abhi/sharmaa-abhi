/**
 * GitSkins Terminal Banner Component - Interactive Engine
 * Animated spacing and pulsing energy beam between ABHISHEK and SHARMA
 */

const ABHISHEK_LINES = [
  "      SSSSSSSS       SSSSSSSSSSSS    SSS         SS  SSSSSSSSSSSSSSS   SSSSSSSSSSSSSS   SSS         SS  SSSSSSSSSSSSSSS  SSS         SSS",
  "    :+++++++`        :SS++++++++`    ::`         :-` :+++++SSS+++++`   :+++++++++++`    ::`         :-` ::S+++++++++++`  :S`         -:+`",
  "--`-+++++++--S`      :S`++++++++--S` ::`         :-` ++++++:S`+++++-  -S`++++++++++-    ::`         :-` ::`++++++++++-   :S`       --++-",
  ":-``        :S`      :S`SSSSSSSS:+`  ::``SSSSSSS:-`        :S`        :S`               ::``SSSSSSS:-`  ::`SSSSSSS       :S`   SS+:+`",
  ":-`         :S`      :SS++++++++S`   ::SS++++++++S`        :S`        :+`               ::SS++++++++S`  ::S+++++++`      :S`   :+`",
  ":-`SSSSSSSS:S`       :S`++++++++-:S` ::`+++++++++-:`       :S`        ++-:SSSSSSS`      ::`+++++++++-:` ::`++++++++-     :S`SS`++-",
  ":-`+++++++++:S`      :S`         :S` ::`         :-`       :S`          :+++++++`SSS    ::`         :-` ::`              :S`++`SS",
  ":-`         :S`      :S`         :S` ::`         :-`       :S`                  :S`     ::`         :-` ::`              :S`  S:+`",
  ":-`         :S`      :S`         :S` ::`         :-`       :S`                  :S`     ::`         :-` ::`SSSSSSSSSSSS  :S`   ++-:``",
  ":-`         :S`      :S`SSSSSSSS:+`  ::`         :-` SSSSSS:S`SSSSSS  SSSSSSSSSS:S`     ::`         :-` ::+++++++++++++` :S`     +:+'SS",
  ":+`         :+`      :++++++++++`    :+`         :+` :+++++++++++++`  :+++++++++++`     :+`         :+`                  :+`        +:+"
];

const SHARMA_LINES = [
  "SSSSSSSSSSSSSS   SSS         SS        SSSSSSSS       SSSSSSSSSSSS    SSS   SSSS   SS        SSSSSSSS  ",
  ":+++++++++++`    ::`         :-`     :+++++++`        :SS++++++++`    ::`   :SS:   :-`     :+++++++`   ",
  "-S`++++++++++-    ::`         :-`  --`-+++++++--S` :S`++++++++--S` ::`  :S`:S`  :-`  --`-+++++++--S`",
  ":S`               ::``SSSSSSS:-`   :-``        :S` :S`SSSSSSSS:+`  ::` :S`  :S` :-`  :-``        :S`",
  ":+`               ::SS++++++++S`   :-`         :S` :SS++++++++S`   ::`:S`    :S`:-`  :-`         :S`",
  "++-:SSSSSSS`      ::`+++++++++-:`  :-`SSSSSSSS:S`  :S`++++++++-:S` ::SS`     :SS-`   :-`SSSSSSSS:S`",
  "  :+++++++`SSS    ::`         :-`  :-`+++++++++:S` :S`  S:+`       ::`        ::-`   :-`+++++++++:S`",
  "          :S`     ::`         :-`  :-`         :S` :S`   ++-:``    ::`        ::-`   :-`         :S`",
  "          :S`     ::`         :-`  :-`         :S` :S`     +:+'SS  ::`        ::-`   :-`         :S`",
  "SSSSSSSSSS:S`     ::`         :-`  :-`         :S` :S`        +:+` ::`        ::-`   :-`         :S`",
  ":+++++++++++`     :+`         :+`  :+`         :+` :+`        +:+` :+`        ::+`   :+`         :+`"
];

// Animated Middle Column elements between ABHISHEK & SHARMA
const GAP_ICONS = [
  '<span class="gap-anim-beam">│</span>',
  '<span class="gap-anim">┆</span>',
  '<span class="gap-anim-beam">│</span>',
  '<span class="gap-anim">⚡</span>',
  '<span class="gap-anim-beam">│</span>',
  '<span class="gap-anim">┆</span>',
  '<span class="gap-anim-beam">│</span>',
  '<span class="gap-anim">⚡</span>',
  '<span class="gap-anim-beam">│</span>',
  '<span class="gap-anim">┆</span>',
  '<span class="gap-anim-beam">│</span>'
];

const GAP_LEFT = " ".repeat(12);
const GAP_RIGHT = " ".repeat(12);

class TerminalEngine {
  constructor() {
    this.bannerElem = document.getElementById("ascii-banner");
    this.typedCmdElem = document.getElementById("typed-command");
    this.commandCursorElem = document.getElementById("command-cursor");
    this.terminalWinElem = document.getElementById("terminal-window");
    this.statusBadge = document.getElementById("status-badge");
    
    this.commandToType = "./wordmark.sh --name";
    this.typeTimer = null;
    this.asciiTimer = null;
    this.isAnimating = false;

    this.init();
  }

  init() {
    this.setupEvents();
    this.startSequence();
  }

  setupEvents() {
    if (this.terminalWinElem) {
      this.terminalWinElem.addEventListener("click", () => {
        if (!this.isAnimating) {
          this.startSequence();
        }
      });
    }

    const closeBtn = document.getElementById("btn-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.startSequence();
      });
    }

    const expandBtn = document.getElementById("btn-expand");
    if (expandBtn) {
      expandBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.terminalWinElem.classList.toggle("glow-boost");
      });
    }
  }

  clearTimers() {
    if (this.typeTimer) clearInterval(this.typeTimer);
    if (this.asciiTimer) clearInterval(this.asciiTimer);
    this.typeTimer = null;
    this.asciiTimer = null;
  }

  startSequence() {
    this.clearTimers();
    this.isAnimating = true;
    
    this.typedCmdElem.textContent = "";
    this.bannerElem.innerHTML = "";
    this.commandCursorElem.style.display = "inline-block";
    if (this.statusBadge) this.statusBadge.textContent = "zsh • running";

    // Phase 1: Typewriter animation on `./wordmark.sh --name`
    let charIndex = 0;
    const fullCmd = this.commandToType;

    this.typeTimer = setInterval(() => {
      this.typedCmdElem.textContent += fullCmd[charIndex];
      charIndex++;

      if (charIndex >= fullCmd.length) {
        clearInterval(this.typeTimer);
        this.typeTimer = null;
        
        setTimeout(() => {
          this.revealAsciiBanner();
        }, 160);
      }
    }, 40);
  }

  revealAsciiBanner() {
    const totalCols = ABHISHEK_LINES[0].length;
    let currentCol = 0;
    const maxCols = totalCols + GAP_LEFT.length + 1 + GAP_RIGHT.length + SHARMA_LINES[0].length;

    const intervalTime = 12;

    this.asciiTimer = setInterval(() => {
      currentCol += 3; // reveal speed
      
      this.renderBannerAtCol(currentCol);

      if (currentCol >= maxCols) {
        clearInterval(this.asciiTimer);
        this.asciiTimer = null;
        this.finishAnimation();
      }
    }, intervalTime);
  }

  renderBannerAtCol(revealedCols) {
    const linesHtml = [];

    for (let i = 0; i < ABHISHEK_LINES.length; i++) {
      const abhi = ABHISHEK_LINES[i];
      const icon = GAP_ICONS[i];
      const sharma = SHARMA_LINES[i];

      let lineOutput = "";

      if (revealedCols <= abhi.length) {
        lineOutput = this.escapeHtml(abhi.slice(0, revealedCols));
      } else if (revealedCols <= abhi.length + GAP_LEFT.length) {
        const leftSpacesCount = revealedCols - abhi.length;
        lineOutput = this.escapeHtml(abhi) + " ".repeat(leftSpacesCount);
      } else if (revealedCols <= abhi.length + GAP_LEFT.length + 1) {
        lineOutput = this.escapeHtml(abhi) + GAP_LEFT + icon;
      } else if (revealedCols <= abhi.length + GAP_LEFT.length + 1 + GAP_RIGHT.length) {
        const rightSpacesCount = revealedCols - (abhi.length + GAP_LEFT.length + 1);
        lineOutput = this.escapeHtml(abhi) + GAP_LEFT + icon + " ".repeat(rightSpacesCount);
      } else {
        const sharmaRevealed = revealedCols - (abhi.length + GAP_LEFT.length + 1 + GAP_RIGHT.length);
        lineOutput = this.escapeHtml(abhi) + GAP_LEFT + icon + GAP_RIGHT + this.escapeHtml(sharma.slice(0, sharmaRevealed));
      }

      linesHtml.push(lineOutput);
    }

    this.bannerElem.innerHTML = linesHtml.join("\n");
  }

  finishAnimation() {
    this.isAnimating = false;
    if (this.statusBadge) this.statusBadge.textContent = "zsh • done";
    
    // Append terminal cursor at end
    this.bannerElem.innerHTML += '<span class="cursor"></span>';
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
