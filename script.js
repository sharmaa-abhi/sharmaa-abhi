const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const startButton = document.getElementById('startButton');
const scoreEl = document.getElementById('score');
const healthEl = document.getElementById('health');
const levelEl = document.getElementById('level');

const keys = {};
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const state = {
  started: false,
  gameOver: false,
  score: 0,
  health: 100,
  level: 1,
  enemySpawnTimer: 0,
  lastShotAt: 0,
  lastTime: 0,
  stars: [],
  playerBullets: [],
  enemyBullets: [],
  enemies: [],
  particles: []
};

const player = {
  x: canvas.width / 2,
  y: canvas.height - 52,
  width: 34,
  height: 30,
  speed: 5.5,
  shotCooldown: 180,
  color: '#67e8f9'
};

function resetGame() {
  state.started = true;
  state.gameOver = false;
  state.score = 0;
  state.health = 100;
  state.level = 1;
  state.enemySpawnTimer = 0;
  state.lastShotAt = 0;
  state.playerBullets = [];
  state.enemyBullets = [];
  state.enemies = [];
  state.particles = [];
  player.x = canvas.width / 2;
  player.y = canvas.height - 52;
  updateHud();
  overlay.classList.add('hidden');
}

function updateHud() {
  scoreEl.textContent = String(state.score);
  healthEl.textContent = String(Math.max(0, Math.ceil(state.health)));
  levelEl.textContent = String(state.level);
}

function buildStars() {
  state.stars = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speed: Math.random() * 0.8 + 0.2
  }));
}

function spawnEnemy() {
  const size = 20 + Math.random() * 12;
  const x = 18 + Math.random() * (canvas.width - 36 - size);
  const y = -30;
  const speed = 1 + state.level * 0.4 + Math.random() * 0.7;
  const health = 1 + Math.floor(state.level / 2);

  state.enemies.push({
    x,
    y,
    width: size,
    height: size,
    speed,
    health,
    fireCooldown: 1000 + Math.random() * 1400,
    drift: (Math.random() - 0.5) * 1.2
  });
}

function firePlayerShot() {
  const currentTime = performance.now();
  if (currentTime - state.lastShotAt < player.shotCooldown) return;

  state.lastShotAt = currentTime;
  state.playerBullets.push({
    x: player.x,
    y: player.y - 18,
    radius: 5,
    speed: 8,
    damage: 1
  });
}

function fireEnemyShot(enemy) {
  state.enemyBullets.push({
    x: enemy.x + enemy.width / 2,
    y: enemy.y + enemy.height / 2,
    radius: 5,
    speed: 4 + state.level * 0.25,
    damage: 10
  });
}

function createParticles(x, y, color, amount = 14) {
  for (let i = 0; i < amount; i += 1) {
    const angle = (Math.PI * 2 * i) / amount + Math.random() * 0.6;
    const speed = 1.5 + Math.random() * 3.2;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 25 + Math.random() * 15,
      color
    });
  }
}

function handleInput(deltaFactor = 1) {
  const moveLeft = keys.ArrowLeft || keys.KeyA;
  const moveRight = keys.ArrowRight || keys.KeyD;

  if (moveLeft && !moveRight) {
    player.x -= player.speed * deltaFactor;
  }
  if (moveRight && !moveLeft) {
    player.x += player.speed * deltaFactor;
  }

  player.x = clamp(player.x, 28, canvas.width - 28);

  if ((keys.Space || keys.KeyK) && state.started && !state.gameOver) {
    firePlayerShot();
  }
}

