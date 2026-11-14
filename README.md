# JAGAN A. — Creator × Manager

Personal portfolio of Jagan A.: Video Editor Head, HR and Project Manager at Brandstep Digital Marketing Agency, and AI filmmaker.

Live site: **https://jaganjohn2810.github.io**

Plain HTML, CSS and JavaScript. There is no build step for the main site, so GitHub Pages serves the files as they are.

## Files

```
index.html                  Home: hero, works, about, capabilities, leadership, journey, contact
work/*.html                 Five project case studies (generated, see below)
assets/css/site.css         All styles (colours and fonts are at the top)
assets/js/config.js         ← CONTACT LINKS: the one file to edit for email / LinkedIn / Instagram
assets/js/site.js           Navigation, smooth scroll, cursor, reveals, horizontal gallery, journey line
assets/js/hero.js           WebGL hero: light rays, lightning, hold-to-power-up (home page only)
assets/img/                 Photos, favicon PNGs, share image (og-image.jpg)
favicon.svg, 404.html, robots.txt, sitemap.xml
tools/projects.json         Case-study text (edit this)
tools/build_pages.py        Rebuilds work/*.html and sitemap.xml from projects.json
```

## Common updates

**Add your email, LinkedIn or Instagram:** open `assets/js/config.js` and fill in the empty value. Links left empty stay hidden.

**Add a project cover image** (home page gallery):
1. Put the image in `assets/img/`, for example `assets/img/venthondiyar-cover.jpg` (about 1600px wide, JPG or WebP).
2. In `index.html`, find that project's `<div class="work-art art" style="...">` and add `--img:url(assets/img/venthondiyar-cover.jpg)` inside the `style`.

**Add images or videos to a case study:** open `work/<project>.html`, find the box marked "Placeholder — asset to be added", and put an image or video inside the `slot` div:
`<img src="../assets/img/your-image.jpg" alt="Describe the image">` or `<video src="../assets/video/clip.mp4" controls playsinline></video>`.
For long videos, upload them to YouTube or Vimeo and embed or link them instead of committing large files.

**Change case-study text:** edit `tools/projects.json`, then run `python3 tools/build_pages.py`. This rewrites every file in `work/`, including any manual edits.

**Change the journey, capabilities or about text:** edit `index.html` directly.

## Deploying to GitHub Pages

The repository `jaganjohn2810/jaganjohn2810.github.io` publishes from the `main` branch, root folder (Settings → Pages). Any commit to `main` goes live about a minute later.

- **On the website:** open the file on github.com, click the pencil icon, edit, then **Commit changes**. To add images, use **Add file → Upload files** in the right folder.
- **With git:** `git add -A && git commit -m "Update" && git push`

## Content rules

No client names, results, awards or statistics are published unless Jagan has confirmed them. Missing assets are shown as clearly labelled placeholders.
