const gameBoard = document.getElementById('game-board');
const dropButton = document.getElementById('drop-button');
const scoreElement = document.getElementById('score-value');
const ballsLeftElement = document.getElementById('balls-value');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let score = 0;
let ballsLeft = 5;
let activeBalls = [];
const basketValues = [1, 2, 3, 2, 1];

function initializeGame() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
            const peg = document.createElement('div');
            peg.className = 'peg';
            peg.style.left = `${50 + j * 70}px`;
            peg.style.top = `${100 + i * 60}px`;
            gameBoard.appendChild(peg);
        }
    }

    for (let i = 0; i < 5; i++) {
        const basket = document.createElement('div');
        basket.className = 'basket';
        basket.style.left = `${i * 60}px`;
        basket.textContent = basketValues[i];
        gameBoard.appendChild(basket);
    }
}

function createBall() {
    const ball = document.createElement('div');
    ball.className = 'ball';
    ball.style.left = '140px';
    ball.style.top = '0px';
    gameBoard.appendChild(ball);
    return {
        element: ball,
        x: 140,
        y: 0
    };
}

function dropBall() {
    if (ballsLeft > 0 && activeBalls.length < 3) {
        const newBall = createBall();
        activeBalls.push(newBall);
        ballsLeft--;
        ballsLeftElement.textContent = ballsLeft;
        if (ballsLeft === 0) {
            dropButton.disabled = true;
        }
        requestAnimationFrame(() => animateBall(newBall));
    }
}

function animateBall(ball) {
    ball.y += 3;
    ball.element.style.top = `${ball.y}px`;

    if (ball.y < 360) {
        if (ball.y % 60 === 0) {
            ball.x += Math.random() < 0.5 ? -20 : 20;
            ball.element.style.left = `${ball.x}px`;
        }
        requestAnimationFrame(() => animateBall(ball));
    } else {
        updateScore(ball);
        gameBoard.removeChild(ball.element);
        activeBalls = activeBalls.filter(b => b !== ball);
        checkGameOver();
    }
}

function updateScore(ball) {
    const basketIndex = Math.floor(ball.x / 60);
    const points = basketValues[basketIndex];
    score += points;
    scoreElement.textContent = score;
}

function checkGameOver() {
    if (ballsLeft === 0 && activeBalls.length === 0) {
        gameOverElement.classList.remove('hidden');
        finalScoreElement.textContent = score;
    }
}

function restartGame() {
    score = 0;
    ballsLeft = 5;
    activeBalls = [];
    scoreElement.textContent = score;
    ballsLeftElement.textContent = ballsLeft;
    gameOverElement.classList.add('hidden');
    dropButton.disabled = false;
}

initializeGame();
dropButton.addEventListener('click', dropBall);
restartButton.addEventListener('click', restartGame);