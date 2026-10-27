# KDramaWorld Design System & Korean Cultural Aesthetic

## 1. Design Philosophy & Cultural Grounding
KDramaWorld's aesthetic is rooted in traditional Korean art and visual philosophy (*Dancheong*, *Hanji*, *Obangsaek*), balanced with contemporary Seoul urban cinematic design (Han River reflections, neon signs, quiet midnight subway platforms). 

### Cultural Respect Guidelines
- **No National Flag or Taegeuk Symbol:** The South Korean national flag (*Taegeukgi*) and sacred *Taegeuk* symbol are never used as commercial or decorative flourishes.
- **Original Abstract Motifs:** All decorative patterns (*Kkotsal* lattice, *Gurum* clouds, *Mulgyeol* waves, *Yeondwae* lotus) are original abstractions inspired by Joseon wooden architecture and Korean celadon ceramics (*Goryeo cheongja*).
- **No Trademarked Network Logos:** We do not spoof broadcast station or streaming network logos.
- **Bilingual Typographic Harmony:** Every Hangul element is treated as primary artistic typography alongside Latin glyphs, tagged with `lang="ko"` for correct font rendering and screen-reader pronunciation.

---

## 2. Color Palette & CSS Variables

Colors are defined as raw RGB channel triplets in CSS variables and consumed in Tailwind as `rgb(var(--token) / <alpha-value>)`. Hard-coded tints (such as `bg-white/10`) are strictly banned in favor of theme-flipping tint tokens (`bg-tint-subtle`, `bg-tint-medium`, `bg-tint-strong`).

### Theme 1: "Seoul Night" (서울의 밤 · Dark Mode, Default)
- **Base Background:** Deep ink / navy-black (`10 12 20` / `#0a0c14`)
- **Layered Surface:** Ink slate card surface (`18 22 34` / `#121622`)
- **Elevated Surface:** Midnight elevated plate (`27 33 50` / `#1b2132`)
- **Cinematic Scrim:** Translucent dark scrim (`8 10 16`) for guaranteed photo contrast
- **Accents:**
  - *Dancheong Red (Jeok):* Soft Seoul street neon coral-red (`232 77 91` / `#e84d5b`)
  - *Indigo Blue (Cheong):* Han River midnight blue (`84 138 248` / `#548af8`)
  - *Celadon Green (Cheongja):* Luminous jade celadon (`64 196 168` / `#40c4a8`)
  - *Lantern Gold (Hwang):* Warm brass lantern gold (`240 185 75` / `#f0b94b`)
  - *Hanbok Rose (Dadaedan):* Dusty hanbok silk rose (`224 122 150` / `#e07a96`)

### Theme 2: "Hanji Day" (한지 낮 · Light Mode)
- **Base Background:** Warm traditional mulberry hanji paper cream (`249 246 238` / `#f9f6ee`) with subtle paper-fiber radial texture
- **Layered Surface:** Crisp hanji card (`255 253 248` / `#fffdf8`)
- **Elevated Surface:** Pressed paper elevated plate (`243 238 228` / `#f3eee4`)
- **Text:** Calligraphic sumi-ink (`24 20 26` / `#18141a`)
- **Accents:**
  - *Dancheong Red:* Deep mineral cinnabar red (`185 43 54` / `#b92b36`)
  - *Indigo Blue:* Royal traditional indigo (`34 76 156` / `#224c9c`)
  - *Celadon Green:* Rich Goryeo celadon jade (`42 135 112` / `#2a8770`)
  - *Lantern Gold:* Antique Hwang gold (`184 130 26` / `#b8821a`)
  - *Hanbok Rose:* Dried persimmon rose (`172 74 98` / `#ac4a62`)

---

## 3. Typography Hierarchy

All fonts are self-hosted Open Font License (OFL) files served via `next/font/local` with `font-display: swap` and zero external runtime requests.

| Role | Font Family | Source | Purpose |
|---|---|---|---|
| **Display Latin** | Cormorant Garamond | OFL | Cinematic titles, hero quotes, editorial headers |
| **Display Hangul** | Gowun Batang / Noto Serif KR | OFL | Poetic Korean sub-taglines, drama titles, section badges |
| **UI Primary** | Pretendard | SIL OFL | Navigation, body copy, metadata, ratings, forms |
| **Accent Hangul** | Black Han Sans | OFL | Stamp marks, wordmark badge, ticket stubs |

---

## 4. K-Theme Component Suite (`components/k-theme/`)

1. **`DancheongBand`:** Section divider and card accent band incorporating five traditional Obangsaek colors in rhythmically spaced geometric motifs.
2. **`PatternBackground`:** Subtle, low-opacity (3–5%) SVG tileable patterns:
   - `cloud` (*Gurum-mun*): Traditional auspicious cloud pattern.
   - `lattice` (*Kkotsal*): Floral window lattice found in Buddhist temples and royal palaces.
   - `wave` (*Mulgyeol*): Rhythm of moving water.
   - `lotus` (*Yeondwae*): Purity and rebirth motif.
3. **`HangulWatermark`:** Large calligraphic watermarks (*사랑, 이야기, 드라마, 인연, 여운, 기억*) layered behind editorial rails at very faint opacity (0.03–0.05).
4. **`BilingualLabel`:** Systematic Korean + Latin paired tags with `lang="ko"` attributes.
5. **`FourCutFrame`:** Photo-booth four-cut (*인생네컷*) frame style with photo border notches, date stamp, and film strip header.
6. **`TicketStubFrame`:** Perforated cinema ticket stub with verification badges for Wrapped and curated recommendations.
7. **`HanokFrame`:** Traditional Hanok window framing with wooden cheoma corner brackets wrapping hero rails.
8. **`CherryBlossomPetals`:** Micro-animation triggering falling cherry blossom petals on completion events (marking a drama completed, adding to favourites).
