const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

const box = 20; // Størrelsen på hver celle i griddet
const canvasWidth = canvas.width; // Canvas bredde
const canvasHeight = canvas.height; // Canvas højde

let snake = [{ x: 5 * box, y: 5 * box }]; // Slangen starter midt i canvas
let direction = null; // Slangens retning
let score = 0;
let gameActive = true; // Game state flag
let food = generateFood(); // Generer mad
let game; // For at gemme interval-variablen

// Lyt efter tastetryk for at styre slangen (for desktop)
document.addEventListener("keydown", function(event) {
  if (gameActive) {
    changeDirection(event);  // Kun reagere på tastetryk under aktivt spil
    event.preventDefault();   // Forhindrer at tastetrykkene påvirker andre elementer
  }
});

// Lyt efter klik på knapperne (for mobil)
document.getElementById("left").addEventListener("click", function() {
  if (gameActive && direction !== "RIGHT") {
    direction = "LEFT";
  }
});

document.getElementById("up").addEventListener("click", function() {
  if (gameActive && direction !== "DOWN") {
    direction = "UP";
  }
});

document.getElementById("right").addEventListener("click", function() {
  if (gameActive && direction !== "LEFT") {
    direction = "RIGHT";
  }
});

document.getElementById("down").addEventListener("click", function() {
  if (gameActive && direction !== "UP") {
    direction = "DOWN";
  }
});

// Tegner canvas, slangen og maden
function draw() {
  // Ryd canvas
  context.fillStyle = "lightgreen";
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  // Tegn slangen
  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = i === 0 ? "darkgreen" : "green"; // Hovedet er mørkere
    context.fillRect(snake[i].x, snake[i].y, box, box);
    context.strokeStyle = "black";
    context.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Tegn mad
  context.fillStyle = "red";
  context.fillRect(food.x, food.y, box, box);

  // Slangens hovedposition
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Bevæg slangen i den valgte retning
  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // Tjek om slangen spiser maden
  if (snakeX === food.x && snakeY === food.y) {
    score++;  // Øg scoren
    food = generateFood(); // Generer ny mad
  } else {
    // Fjern slangens hale, hvis der ikke er spist mad
    snake.pop();
  }

  // Ny position for slangens hoved
  const newHead = { x: snakeX, y: snakeY };

  // Tjek for kollisioner med væggene eller slangen selv
  if (
    snakeX < 0 || 
    snakeX >= canvasWidth || 
    snakeY < 0 || 
    snakeY >= canvasHeight || 
    collision(newHead, snake)
  ) {
    console.log("Spillet sluttes!");
    console.log("Slangens position: ", snakeX, snakeY);
    console.log("Slangen kolliderer med sig selv eller væggen");

    // Vis "Prøv igen"-knappen
    document.getElementById("retryButton").style.display = "block";
    gameActive = false;  // Stop spillet
    clearInterval(game);  // Stop game loop
    return;
  }

  // Tjek om score har nået vindergrænsen (5)
  if (score >= 20) {
    alert("Den er ved Morthens plads!");
    gameActive = false; // Stop spillet
    document.getElementById("retryButton").style.display = "block"; // Vis "Prøv igen"
    clearInterval(game); // Stop game loop
    return;
  }

  // Tilføj den nye position som slangens hoved
  snake.unshift(newHead);
}

// Genererer mad med bufferzone på 1 celle fra væggene
function generateFood() {
  return {
    x: Math.floor(Math.random() * (canvasWidth / box - 2) + 1) * box,
    y: Math.floor(Math.random() * (canvasHeight / box - 2) + 1) * box,
  };
}

// Ændrer retningen baseret på tastetryk
function changeDirection(event) {
  if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";  // Venstre pil
  else if (event.keyCode === 38 && direction !== "DOWN") direction = "UP"; // Op pil
  else if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT"; // Højre pil
  else if (event.keyCode === 40 && direction !== "UP") direction = "DOWN"; // Ned pil
}

// Tjekker om slangen kolliderer med sig selv
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

// Restart spillet, når brugeren trykker på "Prøv igen"
function restartGame() {
  // Skjul "Prøv igen"-knappen
  document.getElementById("retryButton").style.display = "none";

  // Nulstil spillets tilstand
  score = 0;
  snake = [{ x: 5 * box, y: 5 * box }];
  direction = null;
  gameActive = true;
  food = generateFood();

  // Start game loop på ny
  game = setInterval(draw, 200);
}

// Start spillet med en hastighed på 200ms
game = setInterval(draw, 200);
