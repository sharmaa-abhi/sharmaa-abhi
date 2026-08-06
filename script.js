/**
 * GitSkins Terminal Banner Component - Vanilla JS Engine
 * Exact match for GitSkins text letter wordmark font (S, :, +, -, ', `)
 */

const BANNER_VARIANTS = {
  // Exact GitSkins text letter wordmark font style from user screenshot
  wordmark: [
    "      SSSSSSSS       SSSSSSSSSSSS    SSS         SS  SSSSSSSSSSSSSSS   SSSSSSSSSSSSSS   SSS         SS  SSSSSSSSSSSSSSS  SSS         SSS ",
    "    :+++++++`        :SS++++++++`    ::`         :-` :+++++SSS+++++`   :+++++++++++`    ::`         :-` ::S+++++++++++`  :S`         -:+`",
    "--`-+++++++--S`      :S`++++++++--S` ::`         :-` ++++++:S`+++++-  -S`++++++++++-    ::`         :-` ::`++++++++++-   :S`       --++- ",
    ":-``        :S`      :S`SSSSSSSS:+`  ::``SSSSSSS:-`        :S`        :S`               ::``SSSSSSS:-`  ::`SSSSSSS       :S`   SS+:+`    ",
    ":-`         :S`      :SS++++++++S`   ::SS++++++++S`        :S`        :+`               ::SS++++++++S`  ::S+++++++`      :S`   :+`       ",
    ":-`SSSSSSSS:S`       :S`++++++++-:S` ::`+++++++++-:`       :S`        ++-:SSSSSSS`      ::`+++++++++-:` ::`++++++++-     :S`SS`++-       ",
    ":-`+++++++++:S`      :S`         :S` ::`         :-`       :S`          :+++++++`SSS    ::`         :-` ::`              :S`++`SS        ",
    ":-`         :S`      :S`         :S` ::`         :-`       :S`                  :S`     ::`         :-` ::`              :S`  S:+`       ",
    ":-`         :S`      :S`         :S` ::`         :-`       :S`                  :S`     ::`         :-` ::`SSSSSSSSSSSS  :S`   ++-:``    ",
    ":-`         :S`      :S`SSSSSSSS:+`  ::`         :-` SSSSSS:S`SSSSSS  SSSSSSSSSS:S`     ::`         :-` ::+++++++++++++` :S`     +:+'SS  ",
    ":+`         :+`      :++++++++++`    :+`         :+` :+++++++++++++`  :+++++++++++`     :+`         :+`                  :+`        +:+` "
  ],
  wordmarkFull: [
    "      SSSSSSSS       SSSSSSSSSSSS    SSS         SS  SSSSSSSSSSSSSSS   SSSSSSSSSSSSSS   SSS         SS  SSSSSSSSSSSSSSS  SSS         SSS ",
    "    :+++++++`        :SS++++++++`    ::`         :-` :+++++SSS+++++`   :+++++++++++`    ::`         :-` ::S+++++++++++`  :S`         -:+`",
    "--`-+++++++--S`      :S`++++++++--S` ::`         :-` ++++++:S`+++++-  -S`++++++++++-    ::`         :-` ::`++++++++++-   :S`       --++- ",
    ":-``        :S`      :S`SSSSSSSS:+`  ::``SSSSSSS:-`        :S`        :S`               ::``SSSSSSS:-`  ::`SSSSSSS       :S`   SS+:+`    ",
    ":-`         :S`      :SS++++++++S`   ::SS++++++++S`        :S`        :+`               ::SS++++++++S`  ::S+++++++`      :S`   :+`       ",
    ":-`SSSSSSSS:S`       :S`++++++++-:S` ::`+++++++++-:`       :S`        ++-:SSSSSSS`      ::`+++++++++-:` ::`++++++++-     :S`SS`++-       ",
    ":-`+++++++++:S`      :S`         :S` ::`         :-`       :S`          :+++++++`SSS    ::`         :-` ::`              :S`++`SS        ",
    ":-`         :S`      :S`         :S` ::`         :-`       :S`                  :S`     ::`         :-` ::`              :S`  S:+`       ",
    ":-`         :S`      :S`         :S` ::`         :-`       :S`                  :S`     ::`         :-` ::`SSSSSSSSSSSS  :S`   ++-:``    ",
    ":-`         :S`      :S`SSSSSSSS:+`  ::`         :-` SSSSSS:S`SSSSSS  SSSSSSSSSS:S`     ::`         :-` ::+++++++++++++` :S`     +:+'SS  ",
    ":+`         :+`      :++++++++++`    :+`         :+` :+++++++++++++`  :+++++++++++`     :+`         :+`                  :+`        +:+` ",
    "                                                                                                                                             ",
    " SSSSSSSSSSSSS   SSS         SS        SSSSSSSS   SSSSSSSSSSSS    SSS   SSSS   SS        SSSSSSSS  ",
    " :+++++++++++`   ::`         :-`     :+++++++`    :SS++++++++`    ::`   :SS:   :-`     :+++++++`   ",
    "-S`++++++++++-   ::`         :-`  --`-+++++++--S` :S`++++++++--S` ::`  :S`:S`  :-`  --`-+++++++--S`",
    ":S`              ::``SSSSSSS:-`   :-``        :S` :S`SSSSSSSS:+`  ::` :S`  :S` :-`  :-``        :S`",
    ":+`              ::SS++++++++S`   :-`         :S` :SS++++++++S`   ::`:S`    :S`:-`  :-`         :S`",
    "++-:SSSSSSS`     ::`+++++++++-:`  :-`SSSSSSSS:S`  :S`++++++++-:S` ::SS`     :SS-`   :-`SSSSSSSS:S` ",
    "  :+++++++`SSS   ::`         :-`  :-`+++++++++:S` :S`  S:+`       ::`        ::-`   :-`+++++++++:S`",
    "          :S`    ::`         :-`  :-`         :S` :S`   ++-:``    ::`        ::-`   :-`         :S`",
    "          :S`    ::`         :-`  :-`         :S` :S`     +:+'SS  ::`        ::-`   :-`         :S`",
    "SSSSSSSSSS:S`    ::`         :-`  :-`         :S` :S`        +:+` ::`        ::-`   :-`         :S`",
    ":+++++++++++`    :+`         :+`  :+`         :+` :+`        +:+` :+`        ::+`   :+`         :+`"
  ],
  block: [
    " █████╗ ██████╗ ██╗  ██╗██╗███████╗██╗  ██╗███████╗██╗  ██╗   ███████╗██╗  ██╗ █████╗ ██████╗ ███╗   ███╗ █████╗ ",
    "██╔══██╗██╔══██╗██║  ██║██║██╔════╝██║  ██║██╔════╝██║ ██╔╝   ██╔════╝██║  ██║██╔══██╗██╔══██╗████╗ ████║██╔══██╗",
    "███████║██████╔╝███████║██║███████╗███████║█████╗  █████═╝    ███████╗███████║███████║██████╔╝██╔████╔██║███████║",
    "██╔══██║██╔══██╗██╔══██║██║╚════██║██╔══██║██╔══╝  ██╔═██╗    ╚════██║██╔══██║██╔══██║██╔══██╗██║╚██╔╝██║██╔══██║",
    "██║  ██║██████╔╝██║  ██║██║███████║██║  ██║███████╗██║  ██╗   ███████║██║  ██║██║  ██║██║  ██║██║ ╚═╝ ██║██║  ██║",
    "╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝"
  ]
};

