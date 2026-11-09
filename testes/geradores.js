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
      q.options.filter(o=>o!==q.answer).forEach(o=>{if(ehPalavraReal(o))ruins.push(q.answer+' -> '+o);});
      if(!/<b>[^<]{4,}<\\/b>/.test(q.prompt))ruins.push('sem pista: '+q.prompt);}return [...new Set(ruins)].slice(0,12);})()`));
    A.deepStrictEqual(r, []);
  });
  await teste('3. lacunas (vogal e letra que falta): so a resposta completa uma palavra real; nenhum distrator vira palavra', () => {
    const r = J(a.avaliar(`(()=>{const ruins=[];['vogalQueFalta','letraQueFalta'].forEach(k=>{for(let i=0;i<1000;i++){const q=PT_BAS[k]();
      const lac=(q.prompt.match(/<b>([^<]+)<\\/b>/)||[])[1]||'';if(lac.indexOf('__')<0){ruins.push(k+': sem lacuna '+q.prompt);continue;}
      const reais=q.options.filter(o=>ehPalavraReal(lac.replace('__',o).toLowerCase()));
      if(reais.length!==1||reais[0]!==q.answer)ruins.push(k+': '+lac+' aceita '+reais);}});return [...new Set(ruins)].slice(0,12);})()`));
    A.deepStrictEqual(r, []);
  });
  await teste('4. rimas: so a resposta rima com a palavra do enunciado (nenhuma familia mistura sons: CHAPEU nao rima com MEL)', () => {
    const r = J(a.avaliar(`(()=>{const ruins=[];const fim=w=>w.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').slice(-2);
      RIMAS.forEach(f=>{const t=f.map(fim);if(new Set(t).size!==1)ruins.push('familia mistura: '+f);});
      for(let i=0;i<1000;i++){const q=PT_BAS.rima();const w=(q.prompt.match(/<b>([^<]+)<\\/b>/)||[])[1];
        const f=RIMAS.find(x=>x.some(y=>y.toUpperCase()===w));q.options.forEach(o=>{const mesma=f.some(y=>y.toUpperCase()===o);if((o===q.answer)!==mesma)ruins.push(w+' / '+o);});}
      return [...new Set(ruins)].slice(0,12);})()`));
    A.deepStrictEqual(r, []);
  });
  await teste('5. a lista de palavras reais existe, tem todas as palavras do banco e foi gerada pelo corretor (build/palavras-reais.swift)', () => {
    A.ok(a.avaliar('PALAVRAS_BASE.every(w=>PALAVRAS_REAIS.has(w.p))'));
    A.ok(a.avaliar("['bala','bela','bota','foca','pata','gata','mola'].every(w=>PALAVRAS_REAIS.has(w))"), 'faltam palavras reais conhecidas');
    A.ok(a.avaliar('PALAVRAS_REAIS.size') > 200);
  });
  resumo('geradores.js');
})();
