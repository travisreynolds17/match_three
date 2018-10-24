// Basic match 3 game. We're emulating HuniePop's puzzles. ONLY THE PUZZLES.
// 4 types of token, plus heart token and broken heart token.
// board is 8x8.

const board = document.querySelector(".board");
let c = board.getContext("2d");
const rows = 8;
const cols = 8;

board.width = board.height = Math.floor(0.6 * window.innerWidth);

let spaces = [];
let tokens = [];
// holds possible type of token. Later to be replaced with pictures?
let tokenValues = ["green", "white", "red", "blue", "black", "pink"];

let animating = true;
let tileSize = Math.floor(board.width / rows);
let offset = tileSize / 2;
console.log(tileSize);

function render(node, template) {
  // injects HTML at specified node
  node.innerHTML = template;
}

function init() {
  initBoard(cols, rows, tileSize);
}
function initBoard(length, width, tileSize) {
  // set up all possible positions. This function does NOT assign values. It only creates the templates.
  let count = 0;

  for (var i = 0; i < cols; i++) {
    for (var k = 0; k < rows; k++) {
      // each space is an object. its properties will be used to tell us where it is and what's in it.
      spaces[count] = {
        index: count,
        x: k * tileSize + offset,
        y: i * tileSize + offset,
        value: "",
        active: false,
        size: tileSize / width
      };
      count++;
    }
  }
  spaces = setBoardValues(spaces);
  initTokens(spaces);
}

function setBoardValues(array) {
  // assigns each space a numeric value between 0 and 5. These values represent game takens.
  array.forEach(item => (item.value = getRandom(0, 6)));
  return array;
}

function initTokens(array) {
  for (let i = 0; i < rows * cols; i++) {
    tokens[i] = new Token(
      array[i].x,
      array[i].y,
      2,
      2,
      array[i].size,
      tokenValues[array[i].value]
    );
  }
  tokens.forEach(item => item.draw());
}

function getRandom(min, max) {
  // note: max is not inclusive because of floor method. make max 1 more than you actually want to include.
  return Math.floor(Math.random() * (max - min) + min);
}

function Token(x, y, dx, dy, radius, value) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.value = value;

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.value;
    c.stroke();
    c.fill();
  };
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
init();
