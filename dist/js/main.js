// Basic match 3 game. We're emulating HuniePop's puzzles. ONLY THE PUZZLES.
// 4 types of token, plus heart token and broken heart token.
// board is 8x8.

const board = document.querySelector(".board");
let c = board.getContext("2d");
const resetBtn = document.querySelector(".reset");
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
let tempX = [];
let mousePos = ""; // will hold x and y position of mouse cursor

let boardReady = false; // to become true when a board is set up that has no immediate matches
let falseBoards = 0; // tests number pre-game boards that have a match

resetBtn.addEventListener("click", init);

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

// seems to work. This function takes the initial array of values and creates a new one where each horizontal row
// is concatenated and placed in the corresponding index of a new array. This is for testing purposes.
// the function is recursive and will call itself until every value is handled
function getRows(min, max, array, iterator, recursiveCounter, tempArray) {
  let temp = "";
  let i = iterator;
  let counter = recursiveCounter;
  let arrayClone = array;
  let temp2 = tempArray;
  while (i >= min && i < max) {
    temp += array[i].value.toString();

    i++;
  }

  temp2[counter] = temp;
  counter++;

  if (i >= rows * cols) {
    console.log("hi");
    tempX = temp2;
  } else {
    getRows(min + rows, max + rows, arrayClone, i, counter, temp2);
  }
}

function testValues(array) {
  getRows(0, rows, array, 0, 0, []);

  let tempY = [];

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
        // console.log("horiz match found at");
        // console.log(i, k);
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
        // console.log("vert match found at");
        // console.log(i, k);
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
      i,
      array[i].x,
      array[i].y,
      array[i].row,
      array[i].col,
      2,
      2,
      array[i].size * 2,
      tokenValues[array[i].value]
    );
  }
  tokens.forEach(item => item.draw());
}

function getRandom(min, max) {
  // note: max is not inclusive because of floor method. make max 1 more than you actually want to include.
  return Math.floor(Math.random() * (max - min) + min);
}

function Token(index, x, y, row, col, dx, dy, radius, value) {
  this.index = index;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.value = value;
  this.row = row;
  this.col = col;
  this.hitX = x + radius; // these determine the clickable area of the token
  this.hitY = y + radius;

  this.draw = function(color) {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = color || this.value;
    c.stroke();
    c.fill();
  };
}

function CanvasState() {}

// tracking mouse position
function getMousePosition(board, event) {
  let box = board.getBoundingClientRect();
  return {
    x: Math.floor(event.clientX - box.left),
    y: Math.floor(event.clientY - box.top)
  };
}

// mousePos variable will have a .x and .y property
board.addEventListener("mousemove", function(event) {
  mousePos = getMousePosition(board, event);
});

// find out which token we clicked

board.addEventListener("mousedown", clickCheck);

function clickCheck() {
  let x = mousePos.x;
  let y = mousePos.y;

  let test = tokens.slice();

  // loop through array of tokens to find which one was clicked
  for (let i = 0; i < test.length; i++) {
    let e = test[i]; // for brevity
    let set = e.radius; // this represents the offset, because each circle is a friggin circle

    // test to see if current mouse point if within its x/y boundaries
    if (e.x < x + set && e.y < y + set && (e.hitX > x && e.hitY > y)) {
      e.draw("violet");
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
