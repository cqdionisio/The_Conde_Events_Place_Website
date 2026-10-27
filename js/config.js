/* =====================================================================
   config.js  —  THE ONE FILE YOU EDIT FOR MOST WEBSITE CHANGES
   ---------------------------------------------------------------------
   Everything here is shared across all pages. Change a value once and
   every page updates automatically (header, footer, forms, map, etc.).

   TIPS FOR BEGINNERS
   - Keep the quotation marks "like this" around text.
   - Keep the commas at the end of each line / item.
   - Don't use a double quote (") inside text. Use a single quote (') instead.
   - After saving, refresh the browser to see your changes.

   SECTIONS IN THIS FILE
     1. Sample-content notices (turn OFF before publishing)
     2. Business details (name, phone, email, address, Facebook)
     3. Inquiry form settings (Formspree)
     4. Navigation menu
     5. Event types
     6. Services
     7. Packages
     8. Gallery
     9. Venue page details
    10. Homepage "Why Choose Us" highlights and testimonials
   ===================================================================== */

window.SITE_CONFIG = {

  /* ===================================================================
     1. SAMPLE-CONTENT NOTICES
     While this is true, the site shows a "draft" banner and "Sample"
     badges on prices, packages, capacities, and testimonials so nothing
     sample is mistaken for a confirmed offer.
     >>> When ALL your real details are in, change this to false. <<<
     =================================================================== */
  showSampleNotices: false,

  /* ===================================================================
     2. BUSINESS DETAILS  (the contact details below are SAMPLES)
     =================================================================== */
  business: {
    name: "THE CONDE EVENTS PLACE",
    shortName: "The Conde Events Place",
    tagline: "We'll go above and beyond your expectations for every occasion.",

    // Logo file. To change the logo, replace assets/images/logo.jpg with
    // your file (same name), or change the file name here.
    logo: "assets/images/logo.jpg",
    logoAlt: "The Conde Events Place logo",

    // Phone shown on the website, and the same number in international
    // format (no spaces or dashes) used for tap-to-call links.
    // SAMPLE NUMBER - replace with your real number.
    phoneDisplay: "0956-997-6960",
    phoneLink: "+639569976960",

    // Email address SHOWN on the website (visitors click it to email you).
    // NOTE: This is NOT the address that receives inquiry-form
    // notifications. That is set inside your Formspree account (see README).
    email: "cyruz.mailbox@gmail.com",

    // Venue address. The embedded map and "Get Directions" button are built
    // from this text automatically. SAMPLE ADDRESS - replace with the
    // correct one.
    address: "The Conde Events Place, 205 A.P. Cipriano, GreenVille, Taguig, Philippines, 1630",

    // Facebook page link. Leave as "" (empty) until you have one - the
    // Facebook links are hidden automatically while this is empty.
    // Example: "https://www.facebook.com/yourpagename"
    facebookUrl: "https://www.facebook.com/thecondeeventsplace"
  },

  /* ===================================================================
     3. INQUIRY FORM SETTINGS
     Inquiries are emailed to you through a free Google Apps Script that
     runs in YOUR Google account and sends from YOUR Gmail. Setup takes
     about 10 minutes: follow README.md, Step 4.

     WHICH EMAIL ADDRESS RECEIVES INQUIRIES?
     The address typed in the script itself (OWNER_EMAIL inside
     server/google-apps-script/Code.gs, pasted into your Google script).
     It is NOT set here. business.email above is only the address shown
     on the website.

     Until you paste your Web app address below, the form will NOT claim
     to have sent anything. It offers a "send by email app" fallback.
     =================================================================== */
  form: {
    // Paste the Web app URL you get from Google Apps Script (README Step 4).
    // It looks like: "https://script.google.com/macros/s/AKfycb.../exec"
    // (A Formspree address "https://formspree.io/f/xxxxxxxx" also works.)
    endpoint: "PASTE_YOUR_WEB_APP_URL_HERE",

    // Email subject. {eventType} and {eventDate} are filled in automatically.
    // With Google Apps Script the subject is set in Code.gs (SUBJECT_TEMPLATE);
    // this one is used only if you choose Formspree.
    emailSubject: "New Event Inquiry \u2014 {eventType} \u2014 {eventDate}",

    // Message shown after the service confirms it accepted the inquiry.
    successMessage: "Thank you for your inquiry! Your event request has been submitted successfully. Our team will review your details and contact you regarding availability, packages, and booking confirmation."
  },

  /* ===================================================================
     4. NAVIGATION MENU
     "page" must match the data-page value on each HTML page's <body>.
     =================================================================== */
  nav: [
    { label: "Home",     href: "index.html",    page: "home" },
    { label: "Venue",    href: "venue.html",    page: "venue" },
    { label: "Services", href: "services.html", page: "services" },
    { label: "Packages", href: "packages.html", page: "packages" },
    { label: "Gallery",  href: "gallery.html",  page: "gallery" }
  ],
  // The highlighted button at the end of the menu:
  navCta: { label: "Inquire / Book", href: "inquire.html", page: "inquire" },

  /* ===================================================================
     5. EVENT TYPES  (appear in the inquiry form's "Event Type" list)
     To add a new type, add a new line, e.g.  "Debut / 18th Birthday",
     =================================================================== */
  eventTypes: [
    "Birthday Party",
    "Christening Celebration",
    "Wedding Reception",
    "Family Reunion",
    "Anniversary Celebration",
    "Other Special Occasion" 
  ],

  /* ===================================================================
     6. SERVICES
     Each service is one block between { and }.
       - To ADD a service: copy a whole block, paste it below, give it a
         new unique "id", and change the text and image.
       - To REMOVE a service: delete its whole block.
       - "price": type a price like "From ₱5,000" or keep
         "Contact Us for Pricing".
       - "sample": true shows a "Sample" badge next to the price. Set it
         to false once the price is real.
       - "main": true makes the card large (use for your main service).
       - Images live in assets/images/services/ (see README).
     =================================================================== */
  services: [
    {
      id: "venue-rental",
      main: true,
      title: "Event Venue Rental",
      description: "Host your celebration at The Conde Events Place. Reserve the venue for birthdays, christenings, wedding receptions, anniversaries, family reunions, and other special occasions. Tell us your date and guest count and we'll discuss availability.",
      image: "assets/images/services/venue-rental.jpg",
      imageAlt: "Sample placeholder image for event venue rental. Replace with a photo of your venue.",
      price: "From ₱20,000",
      priceNote: "per event",
      sample: false
    },
    {
      id: "decorations",
      title: "Event and Party Theme Decorations",
      description: "Bring your theme to life. Share your theme and color preferences and we'll discuss decoration options for your event.",
      image: "assets/images/services/decorations.jpg",
      imageAlt: "Sample placeholder image for party theme decorations. Replace with a photo of your decorations.",
      price: "Contact Us for Pricing",
      sample: false
    },
    {
      id: "tables-chairs",
      title: "Table and Chair Styling and Setup",
      description: "Tables and chairs arranged and styled to suit your event layout and guest count.",
      image: "assets/images/services/tables-chairs.jpg",
      imageAlt: "Sample placeholder image for table and chair setup. Replace with a photo of your setups.",
      price: "Contact Us for Pricing",
      sample: false
    },
    {
      id: "videoke",
      title: "Videoke Rental",
      description: "Keep the party going with a videoke set for singing and fun with family and friends.",
      image: "assets/images/services/videoke.jpg",
      imageAlt: "Sample placeholder image for videoke rental. Replace with a photo of your videoke set.",
      price: "Contact Us for Pricing",
      sample: false
    },
    {
      id: "photobooth",
      title: "Photobooth Services",
      description: "Give your guests a fun way to capture memories with a photobooth at your event.",
      image: "assets/images/services/photobooth.jpg",
      imageAlt: "Sample placeholder image for photobooth services. Replace with a photo of your photobooth.",
      price: "Contact Us for Pricing",
      sample: false
    },
    {
      id: "photography",
      title: "Professional Photography",
      description: "Capture your milestones with photography coverage for your celebration.",
      image: "assets/images/services/photography.jpg",
      imageAlt: "Sample placeholder image for professional photography. Replace with one of your photos.",
      price: "Contact Us for Pricing",
      sample: false
    },
    {
      id: "catering",
      title: "Food Catering Services",
      description: "Talk to us about catering options that fit your guest count and budget.",
      image: "assets/images/services/catering.jpg",
      imageAlt: "Sample placeholder image for food catering. Replace with a photo of your catering.",
      price: "Contact Us for Pricing",
      sample: false
    },
    {
      id: "mascot",
      title: "Mascot Rental or Appearance",
      description: "Add excitement to your party with a mascot appearance, great for children's celebrations.",
      image: "assets/images/services/mascot.jpg",
      imageAlt: "Sample placeholder image for mascot appearance. Replace with a photo of your mascot service.",
      price: "Contact Us for Pricing",
      sample: false
    }
  ],

  /* ===================================================================
     7. PACKAGES
     ALL PRICES AND INCLUSIONS BELOW ARE SAMPLES. Replace them with your
     real offers before publishing. Each package is one block.
       - "id" is used in the link that preselects the package in the
         inquiry form. Keep ids short, lowercase, no spaces.
       - To ADD a package: copy a block, paste it, give it a new "id".
       - To REMOVE a package: delete its block.
       - "sample": true shows a "Sample" badge. Set false when confirmed.
     =================================================================== */
  packages: [
    {
      id: "basic",
      name: "Basic Package",
      price: "₱25,000",
      priceNote: "Per Event",
      sample: false,
      guests: "Up to 50 guests",
      duration: "4 hours venue rental",
      services: [
        "Venue rental",
        "Use of tables and chairs",
        "Basic table and chair setup"
      ],
      decorations: "Simple decoration setup. Theme options to be discussed.",
      catering: "Not included. Ask us about catering add-ons.",
      amenities: ["Sound system use"],
      conditions: "Sample terms: a reservation deposit may be required. Overtime and cleaning fees may apply. Final terms are confirmed by the venue."
    },
    {
      id: "standard",
      name: "Standard Package",
      price: "₱45,000",
      priceNote: "Per Event",
      sample: false,
      highlight: true,
      guests: "Up to 80 guests",
      duration: "5 hours venue rental",
      services: [
        "Venue rental",
        "Table and chair styling and setup",
        "Theme decorations",
        "Videoke rental"
      ],
      decorations: "Themed decorations based on your chosen theme and colors.",
      catering: "Catering available as an add-on.",
      amenities: ["Sound system use", "Photobooth available as an add-on"],
      conditions: "Sample terms: a reservation deposit may be required. Overtime and cleaning fees may apply. Final terms are confirmed by the venue."
    },
    {
      id: "premium",
      name: "Premium Package",
      price: "₱75,000",
      priceNote: "Per Event",
      sample: false,
      guests: "Up to 120 guests",
      duration: "6 hours venue rental",
      services: [
        "Venue rental",
        "Table and chair styling and setup",
        "Full theme decorations",
        "Videoke rental",
        "Photobooth services",
        "Professional photography coverage"
      ],
      decorations: "Full theme styling with backdrop and centerpieces (to be confirmed).",
      catering: "Catering package available. Menu and pricing to be discussed.",
      amenities: ["Sound system use", "Mascot appearance available as an add-on"],
      conditions: "Sample terms: a reservation deposit may be required. Overtime and cleaning fees may apply. Final terms are confirmed by the venue."
    },
    {
      id: "custom",
      name: "Customized Package",
      price: "Contact Us for Pricing",
      priceNote: "",
      sample: false,
      guests: "Based on venue capacity",
      duration: "Flexible, to be discussed",
      services: [
        "Choose the venue rental and any combination of our services",
        "Built around your event, theme, and budget"
      ],
      decorations: "Tell us your ideas and we'll discuss what's possible.",
      catering: "Discuss catering options with us.",
      amenities: ["To be discussed based on your needs"],
      conditions: "Terms depend on the services you choose and are confirmed after we discuss your event."
    }
  ],

  /* ===================================================================
     8. GALLERY
     - Photos go in assets/images/gallery/ (see README).
     - To ADD a photo: copy one line, paste it, and change src, category,
       caption, and alt.
     - "category" must match one of the names in galleryCategories below.
     - "alt" describes the photo for visitors who use screen readers.
     - "featured": true shows the photo in the homepage gallery preview.
     - Optional: "full": "path/to/bigger-version.jpg" for the lightbox.
     =================================================================== */
  galleryCategories: [
    "Venue",
    "Birthdays",
    "Christenings",
    "Weddings",
    "Anniversaries",
    "Family Reunions",
    "Decorations",
    "Tables and Chairs",
    "Catering",
    "Photobooth",
      
  ],
  gallery: [
    { src: "assets/images/gallery/venue-interior-1.jpg", category: "Venue", caption: "Venue interior", alt: "Sample placeholder image of the venue interior. Replace with your photo.", featured: true },
    { src: "assets/images/gallery/venue-interior-2.jpg", category: "Venue", caption: "Event hall", alt: "Sample placeholder image of the event hall. Replace with your photo." },
    { src: "assets/images/gallery/birthday-1.jpg", category: "Birthdays", caption: "Birthday celebration", alt: "Sample placeholder image of a birthday celebration. Replace with your photo.", featured: true },
    { src: "assets/images/gallery/christening-1.jpg", category: "Christenings", caption: "Christening celebration", alt: "Sample placeholder image of a christening celebration. Replace with your photo.", featured: true },
    { src: "assets/images/gallery/wedding-1.jpg", category: "Weddings", caption: "Wedding reception", alt: "Sample placeholder image of a wedding reception. Replace with your photo.", featured: true },
    { src: "assets/images/gallery/wedding-2.jpg", category: "Weddings", caption: "Reception setup", alt: "Sample placeholder image of a reception setup. Replace with your photo." },
    { src: "assets/images/gallery/anniversary-1.jpg", category: "Anniversaries", caption: "Anniversary celebration", alt: "Sample placeholder image of an anniversary celebration. Replace with your photo." },
    { src: "assets/images/gallery/reunion-1.jpg", category: "Family Reunions", caption: "Family reunion", alt: "Sample placeholder image of a family reunion. Replace with your photo." },
    { src: "assets/images/gallery/decorations-1.jpg", category: "Decorations", caption: "Party decorations", alt: "Sample placeholder image of party decorations. Replace with your photo.", featured: true },
    { src: "assets/images/gallery/tables-1.jpg", category: "Tables and Chairs", caption: "Table and chair arrangement", alt: "Sample placeholder image of a table and chair arrangement. Replace with your photo." },
    { src: "assets/images/gallery/catering-1.jpg", category: "Catering", caption: "Catering and food presentation", alt: "Sample placeholder image of catering and food presentation. Replace with your photo." },
    { src: "assets/images/gallery/photobooth-1.jpg", category: "Photobooth", caption: "Photobooth setup", alt: "Sample placeholder image of a photobooth setup. Replace with your photo.", featured: true }
  ],

  /* ===================================================================
     9. VENUE PAGE DETAILS
     SAMPLE VALUES. Capacity, spaces, amenities, and accessibility notes
     below are placeholders. Keep only what is true for your venue.
     =================================================================== */
  venue: {
    intro: [
      "The Conde Events Place is a venue for celebrating life's special moments. Whether you're planning a birthday party, christening, wedding reception, anniversary, family reunion, or another special celebration, we aim to help make your occasion memorable.",
      "Browse the details below, then send us an inquiry to check availability for your preferred date."
    ],
    photos: [
      { src: "assets/images/venue/venue-sample-1.jpg", alt: "Sample placeholder image of the venue interior. Replace with your photo.", caption: "Venue interior" },
      { src: "assets/images/venue/venue-sample-2.jpg", alt: "Sample placeholder image of the main event hall. Replace with your photo.", caption: "Main event hall" },
      { src: "assets/images/venue/venue-sample-3.jpg", alt: "Sample placeholder image of an event setup. Replace with your photo.", caption: "Event setup" }
    ],
    spaces: [
      { name: "Main Event Hall", capacity: "Up to 100 guests", description: "description: the main indoor space for receptions, parties, and gatherings. Replace with your real details." },
      { name: "Function Room", capacity: "Up to 40 guests", description: "description: a smaller space for intimate gatherings or program areas. Replace with your real details." },
      { name: "Outdoor / Garden Area", capacity: "Up to 60 guests", description: "description: an open-air area, if applicable. Delete this block if your venue has no outdoor space." }
    ],
    amenities: [
      "Tables and chairs",
      "Sound system",
      "Air-conditioning",
      "Lighting",
      "Restrooms",
      "Parking area",
      "Catering preparation area",
      "Program or stage area"
    ],
    rental: [
      "Rental rates and duration are discussed for each event.",
      "Reservation and deposit terms: to be confirmed.",
      "Overtime and cleaning policies: to be confirmed.",
      "Send an inquiry to ask about availability on your preferred date."
    ],
    accessibility: [
      "Accessibility features (for example ramps or PWD-friendly facilities): to be confirmed.",
      "Parking details: to be confirmed.",
      "Nearby landmarks and public transport: to be confirmed."
    ]
  },

 /* ===================================================================
     10. HOMEPAGE HIGHLIGHTS AND TESTIMONIALS
     Make sure each highlight is true for your venue before publishing.

     ICONS: "icon" is the path to an image file, written WITHOUT a leading
     slash, e.g. "assets/icons/location.svg". Put your own .svg (or .png)
     files in assets/icons/ and point to them here. An emoji such as "🎉"
     also still works if you prefer. The bundled icons are gold line icons;
     to recolor one, open the .svg file and change stroke="#d4b04f".
     =================================================================== */
  highlights: [
    {
      icon: "assets/icons/location.svg",
      title: "Convenient Location and Accessibility",
      text: "Located in Taguig, with a map and directions to help your guests find the venue."
    },
    {
      icon: "assets/icons/celebration.svg",
      title: "Flexible Spaces for Different Occasions",
      text: "Talk to us about how the venue can be arranged for birthdays, christenings, receptions, reunions, and more."
    },
    {
      icon: "assets/icons/chair.svg",
      title: "Facilities and Event Amenities",
      text: "Ask about the facilities, equipment, and amenities available for your event date."
    },
    {
      icon: "assets/icons/sparkle.svg",
      title: "Personalized Event Planning and Coordination",
      text: "Share your event requirements, decoration preferences, and additional services, and we'll help you with the next steps."
    }
  ],

  // SAMPLE testimonials. Replace with real reviews from real customers
  // (with their permission) or delete this whole list to hide the section.
  testimonials: [
    { quote: "Sample testimonial: a warm, welcoming venue that made our celebration feel special.", name: "Cyruz Angelo Dionisio", event: "Birthday Party" },
    { quote: "Sample testimonial: smooth coordination from our first inquiry to the day of the event.", name: "Ma. Katheryn Cuadra", event: "Wedding Reception" },
    { quote: "Sample testimonial: plenty of space for the whole family to enjoy our reunion.", name: "Colynne Louise Dionisio", event: "Family Reunion" }
  ]
};
