// Display controller module object
const displayController = (function () {
  // Cache DOM
  const displayElement = document.querySelector(".display");
  const boardElement = document.querySelector(".grid");
  const cellElements = document.querySelectorAll(".cell");

  // Public methods
  const bindEventListeners = () => {
    boardElement.addEventListener("click", gameController.playRound);
  };

  const unbindEventListeners = () => {
    boardElement.removeEventListener("click", gameController.playRound);
  };

  const displayPlayerTurn = (player) => {
    displayElement.innerText = `${player.getName()}'s turn`;
  };

  const displayWinner = (player) => {
    displayElement.innerText = `${player.getName()} has won!`;
  };

  const displayDraw = () => {
    displayElement.innerText = "It's a draw!";
  };

  const updateCell = (cellIndex, value) => {
    cellElements[cellIndex].innerText = value;
  };

  return {
    bindEventListeners,
    unbindEventListeners,
    displayPlayerTurn,
    displayWinner,
    displayDraw,
    updateCell,
  };
})();

// --------------------------------------------------------------------------

// Game board module object
const board = (function () {
  // Private properties
  const emptyValue = " ";
  const gameboard = [
    emptyValue,
    emptyValue,
    emptyValue,
    emptyValue,
    emptyValue,
    emptyValue,
    emptyValue,
    emptyValue,
    emptyValue,
  ];
  const winConditions = [
    [0, 1, 2],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
  ];

  // Public getter methods
  const getEmptyValue = () => emptyValue;

  const getBoard = () => gameboard;

  const getWinConditions = () => winConditions;

  const getCellValue = (cellIndex) => gameboard[cellIndex];

  const getCellsWithToken = (token) => {
    const cells = [];
    gameboard.forEach((value, cellIndex) => {
      if (token === value) {
        cells.push(cellIndex);
      }
    });
    return cells;
  };

  // Public setter methods
  const setCellValue = (cellIndex, value) => (gameboard[cellIndex] = value);

  return {
    getEmptyValue,
    getBoard,
    getWinConditions,
    getCellValue,
    getCellsWithToken,
    setCellValue,
  };
})();

// --------------------------------------------------------------------------

// Player factory
function createPlayer(name, token) {
  // Public methods
  const getName = () => name;

  const getToken = () => token;

  const isWinner = () => {
    const playerCells = board.getCellsWithToken(token);
    const winConditions = board.getWinConditions();

    let currentRowLength = 0;
    for (let winnerRow of winConditions) {
      for (let winnerCell of winnerRow) {
        if (playerCells.includes(winnerCell)) {
          currentRowLength++;
          if (currentRowLength === 3) {
            return true;
          }
        } else {
          currentRowLength = 0;
          break;
        }
      }
    }
    return false;
  };

  return { getName, getToken, isWinner };
}

// --------------------------------------------------------------------------

// Game controller module object
const gameController = (function () {
  // Private properties
  const players = [createPlayer("David", "X"), createPlayer("Mireia", "O")];
  let currentPlayer = players[0];
  let roundCounter = 0;

  // Private methods
  const switchPlayers = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  const addRound = () => {
    roundCounter++;
  };

  const isValidCell = (cellIndex) => {
    const cellValue = board.getCellValue(cellIndex);
    const emptyValue = board.getEmptyValue();
    return cellValue === emptyValue;
  };

  const setTokenToCell = (cellIndex) => {
    board.setCellValue(cellIndex, currentPlayer.getToken());
    displayController.updateCell(cellIndex, currentPlayer.getToken());
  };

  // Public methods
  const getCurrentPlayer = () => currentPlayer;

  const playRound = (event) => {
    const cellIndex = event.target.dataset.index;

    if (isValidCell(cellIndex)) {
      setTokenToCell(cellIndex);

      if (currentPlayer.isWinner()) {
        displayController.displayWinner(currentPlayer);
        displayController.unbindEventListeners();
        return;
      } else if (roundCounter === 8) {
        displayController.displayDraw();
        displayController.unbindEventListeners();
      } else {
        addRound();
        switchPlayers();
        displayController.displayPlayerTurn(currentPlayer);
      }
    }
  };

  return {
    getCurrentPlayer,
    playRound,
  };
})();

// Main execution
(function main() {
  displayController.bindEventListeners();
  displayController.displayPlayerTurn(gameController.getCurrentPlayer());
})();
