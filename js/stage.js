/* ============================================================
   DAVI VINCO: the stage (Three.js)
   One full-screen shader behind the page. It draws each chapter's
   ground and, where two chapters meet, breaks the edge into tiles.
   The hero keeps the tile grid visible and answers the pointer.
   Without WebGL, or with reduced motion, the chapters keep their
   flat CSS backgrounds.
   ============================================================ */

import * as THREE from "three";

const MAX = 6;
const COLORS = { dark: "#1c1d21", blue: "#2254f4", paper: "#f0f0ec" };
const GRID = { dark: 1, blue: 0, paper: 0 };

const canvas = document.getElementById("stage");
const chapters = [...document.querySelectorAll(".chapter[data-ground]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const FRAG = `
  precision highp float;
  uniform vec2 uRes;
  uniform float uCell, uTime;
  uniform vec2 uMouse;
  uniform vec3 uCol[${MAX}];
  uniform float uEdge[${MAX}];
  uniform float uGrid[${MAX}];

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
    vec2 id = floor(px / uCell);
    vec2 f = fract(px / uCell) - 0.5;
    float cy = (id.y + 0.5) * uCell;
    float jitter = (hash(id) - 0.5) * uCell * 1.6;

    vec3 tile = uCol[${MAX - 1}], gap = uCol[${MAX - 1}];
    float grid = 0.0, near = 1e6;
    bool haveTile = false, haveGap = false;
    for (int i = 0; i < ${MAX}; i++) {
      if (!haveTile && cy + jitter < uEdge[i]) { tile = uCol[i]; grid = uGrid[i]; haveTile = true; }
      if (!haveGap && px.y < uEdge[i]) { gap = uCol[i]; haveGap = true; }
      near = min(near, abs(cy - uEdge[i]));
    }

    float edge = 1.0 - smoothstep(uCell * 1.0, uCell * 1.9, near);
    float show = max(grid, edge);

    // rounded tile
    float r = 0.1;
    float d = length(max(abs(f) - (0.5 - 0.035 - r), 0.0)) - r;
    float mask = 1.0 - smoothstep(0.0, 1.6 / uCell, d);

    // the hero's tiles breathe and answer the pointer
    float glow = 1.0 - smoothstep(0.0, uCell * 3.2, distance((id + 0.5) * uCell, uMouse));
    vec3 lit = tile + grid * (0.018 * sin(uTime * 0.7 + hash(id) * 6.283) + 0.075 * glow * glow);

    vec3 color = mix(mix(tile, gap * 0.78, show), lit, mask);
    color += (hash(px * 0.73 + fract(uTime) * 91.0) - 0.5) * 0.028; // film grain
    gl_FragColor = vec4(color, 1.0);
  }`;

function start() {
  if (reduceMotion.matches || !canvas || !chapters.length) return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "low-power" });
  } catch (_) {
    return;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(dpr);

  const uniforms = {
    uRes: { value: new THREE.Vector2(1, 1) },
    uCell: { value: 100 },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(-9999, -9999) },
    uCol: { value: Array.from({ length: MAX }, () => new THREE.Color(COLORS.dark)) },
    uEdge: { value: new Array(MAX).fill(1e6) },
    uGrid: { value: new Array(MAX).fill(0) },
  };
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: "void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",
      fragmentShader: FRAG,
      depthTest: false,
      depthWrite: false,
    })
  ));
  const camera = new THREE.Camera();
  // Colors stay as authored: the shader writes them straight to the screen.
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  const raw = Object.fromEntries(Object.entries(COLORS).map(([k, v]) => {
    const n = parseInt(v.slice(1), 16);
    return [k, [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]];
  }));

  function resize() {
    // the canvas's own box: window sizes can differ on phones while the page settles
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w * dpr, h * dpr);
    uniforms.uCell.value = Math.min(120, Math.max(56, w / 12)) * dpr; // the seam must stay inside the section padding
  }
  resize();

  window.addEventListener("pointermove", (e) => {
    uniforms.uMouse.value.set(e.clientX * dpr, e.clientY * dpr);
  }, { passive: true });

  function bands() {
    const h = canvas.clientHeight;
    let n = 0;
    for (const c of chapters) {
      const r = c.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= h) continue;
      if (n >= MAX) break;
      const g = c.dataset.ground;
      uniforms.uCol.value[n].setRGB(...raw[g]);
      uniforms.uEdge.value[n] = r.bottom * dpr;
      uniforms.uGrid.value[n] = GRID[g];
      n++;
    }
    if (!n) return;
    uniforms.uEdge.value[n - 1] = 1e6;
    for (let i = n; i < MAX; i++) {
      uniforms.uCol.value[i].copy(uniforms.uCol.value[n - 1]);
      uniforms.uEdge.value[i] = 1e6;
      uniforms.uGrid.value[i] = uniforms.uGrid.value[n - 1];
    }
  }

  // Redraws at full rate only while something moves; otherwise a slow tick keeps the grain alive.
  let raf = 0, t0 = performance.now(), lastDraw = 0, lastY = -1, dirty = true;
  window.addEventListener("pointermove", () => { dirty = true; }, { passive: true });
  new ResizeObserver(() => { resize(); dirty = true; }).observe(canvas);
  function frame(t) {
    raf = requestAnimationFrame(frame);
    const y = window.scrollY;
    const moved = dirty || y !== lastY;
    if (t - lastDraw < (moved ? 33 : 125)) return;
    lastDraw = t; lastY = y; dirty = false;
    uniforms.uTime.value = (t - t0) / 1000;
    bands();
    renderer.render(scene, camera);
  }
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) raf = requestAnimationFrame(frame);
  });

  bands();
  renderer.render(scene, camera);
  document.documentElement.classList.add("has-stage");
  raf = requestAnimationFrame(frame);
}

try { start(); } catch (_) { /* the chapters keep their CSS backgrounds */ }
