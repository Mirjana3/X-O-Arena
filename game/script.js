// Select elements
const cells = document.querySelectorAll('.board__cell');
const restartBtn = document.querySelector('.game-restart-btn');
const popup = document.querySelector('.popup');
const popupMessage = document.getElementById('message');
const popupRestartBtn = document.querySelector('.popup__restart-btn');

// Winning combinations
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "O";
let gameActive = true;

// Initialize the game
function init() {
  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
  });
  restartBtn.addEventListener('click', restartGame);
  popupRestartBtn.addEventListener('click', restartGame);
}

// Handle cell click
function handleCellClick(cell, index) {
  if (board[index] !== "" || !gameActive || currentPlayer === "X") return;
  makeMove(cell, index, currentPlayer);
  checkWinner();
}

// Make a move
function makeMove(cell, index, player) {
  board[index] = player;
  cell.textContent = player;
}

// Change player
function changePlayer() {
  currentPlayer = currentPlayer === "O" ? "X" : "O";
  if (currentPlayer === "X" && gameActive) {
    setTimeout(aiMove, 500);
  }
}

// AI Move (with randomness for easier gameplay)
function aiMove() {
  if (!gameActive) return;
  let moveIndex;
  if (Math.random() < 0.3) {
    const available = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    moveIndex = available[Math.floor(Math.random() * available.length)];
  } else {
    moveIndex = minimax(board, "X").index;
  }
  makeMove(cells[moveIndex], moveIndex, "X");
  checkWinner();
}

// Minimax Algorithm
function minimax(newBoard, player) {
  const availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  if (checkWin("X", newBoard)) return { score: 1 };
  if (checkWin("O", newBoard)) return { score: -1 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = availSpots.map(spot => {
    const move = {};
    move.index = spot;
    newBoard[spot] = player;
    move.score = player === "X" ? minimax(newBoard, "O").score : minimax(newBoard, "X").score;
    newBoard[spot] = "";
    return move;
  });

  return player === "X" ? moves.reduce((best, move) => move.score > best.score ? move : best) : moves.reduce((best, move) => move.score < best.score ? move : best);
}

// Check winner
function checkWinner() {
  let won = winConditions.some(combination => {
    const [a, b, c] = combination;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
  if (won) {
    endGame(`${currentPlayer} Wins!`);
  } else if (!board.includes("")) {
    endGame("It's a Draw!");
  } else {
    changePlayer();
  }
}

// Check win condition for minimax
function checkWin(player, boardState) {
  return winConditions.some(([a, b, c]) => boardState[a] === player && boardState[b] === player && boardState[c] === player);
}

// End the game
function endGame(message) {
  popupMessage.textContent = message;
  popup.classList.remove('hide');
  popup.classList.add('show');
  gameActive = false;
}

// Restart the game
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "O";
  gameActive = true;
  cells.forEach(cell => cell.textContent = "");
  popup.classList.remove('show');
  popup.classList.add('hide');
}

// Start the game
init();
