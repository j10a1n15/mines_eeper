class Board {
    constructor(width, height, bomb_count) {
        this.width = width;
        this.height = height;
        this.bomb_count = bomb_count;

        this.tiles = [];

        // Pregenerate the empty tiles
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.tiles.push(new Tile(new Point(x, y), 'empty'));
            }
        }

        this.generated = false;
    }

    draw(ctx) {
        for (let tile of this.tiles) {
            tile.draw(ctx, ctx.canvas.width / this.width, ctx.canvas.height / this.height);
        }
    }

    click(point, button = 0) {
        if (!this.generated) {
            this.generateBombs(point);
            this.generated = true;
        }

        const tile = this.tiles.find(t => t.point.x == point.x && t.point.y == point.y);

        if (button == 0 && !tile.revealed) {
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

        if (button == 0 && tile.revealed) {
            const neighbors = this.#getNeighbors(tile.point);

            const flag_count = neighbors.filter(n => n.flag).length;

            if (flag_count == tile.type) {
                for (let neighbor of neighbors) {
                    if (!neighbor.revealed && !neighbor.flag) {
                        this.click(neighbor.point);
                    }
                }
            }
        }
    }

    generateBombs(excludeBombPoint = null) {
        for (let i = 0; i < this.bomb_count; i++) {
            let index = Math.floor(Math.random() * this.tiles.length);
            let tile = this.tiles[index];

            // no mine on and around exclude bomb point
            if (excludeBombPoint) {
                const neighbors = this.#getNeighbors(excludeBombPoint);

                if (neighbors.includes(tile) || tile.point.x === excludeBombPoint.x || tile.point.y === excludeBombPoint.y) {
                    i--;
                    continue;
                }
            }

            if (tile.type == "bomb") {
                i--;
                continue;
            }

            tile.type = "bomb";
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
