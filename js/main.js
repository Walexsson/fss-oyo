/**
 * FSS Redesign - Main JavaScript
 * Handles navigation, dynamic content, and interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
  initSmoothScrolling();
  initInternalNavigation();
  initMobileNav();
  initDropdownToggles();
  initAnimations();
  initHeroSlider();
  updateYear();
  loadAnnouncements();
  loadProgrammes();
  loadNews();
});


/* =========================================
   1. NAVIGATION & UI INTERACTIONS
   ========================================= */

function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slider .slide");
  const dots = document.querySelectorAll(".dot");

  if (slides.length <= 1) return;

  let currentSlide = 0;
  const intervalTime = 5000;
  let slideInterval;

  const updateSlider = (index) => {
    if (index === currentSlide) return;

    // Determine direction
    // If we are at the last slide and go to first, treat as Next (Forward)
    // If we are at the first slide and go to last, treat as Prev (Backward)
    // Otherwise, numerical comparison.
    let direction = "next";
    if (currentSlide === 0 && index === slides.length - 1) {
      direction = "prev";
    } else if (currentSlide === slides.length - 1 && index === 0) {
      direction = "next";
    } else {
      direction = index > currentSlide ? "next" : "prev";
    }

    const current = slides[currentSlide];
    const next = slides[index];

    // Reset classes
    slides.forEach((s) => {
      s.classList.remove("active", "exit-left", "exit-right", "from-left");
      s.style.transition = "";
    });

    if (direction === "next") {
      // Forward: Current -> Exit Left (-100%), Next starts Right (100%) -> Center (0)

      // 1. Prepare Next (ensure it's at 100%, which is default state for .slide)
      // If next happened to be 'from-left' or 'exit-left', we must reset it to 100% instantly
      next.style.transition = "none";
      next.style.transform = "translateX(100%)";
      void next.offsetWidth; // Force reflow
      next.style.transition = "";
      next.style.transform = "";

      // 2. Animate
      current.classList.add("exit-left");
      next.classList.add("active");
    } else {
      // Backward: Current -> Exit Right (100%), Next starts Left (-100%) -> Center (0)

      // 1. Prepare Next (start at -100%)
      next.style.transition = "none";
      next.classList.add("from-left"); // Sets translateX(-100%)
      void next.offsetWidth; // Force reflow
      next.style.transition = "";

      // 2. Animate
      current.classList.add("exit-right"); // Moves to 100%
      setTimeout(() => {
        next.classList.remove("from-left");
        next.classList.add("active");
      }, 20); // Small delay to ensure transition engages
    }

    // Update state
    currentSlide = index;
    dots.forEach((d) => d.classList.remove("active"));
    dots[currentSlide].classList.add("active");
  };

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    updateSlider(nextIndex);
  };

  // Auto slide
  slideInterval = setInterval(nextSlide, intervalTime);

  // Event Listeners for Dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      updateSlider(index);
      resetInterval();
    });
  });

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
  }
}

function initAnimations() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) {
    // If reduced motion is preferred, just show everything immediately
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("active");
      el.classList.remove("reveal"); // Remove class to prevent future animations
    });
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px", // Trigger when element touches viewport edge
    threshold: 0.15, // 15% visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Entance
        entry.target.classList.add("active");
        entry.target.classList.remove("exiting");
      } else {
        // Exit (Optional: Uncomment next lines if you want elements to fade out when scrolling away)
        // For a smoother experience, we typically only animate IN, but user asked for "entrance and exit".
        // Let's implement it such that if it goes completely out of view, it resets for next time.

        // entry.target.classList.remove("active");
        // entry.target.classList.add("exiting");

        // Valid Strategy:
        // 1. Play entrance when it comes into view.
        // 2. Play exit when it leaves view (can be annoying if reading).
        // 3. Current implementation: Animate IN. If user scrolls UP and then back DOWN, should it animate again?
        // Let's make it Reversible.

        if (entry.boundingClientRect.y > 0) {
          // Element went below the fold (scrolled up) - maybe keep it visible?
          // Usually we only exit if we want to re-trigger the entrance.
          // Let's strictly follow "Entrance AND Exit" request.
          // This implies when I scroll past it, it might fade out, or when I scroll back it fades out.

          // Simple Reversible Animation Logic:
          entry.target.classList.remove("active");
          // We don't necessarily need an explicit 'exiting' class if removing 'active' reverts to the hidden state defined in CSS (.reveal)
          // .reveal has opacity: 0; transform: translateY(30px);
          // So removing .active will animate it back to invisible state.
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal").forEach((el) => {
    observer.observe(el);
  });
}

