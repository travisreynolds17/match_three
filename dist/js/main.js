// Basic match 3 game. We're emulating HuniePop's puzzles. ONLY THE PUZZLES.
// 4 types of token, plus heart token and broken heart token.
// board is 10 x 10.

const board = document.querySelector(".board");

boardLength = 10;
boardWidth = 10;

let spaces = [];

function render(node, template) {
  // injects HTML at specified node
  node.innerHTML = template;
}

function init() {
  initBoard(boardLength, boardWidth);
  setBoardValues();
  renderBoard();
}
function initBoard(length, width) {
  // set up all possible positions. This function does NOT assign values. It only creates the templates.
  let count = 0;

  for (var i = 0; i < length; i++) {
    for (var k = 0; k < width; k++) {
      // each space is an object. its properties will be used to tell us where it is and what's in it.
      spaces[count] = {
        index: count,
        xPos: k,
        yPos: i,
        value: null,
        active: false
      };
      count++;
    }
  }
}

function setBoardValues() {
  // assigns each space a numeric value between 0 and 5. These values represent game takens.
  spaces.forEach(item => (item.value = getRandom(0, 6)));
}

function renderBoard() {
  // displays new game board's values
  let injectable = "";
  let token = "";
  for (var i = 0; i < spaces.length; i++) {
    token = spaces[i].value.toString();
    injectable += "<div class = 'space'>\n" + token + "\n</div>\n";
    console.log(injectable);
  }
  render(board, injectable);
}
function getRandom(min, max) {
  // note: max is not inclusive because of floor method. make max 1 more than you actually want to include.
  return Math.floor(Math.random() * (max - min) + min);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
init();
