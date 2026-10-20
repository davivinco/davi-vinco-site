/* ============================================================
   DAVI VINCO: hero globe (Three.js)
   Land drawn as dots from a 1° Natural Earth mask (public domain),
   with routes from São Paulo to major cloud and edge regions.
   Pauses off screen, respects reduced motion, and the page reads
   the same without it.
   ============================================================ */

import * as THREE from "three";

const LAND = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg/wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA/v8/AOD//z8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+///A/////79/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAH/j/+//////8PAAAAAA0AAHgAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAOD//wP8//////8BAACAfz4AAAAAAAAAAP4AAAAAAAAAAAAAAAAAAAAAAAA4+I7///n///////8AAAAAfwAAAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAIAYACDwP4D///////8BAAAAPAQAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAHzAgPP9H8D//////38AAAAAAAAAAAAA4AEAAAD+DwAAAAAAAAAAAAAAAAAAAIC/g5PfBwAA/v////8AAAAAAAAAAADgBwAAwP//PwAA4B8AAAAAAAAAAAAAAAAMAAD8BgAA+P////8AAAAAAAAAAABwAAAA/P//AwAAAAAAAAAAAAAAAAAAAP8AhvcxOwAA8P///38AAAAAAAAAAAAcAADg////34cHAAcAAAAAAAAAAAAAgN9/5zf8RwAA4P///z8AAAAAAAAAAAAPAB7g//////8fgB8AAAAAAQAAAAAAAO//B3f8/wsA4P///z8AAAAAAAAAAAAPAG////////8fyf8HAAAAAAD4HwAAAAD8H/D4/38A4P///xMAAAAAAPAHAAAAgN//////////////DwAAAAD+///h/47/H+7Bg/8BwP7//w8AAAAAgP8fAAAAj9///////////////8s/AeD///////8DB8TNB/4AAP///wAAAAAA8P//AwBjf57/////////////////DwD////////////vh/kPwP//BwAAAAAA/P//H/P//5//////////////////34H8////////////Afw/gP//AQAAAAAA/v+fH////+///////////////////vH///////////9fAPwYgP8fAOA/AAAA/+N/8P//////////////////////QID4///////////Pw/0DAP8HAMAfAACA//F//v////////////////////8/AAP4///////////BBPAHAP4HAAAAAADg//z///////////////////////9/AID///////////8AQ8ABAPwBAAAAAAD8P/7///////////////////////9/AMD//////////z8AwA8AAPgBAAAAAAD+H/7/////////////////////Of8BAID///z//////z8AwD8AAMABAAAAAAD+P/z///////////////////9/wH8AAAD8MwD//////x8AwH8MAAAAAAAAAAD+PyD///////////////////95cAAAAACAAwD8/////38AwP8eAAAAAAAAgAGcH/D//////////////////wEAOAAAAADADgDA/////38AgP8/AAAAAAAAwANAH/T//////////////////wAAfgAAAAAwAAAA//////8PgP8/AAAAAAAAwAFwD/7/////////////////PwAAfwAAAAAGAAAA//////8/wP//AAAAAAAAwAOwA/7/////////////////DwCAPwAAAIAAAAAA/v//////8///BwAAAAAAOAcgcP//////////////////HwAAHwAAAAAAAACA+P//////4///DwAAAAAAPA74/////////////////////wUADwAAAAAAAAAA8P//////4///DwAAAAAAGD///////////////////////wUAAwAAAAAAAAAA8P//////7///FwAAAAAAAB///////////////////////wUAAgAAAAAAAAAA0P//////////CAAAAAAAgOP//////////////////////w0AAAAAAAAAAAAAYP////////8xLAAAAAAAAPT//////////////////////wwAAAAAAAAAAAAAgP7//////38HfgAAAAAAgP///////////////////////wQAAAAAAAAAAAAAAP3///////8HUAAAAAAAAP7/////////////////////fwQAAAAAAAAAAAAAAP////////+XAAAAAAAAAPz////3/D/+////////////PwwAAAAAAAAAAAAAAP////////9/AAAAAAAAAPj//f9j/A/+////////////HwAAAAAAAAAAAAAAAP////////8MAAAAAAAAAPj/+P8h/Mf/////////////DwQAAAAAAAAAAAAAAP///////z8AAAAAAAAAcPzH8/8A8I//////////////Bx4AAAAAAAAAAAAAAP///////x8AAAAAAAAA+H+Aw/8A4A/+//////////9/AA8AAAAAAAAAAAAAAP///////z8AAAAAAAAA+D8Aj//w4B/8//////////8/AAAAAAAAAAAAAAAAAP///////wMAAAAAAAAA+B8wuE/+/z/+/////////98fAAMAAAAAAAAAAAAAAP///////wMAAAAAAAAA+A8wEMf//x/+/////////2cOAAMAAAAAAAAAAAAAAP7//////wEAAAAAAAAA+A8AAI7//x/8/////////wMOAAEAAAAAAAAAAAAAAP7//////wAAAAAAAAAA+AcABob//z/8/////////zccwAEAAAAAAAAAAAAAAPz//////wAAAAAAAAAAQOB/AAQ2/////////////x8c8AEAAAAAAAAAAAAAAPj//////wAAAAAAAAAAQPx/AAAA/////////////w8Y/gEAAAAAAAAAAAAAAPD/////fwAAAAAAAAAA4P8/AAAA/////////////w+EGwAAAAAAAAAAAAAAAMD/////HwAAAAAAAAAA8P9/AACA/////////////x9AAwAAAAAAAAAAAAAAAID/////DwAAAAAAAAAA+P//BwaA/////////////x/AAAAAAAAAAAAAAAAAAID9////BwAAAAAAAAAA/P//D3+A/////////////z9AAAAAAAAAAAAAAAAAAAD5////BwAAAAAAAAAA/P//f////////////////x8AAAAAAAAAAAAAAAAAAADy/x8GBgAAAAAAAAAA/P/////v/8///////////z8AAAAAAAAAAAAAAAAAAAD0/w8ABgAAAAAAAAAA/v////+//4///////////z8AAAAAAAAAAAAAAAAAAADu/wcADgAAAAAAAACA//////8f/x/+/////////x8AAAAAAAAAAAAAAAAAAACI/wcALAAAAAAAAADA//////8//z/g/////////w8AAAAAAAAAAAAAAAAAAACQ/wcACAAAAAAAAADg//////9//r+A/////////wcAAAAAAAAAAAAAAAAAAAAQ/wMAAAAAAAAAAADg//////9//n8cgP///////ycAAAAAAAAAAAAAAAAAAAAA/gMAAAAAAAAAAADw//////9/+P9/AP///////xEAAAAAAAAAAAAAAAAAAAAA/AMAHQAAAAAAAADw////////+P//APz/f///fxAAAAAAAAAAAAAAAAAAAAAA+AcAYAAAAAAAAAD4////////+f9/APz/B///DgAAAAAAAAAAAAAAAAAAAAAA+AccgAEAAAAAAAD4////////8f9/AOD/B/9/AAAAAAAAAAAAAAAAAQAAAAAA+A8eADgAAAAAAADw////////4f8/AOD/Afw/BgAAAAAAAAAAAAAAAAAAAAAA8J8PAPwCAAAAAADw////////4/8fAOD/APw/AgAAAAAAAAAAAAAAAAAAAAAAgP8PAAAAAAAAAADw////////x/8HAOB/APx/ADAAAAAAAAAAAAAAAAAAAAAAAP4PAAAAAAAAAAD4////////h/8BAOA/APz/ADAAAAAAAAAAAAAAAAAAAAAAAID/AAAAAAAAAAD4////////j/8AAMAPAMD/ATAAAAAAAAAAAAAAAAAAAAAAAAD/AQAAAAAAAAD4////////nx8AAMAPAMD/ATAAAAAAAAAAAAAAAAAAAAAAAAD8AAAAAAAAAAD4////////vwcAAIAPAMD/AcAAAAAAAAAAAAAAAAAAAAAAAADgAQAAAAAAAAD4////////fwAAAIAPAMD8AQABAAAAAAAAAAAAAAAAAAAAAADAAAgAAAAAAADw////////f0AAAAAPAID4AUACAAAAAAAAAAAAAAAAAAAAAADAAe9zAAAAAADg/////////34AAAAPAEBwAAgAAAAAAAAAAAAAAAAAAAAAAAAAEe9/AAAAAADA/////////38AAAAXAEAgAAQCAAAAAAAAAAAAAAAAAAAAAAAA7///AAAAAACA/////////z8AAAASAMAAAIACAAAAAAAAAAAAAAAAAAAAAAAAyP//AQAAAACA/////////z8AAAAwAIAAAEADAAAAAAAAAAAAAAAAAAAAAAAAgP//AwAAAAAA/v///////x8AAAAwAAADAAMBAAAAAAAAAAAAAAAAAAAAAAAAwP//fwAAAAAA/A/+/////x8AAAAAAAAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAgP///wAAAAAAEAD8/////w8AAAAAADAGwAcAAAAAAAAAAAAAAAAAAAAAAAAAgP///wEAAAAAAADA/////wcAAAAAAGAG4AEAAAAAAAAAAAAAAAAAAAAAAAAA4P///wEAAAAAAADA/////wMAAAAAAMAM+AMAAAAAAAAAAAAAAAAAAAAAAAAA4P///wMAAAAAAADg/////wEAAAAAAIAL/gMQAAAAAAAAAAAAAAAAAAAAAAAA8P///wMAAAAAAADg////fwAAAAAAAIAH/vMQAAAAAAAAAAAAAAAAAAAAAAAA8P///wcAAAAAAADg////PwAAAAAAAAAP/gEAAQAAAAAAAAAAAAAAAAAAAAAA+P///38AAAAAAADg////PwAAAAAAAAAO/DmAAwAAAAAAAAAAAAAAAAAAAAAA+P///38BAAAAAADA////HwAAAAAAAAA+/DkA8gAAAAAAAAAAAAAAAAAAAAAA8P////8fAAAAAACA////DwAAAAAAAAA8wChE/gcAAAAAAAAAAAAAAAAAAAAA+P////8/AAAAAACA////BwAAAAAAAAA4AEAA+B8AAAAAAAAAAAAAAAAAAAAA+P//////AQAAAAAA////BwAAAAAAAAAwAEAAxD8JAAAAAAAAAAAAAAAAAAAA+P//////AQAAAAAA////BwAAAAAAAADAAQAAxP+AAAAAAAAAAAAAAAAAAAAA8P//////AQAAAAAA/v//BwAAAAAAAACAHwAAwH8ABAAAAAAAAAAAAAAAAAAA4P//////AQAAAAAA/v//BwAAAAAAAAAAQFYEAMcAAAAAAAAAAAAAAAAAAAAA4P//////AAAAAAAA/v//DwAAAAAAAAAAAAgBAIABIAAAAAAAAAAAAAAAAAAAwP//////AAAAAAAA/v//DwAAAAAAAAAAAAAAAAAEIAAAAAAAAAAAAAAAAAAAwP////9/AAAAAAAA/P//DwAAAAAAAAAAAAAAAQQAAAAAAAAAAAAAAAAAAAAAgP////8/AAAAAAAA/v//HyAAAAAAAAAAAACAHwQAAAAAAAAAAAAAAAAAAAAAAP////8fAAAAAAAA/v//HyAAAAAAAAAAAADADwwAAAAAAAAAAAAAAAAAAAAAAP////8fAAAAAAAA////HzAAAAAAAAAAAADsDxwAAAAAAAAAAAAAAAAAAAAAAP7///8fAAAAAAAA////DzgAAAAAAAAAAAD/DxwAAAAAAAAAAAAAAAAAAAAAAPj///8fAAAAAAAA////Dz8AAAAAAAAAAAD/Pz4AAAiAAAAAAAAAAAAAAAAAAOD///8fAAAAAAAA////Ax8AAAAAAAAAAMD//z4AAABAAAAAAAAAAAAAAAAAAMD///8PAAAAAAAA////AB8AAAAAAAAAAMD//z8AAAAAAAAAAAAAAAAAAAAAAMD///8PAAAAAAAA/v9/AB8AAAAAAAAAAOD//38AAAAAAAAAAAAAAAAAAAAAAMD///8PAAAAAAAA/v9/AB8AAAAAAAAAAPz///8BAAEAAAAAAAAAAAAAAAAAAMD///8HAAAAAAAA/P9/gA8AAAAAAAAAgP////8BAAIAAAAAAAAAAAAAAAAAAMD///8DAAAAAAAA/P//gA8AAAAAAAAAwP////8DAAAAAAAAAAAAAAAAAAAAAMD//38AAAAAAAAA/P9/AA8AAAAAAAAAwP////8HAAAAAAAAAAAAAAAAAAAAAOD//x8AAAAAAAAA+P9/AAcAAAAAAAAA4P////8PAAAAAAAAAAAAAAAAAAAAAOD//w8AAAAAAAAA+P8fAAIAAAAAAAAAwP////8fAAAAAAAAAAAAAAAAAAAAAOD//wcAAAAAAAAA+P8fAAAAAAAAAAAA4P////8fAAAAAAAAAAAAAAAAAAAAAOD//wcAAAAAAAAA+P8fAAAAAAAAAAAAwP////8fAAAAAAAAAAAAAAAAAAAAAOD//wcAAAAAAAAA8P8PAAAAAAAAAAAAgP////8/AAAAAAAAAAAAAAAAAAAAAOD//wMAAAAAAAAA4P8HAAAAAAAAAAAAgP////8fAAAAAAAAAAAAAAAAAAAAAPD//wMAAAAAAAAA4P8HAAAAAAAAAAAAgP////8fAAAAAAAAAAAAAAAAAAAAAPD//wEAAAAAAAAAwP8DAAAAAAAAAAAAAP////8fAAAAAAAAAAAAAAAAAAAAAOD//wAAAAAAAAAAwP8BAAAAAAAAAAAAAP8D/P8PAAAAAAAAAAAAAAAAAAAAAPD/fwAAAAAAAAAAwH8AAAAAAAAAAAAAAP8A2P8HAAAAAAAAAAAAAAAAAAAAAPD/OwAAAAAAAAAAgAEAAAAAAAAAAAAAAAcA6P8HAAAAAAAAAAAAAAAAAAAAAPj/BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwP8DAAACAAAAAAAAAAAAAAAAAPj/BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8DAAAEAAAAAAAAAAAAAAAAAPz/BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8DAAAIAAAAAAAAAAAAAAAAAPj/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGgAAAA4AAAAAAAAAAAAAAAAAPg/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAPw/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAPwHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAALAAAAAAAAAAAAAAAAAPwPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAIADAAAAAAAAAAAAAAAAAPgHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAMABAAAAAAAAAAAAAAAAAPwHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAP4BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAAAAAAAAAAAAAAAP4BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAP4DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAIAfAAAAAAAeeADADwAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAPD/AADA/////////z8AAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAgP///wH4//////////8DAAAAAAAAAAAAAAAAAAAAADAfAAAAAAAAAAAAAADw8////wP+////////////AwAAAAAAAAAAAAAAAAAAAHA/AAAAAAAAAAA8/+P//////+D/////////////HwAAAAAAAAAAAAAAAAAAAP5+AAAAAAAA5v////////////D//////////////38AAAAAAAAAAAAAgAgAABB+AAAAAACA/////////////////////////////38A////////////HxyAxweA//////8PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOD///////8PwA7ofwAAAADA//////8PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPz//////wMAAAAAAAAAAAD4//////8BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////wMAAAAAAAAAAMD//////wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////8/AAAAAAAAAAAAAP7/////DwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////9/AAAAAAAAAAAAwP//////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPj/////fwAAAAAAAAAAgP//////PwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4P///////wEAAAAAAAAAAPj/////fwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8P//////AQAAAAAAAAAAAAD8//8HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4P//////BwAAAAAAAAAAAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//////AwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOD/IOD//wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

