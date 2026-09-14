(function (global) {
  const COLORS = ['#155eef', '#3b82f6', '#1d4ed8', '#60a5fa', '#2563eb', '#10182b', '#ffffff', '#93c5fd', '#bfdbfe', '#e8c572', '#fbbf24', '#f59e0b'];
  const EMOJI = ['🎉', '🎊', '✨', '⭐', '💫', '🌟'];
  const SPARK = ['✦', '✧', '+', '✶'];
  const STARS = ['★', '✶', '✦', '✧'];

  let root = null;
  let burstLayer = null;
  let timers = [];
  let bits = [];
  let raf = 0;
  let open = false;
  let running = false;

  function reduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function rand(min, max) { return min + Math.random() * (max - min); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function later(ms, fn) { const id = setTimeout(fn, ms); timers.push(id); return id; }

  function count() {
    const w = window.innerWidth;
    if (w < 700) return 120;
    if (w < 1100) return 200;
    return 280;
  }

  function stopLoop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    running = false;
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function clearBits() {
    stopLoop();
    bits.forEach(p => p.el.remove());
    bits = [];
    if (burstLayer) burstLayer.replaceChildren();
  }

  function originFrom(opts) {
    if (opts && opts.origin) return opts.origin;
    return { x: window.innerWidth / 2, y: window.innerHeight * 0.42 };
  }

  function spawn(kind, origin) {
    const el = document.createElement('span');
    const type = kind || pick(['confetti', 'confetti', 'geo', 'geo', 'spark', 'star', 'emoji']);
    const color = pick(COLORS);
    el.setAttribute('aria-hidden', 'true');

    let cls = 'celeb-bit ';
    let speed = rand(14, 28);
    let g = 0.18;
    let drag = 0.987;
    let spin = rand(-18, 18);
    let life = rand(2400, 4200);
    let scale = 1;

    if (type === 'confetti') {
      cls += Math.random() > 0.45 ? 'is-ribbon' : 'is-sq';
      el.style.background = color;
      el.style.width = (Math.random() > 0.45 ? rand(3, 6) : rand(6, 12)) + 'px';
      el.style.height = (cls.indexOf('ribbon') > -1 ? rand(12, 24) : rand(5, 10)) + 'px';
      speed = rand(16, 32);
      g = rand(0.22, 0.36);
      spin = rand(-32, 32);
      life = rand(2600, 4400);
    } else if (type === 'spark') {
      cls += 'is-spark';
      el.textContent = pick(SPARK);
      el.style.color = color;
      el.style.fontSize = rand(10, 18) + 'px';
      speed = rand(12, 24);
      g = 0.04;
      life = rand(1000, 1800);
      scale = rand(0.8, 1.45);
    } else if (type === 'star') {
      cls += 'is-star';
      el.textContent = pick(STARS);
      el.style.color = color;
      el.style.fontSize = rand(11, 22) + 'px';
      speed = rand(14, 26);
      g = 0.08;
      life = rand(1200, 2200);
    } else if (type === 'emoji') {
      cls += 'is-emoji';
      el.textContent = pick(EMOJI);
      el.style.fontSize = rand(16, 28) + 'px';
      speed = rand(16, 32);
      g = rand(0.12, 0.22);
      spin = rand(-16, 16);
      life = rand(2800, 4600);
    } else {
      cls += Math.random() > 0.35 ? 'is-dot' : 'is-tri';
      if (cls.indexOf('dot') > -1) {
        el.style.background = color;
        const s = rand(4, 11);
        el.style.width = s + 'px';
        el.style.height = s + 'px';
      } else {
        el.style.borderBottomColor = color;
      }
      speed = rand(18, 34);
      g = rand(0.08, 0.18);
      spin = rand(-36, 36);
      life = rand(2200, 3600);
    }

    el.className = cls;
    el.style.left = origin.x + 'px';
    el.style.top = origin.y + 'px';
    el.style.opacity = '1';
    el.style.transform = 'translate3d(0,0,0)';
    burstLayer.appendChild(el);

    const up = Math.random() < 0.74;
    const ang = up ? rand(-Math.PI * 0.98, -0.08) : rand(0.15, Math.PI - 0.15);
    bits.push({
      el, x: rand(-5, 5), y: rand(-5, 5),
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      g, drag, spin, rot: rand(0, 360),
      age: 0, life, scale, blink: type === 'spark' || type === 'star'
    });
  }

  function loop(t) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    if (!loop.last) loop.last = t;
    const dt = Math.min(32, t - loop.last) / 16.67;
    loop.last = t;
    let alive = false;
    for (let i = 0; i < bits.length; i++) {
      const p = bits[i];
      if (p.dead) continue;
      alive = true;
      p.age += dt * 16.67;
      p.vx *= Math.pow(p.drag, dt);
      p.vy = p.vy * Math.pow(p.drag, dt) + p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
      const left = 1 - p.age / p.life;
      if (left <= 0) {
        p.dead = true;
        p.el.remove();
        continue;
      }
      let op = left < 0.22 ? left / 0.22 : 1;
      if (p.blink) op *= 0.55 + Math.abs(Math.sin(p.age / 90)) * 0.45;
      p.el.style.transform = 'translate3d(' + p.x + 'px,' + p.y + 'px,0) rotate(' + p.rot + 'deg) scale(' + p.scale + ')';
      p.el.style.opacity = String(op);
    }
    if (!alive) {
      stopLoop();
      open = false;
      if (root) root.hidden = true;
    }
  }

  function spray(origin, n) {
    for (let i = 0; i < n; i++) {
      const roll = Math.random();
      const kind = roll < 0.4 ? 'confetti' : roll < 0.62 ? 'geo' : roll < 0.8 ? 'spark' : roll < 0.91 ? 'star' : 'emoji';
      spawn(kind, origin);
    }
  }

  function burst(origin) {
    if (reduced()) return;
    const n = count();
    spray(origin, n);
    later(70, () => spray(origin, Math.round(n * 0.7)));
    later(150, () => spray(origin, Math.round(n * 0.45)));
    later(240, () => {
      for (let i = 0; i < Math.round(n * 0.25); i++) spawn('spark', origin);
    });
    loop.last = 0;
    running = true;
    raf = requestAnimationFrame(loop);
    later(4800, () => {
      clearBits();
      open = false;
      if (root) root.hidden = true;
    });
  }

  function ensure() {
    if (root) return;
    root = document.createElement('div');
    root.className = 'celeb-root';
    root.hidden = true;
    root.innerHTML = '<div class="celeb-burst" data-celeb-burst></div><span class="celeb-flash" data-flash></span>';
    document.body.appendChild(root);
    burstLayer = root.querySelector('[data-celeb-burst]');
  }

  function openCeleb(opts) {
    ensure();
    if (open) close(true);
    clearTimers();
    clearBits();
    root.hidden = false;
    open = true;
    const origin = originFrom(opts);
    const flash = root.querySelector('[data-flash]');
    if (flash) {
      flash.style.left = origin.x + 'px';
      flash.style.top = origin.y + 'px';
      flash.classList.remove('is-on');
      void flash.offsetWidth;
      flash.classList.add('is-on');
    }
    if (reduced()) {
      later(200, close);
      return;
    }
    burst(origin);
  }

  function close() {
    open = false;
    clearTimers();
    clearBits();
    if (root) root.hidden = true;
  }

  global.Celebrate = { open: openCeleb, close };
})(window);
