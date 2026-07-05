# StrataWorks Tech

Astro website for StrataWorks Tech.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

This repository includes `.github/workflows/deploy.yml`.

In GitHub:

1. Go to **Settings**
2. Go to **Pages**
3. Under **Build and deployment**, set **Source** to **GitHub Actions**
4. Push to `main` or `master`

The workflow will build Astro and deploy the `dist` folder to GitHub Pages.