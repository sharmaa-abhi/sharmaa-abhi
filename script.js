/**
 * GitSkins Terminal Banner Component - Interactive Animation Engine
 * Creates realistic terminal command typing + ASCII wordmark unrolling sequence
 * ABHISHEK SHARMA with 28-character space gap between names
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

// 28 spaces gap between ABHISHEK and SHARMA for visual distinction
const WORDMARK_GAP = " ".repeat(28);
const FULL_WORDMARK = ABHISHEK_LINES.map((line, i) => line + WORDMARK_GAP + SHARMA_LINES[i]);

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
    this.bannerElem.textContent = "";
    this.commandCursorElem.style.display = "inline-block";
    if (this.statusBadge) this.statusBadge.textContent = "zsh • running";

    // Phase 1: Type Command Line
    let charIndex = 0;
    const fullCmd = this.commandToType;

    this.typeTimer = setInterval(() => {
      this.typedCmdElem.textContent += fullCmd[charIndex];
      charIndex++;

      if (charIndex >= fullCmd.length) {
        clearInterval(this.typeTimer);
        this.typeTimer = null;
        
        // Brief pause after typing command, then reveal ASCII banner
        setTimeout(() => {
          this.revealAsciiBanner();
        }, 180);
      }
    }, 45); // typing speed per char
  }

  revealAsciiBanner() {
    const lines = FULL_WORDMARK;
    const maxCols = Math.max(...lines.map(l => l.length));
    let currentCol = 0;

    const totalDuration = 1800; // 1.8s smooth unroll
    const intervalTime = Math.max(8, Math.floor(totalDuration / maxCols));

    this.asciiTimer = setInterval(() => {
      currentCol += 2; // reveal 2 cols per tick for fast smooth animation
      
      const renderedLines = lines.map(line => line.slice(0, Math.min(currentCol, line.length)));
      this.bannerElem.textContent = renderedLines.join("\n");

      if (currentCol >= maxCols) {
        clearInterval(this.asciiTimer);
        this.asciiTimer = null;
        this.finishAnimation();
      }
    }, intervalTime);
  }

  finishAnimation() {
    this.isAnimating = false;
    if (this.statusBadge) this.statusBadge.textContent = "zsh • done";
    
    // Append terminal cursor at end of banner
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
