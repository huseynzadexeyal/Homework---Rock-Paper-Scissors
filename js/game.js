// ============================================
// game.js
// Yalnız oyunun MƏNTİQİ — DOM-a toxunmur.
// ============================================

const CHOICES = ["rock", "paper", "scissors"];

const WINS_AGAINST = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

const WIN_TARGET = 10; // qalib olmaq üçün lazım olan xal

function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[randomIndex];
}

function getResult(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return "draw";
  if (WINS_AGAINST[playerChoice] === computerChoice) return "win";
  return "lose";
}
