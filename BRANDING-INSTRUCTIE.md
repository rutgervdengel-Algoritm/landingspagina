# WachtlijstHelderheid — Branding & Design Instructie

Gebruik deze instructie om de app te bouwen in exact dezelfde visuele stijl als de landingspagina.

---

## 1. Kleurenpalet

### Primaire kleuren

| Naam | Hex | Gebruik |
|------|-----|---------|
| **Forest 500** | `#2D5A4A` | Primaire tekst, headings, navigatie, knoppen secondary |
| **Forest 600** | `#264D3F` | Hover states, section titles |
| **Forest 700** | `#1E3F33` | Donkere accenten |
| **Terracotta 500** | `#C67B4B` | CTA-knoppen, waarschuwingen, primaire actieknoppen |
| **Terracotta 600** | `#B56A3B` | Hover state van CTA-knoppen |
| **Teal 500** | `#5BA89D` | Decoratieve accenten, succes-indicatoren, iconen |
| **Teal 600** | `#4D8E84` | Positieve percentages, status-indicators |

### Achtergrondkleuren

| Naam | Hex | Gebruik |
|------|-----|---------|
| **Cream 50** | `#FDFBF7` | Card-achtergronden licht |
| **Cream 100** | `#F7F3EC` | Pagina-achtergrond, navbar, secties |
| **Cream 200** | `#F0EADF` | Hover-achtergronden |
| **Cream 300** | `#E8DFD0` | Borders, scheidingslijnen |

### Tekst-tinten (Navy)

| Naam | Hex | Gebruik |
|------|-----|---------|
| **Navy 400** | `#9E9182` | Labels, subtekst, meta-informatie |
| **Navy 500** | `#6B6155` | Body tekst, paragrafen, subtitels |
| **Navy 700** | `#3A352E` | Donkere tekst |

### Volledige kleurschalen

```
cream:      50:#FDFBF7  100:#F7F3EC  200:#F0EADF  300:#E8DFD0  400:#DDD2C0  500:#D1C4AD
forest:     50:#EDF3F1  100:#D4E2DD  200:#A8C5BA  300:#7DA898  400:#517B6E  500:#2D5A4A  600:#264D3F  700:#1E3F33  800:#173028  900:#10221D
terracotta: 50:#FDF5F0  100:#FAEADE  200:#F3D1B8  300:#ECB892  400:#D9956A  500:#C67B4B  600:#B56A3B  700:#955530  800:#754325  900:#5A331D
teal:       50:#EEF7F5  100:#D5EDEA  200:#ABDBD4  300:#82C9BF  400:#6BB8AD  500:#5BA89D  600:#4D8E84  700:#3E736B  800:#305952  900:#213F3A
navy:       50:#F7F3EC  100:#F0EADF  200:#E0D6C8  300:#C5B8A5  400:#9E9182  500:#6B6155  600:#514A40  700:#3A352E  800:#2A2621  900:#1A1815
```

---

## 2. Typografie

### Fonts (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
```

| Font | Gebruik |
|------|---------|
| **DM Serif Display** | Headings (h1, h2, section titles) — serif, warm, betrouwbaar |
| **Plus Jakarta Sans** | Body tekst, labels, knoppen, navigatie — sans-serif, modern, leesbaar |

### Tailwind fontFamily config

```ts
fontFamily: {
  sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
  serif: ["DM Serif Display", "Georgia", "serif"],
}
```

### Typografische hiërarchie

- **H1**: `text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-forest-600`
- **H2 / Section title**: `text-3xl md:text-4xl font-serif font-bold text-forest-600 text-center`
- **Subtitel**: `text-lg md:text-xl text-navy-500`
- **Body**: `text-base text-navy-500` (standaard body kleur: `#2D5A4A`)
- **Label/meta**: `text-xs text-navy-400` of `text-sm text-navy-400`
- **Nav-links**: `text-sm font-semibold text-forest-500`

---

## 3. Componenten & UI-patronen

### Knoppen

```css
/* Basis: alle knoppen zijn rounded-full */
.btn: inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2

/* Primair (terracotta CTA) */
.btn-primary: bg-terracotta-500 text-white hover:bg-terracotta-600 focus:ring-terracotta-400 px-6 py-3

/* Secundair (forest groen) */
.btn-secondary: bg-forest-500 text-white hover:bg-forest-600 focus:ring-forest-400 px-6 py-3

/* Outline */
.btn-outline: border-2 border-forest-500 text-forest-500 hover:bg-forest-500 hover:text-white px-6 py-3

/* Groot formaat */
.btn-lg: px-8 py-4 text-lg
```

### Cards

```css
.card: bg-white rounded-2xl p-6 transition-all duration-200 hover:shadow-lg border border-cream-300
```

### Badges

```css
.badge: inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
.badge-green: bg-teal-100 text-teal-700     /* succes, positief */
.badge-blue:  bg-forest-100 text-forest-600  /* info, neutraal */
.badge-amber: bg-terracotta-100 text-terracotta-700  /* waarschuwing, aandacht */
```

### Invoervelden (aanbevolen stijl, consistent met de rest)

```
bg-cream-50 border border-cream-300 rounded-xl px-4 py-3 text-forest-600 placeholder:text-navy-400 focus:ring-2 focus:ring-teal-400 focus:border-teal-400
```

### Navigatie

- Vaste top-balk: `bg-cream-100/90 backdrop-blur-md border-b border-cream-300`
- Hoogte: `h-16`
- Logo: forest-groen vierkant (`bg-forest-500 rounded-lg`) met witte letter + `font-serif text-xl text-forest-600`
- Links: `text-forest-500 hover:text-forest-700 text-sm font-semibold`

---

## 4. Layout & Spacing

- **Max-breedte**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Secties**: `py-16 md:py-24` met afwisselend `bg-cream-100` en `bg-white`
- **Border-radius**: `rounded-2xl` voor cards/panelen, `rounded-xl` voor kleinere elementen, `rounded-full` voor knoppen/badges
- **Schaduwen**: `shadow-xl` voor hero-elementen, `hover:shadow-lg` voor cards
- **Borders**: `border border-cream-300` op cards en scheiders

---

## 5. Iconen & Decoratie

- **Iconenset**: Lucide React (`lucide-react`)
- **Icoonkleur**: `text-teal-500` (decoratief), `text-forest-500` (functioneel)
- **Decoratieve lijnen**: SVG curves in `#5BA89D` (teal) met `opacity-20`
- **Status-dots**: `w-1.5 h-1.5 rounded-full bg-teal-500`

---

## 6. Animaties

- **Library**: Framer Motion (`framer-motion`)
- **Fade-in**: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}`
- **Slide-in**: `initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}`
- **Transities**: `transition-all duration-200` op interactieve elementen

---

## 7. Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts (DM Serif Display + Plus Jakarta Sans)
- **Iconen**: Lucide React
- **Animaties**: Framer Motion
- **Taal**: TypeScript

---

## 8. Sfeer & Merkidentiteit

- **Warm en betrouwbaar**: Crème-achtergronden ipv koud wit, serif headings voor vertrouwen
- **Professioneel maar toegankelijk**: Geen harde contrasten, zachte schaduwen
- **Natuurlijk kleurenpalet**: Forest groen (vertrouwen), terracotta (actie/warmte), teal (frisheid/succes)
- **Kindvriendelijk maar gericht op professionals**: De app is voor kinderopvangorganisaties — professioneel maar met een warme, menselijke uitstraling
- **Afgeronde vormen**: rounded-full knoppen, rounded-2xl cards — zacht en uitnodigend
