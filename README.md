# Davi Vinco — Portfólio

Single-page estático (HTML + CSS + JS puro, zero dependências e sem build).

**A ideia:** *vinco* é a linha onde dois planos se encontram. A página é um palco dividido:
de um lado, uma placa fixa com o retrato e fotos de arquivo da história das redes; do
outro, uma coluna de leitura. As duas metades se encontram numa aresta vertical, o vinco,
que o nome atravessa no topo. Na segunda metade da página, o vinco se inverte e a placa
passa para a direita.

Tipografia em uma família só (Boska, via Fontshare), fundo quase preto, azul como único
acento e um campo azul no contato.

## Estrutura

```
davi-vinco-site/
├── index.html      # conteúdo e estrutura (PT inline)
├── css/style.css   # tema, composição, movimento e responsividade
├── js/main.js      # i18n PT/EN, placas, recibo da requisição, abas, GitHub, contato
├── favicon.svg     # dois planos e um vinco
├── images/         # retrato
└── assets/         # fotos e vídeo de arquivo (P&B) + credits.json
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
escolhido pelo caminho). Ao publicar, suba também `assets/`, `images/` e `favicon.svg`,
e incremente o `?v=` do CSS e do JS no `index.html` para furar o cache da borda.

## Créditos das imagens de arquivo

Todas via Wikimedia Commons, convertidas para tons de cinza e redimensionadas. Os créditos
completos estão no rodapé da página e em `assets/credits.json`.

- Central Telefônica Brás em 1961, Central Telefônica Jabaquara em 1968, Central Telefônica
  de Botafogo em 1969: domínio público.
- Telephone lineman on a pole (NARA, 1939): domínio público.
- Shreeve carbon telephone repeaters, AT&T, Providence, 1919 (Bancroft Gherardi e Frank B.
  Jewett): domínio público.
- Newspaper Hufvudstadsbladet's telephone exchange, Helsinque, 1927: CC BY 4.0.
- NTT strowger switch operation (Darklanlan): CC BY 4.0. Recortado e encurtado para 14 s.
