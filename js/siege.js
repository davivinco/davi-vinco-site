/* ============================================================
   DAVI VINCO: the attack simulator
   A small traffic model behind a row of labelled boxes. The
   numbers come from the model below; the canvas only draws
   what the model decided. With reduced motion the dots are
   skipped and the numbers still update.
   ============================================================ */

(() => {
  "use strict";

  const panel = document.getElementById("siege");
  const map = document.getElementById("siegeMap");
  if (!panel || !map) return;

  const canvas = map.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const fire = document.getElementById("siegeFire");
  const stateEl = document.getElementById("siegeState");
  const pips = document.getElementById("siegePips");
  const out = Object.fromEntries([...panel.querySelectorAll("[data-out]")].map((el) => [el.dataset.out, el]));
  const nodeEls = Object.fromEntries([...map.querySelectorAll("[data-node]")].map((el) => [el.dataset.node, el]));
  const toggles = [...panel.querySelectorAll("[data-layer]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const STR = {
    pt: {
      fire: "Lançar ataque", stop: "Parar ataque", locale: "pt-BR",
      state: { ok: "Estável", held: "Sob ataque, e de pé", slow: "Degradado", down: "Fora do ar" },
      timeout: "sem resposta",
    },
    en: {
      fire: "Launch attack", stop: "Stop attack", locale: "en-US",
      state: { ok: "Stable", held: "Under attack, still up", slow: "Degraded", down: "Down" },
      timeout: "no response",
    },
  };
  const s = () => STR[(window.site && window.site.lang) === "en" ? "en" : "pt"];

  /* ---------- the model ---------- */
  const LEGIT = 200;          // visitors, requests per second
  const PEAK = 12000;         // the flood at full strength
  const PER_NODE = 250;       // what one origin node serves
  const MIN_NODES = 2, MAX_NODES = 8;
  const DOT = 50;             // requests per second one dot stands for
  const ATTACK_SECONDS = 40;  // the flood ends by itself

  const layers = { rl: true, waf: true, cache: true, scale: true };
  const sim = { attacking: false, attack: 0, since: 0, nodes: MIN_NODES, scaleClock: 0 };
  let view = null;

  function step(dt) {
    // the flood ramps up in about two seconds and drains a little faster
    const target = sim.attacking ? PEAK : 0;
    sim.attack += (target - sim.attack) * Math.min(1, dt * (sim.attacking ? 1.6 : 2.4));
    if (sim.attack < 5) sim.attack = 0;
    if (sim.attacking && (sim.since += dt) > ATTACK_SECONDS) setAttack(false);

    // what each layer lets through
    const passRl = layers.rl ? 0.4 : 1;    // repeat offenders are throttled
    const passWaf = layers.waf ? 0.1 : 1;  // known patterns are dropped
    const attackIn = sim.attack * passRl * passWaf;
    const blocked = sim.attack - attackIn;
    const hitLegit = layers.cache ? 0.8 : 0;
    const hitAttack = layers.cache ? 0.4 : 0;
    const cached = LEGIT * hitLegit + attackIn * hitAttack;
    const load = LEGIT + attackIn - cached;

    // the origin grows when it runs hot and shrinks when it idles
    sim.scaleClock += dt;
    const capacity = sim.nodes * PER_NODE;
    if (sim.scaleClock > 1.1) {
      if (layers.scale && load > capacity * 0.6 && sim.nodes < MAX_NODES) { sim.nodes++; sim.scaleClock = 0; }
      else if (load < (sim.nodes - 1) * PER_NODE * 0.5 && sim.nodes > MIN_NODES) { sim.nodes--; sim.scaleClock = 0; }
    }

    const use = load / capacity;
    const errOrigin = use > 1 ? 1 - 1 / use : 0;           // share of origin requests that fail
    const errVisitors = errOrigin * (1 - hitLegit);         // cached answers still arrive
    const latency = use <= 0.6 ? 80 : use < 1 ? 80 + 900 * Math.pow((use - 0.6) / 0.4, 2) : Math.min(8000, 980 * use * use);

    let state = "ok";
    if (errVisitors >= 0.5) state = "down";
    else if (errVisitors > 0.005 || use > 0.9) state = "slow";
    else if (sim.attack > PEAK * 0.2) state = "held";

    view = { incoming: LEGIT + sim.attack, blocked, cached, load, use, errOrigin, errVisitors, latency, state, passRl, passWaf, hitLegit, hitAttack };
  }

  /* ---------- the numbers ---------- */
  const num = (v) => Math.round(v).toLocaleString(s().locale);
  let lastState = "";

  function paintNumbers() {
    const v = view;
    out.in.textContent = num(v.incoming);
    out.blocked.textContent = num(v.blocked);
    out.cached.textContent = num(v.cached);
    out.origin.textContent = num(v.load);
    out.nodes.textContent = sim.nodes;
    out.err.textContent = (v.errVisitors * 100).toFixed(v.errVisitors > 0 && v.errVisitors < 0.1 ? 1 : 0).replace(".", s().locale === "pt-BR" ? "," : ".") + "%";
    out.lat.textContent = v.latency >= 8000 ? s().timeout : num(v.latency) + " ms";
    out.load.textContent = num(Math.min(v.use, 9.99) * 100) + "%";
    if (pips.childElementCount !== MAX_NODES) {
      pips.textContent = "";
      for (let i = 0; i < MAX_NODES; i++) pips.append(document.createElement("i"));
    }
    [...pips.children].forEach((pip, i) => {
      pip.className = i >= sim.nodes ? "" : v.use > 1 ? "is-hot" : "is-on";
    });
    nodeEls.edge.classList.toggle("is-off", !layers.rl && !layers.waf);
    nodeEls.cache.classList.toggle("is-off", !layers.cache);
    nodeEls.origin.dataset.state = v.use > 1 ? "hot" : "";
    if (v.state !== lastState) {
      lastState = v.state;
      stateEl.dataset.state = v.state;
      stateEl.textContent = s().state[v.state];
      panel.dataset.state = v.state;
    }
  }

  /* ---------- the dots ---------- */
  const ORDER = ["net", "edge", "cache", "lb", "origin"];
  const SPEED = 0.9;            // segments per second
  let pts = [], vertical = false, dpr = 1, W = 0, H = 0;
  const dots = [];
  const sparks = [];
  let debtLegit = 0, debtAttack = 0;

  function layout() {
    const box = map.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = box.width; H = box.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    pts = ORDER.map((k) => {
      const r = nodeEls[k].getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, w: r.width, h: r.height };
    });
    vertical = Math.abs(pts[4].y - pts[0].y) > Math.abs(pts[4].x - pts[0].x);
  }

  function spawn(attack) {
    const v = view;
    // decide now where this dot ends: 1 edge, 2 cache, 4 origin
    let end = 4, fate = "served";
    if (attack && Math.random() > v.passRl * v.passWaf) { end = 1; fate = "blocked"; }
    else if (Math.random() < (attack ? v.hitAttack : v.hitLegit)) { end = 2; fate = "cached"; }
    else if (Math.random() < v.errOrigin) fate = "failed";
    dots.push({ attack, end, fate, seg: 0, t: 0, lane: (Math.random() - 0.5) * 2, speed: SPEED * (0.85 + Math.random() * 0.3) });
  }

  function place(d) {
    const a = pts[d.seg], b = pts[Math.min(d.seg + 1, 4)];
    const spread = Math.min(vertical ? a.w : a.h, vertical ? b.w : b.h) * 0.3;
    const x = a.x + (b.x - a.x) * d.t, y = a.y + (b.y - a.y) * d.t;
    return vertical ? [x + d.lane * spread, y] : [x, y + d.lane * spread];
  }

  function draw(dt) {
    debtLegit += (LEGIT / DOT) * dt;
    debtAttack += (sim.attack / DOT) * dt;
    while (debtLegit >= 1) { debtLegit--; spawn(false); }
    while (debtAttack >= 1) { debtAttack--; if (dots.length < 900) spawn(true); }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // the wire between the boxes
    ctx.strokeStyle = "rgba(244,244,240,0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.stroke();

    for (let i = dots.length - 1; i >= 0; i--) {
      const d = dots[i];
      d.t += d.speed * dt;
      while (d.t >= 1 && d.seg < d.end - 1) { d.t -= 1; d.seg++; }
      if (d.t >= 1) {
        const p = pts[d.end];
        // the mark lands on the wall of the box the dot ran into
        const side = d.lane * (vertical ? p.w : p.h) * 0.3;
        const x = vertical ? p.x + side : p.x - p.w / 2 - 3, y = vertical ? p.y - p.h / 2 - 3 : p.y + side;
        if (d.fate === "blocked" || d.fate === "failed") sparks.push({ x, y, life: 1, bad: true });
        else if (d.fate === "cached" && Math.random() < 0.5) sparks.push({ x, y, life: 1, bad: false });
        dots.splice(i, 1);
        continue;
      }
      const [x, y] = place(d);
      ctx.fillStyle = d.attack ? "#ff6a4d" : "#8fb3ff";
      ctx.globalAlpha = d.seg === 0 && d.t < 0.12 ? d.t / 0.12 : 1;
      ctx.beginPath();
      ctx.arc(x, y, d.attack ? 2 : 2.6, 0, 6.283);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (let i = sparks.length - 1; i >= 0; i--) {
      const k = sparks[i];
      k.life -= dt * 2.6;
      if (k.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.strokeStyle = k.bad ? "#ff6a4d" : "#8fb3ff";
      ctx.globalAlpha = k.life * 0.7;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(k.x, k.y, 3 + (1 - k.life) * 9, 0, 6.283);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (sparks.length > 400) sparks.splice(0, sparks.length - 400);
  }

  /* ---------- controls ---------- */
  function setAttack(on) {
    sim.attacking = on;
    sim.since = 0;
    fire.setAttribute("aria-pressed", on ? "true" : "false");
    fire.textContent = on ? s().stop : s().fire;
  }
  fire.addEventListener("click", () => setAttack(!sim.attacking));
  toggles.forEach((btn) => btn.addEventListener("click", () => {
    const k = btn.dataset.layer;
    layers[k] = !layers[k];
    btn.setAttribute("aria-pressed", layers[k] ? "true" : "false");
  }));
  document.addEventListener("site:lang", () => {
    fire.textContent = sim.attacking ? s().stop : s().fire;
    lastState = "";
    if (view) paintNumbers();
  });

  /* ---------- the loop runs only while the panel is on screen ---------- */
  let raf = 0, last = 0, visible = false, paintClock = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    step(dt);
    if ((paintClock += dt) > 0.12) { paintClock = 0; paintNumbers(); }
    if (!reduceMotion.matches) draw(dt);
  }
  function run(on) {
    cancelAnimationFrame(raf);
    if (on) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) layout();
    run(visible && !document.hidden);
  }, { rootMargin: "80px" }).observe(panel);
  document.addEventListener("visibilitychange", () => run(visible && !document.hidden));
  new ResizeObserver(layout).observe(map);

  fire.textContent = s().fire;
  step(0);
  paintNumbers();
  layout();

  // the terminal can pull the trigger too
  window.siege = {
    attack(on) { setAttack(on); panel.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" }); },
    get attacking() { return sim.attacking; },
  };
})();
