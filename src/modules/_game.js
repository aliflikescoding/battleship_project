const pick = require("./_pick");
const GameBoard = require("./../objects/_gameBoard");
const Ship_2 = require('../objects/_ship_2');
const Ship_3 = require('../objects/_ship_3');
const Ship_4 = require('../objects/_ship_4');

// pick buttons
const buttonRotate = document.querySelector("#buttonRotate");
const buttonStartGame = document.querySelector("#buttonStartGame");
const buttonUndo = document.querySelector("#buttonUndo");

//grids
const grids = document.querySelectorAll(".pick-box");

const playerBoard = new GameBoard();
const ships = 5;

grids.forEach((grid) => {
  grid.addEventListener("mouseenter", () => {
    const gridPosition = grid.classList[1];
    const test = document.querySelector(`.${pick.getVerticalClass(gridPosition, 1)}`)
    grid.classList.add("pick-color");
    test.classList.add("pick-color");
  });
  grid.addEventListener("mouseleave", () => {
    const gridPosition = grid.classList[1];
    const test = document.querySelector(`.${pick.getVerticalClass(gridPosition, 1)}`)
    test.classList.remove("pick-color");
    grid.classList.remove("pick-color");
  });
});