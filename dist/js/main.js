// Basic match 3 game. We're emulating HuniePop's puzzles. ONLY THE PUZZLES.
// 4 types of token, plus heart token and broken heart token.
// board is 8x8.

const board = document.querySelector(".board");
let c = board.getContext("2d");
const rows = 8;
const cols = 8;
c.font = "48px serif";

board.width = board.height = Math.floor(0.6 * window.innerWidth);

let spaces = [];
let tokens = [];
let iterations = 0; // will hold number of new boards created before a clean one

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

  if (testValues(spaces)) {
    iterations++;
    init();
  } else {
    iterations = 0;
    initTokens(spaces);
  }
}

// I know this functin is horrible. We will break it down at some point. I'm convinced I can push all these whiles into a foor loop.
//
function testValues(array) {
  let i = 0;
  temp = "";
  tempX = [];
  let tempY = [];

  // While loops will take each space's value and concatenate it into 8 strings, which we will test later.
  while (i < 8) {
    temp += array[i].value.toString();
    i++;
  }
  tempX[0] = temp;
  temp = "";

  while (i >= 8 && i < 16) {
    temp += array[i].value.toString();
    i++;
  }
  tempX[1] = temp;
  temp = "";

  while (i >= 16 && i < 24) {
    temp += array[i].value.toString();
    i++;
  }
  tempX[2] = temp;
  temp = "";

  while (i >= 24 && i < 32) {
    temp += array[i].value.toString();
    i++;
  }
  tempX[3] = temp;
  temp = "";

  while (i >= 32 && i < 40) {
    temp += array[i].value.toString();
    i++;
  }
  tempX[4] = temp;
  temp = "";

  while (i >= 40 && i < 48) {
    temp += array[i].value.toString();
    i++;
  }
  tempX[5] = temp;
  temp = "";

  while (i >= 48 && i < 56) {
    temp += array[i].value.toString();
    i++;
  }
  tempX[6] = temp;
  temp = "";

  while (i >= 56 && i < 64) {
    temp += array[i].value.toString();
    i++;
  }
  tempX[7] = temp;
  temp = "";

  // get y values
  let j = "";
  let state = false;

  // loop through the tempY array. We're making an array representing column values from tempX
  for (let i = 0; i < rows; i++) {
    // loop through tempX array elements, one by one, and grab one element from each column
    for (let k = 0; k < rows; k++) {
      temp = tempX[k].split("");
      j += temp[i];
    }
    tempY[i] = j;
    j = "";
  }
  console.log(tempY);

  // break each row into testable arrays
  for (let i = 0; i < tempX.length; i++) {
    temp = tempX[i].split("");
    temp.forEach(item => (item = parseInt(item)));

    //test for three consecutive repeating values (a match)
    for (let k = 0; k < temp.length; k++) {
      if (temp[k] == temp[k + 1] && temp[k] == temp[k + 2]) {
        console.log("horiz match found at");
        console.log(i, k);
        state = true;
      }
    }
  }

  // break each column into testable arrays
  for (let i = 0; i < tempY.length; i++) {
    temp = tempY[i].split("");
    temp.forEach(item => (item = parseInt(item)));

    //test for three consecutive repeating values (a match)
    for (let k = 0; k < temp.length; k++) {
      if (temp[k] == temp[k + 1] && temp[k] == temp[k + 2]) {
        console.log("vert match found at");
        console.log(i, k);
        state = true;
      }
    }
  }
  if (state == true) {
    return true;
  }
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
