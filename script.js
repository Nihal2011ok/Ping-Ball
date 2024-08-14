const gameBoard = document.getElementById('game-board');
const dropButton = document.getElementById('drop-button');
const shopButton = document.getElementById('shop-button');
const scoreElement = document.getElementById('score-value');
const levelElement = document.getElementById('level-value');
const ballsLeftElement = document.getElementById('balls-value');
const coinsElement = document.getElementById('coins-value');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const finalLevelElement = document.getElementById('final-level');
const restartButton = document.getElementById('restart-button');
const shopElement = document.getElementById('shop');
const closeShopButton = document.getElementById('close-shop');

let score = 0;
let level = 1;
let ballsLeft = 5;
let coins = 0;
let activeBalls = [];
let powerUps = [];
let obstacles = [];
let selectedBallType = 'normal';
let scoreMultiplier = 1;

const basketValues = [1, 2, 3, 2, 1];

let achievements = [
    { id: 'score100', name: 'Century', description: 'Score 100 points in a single game', achieved: false },
    { id: 'level5', name: 'High Climber', description: 'Reach level 5', achieved: false },
    { id: 'lucky10', name: 'Fortune Favors the Bold', description: 'Use the lucky ball 10 times', achieved: false }
];

let dailyChallenge = {
    description: 'Score 200 points using only normal balls',
    active: false,
    progress: 0,
    goal: 200
};

let unlockedBalls = ['normal', 'heavy', 'lucky'];
function initializeGame() {
    clearBoard();
    createPegs();
    createBaskets();
    createPowerUps();
    createObstacles();
    updateDisplay();
    updateAchievements();
    generateDailyChallenge();
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

function updateAchievements() {
    const achievementList = document.getElementById('achievement-list');
    achievementList.innerHTML = '';
    achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.textContent = `${achievement.name}: ${achievement.description} ${achievement.achieved ? '✅' : ''}`;
        achievementList.appendChild(li);
    });
}

function checkAchievements() {
    if (score >= 100 && !achievements[0].achieved) {
        achievements[0].achieved = true;
        showNotification('Achievement unlocked: Century!');
    }
    if (level >= 5 && !achievements[1].achieved) {
        achievements[1].achieved = true;
        showNotification('Achievement unlocked: High Climber!');
    }
}

function generateDailyChallenge() {
    const challenges = [
        { description: 'Score 200 points using only normal balls', goal: 200 },
        { description: 'Reach level 5 without using power-ups', goal: 5 },
        { description: 'Collect 50 coins in a single game', goal: 50 }
    ];
    dailyChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    dailyChallenge.active = false;
    dailyChallenge.progress = 0;
    document.getElementById('challenge-description').textContent = dailyChallenge.description;
}

function startDailyChallenge() {
    dailyChallenge.active = true;
    restartGame();
    showNotification('Daily Challenge started!');
}

