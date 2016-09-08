/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();
var highScore = 0;

var score;
var snakeX;
var snakeY;
var snake;
var apple;
var input;
var prevInput;

var isPaused;

//All assets I use are imported. All art is my own.
var bg = new Image();
bg.src = "assets/background.png";

var appleIm = new Image();
appleIm.src = "assets/apple.png";

var snakeUp = new Image();
snakeUp.src = "assets/snake-up.png";

var snakeRight = new Image();
snakeRight.src = "assets/snake-right.png";

var snakeDown = new Image();
snakeDown.src = "assets/snake-down.png";

var snakeLeft = new Image();
snakeLeft.src = "assets/snake-left.png";

//Sets all game variable to initial values
function init() {
  snakeX = new Array();
  snakeY = new Array();

  isPaused = false;

  snake = {
    x: Math.floor(backBuffer.width/2),
    y: Math.floor(backBuffer.height/2),
    width: 10,
    height: 10,
    speed: 3,
    image: snakeUp
  }

  apple = {
    x: Math.floor(Math.random()*backBuffer.width),
    y: Math.floor(Math.random()*backBuffer.height),
    width: 15,
    height: 15
  }

  input = {
    up: false,
    down: false,
    left: false,
    right: false 
  }

  prevInput = {
    up: false,
    down: false,
    left: false,
    right: false
  }

  score = 0;
}

init();

window.onkeydown = function(event)
{
  resetInput();
	switch(event.keyCode)
	{
		//UP
		case 38:
		case 87:
			input.up = true;
			break;
		//LEFT
		case 37:
		case 65:
			input.left = true;
			break;
		//DOWN
		case 40:
		case 83:
			input.down = true;
			break;
		//RIGHT
		case 39:
		case 68:
			input.right = true;
			break;
    case 80:
      if(isPaused) isPaused = false;
      else isPaused = true;
    //ANY OTHER KEY
		default:
      if(prevInput.up) input.up = true;
      if(prevInput.down) input.down = true;
      if(prevInput.left) input.left = true;
      if(prevInput.right) input.right = true;
      break;
	}
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  var elapsedTime = newTime - oldTime;
  oldTime = newTime;

if(!isPaused) update(elapsedTime);
  render(elapsedTime);

  frontCtx.clearRect(0, 0, frontBuffer.width, frontBuffer.height);
  // Flip the back buffer
  frontCtx.drawImage(backBuffer, 0, 0);

  // Run the next loop
  window.requestAnimationFrame(loop);
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  //Move the snake
  if(input.up && !prevInput.down) { 
    snake.y -= snake.speed;
    resetPrevInput();
    prevInput.up = true;
    snake.image = snakeUp;
  }
  else if(input.down && !prevInput.up) { 
    snake.y += snake.speed;
    resetPrevInput();
    prevInput.down = true;
    snake.image = snakeDown;
  }
  else if(input.left && !prevInput.right) {
    snake.x -= snake.speed;
    resetPrevInput();
    prevInput.left = true;
    snake.image = snakeLeft;
  }
  else if(input.right && !prevInput.left) {
    snake.x += snake.speed;
    resetPrevInput();
    prevInput.right = true;
    snake.image = snakeRight;
  }
  else if(input.up && prevInput.down) {
    snake.y += snake.speed;
    snake.image = snakeDown;
  }
  else if(input.down && prevInput.up) {
    snake.y -= snake.speed;
    snake.image = snakeUp;
  }
  else if(input.left && prevInput.right) {
    snake.x += snake.speed;
    snake.image = snakeRight;
  }
  else if(input.right && prevInput.left) {
    snake.x -= snake.speed;
    snake.image = snakeLeft;
  }

  //Update the coordinate arrays
  snakeX.unshift(snake.x);
  snakeY.unshift(snake.y);
  if(snakeX.length > 1) {
    snakeX.pop();
    snakeY.pop();
  }

  // Determine if the snake has moved out-of-bounds (offscreen)
  if(snake.x >= backBuffer.width) snake.x=1;
  if(snake.y >= backBuffer.height) snake.y=1;
  if(snake.x <= 0) snake.x = backBuffer.width;
  if(snake.y <= 0) snake.y = backBuffer.height;

  // Determine if the snake has eaten an apple
  if(snake.x < apple.x + apple.width &&
     snake.x + snake.width > apple.x && 
     snake.y < apple.y + apple.height &&
     snake.y + snake.height > apple.y) {
       spawnApple();
       for(i=0; i<10; i++) {
          snakeX.push(snakeX[snakeX.length]);
          snakeY.push(snakeY[snakeY.length]);
       }
       score += 100;
     }
  
  //Update highscore
  if(score > highScore) highScore = score;
  
  // Determine if the snake has eaten its tail
  for(i=12; i<snakeX.length; i++) {
      if(snakeX[0] < snakeX[i] + snake.width &&
      snakeX[0] + snake.width > snakeX[i] && 
      snakeY[0] < snakeY[i] + snake.height &&
      snakeY[0] + snake.height > snakeY[i]) {
        init();
      }
  }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);

  // Draw the game objects into the backBuffer
  backCtx.drawImage(bg,0,0);
  backCtx.fillStyle = "red";
  backCtx.drawImage(appleIm,apple.x,apple.y,15,15);

  backCtx.fillStyle = "green";
  for(i=1; i<snakeX.length; i++) {
    backCtx.fillRect(snakeX[i],snakeY[i],snake.width,snake.height);
  }

  //Logic for orientation of head
  if(snake.image == snakeUp) backCtx.drawImage(snake.image,snake.x-5,snake.y,20,20);
  if(snake.image == snakeDown) backCtx.drawImage(snake.image,snake.x-5,snake.y,20,20);
  if(snake.image == snakeLeft) backCtx.drawImage(snake.image,snake.x,snake.y-5,20,20);
  if(snake.image == snakeRight) backCtx.drawImage(snake.image,snake.x,snake.y-5,20,20);
  
  //Display scores
  backCtx.font = "15px Segoe UI";
  backCtx.fillStyle = "black";
  backCtx.fillText("Score: " + score, 10, 450);
  backCtx.fillText("Highscore: " + highScore, 10, 470);
}

//Resets all input to false
function resetInput() {
  input.up = false;
  input.down = false;
  input.left = false;
  input.right = false;
}

//Resets all previous input to false
function resetPrevInput() {
  prevInput.up = false;
  prevInput.down = false;
  prevInput.left = false;
  prevInput.right = false;
}

//Spawns an apple in a random location. Makes sure it won't collide with the snake or the walls
function spawnApple() {
  newX = Math.floor(Math.random()*backBuffer.width);
  newY = Math.floor(Math.random()*backBuffer.height);
  for(i=0; i<snakeX.length; i++) {
    if(!(newX < snakeX[i] + snake.width &&
      newX + apple.width > snakeX[i] &&
      newY < snakeY[i] + snake.height &&
      newY + apple.height > snakeY[i]) && 
      (newX + apple.width < backBuffer.width &&
       newX > apple.width &&
       newY + apple.height < backBuffer.height &&
       newY > apple.height)) {
        apple.x = newX;
        apple.y = newY;
      }
    else {
      spawnApple();
    }
  }
}

/* Launch the game */
window.requestAnimationFrame(loop);
