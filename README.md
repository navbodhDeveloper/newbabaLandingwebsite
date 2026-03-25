# Baba Satyanarayan Mourya — Official Landing Page

Production-ready HTML/CSS/JS landing page.  
No frameworks, no build step, no dependencies — push to GitHub and it works.

---

## File Structure

```
baba-mourya-landing/
├── index.html              ← Main page (edit all content here)
├── robots.txt              ← SEO: tells Google what to index
├── .gitignore
│
├── css/
│   ├── variables.css       ← ALL colors, fonts, spacing — edit here first
│   ├── base.css            ← Reset, typography, utilities, animations
│   ├── nav.css             ← Navbar styles
│   ├── sections.css        ← Hero, stats, about, programs, milestones, etc.
│   ├── footer.css          ← Footer styles
│   └── responsive.css      ← All media queries + scroll-to-top
│
├── js/
│   └── main.js             ← Navigation, form, counters, scroll reveal
│
└── assets/
    └── images/
        ├── baba-portrait.jpg       ← TODO: Add official portrait (600×800 px)
        ├── og-image.jpg            ← TODO: Social preview image (1200×630 px)
        ├── favicon.svg             ← TODO: Browser tab icon
        └── apple-touch-icon.png   ← TODO: iPhone home screen icon
```

---

## How to Run Locally

Just open `index.html` in any browser. No server needed for static files.

```bash
# Option 1: Direct open
open index.html

# Option 2: Simple local server (Python)
python3 -m http.server 3000
# Then visit: http://localhost:3000

# Option 3: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

---

## How to Edit Content

### Change text, links, phone numbers
→ Open `index.html` and search for `EDIT:` comments. Every editable section is marked.

### Change colors or fonts
→ Open `css/variables.css`. All design tokens are at the top.

### Change contact form API URL
→ Open `js/main.js`, change `CONTACT_API_URL` at the top.

---

## How to Add the Portrait Image

1. Save Baba Ji's official photo as `assets/images/baba-portrait.jpg`
2. In `index.html`, find the `hero__portrait` section
3. Replace the placeholder div with:
   ```html
   <img
     src="assets/images/baba-portrait.jpg"
     alt="Baba Satyanarayan Mourya"
     width="300"
     height="400"
     loading="eager"
   />
   ```

---

## Deploy to GitHub Pages (Free Hosting)

1. Push this folder to a GitHub repository
2. Go to: Repository Settings → Pages → Source → Deploy from branch → `main` → `/root`
3. Your site will be live at: `https://yourusername.github.io/repo-name/`

### Custom Domain (bharatbhakti.org)
1. Add a `CNAME` file with just your domain:
   ```
   bharatbhakti.org
   ```
2. Update DNS records at your domain registrar:
   - A record → `185.199.108.153`
   - A record → `185.199.109.153`
   - A record → `185.199.110.153`
   - A record → `185.199.111.153`

---

## Connect Contact Form to Backend

The form currently uses `fetch('/api/contact')`. To make emails work:

1. Run the Node.js server from the `baba-mourya-website/` folder
2. Change `CONTACT_API_URL` in `js/main.js` to:
   ```js
   const CONFIG = {
     CONTACT_API_URL: 'https://yourdomain.com/api/contact',
     ...
   };
   ```
3. For GitHub Pages (static only), use a free service like:
   - **Formspree**: https://formspree.io (free tier)
   - **EmailJS**: https://emailjs.com (free tier)

---

## SEO Checklist

- [x] `<title>` and `<meta description>` set
- [x] Open Graph tags for WhatsApp / Facebook preview
- [x] `robots.txt` allows indexing
- [x] JSON-LD structured data (Person schema)
- [x] `lang="hi-IN"` on `<html>`
- [x] `<link rel="canonical">` set
- [ ] TODO: Add actual `og-image.jpg` (1200×630 px)
- [ ] TODO: Update canonical URL to real domain
- [ ] TODO: Submit sitemap to Google Search Console

---

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge).  
Graceful fallback for IE11 (no animations, full content still visible).

---

## License

© Baba Satyanarayan Mourya / Bharat Bhakti Sansthan. All rights reserved.
