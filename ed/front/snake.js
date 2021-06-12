const maxWidth = 640; // document.body.clientWidth;
const maxHeight = 400; // document.body.clientHeight;
const squareSize = 20;

const createCanvas = () => {
  const canvas = document.getElementById('snake-canvas');
  canvas.width = maxWidth;
  canvas.height = maxHeight;

  return canvas.getContext('2d');
};


const ctx = createCanvas();

const Board = () => {
  const draw = () => {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.rect(0, 0, maxWidth, maxHeight);
    ctx.fill();
    ctx.restore();
  };

  return { draw };
};

const Meal = ({ size, x, y }) => {
  const getPosition = () => ({ x, y });

  const draw = () => {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.rect(x, y, size, size);
    ctx.fill();
    ctx.restore();
  };

  return { getPosition, draw };
};

const Snake = ({ size, color = 'green', x, y }) => {
  let body = [ { x, y }, { x, y }, { x, y } ]; // array con objetos { x, y }
  let xVel = 0;
  let yVel = 0;


  const updatePart = ({ x, y }) => ({
    x: (x + size * Math.sign(xVel) + maxWidth) % maxWidth,
    y: (y + size * Math.sign(yVel) + maxHeight) % maxHeight,
  });

  const eat = meal => body.unshift(updatePart(meal.getPosition()));

  const getHead = () => body[0];

  const update = () => {
    body.pop(); // eliminar cola
    body.unshift(updatePart(getHead())); // nueva cabeza
  };

  const draw = () => {
    ctx.beginPath();
    ctx.fillStyle = color;
    body.forEach(({ x, y }) => {
      ctx.rect(x, y, size, size);
      ctx.fill();
    });
    ctx.restore();
  };

  const isStarving = () => {
    const head = getHead();

    return !body.every(({ x, y }) => x === head.x && y === head.y) &&
      body.slice(1).find(({ x, y }) => x === head.x && y === head.y);
  };

  const reset = () => {
    body = [ { x, y }, { x, y }, { x, y } ];
    xVel = 0;
    yVel = 0;
  };

  const turnLeft = () => { xVel = -1; yVel = 0; };

  const turnRight = () => { xVel = 1; yVel = 0; };

  const turnUp = () => { xVel = 0; yVel = -1; };

  const turnDown = () => { xVel = 0; yVel = 1; };

  return { getHead, draw, eat, update, turnDown, turnLeft, turnRight, turnUp, isStarving, reset };
};

const getRandomPosition = () => {
  let x = Math.floor(Math.random() * maxWidth);
  x = x - (x % squareSize);
  let y = Math.floor(Math.random() * maxHeight);
  y = y - (y % squareSize);

  return { x, y };
};

const mySnake = Snake({
  size: squareSize,
  color: 'green',
  ...getRandomPosition(),
});

let prevKey;
document.onkeydown = e => {
  e = e || window.event;

  const key = e.key;
  if (key === 'ArrowLeft' && prevKey !== 'ArrowRight') {
    mySnake.turnLeft();
    prevKey = key;
  } else if (key === 'ArrowUp' && prevKey !== 'ArrowDown') {
    mySnake.turnUp();
    prevKey = key;
  } else if (key === 'ArrowRight' && prevKey !== 'ArrowLeft') {
    mySnake.turnRight();
    prevKey = key;
  } else if (key === 'ArrowDown' && prevKey !== 'ArrowUp') {
    mySnake.turnDown();
    prevKey = key;
  }
};

const board = Board();
let meal;

const game = () => {
  board.draw();


  // comer o generar comida
  if (meal) {
    const snakePosition = mySnake.getHead();
    const mealPosition = meal.getPosition();

    if (snakePosition.x === mealPosition.x && snakePosition.y === mealPosition.y) {
      mySnake.eat(meal);
      meal = undefined;
    }
  } else {
    meal = Meal({ size: squareSize, ...getRandomPosition() });
  }

  // suicidio por hambre :c
  if (mySnake.isStarving()) {
    mySnake.reset();
  }


  meal?.draw();
  mySnake.draw();
  mySnake.update();
};

setInterval(game, 1000 / 15);

// igual se puede devolver si se apretan 2 teclas rápido! (te podés morir :o)
// hay que evitar que los puntitos come come salgan bajo las serpientes
