// ===== PENGATURAN: GANTI PIN DAN PATH MUSIK DI SINI =====
const CONFIG = {
  pin: "141106", // PIN 6 angka; ganti sesuai keinginanmu
  musicPath: "assets/alex_crichton_what_if_i_call.mp3",
  nextPage: "celebration.html"
};
// ========================================================

const screens = ["loadingScreen","pinScreen","giftScreen","flowerScreen"].map(id => document.getElementById(id));
const loadingScreen = document.getElementById("loadingScreen");
const pinScreen = document.getElementById("pinScreen");
const giftScreen = document.getElementById("giftScreen");
const flowerScreen = document.getElementById("flowerScreen");
const dots = [...document.querySelectorAll("#pinDots i")];
const pinStatus = document.getElementById("pinStatus");
const popup = document.getElementById("errorPopup");
const input = [];
let checking = false;
let flowersCreated = false;
const music = document.getElementById("backgroundMusic");
document.querySelector("#backgroundMusic source").src = CONFIG.musicPath;
music.load();

function showScreen(target) {
  screens.forEach(screen => screen.classList.remove("active"));
  target.classList.add("active");
}
function updateDots() { dots.forEach((dot, i) => dot.classList.toggle("filled", i < input.length)); }
function clearPin() { input.length = 0; updateDots(); pinStatus.textContent = "Masukkan enam angka"; }
function addDigit(digit) {
  if (checking || popup.classList.contains("open") || input.length >= 6) return;

  // Musik mulai saat angka PIN pertama ditekan.
  if (input.length === 0) {
    tryStartMusic();
  }

  input.push(digit);
  updateDots();

  if (input.length === 6) checkPin();
}

function checkPin() {
  checking = true;

  if (input.join("") === CONFIG.pin) {
    pinStatus.textContent = "PIN benar! Menyiapkan kejutan...";

    setTimeout(() => {
      showScreen(giftScreen);
      checking = false;
    }, 450);

  } else {
    pinStatus.textContent = "PIN belum cocok";

    setTimeout(() => {
      popup.classList.add("open");
      popup.setAttribute("aria-hidden", "false");
      checking = false;
    }, 220);
  }
}

document.getElementById("keypad").addEventListener("click", event => {
  const key = event.target.closest("[data-digit]");
  if (key) addDigit(key.dataset.digit);
});
document.getElementById("deleteDigit").addEventListener("click", () => {
  if (checking || popup.classList.contains("open")) return;
  input.pop(); updateDots(); pinStatus.textContent = "Masukkan enam angka";
});
document.getElementById("tryAgainButton").addEventListener("click", () => {
  popup.classList.remove("open"); popup.setAttribute("aria-hidden","true"); clearPin();
});
document.addEventListener("keydown", event => {
  if (!pinScreen.classList.contains("active")) return;
  if (/^\\d$/.test(event.key)) addDigit(event.key);
  if (event.key === "Backspace" && !checking) { input.pop(); updateDots(); }
});


async function tryStartMusic() {
  const music = document.getElementById("backgroundMusic");

  if (!music) {
    console.error("Elemen backgroundMusic tidak ditemukan.");
    return;
  }

  try {
    music.volume = 0.5;
    await music.play();
    console.log("Musik berhasil diputar.");
  } catch (error) {
    console.error("Musik gagal diputar:", error);
  }
}


document.getElementById("giftButton").addEventListener("click", () => {
  showScreen(flowerScreen);
  createFlowers();

  setTimeout(() => {
    flowerScreen.classList.add("show-message");
  }, 2500);

  setTimeout(() => {
    startFireworks();
  }, 1800);
});

