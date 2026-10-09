/**
 * Prajaseva Party (ప్రజాసేవ పార్టీ) - Interactive Script
 * Language switching, carousels, lightbox, modals, and validation
 */

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderHeight();
  initLanguage();
  initMobileNav();
  initHeroCarousel();
  initGalleryLightbox();
  initPhotoGallerySlider();
  initForms();
  initBackToTop();
  initPolicyModal();
  initCampaignSlider();
  initInteractiveMap();
  init3DFlipCards();
});

function init3DFlipCards() {
  document.querySelectorAll('.id-card-3d-scene').forEach(function (scene) {
    scene.addEventListener('click', function () {
      if (window.matchMedia('(hover: none)').matches) {
        this.classList.toggle('is-flipped');
      }
    });
  });
}

function updateHeaderHeight() {
  const header = document.getElementById('site-header');
  if (header) {
    const h = header.offsetHeight;
    if (h > 0) {
      document.documentElement.style.setProperty('--header-height', `${h}px`);
    }
  }
}

window.addEventListener('resize', updateHeaderHeight);
window.addEventListener('orientationchange', updateHeaderHeight);

function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggleBtn');
  const navbarCollapse = document.getElementById('navbarContent');
  const navLinks = document.querySelectorAll('.site-header .nav-link');
  const headerEl = document.getElementById('site-header');
  const brandLogo = document.getElementById('brand-logo-link');

  if (!navbarCollapse || !toggleBtn) return;

  // Prevent Bootstrap collision by removing data-bs-toggle attribute
  toggleBtn.removeAttribute('data-bs-toggle');

  // Enforce consistent closed state on initial load
  if (!navbarCollapse.classList.contains('show')) {
    toggleBtn.classList.add('collapsed');
    toggleBtn.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  // Create or retrieve professional dimmed backdrop
  let backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    document.body.appendChild(backdrop);
  }

  function setMenuState(isOpen) {
    if (isOpen) {
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.classList.remove('collapsed');
      toggleBtn.classList.add('is-open');
      navbarCollapse.classList.add('show');
      if (backdrop) backdrop.classList.add('show');
      document.body.classList.add('mobile-nav-open');
    } else {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.classList.add('collapsed');
      toggleBtn.classList.remove('is-open');
      navbarCollapse.classList.remove('show');
      if (backdrop) backdrop.classList.remove('show');
      document.body.classList.remove('mobile-nav-open');
    }
  }

  function toggleMobileMenu() {
    const isCurrentlyOpen = navbarCollapse.classList.contains('show') || toggleBtn.getAttribute('aria-expanded') === 'true';
    setMenuState(!isCurrentlyOpen);
  }

  function closeMobileMenu() {
    setMenuState(false);
  }

  // Toggler button click: deterministic toggle
  toggleBtn.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileMenu();
  };

  // Tap on backdrop closes drawer
  if (backdrop) {
    backdrop.onclick = function (e) {
      e.preventDefault();
      closeMobileMenu();
    };
  }

  // Tap outside menu closes it
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
      if (!navbarCollapse.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // ESC key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
      closeMobileMenu();
    }
  });

  // Auto-close menu if resized to desktop viewport (>= 992px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      closeMobileMenu();
    }
  });

  // Handle all nav links: smooth scroll + close menu + update active state
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (window.innerWidth < 992) {
        closeMobileMenu();
      }
      if (!href || !href.startsWith('#')) return;

      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);

      // Instant active highlight on tap
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      if (targetEl) {
        e.preventDefault();
        const headerHeight = headerEl ? headerEl.offsetHeight : 65;
        const targetRect = targetEl.getBoundingClientRect();
        const targetTop = targetRect.top + window.pageYOffset - (headerHeight + 10);

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth'
        });

        // Update URL cleanly without page jump
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });

  // Handle mobile drawer action buttons: close menu when opening modal
  const drawerActionBtns = navbarCollapse.querySelectorAll('.btn-mobile-nav-membership, .btn-mobile-nav-donate');
  drawerActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        closeMobileMenu();
      }
    });
  });

  // Brand logo tap returns to top
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      const href = brandLogo.getAttribute('href');
      if (href === '#home' || href === '#') {
        e.preventDefault();
        if (window.innerWidth < 992) closeMobileMenu();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navLinks.forEach(l => l.classList.remove('active'));
        const homeLink = document.querySelector('.site-header .nav-link[href="#home"]');
        if (homeLink) homeLink.classList.add('active');
      }
    });
  }

  // ScrollSpy to highlight active menu item on scroll
  const sections = [];
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const el = document.getElementById(href.substring(1));
      if (el) sections.push({ el, link });
    }
  });

  let scrollTimeout = null;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
      const headerHeight = (headerEl ? headerEl.offsetHeight : 65) + 30;
      const scrollPos = window.pageYOffset + headerHeight;

      let currentLink = null;
      for (let i = sections.length - 1; i >= 0; i--) {
        const top = sections[i].el.offsetTop;
        if (scrollPos >= top) {
          currentLink = sections[i].link;
          break;
        }
      }

      if (currentLink) {
        navLinks.forEach(l => l.classList.remove('active'));
        currentLink.classList.add('active');
      }
    }, 100);
  }, { passive: true });
}

/* ==========================================================================
   1. Language Switcher (Direct Toggle Telugu <-> English, No Dropdown)
   ========================================================================== */
let currentLang = 'te';
try {
  currentLang = localStorage.getItem('prajaseva_lang') || 'te';
} catch (e) {
  currentLang = 'te';
}

function toggleLanguageDirect(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const nextLang = (currentLang === 'te') ? 'en' : 'te';
  switchLanguage(nextLang);
}
window.toggleLanguageDirect = toggleLanguageDirect;
window.toggleLanguageDropdown = toggleLanguageDirect; // Alias for backward compatibility
window.closeAllLangDropdowns = function () { };

function initLanguage() {
  const teBtns = document.querySelectorAll('#lang-btn-te, .lang-select-te');
  const enBtns = document.querySelectorAll('#lang-btn-en, .lang-select-en');
  const toggleBtns = document.querySelectorAll('#lang-toggle-btn, .lang-dropdown-capsule');

  teBtns.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      switchLanguage('te');
    };
  });

  enBtns.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      switchLanguage('en');
    };
  });

  toggleBtns.forEach(btn => {
    btn.onclick = (e) => {
      toggleLanguageDirect(e);
    };
  });

  // Global document delegation: any click on toggle button directly flips language
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#lang-toggle-btn, .lang-dropdown-capsule');
    if (btn) {
      toggleLanguageDirect(e);
    }
  });

  // Sync across open browser tabs/windows
  window.addEventListener('storage', (e) => {
    if (e.key === 'prajaseva_lang' && e.newValue && e.newValue !== currentLang) {
      applyLanguage(e.newValue);
    }
  });

  // Initial apply
  applyLanguage(currentLang);
}

