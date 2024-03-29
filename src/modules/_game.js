const pick = require("./_pick");
const GameBoard = require("./../objects/_gameBoard");
const Bot = require("../objects/_bot");
const GameBot = require("../objects/_gameBot");
const Ship_2 = require("../objects/_ship_2");
const Ship_3 = require("../objects/_ship_3");
const Ship_4 = require("../objects/_ship_4");

// pick buttons
const buttonRotate = document.querySelector("#buttonRotate");
const buttonStartGame = document.querySelector("#buttonStartGame");
const buttonUndo = document.querySelector("#buttonUndo");

// pick error boat text
const boatTypeText = document.querySelector("#boatTypeText");
const shipPlacementText = document.querySelector("#shipPlacementText");
const shipTypeText = document.querySelector("#shipTypeText");

//grids
const pickGrids = document.querySelectorAll(".pick-box");
const botGrids = document.querySelectorAll(".bot-box");

//pick area
const blackBackground = document.querySelector(".black-background");
const pickArea = document.querySelector(".pick-area");

//game area
const gameText = document.querySelector("#gameText");

// game logic area
const playerBoard = new GameBoard();
const botBoard = new GameBoard();
let count = 0;

// win area
const winArea = document.querySelector(".win-area");
const winText = document.querySelector("#winText");
const winButtonReset = document.querySelector("#winButtonReset");

const bot = new Bot();
const botPositionArray = bot.getSpots();
botPositionArray.forEach((position) => {
  const x = position[0];
  const y = position[1];
  const rotateStatus = position[2];
  const shipType = pick.type(position[3]);
  let rotNum;
  if (botBoard.getRotate() == false) {
    rotNum = 0;
  } else {
    rotNum = 1;
  }
  if (rotNum !== rotateStatus) {
    botBoard.rotateShipPosition();
  }
  botBoard.placeShip(x, y, shipType);
});
const gameBot = new GameBot();

function shipTypeTextChange() {
  if (count <= 4) {
    shipPlacementText.classList.add("hidden");
    if (count == 0) {
      shipTypeText.classList.remove("hidden");
      boatTypeText.textContent = "Carrier";
    } else if (count == 1) {
      shipTypeText.classList.remove("hidden");
      boatTypeText.textContent = "Battleship";
    } else if (count == 2) {
      shipTypeText.classList.remove("hidden");
      boatTypeText.textContent = "Destroyer";
    } else if (count == 3) {
      shipTypeText.classList.remove("hidden");
      boatTypeText.textContent = "Submarine";
    } else if (count == 4) {
      shipTypeText.classList.remove("hidden");
      boatTypeText.textContent = "Patrol Boat";
    }
  } else {
    shipPlacementText.classList.remove("hidden");
    shipTypeText.classList.add("hidden");
  }
}

function changeGameText(condition) {
  if (condition === 1) {
    gameText.textContent = "It is the Player's turn";
  } else if (condition === 2) {
    gameText.textContent = "The Player missed...";
  } else if (condition === 3) {
    gameText.textContent = "It's a hit! the player has hit a ship!";
  } else if (condition === 4) {
    gameText.textContent = "It is the Bot's turn";
  } else if (condition === 5) {
    gameText.textContent = "The Bot missed yay!";
  } else if (condition === 6) {
    gameText.textContent = "Oh no, It's a hit! the Bot has hit a ship!";
  }
}

function showWinner(condition) {
  blackBackground.classList.remove("hidden");
  winArea.classList.remove("hidden");
  if (condition === 1) {
    winText.textContent = "PLAYER WON CONGRATULATIONS!!!";
  } else if (condition === 0) {
    winText.textContent = "Aw man, BOT won...Better luck next time!";
  }
}

