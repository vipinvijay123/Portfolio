# Vipin Vijay — Interactive Orbital Portfolio

Interactive 300-frame orbital portfolio showcasing systems engineering, web development, and civic innovation projects.

---

## 🚀 Deploying to Vercel

This repository is pre-configured and 100% production-ready for deployment on **[Vercel](https://vercel.com)**.

### Option 1: Deploy with Vercel CLI (Fastest — 1 Minute)

Since you already have the Vercel CLI installed and authenticated, simply run:

```bash
# Preview deployment:
vercel

# Or direct production deployment:
vercel --prod
```

**Follow the prompts:**
1. `Set up and deploy?` → Press **`Y`** (Yes)
2. `Which scope do you want to deploy to?` → Select your account (`vipinvijay781`)
3. `Link to existing project?` → Press **`N`** (No, creates new project)
4. `What’s your project’s name?` → Press **Enter** (defaults to `portfolio` or enter custom name)
5. `In which directory is your code located?` → Press **Enter** (`./`)
6. `Want to modify these settings?` → Press **`N`** (No, `vercel.json` already handles configuration)

That's it! Your site will be live on a `*.vercel.app` URL immediately.

---

### Option 2: Deploy via GitHub (Continuous Deployment)

1. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit ready for Vercel deployment"
   ```
2. Create a new repository on [GitHub](https://github.com/new) and push your code:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
3. Go to [Vercel Dashboard](https://vercel.com/new) → **Add New** → **Project**.
4. Select your GitHub repository and click **Deploy**.
5. Every future `git push` will automatically trigger an instant production deployment.

---

## 🛠️ Local Development

To run the portfolio locally on port 3000:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Configuration Details

- **`vercel.json`**:
  - `cleanUrls: true` enables clean paths without `.html` extensions.
  - Custom `Cache-Control` headers for the 300 sequential animation frames (`/images/*`), enabling Vercel Edge caching and instant loading.
  - Asset caching for CSS and JavaScript.
  - Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`).
- **`404.html`**: Custom dark-themed orbital 404 page matching the portfolio aesthetic.
- **`robots.txt` & `sitemap.xml`**: Pre-configured for search engines.
- **`.gitignore`**: Excludes `.vercel`, node artifacts, and OS system files.
