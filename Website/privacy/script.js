/**
 * DevSpireHub — Privacy Policy Script
 * Implements Scrollspy Table of Contents & Accessible Anchor Navigation
 */
document.addEventListener("DOMContentLoaded", () => {
  const tocLinks = document.querySelectorAll(".toc-item a");
  const sections = Array.from(document.querySelectorAll(".privacy-section[id]"));

  if (!sections.length || !tocLinks.length) return;

  // Active section tracking with IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: "-90px 0px -70% 0px",
    threshold: 0
  };

  function setActiveToc(id) {
    tocLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href === `#${id}`) {
        link.classList.add("active");
        link.setAttribute("aria-current", "true");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveToc(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // Smooth click scroll
  tocLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSec = document.querySelector(targetId);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: "smooth" });
        targetSec.setAttribute("tabindex", "-1");
        targetSec.focus({ preventScroll: true });
        setActiveToc(targetSec.id);
      }
    });
  });
});
