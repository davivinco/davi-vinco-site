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
      ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
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

  /* ============================================================
     i18n — Portuguese is the inline default (captured from the
     DOM); English lives in the dictionary below.
     ============================================================ */

  const EN = {
    "nav.stack": "Stack",
    "nav.exp": "Experience",
    "nav.proj": "Projects",
    "nav.edu": "Education",
    "nav.contact": "Contact",

    "hero.meta": "Solutions Architect II · Azion — Brazil",
    "hero.sub": "Solutions architect for <strong>enterprise</strong> clients — from the decision table to the <strong>edge</strong>, <strong>cloud</strong> and <strong>security</strong> architecture that powers mission-critical applications at global scale.",
    "hero.cta1": "Get in touch",
    "hero.cta2": "View projects",

    "label.about": "About",
    "about.lead": "I work where <em>architecture</em> meets <em>business</em>: I translate stakeholder requirements into distributed platforms that deliver security, performance and scale — and defend every technical decision in front of whoever signs the contract.",
    "about.body": "At Azion, I'm a technical advisor for enterprise accounts across pre-sales and solution-evolution cycles: I design architectures with distributed applications, origin integration, traffic control, DNS, caching strategies and edge security — including hybrid environments connected to AWS. Before that, at SaveinCloud, I went from support to technical leadership in under two years, leading cloud architecture on Linux, Kubernetes and high-availability open-source stacks. Leadership, to me, is listening, exchange and growing as a team.",
    "stat.years": "years in cloud &amp; edge",
    "stat.certs": "certifications",
    "stat.positions": "career positions",
    "stat.projects": "GitHub projects",

    "label.stack": "Stack",
    "stack.note": "Skills organized by domain — from protocol to boardroom.",
    "sk1.title": "Edge &amp; Performance",
    "sk1.i1": "WAF &amp; edge rules",
    "sk1.i2": "Edge Functions",
    "sk1.i3": "Edge DNS &amp; zone migration",
    "sk1.i4": "CDN, cache strategy &amp; tiered cache",
    "sk1.i5": "Traffic control &amp; routing",
    "sk1.i6": "TLS &amp; Let's Encrypt automation",
    "sk2.title": "Cloud &amp; Infrastructure",
    "sk2.i1": "AWS &amp; hybrid architectures",
    "sk2.i2": "Kubernetes &amp; microservices",
    "sk2.i3": "Docker &amp; containers",
    "sk2.i4": "Linux — tuning &amp; administration",
    "sk2.i5": "Load balancing &amp; high availability",
    "sk2.i6": "Nginx · Apache · IaC (YAML/JPS)",
    "sk3.title": "Security",
    "sk3.i1": "Edge security &amp; mitigation",
    "sk3.i2": "Threat management (Cisco CyberOps)",
    "sk3.i3": "Endpoint &amp; network security",
    "sk3.i4": "Identity &amp; compliance (Microsoft SCI)",
    "sk3.i5": "LGPD &amp; data protection",
    "sk3.i6": "Degree in Information Security",
    "sk4.title": "Data &amp; Observability",
    "sk4.i1": "MySQL · PostgreSQL · Redis",
    "sk4.i2": "RabbitMQ &amp; messaging",
    "sk4.i3": "Monitoring (OpMon · Linux)",
    "sk4.i4": "Power BI &amp; analytics",
    "sk4.i5": "Azure Data Fundamentals",
    "sk5.title": "Engineering &amp; AI",
    "sk5.i1": "TypeScript &amp; Node.js",
    "sk5.i2": "Python",
    "sk5.i3": "AI Agents, MCP &amp; ChatOps",
    "sk5.i4": "RAG &amp; LLM applications",
    "sk5.i5": "PHP · Bash · React · Spring Boot",
    "sk6.title": "Leadership &amp; Business",
    "sk6.i1": "Technical pre-sales &amp; advisory",
    "sk6.i2": "Team leadership (Tech Lead)",
    "sk6.i3": "Value-driven architecture",
    "sk6.i4": "Stakeholder communication",
    "sk6.i5": "Professional English (B2 TOEIC)",

    "label.exp": "Experience",
    "xp1.period": "Aug 2025 — present",
    "xp1.desc": "Solution design for enterprise clients combining cloud, edge, networking and security. Technical advisor in pre-sales; architectures with distributed applications, origin integration, traffic control, DNS, cache, edge security and performance optimization — including hybrid environments connected to AWS.",
    "xp2.co": "Oct 2023 — Aug 2025",
    "xp2.period": "1 yr 11 mos",
    "xp2.desc": "From the front line of support to technical leadership: solutions with Linux servers, web applications, databases, load balancing, monitoring and high availability. Open-source environments (Apache, Nginx, MySQL, PostgreSQL, Redis), microservices and Kubernetes platforms.",
    "xp2.r1d": "Apr 2025 — Aug 2025",
    "xp2.r2d": "Feb 2025 — Aug 2025",
    "xp2.r3d": "Feb 2024 — Feb 2025",
    "xp2.r4d": "Oct 2023 — Feb 2024",
    "xp3.period": "Aug 2023 — Oct 2023",
    "xp3.desc": "Technical-commercial activities with cybersecurity solutions alongside partners, distributors and vendors — proposals aligned with technical requirements and business needs.",
    "xp4.period": "Jan 2023 — Jul 2023",
    "xp4.desc": "Infrastructure, networking and support — the start of the journey in tech.",

    "label.proj": "Projects",
    "proj.note": "A selection of what I build when no one asked — straight from <a href=\"https://github.com/davivinco\" target=\"_blank\" rel=\"noopener\">GitHub</a>, with live data.",

    "label.edu": "Education",
    "edu0.title": "MBA in Software Engineering for Applied AI",
    "edu0.period": "2026 — 2027 · in progress",
    "edu1.title": "MBA in Strategic Management &amp; Innovation",
    "edu1.period": "2026 · in progress",
    "edu2.title": "Associate Degree in Information Security",
    "edu2.period": "2023 — 2026",
    "edu3.title": "Technical Degree in Systems Development",
    "edu.certsHead": "Certifications",
    "cert.harvard": "CC50 — Introduction to Computer Science",
    "cert.ada": "Back-End (Node.js) · Tech Fundamentals · Math Fundamentals",
    "cert.udemy": "Docker for Devs · Linux Server Monitoring · Web Server Load Balance · MySQL · Full-stack (Node, React, Spring Boot) · Leadership with Emotional Intelligence",
    "cert.bradesco": "LGPD · IT Security · Ethics in Development · AI &amp; Digital Culture",
    "cert.othersLabel": "Others",
    "cert.others": "Power BI Series (Xperiun) · OpMon Advanced Monitoring (OpServices) · Computer Networks (Curso em Vídeo) · English B2 (TOEIC)",
    "edu.volHead": "Volunteering",
    "edu.vol": "<strong>Instructor</strong> — Fatec Americana · 2024. I taught computer classes to youth and adults in vulnerable situations, alongside fellow students.",

    "label.contact": "Contact",
    "contact.title": "Let's <span class=\"accent\">build?</span>",
    "contact.note": "Open to conversations about edge, cloud and security.",

    "footer.loc": "Brazil",
    "footer.top": "Back to top ↑",
  };

  const META = {
    pt: {
      htmlLang: "pt-BR",
      title: "Davi Vinco — Solutions Architect",
      desc: "Davi Vinco — Solutions Architect II na Azion. Edge Computing, Cloud e Segurança da Informação.",
    },
    en: {
      htmlLang: "en",
      title: "Davi Vinco — Solutions Architect",
      desc: "Davi Vinco — Solutions Architect II at Azion. Edge Computing, Cloud and Information Security.",
    },
  };

  // Capture the inline Portuguese as the baseline before any swap.
  const i18nEls = [...document.querySelectorAll("[data-i18n]")];
  const ptBaseline = new WeakMap();
  i18nEls.forEach((el) => ptBaseline.set(el, el.innerHTML));

  let currentLang = "pt";

  function applyLang(lang) {
    currentLang = lang === "en" ? "en" : "pt";

    i18nEls.forEach((el) => {
      const key = el.dataset.i18n;
      if (currentLang === "en" && EN[key] != null) {
        el.innerHTML = EN[key];
      } else {
        el.innerHTML = ptBaseline.get(el);
      }
    });

    const meta = META[currentLang];
    document.documentElement.lang = meta.htmlLang;
    document.title = meta.title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute("content", meta.desc);

    document.querySelectorAll(".lang-btn").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.lang === currentLang)
    );

    try { localStorage.setItem("lang", currentLang); } catch (_) {}
    history.replaceState(null, "", currentLang === "en" ? "/en" : "/");

    if (lastRepos) renderProjects(lastRepos);
  }

  function detectLang() {
    const path = location.pathname.toLowerCase();
    if (path.startsWith("/en")) return "en";
    if (path.startsWith("/pt")) return "pt";
    let stored = null;
    try { stored = localStorage.getItem("lang"); } catch (_) {}
    if (stored === "en" || stored === "pt") return stored;
    return "pt";
  }

  document.querySelectorAll(".lang-btn").forEach((btn) =>
    btn.addEventListener("click", () => applyLang(btn.dataset.lang))
  );

  /* ---------- projects: live from GitHub, curated order ---------- */
  const list = document.getElementById("projectsList");
  let lastRepos = null;

  const CURATED = {
    "azion-ai-agent-mvp": {
      featured: true,
      tag: { pt: "Destaque", en: "Featured" },
      desc: {
        pt: "Plataforma de ChatOps com IA para provisionamento de infraestrutura de borda: pedidos em português natural viram um plano de execução validável — e, só após aprovação humana, o agente executa contra a API v4 da Azion via fila assíncrona.",
        en: "AI-powered ChatOps platform for provisioning edge infrastructure: natural-language requests become a validatable execution plan — and only after human approval does the agent run against Azion's v4 API through an async queue.",
      },
      highlights: {
        pt: [
          "Planner híbrido (rules-based + LLM) gera planos JSON revisáveis antes de qualquer execução",
          "Execução assíncrona com Redis Streams, status em tempo real e histórico persistido em SQLite",
          "Parser de DNS multi-provider: Cloudflare (CSV/BIND), Route53 (JSON) e zone-files RFC1035",
          "Migração completa de domínios proxied: Connector, Firewall + WAF, Workload e certificado Let's Encrypt via desafio DNS-01",
          "Security by default: todo recurso nasce desativado até aprovação explícita",
        ],
        en: [
          "Hybrid planner (rules-based + LLM) generates reviewable JSON plans before any execution",
          "Async execution with Redis Streams, real-time status and history persisted in SQLite",
          "Multi-provider DNS parser: Cloudflare (CSV/BIND), Route53 (JSON) and RFC1035 zone-files",
          "Full proxied-domain migration: Connector, Firewall + WAF, Workload and Let's Encrypt certificate via DNS-01 challenge",
          "Security by default: every resource is created disabled until explicitly approved",
        ],
      },
      chips: ["TypeScript", "LLM Planner", "MCP", "Redis Streams", "SQLite", "Azion API v4", "Let's Encrypt"],
    },
    "azion-rag-chat": {
      desc: {
        pt: "Chat com RAG (Retrieval-Augmented Generation) construído em TypeScript: pipeline de embeddings e recuperação de contexto para respostas precisas sobre a plataforma Azion, com fundamentação em documentação real.",
        en: "RAG (Retrieval-Augmented Generation) chat built in TypeScript: an embeddings and context-retrieval pipeline for precise answers about the Azion platform, grounded in real documentation.",
      },
      chips: ["TypeScript", "RAG", "Embeddings", "LLM"],
    },
    "davi-vinco-site": {
      desc: {
        pt: "Este portfólio: single-page em HTML/CSS/JS puro, sem framework ou build step. Publicado em produção sobre um Ubuntu 22.04 com Nginx, TLS terminado na borda pela Azion.",
        en: "This portfolio: a single-page site in pure HTML/CSS/JS, no framework or build step. Running in production on Ubuntu 22.04 with Nginx, TLS terminated at the edge by Azion.",
      },
      highlights: {
        pt: [
          "Zero dependências de build — três arquivos estáticos, deploy por rsync",
          "Seção de projetos consome a API do GitHub em tempo real, com fallback estático",
          "Arquitetura de entrega: cliente → HTTPS na borda (Azion) → HTTP simples até a origem",
        ],
        en: [
          "Zero build dependencies — three static files, deployed via rsync",
          "Projects section consumes the GitHub API in real time, with a static fallback",
          "Delivery architecture: client → HTTPS at the edge (Azion) → plain HTTP to the origin",
        ],
      },
      chips: ["HTML/CSS/JS", "Nginx", "Ubuntu 22.04", "Azion Edge"],
    },
  };

  const FALLBACK = Object.keys(CURATED).map((name) => ({
    name,
    html_url: `https://github.com/davivinco/${name}`,
    language: name.startsWith("azion") ? "TypeScript" : name === "davi-vinco-site" ? "HTML" : "YAML",
    pushed_at: null,
  }));

  function loc(field) {
    if (field == null) return null;
    return typeof field === "object" ? field[currentLang] : field;
  }

  function renderProjects(repos) {
    lastRepos = repos;
    const order = Object.keys(CURATED);
    const picked = repos
      .filter((r) => order.includes(r.name))
      .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

    const items = picked.length ? picked : FALLBACK;
    const dateLocale = currentLang === "en" ? "en-US" : "pt-BR";
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
        parts.push(new Date(repo.pushed_at).toLocaleDateString(dateLocale, { month: "short", year: "numeric" }));
      }

      const hl = loc(meta.highlights);
      const highlights = hl
        ? `<ul class="project-highlights">${hl.map((h) => `<li>${h}</li>`).join("")}</ul>`
        : "";
      const chips = meta.chips
        ? `<div class="project-chips">${meta.chips.map((c) => `<span>${c}</span>`).join("")}</div>`
        : "";
      const tag = loc(meta.tag);

      a.innerHTML = `
        <div class="project-head">
          <h3>${repo.name} <span class="arrow">↗</span></h3>
          <span class="project-meta">${parts.filter(Boolean).join(" · ")}</span>
        </div>
        <p>${loc(meta.desc) || repo.description || (currentLang === "en" ? "Project on GitHub." : "Projeto no GitHub.")}</p>
        ${highlights}
        ${chips}
        ${tag ? `<span class="tag">${tag}</span>` : ""}`;

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

  // Set the initial language before projects load so the first render matches.
  applyLang(detectLang());

  fetch("https://api.github.com/users/davivinco/repos?per_page=100")
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(renderProjects)
    .catch(() => renderProjects(FALLBACK));
})();
