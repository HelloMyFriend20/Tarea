const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const scoreBoard = document.getElementById("scoreBoard");

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;
    if (canvas.width > 800) canvas.width = 800;
    if (canvas.height > 500) canvas.height = 500;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const paddleWidth = 20, paddleHeight = canvas.height / 4;
let paddleLeftY = canvas.height / 2 - paddleHeight / 2;
let paddleRightY = canvas.height / 2 - paddleHeight / 2;
const paddleSpeed = 10;
let ballX, ballY, ballSpeedX, ballSpeedY;
let gameRunning = false;
let scoreLeft = 0, scoreRight = 0;
const winningScore = 5;

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5;
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 5;
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
        alert("¡Jugador izquierdo gana!");
        gameRunning = false;
    } else if (scoreRight >= winningScore) {
        alert("¡Jugador derecho gana!");
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
    drawBall(ballX, ballY, 15, "white");
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Controles táctiles
canvas.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchY = touch.clientY - rect.top;

    if (touch.clientX < rect.width / 2) {
        // Mueve la paleta izquierda
        paddleLeftY = touchY - paddleHeight / 2;
        if (paddleLeftY < 0) paddleLeftY = 0;
        if (paddleLeftY > canvas.height - paddleHeight) paddleLeftY = canvas.height - paddleHeight;
    } else {
        // Mueve la paleta derecha
        paddleRightY = touchY - paddleHeight / 2;
        if (paddleRightY < 0) paddleRightY = 0;
        if (paddleRightY > canvas.height - paddleHeight) paddleRightY = canvas.height - paddleHeight;
    }
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
