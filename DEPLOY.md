# Deployment Guide

This blog is configured to deploy to **GitHub Pages** using the default GitHub URL: `https://aarlaud.github.io/`.

## 1. Automated Deployment (GitHub Actions)

We use GitHub Actions to build and deploy the site automatically whenever you push to the `main` branch.

### Setup Steps
1. Create a file at `.github/workflows/deploy.yml`.
2. Paste the following configuration:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: ["main"]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: "_site/"
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

3. In GitHub: Go to **Settings > Pages**.
4. Under **Build and deployment > Source**, select **GitHub Actions**.

---

## 2. (Optional) Custom Domain Configuration

If you decide to use a custom domain later:

1. Create a `CNAME` file in the project root containing your domain (e.g., `blog.example.com`).
2. Update `eleventy.config.cjs`:
   - Add `eleventyConfig.addPassthroughCopy("CNAME");`
3. Update DNS records at your registrar (see previous instructions in chat history or GitHub docs).
4. In GitHub: Go to **Settings > Pages** and enter your domain.
