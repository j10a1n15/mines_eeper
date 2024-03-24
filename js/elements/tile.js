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

        context.fillStyle = this.revealed ? '#262626' : '#51335b';
        context.fillRect(x, y, width, height);

        context.strokeStyle = '#000000';
        context.strokeRect(x, y, width, height);

        if (this.flag) {
            context.fillStyle = '#955da7';
            context.fillRect(x, y, width, height);
        }

        if (this.revealed || window.gameState == "LOST") {
            context.fillStyle = '#000000';

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