buttonStartGame.addEventListener("click", () => {
  const errorText = document.querySelector("#error-text");
  if (count > 4) {
    blackBackground.classList.add("hidden");
    pickArea.classList.add("hidden");
    const playerArray = playerBoard.getShipArray();
    playerArray.forEach((shipPair) => {
      shipPair[1].forEach((coords) => {
        const x = coords[0];
        const y = coords[1];
        document
          .querySelector(`.player-box + .grid-box-${y}${x}`)
          .classList.add("ship-color");
      });
    });
    changeGameText(1);
  } else {
    let stringVar;
    if (count > 1) {
      stringVar = `YOU STILL HAVE ${5 - count} SHIP TO PLACE`;
    } else {
      stringVar = `YOU STILL HAVE ${5 - count} SHIPS TO PLACE`;
    }
    errorText.textContent = stringVar;
    setTimeout(() => {
      errorText.textContent = "";
    }, 1500);
  }
});

buttonRotate.addEventListener("click", () => {
  playerBoard.rotateShipPosition();
});

winButtonReset.addEventListener("click", () => {
  window.location.reload();
});

buttonUndo.addEventListener("click", () => {
  const errorText = document.querySelector("#error-text");
  if (playerBoard.getShipArray().length > 0) {
    const lastElmt =
      playerBoard.getShipArray()[playerBoard.getShipArray().length - 1];
    const shipCoords = lastElmt[1];
    shipCoords.forEach((cords) => {
      const x = cords[0];
      const y = cords[1];
      document
        .querySelector(`.grid-box-${y}${x}`)
        .classList.remove("selected-grid");
      document
        .querySelector(`.grid-box-${y}${x}`)
        .classList.remove("pick-color");
    });
    playerBoard.undoPlacement();
    count -= 1;
    shipTypeTextChange();
  } else {
    errorText.textContent = "THERE ARE NO SHIPS ON THE BOARD";
    setTimeout(() => {
      errorText.textContent = "";
    }, 1500);
  }
});

pickGrids.forEach((grid) => {
  grid.addEventListener("mouseenter", () => {
    const gridPosition = grid.classList[1];
    const classNames = pick.returnGridClasses(
      pick.type(count),
      playerBoard.getRotate(),
      gridPosition
    );
    const placementStatus = pick.checkPlacement(classNames);
    const outOfBoundsStatus = pick.checkOutOfBounds(
      gridPosition,
      playerBoard.getRotate(),
      pick.type(count)
    );
    const popNum = pick.getPopNumber(
      gridPosition,
      pick.type(count),
      playerBoard.getRotate()
    );
    if (pick.checkShipAmount(count) === true) {
      if (outOfBoundsStatus == false) {
        if (placementStatus == false) {
          classNames.forEach((className) => {
            if (document.querySelector(`.${className}`) !== null) {
              document
                .querySelector(`.${className}`)
                .classList.add("pick-danger");
            }
          });
          grid.classList.add("pick-danger");
        } else {
          classNames.forEach((className) => {
            document.querySelector(`.${className}`).classList.add("pick-color");
          });
          grid.classList.add("pick-color");
        }
      } else {
        if (placementStatus == false) {
          classNames.forEach((className) => {
            if (document.querySelector(`.${className}`) !== null) {
              document
                .querySelector(`.${className}`)
                .classList.add("pick-danger");
            }
          });
          grid.classList.add("pick-danger");
        } else {
          for (let i = 0; i < popNum; i++) {
            classNames.pop();
          }
          if (classNames.length > 0) {
            classNames.forEach((className) => {
              document
                .querySelector(`.${className}`)
                .classList.add("pick-danger");
            });
          }
          grid.classList.add("pick-danger");
        }
      }
    } else {
      grid.classList.add("pick-danger");
    }
  });
  grid.addEventListener("mouseleave", () => {
    const gridPosition = grid.classList[1];
    const classNames = pick.returnGridClasses(
      pick.type(count),
      playerBoard.getRotate(),
      gridPosition
    );
    const placementStatus = pick.checkPlacement(classNames);
    const outOfBoundsStatus = pick.checkOutOfBounds(
      gridPosition,
      playerBoard.getRotate(),
      pick.type(count)
    );
    const popNum = pick.getPopNumber(
      gridPosition,
      pick.type(count),
      playerBoard.getRotate()
    );
    if (pick.checkShipAmount(count) === true) {
      if (outOfBoundsStatus == false) {
        if (placementStatus == false) {
          classNames.forEach((className) => {
            if (document.querySelector(`.${className}`) !== null) {
              document
                .querySelector(`.${className}`)
                .classList.remove("pick-danger");
            }
          });
          grid.classList.remove("pick-danger");
        } else {
          classNames.forEach((className) => {
            document
              .querySelector(`.${className}`)
              .classList.remove("pick-color");
          });
          grid.classList.remove("pick-color");
        }
      } else {
        if (placementStatus == false) {
          classNames.forEach((className) => {
            if (document.querySelector(`.${className}`) !== null) {
              document
                .querySelector(`.${className}`)
                .classList.remove("pick-danger");
            }
          });
          grid.classList.remove("pick-danger");
        } else {
          for (let i = 0; i < popNum; i++) {
            classNames.pop();
          }
          if (classNames.length > 0) {
            classNames.forEach((className) => {
              document
                .querySelector(`.${className}`)
                .classList.remove("pick-danger");
            });
          }
          grid.classList.remove("pick-danger");
        }
      }
    } else {
      grid.classList.remove("pick-danger");
    }
  });
  grid.addEventListener("click", () => {
    const gridPosition = grid.classList[1];
    const classNames = pick.returnGridClasses(
      pick.type(count),
      playerBoard.getRotate(),
      gridPosition
    );
    const placementStatus = pick.checkPlacement(classNames);
    const outOfBoundsStatus = pick.checkOutOfBounds(
      gridPosition,
      playerBoard.getRotate(),
      pick.type(count)
    );
    const errorText = document.querySelector("#error-text");
    if (outOfBoundsStatus == false) {
      if (placementStatus == false) {
        errorText.textContent = "THERE IS A SHIP PLACED THERE";
        setTimeout(() => {
          errorText.textContent = "";
        }, 1500);
      } else {
        if (pick.checkShipAmount(count) === true) {
          classNames.forEach((className) => {
            document
              .querySelector(`.${className}`)
              .classList.add("selected-grid");
          });
          grid.classList.add("selected-grid");
          const x = parseInt(gridPosition[10]);
          const y = parseInt(gridPosition[9]);
          const shipType = pick.type(count);
          playerBoard.placeShip(x, y, shipType);
          count += 1;
          shipTypeTextChange();
        } else {
          errorText.textContent = "YOUR SHIPS ARE ALL PLACED";
          setTimeout(() => {
            errorText.textContent = "";
          }, 1500);
        }
      }
    } else {
      errorText.textContent = "YOU ARE OUT OF BOUNDS";
      setTimeout(() => {
        errorText.textContent = "";
      }, 1500);
    }
  });
});

