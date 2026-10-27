/* =====================================================================
   THE CONDE EVENTS PLACE  -  Inquiry form email receiver
   Google Apps Script (free, runs inside YOUR Google account)
   ---------------------------------------------------------------------
   THIS FILE IS NOT PART OF THE WEBSITE. You copy it into Google Apps
   Script (script.google.com) and publish it as a "Web app". The website's
   inquiry form then sends each inquiry to that web app, and the script
   emails it to your Gmail inbox.

   Full step-by-step instructions: README.md  ->  Step 4.

   WHO RECEIVES THE EMAIL?
     By default: the Gmail account that OWNS this script (the account you
     were signed in to when you created it). To send to a different
     address, type it in OWNER_EMAIL below, save, and publish a new
     version (README Step 4, "Change the recipient later").

   NO PASSWORDS OR SECRET KEYS ARE NEEDED. The script sends mail as you,
   after you approve it once.

   FREE LIMITS (Google): a consumer @gmail.com account may send to 100
   email recipients per day through Apps Script (Google Workspace
   accounts: 1,500). This script sends 1 email per inquiry.
   Source: https://developers.google.com/apps-script/guides/services/quotas
   ===================================================================== */

/* ---------- SETTINGS (edit these) ---------- */

// Where inquiries are delivered. Leave "" to use the Gmail account that owns this script.
// Example: var OWNER_EMAIL = "cyruz.mailbox@gmail.com";
var OWNER_EMAIL = "";

// Display name shown as the sender of the notification email.
var SENDER_NAME = "The Conde Events Place Website";

// The email subject is:  <SUBJECT_PREFIX> - <Event Type> - <Preferred Date>
var SUBJECT_PREFIX = "New Event Inquiry";

// Safety limit: stop accepting inquiries if more than this many arrive in one hour
// (protects your inbox and Google's daily email quota from spam floods).
var MAX_PER_HOUR = 40;

/* ---------- Fields the website sends (do not rename: booking.js uses them) ---------- */
var FIELDS = [
  { key: "fullName",     label: "Full Name",            max: 100,  required: true },
  { key: "email",        label: "Email Address",        max: 254,  required: true },
  { key: "phone",        label: "Contact Number",       max: 30,   required: true },
  { key: "eventType",    label: "Event Type",           max: 80,   required: true },
  { key: "eventDate",    label: "Preferred Event Date", max: 10,   required: true },
  { key: "eventTime",    label: "Preferred Event Time", max: 5,    required: true },
  { key: "guests",       label: "Estimated Guests",     max: 5,    required: true },
  { key: "package",      label: "Selected Package",     max: 120,  required: false },
  { key: "services",     label: "Additional Services",  max: 600,  required: false },
  { key: "budget",       label: "Estimated Budget",     max: 80,   required: false },
  { key: "message",      label: "Message",              max: 3000, required: false, multiline: true },
  { key: "submissionId", label: "",                     max: 64,   required: false }
];

var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ---------- Web app entry points ---------- */

// Opening the web app URL in a browser shows this. Handy for checking the deployment.
function doGet() {
  return json_({ ok: true, service: "The Conde Events Place inquiry form", note: "This address accepts form submissions (POST) from the website." });
}

// Receives the inquiry from the website.
function doPost(e) {
  var lock = LockService.getScriptLock();
  var haveLock = false;
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // Spam trap: real visitors never fill this hidden field. Pretend success so bots move on.
    if (p._gotcha) { return json_({ ok: true }); }

    var d = readFields_(p);
    var problem = validate_(d);
    if (problem) { return json_({ ok: false, error: problem }); }

    // One submission at a time, so the counters below stay accurate.
    lock.waitLock(15000);
    haveLock = true;

    var cache = CacheService.getScriptCache();

    // Duplicate protection: the website re-uses the same submissionId when a customer retries
    // after a lost response, so a retry never creates a second email.
    if (d.submissionId && cache.get("sub-" + d.submissionId)) {
      return json_({ ok: true, duplicate: true });
    }

    var hourKey = "rate-" + Math.floor(new Date().getTime() / 3600000);
    var count = Number(cache.get(hourKey) || 0);
    if (count >= MAX_PER_HOUR) { return json_({ ok: false, error: "busy" }); }

    if (MailApp.getRemainingDailyQuota() < 1) { return json_({ ok: false, error: "quota" }); }

    sendOwnerEmail_(d);

    cache.put(hourKey, String(count + 1), 7200);
    if (d.submissionId) { cache.put("sub-" + d.submissionId, "1", 21600); }
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: "server" });
  } finally {
    if (haveLock) { try { lock.releaseLock(); } catch (x) { /* ignore */ } }
  }
}

