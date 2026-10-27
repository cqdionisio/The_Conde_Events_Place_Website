# THE CONDE EVENTS PLACE: Website Project

A complete, responsive website for The Conde Events Place (HTML, CSS, JavaScript).
It has six linked pages, a black-and-gold design matched to your logo, a photo gallery with lightbox, and an inquiry/booking-request form that emails your Gmail through a free **Google Apps Script** (setup in Step 4).

> **Draft status:** every price, package, capacity, testimonial, photo, address, phone number, and the email address are **samples** until you replace them. While `showSampleNotices` is `true` in `js/config.js`, the site shows a "Draft preview" banner and "Sample" badges. See the **Before You Publish checklist** at the bottom.

---

## What's in the folder

```
the-conde-events-place/
├── index.html        Home
├── venue.html        Venue
├── services.html     Services
├── packages.html     Packages
├── gallery.html      Gallery
├── inquire.html      Inquire / Book (the form)
├── README.md         This guide
├── css/style.css     All colors, fonts and layout
├── js/
│   ├── config.js     ★ YOUR DETAILS: edit most things here ★
│   ├── main.js       Header, footer, and page content (no need to edit)
│   ├── gallery.js    Gallery filter + lightbox (no need to edit)
│   └── booking.js    Form checks + sending (no need to edit)
├── server/
│   └── google-apps-script/Code.gs   The email sender you paste into Google (Step 4)
└── assets/
    ├── images/       logo.jpg, hero-venue.jpg, gallery/, services/, venue/
    └── icons/        favicon.png, apple-touch-icon.png
```

The `server/` folder is **not** uploaded to your website host. `Code.gs` is pasted into Google Apps Script (Step 4). No passwords or secret keys are stored anywhere in the website files.

---

## Step 1: Open the project in Visual Studio Code

1. Right-click the ZIP file and choose **Extract All** (Windows) or double-click it (Mac).
2. Open **Visual Studio Code** → **File → Open Folder…** → choose the extracted `the-conde-events-place` folder.
3. In the left Explorer panel you'll see the files listed above.

## Step 2: Preview the website

**Simplest:** double-click `index.html` and it opens in your browser. Everything works this way.

**Better (auto-refresh as you edit):**
1. In VS Code open **Extensions** (square icon on the left) and install **Live Server** (by Ritwick Dey).
2. Right-click `index.html` → **Open with Live Server**.
3. The site opens in your browser and refreshes every time you save.

The Google Maps embed and the fonts need an internet connection. Without one, the map area stays blank and the site uses a standard serif/sans-serif font.

## Step 3: Edit the website

### Most edits happen in one file: `js/config.js`

Open it and use the numbered sections and comments. Change the text between the quotation marks, save, and refresh the browser.

| I want to change… | Where |
|---|---|
| Business name, tagline | `config.js` → `business` |
| Phone, email shown on the site, address | `config.js` → `business` |
| Facebook page link | `config.js` → `business.facebookUrl` (paste your URL; the links appear automatically. While empty, they stay hidden) |
| Embedded map + "Get Directions" | Automatic from `business.address` |
| Where inquiries are sent | `config.js` → `form.endpoint` (see Step 4). The **receiving inbox** (`OWNER_EMAIL`) is set in the Google script, not here. |
| Success message | `config.js` → `form.successMessage` |
| Email subject | `SUBJECT_TEMPLATE` in the Google script (`Code.gs`) |
| Menu items | `config.js` → `nav` |
| Event types in the form | `config.js` → `eventTypes` (add a line to add a type) |
| Services (add / edit / remove) | `config.js` → `services` (copy a block to add one, delete a block to remove one) |
| Package names, prices, guests, duration, inclusions, decorations, catering, amenities, conditions | `config.js` → `packages` |
| Gallery photos, captions, categories | `config.js` → `gallery`, `galleryCategories` |
| Venue spaces, capacity, amenities, rental info, accessibility | `config.js` → `venue` |
| "Why Choose Us" highlights, testimonials | `config.js` → `highlights`, `testimonials` |
| Turn off the "sample" banner and badges | `config.js` → `showSampleNotices: false` |

### Other places

