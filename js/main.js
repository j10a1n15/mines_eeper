document.addEventListener('DOMContentLoaded', function () {
    let gameState = 'START';
    const TILE_SIZE = 40;

    let WIDTH = localStorage.getItem('width') || 30;
    let HEIGHT = localStorage.getItem('height') || 20;
    let MINES = localStorage.getItem('mines') || 100;

    const gameModes = [
        { value: 'easy', label: 'Easy 10x10 - 10', width: 10, height: 10, mines: 10 },
        { value: 'medium', label: 'Medium 15x15 - 40', width: 15, height: 15, mines: 40 },
        { value: 'hard', label: 'Hard 20x20 - 80', width: 20, height: 20, mines: 80 },
        { value: 'vahvl', label: 'The Vahvl Size™️', width: 32, height: 18, mines: 150 },
        { value: 'custom', label: 'Custom' }
    ];

    let lastMouseLocation = { clientX: 0, clientY: 0 };

    const startScreen = document.getElementById("startScreen");
    const lostScreen = document.getElementById("loseScreen");
    const wonScreen = document.getElementById("winScreen");
    const mineCountElement = document.getElementById('mineCount');
    const gameModeSelect = document.getElementById('gameMode');

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let board = new Board(WIDTH, HEIGHT, MINES);
    canvas.height = HEIGHT * TILE_SIZE;
    canvas.width = WIDTH * TILE_SIZE;

    gameModes.forEach(mode => {
        const option = document.createElement('option');
        option.value = mode.value;
        option.text = mode.label;
        gameModeSelect.add(option);
    });

    gameModeSelect.value = 'easy';

    openStartMenu();

    animate();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        board.draw(ctx);

        mineCountElement.innerText = board.minesLeft;

        window.gameState = gameState;
        window.openStartMenu = openStartMenu;
        window.startGame = startGame;
        window.gameLost = gameLost;
        window.gameWon = gameWon;

        requestAnimationFrame(animate);
    }

    canvas.addEventListener('mouseup', handleCanvasClick);

    canvas.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'Escape') {
            openStartMenu();
            stopTimer(false);
            gameState = 'START';
        }
        if (e.key === 'r' || e.key === ' ') {
            startGame();
        }
        if (e.key === 'x') {
            // Reveal
            handleCanvasClick(lastMouseLocation);
        }
        if (e.key === 'c') {
            // Flag
            handleCanvasClick({ ...lastMouseLocation, button: 2 });
        }
    });

    document.getElementById("hamburger").addEventListener('click', function () {
        const hamburgerMenu = document.getElementById("hamburgerMenu")
        hamburgerMenu.style.display = hamburgerMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('gameMode').addEventListener('change', function () {
        openStartMenu();
    });

    document.addEventListener('mousemove', function (e) {
        lastMouseLocation.clientX = e.clientX;
        lastMouseLocation.clientY = e.clientY;
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

        document.getElementById('customWidth').value = WIDTH;
        document.getElementById('customHeight').value = HEIGHT;
        document.getElementById('customMines').value = MINES;


        const gameMode = document.getElementById('gameMode').value;

        if (gameMode === 'custom') {
            document.getElementById('customInputs').style.display = 'block';
        } else {
            document.getElementById('customInputs').style.display = 'none';
        }
    }

    function startGame() {
        const selectedGameMode = gameModes.find(mode => mode.value === gameModeSelect.value);
        let width, height, mines;

        if (selectedGameMode.value === 'custom') {
            width = parseInt(document.getElementById('customWidth').value);
            height = parseInt(document.getElementById('customHeight').value);
            mines = parseInt(document.getElementById('customMines').value);
        } else {
            width = selectedGameMode.width;
            height = selectedGameMode.height;
            mines = selectedGameMode.mines;
        }

        time = 0;

        WIDTH = width;
        HEIGHT = height;
        MINES = mines;

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
        timeLostElement.innerText = time.toFixed(2) + "s";

        const personalBest = localStorage.getItem('pb');
        personalBestElement.innerText = personalBest ? personalBest + "s" : "No Personal Best Yet";
    }

    function gameWon() {
        stopTimer();
        wonScreen.style.display = "block";
        gameState = "WON";

        const timeWonElement = document.getElementById("timeTaken");
        const pbElement = document.getElementById("personalBestWon");

        timeWonElement.innerText = time.toFixed(2) + "s";
        pbElement.innerText = (localStorage.getItem('pb') || time.toFixed(2)) + "s";
    }
});