function updateGame(delta, deltaFactor = 1) {
  if (!state.started || state.gameOver) return;

  state.level = 1 + Math.floor(state.score / 120);

  for (const star of state.stars) {
    star.y += star.speed * delta * 0.06;
    if (star.y > canvas.height) {
      star.y = -5;
      star.x = Math.random() * canvas.width;
    }
  }

  state.enemySpawnTimer -= delta;
  if (state.enemySpawnTimer <= 0) {
    spawnEnemy();
    state.enemySpawnTimer = Math.max(420, 1100 - state.level * 90) - Math.random() * 200;
  }

  state.playerBullets.forEach((bullet) => {
    bullet.y -= bullet.speed * deltaFactor;
  });

  state.enemyBullets.forEach((bullet) => {
    bullet.y += bullet.speed * deltaFactor;
  });

  state.enemies.forEach((enemy) => {
    enemy.y += enemy.speed * deltaFactor;
    enemy.x += Math.sin((enemy.y + enemy.width) * 0.04) * enemy.drift * deltaFactor;
    enemy.fireCooldown -= delta;
    if (enemy.fireCooldown <= 0) {
      fireEnemyShot(enemy);
      enemy.fireCooldown = 1000 + Math.random() * 1200;
    }
  });

  state.particles.forEach((particle) => {
    particle.x += particle.vx * deltaFactor;
    particle.y += particle.vy * deltaFactor;
    particle.life -= delta * 0.06;
  });

  for (let i = state.playerBullets.length - 1; i >= 0; i -= 1) {
    const bullet = state.playerBullets[i];
    if (bullet.y < -15) {
      state.playerBullets.splice(i, 1);
      continue;
    }

    for (let j = state.enemies.length - 1; j >= 0; j -= 1) {
      const enemy = state.enemies[j];
      if (
        bullet.x + bullet.radius > enemy.x &&
        bullet.x - bullet.radius < enemy.x + enemy.width &&
        bullet.y + bullet.radius > enemy.y &&
        bullet.y - bullet.radius < enemy.y + enemy.height
      ) {
        enemy.health -= bullet.damage;
        state.playerBullets.splice(i, 1);

        if (enemy.health <= 0) {
          createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#fbbf24', 22);
          state.enemies.splice(j, 1);
          state.score += 10;
          updateHud();
        }
        break;
      }
    }
  }

  for (let i = state.enemyBullets.length - 1; i >= 0; i -= 1) {
    const bullet = state.enemyBullets[i];
    if (
      bullet.x > player.x - player.width / 2 &&
      bullet.x < player.x + player.width / 2 &&
      bullet.y > player.y - player.height / 2 &&
      bullet.y < player.y + player.height / 2
    ) {
      state.enemyBullets.splice(i, 1);
      state.health -= bullet.damage;
      createParticles(player.x, player.y, '#f87171', 12);
      updateHud();
      if (state.health <= 0) {
        state.gameOver = true;
        overlay.classList.remove('hidden');
        overlay.querySelector('h1').textContent = 'Mission Failed';
        overlay.querySelector('.subtitle').textContent = `Final score: ${state.score}. Press Enter to fly again.`;
        startButton.textContent = 'Retry Mission';
      }
      continue;
    }

    if (bullet.y > canvas.height + 20) {
      state.enemyBullets.splice(i, 1);
    }
  }

  for (let i = state.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = state.enemies[i];
    if (enemy.y + enemy.height > canvas.height) {
      state.enemies.splice(i, 1);
      state.health -= 12;
      createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#f472b6', 18);
      updateHud();
      if (state.health <= 0) {
        state.gameOver = true;
        overlay.classList.remove('hidden');
        overlay.querySelector('h1').textContent = 'Mission Failed';
        overlay.querySelector('.subtitle').textContent = `Final score: ${state.score}. Press Enter to fly again.`;
        startButton.textContent = 'Retry Mission';
      }
    }
  }

  state.particles = state.particles.filter((particle) => particle.life > 0);
}

function drawBackground() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const star of state.stars) {
    ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = 'rgba(103, 232, 249, 0.18)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);

  ctx.fillStyle = '#67e8f9';
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(12, 14);
  ctx.lineTo(0, 8);
  ctx.lineTo(-12, 14);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#c084fc';
  ctx.fillRect(-4, 10, 8, 12);

  ctx.restore();
}

function drawEnemy(enemy) {
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.moveTo(enemy.width / 2, 0);
  ctx.lineTo(enemy.width, enemy.height * 0.4);
  ctx.lineTo(enemy.width * 0.8, enemy.height);
  ctx.lineTo(enemy.width * 0.2, enemy.height);
  ctx.lineTo(0, enemy.height * 0.4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(enemy.width * 0.28, enemy.height * 0.25, enemy.width * 0.44, 4);
  ctx.restore();
}

function drawBullets() {
  for (const bullet of state.playerBullets) {
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const bullet of state.enemyBullets) {
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawParticles() {
  for (const particle of state.particles) {
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = Math.max(0, particle.life / 35);
    ctx.fillRect(particle.x, particle.y, 3, 3);
    ctx.globalAlpha = 1;
  }
}

function draw() {
  drawBackground();
  drawBullets();
  for (const enemy of state.enemies) drawEnemy(enemy);
  drawPlayer();
  drawParticles();
}

function gameLoop(timestamp) {
  const delta = Math.min(timestamp - (state.lastTime || timestamp), 100);
  state.lastTime = timestamp;
  const deltaFactor = Math.min(delta / 16.67, 3);

  handleInput(deltaFactor);
  updateGame(delta, deltaFactor);
  draw();

  requestAnimationFrame(gameLoop);
}

function resetOverlayCopy() {
  overlay.querySelector('h1').textContent = 'Star Defender';
  overlay.querySelector('.subtitle').textContent = 'Hold the line against incoming raiders.';
  startButton.textContent = 'Start Mission';
}

startButton.addEventListener('click', () => {
  resetOverlayCopy();
  resetGame();
});

document.addEventListener('keydown', (event) => {
  keys[event.code] = true;

  if (event.code === 'Space') {
    event.preventDefault();
  }

  if (event.code === 'Enter' || (event.code === 'Space' && !state.started)) {
    if (!state.started || state.gameOver) {
      resetOverlayCopy();
      resetGame();
    }
  }
});

document.addEventListener('keyup', (event) => {
  keys[event.code] = false;
});

canvas.addEventListener('pointerdown', () => {
  if (!state.started || state.gameOver) {
    resetOverlayCopy();
    resetGame();
    return;
  }
  firePlayerShot();
});

buildStars();
resetOverlayCopy();
updateHud();
requestAnimationFrame(gameLoop);
