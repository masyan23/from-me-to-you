
(() => {
  const starsContainer = document.getElementById("stars");
  const loveButton = document.getElementById("loveButton");
  const extraMessage = document.getElementById("extraMessage");
  const footerNote = document.getElementById("footerNote");

  // Membuat bintang-bintang galaksi
  if (starsContainer) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 130; i++) {
      const star = document.createElement("span");
      star.className = "star";

      const size = Math.random() * 2.5 + 1;

      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.setProperty(
        "--duration",
        `${2 + Math.random() * 4}s`
      );
      star.style.animationDelay = `${Math.random() * 4}s`;

      fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);
  }

  
  // Tombol ucapan terima kasih dengan efek mengetik
  

/* Efek mengetik dan membuka galeri secara bertahap */
if (extraMessage) {
  const originalMessage = extraMessage.textContent
    .replace(/\s+/g, " ")
    .trim();

  const firstSwipe = document.querySelector(
    "#aestheticGallery"
  )?.previousElementSibling;

  const firstGallery = document.getElementById("aestheticGallery");
  const secondSwipe = document.querySelector(".swipe-hint-second");
  const secondGallery = document.getElementById("secondGallery");

  let index = 0;

  extraMessage.textContent = "";
  extraMessage.hidden = false;

  // Sembunyikan semua galeri dan petunjuk swipe di awal
  firstSwipe?.classList.remove("show");
  firstGallery?.classList.remove("show");
  secondSwipe?.classList.remove("show");
  secondGallery?.classList.remove("show");

  function showFirstGallery() {
    firstSwipe?.classList.add("show");
    firstGallery?.classList.add("show");
  }

  if (!originalMessage.length) {
    showFirstGallery();
  } else {
    const typingTimer = window.setInterval(() => {
      extraMessage.textContent += originalMessage.charAt(index);
      index++;

      if (index >= originalMessage.length) {
        window.clearInterval(typingTimer);

        // Setelah mengetik selesai, hanya galeri 1 yang muncul
        showFirstGallery();
      }
    }, 35);
  }

}



/* ===== CAROUSEL FOTO DENGAN EFEK KUAS ===== */
const memoryTrack = document.getElementById("memoryTrack");

