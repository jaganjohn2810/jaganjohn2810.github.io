(() => {
  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', e => {
    if (glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
  });
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav nav');
  toggle?.addEventListener('click', () => nav.classList.toggle('open'));
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  // Lightweight generative particle field; no framework required.
  const canvas = document.getElementById('particle-field');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [], raf;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({length: Math.min(85, Math.floor(w / 13))}, () => ({
        x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.4+.3,
        vx:(Math.random()-.5)*.18, vy:(Math.random()-.5)*.18, a:Math.random()*.5+.12
      }));
    };
    const draw = () => {
      ctx.clearRect(0,0,w,h);
      particles.forEach((p,i) => {
        p.x += p.vx; p.y += p.vy;
        if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(199,255,85,${p.a})`; ctx.fill();
        for(let j=i+1;j<particles.length;j++){
          const q=particles[j], dx=p.x-q.x, dy=p.y-q.y, d=Math.hypot(dx,dy);
          if(d<105){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(102,230,220,${.075*(1-d/105)})`;ctx.lineWidth=.6;ctx.stroke();}
        }
      });
      raf=requestAnimationFrame(draw);
    };
    resize(); draw(); window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else draw();});
  }

  // GSAP is progressive enhancement: the page remains fully readable without it.
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    // hero entrance is handled by heroic.js (lightning strike + title slam)
    gsap.utils.toArray('.reveal').forEach((el, i) => {
      if (el.closest('.hero')) return;
      gsap.fromTo(el, {y: 28, opacity: 0}, {
        y: 0, opacity: 1, duration: .85, ease: 'power2.out',
        scrollTrigger: {trigger: el, start: 'top 88%', once: true}
      });
    });
    gsap.utils.toArray('.project-visual').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r=el.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        gsap.to(el, { '--mx': x*12+'px', '--my': y*12+'px', duration:.35 });
      });
    });
  }
})();