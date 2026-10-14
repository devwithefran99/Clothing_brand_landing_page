/* ==========================================================================
   SITE CONFIG
   Notun client er jonno shudhu ei file ta bodlaben. Baki file ghatar dorkar nai.

   Quick checklist:
   1. brand.name / brand.logo / brand.tagline
   2. theme.accent (+ theme.mode = "dark" ba "light")
   3. contact.whatsapp (country code shoho, + chara. e.g. 8801XXXXXXXXX)
   4. collections + products (img khali rakhle stylish garment illustration dekhabe)
   5. social links, footer, copy (headline text)
   ========================================================================== */

window.SITE = {

  /* ---------- Brand ---------- */
  brand: {
    name: "SWAG",
    tagline: "Crafted in Bangladesh",
    logo: "",          // e.g. "assets/logo.png". Khali thakle naam text hishebe dekhabe
    logoHeight: 30,    // px
    favicon: ""        // e.g. "assets/favicon.png". Khali thakle auto generate hobe
  },

  /* ---------- Look ---------- */
  theme: {
    mode: "dark",      // "dark" | "light"
    accent: "#d8c3a0"  // brand color. Light mode e ektu gaero (dark) rong dile bhalo dekhay
  },

  seo: {
    title: "SWAG | Everyday clothing made in Bangladesh",
    description: "Shirts, trousers, winter wear and festive panjabi. Cash on delivery all over Bangladesh."
  },

  /* ---------- Contact ---------- */
  contact: {
    whatsapp: "8801700000000",      // sudhu digit, country code shoho
    phone: "+8801700000000",
    email: "hello@yourbrand.com",
    messenger: "",                  // Facebook page username (m.me/<username>)
    address: "Chattogram, Bangladesh"
  },

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: "",
    tiktok: ""
  },

  currency: "৳",

  /* WhatsApp order message. Placeholders: {brand} {product} {size} {price} {url} */
  orderMessage: "Hello {brand}, I would like to order:\n\nProduct: {product}\nSize: {size}\nPrice: {price}\n\n{url}",

  defaultDescription: "Soft, durable fabric with a clean fit. Cut and stitched in Bangladesh.",

  /* ---------- Navigation ---------- */
  nav: [
    { label: "Collections", href: "#collections" },
    { label: "Shop",        href: "#shop" },
    { label: "Fabric",      href: "#story" },
    { label: "Contact",     href: "#contact" }
  ],

  /* ---------- Hero ---------- */
  hero: {
    eyebrow: "Winter 2026 collection",
    title: ["Winter", "Essentials"],   // max 2 line. 2nd line outline style hobe
    text: "Clean cuts, honest fabric and prices that make sense. Pick a piece, send us a message, pay when it reaches your door.",
    primary:   { label: "Shop the collection", href: "#shop" },
    secondary: { label: "Order on WhatsApp", href: "whatsapp" },   // "whatsapp" likhle auto link hobe
    points: [
      { icon: "bi-cash-coin", text: "Cash on delivery" },
      { icon: "bi-box-seam",  text: "Trial at delivery" },
      { icon: "bi-arrow-repeat", text: "Easy exchange" }
    ]
  },

  /* ---------- Scrolling strip below hero ---------- */
  marquee: [
    "Winter 2026",
    "Cash on delivery",
    "Trial at delivery",
    "Easy exchange",
    "Made in Bangladesh",
    "New arrivals every month"
  ],

  /* ---------- Section copy ---------- */
  copy: {
    collections: { eyebrow: "Collections", title: "Shop by category" },
    shop:        { eyebrow: "The edit", title: "Pick your piece", text: "Tap a piece to see sizes and order it directly on WhatsApp." },
    perks:       { eyebrow: "Why order from us", title: "Shopping without the risk" },
    reviews:     { eyebrow: "Customers", title: "What buyers say" },
    cta: {
      title: "Found something you *like*?",
      text: "Message us with the product name and size. We confirm your order and deliver to your door."
    }
  },

  /* ---------- Collections ----------
     type: shirt | pants | jacket | sweater | panjabi (illustration shape)
  */
  collections: [
    { id: "shirts",  name: "Shirts",  type: "shirt",   color: "#e9e1cf" },
    { id: "bottoms", name: "Bottoms", type: "pants",   color: "#34363a" },
    { id: "winter",  name: "Winter",  type: "jacket",  color: "#5b4632" },
    { id: "festive", name: "Festive", type: "panjabi", color: "#4a5a3a" }
  ],

  /* ---------- Products ----------
     img: "assets/products/xyz.jpg"  (khali thakle illustration dekhabe)
     badge: "NEW" | "SALE"           (optional)
     featured: true                  (hero er 3D ring e dekhabe, 6 ta dile bhalo)
     sizes: ["S","M","L"]            (optional, default S-XXL)
  */
  products: [
    { id: "crochet-ivory", name: "Crochet Cuban Shirt, Ivory",   category: "shirts", type: "shirt", color: "#e9e1cf", price: 1250, badge: "NEW", featured: true,
      desc: "Textured crochet knit with a Cuban collar and a relaxed boxy cut. Light enough for warm afternoons." },
    { id: "organza-royal", name: "Organza Safari Shirt, Royal Blue", category: "shirts", type: "shirt", color: "#1f3fb8", price: 1250, badge: "NEW", featured: true },
    { id: "organza-navy",  name: "Organza Shirt, Rich Navy",     category: "shirts", type: "shirt", color: "#17233f", price: 1150 },
    { id: "plaid-wine",    name: "Plaid Flannel Shirt, Wine",    category: "shirts", type: "shirt", color: "#7a2e2e", price: 1350 },

    { id: "pleat-charcoal", name: "Pleated Trousers, Charcoal",  category: "bottoms", type: "pants", color: "#34363a", price: 1450, featured: true },
    { id: "pleat-cream",    name: "Pleated Trousers, Cream",     category: "bottoms", type: "pants", color: "#e3dccb", price: 1450 },
    { id: "pleat-navy",     name: "Pleated Trousers, Classic Navy", category: "bottoms", type: "pants", color: "#1c2f55", price: 1450 },
    { id: "painter-olive",  name: "Painter Pants, Olive",        category: "bottoms", type: "pants", color: "#5a6240", price: 1650 },

    { id: "sherpa-brown",  name: "Sherpa Jacket, Brown",         category: "winter", type: "jacket",  color: "#5b4632", price: 3250, oldPrice: 3850, badge: "SALE", featured: true },
    { id: "turtle-forest", name: "Turtleneck Sweater, Forest",   category: "winter", type: "sweater", color: "#1f4a3a", price: 2150, featured: true },
    { id: "cord-taupe",    name: "Cord Overshirt, Taupe",        category: "winter", type: "jacket",  color: "#8a7a66", price: 2450 },
    { id: "zip-slate",     name: "Zipped Knit Jacket, Slate",    category: "winter", type: "jacket",  color: "#4c5663", price: 2950 },

    { id: "panjabi-black", name: "Zardozi Panjabi, Black",       category: "festive", type: "panjabi", color: "#101010", price: 2350, oldPrice: 2790, badge: "SALE", featured: true },
    { id: "panjabi-olive", name: "Zardozi Panjabi, Olive",       category: "festive", type: "panjabi", color: "#4a5a3a", price: 2350, oldPrice: 2790, badge: "SALE" },
    { id: "panjabi-gold",  name: "Zardozi Panjabi, Mustard",     category: "festive", type: "panjabi", color: "#b07a1f", price: 2050, oldPrice: 2490, badge: "SALE" },
    { id: "panjabi-brown", name: "Zardozi Panjabi, Brown",       category: "festive", type: "panjabi", color: "#3f2e25", price: 2350 }
  ],

  /* ---------- Fabric story (pinned 3D rotating section) ---------- */
  story: {
    eyebrow: "Fabric focus",
    title: "The crochet shirt, *up close*",
    text: "A soft, open weave that breathes in the heat and still holds its shape after every wash. Spin the piece as you scroll.",
    product: "crochet-ivory",          // products er id
    backTitle: "Made to last",
    backText: "Pre-washed fabric. Reinforced seams. Honest sizing.",
    features: [
      { icon: "bi-wind",         title: "Breathable weave",  text: "Open knit structure keeps air moving all day." },
      { icon: "bi-scissors",     title: "Relaxed boxy cut",  text: "Falls straight from the shoulder, no cling." },
      { icon: "bi-patch-check",  title: "Finished by hand",  text: "Every seam checked before it ships." }
    ],
    cta: { label: "Shop shirts", filter: "shirts" }
  },

  /* ---------- Perks ---------- */
  perks: [
    { icon: "bi-cash-coin",    title: "Cash on delivery", text: "Pay at your door, anywhere in Bangladesh." },
    { icon: "bi-box-seam",     title: "Trial at delivery", text: "Try it on while the rider waits." },
    { icon: "bi-arrow-repeat", title: "Easy exchange",    text: "Wrong size? We swap it, no questions." },
    { icon: "bi-patch-check",  title: "Made in Bangladesh", text: "Cut and stitched by local workshops." }
  ],

  /* ---------- Reviews ----------
     Sudhu real customer review boshaben. enabled: true korle section ta dekhabe.
  */
  testimonials: {
    enabled: false,
    items: [
      // { name: "Customer name", place: "Dhaka", rating: 5, text: "Real review here." }
    ]
  },

  /* ---------- Footer ---------- */
  footer: {
    about: "Everyday clothing made in Bangladesh. Honest fabric, clean cuts, cash on delivery.",
    help: [
      { label: "Delivery policy",   href: "#" },
      { label: "Exchange policy",   href: "#" },
      { label: "Privacy policy",    href: "#" },
      { label: "Terms & conditions", href: "#" }
    ]
  }
};
