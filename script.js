const BOARD_BORDER_COLOR = "black";
const BOARD_BACKGROUD = "pink";
const SNAKE_COLOR = "yellow";
const SNAKE_BORDER_COLOR = "darkblue";

const snake = {
  body: [
    { x: 200, y: 200 }, // the first element is the head
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 },
  ],
  dx: 10, // Horizontal velocity
  dy: 0, // Vertical velocity
  changing_direction: false,
  getNextPosition: (snake) => {
    return { x: snake.body[0].x + snake.dx, y: snake.body[0].y + snake.dy };
  },
};

let score = 0;

const food = { x: 0, y: 0 };

// Get the canvas element
const snakeboard = document.getElementById("snakeboard");
// Return a two dimensional drawing context
const snakeboard_ctx = snakeboard.getContext("2d");
// Start game
main();

gen_food();

document.addEventListener("keydown", change_direction);

// main function called repeatedly to keep the game running
function main() {
  if (has_game_ended()) return;

  snake.changing_direction = false;
  setTimeout(function onTick() {
    const nextPosition = snake.getNextPosition(snake);
    clear_board();
    drawFood();
    move_snake();
    drawSnake();
    // Repeat
    main();
  }, 100);
}

// draw a border around the canvas
function clear_board() {
  //  Select the colour to fill the drawing
  snakeboard_ctx.fillStyle = BOARD_BACKGROUD;
  //  Select the colour for the border of the canvas
  snakeboard_ctx.strokestyle = BOARD_BORDER_COLOR;
  // Draw a "filled" rectangle to cover the entire canvas
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  // Draw a "border" around the entire canvas
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

// Draw the snake on the canvas
function drawSnake() {
  // Draw each part
  snake.body.forEach(drawSnakePart);
}

function drawFood() {
  snakeboard_ctx.fillStyle = "lightgreen";
  snakeboard_ctx.strokestyle = "darkgreen";
  snakeboard_ctx.fillRect(food.x, food.y, 10, 10);
  snakeboard_ctx.strokeRect(food.x, food.y, 10, 10);
}

// Draw one snake part
function drawSnakePart(snakePart) {
  // Set the colour of the snake part
  snakeboard_ctx.fillStyle = SNAKE_COLOR;
  // Set the border colour of the snake part
  snakeboard_ctx.strokestyle = SNAKE_BORDER_COLOR;
  // Draw a "filled" rectangle to represent the snake part at the coordinates
  // the part is located
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  // Draw a border around the snake part
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function has_game_ended() {
  for (let i = 4; i < snake.body.length; i++) {
    if (
      snake.body[i].x === snake.body[0].x &&
      snake.body[i].y === snake.body[0].y
    )
      return true;
  }
  const hitLeftWall = snake.body[0].x < 0;
  const hitRightWall = snake.body[0].x > snakeboard.width - 10;
  const hitToptWall = snake.body[0].y < 0;
  const hitBottomWall = snake.body[0].y > snakeboard.height - 10;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function random_food(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function gen_food() {
  // Generate a random number the food x-coordinate
  food.x = random_food(0, snakeboard.width - 10);
  // Generate a random number for the food y-coordinate
  food.y = random_food(0, snakeboard.height - 10);
  // if the new food location is where the snake currently is, generate a new food location
  snake.body.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food.x && part.y == food.y;
    if (has_eaten) gen_food();
  });
}

function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  // Prevent the snake from reversing

  if (snake.changing_direction) return;
  snake.changing_direction = true;
  const keyPressed = event.keyCode;
  const goingUp = snake.dy === -10;
  const goingDown = snake.dy === 10;
  const goingRight = snake.dx === 10;
  const goingLeft = snake.dx === -10;
  if (keyPressed === LEFT_KEY && !goingRight) {
    snake.dx = -10;
    snake.dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    snake.dx = 0;
    snake.dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    snake.dx = 10;
    snake.dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    snake.dx = 0;
    snake.dy = 10;
  }
}

function move_snake() {
  // Create the new Snake's head
  const headNewPosition = {
    x: snake.body[0].x + snake.dx,
    y: snake.body[0].y + snake.dy,
  };
  // Add the new head to the beginning of snake body
  snake.body.unshift(headNewPosition);
  const has_eaten_food =
    snake.body[0].x === food.x && snake.body[0].y === food.y;
  if (has_eaten_food) {
    // Increase score
    score += 10;
    // Display score on screen
    document.getElementById("score").innerHTML = score;
    // Generate new food location
    gen_food();
  } else {
    // Remove the last part of snake body
    snake.body.pop();
  }
}
