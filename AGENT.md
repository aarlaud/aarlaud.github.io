# Agent Context & Guidelines

## Project Overview
Personal static blog built with **Eleventy (v3.1.5)** and hosted on GitHub Pages.
- `index.njk` — homepage: compact hero splash (photo, tagline, topic stats) + up to 3 latest posts under “Latest blurbs”; `bodyClass: home` enables full-width layout
- `articles.njk` — all posts listing at `/articles/`
- `bio.njk` — Bio page at `/bio/`
- CSS-based orbital animation effects with twinkling stars background
- Articles written in Markdown under `articles/`

## Project Structure
```
.
├── index.njk               # Homepage (splash + 3 latest posts; `bodyClass: home`)
├── articles.njk            # All articles listing (/articles/)
├── bio.njk                 # Bio page (/bio/)
├── eleventy.config.cjs     # Eleventy config: collections, filters, passthrough
├── package.json            # Eleventy SSG with open-cli and luxon
├── DEPLOY.md               # GitHub Pages deployment guide
├── .github/workflows/
│   └── deploy.yml          # CI: build on push to main, deploy _site/ to Pages
├── articles/               # Article source files (.md)
├── assets/                 # Static assets (passthrough copy of entire directory)
│   └── images/             # Images (antoine.jpg, placeholder.svg, etc.)
├── _includes/
│   └── _layouts/
│       ├── base.njk        # Base HTML shell (stars, orbits, header, footer, all CSS)
│       └── article.njk     # Article page layout (title, date, TOC, content, tags)
├── .eleventyignore         # Excludes AGENT.md and README.md from processing
├── scripts/
│   └── scaffold-article.js # Blog scaffolding CLI (slugifies title → filename)
└── _site/                  # Build output (auto-generated, gitignored)
```

## Tech Stack
- **Build Tool**: Eleventy v3.1.5 (static site generator)
- **Date Formatting**: luxon v3+ (via `date` and `readingTime` filters in `eleventy.config.cjs`)
- **Article typography**: Source Serif 4 for prose; build-time TOC, read time, callout styling
- **Dev Server**: `npm run dev` starts Eleventy live reload
- **Build Command**: `npm run build` (or `npx @11ty/eleventy`)
- **Additional**: open-cli for auto-open in browser
- **CI**: GitHub Actions (`.github/workflows/deploy.yml`) — Node 24, `npm ci` + `npm run build`, deploys `_site/` to GitHub Pages on push to `main`

### Eleventy filters (`eleventy.config.cjs`)
- `date` — Luxon formatting (ISO strings or JS Date objects)
- `readingTime` — word-count estimate from HTML content (~200 wpm, min 1 min)
- `addHeadingIds` — injects `id` attributes on `<h2>`/`<h3>` for anchor links
- `extractHeadings` — parses headed HTML into `{ level, id, text }[]` for TOC

### Article collection
- Glob: `articles/**/*.md`
- Sort: newest `date` first; ties broken by `inputPath` localeCompare

## Key Features
- Dark UI theme with slate/navy gradients
- Fixed orbital rings background animation
- Twinkling stars overlay effect
- **Layout widths**: homepage and articles listing use **1680px** max; bio and article pages use **1280px** page shell; article prose capped at **46rem** with sticky sidebar TOC at ≥1080px
- **Post cards** (homepage + `/articles/`): moderately square tiles (`aspect-ratio: 5 / 4`) in a responsive `auto-fill` grid (`minmax(280px, 1fr)`); when homepage has ≤3 posts, `home-posts-layout--solo` caps the grid at **380px** wide. Each card shows date, first tag, title, 3-line clamped summary, and “Read more →” pinned to the bottom with a subtle divider; left **3px accent border** on hover
- “More articles…” link on homepage when collection has >3 posts
- Sticky full-width header: nav (Home, Bio) + GitHub and LinkedIn icon links
- Article pages: build-time “On this page” TOC from h2/h3 headings, read-time badge, tag pills; footer “← Back home” link to `/` (`.article-footer`)
- **Back navigation**: bio and articles listing use `.back-link-container` with “← Back home” → `/`; bio gets extra top spacing (`3rem` vs `2.5rem` default)
- Responsive design with system font stack (sans-serif UI; Source Serif 4 for article prose)
- **Site footer**: “vibe coded in 2026” in `base.njk` — `body` + `.page-content` flex column; `footer { margin-top: auto }` pins it to the viewport bottom on short pages, pushes below content on long pages

