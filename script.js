const gameBoard = document.getElementById('game-board');
const ball = document.getElementById('ball');
let ballPosition = { x: 140, y: 0 };
let falling = false;

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
    gameBoard.appendChild(basket);
}

function dropBall() {
    if (!falling) {
        falling = true;
        ballPosition.y = 0;
        ballPosition.x = 140;
        ball.style.left = `${ballPosition.x}px`;
        requestAnimationFrame(animateBall);
    }
}

function animateBall() {
    ballPosition.y += 2;
    ball.style.top = `${ballPosition.y}px`;

    if (ballPosition.y < 360) {
        if (ballPosition.y % 60 === 0) {
            ballPosition.x += Math.random() < 0.5 ? -20 : 20;
            ball.style.left = `${ballPosition.x}px`;
        }
        requestAnimationFrame(animateBall);
    } else {
        falling = false;
    }
}