class TerminalEngine {
  constructor() {
    this.bannerElem = document.getElementById("ascii-banner");
    this.promptCmdElem = document.getElementById("prompt-cmd-text");
    this.headerTitleElem = document.getElementById("header-title-text");
    this.replayBtn = document.getElementById("btn-replay");
    this.copyBtn = document.getElementById("btn-copy");
    this.variantSelect = document.getElementById("variant-select");
    
    this.currentVariant = "wordmark";
    this.animationTimer = null;
    
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
        this.updatePrompt();
        this.playAnimation();
      });
    }

    if (this.copyBtn) {
      this.copyBtn.addEventListener("click", () => this.copySvgToClipboard());
    }
  }

  updatePrompt() {
    if (this.currentVariant.startsWith("wordmark")) {
      if (this.promptCmdElem) this.promptCmdElem.textContent = "./wordmark.sh --name";
      if (this.headerTitleElem) this.headerTitleElem.textContent = "./wordmark.sh --name";
    } else {
      if (this.promptCmdElem) this.promptCmdElem.textContent = "./whoami";
      if (this.headerTitleElem) this.headerTitleElem.textContent = "./whoami";
    }
  }

  playAnimation() {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }

    const lines = BANNER_VARIANTS[this.currentVariant] || BANNER_VARIANTS.wordmark;
    const maxCols = Math.max(...lines.map(l => l.length));
    
    let currentCol = 0;
    
    // Clear display
    this.renderColumns(lines, 0);

    // Progressive typewriter column reveal left-to-right over ~2.2s
    const totalDuration = 2200;
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
    const renderedLines = lines.map(line => {
      return line.slice(0, revealedCols);
    });

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