function updateDailyChallengeProgress() {
    if (dailyChallenge.active) {
        switch (dailyChallenge.description) {
            case 'Score 200 points using only normal balls':
                if (selectedBallType === 'normal') {
                    dailyChallenge.progress = score;
                }
                break;
            case 'Reach level 5 without using power-ups':
                dailyChallenge.progress = level;
                break;
            case 'Collect 50 coins in a single game':
                dailyChallenge.progress = coins;
                break;
        }
        if (dailyChallenge.progress >= dailyChallenge.goal) {
            showNotification('Daily Challenge completed!');
            dailyChallenge.active = false;
        }
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    setTimeout(() => notification.classList.add('hidden'), 3000);
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play();
}

function createBall() {
    const ball = document.createElement('div');
    ball.className = `ball ${selectedBallType}`;
    ball.style.left = '140px';
    ball.style.top = '0px';
    if (selectedBallType === 'ghost' && !unlockedBalls.includes('ghost')) {
        selectedBallType = 'normal';
    }
    gameBoard.appendChild(ball);
    return {
        element: ball,
        x: 140,
        y: 0,
        type: selectedBallType,
        multiplier: 1
    };
}

function dropBall() {
    if (ballsLeft > 0 && activeBalls.length < 3) {
        const newBall = createBall();
        activeBalls.push(newBall);
        ballsLeft--;
        updateDisplay();
        if (ballsLeft === 0) {
            dropButton.disabled = true;
        }
        requestAnimationFrame(() => animateBall(newBall));
    }
}

function animateBall(ball) {
    let speed = ball.type === 'heavy' ? 4 : 3;
    ball.y += speed;
    ball.element.style.top = `${ball.y}px`;

    checkCollisions(ball);
   if (ball.y % 60 === 0) {
        playSound('bounce-sound');
    }
    if (ball.y < 360) {
        if (ball.y % 60 === 0) {
            let deviation = ball.type === 'heavy' ? 10 : 20;
            ball.x += Math.random() < 0.5 ? -deviation : deviation;
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
            showEffect('2x', ball.x, ball.y);
        }
    });

    obstacles.forEach((obstacle) => {
        if (isColliding(ball, obstacle)) {
            if (ball.type !== 'heavy') {
                ball.y = 360; // End ball movement
                showEffect('Blocked!', ball.x, ball.y);
            } else {
                showEffect('Smash!', ball.x, ball.y);
            }
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
    let points = basketValues[basketIndex] * ball.multiplier * scoreMultiplier;
    if (ball.type === 'lucky') {
        points *= 2;
    }
    score += points;
    coins += Math.floor(points / 10);
    updateDisplay();
    showEffect(`+${points}`, ball.x, 360);
    playSound('coin-sound');
    checkAchievements();
    updateDailyChallengeProgress();
}

function showEffect(text, x, y) {
    const effect = document.createElement('div');
    effect.className = 'effect';
    effect.textContent = text;
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    gameBoard.appendChild(effect);
    setTimeout(() => gameBoard.removeChild(effect), 1000);
}

function checkGameOver() {
    if (ballsLeft === 0 && activeBalls.length === 0) {
        if (score > level * 15) {
            levelUp();
        } else {
            endGame();
        }
    }
}

function levelUp() {
    level++;
    ballsLeft = 5;
    updateDisplay();
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
    coins = 0;
    activeBalls = [];
    powerUps = [];
    obstacles = [];
    scoreMultiplier = 1;
    updateDisplay();
    gameOverElement.classList.add('hidden');
    dropButton.disabled = false;
    initializeGame();
}

function updateDisplay() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
    ballsLeftElement.textContent = ballsLeft;
    coinsElement.textContent = coins;
}

function openShop() {
    shopElement.classList.remove('hidden');
}

function closeShop() {
    shopElement.classList.add('hidden');
}

function buyShopItem(item) {
    switch(item) {
        case 'extraBall':
            if (coins >= 10) {
                coins -= 10;
                ballsLeft++;
                updateDisplay();
                dropButton.disabled = false;
            }
            break;
        case 'multiplier':
            if (coins >= 20) {
                coins -= 20;
                scoreMultiplier *= 1.5;
                updateDisplay();
            }
        case 'ghostBall':
            if (coins >= 50 && !unlockedBalls.includes('ghost')) {
                coins -= 50;
                unlockedBalls.push('ghost');
                updateDisplay();
                showNotification('Ghost Ball unlocked!');
            }
            break;
    }
}

document.getElementById('achievements-button').addEventListener('click', () => {
    document.getElementById('achievements').classList.remove('hidden');
});

document.getElementById('close-achievements').addEventListener('click', () => {
    document.getElementById('achievements').classList.add('hidden');
});

document.getElementById('daily-challenge-button').addEventListener('click', () => {
    document.getElementById('daily-challenge').classList.remove('hidden');
});

document.getElementById('close-daily-challenge').addEventListener('click', () => {
    document.getElementById('daily-challenge').classList.add('hidden');
});

document.getElementById('start-challenge').addEventListener('click', () => {
    startDailyChallenge();
    document.getElementById('daily-challenge').classList.add('hidden');
});


initializeGame();
dropButton.addEventListener('click', dropBall);
restartButton.addEventListener('click', restartGame);
shopButton.addEventListener('click', openShop);
closeShopButton.addEventListener('click', closeShop);

document.querySelectorAll('.ball-type').forEach(button => {
    button.addEventListener('click', (e) => {
        selectedBallType = e.target.dataset.type;
    });
});

document.querySelectorAll('.shop-item').forEach(button => {
    button.addEventListener('click', (e) => {
        buyShopItem(e.target.dataset.item);
    });
});