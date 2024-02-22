const LEFT_BUTTON = 0;
const MIDDLE_BUTTON = 1;
const RIGHT_BUTTON = 2;

class Board {
    constructor(width, height, mineCount) {
        this.width = width;
        this.height = height;
        this.mineCount = mineCount;
        this.flagCount = 0;
        this.minesLeft = mineCount;
        this.generated = false;
        this.won = false;

        this.tiles = Array.from({ length: width }, (_, x) =>
            Array.from({ length: height }, (_, y) => new Tile(new Point(x, y), 'empty'))
        );
    }

    draw(ctx) {
        const tileWidth = ctx.canvas.width / this.width;
        const tileHeight = ctx.canvas.height / this.height;
        this.tiles.flat().forEach(tile => tile.draw(ctx, tileWidth, tileHeight));
    }

    click(point, button = LEFT_BUTTON) {
        if (!this.generated) {
            this.generateMines(point);
            this.generated = true;
            startTimer();
        }

        const tile = this.tiles[point.x][point.y];

        if (button == MIDDLE_BUTTON) {
            const neighbors = this.getNeighbors(tile.point);

            console.log(tile, neighbors)
        }

        if (button === LEFT_BUTTON && !tile.revealed) {
            if (tile.flag) return;

            tile.revealed = true;

            if (tile.type === "mine") return gameLost();

            const neighbors = this.getNeighborsNotUndefined(tile.point);
            const mineCount = neighbors.filter(n => n.type === "mine").length;

            if (mineCount > 0) {
                tile.type = mineCount;
            } else {
                neighbors.forEach(neighbor => {
                    if (!neighbor.revealed) {
                        this.click(neighbor.point);
                    }
                });
            }
        } else if (button === RIGHT_BUTTON) {
            if (tile.revealed) return;

            tile.flag = !tile.flag;
        }

        if (button === LEFT_BUTTON && tile.revealed) {
            const neighbors = this.getNeighborsNotUndefined(tile.point);
            const flagCount = neighbors.filter(n => n.flag).length;

            if (flagCount === tile.type) {
                neighbors.forEach(neighbor => {
                    if (!neighbor.revealed && !neighbor.flag) {
                        this.click(neighbor.point);
                    }
                });
            }
        }

        this.flagCount = this.tiles.flat().filter(t => t.flag).length;
        this.minesLeft = this.mineCount - this.flagCount;

        this.#checkWin();
    }

    // how to no guess:
    // https://dspace.cvut.cz/bitstream/handle/10467/68632/F3-BP-2017-Cicvarek-Jan-Algorithms%20for%20Minesweeper%20Game%20Grid%20Generation.pdf?sequence=-1&isAllowed=y
    generateMines(excludeMinePoint = null) {
        const flatTiles = this.tiles.flat();
        for (let i = 0; i < this.mineCount; i++) {
            let index = Math.floor(Math.random() * flatTiles.length);
            let tile = flatTiles[index];

            if (excludeMinePoint) {
                const neighbors = this.getNeighborsNotUndefined(excludeMinePoint);

                if (neighbors.includes(tile) || tile.point.x === excludeMinePoint.x || tile.point.y === excludeMinePoint.y) {
                    i--;
                    continue;
                }
            }

            if (tile.type === "mine") {
                i--;
                continue;
            }

            tile.type = "mine";
        }
    }

    #checkWin() {
        if (this.won) return;
        const revealedTiles = this.tiles.flat().filter(t => t.revealed);
        const mines = this.tiles.flat().filter(t => t.type === "mine");

        if (revealedTiles.length + mines.length === this.tiles.flat().length) {
            this.won = true;
            gameWon();
        }
    }

    getNeighbors(point) {
        const { x, y } = point;
        return [
            this.tiles[x - 1]?.[y - 1], // top-left
            this.tiles[x]?.[y - 1], // top
            this.tiles[x + 1]?.[y - 1], // top-right
            this.tiles[x + 1]?.[y], // right
            this.tiles[x + 1]?.[y + 1], // bottom-right
            this.tiles[x]?.[y + 1], // bottom
            this.tiles[x - 1]?.[y + 1], // bottom-left
            this.tiles[x - 1]?.[y], // left
        ]
    }

    getNeighborsNotUndefined(point) {
        return this.getNeighbors(point).filter(n => n);
    }
}