function switchLanguage(lang) {
  currentLang = lang;
  try {
    localStorage.setItem('prajaseva_lang', lang);
  } catch (e) { }
  applyLanguage(lang);
}
window.switchLanguage = switchLanguage;
window.applyLanguage = applyLanguage;

function applyLanguage(lang) {
  currentLang = lang;
  const dict = typeof translations !== 'undefined' ? translations[lang] : null;
  if (!dict) return;

  // 1. Update capsule toggle labels and rotate chevron arrow
  const labelText = lang === 'te' ? 'తెలుగు' : 'English';
  const toggleTitle = lang === 'te' ? 'భాషను మార్చండి / Switch to English' : 'Switch Language / తెలుగులోకి మార్చండి';

  document.querySelectorAll('#lang-current-label, .lang-dropdown-capsule .lang-label').forEach(el => {
    el.textContent = labelText;
  });

  document.querySelectorAll('#lang-toggle-btn, .lang-dropdown-capsule').forEach(btn => {
    btn.removeAttribute('title');
    btn.setAttribute('aria-label', toggleTitle);
    if (lang === 'en') {
      btn.classList.add('lang-is-en');
    } else {
      btn.classList.remove('lang-is-en');
    }
  });

  document.documentElement.lang = lang;
  if (document.body) {
    document.body.setAttribute('data-lang', lang);
  }

  // 2. Update active state on legacy or segmented buttons if present
  document.querySelectorAll('#lang-btn-te, .lang-select-te').forEach(btn => {
    btn.classList.toggle('active', lang === 'te');
  });
  document.querySelectorAll('#lang-btn-en, .lang-select-en').forEach(btn => {
    btn.classList.toggle('active', lang === 'en');
  });

  // 3. Replace text for all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // If element has child elements like icons, preserve them
      const icon = el.querySelector('i');
      if (icon) {
        const iconClone = icon.cloneNode(true);
        el.textContent = ' ' + dict[key] + ' ';
        el.prepend(iconClone);
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // 4. Replace placeholders for elements with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // 5. Update map tooltip immediately if currently visible or active
  if (typeof updateMapTooltipLanguage === 'function') {
    updateMapTooltipLanguage(lang);
  }
  if (typeof updateMapPopupLanguage === 'function') {
    updateMapPopupLanguage(lang);
  }

  // 6. Update issues page language if present
  if (typeof updateIssuesPageLanguage === 'function') {
    updateIssuesPageLanguage(lang);
  }

  // 7. Update news page language if present
  if (typeof updateNewsPageLanguage === 'function') {
    updateNewsPageLanguage(lang);
  }

  // 8. Dispatch custom event for any other module hooks
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/* ==========================================================================
   2. Hero Carousel System
   ========================================================================== */
const totalHeroSlides = 2;
let currentSlideIdx = 0;
let slideInterval = null;

function initHeroCarousel() {
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');
  const dots = document.querySelectorAll('.hero-dot');
  const banner = document.querySelector('.hero-banner-card, .hero-section');
  const slides = document.querySelectorAll('.hero-slide');

  if (!slides.length) return;

  // Immediately display the active slide
  changeHeroSlide(0);

  if (prevBtn) {
    prevBtn.onclick = function (e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      changeHeroSlide(currentSlideIdx - 1);
      startSlideShow();
    };
  }

  if (nextBtn) {
    nextBtn.onclick = function (e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      changeHeroSlide(currentSlideIdx + 1);
      startSlideShow();
    };
  }

  dots.forEach((dot, idx) => {
    dot.onclick = function (e) {
      if (e) e.preventDefault();
      changeHeroSlide(idx);
      startSlideShow();
    };
  });

  // Snappy auto slide every 4 seconds with smooth transition
  startSlideShow();

  if (banner) {
    banner.addEventListener('mouseenter', stopSlideShow);
    banner.addEventListener('mouseleave', startSlideShow);

    // Responsive Mobile Touch Swipe Support
    let touchStartX = 0;
    banner.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    banner.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          changeHeroSlide(currentSlideIdx + 1);
        } else {
          changeHeroSlide(currentSlideIdx - 1);
        }
        startSlideShow();
      }
    }, { passive: true });
  }
}

function startSlideShow() {
  stopSlideShow();
  slideInterval = setInterval(() => {
    changeHeroSlide(currentSlideIdx + 1);
  }, 4000);
}

function stopSlideShow() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

