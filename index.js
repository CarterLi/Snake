var Direction;
(function (Direction) {
    Direction[Direction["Left"] = 0] = "Left";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Up"] = 2] = "Up";
    Direction[Direction["Down"] = 3] = "Down";
})(Direction || (Direction = {}));
class SnakeBody {
    constructor(snake, x, y) {
        this.snake = snake;
        this.x = x;
        this.y = y;
    }
    draw(color = 'black') {
        const ctx = this.snake.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x * (this.snake.bodyWidth + 1) - this.snake.bodyWidth / 2, this.y * (this.snake.bodyWidth + 1) - this.snake.bodyWidth / 2, this.snake.bodyWidth, this.snake.bodyWidth);
    }
    move(direction) {
        switch (direction) {
            case Direction.Up:
                --this.y;
                break;
            case Direction.Down:
                ++this.y;
                break;
            case Direction.Left:
                --this.x;
                break;
            case Direction.Right:
                ++this.x;
                break;
        }
    }
    checkValid() {
        return this.snake.body.every(that => this === that || !this.isSamePlace(that))
            && (this.x > 0 && this.x < this.snake.game.width - 1)
            && (this.y > 0 && this.y < this.snake.game.height - 1);
    }
    isSamePlace(that) {
        return this.x === that.x && this.y === that.y;
    }
}
class Snake {
    constructor(canvas, bodyWidth = 20, gameWidth = 40, gameHeight = 20, defaultDirection = Direction.Right) {
        canvas.width = bodyWidth * (gameWidth + 1) + 1;
        canvas.height = bodyWidth * (gameHeight + 1) + 1;
        this.bodyWidth = bodyWidth;
        this.game = {
            width: gameWidth,
            height: gameHeight,
        };
        this.context = canvas.getContext('2d');
        this.body = [
            new SnakeBody(this, (gameWidth / 2 - 3) | 0, (gameHeight / 2) | 0),
            new SnakeBody(this, (gameWidth / 2 - 2) | 0, (gameHeight / 2) | 0),
            new SnakeBody(this, (gameWidth / 2 - 1) | 0, (gameHeight / 2) | 0),
        ];
        canvas.hidden = false;
        addEventListener('keydown', e => {
            switch (e.key) {
                case 'ArrowDown':
                    if (this.direction !== Direction.Up)
                        this.nextDirection = Direction.Down;
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    if (this.direction !== Direction.Down)
                        this.nextDirection = Direction.Up;
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    if (this.direction !== Direction.Right)
                        this.nextDirection = Direction.Left;
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    if (this.direction !== Direction.Left)
                        this.nextDirection = Direction.Right;
                    e.preventDefault();
                    break;
            }
        });
        this.nextDirection = defaultDirection;
    }
    move() {
        const head = this.head;
        let newHead;
        switch (this.direction = this.nextDirection) {
            case Direction.Up:
                newHead = new SnakeBody(this, head.x, head.y - 1);
                break;
            case Direction.Down:
                newHead = new SnakeBody(this, head.x, head.y + 1);
                break;
            case Direction.Left:
                newHead = new SnakeBody(this, head.x - 1, head.y);
                break;
            case Direction.Right:
                newHead = new SnakeBody(this, head.x + 1, head.y);
                break;
        }
        if (this.food) {
            if (newHead.isSamePlace(this.food)) {
                this.food = null;
            }
            else {
                this.body.shift();
            }
        }
        this.body.push(newHead);
    }
    checkValid() {
        return this.head.checkValid();
    }
    get head() {
        return this.body[this.body.length - 1];
    }
    get tail() {
        return this.body[0];
    }
    generateFood() {
        do {
            this.food = new SnakeBody(this, Math.random() * (this.game.width - 1) | 0, Math.random() * (this.game.height - 1) | 0);
        } while (this.body.some(x => x.isSamePlace(this.food)));
    }
    draw() {
        this.body.forEach((x, idx, array) => x.draw(idx === array.length - 1 ? 'green' : 'black'));
        this.food.draw('yellow');
    }
    run() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.move();
        if (!this.food)
            this.generateFood();
        this.draw();
        if (!this.checkValid()) {
            this.head.draw('red');
            setTimeout(() => alert('GAME OVER'), 100);
            return;
        }
        this.timeoutHandle = setTimeout(() => this.run(), 200);
    }
}
void function main() {
    new Snake(document.getElementById('canvas')).run();
}();
//# sourceMappingURL=index.js.map