(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.remove("no-js");
  doc.classList.add("js");

  /* Current year */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Theme: cycles system → light → dark → system (no localStorage) */
  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    var cycle = ["system", "light", "dark"];
    themeBtn.addEventListener("click", function () {
      var current = doc.getAttribute("data-theme") || "system";
      var idx = cycle.indexOf(current);
      var next = cycle[(idx + 1) % cycle.length];
      if (next === "system") {
        doc.removeAttribute("data-theme");
      } else {
        doc.setAttribute("data-theme", next);
      }
    });
  }

  /* Mobile nav */
  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav") || document.getElementById("audit-nav");

  function setNavOpen(open) {
    if (!header || !navToggle) return;
    header.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!header.classList.contains("is-open"));
    });

    if (siteNav) {
      siteNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          if (window.matchMedia("(max-width: 880px)").matches) {
            setNavOpen(false);
          }
        });
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  /* Scroll reveal */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealEls = document.querySelectorAll(".reveal");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /*
   * CTA hooks: elements use data-cta="book-strategy-call" | "apply-audit" | "book-audit-call"
   * and ids such as cta-book-hero, cta-apply-final — attach Calendly, Typeform, or mailto here.
   */
})();
