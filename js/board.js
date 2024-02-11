class Board {
    constructor(width, height, bomb_count) {
        this.width = width;
        this.height = height;
        this.bomb_count = bomb_count;

        this.tiles = [];
    }

    draw(ctx) {
        for (let tile of this.tiles) {
            tile.draw(ctx, ctx.canvas.width / this.width, ctx.canvas.height / this.height);
        }
    }

    click(point, button = 0) {
        const tile = this.tiles.find(t => t.point.x == point.x && t.point.y == point.y);

        if (button == 0) {
            tile.revealed = true;
            tile.flag = false;

            if (tile.type == "bomb") return alert("L");

            const neighbors = this.#getNeighbors(tile.point);

            const bomb_count = neighbors.filter(n => n.type == "bomb").length;

            if (bomb_count > 0) {
                tile.type = bomb_count;
            } else {
                for (let neighbor of neighbors) {
                    if (!neighbor.revealed) {
                        this.click(neighbor.point);
                    }
                }
            }
        } else if (button == 2) {
            if (tile.revealed) return;

            tile.flag = !tile.flag;
        }
    }

    generate() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.tiles.push(new Tile(new Point(x, y), 'empty'));
            }
        }

        this.#generateBombs();
    }

    #generateBombs() {
        for (let i = 0; i < this.bomb_count; i++) {
            let index = Math.floor(Math.random() * this.tiles.length);
            if (this.tiles[index].type == 'bomb') {
                i--;
            } else {
                this.tiles[index].type = 'bomb';
            }
        }
    }

    #getNeighbors(point) {
        return this.tiles.filter(t =>
            t.point.x >= point.x - 1 && t.point.x <= point.x + 1 &&
            t.point.y >= point.y - 1 && t.point.y <= point.y + 1 &&
            !(t.point.x === point.x && t.point.y === point.y)
        );
    }
}