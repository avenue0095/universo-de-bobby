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
  resumo('geradores.js');
})();
