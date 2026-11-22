# Site do funil · Colinha Anti-Birra

Site estático (HTML, CSS e JS puros) para GitHub Pages: quiz "Mapa da Birra" → resultado com mini VSL e oferta → checkout da Cakto → upsells e downsells de um clique → área de membros.

Endereço configurado: `https://victor121h.github.io/colinha-anti-birra/`

## Caminho do funil

```
index.html  (quiz → carregamento → resultado + vídeo + oferta)
   │  botão "QUERO MINHA COLINHA ANTI-BIRRA"
   ▼
Checkout Cakto (R$ 27 + order bumps)            ← CHECKOUT_URL
   ▼
upsell-1.html   Mãe Calma em 30 Dias  R$ 67      aceita → upsell-2   · recusa → downsell-1
downsell-1.html Mãe Calma em 30 Dias  R$ 37      aceita ou recusa → upsell-2
upsell-2.html   Prato Sem Briga       R$ 47      aceita → upsell-3   · recusa → downsell-2
downsell-2.html Prato Sem Briga       R$ 27      aceita ou recusa → upsell-3
upsell-3.html   Kit Emoções em Casa   R$ 37      aceita → FIM        · recusa → downsell-3
downsell-3.html Kit Emoções em Casa   R$ 19,90   aceita ou recusa → FIM
```

**FIM** depende do `AREA_MEMBROS_URL` do `config.js`:

- `"members_area"` (como está agora): é um valor especial da Cakto. O botão leva a pessoa direto para a área de membros. Quando ela aceita a oferta, entra já logada; quando recusa, cai na tela de login.
- uma URL comum (`https://...`): o fim passa a ser `obrigado.html`, com um botão para essa URL.

A `obrigado.html` existe nos dois casos. Ela também é a reserva quando o script da Cakto não carrega, e diz que o acesso chega no e-mail da compra.

## O que preencher no `config.js`

Todo dado de conta fica só em `config.js`. Enquanto um campo tiver `PREENCHER`, o site ignora aquele item sem quebrar nada.

| Campo | Situação | Onde achar / observação |
|---|---|---|
| `PIXEL_ID` | **PREENCHER** | Gerenciador de Eventos da Meta → sua fonte de dados → ID (só números). Sem ele, o pixel não carrega. |
| `UTMIFY_PIXEL_ID` | **PREENCHER** | UTMify → pixel → o valor de `window.pixelId` no código que eles dão. |
| `CHECKOUT_URL` | preenchido | `https://pay.cakto.com.br/oxkkirx_1356768` |
| `SITE_URL` | preenchido | `https://victor121h.github.io/colinha-anti-birra`. As URLs dos upsells são montadas a partir dele. Se o endereço do Pages mudar, troque aqui. |
| `AREA_MEMBROS_URL` | `members_area` | Veja "FIM" acima. |
| `SUPORTE_EMAIL` | **PREENCHER** | Enquanto estiver PREENCHER, a linha "Suporte:" do rodapé e o aviso da página de obrigado ficam escondidos. |
| `OFFER_ID.up1 … ds3` | preenchidos | `td5emfp`, `sun4rxs`, `4sh9y9u`, `9cq8qke`, `3e42oag`, `9qaw893` |

## Como cadastrar as URLs na Cakto

1. **Produto principal (Colinha Anti-Birra, R$ 27):** na configuração de pós-compra (upsell / redirecionamento depois da compra), coloque a primeira página do funil:
   `https://victor121h.github.io/colinha-anti-birra/upsell-1.html`
2. **Os próximos passos não precisam ser cadastrados na Cakto.** Cada página já leva o `offer-id` certo e as URLs de "aceitar" e "recusar" (tabela abaixo). O script da Cakto passa o token da compra de uma página para a outra sozinho (`upsellToken` na URL).
3. Se o formulário de alguma oferta na Cakto pedir a "URL da página de upsell", use a URL da tabela:

