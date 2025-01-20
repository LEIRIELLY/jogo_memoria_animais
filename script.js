const startButton = document.getElementById('startButton');
const newGameButton = document.getElementById('newGameButton');
const progressBar = document.querySelector('.progress');
const resultMessage = document.getElementById('result-message');
const gameBoard = document.querySelector('.memory-game');
const overlay = document.querySelector('.overlay');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let timer;
let time = 0;
let matchCount = 0;

const animals = [
    { name: 'gato', img: 'Gato.jpeg' },
    { name: 'cachorro', img: 'cachorro.png' },
    { name: 'elefante', img: 'elefante.png' },
    { name: 'leao', img: 'leao.png' },
    { name: 'tigre', img: 'tigre.png' },
    { name: 'macaco', img: 'macaco.png' }
];

function startGame() {
    time = 0;
    matchCount = 0;
    resultMessage.textContent = '';
    progressBar.style.width = '0';
    startButton.style.display = 'none';
    newGameButton.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    overlay.style.display = 'none';
    timer = setInterval(updateProgressBar, 1000);
    setupBoard();
}

function updateProgressBar() {
    time++;
    const progressPercentage = (time / 60) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    if (time >= 60) {
        clearInterval(timer);
        endGame(false);
    }
}

function setupBoard() {
    gameBoard.innerHTML = '';
    
    const shuffledAnimals = [...animals, ...animals].sort(() => Math.random() - 0.5);
    shuffledAnimals.forEach(animal => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.animal = animal.name;
        card.innerHTML = `
            <img class="front-face" src="${animal.img}" alt="${animal.name}">
            <img class="back-face" src="back.jpeg" alt="Verso">
        `;
        gameBoard.appendChild(card);
    });

    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => card.addEventListener('click', flipCard));
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // Primeiro clique
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Segundo clique
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.animal === secondCard.dataset.animal;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    setTimeout(() => {
        firstCard.style.visibility = 'hidden';
        secondCard.style.visibility = 'hidden';

        matchCount++;
        if (matchCount === document.querySelectorAll('.memory-card').length / 2) {
            endGame(true);
        }

        resetBoard();
    }, 1000);
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

function endGame(won) {
    clearInterval(timer);
    if (won) {
        resultMessage.textContent = 'Parabéns, você conseguiu!';
        resultMessage.style.fontSize = '2.5em'; // Aumente o tamanho da fonte
    } else {
        resultMessage.textContent = 'Você perdeu, tente novamente.';
    }
    newGameButton.classList.remove('hidden');
    newGameButton.style.display = 'block';
    newGameButton.addEventListener('click', startGame);
}

startButton.addEventListener('click', startGame);
