"use strict";

// get canvas & context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.addEventListener("click", handleStart);
canvas.style.border = "1px solid rgba(0, 0, 0, .20)";

// background image
const background = new Image();
background.src = "100_acre.png";

// player
const player = new Image();
player.src = "garet.png";
player.xPos = canvas.width / 2;
player.yPos = canvas.height / 2;

let enemies = [];

const cupcake = new Image();
cupcake.src = "cupcake.png";

// game data
let gameInProgress = false;
let highScore = 0;
let currentScore = 0;

function createEnemy() {
  const enemy = {};
  enemy.img = cupcake;
  // enemy.speed = 4;
  enemy.speed = Math.random() * 6 + 2;
  enemy.xPos = Math.floor(Math.random() * canvas.width);
  enemy.yPos = Math.floor(Math.random() * canvas.height);
  enemy.width = enemy.img.width;
  enemy.height = enemy.img.height;

  // coin flip to decide if we clamp x or y.
  if (coinFlip()) {
    // clamp x
    if (enemy.xPos > canvas.width / 2) {
      enemy.xPos = canvas.width;
    } else {
      enemy.xPos = 0 - enemy.width; // HIDE IT!
    }
  } else {
    if (enemy.yPos > canvas.height / 2) {
      enemy.yPos = canvas.height;
    } else {
      enemy.yPos = 0 - enemy.height;
    }
  }
  enemies.push(enemy);
}

// top-level listeners
document.addEventListener("mousemove", movePlayer);
let enemiesInterval; // will set on start.

// start game
window.requestAnimationFrame(draw);

/* ------- MAIN GAMEPLAY ------- */

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   ctx.fillStyle = "rgb(242, 213, 153)";
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0);
  ctx.drawImage(player, player.xPos, player.yPos);
  drawEnemies();
  moveEnemies();
  updateScore();
  if (gameInProgress) {
    window.requestAnimationFrame(draw); // stack will deallocate
  }
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.drawImage(enemy.img, enemy.xPos, enemy.yPos);
  });
}

function handleStart() {
  if (!gameInProgress) {
    enemiesInterval = window.setInterval(createEnemy, 500, 1);
    document.getElementById("mainTitle").innerHTML = "Run away!";
    enemies = [];
    gameInProgress = true;
    draw();
  }
}

function updateScore() {
  currentScore = enemies.length;
  document.getElementById("score").innerHTML = "Score: " + currentScore;
  if (currentScore > highScore) {
    highScore = currentScore;
    document.getElementById("highScore").innerHTML = "Best: " + highScore;
  }
}

function endGame() {
  gameInProgress = false;
  window.clearInterval(enemiesInterval);
  document.getElementById("mainTitle").innerHTML =
    "HAPPY BIRTHDAY!!! Click to restart";
}

function movePlayer(e) {
  const getClampedPos = (img, newPos, axis) => {
    const max = axis === "x" ? canvas.width : canvas.height;
    const centerAdj = axis === "x" ? img.width / 2 : img.height / 2;
    const canvasAdj = axis === "x" ? canvas.offsetLeft : canvas.offsetTop;

    if (newPos > max - centerAdj + canvasAdj) {
      return max - img.width;
    } else if (newPos < centerAdj + canvasAdj) {
      return 0;
    } else {
      return newPos - centerAdj - canvasAdj;
    }
  };

  // change player position
  player.xPos = getClampedPos(player, e.clientX, "x");
  player.yPos = getClampedPos(player, e.clientY, "y");
}

function moveEnemies() {
  // move enemy. use trig to run smoothly.
  enemies.forEach((enemy) => {
    const yLeg = Math.abs(enemy.yPos - player.yPos);
    const xLeg = Math.abs(enemy.xPos - player.xPos);
    const theta = Math.abs(Math.tan(yLeg / xLeg));

    let xDelta = Math.abs(Math.cos(theta) * enemy.speed);
    let yDelta = Math.abs(Math.sin(theta) * enemy.speed);

    if (checkCollision(enemy, player)) {
      endGame();
    }

    // try to prevent weird shaking and indecision.
    if (xLeg < enemy.speed) {
      xDelta = 0;
      yDelta = enemy.speed;
    } else if (yLeg < enemy.speed) {
      yDelta = 0;
      xDelta = enemy.speed;
    }

    if (enemy.xPos < player.xPos) {
      enemy.xPos += xDelta;
      //   enemy.img = beeLeft;
    } else {
      enemy.xPos -= xDelta;
      //   enemy.img = beeRight;
    }

    enemy.yPos += enemy.yPos < player.yPos ? yDelta : -yDelta;
  });
}

/* -------- UTILS & HELPERS -------- */

function checkCollision(obj1, obj2) {
  const isBetween = (val, min, max) => {
    return val >= min && val <= max;
  };

  if (
    isBetween(obj1.xPos + obj1.width / 2, obj2.xPos, obj2.xPos + obj2.width)
  ) {
    if (isBetween(obj1.yPos, obj2.yPos, obj2.yPos + obj2.height / 2)) {
      return true;
    }
  }
  return false;
}

function coinFlip() {
  return Math.random() > 0.5;
}
