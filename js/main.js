document.addEventListener('DOMContentLoaded', function () {
    let gameState = 'START';
    const TILE_SIZE = 40;

    const WIDTH = localStorage.getItem('width') || 30;
    const HEIGHT = localStorage.getItem('height') || 20;
    const MINES = localStorage.getItem('mines') || 100;

    const startScreen = document.getElementById("startScreen");
    const lostScreen = document.getElementById("loseScreen");
    const wonScreen = document.getElementById("winScreen");

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let board = new Board(WIDTH, HEIGHT, MINES);
    canvas.height = HEIGHT * TILE_SIZE;
    canvas.width = WIDTH * TILE_SIZE;

    openStartMenu();

    animate();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        board.draw(ctx);

        document.getElementById('mineCount').innerText = board.minesLeft;

        window.gameState = gameState;
        window.openStartMenu = openStartMenu;
        window.startGame = startGame;
        window.gameLost = gameLost;
        window.gameWon = gameWon;
        window.startTimer = startTimer;

        requestAnimationFrame(animate);
    }

    canvas.addEventListener('mouseup', handleCanvasClick);

    canvas.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'Escape') {
            openStartMenu();
        }
        if (e.key === 'r' || e.key === ' ') {
            startGame();
        }
    });


    document.getElementById("hamburger").addEventListener('click', function () {
        const hamburgerMenu = document.getElementById("hamburgerMenu")
        hamburgerMenu.style.display = hamburgerMenu.style.display === 'block' ? 'none' : 'block';
    });

    function handleCanvasClick(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const i = Math.floor(x / TILE_SIZE);
        const j = Math.floor(y / TILE_SIZE);

        if (gameState === "PLAYING") board.click(new Point(i, j), e.button);
    }

    function openStartMenu() {
        startScreen.style.display = 'block';
        lostScreen.style.display = 'none';
        wonScreen.style.display = 'none';

        document.getElementById('width').value = WIDTH;
        document.getElementById('height').value = HEIGHT;
        document.getElementById('mines').value = MINES;
    }

    function startGame() {
        const width = document.getElementById('width').value;
        const height = document.getElementById('height').value;
        const mines = document.getElementById('mines').value;

        if (!isValidInput(width, height, mines)) {
            // TODO: Display appropriate warnings
            return;
        }

        time = 0;

        localStorage.setItem('width', width);
        localStorage.setItem('height', height);
        localStorage.setItem('mines', mines);

        canvas.height = height * TILE_SIZE;
        canvas.width = width * TILE_SIZE;

        board = new Board(width, height, mines);
        gameState = 'PLAYING';
        startScreen.style.display = 'none';
        lostScreen.style.display = 'none';
        wonScreen.style.display = 'none';
    }

    function gameLost() {
        stopTimer(false);
        gameState = "LOST";
        lostScreen.style.display = "block";

        const minesLostElement = document.getElementById("minesLost");
        const timeLostElement = document.getElementById("timeLost");
        const personalBestElement = document.getElementById("personalBestLost");

        minesLostElement.innerText = `${board.minesLeft}/${board.mineCount}`;
        timeLostElement.innerText = time.toFixed(2);

        const personalBest = localStorage.getItem('pb');
        personalBestElement.innerText = personalBest ? personalBest : "No Personal Best Yet";
    }

    function gameWon() {
        stopTimer();
        wonScreen.style.display = "block";
        gameState = "WON";

        const timeWonElement = document.getElementById("timeTaken");
        const pbElement = document.getElementById("personalBestWon");

        timeWonElement.innerText = time.toFixed(2);
        console.log(localStorage.getItem('pb') || time.toFixed(2))
        pbElement.innerText = localStorage.getItem('pb') || time.toFixed(2);
    }

    /*
    * Timer
    */
    const timeElement = document.getElementById('time');

    if (localStorage.getItem('pb')) {
        document.getElementById('pb').innerText = localStorage.getItem('pb');
    }

    let time = 0;
    let timerInterval;
    function startTimer() {
        timerInterval = setInterval(() => {
            time += 0.01;
            timeElement.innerText = time.toFixed(2);
        }, 10);
    }

    function stopTimer(won = true) {
        clearInterval(timerInterval);

        if (!localStorage.getItem('pb') || time < localStorage.getItem('pb') && won) {
            document.getElementById('pb').innerText = time.toFixed(2);
            localStorage.setItem('pb', time.toFixed(2));
        }
    }

    /*
    * Input Validation
    */
    function isValidInput(width, height, mines) {
        const warningWidth = document.getElementById('warningWidth');
        const warningHeight = document.getElementById('warningHeight');
        const warningMine = document.getElementById('warningMine');

        const parsedWidth = parseInt(width);
        const parsedHeight = parseInt(height);
        const parsedMines = parseInt(mines);

        const maxTileWidth = window.innerWidth / TILE_SIZE;
        const maxTileHeight = window.innerHeight / TILE_SIZE;
        const totalSpaces = parsedWidth * parsedHeight;

        warningWidth.style.display = parsedWidth > maxTileWidth ? 'block' : 'none';
        warningHeight.style.display = parsedHeight > maxTileHeight ? 'block' : 'none';
        warningMine.style.display = parsedMines > totalSpaces - 1 ? 'block' : 'none';

        return parsedWidth > 0 && parsedHeight > 0 && parsedMines >= 0 && parsedMines < totalSpaces;
    }
});
