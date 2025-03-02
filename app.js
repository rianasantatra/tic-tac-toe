const btnOptions = document.querySelectorAll(".btn-option");
const restartBtn = document.querySelector("#restart");
const popup = document.querySelector(".popup");
const newGameBtn = document.querySelector("#new-game");
const message = document.querySelector("#message");

let currentPlayer = "X";
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Lignes
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Colonnes
  [0, 4, 8],
  [2, 4, 6], // Diagonales
];

btnOptions.forEach((btn, index) => {
  btn.addEventListener("click", () => handlePlayerMove(index));
});

restartBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);

function handlePlayerMove(index) {
  if (gameActive && board[index] === "") {
    makeMove(index, "X");
    if (gameActive) {
      setTimeout(aiMove, 500); // Petit délai pour rendre le jeu plus naturel
    }
  }
}

function makeMove(index, player) {
  board[index] = player;
  btnOptions[index].textContent = player;
  checkGameStatus();
}

function aiMove() {
  let availableMoves = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      availableMoves.push(i);
    }
  }
  if (Math.random() < 0.35) {
    let randomMove =
      availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(randomMove, "O");
  } else {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, 0, false);
        board[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    makeMove(move, "O");
  }
}

function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  if (result !== null) {
    return result === "O" ? 10 - depth : result === "X" ? depth - 10 : 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkGameStatus() {
  let winner = checkWinner();
  if (winner) {
    showPopup(winner === "X" ? "You win !" : "You lose !");
    gameActive = false;
  } else if (!board.includes("")) {
    showPopup("Match nul !");
    gameActive = false;
  }
}

function checkWinner() {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes("") ? null : "tie";
}

function showPopup(msg) {
  message.textContent = msg;
  popup.classList.remove("hide");
}

function resetGame() {
  currentPlayer = "X";
  gameActive = true;
  board = ["", "", "", "", "", "", "", "", ""];
  btnOptions.forEach((btn) => (btn.textContent = ""));
  popup.classList.add("hide");
}
