#!/usr/bin/env node
'use strict';
/* Pacote D · conteúdo: os 7 itens da engenharia reversa nas aulas básicas (etapas 1 a 3), treinar por tema em todas as matérias, programa de 20
   dias e o 3º ano (medidas e tempo, 20 textos curtos). Tudo pelo GERADOR DE VERDADE (200 sorteios por gerador; genQuestions das fases reais).
   Uso: node testes/conteudo.js */
const A = require('assert');
const fs = require('fs');
const path = require('path');
const { carregarApp, RAIZ } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const novo = () => { const a = carregarApp(13, {}); a.avaliar("novoPerfil('Zeca','#12A06E')"); return a; };
const J = (x) => JSON.parse(JSON.stringify(x));

(async () => {
  const a = novo();
  await teste('1. todo gerador novo (basicas, 3o ano, leitura) faz 200 perguntas validas: resposta entre as opcoes, opcoes distintas, sem negativo, sem emoji, figura segura', () => {
    const r = J(a.avaliar(`(()=>{const ruins=[];let n=0;
      const ger=[].concat(Object.keys(MAT_BAS).map(k=>['MAT_BAS.'+k,MAT_BAS[k]]),Object.keys(PT_BAS).map(k=>['PT_BAS.'+k,PT_BAS[k]]),
        Object.keys(EN_BAS).map(k=>['EN_BAS.'+k,EN_BAS[k]]),Object.keys(MED3).map(k=>['MED3.'+k,MED3[k]]),[['leituraCurta',leituraCurta]]);
      ger.forEach(([nome,mk])=>{for(let i=0;i<200;i++){n++;const q=mk();
        const op=q.options||[];const txt=q.prompt+' '+op.join(' ');
        if(q.type!=='mc'||op.indexOf(q.answer)<0)ruins.push(nome+': resposta fora das opcoes '+q.answer+' '+op);
        else if(new Set(op).size!==op.length||op.length<2)ruins.push(nome+': opcoes repetidas '+op);
        else if(/undefined|NaN|null|-\\d/.test(txt))ruins.push(nome+': '+txt.slice(0,80));
        else if(/\\p{Extended_Pictographic}/u.test(txt))ruins.push(nome+': emoji');
        else if(q.figure&&!figuraSegura(q.figure))ruins.push(nome+': figura recusada');
        else if(!perguntaSegura(q))ruins.push(nome+': pergunta recusada pelo caderno');
        if(ruins.length>12)break;}});
      return {n:n,ruins:ruins.slice(0,12),ger:ger.length};})()`));
    console.log('          ' + r.ger + ' geradores, ' + r.n + ' perguntas');
    A.deepStrictEqual(r.ruins, []);
  });
  await teste('2. distratores por letras que se confundem (b/d/p/q, m/n...) e erros de ortografia plausiveis (4 operacoes), nunca a palavra certa', () => {
    const r = J(a.avaliar(`(()=>{const o={conf:0,tot:0,ruim:[]};
      for(let i=0;i<300;i++){const q=PT_BAS.letraQueFalta();const l=q.answer.toLowerCase();const c=CONFUNDE[l]||[];o.tot++;
        if(q.options.filter(x=>x!==q.answer).filter(x=>c.indexOf(x.toLowerCase())>=0).length>=Math.min(2,c.length))o.conf++;}
      /* VELA: a lista de bloqueio tirou FELA (gíria ofensiva) e sobrou só VOLA. Nunca chega à criança por errosDeGrafia: a escrita certa
         exige 3 e o juntar sílabas tem BOLA e MALA (testes/distratores.js caso 5). A exceção só vale enquanto for necessária. */
      const POUCOS={vela:1};
      PALAVRAS_BASE.forEach(w=>{const e=errosDeGrafia(w.p,3),min=POUCOS[w.p]||2;if(POUCOS[w.p]&&e.length>=2)o.ruim.push(w.p+': excecao sobrando');
        if(e.length<min||e.indexOf(w.p)>=0||new Set(e).size!==e.length)o.ruim.push(w.p+':'+e);
        e.forEach(x=>{if(Math.abs(x.length-w.p.length)>1)o.ruim.push(w.p+'->'+x);});});
      return o;})()`));
    A.ok(r.conf / r.tot >= 0.95, 'distratores confundiveis em ' + Math.round(100 * r.conf / r.tot) + '%');
    A.deepStrictEqual(r.ruim, []);
  });
  await teste('3. os itens entram nas aulas basicas (etapas 1 a 3 de cada planeta) e saem nas rodadas de verdade da fase', () => {
    const r = J(a.avaliar(`(()=>{const o={fora:[],nunca:[]};
      Object.keys(BASICAS_POR_FASE).forEach(id=>{const x=licaoPorId(id);if(!x||x.u.n>3)o.fora.push(id);
        const novos=BASICAS_POR_FASE[id];let viu=0;for(let k=0;k<120&&!viu;k++){genQuestions(x.l,8).forEach(q=>{if(novos.indexOf(q.__mk)>=0)viu=1;(q.__origens||[]).forEach(oq=>{if(novos.indexOf(oq.__mk)>=0)viu=1;});});}
        if(!viu)o.nunca.push(id);});return o;})()`));
    A.deepStrictEqual(r.fora, [], 'fora das etapas 1 a 3'); A.deepStrictEqual(r.nunca, [], 'gerador novo nunca saiu na fase');
    /* trilha fonologica completa em portugues: som inicial, rima, contar e juntar silabas, vogal e letra que falta, grafia certa */
    ['somInicial', 'rima', 'contarSilabas', 'juntarSilabas', 'vogalQueFalta', 'letraQueFalta', 'grafiaCerta'].forEach((k) => A.ok(a.avaliar('Object.values(BASICAS_POR_FASE).some(l=>l.indexOf(PT_BAS.' + k + ')>=0)'), k));
    ['dinheiro', 'troco', 'relogioHora', 'formas', 'padrao', 'historinhaSoma'].forEach((k) => A.ok(a.avaliar('Object.values(BASICAS_POR_FASE).some(l=>l.indexOf(MAT_BAS.' + k + ')>=0)'), k));
  });
  await teste('4. treinar por tema: todo tema das 3 materias monta 10 perguntas; o que ainda nao domina vem primeiro; indicado pela faixa', () => {
    const r = J(a.avaliar(`(()=>{const o={curtos:[],n:0,indic:0};['mat','pt','en'].forEach(m=>temasDe(m).forEach(t=>{o.n++;const qs=perguntasDoTreino(t);if(qs.length<10)o.curtos.push(m+':'+t.id+'='+qs.length);}));
      S.faixa='f78';o.indic=temasDe('pt').filter(t=>t.faixa.indexOf('f78')>=0).length;return o;})()`));
    A.ok(r.n >= 35, 'temas: ' + r.n); A.deepStrictEqual(r.curtos, []); A.ok(r.indic >= 4);
    const prim = a.avaliar(`(()=>{const t=TEMAS.mat.find(x=>x.id==='dinheiro');const ks=geradoresDoTema(t).map(chaveDoGerador);S.habil={};
      ks.forEach((k,i)=>{S.habil[k]={p:i===ks.length-1?.1:.97,n:10,a:9,v:0,r:1,d:['2026-01-01','2026-01-02'],u:hoje(),dom:i!==ks.length-1};});
      let ok=0;for(let k=0;k<20;k++){const q=perguntasDoTreino(t)[0];const kk=chaveDaPergunta(q.__base||q);if(kk===ks[ks.length-1])ok++;}return ok;})()`);
    A.ok(prim >= 18, 'o tema ainda nao dominado deveria abrir o treino: ' + prim + ' de 20');
  });
  await teste('5. treino pela interface: abre, 10 perguntas, moeda por acerto, sem estrela, marca o dia do programa', () => {
    const b = novo();
    b.avaliar("S.moedas=0;S.feitas={};S.programaAtual={m:'mat',i:0};abrirTreino('mat','contar',true)");
    let g = 0; while (b.avaliar('LIC.etapa') === 'questao' && g++ < 40) b.avaliar('LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar()');
    const r = J(b.avaliar('({et:LIC.etapa,base:LIC.base,m:S.moedas,feitas:Object.keys(S.feitas).length,prog:S.programa})'));
    A.strictEqual(r.et, 'fim'); A.strictEqual(r.base, 10); A.ok(r.m > 0, 'sem moeda'); A.strictEqual(r.feitas, 0, 'treino deu estrela');
    A.deepStrictEqual(r.prog, { mat: [0] }, 'dia 1 do programa nao foi marcado');
  });
  await teste('5b. treino do programa abandonado no meio nao marca o dia e limpa o programa em andamento', () => {
    const b = novo();
    b.avaliar("S.programa={};S.programaAtual={m:'mat',i:0};abrirTreino('mat','contar',true);LIC.resp=LIC.qs[0].answer;conferir();avancar();fecharLicao()");
    A.strictEqual(b.avaliar('S.programaAtual'), null, 'programaAtual ficou');
    b.avaliar("abrirTreino('mat','contar')"); let g = 0; while (b.avaliar('LIC.etapa') === 'questao' && g++ < 30) b.avaliar('LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar()');
    A.ok(!(b.avaliar('JSON.stringify(S.programa)') || '').includes('[0]'), 'o dia foi marcado sem o programa: ' + b.avaliar('JSON.stringify(S.programa)'));
  });
  await teste('5c. programa em andamento nao sobrevive a fechar o app nem a abrir um treino fora do programa', () => {
    const b = novo();
    A.strictEqual(b.avaliar("estadoDe({programaAtual:{m:'mat',i:3},programa:{mat:[0,1]}}).programaAtual"), null, 'programaAtual voltou do armazenamento');
    A.strictEqual(b.avaliar("JSON.stringify(estadoDe({programa:{mat:[0,1]}}).programa)"), '{"mat":[0,1]}', 'dias feitos se perderam');
    b.avaliar("S.programa={};S.programaAtual={m:'mat',i:0};abrirTreino('mat','contar')");
    A.strictEqual(b.avaliar('S.programaAtual'), null, 'treino fora do programa manteve o programa em andamento');
    let g = 0; while (b.avaliar('LIC.etapa') === 'questao' && g++ < 30) b.avaliar('LIC.resp=LIC.qs[LIC.i].answer;conferir();avancar()');
    A.strictEqual(b.avaliar('JSON.stringify(S.programa)'), '{}', 'dia marcado por treino de fora do programa');
  });
  await teste('6. programa de 20 dias: 20 dias por planeta, todos temas que existem; 3o ano: 20 textos com 2 perguntas, medidas e tempo nas fases', () => {
    const r = J(a.avaliar(`(()=>({p:['mat','pt','en'].map(m=>PROGRAMA20[m].length+':'+PROGRAMA20[m].filter(id=>!TEMAS[m].some(t=>t.id===id)).join()),
      textos:TEXTOS3.length,perg:TEXTOS3.every(x=>x.q.length===2&&x.q.every(q=>q[2].indexOf(q[1])<0)),trav:TEXTOS3.some(x=>/[—–]/.test(x.t)),
      med:['8.5','1.5','2.4','6.4','1.4'].every(id=>TERCEIRO_POR_FASE[id].every(mk=>licaoPorId(id).l.makers.indexOf(mk)>=0))}))()`));
    A.deepStrictEqual(r.p, ['20:', '20:', '20:']); A.strictEqual(r.textos, 20); A.ok(r.perg); A.ok(!r.trav); A.ok(r.med);
  });
  await teste('7. textos novos com voz estao em audio/regerar-pendentes.json (os 20 textos, as 30 pistas); nenhum audio gerado nesta rodada', () => {
    const p = JSON.parse(fs.readFileSync(path.join(RAIZ, 'audio', 'regerar-pendentes.json'), 'utf8'));
    const tx = new Set(p.itens.map((i) => i.texto));
    const textos = J(a.avaliar('TEXTOS3.map(x=>x.t)')), pistas = J(a.avaliar('[].concat(PISTAS.mat,PISTAS.pt,PISTAS.en)'));
    textos.concat(pistas).forEach((t) => A.ok(tx.has(t), 'sem pedido de voz: ' + t.slice(0, 50)));
  });
  await teste('8. chave das habilidades estavel: os geradores novos entram no FIM da fase (as posicoes antigas nao mudam)', () => {
    const r = J(a.avaliar(`(()=>{const ruins=[];Object.keys(BASICAS_POR_FASE).concat(Object.keys(TERCEIRO_POR_FASE)).forEach(id=>{const l=licaoPorId(id).l,ex=(BASICAS_POR_FASE[id]||[]).concat(TERCEIRO_POR_FASE[id]||[]);
      ex.forEach(mk=>{if(l.makers.indexOf(mk)<l.makers.length-ex.length)ruins.push(id);});});return ruins;})()`));
    A.deepStrictEqual(r, []);
  });
  resumo('conteudo.js');
})();
