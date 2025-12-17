// script.js - Logic for the Pong game

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Canvas dimensions
const WIDTH = canvas.width = 800;
const HEIGHT = canvas.height = 400;

// Game objects
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
let playerScore = 0;
let aiScore = 0;

const player = {
  x: 0,
  y: HEIGHT / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0,
  speed: 8,
};

const ai = {
  x: WIDTH - paddleWidth,
  y: HEIGHT / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 4,
};

const ball = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
  size: ballSize,
  dx: 5 * (Math.round(Math.random()) * 2 - 1), // Random initial direction
  dy: 5 * (Math.random() > 0.5 ? 1 : -1),
};

// Event listeners
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") player.dy = -player.speed;
  else if (e.key === "ArrowDown") player.dy = player.speed;
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") player.dy = 0;
});

// Update game objects
function update() {
  // Move player
  player.y += player.dy;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > HEIGHT) player.y = HEIGHT - player.height;

  // Move AI
  if (ai.y + ai.height / 2 < ball.y) ai.y += ai.speed;
  else if (ai.y + ai.height / 2 > ball.y) ai.y -= ai.speed;
  if (ai.y < 0) ai.y = 0;
  if (ai.y + ai.height > HEIGHT) ai.y = HEIGHT - ai.height;

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision
  if (ball.y < 0 || ball.y + ball.size > HEIGHT) ball.dy *= -1;

  // Paddle collision
  if (
    ball.x < player.x + player.width &&
    ball.y + ball.size > player.y &&
    ball.y < player.y + player.height
  ) {
    ball.dx *= -1;
    ball.x = player.x + player.width; // Avoid getting stuck
  }

  if (
    ball.x + ball.size > ai.x &&
    ball.y + ball.size > ai.y &&
    ball.y < ai.y + ai.height
  ) {
    ball.dx *= -1;
    ball.x = ai.x - ball.size; // Avoid getting stuck
  }

  // Score update
  if (ball.x < 0) {
    aiScore++;
    resetBall();
  }

  if (ball.x + ball.size > WIDTH) {
    playerScore++;
    resetBall();
  }
}

function resetBall() {
  ball.x = WIDTH / 2;
  ball.y = HEIGHT / 2;
  ball.dx = 5 * (Math.round(Math.random()) * 2 - 1);
  ball.dy = 5 * (Math.random() > 0.5 ? 1 : -1);
}

// Draw game objects
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw player and AI paddles
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillRect(ai.x, ai.y, ai.width, ai.height);

  // Draw ball
  ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

  // Draw scores
  ctx.font = "30px Arial";
  ctx.fillText(playerScore, WIDTH / 4, 30);
  ctx.fillText(aiScore, (3 * WIDTH) / 4, 30);
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();