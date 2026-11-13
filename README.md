# JAGAN A. — Cinematic Portfolio

A responsive, dark futuristic personal portfolio built with HTML, CSS and vanilla JavaScript. GSAP is used as progressive enhancement for scroll and entrance motion. The page remains readable if the animation CDN is unavailable.

## What's new — the heroic layer
- `heroic.js` + `heroic.css` sit on top of the original design (nothing else was rewritten).
- **Hero:** lightning strikes the ground, a lime light ignites behind Jagan's head and volumetric god-rays burst around him (WebGL), the title slams in line by line, then an anamorphic flare. The rays follow the cursor.
- **Hold to power up:** press and hold anywhere on the hero; release for a lightning burst + shockwave. Works on touch.
- **Section titles** slam in letter by letter, and a lime light-blade cuts across each section as it opens.
- **Project cards** tilt in 3D and a light sheen sweeps across on hover.
- **Contact:** Jagan's portrait with a lime rim light.
- Photos live in `assets/` (`jagan-hero.webp`, `jagan-profile.webp`) — swap them to change the pictures.

**Important:** the WebGL hero needs the site served over http(s) (GitHub Pages, Hostinger, or the local server below). Double-clicking `index.html` still works, but shows a simpler hero without the light rays.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. For a local server, run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Publish with GitHub Pages
1. Create a GitHub repository (for example `jagan-portfolio`).
2. Upload `index.html`, `style.css`, `script.js`, `heroic.css`, `heroic.js`, the `assets/` folder and this README.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Your site will be published at the GitHub Pages URL shown there.

## Personalise before publishing
Search and replace:
- `hello@jagana.in` with your real professional email (WhatsApp is already set).
- Add your LinkedIn, Instagram, Behance or YouTube links in the contact/footer area.
- Replace the four CSS-generated project covers with real project thumbnails or embedded video links.
- Add project descriptions, client permissions and final deliverables.
- Confirm education dates and job title wording before publishing.

## Current content
- Roles: Video Editor Head · Project Manager · HR at Brandstep Digital Marketing Agency (2024 – now). Education: B.A. English (2023), MBA (HR), completed.
- Journey: six steps from 2023 to now. The three middle steps (Editor Head, HR, PM) have no year label, so add years in `index.html` if you want them.
- Projects: 4 career-defining cards (heritage film, Zubi Candy, Meta lead campaigns, BRANDSTEP AI) with generated covers. To use a real still, add `style="--img:url(assets/your-image.jpg)"` to that card's `.cv` link.
- Contact: WhatsApp +91 70928 73429 (wa.me link with a pre-filled message). The email `hello@jagana.in` is still a placeholder.

## Notes
- Fonts and GSAP are loaded from CDNs, so internet access is needed for those enhancements.
- The project artwork is generated with CSS shapes and gradients as editable placeholders, not actual client work.
- No personal phone number, address or private contact information is exposed.
