// Game board module object
const board = (function () {
  // Private properties
  const emptyCell = " ";
  const gameboard = [
    emptyCell,
    emptyCell,
    emptyCell,
    emptyCell,
    emptyCell,
    emptyCell,
    emptyCell,
    emptyCell,
    emptyCell,
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
  const getEmptyCellValue = () => emptyCell;
  const getWinConditions = () => winConditions;
  const getCellValue = (cell) => gameboard[cell];
  const getCellsWithToken = (token) => {
    const cells = [];
    gameboard.forEach((value, cell) => {
      if (token === value) {
        cells.push(cell);
      }
    });
    return cells;
  };

  // Public setter methods
  const setCellValue = (cell, value) => (gameboard[cell] = value);

  // Other public methods
  const displayBoard = () => {
    let boardDisplay = "\n ";

    gameboard.forEach((cell, index) => {
      boardDisplay += cell;
      index++;

      if (index % 9 === 0) {
        boardDisplay += "\n\n";
      } else if (index % 3 === 0) {
        boardDisplay += "\n-----------\n ";
        index++;
      } else {
        boardDisplay += ` | `;
      }
    });

    console.log(boardDisplay);
  };

  return {
    getEmptyCellValue,
    getWinConditions,
    getCellValue,
    getCellsWithToken,
    setCellValue,
    displayBoard,
  };
})();

// Player factory
function createPlayer(name, token, isHuman) {
  // Private properties
  let winner = false;

  // Public getter methods
  const getName = () => name;
  const getToken = () => token;
  const getIsHuman = () => isHuman;

  const isWinner = () => {
    const playerCells = board.getCellsWithToken(token);

    let currentRowLength = 0;
    for (let winnerRow of board.getWinConditions()) {
      for (let winnerCell of winnerRow) {
        if (playerCells.includes(winnerCell)) {
          currentRowLength++;
          // console.log("potential winner found");
          if (currentRowLength === 3) {
            setWinner();
            // console.log("winner found");
            return true;
          }
        } else {
          currentRowLength = 0;
          // console.log("nothing found");
          break;
        }
      }
    }
    return false;
  };

  const setWinner = () => (winner = true);

  return { getName, getToken, getIsHuman, isWinner };
}

// Game controller module object
const gameControler = (function () {
  // Private properties
  const players = [
    createPlayer("David", "X", false),
    createPlayer("Mireia", "O", false),
  ];
  let currentPlayer = players[0];

  // Private methods
  const switchCurrentPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  // Player move related methods
  const getRandomInt = (max) => Math.floor(Math.random() * max);

  const getRandomMove = () => getRandomInt(9);

  const getMoveFromPrompt = () =>
    Number(prompt(`${currentPlayer.getName()} make your move (0-8)`));

  const getMove = (player) =>
    player.getIsHuman() ? getMoveFromPrompt() : getRandomMove();

  const getValidMove = (player) => {
    const isInRange = (cell) => cell >= 0 && cell <= 8;
    const isAvailable = (cell) =>
      board.getCellValue(cell) === board.getEmptyCellValue();
    const isValid = (cell) => isInRange(cell) && isAvailable(cell);

    let cell;
    do {
      cell = getMove(player);
    } while (!isValid(cell));

    return cell;
  };

  const setPlayerMove = (cell) => {
    board.setCellValue(cell, currentPlayer.getToken());
  };

  // Display related methods
  const displayCurrentPlayer = () => {
    console.log(`${currentPlayer.getName()}'s turn`);
  };

  const displayGameState = () => {
    console.clear();
    displayCurrentPlayer();
    board.displayBoard();
  };

  const displayGameResult = (winner) => {
    if (winner) {
      displayGameState();
      console.log(`${winner.getName()} has won!`);
    } else {
      displayGameState();
      console.log("It's a draw!");
    }
  };

  // Main game loop public method
  const playGame = () => {
    for (let i = 0; i < 9; i++) {
      displayGameState();
      setPlayerMove(getValidMove(currentPlayer));
      if (currentPlayer.isWinner()) {
        displayGameResult(currentPlayer);
        return;
      }
      switchCurrentPlayer();
    }
    displayGameResult();
  };

  return {
    playGame,
  };
})();

gameControler.playGame();
