class Tile {
    constructor(point, type, revealed = false, flag = false) {
        this.point = point;
        this.type = type;
        this.revealed = revealed;
        this.flag = flag;

        this.roundedCorners = {
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false
        }
    }

    draw(context, width, height, board) {
        const x = this.point.x * width;
        const y = this.point.y * height;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        this.#checkRoundedCorners(board)

        context.fillStyle = this.revealed ? 'rgb(38, 38, 38)' : 'rgb(81, 51, 91)';
        context.fillRect(x, y, width, height);

        //context.strokeStyle = 'black';
        //context.strokeRect(x, y, width, height);


        const borderRadius = 10;
        // Draw rounded corners for the outer edges
        this.#drawRoundedCorner(context, x, y, borderRadius, 'top-left');
        this.#drawRoundedCorner(context, x + width, y, borderRadius, 'top-right');
        this.#drawRoundedCorner(context, x, y + height, borderRadius, 'bottom-left');
        this.#drawRoundedCorner(context, x + width, y + height, borderRadius, 'bottom-right');


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

    #drawRoundedCorner(context, x, y, radius, corner) {
        context.fillStyle = 'red'//'rgb(38, 38, 38)';
        context.beginPath();

        if (corner === 'top-left') {
            if (this.roundedCorners.topLeft) {
                context.moveTo(x, y);
                context.arc(x - radius, y - radius, radius, 0, Math.PI / 2);
            }
        } else if (corner === 'top-right') {
            if (this.roundedCorners.topRight) {
                context.moveTo(x, y);
                context.arc(x + radius, y - radius, radius, Math.PI / 2, Math.PI);
            }
        } else if (corner === 'bottom-left') {
            if (this.roundedCorners.bottomLeft) {
                context.moveTo(x, y);
                context.arc(x - radius, y + radius, radius, Math.PI / 2 * 3, Math.PI * 2);
            }
        } else if (corner === 'bottom-right') {
            if (this.roundedCorners.bottomRight) {
                context.moveTo(x, y);
                context.arc(x - radius, y + radius, radius, Math.PI, Math.PI / 2 * 3);
            }
        }

        context.closePath();
        context.fill();
    }

    #checkRoundedCorners(board) {
        const neighbors = board.getNeighbors(this.point);

        if (!this.revealed) return;

        for (const neighbor of neighbors) {
            if (neighbor === undefined) continue;
            if (neighbor.revealed) continue;

            if (neighbor.point.x === this.point.x - 1 && neighbor.point.y === this.point.y - 1) {
                this.roundedCorners.topLeft = true;
            } else if (neighbor.point.x === this.point.x + 1 && neighbor.point.y === this.point.y - 1) {
                this.roundedCorners.topRight = true;
            } else if (neighbor.point.x === this.point.x - 1 && neighbor.point.y === this.point.y + 1) {
                this.roundedCorners.bottomLeft = true;
            } else if (neighbor.point.x === this.point.x + 1 && neighbor.point.y === this.point.y + 1) {
                this.roundedCorners.bottomRight = true;
            }
        }
    }
}