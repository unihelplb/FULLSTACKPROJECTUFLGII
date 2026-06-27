/* =====================================================================
   nav.js — Navigation behaviour
   Written as an ES6 class (course requirement: ES6 classes, no jQuery).

   Responsibilities:
     1. Toggle the mobile menu open/closed (and the hamburger -> X anim).
     2. Highlight the link for the page you're currently on.

   How active-link detection works:
     This is a MULTI-PAGE site (separate .html files), so the current page
     is identified from window.location.pathname — we grab the filename
     (e.g. "explore.html") and match it against each link's href. This is
     simpler and more correct here than scroll-spying with Intersection
     Observer, which is what you'd use for a single-page anchored layout.
   ===================================================================== */
class Navigation {
  constructor(rootSelector = ".site-header") {
    this.root = document.querySelector(rootSelector);
    if (!this.root) return;

    this.toggle = this.root.querySelector(".nav-toggle");
    this.menu = this.root.querySelector(".nav-links");
    this.links = [...this.root.querySelectorAll(".nav-links a")];

    this.init();
  }

  init() {
    // 1) Mobile open/close
    this.toggle.addEventListener("click", () => this.toggleMenu());

    // Close the menu when a link is tapped (mobile) or Esc is pressed
    this.links.forEach((link) =>
      link.addEventListener("click", () => this.closeMenu())
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeMenu();
    });

    // 2) Highlight the current page
    this.markActiveLink();
  }

  toggleMenu() {
    const isOpen = this.menu.classList.toggle("open");
    this.toggle.classList.toggle("open", isOpen);
    this.toggle.setAttribute("aria-expanded", String(isOpen));
  }

  closeMenu() {
    this.menu.classList.remove("open");
    this.toggle.classList.remove("open");
    this.toggle.setAttribute("aria-expanded", "false");
  }

  markActiveLink() {
    // Current filename, defaulting to index.html for the root "/"
    const current =
      window.location.pathname.split("/").pop() || "index.html";

    this.links.forEach((link) => {
      const target = link.getAttribute("href");
      if (target === current) link.classList.add("active");
    });
  }
}

// Boot once the DOM is ready
document.addEventListener("DOMContentLoaded", () => new Navigation());
