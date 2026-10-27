/* =====================================================================
   gallery.js  —  category filter + lightbox (click a photo to enlarge)
   ---------------------------------------------------------------------
   You normally do NOT need to edit this file.
   To add or change gallery photos, edit the "gallery" list in js/config.js.
   Used on: gallery.html (filters + lightbox) and index.html (lightbox).
   ===================================================================== */
(function () {
  "use strict";

  var overlay, imgEl, capEl, closeBtn, prevBtn, nextBtn;
  var items = [];      // visible gallery buttons in the grid that was clicked
  var index = 0;
  var lastFocus = null;

  function buildLightbox() {
    overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Photo viewer");
    overlay.innerHTML =
      '<button type="button" class="lightbox-btn lightbox-close" aria-label="Close photo viewer">&times;</button>' +
      '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous photo">&#8249;</button>' +
      '<figure class="lightbox-figure"><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next photo">&#8250;</button>';
    document.body.appendChild(overlay);
    imgEl = overlay.querySelector("img");
    capEl = overlay.querySelector("figcaption");
    closeBtn = overlay.querySelector(".lightbox-close");
    prevBtn = overlay.querySelector(".lightbox-prev");
    nextBtn = overlay.querySelector(".lightbox-next");

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () { show(index - 1); });
    nextBtn.addEventListener("click", function () { show(index + 1); });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", onKey);
  }

  function show(i) {
    if (!items.length) return;
    index = (i + items.length) % items.length;
    var btn = items[index];
    imgEl.src = btn.getAttribute("data-full");
    imgEl.alt = btn.getAttribute("data-alt") || "";
    capEl.textContent = btn.getAttribute("data-caption") || "";
    var single = items.length < 2;
    prevBtn.hidden = single;
    nextBtn.hidden = single;
  }

  function open(btn) {
    if (!overlay) buildLightbox();
    var grid = btn.closest(".gallery-grid") || document;
    items = Array.prototype.slice.call(grid.querySelectorAll(".gallery-fig:not([hidden]) .gallery-item"));
    lastFocus = btn;
    show(items.indexOf(btn));
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    imgEl.removeAttribute("src");
    if (lastFocus) lastFocus.focus();
  }

  function onKey(e) {
    if (!overlay || !overlay.classList.contains("is-open")) return;
    if (e.key === "Escape") { close(); }
    else if (e.key === "ArrowLeft") { show(index - 1); }
    else if (e.key === "ArrowRight") { show(index + 1); }
    else if (e.key === "Tab") {
      // keep keyboard focus inside the viewer while it is open
      var focusable = [closeBtn, prevBtn, nextBtn].filter(function (b) { return !b.hidden; });
      var pos = focusable.indexOf(document.activeElement);
      e.preventDefault();
      var next = e.shiftKey ? pos - 1 : pos + 1;
      focusable[(next + focusable.length) % focusable.length].focus();
    }
  }

  // Click on any gallery photo (works for photos drawn by main.js)
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".gallery-item");
    if (btn) open(btn);
  });

  // Category filter buttons (gallery.html)
  document.addEventListener("click", function (e) {
    var fb = e.target.closest && e.target.closest(".filter-btn");
    if (!fb) return;
    var bar = fb.parentNode;
    Array.prototype.forEach.call(bar.querySelectorAll(".filter-btn"), function (b) {
      b.setAttribute("aria-pressed", b === fb ? "true" : "false");
    });
    var wanted = fb.getAttribute("data-filter");
    var shown = 0;
    Array.prototype.forEach.call(document.querySelectorAll(".gallery-grid .gallery-fig"), function (fig) {
      var match = wanted === "All" || fig.getAttribute("data-category") === wanted;
      fig.hidden = !match;
      if (match) shown++;
    });
    var status = document.getElementById("gallery-status");
    if (status) status.textContent = shown + (shown === 1 ? " photo" : " photos") + " shown" + (wanted === "All" ? "" : " in " + wanted);
  });
})();
