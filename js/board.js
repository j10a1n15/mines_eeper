class Board {
    constructor(width, height, mine_count) {
        this.width = width;
        this.height = height;
        this.mine_count = mine_count;

        this.tiles = [];

        // Pregenerate the empty tiles
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.tiles.push(new Tile(new Point(x, y), 'empty'));
            }
        }

        this.flag_count = 0
        this.mines_left = mine_count

        this.generated = false;
        this.won = false;
    }

    draw(ctx) {
        for (let tile of this.tiles) {
            tile.draw(ctx, ctx.canvas.width / this.width, ctx.canvas.height / this.height);
        }
    }

    click(point, button = 0) {
        if (!this.generated) {
            this.generateMines(point);
            this.generated = true;
            startTimer();
        }

        const tile = this.tiles.find(t => t.point.x == point.x && t.point.y == point.y);

        if (button == 0 && !tile.revealed) {
            if (tile.flag) return;

            tile.revealed = true;

            if (tile.type == "mine") return gameLost();

            const neighbors = this.#getNeighbors(tile.point);

            const mine_count = neighbors.filter(n => n.type == "mine").length;

            if (mine_count > 0) {
                tile.type = mine_count;
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

        this.flag_count = this.tiles.filter(t => t.flag).length;
        this.mines_left = this.mine_count - this.flag_count

        this.#checkWin();
    }

    generateMines(excludeMinePoint = null) {
        for (let i = 0; i < this.mine_count; i++) {
            let index = Math.floor(Math.random() * this.tiles.length);
            let tile = this.tiles[index];

            // no mine on and around exclude mine point
            if (excludeMinePoint) {
                const neighbors = this.#getNeighbors(excludeMinePoint);

                if (neighbors.includes(tile) || tile.point.x === excludeMinePoint.x || tile.point.y === excludeMinePoint.y) {
                    i--;
                    continue;
                }
            }

            if (tile.type == "mine") {
                i--;
                continue;
            }

            tile.type = "mine";
        }
    }

    #checkWin() {
        if (this.won) return;
        const revealedTiles = this.tiles.filter(t => t.revealed);
        const mines = this.tiles.filter(t => t.type == "mine");

        if (revealedTiles.length + mines.length == this.tiles.length) {
            this.won = true;
            stopTimer();
            alert("You won!\nGG!");
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
