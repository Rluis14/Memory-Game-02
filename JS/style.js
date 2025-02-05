document.addEventListener('DOMContentLoaded', () => {
    const fruit = ["🍇", "🍉", "🍊", "🍋", "🍌", "🍍", "🍎", "🍏", "🍏", "🍎", "🍍", "🍌", "🍋", "🍊",  "🍉", "🍇"];
    let shuffledFruit = sessionStorage.getItem('shuffledFruit')
        ? JSON.parse(sessionStorage.getItem('shuffledFruit'))
        : fruit.sort(() => Math.random() > 0.5 ? 2 : -1);
    sessionStorage.setItem('shuffledFruit', JSON.stringify(shuffledFruit));

    let moves = sessionStorage.getItem('moves') ? parseInt(sessionStorage.getItem('moves')) : 0;
    let totalMoves = localStorage.getItem('totalMoves') ? parseInt(localStorage.getItem('totalMoves')) : 0;
    let timer = sessionStorage.getItem('timer') ? parseInt(sessionStorage.getItem('timer')) : 0;
    let isTimerStarted = false;
    let timerInterval = null;

    const timerDisplay = document.getElementById("timer");
    const gameContainer = document.querySelector('.game');
    const movesDisplay = document.getElementById("moves");
    
    const startTimer = () => {
        if (!isTimerStarted) {
            isTimerStarted = true;
            timerInterval = setInterval(() => {
                timer++;
                timerDisplay.textContent = timer;
                sessionStorage.setItem('timer', timer);
            }, 1000);
        }
    };
    
    const stopTimer = () => {
        clearInterval(timerInterval);
        timerInterval = null;
    };

    const updateMoves = () => {
        moves++;
        totalMoves++;
        movesDisplay.textContent = moves;
        sessionStorage.setItem('moves', moves);
        localStorage.setItem('totalMoves', totalMoves);
    };

    movesDisplay.textContent = moves;
    timerDisplay.textContent = timer;

    for (let i = 0; i < shuffledFruit.length; i++) {
        let box = document.createElement('div');
        box.className = 'item';
        box.innerHTML = shuffledFruit[i];

        if (sessionStorage.getItem(`box${i}`) === 'matched') {
            box.classList.add('boxMatch');
        }

        box.onclick = function () {
            startTimer();
            this.classList.add('boxOpen');
            setTimeout(() => {
                let openBoxes = document.querySelectorAll('.boxOpen');
                if (openBoxes.length > 1) {
                    if (openBoxes[0].innerHTML === openBoxes[1].innerHTML) {
                        openBoxes[0].classList.add('boxMatch');
                        openBoxes[1].classList.add('boxMatch');

                        sessionStorage.setItem(`box${Array.from(gameContainer.children).indexOf(openBoxes[0])}`, 'matched');
                        sessionStorage.setItem(`box${Array.from(gameContainer.children).indexOf(openBoxes[1])}`, 'matched');

                        document.getElementById('match-sound').play();
                        openBoxes[0].classList.remove('boxOpen');
                        openBoxes[1].classList.remove('boxOpen');

                        if (document.querySelectorAll('.boxMatch').length === fruit.length) {
                            alert('You Won! Game Over');
                            document.getElementById('win-sound').play();
                            stopTimer();
                        }
                    } else {
                        document.getElementById('fail-sound').play();
                        openBoxes[0].classList.remove('boxOpen');
                        openBoxes[1].classList.remove('boxOpen');
                    }
                    updateMoves();
                }
            }, 900);
        };
        gameContainer.appendChild(box);
    }

    document.querySelector('.restart').addEventListener('click', () => {
        sessionStorage.clear();
        window.location.reload();
    });
});
