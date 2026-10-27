/* =====================================================================
   main.js  —  shared behavior for every page
   ---------------------------------------------------------------------
   You normally do NOT need to edit this file. Business details, services,
   packages, gallery photos, etc. are all edited in js/config.js.

   What this file does:
     - Builds the header (logo + menu) and footer on every page
     - Fills in contact details wherever data-bind / data-link is used
     - Draws services, packages, gallery, venue lists, testimonials, map
     - Mobile menu toggle and scroll animations
   ===================================================================== */
(function () {
  "use strict";

  var C = window.SITE_CONFIG;
  if (!C) {
    console.error("config.js did not load. Check that js/config.js exists and is loaded before js/main.js.");
    return;
  }

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function getPath(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  function sampleBadge(text) {
    return '<span class="sample-badge" data-sample>' + esc(text || "Sample") + "</span>";
  }

  var B = C.business;
  var page = document.body.getAttribute("data-page") || "";
  var mapQuery = encodeURIComponent(B.address);
  var LINKS = {
    tel: "tel:" + B.phoneLink,
    mail: "mailto:" + B.email,
    facebook: B.facebookUrl || "",
    directions: "https://www.google.com/maps/search/?api=1&query=" + mapQuery
  };

  /* ---------- header ---------- */
  function buildHeader() {
    var host = $("#site-header");
    if (!host) return;
    var items = C.nav.map(function (n) {
      var current = n.page === page ? ' aria-current="page"' : "";
      return '<li><a href="' + esc(n.href) + '"' + current + ">" + esc(n.label) + "</a></li>";
    }).join("");
    var cta = C.navCta;
    var ctaCurrent = cta.page === page ? ' aria-current="page"' : "";

    host.innerHTML =
      '<div class="sample-banner" role="note" data-sample>Draft preview: this site contains sample text, prices, and photos. ' +
      "Replace them, then set showSampleNotices to false in js/config.js before publishing.</div>" +
      '<header class="site-header"><div class="container header-inner">' +
      '<a class="brand" href="index.html" aria-label="' + esc(B.shortName) + ' - Home">' +
      '<img src="' + esc(B.logo) + '" alt="' + esc(B.logoAlt) + '" width="64" height="64">' +
      '<span class="brand-text">' + esc(B.shortName.toUpperCase()) + "<small>EVENTS VENUE</small></span></a>" +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu"><span></span></button>' +
      '<nav id="primary-nav" class="primary-nav" aria-label="Main navigation"><ul>' + items + "</ul>" +
      '<a class="btn btn-primary btn-sm" href="' + esc(cta.href) + '"' + ctaCurrent + ">" + esc(cta.label) + "</a></nav>" +
      "</div></header>";

    var toggle = $(".nav-toggle", host);
    var nav = $("#primary-nav", host);
    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    $all("a", nav).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
  }

  /* ---------- footer ---------- */
  function buildFooter() {
    var host = $("#site-footer");
    if (!host) return;
    var links = C.nav.concat([C.navCta]).map(function (n) {
      return '<li><a href="' + esc(n.href) + '">' + esc(n.label) + "</a></li>";
    }).join("");
      host.innerHTML =
      '<footer class="site-footer"><div class="container"><div class="footer-grid">' +
      '<div><div class="footer-brand"><img src="' + esc(B.logo) + '" alt="' + esc(B.logoAlt) + '" width="72" height="72" loading="lazy">' +
      "<strong>" + esc(B.name) + "</strong></div>" +
      "<p>" + esc(B.tagline) + "</p></div>" +
      '<div><h3>Explore</h3><ul class="footer-links">' + links + "</ul></div>" +
      "<div><h3>Contact Us</h3>" +
      '<ul class="contact-list">' +
      '<li><span class="ci" aria-hidden="true"><img class="ci-icon" src="assets/icons/contact-pin.svg" alt="" width="20" height="20"></span><address class="address-block">' + esc(B.address) + "</address></li>" +
      '<li><span class="ci" aria-hidden="true"><img class="ci-icon" src="assets/icons/contact-phone.svg" alt="" width="20" height="20"></span><a data-link="tel" href="' + esc(LINKS.tel) + '">' + esc(B.phoneDisplay) + "</a></li>" +
      '<li><span class="ci" aria-hidden="true"><img class="ci-icon" src="assets/icons/contact-email.svg" alt="" width="20" height="20"></span><a data-link="mail" href="' + esc(LINKS.mail) + '">' + esc(B.email) + "</a></li>" +
      '<li data-link-wrap="facebook"><span class="ci" aria-hidden="true"><img class="all-icon" src="assets/icons/facebook.svg" alt="" width="20" height="20"></span><a data-link="facebook" href="' + esc(LINKS.facebook) + '" target="_blank" rel="noopener">Facebook Page</a></li>' +
      "</ul>" +
      '<a class="btn btn-light btn-sm" href="inquire.html">Send an Inquiry</a></div>' +
      "</div>" +
      '<div class="footer-bottom">&copy; ' + new Date().getFullYear() + " " + esc(B.name) + ". All rights reserved.</div>" +
      "</div></footer>";
  }

  /* ---------- simple text/link bindings ---------- */
  function applyBindings() {
    $all("[data-bind]").forEach(function (el) {
      var value = getPath(C, el.getAttribute("data-bind"));
      if (value != null) el.textContent = value;
    });
    $all("[data-link]").forEach(function (el) {
      var key = el.getAttribute("data-link");
      var url = LINKS[key];
      if (key === "facebook" && !url) {
        var wrap = el.closest("[data-link-wrap]") || el;
        wrap.parentNode && wrap.parentNode.removeChild(wrap);
        return;
      }
      if (url) el.setAttribute("href", url);
    });
    $all("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- renderers ---------- */
  function limitList(list, el) {
    var n = parseInt(el.getAttribute("data-limit") || "0", 10);
    return n > 0 ? list.slice(0, n) : list;
  }

  function serviceCard(s) {
    var priceHtml = "<strong>" + esc(s.price) + "</strong>";
    return '<article class="card service-card' + (s.main ? " service-card--main" : "") + ' reveal" id="service-' + esc(s.id) + '">' +
      '<img src="' + esc(s.image) + '" alt="' + esc(s.imageAlt) + '" width="900" height="600" loading="lazy">' +
      '<div class="card-body">' +
      (s.main ? '<p class="eyebrow">Main Service</p>' : "") +
      "<h3>" + esc(s.title) + "</h3>" +
      "<p>" + esc(s.description) + "</p>" +
      '<p class="price">' + priceHtml +
      (s.priceNote ? ' <span class="price-note">' + esc(s.priceNote) + "</span>" : "") +
      (s.sample ? sampleBadge() : "") + "</p>" +
      '<a class="btn btn-outline" href="inquire.html?service=' + encodeURIComponent(s.id) + '">Inquire About This Service</a>' +
      "</div></article>";
  }

  function packageCard(p, compact) {
    var inquire = "inquire.html?package=" + encodeURIComponent(p.id);
    var priceBlock = '<p class="package-price"><span class="amount">' + esc(p.price) + "</span>" +
      (p.priceNote ? " <small>" + esc(p.priceNote) + "</small>" : "") +
      (p.sample ? sampleBadge() : "") + "</p>";
    var meta = '<ul class="package-meta"><li><strong>Guests:</strong> ' + esc(p.guests) + "</li>" +
      "<li><strong>Duration:</strong> " + esc(p.duration) + "</li></ul>";
    var services = (compact ? p.services.slice(0, 4) : p.services).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
  
    /* ---------- Packages card ---------- */
    if (compact) {
      return '<article class="card package-card compact' + (p.highlight ? " is-highlight" : "") + ' reveal"><div class="card-body">' +
        '<h3 class="package-name">' + esc(p.name) + "</h3>" + priceBlock + meta +
        '<ul class="check-list">' + services + "</ul>" +
        '<a class="btn btn-primary" href="' + inquire + '">Inquire</a></div></article>';
    }
    var amenities = p.amenities.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    return '<article class="card package-card' + (p.highlight ? " is-highlight" : "") + ' reveal" id="package-' + esc(p.id) + '">' +
      (p.highlight ? '<span class="ribbon">Featured</span>' : "") +
      '<div class="card-body"><h3 class="package-name">' + esc(p.name) + "</h3>" + priceBlock + meta +
      "<h4>Included services</h4><ul class=\"check-list\">" + services + "</ul>" +
      "<h4>Decoration options</h4><p>" + esc(p.decorations) + "</p>" +
      "<h4>Catering options</h4><p>" + esc(p.catering) + "</p>" +
      "<h4>Additional amenities</h4><ul class=\"check-list\">" + amenities + "</ul>" +
      "<h4>Booking conditions</h4><p class=\"small\">" + esc(p.conditions) + "</p>" +
      '<a class="btn btn-primary" href="' + inquire + '">Choose This Package</a></div></article>';
  }

  function galleryFigure(g, index) {
    return '<figure class="gallery-fig reveal" data-category="' + esc(g.category) + '">' +
      '<button type="button" class="gallery-item" data-full="' + esc(g.full || g.src) + '" data-caption="' + esc(g.caption || "") + '" data-alt="' + esc(g.alt || g.caption || "") + '" aria-label="View larger: ' + esc(g.caption || g.alt || "photo " + (index + 1)) + '">' +
      '<img src="' + esc(g.src) + '" alt="' + esc(g.alt || "") + '" width="1200" height="800" loading="lazy"></button>' +
      (g.caption ? "<figcaption>" + esc(g.caption) + "</figcaption>" : "") + "</figure>";
  }

  var RENDERERS = {
    "services": function (el) {
      el.innerHTML = limitList(C.services, el).map(serviceCard).join("");
    },
    "packages": function (el) {
      var compact = el.getAttribute("data-compact") === "true";
      el.innerHTML = limitList(C.packages, el).map(function (p) { return packageCard(p, compact); }).join("");
    },
    "gallery": function (el) {
      var list = C.gallery;
      if (el.getAttribute("data-featured") === "true") list = list.filter(function (g) { return g.featured; });
      el.innerHTML = list.map(galleryFigure).join("") || '<p class="gallery-empty">No photos yet. Add some in js/config.js.</p>';
    },
    "gallery-filters": function (el) {
      var cats = ["All"].concat(C.galleryCategories);
      el.innerHTML = cats.map(function (c, i) {
        return '<button type="button" class="filter-btn" data-filter="' + esc(c) + '" aria-pressed="' + (i === 0 ? "true" : "false") + '">' + esc(c) + "</button>";
      }).join("");
    },
    "highlights": function (el) {
      el.innerHTML = C.highlights.map(function (h) {
        // Icon can be an image path (.svg/.png/...) or a plain emoji/text.
        // A leading "/" is removed so the path also works from a file or a sub-folder site.
        var isImage = /\.(svg|png|jpe?g|webp|gif)$/i.test(h.icon || "");
        var iconHtml = isImage
          ? '<img class="highlight-icon" src="' + esc(String(h.icon).replace(/^\/+/, "")) + '" alt="" width="48" height="48" loading="lazy">'
          : '<span class="icon" aria-hidden="true">' + esc(h.icon) + "</span>";
        return '<div class="highlight reveal">' + iconHtml + "<h3>" + esc(h.title) + "</h3><p>" + esc(h.text) + "</p></div>";
      }).join("");
    },
    "testimonials": function (el) {
      if (!C.testimonials || !C.testimonials.length) {
        var section = el.closest("section");
        if (section) section.parentNode.removeChild(section);
        return;
      }
      el.innerHTML = C.testimonials.map(function (t) {
        return '<blockquote class="testimonial reveal"><p>&ldquo;' + esc(t.quote) + "&rdquo;</p><footer>" + esc(t.name) +
          (t.event ? ", " + esc(t.event) : "") + sampleBadge("Sample testimonial") + "</footer></blockquote>";
      }).join("");
    },
    "event-types": function (el) {
      el.innerHTML = C.eventTypes.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    },
    "venue-intro": function (el) {
      el.innerHTML = C.venue.intro.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    },
    "venue-photos": function (el) {
      el.innerHTML = C.venue.photos.map(function (p) {
        return '<figure class="photo-card reveal"><img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" width="1200" height="800" loading="lazy">' +
          (p.caption ? "<figcaption>" + esc(p.caption) + "</figcaption>" : "") + "</figure>";
      }).join("");
    },
    "venue-spaces": function (el) {
      el.innerHTML = C.venue.spaces.map(function (s) {
        return '<article class="card space-card reveal"><div class="card-body"><h3>' + esc(s.name) + "</h3>" +
          '<p class="capacity">' + esc(s.capacity) + sampleBadge() + "</p><p>" + esc(s.description) + "</p></div></article>";
      }).join("");
    },
    "venue-amenities": function (el) {
      el.innerHTML = C.venue.amenities.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("");
    },
    "venue-rental": function (el) {
      el.innerHTML = C.venue.rental.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("");
    },
    "venue-access": function (el) {
      el.innerHTML = C.venue.accessibility.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("");
    },
    "map": function (el) {
      el.innerHTML = '<iframe title="Map showing the location of ' + esc(B.shortName) + '" ' +
        'src="https://maps.google.com/maps?q=' + mapQuery + '&amp;output=embed" loading="lazy" ' +
        'referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
    }
  };

  function renderAll() {
    $all("[data-render]").forEach(function (el) {
      var fn = RENDERERS[el.getAttribute("data-render")];
      if (fn) fn(el);
      else console.warn("Unknown data-render value:", el.getAttribute("data-render"));
    });
  }

  /* ---------- scroll animation ---------- */
  function setupReveal() {
    var els = $all(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- init ---------- */
  buildHeader();
  buildFooter();
  applyBindings();
  renderAll();
  // After everything is drawn, remove "sample" notices if the owner turned them off.
  if (!C.showSampleNotices) $all("[data-sample]").forEach(function (el) { el.parentNode && el.parentNode.removeChild(el); });
  setupReveal();
  document.dispatchEvent(new CustomEvent("site:ready"));
})();