const HUB = { lat: -23.55, lon: -46.63 }; // São Paulo
const ROUTES = [
  { lat: 25.76, lon: -80.19 },   // Miami
  { lat: 39.04, lon: -77.49 },   // Ashburn, N. Virginia
  { lat: 34.05, lon: -118.24 },  // Los Angeles
  { lat: 4.71, lon: -74.07 },    // Bogotá
  { lat: -33.45, lon: -70.67 },  // Santiago
  { lat: -34.6, lon: -58.38 },   // Buenos Aires
  { lat: -3.73, lon: -38.52 },   // Fortaleza
  { lat: 38.72, lon: -9.14 },    // Lisbon
  { lat: 50.11, lon: 8.68 },     // Frankfurt
  { lat: 51.5, lon: -0.12 },     // London
  { lat: -26.2, lon: 28.04 },    // Johannesburg
  { lat: 19.07, lon: 72.88 },    // Mumbai
  { lat: 1.35, lon: 103.82 },    // Singapore
  { lat: 35.68, lon: 139.69 },   // Tokyo
  { lat: -33.87, lon: 151.21 },  // Sydney
];

const INK = new THREE.Color("#f2f2f0");
const ACCENT = new THREE.Color("#3b82f6");
const HEAD = new THREE.Color("#9cc2ff");
const R = 1;
const D2R = Math.PI / 180;
const SEG = 80;

