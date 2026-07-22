/**
 * i-SPY website scripts
 * Core navigation, scroll and hero-detail behaviour only.
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reviewParameters = new URLSearchParams(window.location.search);
  const staticWordmarkReview = reviewParameters.get("header") === "wordmark";
  const headerFadeStart = 100;
  const headerFadeEnd = 220;
  const headerOrbRotationStart = 180;
  const headerOrbRotationEnd = 1000;
  const heroOrbMaximumAngle = 135;
  const headerOrbMaximumAngle = 108;

  function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
  }

  function preserveHeaderReviewParameter() {
    if (!staticWordmarkReview) return;

    document.querySelectorAll("a[href]").forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href || link.hasAttribute("download") || /^(?:mailto:|tel:|https?:\/\/|\/\/)/i.test(href) || /\.pdf(?:$|[?#])/i.test(href)) return;

      const hashIndex = href.indexOf("#");
      const queryIndex = href.indexOf("?");
      const endOfPath = [hashIndex, queryIndex].filter(function (index) { return index >= 0; }).reduce(function (lowest, index) { return Math.min(lowest, index); }, href.length);
      const path = href.slice(0, endOfPath);

      const target = new URL(href, window.location.href);
      target.searchParams.set("header", "wordmark");
      const relativePath = path || window.location.pathname || "/";
      link.setAttribute("href", relativePath + "?" + target.searchParams.toString() + target.hash);
    });
  }

  function prepareHeaderComparison() {
    const brandLink = document.querySelector("header .site-wordmark");
    if (!brandLink) return null;

    brandLink.setAttribute("aria-label", "i-Spy home");
    const wordmark = brandLink.querySelector("img");
    if (wordmark) wordmark.setAttribute("alt", "");
    if (staticWordmarkReview || !wordmark) return null;

    document.body.classList.add("header-changing");
    brandLink.classList.add("site-wordmark--orb-mode");
    wordmark.classList.add("header-wordmark");

    const wordmarkWrapper = document.createElement("span");
    wordmarkWrapper.className = "header-asset header-wordmark-wrapper";
    brandLink.insertBefore(wordmarkWrapper, wordmark);
    wordmarkWrapper.appendChild(wordmark);

    const orbWrapper = document.createElement("span");
    orbWrapper.className = "header-asset header-orb-wrapper";
    orbWrapper.setAttribute("aria-hidden", "true");
    const orb = document.createElement("img");
    orb.className = "header-orb";
    orb.src = "/assets/ispy-orb-live-master.svg";
    orb.alt = "";
    orb.setAttribute("aria-hidden", "true");
    orbWrapper.appendChild(orb);
    brandLink.appendChild(orbWrapper);
    return brandLink;
  }

  preserveHeaderReviewParameter();
  const comparisonBrandLink = prepareHeaderComparison();

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    });
  });

  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  function setMobileMenu(open) {
    hamburger.classList.toggle("active", open);
    mobileMenu.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      setMobileMenu(!mobileMenu.classList.contains("active"));
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMobileMenu(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mobileMenu.classList.contains("active")) {
        setMobileMenu(false);
        hamburger.focus();
      }
    });
  }

  const header = document.querySelector("header");
  const heroDot = document.querySelector(".hero-dot");
  let ticking = false;

  function updateScrollDetails() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 50);
    if (comparisonBrandLink) {
      const transitionProgress = clamp((window.scrollY - headerFadeStart) / (headerFadeEnd - headerFadeStart), 0, 1);
      const rotationProgress = clamp((window.scrollY - headerOrbRotationStart) / (headerOrbRotationEnd - headerOrbRotationStart), 0, 1);
      const calculatedHeaderAngle = rotationProgress * headerOrbMaximumAngle;
      const clampedHeaderAngle = Math.min(
        headerOrbMaximumAngle,
        Math.max(0, calculatedHeaderAngle)
      );
      const orbAngle = prefersReducedMotion.matches
        ? 0
        : clampedHeaderAngle;
      comparisonBrandLink.style.setProperty("--brand-transition-progress", transitionProgress.toFixed(4));
      comparisonBrandLink.style.setProperty("--wordmark-scale", (1 - transitionProgress * 0.01).toFixed(4));
      comparisonBrandLink.style.setProperty("--orb-scale", (0.99 + transitionProgress * 0.01).toFixed(4));
      comparisonBrandLink.style.setProperty("--orb-angle", orbAngle + "deg");
    }
    if (heroDot) {
      heroDot.style.transform = prefersReducedMotion.matches
        ? "none"
        : `rotate(${clamp((window.scrollY - headerOrbRotationStart) / (headerOrbRotationEnd - headerOrbRotationStart), 0, 1) * heroOrbMaximumAngle}deg)`;
    }
  }

  function onScroll() {
    if (ticking) return;
    window.requestAnimationFrame(function () {
      updateScrollDetails();
      ticking = false;
    });
    ticking = true;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  if (prefersReducedMotion.addEventListener) {
    prefersReducedMotion.addEventListener("change", updateScrollDetails);
  }
  updateScrollDetails();
})();
