// ============================================
// ui.js
// DOM ilə işləyir: düymələr, avatarlar, hesab, oyun bitişi.
// ============================================

// --- Vəziyyət ---
let playerScore = 0;
let computerScore = 0;
let matchOver = false;

// --- DOM elementləri ---
const choiceButtons = document.querySelectorAll(".choice-btn");
const resultEl = document.getElementById("result");
const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");
const playerAvatarEl = document.getElementById("playerAvatar");
const computerAvatarEl = document.getElementById("computerAvatar");
const resetBtn = document.getElementById("resetBtn");
const musicBtn = document.getElementById("musicBtn");
const confettiContainer = document.getElementById("confettiContainer");

const ICONS = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};

const RESULT_MESSAGES = {
  win: "Bu raundu sən qazandın!",
  lose: "Bu raundu kompüter qazandı!",
  draw: "Heç-heçə — eyni seçim!",
};

// --- Köməkçi funksiyalar ---

function updateScoreboard() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

function flashAvatar(el, className) {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function updateResultText(text, className) {
  resultEl.classList.remove("win", "lose", "draw", "match-win");
  resultEl.classList.add(className);
  resultEl.textContent = text;
}

function launchConfetti() {
  const colors = ["#7ed957", "#ffd447", "#4dd0e1", "#ff5e5e", "#c77dff"];
  const pieceCount = 60;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";

    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = 1.2 + Math.random() * 0.8 + "s";
    piece.style.animationDelay = Math.random() * 0.3 + "s";

    confettiContainer.appendChild(piece);

    // Animasiya bitəndən sonra elementi DOM-dan sil ki, yığılmasın
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function endMatch(winnerIsPlayer) {
  matchOver = true;

  if (winnerIsPlayer) {
    updateResultText("🏆 Sən matçı qazandın!", "match-win");
    playerAvatarEl.classList.add("win-glow");
    playMatchWinSound();
    launchConfetti();
  } else {
    updateResultText("💀 Kompüter matçı qazandı. Yenidən cəhd et!", "lose");
    computerAvatarEl.classList.add("win-glow");
    playMatchLoseSound();
  }
}

// --- Əsas oyun funksiyası ---
function play(playerChoice) {
  if (matchOver) return; // matç bitibsə klik işləməsin

  const computerChoice = getComputerChoice();
  const result = getResult(playerChoice, computerChoice);

  playerAvatarEl.textContent = ICONS[playerChoice];
  computerAvatarEl.textContent = ICONS[computerChoice];

  if (result === "win") {
    playerScore++;
    flashAvatar(computerAvatarEl, "shake");
    updateResultText(RESULT_MESSAGES.win, "win");
    playWinSound();
  } else if (result === "lose") {
    computerScore++;
    flashAvatar(playerAvatarEl, "shake");
    updateResultText(RESULT_MESSAGES.lose, "lose");
    playLoseSound();
  } else {
    updateResultText(RESULT_MESSAGES.draw, "draw");
  }

  updateScoreboard();

  // Matç bitib-bitmədiyini yoxla
  if (playerScore >= WIN_TARGET) {
    endMatch(true);
  } else if (computerScore >= WIN_TARGET) {
    endMatch(false);
  }
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  matchOver = false;

  updateScoreboard();
  updateResultText("Qalib olmaq üçün 10 xala çat!", "");
  playerAvatarEl.textContent = "🧑";
  computerAvatarEl.textContent = "🤖";
  playerAvatarEl.classList.remove("win-glow");
  computerAvatarEl.classList.remove("win-glow");
  confettiContainer.innerHTML = "";
}

// --- Event listener-lər ---
choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const playerChoice = button.dataset.choice;
    play(playerChoice);
  });
});

resetBtn.addEventListener("click", resetGame);

musicBtn.addEventListener("click", () => {
  const isOn = toggleBackgroundMusic();
  musicBtn.textContent = isOn ? "🔊 Musiqi" : "🔇 Musiqi";
  musicBtn.classList.toggle("on", isOn);
});
