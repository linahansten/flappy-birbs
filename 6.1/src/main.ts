import { checkWalls } from "./physics.ts"

const canvas = document.createElement("canvas")
canvas.width = 800
canvas.height = 600
const context = canvas.getContext("2d")!
document.querySelector("#app")!.append(canvas)

const ball = {
  x: 100,
  y: canvas.height / 2,
  radius: 20,
  color: "cyan",
  vy: 0,
}

const gravity = 0.5
const jumpStrength = -5

//makes an empty array and puts the elements inside
let pipes: { x: number; y: number }[] = []

const pipeWidth = 40
const pipeGap = 150
const pipeSpeed = 2
const pipeInterval = 200

let score = 0

const keys: any = {
  space: false,
}

// Event listeners for key presses
window.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    keys.space = true
  }
})
window.addEventListener("keyup", (e) => {
  if (e.key === " ") {
    keys.space = false;
  }
})

function gameLoop() {
  requestAnimationFrame(gameLoop)
  logic()
  context.clearRect(0, 0, canvas.width, canvas.height)
  update()
  render()
}

function logic() {
  checkWalls(ball, canvas.width, canvas.height, keys)
  if (keys.space) {
    ball.vy = jumpStrength
  }

//--------------------------------------------------------------

  // Generate new pipes

  //if pipe array is empty and if the x-coordinate of the right pipe in the pipes array is less or equal to the canvas width minus
  if (pipes.length === 0 || pipes[pipes.length - 1].x <= canvas.width - pipeInterval) {
    const pipeY = Math.random() * (canvas.height - pipeGap * 2) + pipeGap
    //adds new pipe in pipes array
    pipes.push({ x: canvas.width, y: pipeY })
  }

  // Remove pipes that have gone off-screen

  //sees if pipes array is not empty
  if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
    //gets rid of the pipe that is on the left side
    pipes.shift()
    score++
  }

  // Check for collisions with pipes
  for (const pipe of pipes) {
  //checks if the right edge of the ball is to the right of the left edge of the current pipe
  //and if the left edge of the ball is to the left of the right edge of the current pipe
  //if true the ball is within the horizontal boudaries of the current pipe
    if (ball.x + ball.radius > pipe.x && ball.x - ball.radius < pipe.x + pipeWidth) {
//checks if the top edge of the ball is above the top edge of the current pipe or if the bottom edge of the ball is below the bottom edge of the current pipe 
//if either is true it means the ball has collided with the current pipe.
      if (ball.y - ball.radius < pipe.y || ball.y + ball.radius > pipe.y + pipeGap) {

        // Collision with a pipe - game over
        alert("Game Over. Score: " + score)
        resetGame()
        return
      }
    }
  }
}

function update() {
  ball.vy += gravity
  ball.y += ball.vy
  //suggests that the code inside the loop will be applied to each pipe in array pipes
  for (const pipe of pipes) {
    // goes through each pipe in the pipes array and moves them to the left.
    //reduce the x coordinate of each pipe making them look like there moving right to left on the screen
    pipe.x -= pipeSpeed
  }
}

//-----------------------------------------------------------------

function render() {
  drawBall(ball.x, ball.y, ball.radius, ball.color)
  for (const pipe of pipes) {
    drawPipe(pipe.x, pipe.y, pipeWidth, pipeGap)
  }
  drawScore(score)
}

function drawBall(x: number, y: number, radius: number, color: string) {
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fillStyle = color
  context.fill()
}

function drawPipe(x: number, y: number, width: number, gap: number) {
  context.fillStyle = "green"
  context.fillRect(x, 0, width, y)
  context.fillRect(x, y + gap, width, canvas.height - y - gap)
}

function drawScore(score: number) {
  context.fillStyle = "black"
  context.font = "30px Arial"
  context.fillText("Score: " + score, 20, 40)
}

function resetGame() {
  ball.y = canvas.height / 2
  ball.vy = 0
  pipes = []
  score = 0
}

gameLoop()