botGrids.forEach((grid) => {
  grid.addEventListener("click", () => {
    const botArray = botBoard.getGrid();
    const gridClass = grid.classList[1];
    const y = parseInt(gridClass[9]);
    const x = parseInt(gridClass[10]);
    if (botArray[y][x] === 1) {
      grid.classList.add("attacked-ship");
      setTimeout(() => {
        changeGameText(3);
      }, 1000);
    } else {
      grid.classList.add("attacked");
      setTimeout(() => {
        changeGameText(2);
      }, 1000);
    }
    botBoard.receiveAttack(x, y);
    setTimeout(() => {
      changeGameText(4);
    }, 2000);
    const ranPos = gameBot.generateRandomPosition();
    const yBot = ranPos[0][0];
    const xBot = ranPos[0][1];
    const playerDomGrid = document.querySelector(
      `.player-box + .grid-box-${yBot}${xBot}`
    );
    const playerGrid = playerBoard.getGrid();
    if (playerGrid[yBot][xBot] == 1) {
      playerDomGrid.classList.add("attacked-ship");
      setTimeout(() => {
        changeGameText(6);
      }, 1000);
    } else {
      playerDomGrid.classList.add("attacked");
      setTimeout(() => {
        changeGameText(5);
      }, 1000);
    }
    playerBoard.receiveAttack(xBot, yBot);
    setTimeout(() => {
      changeGameText(1);
    }, 2000);
    console.log(playerBoard.getShipArray());
    console.log(botBoard.getShipArray());
    if (playerBoard.getShipArray().length === 0) {
      showWinner(0);
    }
    if (botBoard.getShipArray().length === 0) {
      showWinner(1);
    }
  });
});
