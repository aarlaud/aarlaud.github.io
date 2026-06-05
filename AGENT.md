# Agent Context & Guidelines

## Project Overview
Personal static blog built with **Eleventy (v3.1.5)** and hosted on GitHub Pages.
- `index.njk` serves as the homepage: hero splash + 3 latest posts; `articles.njk` lists all posts (`/articles/`); `bio.njk` is the Bio page (`/bio/`)
- Uses CSS-based orbital animation effects with twinkling stars background
- Articles written in Markdown under `articles/`

## Project Structure
```
.
├── index.njk               # Homepage (splash hero + 3 latest posts; `bodyClass: home`)
├── articles.njk            # All articles listing (/articles/)
├── bio.njk                 # Bio page (/bio/)
├── eleventy.config.cjs     # Eleventy config: collections, filters, passthrough
├── package.json            # Eleventy SSG with open-cli and luxon
├── articles/               # Article source files (.md)
├── assets/
│   └── images/             # Static image assets
├── _includes/
│   └── _layouts/
│       ├── base.njk        # Base HTML shell (stars, orbits, header, footer)
│       └── article.njk    # Article page layout (title, date, content, tags)
├── .eleventyignore          # Excludes AGENT.md and README.md from processing
├── scripts/
│    └── scaffold-article.js # Blog scaffolding CLI
└── _site/                   # Build output (auto-generated, gitignored)
```

## Tech Stack
- **Build Tool**: Eleventy v3.1.5 (static site generator)
- **Date Formatting**: luxon v3+ (via `date` and `readingTime` filters in `eleventy.config.cjs`)
- **Article typography**: Source Serif 4 for prose; auto-generated TOC, read time, callout styling
- **Dev Server**: `npm run dev` starts Eleventy live reload
- **Build Command**: `npm run build` (or `npx @11ty/eleventy`)
- **Additional**: open-cli for auto-open in browser

## Key Features
- Dark UI theme with slate/navy gradients
- Fixed orbital rings background animation
- Twinkling stars overlay effect
- Styled article cards with hover effects
- Sticky full-width header with site nav (Home, Bio)
- Responsive design with system font stack

## Development Workflow
1. **Create a new post:** Run `npm run new-article "Your Title"`
2. **Edit files in `articles/`:** Use the generated `.md` file as your starting point
3. **Run preview:** `npm run dev` for live reload
4. **Build for production:** `npm run build`
5. **Deployment:** See [DEPLOY.md](./DEPLOY.md) for GitHub Pages and Custom Domain setup instructions.

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
| 4 | Navigate to 2nd latest article (click 2nd card link) | `chrome-devtools_click` on 2nd article link, then `chrome-devtools_take_screenshot` |
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
  title: Article Title
  date: YYYY-MM-DD
  summary: Short 2-3 sentence summary for homepage
  tags: [category]  # optional
  ---
  ```
- **Content field:** Main article body in `{% if content %}` or just paste below frontmatter (will be used if content field not provided)
- **Asset paths (Images)**: Use root-relative URLs (e.g. `![alt](/assets/images/file.jpg)`) — NOT relative paths like `../assets/...`, since Markdown resolves paths against the output URL, not the source file location.
- Static assets in `assets/` directory (images, fonts)
- Article templates reference: `{{ title }}`, `{{ date }}`, `{{ summary }}`, `{{ content }}`, `{{ tags }}`

## Important Files
- `index.njk` - Homepage (3 latest articles + link to full list)
- `articles.njk` - Full article listing (not in `article` collection)
- `bio.njk` - Bio page (not in `article` collection)
- `eleventy.config.cjs` - Eleventy config: article collection, date filter, asset passthrough
- `_includes/_layouts/base.njk` - Base HTML shell shared by all pages
- `_includes/_layouts/article.njk` - Article page layout
- `package.json` - Dependencies and scripts

## Guidelines for Changes
1. **Scaffold first**: Always use `npm run new-article "Title"` instead of manually creating `.md` files to ensure consistent formatting and frontmatter.
2. **Live Preview**: Run `npm run dev` before testing changes to see results immediately
3. **Frontmatter required**: All articles must include `---` YAML frontmatter:
    ```yaml
    ---
   layout: _layouts/article.njk
   title: Article Title
   date: YYYY-MM-DD
   summary: Short 2-3 sentence summary for homepage
   tags: [category]    # optional
   permalink: /articles/slugified-title/
    ---
    ```
3. **Date filter**: Uses Luxon format tokens (e.g. `'LLLL dd, yyyy'`) — NOT strftime
4. **Nunjucks syntax**: Use `{{ value if condition else default }}` — NOT JS ternary `? :`
5. **Asset paths (Images)**: Use root-relative URLs (e.g. `![alt](/assets/images/file.jpg)`) — NOT relative paths like `../assets/...`, since Markdown resolves paths against the output URL, not the source file location.
6. **Preserve styling**: Keep inline styles in `base.njk` unless modifying
7. **Test build**: Run `npm run build` locally before committing
8. **Clean stale build output**: Eleventy v3 has no `--clean` flag; delete `_site/` manually then rebuild

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
