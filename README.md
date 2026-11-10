# Davi Vinco — Portfólio

Single-page estático (HTML + CSS + JS puro, zero dependências e sem build).

**A ideia:** a página rola por capítulos de cor (quase preto, azul, off-white). Um shader em Three.js desenha o fundo e quebra a passagem entre capítulos em blocos. Títulos gigantes em Barlow Condensed, nome em Montserrat, texto em Inter.

## Estrutura

```
davi-vinco-site/
├── index.html      # conteúdo e estrutura (PT inline)
├── css/style.css   # tema, composição, movimento e responsividade
├── js/main.js      # i18n PT/EN, ajuste dos títulos, recibo da requisição, abas, GitHub, contato
├── js/stage.js     # fundo em Three.js: capítulos de cor e grade de blocos
├── js/globe.js     # globo em Three.js na seção da requisição
├── js/siege.js     # simulador de ataque: modelo de tráfego e pontos em canvas
├── js/terminal.js  # terminal que lê o próprio site (tecla T ou link no rodapé)
├── favicon.svg     # ícone
└── images/         # retrato
```

## Seções

Hero com o nome · Sobre · O caminho até você (recibo ao vivo da requisição e linha do tempo
em câmera lenta) · Sob ataque (simulador) · Experiência ·
Projetos (fragmentos de interface de cada projeto, com dados ao vivo da API do GitHub) ·
Stack · Formação, certificações e voluntariado · Contato · Rodapé.

## O recibo ao vivo

A seção "O caminho até você" lê a Navigation Timing API do navegador e imprime os tempos
reais da requisição que trouxe a página: DNS, TCP, TLS, TTFB, download, protocolo e
tamanho transferido. "Medir de novo" faz um `fetch` da própria página sem cache e mostra
a nova medição pela Resource Timing API, incluindo o cabeçalho `Server` quando houver.
Nada é enviado a lugar nenhum.

Logo abaixo, a mesma medição vira uma linha do tempo em escala (DNS, TCP, TLS, espera e
download), repetida em câmera lenta.

## O simulador de ataque

"Sob ataque" roda um modelo pequeno em `js/siege.js`: 200 req/s de visitantes e um pico de
12.000 req/s que passa por rate limit, WAF, cache e uma origem com autoscaling de 2 a 8 nós.
Cada camada pode ser desligada para ver o efeito em erros, tempo de resposta e uso da
origem. Os números são ilustrativos e estão nas constantes no topo do arquivo.

## O terminal

A tecla `T` (ou o link no rodapé) abre um terminal que responde com o conteúdo da própria
página: `help`, `whoami`, `ls`, `cat <seção>`, `cd <seção>`, `ping` (medição real),
`ataque` e `lang pt|en`.

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

