class Tile {
    constructor(point, type, revealed = false, flag = false) {
        this.point = point;
        this.type = type;
        this.revealed = revealed;
    }

    draw(context, width, height) {
        const x = this.point.x * width;
        const y = this.point.y * height;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        context.fillStyle = this.revealed ? 'rgb(38, 38, 38)' : 'rgb(81, 51, 91)';
        context.fillRect(x, y, width, height);

        context.strokeStyle = 'black';
        context.strokeRect(x, y, width, height);

        if (this.flag) {
            context.fillStyle = 'rgb(149, 93, 167)';
            context.fillRect(x, y, width, height);
        }

        if (this.revealed || gameState == "LOST") {
            context.fillStyle = 'black';

            if (this.type === "mine") {
                context.beginPath();
                context.arc(x + halfWidth, y + halfHeight, width / 3, 0, Math.PI * 2);
                context.fill();
            } else if (this.type === "empty") {
                return;
            } else {
                context.font = "20px Arial";
                context.fillStyle = 'rgb(152, 152, 152)'
                context.fillText(this.type, x + halfWidth - 10, y + halfHeight + 10);
            }
        }
    }
}