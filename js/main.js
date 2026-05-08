// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('hidden');
    document.body.style.overflow = '';
    initAOS();
  }, 2200);
});
document.body.style.overflow = 'hidden';

// ===== NAVBAR =====
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// All pages use light theme — always show scrolled navbar on scroll
if (navbar) {
  navbar.classList.add('scrolled');
}

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50 || true);
});

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  // Don't close mobile nav when clicking Services dropdown trigger
  if (link.closest('.nav-dropdown') && link.parentElement.classList.contains('nav-dropdown')) return;
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks?.classList.remove('active');
    // Also close any open dropdowns
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  });
});

// Dropdown menu links — navigate normally and close dropdown
document.querySelectorAll('.dropdown-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks?.classList.remove('active');
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  });
});

// Prevent Services link from navigating — only show dropdown
document.querySelectorAll('.nav-dropdown > a').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dropdown = a.closest('.nav-dropdown');
    // Close other open dropdowns
    document.querySelectorAll('.nav-dropdown.open').forEach(d => {
      if (d !== dropdown) d.classList.remove('open');
    });
    if (dropdown) dropdown.classList.toggle('open');
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  }
});

// Set active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ===== AOS (Animate On Scroll) - Custom Implementation =====
function initAOS() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.aosDelay || 0;
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-aos]').forEach(el => {
    el.style.opacity = '0';
    el.style.transition = `all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${el.dataset.aosDelay || 0}ms`;
    
    const anim = el.dataset.aos;
    if (anim === 'fade-up') el.style.transform = 'translateY(40px)';
    else if (anim === 'fade-down') el.style.transform = 'translateY(-40px)';
    else if (anim === 'fade-left') el.style.transform = 'translateX(40px)';
    else if (anim === 'fade-right') el.style.transform = 'translateX(-40px)';
    else if (anim === 'zoom-in') el.style.transform = 'scale(0.9)';
    else if (anim === 'flip-up') el.style.transform = 'perspective(500px) rotateX(10deg)';
    
    observer.observe(el);
  });
}

// Add animate class styles
const aosStyle = document.createElement('style');
aosStyle.textContent = `.aos-animate { opacity: 1 !important; transform: none !important; }`;
document.head.appendChild(aosStyle);

// ===== STATS COUNTER =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    if (counter.dataset.counted) return;
    const target = parseInt(counter.dataset.target);
    const suffix = counter.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      counter.textContent = Math.floor(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    counter.dataset.counted = 'true';
    requestAnimationFrame(update);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelector('.stats-section') && statsObserver.observe(document.querySelector('.stats-section'));

// ===== TESTIMONIAL SLIDER =====
const track = document.querySelector('.testimonial-track');
const dots = document.querySelectorAll('.testimonial-dots .dot');
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.testimonial-card').length;

function goToSlide(i) {
  currentSlide = i;
  if (track) track.style.transform = `translateX(-${i * 100}%)`;
  dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
}

dots.forEach((dot, idx) => dot.addEventListener('click', () => goToSlide(idx)));

if (totalSlides > 0) {
  setInterval(() => {
    goToSlide((currentSlide + 1) % totalSlides);
  }, 5000);
}

// ===== PARTICLES =====
function createParticles(container, count = 20) {
  const el = document.querySelector(container);
  if (!el) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 15 + 's';
    p.style.animationDuration = (10 + Math.random() * 15) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
    el.appendChild(p);
  }
}
createParticles('.cta-section .particles', 15);

// ===== HERO TEXT ANIMATION =====
function animateHeroText() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;
  const elements = heroContent.children;
  Array.from(elements).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300 + i * 200);
  });
}
setTimeout(animateHeroText, 2300);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== SERVICE CARD 3D TILT =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-10px) perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) perspective(800px) rotateX(0) rotateY(0)';
  });
});

// Removed fake JS submission to allow native Formsubmit.co integration


// ===== SERVICE NAVIGATE =====
function navigateWithLoader(url) {
  window.location.href = url;
}

// Attach navigate buttons
document.querySelectorAll('.service-navigate-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = btn.getAttribute('data-href');
    if (url) navigateWithLoader(url);
  });
});

// Prevent service cards with navigate buttons from direct navigation
document.querySelectorAll('.service-card.has-navigate').forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
  });
});
