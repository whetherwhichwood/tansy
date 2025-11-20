# Baby App Deployment Guide for SiteJet/cPanel

## Overview
This guide will help you deploy your Pregnancy Companion PWA to your live website using SiteJet and cPanel through Namecheap.

## Prerequisites
- Access to your cPanel hosting account
- SiteJet website builder access
- All app files ready for upload

## Step 1: Prepare Your Files

### Files to Upload
Upload ALL files from your Baby App folder to your website's public_html directory:

**Core Files:**
- `index.html` (main entry point)
- `app.html` (main app interface)
- `login.html`, `home.html`, `journal.html`, `progress.html`, `tips.html`, `sneakpeek.html`
- `styles.css`
- `manifest.json`

**JavaScript Files:**
- `app.js`, `landing.js`, `login.js`, `home.js`, `journal.js`, `progress.js`, `tips.js`, `sneakpeek.js`
- `authManager.js`, `userManager.js`, `babyData.js`, `fruitImages.js`
- `languageManager.js`, `languageToggle.js`, `journalManager.js`
- `service-worker.js`

**Assets:**
- `favicon.svg`, `favicon.html`
- `icons/` folder (with favicon.png)
- `images/` folder (with fruits subfolder)
- `.htaccess` (for proper routing and caching)

## Step 2: Upload via cPanel File Manager

1. **Login to cPanel**
   - Go to your Namecheap account
   - Access cPanel from your hosting dashboard

2. **Navigate to File Manager**
   - Find and click "File Manager" in cPanel
   - Navigate to `public_html` directory

3. **Upload Files**
   - Create a new folder called `baby-app` (optional, for organization)
   - Upload all files maintaining the folder structure
   - Ensure `index.html` is in the root of public_html or in your chosen subfolder

## Step 3: Configure SiteJet Integration

### Option A: Embed as iframe (Recommended)
1. **In SiteJet Editor:**
   - Add a "Custom HTML" or "Embed" element
   - Use this code:
   ```html
   <div style="width: 100%; height: 600px; border: none;">
       <iframe 
           src="https://yourdomain.com/baby-app/" 
           width="100%" 
           height="600px" 
           frameborder="0"
           allow="geolocation; microphone; camera"
           style="border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
       </iframe>
   </div>
   ```

### Option B: Direct Integration
1. **Create a new page in SiteJet**
2. **Add custom HTML section**
3. **Copy the content from your `index.html`**
4. **Update all relative paths to be absolute**

## Step 4: Configure HTTPS and Security

1. **Enable HTTPS** (if not already enabled)
   - In cPanel, go to "SSL/TLS"
   - Enable "Force HTTPS Redirect"

2. **Update Service Worker** (if needed)
   - The service worker should work automatically
   - If issues occur, check browser console for errors

## Step 5: Test Your Deployment

1. **Test the main URL:**
   - Visit `https://yourdomain.com/baby-app/`
   - Check if the app loads correctly

2. **Test PWA features:**
   - Try installing the app on mobile
   - Test offline functionality
   - Verify all pages work correctly

3. **Test in SiteJet:**
   - Preview your SiteJet page
   - Ensure the iframe loads properly
   - Test responsive design

## Step 6: Optional Optimizations

### Performance
- The `.htaccess` file includes compression and caching
- Images are optimized for web delivery
- Service worker provides offline functionality

### Customization
- Update `manifest.json` with your domain
- Modify colors in `styles.css` to match your site
- Update app name in HTML files if desired

## Troubleshooting

### Common Issues:

1. **App not loading:**
   - Check file permissions (should be 644 for files, 755 for folders)
   - Verify all files uploaded correctly
   - Check browser console for errors

2. **Service Worker issues:**
   - Ensure HTTPS is enabled
   - Check that service-worker.js is accessible
   - Clear browser cache

3. **Iframe not working:**
   - Check if your hosting allows iframes
   - Verify the URL is correct
   - Try opening the app directly first

4. **Styling issues:**
   - Ensure `styles.css` uploaded correctly
   - Check for CSS conflicts with SiteJet styles
   - Use browser dev tools to debug

## File Structure After Upload
```
public_html/
├── baby-app/ (or root)
│   ├── index.html
│   ├── app.html
│   ├── styles.css
│   ├── manifest.json
│   ├── service-worker.js
│   ├── .htaccess
│   ├── icons/
│   ├── images/
│   └── [all JS files]
```

## Support
If you encounter issues:
1. Check browser console for errors
2. Verify all files are uploaded
3. Test the app directly (not in iframe) first
4. Contact Namecheap support for hosting issues

Your Pregnancy Companion app should now be live and accessible through your SiteJet website!