if (memoryTrack) {
  const slides = Array.from(
    memoryTrack.querySelectorAll(".memory-slide")
  );

  const prevButton = document.getElementById("prevPhoto");
  const nextButton = document.getElementById("nextPhoto");
  const counter = document.getElementById("photoCounter");

  const dots = Array.from(
    document.querySelectorAll("#carouselDots .carousel-dot")
  );

  const viewport = memoryTrack.parentElement;

  let currentIndex = 0;
  let touchStartX = 0;

  function showPhoto(index) {
    if (!slides.length) return;

    currentIndex = (index + slides.length) % slides.length;

    memoryTrack.style.transform =
      `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });

    if (counter) {
      counter.textContent =
        `${String(currentIndex + 1).padStart(2, "0")} / ` +
        `${String(slides.length).padStart(2, "0")}`;
    }
  }

  prevButton?.addEventListener("click", () => {
    showPhoto(currentIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    showPhoto(currentIndex + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showPhoto(index);
    });
  });

  if (viewport) {
    viewport.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener("touchend", (event) => {
      const touchEndX = event.changedTouches[0].screenX;
      const distance = touchEndX - touchStartX;

      if (Math.abs(distance) > 45) {
        showPhoto(currentIndex + (distance < 0 ? 1 : -1));
      }
    }, { passive: true });
  }

  showPhoto(0);
}


  // ===== MUSIK UNTUK VIDEO KENANGAN =====
  const memoryVideo = document.getElementById("memoryVideo");
  const memorySong = document.getElementById("memorySong");

  // ===== SWIPE HINT BISA DITEKAN =====
  const firstSwipeHint = document.querySelector(
    "#aestheticGallery"
  )?.previousElementSibling;

  const secondSwipeHint = document.getElementById("surpriseHint");
  const firstGallery = document.getElementById("aestheticGallery");
  const secondGallery = document.getElementById("secondGallery");


/* ===== MUSIK LANJUTAN DARI HALAMAN KEJUTAN ===== */
const backgroundMusic = document.getElementById("backgroundMusic");

if (backgroundMusic) {
  const savedTime = Number(
    sessionStorage.getItem("alexMusicTime") || 0
  );

  const shouldPlay =
    sessionStorage.getItem("alexMusicShouldPlay") === "true";

  let alexMusicStopped = false;

  const resumeAlexMusic = async () => {
    if (alexMusicStopped || !shouldPlay || !backgroundMusic.paused) {
      return;
    }

    try {
      await backgroundMusic.play();
    } catch (error) {
      console.log("Musik menunggu izin browser untuk diputar.");
    }
  };

  backgroundMusic.volume = 0.5;

  backgroundMusic.addEventListener("loadedmetadata", async () => {
    if (savedTime > 0 && Number.isFinite(savedTime)) {
      backgroundMusic.currentTime = Math.min(
        savedTime,
        Math.max(0, backgroundMusic.duration - 0.1)
      );
    }

    await resumeAlexMusic();
  }, { once: true });

  // Coba lagi jika browser memblokir autoplay.
  document.addEventListener("pointerdown", resumeAlexMusic);

  // Hentikan musik Alex saat Tap to Continue diklik.
  const stopAlexMusic = () => {
    alexMusicStopped = true;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    sessionStorage.removeItem("alexMusicTime");
    sessionStorage.removeItem("alexMusicShouldPlay");

    document.removeEventListener("pointerdown", resumeAlexMusic);
  };

  const tapToContinueButton = document.getElementById("surpriseHint");

  if (tapToContinueButton) {
    tapToContinueButton.addEventListener("click", stopAlexMusic);
  }
}


  if (firstSwipeHint && firstGallery) {
    firstSwipeHint.style.cursor = "pointer";

    firstSwipeHint.addEventListener("click", async () => {
      // Tampilkan galeri pertama
      firstGallery.classList.add("show");

      firstGallery.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  


if (secondSwipeHint && secondGallery && firstGallery) {
  secondSwipeHint.style.cursor = "pointer";

  // Sembunyikan tombol sampai Galeri 1 siap
  secondSwipeHint.classList.remove("show");

  const revealSecondSwipe = () => {
    const rect = firstGallery.getBoundingClientRect();

    if (
      firstGallery.classList.contains("show") &&
      rect.bottom <= window.innerHeight + 100
    ) {
      secondSwipeHint.classList.add("show");
      window.removeEventListener("scroll", revealSecondSwipe);
      window.removeEventListener("resize", revealSecondSwipe);
    }
  };

  window.addEventListener("scroll", revealSecondSwipe, {
    passive: true
  });

  window.addEventListener("resize", revealSecondSwipe);
  revealSecondSwipe();

  secondSwipeHint.addEventListener("click", async () => {
    secondGallery.classList.add("show");

    try {
      if (memoryVideo) {
        memoryVideo.muted = true;
        memoryVideo.currentTime = 0;
        await memoryVideo.play();
      }

      if (memorySong) {
        memorySong.currentTime = 0;
        await memorySong.play();
      }
    } catch (error) {
      console.log("Video atau musik belum dapat diputar:", error);
    }

    secondGallery.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}


/* ===== OUR FAVORITE SONGS: 4 LAGU MP3 ===== */
const playlistSongs = [
  {
    title: "My Favorite Person ✧",
    artist: "Nadhif Basalamah - Penjaga Hati",
    src: "assets/nadhif_basalamah_penjaga_hati.mp3"
  },
  {
    title: "A Song for You",
    artist: "Nuca - Masa ini, Nanti, dan Masa Indah Lainnya",
    src: "assets/nuca_masaini_nanti_masaindahlainnya.mp3"
  },
  {
    title: "Wish You Were Here ✧",
    artist: "Merry Christmas, i miss you - Alex Crichton",
    src: "assets/merry_christmas_i_miss_you.mp3"
  },
  {
    title: "What Words Can't Say",
    artist: "Backstreet Boys - Shape of My Heart",
    src: "assets/backstreet_boys - shape_of_my_heart.mp3"
  }
];

const playlistScreen = document.getElementById("playlistScreen");
const playlistAudio = document.getElementById("playlistAudio");
const playlistList = document.getElementById("playlistList");
const currentSongTitle = document.getElementById("currentSongTitle");
const currentSongArtist = document.getElementById("currentSongArtist");
const playSongButton = document.getElementById("playSong");
const prevSongButton = document.getElementById("prevSong");
const nextSongButton = document.getElementById("nextSong");
const songProgress = document.getElementById("songProgress");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");
const repeatSong = document.getElementById("repeatSong");
const playlistDisc = document.getElementById("playlistDisc");
const backToMemories = document.getElementById("backToMemories");
const wishVideo = document.getElementById("wishVideo");
const wishMusic = document.getElementById("wishMusic");

let currentSongIndex = 0;

function formatSongTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function renderPlaylist() {
  if (!playlistList) return;

  playlistList.innerHTML = "";

  playlistSongs.forEach((song, index) => {
    const track = document.createElement("button");
    track.type = "button";
    track.className = "playlist-track";
    track.dataset.index = index;

    track.innerHTML = `
      <span class="playlist-track-number">${index + 1}</span>
      <span class="playlist-track-info">
        <strong></strong>
        <small></small>
      </span>
      <span class="playlist-track-icon">♫</span>
    `;

    track.querySelector("strong").textContent = song.title;
    track.querySelector("small").textContent = song.artist;

    track.addEventListener("click", () => {
      loadSong(index, true);
    });

    playlistList.appendChild(track);
  });

  updateSelectedTrack();
}

function updateSelectedTrack() {
  if (!playlistList) return;

  playlistList.querySelectorAll(".playlist-track").forEach((track) => {
    const selected = Number(track.dataset.index) === currentSongIndex;
    track.classList.toggle("selected", selected);

    const icon = track.querySelector(".playlist-track-icon");
    if (icon) icon.textContent = selected && !playlistAudio.paused ? "♫" : "▶";
  });
}

function loadSong(index, autoplay = false) {
  currentSongIndex =
    (index + playlistSongs.length) % playlistSongs.length;

  const song = playlistSongs[currentSongIndex];

  playlistAudio.src = song.src;
  playlistAudio.loop = repeatSong.checked;
  currentSongTitle.textContent = song.title;
  currentSongArtist.textContent = song.artist;
  playlistAudio.load();

  songProgress.value = 0;
  currentTimeDisplay.textContent = "0:00";
  durationDisplay.textContent = "0:00";

  updateSelectedTrack();

  if (autoplay) {
    playlistAudio.play()
      .then(() => {
        playSongButton.textContent = "❚❚";
        playlistDisc.classList.add("spinning");
        updateSelectedTrack();
      })
      .catch(() => {
        playSongButton.textContent = "▶";
        playlistDisc.classList.remove("spinning");
        updateSelectedTrack();
        alert("Lagu belum bisa diputar. Periksa nama file MP3 di folder assets.");
      });
  } else {
    playSongButton.textContent = "▶";
    playlistDisc.classList.remove("spinning");
  }
}



function showPlaylist() {
  if (!playlistScreen) return;

  // Hentikan musik dan video kenangan.
  if (memorySong) {
    memorySong.pause();
    memorySong.currentTime = 0;
  }

  if (memoryVideo) {
    memoryVideo.pause();
    memoryVideo.currentTime = 0;
  }

  // Pastikan tidak ada lagu playlist sebelumnya yang masih berjalan.
  if (playlistAudio) {
    playlistAudio.pause();
    playlistAudio.currentTime = 0;
  }

  // Sembunyikan halaman Galaxy.
  const birthdayContainer = document.querySelector(".birthday-container");

  if (birthdayContainer) {
    birthdayContainer.hidden = true;
  }

  // Tampilkan halaman playlist.
  playlistScreen.hidden = false;
  playlistScreen.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Putar lagu playlist yang dipilih.
  loadSong(currentSongIndex, true);
}



function hidePlaylist() {
  if (!playlistScreen) return;

  // Hentikan lagu.
  if (playlistAudio) {
    playlistAudio.pause();
    playlistAudio.currentTime = 0;
  }

  // Sembunyikan halaman playlist.
  playlistScreen.classList.remove("active");
  playlistScreen.hidden = true;

  // Tampilkan kembali halaman Galaxy.
  const birthdayContainer = document.querySelector(".birthday-container");

  if (birthdayContainer) {
    birthdayContainer.hidden = false;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}


if (
  loveButton &&
  playlistScreen &&
  playlistAudio &&
  playlistList &&
  currentSongTitle &&
  currentSongArtist &&
  playSongButton &&
  prevSongButton &&
  nextSongButton &&
  songProgress &&
  currentTimeDisplay &&
  durationDisplay &&
  repeatSong &&
  playlistDisc &&
  backToMemories
) {
  renderPlaylist();
  loadSong(0);

  loveButton.addEventListener("click", showPlaylist);
  backToMemories.addEventListener("click", hidePlaylist);

  playSongButton.addEventListener("click", async () => {
    if (playlistAudio.paused) {
      try {
        await playlistAudio.play();
        playSongButton.textContent = "❚❚";
        playlistDisc.classList.add("spinning");
      } catch (error) {
        console.error("Lagu tidak dapat diputar:", error);
      }
    } else {
      playlistAudio.pause();
    }
  });

  prevSongButton.addEventListener("click", () => {
    loadSong(currentSongIndex - 1, true);
  });

  nextSongButton.addEventListener("click", () => {
    loadSong(currentSongIndex + 1, true);
  });

  repeatSong.addEventListener("change", () => {
    playlistAudio.loop = repeatSong.checked;
  });

  playlistAudio.addEventListener("play", () => {
    playSongButton.textContent = "❚❚";
    playlistDisc.classList.add("spinning");
    updateSelectedTrack();
  });

  playlistAudio.addEventListener("pause", () => {
    playSongButton.textContent = "▶";
    playlistDisc.classList.remove("spinning");
    updateSelectedTrack();
  });

  playlistAudio.addEventListener("ended", () => {
    if (!repeatSong.checked) {
      loadSong(currentSongIndex + 1, true);
    }
  });

  playlistAudio.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatSongTime(playlistAudio.duration);
  });

  playlistAudio.addEventListener("timeupdate", () => {
    currentTimeDisplay.textContent = formatSongTime(playlistAudio.currentTime);

    if (Number.isFinite(playlistAudio.duration) && playlistAudio.duration > 0) {
      songProgress.value =
        (playlistAudio.currentTime / playlistAudio.duration) * 100;
    }
  });

  songProgress.addEventListener("input", () => {
    if (Number.isFinite(playlistAudio.duration) && playlistAudio.duration > 0) {
      playlistAudio.currentTime =
        (Number(songProgress.value) / 100) * playlistAudio.duration;
    }
  });
}



/* TOMBOL LANJUT KE HALAMAN MAKE A WISH */
const continueToWish = document.getElementById("continueToWish");
const makeWishScreen = document.getElementById("makeWishScreen");

if (continueToWish && makeWishScreen && playlistScreen) {
  continueToWish.addEventListener("click", async () => {
    // Hentikan musik playlist.
    if (playlistAudio) {
      playlistAudio.pause();
      playlistAudio.currentTime = 0;
    }

    // Sembunyikan playlist.
    playlistScreen.classList.remove("active");
    playlistScreen.hidden = true;

    // Tampilkan Make a Wish.
    makeWishScreen.hidden = false;
    makeWishScreen.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // Putar video otomatis dan berulang.
    if (wishVideo) {
      wishVideo.muted = true;
      wishVideo.loop = true;
      wishVideo.currentTime = 0;

      try {
        await wishVideo.play();
      } catch (error) {
        console.error("Video gagal diputar:", error);
      }
    }

    // Putar musik otomatis dan berulang.
    if (wishMusic) {
      wishMusic.loop = true;
      wishMusic.currentTime = 0;

      try {
        await wishMusic.play();
      } catch (error) {
        console.error("Musik gagal diputar:", error);
      }
    }
  });
}


/* TOMBOL LANJUT KE CELEBRATION */
const continueToCelebration = document.getElementById(
  "continueToCelebration"
);

if (continueToCelebration) {
  continueToCelebration.addEventListener("click", () => {
    // Hentikan video Make a Wish.
    if (wishVideo) {
      wishVideo.pause();
    }

    // Hentikan musik Make a Wish.
    if (wishMusic) {
      wishMusic.pause();
      wishMusic.currentTime = 0;
    }

    // Buka halaman Celebration.
    window.location.href = "celebration.html";
  });
}


})();