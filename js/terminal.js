/* ============================================================
   DAVI VINCO: the terminal
   The same page, read from a prompt. Every answer is taken from
   the document itself, so it follows the language in use.
   Opens with T, or from the footer.
   ============================================================ */

(() => {
  "use strict";

  const dialog = document.getElementById("term");
  const out = document.getElementById("termOut");
  const form = document.getElementById("termForm");
  const input = document.getElementById("termIn");
  const opener = document.getElementById("termOpen");
  const closer = document.getElementById("termClose");
  if (!dialog || !dialog.showModal || !form) { if (opener) opener.closest("li").hidden = true; return; }

  const en = () => (window.site && window.site.lang) === "en";
  const T = (pt, eng) => (en() ? eng : pt);
  const text = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");
  const all = (sel) => [...document.querySelectorAll(sel)];

  const SECTIONS = [
    ["sobre", "about", "#sobre"],
    ["rota", "route", "#rota"],
    ["defesa", "defence", "#defesa"],
    ["experiencia", "experience", "#experiencia"],
    ["projetos", "projects", "#projetos"],
    ["stack", "stack", "#stack"],
    ["formacao", "education", "#formacao"],
    ["contato", "contact", "#contato"],
  ];
  const plain = (v) => v.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
  const findSection = (name) => SECTIONS.find(([pt, eng]) => plain(name || "") === pt || plain(name || "") === plain(eng));
  const sectionName = (sec) => (en() ? sec[1] : sec[0]);

  /* ---------- printing ---------- */
  function line(content, cls) {
    const p = document.createElement("p");
    if (cls) p.className = cls;
    if (typeof content === "string") p.textContent = content; else p.append(...content);
    out.append(p);
    out.scrollTop = out.scrollHeight;
    return p;
  }
  const lines = (list, cls) => list.forEach((l) => line(l, cls));
  function link(label, href) {
    const a = document.createElement("a");
    a.textContent = label;
    a.href = href;
    if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  /* ---------- what each file holds ---------- */
  const files = {
    sobre: () => lines(all(".intro-col p").map((p) => text(p).replace(/\s*(Ver a trajetória|See the path)$/, ""))),
    rota: () => line(text(document.querySelector(".route-note"))),
    defesa: () => line(text(document.querySelector(".siege-note"))),
    experiencia: () => all(".ledger-rows li").forEach((li) => {
      line(`${text(li.querySelector(".l-when")).padEnd(22)}${text(li.querySelector(".l-role"))}, ${text(li.querySelector(".l-co"))}`);
    }),
    projetos: () => all(".tab").forEach((tab) => {
      line([text(tab).padEnd(20), link(T("ver o código", "view the code"), "https://github.com/davivinco/" + tab.dataset.frag)]);
    }),
    stack: () => all(".bar-row").forEach((row) => {
      line(text(row.querySelector("summary span")), "t-strong");
      line("  " + [...row.querySelectorAll(".bar-items li")].map(text).join(", "));
    }),
    formacao: () => all(".names-kind").forEach((kind) => {
      line(text(kind.querySelector(".kind")), "t-strong");
      kind.querySelectorAll(".nm").forEach((nm) => {
        const spans = nm.querySelectorAll(":scope > span");
        line("  " + [...(spans.length ? spans : [nm])].map(text).filter(Boolean).join(". "));
      });
    }),
    contato: () => all(".direct a").forEach((a) => line([link(text(a), a.href)])),
  };

  /* ---------- commands ---------- */
  function go(sec) {
    close();
    const target = document.querySelector(sec[2]);
    if (target) target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  const commands = {
    help() {
      const rows = en()
        ? [["whoami", "who this is"], ["ls", "list the sections"], ["cat <section>", "print a section"], ["cd <section>", "go to a section"],
           ["ping", "measure a real request to this server"], ["attack", "launch the attack simulator (attack stop ends it)"],
           ["lang pt|en", "switch language"], ["clear", "clear the screen"], ["exit", "close the terminal"]]
        : [["whoami", "quem é"], ["ls", "lista as seções"], ["cat <seção>", "imprime uma seção"], ["cd <seção>", "vai até uma seção"],
           ["ping", "mede uma requisição real a este servidor"], ["ataque", "lança o simulador de ataque (ataque parar encerra)"],
           ["lang pt|en", "troca o idioma"], ["clear", "limpa a tela"], ["exit", "fecha o terminal"]];
      rows.forEach(([cmd, what]) => line(cmd.padEnd(16) + what));
    },
    whoami() {
      line("Davi Vinco", "t-strong");
      line(text(document.querySelector(".hero-line")));
    },
    ls() { line(SECTIONS.map(sectionName).join("   ")); },
    cat(arg) {
      if (!arg) return line(T("uso: cat <seção>. Tente: cat experiencia", "usage: cat <section>. Try: cat experience"), "t-dim");
      const sec = findSection(arg);
      if (!sec) return line(T(`cat: ${arg}: seção não encontrada. Use ls.`, `cat: ${arg}: no such section. Use ls.`), "t-bad");
      files[sec[0]]();
    },
    cd(arg) {
      if (!arg || arg === "~" || arg === "/") { close(); window.scrollTo({ top: 0 }); return; }
      const sec = findSection(arg);
      if (!sec) return line(T(`cd: ${arg}: seção não encontrada. Use ls.`, `cd: ${arg}: no such section. Use ls.`), "t-bad");
      go(sec);
    },
    async ping() {
      if (!window.site) return;
      const wait = line(T("medindo…", "measuring…"), "t-dim");
      try {
        const m = await window.site.measure();
        const f = window.site.fmtMs;
        wait.remove();
        line(`HTTP ${m.status}  ${window.site.protoName(m.proto)}${m.server ? "  " + m.server : ""}`.trim());
        const conn = m.reused
          ? T("conexão reaproveitada", "connection reused")
          : `dns ${f(m.dns)}  tcp ${f(m.tcp)}${m.tls != null ? "  tls " + f(m.tls) : ""}`;
        line(`${conn}  ${T("espera", "wait")} ${f(m.ttfb)}  download ${f(m.dl)}`);
        line(`total ${f(m.total)}`, "t-strong");
      } catch (_) {
        wait.textContent = T("Não foi possível medir agora.", "Could not measure right now.");
        wait.className = "t-bad";
      }
    },
    attack(arg) {
      if (!window.siege) return;
      const stop = /^(stop|parar|off)$/.test(arg || "");
      window.siege.attack(!stop);
      close();
    },
    lang(arg) {
      if (arg !== "pt" && arg !== "en") return line(T("uso: lang pt|en", "usage: lang pt|en"), "t-dim");
      window.site.setLang(arg);
      line(arg === "en" ? "Language set to English." : "Idioma: português.");
    },
    date() { line(new Date().toLocaleString(en() ? "en-US" : "pt-BR", { dateStyle: "full", timeStyle: "medium" })); },
    echo(arg, rest) { line(rest); },
    clear() { out.textContent = ""; },
    exit() { close(); },
    sudo() { line(T("visitante não está no arquivo sudoers. Boa tentativa.", "visitor is not in the sudoers file. Nice try."), "t-bad"); },
  };
  const alias = { ajuda: "help", "?": "help", dir: "ls", ataque: "attack", curl: "ping", medir: "ping", open: "cd", ir: "cd", sair: "exit", quit: "exit", cls: "clear", idioma: "lang" };

  const history = [];
  let cursor = 0;

  async function run(raw) {
    const value = raw.trim();
    line([Object.assign(document.createElement("span"), { className: "t-prompt", textContent: "$ " }), value], "t-cmd");
    if (!value) return;
    history.push(value);
    cursor = history.length;
    const [first, ...rest] = value.split(/\s+/);
    const name = alias[first.toLowerCase()] || first.toLowerCase();
    const cmd = Object.prototype.hasOwnProperty.call(commands, name) ? commands[name] : null;
    if (!cmd) return line(T(`${first}: comando não encontrado. Digite help.`, `${first}: command not found. Type help.`), "t-bad");
    await cmd(rest[0], rest.join(" "));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value;
    input.value = "";
    run(value);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    if (!history.length) return;
    e.preventDefault();
    cursor = Math.max(0, Math.min(history.length, cursor + (e.key === "ArrowUp" ? -1 : 1)));
    input.value = history[cursor] || "";
  });

  /* ---------- opening and closing ---------- */
  function open() {
    if (dialog.open) return;
    dialog.showModal();
    if (!out.childElementCount) {
      line(T("Você achou o terminal. Este é o mesmo site, lido pelo prompt.", "You found the terminal. This is the same site, read from a prompt."));
      line(T("Digite help para ver os comandos.", "Type help to see the commands."), "t-dim");
    }
    input.focus();
  }
  function close() { if (dialog.open) dialog.close(); }

  if (opener) opener.addEventListener("click", open);
  if (closer) closer.addEventListener("click", close);
  dialog.addEventListener("click", (e) => { if (e.target === dialog) close(); });
  out.addEventListener("click", () => { if (!String(getSelection())) input.focus(); });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "t" && e.key !== "T") return;
    if (e.ctrlKey || e.metaKey || e.altKey || dialog.open) return;
    const el = document.activeElement;
    if (el && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName))) return;
    e.preventDefault();
    open();
  });
})();
