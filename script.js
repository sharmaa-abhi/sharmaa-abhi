/**
 * GitSkins Terminal Banner Component - Interactive Engine
 * Animated spacing and pulsing energy beam between ABHISHEK and SHARMAA
 */

const ABHISHEK_LINES = [
  " █████╗ ██████╗ ██╗  ██╗██╗███████╗██╗  ██╗███████╗██╗  ██╗",
  "██╔══██╗██╔══██╗██║  ██║██║██╔════╝██║  ██║██╔════╝██║  ██║",
  "███████║██████╔╝███████║██║███████╗███████║█████╗  ███████║",
  "██╔══██║██╔══██╗██╔══██║██║╚════██║██╔══██║██╔══╝  ██╔══██║",
  "██║  ██║██████╔╝██║  ██║██║███████║██║  ██║███████╗██║  ██║",
  "╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝"
];

const SHARMAA_LINES = [
  "███████╗██╗  ██╗██████╗ ███╗   ███╗██████╗  █████╗  █████╗ ",
  "██╔════╝██║  ██║██╔══██╗████╗ ████║██╔══██╗██╔══██╗██╔══██╗",
  "███████╗███████║██████╔╝██╔████╔██║███████║███████║███████║",
  "╚════██║██╔══██║██╔══██╗██║╚██╔╝██║██╔══██║██╔══██║██╔══██║",
  "███████║██║  ██║██║  ██║██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██║",
  "╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝"
];

// Animated Middle Column elements between ABHISHEK & SHARMAA
const GAP_ICONS = [
  '<span class="gap-anim-beam">⚡</span>',
  '<span class="gap-anim">┆</span>',
  '<span class="gap-anim-beam">✦</span>',
  '<span class="gap-anim">┆</span>',
  '<span class="gap-anim-beam">⚡</span>',
  '<span class="gap-anim">┆</span>'
];

const GAP_LEFT = " ".repeat(7);
const GAP_RIGHT = " ".repeat(7);

class TerminalEngine {
  constructor() {
    this.bannerElem = document.getElementById("ascii-banner");
    this.typedCmdElem = document.getElementById("typed-command");
    this.commandCursorElem = document.getElementById("command-cursor");
    this.terminalWinElem = document.getElementById("terminal-window");
    this.statusBadge = document.getElementById("status-badge");
    this.subtitleElem = document.getElementById("banner-subtitle");
    
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
    if (this.subtitleElem) {
      this.subtitleElem.style.opacity = "0";
      this.subtitleElem.style.transform = "translateY(6px)";
    }
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
        }, 140);
      }
    }, 35);
  }

  revealAsciiBanner() {
    const totalCols = ABHISHEK_LINES[0].length;
    let currentCol = 0;
    const maxCols = totalCols + GAP_LEFT.length + 1 + GAP_RIGHT.length + SHARMAA_LINES[0].length;

    const intervalTime = 14;

    this.asciiTimer = setInterval(() => {
      currentCol += 2; // smooth reveal speed
      
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
      const sharma = SHARMAA_LINES[i];

      let lineOutput = "";

      if (revealedCols <= abhi.length) {
        const abhiSlice = this.escapeHtml(abhi.slice(0, revealedCols));
        lineOutput = `<span class="name-abhi">${abhiSlice}</span>`;
      } else if (revealedCols <= abhi.length + GAP_LEFT.length) {
        const leftSpacesCount = revealedCols - abhi.length;
        const abhiEscaped = this.escapeHtml(abhi);
        lineOutput = `<span class="name-abhi">${abhiEscaped}</span>` + " ".repeat(leftSpacesCount);
      } else if (revealedCols <= abhi.length + GAP_LEFT.length + 1) {
        const abhiEscaped = this.escapeHtml(abhi);
        lineOutput = `<span class="name-abhi">${abhiEscaped}</span>` + GAP_LEFT + icon;
      } else if (revealedCols <= abhi.length + GAP_LEFT.length + 1 + GAP_RIGHT.length) {
        const rightSpacesCount = revealedCols - (abhi.length + GAP_LEFT.length + 1);
        const abhiEscaped = this.escapeHtml(abhi);
        lineOutput = `<span class="name-abhi">${abhiEscaped}</span>` + GAP_LEFT + icon + " ".repeat(rightSpacesCount);
      } else {
        const sharmaRevealed = revealedCols - (abhi.length + GAP_LEFT.length + 1 + GAP_RIGHT.length);
        const abhiEscaped = this.escapeHtml(abhi);
        const sharmaSlice = this.escapeHtml(sharma.slice(0, sharmaRevealed));
        lineOutput = `<span class="name-abhi">${abhiEscaped}</span>` + GAP_LEFT + icon + GAP_RIGHT + `<span class="name-sharmaa">${sharmaSlice}</span>`;
      }

      linesHtml.push(lineOutput);
    }

    this.bannerElem.innerHTML = linesHtml.join("\n");
  }

  finishAnimation() {
    this.isAnimating = false;
    if (this.statusBadge) this.statusBadge.textContent = "zsh • done";
    
    // Append terminal cursor at end
    this.bannerElem.innerHTML += ' <span class="cursor"></span>';

    // Fade in subtitle badge
    if (this.subtitleElem) {
      setTimeout(() => {
        this.subtitleElem.style.opacity = "1";
        this.subtitleElem.style.transform = "translateY(0)";
      }, 150);
    }
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  new TerminalEngine();
});


document.addEventListener("DOMContentLoaded", () => {
  window.terminalInstance = new TerminalEngine();
});
