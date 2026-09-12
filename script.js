/**
 * Star Defender // Tactical Orbital Defense Engine
 * High-performance Canvas Arcade with procedural VFX, Web Audio Synthesizer,
 * multi-tier enemies, tactical power-ups, and HiDPI rendering.
 */

(() => {
  // DOM ELEMENTS
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('overlay');
  const briefingPanel = document.getElementById('briefingPanel');
  const pausePanel = document.getElementById('pausePanel');
  const debriefPanel = document.getElementById('debriefPanel');
  const startButton = document.getElementById('startButton');
  const resumeButton = document.getElementById('resumeButton');
  const restartButton = document.getElementById('restartButton');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const pauseToggleBtn = document.getElementById('pauseToggleBtn');
  const audioOnIcon = document.getElementById('audioOnIcon');
  const audioOffIcon = document.getElementById('audioOffIcon');

  // HUD Readouts
  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('highScore');
  const healthEl = document.getElementById('health');
  const healthBar = document.getElementById('healthBar');
  const levelEl = document.getElementById('level');
  const multiplierEl = document.getElementById('multiplier');
  const buffBadge = document.getElementById('buffBadge');

  // Debrief Readouts
  const debriefScore = document.getElementById('debriefScore');
  const debriefHighScore = document.getElementById('debriefHighScore');
  const debriefKills = document.getElementById('debriefKills');
  const debriefSector = document.getElementById('debriefSector');
  const recordNotification = document.getElementById('recordNotification');

  // Touch Elements
  const touchLeftBtn = document.getElementById('touchLeftBtn');
  const touchRightBtn = document.getElementById('touchRightBtn');
  const touchFireBtn = document.getElementById('touchFireBtn');

  // CONSTANTS & CONFIG
  const VIRTUAL_WIDTH = 960;
  const VIRTUAL_HEIGHT = 600;

  // KEYBOARD & INPUT STATE
  const keys = {
    left: false,
    right: false,
    fire: false
  };

  // AUDIO SYNTHESIZER ENGINE (Web Audio API)
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('stardefender_muted') === 'true';
      this.masterGain = null;
      this.updateIcons();
    }

    init() {
      if (this.ctx) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.22, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    toggleMute() {
      this.init();
      this.muted = !this.muted;
      localStorage.setItem('stardefender_muted', String(this.muted));
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.22, this.ctx.currentTime);
      }
      this.updateIcons();
    }

    updateIcons() {
      if (this.muted) {
        audioOnIcon.classList.add('hidden');
        audioOffIcon.classList.remove('hidden');
      } else {
        audioOnIcon.classList.remove('hidden');
        audioOffIcon.classList.add('hidden');
      }
    }

    laser() {
      if (this.muted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(780, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.12);
      } catch (_) {}
    }

    enemyLaser() {
      if (this.muted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        osc.type = 'square';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.14);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.14);
      } catch (_) {}
    }

    explosion(isHeavy = false) {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const duration = isHeavy ? 0.45 : 0.25;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(isHeavy ? 600 : 900, now);
        filter.frequency.exponentialRampToValueAtTime(60, now + duration);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(isHeavy ? 0.6 : 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now);
      } catch (_) {}
    }

    powerup() {
      if (this.muted || !this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = this.ctx.currentTime + idx * 0.06;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.25, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(start);
          osc.stop(start + 0.12);
        });
      } catch (_) {}
    }

    hit() {
      if (this.muted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.15);
      } catch (_) {}
    }
  }

  const audio = new SoundEngine();

  // GAME STATE
  const state = {
    started: false,
    paused: false,
    gameOver: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('stardefender_hiscore') || '0', 10),
    health: 100,
    maxHealth: 100,
    level: 1,
    multiplier: 1.0,
    killStreak: 0,
    enemiesKilled: 0,
    shotsFired: 0,
    lastTime: 0,
    enemySpawnTimer: 0,
    lastShotAt: 0,
    shakeDuration: 0,
    shakeIntensity: 0,
    buff: {
      type: 'none', // 'triple' or 'rapid'
      endTime: 0
    },
    stars: [],
    nebulae: [],
    playerBullets: [],
    enemyBullets: [],
    enemies: [],
    powerups: [],
    particles: [],
    shockwaves: [],
    floatingTexts: []
  };

  // PLAYER CRAFT
  const player = {
    x: VIRTUAL_WIDTH / 2,
    y: VIRTUAL_HEIGHT - 65,
    width: 38,
    height: 38,
    baseSpeed: 6.2,
    tilt: 0, // dynamic roll angle
    shieldHitFlash: 0,
    shotCooldown: 170
  };

  // HELPER UTILITIES
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // HiDPI CANVAS RESIZE
  function setupCanvasResolution() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = VIRTUAL_WIDTH * dpr;
    canvas.height = VIRTUAL_HEIGHT * dpr;
    ctx.scale(dpr, dpr);
  }

  // BUILD PROCEDURAL BACKGROUND
  function initCosmos() {
    state.stars = [];
    // 3 parallax layers: deep (small/slow), mid, foreground (bright/faster)
    for (let i = 0; i < 110; i++) {
      state.stars.push({
        x: Math.random() * VIRTUAL_WIDTH,
        y: Math.random() * VIRTUAL_HEIGHT,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.4 + 0.15,
        alpha: Math.random() * 0.6 + 0.3
      });
    }

    for (let i = 0; i < 40; i++) {
      state.stars.push({
        x: Math.random() * VIRTUAL_WIDTH,
        y: Math.random() * VIRTUAL_HEIGHT,
        radius: Math.random() * 2 + 1.2,
        speed: Math.random() * 0.9 + 0.6,
        alpha: Math.random() * 0.5 + 0.5
      });
    }

    state.nebulae = [
      { x: VIRTUAL_WIDTH * 0.3, y: VIRTUAL_HEIGHT * 0.2, r: 160, color: 'rgba(34, 197, 94, 0.04)', vy: 0.1 },
      { x: VIRTUAL_WIDTH * 0.75, y: VIRTUAL_HEIGHT * 0.6, r: 200, color: 'rgba(34, 211, 238, 0.04)', vy: 0.15 },
      { x: VIRTUAL_WIDTH * 0.5, y: -50, r: 180, color: 'rgba(168, 85, 247, 0.035)', vy: 0.12 }
    ];
  }

  // RESET / START MISSION
  function startMission() {
    audio.init();
    state.started = true;
    state.paused = false;
    state.gameOver = false;
    state.score = 0;
    state.health = 100;
    state.level = 1;
    state.multiplier = 1.0;
    state.killStreak = 0;
    state.enemiesKilled = 0;
    state.shotsFired = 0;
    state.enemySpawnTimer = 400;
    state.lastShotAt = 0;
    state.shakeDuration = 0;
    state.buff.type = 'none';
    state.buff.endTime = 0;

    state.playerBullets = [];
    state.enemyBullets = [];
    state.enemies = [];
    state.powerups = [];
    state.particles = [];
    state.shockwaves = [];
    state.floatingTexts = [];

    player.x = VIRTUAL_WIDTH / 2;
    player.y = VIRTUAL_HEIGHT - 65;
    player.tilt = 0;
    player.shieldHitFlash = 0;

    updateHUD();
    overlay.classList.add('hidden');
    briefingPanel.classList.add('hidden');
    pausePanel.classList.add('hidden');
    debriefPanel.classList.add('hidden');
  }

  // PAUSE TOGGLE
  function togglePause() {
    if (!state.started || state.gameOver) return;
    state.paused = !state.paused;

    if (state.paused) {
      overlay.classList.remove('hidden');
      pausePanel.classList.remove('hidden');
      briefingPanel.classList.add('hidden');
      debriefPanel.classList.add('hidden');
    } else {
      overlay.classList.add('hidden');
      pausePanel.classList.add('hidden');
      state.lastTime = performance.now();
    }
  }

  // END MISSION (GAME OVER)
  function endMission() {
    state.gameOver = true;
    audio.explosion(true);

    const isNewRecord = state.score > state.highScore;
    if (isNewRecord) {
      state.highScore = state.score;
      localStorage.setItem('stardefender_hiscore', String(state.highScore));
      recordNotification.textContent = '★ NEW SECTOR RECORD ESTABLISHED ★';
      recordNotification.style.color = 'var(--accent-green)';
    } else {
      recordNotification.textContent = 'Defensive Grid Breach';
      recordNotification.style.color = 'var(--accent-rose)';
    }

    debriefScore.textContent = state.score.toLocaleString();
    debriefHighScore.textContent = state.highScore.toLocaleString();
    debriefKills.textContent = state.enemiesKilled.toString();
    debriefSector.textContent = state.level.toString();

    overlay.classList.remove('hidden');
    debriefPanel.classList.remove('hidden');
    briefingPanel.classList.add('hidden');
    pausePanel.classList.add('hidden');

    updateHUD();
  }

  // UPDATE HUD READOUTS
  function updateHUD() {
    scoreEl.textContent = state.score.toLocaleString();
    highScoreEl.textContent = state.highScore.toLocaleString();
    levelEl.textContent = state.level.toString();
    multiplierEl.textContent = `${state.multiplier.toFixed(1)}x`;

    const cleanHealth = Math.max(0, Math.ceil(state.health));
    healthEl.textContent = cleanHealth.toString();
    healthBar.style.width = `${cleanHealth}%`;

    healthBar.classList.remove('warning', 'danger');
    if (cleanHealth <= 25) {
      healthBar.classList.add('danger');
    } else if (cleanHealth <= 55) {
      healthBar.classList.add('warning');
    }

    // Buff badge
    const now = performance.now();
    if (state.buff.type !== 'none' && now < state.buff.endTime) {
      const remaining = Math.ceil((state.buff.endTime - now) / 1000);
      if (state.buff.type === 'triple') {
        buffBadge.className = 'buff-badge active-spread';
        buffBadge.textContent = `TRIPLE PLASMA (${remaining}s)`;
      } else if (state.buff.type === 'rapid') {
        buffBadge.className = 'buff-badge active-rapid';
        buffBadge.textContent = `OVERCHARGE (${remaining}s)`;
      }
    } else {
      state.buff.type = 'none';
      buffBadge.className = 'buff-badge inactive';
      buffBadge.textContent = 'STANDARD PLASMA';
    }
  }

  // SCREEN SHAKE
  function triggerScreenShake(intensity = 6, duration = 180) {
    state.shakeIntensity = intensity;
    state.shakeDuration = duration;
  }

  // SPAWN ENEMIES
  function spawnEnemy() {
    // Determine enemy archetype based on Sector
    const rand = Math.random();
    let type = 'scout'; // Scout, Interceptor, Dreadnought

    if (state.level >= 3 && rand < 0.18) {
      type = 'dreadnought';
    } else if (state.level >= 2 && rand < 0.5) {
      type = 'interceptor';
    }

    const xMargin = 40;
    const x = xMargin + Math.random() * (VIRTUAL_WIDTH - xMargin * 2);

    if (type === 'dreadnought') {
      state.enemies.push({
        type,
        x: clamp(x, 70, VIRTUAL_WIDTH - 70),
        y: -65,
        width: 68,
        height: 52,
        speed: 0.9 + state.level * 0.12,
        health: 12 + state.level * 4,
        maxHealth: 12 + state.level * 4,
        points: 80,
        fireCooldown: 1400,
        drift: 0.4,
        driftOffset: Math.random() * Math.PI * 2
      });
    } else if (type === 'interceptor') {
      state.enemies.push({
        type,
        x: clamp(x, 40, VIRTUAL_WIDTH - 40),
        y: -40,
        width: 36,
        height: 34,
        speed: 1.8 + state.level * 0.25,
        health: 3 + Math.floor(state.level / 2),
        maxHealth: 3 + Math.floor(state.level / 2),
        points: 30,
        fireCooldown: 1600 + Math.random() * 800,
        drift: 1.2,
        driftOffset: Math.random() * Math.PI * 2
      });
    } else {
      // Scout
      state.enemies.push({
        type,
        x: clamp(x, 30, VIRTUAL_WIDTH - 30),
        y: -30,
        width: 28,
        height: 26,
        speed: 2.4 + state.level * 0.35 + Math.random() * 0.6,
        health: 1,
        maxHealth: 1,
        points: 15,
        fireCooldown: 1800 + Math.random() * 1200,
        drift: 1.8,
        driftOffset: Math.random() * Math.PI * 2
      });
    }
  }

  // WEAPONS & FIRING
  function firePlayerWeapons() {
    const now = performance.now();
    const activeCooldown = state.buff.type === 'rapid' && now < state.buff.endTime 
      ? player.shotCooldown * 0.52 
      : player.shotCooldown;

    if (now - state.lastShotAt < activeCooldown) return;
    state.lastShotAt = now;
    state.shotsFired += 1;

    audio.laser();

    if (state.buff.type === 'triple' && now < state.buff.endTime) {
      // 3-way spread
      state.playerBullets.push(
        { x: player.x, y: player.y - 20, vx: 0, vy: -10, radius: 4.5, color: '#22d3ee' },
        { x: player.x - 12, y: player.y - 14, vx: -2.2, vy: -9.5, radius: 4, color: '#22d3ee' },
        { x: player.x + 12, y: player.y - 14, vx: 2.2, vy: -9.5, radius: 4, color: '#22d3ee' }
      );
    } else {
      // Dual synchronized plasma cannons
      state.playerBullets.push(
        { x: player.x - 9, y: player.y - 18, vx: 0, vy: -10, radius: 4.2, color: '#67e8f9' },
        { x: player.x + 9, y: player.y - 18, vx: 0, vy: -10, radius: 4.2, color: '#67e8f9' }
      );
    }
  }

  function fireEnemyWeapon(enemy) {
    audio.enemyLaser();
    if (enemy.type === 'dreadnought') {
      // 3-way burst
      state.enemyBullets.push(
        { x: enemy.x, y: enemy.y + enemy.height, vx: -1.4, vy: 4.5, radius: 5, color: '#a855f7' },
        { x: enemy.x, y: enemy.y + enemy.height, vx: 0, vy: 5, radius: 5.5, color: '#a855f7' },
        { x: enemy.x, y: enemy.y + enemy.height, vx: 1.4, vy: 4.5, radius: 5, color: '#a855f7' }
      );
    } else if (enemy.type === 'interceptor') {
      state.enemyBullets.push(
        { x: enemy.x - 8, y: enemy.y + enemy.height, vx: 0, vy: 5.2, radius: 4.5, color: '#f59e0b' },
        { x: enemy.x + 8, y: enemy.y + enemy.height, vx: 0, vy: 5.2, radius: 4.5, color: '#f59e0b' }
      );
    } else {
      // Scout single pulse
      state.enemyBullets.push({
        x: enemy.x,
        y: enemy.y + enemy.height,
        vx: 0,
        vy: 5.6 + state.level * 0.2,
        radius: 4,
        color: '#f43f5e'
      });
    }
  }

  // SPAWN POWERUPS
  function spawnPowerup(x, y, forceType = null) {
    let type = forceType;
    if (!type) {
      const r = Math.random();
      if (r < 0.38) type = 'shield';
      else if (r < 0.72) type = 'triple';
      else type = 'rapid';
    }

    state.powerups.push({
      x,
      y,
      type,
      vy: 1.6,
      radius: 13,
      angle: 0
    });
  }

  // PARTICLES & SHOCKWAVES
  function createExplosion(x, y, color, count = 20, isHeavy = false) {
    audio.explosion(isHeavy);
    triggerScreenShake(isHeavy ? 10 : 5, isHeavy ? 260 : 160);

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const speed = (isHeavy ? 2.5 : 1.6) + Math.random() * (isHeavy ? 5.5 : 3.8);
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1.5,
        color,
        life: 1.0,
        decay: Math.random() * 0.035 + 0.02
      });
    }

    if (isHeavy) {
      state.shockwaves.push({
        x,
        y,
        radius: 6,
        maxRadius: 75,
        color,
        alpha: 1.0
      });
    }
  }

  function addFloatingText(text, x, y, color = '#22c55e') {
    state.floatingTexts.push({
      text,
      x,
      y,
      vy: -1.2,
      alpha: 1.0,
      color
    });
  }

  // INPUT HANDLER
  function processInput(deltaFactor) {
    let moveDir = 0;
    if (keys.left) moveDir -= 1;
    if (keys.right) moveDir += 1;

    // Movement with smooth banking tilt
    player.x += moveDir * player.baseSpeed * deltaFactor;
    player.x = clamp(player.x, player.width / 2 + 10, VIRTUAL_WIDTH - player.width / 2 - 10);

    const targetTilt = moveDir * 0.26; // ~15 degrees
    player.tilt += (targetTilt - player.tilt) * 0.22;

    if (keys.fire && state.started && !state.gameOver && !state.paused) {
      firePlayerWeapons();
    }
  }

  // MAIN GAME UPDATE
  function update(delta, deltaFactor) {
    if (!state.started || state.paused || state.gameOver) return;

    // Progression: Level up every 250 points
    state.level = 1 + Math.floor(state.score / 250);

    // Screen Shake Decay
    if (state.shakeDuration > 0) {
      state.shakeDuration -= delta;
      if (state.shakeDuration <= 0) state.shakeIntensity = 0;
    }

    // Shield Flash Decay
    if (player.shieldHitFlash > 0) {
      player.shieldHitFlash -= delta * 0.006;
    }

    // Background Motion
    for (const s of state.stars) {
      s.y += s.speed * deltaFactor * 1.8;
      if (s.y > VIRTUAL_HEIGHT + 10) {
        s.y = -10;
        s.x = Math.random() * VIRTUAL_WIDTH;
      }
    }

    for (const n of state.nebulae) {
      n.y += n.vy * deltaFactor;
      if (n.y - n.r > VIRTUAL_HEIGHT) {
        n.y = -n.r;
        n.x = Math.random() * VIRTUAL_WIDTH;
      }
    }

    // Enemy Spawning
    state.enemySpawnTimer -= delta;
    if (state.enemySpawnTimer <= 0) {
      spawnEnemy();
      const baseSpawnInterval = Math.max(380, 1100 - state.level * 80);
      state.enemySpawnTimer = baseSpawnInterval + (Math.random() * 200 - 100);
    }

    // Update Player Bullets
    for (let i = state.playerBullets.length - 1; i >= 0; i--) {
      const b = state.playerBullets[i];
      b.x += b.vx * deltaFactor;
      b.y += b.vy * deltaFactor;
      if (b.y < -20 || b.x < -20 || b.x > VIRTUAL_WIDTH + 20) {
        state.playerBullets.splice(i, 1);
      }
    }

    // Update Enemy Bullets
    for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
      const b = state.enemyBullets[i];
      b.x += b.vx * deltaFactor;
      b.y += b.vy * deltaFactor;

      // Player Collision
      const distToPlayer = Math.hypot(b.x - player.x, b.y - player.y);
      if (distToPlayer < player.width / 2 + b.radius) {
        state.enemyBullets.splice(i, 1);
        state.health -= 12;
        state.multiplier = 1.0;
        state.killStreak = 0;
        player.shieldHitFlash = 1.0;
        audio.hit();
        triggerScreenShake(7, 200);
        createExplosion(b.x, b.y, '#ef4444', 12);
        updateHUD();

        if (state.health <= 0) {
          endMission();
          return;
        }
        continue;
      }

      if (b.y > VIRTUAL_HEIGHT + 20) {
        state.enemyBullets.splice(i, 1);
      }
    }

    // Update Enemies
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const e = state.enemies[i];
      e.y += e.speed * deltaFactor;
      e.x += Math.sin((e.y * 0.02) + e.driftOffset) * e.drift * deltaFactor;

      // Weapon firing
      e.fireCooldown -= delta;
      if (e.fireCooldown <= 0 && e.y > 20 && e.y < VIRTUAL_HEIGHT - 120) {
        fireEnemyWeapon(e);
        e.fireCooldown = e.type === 'dreadnought' ? 1500 : 1800 + Math.random() * 1000;
      }

      // Check bullet hit on enemy
      for (let j = state.playerBullets.length - 1; j >= 0; j--) {
        const b = state.playerBullets[j];
        if (
          b.x > e.x - e.width / 2 &&
          b.x < e.x + e.width / 2 &&
          b.y > e.y - e.height / 2 &&
          b.y < e.y + e.height / 2
        ) {
          state.playerBullets.splice(j, 1);
          e.health -= 1;

          // Spark hit
          for (let p = 0; p < 4; p++) {
            state.particles.push({
              x: b.x,
              y: b.y,
              vx: (Math.random() - 0.5) * 4,
              vy: Math.random() * 3,
              radius: 2,
              color: '#22d3ee',
              life: 0.6,
              decay: 0.05
            });
          }

          if (e.health <= 0) {
            // Destroyed
            const isHeavy = e.type === 'dreadnought';
            createExplosion(e.x, e.y, isHeavy ? '#c084fc' : (e.type === 'interceptor' ? '#fbbf24' : '#f43f5e'), isHeavy ? 36 : 18, isHeavy);

            state.enemiesKilled += 1;
            state.killStreak += 1;
            if (state.killStreak % 5 === 0 && state.multiplier < 3.0) {
              state.multiplier = Math.min(3.0, state.multiplier + 0.5);
              addFloatingText(`${state.multiplier.toFixed(1)}x MULTIPLIER!`, player.x, player.y - 30, '#f59e0b');
            }

            const earnedPoints = Math.round(e.points * state.multiplier);
            state.score += earnedPoints;
            addFloatingText(`+${earnedPoints}`, e.x, e.y - 10, '#22c55e');

            // Powerup drop
            if (isHeavy || Math.random() < 0.16) {
              spawnPowerup(e.x, e.y, isHeavy ? (Math.random() < 0.5 ? 'triple' : 'shield') : null);
            }

            state.enemies.splice(i, 1);
            updateHUD();
            break;
          }
        }
      }

      // Check collision with player
      const distToCraft = Math.hypot(e.x - player.x, e.y - player.y);
      if (distToCraft < (e.width + player.width) / 2.3) {
        state.health -= 25;
        state.multiplier = 1.0;
        state.killStreak = 0;
        player.shieldHitFlash = 1.0;
        triggerScreenShake(12, 300);
        createExplosion(e.x, e.y, '#f87171', 25, true);
        state.enemies.splice(i, 1);
        updateHUD();

        if (state.health <= 0) {
          endMission();
          return;
        }
        continue;
      }

      // Reached bottom (Defense breach)
      if (e.y > VIRTUAL_HEIGHT + 35) {
        state.enemies.splice(i, 1);
        state.health -= 8;
        state.multiplier = 1.0;
        state.killStreak = 0;
        addFloatingText('PERIMETER BREACH -8%', player.x, player.y - 25, '#f43f5e');
        triggerScreenShake(4, 120);
        updateHUD();

        if (state.health <= 0) {
          endMission();
          return;
        }
      }
    }

    // Update Powerups
    for (let i = state.powerups.length - 1; i >= 0; i--) {
      const p = state.powerups[i];
      p.y += p.vy * deltaFactor;
      p.angle += 0.04;

      const dist = Math.hypot(p.x - player.x, p.y - player.y);
      if (dist < player.width / 2 + p.radius) {
        audio.powerup();
        const now = performance.now();

        if (p.type === 'shield') {
          state.health = Math.min(state.maxHealth, state.health + 30);
          addFloatingText('SHIELD REPAIRED +30%', player.x, player.y - 30, '#22c55e');
        } else if (p.type === 'triple') {
          state.buff.type = 'triple';
          state.buff.endTime = now + 12000;
          addFloatingText('TRIPLE PLASMA ENGAGED', player.x, player.y - 30, '#22d3ee');
        } else if (p.type === 'rapid') {
          state.buff.type = 'rapid';
          state.buff.endTime = now + 10000;
          addFloatingText('OVERCHARGE CANNON ACTIVE', player.x, player.y - 30, '#f59e0b');
        }

        createExplosion(p.x, p.y, '#22d3ee', 14);
        state.powerups.splice(i, 1);
        updateHUD();
        continue;
      }

      if (p.y > VIRTUAL_HEIGHT + 20) {
        state.powerups.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const pt = state.particles[i];
      pt.x += pt.vx * deltaFactor;
      pt.y += pt.vy * deltaFactor;
      pt.vx *= 0.96;
      pt.vy *= 0.96;
      pt.life -= pt.decay * deltaFactor;
      if (pt.life <= 0) state.particles.splice(i, 1);
    }

    // Update Shockwaves
    for (let i = state.shockwaves.length - 1; i >= 0; i--) {
      const sw = state.shockwaves[i];
      sw.radius += 3.2 * deltaFactor;
      sw.alpha -= 0.038 * deltaFactor;
      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        state.shockwaves.splice(i, 1);
      }
    }

    // Update Floating Text
    for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
      const ft = state.floatingTexts[i];
      ft.y += ft.vy * deltaFactor;
      ft.alpha -= 0.02 * deltaFactor;
      if (ft.alpha <= 0) state.floatingTexts.splice(i, 1);
    }

    // Keep Buff Timer current in UI
    if (state.buff.type !== 'none') {
      updateHUD();
    }
  }

  // RENDERING FUNCTIONS
  function draw() {
    ctx.save();

    // Apply Screen Shake if active
    if (state.shakeIntensity > 0) {
      const rx = (Math.random() - 0.5) * state.shakeIntensity;
      const ry = (Math.random() - 0.5) * state.shakeIntensity;
      ctx.translate(rx, ry);
    }

    // Background Clear
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // Procedural Nebulae
    for (const n of state.nebulae) {
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      grad.addColorStop(0, n.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Parallax Starfield
    for (const s of state.stars) {
      ctx.fillStyle = `rgba(226, 232, 240, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shockwaves
    for (const sw of state.shockwaves) {
      ctx.save();
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = Math.max(0, sw.alpha);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Powerups
    for (const p of state.powerups) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      let pColor = '#22c55e';
      let symbol = '+';
      if (p.type === 'triple') {
        pColor = '#22d3ee';
        symbol = '3';
      } else if (p.type === 'rapid') {
        pColor = '#f59e0b';
        symbol = '⚡';
      }

      // Outer glow
      ctx.shadowColor = pColor;
      ctx.shadowBlur = 12;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = pColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Symbol
      ctx.shadowBlur = 0;
      ctx.fillStyle = pColor;
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, 0, 1);

      ctx.restore();
    }

    // Player Bullets
    for (const b of state.playerBullets) {
      ctx.save();
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Enemy Bullets
    for (const b of state.enemyBullets) {
      ctx.save();
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Enemies
    for (const e of state.enemies) {
      drawEnemyCraft(e);
    }

    // Particles
    for (const pt of state.particles) {
      ctx.save();
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = Math.max(0, pt.life);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Player Craft
    if (state.started && !state.gameOver) {
      drawPlayerCraft();
    }

    // Floating Combat Texts
    for (const ft of state.floatingTexts) {
      ctx.save();
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();
  }

  // VECTOR DRAWING: PLAYER CRAFT
  function drawPlayerCraft() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.tilt);

    // Engine Thruster Plumes
    const plumeLength = 12 + Math.random() * 8;
    const plumeGrad = ctx.createLinearGradient(0, 14, 0, 14 + plumeLength);
    plumeGrad.addColorStop(0, '#22d3ee');
    plumeGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = plumeGrad;

    ctx.beginPath();
    ctx.moveTo(-6, 14);
    ctx.lineTo(0, 14 + plumeLength);
    ctx.lineTo(6, 14);
    ctx.closePath();
    ctx.fill();

    // Ship Hull Wings
    ctx.shadowColor = 'rgba(34, 211, 238, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;

    ctx.beginPath();
    // Fuselage tip
    ctx.moveTo(0, -20);
    // Right wingtip
    ctx.lineTo(18, 14);
    // Right engine notch
    ctx.lineTo(7, 12);
    // Center tail
    ctx.lineTo(0, 16);
    // Left engine notch
    ctx.lineTo(-7, 12);
    // Left wingtip
    ctx.lineTo(-18, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wing Cannons
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(-17, 0, 3, 10);
    ctx.fillRect(14, 0, 3, 10);

    // Cockpit Glass Canopy
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    ctx.ellipse(0, -4, 4, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shield Bubble (Rendered on hit flash or active defense)
    if (player.shieldHitFlash > 0.05) {
      ctx.strokeStyle = `rgba(34, 211, 238, ${player.shieldHitFlash * 0.8})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, player.width * 0.72, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  // VECTOR DRAWING: ENEMY CRAFT
  function drawEnemyCraft(enemy) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    if (enemy.type === 'dreadnought') {
      // Armored Dreadnought
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#1e1b4b';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.2;

      ctx.beginPath();
      ctx.moveTo(0, enemy.height / 2);
      ctx.lineTo(enemy.width / 2, enemy.height * 0.2);
      ctx.lineTo(enemy.width * 0.4, -enemy.height / 2);
      ctx.lineTo(-enemy.width * 0.4, -enemy.height / 2);
      ctx.lineTo(-enemy.width / 2, enemy.height * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing Power Core
      ctx.fillStyle = '#e879f9';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();

      // Mini Health Bar over Dreadnought
      ctx.shadowBlur = 0;
      const barW = 42;
      const barH = 4;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(-barW / 2, -enemy.height / 2 - 10, barW, barH);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-barW / 2, -enemy.height / 2 - 10, barW * (enemy.health / enemy.maxHealth), barH);

    } else if (enemy.type === 'interceptor') {
      // Tactical Interceptor
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#292524';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, enemy.height / 2);
      ctx.lineTo(enemy.width / 2, -enemy.height / 3);
      ctx.lineTo(0, -enemy.height / 2);
      ctx.lineTo(-enemy.width / 2, -enemy.height / 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Core eye
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-3, -2, 6, 6);

    } else {
      // Scout Drone
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#1c1917';
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      ctx.moveTo(0, enemy.height / 2);
      ctx.lineTo(enemy.width / 2, -enemy.height / 2);
      ctx.lineTo(0, -enemy.height / 4);
      ctx.lineTo(-enemy.width / 2, -enemy.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // MAIN ANIMATION LOOP
  function gameLoop(timestamp) {
    if (!state.lastTime) state.lastTime = timestamp;
    const delta = Math.min(timestamp - state.lastTime, 100);
    state.lastTime = timestamp;
    const deltaFactor = Math.min(delta / 16.67, 3);

    processInput(deltaFactor);
    update(delta, deltaFactor);
    draw();

    requestAnimationFrame(gameLoop);
  }

  // EVENT LISTENERS & WIRING
  window.addEventListener('resize', setupCanvasResolution);

  // Keyboard Controls
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'Space') {
      keys.fire = true;
      e.preventDefault();
    }

    if (e.code === 'KeyP' || e.code === 'Escape') {
      e.preventDefault();
      togglePause();
    }

    if (e.code === 'KeyM') {
      audio.toggleMute();
    }

    if (e.code === 'Enter') {
      if (!state.started || state.gameOver) {
        startMission();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'Space') keys.fire = false;
  });

  // Pointer / Mouse Canvas Controls
  canvas.addEventListener('pointerdown', (e) => {
    if (!state.started || state.gameOver) {
      startMission();
      return;
    }
    audio.init();
    keys.fire = true;
  });

  window.addEventListener('pointerup', () => {
    keys.fire = false;
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!state.started || state.paused || state.gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * VIRTUAL_WIDTH;
    player.x = clamp(mouseX, player.width / 2 + 10, VIRTUAL_WIDTH - player.width / 2 - 10);
  });

  // Mobile Touch Controls
  if (touchLeftBtn && touchRightBtn && touchFireBtn) {
    const bindTouch = (el, onDown, onUp) => {
      el.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(); });
      el.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); });
      el.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(); });
      el.addEventListener('mouseup', (e) => { e.preventDefault(); onUp(); });
    };

    bindTouch(touchLeftBtn, () => { keys.left = true; }, () => { keys.left = false; });
    bindTouch(touchRightBtn, () => { keys.right = true; }, () => { keys.right = false; });
    bindTouch(touchFireBtn, () => {
      audio.init();
      keys.fire = true;
      if (!state.started || state.gameOver) startMission();
    }, () => { keys.fire = false; });
  }

  // Button Listeners
  startButton.addEventListener('click', startMission);
  resumeButton.addEventListener('click', togglePause);
  restartButton.addEventListener('click', startMission);
  pauseToggleBtn.addEventListener('click', togglePause);
  audioToggleBtn.addEventListener('click', () => audio.toggleMute());

  // INITIALIZE
  setupCanvasResolution();
  initCosmos();
  updateHUD();
  requestAnimationFrame(gameLoop);
})();
