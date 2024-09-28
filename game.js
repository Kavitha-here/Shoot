const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Game Variables
let player = { x: 50, y: 50, width: 40, height: 40, speed: 5, ammo: 10 };
let bullets = [];
let enemies = [];
let ammoPickups = [];
let score = 0;

// Controls
let keys = {};

// Listen for key presses
window.addEventListener('keydown', function(e) {
  keys[e.key] = true;
});
window.addEventListener('keyup', function(e) {
  keys[e.key] = false;
});

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update game elements
  movePlayer();
  moveBullets();
  spawnEnemies();
  checkCollisions();
  spawnAmmoPickups();
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawAmmoPickups();

  // Display ammo and score
  displayHUD();

  requestAnimationFrame(gameLoop);
}

// Player movement
function movePlayer() {
  if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
  if (keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += player.speed;
  if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;

  // Shooting with limited ammo
  if (keys[' '] && player.ammo > 0) {
    bullets.push({ x: player.x + player.width / 2, y: player.y, speed: 7 });
    player.ammo--;
    keys[' '] = false; // Prevent continuous shooting
  }
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = '#00f';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Move and draw bullets
function moveBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bullets[i].speed;

    // Remove bullets when they leave the screen
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }
}

function drawBullets() {
  ctx.fillStyle = '#ff0';
  for (let bullet of bullets) {
    ctx.fillRect(bullet.x - 2, bullet.y, 4, 10);
  }
}

// Spawn enemies
function spawnEnemies() {
  if (Math.random() < 0.01) {
    enemies.push({ x: Math.random() * canvas.width, y: 0, width: 40, height: 40, speed: 2 });
  }

  for (let enemy of enemies) {
    enemy.y += enemy.speed;
  }
}

function drawEnemies() {
  ctx.fillStyle = '#f00';
  for (let enemy of enemies) {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }
}

// Check collisions (bullets vs enemies)
function checkCollisions() {
  for (let i = 0; i < enemies.length; i++) {
    for (let j = 0; j < bullets.length; j++) {
      if (
        bullets[j].x < enemies[i].x + enemies[i].width &&
        bullets[j].x > enemies[i].x &&
        bullets[j].y < enemies[i].y + enemies[i].height &&
        bullets[j].y > enemies[i].y
      ) {
        // Bullet hits enemy
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score++;
        i--;
        break;
      }
    }
  }
}

// Ammo pickups
function spawnAmmoPickups() {
  if (Math.random() < 0.005) {
    ammoPickups.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, width: 20, height: 20 });
  }

  for (let i = 0; i < ammoPickups.length; i++) {
    if (
      player.x < ammoPickups[i].x + ammoPickups[i].width &&
      player.x + player.width > ammoPickups[i].x &&
      player.y < ammoPickups[i].y + ammoPickups[i].height &&
      player.y + player.height > ammoPickups[i].y
    ) {
      // Player collects ammo
      player.ammo += 5;
      ammoPickups.splice(i, 1);
      i--;
    }
  }
}

function drawAmmoPickups() {
  ctx.fillStyle = '#0f0';
  for (let ammo of ammoPickups) {
    ctx.fillRect(ammo.x, ammo.y, ammo.width, ammo.height);
  }
}

// Display ammo and score
function displayHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Ammo: ${player.ammo}`, 10, 20);
  ctx.fillText(`Score: ${score}`, 10, 50);
}

// Start the game loop
gameLoop();
