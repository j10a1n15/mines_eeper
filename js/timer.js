document.addEventListener('DOMContentLoaded', function () {
    const timeElement = document.getElementById('timeBar');
    const pbElement = document.getElementById('pbBar');

    let timerInterval;

    window.time = 0;

    if (localStorage.getItem('pb')) {
        pbElement.innerText = localStorage.getItem('pb') + "s";
    }

    window.startTimer = function () {
        timerInterval = setInterval(() => {
            time += 0.01;
            timeElement.innerText = time.toFixed(2) + "s";
        }, 10);
    }

    window.stopTimer = function (won = true) {
        clearInterval(timerInterval);

        if ((!localStorage.getItem('pb') || time < localStorage.getItem('pb')) && won) {
            pbElement.innerText = time.toFixed(2) + "s";
            localStorage.setItem('pb', time.toFixed(2));
        }
    }

    window.resetPb = function () {
        localStorage.removeItem('pb');
        pbElement.innerText = "No Personal Best Yet";
    }
});