/* ---------- Test helper: run this ONCE from the editor (README Step 4) ---------- */
// Choose "sendTestEmail" in the function drop-down, click Run, and approve the permission
// request. You should receive a sample inquiry email. This also grants the script permission.
function sendTestEmail() {
  var to = recipient_();
  sendOwnerEmail_({
    fullName: "Test Customer",
    email: to,
    phone: "0912-345-6789",
    eventType: "Birthday Party",
    eventDate: "2030-01-15",
    eventTime: "18:00",
    guests: "50",
    "package": "Standard Package",
    services: "Videoke Rental, Photobooth Services",
    budget: "PHP 50,000",
    message: "This is a test message from sendTestEmail(). If you can read this, email delivery works.",
    submissionId: ""
  });
  Logger.log("Test email sent to " + to + ". Check your inbox (and Spam).");
}

/* ---------- Internals ---------- */

function recipient_() {
  var to = String(OWNER_EMAIL || "").trim();
  if (!to) { to = Session.getEffectiveUser().getEmail(); }
  return to;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function readFields_(p) {
  var d = {};
  FIELDS.forEach(function (f) {
    var v = (p[f.key] === undefined || p[f.key] === null) ? "" : String(p[f.key]);
    v = v.replace(/\r\n/g, "\n");
    // Remove control characters (blocks email-header tricks). Only the message keeps line breaks.
    v = f.multiline ? v.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, " ") : v.replace(/[\u0000-\u001F\u007F]/g, " ");
    d[f.key] = v.trim();
  });
  return d;
}

function validDate_(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) { return false; }
  var y = Number(m[1]), mo = Number(m[2]), da = Number(m[3]);
  var dt = new Date(y, mo - 1, da);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === da;
}

function validate_(d) {
  for (var i = 0; i < FIELDS.length; i++) {
    var f = FIELDS[i];
    if (f.required && !d[f.key]) { return "missing_" + f.key; }
    if (d[f.key].length > f.max) { return "too_long_" + f.key; }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) { return "bad_email"; }
  if (!/^\+?\d{7,15}$/.test(d.phone.replace(/[\s\-().]/g, ""))) { return "bad_phone"; }
  if (!validDate_(d.eventDate)) { return "bad_date"; }
  if (!/^\d{2}:\d{2}$/.test(d.eventTime)) { return "bad_time"; }
  var g = Number(d.guests);
  if (!/^\d+$/.test(d.guests) || g < 1 || g > 2000) { return "bad_guests"; }
  return "";
}

function prettyDate_(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? MONTHS[Number(m[2]) - 1] + " " + Number(m[3]) + ", " + m[1] : s;
}

function esc_(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function sendOwnerEmail_(d) {
  var to = recipient_();
  var subject = SUBJECT_PREFIX + " — " + d.eventType + " — " + prettyDate_(d.eventDate);

  var rows = [
    ["Full Name", d.fullName],
    ["Email", d.email],
    ["Contact Number", d.phone],
    ["Event Type", d.eventType],
    ["Preferred Date", prettyDate_(d.eventDate)],
    ["Preferred Time", d.eventTime],
    ["Estimated Guests", d.guests],
    ["Selected Package", d["package"] || "Not sure yet"],
    ["Additional Services", d.services || "None selected"],
    ["Estimated Budget", d.budget || "Not specified"],
    ["Message", d.message || "(none)"]
  ];
  var footer = "This is an inquiry only, not a confirmed booking. The date and time are the customer's preferences. " +
               "Reply to this email to answer the customer directly.";

  var text = rows.map(function (r) { return r[0] + ": " + r[1]; }).join("\n") + "\n\n" + footer;

  var html = '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1b1b1b">' +
    '<h2 style="margin:0 0 12px;color:#7a6213">New Event Inquiry</h2>' +
    '<table style="border-collapse:collapse;width:100%;max-width:640px">' +
    rows.map(function (r) {
      return '<tr><td style="padding:8px 12px;border:1px solid #e3dcc6;background:#f8f4ea;font-weight:bold;white-space:nowrap;vertical-align:top">' + esc_(r[0]) +
             '</td><td style="padding:8px 12px;border:1px solid #e3dcc6;white-space:pre-wrap">' + esc_(r[1]) + "</td></tr>";
    }).join("") +
    "</table>" +
    '<p style="color:#4a4a4a;font-size:13px;margin-top:16px">' + esc_(footer) + "</p></div>";

  MailApp.sendEmail({
    to: to,
    subject: subject,
    body: text,
    htmlBody: html,
    replyTo: d.email,
    name: SENDER_NAME
  });
}
