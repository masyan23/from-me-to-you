// ================== BAGIAN YANG BISA KAMU EDIT ==================
const CONFIG = {
  name: "Rahmadania Arrum Pratisa",
  songLabel: "A special song",
  // Format tanggal: TAHUN, BULAN (0 = Januari), TANGGAL.
  nextBirthday: new Date(2027, 11, 14, 0, 0, 0),
  nextAge: 17,
  birthdayDateLabel: "14 NOVEMBER 2027",
  greeting: "Semoga setiap langkahmu dipenuhi kebahagiaan, keberanian untuk mengejar mimpi, dan orang-orang baik yang selalu mendukungmu. Keep shining! ✨"
};
// ================================================================

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

setText("birthdayName", CONFIG.name);
setText("songLabel", CONFIG.songLabel);
setText("nextAge", CONFIG.nextAge);
setText("birthdayDateLabel", CONFIG.birthdayDateLabel);
setText("greetingText", CONFIG.greeting);

// Tiny stars in the background.
const starsContainer = document.getElementById("stars");
for (let i = 0; i < 95; i++) {
  const star = document.createElement("span");
  star.className = "star";
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.setProperty("--duration", `${2.4 + Math.random() * 4.8}s`);
  star.style.setProperty("--delay", `${Math.random() * -6}s`);
  if (Math.random() > 0.8) {
    star.style.width = "3px";
    star.style.height = "3px";
  }
  starsContainer.appendChild(star);
}

// Countdown timer.

function updateCountdown() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  // Lewati countdown jika elemennya sudah dihapus dari HTML.
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const now = new Date();
  const distance = CONFIG.nextBirthday.getTime() - now.getTime();
  const safeDistance = Math.max(0, distance);

  const days = Math.floor(safeDistance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safeDistance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((safeDistance / (1000 * 60)) % 60);
  const seconds = Math.floor((safeDistance / 1000) % 60);

  daysEl.textContent = String(days).padStart(3, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


 // Greeting modal and video.
const modal = document.getElementById("greetingModal");
const openButton = document.getElementById("openGreeting");
const closeButton = document.getElementById("closeGreeting");
const greetingVideo = document.getElementById("greetingVideo");

function openModal() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  greetingVideo.pause();
  greetingVideo.currentTime = 0;
}

openButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});


/* Tombol CLOSE Happy Birthday menuju halaman game */
const continueButton = document.getElementById("continueButton");
const miniGameScreen = document.getElementById("miniGameScreen");

if (continueButton && miniGameScreen) {
  continueButton.addEventListener("click", () => {
    miniGameScreen.classList.add("active");
  });
}


// Optional music: put your own file at assets/music.mp3.
// Most browsers require a user gesture before playing audio.

const audio = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
let musicPlaying = false;

if (audio && musicToggle) {
  musicToggle.addEventListener("click", async () => {
    if (!musicPlaying) {
      try {
        await audio.play();
        musicPlaying = true;
        musicToggle.textContent = "Ⅱ";
        musicToggle.setAttribute("aria-label", "Jeda musik");
      } catch (error) {
        alert("Musik belum bisa diputar. Periksa file assets/music.mp3.");
      }
    } else {
      audio.pause();
      musicPlaying = false;
      musicToggle.textContent = "▶";
      musicToggle.setAttribute("aria-label", "Putar musik");
    }
  });
}