function changeHeroSlide(newIdx) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  if (newIdx < 0) newIdx = slides.length - 1;
  if (newIdx >= slides.length) newIdx = 0;
  currentSlideIdx = newIdx;

  slides.forEach((slide, idx) => {
    if (idx === currentSlideIdx) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  dots.forEach((dot, idx) => {
    if (idx === currentSlideIdx) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

/* ==========================================================================
   3. Photo Gallery Lightbox
   ========================================================================== */
const galleryData = [
  { src: "assets/images/gallery/gallery-1.jpg", captionTe: "హైదరాబాద్ చారిత్రక ప్రజాసభ – ప్రజల భారీ జనసందోహం", captionEn: "Historic Hyderabad Public Assembly – Massive Citizens Gathering" },
  { src: "assets/images/gallery/gallery-2.jpg", captionTe: "గ్రామ సభలో ప్రజల సమస్యలను ఆలకిస్తున్న నాయకులు", captionEn: "Leaders Attentively Listening to Public Grievances at Village Assembly" },
  { src: "assets/images/gallery/gallery-3.jpg", captionTe: "యువజన నాయకులతో భవిష్యత్ కార్యాచరణ సమావేశం", captionEn: "Future Action Plan Meeting with Dedicated Youth Leaders" },
  { src: "assets/images/gallery/gallery-4.jpg", captionTe: "మహిళా స్వయం సహాయక సంఘాల ప్రతినిధులతో సదస్సు", captionEn: "Empowerment Conference with Women's Self-Help Groups" },
  { src: "assets/images/gallery/gallery-5.jpg", captionTe: "ప్రజాసేవ పార్టీ సమగ్ర అభివృద్ధి విధాన ప్రణాళిక", captionEn: "Prajaseva Party Comprehensive Governance Roadmap" },
  { src: "assets/images/gallery/gallery-assembly.jpg", captionTe: "తెలంగాణ ప్రజా సమస్యల పరిష్కారానికై భారీ సభ", captionEn: "Massive Public Rally for Citizens Rights" },
  { src: "assets/images/about.webp", captionTe: "సుభిక్షమైన తెలంగాణ రాష్ట్ర నిర్మాణం – మా లక్ష్యం", captionEn: "Building a Prosperous Telangana State" },
  { src: "assets/images/lastimage.webp", captionTe: "ప్రజాసేవకై నవతరం నాయకత్వం – అంకితభావం", captionEn: "Dedicated Leadership for People's Welfare" }
];

let currentLightboxIdx = 0;

function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModalEl = document.getElementById('lightboxModal');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!lightboxModalEl) return;

  const bsModal = new bootstrap.Modal(lightboxModalEl);

  galleryItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const strip = document.getElementById('gallery-slider-strip');
      if (strip && strip.dataset.dragging === 'true') {
        e.preventDefault();
        return;
      }
      const idx = parseInt(item.getAttribute('data-index') || '0', 10);
      showLightboxImage(idx);
      bsModal.show();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let idx = currentLightboxIdx - 1;
      if (idx < 0) idx = galleryData.length - 1;
      showLightboxImage(idx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let idx = currentLightboxIdx + 1;
      if (idx >= galleryData.length) idx = 0;
      showLightboxImage(idx);
    });
  }
}

function showLightboxImage(idx) {
  currentLightboxIdx = idx;
  const item = galleryData[idx];
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');

  if (imgEl && item) {
    imgEl.src = item.src;
  }
  if (captionEl && item) {
    captionEl.textContent = currentLang === 'te' ? item.captionTe : item.captionEn;
  }
}

/* ==========================================================================
   3b. Interactive Photo Gallery Horizontal Slider
   ========================================================================== */
function initPhotoGallerySlider() {
  const strip = document.getElementById('gallery-slider-strip');
  const prevBtn = document.getElementById('gallery-prev-btn');
  const nextBtn = document.getElementById('gallery-next-btn');

  if (!strip) return;

  function getItemStep() {
    const item = strip.querySelector('.gallery-item');
    if (!item) return 240;
    const style = window.getComputedStyle(strip);
    const gap = parseFloat(style.gap) || 14;
    return item.offsetWidth + gap;
  }

  function scrollNext() {
    const step = getItemStep();
    const maxScroll = strip.scrollWidth - strip.clientWidth;
    if (strip.scrollLeft + step >= maxScroll - 8) {
      strip.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      strip.scrollBy({ left: step, behavior: 'smooth' });
    }
  }

  function scrollPrev() {
    const step = getItemStep();
    if (strip.scrollLeft <= 8) {
      const maxScroll = strip.scrollWidth - strip.clientWidth;
      strip.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      strip.scrollBy({ left: -step, behavior: 'smooth' });
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollNext();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollPrev();
    });
  }

  // Smooth Drag to Scroll (with threshold to avoid blocking clicks)
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let hasDragged = false;

  strip.addEventListener('mousedown', (e) => {
    isDown = true;
    hasDragged = false;
    startX = e.pageX;
    scrollStart = strip.scrollLeft;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const diff = e.pageX - startX;
    if (Math.abs(diff) > 6) {
      hasDragged = true;
      strip.dataset.dragging = 'true';
      strip.scrollLeft = scrollStart - diff;
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      setTimeout(() => {
        hasDragged = false;
        if (strip) strip.dataset.dragging = 'false';
      }, 70);
    }
  });

  // Auto-slide every 3.8s with pause on hover & touch
  let autoTimer = null;
  function startTimer() {
    stopTimer();
    autoTimer = setInterval(() => {
      const maxScroll = strip.scrollWidth - strip.clientWidth;
      if (maxScroll > 15) {
        scrollNext();
      }
    }, 3800);
  }

  function stopTimer() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  const container = strip.closest('.gallery-strip-container');
  if (container) {
    container.addEventListener('mouseenter', stopTimer);
    container.addEventListener('mouseleave', startTimer);
    container.addEventListener('touchstart', stopTimer, { passive: true });
    container.addEventListener('touchend', startTimer, { passive: true });
  }

  startTimer();
}

/* ==========================================================================
   4. Policy Card Details Modal
   ========================================================================== */