## Development Workflow
1. **Create a new post:** Run `npm run new-article "Your Title"` — slugifies title for filename and permalink
2. **Edit files in `articles/`:** Use the generated `.md` file as your starting point
3. **Run preview:** `npm run dev` for live reload
4. **Build for production:** `npm run build`
5. **Deployment:** See [DEPLOY.md](./DEPLOY.md) for GitHub Pages setup (CI workflow already in `.github/workflows/deploy.yml`)

## Post-Change Visual Inspection

**After every codebase modification, perform the following visual inspection using chrome-devtools MCP (or equivalent browser tooling). If no browser MCP tools are available, skip this step.**

**Setup:**
1. Start dev server: `nohup npm run dev > /dev/null 2>&1 &`
2. Open homepage: `chrome-devtools_new_page` → `http://localhost:8080/`

**Inspection Steps:**

| Step | Action | Tool |
|------|--------|------|
| 1 | Screenshot homepage | `chrome-devtools_take_screenshot` — verify layout, typography, cards, animations |
| 2 | Navigate to latest article (click 1st card link) | `chrome-devtools_click` on 1st article link, then `chrome-devtools_take_screenshot` |
| 3 | Navigate back to homepage | `chrome-devtools_navigate_page` type=`back` |
| 4 | Navigate to Bio | `chrome-devtools_navigate_page` → `/bio/`, then `chrome-devtools_take_screenshot` |
| 5 | Go back to homepage | `chrome-devtools_navigate_page` type=`back` |

**Each screenshot should verify:**
- Layout, spacing, and alignment are correct
- No content overflow or truncation
- Animations (orbital rings, stars) render properly
- No visual regressions vs. previous state

**Final checks (always run):**
- `chrome-devtools_list_console_messages` — confirm no errors/warnings
- `chrome-devtools_list_network_requests` — confirm no 404s (ignore `favicon.ico` if not in project)
- `chrome-devtools_take_snapshot` — verify a11y tree if structure changes

## Template Conventions
- Articles in `articles/` should be `.md` files using `layout: _layouts/article.njk`
- The `article` collection is auto-built from all `articles/**/*.md` files (no special tag required)
- **Internal Links**: Always use the `url` filter for internal links (e.g., `{{ '/' | url }}` or `{{ post.url | url }}`) to ensure correct pathing with GitHub Pages `pathPrefix`.
- **Required frontmatter for all articles:**
  ```yaml
  ---
  layout: _layouts/article.njk
  title: Article Title
  date: YYYY-MM-DD
  summary: Short 2-3 sentence summary for homepage cards
  tags: [category]  # optional; first tag shown on cards
  permalink: /articles/slugified-title/
  ---
  ```
- **TOC**: `article.njk` pipes content through `addHeadingIds` then `extractHeadings` — only `<h2>` and `<h3>` appear in the sidebar TOC
- **Content field:** Main article body below frontmatter (or via `{% if content %}` in templates)
- **Asset paths (Images)**: Use root-relative URLs (e.g. `![alt](/assets/images/file.jpg)`) — NOT relative paths like `../assets/...`, since Markdown resolves paths against the output URL, not the source file location.
- Static assets in `assets/` directory (entire tree copied via passthrough)
- Article templates reference: `{{ title }}`, `{{ date }}`, `{{ summary }}`, `{{ content }}`, `{{ tags }}`

## Important Files
- `index.njk` — Homepage splash + up to 3 latest articles; adds `home-posts-layout--solo` when ≤3 posts; “More articles…” when >3
- `articles.njk` — Full article listing (same `.post-card-*` markup/grid as homepage; “← Back home” via `.back-link-container`; not in `article` collection)
- `bio.njk` — Bio page (`.bio-page` + `.article-content` prose; “← Back home” with extra spacing; not in `article` collection)
- `eleventy.config.cjs` — Article collection, date/readingTime/addHeadingIds/extractHeadings filters, `assets/` passthrough
- `_includes/_layouts/base.njk` — Base HTML shell, all inline CSS, header/footer
- `_includes/_layouts/article.njk` — Article layout with build-time TOC and `.article-footer` “← Back home” link
- `scripts/scaffold-article.js` — Slugifies title, writes frontmatter + starter sections
- `package.json` — Dependencies and scripts
- `.github/workflows/deploy.yml` — Production CI/CD (Node 24)

