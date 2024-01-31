// Display controller module object
const displayController = (function () {
  // Cache DOM
  const formView = document.querySelector(".form");
  const gameView = document.querySelector(".game");
  const playerXNameInput = document.querySelector("#player-x-name");
  const playerONameInput = document.querySelector("#player-o-name");
  const submitNamesBtn = document.querySelector("#play");
  const backBtn = document.querySelector("#back");
  const restartBtn = document.querySelector("#restart");
  const displayElement = document.querySelector(".display");
  const boardElement = document.querySelector(".grid");
  const cellElements = document.querySelectorAll(".cell");

  // Public methods
  const addButtonListeners = () => {
    submitNamesBtn.addEventListener("click", (event) =>
      gameController.setNewGame(playerXNameInput.value, playerONameInput.value)
    );

    restartBtn.addEventListener("click", gameController.resetGame);

    backBtn.addEventListener("click", switchViews);
  };

  const addGameListeners = () => {
    boardElement.addEventListener("click", gameController.playRound);
  };

  const removeGameListeners = () => {
    boardElement.removeEventListener("click", gameController.playRound);
  };

  const switchViews = () => {
    formView.classList.toggle("hidden");
    gameView.classList.toggle("hidden");
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

  const displayWinnerRow = (winnerRow) => {
    console.log(winnerRow);
    winnerRow.forEach((cellIndex) => displayWinnerCell(cellIndex));
  };

  const displayWinnerCell = (cellIndex) => {
    console.log("add winner cell", cellIndex);
    cellElements[cellIndex].classList.add("winner");
  };

  const removeWinnerCell = (cellIndex) => {
    console.log("remove winner cell", cellIndex);
    cellElements[cellIndex].classList.remove("winner");
  };

  const resetView = () => {
    const currentPlayer = gameController.getCurrentPlayer();
    const boardCopy = board.getBoard();
    const emptyValue = board.getEmptyValue();

    displayPlayerTurn(currentPlayer);

    boardCopy.forEach((value, cellIndex) => {
      updateCell(cellIndex, emptyValue);
      removeWinnerCell(cellIndex);
    });
  };

  return {
    addButtonListeners,
    addGameListeners,
    removeGameListeners,
    switchViews,
    displayPlayerTurn,
    displayWinner,
    displayDraw,
    updateCell,
    displayWinnerRow,
    resetView,
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
  let winnerRow = [null, null, null];

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

  const getWinnerRow = () => winnerRow;

  // Public setter methods
  const setCellValue = (cellIndex, value) => (gameboard[cellIndex] = value);

  const setWinnerRow = (row) => (winnerRow = row);

  const resetWinnerRow = () => (winnerRow = [null, null, null]);

  // Other methods
  const resetBoard = () => {
    gameboard.forEach((value, cellIndex) => {
      board.setCellValue(cellIndex, emptyValue);
    });
    resetWinnerRow();
  };

  return {
    getEmptyValue,
    getBoard,
    getWinConditions,
    getCellValue,
    getCellsWithToken,
    getWinnerRow,
    setCellValue,
    setWinnerRow,
    resetBoard,
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
            board.setWinnerRow(winnerRow);
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
  const players = [null, null];
  let currentPlayer = null;
  let roundCounter = 0;

  // Private methods
  const setPlayers = (playerXName, playerOName) => {
    if (!playerXName) playerXName = "Player X";
    if (!playerOName) playerOName = "Player O";

    players[0] = createPlayer(playerXName, "X");
    players[1] = createPlayer(playerOName, "O");
    return;
  };

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
        displayController.displayWinnerRow(board.getWinnerRow());
        displayController.displayWinner(currentPlayer);
        displayController.removeGameListeners();
        return;
      } else if (roundCounter === 8) {
        displayController.displayDraw();
        displayController.removeGameListeners();
      } else {
        addRound();
        switchPlayers();
        displayController.displayPlayerTurn(currentPlayer);
      }
    }
  };

  const resetGameState = () => {
    currentPlayer = players[0];
    roundCounter = 0;
  };

  const setNewGame = (playerXName, playerOName) => {
    event.preventDefault();
    setPlayers(playerXName, playerOName);
    resetGame();
    displayController.switchViews();
  };

  const resetGame = () => {
    resetGameState();
    board.resetBoard();
    displayController.resetView();
    displayController.addGameListeners();
  };

  return {
    getCurrentPlayer,
    playRound,
    setNewGame,
    resetGame,
  };
})();

displayController.addButtonListeners();
