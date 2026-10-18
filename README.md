# Book & Notes Vault

A small, accessible, responsive web app for cataloguing books and notes. Built with **plain HTML, CSS and JavaScript** (no frameworks) as a summative assignment on building responsive UIs.

## Links


| What | Link |
|---|---|
| **Live site (GitHub Pages)** | https://ntakirutimanakelvin.github.io/Book-Notes-Vault/ |
| **Source code (GitHub repo)** | https://github.com/ntakirutimanakelvin/Book-Notes-Vault |
| **Demo video (unlisted, 2-3 min)** | https://youtu.be/-_W_nLg5bFo?si=ldP0eJ3mrLoEKGO5 |

## Chosen theme

**Book & Notes Vault** — each record is a book or a set of notes with a title, author, number of pages, a tag and the date it was added.

## Features

- **Five sections:** About, Dashboard, Add/Edit form, Records table, Settings.
- **Add, edit and delete** records. Every record has a unique `id`, `createdAt` and `updatedAt`.
- **Regex validation** on every form field (6 rules, including an advanced back-reference rule).
- **Live regex search** with a case-insensitive toggle and `<mark>` highlighting. Invalid patterns are caught and never crash the app.
- **Sorting** by date added, title (A-Z / Z-A) and pages (low-high / high-low).
- **Dashboard:** total books, total size, top tag, and a 7-day bar chart of pages added.
- **Page cap:** set a maximum number of pages. A live message shows pages remaining (polite) or pages over the cap (assertive).
- **Units:** show size as pages, minutes or hours of reading time, using a reading speed (minutes per page) set in Settings.
- **Saving:** every change is saved automatically to `localStorage`.
- **Import / Export JSON** with structure validation before loading.
- **Responsive layout:** mobile-first, table on desktop and cards on phones, with a transition on the chart bars and buttons.
- **Accessible:** skip link, semantic landmarks, visible focus, ARIA live regions, full keyboard use.

## Data model

```json
{
  "id": "rec_0001",
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "pages": 209,
  "tag": "Fiction",
  "dateAdded": "2025-09-25",
  "createdAt": "2025-09-25T10:00:00Z",
  "updatedAt": "2025-09-25T10:00:00Z"
}
```

## Regex catalog

All rules live in `scripts/validators.js`.

| Field | Pattern | Accepts | Rejects |
|---|---|---|---|
| Title (no edge spaces) | `/^\S(?:.*\S)?$/` | `Dune` | ` Dune`, `Dune ` |
| Title (no double spaces) | `/\s{2,}/` (match = error) | `Big book` | `Big  book` |
| **Title (advanced: back-reference)** | `/\b(\w+)\s+\1\b/i` (match = error) | `Big book` | `the the cat`, `Big big book` |
| Author | `/^[A-Za-z.]+(?:[ '-][A-Za-z.]+)*$/` | `Dan O'Neil`, `J. R. Editor` | `Dan2` |
| Pages | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` plus a whole-number check | `412` | `12.5`, `05`, `0` |
| Date added | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | `2025-09-29` | `2025-13-01` |
| Tag | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | `Self-help` | `Fiction2` |
| Reading speed | `/^\d+(\.\d{1,2})?$/` (and above 0) | `1.5`, `2` | `0`, `-1` |

### Search examples

Type these into the **Search (regex)** box:

| Pattern | What it finds |
|---|---|
| `the\|history` | Rows containing "the" or "history" |
| `^the` | Titles starting with "the" |
| `\b(\w+)\s+\1\b` | Repeated words, e.g. "The The Book of Repeats" |
| `\d{4}-09` | Books added in September |
| `(` | Invalid pattern: shows a message, no crash |

## Keyboard map

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move forward / backward through links, fields and buttons |
| `Tab` (first press) | Reveals the **Skip to content** link |
| `Enter` | Follow a link, press a button, submit the form |
| `Space` | Press a button, tick the **Ignore case** box |
| `↑` `↓` | Change the selected option in the **Sort by** and **Show size in** dropdowns |

Every control can be reached and used without a mouse, and the focus outline is always visible.

## Accessibility notes

- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`, with a proper heading order.
- **Skip-to-content** link as the first focusable element.
- Every input has a bound `<label>`; error messages are linked with `aria-describedby` and fields get `aria-invalid`.
- Status messages use `role="status"` / `aria-live`. The cap message is `polite` when under the cap and `assertive` when exceeded.
- Visible focus style (`:focus-visible`) on all interactive elements.
- Colour choices keep text readable against its background.
- `prefers-reduced-motion` turns animations off for users who ask for it.
- Search highlights use `<mark>`, and user text is HTML-escaped before it is displayed.

## Responsive design

Mobile-first CSS with three layouts:

| Width | Layout |
|---|---|
| ~360px (base) | Single column, table rows become cards |
| 768px | 3-column stats, side-by-side toolbar and header |
| 1024px | Full table with header row |

## Project structure

```
index.html        Page structure
tests.html        Browser tests (assertions)
seed.json         Sample records
styles/main.css   Mobile-first styles
scripts/
  main.js         Connects events to everything else
  state.js        App data, saving, unit conversion
  storage.js      localStorage load/save helpers
  validators.js   All regex rules and validation
  search.js       Safe regex compiler, HTML escape, highlighter
  ui.js           Draws the table, stats and messages
```

## How to run

The app uses ES modules, so it must be served over HTTP (opening the file by double-click will not work).

1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.
4. In **Settings**, click **Load sample data** to fill the app with the 11 records from `seed.json`.

## How to run the tests

1. Start Live Server as above.
2. Open `tests.html` in the browser (for example `http://127.0.0.1:5500/tests.html`).
3. Every line should start with **PASS**. A **FAIL** line names the rule that broke.

The tests cover the validation rules, the import validator, the safe regex compiler and the highlighter.

## Import / export format

Export downloads `vault-data.json`, an array of records in the data model above. Import checks that the file is valid JSON, is a list, and that each record has a string `id`, `title` and `author`, a whole-number `pages` of 1 or more, a valid `tag` and a valid `dateAdded`. If anything is wrong, the file is rejected and your current data is kept.

## Milestones

| Milestone | What it covers |
|---|---|
| M1 | Spec, wireframes, data model, accessibility plan |
| M2 | Semantic HTML and mobile-first CSS |
| M3 | Forms and regex validation, `tests.html` |
| M4 | Rendering, sorting, regex search, highlighting |
| M5 | Stats dashboard and page cap with ARIA live updates |
| M6 | localStorage, import/export, settings |
| M7 | Accessibility pass, animation, README, demo video |

## Author

**NTAKIRUTIMANA Kelvin**
- GitHub: https://github.com/ntakirutimanakelvin
- Email: k.ntakiruti@alustudent.com
