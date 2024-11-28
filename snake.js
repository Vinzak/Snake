const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Spilvariabler
const box = 20; // Størrelsen på hver "blok" i spillet
let snake = [{ x: 9 * box, y: 9 * box }]; // Startposition
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
let score = 0;
let direction;

// Tegn spilleområdet
function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Tegn slangen
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#0f0' : '#0a0';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Tegn maden
  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x, food.y, box, box);

  // Flyt slangen
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === 'LEFT') snakeX -= box;
  if (direction === 'UP') snakeY -= box;
  if (direction === 'RIGHT') snakeX += box;
  if (direction === 'DOWN') snakeY += box;

  // Når slangen spiser maden
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };
    if (score === 10) {
      alert('Du har vundet! Slangen har spist 10 genstande!');
      clearInterval(game); // Stop spillet
    }
  } else {
    snake.pop(); // Fjern den sidste del af slangen
  }

  // Tilføj ny position til hovedet af slangen
  let newHead = { x: snakeX, y: snakeY };

  // Spillet slutter, hvis slangen rammer sig selv eller væggen
  if (
    snakeX < 0 || snakeX >= canvas.width || 
    snakeY < 0 || snakeY >= canvas.height || 
    collision(newHead, snake)
  ) {
    alert('Spillet er slut! Du tabte!');
    clearInterval(game);
  }

  snake.unshift(newHead); // Tilføj den nye hovedposition
}

// Tjek for kollision
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

// Kontrollér slangen
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

// Tilføj event listeners til knapperne
document.getElementById('up').addEventListener('click', () => {
  if (direction !== 'DOWN') direction = 'UP';
});
document.getElementById('down').addEventListener('click', () => {
  if (direction !== 'UP') direction = 'DOWN';
});
document.getElementById('left').addEventListener('click', () => {
  if (direction !== 'RIGHT') direction = 'LEFT';
});
document.getElementById('right').addEventListener('click', () => {
  if (direction !== 'LEFT') direction = 'RIGHT';
});

// Swipe kontrol til mobil
let startX, startY;

canvas.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', (e) => {
  let endX = e.changedTouches[0].clientX;
  let endY = e.changedTouches[0].clientY;

  let diffX = endX - startX;
  let diffY = endY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0 && direction !== 'LEFT') direction = 'RIGHT';
    else if (diffX < 0 && direction !== 'RIGHT') direction = 'LEFT';
  } else {
    if (diffY > 0 && direction !== 'UP') direction = 'DOWN';
    else if (diffY < 0 && direction !== 'DOWN') direction = 'UP';
  }
});

// Start spillet
let game = setInterval(draw, 100);
