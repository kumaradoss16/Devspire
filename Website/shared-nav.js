/**
 * DevSpireHub — Shared Navigation & Interaction Handler
 * Handles brand typewriter, accessible mobile drawer toggle, and scroll-to-top progress
 */
document.addEventListener("DOMContentLoaded", () => {
  // ── 1. Typewriter Brand Header Effect ──
  (function initTypewriter() {
    const el = document.getElementById("brand");
    if (!el) return;
    const text = el.dataset.text || "DevspireHub";
    let i = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2400;
    const restartPause = 600;

    function loop() {
      const current = text.slice(0, i);
      el.textContent = current;

      if (!isDeleting && i < text.length) {
        i++;
        setTimeout(loop, typeSpeed);
      } else if (!isDeleting && i === text.length) {
        isDeleting = true;
        setTimeout(loop, pauseTime);
      } else if (isDeleting && i > 0) {
        i--;
        setTimeout(loop, deleteSpeed);
      } else if (isDeleting && i === 0) {
        isDeleting = false;
        setTimeout(loop, restartPause);
      }
    }
    loop();
  })();

  // ── 2. Accessible Mobile Menu Drawer ──
  (function initNavbarDrawer() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!menuToggle || !navLinks) return;

    function setMenuState(open) {
      navLinks.classList.toggle("active", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      const icon = menuToggle.querySelector("i");
      if (icon) {
        if (open) {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-times");
        } else {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      }
    }

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.contains("active");
      setMenuState(!isOpen);
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        setMenuState(false);
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        setMenuState(false);
        menuToggle.focus();
      }
    });
  })();

  // ── 3. Scroll to Top Floating Button with SVG Progress Ring ──
  (function initScrollUp() {
    const scrollBtn = document.getElementById("scrollUpBtn");
    if (!scrollBtn) return;

    const circle = scrollBtn.querySelector(".progress-circle .progress");
    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;

    if (circle) {
      circle.style.strokeDasharray = `${circumference}`;
      circle.style.strokeDashoffset = `${circumference}`;
    }

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

      if (circle) {
        const offset = circumference * (1 - ratio);
        circle.style.strokeDashoffset = offset;
      }

      scrollBtn.style.display = scrollTop > 220 ? "flex" : "none";
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  })();
});
