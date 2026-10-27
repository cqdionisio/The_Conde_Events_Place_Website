/* =====================================================================
   Code.gs  -  Inquiry mailer for THE CONDE EVENTS PLACE
   Runs on Google Apps Script (free, inside YOUR Google account).
   ---------------------------------------------------------------------
   WHAT IT DOES
     The website's Inquire / Book form sends the customer's details to this
     script. The script checks them and emails them to OWNER_EMAIL (below),
     with the customer's email set as "Reply-To" so you can just press Reply.

   HOW TO USE IT (full beginner steps are in README.md, Step 4)
     1. Go to https://script.google.com and create a New project.
     2. Delete the sample code, paste THIS WHOLE FILE, and click Save.
     3. Change OWNER_EMAIL below if needed.
     4. Choose "sendTestEmail" in the toolbar and click Run (allow access).
     5. Deploy > New deployment > Web app > Execute as: Me,
        Who has access: Anyone > Deploy. Copy the Web app URL.
     6. Paste that URL into js/config.js  ->  form.endpoint

   WHICH EMAIL ADDRESS RECEIVES INQUIRIES?
     ONLY the OWNER_EMAIL below. The email shown on the website
     (business.email in js/config.js) is just for display.
     The emails are SENT FROM the Google account that deployed this script.

   NO secrets are stored in the website. The Web app URL is not a password,
   so this script validates everything again, ignores spam bots, and limits
   how many emails it will send per hour.

   FREE LIMITS (Google's published Apps Script quotas, which Google may
   change at any time): consumer Gmail accounts can send to 100 email
   recipients per day (Google Workspace accounts: 1,500). Each inquiry uses
   1. If the limit is reached the website shows an error and offers a
   phone/email fallback to the customer.
   ===================================================================== */


/* ---------- 1. SETTINGS (EDIT HERE) ---------- */

// The Gmail inbox that receives every inquiry. Can be different from the
// Google account that deploys this script.
var OWNER_EMAIL = "cyruz.mailbox@gmail.com";

// The sender name shown in your inbox.
var SENDER_NAME = "Conde Events Website";

// Subject line. {eventType} and {eventDate} are filled in automatically.
var SUBJECT_TEMPLATE = "New Event Inquiry — {eventType} — {eventDate}";

// Time zone used for the "submitted at" time and the past-date check.
var TIME_ZONE = "Asia/Manila";

// Safety limit: the most inquiry emails this script will send in one hour.
// Protects your daily Google quota from spam bursts.
var MAX_PER_HOUR = 15;


/* ---------- 2. WEB APP ENTRY POINTS (do not rename) ---------- */

// Opening the Web app URL in a browser shows this message. Handy to check
// that the deployment works.
function doGet() {
  return json_({ ok: true, message: "The Conde Events Place inquiry endpoint is running." });
}

// The website form posts here.
function doPost(e) {
  var result;
  try {
    result = processInquiry_((e && e.parameter) || {});
  } catch (err) {
    console.error("doPost failed: " + err);
    result = { ok: false, error: "server" };
  }
  return json_(result);
}


/* ---------- 3. SEND A TEST EMAIL (run this from the editor) ---------- */

// Select "sendTestEmail" in the toolbar and click Run. The first time, Google
// asks you to allow access. Then check your inbox (and Spam).
function sendTestEmail() {
  var tomorrow = Utilities.formatDate(new Date(Date.now() + 86400000), TIME_ZONE, "yyyy-MM-dd");
  var result = processInquiry_({
    fullName: "Test Customer",
    phone: "0912-345-6789",
    email: OWNER_EMAIL,
    eventType: "Birthday Party",
    eventDate: tomorrow,
    eventTime: "18:00",
    guests: "50",
    "package": "Basic Package",
    services: "Videoke Rental, Photobooth Services",
    budget: "₱30,000",
    message: "This is a test inquiry sent from the Apps Script editor.",
    submissionId: "test-" + Date.now()
  });
  Logger.log(JSON.stringify(result));
}


/* ---------- 4. MAIN LOGIC ---------- */

function processInquiry_(p) {
  // Bots fill the hidden "_gotcha" box; real visitors never see it.
  // Pretend all is well, but send nothing.
  if (clean_(p._gotcha, 100)) return { ok: true };

  var d = {
    fullName: oneLine_(p.fullName, 100),
    phone: oneLine_(p.phone, 40),
    email: oneLine_(p.email, 254),
    eventType: oneLine_(p.eventType, 80),
    eventDate: oneLine_(p.eventDate, 10),
    eventTime: oneLine_(p.eventTime, 5),
    guests: oneLine_(p.guests, 5),
    packageName: oneLine_(p["package"], 120),
    services: oneLine_(p.services, 400),
    budget: oneLine_(p.budget, 60),
    message: clean_(p.message, 3000)
  };

  var errors = validate_(d);
  if (hasKeys_(errors)) return { ok: false, error: "invalid", fields: errors };

  // The website sends the same submissionId when a customer retries, so a
  // retry after a lost response never creates a second email.
  var id = oneLine_(p.submissionId, 64);
  if (!/^[A-Za-z0-9\-]{8,64}$/.test(id)) id = Utilities.getUuid();

  if (!EMAIL_RE.test(OWNER_EMAIL)) {
    console.error("OWNER_EMAIL is not a valid email address.");
    return { ok: false, error: "server" };
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (e) {
    return { ok: false, error: "busy" };
  }

  try {
    var cache = CacheService.getScriptCache();
    var seenKey = "sub_" + id;
    if (cache.get(seenKey)) return { ok: true, duplicate: true };

    var hourKey = "hour_" + Utilities.formatDate(new Date(), "UTC", "yyyyMMddHH");
    var count = Number(cache.get(hourKey) || 0);
    if (count >= MAX_PER_HOUR) return { ok: false, error: "busy" };
    if (MailApp.getRemainingDailyQuota() < 1) return { ok: false, error: "quota" };

    var mail = buildEmail_(d, id);
    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: mail.subject,
      body: mail.text,
      htmlBody: mail.html,
      replyTo: d.email,
      name: SENDER_NAME
    });

    cache.put(seenKey, "1", 21600); // remember this inquiry for 6 hours (the maximum)
    cache.put(hourKey, String(count + 1), 3600);
    return { ok: true, id: id };
  } catch (err) {
    console.error("sendEmail failed: " + err);
    return { ok: false, error: "send_failed" };
  } finally {
    lock.releaseLock();
  }
}


