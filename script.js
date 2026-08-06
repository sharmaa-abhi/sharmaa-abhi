/**
 * GitSkins Terminal Banner Component - Vanilla JS Engine
 * Handles character-by-character & column typewriter animation, cursor blinking, and styling.
 */

const BANNER_VARIANTS = {
  block: [
    " █████╗ ██████╗ ██╗  ██╗██╗███████╗██╗  ██╗███████╗██╗  ██╗   ███████╗██╗  ██╗ █████╗ ██████╗ ███╗   ███╗ █████╗ ",
    "██╔══██╗██╔══██╗██║  ██║██║██╔════╝██║  ██║██╔════╝██║ ██╔╝   ██╔════╝██║  ██║██╔══██╗██╔══██╗████╗ ████║██╔══██╗",
    "███████║██████╔╝███████║██║███████╗███████║█████╗  █████═╝    ███████╗███████║███████║██████╔╝██╔████╔██║███████║",
    "██╔══██║██╔══██╗██╔══██║██║╚════██║██╔══██║██╔══╝  ██╔═██╗    ╚════██║██╔══██║██╔══██║██╔══██╗██║╚██╔╝██║██╔══██║",
    "██║  ██║██████╔╝██║  ██║██║███████║██║  ██║███████╗██║  ██╗   ███████║██║  ██║██║  ██║██║  ██║██║ ╚═╝ ██║██║  ██║",
    "╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝"
  ],
  slant: [
    "   ___    ____  ██╗  ██╗██╗███████╗██╗  ██╗███████╗██╗  ██╗   ███████╗██╗  ██╗  ___    ____  ███╗   ███╗  ___   ",
    "  /   |  / __ )/ /  / // / / ____// /  / // ____// / / /    / ____// /  / //   |  / __  //   |  /   |  /   |  ",
    " / /| | / __  / /__/ // / / /___ / /__/ // /___ / //_/     / /___ / /__/ // /| | / /_/ // /| | / /| | / /| |  ",
    "/ ___ |/ /_/ / __  // / /____  // __  // ____// __  \\     /____  // __  // ___ |/ _, _// ___ |/ ___ |/ ___ |  ",
    "/_/  |_/_____/_/  /_//_/ /______//_/  /_//_____//_/  \\_\\   /______//_/  /_//_/  |_/_/ |_|/_/  |_/_/  |_/_/  |_|  "
  ]
};

class TerminalEngine {
  constructor() {
    this.bannerElem = document.getElementById("ascii-banner");
    this.promptElem = document.getElementById("prompt-command");
    this.replayBtn = document.getElementById("btn-replay");
    this.copyBtn = document.getElementById("btn-copy");
    this.variantSelect = document.getElementById("variant-select");
    
    this.currentVariant = "block";
    this.animationTimer = null;
    this.typingSpeed = 25; // ms per column
    
    this.init();
  }

  init() {
    this.playAnimation();

    if (this.replayBtn) {
      this.replayBtn.addEventListener("click", () => this.playAnimation());
    }

    if (this.variantSelect) {
      this.variantSelect.addEventListener("change", (e) => {
        this.currentVariant = e.target.value;
        this.playAnimation();
      });
    }

    if (this.copyBtn) {
      this.copyBtn.addEventListener("click", () => this.copySvgToClipboard());
    }
  }

  playAnimation() {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }

    const lines = BANNER_VARIANTS[this.currentVariant] || BANNER_VARIANTS.block;
    const maxCols = Math.max(...lines.map(l => l.length));
    
    let currentCol = 0;
    
    // Clear display
    this.renderColumns(lines, 0);

    // Typing reveal animation column by column left-to-right over ~2.5s
    const totalDuration = 2500; // 2.5 seconds total
    const intervalTime = Math.max(10, Math.floor(totalDuration / maxCols));

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
    const renderedLines = lines.map(line => {
      return line.slice(0, revealedCols);
    });

    this.bannerElem.textContent = renderedLines.join("\n");
  }

  appendBlinkingCursor() {
    // Add blinking block cursor at the end of the last line
    const currentText = this.bannerElem.textContent;
    this.bannerElem.innerHTML = this.escapeHtml(currentText) + '<span class="cursor"></span>';
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  async copySvgToClipboard() {
    try {
      const response = await fetch("terminal.svg");
      const svgText = await response.text();
      await navigator.clipboard.writeText(svgText);
      
      const origText = this.copyBtn.innerHTML;
      this.copyBtn.innerHTML = `<span>✓ Copied SVG!</span>`;
      setTimeout(() => {
        this.copyBtn.innerHTML = origText;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy SVG:", err);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.terminalInstance = new TerminalEngine();
});
