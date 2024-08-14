const gameBoard = document.getElementById('game-board');
const ball = document.getElementById('ball');
const dropButton = document.getElementById('drop-button');
const scoreElement = document.getElementById('score-value');

let ballPosition = { x: 140, y: 0 };
let falling = false;
let score = 0;


for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {
        const peg = document.createElement('div');
        peg.className = 'peg';
        peg.style.left = `${50 + j * 70}px`;
        peg.style.top = `${100 + i * 60}px`;
        gameBoard.appendChild(peg);
    }
}


const basketValues = [1, 2, 3, 2, 1];
for (let i = 0; i < 5; i++) {
    const basket = document.createElement('div');
    basket.className = 'basket';
    basket.style.left = `${i * 60}px`;
    basket.textContent = basketValues[i];
    gameBoard.appendChild(basket);
}

function dropBall() {
    if (!falling) {
        falling = true;
        ballPosition.y = 0;
        ballPosition.x = 140;
        ball.style.left = `${ballPosition.x}px`;
        ball.style.top = `${ballPosition.y}px`;
        dropButton.disabled = true;
        requestAnimationFrame(animateBall);
    }
}

function animateBall() {
    ballPosition.y += 3;
    ball.style.top = `${ballPosition.y}px`;

    if (ballPosition.y < 360) {
        if (ballPosition.y % 60 === 0) {
            ballPosition.x += Math.random() < 0.5 ? -20 : 20;
            ball.style.left = `${ballPosition.x}px`;
        }
        requestAnimationFrame(animateBall);
    } else {
        falling = false;
        dropButton.disabled = false;
        updateScore();
    }
}

function updateScore() {
    const basketIndex = Math.floor(ballPosition.x / 60);
    const points = basketValues[basketIndex];
    score += points;
    scoreElement.textContent = score;
}

dropButton.addEventListener('click', dropBall);