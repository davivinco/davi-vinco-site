/* ============================================================
   DAVI VINCO — refined dark portfolio interactions
   ============================================================ */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- preloader ---------- */
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => preloader.classList.add("done"), prefersReducedMotion ? 0 : 900);
  });
  setTimeout(() => preloader.classList.add("done"), 3000);

  /* ---------- canvas: subtle node network ---------- */
  const canvas = document.getElementById("edgeCanvas");
  const ctx = canvas.getContext("2d");
  let W, H, nodes = [];
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const count = Math.min(70, Math.floor((W * H) / 26000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.3 + 0.5,
    }));
  }
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const LINK_DIST = 120;
  function drawNetwork() {
    ctx.clearRect(0, 0, W, H);
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      const dx = mouse.x - n.x, dy = mouse.y - n.y;
      const d = Math.hypot(dx, dy);
      if (d < 200 && d > 0.001) {
        n.x += (dx / d) * 0.18;
        n.y += (dy / d) * 0.18;
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          const alpha = (1 - d / LINK_DIST) * 0.1;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = "rgba(255, 90, 31, 0.4)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(drawNetwork);
  }
  if (!prefersReducedMotion) drawNetwork();

  /* ---------- nav + scroll progress ---------- */
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      nav.classList.toggle("scrolled", y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    },
    { passive: true }
  );

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- counters ---------- */
  const counterIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target;
        counterIO.unobserve(el);
        const target = +el.dataset.count;
        const dur = 1200;
        const t0 = performance.now();
        (function tick(t) {
          const p = Math.min((t - t0) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      }
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".stat-num").forEach((el) => counterIO.observe(el));

  /* ---------- projects: live from GitHub, curated order ---------- */
  const list = document.getElementById("projectsList");

  const CURATED = {
    "azion-ai-agent-mvp": {
      tag: "Destaque",
      featured: true,
      desc: "Plataforma de ChatOps com IA para provisionamento de infraestrutura de borda: pedidos em português natural viram um plano de execução validável — e, só após aprovação humana, o agente executa contra a API v4 da Azion via fila assíncrona.",
      highlights: [
        "Planner híbrido (rules-based + LLM) gera planos JSON revisáveis antes de qualquer execução",
        "Execução assíncrona com Redis Streams, status em tempo real e histórico persistido em SQLite",
        "Parser de DNS multi-provider: Cloudflare (CSV/BIND), Route53 (JSON) e zone-files RFC1035",
        "Migração completa de domínios proxied: Connector, Firewall + WAF, Workload e certificado Let's Encrypt via desafio DNS-01",
        "Security by default: todo recurso nasce desativado até aprovação explícita",
      ],
      chips: ["TypeScript", "LLM Planner", "MCP", "Redis Streams", "SQLite", "Azion API v4", "Let's Encrypt"],
    },
    "azion-rag-chat": {
      desc: "Chat com RAG (Retrieval-Augmented Generation) construído em TypeScript: pipeline de embeddings e recuperação de contexto para respostas precisas sobre a plataforma Azion, com fundamentação em documentação real.",
      chips: ["TypeScript", "RAG", "Embeddings", "LLM"],
    },
    "Rabbbitmq-jps-install": {
      desc: "Infraestrutura como código: manifesto YAML JPS que provisiona um cluster RabbitMQ completo em plataformas PaaS com um clique — sem passos manuais, reproduzível e versionado.",
      chips: ["IaC", "YAML/JPS", "RabbitMQ", "PaaS"],
    },
  };

  const FALLBACK = Object.entries(CURATED).map(([name, meta]) => ({
    name,
    html_url: `https://github.com/davivinco/${name}`,
    language: name.startsWith("azion") ? "TypeScript" : "YAML",
    pushed_at: null,
    ...meta,
  }));

  function renderProjects(repos) {
    const order = Object.keys(CURATED);
    const picked = repos
      .filter((r) => order.includes(r.name))
      .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

    const items = picked.length ? picked : FALLBACK;
    list.innerHTML = "";

    items.forEach((repo, i) => {
      const meta = CURATED[repo.name] || {};
      const a = document.createElement("a");
      a.className = "project" + (meta.featured ? " featured" : "");
      a.href = repo.html_url;
      a.target = "_blank";
      a.rel = "noopener";

      const parts = [repo.language || null];
      if (repo.pushed_at) {
        parts.push(new Date(repo.pushed_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" }));
      }

      const highlights = meta.highlights
        ? `<ul class="project-highlights">${meta.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>`
        : "";
      const chips = meta.chips
        ? `<div class="project-chips">${meta.chips.map((c) => `<span>${c}</span>`).join("")}</div>`
        : "";

      a.innerHTML = `
        <div class="project-head">
          <h3>${repo.name} <span class="arrow">↗</span></h3>
          <span class="project-meta">${parts.filter(Boolean).join(" · ")}</span>
        </div>
        <p>${meta.desc || repo.description || "Projeto no GitHub."}</p>
        ${highlights}
        ${chips}
        ${meta.tag ? `<span class="tag">${meta.tag}</span>` : ""}`;

      a.addEventListener("pointermove", (e) => {
        const r = a.getBoundingClientRect();
        a.style.setProperty("--mx", e.clientX - r.left + "px");
        a.style.setProperty("--my", e.clientY - r.top + "px");
      });

      list.appendChild(a);
      a.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
      io.observe(a);
    });
  }

  fetch("https://api.github.com/users/davivinco/repos?per_page=100")
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(renderProjects)
    .catch(() => renderProjects(FALLBACK));
})();
