/* 

JavaScript Document

*/

// Coverflow Class
class PhotoCoverflow {
   constructor() {
      this.items = document.querySelectorAll('.coverflow-item');
      this.indicators = document.querySelectorAll('#coverflowContainer .indicator');
      this.totalItems = this.items.length;
      this.currentIndex = Math.floor(this.totalItems / 2);
      this.isPlaying = false;
      this.autoPlayInterval = null;
      this.autoPlaySpeed = 4000;

      this.init();
   }

   init() {
      this.updateCoverflow();
      this.bindEvents();
   }

   bindEvents() {
      // Navigation buttons
     const prevBtn = document.getElementById('prevBtn');
     const nextBtn = document.getElementById('nextBtn');
     const playPauseBtn = document.getElementById('playPauseBtn');

     if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
     if (nextBtn) nextBtn.addEventListener('click', () => this.next());
     if (playPauseBtn) playPauseBtn.addEventListener('click', () => this.toggleAutoPlay());

      // Indicator clicks
      this.indicators.forEach((indicator, index) => {
         indicator.addEventListener('click', () => this.goTo(index));
      });

      // Item clicks
      this.items.forEach((item, index) => {
         item.addEventListener('click', () => {
            if (index === this.currentIndex) {
               // If clicking the center item, you could open a modal or link
               const gameId = item.dataset.game;
                 openGame(gameId);
            } else {
               this.goTo(index);
            }
         });
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
         if (e.key === 'ArrowLeft') this.prev();
         if (e.key === 'ArrowRight') this.next();
         if (e.key === ' ') {
            e.preventDefault();
            this.toggleAutoPlay();
         }
      });

      // Touch/swipe support
      let startX = 0;
      let startY = 0;

const container = document.getElementById('coverflowContainer');

if (container) {
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (!startX || !startY) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        this.next();
      } else {
        this.prev();
      }
    }

    startX = 0;
    startY = 0;
  }, { passive: true });
}

      // Handle window resize (both width and height)
      let resizeTimer;
      window.addEventListener('resize', () => {
         clearTimeout(resizeTimer);
         resizeTimer = setTimeout(() => {
            this.updateCoverflow();
         }, 100);
      });
   }

   updateCoverflow() {
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;
      const viewportHeight = window.innerHeight;

      // Dynamic spacing based on viewport height and width
      let baseSpacing = 220;

      // Adjust spacing based on viewport height
      if (viewportHeight > 900) {
         baseSpacing = 250;
      } else if (viewportHeight < 768) {
         baseSpacing = 180;
      }

      // Further adjust for mobile
      if (isSmallMobile) {
         baseSpacing = Math.min(baseSpacing * 0.7, 140);
      } else if (isMobile) {
         baseSpacing = Math.min(baseSpacing * 0.8, 170);
      }

      this.items.forEach((item, index) => {
         let offset = index - this.currentIndex;

         // Handle looping
         if (offset > this.totalItems / 2) {
            offset -= this.totalItems;
         } else if (offset < -this.totalItems / 2) {
            offset += this.totalItems;
         }

         let translateX = offset * baseSpacing;
         let translateZ = 0;
         let rotateY = 0;
         let scale = 1;
         let opacity = 1;

         if (offset === 0) {
            // Center item
            translateZ = 100;
            scale = 1.1;
         } else if (Math.abs(offset) === 1) {
            translateZ = 0;
            rotateY = offset * -40;
            scale = 0.85;
            opacity = 0.7;
         } else if (Math.abs(offset) === 2) {
            translateZ = -100;
            rotateY = offset * -50;
            scale = 0.7;
            opacity = 0.5;
         } else if (Math.abs(offset) === 3) {
            translateZ = -150;
            rotateY = offset * -60;
            scale = 0.6;
            opacity = 0.3;
         } else {
            translateZ = -200;
            rotateY = offset * -70;
            scale = 0.5;
            opacity = 0.2;
         }

         item.style.transform = `
                        translate(-50%, -50%) 
                        translateX(${translateX}px) 
                        translateZ(${translateZ}px) 
                        rotateY(${rotateY}deg) 
                        scale(${scale})
                    `;
         item.style.opacity = opacity;
         item.style.zIndex = this.totalItems - Math.abs(offset);
      });

      // Update indicators
      this.indicators.forEach((indicator, index) => {
         indicator.classList.toggle('active', index === this.currentIndex);
      });
   }

   toggleAutoPlay() {
      const playPauseBtn = document.getElementById('playPauseBtn');

      if (this.isPlaying) {
         this.stopAutoPlay();
         playPauseBtn.innerHTML = '▶';
         playPauseBtn.classList.remove('playing');
      } else {
         this.startAutoPlay();
         playPauseBtn.innerHTML = '❚❚';
         playPauseBtn.classList.add('playing');
      }
   }

   startAutoPlay() {
      this.isPlaying = true;
      this.autoPlayInterval = setInterval(() => {
         this.next();
      }, this.autoPlaySpeed);
   }

   stopAutoPlay() {
      this.isPlaying = false;
      if (this.autoPlayInterval) {
         clearInterval(this.autoPlayInterval);
         this.autoPlayInterval = null;
      }
   }

   prev() {
      this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
      this.updateCoverflow();
   }

   next() {
      this.currentIndex = (this.currentIndex + 1) % this.totalItems;
      this.updateCoverflow();
   }

   goTo(index) {
      this.currentIndex = index;
      this.updateCoverflow();
   }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
   // Initialize Coverflow
   if (document.querySelector('.coverflow-item')) {
  new PhotoCoverflow();
}
   // Hide loading screen
  const loader = document.getElementById('loadingScreen');

