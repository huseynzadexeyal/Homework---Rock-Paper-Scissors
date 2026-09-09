// ============================================
// sound.js
// Səslər Web Audio API ilə "canlı" yaradılır — mp3 lazım deyil.
// ============================================

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(frequency, startTime, duration, type = "sine", volume = 0.2) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;

  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

// 🎉 Raund qazananda: qısa şən "ding"
function playWinSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  [659, 880].forEach((freq, i) => {
    playTone(freq, now + i * 0.08, 0.2, "triangle", 0.2);
  });
}

// 😢 Raund uduzanda: enən səs
function playLoseSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(280, now);
  osc.frequency.exponentialRampToValueAtTime(90, now + 0.5);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.5);
}

// 🏆 Bütün matçı qazananda: real "Flawless Victory" mp3
const matchWinAudioEl = document.getElementById("matchWinSound");

function playMatchWinSound() {
  matchWinAudioEl.currentTime = 0;
  matchWinAudioEl.volume = 0.7;
  matchWinAudioEl.play();
}

// 💀 Bütün matçı uduzanda: real mp3
const matchLoseAudioEl = document.getElementById("matchLoseSound");

function playMatchLoseSound() {
  matchLoseAudioEl.currentTime = 0;
  matchLoseAudioEl.volume = 0.7;
  matchLoseAudioEl.play();
}

// 🎵 Fon musiqisi — real mp3 fayl (sounds/bg-music.mp3)
const bgMusicEl = document.getElementById("bgMusic");
let bgMusicOn = false;

function startBackgroundMusic() {
  bgMusicEl.volume = 0.35;
  bgMusicEl.play();
  bgMusicOn = true;
}

function stopBackgroundMusic() {
  bgMusicEl.pause();
  bgMusicOn = false;
}

function toggleBackgroundMusic() {
  if (bgMusicOn) {
    stopBackgroundMusic();
  } else {
    startBackgroundMusic();
  }
  return bgMusicOn;
}