const host = document.querySelector(".globe");
const canvas = host && host.querySelector("canvas");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const DOT_VERT = `
  uniform float uSize; uniform float uScale;
  varying float vFacing;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normalize(position));
    vFacing = dot(n, normalize(-mv.xyz));
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uScale;
  }`;
const DOT_FRAG = `
  uniform vec3 uColor; uniform float uAlpha;
  varying float vFacing;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    gl_FragColor = vec4(uColor, uAlpha * smoothstep(0.0, 0.55, vFacing));
  }`;
const dotMaterial = (color, size, alpha) =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uColor: { value: color }, uSize: { value: size }, uScale: { value: 1 }, uAlpha: { value: alpha } },
    vertexShader: DOT_VERT,
    fragmentShader: DOT_FRAG,
  });

function start() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch (_) {
    return; // no WebGL: the hero stays as it is
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(22, 1, 1, 100);
  camera.position.set(0, 0, 20);

  const rig = new THREE.Group();   // placed and scaled to fit the free space
  const globe = new THREE.Group(); // rotates
  rig.add(globe);
  scene.add(rig);

  /* ---------- land mask ---------- */
  const bin = atob(LAND);
  const mask = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) mask[i] = bin.charCodeAt(i);
  const isLand = (lat, lon) => {
    const r = Math.min(179, Math.max(0, Math.floor(90 - lat)));
    const c = ((Math.floor(lon + 180) % 360) + 360) % 360;
    const i = r * 360 + c;
    return (mask[i >> 3] >> (i & 7)) & 1;
  };
  const toVec = (lat, lon, r = R) => {
    const phi = (90 - lat) * D2R, th = (lon + 180) * D2R;
    return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
  };

  /* ---------- body: a dark sphere that hides the far side ---------- */
  globe.add(new THREE.Mesh(
    new THREE.SphereGeometry(R * 0.992, 64, 48),
    new THREE.MeshBasicMaterial({ color: 0x111114 })
  ));

  /* ---------- land dots: Fibonacci lattice, land only, no Antarctica ---------- */
  const N = 30000, golden = 137.50776405;
  const pos = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N;
    const lat = Math.asin(y) / D2R;
    const lon = ((i * golden) % 360) - 180;
    if (lat < -58 || !isLand(lat, lon)) continue;
    const v = toVec(lat, lon, R * 1.002);
    pos.push(v.x, v.y, v.z);
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  const dotMat = dotMaterial(INK, 2.0, 0.78);
  globe.add(new THREE.Points(dotGeo, dotMat));

  /* ---------- routes: arcs from São Paulo with a travelling pulse ---------- */
  const hub = toVec(HUB.lat, HUB.lon);
  const arcs = [];
  const ends = [];
  ROUTES.forEach((dst, k) => {
    const b = toVec(dst.lat, dst.lon);
    const omega = hub.angleTo(b);
    const lift = 0.03 + 0.11 * (omega / Math.PI);
    const pts = [], ts = [];
    const s = Math.sin(omega);
    for (let i = 0; i <= SEG; i++) {
      const t = i / SEG;
      const p = hub.clone().multiplyScalar(Math.sin((1 - t) * omega) / s)
        .add(b.clone().multiplyScalar(Math.sin(t * omega) / s));
      p.setLength(R * (1.004 + lift * Math.sin(Math.PI * t)));
      pts.push(p.x, p.y, p.z);
      ts.push(t);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    g.setAttribute("aT", new THREE.Float32BufferAttribute(ts, 1));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uColor: { value: ACCENT }, uHead: { value: -1 } },
      vertexShader: `
        attribute float aT; varying float vT; varying float vFacing;
        void main() {
          vT = aT;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vFacing = dot(normalize(normalMatrix * normalize(position)), normalize(-mv.xyz));
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uColor; uniform float uHead; varying float vT; varying float vFacing;
        void main() {
          float d = uHead - vT;
          float trail = (d >= 0.0 && d < 0.28) ? 1.0 - d / 0.28 : 0.0;
          float side = smoothstep(-0.05, 0.3, vFacing);
          gl_FragColor = vec4(mix(uColor, vec3(0.8, 0.88, 1.0), trail * 0.6), (0.22 + trail * 0.78) * side);
        }`,
    });
    globe.add(new THREE.Line(g, m));
    arcs.push({ m, pts, speed: 0.16 + (k % 5) * 0.025, offset: (k * 0.37) % 1 });
    const e = b.clone().setLength(R * 1.006);
    ends.push(e.x, e.y, e.z);
  });

  // destinations in the accent, São Paulo in ink
  const endGeo = new THREE.BufferGeometry();
  endGeo.setAttribute("position", new THREE.Float32BufferAttribute(ends, 3));
  const endMat = dotMaterial(ACCENT, 5.0, 1.0);
  globe.add(new THREE.Points(endGeo, endMat));

  const hv = hub.clone().setLength(R * 1.008);
  const hubGeo = new THREE.BufferGeometry();
  hubGeo.setAttribute("position", new THREE.Float32BufferAttribute([hv.x, hv.y, hv.z], 3));
  const hubMat = dotMaterial(INK, 8.0, 1.0);
  globe.add(new THREE.Points(hubGeo, hubMat));

  // a ring that pulses out from São Paulo
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.02, 0.027, 48),
    new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
  );
  ring.position.copy(hub.clone().setLength(R * 1.01));
  ring.lookAt(hub.clone().multiplyScalar(2));
  globe.add(ring);

  // travelling heads
  const headGeo = new THREE.BufferGeometry();
  headGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(ROUTES.length * 3), 3));
  const headMat = dotMaterial(HEAD, 4.0, 1.0);
  globe.add(new THREE.Points(headGeo, headMat));

  /* ---------- orientation: São Paulo toward the viewer, slightly left ---------- */
  let tiltX = -0.36;
  globe.rotation.set(tiltX, -Math.atan2(hub.x, hub.z) - 0.25, 0);

  /* ---------- fit: the largest globe that fits the free space ---------- */
  function fit() {
    const rect = host.getBoundingClientRect();
    const W = Math.max(1, rect.width), H = Math.max(1, rect.height);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    const unit = (2 * camera.position.z * Math.tan((camera.fov * D2R) / 2)) / H; // world units per css px

    let cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.44;
    if (getComputedStyle(host).position === "absolute") {
      // free area: below the nav and clear of the name and role line
      const nav = document.querySelector(".nav").getBoundingClientRect();
      const name = document.querySelector(".hero-name-word").getBoundingClientRect();
      const line = document.querySelector(".hero-line").getBoundingClientRect();
      const top = nav.bottom - rect.top + 12;
      const bottom = H - 28;
      const ob = {
        l: Math.min(name.left, line.left) - rect.left - 32, r: Math.max(name.right, line.right) - rect.left + 32,
        t: name.top - rect.top - 32, b: line.bottom - rect.top + 32,
      };
      const clear = (x, y, rr) => {
        const nx = Math.max(ob.l, Math.min(x, ob.r)), ny = Math.max(ob.t, Math.min(y, ob.b));
        return Math.hypot(x - nx, y - ny) >= rr;
      };
      for (r = Math.min((bottom - top) / 2, W * 0.5); r > 100; r -= 4) {
        cx = W - r * 0.86;
        cy = Math.max(top + r, bottom - r);
        if (cy + r <= bottom + 1 && clear(cx, cy, r)) break;
      }
      host.classList.toggle("is-off", r <= 100);
    }
    rig.position.set((cx - W / 2) * unit, -(cy - H / 2) * unit, 0);
    rig.scale.setScalar(r * unit);
    const s = Math.max(0.6, Math.min(1.4, r / 260)) * renderer.getPixelRatio();
    for (const m of [dotMat, endMat, hubMat, headMat]) m.uniforms.uScale.value = s;
  }

  /* ---------- drag to turn ---------- */
  let dragging = false, lastX = 0, lastY = 0, velY = 0;
  canvas.addEventListener("pointerdown", (e) => {
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    host.classList.add("is-dragging");
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    velY = dx * 0.006;
    globe.rotation.y += velY;
    tiltX = Math.max(-0.8, Math.min(0.6, tiltX + dy * 0.004));
    globe.rotation.x = tiltX;
    if (!running) render(0);
  });
  const stopDrag = () => { dragging = false; host.classList.remove("is-dragging"); };
  canvas.addEventListener("pointerup", stopDrag);
  canvas.addEventListener("pointercancel", stopDrag);

  /* ---------- loop ---------- */
  let running = false, visible = true, raf = 0, last = 0, clock = 0;
  const tmp = new THREE.Vector3();
  function render(dt) {
    clock += dt;
    const animate = !reduceMotion.matches;
    if (animate && !dragging) {
      velY *= 0.94;
      globe.rotation.y += 0.035 * dt + velY;
    }
    const hp = headGeo.attributes.position.array;
    arcs.forEach((a, k) => {
      const head = animate ? (clock * a.speed + a.offset) % 1.3 : -1;
      a.m.uniforms.uHead.value = head;
      if (head >= 0 && head <= 1) {
        const i = Math.min(SEG, Math.round(head * SEG)) * 3;
        tmp.set(a.pts[i], a.pts[i + 1], a.pts[i + 2]);
      } else {
        tmp.set(0, 0, 0);
      }
      hp[k * 3] = tmp.x; hp[k * 3 + 1] = tmp.y; hp[k * 3 + 2] = tmp.z;
    });
    headGeo.attributes.position.needsUpdate = true;
    const p = (clock * 0.45) % 1;
    ring.scale.setScalar(1 + p * 3.2);
    ring.material.opacity = animate ? 0.75 * (1 - p) : 0;
    renderer.render(scene, camera);
  }
  function frame(t) {
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
    last = t;
    render(dt);
    if (running) raf = requestAnimationFrame(frame);
  }
  function wake() {
    const should = visible && !document.hidden && !reduceMotion.matches;
    if (should && !running) { running = true; last = 0; raf = requestAnimationFrame(frame); }
    if (!should && running) { running = false; cancelAnimationFrame(raf); }
  }

  new IntersectionObserver((es) => { visible = es.some((e) => e.isIntersecting); wake(); }).observe(host);
  document.addEventListener("visibilitychange", wake);
  reduceMotion.addEventListener?.("change", () => { wake(); render(0); });
  const ro = new ResizeObserver(() => { fit(); if (!running) render(0); });
  ro.observe(host);
  ro.observe(document.querySelector(".hero"));

  fit();
  render(0);
  host.classList.add("is-ready");
  wake();
}

if (host && canvas) {
  const go = () => { try { start(); } catch (_) { /* the page works without the globe */ } };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
  else go();
}
