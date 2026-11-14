/* =====================================================================
   JAGAN A. — hero engine (WebGL god-rays, lightning, hold-to-power-up)
   Runs only on the home page. Starts after the intro loader finishes.
   ===================================================================== */
(() => {
  const $ = s => document.querySelector(s);
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  const lerp = (a,b,t)=>a+(b-a)*t;
  const DPR = Math.min(window.devicePixelRatio||1, 2);
  const narrow = () => innerWidth <= 800;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const mouse = {x:0,y:0,sx:0,sy:0};
  addEventListener('pointermove', e=>{ mouse.x=e.clientX/innerWidth*2-1; mouse.y=e.clientY/innerHeight*2-1; });
  /* ---------------- hero ---------------- */
  const sec = $('.hero'), cv = $('#heroGL'), fx = $('#heroFX');
  const lines = [...document.querySelectorAll('.hero-title .title-line')];
  const showUI = () => { lines.forEach(l=>l.classList.add('slam')); document.body.classList.add('h-ui'); };
  const fallback = () => { document.body.classList.add('nogl'); setTimeout(showUI, 200); };
  if (!sec || !cv) return;
  const g2 = fx.getContext('2d');
  const gl = cv.getContext('webgl',{antialias:false,premultipliedAlpha:false,alpha:false});
  if (!gl || reduce) { fallback(); return; }

  const VS='attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  const HEAD='precision highp float;varying vec2 v;';
  const PERSON=`uniform sampler2D uP;uniform vec4 uPR;
    vec4 P(vec2 uv){vec2 q=(uv-uPR.xy)/uPR.zw;if(q.x<0.||q.y<0.||q.x>1.||q.y>1.)return vec4(0.);return texture2D(uP,q);}`;
  // lime core, cyan haze — the page's own palette
  const FS_OCC=HEAD+PERSON+`uniform vec2 uL;uniform float uI,uAsp,uT;
    void main(){vec2 d=v-uL;d.x*=uAsp;float r=length(d);float a=atan(d.y,d.x);
      float sh=.22+.78*pow(abs(sin(a*7.+uT*.12))*abs(sin(a*11.-uT*.09+1.3))*abs(sin(a*3.+2.1)),.35);
      vec3 c=(vec3(.62,1.,.3)*exp(-r*r*30.)*1.1+vec3(.3,.9,.85)*exp(-r*r*9.)*.35+vec3(.95,1.,.85)*exp(-r*r*260.)*1.6)*uI*sh;
      c*=1.-P(v).a;gl_FragColor=vec4(c,1.);}`;
  const FS_RAY=HEAD+`uniform sampler2D uO;uniform vec2 uL;uniform float uDen;
    void main(){vec2 uv=v;vec2 dt=(v-uL)*(uDen/72.);vec3 acc=vec3(0.);float w=1.;
      for(int i=0;i<72;i++){uv-=dt;acc+=texture2D(uO,uv).rgb*w;w*=.968;}
      gl_FragColor=vec4(acc/24.,1.);}`;
  const FS_COMP=HEAD+PERSON+`uniform sampler2D uR;uniform vec2 uL,uShake,uRes;uniform float uI,uT,uAsp,uFlash,uFlare,uCharge;uniform vec3 uShock;
    float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
    void main(){vec2 uv=v+uShake;
      vec2 sd=uv-uShock.xy;sd.x*=uAsp;float sr=length(sd);
      float ring=uShock.z>0.?exp(-pow((sr-uShock.z)*12.,2.))*(1.-clamp(uShock.z/1.8,0.,1.)):0.;
      uv-=normalize(sd+1e-5)*vec2(1./uAsp,1.)*ring*.03;
      vec2 d=uv-uL;d.x*=uAsp;float r=length(d);
      vec3 c=vec3(.035,.043,.051)+vec3(.12,.32,.3)*exp(-r*2.6)*.22*uI;
      c+=vec3(.35,.6,.2)*exp(-pow(uv.y*7.,2.))*exp(-pow((uv.x-uL.x)*uAsp*1.6,2.))*.18*uI;
      vec4 p=P(uv);
      vec2 tl=normalize(uL-uv+1e-5)*vec2(1./uAsp,1.)*.0055;
      float rim=clamp(p.a-P(uv+tl).a,0.,1.)+clamp(p.a-P(uv+tl*2.).a,0.,1.)*.5;
      vec3 pc=p.rgb*(.4+.14*uI+.22*uCharge)+rim*vec3(.75,1.,.45)*(1.+uI*.8);
      c=mix(c,pc,p.a);
      c+=texture2D(uR,uv).rgb*(1.-p.a*.93)*.8;
      float fy=abs(uv.y-uL.y),fxx=abs(uv.x-uL.x);
      c+=(vec3(.35,.9,.85)*exp(-fy*120.)*exp(-fxx*2.)+vec3(.95,1.,.9)*exp(-fy*420.)*exp(-fxx*4.5))*uFlare*(1.-p.a*.9);
      c+=ring*vec3(.7,1.,.5)*.6+uFlash*vec3(.95,1.,.92);
      vec2 vv=v-.5;c*=1.-dot(vv,vv)*.9;
      c=1.-exp(-c*1.5);c=pow(c,vec3(1.1));
      c+=(hash(v*uRes+fract(uT))-.5)*.04;
      gl_FragColor=vec4(c,1.);}`;

  function prog(fs){ const p=gl.createProgram();
    for (const [t,src] of [[gl.VERTEX_SHADER,VS],[gl.FRAGMENT_SHADER,fs]]){ const s=gl.createShader(t); gl.shaderSource(s,src); gl.compileShader(s);
      if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s)); gl.attachShader(p,s); }
    gl.bindAttribLocation(p,0,'p'); gl.linkProgram(p);
    const u={}, n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);
    for(let i=0;i<n;i++){ const a=gl.getActiveUniform(p,i); u[a.name]=gl.getUniformLocation(p,a.name); }
    return {p,u}; }
  const P_OCC=prog(FS_OCC), P_RAY=prog(FS_RAY), P_COMP=prog(FS_COMP);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  const tex=()=>{ const t=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,t);
    [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]].forEach(([k,v])=>gl.texParameteri(gl.TEXTURE_2D,k,v));
    return t; };
  const tPerson=tex(); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
  const fbs=[0,1].map(()=>({t:tex(),f:gl.createFramebuffer(),w:0,h:0}));
  const sizeFB=(fb,w,h)=>{ if(fb.w===w&&fb.h===h) return; fb.w=w; fb.h=h; gl.bindTexture(gl.TEXTURE_2D,fb.t);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
    gl.bindFramebuffer(gl.FRAMEBUFFER,fb.f); gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,fb.t,0); };

  const img = new Image(); let ready=false;
  img.onload = ()=>{ try { gl.bindTexture(gl.TEXTURE_2D,tPerson); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img); ready=true; }
                     catch(e){ fallback(); } };   // opening index.html straight from disk blocks WebGL images: show the plain version
  img.onerror = fallback;
  img.src = 'assets/img/jagan-hero.webp';

  /* effects state */
  const embers=Array.from({length:120},()=>({x:Math.random(),y:Math.random(),v:.015+Math.random()*.05,s:Math.random()*1.5+.3,p:Math.random()*7}));
  let dust=[], bolts=[], shake=0, flash=0, shockR=0, shockOn=false, flare=0, charge=0, charging=false, release=0;
  const impact=(x,y,k)=>{ shake=Math.max(shake,.9*k); flash=Math.max(flash,.1*k);
    for(let i=0;i<40*k;i++){ const a=Math.PI+Math.random()*Math.PI;
      dust.push({x,y,vx:Math.cos(a)*(2+Math.random()*7)*DPR,vy:Math.sin(a)*(1+Math.random()*4)*DPR,life:1,s:(Math.random()*2+.6)*DPR}); } };
  function bolt(x0,y0,x1,y1,depth){ let pts=[[x0,y0],[x1,y1]], off=Math.hypot(x1-x0,y1-y0)*.22;
    for(let k=0;k<7;k++){ const n=[pts[0]]; for(let i=0;i<pts.length-1;i++){ const [ax,ay]=pts[i],[bx,by]=pts[i+1];
      n.push([(ax+bx)/2+(Math.random()-.5)*off,(ay+by)/2+(Math.random()-.5)*off*.4],[bx,by]); } pts=n; off*=.52; }
    bolts.push({pts,life:1,w:depth?1:2.2});
    if(!depth) for(let b=0;b<3;b++){ const [bx,by]=pts[Math.floor(pts.length*(.25+Math.random()*.5))];
      bolt(bx,by,bx+(Math.random()-.5)*300*DPR,by+(80+Math.random()*200)*DPR,1); } }
  function strike(n,Lx,W,H){ for(let i=0;i<n;i++){ const side=i%2?1:-1, gx=clamp(Lx+side*W*(.1+Math.random()*.16),W*.04,W*.98);
      bolt(gx+(Math.random()-.5)*W*.12,-10,gx,H*(.9+Math.random()*.06),0); impact(gx,H*.95,.5); }
    flash=Math.max(flash,.8); shake=Math.max(shake,1.3); shockR=.001; shockOn=true; }

  const pfg=$('#powerFg'), ptxt=$('#powerTxt');
  let t0=null, last=0, tNow=0, struck=false, uiOn=false, slammed=0;
  sec.addEventListener('pointerdown',e=>{ if(e.button===0 && uiOn) charging=true; });
  addEventListener('pointerup',()=>{ if(charging){ charging=false; if(charge>.12) release=charge; } });

  function frame(now){
    requestAnimationFrame(frame);
    mouse.sx=lerp(mouse.sx,mouse.x,.06); mouse.sy=lerp(mouse.sy,mouse.y,.06);
    if (!ready) return;
    const r=sec.getBoundingClientRect(); if (r.bottom<0 || r.top>innerHeight) { last=now; return; }
    if (t0===null){ if (!window.__introDone) { last=now; return; } t0=now; last=now; }
    const t=tNow=(now-t0)/1000, dt=Math.min(.05,(now-last)/1000); last=now;
    const W=Math.round(cv.clientWidth*DPR), H=Math.round(cv.clientHeight*DPR);
    if (cv.width!==W||cv.height!==H){ cv.width=fx.width=W; cv.height=fx.height=H; }
    const asp=W/H;
    // Jagan stands on the right, where the orb used to float
    const ph = narrow()? .42 : .8, pw = ph*(img.naturalWidth/img.naturalHeight)/asp;
    const PR = narrow() ? [ .5-pw/2, .47, pw, ph ]      // phones: portrait in the top half, copy below
                       : [ 1-pw-.03, 0, pw, ph ];
    const L=[PR[0]+pw*.50+mouse.sx*.04, PR[1]+ph*.84-mouse.sy*.03];    // behind his head (measured from the cutout)

    // choreography
    if (t>.35 && !struck){ struck=true; strike(2,L[0]*W,W,H); }
    lines.forEach((l,i)=>{ if (slammed<=i && t>1.15+i*.28){ slammed=i+1; l.classList.add('slam');
      setTimeout(()=>{ const b=l.getBoundingClientRect(), cr=cv.getBoundingClientRect();
        impact((b.left-cr.left+b.width*.3)*DPR,(b.bottom-cr.top)*DPR,.6); }, 260); } });
    let base = t>.4 ? 1+1.3*Math.exp(-(t-.4)*2.4) : 0;
    base *= 1+Math.sin(t*1.7)*.05+Math.sin(t*4.3)*.02;
    charge = charging? Math.min(1,charge+dt*.7) : Math.max(0,charge-dt*1.5);
    if (release){ strike(2+Math.round(release*4),L[0]*W,W,H); flash=.3+release*.5; shake=1+release*2;
      const Lx=L[0]*W, Ly=(1-L[1])*H;
      for(let i=0;i<110*release;i++){ const a=Math.random()*7, sp=(4+Math.random()*12)*DPR; dust.push({x:Lx,y:Ly,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1,s:(Math.random()*2+.6)*DPR}); }
      release=0; }
    const I=base+charge*2.2;
    flare=lerp(flare,(t>2.2?.3+1.1*Math.exp(-(t-2.2)*3):0)+charge*.7,.2);
    if (t>2.4 && !uiOn){ uiOn=true; showUI(); }
    if (pfg) pfg.style.strokeDashoffset=113*(1-charge);
    if (ptxt) ptxt.textContent = charge>.98?'RELEASE':charging?'CHARGING…':'HOLD TO POWER UP';
    if (shockOn){ shockR+=dt*1.15; if(shockR>1.8){ shockOn=false; shockR=0; } }
    shake*=Math.pow(.02,dt); flash*=Math.pow(.0005,dt);
    const shk=(shake+charge*.35)*.006, SX=(Math.random()-.5)*shk, SY=(Math.random()-.5)*shk;
    sec.style.setProperty('--shx',(SX*W/DPR).toFixed(1)+'px'); sec.style.setProperty('--shy',(-SY*H/DPR).toFixed(1)+'px');

    // GL
    const hw=Math.max(1,W>>1), hh=Math.max(1,H>>1); sizeFB(fbs[0],hw,hh); sizeFB(fbs[1],hw,hh);
    gl.bindFramebuffer(gl.FRAMEBUFFER,fbs[0].f); gl.viewport(0,0,hw,hh); gl.useProgram(P_OCC.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,tPerson); gl.uniform1i(P_OCC.u.uP,0);
    gl.uniform4f(P_OCC.u.uPR,...PR); gl.uniform2f(P_OCC.u.uL,...L); gl.uniform1f(P_OCC.u.uI,I); gl.uniform1f(P_OCC.u.uAsp,asp); gl.uniform1f(P_OCC.u.uT,t);
    gl.drawArrays(gl.TRIANGLES,0,3);
    gl.bindFramebuffer(gl.FRAMEBUFFER,fbs[1].f); gl.useProgram(P_RAY.p);
    gl.bindTexture(gl.TEXTURE_2D,fbs[0].t); gl.uniform1i(P_RAY.u.uO,0); gl.uniform2f(P_RAY.u.uL,...L); gl.uniform1f(P_RAY.u.uDen,.92+charge*.06);
    gl.drawArrays(gl.TRIANGLES,0,3);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null); gl.viewport(0,0,W,H); gl.useProgram(P_COMP.p);
    const U=P_COMP.u;
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,tPerson); gl.uniform1i(U.uP,0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D,fbs[1].t); gl.uniform1i(U.uR,1);
    gl.uniform4f(U.uPR,...PR); gl.uniform2f(U.uL,...L); gl.uniform2f(U.uShake,SX,SY); gl.uniform2f(U.uRes,W,H);
    gl.uniform1f(U.uI,I); gl.uniform1f(U.uT,t); gl.uniform1f(U.uAsp,asp); gl.uniform1f(U.uFlash,Math.min(flash,1));
    gl.uniform1f(U.uFlare,flare); gl.uniform1f(U.uCharge,charge); gl.uniform3f(U.uShock,L[0],L[1],shockOn?shockR:0);
    gl.drawArrays(gl.TRIANGLES,0,3);

    // 2D effects
    g2.setTransform(1,0,0,1,SX*W,-SY*H); g2.clearRect(-W,-H,W*3,H*3); g2.globalCompositeOperation='lighter';
    const vis=t>.4?1:0, Ly=1-L[1];
    for(const e of embers){
      if(charge>.02){ const dx=L[0]-e.x, dy=Ly-e.y; e.x+=dx*charge*.02+dy*charge*.01; e.y+=dy*charge*.02-dx*charge*.01; }
      e.y-=e.v*dt*.35*(1+charge*3); e.x+=Math.sin(t+e.p)*.0003;
      if(e.y<-.02||(charge>.05&&Math.hypot(L[0]-e.x,Ly-e.y)<.02)){ e.y=1.02; e.x=Math.random(); }
      const a=(.2+.8*Math.abs(Math.sin(t*1.4+e.p)))*vis*(.45+charge);
      g2.fillStyle=`rgba(${200-charge*60|0},255,${110+charge*80|0},${a*.7})`; g2.beginPath(); g2.arc(e.x*W,e.y*H,e.s*DPR,0,7); g2.fill(); }
    dust=dust.filter(d=>(d.life-=dt*.9)>0);
    for(const d of dust){ d.x+=d.vx; d.y+=d.vy; d.vx*=.95; d.vy=d.vy*.95+.04*DPR;
      g2.fillStyle=`rgba(225,255,190,${d.life*.75})`; g2.beginPath(); g2.arc(d.x,d.y,d.s,0,7); g2.fill(); }
    bolts=bolts.filter(b=>(b.life-=dt*3.2)>0);
    for(const b of bolts){ const fl=b.life*(.6+.4*Math.random()); g2.lineJoin=g2.lineCap='round';
      for(const [w,c] of [[10*b.w,`rgba(102,230,220,${fl*.22})`],[4*b.w,`rgba(199,255,85,${fl*.55})`],[1.4*b.w,`rgba(250,255,240,${fl})`]]){
        g2.lineWidth=w*DPR*.6; g2.strokeStyle=c; g2.beginPath(); g2.moveTo(...b.pts[0]); for(const p of b.pts) g2.lineTo(...p); g2.stroke(); } }
  }
  requestAnimationFrame(frame);
})();
