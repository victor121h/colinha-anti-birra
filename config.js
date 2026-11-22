/* =====================================================================
   CONFIG DO FUNIL · Colinha Anti-Birra
   ---------------------------------------------------------------------
   Este é o ÚNICO arquivo com dados de conta. Troque cada "PREENCHER".
   Enquanto um valor tiver a palavra PREENCHER, o site ignora o item
   (o pixel não carrega, a área de membros não aparece etc.).
   Passo a passo no README.md.
   ===================================================================== */
window.CONFIG = {
  // Meta (Facebook): Gerenciador de Eventos > sua fonte de dados > ID do pixel (só números).
  PIXEL_ID: "28165559309792835", // pixel PROSPE (conta de anúncios 02), escolhido pelo Victor em 22/11

  // UTMify: o valor de window.pixelId que aparece no código do pixel do UTMify.
  UTMIFY_PIXEL_ID: "6b033c548d2ea0bfb5315503", // pixel da UTMify (22/11)

  // Link do checkout da Cakto do produto principal (Colinha Anti-Birra, R$ 27).
  CHECKOUT_URL: "https://pay.cakto.com.br/oxkkirx_1356768",

  // Endereço publicado do site (GitHub Pages). As URLs dos upsells são montadas a partir dele.
  SITE_URL: "https://colinha-anti-birra.replit.app",

  // Fim do funil (último upsell/downsell).
  // "members_area" = valor especial da Cakto: o botão leva a pessoa direto para a área de membros
  // (já logada, quando ela aceita a oferta). Se trocar por uma URL comum (https://...), o fim do
  // funil passa a ser a página obrigado.html, com um botão para essa URL.
  AREA_MEMBROS_URL: "members_area",

  // Taxa de serviço que a Cakto cobra do comprador no checkout (hoje R$ 0,99, configuração da conta Cakto).
  // Enquanto tiver valor, as páginas mostram "+ R$ 0,99 de taxa de serviço da plataforma" perto de cada preço,
  // para o preço da página bater com o do checkout. Se a taxa for desligada na Cakto, deixe "" (vazio).
  TAXA_SERVICO: "0,99",

  // E-mail de suporte (aparece no rodapé de todas as páginas).
  // Enquanto estiver "PREENCHER", a linha de suporte fica escondida no site.
  SUPORTE_EMAIL: "PREENCHER",

  // offer-id de cada oferta de upsell/downsell, copiado da Cakto.
  OFFER_ID: {
    up1: "td5emfp", // Upsell 1   · Mãe Calma em 30 Dias  · R$ 67
    ds1: "sun4rxs", // Downsell 1 · Mãe Calma em 30 Dias  · R$ 37
    up2: "4sh9y9u", // Upsell 2   · Prato Sem Briga       · R$ 47
    ds2: "9cq8qke", // Downsell 2 · Prato Sem Briga       · R$ 27
    up3: "3e42oag", // Upsell 3   · Kit Emoções em Casa   · R$ 37
    ds3: "9qaw893"  // Downsell 3 · Kit Emoções em Casa   · R$ 19,90
  }
};
