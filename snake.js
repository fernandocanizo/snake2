const FPS = 1000 / 15;
let xVelocity = 0;
let yVelocity = 0;
let playerX = 10;
let playerY = 10;
const playerTrail = [];
let playerTail = 5;
let gridSize = 20;
let tileCount = 20;
let fruitX = 15;
let fruitY = 15;

const keyPush = (event) => {
  switch (event.keyCode) {
    case 37:
      xVelocity = -1;
      yVelocity = 0;
      break;
    case 38:
      xVelocity = 0;
      yVelocity = -1;
      break;
    case 39:
      xVelocity = 1;
      yVelocity = 0;
      break;
    case 40:
      xVelocity = 0;
      yVelocity = 1;
      break;
  }
};

const game = (canvas, ctx) => {
  playerX += xVelocity;
  playerY += yVelocity;

  if (playerX < 0) {
    playerX = tileCount - 1;
  } else if (playerX > tileCount - 1) {
    playerX = 0;
  }

  if (playerY < 0) {
    playerY = tileCount - 1;
  } else if (playerY > tileCount - 1) {
    playerY = 0;
  }

  // paint background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw fruit
  ctx.fillStyle = "red";
  ctx.fillRect(fruitX * gridSize, fruitY * gridSize, gridSize - 2, gridSize - 2);

  // draw player
  ctx.fillStyle = "lime";
  for (let i = 0; i < playerTrail.length; i++) {
    ctx.fillRect(playerTrail[i].x * gridSize, playerTrail[i].y * gridSize, gridSize - 2, gridSize - 2);
    if (playerTrail[i].x === playerX && playerTrail[i].y === playerY) {
      // loose tail
      playerTail = 5;
    }
  }

  playerTrail.push({ x: playerX, y: playerY });
  while (playerTrail.length > playerTail) {
    playerTrail.shift();
  }

  // ate the fruit? Then regenerate it and add more trail
  if (fruitX === playerX && fruitY === playerY) {
    playerTail += 1;
    fruitX = Math.floor(Math.random() * tileCount);
    fruitY = Math.floor(Math.random() * tileCount);
  }
};

window.onload = () => {
  const canvas = document.getElementById('playGround');
  const ctx = canvas.getContext('2d');

  document.addEventListener('keydown', keyPush);
  const intervalId = setInterval(() => game(canvas, ctx), FPS);
};