const policyDetails = [
  {
    num: "01",
    titleTe: "ఉచిత నాణ్యమైన విద్య",
    titleEn: "Free Quality Education",
    pointsTe: [
      "ప్రతి మండలంలో ప్రపంచ స్థాయి ప్రమాణాలతో మోడల్ ప్రజాసేవ స్కూల్స్ స్థాపన.",
      "కేజీ నుండి పీజీ వరకు పేద, మధ్యతరగతి విద్యార్థులందరికీ సంపూర్ణ ఉచిత నాణ్యమైన విద్యాబోధన.",
      "ప్రైవేట్ పాఠశాలల ఫీజుల నియంత్రణ మరియు ప్రభుత్వ పాఠశాలల్లో డిజిటల్ తరగతులు.",
      "ఉన్నత విద్య కోసం ప్రతిభావంతులకు 100% ఉపకార వేతనాలు (స్కాలర్‌షిప్‌లు)."
    ],
    pointsEn: [
      "Establishment of world-class model public schools in every mandal.",
      "Completely free, high-caliber education from KG to PG for poor and middle-class students.",
      "Strict regulation of private school fees and full digital infrastructure in public schools.",
      "100% merit-based higher education scholarships for eligible students."
    ]
  },
  {
    num: "02",
    titleTe: "ఉచిత వైద్యం",
    titleEn: "Free Healthcare",
    pointsTe: [
      "ప్రతి నియోజకవర్గంలో 200 పడకల సూపర్ స్పెషాలిటీ ప్రజాసేవ ఆసుపత్రి.",
      "ఉచిత ప్రాథమిక పరీక్షలు, రక్త పరీక్షలు మరియు ఉచిత మందుల పంపిణీ కేంద్రాలు.",
      "పేద కుటుంబాలకు ₹10 లక్షల వరకు నగదు రహిత ఆరోగ్య బీమా రక్షణ.",
      "గ్రామీణ ప్రాంతాలలో 24/7 మొబైల్ హెల్త్ క్లినిక్‌ల సేవలు."
    ],
    pointsEn: [
      "200-bed super-specialty public hospitals in every legislative constituency.",
      "Free diagnostics, lab tests, and 100% free essential medicines for all citizens.",
      "Cashless health insurance coverage up to ₹10 Lakhs for low-income families.",
      "24/7 mobile healthcare emergency vans deployed across all rural villages."
    ]
  },
  {
    num: "03",
    titleTe: "ప్రతి యువకుడికి ఉపాధి",
    titleEn: "Employment for Every Youth",
    pointsTe: [
      "ప్రభుత్వ శాఖల్లో ఖాళీగా ఉన్న 2 లక్షల ఉద్యోగాలకు వార్షిక జాబ్ క్యాలెండర్ ప్రకారం పారదర్శక నియామకాలు.",
      "తెలంగాణలోని ప్రతి ప్రైవేట్ పరిశ్రమలో స్థానిక యువతకు 70% రిజర్వేషన్లు చట్టబద్ధం.",
      "ప్రతి జిల్లాలో అత్యాధునిక ఆర్టిఫిషియల్ ఇంటెలిజెన్స్, కోడింగ్ మరియు సాంకేతిక నైపుణ్య శిక్షణా కేంద్రాలు.",
      "యువ పారిశ్రామికవేత్తలు మరియు స్వయం ఉపాధికి వడ్డీ లేని స్టార్టప్ రుణాలు."
    ],
    pointsEn: [
      "Transparent recruitment for 2 lakh vacant state government jobs via a strict annual job calendar.",
      "Legal mandate guaranteeing 70% private sector job reservations for local Telangana youth.",
      "Advanced tech, AI, and vocational skill centers set up in every district.",
      "Zero-interest startup capital loans to encourage youth entrepreneurship and self-employment."
    ]
  },
  {
    num: "04",
    titleTe: "రైతుకు పూర్తి అండ",
    titleEn: "Full Support for Farmers",
    pointsTe: [
      "ప్రతి ఎకరానికి సాగునీటి సౌకర్యం మరియు నిరంతర నాణ్యమైన ఉచిత విద్యుత్ సరఫరా.",
      "అన్ని పంటలకు లాభదాయకమైన మద్దతు ధర (MSP) మరియు ప్రభుత్వమే గ్రామాల్లో కొనుగోలు కేంద్రాల నిర్వహణ.",
      "రైతు రుణాల రీస్ట్రక్చరింగ్ మరియు ప్రకృతి వైపరీత్యాల సమయాల్లో 72 గంటల్లో నష్టపరిహారం జమ.",
      "రైతులకు సబ్సిడీతో అధునాతన యంత్రాలు, సేంద్రీయ ఎరువులు మరియు నాణ్యమైన విత్తనాల పంపిణీ."
    ],
    pointsEn: [
      "Comprehensive canal and micro-irrigation water to every arable acre with uninterrupted power.",
      "Remunerative Minimum Support Price (MSP) and direct village-level government procurement.",
      "Proactive agricultural loan restructuring and 72-hour direct crop insurance compensation.",
      "Subsidized modern farm mechanization, quality seeds, and organic fertilizer distribution."
    ]
  },
  {
    num: "05",
    titleTe: "భూమి సమస్యలకు పరిష్కారం",
    titleEn: "Resolving Land Issues",
    pointsTe: [
      "ధరణి పోర్టల్ లోని లోపాలను సవరించి రైతులకు సరళమైన, పారదర్శకమైన రెవెన్యూ సేవలు.",
      "అసైన్డ్ భూములు, పోడు భూములకు శాశ్వత పట్టాలు మరియు హక్కుల కల్పన.",
      "ప్రతి మండలంలో 'భూ పరిష్కార అదాలత్‌లు' నిర్వహించి భూ వివాదాలను వెంటనే పరిష్కరించడం.",
      "భూ రికార్డులను పారదర్శకంగా బ్లాక్‌చెయిన్ మరియు శాటిలైట్ మ్యాపింగ్ ద్వారా భద్రపరచడం."
    ],
    pointsEn: [
      "Thorough overhaul of Dharani portal for hassle-free, citizen-friendly revenue services.",
      "Conferring permanent title passbooks for assigned lands and tribal Podu lands.",
      "Conducting regular Mandal-level 'Land Resolution Adalats' to settle civil disputes on the spot.",
      "Securing all land parcel cadastral records with modern GIS and blockchain verification."
    ]
  },
  {
    num: "06",
    titleTe: "పేదలకు ఇల్లు",
    titleEn: "Housing for the Poor",
    pointsTe: [
      "సొంత స్థలం ఉన్న ప్రతి నిరుపేద కుటుంబానికి ఇల్లు నిర్మించుకోవడానికి ₹5 లక్షల ఆర్థిక సహాయం.",
      "ఇంటి స్థలం లేని అర్హులకు ఉచితంగా ప్రభుత్వ స్థలంలో ఇళ్ల పట్టాల కేటాయింపు.",
      "కనీస వసతులు: తాగునీరు, డ్రైనేజీ, విద్యుత్ మరియు పార్కులతో కూడిన కాలనీల నిర్మాణం.",
      "మహిళల పేరుపైనే రిజిస్ట్రేషన్ మరియు గృహ హక్కుల అందజేత."
    ],
    pointsEn: [
      "₹5 Lakhs direct financial grant for eligible families owning plots to construct permanent homes.",
      "Free allocation of residential land plots and house titles to homeless families.",
      "Modern planned township colonies with clean drinking water, paved roads, and drainage.",
      "Exclusive home registration rights directly registered in the name of women."
    ]
  },
  {
    num: "07",
    titleTe: "మహిళలకు భద్రత, స్వావలంబన",
    titleEn: "Women Safety & Self-Reliance",
    pointsTe: [
      "మహిళా రక్షణ కోసం ప్రతి పోలీస్ స్టేషన్‌లో ప్రత్యేక ప్రజాసేవ డెస్క్ మరియు 24/7 రక్షక వాహనాలు.",
      "డ్వాక్రా సంఘాలకు వడ్డీ లేని ₹10 లక్షల వరకు ఆర్థిక రుణాలు.",
      "మహిళలకు ఉచిత బస్సు ప్రయాణం మరియు ప్రజా రవాణాలో సంపూర్ణ భద్రతా సీసీటీవీ నెట్‌వర్క్.",
      "మహిళా వ్యాపారవేత్తలకు ప్రత్యేక మార్కెటింగ్ మరియు కుటీర పరిశ్రమల ప్రోత్సాహకాలు."
    ],
    pointsEn: [
      "Dedicated women's protection desks in every police station with rapid emergency patrols.",
      "Zero-interest loans up to ₹10 Lakhs for DWCRA and women's self-help groups.",
      "Free public bus transit for women backed by integrated surveillance safety networks.",
      "Special subsidies, incubation, and direct market linkage for women micro-entrepreneurs."
    ]
  },
  {
    num: "08",
    titleTe: "గ్రామాల అభివృద్ధి",
    titleEn: "Rural Village Development",
    pointsTe: [
      "ప్రతి గ్రామానికి సిమెంట్ కాంక్రీట్ (CC) రోడ్లు, భూగర్భ డ్రైనేజ్ మరియు స్వచ్ఛమైన తాగునీటి వ్యవస్థ.",
      "గ్రామ పంచాయతీలకు పూర్తి అధికారాలు మరియు నేరుగా అభివృద్ధి నిధుల బదిలీ.",
      "ప్రతి గ్రామంలో వైఫై, డిజిటల్ లైబ్రరీ మరియు కమ్యూనిటీ సేవా కేంద్రాల ఏర్పాటు.",
      "సోలార్ వీధి దీపాలు మరియు పర్యావరణ పరిరక్షణతో ఆదర్శ హరిత గ్రామాల నిర్మాణం."
    ],
    pointsEn: [
      "All-weather paved cement concrete roads, underground drainage, and tap drinking water.",
      "Empowered Gram Panchayats with autonomous administrative funds and financial devolution.",
      "High-speed public Wi-Fi, digital libraries, and e-governance kiosks in every village.",
      "Solar street lighting and clean green ecological preservation for model villages."
    ]
  },
  {
    num: "09",
    titleTe: "అవినీతికి అడ్డుకట్ట",
    titleEn: "Curbing Corruption",
    pointsTe: [
      "ప్రభుత్వ కార్యాలయాల్లో లంచాల నిర్మూలనకు 'జీరో టాలరెన్స్' విధానం మరియు ప్రత్యేక విజిలెన్స్ సెల్.",
      "ప్రభుత్వ సేవలన్నీ 100% ఆన్‌లైన్ ద్వారా నిర్ణీత గడువులోగా ప్రజలకు అందజేసే గ్యారెంటీ చట్టం.",
      "అవినీతి నిరోధక టోల్ ఫ్రీ హెల్ప్‌లైన్ మరియు రక్షణ కల్పించే విజిల్ బ్లోయర్ పాలసీ.",
      "మంత్రులు, అధికారుల ఆస్తుల వివరాలు ప్రతి ఏడాది పబ్లిక్ డొమైన్‌లో బహిర్గతం."
    ],
    pointsEn: [
      "Zero-tolerance anti-corruption policy and rapid-response vigilance task force.",
      "Public Service Guarantee Act ensuring citizen services are delivered strictly within set deadlines.",
      "24/7 dedicated anti-corruption helpline with guaranteed whistleblower legal protection.",
      "Mandatory annual public asset disclosures for all elected representatives and high officials."
    ]
  },
  {
    num: "10",
    titleTe: "ప్రజల మాటే ప్రభుత్వ విధానం",
    titleEn: "People's Voice is Government Policy",
    pointsTe: [
      "ప్రతి నెల నియోజకవర్గాల్లో ప్రత్యక్ష 'ప్రజా దర్బార్' – ఎమ్మెల్యేలు, మంత్రులు స్వయంగా సమస్యలు వినడం.",
      "బడ్జెట్ రూపకల్పనలో ప్రజల భాగస్వామ్యం (పార్టిసిపేటరీ బడ్జెటింగ్).",
      "ప్రజా సమస్యలపై తక్షణ పరిష్కారం కోసం ప్రజాసేవ సిటిజన్ పోర్టల్ మరియు మొబైల్ యాప్.",
      "ప్రతి నిర్ణయం ప్రజల ప్రయోజనం మేరకే తీసుకునే నిజమైన పారదర్శక ప్రజా పాలన."
    ],
    pointsEn: [
      "Monthly 'Praja Darbar' in every constituency where leaders personally resolve citizen issues.",
      "Participatory budgeting empowering citizens to vote directly on regional community priorities.",
      "Prajaseva Citizen Portal and mobile app for instant grievance tracking and escalation.",
      "100% transparent participatory democracy putting the public's welfare above politics."
    ]
  }
];

