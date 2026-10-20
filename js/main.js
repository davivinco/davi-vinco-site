/* ============================================================
   DAVI VINCO: the split stage, interactions
   Zero dependencies. Everything here enhances a page that
   already reads in full without it.
   ============================================================ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ============================================================
     i18n: Portuguese is the inline default (captured from the
     DOM); English lives in the dictionary below.
     ============================================================ */

  const EN = {
    "skip": "Skip to content",
    "aria.nav": "Main",
    "aria.lang": "Ler em português",
    "aria.about": "About",
    "nav.menu": "Menu",
    "nav.exp": "Experience",
    "nav.proj": "Projects",
    "nav.stack": "Stack",
    "nav.edu": "Education",
    "nav.contact": "Contact",
    "nav.lang": "Português",

    "alt.portrait": "Portrait of Davi Vinco: dark hair swept up, short beard, black t-shirt, smiling, on a grey background",

    "hero.line": "Senior Solutions Architect at SaveinCloud: cloud, edge and security for enterprises.",

    "about.p1": "I design architectures that have to hold up under real pressure: global traffic, attacks, traffic spikes and business deadlines.",
    "about.p2": "I turn what decision-makers need into distributed platforms with security, performance and scale, and I defend every technical decision in front of whoever signs the contract.",
    "about.p3": "I started in support at SaveinCloud in 2023 and was leading its cloud architecture 18 months later. At Azion, I was technical advisor to enterprise accounts: WAF, DNS, caching, Edge Functions and hybrid setups with AWS.",
    "about.p4": "Today I’m back at SaveinCloud as a Senior Solutions Architect. Leadership, to me, is listening, exchange and growing as a team. <a href=\"#experiencia\" class=\"link link--on\">See the path</a>",

    "route.title": "The path to you",
    "route.note": "It’s what I design every day. These are the real timings of the request that brought this page to your browser, measured just now.",
    "slip.g1": "Opening the way",
    "slip.dns": "DNS lookup",
    "slip.tcp": "TCP connection",
    "slip.tls": "TLS handshake",
    "slip.g2": "Request and response",
    "slip.ttfb": "Time to first byte",
    "slip.dl": "HTML download",
    "slip.size": "Transferred",
    "slip.g3": "In your browser",
    "slip.dom": "HTML parsed",
    "slip.load": "Page complete",
    "slip.again": "Measure again",
    "slip.privacy": "Measured by your browser with the Navigation Timing API. No data leaves this page.",

    "xp.title": "Experience",
    "xp.sub": "Eight roles at four companies since 2023.",
    "xp0.when": "Oct 2026 – present",
    "xp0.desc": "Back at SaveinCloud, now in solutions architecture: designing environments on Nuvion, Cloudlets and Storin, estimates and technical pre-sales for companies moving their applications to the cloud.",
    "xp1.when": "Aug 2025 – Sep 2026",
    "xp1.desc": "Solution design for enterprise clients combining cloud, edge, networking and security. Technical advisor in pre-sales: distributed applications, origin integration, traffic control, DNS, caching, edge security and performance, including hybrid environments connected to AWS.",
    "xp2.r1": "Apr 2025 – Aug 2025",
    "xp2.r2": "Feb 2025 – Aug 2025",
    "xp2.r3": "Feb 2024 – Feb 2025",
    "xp2.r4": "Oct 2023 – Feb 2024",
    "xp2.desc": "From the front line of support to technical leadership: Linux servers, web applications, databases, load balancing, monitoring and high availability. Apache, Nginx, MySQL, PostgreSQL, Redis, microservices and Kubernetes.",
    "xp3.when": "Aug 2023 – Oct 2023",
    "xp3.desc": "Technical and commercial work on cybersecurity solutions with partners, distributors and vendors, with proposals matched to technical and business requirements.",
    "xp4.when": "Jan 2023 – Jul 2023",
    "xp4.desc": "Infrastructure, networking and support. Where the journey in tech began.",

    "frag.agent": "The agent’s interface: a request in Portuguese becomes a five-step plan waiting for confirmation",
    "frag.impact": "Impact Study report with before and after metrics: TTFB from 620 to 330 ms, LCP from 3.2 to 2.1 s",
    "frag.compat": "Compatibility validator: express and sharp incompatible, axios partial, lodash, zod and jose compatible",
    "frag.rule": "Rule builder: if Request URI starts with /wp-admin, Deny, applied to every firewall in the account",
    "frag.rag": "RAG chat: a question about certificates answered with two cited sources",

    "proj.title": "Projects",
    "proj.note": "What I build when no one asked, straight from <a class=\"link link--on\" href=\"https://github.com/davivinco\" target=\"_blank\" rel=\"noopener\">GitHub</a>.",
    "proj.t1": "ChatOps agent",
    "p1.title": "A ChatOps agent for Azion",
    "p1.desc": "Requests in plain Portuguese become a reviewable execution plan. Only after human approval does the agent run it against Azion’s v4 API, through an async queue.",
    "p1.h1": "A hybrid planner, rules-based or LLM, writes a JSON plan before anything runs.",
    "p1.h2": "Redis Streams with live status and history persisted in SQLite.",
    "p1.h3": "Imports DNS from Cloudflare, Route53 and RFC 1035 zone files.",
    "p1.h4": "Migrates proxied domains with firewall, WAF, workload and a Let’s Encrypt certificate via DNS-01.",
    "p1.h5": "Every resource is created disabled until explicitly approved.",
    "p2.desc": "Builds the executive before-and-after report of a CDN migration from two WebPageTest exports. The numbers come from code; the AI only writes the prose, and every sentence is checked against the data.",
    "p2.h1": "The WebPageTest JSONs never leave the browser.",
    "p2.h2": "Changes under 5% become a “technical tie”, never a story of gains.",
    "p2.h3": "If the AI fails or makes things up, a deterministic narrative takes over.",
    "p2.h4": "Runs on an Azion Edge Function with Qwen3 and exports a PDF on A4 sheets.",
    "p3.desc": "Tells whether a project’s dependencies run on the Azion Runtime and gives a deploy verdict. Deterministic rules first; AI only for what isn’t catalogued, always flagged as a suggestion.",
    "p3.h1": "Takes a package.json, a loose list or a pasted npm install line.",
    "p3.h2": "devDependencies and build tools never block the deploy.",
    "p3.h3": "Unknown packages go to the AI in concurrent batches.",
    "p3.h4": "UI and API served by a single Edge Function.",
    "p4.desc": "Builds an Edge Firewall rule once and applies it to every firewall in the account, with a dry run first. Talks to the v3 and v4 APIs without the rest of the program knowing which one is in use.",
    "p4.h1": "Python 3.8+ and the standard library only, no dependencies.",
    "p4.h2": "Simulates the plan before applying it to the fleet.",
    "p4.h3": "The same rule is a NOOP on both API versions.",
    "p4.h4": "A built-in fake API for testing without touching the account.",
    "p5.desc": "Retrieval-augmented generation that runs entirely at the edge: embeddings and answers through Azion AI Inference; documents, chunks and vectors in Edge SQL.",
    "p5.h1": "Document ingestion with text extraction and chunking.",
    "p5.h2": "Vector search in Edge SQL, with no external infrastructure.",
    "p5.h3": "Answers come with the sources they used.",
    "p5.h4": "Guardrails before and after generation.",
    "proj.more": "Also on GitHub: SaveinCloud’s cost estimate calculator, a Next.js-on-Azion deploy manual, a METAR reader and a RabbitMQ install via JPS.",
    "proj.code": "View the code",
    "proj.all": "All repositories",

    "stack.note": "Skills by domain, from the protocol to the boardroom.",
    "sk1.title": "Edge and performance",
    "sk1.i1": "WAF and edge rules",
    "sk1.i3": "Edge DNS and zone migration",
    "sk1.i4": "CDN, caching and tiered cache",
    "sk1.i5": "Traffic control and routing",
    "sk1.i6": "TLS and Let’s Encrypt automation",
    "sk2.title": "Cloud and infrastructure",
    "sk2.i1": "AWS and hybrid architectures",
    "sk2.i2": "Kubernetes and microservices",
    "sk2.i3": "Docker and containers",
    "sk2.i4": "Linux tuning and administration",
    "sk2.i5": "Load balancing and high availability",
    "sk2.i6": "Nginx, Apache and IaC (YAML, JPS)",
    "sk3.title": "Security",
    "sk3.i1": "Edge security and mitigation",
    "sk3.i2": "Threat management (Cisco CyberOps)",
    "sk3.i3": "Endpoint and network security",
    "sk3.i4": "Identity and compliance (Microsoft SCI)",
    "sk3.i5": "LGPD and data protection",
    "sk3.i6": "Degree in Information Security",
    "sk4.title": "Data and observability",
    "sk4.i2": "RabbitMQ and messaging",
    "sk4.i3": "Monitoring with OpMon and Linux",
    "sk4.i4": "Power BI and analytics",
    "sk5.title": "Engineering and AI",
    "sk5.i3": "AI agents, MCP and ChatOps",
    "sk5.i4": "RAG and LLM applications",
    "sk6.title": "Leadership and business",
    "sk6.i1": "Technical pre-sales and advisory",
    "sk6.i2": "Leading a team as tech lead",
    "sk6.i3": "Value-driven architecture",
    "sk6.i4": "Stakeholder communication",
    "sk6.i5": "Professional English, B2 on the TOEIC",

    "edu.title": "Education",
    "edu.sub": "Four degrees, more than 25 certifications and volunteer teaching.",
    "edu.k1": "Degrees",
    "edu0.t": "Postgraduate degree (Lato Sensu) in Software Engineering for Applied AI",
    "edu0.s": "UNIPDS, 2026–2027, in progress",
    "edu1.t": "MBA in Strategic Management and Innovation",
    "edu1.s": "Faculdade Focus, 2026, in progress",
    "edu2.t": "Associate degree in Information Security",
    "edu3.t": "Technical degree in Systems Development",
    "edu.k2": "Certifications",
    "cert.harvard": "CC50, Introduction to Computer Science",
    "cert.ada": "Back-end with Node.js, tech and maths fundamentals",
    "cert.udemy": "Docker, Linux server monitoring, load balancing, MySQL, full stack with Node, React and Spring Boot, leadership with emotional intelligence",
    "cert.bradesco": "LGPD, IT security, ethics in development, AI and digital culture",
    "cert.othersLabel": "Others",
    "cert.others": "Power BI (Xperiun), OpMon (OpServices), computer networks (Curso em Vídeo), English B2 (TOEIC)",
    "edu.k3": "Volunteering",
    "vol.t": "Instructor",
    "vol.s": "Fatec Americana, 2024. Computer classes for young people and adults in vulnerable situations, alongside fellow students.",

    "contact.title": "Let’s build?",
    "contact.note": "Open to conversations about cloud, edge and security. Write a subject and your email app opens with the message ready.",
    "contact.nameLabel": "Your name",
    "contact.name": "Your name",
    "contact.subjectLabel": "Subject",
    "contact.subject": "Subject",
    "contact.send": "Write an email",

    "footer.top": "Back to top",
    "footer.legal": "© 2026 Davi Vinco. São Paulo, Brazil. Plain HTML, CSS and JavaScript, no build step.",
  };

  // Strings the script writes itself.
  const STR = {
    pt: {
      slipTitle: "Requisição desta página",
      slipAgain: "Nova medição",
      total: "HTML entregue em",
      totalAgain: "Resposta completa em",
      reused: "reaproveitada",
      cached: "em cache",
      none: "sem TLS",
      fromCache: "cache do navegador",
      na: "não se aplica",
      failed: "Não foi possível medir agora.",
      server: "Respondido por",
      updated: "atualizado em",
      mailHello: "Olá, Davi.",
      mailSubject: "Contato pelo site",
      locale: "pt-BR",
    },
    en: {
      slipTitle: "This page’s request",
      slipAgain: "New measurement",
      total: "HTML delivered in",
      totalAgain: "Full response in",
      reused: "reused",
      cached: "cached",
      none: "no TLS",
      fromCache: "browser cache",
      na: "not applicable",
      failed: "Could not measure right now.",
      server: "Answered by",
      updated: "updated",
      mailHello: "Hi Davi,",
      mailSubject: "Hello from your site",
      locale: "en-US",
    },
  };

  const META = {
    pt: {
      htmlLang: "pt-BR",
      title: "Davi Vinco, Solutions Architect Senior",
      desc: "Davi Vinco, Solutions Architect Senior na SaveinCloud. Arquitetura de cloud, edge e segurança da informação para empresas.",
    },
    en: {
      htmlLang: "en",
      title: "Davi Vinco, Senior Solutions Architect",
      desc: "Davi Vinco, Senior Solutions Architect at SaveinCloud. Cloud, edge and information security architecture for enterprises.",
    },
  };

  const i18nEls = [...document.querySelectorAll("[data-i18n]")];
  const ptBaseline = new WeakMap();
  i18nEls.forEach((el) => ptBaseline.set(el, el.innerHTML));

  const attrEls = [...document.querySelectorAll("[data-i18n-attr]")];
  const ptAttrs = new WeakMap();
  attrEls.forEach((el) => {
    const pairs = el.dataset.i18nAttr.split(";").map((p) => p.split(":").map((s) => s.trim()));
    ptAttrs.set(el, pairs.map(([attr, key]) => [attr, key, el.getAttribute(attr)]));
  });

  const langBtn = document.getElementById("langToggle");
  let lang = "pt";
  const s = () => STR[lang];

  function applyLang(next) {
    lang = next === "en" ? "en" : "pt";

    i18nEls.forEach((el) => {
      const key = el.dataset.i18n;
      el.innerHTML = lang === "en" && EN[key] != null ? EN[key] : ptBaseline.get(el);
    });
    attrEls.forEach((el) => {
      for (const [attr, key, pt] of ptAttrs.get(el)) {
        el.setAttribute(attr, lang === "en" && EN[key] != null ? EN[key] : pt);
      }
    });

    const meta = META[lang];
    document.documentElement.lang = meta.htmlLang;
    document.title = meta.title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute("content", meta.desc);
    if (langBtn) langBtn.setAttribute("lang", lang === "en" ? "pt-BR" : "en");

    try { localStorage.setItem("lang", lang); } catch (_) {}
    if (/^https?:$/.test(location.protocol)) {
      try { history.replaceState(null, "", (lang === "en" ? "/en" : "/") + location.hash); } catch (_) {}
    }

    if (lastMeasure) renderSlip(lastMeasure, false);
    renderRepoMeta();
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

  if (langBtn) langBtn.addEventListener("click", () => applyLang(lang === "en" ? "pt" : "en"));

  /* ============================================================
     Section entrances: once, in reading order
     ============================================================ */
  const revealIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          revealIO.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => revealIO.observe(el));

  /* ============================================================
     The live thing: this page's own request, as an itinerary
     ============================================================ */
  const slip = document.getElementById("slip");
  const slipTitle = document.getElementById("slipTitle");
  const slipTime = document.getElementById("slipTime");
  const slipProto = document.getElementById("slipProto");
  const slipTotal = document.getElementById("slipTotal");
  const slipTotalLabel = document.getElementById("slipTotalLabel");
  const slipServer = document.getElementById("slipServer");
  const againBtn = document.getElementById("remeasure");
  let lastMeasure = null;
  let slipSeen = false;
  let pendingPrint = false;

  const r = (v) => (v > 0 ? Math.max(0, v) : 0);

  function protoName(p) {
    if (!p) return "";
    if (p === "h2") return "HTTP/2";
    if (p === "h3" || p.startsWith("h3")) return "HTTP/3";
    if (p.startsWith("http/")) return p.toUpperCase();
    return p;
  }

  function measureFrom(t, kind) {
    const dns = r(t.domainLookupEnd - t.domainLookupStart);
    const tcpEnd = t.secureConnectionStart > 0 ? t.secureConnectionStart : t.connectEnd;
    const tcp = r(tcpEnd - t.connectStart);
    const tls = t.secureConnectionStart > 0 ? r(t.connectEnd - t.secureConnectionStart) : null;
    const reused = t.connectEnd - t.connectStart <= 0 && dns <= 0;
    return {
      kind,
      at: kind === "nav" ? performance.timeOrigin : performance.timeOrigin + t.startTime,
      proto: t.nextHopProtocol || "",
      dns, tcp, tls, reused,
      secure: location.protocol === "https:",
      ttfb: r(t.responseStart - t.requestStart),
      dl: r(t.responseEnd - t.responseStart),
      size: typeof t.transferSize === "number" ? t.transferSize : null,
      body: t.encodedBodySize || 0,
      dom: kind === "nav" ? r(t.domContentLoadedEventEnd) : null,
      load: kind === "nav" ? r(t.loadEventEnd) : null,
      total: r(t.responseEnd - t.startTime),
      server: null,
    };
  }

  const fmtMs = (v) => (v < 1 ? "< 1 ms" : Math.round(v).toLocaleString(s().locale) + " ms");

  function fmtSize(m) {
    if (m.size === 0 && m.body > 0) return s().fromCache;
    const bytes = m.size || m.body;
    if (!bytes) return "—";
    const kb = bytes / 1000;
    return (kb < 10 ? kb.toFixed(1) : Math.round(kb)).toLocaleString(s().locale) + " kB";
  }

  function rowValue(m, k) {
    switch (k) {
      case "dns": return m.reused ? { text: s().cached } : { ms: m.dns };
      case "tcp": return m.reused ? { text: s().reused } : { ms: m.tcp };
      case "tls":
        if (m.reused) return { text: s().reused };
        if (m.tls == null) return { text: m.secure ? "< 1 ms" : s().none };
        return { ms: m.tls };
      case "ttfb": return { ms: m.ttfb };
      case "dl": return { ms: m.dl };
      case "size": return { text: fmtSize(m) };
      case "dom": return m.dom == null ? { text: s().na } : { ms: m.dom };
      case "load": return m.load == null ? { text: s().na } : { ms: m.load };
      default: return { text: "—" };
    }
  }

  function countUp(el, target, delay) {
    if (reduceMotion.matches || target < 1) { el.textContent = fmtMs(target); return; }
    el.textContent = fmtMs(0);
    const dur = 700;
    setTimeout(() => {
      const t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = fmtMs(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }, delay);
  }

  function renderSlip(m, animate) {
    lastMeasure = m;
    slipTitle.textContent = m.kind === "nav" ? s().slipTitle : s().slipAgain;
    slipTime.textContent = new Date(m.at).toLocaleString(s().locale, {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    slipProto.textContent = protoName(m.proto);
    slipTotalLabel.textContent = m.kind === "nav" ? s().total : s().totalAgain;

    if (m.server) {
      slipServer.hidden = false;
      slipServer.textContent = s().server + " " + m.server;
    } else {
      slipServer.hidden = true;
    }

    // Number every printed line so they appear top to bottom.
    let p = 0;
    for (const el of slip.querySelectorAll(".slip-group, .slip-row, .slip-total")) {
      el.style.setProperty("--p", p++);
    }

    slip.querySelectorAll(".slip-row").forEach((row) => {
      const dd = row.querySelector("dd");
      const v = rowValue(m, row.dataset.k);
      const delay = (parseFloat(row.style.getPropertyValue("--p")) || 0) * 70;
      if (v.ms != null) {
        if (animate) countUp(dd, v.ms, delay); else dd.textContent = fmtMs(v.ms);
      } else {
        dd.textContent = v.text;
      }
    });
    if (animate) countUp(slipTotal, m.total, p * 70); else slipTotal.textContent = fmtMs(m.total);

    if (animate) print();
  }

  function print() {
    if (!slipSeen) { pendingPrint = true; return; }
    slip.classList.remove("is-printed");
    void slip.offsetWidth;
    slip.classList.add("is-printed");
  }

  if (slip) {
    const slipIO = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          slipSeen = true;
          slipIO.disconnect();
          if (lastMeasure) renderSlip(lastMeasure, true);
          else if (pendingPrint) print();
        }
      },
      { threshold: 0.25 }
    );
    slipIO.observe(slip);

    const readNavigation = () => {
      const nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
      if (!nav || !nav.loadEventEnd) return false;
      const m = measureFrom(nav, "nav");
      if (slipSeen) renderSlip(m, true); else lastMeasure = m;
      return true;
    };
    if (document.readyState === "complete") {
      setTimeout(() => readNavigation() || setTimeout(readNavigation, 300), 0);
    } else {
      window.addEventListener("load", () => setTimeout(readNavigation, 0), { once: true });
    }
  }

  if (againBtn) {
    againBtn.addEventListener("click", async () => {
      againBtn.disabled = true;
      const url = new URL(location.pathname, location.href);
      url.searchParams.set("medir", Date.now().toString(36));
      try {
        const res = await fetch(url.href, { cache: "no-store", credentials: "same-origin" });
        await res.text();
        await new Promise((ok) => setTimeout(ok, 30));
        const entries = performance.getEntriesByName(url.href);
        const entry = entries[entries.length - 1];
        if (!entry) throw new Error("no timing");
        const m = measureFrom(entry, "again");
        const server = [res.headers.get("server"), res.headers.get("x-cache")].filter(Boolean).join(", ");
        m.server = server || null;
        renderSlip(m, true);
      } catch (_) {
        slipServer.hidden = false;
        slipServer.textContent = s().failed;
      } finally {
        againBtn.disabled = false;
      }
    });
  }

  /* ============================================================
     Projects: tabs over the interface fragments
     ============================================================ */
  const tabs = [...document.querySelectorAll(".tab")];
  const frags = [...document.querySelectorAll(".frag")];
  const repoLink = document.getElementById("repoLink");

  function select(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.classList.toggle("is-on", on);
    });
    const repo = tab.dataset.frag;
    frags.forEach((f) => f.classList.toggle("is-on", f.dataset.frag === repo));
    if (repoLink) repoLink.href = "https://github.com/davivinco/" + repo;
    if (focus) tab.focus();
  }

  tabs.forEach((t, i) => {
    t.tabIndex = t.getAttribute("aria-selected") === "true" ? 0 : -1;
    t.addEventListener("click", () => select(t, false));
    t.addEventListener("keydown", (e) => {
      let j = null;
      if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); select(tabs[j], true); }
    });
  });

  /* ---------- live repository data from GitHub ---------- */
  let repos = null;
  function renderRepoMeta() {
    if (!repos) return;
    document.querySelectorAll(".panel[data-repo]").forEach((panel) => {
      const repo = repos.find((x) => x.name === panel.dataset.repo);
      const out = panel.querySelector("[data-meta]");
      if (!repo || !out) return;
      const parts = [];
      if (repo.language) parts.push(repo.language);
      if (repo.pushed_at) {
        const when = new Date(repo.pushed_at).toLocaleDateString(s().locale, { month: "short", year: "numeric" });
        parts.push(s().updated + " " + when);
      }
      out.textContent = parts.join(", ");
    });
  }

  /* ============================================================
     Contact: the three cells write the email for you
     ============================================================ */
  const compose = document.getElementById("compose");
  if (compose) {
    compose.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = compose.elements.nome.value.trim();
      const subject = compose.elements.subject.value.trim() || s().mailSubject;
      const body = s().mailHello + "\n\n\n" + (name ? name + "\n" : "");
      location.href =
        "mailto:davi.vinco.contato@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------- phone menu closes after a choice ---------- */
  const menu = document.querySelector(".menu");
  if (menu) {
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => menu.removeAttribute("open")));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") menu.removeAttribute("open"); });
  }

  /* ---------- go ---------- */
  applyLang(detectLang());

  fetch("https://api.github.com/users/davivinco/repos?per_page=100")
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => { repos = data; renderRepoMeta(); })
    .catch(() => {});
})();
