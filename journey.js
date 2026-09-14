/* Interactive CM360 customer journey — iPad simulations (local only). */
(function () {
  const IMG = {
    hero: 'assets/stridewear-hero.jpg',
    product: 'assets/stridewear-product.png',
    ads: 'assets/stridewear-ads.jpg',
    tik1: 'assets/tik1.mp4',
    tik2: 'assets/tik2.mp4',
    tikAd: 'assets/tickadvid.mp4',
    ytAd: 'assets/ytvideoad.mp4',
    ytThum: 'assets/yt-thum.png',
    ytHike: 'assets/yt-hike.png',
    ytDay: 'assets/yt-day.png',
    ytAvHike: 'assets/yt-av-hike.png',
    ytAvDay: 'assets/yt-av-day.png',
    tik1av: 'assets/tik1-avatar.png',
    tik2av: 'assets/tik2-avatar.png',
    swav: 'assets/stridewear-avatar.png',
    ig1: 'assets/ig1-photo.png',
    ig2: 'assets/ig2-photo.png',
    ig3: 'assets/ig3-photo.png',
    ig4: 'assets/ig4-photo.png',
    av1: 'assets/ig1-avatar.png',
    av2: 'assets/ig2-avatar.png',
    av3: 'assets/ig3-avatar.png',
    av4: 'assets/ig4-avatar.png'
  };

  const PRODUCT = {
    brand: 'StrideWear',
    name: 'StrideWear ProRun',
    tagline: 'Run Further. Live Better.',
    headline: 'Built for a Brighter Tomorrow',
    price: '₹8,999',
    mrp: '₹12,999',
    offer: '₹4,999',
    offerWas: '₹8,999',
    offerOff: '44% off',
    benefits: ['Lightweight', 'Cushioned', 'Durable']
  };

  const STEPS = [
    { id: 'display', name: 'Display' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'tiktok', name: 'TikTok' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'purchase', name: 'Purchase' }
  ];

  const COPY = {
    3: {
      kicker: 'Touchpoint 01',
      headline: ['Display', 'Impression'],
      body: 'Aritra sees the running-shoes advertisement while reading the news but does not interact with it.',
      noteTitle: 'Display ad was served as an impression.',
      noteBody: 'No click occurred.',
      hint: 'Scroll the news page to find the ad'
    },
    4: {
      kicker: 'Touchpoint 02',
      headline: ['Instagram'],
      body: 'Aritra taps the sponsored StrideWear post and lands on the advertiser website. He looks, then leaves without buying.',
      noteTitle: 'Social ad was clicked and the advertiser site was visited.',
      noteBody: 'No purchase occurred.',
      hint: 'Scroll, then click the sponsored ad'
    },
    5: {
      kicker: 'Touchpoint 03',
      headline: ['TikTok'],
      body: 'Aritra clicked the ad, visited the advertiser website and added the shoes to his cart, but did not complete the purchase.',
      noteTitle: 'TikTok ad was clicked. The product was added to cart.',
      noteBody: 'Purchase did not occur.',
      hint: 'Use the arrows on the iPad to browse videos. Tap the StrideWear ad to visit the website.'
    },
    6: {
      kicker: 'Touchpoint 04',
      headline: ['YouTube'],
      body: 'Aritra saw the YouTube pre-roll but did not click it. Later, he directly visited the advertiser website and completed the purchase.',
      noteTitle: 'This is the final conversion.',
      noteBody: 'View, then a direct visit — not an ad click.',
      hint: 'Watch the ad, then open a new tab.'
    }
  };

  const store = { size: '9', cart: 0, purchased: false, ytView: 'home', ytAdStarted: false, ytAdDone: false, ytShopOpen: false, ytHomeScroll: 0, igScroll: 0, ttScroll: 0, ttIndex: 0 };
  const gate = { 3: { needed: 'seen', done: false, explained: false },
    4: { needed: 'clicked', done: false, explained: false },
    5: { needed: 'carted', done: false, explained: false },
    6: { needed: 'purchased', done: false, explained: false } };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return [...(root || document).querySelectorAll(sel)]; }

  function leftRail(activeIdx) {
    return `<div class="jny-brand">CM360 Attribution Models</div>
      <p class="jny-lede">One customer.<br>Multiple touchpoints.<br>One purchase.</p>
      <ol class="jny-steps">${STEPS.map((s, i) => {
        const state = i < activeIdx ? 'is-done' : (i === activeIdx ? 'is-now' : '');
        return `<li class="${state}"><span>${String(i + 1).padStart(2, '0')}</span>${s.name}</li>`;
      }).join('')}</ol>`;
  }

  function rightPanel(scene, explained) {
    const c = COPY[scene];
    const title = (c.headline || []).map((line, i) => i ? `<span>${line}</span>` : line).join('');
    return `<div class="jny-count">0${scene - 2} / 05</div>
      <div class="jny-kicker">${c.kicker}</div>
      <h2 class="jny-title">${title}</h2>
      <p class="jny-body">${explained ? c.body : 'Explore the experience inside the iPad.<br>The explanation stays outside.'}</p>
      <p class="jny-note ${explained ? 'is-on' : ''}"><strong>${c.noteTitle}</strong><span>${c.noteBody}</span></p>
      ${explained ? '' : `<p class="jny-hint" data-hint><i aria-hidden="true"></i>${c.hint}</p>`}
      <p class="jny-press">Press <b>→</b> to continue</p>`;
  }

  function browserBar(url, tabs) {
    const list = tabs || [{ id: 'main', label: url.split('/')[0], on: true }];
    const tabHtml = list.map(t =>
      `<button type="button" class="jb-tab ${t.on ? 'is-on' : ''}" data-tab="${t.id}">${t.label}</button>`).join('');
    return `<div class="ipad-status"><span>9:41</span><span>Tue 12 Nov</span><span>100%</span></div>
      <div class="jb">
      <div class="jb-tabs${list.length > 1 ? ' is-multi' : ''}">${tabHtml}</div>
      <div class="jb-row">
        <button type="button" class="jb-nav" data-back title="Back">‹</button>
        <button type="button" class="jb-nav" data-fwd title="Forward">›</button>
        <div class="jb-url">🔒 ${url}</div>
        <button type="button" class="jb-new" data-newtab title="New tab">+</button>
      </div>
    </div>`;
  }

  function productHTML(mode, opts) {
    const sizes = ['7', '8', '9', '10', '11'];
    const buy = mode === 'buy';
    const deal = !!(opts && opts.offer);
    const price = deal ? PRODUCT.offer : PRODUCT.price;
    const was = deal ? PRODUCT.offerWas : PRODUCT.mrp;
    const off = deal ? PRODUCT.offerOff : '31% off';
    const thumbs = [
      { src: IMG.product, pos: 'center' },
      { src: IMG.ads, pos: '18% 18%' },
      { src: IMG.ads, pos: '82% 18%' },
      { src: IMG.ads, pos: '82% 82%' }
    ];
    return `<div class="sw ipad-scroll" data-product>
      <header class="sw-top">
        <div class="sw-brand"><b>▲ StrideWear</b><small>Move a brighter tomorrow</small></div>
        <nav class="sw-nav" aria-label="StrideWear">
          <span>Men</span><span>Women</span><span>Running</span><span>New Arrivals</span><span>Sustainability</span>
        </nav>
        <div class="sw-tools">
          <span class="sw-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m16 16 3.4 3.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span>
          <em data-cartcount>Cart (${store.cart})</em>
          <span class="sw-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span>
        </div>
      </header>
      <p class="sw-crumb">Home / Running / ${PRODUCT.name}</p>
      <div class="sw-hero"><img data-sw-main src="${IMG.product}" alt="${PRODUCT.name}"></div>
      <div class="sw-thumbs">${thumbs.map((t, i) =>
        `<button type="button" class="sw-thumb ${i === 0 ? 'is-on' : ''}" data-sw-thumb data-sw-src="${t.src}" data-sw-pos="${t.pos}" aria-label="View image ${i + 1}">
          <img src="${t.src}" alt="" style="object-position:${t.pos}">
        </button>`
      ).join('')}</div>
      <h3>${PRODUCT.name}</h3>
      <p class="sw-tag">${PRODUCT.tagline}</p>
      <p class="sw-rate"><span aria-hidden="true">★★★★☆</span> 4.6 · 2,184 reviews</p>
      <p class="sw-price"><b>${price}</b> <s>${was}</s> <i>${off}</i></p>
      <p class="sw-ship">Free delivery tomorrow · 7-day returns</p>
      <p class="sw-label">Size</p>
      <div class="sw-sizes">${sizes.map(s => `<button type="button" class="sw-sz ${store.size === s ? 'is-on' : ''}" data-size="${s}">${s}</button>`).join('')}</div>
      <div class="sw-actions">
        <button type="button" class="sw-btn ghost" data-addtocart>Add to Cart</button>
        ${buy ? `<button type="button" class="sw-btn" data-buynow>Buy Now</button>` : ''}
      </div>
      <div class="sw-checkout" hidden>
        <h4>Checkout</h4>
        <p>Deliver to Mumbai 400001 · UPI / Card</p>
        <button type="button" class="sw-btn" data-pay>Place order · ${price}</button>
      </div>
      <div class="sw-done" hidden>
        <h4>Order Confirmed</h4>
        <p>Order #SW-48219 · ${PRODUCT.name} · Size ${store.size}</p>
        <p>Paid ${price}. Arriving tomorrow.</p>
      </div>
      <section class="sw-details">
        <h4>Product details</h4>
        <p>${PRODUCT.headline}. ${PRODUCT.benefits.join(' · ')}.</p>
      </section>
    </div>`;
  }

  function toiHTML() {
    return `<div class="toi ipad-scroll">
      <header class="toi-head">
        <div class="toi-util"><span>☰</span><strong>THE TIMES OF INDIA</strong><em>Subscribe</em></div>
        <nav>Home · India · World · Business · Sports · Entertainment · Lifestyle · Tech · Videos · City</nav>
      </header>
      <article class="toi-story">
        <p class="toi-cats"><span>Business</span><span>Technology</span></p>
        <h1>Acceline Digital bags the deal for media advertisements for all big brands on ChatGPT AI platform</h1>
        <p class="toi-dek">The partnership will enable global brands to reach millions of users through native, AI-powered advertising experiences on OpenAI’s ChatGPT platform.</p>
        <p class="toi-byline">By TOI Business Desk | Mumbai | 12 Nov 2024, 11:30 AM IST</p>
        <figure class="toi-hero">
          <img src="assets/acceline-hero.jpg" alt="Acceline Digital and ChatGPT partnership visual">
        </figure>
        <p>Mumbai: Acceline Digital, a leading global digital marketing and media solutions company, has announced a landmark partnership to manage media advertisements for major global brands on OpenAI’s ChatGPT platform.</p>
        <p>The collaboration will enable brands to engage with consumers through relevant, conversational and context-aware advertising, unlocking a new era of AI-driven brand experiences.</p>
        <p>Industry executives said the arrangement is designed to keep brand messages inside the flow of a conversation, rather than interrupting it. The focus, according to people familiar with the plan, is relevance and timing rather than volume.</p>
        <p>The company said the first campaigns would be rolled out with a small group of global advertisers before a wider expansion. Financial terms of the partnership were not disclosed.</p>
        <div class="toi-keys">
          <b>Key Highlights</b>
          <ul>
            <li>Acceline Digital to manage media advertisements for global brands on ChatGPT</li>
            <li>First-of-its-kind partnership in the AI advertising space</li>
            <li>Focus on contextual, non-intrusive and relevant brand experiences</li>
            <li>Aims to set a new benchmark for AI-powered marketing</li>
          </ul>
        </div>
        <blockquote>
          <p>“This partnership is a defining moment for the future of digital advertising. We are excited to help brands connect with audiences in more meaningful and intelligent ways through AI.”</p>
          <cite>Rajiv Mehta<br>Founder &amp; CEO, Acceline Digital</cite>
        </blockquote>
      </article>
      <div class="toi-sec"><span>Related stories</span></div>
      <div class="toi-related">
        <article><em>Technology</em><h4>AI is reshaping the future of advertising: What it means for brands</h4></article>
        <article><em>Business</em><h4>Indian firms lead global digital transformation</h4></article>
        <article><em>India</em><h4>Government to promote AI adoption across key sectors</h4></article>
      </div>
      <div class="toi-bottom">
        <div class="toi-bottom-news">
          <article><h4>Five easy weekday dinners for busy households</h4><time>5 min read</time></article>
          <article><h4>How offices are redesigning wellness rooms</h4><time>4 min read</time></article>
          <article><h4>Photographers capture the city's early runners</h4><time>3 min read</time></article>
          <article><h4>What coaches want beginners to know before 10K</h4><time>6 min read</time></article>
        </div>
        <aside class="toi-ad" data-display-ad>
          <span class="adflag">Advertisement</span>
          <div class="swad-logo"><i>▲</i>StrideWear</div>
          <p class="swad-name">${PRODUCT.name}</p>
          <h5>Run Further.<br>Live Better.</h5>
          <img src="${IMG.hero}" alt="StrideWear display advertisement">
          <p class="swad-line">${PRODUCT.headline}</p>
          <p class="swad-price"><b>${PRODUCT.price}</b> <s>${PRODUCT.mrp}</s></p>
          <ul><li>Lightweight</li><li>Cushioned</li><li>Durable</li></ul>
          <span class="shop">Shop Now →</span>
        </aside>
      </div>
    </div>`;
  }

  const IGICO = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.1 20.55S4 15.2 4 9.85A4.35 4.35 0 0 1 8.4 5.5c1.5 0 2.55.7 3.7 2.05C13.25 6.2 14.3 5.5 15.8 5.5A4.35 4.35 0 0 1 20.2 9.85c0 5.35-8.1 10.7-8.1 10.7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7.2L4 21.2V11.5A7.5 7.5 0 0 1 11.5 4h1A7.5 7.5 0 0 1 20 11.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.5 3.5 10.8 13.2M21.5 3.5l-7.2 17-3.5-7.3L3.5 9.7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/></svg>',
    save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.4L6 20V5.5a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/></svg>',
    activity: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.1 20.55S4 15.2 4 9.85A4.35 4.35 0 0 1 8.4 5.5c1.5 0 2.55.7 3.7 2.05C13.25 6.2 14.3 5.5 15.8 5.5A4.35 4.35 0 0 1 20.2 9.85c0 5.35-8.1 10.7-8.1 10.7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    inbox: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.4 4.2 2.8 11.3l8.2 1.6 1.6 8.3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 11.2 12 4.8l7.5 6.4V19a1 1 0 0 1-1 1h-4.2v-5.2H9.7V20H5.5a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m16 16 3.4 3.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.4" y="4.4" width="15.2" height="15.2" rx="4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 8.4v7.2M8.4 12h7.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    reels: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.2" y="4.2" width="15.6" height="15.6" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 8.2h3.2L8.4 12H12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="m14.4 10.2 3.2 2-3.2 2z" fill="currentColor"/></svg>'
  };

  function igActs() {
    return `<div class="ig-acts">
      <div>
        <button type="button" class="ig-ico" data-ig-like aria-label="Like">${IGICO.heart}</button>
        <button type="button" class="ig-ico" data-ig-comment aria-label="Comment">${IGICO.comment}</button>
        <button type="button" class="ig-ico" data-ig-share aria-label="Share">${IGICO.share}</button>
      </div>
      <button type="button" class="ig-ico" data-ig-save aria-label="Save">${IGICO.save}</button>
    </div>`;
  }

  function igPost({ user, av, loc, img, alt, likes, caption, tags, comments, time }) {
    const note = comments.map(c => `<p class="ig-cmt"><b>${c.user}</b> ${c.text}</p>`).join('');
    return `<article class="ig-post">
      <header>
        <img class="ig-av" src="${av}" alt="">
        <div><b>${user}</b>${loc ? `<em>${loc}</em>` : ''}</div>
        <button type="button" class="ig-ico ig-more" aria-label="More">${IGICO.more}</button>
      </header>
      <img class="ig-media" src="${img}" alt="${alt}">
      ${igActs()}
      <p class="ig-likes">${likes} likes</p>
      <p class="ig-cap"><b>${user}</b> ${caption}${tags ? `<span> ${tags}</span>` : ''}</p>
      <p class="ig-morec">View all comments</p>
      ${note}
      <time>${time}</time>
    </article>`;
  }

  function igHTML() {
    const stories = [
      ['Your story', IMG.av4, 'you'],
      ['arjun', IMG.av3, ''],
      ['rahul', IMG.av2, ''],
      ['rohan', IMG.av1, ''],
      ['vikram', IMG.av4, ''],
      ['aman', IMG.av2, '']
    ];
    return `<div class="ig">
      <header class="ig-top">
        <b>Instagram</b>
        <div class="ig-top-acts">
          <button type="button" class="ig-ico" aria-label="Notifications">${IGICO.activity}</button>
          <button type="button" class="ig-ico" aria-label="Messages">${IGICO.inbox}</button>
        </div>
      </header>
      <div class="ig-feed ipad-scroll">
        <div class="ig-stories">${stories.map(([n, src, extra]) =>
          `<div class="ig-story ${extra}"><img src="${src}" alt=""><em>${n}</em></div>`
        ).join('')}</div>
        ${igPost({
          user: 'rohan.kapoor', av: IMG.av1, loc: 'Manali, Himachal Pradesh',
          img: IMG.ig1, alt: 'Hiker overlooking a mountain lake in Manali',
          likes: '8,421',
          caption: 'Somewhere between the mountains and my thoughts… found a little more peace today.',
          tags: '#Manali #Mountains #TravelDiaries',
          comments: [
            { user: 'aditya.singh', text: 'Great shot.' },
            { user: 'neel.thakkar', text: 'Need to visit this place.' }
          ],
          time: '2 days ago'
        })}
        ${igPost({
          user: 'rahul.verma', av: IMG.av2, loc: 'Mumbai, Maharashtra',
          img: IMG.ig2, alt: 'Avocado toast and cappuccino at a Mumbai cafe',
          likes: '12,904',
          caption: 'Good food = good mood. Simple meals, happier days.',
          tags: '#BreakfastDiaries #MumbaiEats #CafeVibes',
          comments: [
            { user: 'priya.sharma', text: 'This looks amazing.' },
            { user: 'kushagra.raj', text: 'Where is this place?' }
          ],
          time: '1 day ago'
        })}
        ${igPost({
          user: 'arjun.mehta', av: IMG.av3, loc: 'Spiti Valley, Himachal Pradesh',
          img: IMG.ig3, alt: 'Sunrise over snow peaks in Spiti Valley',
          likes: '5,683',
          caption: 'Some places just feel like home.',
          tags: '#Himalayas #NatureLovers #Spiti',
          comments: [
            { user: 'rohan.desai', text: 'Unreal beauty.' }
          ],
          time: '1 day ago'
        })}
        <article class="ig-post ig-ad" data-ig-ad>
          <header>
            <span class="ig-av ig-av-brand" aria-hidden="true">▲</span>
            <div><b>stridewear</b><em>Sponsored</em></div>
            <button type="button" class="ig-ico ig-more" aria-label="More">${IGICO.more}</button>
          </header>
          <button type="button" class="ig-creative" data-ig-ad>
            <img src="${IMG.hero}" alt="StrideWear Instagram advertisement">
          </button>
          ${igActs()}
          <p class="ig-likes">9,247 likes</p>
          <p class="ig-cap"><b>stridewear</b> Built for a brighter tomorrow. Performance running shoes for every step of your journey. <span>#RunFurther #StrideWear</span></p>
          <p class="ig-morec">View all comments</p>
          <p class="ig-cmt"><b>aman.joshi</b> Need these for my morning run.</p>
          <p class="ig-cmt"><b>vikram.shah</b> Clean pair.</p>
          <time>5 hours ago</time>
          <button type="button" class="ig-shop" data-ig-ad>Shop Now</button>
        </article>
        ${igPost({
          user: 'vikram.shah', av: IMG.av4, loc: 'Bengaluru, Karnataka',
          img: IMG.ig4, alt: 'Athlete resting on a gym bench after a workout',
          likes: '14,926',
          caption: 'Consistency today, progress tomorrow.',
          tags: '#WorkoutMode #Discipline #FitnessJourney',
          comments: [
            { user: 'akash.mehta', text: 'Let’s go.' },
            { user: 'siddhant.kulkarni', text: 'Inspiration.' }
          ],
          time: '5 hours ago'
        })}
      </div>
      <nav class="ig-nav" aria-label="Instagram">
        <span class="is-on">${IGICO.home}</span>
        <span>${IGICO.search}</span>
        <span>${IGICO.plus}</span>
        <span>${IGICO.reels}</span>
        <img class="ig-av ig-nav-av" src="${IMG.av4}" alt="Profile">
      </nav>
    </div>`;
  }

  function ttHTML() {
    const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.1 21S3.8 15.2 3.8 9.7A4.5 4.5 0 0 1 8.4 5.2c1.6 0 2.7.7 3.7 2.1 1-1.4 2.1-2.1 3.7-2.1a4.5 4.5 0 0 1 4.6 4.5C20.4 15.2 12.1 21 12.1 21z" fill="currentColor"/></svg>';
    const chat = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.6A7.6 7.6 0 0 1 12.4 19H7.2L4 21.4V11.6A7.6 7.6 0 0 1 11.6 4h.8A7.6 7.6 0 0 1 20 11.6z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
    const share = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5v10.2M7.6 8.4 12 4.5l4.4 3.9M5.4 13.2v5.3A1.5 1.5 0 0 0 6.9 20h10.2a1.5 1.5 0 0 0 1.5-1.5v-5.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const save = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.6h10a1 1 0 0 1 1 1V20l-6-3.2L6 20V5.6a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
    const search = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    const home = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.4 11 12 4.6 19.6 11V19a1 1 0 0 1-1 1h-4.3v-5.4H9.7V20H5.4a1 1 0 0 1-1-1z" fill="currentColor"/></svg>';
    const friends = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8.4" r="3.1" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="16.2" cy="9.1" r="2.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.8 18.8c.5-3 2.6-4.7 5.2-4.7s4.7 1.7 5.2 4.7M14 14.6c1.8-.2 3.8 1 4.4 4.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
    const inbox = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.4 7.2 12 13l7.6-5.8M5.2 6h13.6A1.6 1.6 0 0 1 20.4 7.6v8.8a1.6 1.6 0 0 1-1.6 1.6H5.2a1.6 1.6 0 0 1-1.6-1.6V7.6A1.6 1.6 0 0 1 5.2 6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';

    const rail = (av, likes, comments, shares, saves, follow) => `
      <aside class="ttx-rail">
        <div class="ttx-avwrap">${follow ? '<button type="button" class="ttx-follow" aria-label="Follow">+</button>' : ''}
          <img class="ttx-av" src="${av}" alt="">
        </div>
        <button type="button" class="ttx-act" data-tt-like aria-label="Like">${heart}<em>${likes}</em></button>
        <button type="button" class="ttx-act" aria-label="Comment">${chat}<em>${comments}</em></button>
        <button type="button" class="ttx-act" aria-label="Share">${share}<em>${shares}</em></button>
        <button type="button" class="ttx-act" data-tt-save aria-label="Save">${save}<em>${saves}</em></button>
        <img class="ttx-disc" src="${av}" alt="">
      </aside>`;

    return `<div class="ttx">
      <header class="ttx-top">
        <span>Following</span>
        <b>For You</b>
        <button type="button" class="ttx-search" aria-label="Search">${search}</button>
      </header>
      <div class="ttx-feed">
        <div class="ttx-track">
        <section class="ttx-card">
          <video src="${IMG.tik1}" muted playsinline loop preload="auto" data-tt-max="6"></video>
          ${rail(IMG.tik1av, '28.4K', '412', '1,236', '892', true)}
          <div class="ttx-copy">
            <b>@fresh.harvest</b>
            <p>Village mornings hit different when breakfast joins the party.</p>
            <p class="ttx-tags">#ForYou #GoodVibes #VillageLife</p>
            <p class="ttx-sound">♫ original sound - fresh.harvest</p>
          </div>
        </section>
        <section class="ttx-card ttx-ad" data-tt-ad>
          <div class="ttx-ad-crop">
            <video src="${IMG.tikAd}" muted playsinline loop preload="auto" data-tt-max="10" data-tt-ad></video>
          </div>
          ${rail(IMG.swav, '9,247', '318', '1,082', '640', false)}
          <div class="ttx-copy">
            <b>StrideWear</b>
            <em>Sponsored</em>
            <p>Built for a brighter tomorrow.</p>
            <button type="button" class="ttx-shop" data-tt-ad>SHOP NOW</button>
          </div>
        </section>
        <section class="ttx-card">
          <video src="${IMG.tik2}" muted playsinline loop preload="auto" data-tt-max="6"></video>
          ${rail(IMG.tik2av, '54.1K', '2,104', '8,430', '3,112', true)}
          <div class="ttx-copy">
            <b>@aarti.studio</b>
            <p>Festival energy, full volume.</p>
            <p class="ttx-tags">#Festival #ForYou #Culture</p>
            <p class="ttx-sound">♫ original sound - aarti.studio</p>
          </div>
        </section>
        </div>
      </div>
      <div class="ttx-arrows">
        <button type="button" class="ttx-arrow" data-tt-prev aria-label="Previous video">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14.5 12 8l6 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button type="button" class="ttx-arrow" data-tt-next aria-label="Next video">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9.5 12 16l6-6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <nav class="ttx-nav" aria-label="TikTok">
        <span class="is-on">${home}<i>Home</i></span>
        <span>${friends}<i>Friends</i></span>
        <span class="ttx-plus" aria-hidden="true">+</span>
        <span>${inbox}<i>Inbox</i></span>
        <span><img src="${IMG.tik1av}" alt=""><i>Profile</i></span>
      </nav>
    </div>`;
  }

  function ytHomeHTML() {
    const search = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 3.4 3.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    const mic = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3.5" width="6" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 11.5a5 5 0 0 0 10 0M12 16.5V20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    const bell = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16.5h12l-1.2-2.1V10a4.8 4.8 0 1 0-9.6 0v4.4zM10 16.5a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
    const home = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.2 11.2 12 4.6l7.8 6.6V19a1 1 0 0 1-1 1h-4.4v-5.4H9.6V20H5.2a1 1 0 0 1-1-1z" fill="currentColor"/></svg>';
    const shorts = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3.2" width="10" height="17.6" rx="4.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m10.4 8.6 5 3.4-5 3.4z" fill="currentColor"/></svg>';
    const plus = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 8.6v6.8M8.6 12h6.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
    const subs = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.2" y="6" width="15.6" height="12.2" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 6V4.8h8V6" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m10.4 10.4 5 3.2-5 3.2z" fill="currentColor"/></svg>';
    const chips = ['All', 'Music', 'Running', 'Tech', 'iPhones', 'Trailers', 'Live', 'Gaming'];
    return `<div class="ytx">
      <header class="ytx-top">
        <span class="ytx-logo"><svg viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="5" fill="#ff0000"/><path d="M11.2 5.6v8.8l8-4.4z" fill="#fff"/></svg>YouTube</span>
        <div class="ytx-tools">
          <span class="ytx-ico" aria-label="Search">${search}</span>
          <span class="ytx-ico" aria-label="Voice search">${mic}</span>
          <span class="ytx-ico ytx-bell" aria-label="Notifications">${bell}<em></em></span>
          <span class="ytx-you" aria-label="You">S</span>
        </div>
      </header>
      <div class="ytx-chips">${chips.map((c, i) => `<span class="${i === 0 ? 'on' : ''}">${c}</span>`).join('')}</div>
      <div class="ytx-feed ipad-scroll">
        <button type="button" class="ytx-item" data-yt-play>
          <div class="ytx-thumb"><img src="${IMG.ytThum}" alt="iPhone 18 Pro Review"><i>10:15</i></div>
          <div class="ytx-meta">
            <span class="ytx-av ytx-av-ti">TI</span>
            <p><b>iPhone 18 Pro Review: A Real Upgrade?</b><em>Tech Insider · 1.2M views · 2 weeks ago</em></p>
            <span class="ytx-more" aria-hidden="true">⋮</span>
          </div>
        </button>
        <article class="ytx-item">
          <div class="ytx-thumb"><img src="${IMG.ytHike}" alt="Hiking in the Himalayas"></div>
          <div class="ytx-meta">
            <img class="ytx-av" src="${IMG.ytAvHike}" alt="">
            <p><b>Hiking in the Himalayas — A Journey Like No Other</b><em>Adventure Daily · 428K views · 3 weeks ago</em></p>
            <span class="ytx-more" aria-hidden="true">⋮</span>
          </div>
        </article>
        <article class="ytx-item">
          <div class="ytx-thumb"><img src="${IMG.ytDay}" alt="A Productive Day in My Life"><i class="is-hid">11:26</i></div>
          <div class="ytx-meta">
            <img class="ytx-av" src="${IMG.ytAvDay}" alt="">
            <p><b>A Productive Day in My Life | Work, Fitness, Focus</b><em>Better You · 360K views · 1 month ago</em></p>
            <span class="ytx-more" aria-hidden="true">⋮</span>
          </div>
        </article>
      </div>
      <nav class="ytx-nav" aria-label="YouTube">
        <span class="is-on">${home}<i>Home</i></span>
        <span>${shorts}<i>Shorts</i></span>
        <span class="ytx-create" aria-hidden="true">${plus}</span>
        <span>${subs}<i>Subscriptions</i></span>
        <span><em class="ytx-you">S</em><i>You</i></span>
      </nav>
    </div>`;
  }

  function ytPlayerHTML() {
    const like = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 21H4.4A1.4 1.4 0 0 1 3 19.6V11.2A1.4 1.4 0 0 1 4.4 9.8h2.8zm0 0 3.3-1.1h6.4a1.6 1.6 0 0 0 1.55-1.2l1.35-5.9A1.2 1.2 0 0 0 18.6 11h-5.1l.8-3.7a1.5 1.5 0 0 0-2.6-1.3L7.2 11.2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    const dislike = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.8 3h2.8A1.4 1.4 0 0 1 21 4.4v8.4a1.4 1.4 0 0 1-1.4 1.4h-2.8zm0 0L13.5 4.1H7.1A1.6 1.6 0 0 0 5.55 5.3L4.2 11.2A1.2 1.2 0 0 0 5.4 13h5.1l-.8 3.7a1.5 1.5 0 0 0 2.6 1.3L16.8 12.8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    const share = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.2 21 12l-7 3.8V13c-5.2.2-7.8 1.8-9.4 5 0-4.6 2.2-9.2 9.4-9.8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    const save = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.6h10a1 1 0 0 1 1 1V20l-6-3.2L6 20V5.6a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    return `<div class="ytp">
      <div class="ytp-stage">
        <div class="ytp-adcrop">
          <video src="${IMG.ytAd}" muted playsinline preload="auto" disablepictureinpicture data-yt-ad data-yt-max="6"></video>
        </div>
        <button type="button" class="ytp-play" data-yt-start aria-label="Play" hidden>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6L20 12z" fill="#fff"/></svg>
        </button>
        <div class="ytp-adui" data-yt-adui hidden>
          <span data-yt-adlabel>Sponsored · 0:01</span>
          <button type="button" class="ytp-skip" data-yt-skip hidden>Skip</button>
        </div>
        <div class="ytp-bar" data-yt-track hidden><i data-yt-bar></i></div>
      </div>
      <div class="ytp-rest ipad-scroll">
        <div class="ytp-info">
          <h4>iPhone 18 Pro Review: A Real Upgrade?</h4>
          <p>1.2M views · 2 weeks ago</p>
          <div class="ytp-chan">
            <span class="ytx-av ytx-av-ti">TI</span>
            <div><b>Tech Insider</b><em>4.8M subscribers</em></div>
            <span class="ytp-sub">Subscribe</span>
          </div>
          <div class="ytp-acts">
            <span>${like} 4.7K</span>
            <span>${dislike}</span>
            <span>${share} Share</span>
            <span>${save} Save</span>
          </div>
        </div>
        <div class="ytp-cmt"><b>Comments</b><span>1.8K</span></div>
        <p class="ytp-cmt-row"><b>rahul.verma</b> Anyone else waiting for the camera comparison?</p>
        <p class="ytp-cmt-row"><b>aarti.studio</b> Worth it if you're coming from a 14 Pro.</p>
        <p class="ytp-rec-label">Recommended</p>
        <article class="ytp-rec">
          <img src="${IMG.ytHike}" alt="">
          <p><b>Hiking in the Himalayas — A Journey Like No Other</b><em>Adventure Daily · 428K views</em></p>
        </article>
        <article class="ytp-rec">
          <img src="${IMG.ytDay}" alt="">
          <p><b>A Productive Day in My Life | Work, Fitness, Focus</b><em>Better You · 360K views</em></p>
        </article>
      </div>
    </div>`;
  }

  function bindProduct(root, opts = {}) {
    const { allowPurchase, onCart, onPurchase, celebrate } = opts;
    const main = $('[data-sw-main]', root);
    $$('[data-sw-thumb]', root).forEach(btn => btn.addEventListener('click', () => {
      if (!main) return;
      main.src = btn.dataset.swSrc;
      main.style.objectPosition = btn.dataset.swPos || 'center';
      $$('[data-sw-thumb]', root).forEach(b => b.classList.toggle('is-on', b === btn));
    }));
    $$('[data-size]', root).forEach(btn => btn.addEventListener('click', () => {
      store.size = btn.dataset.size;
      $$('[data-size]', root).forEach(b => b.classList.toggle('is-on', b === btn));
    }));
    const add = $('[data-addtocart]', root);
    if (add) add.addEventListener('click', () => {
      store.cart = 1;
      $$('[data-cartcount]', root).forEach(el => { el.textContent = 'Cart (1)'; });
      add.textContent = 'Added · Cart (1)';
      if (onCart) onCart();
    });
    const buy = $('[data-buynow]', root);
    const checkout = $('.sw-checkout', root);
    const done = $('.sw-done', root);
    if (buy && allowPurchase) buy.addEventListener('click', () => {
      if (store.cart < 1) { store.cart = 1; }
      if (checkout) checkout.hidden = false;
    });
    const pay = $('[data-pay]', root);
    if (pay) pay.addEventListener('click', () => {
      store.purchased = true;
      if (checkout) checkout.hidden = true;
      if (celebrate) {
        if (done) done.hidden = true;
      } else if (done) {
        done.hidden = false;
      }
      if (onPurchase) onPurchase();
      if (celebrate && window.Celebrate) {
        const r = pay.getBoundingClientRect();
        Celebrate.open({
          origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 }
        });
      }
    });
  }

  function activeIpadSlot() {
    return document.querySelector('.journey-scene.is-active .ipad-slot');
  }

  function pointerOver(el, e) {
    const r = el.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  }

  function scrollIpadBy(sc, dy) {
    const max = Math.max(0, sc.scrollHeight - sc.clientHeight);
    if (max <= 0) return false;
    const next = Math.min(max, Math.max(0, sc.scrollTop + dy));
    if (next === sc.scrollTop) return false;
    sc.scrollTop = next;
    sc.dispatchEvent(new Event('scroll'));
    return true;
  }

  let ttWheelLock = 0;
  let ttPage = null;

  function pageTikTok(deltaY) {
    if (!ttPage || !deltaY) return;
    const now = Date.now();
    if (now - ttWheelLock < 420) return;
    if (Math.abs(deltaY) < 10) return;
    ttWheelLock = now;
    ttPage(deltaY > 0 ? 1 : -1);
  }

  function installIpadScroll() {
    if (installIpadScroll.done) return;
    installIpadScroll.done = true;
    document.addEventListener('wheel', e => {
      const slot = activeIpadSlot();
      if (!slot || !pointerOver(slot, e)) return;
      if ($('.ttx', slot)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        pageTikTok(e.deltaY);
        return;
      }
      const sc = $('.ipad-scroll', slot);
      if (!sc) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      scrollIpadBy(sc, e.deltaY);
    }, { passive: false, capture: true });
  }

  function bindScroll(root) {
    installIpadScroll();
    $$('.ipad-scroll', root).forEach(sc => {
      sc.addEventListener('wheel', e => {
        e.preventDefault();
        e.stopPropagation();
        scrollIpadBy(sc, e.deltaY);
      }, { passive: false });
    });
  }

  function fadeHint(sceneEl) {
    const hint = $('[data-hint]', sceneEl);
    if (hint) hint.classList.add('is-gone');
  }

  function setExplained(sceneIdx, sceneEl) {
    gate[sceneIdx].explained = true;
    const right = $('.jny-right', sceneEl);
    if (right) right.innerHTML = rightPanel(sceneIdx, true);
  }

  function mountScene(sceneIdx) {
    const el = document.getElementById('scene-' + sceneIdx);
    if (!el) return;
    const step = sceneIdx === 6 ? 3 : sceneIdx - 3;
    const purchaseOn = sceneIdx === 6 && store.purchased;
    $('.jny-left', el).innerHTML = leftRail(purchaseOn ? 4 : step);
    $('.jny-right', el).innerHTML = rightPanel(sceneIdx, gate[sceneIdx].explained);
    const screen = $('.ipad-screen', el);
    const chrome = $('.ipad-chrome', el);

    if (sceneIdx === 3) {
      chrome.innerHTML = browserBar('timesofindia.example/business/acceline-digital-chatgpt-advertising');
      screen.innerHTML = toiHTML();
      const ad = $('[data-display-ad]', screen);
      const markSeen = () => { gate[3].done = true; fadeHint(el); };
      if (ad) {
        ad.addEventListener('click', e => e.preventDefault());
        const sc = $('.ipad-scroll', screen);
        if (sc) sc.addEventListener('scroll', () => {
          const r = ad.getBoundingClientRect();
          const sr = screen.getBoundingClientRect();
          if (r.top < sr.bottom && r.bottom > sr.top) markSeen();
        });
      }
    }

    if (sceneIdx === 4) {
      chrome.innerHTML = browserBar('instagram.com');
      screen.innerHTML = igHTML();
      const feed = $('.ig-feed', screen);
      if (feed && store.igScroll) feed.scrollTop = store.igScroll;
      const open = ev => {
        if (ev && ev.target.closest('[data-ig-like],[data-ig-save],[data-ig-comment],[data-ig-share],.ig-more')) return;
        if (feed) store.igScroll = feed.scrollTop;
        gate[4].done = true;
        fadeHint(el);
        chrome.innerHTML = browserBar('stridewear.com', [
          { id: 'ig', label: 'instagram.com' },
          { id: 'sw', label: 'stridewear.com', on: true }
        ]);
        screen.innerHTML = productHTML('browse');
        bindProduct(screen, { allowPurchase: false });
        bindScroll(screen);
        $('[data-back]', chrome)?.addEventListener('click', () => mountScene(4));
      };
      $$('[data-ig-ad]', screen).forEach(n => n.addEventListener('click', open));
    }

    if (sceneIdx === 5) {
      chrome.innerHTML = browserBar('tiktok.com');
      screen.innerHTML = ttHTML();
      bindTikTokFeed(screen);
      const open = ev => {
        if (ev && ev.target.closest('[data-tt-like],[data-tt-save],.ttx-act,.ttx-follow,.ttx-search,.ttx-arrow,[data-tt-prev],[data-tt-next]')) return;
        fadeHint(el);
        chrome.innerHTML = browserBar('stridewear.com');
        screen.innerHTML = productHTML('browse', { offer: true });
        bindProduct(screen, {
          allowPurchase: false,
          onCart: () => { gate[5].done = true; }
        });
        bindScroll(screen);
        $('[data-back]', chrome)?.addEventListener('click', () => mountScene(5));
      };
      $$('[data-tt-ad]', screen).forEach(n => n.addEventListener('click', open));
    }

    if (sceneIdx === 6) {
      const bindYtChrome = (active) => {
        const tabs = store.ytShopOpen
          ? [
              { id: 'yt', label: 'youtube.com', on: active === 'yt' },
              { id: 'sw', label: 'stridewear.com', on: active === 'sw' }
            ]
          : [{ id: 'yt', label: 'youtube.com', on: true }];
        chrome.innerHTML = browserBar(active === 'sw' ? 'stridewear.com' : 'youtube.com', tabs);
        $('[data-newtab]', chrome)?.addEventListener('click', openShop);
        $('[data-tab="yt"]', chrome)?.addEventListener('click', showYouTube);
        $('[data-tab="sw"]', chrome)?.addEventListener('click', openShop);
      };

      const showHome = () => {
        store.ytView = 'home';
        bindYtChrome('yt');
        screen.innerHTML = ytHomeHTML();
        const feed = $('.ytx-feed', screen);
        if (feed && store.ytHomeScroll) feed.scrollTop = store.ytHomeScroll;
        $('[data-yt-play]', screen)?.addEventListener('click', () => {
          if (feed) store.ytHomeScroll = feed.scrollTop;
          store.ytView = 'watch';
          store.ytAdStarted = false;
          showWatch(true);
        });
        bindScroll(screen);
      };

      const showWatch = (autoStart) => {
        store.ytView = 'watch';
        bindYtChrome('yt');
        screen.innerHTML = ytPlayerHTML();
        bindYtWatch(screen, {
          autoStart: !!autoStart,
          onPlay: () => fadeHint(el),
          onDone: () => fadeHint(el)
        });
        $('[data-back]', chrome)?.addEventListener('click', showHome);
        bindScroll(screen);
      };

      const showYouTube = () => {
        if (store.ytView === 'watch') showWatch();
        else showHome();
      };

      const openShop = () => {
        store.ytShopOpen = true;
        fadeHint(el);
        $('.jny-left', el).innerHTML = leftRail(4);
        bindYtChrome('sw');
        screen.innerHTML = productHTML('buy', { offer: true });
        bindProduct(screen, {
          allowPurchase: true,
          celebrate: true,
          onCart: () => { store.cart = 1; },
          onPurchase: () => {
            gate[6].done = true;
            $('.jny-left', el).innerHTML = leftRail(4);
          }
        });
        bindScroll(screen);
      };

      showYouTube();
    }

    bindScroll(el);
    bindIgChrome(el);
  }

  function bindTikTokFeed(root) {
    const feed = $('.ttx-feed', root);
    const track = $('.ttx-track', root);
    const cards = $$('.ttx-card', root);
    const videos = $$('video', root);
    const prev = $('[data-tt-prev]', root);
    const next = $('[data-tt-next]', root);
    if (!feed || !track || !cards.length) return;
    const last = cards.length - 1;
    const maxTime = v => Number(v.dataset.ttMax || 6);

    videos.forEach(v => {
      v.muted = true;
      v.addEventListener('timeupdate', () => {
        if (v.currentTime >= maxTime(v)) {
          v.currentTime = 0;
          v.play().catch(() => {});
        }
      });
    });

    const playIndex = () => {
      videos.forEach((v, i) => {
        if (i === store.ttIndex) {
          v.muted = true;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    };

    const go = (i) => {
      store.ttIndex = Math.max(0, Math.min(last, i));
      track.style.transform = 'translateY(-' + (store.ttIndex * 100) + '%)';
      if (prev) prev.disabled = store.ttIndex === 0;
      if (next) next.disabled = store.ttIndex === last;
      playIndex();
    };

    if (prev) prev.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); go(store.ttIndex - 1); });
    if (next) next.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); go(store.ttIndex + 1); });
    ttPage = step => go(store.ttIndex + step);

    go(store.ttIndex || 0);
  }

  function bindYtWatch(root, { autoStart, onPlay, onDone }) {
    const video = $('[data-yt-ad]', root);
    const play = $('[data-yt-start]', root);
    const adui = $('[data-yt-adui]', root);
    const skip = $('[data-yt-skip]', root);
    const track = $('[data-yt-track]', root);
    const bar = $('[data-yt-bar]', root);
    const label = $('[data-yt-adlabel]', root);
    const stage = $('.ytp-stage', root);
    if (!video) return;
    video.hidden = false;
    video.removeAttribute('hidden');
    const cap = () => {
      const hard = Number(video.dataset.ytMax || 6);
      const dur = video.duration;
      if (dur && isFinite(dur) && dur > 0) return Math.min(hard, dur);
      return hard;
    };
    let frozen = false;

    const stamp = t => {
      const sec = Math.max(1, Math.min(6, Math.ceil(t || 0.01)));
      if (label) label.textContent = 'Sponsored · 0:0' + sec;
      const max = cap();
      if (bar && max) bar.style.width = Math.min(100, (t / max) * 100) + '%';
    };

    const hidePlay = () => {
      if (!play) return;
      play.hidden = true;
      play.setAttribute('hidden', '');
      play.classList.add('is-off');
    };

    const showPlay = () => {
      if (!play || frozen || (video && !video.paused && !video.ended)) return;
      play.hidden = false;
      play.classList.remove('is-off');
    };

    const freeze = () => {
      if (frozen) return;
      frozen = true;
      store.ytAdDone = true;
      video.pause();
      hidePlay();
      video.hidden = false;
      if (adui) adui.hidden = false;
      if (track) track.hidden = false;
      if (skip) skip.hidden = false;
      stamp(cap());
      if (bar) bar.style.width = '100%';
      if (onDone) onDone();
    };

    const start = () => {
      if (frozen) return;
      store.ytAdStarted = true;
      hidePlay();
      video.hidden = false;
      if (adui) adui.hidden = false;
      if (track) track.hidden = false;
      video.muted = true;
      video.controls = false;
      video.playsInline = true;
      if (video.currentTime > 0.2 && video.currentTime < cap()) {
        /* resume */
      } else {
        video.currentTime = 0;
      }
      stamp(video.currentTime || 0.01);
      const go = video.play();
      if (go && go.catch) go.catch(() => {
        if (video.paused) showPlay();
        else hidePlay();
      });
      if (onPlay) onPlay();
    };

    video.addEventListener('timeupdate', () => {
      if (frozen) return;
      const t = video.currentTime;
      const max = cap();
      stamp(t);
      if (t >= 5 && skip) skip.hidden = false;
      if (t >= max - 0.05) freeze();
    });
    video.addEventListener('ended', freeze);
    video.addEventListener('playing', hidePlay);
    video.addEventListener('play', hidePlay);

    if (store.ytAdDone) {
      hidePlay();
      video.hidden = false;
      if (adui) adui.hidden = false;
      if (track) track.hidden = false;
      if (skip) skip.hidden = false;
      const apply = () => {
        const max = cap();
        video.currentTime = Math.min(max, video.duration || max);
        video.pause();
        stamp(max);
        if (bar) bar.style.width = '100%';
      };
      if (video.readyState >= 1) apply();
      else video.addEventListener('loadedmetadata', apply, { once: true });
      frozen = true;
    } else {
      if (play) play.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); start(); });
      if (stage) stage.addEventListener('click', e => {
        if (e.target.closest('[data-yt-skip]')) return;
        if (frozen || store.ytAdStarted) return;
        start();
      });
      if (autoStart || store.ytAdStarted) start();
    }
    if (skip) skip.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); freeze(); });
  }

  function bindIgChrome(root) {
    if (root.dataset.igBound) return;
    root.dataset.igBound = '1';
    root.addEventListener('click', e => {
      const like = e.target.closest('[data-ig-like],[data-tt-like]');
      if (like) {
        like.classList.toggle('is-on');
        return;
      }
      const save = e.target.closest('[data-ig-save],[data-tt-save]');
      if (save) save.classList.toggle('is-on');
    });
  }

  window.Journey = {
    reset() {
      store.cart = 0;
      store.purchased = false;
      store.size = '9';
      store.ytView = 'home';
      store.ytAdStarted = false;
      store.ytAdDone = false;
      store.ytShopOpen = false;
      store.ytHomeScroll = 0;
      store.igScroll = 0;
      store.ttScroll = 0;
      store.ttIndex = 0;
      Object.values(gate).forEach(g => { g.done = false; g.explained = false; });
    },
    play(sceneIdx) {
      if (sceneIdx === 3) {
        store.cart = 0;
        store.purchased = false;
        store.ytView = 'home';
        store.ytAdStarted = false;
        store.ytAdDone = false;
        store.ytShopOpen = false;
        store.ytHomeScroll = 0;
        store.igScroll = 0;
        store.ttScroll = 0;
        store.ttIndex = 0;
        Object.values(gate).forEach(g => { g.done = false; g.explained = false; });
      }
      mountScene(sceneIdx);
    },
    next(sceneIdx) {
      const g = gate[sceneIdx];
      if (!g) return 'pass';
      if (!g.explained) {
        if (sceneIdx === 3) {
          g.done = true;
          setExplained(sceneIdx, document.getElementById('scene-' + sceneIdx));
          return 'held';
        }
        if (!g.done) {
          const hint = $('[data-hint]', document.getElementById('scene-' + sceneIdx));
          if (hint) { hint.classList.remove('is-gone'); hint.classList.add('is-pulse'); }
          return 'held';
        }
        setExplained(sceneIdx, document.getElementById('scene-' + sceneIdx));
        return 'held';
      }
      return 'pass';
    }
  };

  installIpadScroll();
})();