function initPolicyModal() {
  const modalEl = document.getElementById('policyDetailModal');
  if (!modalEl) return;
  const modal = new bootstrap.Modal(modalEl);

  const cards = document.querySelectorAll('.issue-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-issue-index') || '0', 10);
      showPolicyDetail(idx, modal);
    });
  });

  const viewAllBtn = document.getElementById('btn-view-all-issues');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPolicyDetail(0, modal);
    });
  }
}

function showPolicyDetail(idx, modal) {
  const item = policyDetails[idx];
  if (!item) return;

  const titleEl = document.getElementById('policyModalTitle');
  const badgeEl = document.getElementById('policyModalBadge');
  const listEl = document.getElementById('policyModalList');

  if (titleEl) {
    titleEl.textContent = currentLang === 'te' ? item.titleTe : item.titleEn;
  }
  if (badgeEl) {
    badgeEl.textContent = `#${item.num}`;
  }
  if (listEl) {
    listEl.innerHTML = '';
    const points = currentLang === 'te' ? item.pointsTe : item.pointsEn;
    points.forEach((p) => {
      const li = document.createElement('li');
      li.className = 'mb-2 d-flex align-items-start gap-2';
      li.innerHTML = `<i class="bi bi-check-circle-fill text-danger mt-1"></i> <span>${p}</span>`;
      listEl.appendChild(li);
    });
  }

  modal.show();
}

/* ==========================================================================
   5. Policy Modal Popup (Issue Cards)
   ========================================================================== */
