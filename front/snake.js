const gameGlobals = {
  fps: 1000 / 15, // by 15 gives about >60 fps
  squareSize: 20,
  playerTail: 5,
};

const state = {};

const Position = ({x = 0, y = 0}) => {
  return {
    x,
    y,
  };
};

const getRandomPosition = () => {
  const x = Math.floor(Math.random() * state.ctx.canvas.width);
  const y = Math.floor(Math.random() * state.ctx.canvas.height);
  const pos = Position({x, y});
  // land in the grid
  pos.x = pos.x - (pos.x % gameGlobals.squareSize);
  pos.y = pos.y - (pos.y % gameGlobals.squareSize);

  return pos;
};

const Board = () => {
  const ctx = state.ctx;

  const draw = () => {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fill();
  };

  const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = 'white';

    // vertical lines
    for (let dx = 0; dx <= ctx.canvas.width; dx += gameGlobals.squareSize) {
      ctx.moveTo(dx, 0);
      ctx.lineTo(dx, ctx.canvas.height);
    }

    // horizontal lines
    for (let dy = 0; dy <= ctx.canvas.height; dy += gameGlobals.squareSize) {
      ctx.moveTo(0, dy);
      ctx.lineTo(ctx.canvas.width, dy);
    }

    ctx.stroke();
    ctx.fill();
  }

  return { draw, drawGrid };
};

const Food = ({
  size = gameGlobals.squareSize,
  color = 'red',
  pos,
}) => {
  const ctx = state.ctx;
  const getPosition = () => pos;

  const draw = () => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(pos.x, pos.y, size, size);
    ctx.fill();
  };

  return {
    getPosition,
    draw,
  };
};

const Snake = ({ size, color = 'lime', pos }) => {
  const ctx = state.ctx;
  let body = [ Position(pos), Position(pos), Position(pos) ];
  const velocity = { x: 0, y: 0 };

  const updatePart = pos => ({
    x: (pos.x + size * Math.sign(velocity.x) +
      ctx.canvas.width) % ctx.canvas.width,
    y: (pos.y + size * Math.sign(velocity.y) +
      ctx.canvas.height) % ctx.canvas.height,
  });

  const eat = food => body.unshift(updatePart(food.getPosition()));

  const getHead = () => body[0];

  const update = () => {
    body.pop(); // remove tail
    body.unshift(updatePart(getHead())); // new head
  };

  const draw = () => {
    ctx.beginPath();
    ctx.fillStyle = color;
    body.forEach(pos => {
      ctx.rect(pos.x, pos.y, size, size);
      ctx.fill();
    });
  };

  const reset = () => {
    body = [ Position(pos), Position(pos), Position(pos) ];
    velocity.x = 0;
    velocity.y = 0;
  };

  const turnLeft = () => { velocity.x = -1; velocity.y = 0; };

  const turnRight = () => { velocity.x = 1; velocity.y = 0; };

  const turnUp = () => { velocity.x = 0; velocity.y = -1; };

  const turnDown = () => { velocity.x = 0; velocity.y = 1; };

  return {
    getHead,
    draw,
    eat,
    update,
    turnDown,
    turnLeft,
    turnRight,
    turnUp,
    reset,
  };
};

const game = () => {
  const { canvas, board, food, snake } = state;
  canvas.width = Math.max(document.body.clientWidth ||
    0, window.innerWidth || 0);
  canvas.height = Math.max(document.body.clientHeight ||
    0, window.innerHeight || 0);

  if(food.length) {
    const sPos = snake.getHead();

    let foodToDelete;
    food.forEach((f, i) => {
      const fPos = f.getPosition();
      if (sPos.x === fPos.x && sPos.y === fPos.y) {
        snake.eat(f);
        foodToDelete = i;
      }
    });
    // delete food
    if (foodToDelete >= 0) {
      food.splice(foodToDelete, 1);
      // create a new food
      food.push(Food({pos: getRandomPosition()}));
    }
  }

  board.draw();
  board.drawGrid();

  food.forEach(f => f.draw());
  snake.update();
  snake.draw();
};

const keyPush = e => {
  const snake = state.snake;
  const key = e.key;
  if (key === 'ArrowLeft') {
    snake.turnLeft();
  } else if (key === 'ArrowUp') {
    snake.turnUp();
  } else if (key === 'ArrowRight') {
    snake.turnRight();
  } else if (key === 'ArrowDown') {
    snake.turnDown();
  }
};

window.onload = () => {
  state.canvas = document.getElementById('snake');
  state.ctx = state.canvas.getContext('2d');
  state.board = Board();
  state.snake = Snake({
    size: gameGlobals.squareSize,
    pos: getRandomPosition(),
  });
  state.food = [Food({pos: getRandomPosition()})];

  document.addEventListener('keydown', keyPush);
  setInterval(() => game(), gameGlobals.fps);
};