| I want to change… | Where |
|---|---|
| Colors and fonts | `css/style.css`: the `:root { … }` block at the top. If you change a font name, also change it in the Google Fonts `<link>` in each page's `<head>`. |
| Homepage welcome text and section headings | `index.html` (look for the `<!-- ===== … ===== -->` comments) |
| Form field labels, privacy notice wording | `inquire.html` (don't rename the field `id`s) |
| Page titles and Google descriptions | The `<title>` and `<meta name="description">` at the top of each HTML page |

### Replace the logo
Save your logo over `assets/images/logo.jpg` (same file name). A square image works best. If your new file is a PNG, save it as `logo.png` in the same folder and change `business.logo` in `config.js`, and the two `logo.jpg` references in `index.html` (the hero). Also replace `assets/icons/favicon.png` and `apple-touch-icon.png` (64×64 and 180×180) if you want the browser-tab icon to match.

### Replace the sample photos
Every sample photo is a placeholder labeled "Sample image". To swap one, **save your photo over it using the same file name**, or add your photo and change its path in `config.js`.

| Photos | Folder | Suggested size |
|---|---|---|
| Home banner | `assets/images/hero-venue.jpg` | 1920 × 1080 (landscape) |
| Gallery | `assets/images/gallery/` | 1200 × 800 |
| Services | `assets/images/services/` | 900 × 600 |
| Venue page | `assets/images/venue/` | 1200 × 800 |

Tips: keep each photo under about 300 KB so pages load quickly (free tools like squoosh.app can shrink photos). After swapping a photo, **update its `alt` text** in `config.js` to describe what the photo really shows. This helps visitors who use screen readers.

### Add a new gallery photo
1. Copy the photo into `assets/images/gallery/`, for example `birthday-2.jpg`.
2. In `config.js`, copy one line of the `gallery` list, paste it below, and change `src`, `category`, `caption`, and `alt`. `category` must be one of the names in `galleryCategories`.
3. Add `featured: true` to show it in the homepage gallery preview.

## Step 4: Make the inquiry form send emails to your Gmail

**Why the form said "Online sending isn't set up yet":** a website cannot send email by itself. The form needs an email service behind it, and the address in `js/config.js` (`form.endpoint`) was still the placeholder. Until it is connected, the form honestly says the inquiry was **not** sent and offers a "Send by Email App" button instead.

**The service used here: a free Google Apps Script in your own Google account.** It receives the form, checks it again, and emails it to your Gmail with the customer set as "Reply-To". There is no third-party form company, no credit card, no customer account, and no password or key in the website. The ready-made script is in `server/google-apps-script/Code.gs`.

### Free limits, honestly
- Google's published Apps Script quota is **100 email recipients per day** for a normal Gmail account (1,500 for Google Workspace). Each inquiry uses 1. There is **no monthly cap**, but Google says quotas may change at any time, so check the current numbers at https://developers.google.com/apps-script/guides/services/quotas
- If the daily limit is ever reached, the form shows an error and offers the customer your phone and email instead. It never pretends the inquiry was sent.
- No free service guarantees unlimited sending. For comparison (checked October 2026): Formspree's free plan allows **50 submissions/month**, Web3Forms **250/month**, and FormSubmit's documentation claims no cap but publishes no uptime commitment and has no dashboard to recover missed messages.

### Which email address controls delivery? (three different things)
| What | Where it is set | Purpose |
|---|---|---|
| **`OWNER_EMAIL`** | Top of the script in your Google account (`Code.gs`) | **The inbox that receives inquiries.** This is the one that matters. |
| `business.email` | `js/config.js` | Only the address **displayed** on the website |
| The Google account you deploy with | The account you sign in with at script.google.com | The account the emails are **sent from**. It can be the same Gmail as `OWNER_EMAIL`. |

### Set it up (about 10 minutes)
1. **Sign in to Google** with the Gmail account that should send the emails (for example `cyruz.mailbox@gmail.com`), then open **https://script.google.com** and click **New project**.
2. In VS Code open `server/google-apps-script/Code.gs`, select all (Ctrl+A) and copy. In the Apps Script editor delete the sample code, paste yours, and click the **Save** icon. Optionally rename the project (top left) to "Conde Inquiry Mailer".
3. Near the top, check that `OWNER_EMAIL` is the Gmail address that should receive inquiries. Save again if you changed it.
4. **Test sending and give permission:** in the toolbar choose the function **`sendTestEmail`** and click **Run**. Google asks you to review permissions: click **Review permissions**, choose your account, and if you see "Google hasn't verified this app", click **Advanced** → **Go to (your project name) (unsafe)** → **Allow**. This is your own script, so it is safe to allow. It needs permission only to send email as you.
5. Open the inbox of `OWNER_EMAIL` (also check **Spam**). You should see "New Event Inquiry — Birthday Party — ..." from "Conde Events Website". If it arrived, the mailer works.
6. **Publish it:** click **Deploy → New deployment**. Click the gear icon next to "Select type" and choose **Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy**.
7. Copy the **Web app URL** (it ends in `/exec`).
8. In VS Code open `js/config.js`, find `form: { endpoint: ...` and paste the URL between the quotes:
   ```javascript
   endpoint: "https://script.google.com/macros/s/AKfycb.../exec",
   ```
   Save. (Optional check: open the same URL in your browser. You should see `{"ok":true,"message":"The Conde Events Place inquiry endpoint is running."}`)

"Who has access: Anyone" is required so that your customers' browsers can send inquiries. It does **not** give anyone access to your Google account, email, or files. It only lets them call this one script, which can do nothing except send inquiry emails to `OWNER_EMAIL`.

### Test the form
1. Open the website (Live Server or the published site) → **Inquire / Book**.
2. Fill in the form with sample details and click **Submit Inquiry**. The button shows a spinner and "Sending...".
3. You should see: *"Thank you for your inquiry! Your event request has been submitted successfully..."* That message appears **only after the script confirms it sent the email**.
4. Check the inbox of `OWNER_EMAIL` (and **Spam** and **Promotions**). The email lists name, email, contact number, event type, date, time, guests, package, services, budget, and message. Press **Reply** and check that the reply is addressed to the customer's email.
5. Test a failure too: temporarily put a wrong letter in the Web app URL, submit, and confirm the form shows an error (and keeps what you typed) instead of a success message. Then restore the correct URL.

### Publish the website
Follow Step 6 below. Nothing else needs to be configured for the email: the Web app URL in `config.js` travels with the site. After publishing, send one more test inquiry from the live site (HTTPS).

### Change the recipient address later
1. Go to https://script.google.com, open your project, and edit `OWNER_EMAIL` at the top of the script. Save.
2. Click **Deploy → Manage deployments**, click the pencil (edit) icon, set **Version: New version**, and click **Deploy**. (The Web app URL stays the same, so **you do not need to change or republish the website.**)
3. Run **`sendTestEmail`** again and confirm the new inbox receives it.

The same "New version" step is needed every time you edit the script.

### Changing the email subject
Edit `SUBJECT_TEMPLATE` in the script (`{eventType}` and `{eventDate}` are filled in automatically), then deploy a new version as above.

### How duplicates and spam are handled
- The button is disabled while sending, so double-clicks send only once.
- Each inquiry carries a reference ID. If the reply is lost (bad connection) and the customer tries again, the script recognizes the same ID and does **not** email you twice. The form then says "We couldn't confirm that your inquiry was received" instead of claiming success or failure.
- A hidden spam-trap field catches simple bots, the script re-checks every field, and it sends at most 15 emails per hour (`MAX_PER_HOUR`) to protect your daily quota.
- Because the Web app URL is public, a determined attacker could still send junk inquiries up to those limits. This is a trade-off of any form that works without a login. If it ever happens, create a new deployment (new URL) and update `config.js`.
- Customers do **not** receive an automatic confirmation email by design. A form that emails any address typed into it can be abused to send spam from your Gmail.

### Troubleshooting
| Problem | What to check |
|---|---|
| Form says "Online sending isn't set up yet" | `form.endpoint` in `config.js` is still `PASTE_YOUR_WEB_APP_URL_HERE` or the address was pasted incorrectly. It must start with `https://script.google.com/macros/s/` and end with `/exec`. |
| "We couldn't confirm that your inquiry was received" | Check the internet connection. Open the Web app URL in a browser: you should see the "endpoint is running" message. If you see a Google sign-in page, redeploy with **Who has access: Anyone**. |
| "Our inquiry form is very busy" | The hourly limit or Google's daily 100-recipient limit was reached. It resets within 24 hours. |
| `sendTestEmail` works but the live form doesn't | You edited the script but didn't create a **New version** under Manage deployments, or the URL in `config.js` is from an old deployment. |
| Emails land in Spam | Mark one as "Not spam". Emails are sent from your own Gmail to your own Gmail, which normally reaches the inbox. |
| You get the "Authorization required" screen | Repeat step 4 of the setup and click **Allow**. |
| Want to see what happened | In the Apps Script editor open **Executions** (left sidebar) to see each request and any error. |

### Alternative: Formspree (optional)
If you prefer a form service, create a form at https://formspree.io, paste its address (`https://formspree.io/f/xxxxxxxx`) into `form.endpoint`, and set the notification email in the Formspree dashboard. The website detects which service the address belongs to automatically. Formspree's free plan allows 50 submissions per month, and the recipient is set in the Formspree dashboard instead of `OWNER_EMAIL`.

## Step 5: Test the website (checklist)

Test on a computer **and** a phone.

- [ ] Every menu link opens the right page, on all six pages
- [ ] The logo appears in the header, footer, and homepage banner, and is not stretched
- [ ] The mobile menu (☰ button) opens, closes, and its links work
- [ ] All photos display (no broken-image icons)
- [ ] Gallery: category filters work, clicking a photo opens the lightbox, ← → keys and Esc work
- [ ] Packages: each "Choose This Package" button opens the form with that package selected
- [ ] Services: each "Inquire" button opens the form with that service ticked
- [ ] The form rejects: empty required fields, a bad phone number, a bad email, a past date
- [ ] The map shows your venue; "Get Directions" opens Google Maps
- [ ] Phone link starts a call on a phone; email link opens an email
- [ ] A real test inquiry arrives in your inbox (Step 4), and a deliberately broken one shows an error instead of success
- [ ] The confirmation message says the request was *submitted* and that the date is *subject to confirmation*

## Step 6: Publish the website (free static hosting)

Because the site is plain files and Formspree handles email, you can host it free. Host interfaces change occasionally, so if a button name differs slightly, look for the closest match.

### Option A (easiest): Netlify
1. Go to **https://app.netlify.com/drop** and sign up or log in (free).
2. Drag your whole `the-conde-events-place` folder onto the page.
3. After a short upload you get a live address like `something.netlify.app` with HTTPS already on.
4. In the site's settings you can rename the address.

### Option B: Cloudflare Pages
1. Create a free account at **https://dash.cloudflare.com**.
2. Go to **Workers & Pages → Create → Pages → Upload assets**.
3. Name the project, upload the project folder, and click **Deploy**.
4. You get a `something.pages.dev` address with HTTPS.

### Option C: GitHub Pages
1. Create a free account at **https://github.com** and create a new repository (public repositories work on the free plan).
2. Upload all the project files (drag them into the repo page, or use VS Code's Source Control panel).
3. In the repo go to **Settings → Pages**, choose the `main` branch and the `/ (root)` folder, then **Save**.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

### Your own domain name (optional, paid)
A custom domain such as `condeevents.com` is bought yearly from a domain registrar. Then open your host's **Domains** settings, add the domain, and follow the DNS instructions it shows. HTTPS is turned on automatically by all three hosts above.

### What may cost money
- **Hosting:** free on the options above (check each provider's current free-tier limits).
- **Formspree:** free plan with a monthly submission limit; paid plans for more submissions or extra features.
- **Custom domain:** optional, a yearly fee.

## Step 7: Update the published website

1. Make your edits in VS Code and test them locally (Step 2).
2. Republish:
   - **Netlify:** open your site in Netlify → **Deploys** → drag the updated folder in.
   - **Cloudflare Pages:** open the project → **Create new deployment** → upload the updated folder.
   - **GitHub Pages:** upload the changed files to the repo (or commit and push in VS Code). The site updates in a minute or two.
3. Refresh the live site (Ctrl+F5 / Cmd+Shift+R) to see the change.

---

## Before You Publish: checklist of what you must replace or confirm

- [ ] **Phone number** (`phoneDisplay` and `phoneLink`) is currently the sample `0912-345-6789`
- [ ] **Address** is currently the sample address. Confirm it, and check that the map pin lands on your venue
- [ ] **Email shown on the site** (`business.email`) is the address you provided. Confirm it
- [ ] **Facebook page URL** (`facebookUrl`) is empty. Add it when ready
- [ ] **Inquiry email** (Step 4): script created in Google, `OWNER_EMAIL` correct, Web app URL pasted into `form.endpoint`, and a test inquiry received in your inbox
- [ ] **Prices and packages**: all are samples. Replace with your real offers, then set each `sample: false`
- [ ] **Service prices / descriptions**: confirm every service you actually offer; remove any you don't
- [ ] **Venue page**: sample capacities, spaces, amenities, rental terms, and accessibility notes must be replaced with true details
- [ ] **"Why Choose Us" highlights**: confirm each statement is accurate for your venue
- [ ] **Testimonials**: replace the three samples with real reviews (with permission) or delete the list
- [ ] **Photos**: replace every placeholder image (hero, gallery, services, venue) and update each photo's `alt` text
- [ ] **Privacy notice** wording in `inquire.html`: make sure it matches how you handle customer information
- [ ] **Set `showSampleNotices: false`** in `config.js` to remove the draft banner and Sample badges
- [ ] Update the page descriptions (`<meta name="description">`) if you want different wording in Google results
- [ ] Run the Step 5 test checklist on the final site

## Notes on how this was checked

The pages, links, images, menu, gallery filters, lightbox, form validation, preselecting packages/services, duplicate protection, and success/failure messages were tested automatically in a browser using local files, at desktop and phone widths. The mailer script's logic (validation, subject, Reply-To, duplicate handling, limits, spam trap) was tested by running `Code.gs` against simulated Google services, and the form's success, rejection, lost-reply and double-click handling was tested in a browser against simulated responses. The live Google Apps Script deployment, the Google Maps embed, and Google Fonts could **not** be tested from the build environment (no access to your Google account or outside network), so your own test inquiry in Step 4 is the real confirmation that email delivery works.