function createFlowers() {
  if (flowersCreated) return;
  flowersCreated = true;
  const field = document.getElementById("flowerField");
  const flowers = ["🌷","🌸","🌼","🌺","💐","🌹","🌻","🌷","🌸"];
  const count = innerWidth < 500 ? 48 : 75;
  for (let i=0; i<count; i++) {
    const flower = document.createElement("span");
    flower.className = "flower";
    flower.textContent = flowers[Math.floor(Math.random()*flowers.length)];
    flower.style.setProperty("--x", `${Math.random()*100}%`);
    flower.style.setProperty("--y", `${Math.random()*83}%`);
    flower.style.setProperty("--size", `${60+Math.random()*50}px`);
    flower.style.setProperty("--duration", `${1.1+Math.random()*1.7}s`);
    flower.style.setProperty("--delay", `${Math.random()*1.1}s`);
    flower.style.setProperty("--drift", `${-28+Math.random()*56}px`);
    flower.style.setProperty("--rotation", `${-70+Math.random()*140}deg`);
    field.appendChild(flower);
  }
}

document.getElementById("continueButton").addEventListener("click", () => {
  const gameScreen = document.getElementById("miniGameScreen");

  if (gameScreen) {
    gameScreen.style.setProperty("display", "flex", "important");
    gameScreen.scrollIntoView({ behavior: "smooth" });

    window.startUnicornGame?.();
  }
});


// Background star field.
const starField = document.getElementById("stars");
for (let i=0; i<90; i++) {
  const star = document.createElement("span");
  star.className = "star";
  star.style.left = `${Math.random()*100}%`;
  star.style.top = `${Math.random()*100}%`;
  star.style.setProperty("--duration", `${2.4+Math.random()*4.5}s`);
  star.style.setProperty("--delay", `${Math.random()*-5}s`);
  starField.appendChild(star);
}
window.addEventListener("load", () => setTimeout(() => showScreen(pinScreen), 2100));


let fireworksStarted = false;