function initForms() {
  // Membership Form
  const memberForm = document.getElementById('membershipForm');
  if (memberForm) {
    memberForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('memberFullName').value.trim();
      const phone = document.getElementById('memberPhone').value.trim();
      const constituency = document.getElementById('memberConstituency').value.trim();

      if (!name || !phone || !constituency) {
        alert(currentLang === 'te' ? 'దయచేసి అన్ని వివరాలను నమోదు చేయండి.' : 'Please fill out all required fields.');
        return;
      }

      // Close modal
      const modalEl = document.getElementById('membershipModal');
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();

      memberForm.reset();
      showToast(
        currentLang === 'te'
          ? `ధన్యవాదాలు ${name} గారు! ప్రజాసేవ పార్టీ సభ్యత్వ నమోదు విజయవంతమైంది.`
          : `Thank you ${name}! Your Prajaseva Party membership has been registered.`
      );
    });
  }

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const val = emailInput ? emailInput.value.trim() : '';
      if (!val || !val.includes('@')) {
        alert(currentLang === 'te' ? 'దయచేసి సరైన ఈమెయిల్ నమోదు చేయండి.' : 'Please enter a valid email address.');
        return;
      }
      emailInput.value = '';
      showToast(
        currentLang === 'te'
          ? 'తాజా వార్తల కోసం మీ ఈమెయిల్ విజయవంతంగా నమోదు చేయబడింది!'
          : 'You have successfully subscribed to Prajaseva Party updates!'
      );
    });
  }
}

function showToast(message) {
  const toastEl = document.getElementById('siteToast');
  const toastBody = document.getElementById('toastBody');
  if (!toastEl || !toastBody) return;

  toastBody.textContent = message;
  const bsToast = new bootstrap.Toast(toastEl, { delay: 4500 });
  bsToast.show();
}

/* ==========================================================================
   7. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   8. Campaign Banner Quote Slider (5 Slides)
   ========================================================================== */
const campaignQuotes = [
  {
    te: "ఉచిత విద్య – ఉచిత వైద్యం – ఉపాధి – ప్రజల సంక్షేమమే ప్రజాసేవ పార్టీ లక్ష్యం.",
    en: "Free Education – Free Healthcare – Employment – People's Welfare is Prajaseva Party's Mission."
  },
  {
    te: "తెలంగాణలో స్థానికులకు 70 శాతం ప్రైవేట్ రంగంలో రిజర్వేషన్లు మా ధ్యేయం.",
    en: "70% Private Sector Job Reservation for Telangana Locals is Our Prime Goal."
  },
  {
    te: "రైతులకు పూర్తి మద్దతు ధర, నాణ్యమైన విత్తనాలు, రైతు సంక్షేమం మా బాధ్యత.",
    en: "Comprehensive Minimum Support Price and Prosperity for Every Farmer in Telangana."
  },
  {
    te: "ప్రతి పౌరుడికి ఉచిత సూపర్ స్పెషాలిటీ వైద్యం అందేలా ప్రజా పాలన.",
    en: "Universal Free Super-Specialty Healthcare for Every Citizen."
  },
  {
    te: "యువతకు నైపుణ్యాభివృద్ధి శిక్షణ మరియు లక్షలాది ఉపాధి అవకాశాలు.",
    en: "Youth Skill Empowerment and Creation of Sustainable Quality Employment."
  }
];

let currentCampaignQuoteIdx = 0;
let campaignSliderTimer = null;

function initCampaignSlider() {
  const quoteEl = document.getElementById('campaign-slider-quote');
  const prevBtn = document.getElementById('campaign-quote-prev');
  const nextBtn = document.getElementById('campaign-quote-next');
  const dots = document.querySelectorAll('#campaign-quote-dots .slider-dot');

  if (!quoteEl || dots.length === 0) return;

  function updateQuote(idx) {
    currentCampaignQuoteIdx = idx;
    quoteEl.style.opacity = '0';
    setTimeout(() => {
      quoteEl.textContent = currentLang === 'te'
        ? campaignQuotes[idx].te
        : campaignQuotes[idx].en;
      quoteEl.style.opacity = '1';
    }, 200);

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let idx = currentCampaignQuoteIdx - 1;
      if (idx < 0) idx = campaignQuotes.length - 1;
      updateQuote(idx);
      resetTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let idx = (currentCampaignQuoteIdx + 1) % campaignQuotes.length;
      updateQuote(idx);
      resetTimer();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateQuote(idx);
      resetTimer();
    });
  });

  function startTimer() {
    campaignSliderTimer = setInterval(() => {
      let idx = (currentCampaignQuoteIdx + 1) % campaignQuotes.length;
      updateQuote(idx);
    }, 5500);
  }

  function resetTimer() {
    if (campaignSliderTimer) clearInterval(campaignSliderTimer);
    startTimer();
  }

  startTimer();
}

/**
 * State Bilingual Mapping for Interactive India Map
 */
const mapStateNames = {
  INAN: { te: "అండమాన్ & నికోబార్ దీవులు", en: "Andaman & Nicobar Islands" },
  INTG: { te: "తెలంగాణ", en: "Telangana" },
  INAP: { te: "ఆంధ్రప్రదేశ్", en: "Andhra Pradesh" },
  INAR: { te: "అరుణాచల్ ప్రదేశ్", en: "Arunachal Pradesh" },
  INAS: { te: "అస్సాం", en: "Assam" },
  INBR: { te: "బీహార్", en: "Bihar" },
  INCH: { te: "చండీగఢ్", en: "Chandigarh" },
  INCT: { te: "ఛత్తీస్‌గఢ్", en: "Chhattisgarh" },
  INDH: { te: "దాద్రా & నగర్ హవేలి", en: "Dadra & Nagar Haveli" },
  INDL: { te: "ఢిల్లీ (NCR)", en: "Delhi (NCR)" },
  INGA: { te: "గోవా", en: "Goa" },
  INGJ: { te: "గుజరాత్", en: "Gujarat" },
  INHR: { te: "హర్యానా", en: "Haryana" },
  INHP: { te: "హిమాచల్ ప్రదేశ్", en: "Himachal Pradesh" },
  INJH: { te: "జార్ఖండ్", en: "Jharkhand" },
  INKA: { te: "కర్ణాటక", en: "Karnataka" },
  INKL: { te: "కేరళ", en: "Kerala" },
  INMP: { te: "మధ్యప్రదేశ్", en: "Madhya Pradesh" },
  INMH: { te: "మహారాష్ట్ర", en: "Maharashtra" },
  INMN: { te: "మణిపూర్", en: "Manipur" },
  INML: { te: "మేఘాలయ", en: "Meghalaya" },
  INMZ: { te: "మిజోరం", en: "Mizoram" },
  INNL: { te: "నాగాలాండ్", en: "Nagaland" },
  INOR: { te: "ఒడిశా", en: "Odisha" },
  INPY: { te: "పుదుచ్చేరి", en: "Puducherry" },
  INPB: { te: "పంజాబ్", en: "Punjab" },
  INRJ: { te: "రాజస్థాన్", en: "Rajasthan" },
  INSK: { te: "సిక్కిం", en: "Sikkim" },
  INTN: { te: "తమిళనాడు", en: "Tamil Nadu" },
  INTR: { te: "త్రిపుర", en: "Tripura" },
  INUP: { te: "ఉత్తర ప్రదేశ్", en: "Uttar Pradesh" },
  INUT: { te: "ఉత్తరాఖండ్", en: "Uttarakhand" },
  INWB: { te: "పశ్చిమ బెంగాల్", en: "West Bengal" },
  INLD: { te: "లక్షద్వీప్", en: "Lakshadweep" },
  INJK: { te: "జమ్మూ & కాశ్మీర్", en: "Jammu & Kashmir" },
  INLA: { te: "లడఖ్", en: "Ladakh" }
};