/* ===== LOGIKA MINI GAME CATCH THE UNICORN ===== */
(() => {
  const screen = document.getElementById("miniGameScreen");
  const area = document.getElementById("unicornGameArea");
  const count = document.getElementById("unicornCount");
  const timer = document.getElementById("unicornTimer");
  const message = document.getElementById("unicornGameMessage");

  const startButton = document.getElementById("startUnicornGame");
  const retryButton = document.getElementById("retryUnicornGame");
  const winPanel = document.getElementById("unicornWinPanel");
  const losePanel = document.getElementById("unicornLosePanel");
  const surpriseButton = document.getElementById("openBirthdaySurprise");
  const surpriseMessage = document.getElementById("birthdaySurpriseMessage");

  if (
    !screen || !area || !count || !timer || !message ||
    !startButton || !retryButton || !winPanel ||
    !losePanel || !surpriseButton || !surpriseMessage
  ) return;

  const TARGET = 10;
  const DURATION = 20;

  let score = 0;
  let timeLeft = DURATION;
  let running = false;
  let clock = null;
  let spawner = null;

  function stopGameTimers() {
    clearInterval(clock);
    clearInterval(spawner);
    clock = null;
    spawner = null;
  }

  function removeUnicorns() {
    area.querySelectorAll(".unicorn-target").forEach(unicorn => {
      unicorn.remove();
    });
  }

  function updateDisplay() {
    count.textContent = score;
    timer.textContent = timeLeft;
  }

  function createUnicorn() {
    if (!running) return;

    if (area.querySelectorAll(".unicorn-target").length >= 4) return;

    const unicorn = document.createElement("button");
    unicorn.type = "button";
    unicorn.className = "unicorn-target";
    unicorn.textContent = "🦄";
    unicorn.setAttribute("aria-label", "Tangkap unicorn");

    const maxX = Math.max(0, area.clientWidth - 56);
    const maxY = Math.max(0, area.clientHeight - 56);

    unicorn.style.left = Math.random() * maxX + "px";
    unicorn.style.top = Math.random() * maxY + "px";

    unicorn.addEventListener("click", () => {
      if (!running) return;

      unicorn.remove();
      score++;
      updateDisplay();

      message.textContent = [
        "Yeay, dapat satu! 💖",
        "Kamu hebat! ✨",
        "Ayo, sedikit lagi! 🦄"
      ][Math.floor(Math.random() * 3)];

      if (score >= TARGET) {
        endGame(true);
      } else {
        createUnicorn();
      }
    });

    area.appendChild(unicorn);
  }

  function startGame() {
    stopGameTimers();

    score = 0;
    timeLeft = DURATION;
    running = true;

    updateDisplay();
    removeUnicorns();

    area.querySelectorAll(".unicorn-intro").forEach(el => el.remove());

    winPanel.hidden = true;
    losePanel.hidden = true;
    surpriseMessage.hidden = true;
    startButton.hidden = true;

    message.textContent = "Tangkap 10 unicorn sebelum waktu habis! 💕";

    createUnicorn();

    spawner = setInterval(createUnicorn, 650);

    clock = setInterval(() => {
      timeLeft--;
      updateDisplay();

      if (timeLeft <= 0) {
        endGame(score >= TARGET);
      }
    }, 1000);
  }

  function endGame(won) {
    if (!running) return;

    running = false;
    stopGameTimers();
    removeUnicorns();

    startButton.hidden = true;
    winPanel.hidden = !won;
    losePanel.hidden = won;

    if (won) {
      message.textContent = "Misi berhasil! 🎉";
    } else {
      message.textContent = "Waktunya habis! Coba lagi, ya 💗";
    }
  }

  startButton.addEventListener("click", startGame);
  retryButton.addEventListener("click", startGame);

  surpriseButton.addEventListener("click", () => {
    if (score < TARGET) return;

    surpriseMessage.hidden = false;
    winPanel.hidden = true;

    // Hujan emoji sebagai efek kejutan.
    const emojis = ["💖", "✨", "🎉", "💕", "🌸", "🎁"];

    for (let i = 0; i < 25; i++) {
      const piece = document.createElement("span");
      piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      piece.style.cssText = `
        position: fixed;
        top: -35px;
        left: ${Math.random() * 95}%;
        z-index: 10001;
        pointer-events: none;
        font-size: ${18 + Math.random() * 16}px;
        animation: birthdayEmojiFall ${2 + Math.random() * 2}s linear forwards;
      `;

      document.body.appendChild(piece);

      piece.addEventListener("animationend", () => {
        piece.remove();
      }, { once: true });
    }
  });

  // Fungsi ini dipanggil ketika tombol CLOSE ditekan.
  window.showMiniGameScreen = function () {
    screen.classList.add("active");
    screen.scrollTop = 0;
  };

})();

// TOMBOL KEMBALI KE HALAMAN AWAL GALAXY
const backToBeginning = document.getElementById("backToBeginning");

if (backToBeginning) {
  backToBeginning.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
