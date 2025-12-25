class SiteHeader extends HTMLElement {
  connectedCallback() {
    const basePath = this.getAttribute("base-path") || ".";
    // Helper to conditionally prefix links.
    // If a link starts with '#', we prepend 'index.html' unless we want smooth scroll only on valid pages.
    // For simplicity, we will point everything to basePath/index.html or specific pages.

    this.innerHTML = `
    <header class="site-header">
      <div class="top-bar">
        <div class="container top-bar-inner">
          <div class="contact-info">
            <a href="tel:+2348138261833"
              ><i class="fa fa-phone"></i> +234-813 826 1833</a
            >
            <a href="mailto:info@fss-oyo.edu.ng"
              ><i class="fa fa-envelope"></i> info@fss-oyo.edu.ng</a
            >
          </div>
          <div class="social-links">
            <a href="#" aria-label="Facebook"
              ><i class="fab fa-facebook-f"></i
            ></a>
            <a href="#" aria-label="X (formerly Twitter)"
              ><i class="fa-brands fa-x-twitter"></i
            ></a>
            <a href="#" aria-label="Instagram"
              ><i class="fab fa-instagram"></i
            ></a>
          </div>
        </div>
      </div>

      <div class="main-header">
        <div class="container header-inner">
          <a href="${basePath}/index.html" class="brand">
            <img
              src="${basePath}/images/FSS_LOGO.png"
              alt="FSS Oyo Logo"
              width="60"
              height="60"
            />
            <div class="brand-text">
              <span class="brand-name">Federal School of Surveying</span>
              <span class="brand-location">Oyo, Nigeria</span>
            </div>
          </a>

          <button
            class="mobile-toggle"
            aria-controls="primary-navigation"
            aria-expanded="false"
          >
            <span class="sr-only">Menu</span>
            <i class="fa fa-bars"></i>
          </button>

          <nav id="primary-navigation" class="primary-nav">
            <ul class="nav-list">
              <button class="mobile-close-btn">
                <i class="fa fa-times"></i>
              </button>
              <li><a href="${basePath}/index.html" data-link="home">Home</a></li>
              <li class="has-dropdown">
                <a href="${basePath}/index.html#about" data-link="school"
                  >The School
                  <i
                    class="fa fa-chevron-down"
                    style="font-size: 0.7em; margin-left: 4px"
                  ></i
                ></a>
                <div class="mega-menu">
                  <div class="mega-grid">
                    <div class="mega-col about-col">
                      <h4>About Us</h4>
                      <p>
                        Established in 1908, the Federal School of Surveying,
                        Oyo is the premier institution for surveying and
                        geoinformatics in Nigeria, dedicated to excellence in
                        training and research.
                      </p>
                      <a href="${basePath}/pages/about/about-us.html" class="learn-more"
                        >Read More &rarr;</a
                      >
                    </div>
                    <div class="mega-col">
                      <h4>FSS</h4>
                      <ul>
                        <li>
                          <a href="${basePath}/pages/about/vision-mission.html"
                            >Vision & Mission</a
                          >
                        </li>
                        <li>
                          <a href="${basePath}/pages/about/anthem.html">School Anthem</a>
                        </li>
                        <li>
                          <a href="${basePath}/pages/about/about-us.html">About Us</a>
                        </li>
                      </ul>
                    </div>
                    <div class="mega-col">
                      <h4>Administration</h4>
                      <ul>
                        <li>
                          <a href="${basePath}/pages/about/governing-council.html"
                            >Governing Council</a
                          >
                        </li>
                        <li>
                          <a href="${basePath}/pages/about/academic-board.html"
                            >Academic Board</a
                          >
                        </li>
                        <li>
                          <a href="${basePath}/pages/about/principal-officers.html"
                            >Principal Officers</a
                          >
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
              <li class="has-dropdown">
                <a href="${basePath}/index.html#programmes"
                  >Academics <i class="fa fa-chevron-down"></i
                ></a>
                <div class="mega-menu">
                  <div class="mega-grid mega-grid-3">
                    <div class="mega-col about-col">
                      <h4>Faculties</h4>
                      <p>
                        There are 2 faculties in Federal School of Surveying,
                        Oyo namely: Faculty of Geospatial Sciences and Faculty
                        of Pure & Applied Sciences.
                      </p>
                    </div>
                    <div class="mega-col">
                      <h4>Faculty of Geospatial Sciences</h4>
                      <ul>
                        <li><a href="#">Surveying & Geoinformatics</a></li>
                        <li><a href="#">Cartography & GIS</a></li>
                        <li><a href="#">Photogrammetry & Remote Sensing</a></li>
                      </ul>
                    </div>
                    <div class="mega-col">
                      <h4>Faculty of Pure & Applied Sciences</h4>
                      <ul>
                        <li><a href="#">Computer Science</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
              <li class="has-dropdown">
                <a href="${basePath}/index.html#admissions"
                  >Admissions <i class="fa fa-chevron-down"></i
                ></a>
                <ul class="simple-dropdown">
                  <li><a href="#">Admission Requirements</a></li>
                  <li><a href="https://applications.fss-oyo.edu.ng/" target="_blank">Admission Portal</a></li>
                </ul>
              </li>
              <li class="has-dropdown">
                <a href="#">Portal Login <i class="fa fa-chevron-down"></i></a>
                <ul class="simple-dropdown">
                  <li><a href="#">Students Portal</a></li>
                  <li><a href="#">Staff Portal</a></li>
                </ul>
              </li>
              <li><a href="${basePath}/index.html#news">News</a></li>
              <li>
                <a href="${basePath}/index.html#contact" class="btn btn-sm btn-primary">Contact Us</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
    `;

    // Re-initialize mobile nav interaction since DOM was just injected
    if (window.initMobileNav) window.initMobileNav();
    if (window.initDropdownToggles) window.initDropdownToggles();

    this.highlightActiveLink();
  }

  highlightActiveLink() {
    const currentPath = window.location.pathname;
    const links = this.querySelectorAll("a");
    
    links.forEach(link => {
        // Simple check: if href ends with current path
        const href = link.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('#')) {
            // Normalize paths for comparison
            if (currentPath.includes(href.replace('../', '').replace('./', ''))) {
               // This is a naive check but works for typical structure
               link.classList.add('active');
            }
        }
    });
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
      const basePath = this.getAttribute("base-path") || ".";
      this.innerHTML = `
      <footer class="site-footer">
      <div class="container">
        <div class="footer-top grid grid-4">
          <div class="footer-brand reveal stagger-delay">
            <img src="${basePath}/images/FSS_LOGO.png" alt="Logo" width="50" />
            <h4>Federal School of Surveying</h4>
            <p>Building the future of Geospatial Sciences in Nigeria.</p>
          </div>

          <div class="footer-links reveal stagger-delay">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="${basePath}/index.html#about">About Us</a></li>
              <li><a href="${basePath}/index.html#programmes">Programmes</a></li>
              <li><a href="${basePath}/index.html#admissions">Admissions</a></li>
              <li><a href="#portal">Student Portal</a></li>
            </ul>
          </div>

          <div class="footer-links reveal stagger-delay">
            <h5>Resources</h5>
            <ul>
              <li><a href="#">Library</a></li>
              <li><a href="#">Alumni</a></li>
              <li>
                <a href="http://webmail.fss-oyo.edu.ng/" target="_blank"
                  >Staff Mail</a
                >
              </li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>

          <div class="footer-links reveal stagger-delay">
            <h5>Downloads</h5>
            <ul>
              <li><a href="#"><i class="fa fa-file-pdf" download></i> Academic Calendar</a></li>
              <li><a href="#"><i class="fa fa-file-pdf" download></i> Student Handbook</a></li>
              <li><a href="#"><i class="fa fa-file-pdf" download></i> School Fees Schedule</a></li>
              <li><a href="#"><i class="fa fa-file-pdf" download></i> Fees Structure</a></li>
              <li><a href="#"><i class="fa fa-file-pdf" download></i> First Semester Exam Schedule</a></li>
            </ul>
          </div>

          <div class="footer-newsletter reveal stagger-delay">
            <h5>Newsletter</h5>
            <p>Subscribe to get the latest school news.</p>
            <form class="newsletter-form">
              <input type="email" placeholder="Enter email" />
              <button type="submit"><i class="fa fa-paper-plane"></i></button>
            </form>
          </div>
        </div>

        <div class="footer-bottom footer-links">
          <p>
            &copy; <span id="current-year">2024</span> Federal School of
            Surveying, Oyo. All rights reserved.
          </p>
          <div class="bottom-links">
            <span>Powered by <a href="https://walexsson.github.io/DevBee/" target="_blank">DevBee</a></span>
          </div>
        </div>
      </div>
    </footer>
      `;
      
      // Re-init year update
      if (window.updateYear) window.updateYear();
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);
