document.addEventListener('DOMContentLoaded', function () {
    let gameState = 'START';
    const TILE_SIZE = 40;

    let settings = JSON.parse(localStorage.getItem('settings')) || {};
    if (!settings.hasOwnProperty('showAdvancedFlag')) {
        settings.showAdvancedFlag = false;
        updateSettings(settings);
    }

    let WIDTH = parseInt(localStorage.getItem('width')) || 30;
    let HEIGHT = parseInt(localStorage.getItem('height')) || 20;
    let MINES = parseInt(localStorage.getItem('mines')) || 100;

    const gameModes = [
        { value: 'easy', label: 'Easy 10x10 - 10', width: 10, height: 10, mines: 10 },
        { value: 'medium', label: 'Medium 15x15 - 40', width: 15, height: 15, mines: 40 },
        { value: 'hard', label: 'Hard 20x20 - 80', width: 20, height: 20, mines: 80 },
        { value: 'vahvl', label: 'The correct option', width: 32, height: 18, mines: 150 },
        { value: 'custom', label: 'Custom' }
    ];

    let lastMouseLocation = { clientX: 0, clientY: 0 };
    let board = new Board(WIDTH, HEIGHT, MINES);

    const startScreen = document.getElementById("startScreen");
    const lostScreen = document.getElementById("loseScreen");
    const wonScreen = document.getElementById("winScreen");
    const mineCountElement = document.getElementById('mineCount');
    const gameModeSelect = document.getElementById('gameMode');
    const canvas = document.getElementById('canvas');
    const canvasBlur = document.getElementById('blur');
    const ctx = canvas.getContext('2d');

    initializeGameModes();
    openStartMenu();
    animate();

    function initializeGameModes() {
        gameModes.forEach(mode => {
            const option = document.createElement('option');
            option.value = mode.value;
            option.text = mode.label;
            gameModeSelect.add(option);
        });
        gameModeSelect.value = 'easy';
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        board.draw(ctx);
        mineCountElement.innerText = board.minesLeft;
        window.gameState = gameState;
        window.openStartMenu = openStartMenu;
        window.startGame = startGame;
        window.gameLost = gameLost;
        window.gameWon = gameWon;
        window.settings = settings;
        requestAnimationFrame(animate);
    }

    canvas.addEventListener('mouseup', handleCanvasClick);
    canvas.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    document.addEventListener('keyup', function (e) {
        switch (e.key) {
            case 'Escape':
                openStartMenu();
                stopTimer(false);
                gameState = 'START';
                break;
            case 'r':
            case ' ':
                startGame();
                break;
            case 'c':
                handleCanvasClick(lastMouseLocation);
                break;
            case 'x':
                handleCanvasClick({ ...lastMouseLocation, button: 2 });
                break;
            default:
                break;
        }
    });

    document.getElementById("hamburger").addEventListener('click', toggleHamburgerMenu);

    document.getElementById('gameMode').addEventListener('change', openStartMenu);

    document.addEventListener('mousemove', function (e) {
        lastMouseLocation.clientX = e.clientX;
        lastMouseLocation.clientY = e.clientY;
    });

    const showAdvancedFlagCheckbox = document.getElementById('showAdvancedFlag');
    showAdvancedFlagCheckbox.checked = JSON.parse(localStorage.getItem('settings')).showAdvancedFlag || false;

    showAdvancedFlagCheckbox.addEventListener('change', function () {
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        settings.showAdvancedFlag = this.checked;
        updateSettings(settings);
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
        canvasBlur.style.display = "block";

        document.getElementById('customWidth').value = WIDTH;
        document.getElementById('customHeight').value = HEIGHT;
        document.getElementById('customMines').value = MINES;

        const gameMode = document.getElementById('gameMode').value;
        document.getElementById('customInputs').style.display = (gameMode === 'custom') ? 'block' : 'none';
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
        canvasBlur.style.width = `${canvas.width}px`;
        canvasBlur.style.height = `${canvas.height}px`;

        board = new Board(width, height, mines);
        gameState = 'PLAYING';
        startScreen.style.display = 'none';
        lostScreen.style.display = 'none';
        wonScreen.style.display = 'none';
        canvasBlur.style.display = 'none';
    }

    function gameLost() {
        stopTimer(false);
        gameState = "LOST";
        lostScreen.style.display = "block";
        canvasBlur.style.display = "block";

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
        canvasBlur.style.display = "block";
        gameState = "WON";

        const timeWonElement = document.getElementById("timeTaken");
        const pbElement = document.getElementById("personalBestWon");

        timeWonElement.innerText = time.toFixed(2) + "s";
        pbElement.innerText = (localStorage.getItem('pb') || time.toFixed(2)) + "s";
    }

    function toggleHamburgerMenu() {
        const hamburgerMenu = document.getElementById("hamburgerMenu");
        hamburgerMenu.style.display = (hamburgerMenu.style.display === 'block') ? 'none' : 'block';
    }

    function updateSettings(newSettings) {
        localStorage.setItem('settings', JSON.stringify(newSettings));
        settings = newSettings;
    }
});
