// Game logic moved from game.html
const cards = [
    { customHTML: `<img src='images/noun-book-3512750.png' alt='Book icon' style='width:3.7rem; height:3.7rem;'>`, name: 'book' },
    { customHTML: `<img src='images/noun-cake-8111796.png' alt='Cake icon' style='width:3.7rem; height:3.7rem;'>`, name: 'cake' },
    { customHTML: `<img src='images/noun-plane-8161837.png' alt='Plane icon' style='width:3.7rem; height:3.7rem;'>`, name: 'plane' },
    { customHTML: `<img src='images/noun-paint-pallette-975007.png' alt='Palette icon' style='width:3.7rem; height:3.7rem;'>`, name: 'palette' },
    { customHTML: `<img src='images/noun-music-8080190.png' alt='Music icon' style='width:3.7rem; height:3.7rem;'>`, name: 'music' },
    { customHTML: `<img src='images/noun-accounting-7985046.png' alt='Calculator icon' style='width:3.7rem; height:3.7rem;'>`, name: 'calculator' },
        // Card suits icon (2x2 grid: club, spade, diamond, heart)
        { customHTML: `<img src='images/noun-cards-6874364.png' alt='Cards icon' style='width:3.7rem; height:3.7rem;'>`, name: 'cards' },
    // Lake Superior (custom SVG outline)
        { customHTML: `<img src='images/noun-lake-superior-369753.png' alt='Lake Superior icon' style='width:3.7rem; height:3.7rem;'>`, name: 'lake' }
    ];

let moves = 0;
let pairs = 0;
let timeLeft = 120;
let timer = null;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let gameStarted = false;
let gameOver = false;

function initializeGame() {
    const gameBoard = document.querySelector('.memory-game');
    const cardPairs = [...cards, ...cards];
    cardPairs.sort(() => Math.random() - 0.5);
    gameBoard.innerHTML = cardPairs.map((card, index) => {
        let backContent = card.customHTML ? card.customHTML : `<i class='fa-solid ${card.icon}' style='color:#222'></i>`;
        return `
            <div class="memory-card" data-card="${card.name}">
                <div class="front-face">
                    <i class="fa-solid fa-question" style="color: #c5a572;"></i>
                </div>
                <div class="back-face">
                    ${backContent}
                </div>
            </div>
        `;
    }).join('');
    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', flipCard);
    });
}

function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timer = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft <= 0) {
                clearInterval(timer);
                showGameLost();
            }
        }, 1000);
    }
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.querySelector('.timer').textContent = timeString;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    startTimer();
    this.classList.add('flip');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    checkForMatch();
    updateMoves();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.card === secondCard.dataset.card;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    pairs++;
    updatePairs();
    checkGameCompletion();
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function updateMoves() {
    moves++;
    document.querySelector('.moves').textContent = moves;
}

function updatePairs() {
    document.querySelector('.pairs').textContent = pairs;
}

function checkGameCompletion() {
    if (pairs === 8) {
        clearInterval(timer);
        showGameCompleted();
    }
}

function showGameCompleted() {
    const overlay = document.querySelector('.overlay');
    const gameCompleted = document.querySelector('.game-completed');
    const finalMoves = document.querySelector('.final-moves');
    const finalTime = document.querySelector('.final-time');
    finalMoves.textContent = moves;
    finalTime.textContent = document.querySelector('.timer').textContent;
    // Change label to 'Time Remaining' in win message
    const timeLabel = gameCompleted.querySelector('p:nth-child(3)');
    if (timeLabel) {
        timeLabel.innerHTML = `Time Remaining: <span class="final-time">${document.querySelector('.timer').textContent}</span>`;
    }
    overlay.classList.add('show');
    gameCompleted.classList.add('show');
    confettiBurst();
}

function resetGame() {
    moves = 0;
    pairs = 0;
    timeLeft = 120;
    gameStarted = false;
    gameOver = false;
    clearInterval(timer);
    document.querySelector('.moves').textContent = '0';
    document.querySelector('.pairs').textContent = '0';
    document.querySelector('.timer').textContent = '2:00';
    document.querySelector('.overlay').classList.remove('show');
    document.querySelector('.game-completed').classList.remove('show');
    document.querySelector('.game-lost')?.remove();
    resetBoard();
    initializeGame();
}

document.querySelectorAll('.reset-button').forEach(button => {
    button.addEventListener('click', resetGame);
});
document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('try-again')) {
        resetGame();
    }
});

document.addEventListener('DOMContentLoaded', initializeGame);

function showGameLost() {
    gameOver = true;
    const overlay = document.querySelector('.overlay');
    overlay.classList.add('show');
    document.querySelector('.game-lost')?.remove();
    const lostDiv = document.createElement('div');
    lostDiv.className = 'game-lost';
    lostDiv.style.position = 'fixed';
    lostDiv.style.top = '50%';
    lostDiv.style.left = '50%';
    lostDiv.style.transform = 'translate(-50%, -50%)';
    lostDiv.style.background = 'white';
    lostDiv.style.padding = '2rem';
    lostDiv.style.borderRadius = '15px';
    lostDiv.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    lostDiv.style.textAlign = 'center';
    lostDiv.style.zIndex = '1000';
    lostDiv.innerHTML = `
        <h2>Times Up!</h2>
        <p>Moves: ${moves}</p>
        <button class="try-again reset-button">Try Again</button>
    `;
    document.body.appendChild(lostDiv);
}

// Confetti effect for game completion
function confettiBurst() {
    for (let i = 0; i < 60; i++) {
        let conf = document.createElement('div');
        conf.style.position = 'fixed';
        conf.style.left = Math.random()*100 + 'vw';
        conf.style.top = '-30px';
        conf.style.width = '10px';
        conf.style.height = '10px';
        conf.style.borderRadius = '50%';
        conf.style.background = `hsl(${Math.random()*50+40},70%,60%)`;
        conf.style.zIndex = 9999;
        conf.style.opacity = 0.8;
        conf.style.pointerEvents = 'none';
        document.body.appendChild(conf);
        let fall = conf.animate([
            { transform: 'translateY(0)' },
            { transform: `translateY(${window.innerHeight+60}px)` }
        ], {
            duration: 1800 + Math.random()*800,
            easing: 'ease-in',
            fill: 'forwards'
        });
        fall.onfinish = () => conf.remove();
    }
}