/* =========================================
   2. NAVIGATION & UI INTERACTIONS
   ========================================= */

function initMobileNav() {
  const toggleBtn = document.querySelector(".mobile-toggle");
  const navList = document.querySelector(".nav-list");
  const links = document.querySelectorAll(".nav-list a");
  const closeBtn = document.querySelector(".mobile-close-btn");

  if (!toggleBtn || !navList) return;

  // Create backdrop if it doesn't exist
  let backdrop = document.querySelector(".mobile-nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "mobile-nav-backdrop";
    document.body.appendChild(backdrop);
  }

  const closeMenu = () => {
    navList.classList.remove("active");
    backdrop.classList.remove("active");
    document.body.classList.remove("no-scroll");
    toggleBtn.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    navList.classList.add("active");
    backdrop.classList.add("active");
    document.body.classList.add("no-scroll");
    toggleBtn.setAttribute("aria-expanded", "true");
  };

  toggleBtn.addEventListener("click", () => {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  // Close menu when clicking a navigation link (but not dropdown toggles)
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Don't close if it's a dropdown toggle on mobile
      if (
        link.parentElement.classList.contains("has-dropdown") &&
        window.innerWidth <= 820
      ) {
        return; // Let the dropdown toggle work
      }
      // No automatic close on link click; user must close manually
    });
  });

  // Prevent clicks inside nav from closing the menu
  navList.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Close menu when clicking backdrop
  backdrop.addEventListener("click", closeMenu);

  // Handle ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navList.classList.contains("active")) {
      closeMenu();
    }
  });
}

function initDropdownToggles() {
  const dropdowns = document.querySelectorAll(".has-dropdown > a");

  dropdowns.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      // Only toggle on mobile or if needed. For now, we enable it generally for touch support.
      if (window.innerWidth <= 820) {
        e.preventDefault();
        const parent = trigger.parentElement;
        parent.classList.toggle("dropdown-active");
      }
    });
  });
}

