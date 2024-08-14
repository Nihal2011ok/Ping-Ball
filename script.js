const gameBoard = document.getElementById('game-board');
const dropButton = document.getElementById('drop-button');
const scoreElement = document.getElementById('score-value');
const levelElement = document.getElementById('level-value');
const ballsLeftElement = document.getElementById('balls-value');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const finalLevelElement = document.getElementById('final-level');
const restartButton = document.getElementById('restart-button');

let score = 0;
let level = 1;
let ballsLeft = 5;
let activeBalls = [];
let powerUps = [];
let obstacles = [];

const basketValues = [1, 2, 3, 2, 1];

function initializeGame() {
    clearBoard();
    createPegs();
    createBaskets();
    createPowerUps();
    createObstacles();
}

function clearBoard() {
    gameBoard.innerHTML = '';
}

function createPegs() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
            const peg = document.createElement('div');
            peg.className = 'peg';
            peg.style.left = `${50 + j * 70}px`;
            peg.style.top = `${100 + i * 60}px`;
            gameBoard.appendChild(peg);
        }
    }
}

function createBaskets() {
    for (let i = 0; i < 5; i++) {
        const basket = document.createElement('div');
        basket.className = 'basket';
        basket.style.left = `${i * 60}px`;
        basket.textContent = basketValues[i];
        gameBoard.appendChild(basket);
    }
}

function createPowerUps() {
    for (let i = 0; i < level; i++) {
        const powerUp = document.createElement('div');
        powerUp.className = 'power-up';
        powerUp.textContent = '2x';
        powerUp.style.left = `${Math.random() * 260}px`;
        powerUp.style.top = `${Math.random() * 300 + 50}px`;
        gameBoard.appendChild(powerUp);
        powerUps.push(powerUp);
    }
}

function createObstacles() {
    for (let i = 0; i < level; i++) {
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        obstacle.style.left = `${Math.random() * 260}px`;
        obstacle.style.top = `${Math.random() * 300 + 50}px`;
        gameBoard.appendChild(obstacle);
        obstacles.push(obstacle);
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
        y: 0,
        multiplier: 1
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

    checkCollisions(ball);

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

function checkCollisions(ball) {
    powerUps.forEach((powerUp, index) => {
        if (isColliding(ball, powerUp)) {
            ball.multiplier = 2;
            gameBoard.removeChild(powerUp);
            powerUps.splice(index, 1);
        }
    });

    obstacles.forEach((obstacle) => {
        if (isColliding(ball, obstacle)) {
            ball.y = 360; 
        }
    });
}

function isColliding(ball, element) {
    const ballRect = ball.element.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    return !(ballRect.right < elementRect.left || 
             ballRect.left > elementRect.right || 
             ballRect.bottom < elementRect.top || 
             ballRect.top > elementRect.bottom);
}

function updateScore(ball) {
    const basketIndex = Math.floor(ball.x / 60);
    const points = basketValues[basketIndex] * ball.multiplier;
    score += points;
    scoreElement.textContent = score;
}

function checkGameOver() {
    if (ballsLeft === 0 && activeBalls.length === 0) {
        if (score > level * 10) {
            levelUp();
        } else {
            endGame();
        }
    }
}

function levelUp() {
    level++;
    ballsLeft = 5;
    levelElement.textContent = level;
    ballsLeftElement.textContent = ballsLeft;
    dropButton.disabled = false;
    initializeGame();
}

function endGame() {
    gameOverElement.classList.remove('hidden');
    finalScoreElement.textContent = score;
    finalLevelElement.textContent = level;
}

function restartGame() {
    score = 0;
    level = 1;
    ballsLeft = 5;
    activeBalls = [];
    powerUps = [];
    obstacles = [];
    scoreElement.textContent = score;
    levelElement.textContent = level;
    ballsLeftElement.textContent = ballsLeft;
    gameOverElement.classList.add('hidden');
    dropButton.disabled = false;
    initializeGame();
}

initializeGame();
dropButton.addEventListener('click', dropBall);
restartButton.addEventListener('click', restartGame);