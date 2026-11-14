#!/usr/bin/env python3
"""Builds the case-study pages in /work from tools/projects.json.

Edit tools/projects.json, then run:   python3 tools/build_pages.py
Each page is plain HTML, so small text fixes can also be made directly in work/*.html
(but they will be overwritten the next time this script runs).
"""
import json, html, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
P = json.loads((ROOT / "tools/projects.json").read_text(encoding="utf-8"))
SITE = "https://jaganjohn2810.github.io"
esc = html.escape

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{plain} — Case study | Jagan A.</title>
  <meta name="description" content="{intro}">
  <meta name="author" content="Jagan A.">
  <meta name="theme-color" content="#08090a">
  <link rel="canonical" href="{site}/work/{slug}.html">
  <meta property="og:type" content="article">
  <meta property="og:title" content="{plain} — Jagan A.">
  <meta property="og:description" content="{intro}">
  <meta property="og:url" content="{site}/work/{slug}.html">
  <meta property="og:image" content="{site}/assets/img/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../assets/img/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="../assets/img/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/site.css">
</head>
<body style="--acc:{acc}">
  <a class="skip" href="#main">Skip to content</a>
  <div class="grain" aria-hidden="true"></div>
  <div class="curtain" aria-hidden="true"></div>
  <header class="site-header">
    <a class="logo" href="../index.html" aria-label="Jagan A. — home">
      <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M30 54 L43 10 L56 54 M35.5 38 H50.5"/><path class="j" d="M8 10 H28 V40 Q28 54 16 54 Q7 54 6 45"/></svg>
      <span>JAGAN A.</span>
    </a>
    <nav class="site-nav" id="site-menu" aria-label="Main">
      <a href="../index.html#work">Work</a>
      <a href="../index.html#about">About</a>
      <a href="../index.html#capabilities">Capabilities</a>
      <a href="../index.html#leadership">Leadership</a>
      <a href="../index.html#journey">Journey</a>
      <a href="../index.html#contact">Contact</a>
    </nav>
    <a class="btn btn-solid header-cta" href="../index.html#contact">Let’s talk <i>↗</i></a>
    <button class="menu-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="site-menu"><span></span><span></span></button>
  </header>
"""

FOOT = """  <footer class="site-footer wrap" style="margin-top:0;padding-bottom:40px">
    <span class="mono">© <span data-year>2026</span> Jagan A. — Creator × Manager</span>
    <a class="mono" href="../index.html#work">All projects</a>
    <a class="mono" href="../index.html#contact">Contact</a>
  </footer>
  <script src="../assets/js/config.js"></script>
  <script src="../assets/js/site.js" defer></script>
</body>
</html>
"""

def slot(kind, label):
    cls = f"slot {kind}".strip()
    wide = " wide" if kind == "wide" else ""
    return (f'<div class="{cls}{wide}" role="img" aria-label="Placeholder: {esc(label)}">'
            f'<div><span class="mono">Placeholder — asset to be added</span><b>{esc(label)}</b></div></div>')

for i, p in enumerate(P):
    nxt = P[(i + 1) % len(P)]
    out = [HEAD.format(plain=esc(p["plain"]), intro=esc(p["intro"]), slug=p["slug"], site=SITE, acc=p["acc"])]
    meta = "".join(f'<div><span class="mono">{esc(k)}</span><b>{esc(v)}</b></div>' for k, v in p["meta"])
    out.append(f"""  <main id="main">
    <section class="cs-hero wrap">
      <div class="art" style="--acc:{p['acc']};--deep:{p['deep']}" aria-hidden="true">{p['art']}</div>
      <a class="cs-back mono" href="../index.html#work">← All projects</a>
      <p class="eyebrow mono">Project {p['num']} / {esc(p['category'])}</p>
      <h1 class="cs-title slam">{p['title']}</h1>
      <p class="cs-intro reveal">{esc(p['intro'])}</p>
      <div class="cs-meta reveal">{meta}</div>
    </section>

    <div class="cs-body wrap">
      <nav class="cs-toc mono" aria-label="On this page">
        <a href="#overview">Overview</a><a href="#objective">Objective</a><a href="#role">My role</a><a href="#approach">Creative approach</a>
        <a href="#tools">Tools</a><a href="#process">Process</a><a href="#output">Final output</a>{'<a href="#results">Results</a>' if p['results'] else ''}
      </nav>
      <div>
        <section class="cs-block reveal" id="overview"><h2>Overview</h2>{''.join(f'<p>{esc(x)}</p>' for x in p['overview'])}</section>
        <section class="cs-block reveal" id="objective"><h2>Objective</h2><p>{esc(p['objective'])}</p></section>
        <section class="cs-block reveal" id="role"><h2>My role</h2><ul class="tick">{''.join(f'<li>{esc(x)}</li>' for x in p['role'])}</ul></section>
        <section class="cs-block reveal" id="approach"><h2>Creative approach</h2>{''.join(f'<p>{esc(x)}</p>' for x in p['approach'])}
          <p class="mono" style="margin-top:26px">Highlights</p><div class="chips" style="margin-top:12px">{''.join(f'<span>{esc(x)}</span>' for x in p['highlights'])}</div></section>
        <section class="cs-block reveal" id="tools"><h2>Tools & technologies</h2><div class="chips">{''.join(f'<span>{esc(x)}</span>' for x in p['tools'])}</div></section>
        <section class="cs-block reveal" id="process"><h2>Production process</h2><ol class="process" style="list-style:none;margin:0;padding:0">{''.join(f'<li><b>{esc(a)}</b><span>{esc(b)}</span></li>' for a, b in p['process'])}</ol></section>
        <section class="cs-block reveal" id="output"><h2>Final output</h2>
          <div class="media">{''.join(slot(k, l) for k, l in p['media'])}</div>
          <p class="note">Images and videos for this project will be added here. Placeholders are clearly marked until the real assets are supplied.</p></section>
        {f'<section class="cs-block reveal" id="results"><h2>Results</h2><p>{esc(p["results"])}</p></section>' if p['results'] else ''}
      </div>
    </div>

    <a class="next" href="{nxt['slug']}.html" data-cursor="Next">
      <span class="mono">Next project — {nxt['num']}</span>
      <h2>{esc(nxt['plain'])} →</h2>
    </a>
  </main>
""")
    out.append(FOOT)
    (ROOT / "work" / f"{p['slug']}.html").write_text("".join(out), encoding="utf-8")

# sitemap
urls = [f"{SITE}/"] + [f"{SITE}/work/{p['slug']}.html" for p in P]
(ROOT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join(f"  <url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n", encoding="utf-8")
print("built", len(P), "case studies")
