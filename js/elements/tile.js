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

        if (this.flag) {
            const flagColor = '#5c3c61';
            if (settings.showAdvancedFlag) {
                // Draw flagpole holder
                context.fillStyle = flagColor;
                context.fillRect(x + 5, y + height * 0.90, width * 0.5, height * 0.8);

                // Draw flagpole
                context.fillStyle = flagColor;
                context.fillRect(x + width * 0.33, y + height * 0.05, width * 0.10, height * 0.85);

                const newY = y + height / 1.75;

                // Draw flag
                context.fillStyle = flagColor;
                context.beginPath();
                context.moveTo(x + width / 2.4, newY);
                context.lineTo(x + width / 2.4, newY - height / 2);
                context.lineTo(x + width / 1.1, newY - height / 4);
                context.closePath();
                context.fill();
            } else {
                context.fillStyle = flagColor;
                context.fillRect(x, y, width, height);
            }
        }

        if (settings.showTileBorders) {
            context.strokeStyle = '#000000';
            context.strokeRect(x, y, width, height);
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
                context.fillStyle = '#8e7492';
                context.fillText(this.type, x + halfWidth - 10, y + halfHeight + 10);
            }
        }
    }
}