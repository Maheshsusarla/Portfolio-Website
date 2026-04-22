
/* ============================================================
   Mahesh Susarla Portfolio — script.js
============================================================ */

"use strict";

const ROLES = [
  "Python Developer",
  "Full Stack Engineer",
  "Sql Developer",
  "Frontend Developer",
  // "ReactJS Learner",
  // "Problem Solver",
];

document.addEventListener("DOMContentLoaded", function () {
  initNavbar();
  initTypewriter();
  initScrollReveal();
  initForm();
  initThemeToggle();
  initBackToTop();
  initActiveNavLinks();
});

/* ── 1. Sticky navbar ───────────────────────────────────── */
function initNavbar() {
  var nav = document.getElementById("mainNav");
  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll);
  onScroll();
}

/* ── 2. Typewriter ──────────────────────────────────────── */
function initTypewriter() {
  var el = document.getElementById("typedRole");
  if (!el) return;
  var rIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    var word = ROLES[rIdx];
    if (deleting) {
      el.textContent = word.slice(0, cIdx - 1);
      cIdx--;
    } else {
      el.textContent = word.slice(0, cIdx + 1);
      cIdx++;
    }
    var delay = deleting ? 45 : 85;
    if (!deleting && cIdx === word.length) {
      delay = 2000;
      deleting = true;
    } else if (deleting && cIdx === 0) {
      deleting = false;
      rIdx = (rIdx + 1) % ROLES.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 600);
}

/* ── 3. Scroll reveal ───────────────────────────────────── */
function initScrollReveal() {
  var els = document.querySelectorAll(".reveal-left, .reveal-right, .reveal-up");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.13 });
  els.forEach(function (el) { io.observe(el); });
}

/* ── 4. Contact form + Formspree ────────────────────────── */
function initForm() {
  var form = document.getElementById("contactForm");
  var btn  = document.getElementById("submitBtn");

  if (!form) { console.log("Form not found!"); return; }
  if (!btn)  { console.log("Button not found!"); return; }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    /* clear previous states */
    form.querySelectorAll(".form-control").forEach(function (f) {
      f.classList.remove("is-invalid", "is-valid");
    });
    var successDiv = form.querySelector(".form-success");
    var errorDiv   = form.querySelector(".form-error");
    if (successDiv) successDiv.classList.add("d-none");
    if (errorDiv)   errorDiv.classList.add("d-none");

    /* validate */
    var valid = true;
    form.querySelectorAll("[required]").forEach(function (f) {
      var ok = f.value.trim() !== "";
      if (f.type === "email") {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim());
      }
      f.classList.add(ok ? "is-valid" : "is-invalid");
      if (!ok) valid = false;
    });
    if (!valid) return;

    /* show loading */
    var btnText = btn.querySelector(".btn-text");
    var btnLoad = btn.querySelector(".btn-loading");
    if (btnText) btnText.classList.add("d-none");
    if (btnLoad) btnLoad.classList.remove("d-none");
    btn.disabled = true;

    /* send to Formspree */
    try {
      var response = await fetch("https://formspree.io/f/xlganpga", {
        method:  "POST",
        body:    new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        if (successDiv) successDiv.classList.remove("d-none");
        form.reset();
        form.querySelectorAll(".form-control").forEach(function (f) {
          f.classList.remove("is-valid", "is-invalid");
        });
        setTimeout(function () {
          if (successDiv) successDiv.classList.add("d-none");
        }, 6000);
      } else {
        if (errorDiv) errorDiv.classList.remove("d-none");
      }
    } catch (err) {
      if (errorDiv) errorDiv.classList.remove("d-none");
    }

    /* reset button */
    if (btnText) btnText.classList.remove("d-none");
    if (btnLoad) btnLoad.classList.add("d-none");
    btn.disabled = false;
  });
}

/* ── 5. Dark / light toggle ─────────────────────────────── */
function initThemeToggle() {
  var html = document.documentElement;
  var btn  = document.getElementById("themeToggle");
  var icon = document.getElementById("themeIcon");
  if (!btn) return;

  var saved = localStorage.getItem("ms-theme") || "dark";
  applyTheme(saved);

  btn.addEventListener("click", function () {
    var next = html.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("ms-theme", next);
  });

  function applyTheme(t) {
    html.dataset.theme = t;
    if (icon) {
      icon.className = t === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
    }
  }
}

/* ── 6. Back to top ─────────────────────────────────────── */
function initBackToTop() {
  var btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ── 7. Active nav links ────────────────────────────────── */
function initActiveNavLinks() {
  var sections = document.querySelectorAll("section[id]");
  var links    = document.querySelectorAll(".nav-link");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (l) {
          if (l.getAttribute("href") === "#" + e.target.id) {
            l.classList.add("active");
          } else {
            l.classList.remove("active");
          }
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(function (s) { io.observe(s); });
}