| Página | URL | offer-id | Aceitar → | Recusar → |
|---|---|---|---|---|
| Upsell 1 | `…/upsell-1.html` | up1 `td5emfp` | `…/upsell-2.html` | `…/downsell-1.html` |
| Downsell 1 | `…/downsell-1.html` | ds1 `sun4rxs` | `…/upsell-2.html` | `…/upsell-2.html` |
| Upsell 2 | `…/upsell-2.html` | up2 `4sh9y9u` | `…/upsell-3.html` | `…/downsell-2.html` |
| Downsell 2 | `…/downsell-2.html` | ds2 `9cq8qke` | `…/upsell-3.html` | `…/upsell-3.html` |
| Upsell 3 | `…/upsell-3.html` | up3 `3e42oag` | `members_area` | `…/downsell-3.html` |
| Downsell 3 | `…/downsell-3.html` | ds3 `9qaw893` | `members_area` | `members_area` |

(`…` = `https://victor121h.github.io/colinha-anti-birra`)

4. **Pixel na Cakto:** a compra (`Purchase`) é marcada pela Cakto. Configure o mesmo pixel da Meta no produto, lá na Cakto.
5. **`offer-type`:** todas as páginas usam `offer-type="upsell"`, como no briefing. Se o código que a Cakto gera para as downsells vier com outro valor, troque o `data-tipo="upsell"` na `<div id="cakto-area">` da página.
6. Faça uma compra real de ponta a ponta (com reembolso depois) antes de ligar os anúncios: é o único jeito de testar o clique único de verdade.

O botão da Cakto é montado por `js/pos-compra.js` a partir do `config.js`. O HTML gerado é o mesmo do briefing, com uma diferença: o fundo do botão é `#D44F44` em vez de `#F2766B`, porque o texto branco sobre `#F2766B` tem contraste de só 2,8:1. Os dois botões da Cakto são padronizados pelo CSS (`::part(button)`). O "Não, obrigada" passa a ter 48 px de altura de toque.

## Imagens e vídeo

Coloque os arquivos com estes nomes. Enquanto algum não existir, aparece um fundo neutro no lugar, sem quebrar o layout.

| Arquivo | Formato recomendado |
|---|---|
| `img/capa.jpg` | Já está na pasta (880×1100, 4:5). Se puder, comprima para menos de 150 KB. |
| `img/mockup.png` | Quadrado, 1080×1080, fundo transparente ou creme. |
| `img/up1.png`, `img/up2.png`, `img/up3.png` | Quadrados, 1080×1080. |
| `img/clara-poster.jpg` | Primeiro quadro do vídeo, 9:16 (720×1280), menos de 100 KB. |
| `video/vsl.mp4` | Vertical 9:16, H.264 + AAC, 720×1280, com legenda queimada. Use `+faststart` para começar a tocar antes de baixar tudo. |

Exemplo para preparar o vídeo e o pôster:

```
ffmpeg -i original.mp4 -vf scale=720:-2 -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 96k -movflags +faststart video/vsl.mp4
ffmpeg -i video/vsl.mp4 -frames:v 1 -q:v 4 img/clara-poster.jpg
```

## Vídeo e oferta (mini VSL)

- O vídeo começa mudo, em loop, com a camada "🔊 Toque para ouvir". No toque, volta ao 0:00 com som e sem loop. Não há barra de arrastar: só uma barra fina que mostra o avanço. Tocar no vídeo pausa e continua.
- A oferta abre no que vier primeiro:
  - 172 s de vídeo assistido com som (quando a Clara começa a oferta);
  - 185 s depois de o resultado aparecer;
  - o link "Prefere ler? Ver a oferta agora", que abre na hora.
- Os dois tempos ficam no topo de `js/quiz.js` (`OFERTA_NO_VIDEO_S`, `OFERTA_NA_PAGINA_S`).
- Se o vídeo não carregar, a oferta abre logo, para ninguém ficar esperando.
- Não existe contador nem timer na página.

## Rastreamento

