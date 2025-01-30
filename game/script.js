/*Select elements*/
const cells = document.querySelectorAll('.board__cell');
const restartBtn = document.querySelector('.game-restart-btn');
const popup = document.querySelector('.popup');
const popupMessage = document.getElementById('message');
const popupRestartBtn = document.querySelector('.popup__restart-btn');

/*Winning combinations*/
const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

let board = Array(9).fill("");
let currentPlayer = "O";
let gameActive = true;

/*Initialize the game*/
function init() {
  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
  });
  restartBtn.addEventListener('click', restartGame);
  popupRestartBtn.addEventListener('click', restartGame);
}

/*Handle cell click*/
function handleCellClick(cell, index) {
  if (board[index] !== "" || !gameActive || currentPlayer === "X") return;
  makeMove(cell, index, currentPlayer);
  checkWinner();
}

/*Make a move*/
function makeMove(cell, index, player) {
  board[index] = player;
  cell.textContent = player;
}

/*Change player*/
function changePlayer() {
  currentPlayer = currentPlayer === "O" ? "X" : "O";
  if (currentPlayer === "X" && gameActive) {
    setTimeout(aiMove, 500);
  }
}

/*AI makes its move with a better strategy*/
function aiMove() {
	if (!gameActive) return;

	/*Check if the AI can win in the next move*/
	let moveIndex = findBestMove("X");
	if (moveIndex !== null) {
		makeMove(cells[moveIndex], moveIndex, "X");
		checkWinner();
		return;
	}

	/*If AI can't win, block the opponent if they are close to winning*/
	moveIndex = findBestMove("O");
	if (moveIndex !== null) {
		makeMove(cells[moveIndex], moveIndex, "X");
		checkWinner();
		return;
	}

	/*If there are no critical situations, choose the center if it's available*/
	if (board[4] === "") {
		makeMove(cells[4], 4, "X");
		checkWinner();
		return;
	}

	/*If the center is not available, choose a random remaining empty spot*/
	let emptyCells = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
	moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
	makeMove(cells[moveIndex], moveIndex, "X");
	checkWinner();
}

/*Function to find the best move to win or block the opponent*/
function findBestMove(player) {
	for (let condition of winConditions) {
		let [a, b, c] = condition;
		let values = [board[a], board[b], board[c]];
		
		/*If AI or the player has two matching marks and one empty spot, play there*/
		if (values.filter(v => v === player).length === 2 && values.includes("")) {
			return condition[values.indexOf("")];
		}
	}
	return null;
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

// End the game
function endGame(message) {
  popupMessage.textContent = message;
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