let currentlyHoveredMapPath = null;

function getMapStateName(path, lang) {
  if (!path) return '';
  const id = path.id;
  if (mapStateNames[id]) {
    return lang === 'en' ? mapStateNames[id].en : mapStateNames[id].te;
  }
  if (lang === 'en') {
    return path.getAttribute('data-state-en') || path.getAttribute('data-state') || 'State';
  }
  return path.getAttribute('data-state') || 'రాష్ట్రం';
}

function updateMapTooltipLanguage(lang) {
  const tooltipTitle = document.getElementById('mapTooltipTitle');
  if (!tooltipTitle) return;
  if (currentlyHoveredMapPath) {
    tooltipTitle.textContent = getMapStateName(currentlyHoveredMapPath, lang);
  } else {
    tooltipTitle.textContent = lang === 'en' ? 'State' : 'రాష్ట్రం';
  }
}

/**
 * Interactive Vector India Map
 * Shows state name for all states on hover in current language
 * For Party States (Telangana, Andhra Pradesh, Karnataka, Maharashtra):
 * Displays rich interactive State Leader Popup Card with leader info, districts, and party details
 */
function initInteractiveMap() {
  const mapStage = document.getElementById('indiaMapStage');
  if (!mapStage) return;

  const tooltip = document.getElementById('mapInteractiveTooltip');
  const tooltipTitle = document.getElementById('mapTooltipTitle');
  const popup = document.getElementById('telanganaLeaderPopup') || document.querySelector('.state-leader-popup');
  const closePopupBtn = document.getElementById('closeTelanganaPopup');
  const statePaths = document.querySelectorAll('.india-map-stage .map-state-path');

  const partyStatesData = {
    INTG: {
      id: 'INTG',
      name: { te: 'తెలంగాణ', en: 'Telangana' },
      districtsBadge: { te: '33 జిల్లాలు - ప్రజా సేవ', en: '33 Districts - Praja Seva' },
      leaderName: { te: 'తల్లారం నర్సింలు', en: 'Thallaram Narsimlu' },
      leaderRole: { te: 'పార్టీ అధ్యక్షుడు, తెలంగాణ', en: 'Party President, Telangana' },
      avatar: 'assets/images/passport.jpg',
      districts: [
        { text: { te: 'హైదరాబాద్ (కేంద్రం)', en: 'Hyderabad (HQ)' }, isHq: true },
        { text: { te: 'వరంగల్', en: 'Warangal' } },
        { text: { te: 'కరీంనగర్', en: 'Karimnagar' } },
        { text: { te: 'నిజామాబాద్', en: 'Nizamabad' } },
        { text: { te: 'ఖమ్మం', en: 'Khammam' } },
        { text: { te: 'నల్గొండ', en: 'Nalgonda' } },
        { text: { te: '+27 జిల్లాలు', en: '+27 Districts' }, isMore: true }
      ]
    },
    INAP: {
      id: 'INAP',
      name: { te: 'ఆంధ్రప్రదేశ్', en: 'Andhra Pradesh' },
      districtsBadge: { te: '26 జిల్లాలు - ప్రజా సేవ', en: '26 Districts - Praja Seva' },
      leaderName: { te: 'శ్రీ నాయుడు రామచంద్రరావు', en: 'Sri Naidu Ramachandra Rao' },
      leaderRole: { te: 'పార్టీ సమన్వయకర్త, ఆంధ్రప్రదేశ్', en: 'Party Coordinator, Andhra Pradesh' },
      avatar: 'assets/images/partymember2.webp',
      districts: [
        { text: { te: 'విజయవాడ / అమరావతి (కేంద్రం)', en: 'Vijayawada / Amaravati (HQ)' }, isHq: true },
        { text: { te: 'విశాఖపట్నం', en: 'Visakhapatnam' } },
        { text: { te: 'తిరుపతి', en: 'Tirupati' } },
        { text: { te: 'గుంటూరు', en: 'Guntur' } },
        { text: { te: 'కర్నూలు', en: 'Kurnool' } },
        { text: { te: 'కాకినాడ', en: 'Kakinada' } },
        { text: { te: '+20 జిల్లాలు', en: '+20 Districts' }, isMore: true }
      ]
    },
    INKA: {
      id: 'INKA',
      name: { te: 'కర్ణాటక', en: 'Karnataka' },
      districtsBadge: { te: '31 జిల్లాలు - ప్రజా సేవ', en: '31 Districts - Praja Seva' },
      leaderName: { te: 'శ్రీ పి. సాయి కిరణ్', en: 'Sri P. Sai Kiran' },
      leaderRole: { te: 'పార్టీ సమన్వయకర్త, కర్ణాటక', en: 'Party Coordinator, Karnataka' },
      avatar: 'assets/images/team/sai-kiran.png',
      districts: [
        { text: { te: 'బెంగళూరు (కేంద్రం)', en: 'Bengaluru (HQ)' }, isHq: true },
        { text: { te: 'మైసూర్', en: 'Mysuru' } },
        { text: { te: 'హుబ్బళ్లి', en: 'Hubballi' } },
        { text: { te: 'మంగళూరు', en: 'Mangaluru' } },
        { text: { te: 'బళ్లారి', en: 'Ballari' } },
        { text: { te: 'బెళగావి', en: 'Belagavi' } },
        { text: { te: '+25 జిల్లాలు', en: '+25 Districts' }, isMore: true }
      ]
    },
    INMH: {
      id: 'INMH',
      name: { te: 'మహారాష్ట్ర', en: 'Maharashtra' },
      districtsBadge: { te: '36 జిల్లాలు - ప్రజా సేవ', en: '36 Districts - Praja Seva' },
      leaderName: { te: 'శ్రీ కె. అనిల్ కుమార్', en: 'Sri K. Anil Kumar' },
      leaderRole: { te: 'పార్టీ సమన్వయకర్త, మహారాష్ట్ర', en: 'Party Coordinator, Maharashtra' },
      avatar: 'assets/images/team/anil-kumar.png',
      districts: [
        { text: { te: 'ముంబై (కేంద్రం)', en: 'Mumbai (HQ)' }, isHq: true },
        { text: { te: 'పూణే', en: 'Pune' } },
        { text: { te: 'నాగ్పూర్', en: 'Nagpur' } },
        { text: { te: 'నాసిక్', en: 'Nashik' } },
        { text: { te: 'ఛత్రపతి శంభాజీనగర్', en: 'Chhatrapati Sambhajinagar' } },
        { text: { te: 'షోలాపూర్', en: 'Solapur' } },
        { text: { te: '+30 జిల్లాలు', en: '+30 Districts' }, isMore: true }
      ]
    }
  };

  let popupTimer = null;
  let activePartyStateKey = null;

  function renderStatePopup(stateKey) {
    const data = partyStatesData[stateKey];
    if (!data || !popup) return;
    activePartyStateKey = stateKey;

    const lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'te';

    const titleEl = document.getElementById('popupStateTitle');
    const badgeEl = document.getElementById('popupStateDistricts');
    const avatarEl = document.getElementById('popupAvatarImg');
    const leaderNameEl = document.getElementById('popupLeaderName');
    const leaderRoleEl = document.getElementById('popupLeaderRole');
    const distGridEl = document.getElementById('popupDistrictsGrid');

    if (titleEl) titleEl.textContent = data.name[lang] || data.name.te;
    if (badgeEl) badgeEl.textContent = data.districtsBadge[lang] || data.districtsBadge.te;
    if (avatarEl) {
      avatarEl.src = data.avatar;
      avatarEl.alt = data.leaderName[lang] || data.leaderName.te;
    }
    if (leaderNameEl) leaderNameEl.textContent = data.leaderName[lang] || data.leaderName.te;
    if (leaderRoleEl) leaderRoleEl.textContent = data.leaderRole[lang] || data.leaderRole.te;

    if (distGridEl) {
      distGridEl.innerHTML = '';
      data.districts.forEach((dist) => {
        const span = document.createElement('span');
        span.className = 'dist-pill' + (dist.isHq ? ' dist-hq' : '') + (dist.isMore ? ' dist-more' : '');
        span.textContent = dist.text[lang] || dist.text.te;
        distGridEl.appendChild(span);
      });
    }
  }

  function openStatePopup(stateKey, pathEl) {
    if (popupTimer) clearTimeout(popupTimer);
    currentlyHoveredMapPath = null;
    if (tooltip) tooltip.classList.remove('visible');

    // Highlight hovered party state and un-highlight others
    document.querySelectorAll('.active-party-state').forEach(el => el.classList.remove('is-active-state'));
    if (pathEl) pathEl.classList.add('is-active-state');

    renderStatePopup(stateKey);
    if (popup) popup.classList.add('active');
  }

  function closeStatePopup() {
    popupTimer = setTimeout(() => {
      if (popup) popup.classList.remove('active');
      document.querySelectorAll('.active-party-state').forEach(el => el.classList.remove('is-active-state'));
      activePartyStateKey = null;
    }, 280);
  }

  // Hook into language changes to update popup dynamically if it's currently open
  window.updateMapPopupLanguage = function(lang) {
    if (popup && popup.classList.contains('active') && activePartyStateKey) {
      renderStatePopup(activePartyStateKey);
    }
  };

  statePaths.forEach((path) => {
    const stateId = path.id;
    const isPartyState = Boolean(partyStatesData[stateId]);

    if (isPartyState) {
      path.classList.add('active-party-state');
      path.addEventListener('mouseenter', () => openStatePopup(stateId, path));
      path.addEventListener('mouseleave', closeStatePopup);
      path.addEventListener('click', (e) => {
        e.stopPropagation();
        if (tooltip) tooltip.classList.remove('visible');
        if (popup) {
          if (popup.classList.contains('active') && activePartyStateKey === stateId) {
            popup.classList.remove('active');
            path.classList.remove('is-active-state');
            activePartyStateKey = null;
          } else {
            openStatePopup(stateId, path);
          }
        }
      });
      return;
    }

    // All other states: show state name in the tooltip according to selected language
    path.addEventListener('mouseenter', () => {
      if (popup && popup.classList.contains('active')) return;
      currentlyHoveredMapPath = path;
      const stateName = getMapStateName(path, currentLang);
      if (tooltipTitle) tooltipTitle.textContent = stateName;
      if (tooltip) tooltip.classList.add('visible');
    });

    path.addEventListener('mousemove', (e) => {
      if (!tooltip || !mapStage) return;
      const rect = mapStage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    });

    path.addEventListener('mouseleave', () => {
      if (currentlyHoveredMapPath === path) {
        currentlyHoveredMapPath = null;
      }
      if (tooltip) tooltip.classList.remove('visible');
    });
  });

  // Keep popup open when cursor is hovered over it
  if (popup) {
    popup.addEventListener('mouseenter', () => {
      if (popupTimer) clearTimeout(popupTimer);
    });
    popup.addEventListener('mouseleave', closeStatePopup);
  }

  // Close button
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (popup) popup.classList.remove('active');
      document.querySelectorAll('.active-party-state').forEach(el => el.classList.remove('is-active-state'));
      activePartyStateKey = null;
    });
  }

  // Dismiss popup on outside click
  document.addEventListener('click', (e) => {
    if (popup && popup.classList.contains('active')) {
      const isClickedOnPartyState = e.target.closest && e.target.closest('.active-party-state');
      if (!popup.contains(e.target) && !isClickedOnPartyState) {
        popup.classList.remove('active');
        document.querySelectorAll('.active-party-state').forEach(el => el.classList.remove('is-active-state'));
        activePartyStateKey = null;
      }
    }
  });
}
