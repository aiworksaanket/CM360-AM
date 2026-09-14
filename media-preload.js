/* Warm every slide image and video on first open so next/prev is not waiting on media. */
(function () {
  const CACHE = 'cm360-media-v1';
  const IMAGES = [
    'backslide1final.png',
    'backslide2.png',
    'backslide3.png',
    'backipadfinal.png',
    'newbackforslide8.png',
    'attributionback.jpg',
    'thankyouback.png',
    'assets/stridewear-hero.jpg',
    'assets/stridewear-product.png',
    'assets/stridewear-ads.jpg',
    'assets/acceline-hero.jpg',
    'assets/ig1-avatar.png',
    'assets/ig2-avatar.png',
    'assets/ig3-avatar.png',
    'assets/ig4-avatar.png',
    'assets/ig1-photo.png',
    'assets/ig2-photo.png',
    'assets/ig3-photo.png',
    'assets/ig4-photo.png',
    'assets/tik1-avatar.png',
    'assets/tik2-avatar.png',
    'assets/stridewear-avatar.png',
    'assets/yt-thum.png',
    'assets/yt-hike.png',
    'assets/yt-day.png',
    'assets/yt-av-hike.png',
    'assets/yt-av-day.png'
  ];
  const VIDEOS = [
    'assets/tik1.mp4',
    'assets/tik2.mp4',
    'assets/tickadvid.mp4',
    'assets/ytvideoad.mp4'
  ];
  const blobs = Object.create(null);
  window.CM360Media = blobs;

  function abs(url) {
    return new URL(url, location.href).href;
  }

  function mark(text, done) {
    const el = document.getElementById('media-warm');
    if (!el) return;
    if (done) {
      el.hidden = true;
      el.textContent = '';
      return;
    }
    el.hidden = false;
    el.textContent = text;
  }

  function pool() {
    let el = document.getElementById('media-warm-pool');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'media-warm-pool';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
  }

  async function openCache() {
    if (!('caches' in window)) return null;
    try { return await caches.open(CACHE); } catch { return null; }
  }

  async function fetchOne(url) {
    const cache = await openCache();
    const key = abs(url);
    if (cache) {
      const hit = await cache.match(key) || await cache.match(url);
      if (hit && hit.ok) return hit;
    }
    const res = await fetch(url, { cache: 'force-cache' });
    if (cache && res.ok) {
      try { await cache.put(key, res.clone()); } catch {}
    }
    return res;
  }

  async function toBlob(url, res) {
    if (!res || !res.ok) return;
    const blob = await res.blob();
    if (blobs[url]) URL.revokeObjectURL(blobs[url]);
    blobs[url] = URL.createObjectURL(blob);
  }

  function decodeImage(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.decoding = 'async';
      const done = () => resolve();
      img.onload = () => {
        if (img.decode) img.decode().then(done, done);
        else done();
      };
      img.onerror = done;
      img.src = blobs[url] || url;
    });
  }

  function keepVideo(url) {
    return new Promise(resolve => {
      const v = document.createElement('video');
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.setAttribute('playsinline', '');
      v.setAttribute('muted', '');
      v.src = blobs[url] || url;
      const done = () => {
        v.removeEventListener('canplaythrough', done);
        v.removeEventListener('loadeddata', done);
        v.removeEventListener('error', done);
        resolve();
      };
      v.addEventListener('canplaythrough', done, { once: true });
      v.addEventListener('loadeddata', done, { once: true });
      v.addEventListener('error', done, { once: true });
      setTimeout(done, 40000);
      pool().appendChild(v);
      v.load();
    });
  }

  async function mapPool(items, limit, fn) {
    const q = items.slice();
    await Promise.all(Array.from({ length: Math.min(limit, q.length) }, async () => {
      while (q.length) {
        const item = q.shift();
        try { await fn(item); } catch {}
      }
    }));
  }

  function applyBlobs() {
    document.querySelectorAll('img[src], video[src]').forEach(el => {
      const src = el.getAttribute('src');
      if (src && blobs[src] && el.src !== blobs[src]) el.src = blobs[src];
    });
    window.dispatchEvent(new CustomEvent('cm360-media-ready', { detail: blobs }));
  }

  async function warm() {
    mark('Saving media…');
    if ('serviceWorker' in navigator) {
      try { await navigator.serviceWorker.register('./sw.js'); } catch {}
    }
    await mapPool(IMAGES, 6, async url => {
      await toBlob(url, await fetchOne(url));
      await decodeImage(url);
    });
    applyBlobs();
    await mapPool(VIDEOS, 2, async url => {
      await toBlob(url, await fetchOne(url));
      await keepVideo(url);
    });
    applyBlobs();
    mark('', true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', warm);
  else warm();
})();
