# Deployment Instructions

## GitHub Repository Setup

1. **Create the GitHub repository:**
   - Go to https://github.com/new
   - Repository name: `tansy`
   - Owner: `whetherwhichwood`
   - Description: "Tansy app wireframe with before/after improvements"
   - Choose Public or Private
   - Do NOT initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Push your code to GitHub:**
   ```bash
   git remote add origin https://github.com/whetherwhichwood/tansy.git
   git branch -M main
   git push -u origin main
   ```

## Vercel Deployment

1. **Connect to Vercel:**
   - Go to https://vercel.com
   - Sign in with your GitHub account (`whetherwhichwood`)
   - Click "Add New Project"
   - Import the `tansy` repository

2. **Configure the project:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - Your app will be available at `https://tansy-*.vercel.app`

4. **Environment Variables (if needed):**
   - If you add any environment variables later, add them in Vercel project settings

## Post-Deployment

- Vercel will automatically deploy on every push to the `main` branch
- Preview deployments are created for pull requests
- You can customize the domain in Vercel project settings

