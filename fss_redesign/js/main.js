/**
 * FSS Redesign - Main JavaScript
 * Handles navigation, dynamic content, and interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
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
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length <= 1) return;

    let currentSlide = 0;
    const intervalTime = 5000;
    let slideInterval;

    const updateSlider = (index) => {
        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        // Update current slide index
        currentSlide = index;

        // Add active class to new slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        const nextIndex = (currentSlide + 1) % slides.length;
        updateSlider(nextIndex);
    };

    // Auto slide
    slideInterval = setInterval(nextSlide, intervalTime);

    // Event Listeners for Dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
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
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

/* =========================================
   2. NAVIGATION & UI INTERACTIONS
   ========================================= */

function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navList = document.querySelector('.nav-list');
    const links = document.querySelectorAll('.nav-list a');
    const closeBtn = document.querySelector('.mobile-close-btn');

    if (!toggleBtn || !navList) return;

    toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', !isExpanded);
        navList.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        // Icon toggle removed to avoid duplicate close buttons
        // const icon = toggleBtn.querySelector('i');
        // if (icon) {
        //     icon.classList.toggle('fa-bars');
        //     icon.classList.toggle('fa-times');
        // }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            navList.classList.remove('active');
            document.body.classList.remove('no-scroll');
            toggleBtn.setAttribute('aria-expanded', 'false');
            // toggleBtn.querySelector('i')?.classList.replace('fa-times', 'fa-bars');
        });
    }

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't close if it matches a dropdown toggle and we are on mobile
            if (link.matches('.has-dropdown > a') && window.innerWidth <= 768) {
                return;
            }

            navList.classList.remove('active');
            document.body.classList.remove('no-scroll');
            toggleBtn.setAttribute('aria-expanded', 'false');
            // toggleBtn.querySelector('i')?.classList.replace('fa-times', 'fa-bars');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navList.contains(e.target) && !toggleBtn.contains(e.target) && navList.classList.contains('active')) {
            navList.classList.remove('active');
            document.body.classList.remove('no-scroll');
            toggleBtn.setAttribute('aria-expanded', 'false');
            // toggleBtn.querySelector('i')?.classList.replace('fa-times', 'fa-bars');
        }
    });
}

function initDropdownToggles() {
    const dropdowns = document.querySelectorAll('.has-dropdown > a');
    
    dropdowns.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Only toggle on mobile or if needed. For now, we enable it generally for touch support.
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = trigger.parentElement;
                parent.classList.toggle('dropdown-active');
            }
        });
    });
}

function initInternalNavigation() {
    // Smooth scroll offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 85; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

function updateYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/* =========================================
   2. DATA & CONTENT MANAGEMENT
   ========================================= */

const data = {
    announcements: [
        "Admission into ND/HND Programmes for 2024/2025 Session is ongoing.",
        "Resumption date for returning students: January 15th, 2025.",
        "FSS Oyo Convocation Ceremony scheduled for March 2025.",
        "New Short Courses in GIS and Drone Mapping now available."
    ],
    programmes: [
        { title: "Surveying & Geoinformatics", dept: "surveying", level: "ND / HND / PGD", desc: "The foundational course covering geodesy, photogrammetry, and hydrography." },

        { title: "Cartography & GIS", dept: "cartography", level: "PD / ND / HND", desc: "The art and science of map making combined with modern GIS technologies." },
        { title: "Photogrammetry & Remote Sensing", dept: "surveying", level: "ND / HND", desc: "Extracting 3D information from 2D images and satellite data analysis." },
        { title: "Computer Science", dept: "science", level: "ND", desc: "Software engineering, data science, and computational theory tailored for geospatial apps." },
        { title: "Software & Web Development", dept: "science", level: "HND", desc: "Advanced training in full-stack web development, software engineering, and mobile app creation." }
    ],
    news: [
        { 
            title: "Rector Charges Students on Innovation and Discipline during Orientation", 
            date: "05", 
            month: "Dec", 
            excerpt: "The Rector, Surv. Dupe Nihinlola Olayinka-Dosunmu, PhD, fnis, fgeoson, mnes, has urged newly admitted students to embrace technology and discipline as they begin their academic journey at the institution." 
        },
        { 
            title: "FSS Oyo Partners with NASRDA for Space Research Training", 
            date: "20", 
            month: "Nov", 
            excerpt: "A strategic partnership has been signed between FSS Oyo and the National Space Research and Development Agency to foster collaborative research." 
        },
        { 
            title: "Surveyors Registration Council of Nigeria Accreditation Visit", 
            date: "14", 
            month: "Oct", 
            excerpt: "SURCON accreditation team lauds the school's state-of-the-art laboratory facilities during their recent accreditation visit." 
        }
    ]
};

/* =========================================
   3. DYNAMIC CONTENT LOADERS
   ========================================= */

function loadAnnouncements() {
    const marquee = document.getElementById('announcement-marquee');
    if (!marquee) return;

    // Join with separator
    marquee.innerHTML = data.announcements.join('&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;');
}

function loadProgrammes() {
    const grid = document.getElementById('programmes-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (!grid) return;

    function render(filter) {
        grid.innerHTML = '';
        const filteredData = filter === 'all' 
            ? data.programmes 
            : data.programmes.filter(p => p.dept === filter);
            
        if (filteredData.length === 0) {
            grid.innerHTML = `<div class="text-center" style="grid-column: 1/-1; padding: 2rem;">No programmes found for this category.</div>`;
            return;
        }

        filteredData.forEach((prog, index) => {
            const card = document.createElement('div');
            card.className = 'programme-card fade-in';
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
    render('all');

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to click
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-filter');
            render(category);
        });
    });
}

function loadNews() {
    const feed = document.getElementById('news-feed');
    if (!feed) return;

    feed.innerHTML = data.news.map(item => `
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
    `).join('');
}

// Add simple fade-in animation styles dynamically
const style = document.createElement('style');
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
