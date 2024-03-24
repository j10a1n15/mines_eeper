class Tile {
    constructor(point, type, revealed = false, flag = false) {
        this.point = point;
        this.type = type;
        this.revealed = revealed;
        this.flag = flag;
    }

    draw(context, width, height) {
        const x = this.point.x * width;
        const y = this.point.y * height;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        context.fillStyle = this.revealed ? '#19091b' : '#301934';
        context.fillRect(x, y, width, height);

        context.strokeStyle = 'black';
        context.strokeRect(x, y, width, height);

        if (this.flag) {
            context.fillStyle = '#5c3c61';
            context.fillRect(x, y, width, height);
        }

        if (this.revealed || window.gameState == "LOST") {
            context.fillStyle = 'black';

            if (this.type === "mine") {
                context.beginPath();
                context.arc(x + halfWidth, y + halfHeight, width / 3, 0, Math.PI * 2);
                context.fill();
            } else if (this.type === "empty") {
                return;
            } else {
                context.font = "20px Arial";
                context.fillStyle = '#8e7492';
                context.fillText(this.type, x + halfWidth - 10, y + halfHeight + 10);
            }
        }
    }
}