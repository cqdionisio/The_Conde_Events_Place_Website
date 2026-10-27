/* =====================================================================
   booking.js  -  inquiry / booking-request form (inquire.html)
   ---------------------------------------------------------------------
   You normally do NOT need to edit this file.
     - Event types, packages and services in the form come from js/config.js
     - WHERE the inquiry is sent is set in js/config.js  (form.endpoint)
     - Labels and wording of the form are in inquire.html

   How sending works
     The form posts to the address in js/config.js (form.endpoint):
       * a Google Apps Script web app  (recommended, free, sends the email
         from your own Gmail: see server/google-apps-script/Code.gs), or
       * a Formspree form address      (alternative; free plan has a
         monthly limit).
     NO passwords or secret keys are stored in this website.
     The page says "submitted" ONLY after the service confirms it accepted
     the inquiry. If sending is not set up, or it fails, the page says so,
     keeps what the visitor typed, and offers an email/phone fallback.
   ===================================================================== */
(function () {
  "use strict";

  var C = window.SITE_CONFIG;
  var form = document.getElementById("inquiry-form");
  if (!C || !form) return;

  var FORM_CFG = C.form || {};
  var statusBox = document.getElementById("form-status");
  var submitBtn = document.getElementById("submit-btn");
  var SUBMIT_LABEL = submitBtn.textContent;
  var submitting = false;

  function $(id) { return document.getElementById(id); }
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  /* ---------- fill dropdowns / checkboxes from config.js ---------- */
  function fillOptions() {
    var eventSel = $("eventType");
    eventSel.innerHTML = '<option value="">Select an event type</option>' +
      C.eventTypes.map(function (t) { return '<option value="' + esc(t) + '">' + esc(t) + "</option>"; }).join("");

    var pkgSel = $("package");
    pkgSel.innerHTML = '<option value="">Not sure yet</option>' +
      C.packages.map(function (p) {
        return '<option value="' + esc(p.id) + '">' + esc(p.name) + (/\d/.test(p.price) ? " (" + esc(p.price) + (p.sample ? ", sample price" : "") + ")" : "") + "</option>";
      }).join("");

    // Additional services = every service except the main venue rental
    $("services-options").innerHTML = C.services.filter(function (s) { return !s.main; }).map(function (s) {
      return '<div class="check"><input type="checkbox" name="service" id="svc-' + esc(s.id) + '" value="' + esc(s.title) + '" data-id="' + esc(s.id) + '">' +
        '<label for="svc-' + esc(s.id) + '">' + esc(s.title) + "</label></div>";
    }).join("");
  }

  /* ---------- preselect from the link (?package=premium&service=videoke) ---------- */
  function preselect() {
    var params = new URLSearchParams(window.location.search);
    var pkg = params.get("package");
    if (pkg && $("package").querySelector('option[value="' + CSS.escape(pkg) + '"]')) $("package").value = pkg;
    var svc = params.get("service");
    if (svc) {
      var box = form.querySelector('input[name="service"][data-id="' + CSS.escape(svc) + '"]');
      if (box) box.checked = true;
    }
    var ev = params.get("event");
    if (ev && $("eventType").querySelector('option[value="' + CSS.escape(ev) + '"]')) $("eventType").value = ev;
  }

  /* ---------- date: block past dates ---------- */
  function todayString() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  /* ---------- validation ---------- */
  var RULES = {
    fullName: function (v) {
      if (!v.trim()) return "Please enter your full name.";
      if (v.trim().length < 2) return "Please enter your full name.";
      return "";
    },
    phone: function (v) {
      if (!v.trim()) return "Please enter your contact number.";
      var digits = v.replace(/[\s\-().]/g, "");
      if (!/^\+?\d{7,15}$/.test(digits)) return "Enter a valid phone number, e.g. 0912-345-6789 or +63 912 345 6789.";
      return "";
    },
    email: function (v) {
      if (!v.trim()) return "Please enter your email address.";
      if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]{2,}$/.test(v.trim())) return "Enter a valid email address, e.g. name@example.com.";
      return "";
    },
    eventType: function (v) { return v ? "" : "Please select an event type."; },
    eventDate: function (v) {
      if (!v) return "Please choose your preferred event date.";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Please choose a valid date.";
      if (v < todayString()) return "Please choose today or a future date.";
      return "";
    },
    eventTime: function (v) { return v ? "" : "Please choose your preferred event time."; },
    guests: function (v) {
      if (!v) return "Please enter the estimated number of guests.";
      var n = Number(v);
      if (!Number.isInteger(n) || n < 1) return "Enter a whole number of guests (1 or more).";
      if (n > 2000) return "Please enter a realistic number of guests, or tell us in the message.";
      return "";
    },
    budget: function (v) { return v.length > 60 ? "Please keep this under 60 characters." : ""; },
    consent: function (_v, el) { return el.checked ? "" : "Please confirm you have read the privacy notice."; }
  };

  function errorEl(id) { return $("err-" + id); }

  function validateField(id) {
    var el = $(id);
    var rule = RULES[id];
    if (!rule) return true;
    var msg = rule(el.value, el);
    var box = errorEl(id);
    if (box) box.textContent = msg;
    if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
    return !msg;
  }

  function validateAll() {
    var firstBad = null;
    Object.keys(RULES).forEach(function (id) {
      if (!validateField(id) && !firstBad) firstBad = $(id);
    });
    return firstBad;
  }

  /* ---------- collecting what the visitor typed ---------- */
  function selectedServices() {
    return Array.prototype.map.call(form.querySelectorAll('input[name="service"]:checked'), function (b) { return b.value; });
  }
  function selectedPackageName() {
    var sel = $("package");
    return sel.value ? sel.options[sel.selectedIndex].text.replace(/\s*\(.*\)$/, "") : "Not sure yet";
  }
  function collect() {
    return {
      fullName: $("fullName").value.trim(),
      phone: $("phone").value.trim(),
      email: $("email").value.trim(),
      eventType: $("eventType").value,
      eventDate: $("eventDate").value,
      eventTime: $("eventTime").value,
      guests: $("guests").value,
      "package": selectedPackageName(),
      services: selectedServices().join(", "),
      budget: $("budget").value.trim(),
      message: $("message").value.trim()
    };
  }

  // Readable labels (used for the Formspree email and the "email app" fallback)
  var LABELS = [
    ["fullName", "Full Name"], ["phone", "Contact Number"], ["email", "Email"],
    ["eventType", "Event Type"], ["eventDate", "Preferred Event Date"], ["eventTime", "Preferred Event Time"],
    ["guests", "Estimated Guests"], ["package", "Selected Package"], ["services", "Additional Services"],
    ["budget", "Budget"], ["message", "Message"]
  ];
  var EMPTY_TEXT = { services: "None selected", budget: "Not specified", message: "(none)" };
  function shown(data, key) { return data[key] ? data[key] : (EMPTY_TEXT[key] || ""); }

  function fillTemplate(tpl, data) {
    return String(tpl).replace(/\{(\w+)\}/g, function (_m, k) { return data[k] != null ? data[k] : ""; });
  }
  function emailSubject(data) {
    return fillTemplate(FORM_CFG.emailSubject || "New Event Inquiry — {eventType} — {eventDate}", data);
  }

  /* ---------- where to send ---------- */
  var APPS_SCRIPT_RE = /^https:\/\/script\.google\.com\/(?:a\/macros\/[A-Za-z0-9.\-]+\/|macros\/)s\/[A-Za-z0-9_\-]+\/exec$/;
  var FORMSPREE_RE = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/;

  function getEndpoint() { return String(FORM_CFG.endpoint || FORM_CFG.formspreeEndpoint || "").trim(); }
  function providerOf(url) {
    if (APPS_SCRIPT_RE.test(url)) return "apps-script";
    if (FORMSPREE_RE.test(url)) return "formspree";
    return "";
  }

  function mailtoLink(data) {
    var lines = ["Hello, I'd like to inquire about an event at " + C.business.shortName + ".", ""];
    LABELS.forEach(function (pair) { lines.push(pair[1] + ": " + shown(data, pair[0])); });
    lines.push("", "(The date and time above are my preferences and are subject to your confirmation.)");
    return "mailto:" + C.business.email + "?subject=" + encodeURIComponent("Event inquiry - " + data.eventType) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  /* ---------- status messages ---------- */
  function showStatus(kind, html) {
    statusBox.className = "status is-" + kind;
    statusBox.setAttribute("role", kind === "error" || kind === "warning" ? "alert" : "status");
    statusBox.innerHTML = html;
    statusBox.hidden = false;
    statusBox.scrollIntoView({ behavior: "smooth", block: "center" });
    statusBox.setAttribute("tabindex", "-1");
    statusBox.focus({ preventScroll: true });
  }

  function fallbackButtons(data) {
    return '<div class="btn-row"><a class="btn btn-primary btn-sm" href="' + esc(mailtoLink(data)) + '">Send by Email App</a>' +
      '<a class="btn btn-outline btn-sm" href="tel:' + esc(C.business.phoneLink) + '">Call ' + esc(C.business.phoneDisplay) + "</a></div>";
  }

  /* ---------- duplicate protection ---------- */
  // (a) Same details sent successfully in the last 10 minutes: block a second send.
  function signature(data) { return JSON.stringify(data); }
  function recentlySent(sig) {
    try {
      var raw = sessionStorage.getItem("conde-last-inquiry");
      if (!raw) return false;
      var last = JSON.parse(raw);
      return last.sig === sig && Date.now() - last.time < 10 * 60 * 1000;
    } catch (e) { return false; }
  }
  function rememberSent(sig) {
    try { sessionStorage.setItem("conde-last-inquiry", JSON.stringify({ sig: sig, time: Date.now() })); } catch (e) { /* ignore */ }
  }

  // (b) Every send carries a reference ID. If a reply is lost and the visitor
  // retries with the same details, the SAME ID is sent again, so the server
  // (Google Apps Script) recognises it and does not email you twice.
  var attempt = { sig: "", id: "" };
  function newId() {
    try { if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID(); } catch (e) { /* fall through */ }
    return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }
  function idFor(sig) {
    if (attempt.sig !== sig) { attempt.sig = sig; attempt.id = newId(); }
    return attempt.id;
  }

  /* ---------- loading state ---------- */
  function setBusy(busy) {
    submitting = busy;
    submitBtn.disabled = busy;
    submitBtn.classList.toggle("is-loading", busy);
    submitBtn.textContent = busy ? "Sending..." : SUBMIT_LABEL;
    form.setAttribute("aria-busy", busy ? "true" : "false");
  }

  /* ---------- sending ---------- */
  // Every sender resolves to { state: "success" | "rejected" | "uncertain", code?, fields?, detail? }
  //   success   = the service confirmed it accepted the inquiry
  //   rejected  = the service answered "no" (so it was NOT sent)
  //   uncertain = no clear answer (network problem, timeout, odd reply): it MAY have gone through

  function sendToAppsScript(endpoint, data, id, signal) {
    var params = new URLSearchParams();
    Object.keys(data).forEach(function (k) { params.append(k, data[k]); });
    params.append("submissionId", id);
    params.append("_gotcha", "");
    return fetch(endpoint, {
      method: "POST",
      // A "simple" content type: the browser sends it without a pre-flight request
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: params.toString(),
      signal: signal
    }).then(function (res) { return res.text(); }).then(function (text) {
      var body;
      try { body = JSON.parse(text); } catch (e) { return { state: "uncertain" }; }
      if (body && body.ok === true) return { state: "success" };
      return { state: "rejected", code: body && body.error, fields: body && body.fields };
    });
  }

  function sendToFormspree(endpoint, data, id, signal) {
    var payload = new FormData();
    LABELS.forEach(function (pair) { payload.append(pair[0] === "email" ? "email" : pair[1], shown(data, pair[0])); });
    payload.append("_replyto", data.email);
    payload.append("_subject", emailSubject(data));
    payload.append("Reference ID", id);
    payload.append("_gotcha", "");
    return fetch(endpoint, { method: "POST", body: payload, headers: { "Accept": "application/json" }, signal: signal })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          if (res.ok) return { state: "success" };
          var detail = (body && body.errors && body.errors.length) ? body.errors.map(function (x) { return x.message; }).join("; ") : "";
          return { state: "rejected", code: "formspree", detail: detail };
        });
      });
  }

  /* ---------- outcomes ---------- */
  function onSuccess(sig) {
    rememberSent(sig);
    attempt = { sig: "", id: "" };
    form.reset();
    Object.keys(RULES).forEach(function (id) { var el = $(id); if (el) el.removeAttribute("aria-invalid"); });
    $("eventDate").min = todayString();
    showStatus("success",
      "<strong>" + esc(FORM_CFG.successMessage) + "</strong>" +
      "<p>Please note: the date and time you chose are preferences only and remain <strong>subject to confirmation</strong>. Your booking is not confirmed until our team contacts you.</p>");
  }

  function onRejected(r, data) {
    var text;
    if (r.code === "quota" || r.code === "busy") {
      text = "<strong>Our inquiry form is very busy right now, so your inquiry has NOT been sent.</strong> Please try again later, or contact us directly using the options below.";
    } else if (r.code === "invalid") {
      var list = r.fields ? Object.keys(r.fields).map(function (k) { return esc(r.fields[k]); }).join(" ") : "";
      text = "<strong>Your inquiry was not accepted.</strong> " + list + " Please check your details and try again.";
    } else {
      text = "<strong>Sorry, we couldn't send your inquiry" + (r.detail ? " (" + esc(r.detail) + ")" : "") + ".</strong> " +
        "Your details are still in the form, so you can try again, or use the options below.";
    }
    showStatus("error", text + fallbackButtons(data));
  }

  function onUncertain(data) {
    showStatus("error",
      "<strong>We couldn't confirm that your inquiry was received.</strong> Please check your internet connection and press Submit Inquiry to try again. " +
      "Your details are still in the form, and if the first attempt did go through, our team will recognise the duplicate. " +
      "You can also contact us directly using the options below." + fallbackButtons(data));
  }

  /* ---------- submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (submitting) return;

    // Spam trap: real visitors never see or fill this hidden field.
    if ($("_gotcha").value) { return; }

    statusBox.hidden = true;
    var bad = validateAll();
    if (bad) {
      showStatus("error", "<strong>Please check the form.</strong> Some fields need your attention (marked in red below).");
      bad.focus();
      return;
    }

    var data = collect();
    var sig = signature(data);
    if (recentlySent(sig)) {
      showStatus("warning", "<strong>This inquiry was already sent.</strong> We have your request and will contact you. If you need to change something, edit the form and submit again.");
      return;
    }

    var endpoint = getEndpoint();
    var provider = providerOf(endpoint);
    if (!provider) {
      console.warn("Inquiry form is not connected yet. Set form.endpoint in js/config.js (see README.md, Step 4). Current value:", endpoint);
      showStatus("warning",
        "<strong>Online sending isn't set up yet, so your inquiry has NOT been sent.</strong> " +
        "You can send the same details using your email app, or call us." + fallbackButtons(data));
      return;
    }

    setBusy(true);
    var id = idFor(sig);
    var controller = ("AbortController" in window) ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 30000) : null;
    var send = provider === "apps-script" ? sendToAppsScript : sendToFormspree;

    send(endpoint, data, id, controller ? controller.signal : undefined).then(function (r) {
      if (timer) clearTimeout(timer);
      setBusy(false);
      if (r.state === "success") onSuccess(sig);
      else if (r.state === "rejected") onRejected(r, data);
      else onUncertain(data);
    }, function () {
      // network error or timeout: no answer at all
      if (timer) clearTimeout(timer);
      setBusy(false);
      onUncertain(data);
    });
  });

  /* live validation feedback when leaving a field */
  Object.keys(RULES).forEach(function (id) {
    var el = $(id);
    if (!el) return;
    el.addEventListener("blur", function () { if (el.value || el.type === "checkbox" || el.getAttribute("aria-invalid")) validateField(id); });
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid")) validateField(id); });
    el.addEventListener("change", function () { if (el.getAttribute("aria-invalid")) validateField(id); });
  });

  /* ---------- init ---------- */
  fillOptions();
  preselect();
  $("eventDate").min = todayString();
})();