if (loader) {
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1000);
}

   // Header scroll effect
   const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

   // Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

   // Close mobile menu when clicking a link
   if (menuToggle && navMenu) {
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
   }  

   // Smooth scrolling for anchor links
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
         e.preventDefault();
         const target = document.querySelector(this.getAttribute('href'));
         if (target) {
            target.scrollIntoView({
               behavior: 'smooth',
               block: 'start'
            });
         }
      });
   });

   // Active menu highlighting on scroll
   const sections = document.querySelectorAll('section[id]');
   const navLinks = document.querySelectorAll('.nav-menu a');

   window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
         const sectionTop = section.offsetTop;
         const sectionHeight = section.clientHeight;
         if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
         }
      });

      navLinks.forEach(link => {
         link.classList.remove('active');
         if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
         }
      });
   });

   // Reveal animations on scroll
   const revealElements = document.querySelectorAll('.reveal');

   const revealOnScroll = () => {
      revealElements.forEach(element => {
         const elementTop = element.getBoundingClientRect().top;
         const elementVisible = 150;

         if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
         }
      });
   };

   
   window.addEventListener('scroll', revealOnScroll);
   revealOnScroll(); // Check on load
const title = document.querySelector(".typing-title");
const subtitle = document.querySelector(".typing-subtitle");

if (title) {
   setTimeout(() => {
      title.classList.add("finished");
   }, 3000);
}

if (subtitle) {
   setTimeout(() => {
      subtitle.classList.add("finished");
   }, 5200);
}
   // tumhara existing code ...

const slides = document.querySelectorAll(".slide");
let index = 0;
const dots = document.querySelectorAll(".hero-slider .indicator");
   

function showSlide(i) {
  if (!slides[i]) return;

  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));

  slides[i].classList.add("active");
 if (dots[i]) dots[i].classList.add("active");
}

function nextSlide() {
  if (slides.length === 0) return;
  index = (index + 1) % slides.length;
  showSlide(index);
}

   if (dots.length > 0) {
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      showSlide(index);
      resetAutoSlide();
    });
  });
}

   const aboutBtn = document.getElementById("toggleAboutBtn");
const gameAbout = document.getElementById("gameAbout");

if (aboutBtn && gameAbout) {

   aboutBtn.addEventListener("click", () => {

      gameAbout.classList.toggle("expanded");

      if (gameAbout.classList.contains("expanded")) {

         aboutBtn.innerText = "See Less";

      } else {

         aboutBtn.innerText = "See More";

      }

   });

}
   
   
function prevSlide() {
  if (slides.length === 0) return;
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
}

// 🔥 AUTO SLIDER (only ONE)
let autoSlide;

if (slides.length > 0) {
  autoSlide = setInterval(nextSlide, 4000);
}

