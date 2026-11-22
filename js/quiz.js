/* Quiz "Mapa da Birra" + resultado + mini VSL + oferta (tudo na mesma página).
   O estado fica no localStorage deste aparelho (inclusive o nome digitado),
   e o nome nunca vai para o pixel nem para a URL. */
(function () {
  'use strict';

  var C = window.CONFIG || {};
  var track = window.cabTrack || function () {};
  var CHAVE = 'cab_quiz_v1';

  /* Tempos da oferta. Narração final: vídeo de 221 s (3:41); a Clara começa a
     oferta aos 172 s e fala o preço aos 197 s. Abre o que vier primeiro. */
  var OFERTA_NO_VIDEO_S = 172;   // segundos de vídeo assistido COM SOM
  var OFERTA_NA_PAGINA_S = 185;  // segundos desde que o resultado apareceu
  var PRECO = 27;
  var VIDEO_SRC = 'video/vsl.mp4';
  var VIDEO_POSTER = 'img/clara-poster.jpg';

  var ICONE_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  /* As 10 colinhas do produto (mesma ordem do vídeo) */
  var COLINHAS = ['Banho', 'Roupa', 'Hora de dormir', 'Desligar a tela', 'Ir embora', 'Mercado', 'Comida', 'Escovar os dentes', 'Briga com irmão', 'Sair de casa'];
  var MOMENTO_PARA_COLINHA = {
    'Hora do banho': 'Banho',
    'Hora de dormir': 'Hora de dormir',
    'Para ir embora de algum lugar': 'Ir embora',
    'No mercado ou na rua': 'Mercado',
    'Para desligar o celular ou a TV': 'Desligar a tela',
    'Na hora de comer': 'Comida',
    'Para se vestir': 'Roupa',
    'Com o irmão ou outra criança': 'Briga com irmão',
    'Para sair de casa': 'Sair de casa'
  };
  var MINUTOS = { '5 minutos': '5', '10 minutos': '10', '15 minutos ou mais': '15' };

  /* Telas na ordem. "nome" é o nome da etapa enviado ao pixel (nunca o nome da pessoa). */
  var TELAS = [
    { id: 'capa', tipo: 'capa', nome: 'capa' },
    { id: 'idade', tipo: 'unica', nome: 'idade', titulo: 'Quantos anos tem a criança?',
      opcoes: ['1 a 2 anos', '2 a 3 anos', '3 a 4 anos', '4 a 6 anos', 'Mais de 6 anos'] },
    { id: 'quem', tipo: 'unica', nome: 'quem_responde', titulo: 'Quem está respondendo?',
      opcoes: ['Mãe', 'Pai', 'Avó ou avô', 'Outro cuidador'] },
    { id: 'momentos', tipo: 'multipla', nome: 'momentos', titulo: 'Em que momentos a birra mais acontece?',
      opcoes: ['Hora do banho', 'Hora de dormir', 'Para ir embora de algum lugar', 'No mercado ou na rua', 'Para desligar o celular ou a TV', 'Na hora de comer', 'Para se vestir', 'Com o irmão ou outra criança', 'Para sair de casa'] },
    { id: 'como', tipo: 'unica', nome: 'como_e_a_birra', titulo: 'Como a birra costuma ser?',
      opcoes: ['Chora alto e grita', 'Se joga no chão', 'Bate, morde ou chuta', 'Repete “não” e ignora', 'Um pouco de tudo'] },
    { id: 'vezes', tipo: 'unica', nome: 'vezes_por_dia', titulo: 'Quantas vezes por dia isso acontece?',
      opcoes: ['1 vez', '2 ou 3 vezes', '4 ou mais', 'Já perdi a conta'] },
    { id: 'reforco1', tipo: 'reforco1', nome: 'reforco_1' },
    { id: 'reacao', tipo: 'unica', nome: 'reacao_na_birra', titulo: 'E você, na hora da birra, o que acaba acontecendo?',
      opcoes: ['Eu grito', 'Ameaço ou faço chantagem', 'Cedo pra acabar logo', 'Perco o controle e depois me arrependo', 'Travo, sem saber o que fazer'] },
    { id: 'sente', tipo: 'unica', nome: 'como_se_sente', titulo: 'Como você se sente depois?',
      opcoes: ['Culpada', 'Esgotada', 'Com vergonha', 'Achando que estou fazendo tudo errado'] },
    { id: 'tentou', tipo: 'multipla', nome: 'ja_tentou', titulo: 'O que você já tentou?',
      opcoes: ['Conversar e explicar', 'Castigo ou cantinho do pensamento', 'Ignorar', 'Dar o celular para acalmar', 'Vídeos e livros sobre o assunto', 'Ainda não tentei nada'],
      exclusiva: 'Ainda não tentei nada' },
    { id: 'publico', tipo: 'unica', nome: 'birra_em_publico', titulo: 'A birra na rua ou na frente da família te incomoda?',
      opcoes: ['Muito, morro de vergonha', 'Às vezes', 'Me incomoda mais o julgamento da família', 'Evito sair por causa disso'] },
    { id: 'reforco2', tipo: 'reforco2', nome: 'reforco_2' },
    { id: 'crenca', tipo: 'unica', nome: 'crenca_frase_certa', titulo: 'Você concorda que, no meio da birra, quase ninguém consegue pensar na frase certa?',
      opcoes: ['Concordo totalmente', 'Concordo', 'Às vezes eu consigo'] },
    { id: 'mudaria', tipo: 'unica', nome: 'o_que_mudaria', titulo: 'Se você tivesse a frase pronta para cada birra, o que mudaria aí?',
      opcoes: ['Eu ia gritar bem menos', 'Os dias iam ficar mais leves', 'Eu ia me sentir uma mãe melhor', 'Tudo isso'] },
    { id: 'minutos', tipo: 'unica', nome: 'minutos_por_dia', titulo: 'Quantos minutos por dia você consegue separar para isso?',
      opcoes: ['5 minutos', '10 minutos', '15 minutos ou mais'] },
    { id: 'nome', tipo: 'nome', nome: 'como_chamar' },
    { id: 'carregando', tipo: 'carregando', nome: 'carregamento' },
    { id: 'resultado', tipo: 'resultado', nome: 'resultado' }
  ];

  function indice(id) {
    for (var i = 0; i < TELAS.length; i++) if (TELAS[i].id === id) return i;
    return -1;
  }
  var I_PRIMEIRA = 1;
  var I_NOME = indice('nome');
  var I_RESULTADO = indice('resultado');

  /* ---------- Estado ---------- */
  function novoEstado() {
    return { tela: 0, respostas: {}, nome: '', resultadoEm: 0, ofertaAberta: false };
  }
  function lerEstado() {
    try {
      var s = JSON.parse(localStorage.getItem(CHAVE) || 'null');
      if (s && typeof s.tela === 'number' && s.tela >= 0 && s.tela < TELAS.length &&
          s.respostas && typeof s.respostas === 'object') {
        if (typeof s.nome !== 'string') s.nome = '';
        return s;
      }
    } catch (e) { /* estado corrompido ou armazenamento bloqueado */ }
    return null;
  }
  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { /* segue sem salvar */ }
  }
  var estado = lerEstado() || novoEstado();

  /* ---------- DOM ---------- */
  function $(id) { return document.getElementById(id); }
  var telaCapa = $('tela-capa');
  var telaQuiz = $('tela-quiz');
  var telaCarregando = $('tela-carregando');
  var telaResultado = $('tela-resultado');
  var conteudo = $('quiz-conteudo');
  var barra = $('progresso-barra');
  var progresso = barra.parentNode;
  var btnVoltar = $('btn-voltar');

  function el(tag, attrs, filhos) {
    var n = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        if (k === 'class') n.className = attrs[k];
        else if (k === 'text') n.textContent = attrs[k];
        else if (k === 'html') n.innerHTML = attrs[k];
        else n.setAttribute(k, attrs[k]);
      }
    }
    (filhos || []).forEach(function (f) {
      if (f) n.appendChild(typeof f === 'string' ? document.createTextNode(f) : f);
    });
    return n;
  }

  function juntar(lista) {
    if (lista.length <= 1) return lista.join('');
    return lista.slice(0, -1).join(', ') + ' e ' + lista[lista.length - 1];
  }

  /* ---------- Navegação ---------- */
  var timerAvanco = null;

  function mostrar(i, modo) {
    i = Math.max(0, Math.min(i, TELAS.length - 1));
    var t = TELAS[i];
    if (timerAvanco) { clearTimeout(timerAvanco); timerAvanco = null; }
    estado.tela = i;
    salvar();

    /* Pixel primeiro, antes de qualquer campo ser preenchido na tela */
    if (modo === 'avancar' || modo === 'inicio') {
      track('trackCustom', 'Quiz_Etapa', { etapa: i + 1, nome: t.nome });
    }
    /* Histórico do navegador: o "voltar" do celular volta uma pergunta */
    try {
      if (modo === 'avancar') history.pushState({ tela: i }, '');
      else if (modo === 'inicio' || modo === 'voltar') history.replaceState({ tela: i }, '');
    } catch (e) { /* sem histórico, segue normal */ }

    pararCarregamento();
    var ehQuiz = ['capa', 'carregando', 'resultado'].indexOf(t.tipo) === -1;
    telaCapa.hidden = t.tipo !== 'capa';
    telaQuiz.hidden = !ehQuiz;
    telaCarregando.hidden = t.tipo !== 'carregando';
    telaResultado.hidden = t.tipo !== 'resultado';

    if (t.tipo !== 'resultado') pausarVideo();
    if (ehQuiz) desenharQuiz(t, i);
    else if (t.tipo === 'carregando') iniciarCarregamento();
    else if (t.tipo === 'resultado') mostrarResultado(modo);

    window.scrollTo(0, 0);
    document.documentElement.classList.remove('restaurando');
  }

  function avancar() { mostrar(estado.tela + 1, 'avancar'); }

  window.addEventListener('popstate', function (e) {
    var alvo = e.state && typeof e.state.tela === 'number' ? e.state.tela : 0;
    if (alvo < 0 || alvo >= TELAS.length) alvo = 0;
    if (TELAS[alvo].tipo === 'carregando') alvo = I_NOME; /* nunca volta para o carregamento */
    mostrar(alvo, 'historico');
  });

  /* ---------- Telas do quiz ---------- */
  function desenharQuiz(t, i) {
    var total = I_NOME - I_PRIMEIRA + 1;
    var pos = i - I_PRIMEIRA + 1;
    var pct = Math.round(pos / total * 100);
    barra.style.width = pct + '%';
    progresso.setAttribute('aria-valuenow', String(pct));
    progresso.setAttribute('aria-valuetext', 'Etapa ' + pos + ' de ' + total);

    conteudo.innerHTML = '';
    if (t.tipo === 'unica' || t.tipo === 'multipla') desenharPergunta(t);
    else if (t.tipo === 'reforco1') desenharReforco1();
    else if (t.tipo === 'reforco2') desenharReforco2();
    else if (t.tipo === 'nome') desenharNome();

    var h = conteudo.querySelector('h2');
    if (h) {
      h.setAttribute('tabindex', '-1');
      try { h.focus({ preventScroll: true }); } catch (e) { /* ok */ }
    }
  }

  function marcar(botao, ligado, multipla) {
    botao.classList.toggle('selecionada', ligado);
    botao.setAttribute(multipla ? 'aria-checked' : 'aria-pressed', ligado ? 'true' : 'false');
  }

  function botaoContinuar(texto, acao) {
    var b = el('button', { type: 'button', class: 'btn', text: texto || 'Continuar' });
    b.addEventListener('click', acao);
    return b;
  }

  function desenharPergunta(t) {
    var multipla = t.tipo === 'multipla';
    var resp = estado.respostas[t.id];
    var selecionadas = multipla ? (Array.isArray(resp) ? resp.slice() : []) : null;
    var tituloId = 'q-' + t.id;
    var btnCont = null;

    conteudo.appendChild(el('h2', { class: 'q-titulo', id: tituloId, text: t.titulo }));
    if (multipla) conteudo.appendChild(el('p', { class: 'q-dica', text: 'Pode marcar mais de uma.' }));

    var lista = el('div', { class: 'opcoes', role: 'group', 'aria-labelledby': tituloId });

    function atualizar() {
      var filhos = lista.children;
      for (var k = 0; k < filhos.length; k++) {
        marcar(filhos[k], selecionadas.indexOf(filhos[k].getAttribute('data-op')) !== -1, true);
      }
      btnCont.disabled = selecionadas.length === 0;
    }

    t.opcoes.forEach(function (op) {
      var b = el('button', {
        type: 'button',
        class: 'opcao' + (multipla ? ' opcao--check' : ''),
        'data-op': op
      }, [el('span', { text: op }), el('span', { class: 'marca', 'aria-hidden': 'true', html: ICONE_CHECK })]);
      if (multipla) b.setAttribute('role', 'checkbox');
      marcar(b, multipla ? selecionadas.indexOf(op) !== -1 : resp === op, multipla);

      b.addEventListener('click', function () {
        if (multipla) {
          var k = selecionadas.indexOf(op);
          if (k === -1) {
            if (t.exclusiva) {
              if (op === t.exclusiva) selecionadas = [];
              else selecionadas = selecionadas.filter(function (x) { return x !== t.exclusiva; });
            }
            selecionadas.push(op);
          } else {
            selecionadas.splice(k, 1);
          }
          estado.respostas[t.id] = selecionadas.slice();
          salvar();
          atualizar();
        } else {
          if (timerAvanco) return; /* evita toque duplo */
          estado.respostas[t.id] = op;
          salvar();
          var filhos = lista.children;
          for (var j = 0; j < filhos.length; j++) marcar(filhos[j], filhos[j] === b, false);
          timerAvanco = setTimeout(function () { timerAvanco = null; avancar(); }, 260);
        }
      });
      lista.appendChild(b);
    });
    conteudo.appendChild(lista);

    if (multipla) {
      btnCont = botaoContinuar('Continuar', function () { if (selecionadas.length) avancar(); });
      conteudo.appendChild(el('div', { class: 'rodape-fixo' }, [btnCont]));
      atualizar();
    }
  }

  function desenharReforco1() {
    conteudo.appendChild(el('div', { class: 'reforco' }, [
      el('div', { class: 'reforco-icone', 'aria-hidden': 'true', text: '🌿' }),
      el('h2', { class: 'q-titulo', text: 'Respira: o que você descreveu é muito comum nessa idade.' }),
      el('p', { text: 'A parte do cérebro que segura o impulso, o “freio”, ainda está em construção nos primeiros anos. Na birra, a criança não está te desafiando: ela está sem freio.' }),
      el('p', { class: 'fonte', text: '(Center on the Developing Child, Universidade Harvard)' })
    ]));
    conteudo.appendChild(el('div', { class: 'rodape-fixo' }, [botaoContinuar('Continuar', avancar)]));
  }

  function desenharReforco2() {
    conteudo.appendChild(el('div', { class: 'reforco' }, [
      el('h2', { class: 'q-titulo', text: 'Teoria você já viu. O que falta é a frase na hora H.' }),
      el('div', { class: 'postit' }, [
        el('p', { class: 'postit-titulo', text: '🧡 Ir embora do parque' }),
        el('p', { class: 'postit-frase', text: '“Você queria ficar mais. Tá difícil ir embora. A gente vai agora, e você escolhe: quem chega primeiro no portão, você ou eu?”' })
      ]),
      el('p', { html: 'Você não cede e não grita. <strong>Isso é a Colinha.</strong>' })
    ]));
    conteudo.appendChild(el('div', { class: 'rodape-fixo' }, [botaoContinuar('Continuar', avancar)]));
  }

  function limparNome(v) {
    v = String(v || '').replace(/\s+/g, ' ').trim().slice(0, 24);
    return v ? v.charAt(0).toUpperCase() + v.slice(1) : '';
  }

  function desenharNome() {
    conteudo.appendChild(el('h2', { class: 'q-titulo', id: 'q-nome', text: 'Como você quer ser chamada no seu Mapa?' }));
    conteudo.appendChild(el('p', { class: 'q-dica', text: 'Só o primeiro nome. É opcional.' }));
    /* Campo fora de <form> e sem atributos de "nome", para nenhum script de terceiros identificar */
    var campo = el('input', {
      class: 'campo', id: 'q-apelido', type: 'text', maxlength: '24',
      autocomplete: 'off', autocapitalize: 'words', spellcheck: 'false',
      enterkeyhint: 'go', placeholder: 'Ex.: Ana', 'aria-labelledby': 'q-nome'
    });
    campo.value = estado.nome || '';
    conteudo.appendChild(campo);
    conteudo.appendChild(el('p', { class: 'privacidade', text: '🔒 O seu nome fica só neste aparelho e não é enviado para lugar nenhum.' }));

    function concluir(nome) {
      estado.nome = nome;
      salvar();
      avancar();
    }
    var ver = botaoContinuar('Ver meu Mapa da Birra', function () { concluir(limparNome(campo.value)); });
    var pular = el('button', { type: 'button', class: 'link-discreto', text: 'pular' });
    pular.addEventListener('click', function () { concluir(''); });
    campo.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); concluir(limparNome(campo.value)); }
    });
    conteudo.appendChild(el('div', { class: 'acoes-nome' }, [ver, pular]));
  }

  /* ---------- Carregamento (~6 s) ---------- */
  var timersCarregando = [];
  function pararCarregamento() {
    timersCarregando.forEach(clearTimeout);
    timersCarregando = [];
  }
  function textoIdade() {
    var idade = estado.respostas.idade;
    if (!idade) return 'a idade do seu filho';
    if (idade === 'Mais de 6 anos') return 'crianças de mais de 6 anos';
    return 'crianças de ' + idade;
  }
  function iniciarCarregamento() {
    prepararVideo(); /* o vídeo começa a baixar enquanto a animação roda */
    $('carregando-idade').textContent = 'Separando as frases para ' + textoIdade() + '...';
    var itens = telaCarregando.querySelectorAll('.passos-carregando li');
    for (var k = 0; k < itens.length; k++) itens[k].className = '';
    itens[0].className = 'ativo';
    function passo(ms, fn) { timersCarregando.push(setTimeout(fn, ms)); }
    passo(2000, function () { itens[0].className = 'feito'; itens[1].className = 'ativo'; });
    passo(4000, function () { itens[1].className = 'feito'; itens[2].className = 'ativo'; });
    passo(6000, function () { itens[2].className = 'feito'; });
    passo(6500, function () { mostrar(I_RESULTADO, 'avancar'); });
  }

  /* ---------- Resultado ---------- */
  function mostrarResultado(modo) {
    var r = estado.respostas;
    $('res-titulo').textContent = estado.nome
      ? estado.nome + ', o seu Mapa da Birra está pronto'
      : 'O seu Mapa da Birra está pronto';
    $('res-idade').textContent = r.idade || 'não informada';

    var momentos = Array.isArray(r.momentos) ? r.momentos : [];
    var nomes = momentos.map(function (m) { return MOMENTO_PARA_COLINHA[m]; })
      .filter(Boolean).slice(0, 3);
    var alvo = $('res-colinhas');
    alvo.innerHTML = '';
    if (nomes.length) {
      alvo.appendChild(el('strong', { text: nomes.length > 1 ? 'Comece por estas colinhas: ' : 'Comece por esta colinha: ' }));
      alvo.appendChild(document.createTextNode(juntar(nomes) + '.'));
    } else {
      alvo.appendChild(el('strong', { text: 'Comece pelas colinhas do dia a dia: ' }));
      alvo.appendChild(document.createTextNode('Banho, Ir embora e Hora de dormir.'));
    }
    $('res-minutos').textContent = MINUTOS[r.minutos] || '5';
    $('res-aviso-idade').hidden = r.idade !== 'Mais de 6 anos';
    desenharChips(momentos);

    if (!estado.resultadoEm) { estado.resultadoEm = Date.now(); salvar(); }
    if (modo !== 'historico') track('track', 'ViewContent', { content_name: 'Colinha Anti-Birra' });

    iniciarVideo();
    if (estado.ofertaAberta) abrirOferta('restaurada', true);
    else if (videoFalhou) abrirOferta('erro_video');
    else agendarOferta();

    try { $('res-titulo').focus({ preventScroll: true }); } catch (e) { /* ok */ }
  }

  function desenharChips(momentos) {
    var caixa = $('chips-colinhas');
    caixa.innerHTML = '';
    var suas = momentos.map(function (m) { return MOMENTO_PARA_COLINHA[m]; });
    COLINHAS.forEach(function (c) {
      var sua = suas.indexOf(c) !== -1;
      caixa.appendChild(el('span', { class: 'chip' + (sua ? ' sua' : ''), text: (sua ? '✓ ' : '') + c }));
    });
    $('chips-legenda').hidden = suas.filter(Boolean).length === 0;
  }

  /* ---------- Mini VSL ---------- */
  var video = $('vsl-video');
  var btnSom = $('vsl-som');
  var btnToque = $('vsl-toque');
  var barraVsl = $('vsl-barra');
  var progVsl = $('vsl-progresso');
  var comSom = false;
  var videoPreparado = false;

  function prepararVideo() {
    if (videoPreparado) return;
    videoPreparado = true;
    video.setAttribute('poster', VIDEO_POSTER);
    video.preload = 'auto';
    video.src = VIDEO_SRC;
  }
  function tocar() {
    var p = video.play();
    if (p && typeof p.catch === 'function') p.catch(function () { /* autoplay bloqueado: o botão "Toque para ouvir" continua lá */ });
  }
  function pausarVideo() { if (videoPreparado && !video.paused) video.pause(); }
  function iniciarVideo() {
    prepararVideo();
    if (!comSom) { video.muted = true; video.loop = true; }
    if (video.paused) tocar();
  }

  btnSom.addEventListener('click', function () {
    comSom = true;
    video.muted = false;
    video.loop = false;
    try { video.currentTime = 0; } catch (e) { /* ainda sem dados */ }
    tocar();
    btnSom.hidden = true;
    btnToque.hidden = false;
    barraVsl.hidden = false;
    track('trackCustom', 'VSL_Play');
  });

  btnToque.addEventListener('click', function () {
    if (video.ended) { try { video.currentTime = 0; } catch (e) { /* ok */ } }
    if (video.paused) tocar(); else video.pause();
  });
  video.addEventListener('play', function () {
    btnToque.classList.remove('pausado');
    btnToque.setAttribute('aria-label', 'Pausar o vídeo');
  });
  video.addEventListener('pause', function () {
    if (!comSom) return;
    btnToque.classList.add('pausado');
    btnToque.setAttribute('aria-label', 'Continuar o vídeo');
  });
  video.addEventListener('timeupdate', function () {
    if (!comSom) return;
    if (video.duration) progVsl.style.width = Math.min(100, video.currentTime / video.duration * 100) + '%';
    if (video.currentTime >= OFERTA_NO_VIDEO_S) abrirOferta('video');
  });
  video.addEventListener('ended', function () { if (comSom) abrirOferta('video'); });
  var videoFalhou = false;
  video.addEventListener('error', function () {
    if (!videoPreparado) return;
    videoFalhou = true;
    btnSom.hidden = true;
    btnToque.hidden = true;
    barraVsl.hidden = true;
    $('vsl-erro').hidden = false;
    /* sem vídeo, ninguém fica esperando: a oferta abre assim que o resultado estiver na tela */
    if (!telaResultado.hidden) abrirOferta('erro_video');
  });

  /* ---------- Oferta ---------- */
  var timerOferta = null;
  var ofertaVisivel = false;

  function agendarOferta() {
    if (ofertaVisivel || timerOferta) return;
    var falta = OFERTA_NA_PAGINA_S * 1000 - (Date.now() - (estado.resultadoEm || Date.now()));
    timerOferta = setTimeout(function () { timerOferta = null; abrirOferta('tempo'); }, Math.max(0, falta));
  }

  function abrirOferta(origem, silencioso) {
    if (ofertaVisivel) return;
    ofertaVisivel = true;
    if (timerOferta) { clearTimeout(timerOferta); timerOferta = null; }
    var oferta = $('oferta');
    oferta.hidden = false;
    $('ler-oferta').hidden = true;
    if (!silencioso) oferta.classList.add('oferta-abre');
    if (!estado.ofertaAberta) { estado.ofertaAberta = true; salvar(); }
    if (!silencioso) track('trackCustom', 'VSL_Oferta', { origem: origem });
    if (origem === 'link') {
      var topo = $('oferta-topo');
      if (topo && topo.scrollIntoView) topo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /* ---------- Checkout (Cakto) ---------- */
  var indoAoCheckout = false;
  function urlCheckout(base) {
    return window.cabComParametros ? window.cabComParametros(base) : base;
  }
  function irParaCheckout(e) {
    e.preventDefault();
    if (indoAoCheckout) return;
    indoAoCheckout = true;
    /* Parte do link como está agora (com o que o UTMify tiver acrescentado) e completa o que faltar */
    var atual = this.getAttribute('href');
    var url = urlCheckout(atual && atual !== '#' ? atual : (C.CHECKOUT_URL || ''));
    track('track', 'InitiateCheckout', { value: PRECO, currency: 'BRL' });
    /* pequena espera só quando há pixel, para o evento sair antes de trocar de página */
    setTimeout(function () { window.location.href = url; }, typeof window.fbq === 'function' ? 300 : 0);
    setTimeout(function () { indoAoCheckout = false; }, 4000);
  }
  function configurarCheckout() {
    var links = document.querySelectorAll('[data-checkout]');
    var href = urlCheckout(C.CHECKOUT_URL || '#');
    for (var k = 0; k < links.length; k++) {
      links[k].setAttribute('href', href);
      links[k].addEventListener('click', irParaCheckout);
    }
  }
  window.addEventListener('pageshow', function (e) { if (e.persisted) indoAoCheckout = false; });

  /* ---------- Início ---------- */
  function refazer() {
    pausarVideo();
    if (timerOferta) { clearTimeout(timerOferta); timerOferta = null; }
    estado = novoEstado();
    salvar();
    comSom = false;
    btnSom.hidden = !$('vsl-erro').hidden; /* se o vídeo falhou, o botão continua escondido */
    btnToque.hidden = true;
    barraVsl.hidden = true;
    progVsl.style.width = '0';
    ofertaVisivel = false;
    $('oferta').hidden = true;
    $('oferta').classList.remove('oferta-abre');
    $('ler-oferta').hidden = false;
    mostrar(0, 'avancar');
  }

  configurarCheckout();
  $('btn-comecar').addEventListener('click', avancar);
  $('btn-ler-oferta').addEventListener('click', function () { abrirOferta('link'); });
  $('btn-refazer').addEventListener('click', refazer);
  btnVoltar.addEventListener('click', function () {
    var anterior = estado.tela - 1;
    if (anterior < 0) anterior = 0;
    mostrar(anterior, 'voltar');
  });

  mostrar(estado.tela, 'inicio');
})();
