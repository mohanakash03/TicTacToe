const statusDisplay = document.querySelector('.game--status');
const modeSelector = document.querySelector('.mode-selector');
const playerXScoreDisplay = document.querySelector('.player-x-score'); // Added
const playerOScoreDisplay = document.querySelector('.player-o-score'); // Added

let gameActive = false;
let singlePlayerMode = false;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let playerXScore = 0; // Added
let playerOScore = 0; // Added

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => {
  if (singlePlayerMode && currentPlayer === 'O') {
    return "Computer's turn";
  } else {
    return `It's ${currentPlayer}'s turn`;
  }
};

statusDisplay.innerHTML = currentPlayerTurn();
playerXScoreDisplay.textContent = playerXScore; // Added
playerOScoreDisplay.textContent = playerOScore; // Added

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);
modeSelector.addEventListener('change', handleModeChange);

function handleModeChange() {
  singlePlayerMode = modeSelector.value === 'single' ? true : false;
  handleRestartGame();
}

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();

  if (singlePlayerMode && currentPlayer === 'X' && gameActive) {
    setTimeout(handleComputerMove, 500); // Delay for player's move
  }
}

function handleComputerMove() {
  let emptyCells = gameState.reduce((acc, cell, index) => {
    if (cell === '') {
      acc.push(index);
    }
    return acc;
  }, []);

  if (emptyCells.length === 0) {
    return; // No empty cells left
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const computerMoveIndex = emptyCells[randomIndex];

  const computerCell = document.querySelector(`[data-cell-index="${computerMoveIndex}"]`);

  handleCellPlayed(computerCell, computerMoveIndex);
  handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
}

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === '' || b === '' || c === '') {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }
  if (roundWon) {
    if (currentPlayer === 'X') {
      playerXScore++; // Increment X score
      playerXScoreDisplay.textContent = playerXScore; // Update X score display
    } else {
      playerOScore++; // Increment O score
      playerOScoreDisplay.textContent = playerOScore; // Update O score display
    }
    statusDisplay.innerHTML = winningMessage();
    gameActive = false;
    return;
  }

  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
  }

  handlePlayerChange();
}

function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.innerHTML = currentPlayerTurn();

  // If it's single player mode and it's the computer's turn, handle computer move
  if (singlePlayerMode && currentPlayer === 'O' && gameActive) {
    setTimeout(handleComputerMove, 500);
  }
}

function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X"; // Player starts the game
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.innerHTML = currentPlayerTurn();
  document.querySelectorAll('.cell')
    .forEach(cell => cell.innerHTML = "");

  // Reset scores
  
  playerXScoreDisplay.textContent = playerXScore;
  playerOScoreDisplay.textContent = playerOScore;

  // If it's single player mode and it's the computer's turn, handle computer move
  if (singlePlayerMode && currentPlayer === 'O') {
    setTimeout(handleComputerMove, 500);
  }
}
