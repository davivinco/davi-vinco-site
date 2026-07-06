# Davi Vinco — Portfólio

Single-page estático (HTML + CSS + JS puro, zero dependências) com design minimalista:
monocromático, tipografia Inter Tight + toques em serifa itálica (Instrument Serif),
divisores finos e muito espaço em branco.

## Estrutura

```
davi-vinco-site/
├── index.html      # conteúdo e estrutura
├── css/style.css   # tema, animações e responsividade
└── js/main.js      # reveals, contadores e fetch do GitHub
```

## Seções

01 Sobre · 02 Experiência (Azion, SaveinCloud, It4us, Triângulo) · 03 Projetos (ao vivo
da API do GitHub, com fallback estático) · 04 Formação, certificações agrupadas por
emissor e voluntariado · 05 Contato.

## Como rodar

```bash
cd davi-vinco-site
python3 -m http.server 8000
# http://localhost:8000
```

## Publicação

Funciona em qualquer host estático: GitHub Pages, Cloudflare Pages, Netlify — ou uma
Edge Application na Azion. Basta subir os três arquivos.
