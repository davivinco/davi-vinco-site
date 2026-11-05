# Davi Vinco — Portfólio

Single-page estático (HTML + CSS + JS puro, zero dependências e sem build).

**A ideia:** a página rola por capítulos de cor (quase preto, verde-limão, off-white). Um shader em Three.js desenha o fundo e quebra a passagem entre capítulos em blocos. Títulos gigantes em Barlow Condensed, nome em Montserrat, texto em Inter.

## Estrutura

```
davi-vinco-site/
├── index.html      # conteúdo e estrutura (PT inline)
├── css/style.css   # tema, composição, movimento e responsividade
├── js/main.js      # i18n PT/EN, ajuste dos títulos, recibo da requisição, abas, GitHub, contato
├── js/stage.js     # fundo em Three.js: capítulos de cor e grade de blocos
├── js/globe.js     # globo em Three.js na seção da requisição
├── favicon.svg     # ícone
└── images/         # retrato
```

## Seções

Hero com o nome · Sobre · O caminho até você (recibo ao vivo da requisição) · Experiência ·
Projetos (fragmentos de interface de cada projeto, com dados ao vivo da API do GitHub) ·
Stack · Formação, certificações e voluntariado · Contato · Rodapé.

## O recibo ao vivo

A seção "O caminho até você" lê a Navigation Timing API do navegador e imprime os tempos
reais da requisição que trouxe a página: DNS, TCP, TLS, TTFB, download, protocolo e
tamanho transferido. "Medir de novo" faz um `fetch` da própria página sem cache e mostra
a nova medição pela Resource Timing API, incluindo o cabeçalho `Server` quando houver.
Nada é enviado a lugar nenhum.

## Como rodar

```bash
cd davi-vinco-site
python3 -m http.server 8000
# http://localhost:8000
```

## Publicação

Funciona em qualquer host estático: GitHub Pages, Cloudflare Pages, Netlify ou uma
Edge Application na Azion. A rota `/en` deve servir o mesmo `index.html` (o idioma é
escolhido pelo caminho). Ao publicar, suba também `images/` e `favicon.svg`,
e incremente o `?v=` do CSS e do JS no `index.html` para furar o cache da borda.

