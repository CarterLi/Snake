enum Direction {
  Left,
  Right,
  Up,
  Down,
}

class SnakeBody {
  snake: Snake;
  x: number;
  y: number;

  constructor(snake: Snake, x: number, y: number) {
    this.snake = snake;
    this.x = x;
    this.y = y;
  }

  draw(color = 'black') {
    const ctx = this.snake.context;
    ctx.fillStyle = color;
    ctx.fillRect(
      this.x * (this.snake.bodyWidth + 1) - this.snake.bodyWidth / 2,
      this.y * (this.snake.bodyWidth + 1) - this.snake.bodyWidth / 2,
      this.snake.bodyWidth,
      this.snake.bodyWidth);
  }

  move(direction: Direction) {
    switch (direction) {
      case Direction.Up: --this.y; break;
      case Direction.Down: ++this.y; break;
      case Direction.Left: --this.x; break;
      case Direction.Right: ++this.x; break;
    }
  }

  checkValid() {
    return this.snake.body.every(that => this === that || !this.isSamePlace(that))
      && (this.x > 0 && this.x < this.snake.game.width - 1)
      && (this.y > 0 && this.y < this.snake.game.height - 1)
  }

  isSamePlace(that: SnakeBody) {
    return this.x === that.x && this.y === that.y;
  }
}

class Snake {
  body: SnakeBody[];
  food: SnakeBody;
  bodyWidth: number;
  direction: Direction;
  nextDirection: Direction;
  game: {
    width: number;
    height: number;
  };

  context: CanvasRenderingContext2D;
  timeoutHandle: number;

  constructor(canvas: HTMLCanvasElement, bodyWidth = 20, gameWidth = 40, gameHeight = 20, defaultDirection = Direction.Right) {
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
          if (this.direction !== Direction.Up) this.nextDirection = Direction.Down;
          e.preventDefault();
          break;
        case 'ArrowUp':
          if (this.direction !== Direction.Down) this.nextDirection = Direction.Up;
          e.preventDefault();
          break;
        case 'ArrowLeft':
          if (this.direction !== Direction.Right) this.nextDirection = Direction.Left;
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (this.direction !== Direction.Left) this.nextDirection = Direction.Right;
          e.preventDefault();
          break;
      }
    });

    this.nextDirection = defaultDirection;
  }

  move() {
    const head = this.head;
    let newHead: SnakeBody;

    switch (this.direction = this.nextDirection) {
      case Direction.Up: newHead = new SnakeBody(this, head.x, head.y - 1); break;
      case Direction.Down: newHead = new SnakeBody(this, head.x, head.y + 1); break;
      case Direction.Left: newHead = new SnakeBody(this, head.x - 1, head.y); break;
      case Direction.Right: newHead = new SnakeBody(this, head.x + 1, head.y); break;
    }

    if (this.food) {
      if (newHead.isSamePlace(this.food)) {
        this.food = null;
      } else {
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
      this.food = new SnakeBody(this,
        Math.random() * (this.game.width - 1) | 0,
        Math.random() * (this.game.height - 1) | 0);
    } while (this.body.some(x => x.isSamePlace(this.food)));
  }

  draw() {
    this.body.forEach((x, idx, array) => x.draw(idx === array.length - 1 ? 'green': 'black'));
    this.food.draw('yellow');
  }

  run() {
    {
      const gamepad = navigator.getGamepads()[0];
      if (gamepad) {
        if (gamepad.axes[0] > .5) {
          this.nextDirection = Direction.Right;
        } else if (gamepad.axes[0] < -.5) {
          this.nextDirection = Direction.Left;
        } else if (gamepad.axes[1] > .5) {
          this.nextDirection = Direction.Down;
        } else if (gamepad.axes[1] < -.5) {
          this.nextDirection = Direction.Up;
        }
      }
    }

    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.move();
    if (!this.food) this.generateFood();
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
  new Snake(document.getElementById('canvas') as HTMLCanvasElement).run();
}();
