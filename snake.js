/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();

var snakeX = new Array();
var snakeY = new Array();

var snake = {
  x: Math.floor(backBuffer.width/2),
  y: Math.floor(backBuffer.height/2),
  width: 10,
  height: 10,
  speed: 3
}

var apple = {
  x: Math.floor(Math.random()*backBuffer.width),
  y: Math.floor(Math.random()*backBuffer.height),
  width: 10,
  height: 10
}

var input = {
  up: false,
  down: false,
  left: false,
  right: false 
}

var prevInput = {
  up: false,
  down: false,
  left: false,
  right: false
}

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

  update(elapsedTime);
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
  }
  else if(input.down && !prevInput.up) { 
    snake.y += snake.speed;
    resetPrevInput();
    prevInput.down = true;
  }
  else if(input.left && !prevInput.right) {
    snake.x -= snake.speed;
    resetPrevInput();
    prevInput.left = true;
  }
  else if(input.right && !prevInput.left) {
    snake.x += snake.speed;
    resetPrevInput();
    prevInput.right = true;
  }
  else if(input.up && prevInput.down) snake.y += snake.speed;
  else if(input.down && prevInput.up) snake.y -= snake.speed;
  else if(input.left && prevInput.right) snake.x += snake.speed;
  else if(input.right && prevInput.left) snake.x -= snake.speed;

  // Determine if the snake has moved out-of-bounds (offscreen)
  if(snake.x >= backBuffer.width) snake.x=1;
  if(snake.y >= backBuffer.height) snake.y=1;
  if(snake.x <= 0) snake.x = backBuffer.width;
  if(snake.y <= 0) snake.y = backBuffer.height;

  snakeX.unshift(snake.x);
  snakeY.unshift(snake.y);
  if(snakeX.length > 1) {
    snakeX.pop();
    snakeY.pop();
  }

  // Determine if the snake has eaten an apple
  if(snake.x < apple.x + apple.width &&
     snake.x + snake.width > apple.x && 
     snake.y < apple.y + apple.height &&
     snake.y + snake.height > apple.y) {
       apple.x = Math.floor(Math.random()*backBuffer.width);
       apple.y = Math.floor(Math.random()*backBuffer.height);
       for(i=0; i<5; i++) {
          snakeX.push(snakeX[snakeX.length]);
          snakeY.push(snakeY[snakeY.length]);
       }
     }

  // Determine if the snake has eaten its tail
  /*for(i=6; i<snakeX.length; i++) {
      if(snakeX[0] < snakeX[i] + snake.width &&
      snakeX[0] + snake.width > snakeX[i] && 
      snakeY[0] < snakeY[i] + snake.height &&
      snakeY[0] + snake.height > snakeY[i]) {
          resetInput();
          resetPrevInput();
      }
  } */
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

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
  backCtx.fillStyle = "red";
  backCtx.fillRect(apple.x,apple.y,apple.width,apple.height);

  backCtx.fillStyle = "green";
  for(i=0; i<snakeX.length; i++) {
    backCtx.fillRect(snakeX[i],snakeY[i],apple.width,apple.height);
  }
}

function resetInput() {
  input.up = false;
  input.down = false;
  input.left = false;
  input.right = false;
}

function resetPrevInput() {
  prevInput.up = false;
  prevInput.down = false;
  prevInput.left = false;
  prevInput.right = false;
}

/* Launch the game */
window.requestAnimationFrame(loop);
