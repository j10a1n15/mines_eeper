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

        const borderRadius = 5;
        const newX = x - borderRadius;
        const newY = y - borderRadius;
        const newWidth = width + borderRadius * 2;
        const newHeight = height + borderRadius * 2;


        context.fillStyle = this.revealed ? 'rgb(38, 38, 38)' : 'rgb(81, 51, 91)';
        context.beginPath();
        context.moveTo(newX + borderRadius, newY);
        context.lineTo(newX + newWidth - borderRadius, newY);
        context.arcTo(newX + newWidth, newY, newX + newWidth, newY + borderRadius, borderRadius);
        context.lineTo(newX + newWidth, newY + newHeight - borderRadius);
        context.arcTo(newX + newWidth, newY + newHeight, newX + newWidth - borderRadius, newY + newHeight, borderRadius);
        context.lineTo(newX + borderRadius, newY + newHeight);
        context.arcTo(newX, newY + newHeight, newX, newY + newHeight - borderRadius, borderRadius);
        context.lineTo(newX, newY + borderRadius);
        context.arcTo(newX, newY, newX + borderRadius, newY, borderRadius);
        context.fill();

        if (this.flag) {
            context.fillStyle = 'rgb(149, 93, 167)';
            context.fillRect(x, y, width, height);
        }

        if (this.revealed || window.gameState == "LOST") {
            if (this.type === "mine") {
                context.fillStyle = 'black';
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