/* ---------- 5. VALIDATION ---------- */

var EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]{2,}$/;

function validate_(d) {
  var err = {};
  if (d.fullName.length < 2) err.fullName = "Please enter your full name.";
  if (!/^\+?\d{7,15}$/.test(d.phone.replace(/[\s\-().]/g, ""))) err.phone = "Please enter a valid contact number.";
  if (!EMAIL_RE.test(d.email)) err.email = "Please enter a valid email address.";
  if (!d.eventType) err.eventType = "Please select an event type.";
  if (!isRealDate_(d.eventDate)) {
    err.eventDate = "Please choose a valid event date.";
  } else if (d.eventDate < earliestDate_()) {
    err.eventDate = "Please choose today or a future date.";
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(d.eventTime)) err.eventTime = "Please choose a valid event time.";
  var n = Number(d.guests);
  if (!/^\d+$/.test(d.guests) || n < 1 || n > 2000) err.guests = "Please enter a valid number of guests.";
  return err;
}

// Yesterday in TIME_ZONE (one day of tolerance for visitors in other time zones).
function earliestDate_() {
  return Utilities.formatDate(new Date(Date.now() - 86400000), TIME_ZONE, "yyyy-MM-dd");
}

function isRealDate_(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  var y = Number(m[1]), mo = Number(m[2]), da = Number(m[3]);
  var dt = new Date(Date.UTC(y, mo - 1, da));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === da;
}


/* ---------- 6. EMAIL CONTENT ---------- */

function buildEmail_(d, id) {
  var subject = oneLine_(fill_(SUBJECT_TEMPLATE, { eventType: d.eventType, eventDate: d.eventDate }), 200);
  var submitted = Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd HH:mm") + " (" + TIME_ZONE + ")";

  var rows = [
    ["Name", d.fullName],
    ["Email", d.email],
    ["Contact number", d.phone],
    ["Event type", d.eventType],
    ["Preferred date", d.eventDate],
    ["Preferred time", d.eventTime],
    ["Estimated guests", d.guests],
    ["Selected package", d.packageName || "Not specified"],
    ["Additional services", d.services || "None selected"],
    ["Budget", d.budget || "Not specified"]
  ];
  var message = d.message || "(none)";
  var note = "This is an inquiry, not a confirmed booking. The date and time are the customer's preferences, subject to your confirmation. Press Reply to answer the customer directly.";

  var text = "New event inquiry from the website\n\n" +
    rows.map(function (r) { return r[0] + ": " + r[1]; }).join("\n") +
    "\n\nMessage:\n" + message +
    "\n\nSubmitted: " + submitted + "\nReference: " + id + "\n\n" + note + "\n";

  var html = '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1b1b1b;max-width:620px">' +
    '<h2 style="margin:0 0 12px;color:#7a6213">New event inquiry</h2>' +
    '<table style="border-collapse:collapse;width:100%">' +
    rows.map(function (r) {
      return '<tr><td style="padding:6px 12px 6px 0;color:#555;white-space:nowrap;vertical-align:top"><b>' + esc_(r[0]) + '</b></td>' +
        '<td style="padding:6px 0">' + esc_(r[1]) + "</td></tr>";
    }).join("") +
    "</table>" +
    '<p style="margin:16px 0 4px"><b>Message</b></p>' +
    '<p style="margin:0;padding:10px 12px;background:#f6f1e3;border-left:4px solid #d4b04f">' + esc_(message).replace(/\r?\n/g, "<br>") + "</p>" +
    '<p style="margin:16px 0 0;color:#555;font-size:13px">Submitted: ' + esc_(submitted) + "<br>Reference: " + esc_(id) + "</p>" +
    '<p style="color:#555;font-size:13px">' + esc_(note) + "</p></div>";

  return { subject: subject, text: text, html: html };
}


/* ---------- 7. SMALL HELPERS ---------- */

function fill_(template, values) {
  return String(template).replace(/\{(\w+)\}/g, function (_m, key) {
    return values[key] != null ? values[key] : "";
  });
}

// Remove control characters, trim, and cut to a maximum length.
function clean_(value, max) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

// Same as clean_, but also flattens line breaks (stops email-header tricks).
function oneLine_(value, max) {
  return clean_(String(value == null ? "" : value).replace(/[\r\n\t]+/g, " "), max);
}

function esc_(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function hasKeys_(obj) {
  for (var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) return true; }
  return false;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
