#!/usr/bin/env node
'use strict';
/* Geradores das aulas básicas e do 3º ano: 1.000 perguntas de CADA gerador (pelo gerador de verdade) e, em toda pergunta,
   exatamente 1 resposta certa, opções sem repetição; nos de escrita e lacuna, nenhum distrator é palavra real (PALAVRAS_REAIS, conferida
   no corretor pt_BR do macOS por build/palavras-reais.swift) e só a resposta completa a lacuna; no 3º ano, sempre 4 opções distintas.
   Revisão independente de 09/11/2026.   Uso: node testes/geradores.js */
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const a = carregarApp(19, {});
a.avaliar("novoPerfil('Zeca','#12A06E')");
const J = (x) => JSON.parse(JSON.stringify(x));

(async () => {
  await teste('1. todo gerador de basicas e do 3o ano: 1.000 perguntas com exatamente 1 resposta certa e opcoes sem repeticao; 3o ano sempre com 4 opcoes', () => {
    const r = J(a.avaliar(`(()=>{const ruins=[],n={};
      const ger=[].concat(Object.keys(MAT_BAS).map(k=>['MAT_BAS.'+k,MAT_BAS[k],0]),Object.keys(PT_BAS).map(k=>['PT_BAS.'+k,PT_BAS[k],0]),
        Object.keys(EN_BAS).map(k=>['EN_BAS.'+k,EN_BAS[k],0]),Object.keys(MED3).map(k=>['MED3.'+k,MED3[k],4]),[['leituraCurta',leituraCurta,4]]);
      ger.forEach(([nome,mk,quatro])=>{n[nome]=0;for(let i=0;i<1000&&ruins.length<15;i++){const q=mk();n[nome]++;const op=q.options||[];
        const certas=op.filter(o=>o===q.answer).length;
        if(certas!==1)ruins.push(nome+': '+certas+' respostas certas');
        if(new Set(op.map(o=>String(o).toLowerCase())).size!==op.length)ruins.push(nome+': opcao repetida '+op);
        if(quatro&&op.length!==4)ruins.push(nome+': '+op.length+' opcoes '+op);}});
      return {ruins:ruins,n:Object.keys(n).length};})()`));
    console.log('          ' + r.n + ' geradores x 1.000 perguntas');
    A.deepStrictEqual(r.ruins, []);
  });
  await teste('2. escrita certa: nenhum distrator e palavra real (BALA no lugar de BOLA) e a palavra alvo aparece por uma pista', () => {
    const r = J(a.avaliar(`(()=>{const ruins=[];for(let i=0;i<1000;i++){const q=PT_BAS.grafiaCerta();
      q.options.filter(o=>o!==q.answer).forEach(o=>{if(ehPalavraReal(o))ruins.push(q.answer+' -> '+o);
        const t=o.toLowerCase().replace(/(ch|lh|nh|qu|gu)/g,'C');
        if(/[^aeiou]{3}/.test(t)||(/^[^aeiou]{2}/.test(t)&&!/^(br|bl|cr|cl|dr|fr|fl|gr|gl|pr|pl|tr|vr|ch|lh|nh)/.test(o.toLowerCase()))||/[aeiou]{2}/.test(t)&&!/[aeiou]{2}/.test(q.answer.toLowerCase()))ruins.push('ilegivel: '+q.answer+' -> '+o);});
      if(!/^Qual é o jeito certo de escrever: <b>[^<]+<.b>[?]$/.test(q.prompt))ruins.push('enunciado: '+q.prompt);
      }return [...new Set(ruins)].slice(0,12);})()`));
    A.deepStrictEqual(r, []);
  });
  await teste('3. lacunas (vogal e letra que falta): so a resposta completa uma palavra real; nenhum distrator vira palavra', () => {
    const r = J(a.avaliar(`(()=>{const ruins=[];['vogalQueFalta','letraQueFalta'].forEach(k=>{for(let i=0;i<1000;i++){const q=PT_BAS[k]();
      const lac=(q.prompt.match(/<b>([^<]+)<\\/b>/)||[])[1]||'';if(lac.indexOf('__')<0){ruins.push(k+': sem lacuna '+q.prompt);continue;}
      const reais=q.options.filter(o=>ehPalavraReal(lac.replace('__',o).toLowerCase()));
      if(reais.length!==1||reais[0]!==q.answer)ruins.push(k+': '+lac+' aceita '+reais);}});return [...new Set(ruins)].slice(0,12);})()`));
    A.deepStrictEqual(r, []);
  });
  await teste('4. rimas pelo SOM final do portugues do Brasil (el=eu, il=iu, al=au, ol=ou; GUE e QUI sem U): cada familia tem um som so, familias diferentes tem sons diferentes e so a resposta rima', () => {
    /* implementacao propria do teste (nao usa a do app) */
    const som = (w) => { w = String(w).toLowerCase(); const oxi = /[áéíóúâêôãõ]|[rlzui]$|ão$/.test(w.slice(-3));
      let t = w.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/([gq])u([ei])/g, '$1$2').replace(/el$/, 'eu').replace(/il$/, 'iu').replace(/al$/, 'au').replace(/ol$/, 'ou');
      const vs = [...t.matchAll(/[aeiou]+/g)]; if (!vs.length) return t; const v = oxi || vs.length < 2 ? vs[vs.length - 1] : vs[vs.length - 2];
      return t.slice(v.index).replace(/^([aeiou])[aeiou](?=[^aeiou])/, '$1'); };
    const RIMAS = J(a.avaliar('RIMAS')), ruins = [];
    A.strictEqual(som('papel'), som('véu'), 'o teste deveria ouvir PAPEL e VEU iguais');
    RIMAS.forEach((f) => { if (new Set(f.map(som)).size !== 1) ruins.push('familia com 2 sons: ' + f); });
    const sons = RIMAS.map((f) => som(f[0])); if (new Set(sons).size !== sons.length) ruins.push('duas familias com o mesmo som: ' + sons);
    const qs = J(a.avaliar('Array.from({length:1000},()=>{const q=PT_BAS.rima();return [q.prompt,q.options,q.answer];})'));
    qs.forEach(([p, op, ans]) => { const w = (p.match(/<b>([^<]+)<\/b>/) || [])[1]; op.forEach((o) => { if ((som(o) === som(w)) !== (o === ans)) ruins.push(w + ' / ' + o); }); });
    A.deepStrictEqual([...new Set(ruins)].slice(0, 12), []);
  });
  await teste('5. a lista de palavras reais existe, tem todas as palavras do banco e foi gerada pelo corretor (build/palavras-reais.swift)', () => {
    A.ok(a.avaliar('PALAVRAS_BASE.every(w=>PALAVRAS_REAIS.has(w.p))'));
    A.ok(a.avaliar("['bala','bela','bota','foca','pata','gata','mola'].every(w=>PALAVRAS_REAIS.has(w))"), 'faltam palavras reais conhecidas');
    A.ok(a.avaliar('PALAVRAS_REAIS.size') > 200);
    const cab = require('fs').readFileSync(require('path').join(__dirname, '..', 'src', 'conteudo', 'palavras-reais.js'), 'utf8').split('\n')[0];
    A.ok(/macOS \d+\.\d+(\.\d+)?, em \d{4}-\d{2}-\d{2}/.test(cab), 'cabecalho sem versao do macOS e data: ' + cab);
  });
  await teste('6. concordancia: nenhum enunciado de nenhum gerador (150 fases e treino) "Quantos X tem 2 ..." ou "Quantos X têm 1 ..."', () => {
    const r = J(a.avaliar(`(()=>{const ruim=new Set();const mks=new Set();['mat','pt','en'].forEach(m=>MATERIAS[m].units().forEach(u=>u.lessons.forEach(l=>l.makers.forEach(mk=>mks.add(mk)))));
      Object.values(MED3).concat(Object.values(MAT_BAS),Object.values(PT_BAS)).forEach(mk=>mks.add(mk));
      mks.forEach(mk=>{for(let k=0;k<40;k++){let q;try{q=mk();}catch(e){continue;}const t=String(q.prompt).replace(/<[^>]+>/g,' ');
        if(/\\bQuant[oa]s [a-zçãõé]+ têm 1 /i.test(t)||/\\bQuant[oa]s [a-zçãõé]+ tem ([2-9]|\\d{2,}) /i.test(t))ruim.add(t.slice(0,90));}});return [...ruim].slice(0,10);})()`));
    A.deepStrictEqual(r, []);
  });
  await teste('7. escrita legivel: Q so com U depois (QATO, QOLA, QENTE) e consoante com consoante so em encontro valido, RR, SS, par da palavra certa ou consoante que fecha silaba (ACSA, AJNELA, DETNE nao)', () => {
    /* implementacao propria do teste: pares de consoante que nao sao encontro nem existem na palavra certa */
    const ENC = new Set(['br', 'bl', 'cr', 'cl', 'dr', 'fr', 'fl', 'gr', 'gl', 'pr', 'pl', 'tr', 'vr', 'rr', 'ss']);
    /* digrafo (CH, LH, NH, QU, GU) conta como UMA consoante e entra no par: OFGUETE tem F+GU, GALINNHA tem N+NH */
    const DIG = /ch|lh|nh|[qg]u(?=[aeiouáéíóâêôãõ])|./g;   /* QU e GU so sao digrafo antes de vogal: AL-GU-MA tem U vogal */
    const pares = (w) => { const t = String(w).toLowerCase().match(DIG) || []; const o = [];
      for (let i = 0; i < t.length - 1; i++) if (/^[bcdfghjklmnpqrstvwxz]/.test(t[i]) && /^[bcdfghjklmnpqrstvwxz]/.test(t[i + 1])) o.push(t[i] + '+' + t[i + 1]); return o; };
    const ruimDe = (o, p) => { o = o.toLowerCase(); if (/q(?!u)/.test(o)) return 'Q sem U'; const da = new Set(pares(p));
      if ((o.match(DIG) || []).some((x, i) => x === 'h' && i > 0)) return 'H solto';
      const fecha = (z) => z[0] !== z[1] && (/^[rsl]/.test(z) || /^m[pb]$/.test(z) || /^n[^pb]$/.test(z));   /* R, S, L, M e N fecham silaba: ARTO, CAMPO */
      const ok = (z) => { const [x, y] = z.split('+'); if (x.length > 1) return false;   /* depois de digrafo so vogal */
        if (y.length > 1) return x !== y[0] && /^(ch|qu|gu)$/.test(y) && /^[rsln]$/.test(x);   /* MARCHA, ESQUILO, SANGUE; nada antes de LH e NH */
        return ENC.has(x + y) || fecha(x + y); };
      const x = pares(o).find((z) => !da.has(z) && !ok(z)); return x ? 'par ' + x : ''; };
    ['qato', 'qola', 'qente', 'acsa', 'ajnela', 'detne', 'ratto', 'bollo', 'facca'].forEach((w) => A.strictEqual(a.avaliar('legivel(' + JSON.stringify(w) + ')'), false, w + ' deveria ser ilegivel'));
    /* segunda passada: consoante colada em digrafo e H solto (antes passavam, o digrafo virava um marcador que pulava o par) */
    [['ofguete', 'foguete'], ['fogguete', 'foguete'], ['galinnha', 'galinha'], ['galniha', 'galinha'], ['gallinha', 'galinha'],
      ['ofgete', 'foguete'], ['bochla', 'bola'], ['achha', ''], ['malhha', ''], ['penhca', ''], ['tlha', ''], ['malhra', ''], ['velhsa', '']].forEach(([w, p]) =>
      A.strictEqual(a.avaliar('legivel(' + JSON.stringify(w) + ',' + JSON.stringify(p) + ')'), false, w + ' deveria ser ilegivel'));
    ['marcha', 'esquilo', 'sangue', 'cinquenta', 'hora', 'alguma', 'figura', 'agua', 'quando', 'galinha', 'foguete'].forEach((w) =>
      A.strictEqual(a.avaliar('legivel(' + JSON.stringify(w) + ')'), true, w + ' deveria ser legivel'));
    ['bola', 'prato', 'carro', 'massa', 'chuva', 'quilo', 'galinha', 'foguete'].forEach((w) => A.strictEqual(a.avaliar('legivel(' + JSON.stringify(w) + ')'), true, w + ' deveria ser legivel'));
    A.strictEqual(a.avaliar("legivel('dente','dente')"), true, 'o NT de DENTE vale quando a palavra certa e DENTE');
    A.strictEqual(a.avaliar("legivel('detne','dente')"), false, 'TN nao existe em DENTE');
    const lotes = J(a.avaliar(`(()=>{const o=[];PALAVRAS_BASE.forEach(w=>{for(let k=0;k<60;k++)o.push([w.p,errosDeGrafia(w.p,3)]);});
      for(let i=0;i<1000;i++){const q=PT_BAS.grafiaCerta();o.push([q.answer,q.options.filter(x=>x!==q.answer)]);}return o;})()`));
    const ruins = new Set();
    lotes.forEach(([p, erradas]) => erradas.forEach((o) => { const r = ruimDe(o, p); if (r) ruins.add(String(p).toUpperCase() + ' -> ' + String(o).toUpperCase() + ' (' + r + ')'); }));
    A.deepStrictEqual([...ruins].slice(0, 12), []);
  });
  await teste('8. pistas da escrita certa: uma por palavra, sem pista repetida e sem as pistas que serviam para duas coisas (meia, menina, lingua, manga, brigadeiro)', () => {
    const P = J(a.avaliar('PISTA_PALAVRA')), ruins = [];
    const ambiguas = { sapato: 'vai no pé', menino: 'criança', dente: 'fica na boca', banana: 'fruta amarela', bolo: 'doce de aniversário' };
    Object.keys(ambiguas).forEach((k) => { if (!P[k]) ruins.push('sem pista: ' + k); else if (P[k] === ambiguas[k]) ruins.push('pista ambigua continua: ' + k + ' = ' + P[k]); });
    const vals = Object.values(P); if (new Set(vals).size !== vals.length) ruins.push('pista repetida');
    Object.entries(P).forEach(([k, v]) => { if (v.toLowerCase().includes(k)) ruins.push('a pista entrega a palavra: ' + k); if (/[–—]/.test(v)) ruins.push('travessao: ' + k); });
    const usadas = J(a.avaliar('PALAVRAS_BASE.filter(x=>x.p.length>=4&&errosDeGrafia(x.p,3).length>=3).map(x=>x.p)'));
    usadas.forEach((w) => { if (!P[w]) ruins.push('palavra da escrita certa sem pista: ' + w); });
    A.ok(usadas.length >= 25, 'a escrita certa ficou com poucas palavras: ' + usadas.length);
    A.deepStrictEqual(ruins, []);
  });
  await teste('9. dinheiro, troco e repartir: sempre 4 opcoes distintas, nenhuma menor que 1', () => {
    const r = J(a.avaliar(`(()=>{const ruins=[];['dinheiro','troco','historinhaReparte'].forEach(k=>{for(let i=0;i<2000;i++){const q=MAT_BAS[k]();
      if(q.options.length!==4)ruins.push(k+': '+q.options.length+' opcoes '+q.options);
      q.options.forEach(o=>{const v=Number(String(o).replace(/[^0-9,]/g,'').replace(',','.'));if(!(v>=1))ruins.push(k+': opcao '+o);});}});return [...new Set(ruins)].slice(0,10);})()`));
    A.deepStrictEqual(r, []);
  });
  resumo('geradores.js');
})();
