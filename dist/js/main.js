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
let tokenValues = [
  "green",
  "white",
  "red",
  "yellow",
  "black",
  "pink",
  "orange"
];

let animating = true;
let tileSize = Math.floor(board.width / rows);
let offset = tileSize / 2;

let boardReady = false; // to become true when a board is set up that has no immediate matches
let falseBoards = 0; // tests number pre-game boards that have a match

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
        size: tileSize / width,
        row: k,
        col: i
      };
      count++;
    }
  }
  spaces = setBoardValues(spaces);
  if (matchTest(spaces)) {
    init();
  }
  initTokens(spaces);
}

// pass the pre-filled spaces array into this function to test for matches.
function matchTest(array) {
  let tempX = [];
  let tempY = [];
  for (let i = 0; i < array.length; i++) {
    if ((array[i].row = i)) {
      tempX.push(array[i]);
    }
    if ((array[i].col = i)) {
      tempY.push(array[i]);
    }
  }

  for (i = 0; i < tempX.length; i++) {
    let xChecked = testLimitX(tempX, i);
    console.log(xChecked);
    let yChecked = testLimitY(tempY, i);
    console.log(yChecked);
    if (xChecked || yChecked) {
      tempX = [];
      tempY = [];
      console.log("match found");
      falseBoards++;
      if (falseBoards >= 500) {
        console.log("Limit reached");
        break;
      }
      return true;
    } else {
      return false;
    }
  }
}

// pre-game. Checks all spaces with the same X value for matches.

function testLimitX(tempX, i) {
  let limit = rows - 1;
  if (tempX[i].row >= limit) {
    tempX[i].clearRight = false;
  } else {
    tempX[i].clearRight = true;
  }
  if (tempX[i].row <= 1) {
    tempX[i].clearLeft = false;
  } else {
    tempX[i].clearLeft = true;
  }

  return testMatchX(tempX, i);
}

function testLimitY(tempY, i) {
  let limit = cols - 1;
  if (tempY[i].col >= limit) {
    tempY[i].clearDown = false;
  } else {
    tempY[i].clearDown = true;
  }

  if (tempY[i].col <= 1) {
    tempY[i].clearUp = false;
  } else {
    tempY[i].clearDown = true;
  }

  return testMatchY(tempY, i);
}
// test for matches under different conditions
function testMatchY(tempY, i) {
  if (tempY[i].clearDown) {
    if (
      tempY[i].value == tempY[i + 1].value &&
      tempY[i].value == tempY[i + 2].value
    ) {
      return true;
    }
  }

  if (tempY[i].clearUp) {
    if (
      tempY[i].value == tempY[i - 1].value &&
      tempY[i].value == tempY[i - 2].value
    ) {
      return true;
    }
  }

  return false;
}

function testMatchX(tempX, i) {
  if (tempX[i].clearRight) {
    if (
      tempX[i].value == tempX[i + 1].value &&
      tempX[i].value == tempX[i + 2].value
    ) {
      return true;
    }
  }

  if (tempX[i].clearLeft) {
    if (
      tempX[i].value == tempX[i - 1].value &&
      tempX[i].value == tempX[i - 2].value
    ) {
      return true;
    }
  }

  return false;
}

function setBoardValues(array) {
  // assigns each space a numeric value between 0 and 5. These values represent game takens.
  array.forEach(item => (item.value = getRandom(0, 7)));
  return array;
}

function initTokens(array) {
  for (let i = 0; i < rows * cols; i++) {
    tokens[i] = new Token(
      array[i].x,
      array[i].y,
      array[i].row,
      array[i].col,
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

function Token(x, y, row, col, dx, dy, radius, value) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.value = value;
  this.row = row;
  this.col = col;

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