| Evento | Quando |
|---|---|
| `PageView` | Ao abrir qualquer página (só com `PIXEL_ID` preenchido). |
| `trackCustom('Quiz_Etapa', {etapa, nome})` | A cada tela do quiz: etapas 1 (capa) a 18 (resultado). `nome` é o nome da etapa (`idade`, `momentos`, `como_chamar`…), nunca o nome da pessoa. |
| `ViewContent` | Quando o resultado aparece. |
| `trackCustom('VSL_Play')` | No "Toque para ouvir". |
| `trackCustom('VSL_Oferta', {origem})` | Quando a oferta abre. `origem` = `video`, `tempo`, `link` ou `erro_video`. |
| `InitiateCheckout` `{value: 27, currency: 'BRL'}` | No clique de compra. |
| `trackCustom('Upsell_View', {pagina})` | Em cada upsell e downsell. |

- **UTMs:** o script de UTMs do UTMify (com `data-utmify-prevent-xcod-sck` e `data-utmify-prevent-subids`) está em todas as páginas. Além disso, o clique de compra repassa ao checkout `utm_*`, `fbclid`, `gclid`, `ttclid`, `src`, `sck` e `xcod` que chegaram na URL. O repasse só acrescenta o que falta: se o UTMify já mexeu num parâmetro (ele reescreve o `utm_content`), a versão dele fica.
- **Pixel do UTMify e da Meta juntos:** se o pixel do UTMify também mandar eventos para o mesmo pixel da Meta, confira no Gerenciador de Eventos se não estão duplicando.
- **Privacidade:** o nome digitado no quiz fica só no `localStorage` do aparelho. Ele não vai para o pixel, para a URL nem para o checkout (conferido no teste). O pixel roda com `autoConfig` desligado. Deixe também desligada a "correspondência avançada automática" no Gerenciador de Eventos. O site não pede e-mail, WhatsApp nem CPF.

## Publicar no GitHub Pages

1. Envie o conteúdo desta pasta `site/` para a raiz do repositório `colinha-anti-birra`.
2. Em Settings → Pages, escolha a branch principal e a pasta raiz (`/`).
3. A pasta `_screenshots/` está no `.gitignore`, e o GitHub Pages não publica pastas que começam com `_`. Não crie um arquivo `.nojekyll`, porque isso faria pastas com `_` serem publicadas.
4. Este `README.md` fica acessível em `/README.html` se for enviado. Ele não tem nada sigiloso, mas pode ficar fora do repositório se você preferir.

Para testar no computador: dentro desta pasta, rode `python3 -m http.server 8000` e abra `http://localhost:8000`. Para recomeçar o quiz, use "Refazer o teste" no fim do resultado ou limpe os dados do site no navegador.

## Arquivos

```
index.html          quiz + carregamento + resultado + vídeo + oferta
upsell-1..3.html    upsells (geradas do mesmo modelo; dá para editar à mão)
downsell-1..3.html  downsells
obrigado.html       fim do funil quando não se usa members_area, e página de reserva
config.js           dados de conta (único lugar)
css/estilo.css      estilos (cores do briefing; tons mais escuros para texto e botões)
js/rastreio.js      pixel da Meta, pixel do UTMify, repasse de UTMs, e-mail de suporte
js/quiz.js          quiz, resultado, vídeo, oferta e checkout
js/pos-compra.js    botão da Cakto, área de membros e Upsell_View
img/, video/        mídias (veja a tabela acima)
```

## Pendências e observações

- **Textos dos upsells:** os arquivos `produtos/0{5,6,7}-*/pagina-venda.md` não existiam quando o site foi montado. A copy dos upsells e downsells foi escrita a partir da seção 6 do briefing. Quando esses arquivos ficarem prontos, vale revisar os benefícios.
- **Subtítulo da capa:** o texto diz "Responda 10 perguntas rápidas" (palavra por palavra do briefing), mas o quiz tem 12 perguntas mais o nome.
- **Cores:** o briefing pede sálvia `#6FA58C` para títulos e coral `#F2766B` para botões. Sobre o creme, esses tons ficam abaixo do contraste mínimo. Por isso o texto usa `#3D7259` (5,3:1) e os botões usam `#D44F44` com texto branco (4,2:1, texto grande). Os tons originais continuam nos detalhes: barra de progresso, barra do vídeo e destaques.
