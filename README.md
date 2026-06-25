# NeuralFlow — AI Platform HTML Template

A premium, fully-responsive HTML5 template for AI SaaS platforms, API dashboards, and developer tools. Built with clean vanilla HTML, CSS, and JavaScript — no framework required.

---

## 📁 File Structure

```
neuralflow/
├── index.html          ← Landing page (hero, features, pricing, FAQ…)
├── dashboard.html      ← App dashboard (charts, stats, API keys, logs)
├── login.html          ← Sign in page
├── signup.html         ← Registration page
├── pricing.html        ← Dedicated pricing page with comparison table
├── 404.html            ← Custom error page
├── css/
│   └── styles.css      ← All styles + design tokens
└── js/
    └── neural.js       ← Particle canvas, scroll reveal, card glow, dark mode
```

---

## 🚀 Quick Start

1. **Unzip** the package into your project folder.
2. Open `index.html` in any modern browser — everything works locally with no build step.
3. To deploy, upload all files to your web host preserving the folder structure.

---

## 🎨 Customisation

### Colours & Tokens
All colours and spacing are defined as CSS custom properties at the top of `css/styles.css`:

```css
:root {
  --bg:       #08091A;   /* page background */
  --indigo:   #5B5BD6;   /* primary brand colour */
  --cyan:     #22D3EE;   /* accent colour */
  /* … */
}
```

Change these to rebrand the entire template instantly.

### Fonts
The template uses three Google Fonts loaded in each `<head>`:
- **Space Grotesk** — headings & display
- **DM Sans** — body text
- **JetBrains Mono** — code snippets & labels

Replace the `<link>` tag to swap fonts.

### Dark / Light Mode
A dark/light toggle is built-in. Add `id="theme-toggle"` to any `<button>` to wire it up automatically. The user's preference is persisted in `localStorage`.

### Particle Canvas
Controlled by the `CONFIG` object at the top of `js/neural.js`. Adjust `nodeCount`, `speed`, colours, and glow radius to taste.

---

## 📄 Pages

| File | Description |
|------|-------------|
| `index.html` | Full marketing landing page — hero, features bento grid, how-it-works, pricing cards, testimonials, showcase, FAQ accordion, contact form, footer |
| `dashboard.html` | Post-login dashboard — sidebar nav, animated stat cards, SVG line chart, model-usage donut, API key management, request log table, upgrade banner |
| `login.html` | Sign-in page — Google/GitHub OAuth buttons, email + password form |
| `signup.html` | Registration page — social sign-up, name/email/password, perks list |
| `pricing.html` | Standalone pricing — annual/monthly toggle, 3-tier cards, full feature comparison table, FAQ, CTA |
| `404.html` | Error page — glitch animation on "404", quick-links back to key pages |

---

## ✅ Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. All modern mobile browsers.

---

## 📦 What's Included

- ✅ 6 fully-coded HTML pages
- ✅ 1 CSS file with complete design system (tokens, utilities, components, responsive)
- ✅ 1 JS file (particle network, scroll reveal, bento glow, dark/light mode)
- ✅ Interactive SVG line chart (no library)
- ✅ Animated stat counters
- ✅ Annual/monthly pricing toggle
- ✅ Responsive at 1200px / 900px / 600px breakpoints
- ✅ `prefers-reduced-motion` support
- ✅ Pixel-perfect dark theme (light theme via toggle)
- ✅ Zero npm dependencies — pure HTML/CSS/JS

---

## 🔗 Connecting a Backend

The template ships as static HTML. To connect real auth or data:

- **Login / Signup** — replace the `handleLogin()` / `handleSignup()` stubs in the respective HTML files with calls to your auth provider (Supabase, Firebase, Auth0, etc.).
- **Dashboard stats** — fetch data from your API and populate the stat card elements by `id` (e.g. `cnt-requests`, `cnt-latency`).
- **Contact form** — wire up to Formspree, EmailJS, or your own backend endpoint.

---

## 📬 Support

Questions? Open an issue on Codester or email **hello@neuralflow.ai** (placeholder — replace with your address).

---

© 2025 NeuralFlow Template. All rights reserved.
