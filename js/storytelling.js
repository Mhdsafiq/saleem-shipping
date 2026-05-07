// ===== SINGLE-SECTION STORYTELLING — ALL SCENES IN ONE PINNED VIEW =====

function initStorytelling() {
  gsap.registerPlugin(ScrollTrigger);

  // --- Hero parallax & fade ---
  gsap.to('.hero-bg video, .hero-bg img', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  gsap.to('.hero-content', {
    opacity: 0, y: -50, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: '40% top', end: 'bottom top', scrub: true }
  });

  gsap.to('.scroll-indicator', {
    opacity: 0,
    scrollTrigger: { trigger: '.hero', start: '5% top', end: '20% top', scrub: true }
  });

  // ===== PANELS & INDICATORS =====
  const panels = document.querySelectorAll('.story-panel');
  const dots = document.querySelectorAll('.story-dot');
  const storySection = document.querySelector('#story-section');

  if (!storySection || panels.length === 0) return;

  let currentScene = 0;
  const totalScenes = panels.length;
  let isAnimating = false;
  let sceneTimelines = [];

  // --- Generate scene particles ---
  document.querySelectorAll('.scene-particles').forEach(container => {
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.classList.add('s-particle');
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.width = p.style.height = (2 + Math.random() * 5) + 'px';
      p.style.animationDelay = Math.random() * 15 + 's';
      p.style.animationDuration = (12 + Math.random() * 10) + 's';
      container.appendChild(p);
    }
  });

  // --- Generate city buildings ---
  const cityBg = document.querySelector('.city-bg');
  if (cityBg) {
    const widths =  [30, 45, 25, 55, 35, 20, 50, 28, 40, 60, 22, 38, 48, 32, 42, 55, 25, 35];
    const heights = [80, 130, 60, 160, 100, 50, 140, 70, 110, 180, 55, 90, 150, 75, 120, 170, 65, 95];
    for (let i = 0; i < widths.length; i++) {
      const b = document.createElement('div');
      b.classList.add('building');
      b.style.width = widths[i] + 'px';
      b.style.height = heights[i] + 'px';
      cityBg.appendChild(b);
    }
  }

  // --- Continuous animations (always running) ---
  // Ship bobbing
  gsap.to('.cargo-ship', { y: -10, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.ship-smoke', { x: -20, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  // Crane
  gsap.to('.crane-arm', { rotation: -12, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'right center' });
  gsap.to('.crane-cable', { rotation: -4, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'top center' });

  // ===== BUILD SCENE ANIMATION FUNCTIONS =====

  function playScene1() {
    const tl = gsap.timeline();
    const panel = document.querySelector('#panel-ship');

    // Badge fades in
    tl.fromTo(panel.querySelector('.scene-badge'), { opacity: 0 }, { opacity: 0.7, duration: 0.5 }, 0);

    // Ship enters from left to center
    tl.fromTo('.cargo-ship', { x: -600 }, { x: window.innerWidth * 0.35, duration: 2, ease: 'power2.out' }, 0);

    // Text fades in
    tl.fromTo(panel.querySelector('.scene-text'), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 0.8);

    return tl;
  }

  function playScene2() {
    const tl = gsap.timeline();
    const panel = document.querySelector('#panel-port');

    // Badge
    tl.fromTo(panel.querySelector('.scene-badge'), { opacity: 0 }, { opacity: 0.7, duration: 0.5 }, 0);

    // Containers rise
    tl.fromTo('.port-containers', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0);

    // Vehicle drives
    tl.fromTo('.port-vehicle', { x: -100, opacity: 0 }, { x: window.innerWidth * 0.5, opacity: 1, duration: 2.5, ease: 'power1.inOut' }, 0.3);

    // Text
    tl.fromTo(panel.querySelector('.scene-text'), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 0.6);

    return tl;
  }

  function playScene3() {
    const tl = gsap.timeline();
    const panel = document.querySelector('#panel-delivery');

    // Badge
    tl.fromTo(panel.querySelector('.scene-badge'), { opacity: 0 }, { opacity: 0.7, duration: 0.5 }, 0);

    // City buildings
    tl.fromTo('.city-bg', { opacity: 0 }, { opacity: 0.35, duration: 1 }, 0);

    // Truck drives
    tl.fromTo('.delivery-truck', { x: -250 }, { x: window.innerWidth * 0.55, duration: 2.5, ease: 'power1.inOut' }, 0.2);

    // Route glow
    tl.fromTo('.route-glow-inner', { width: '0%' }, { width: '100%', duration: 2.5 }, 0.2);

    // Text
    tl.fromTo(panel.querySelector('.scene-text'), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 0.8);

    // GPS pin
    tl.fromTo('.gps-pin', { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 0.6, ease: 'bounce.out' }, 1.5);

    return tl;
  }

  function playScene4() {
    const tl = gsap.timeline();
    const panel = document.querySelector('#panel-world');

    // Badge
    tl.fromTo(panel.querySelector('.scene-badge'), { opacity: 0 }, { opacity: 0.7, duration: 0.5 }, 0);

    // Map SVG
    tl.fromTo('.world-map-svg svg', { opacity: 0, scale: 0.85 }, { opacity: 0.4, scale: 1, duration: 1.5 }, 0);

    // Country dots
    tl.fromTo('.country-dot', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.1, duration: 0.4, ease: 'back.out(2)' }, 0.5);

    // Route paths
    tl.fromTo('.route-path', { opacity: 0, scaleX: 0 }, { opacity: 0.8, scaleX: 1, stagger: 0.12, duration: 0.5, ease: 'power2.out' }, 0.8);

    // Text
    tl.fromTo(panel.querySelector('.scene-text'), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 1);

    return tl;
  }

  const scenePlayFns = [playScene1, playScene2, playScene3, playScene4];

  // ===== SWITCH SCENE =====
  function switchToScene(index) {
    if (index === currentScene || isAnimating || index < 0 || index >= totalScenes) return;
    isAnimating = true;

    const oldPanel = panels[currentScene];
    const newPanel = panels[index];

    // Kill any running scene timelines
    sceneTimelines.forEach(tl => tl.kill());
    sceneTimelines = [];

    // Fade out old panel
    gsap.to(oldPanel, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        oldPanel.classList.remove('active-panel');
        oldPanel.style.visibility = 'hidden';
      }
    });

    // Update dots
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');

    // Show new panel
    newPanel.style.visibility = 'visible';
    newPanel.classList.add('active-panel');
    gsap.fromTo(newPanel, { opacity: 0 }, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.inOut',
      delay: 0.3,
      onComplete: () => {
        // Play the scene animation
        const tl = scenePlayFns[index]();
        sceneTimelines.push(tl);
        currentScene = index;
        isAnimating = false;
      }
    });
  }

  // ===== SCROLL-BASED SCENE SWITCHING (pinned section) =====
  ScrollTrigger.create({
    trigger: storySection,
    start: 'top top',
    end: '+=' + (totalScenes * 150) + '%',
    pin: true,
    pinSpacing: true,
    scrub: false,
    onUpdate: (self) => {
      // Divide scroll progress into scene segments
      const progress = self.progress;
      const sceneIndex = Math.min(Math.floor(progress * totalScenes), totalScenes - 1);

      if (sceneIndex !== currentScene && !isAnimating) {
        switchToScene(sceneIndex);
      }
    }
  });

  // ===== CLICK ON DOTS =====
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      switchToScene(i);
    });
  });

  // ===== PLAY FIRST SCENE ON ENTRY =====
  ScrollTrigger.create({
    trigger: storySection,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      // Play scene 1 entrance animation
      const tl = playScene1();
      sceneTimelines.push(tl);
    }
  });
}

// Initialize after loader finishes
window.addEventListener('load', () => {
  setTimeout(() => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      initStorytelling();
    }
  }, 2400);
});
