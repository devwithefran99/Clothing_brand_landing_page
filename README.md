# Clothing brand landing page (reusable template)

Single page, 3D-style, animated. Stack: HTML, CSS, vanilla JS, Bootstrap 5.

## Notun client er jonno rebrand korar niyom

Shudhu `js/config.js` bodlaben. `index.html`, `style.css`, `main.js` e hat dite hobe na.

| Ki bodlabe | Config e kothay |
|---|---|
| Brand naam, tagline | `brand.name`, `brand.tagline` |
| Logo (image) | `brand.logo` = `"assets/logo.png"` (khali rakhle naam text dekhabe) |
| Brand color | `theme.accent` (hex) |
| Dark / Light | `theme.mode` = `"dark"` ba `"light"` |
| Browser tab title, Google description | `seo.title`, `seo.description` (eta alada, tai naam bodlale eta o bodlaben) |
| WhatsApp, phone, email | `contact.*` (WhatsApp number e country code lagbe, + chara: `8801XXXXXXXXX`) |
| Facebook / Instagram link | `social.*` |
| Hero headline | `hero.title` (2 line), `hero.eyebrow`, `hero.text` |
| Categories | `collections` |
| Products | `products` (naam, daam, rong, category, badge) |
| Product photo | `img: "assets/products/shirt-1.jpg"`. Photo na dile garment illustration dekhabe |
| Hero er 3D ring e kon product | product e `featured: true` (5-8 ta dile bhalo) |
| Fabric story section | `story` |
| Footer links, copy text | `footer`, `copy` |

Prottek client er jonno folder ta copy koren, `config.js` bodlan, photo gulo `assets/` e rakhen. Hoye gelo.

## Kivabe dekhbe / deploy korbe

- Local: `index.html` double click korlei khule jabe (internet lagbe, karon library gulo CDN theke ashe).
- Free hosting: Netlify Drop, Vercel, ba GitHub Pages e puro folder upload korun.

## Order kivabe kaj kore

Cart nai. Customer product e click kore size nibe, tarpor "Order on WhatsApp" press korle product naam, size, daam shoho message WhatsApp e khule jabe. Message er format `orderMessage` e bodlano jay.

## Notes

- Reviews section default e bondho (`testimonials.enabled: false`). Shudhu client er real customer review boshaben, tarpor `true` korben.
- Light mode e `theme.accent` ektu gaero (dark) dile text porte subidha hoy, jemon `#7a5c2e`.
- Footer link (Delivery policy etc.) ekhon `#`. Real page thakle link boshan.
- Visitor er device e "reduce motion" on thakle animation onek kome jay. Eta intentional, accessibility er jonno.

## Libraries (CDN)

Bootstrap 5.3.3, Bootstrap Icons 1.11.3, GSAP + ScrollTrigger 3.12.5, Lenis 1.1.13 (smooth scroll), vanilla-tilt 1.8.1 (card tilt). Kono ekta load na holeo page kaj kore, shudhu oi animation ta thakbe na.