function startFireworks() {
  if (fireworksStarted) return;
  fireworksStarted = true;

  const canvas = document.getElementById("fireworksCanvas");

  if (!canvas) {
    console.error("Canvas tidak ditemukan!");
    return;
  }

  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let particles = [];
  let rockets = [];

  const colors = [
    "#ff9fcf",
    "#ffd6f6",
    "#ffe9a8",
    "#b9eaff",
    "#c8b5ff",
    "#ffffff"
  ];

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    width = canvas.clientWidth;
    height = canvas.clientHeight;

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function explode(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];

    particles.push({
      x, y,
      vx: 0,
      vy: 0,
      life: 12,
      maxLife: 12,
      size: 30,
      color,
      flash: true
    });

    for (let i = 0; i < 95; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4.2;

      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 45 + Math.random() * 35,
        maxLife: 80,
        size: 1 + Math.random() * 2.5,
        color,
        flash: false
      });
    }
  }

  function launchRocket() {
    rockets.push({
      x: width * (0.12 + Math.random() * 0.76),
      y: height + 10,
      targetY: height * (0.12 + Math.random() * 0.35),
      speed: 5 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      trail: []
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    if (Math.random() < 0.045) {
      launchRocket();
    }

    rockets = rockets.filter(rocket => {
      rocket.trail.push({ x: rocket.x, y: rocket.y });

      if (rocket.trail.length > 7) {
        rocket.trail.shift();
      }

      rocket.y -= rocket.speed;

      rocket.trail.forEach((point, index) => {
        ctx.globalAlpha = index / rocket.trail.length;
        ctx.fillStyle = rocket.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (rocket.y <= rocket.targetY) {
        explode(rocket.x, rocket.y);
        return false;
      }

      return true;
    });

    particles = particles.filter(p => p.life > 0);

    particles.forEach(p => {
      p.life--;

      if (p.flash) {
        const radius = p.size * (1 - p.life / p.maxLife);

        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 35;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        return;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.vy += 0.025;

      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize);

  setTimeout(() => explode(width * 0.22, height * 0.25), 200);
  setTimeout(() => explode(width * 0.78, height * 0.30), 700);
  setTimeout(() => explode(width * 0.50, height * 0.18), 1200);

  animate();
}



/* ===== MINI GAME: CATCH THE UNICORN ===== */
(() => {
  const gameArea = document.getElementById("unicornGameArea");
  const startButton = document.getElementById("startUnicornGame");
  const retryButton = document.getElementById("retryUnicornGame");
  const countDisplay = document.getElementById("unicornCount");
  const message = document.getElementById("unicornGameMessage");
  const winPanel = document.getElementById("unicornWinPanel");
  const losePanel = document.getElementById("unicornLosePanel");
  const surpriseButton = document.getElementById("openBirthdaySurprise");
  const surpriseMessage = document.getElementById("birthdaySurpriseMessage");

  
  if (
    !gameArea || !startButton || !retryButton ||
    !countDisplay || !message ||
    !winPanel || !losePanel || !surpriseButton || !surpriseMessage
  ) return;


  const totalUnicorns = 10;

  const sweetMessages = [
    "Cewe sederhana yang aku temui 😊",
    "Pengen liat kamu ngaji lagi hehe 💌 ",
    "Sehat selalu buat alynne ✨",
    "Jangan lupa senyum hari ini! ✨",
    "Semoga selalu bahagia 🌷",
    "Jangan pernah merasa sendiri 💗",
    "Lancar selalu usahanya yaa 💌",
    "Semoga semua mimpi kamu tercapai! 🌙",
    "Jangan pernah lupa betapa berharganya kamu! 🫶",
    "Happy Birthday! Rahmadania Arrum Pratisa! 🎂💗"
  ];

  let unicorns = [];
  let collected = 0;
  let caught = 0;
  let spawnInterval = null;
  let phase = "idle";

  function clearSpawnInterval() {
    if (spawnInterval !== null) {
      clearInterval(spawnInterval);
      spawnInterval = null;
    }
  }

  function randomPosition() {
    const rect = gameArea.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Sebarkan unicorn di seluruh kotak dengan jarak antartitik.
    const positions = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        positions.push({
          x: 10 + col * 26 + Math.random() * 8,
          y: 14 + row * 24 + Math.random() * 8
        });
      }
    }

    // Acak posisi, lalu pilih yang cukup jauh dari unicorn lain.
    positions.sort(() => Math.random() - 0.5);

    const available = positions.filter(pos =>
      unicorns.every(existing => {
        const dx = pos.x - existing.x;
        const dy = pos.y - existing.y;
        return Math.sqrt(dx * dx + dy * dy) > 16;
      })
    );

    if (available.length) {
      return available[0];
    }

    return {
      x: 10 + Math.random() * 80,
      y: 12 + Math.random() * 76
    };
  }


function showBubble(text, x, y) {
  const bubble = document.createElement("div");
  bubble.className = "unicorn-message-bubble";
  bubble.textContent = text;

  // Tambahkan balon ke area game agar ukurannya bisa dihitung
  bubble.style.left = "0px";
  bubble.style.top = "0px";
  gameArea.appendChild(bubble);

  requestAnimationFrame(() => {
    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;
    const bubbleWidth = bubble.offsetWidth;
    const bubbleHeight = bubble.offsetHeight;
    const margin = 10;

    // Posisi unicorn dalam piksel
    const targetX = (x / 100) * areaWidth;
    const targetY = (y / 100) * areaHeight;

    // Pastikan balon tidak keluar dari sisi kiri atau kanan
    const minX = bubbleWidth / 2 + margin;
    const maxX = areaWidth - bubbleWidth / 2 - margin;
    const left = Math.max(minX, Math.min(maxX, targetX));

    // Letakkan balon di atas unicorn
    // Jika terlalu dekat atas, pindahkan ke bawah unicorn
    let top = targetY - 12;

    if (top - bubbleHeight < margin) {
      top = targetY + bubbleHeight + 20;
    }

    // Batasi posisi agar tetap di dalam area game
    top = Math.max(
      bubbleHeight + margin,
      Math.min(areaHeight - margin, top)
    );

    bubble.style.left = `${left}px`;
    bubble.style.top = `${top}px`;
  });

  window.setTimeout(() => {
    bubble.classList.add("bubble-fade-out");
    window.setTimeout(() => bubble.remove(), 350);
  }, 2300);
}



  function resetGame() {
    clearSpawnInterval();

    collected = 0;
    caught = 0;
    unicorns = [];
    phase = "idle";

    countDisplay.textContent = "0";
    message.textContent = "Siap mengumpulkan unicorn? 💗";

    gameArea.innerHTML = `
      <div class="unicorn-intro">
        <span>🦄</span>
        <p>Sepuluh unicorn ajaib menunggumu!</p>
      </div>
    `;

    winPanel.hidden = true;
    losePanel.hidden = true;
    surpriseMessage.hidden = true;
    startButton.hidden = false;
    retryButton.hidden = true;
    surpriseButton.hidden = false;
  }

  function finishCollection() {
    clearSpawnInterval();
    phase = "catch";

    message.textContent =
      "Yeay, 10 unicorn terkumpul! Sekarang tekan satu per satu 💌";

    unicorns.forEach(unicorn => {
      unicorn.button.disabled = false;
      unicorn.button.classList.add("unicorn-ready");
      unicorn.button.setAttribute("aria-label", "Tekan untuk membuka pesan");
    });
  }

  function finishGame() {
    phase = "done";
    message.textContent =
      "Kamu sudah membuka semua 10 pesan! Semoga kamu tersenyum 💗";

    winPanel.hidden = false;
    losePanel.hidden = true;
    startButton.hidden = true;
    surpriseButton.hidden = false;
  }

  function createUnicorn() {
    const pos = randomPosition();
    const button = document.createElement("button");

    button.type = "button";
    button.className = "unicorn-target";
    button.textContent = "🦄";
    button.disabled = true;
    button.setAttribute("aria-label", "Unicorn yang belum bisa ditekan");

    button.style.left = `${pos.x}%`;
    button.style.top = `${pos.y}%`;
    button.style.setProperty("--float-delay", `${Math.random() * -2}s`);

    const unicorn = {
      button,
      x: pos.x,
      y: pos.y,
      index: collected
    };

    button.addEventListener("click", () => {
      if (phase !== "catch" || button.disabled) return;

      button.disabled = true;
      button.classList.add("unicorn-caught");

      showBubble(sweetMessages[unicorn.index], unicorn.x, unicorn.y);

      window.setTimeout(() => button.remove(), 180);

      caught++;
      countDisplay.textContent = `${caught}`;

      if (caught >= totalUnicorns) {
        finishGame();
      } else {
        message.textContent =
          `Pesan terbuka ${caught}/10 💌 Lanjut tekan unicorn lainnya!`;
      }
    });

    unicorns.push(unicorn);
    gameArea.appendChild(button);
    collected++;

    countDisplay.textContent = `${collected}`;

    if (collected < totalUnicorns) {
      message.textContent =
        `Lihat! Unicorn ajaib muncul 💫 ${collected}/10`;
    } else {
      finishCollection();
    }
  }

  function startGame() {
    resetGame();

    phase = "collect";
    startButton.hidden = true;
    message.textContent = "Mengumpulkan unicorn ajaib... 🦄";

    // Muncul satu per satu, tetapi unicorn sebelumnya tetap ada.
    gameArea.innerHTML = "";
    createUnicorn();

    spawnInterval = window.setInterval(() => {
      if (phase !== "collect") {
        clearSpawnInterval();
        return;
      }

      createUnicorn();

      if (collected >= totalUnicorns) {
        clearSpawnInterval();
      }
    }, 450);
  }

  window.startUnicornGame = startGame;

  startButton.addEventListener("click", startGame);
  retryButton.addEventListener("click", startGame);

  
surpriseButton.addEventListener("click", () => {
  if (phase === "done") {
    const music = document.getElementById("backgroundMusic");

    if (music) {
      sessionStorage.setItem("alexMusicTime", String(music.currentTime));
      sessionStorage.setItem(
        "alexMusicShouldPlay",
        String(!music.paused)
      );
    }

    window.location.href = "galaxy.html";
  }
});


  resetGame();
})();


/* ===== BERHENTIKAN MUSIK SAAT TAP TO CONTINUE ===== */

// Sesuaikan ID ini dengan tombol Tap to Continue di HTML.

function stopWelcomeMusic() {
  if (!music) return;

  music.pause();
  music.currentTime = 0;
}

