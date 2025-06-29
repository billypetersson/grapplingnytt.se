# GrapplingNytt.se

Sveriges främsta källa för nyheter om grappling, nogi, ADCC och brasiliansk jiu-jitsu.

## 🥋 Funktioner

- **Responsiv design** - Fungerar perfekt på alla enheter
- **Nyhetsaggregering** - Samlar nyheter från ledande grappling-källor
- **Tävlingskalender** - Håll koll på kommande turneringar och events
- **ADCC-fokus** - Specialbevakning av ADCC-nyheter och uppdateringar
- **BJJ-nyheter** - Senaste från brasiliansk jiu-jitsu-världen
- **Svensk fokus** - Extra uppmärksamhet på svenska atleter och tävlingar

## 🚀 Snabbstart

### Lokal utveckling

1. Klona repositoriet:
```bash
git clone https://github.com/yourusername/grapplingnytt.se.git
cd grapplingnytt.se
```

2. Öppna `index.html` i din webbläsare eller använd en lokal server:
```bash
# Med Python
python -m http.server 8000

# Med Node.js
npx serve .

# Med PHP
php -S localhost:8000
```

3. Navigera till `http://localhost:8000`

### Deployment till GitHub Pages

#### Automatisk deployment (rekommenderad)

1. **Aktivera GitHub Pages:**
   - Gå till ditt repositorys Settings
   - Scrolla ner till "Pages" sektionen
   - Under "Source", välj "GitHub Actions"

2. **Push till main branch:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. **GitHub Actions kommer automatiskt:**
   - Bygga och deploya siten
   - Din sida blir tillgänglig på `https://yourusername.github.io/grapplingnytt.se`

#### Manuell deployment

Om du föredrar att deploya manuellt:

1. Gå till repositorys Settings → Pages
2. Välj "Deploy from a branch" under Source
3. Välj "main" branch och "/ (root)" folder
4. Klicka Save

## 📁 Projektstruktur

```
grapplingnytt.se/
├── index.html              # Huvudsida
├── assets/
│   ├── css/
│   │   └── style.css       # Huvudstylesheet
│   ├── js/
│   │   └── main.js         # JavaScript-funktionalitet
│   └── images/             # Bilder och logotyper
├── data/
│   └── events.json         # Tävlingsdata
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions workflow
└── README.md
```

## 🎨 Anpassning

### Färgschema

Webbplatsen använder ett grappling-inspirerat färgschema:
- **Primär:** `#1a237e` (Djupblå)
- **Sekundär:** `#c62828` (Röd accent)
- **Tertiär:** `#ffd600` (Guldaccent)

Ändra färgerna i `:root` variablerna i `assets/css/style.css`.

### Logotyp

1. Lägg din logotyp i `assets/images/`
2. Uppdatera sökvägen i `index.html`:
```html
<img src="assets/images/din-logo.png" alt="GrapplingNytt.se" class="logo-img">
```

### Innehåll

#### Nyheter
- Redigera mock-data i `assets/js/main.js` → `getMockNews()`
- För riktiga RSS-feeds, uppdatera `getRSSFeeds()` metoden

#### Tävlingar
- Uppdatera `data/events.json` med kommande events
- Lägg till nya event-typer i `event_types` sektionen

## 🔧 Teknisk information

### Teknisk stack
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Fonts:** Inter från Google Fonts
- **Deployment:** GitHub Pages
- **CI/CD:** GitHub Actions

### Browser-stöd
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Prestandaoptimering
- Lazy loading för bilder
- CSS Grid och Flexbox för layout
- Minimal JavaScript footprint
- Optimerad för mobile-first

## 🚧 Framtida utveckling

### Planerade funktioner
- [ ] Riktiga RSS-feeds från grappling-källor
- [ ] CMS-integration för redaktionellt innehåll
- [ ] Push-notifieringar för viktiga nyheter
- [ ] Användarkonton och favoriter
- [ ] Avancerad sökning och filtrering
- [ ] Flerspråksstöd (engelska)

### Utvecklingsmiljö

För framtida utveckling med build-process:

```bash
# Installera Node.js och npm
npm init -y
npm install --save-dev vite
npm install --save-dev sass

# Lägg till build-scripts i package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 📝 Content Management

### Lägga till nyheter

För att lägga till nyheter manuellt (innan CMS implementeras):

1. Redigera `getMockNews()` i `assets/js/main.js`
2. Följ samma struktur:
```javascript
{
  title: "Nyhetens titel",
  excerpt: "Kort beskrivning...",
  source: "Källa",
  date: "YYYY-MM-DD",
  image: "bild-url",
  url: "länk-till-artikel"
}
```

### Lägga till tävlingar

1. Öppna `data/events.json`
2. Lägg till nytt event i `upcoming_events` array:
```json
{
  "id": 999,
  "title": "Tävlingens namn",
  "date": "2024-MM-DD",
  "location": "Plats",
  "type": "event-typ",
  "description": "Beskrivning"
}
```

## 🤝 Bidrag

1. Fork projektet
2. Skapa en feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit dina ändringar (`git commit -m 'Add some AmazingFeature'`)
4. Push till branchen (`git push origin feature/AmazingFeature`)
5. Öppna en Pull Request

## 📄 Licens

Detta projekt är licensierat under MIT License - se [LICENSE](LICENSE) filen för detaljer.

## 📞 Kontakt

- Website: [grapplingnytt.se](https://grapplingnytt.se)
- Email: info@grapplingnytt.se

## 🙏 Erkännanden

- Tack till grappling-communityn för inspiration
- FloGrappling, BJJEE och andra källor för nyhetsreferenser
- Inter font family från Google Fonts