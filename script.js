const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const scoreBoard = document.getElementById("scoreBoard");

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.5;
    if (canvas.width > 800) canvas.width = 800;
    if (canvas.height > 400) canvas.height = 400;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const paddleWidth = 10, paddleHeight = canvas.height / 5;
let paddleLeftY = canvas.height / 2 - paddleHeight / 2;
let paddleRightY = canvas.height / 2 - paddleHeight / 2;
const paddleSpeed = 5;
let ballX, ballY, ballSpeedX, ballSpeedY;
let gameRunning = false;
let scoreLeft = 0, scoreRight = 0;
const winningScore = 5;

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 4;
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 4;
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function updateScore() {
    scoreBoard.textContent = `${scoreLeft} - ${scoreRight}`;
}

function checkWin() {
    if (scoreLeft >= winningScore) {
        alert("Player Left Wins!");
        gameRunning = false;
    } else if (scoreRight >= winningScore) {
        alert("Player Right Wins!");
        gameRunning = false;
    }
}

function update() {
    if (!gameRunning) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= canvas.height) {
        ballSpeedY *= -1;
    }

    if (ballX <= paddleWidth && ballY >= paddleLeftY && ballY <= paddleLeftY + paddleHeight) {
        ballSpeedX *= -1;
    }
    if (ballX >= canvas.width - paddleWidth && ballY >= paddleRightY && ballY <= paddleRightY + paddleHeight) {
        ballSpeedX *= -1;
    }

    if (ballX < 0) {
        scoreRight++;
        updateScore();
        checkWin();
        resetBall();
    } else if (ballX > canvas.width) {
        scoreLeft++;
        updateScore();
        checkWin();
        resetBall();
    }
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, "black");
    drawRect(0, paddleLeftY, paddleWidth, paddleHeight, "white");
    drawRect(canvas.width - paddleWidth, paddleRightY, paddleWidth, paddleHeight, "white");
    drawBall(ballX, ballY, 10, "white");
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "w" && paddleLeftY > 0) paddleLeftY -= paddleSpeed;
    if (event.key === "s" && paddleLeftY < canvas.height - paddleHeight) paddleLeftY += paddleSpeed;
    if (event.key === "ArrowUp" && paddleRightY > 0) paddleRightY -= paddleSpeed;
    if (event.key === "ArrowDown" && paddleRightY < canvas.height - paddleHeight) paddleRightY += paddleSpeed;
});

startButton.addEventListener("click", () => {
    if (!gameRunning) {
        gameRunning = true;
        scoreLeft = 0;
        scoreRight = 0;
        updateScore();
        resetBall();
    }
});

resetButton.addEventListener("click", () => {
    gameRunning = false;
    scoreLeft = 0;
    scoreRight = 0;
    updateScore();
    resetBall();
});

gameLoop();