function initInternalNavigation() {
  // Smooth scroll offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 85;

        // Use Lenis if available
        if (window.lenis) {
          window.lenis.scrollTo(targetElement, {
            offset: -headerOffset,
            duration: 1.5, // Slightly slower for dramatic effect if desired
          });
        } else {
          // Fallback to native
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

function initSmoothScrolling() {
  // Inject Lenis script dynamically
  const script = document.createElement("script");
  script.src = "https://unpkg.com/lenis@1.1.20/dist/lenis.min.js";
  script.async = true;
  script.onload = () => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect to GSAP ScrollTrigger if present (optional future proofing)
    /* 
    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add((time)=>{
            lenis.raf(time * 1000)
        })
        gsap.ticker.lagSmoothing(0)
    }
    */
  };
  document.head.appendChild(script);
}

function updateYear() {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* =========================================
   2. DATA & CONTENT MANAGEMENT
   ========================================= */

// Expose functions to window for Web Components
window.initMobileNav = initMobileNav;
window.initDropdownToggles = initDropdownToggles;
window.updateYear = updateYear;

const data = {
  announcements: [
    "Admission into ND/HND Programmes for 2025/2026 Session is ongoing.",
    "Resumption date for staff and students: January 5th, 2026.",
    "FSS Oyo Convocation Ceremony scheduled between Monday, 8th December and Thursday, 11th December, 2025.",
    "Add more announcements here",
  ],
  programmes: [
    {
      title: "Surveying & Geoinformatics",
      dept: "surveying",
      level: "ND / HND / PPD / PD",
      desc: "The foundational course covering geodesy, photogrammetry, and hydrography.",
    },

    {
      title: "Cartography & GIS",
      dept: "cartography",
      level: "ND / HND / PGD GIS",
      desc: "The art and science of map making combined with modern GIS technologies.",
    },
    {
      title: "Photogrammetry & Remote Sensing",
      dept: "surveying",
      level: "ND / HND",
      desc: "Extracting 3D information from 2D images and satellite data analysis.",
    },
    {
      title: "Computer Science",
      dept: "science",
      level: "ND",
      desc: "Software engineering, data science, and computational theory tailored for geospatial apps.",
    },
    {
      title: "Software & Web Development",
      dept: "science",
      level: "HND",
      desc: "Advanced training in full-stack web development, software engineering, and mobile app creation.",
    },
  ],
  news: [
    {
      title:
        "Rector Charges Students on Innovation and Discipline during Orientation",
      date: "05",
      month: "Dec",
      excerpt:
        "The Rector, Surv. Dupe Nihinlola Olayinka-Dosunmu, PhD, fnis, fgeoson, mnes, has urged newly admitted students to embrace technology and discipline as they begin their academic journey at the institution.",
    },
    {
      title: "FSS Oyo Partners with NASRDA for Space Research Training",
      date: "20",
      month: "Nov",
      excerpt:
        "A strategic partnership has been signed between FSS Oyo and the National Space Research and Development Agency to foster collaborative research.",
    },
    {
      title: "Surveyors Registration Council of Nigeria Accreditation Visit",
      date: "14",
      month: "Oct",
      excerpt:
        "SURCON accreditation team lauds the school's state-of-the-art laboratory facilities during their recent accreditation visit.",
    },
  ],
};

/* =========================================
   3. DYNAMIC CONTENT LOADERS
   ========================================= */

function loadAnnouncements() {
  const marquee = document.getElementById("announcement-marquee");
  if (!marquee) return;

  // Join with separator
  marquee.innerHTML = data.announcements.join(
    "&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;"
  );
}

function loadProgrammes() {
  const grid = document.getElementById("programmes-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");

  if (!grid) return;

  function render(filter) {
    grid.innerHTML = "";
    const filteredData =
      filter === "all"
        ? data.programmes
        : data.programmes.filter((p) => p.dept === filter);

    if (filteredData.length === 0) {
      grid.innerHTML = `<div class="text-center" style="grid-column: 1/-1; padding: 2rem;">No programmes found for this category.</div>`;
      return;
    }

    filteredData.forEach((prog, index) => {
      const card = document.createElement("div");
      card.className = "programme-card fade-in";
      card.style.animationDelay = `${index * 100}ms`;

      card.innerHTML = `
                <span class="dept-tag">${prog.level}</span>
                <h3>${prog.title}</h3>
                <p>${prog.desc}</p>
                <a href="#" class="btn btn-secondary btn-sm">View Details &rarr;</a>
            `;
      grid.appendChild(card);
    });
  }

  // Initial Render
  render("all");

  // Filter Logic
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all
      filterBtns.forEach((b) => b.classList.remove("active"));
      // Add to click
      btn.classList.add("active");

      const category = btn.getAttribute("data-filter");
      render(category);
    });
  });
}

function loadNews() {
  const feed = document.getElementById("news-feed");
  if (!feed) return;

  feed.innerHTML = data.news
    .map(
      (item) => `
        <article class="news-item">
            <div class="news-date">
                <span class="day">${item.date}</span>
                <span class="month">${item.month}</span>
            </div>
            <div class="news-content">
                <h3><a href="#">${item.title}</a></h3>
                <p>${item.excerpt}</p>
                <a href="#" style="font-size: 0.9rem; font-weight: 500;">Read More</a>
            </div>
        </article>
    `
    )
    .join("");
}

// Add simple fade-in animation styles dynamically
const style = document.createElement("style");
style.textContent = `
    .fade-in {
        opacity: 0;
        animation: fadeIn 0.5s ease forwards;
    }
    @keyframes fadeIn {
        to { opacity: 1; transform: translateY(0); }
        from { opacity: 0; transform: translateY(20px); }
    }
`;
document.head.appendChild(style);