## Guidelines for Changes
1. **Scaffold first**: Always use `npm run new-article "Title"` instead of manually creating `.md` files to ensure consistent formatting and frontmatter.
2. **Live Preview**: Run `npm run dev` before testing changes to see results immediately
3. **Frontmatter required**: All articles must include `---` YAML frontmatter (see Template Conventions above)
4. **Date filter**: Uses Luxon format tokens (e.g. `'LLLL dd, yyyy'`, `'dd·LLL·yy'`) — NOT strftime
5. **Nunjucks syntax**: Use `{{ value if condition else default }}` — NOT JS ternary `? :`
6. **Asset paths (Images)**: Use root-relative URLs (e.g. `![alt](/assets/images/file.jpg)`) — NOT relative paths like `../assets/...`, since Markdown resolves paths against the output URL, not the source file location.
7. **Preserve styling**: Keep inline styles in `base.njk` unless modifying; post card styles under `.posts-grid` / `.post-card-*`; back-link spacing under `.back-link-container` / `.article-footer`; site footer sticky layout via `.page-content` flex + `footer { margin-top: auto }`
8. **Post card changes**: Tiles use `aspect-ratio: 5 / 4` (not full 1:1) — keep excerpt clamped and “Read more” at bottom via `margin-top: auto`; use `home-posts-layout--solo` for single/few-post homepage layout
9. **Homepage body class**: `index.njk` sets `bodyClass: home` (renders as `class="home"`); CSS targets `body.is-home` for full-width layout — these must match for homepage styles to apply
10. **Test build**: Run `npm run build` locally before committing
11. **Clean stale build output**: Eleventy v3 has no `--clean` flag; delete `_site/` manually then rebuild

---

## AGENT.MD Maintenance Instructions

**IMPORTANT**: This file must be kept in sync with the codebase to ensure the agent has accurate context before making changes.

**Add to this file when**:

1. **New dependencies installed** (e.g., `npm install package`):
   - Update the Tech Stack section
   - Add script if new commands created
   - Note breaking version changes

2. **New files/directories created**:
   - Add to Project Structure tree
   - Describe file purpose in file-specific section

3. **Template engine changes**:
   - If switching from Nunjucks to Liquid/Handlebars etc., update accordingly
   - Note new variables/filters available
   - Document breaking changes in build process

4. **Build process modifications**:
   - Update commands in Development Workflow
   - Note new build options/flags
   - Add environment variables if introduced

5. **Styling changes**:
   - If CSS replaced by SCSS/Less: update build instructions and file extensions
   - Note new utility classes/patterns
   - Document design system updates

6. **Content structure changes**:
   - New article formats or conventions
   - Frontmatter changes/extensions
   - Directory structure modifications

7. **Performance improvements**:
   - Note new optimization techniques used
   - Document bundle size changes
   - Add caching/CDN configurations

8. **New plugins/extensions**:
   - Document in Tech Stack section
   - Explain purpose and configuration
   - Note any limitations or gotchas

9. **Deployment changes**:
   - Update CI/CD pipeline notes
   - Add environment-specific configurations
   - Document build artifacts

**Remove from this file when**:
- Features/plugins deprecated and removed
- Commands no longer work or exist
- Deprecated file types/extensions

**After every codebase modification**:
1. Compare current files to documented context
2. Update AGENT.md with any new/changed information
3. Verify build still works after updates
4. Keep instructions action-oriented and specific

**Format rules**:
- Be concise - bullet points over paragraphs
- Use code blocks for commands, example structures
- Keep tree structure flat, no deep nesting
- Version numbers where relevant (e.g., Eleventy v3.1.5)
- Test commands before documenting

**Review frequency**:
- After dependency version bumps (>1 minor)
- When project structure changes
- On significant feature additions
- After build process changes