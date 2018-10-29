// Basic match 3 game. We're emulating HuniePop's puzzles. ONLY THE PUZZLES.
// 4 types of token, plus heart token and broken heart token.
// board is 8x8.

const board = document.querySelector(".board");
let c = board.getContext("2d");
const resetBtn = document.querySelector(".reset");
const partyBtn = document.querySelector(".party");
const rows = 6;
const cols = 6;
c.font = "48px serif";

board.width = board.height = Math.floor(0.6 * window.innerWidth);

let spaces = [];
let tokens = [];
let iterations = 0; // will hold number of new boards created before a clean one
let dragging = null;
let dragInterval;
let mouseUpFlag = false;

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
let partying = false;
let partyInterval;
let tileSize = Math.floor(board.width / rows);
let offset = tileSize / 2;
let tempX = [];
let mousePos = ""; // will hold x and y position of mouse cursor

let boardReady = false; // to become true when a board is set up that has no immediate matches
let falseBoards = 0; // tests number pre-game boards that have a match

resetBtn.addEventListener("click", init);
partyBtn.addEventListener("click", party);

function party() {
  if (!partying) {
    partyBtn.innerHTML = "Stop Partying";
    partying = true;
    partyInterval = window.setInterval(init, 25);
  } else {
    partying = false;
    window.clearInterval(partyInterval);
    partyBtn.innerHTML = "Party";
  }
}

function render(node, template) {
  // injects HTML at specified node
  node.innerHTML = template;
}

function init() {
  clearCanvas();
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
  if (partying) {
    for (let i = 0; i < array.length; i++) {
      let r = getRandom(0, 255);
      let g = getRandom(0, 255);
      let b = getRandom(0, 255);

      let color = "rgb(" + r + "," + g + "," + b + ")";
      tokens[i].draw(color);
    }
  } else {
    tokens.forEach(item => item.draw());
  }
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
  this.active = false;

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
// handle what happens when mouse button is released
window.addEventListener("mouseup", function() {
  mouseUpFlag = true;
  window.clearInterval(dragInterval);

  let temp = getTokens();

  for (let i = 0; i < temp.length; i++) {
    tokens[i].x = temp[i].x;
    tokens[i].y = temp[i].y;
    tokens[i].active = false;
  }
  clearCanvas();
  reDraw(tokens);
});

function clickCheck() {
  let x = mousePos.x;
  let y = mousePos.y;
  mouseUpFlag = false;

  let test = tokens.slice();

  // loop through array of tokens to find which one was clicked. Returns clicked token.
  for (let i = 0; i < test.length; i++) {
    let e = test[i]; // for brevity
    let set = e.radius; // this represents the offset, because each circle is a friggin circle

    // test to see if current mouse point if within its x/y boundaries
    if (e.x < x + set && e.y < y + set && (e.hitX > x && e.hitY > y)) {
      test[i].active = true;
      clearCanvas();
      reDraw(test);
    }
  }
}

function clearCanvas() {
  c.clearRect(0, 0, board.width, board.height);
}

function reDraw(array) {
  let e = array.slice();
  for (let i = 0; i < array.length; i++) {
    if (!e[i].active) {
      e[i].draw();
    } else if (!mouseUpFlag) {
      setDragInterval(e, i);
    } else {
      e[i].active = false;
      mouseUpFlag = true;
      window.clearInterval(dragInterval);
    }
  }
}

function setDragInterval(array, iterator) {
  dragInterval = window.setInterval(function() {
    e = array;
    i = iterator;
    clearCanvas();
    for (let i = 0; i < tokens.length; i++) {
      tokens[i].draw();
    }
    e[i].x = mousePos.x;
    e[i].y = mousePos.y;
    e[i].draw("gold");
  }, 10);
  return dragInterval;
}

function getTokens() {
  // returns the array tokens[] is built from. This is so a clicked token will return to its origin after release
  let array = tokens;
  return array;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