function resetAutoSlide() {
  if (autoSlide) clearInterval(autoSlide);
  autoSlide = setInterval(nextSlide, 4000);
}

   document.addEventListener("visibilitychange", () => {
  if (!autoSlide) return;

  if (document.hidden) {
    clearInterval(autoSlide);
  } else {
    resetAutoSlide();
  }
});
   
// 🔥 SWIPE LOGIC (ALAG rakho, function ke bahar)
let startX = 0;
let isDragging = false;

const slider = document.querySelector(".hero-slider");

if (slider && slides.length > 0) {

  slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    handleSwipe(endX);
  });

  slider.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX;
  });

  slider.addEventListener("mouseup", e => {
    if (!isDragging) return;
    isDragging = false;
    let endX = e.clientX;
    handleSwipe(endX);
  });

  function handleSwipe(endX) {
    if (startX - endX > 50) {
      nextSlide();
      resetAutoSlide();
    }
    if (endX - startX > 50) {
      prevSlide();
      resetAutoSlide();
    }
  }
}
if (slides.length > 0) {
  showSlide(index);
}

});

let games = {};

async function loadGames() {
  try {
    const response = await fetch("./data/fixed_game_data.json");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    games = await response.json();

     console.log("Games loaded:", games);

     const savedGame = localStorage.getItem("activeGame");

if (savedGame && games[savedGame]) {
   openGame(savedGame);
}

  } catch (error) {
    console.error("JSON load error:", error);

    const loader = document.getElementById("loadingScreen");

    if (loader) {
      loader.innerHTML = `
        <p style="color:white;text-align:center;">
          Failed to load game data
        </p>
      `;
    }
  }
}

loadGames();


function openGame(gameId) {
   localStorage.setItem("activeGame", gameId);
  const game = games[gameId];

if (!game) {
  console.error("Game not found:", gameId);
  return;
}
  const title = document.getElementById("gameTitle");
if (title) title.innerText = game.title;
   
const gameDesc = document.getElementById("gameDesc");
if (gameDesc) gameDesc.innerText = game.desc;

  const image = document.getElementById("gameImage");
   if(image) image.src = game.image;
   
const gameGenre = document.getElementById("gameGenre");
if (gameGenre) gameGenre.innerText = game.genre;

const gameRelease = document.getElementById("gameRelease");
if (gameRelease) gameRelease.innerText = game.release;

const gameDeveloper = document.getElementById("gameDeveloper");
if (gameDeveloper) gameDeveloper.innerText = game.developer;

const gameAbout = document.getElementById("gameAbout");
if (gameAbout) gameAbout.innerHTML = game.about;

if (gameAbout) {
   gameAbout.classList.remove("expanded");
}

const aboutBtn = document.getElementById("toggleAboutBtn");

if (aboutBtn) {
   aboutBtn.innerText = "See More";
}
   
const portfolio = document.getElementById("portfolio");
const detail = document.getElementById("game-detail");
const hero = document.getElementById("home");
const thumbs = document.querySelectorAll(".thumbs img");   

    if (game.thumbs) {
    thumbs.forEach((img, index) => {
      if (game.thumbs[index]) {
        img.src = game.thumbs[index];
      }
    });
  }

   if (hero) hero.style.display = "none";
   if (portfolio) portfolio.style.display = "none";
   if (detail) detail.style.display = "block";

  window.scrollTo({
  top: 0,
  behavior: "smooth"
  });

document.body.classList.add("modal-open");
const thumbsContainer = document.querySelector(".thumbs");

thumbsContainer.onclick = (e) => {

   if (e.target.tagName === "IMG") {

      thumbs.forEach(img => img.classList.remove("active"));

      e.target.classList.add("active");

      document.getElementById("gameImage").src = e.target.src;
   }

};
}

function goBack() { localStorage.removeItem("activeGame");
                   const detail = document.getElementById("game-detail");
                   const portfolio = document.getElementById("portfolio");
                   const hero = document.getElementById("home");
                   
                   if (detail) detail.style.display = "none";
                   if (portfolio) portfolio.style.display = "";
                   if (hero) hero.style.display = "";
                    window.scrollTo({
                    top: 0,
                    behavior: "smooth"});
                    document.body.style.overflow = "";
                    document.body.classList.remove("modal-open");
                  
                  }





