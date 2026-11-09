#!/usr/bin/env node
'use strict';
/* 1G · adaptação por habilidade (BKT por gerador) e diagnóstico de entrada. Os 7 testes da mesa 04 §7a, mais a ligação com a fase.
   Toda pergunta vem do GERADOR DE VERDADE (genQuestions / diagPergunta); nada montado à mão.   Uso: node testes/adaptacao.js */
const A = require('assert');
const fs = require('fs');
const path = require('path');
const { carregarApp, prng } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const novo = (s) => { const a = carregarApp(s || 21, {}); a.avaliar("novoPerfil('Zeca','#12A06E')"); return a; };

(async () => {
  await teste('1. crianca que acerta 100%: toda habilidade da fase chega a pL >= 0,90 em ate 5 respostas e NAO fica dominada no mesmo dia', () => {
    const a = novo();
    const r = a.avaliar(`(()=>{const out=[],falhas=[];['mat','pt','en'].forEach(m=>{const l=MATERIAS[m].units()[1].lessons[1];
      l.makers.forEach((mk,i)=>{let q=null;try{q=mk();}catch(e){falhas.push(l.id+':'+i+' excecao '+e.message);return;}if(!q){falhas.push(l.id+':'+i+' devolveu nada');return;}q.__mk=mk;
        let n=0;while(n<5&&habilDe(chaveDaPergunta(q)).p<.9){adaptRegistrar(q,true,{primeira:true,dia:'2026-11-02'});n++;}
        const h=habilDe(chaveDaPergunta(q));out.push({k:chaveDaPergunta(q),p:h.p,n:n,dom:h.dom});});});return {out:out,falhas:falhas};})()`);
    /* gerador que lança exceção ou devolve nada é falha, não é pulado (revisão independente de 09/11) */
    A.deepStrictEqual(JSON.parse(JSON.stringify(r.falhas)), [], 'gerador falhou');
    const lista = r.out;
    A.ok(lista.length >= 15, 'poucas habilidades testadas: ' + lista.length);
    lista.forEach((h) => { A.ok(h.p >= 0.9, h.k + ' ficou em ' + h.p.toFixed(2) + ' depois de ' + h.n); A.ok(!h.dom, h.k + ' dominou no mesmo dia'); });
    /* dia 2 + acerto em revisao: agora domina */
    const d = a.avaliar(`(()=>{const l=UNITS_MAT[1].lessons[1];const q=genQuestions(l,1)[0];const k=chaveDaPergunta(q);
      for(let i=0;i<5;i++)adaptRegistrar(q,true,{primeira:true,dia:'2026-11-02'});
      adaptRegistrar(q,true,{primeira:true,dia:'2026-11-03',rev:true});return habilDe(k).dom;})()`);
    A.ok(d, 'com 2 dias acima de 0,90 e acerto em revisao deveria dominar');
  });

  await teste('2. crianca que acerta 50%: pL fica abaixo de 0,75, nenhuma domina e a fase pede exemplo resolvido depois de 6 respostas', () => {
    const a = novo();
    const r = a.avaliar(`(()=>{const l=UNITS_PT[2].lessons[0];const rnd=mulberry32(5);const ps=[];let dom=0;
      for(let i=0;i<60;i++){const q=genQuestions(l,8)[i%8];if(!chaveDaPergunta(q))continue;adaptRegistrar(q,rnd()<.5,{primeira:true,dia:somaDias('2026-11-01',i%4)});}
      l.makers.forEach((mk,i)=>{const h=S.habil[l.id+':'+i];if(h){ps.push(h.p);if(h.dom)dom++;}});
      /* uma habilidade com 6 erros seguidos de 8: abaixo de 0,30 */
      const q=genQuestions(l,1)[0];for(let i=0;i<8;i++)adaptRegistrar(q,i===3,{primeira:true,dia:'2026-11-05'});
      return {ps:ps,dom:dom,ex:precisaExemplo(l,'2026-11-05'),p:habilDe(chaveDaPergunta(q)).p};})()`);
    A.ok(r.ps.length >= 3, 'poucas habilidades com resposta');
    const media = r.ps.reduce((x, y) => x + y, 0) / r.ps.length;
    A.ok(media < 0.75, 'pL medio ' + media.toFixed(2) + ' com 50%');
    A.strictEqual(r.dom, 0);
    A.ok(r.p < 0.3, 'pL da habilidade fraca ' + r.p);
    A.ok(r.ex, 'deveria pedir exemplo resolvido');
    /* a fase de verdade abre com o lembrete aberto */
    a.avaliar('usarMateria("pt");abrirLicao(2,0)');
    A.ok(a.avaliar('!!LIC.qs[0].__exemplo'), 'a primeira pergunta deveria vir marcada __exemplo');
  });

  await teste('3. chute puro em escolha de 4 (25%): pL medio de 40 criancas nao passa de 0,40 depois de 20 respostas', () => {
    const a = novo();
    const r = a.avaliar(`(()=>{let pior=0;for(let s=1;s<=40;s++){const rnd=mulberry32(s);S.habil={};
      const l=UNITS_MAT[3].lessons[0];let q=null;for(let t=0;t<200&&!q;t++){const c=genQuestions(l,8).find(x=>x.type==='mc'&&x.options.length===4&&!x.verbo);if(c)q=c;}
      if(!q)return -1;for(let i=0;i<20;i++){adaptRegistrar(q,rnd()<.25,{primeira:true,dia:'2026-11-01'});}
      pior+=habilDe(chaveDaPergunta(q)).p;}return pior/40;})()`);
    A.ok(r >= 0, 'nao achei pergunta de escolha de 4 no gerador');
    A.ok(r <= 0.4, 'pL medio com chute (40 criancas) chegou a ' + r.toFixed(3));
  });

  await teste('4. escolha do gerador: em 1.000 sorteios a probabilidade prevista media fica entre 0,75 e 0,85 e nenhum gerador sai 3 vezes seguidas', () => {
    const a = novo();
    const r = a.avaliar(`(()=>{const rnd=mulberry32(9);let soma=0,n=0,tres=0;S.faixa='f910';
      const fases=[UNITS_MAT[2].lessons[1],UNITS_PT[3].lessons[2],UNITS_EN[1].lessons[3],UNITS_MAT[5].lessons[0]];
      for(let rod=0;rod<50;rod++){const l=fases[rod%fases.length];S.habil={};
        l.makers.forEach((mk,i)=>{S.habil[l.id+':'+i]={p:rnd(),n:3,a:2,v:0,r:0,d:[],u:'2026-11-01',dom:false};});
        const ult=[];
        for(let t=0;t<20;t++){const mk=escolherGerador(l.makers,ult,{dia:'2026-11-01'});const k=chaveDoGerador(mk);
          const par=BKT[materiaDoId(k)];soma+=bktPrever(S.habil[k].p,par,.25);n++;
          if(ult.length>=2&&ult[ult.length-1]===mk&&ult[ult.length-2]===mk)tres++;ult.push(mk);}}
      return {media:soma/n,n:n,tres:tres};})()`);
    A.strictEqual(r.n, 1000);
    A.ok(r.media >= 0.75 && r.media <= 0.85, 'media prevista ' + r.media.toFixed(3));
    A.strictEqual(r.tres, 0, 'mesmo gerador 3 vezes seguidas');
  });

  await teste('5. decaimento: pL 0,95 sem uso por 90 dias abre em cerca de 0,24 e volta para a rotacao', () => {
    const a = novo();
    const r = a.avaliar(`(()=>{const l=UNITS_MAT[0].lessons[2];S.habil={};
      l.makers.forEach((mk,i)=>{S.habil[l.id+':'+i]={p:.95,n:10,a:10,v:0,r:1,d:['2026-08-01','2026-08-02'],u:'2026-08-02',dom:true};});
      const h=S.habil[l.id+':0'];const p=pAtual(h,somaDias('2026-08-02',90));
      const q=genQuestions(l,1)[0];adaptRegistrar(q,false,{primeira:true,dia:somaDias('2026-08-02',90)});
      return {p:p,dom:habilDe(chaveDaPergunta(q)).dom,pGuardado:S.habil[l.id+':0'].p};})()`);
    A.ok(Math.abs(r.p - 0.2375) < 0.01, 'pL decaido ' + r.p);
    A.strictEqual(r.dom, false, 'depois de errar com pL baixo deveria sair de dominado');
    A.ok(Math.abs(r.pGuardado - 0.95) < 1e-9 || r.pGuardado < 0.5, 'ler o pL nao pode gravar o decaimento');
  });

  await teste('6. diagnostico: 20 perfis simulados com unidade real conhecida ficam a +-1 unidade em pelo menos 17 (perguntas do gerador de verdade)', () => {
    const a = novo();
    const r = a.avaliar(`(()=>{const rnd=mulberry32(77);let ok=0,nmax=0;const det=[];
      const faixas=['f78','f910','f1112'];
      for(let s=0;s<20;s++){S.habil={};S.diag={};const m=['mat','pt'][s%2];const real=1+Math.floor(rnd()*9);const fx=faixas[s%3];
        const dg=diagNovo(m,fx);let fim=false,n=0;
        while(!fim&&n<12){const q=diagPergunta(dg);if(!q)break;const opc=Array.isArray(q.options)?q.options.length:0;
          const pAc=q.__diag.u<real?.92:chuteDe(q,m);fim=diagResponder(dg,q,rnd()<pAc);n++;}
        if(!dg.fim)diagFechar(dg);nmax=Math.max(nmax,dg.n);
        const esp=Math.min(10,real);det.push(m+':'+real+'->'+dg.inicio);if(Math.abs(dg.inicio-esp)<=1)ok++;}
      return {ok:ok,nmax:nmax,det:det.join(' ')};})()`);
    console.log('          ' + r.det);
    A.ok(r.nmax <= 10, 'passou de 10 perguntas: ' + r.nmax);
    A.ok(r.ok >= 17, 'posicionados certo: ' + r.ok + ' de 20');
  });

  await teste('7. nada disso e visivel para a crianca: sem nivel, nota, pL, "subiu" ou "desceu" no HTML das telas da crianca', () => {
    const a = novo();
    a.avaliar(`(()=>{const l=UNITS_MAT[0].lessons[0];for(let i=0;i<10;i++){const q=genQuestions(l,1)[0];adaptRegistrar(q,i%3>0,{primeira:true,dia:'2026-11-0'+(1+i%5)});}})()`);
    const { HTML_LOG } = require('./lib/carregar.js');
    HTML_LOG.length = 0;
    a.avaliar('abrirLicao(0,0);LIC.etapa="questao";pintarLicao();LIC.resp="__x__";conferir();avancar();renderTrilha();');
    a.avaliar('abrirDiagnostico("mat");LIC.etapa="questao";pintarLicao();');
    const html = HTML_LOG.join('\n').replace(/<[^>]*>/g, ' ');
    const proib = /\b(pL|BKT|camada|subiu de n[ií]vel|desceu|sua nota|nota \d|n[ií]vel de dom[ií]nio|dominad[ao])\b/i;
    const m = html.match(proib);
    A.ok(!m, 'texto proibido na tela da crianca: ' + (m && m[0]));
  });

  await teste('8. missao de exploracao pela fase de verdade: ate 10 perguntas, sem moeda, sem caderno, sem perder coracao; grava o ponto de partida', () => {
    const a = novo();
    a.avaliar('S.moedas=37;S.xp=50;salvar()');
    a.avaliar('abrirDiagnostico("pt");LIC.etapa="questao";pintarLicao()');
    let n = 0;
    while (n < 12 && a.avaliar('LIC.etapa') === 'questao') {
      a.avaliar('LIC.resp="__errada__";conferir();avancar()'); n++;
    }
    const r = a.avaliar('JSON.parse(JSON.stringify({et:LIC.etapa,m:S.moedas,xp:S.xp,vidas:LIC.vidas,diag:S.diag,cad:Object.keys(S.errados).length,resp:LIC.respondidas}))');
    A.strictEqual(r.et, 'fim');
    A.ok(r.resp >= 2 && r.resp <= 10, 'respondidas ' + r.resp);
    A.strictEqual(r.m, 37, 'moedas mudaram'); A.strictEqual(r.xp, 50, 'xp mudou'); A.strictEqual(r.vidas, 5, 'perdeu coracao');
    A.strictEqual(r.cad, 0, 'foi para o caderno');
    A.ok(r.diag.pt && r.diag.pt.u === 1, 'errando tudo deveria comecar na etapa 1: ' + JSON.stringify(r.diag));
    a.avaliar('pintarLicao()');
  });

  await teste('9. fase normal registra acerto de primeira por habilidade; a repeticao conta como segunda chance; estado sobrevive a salvar e reler', () => {
    const a = novo();
    a.avaliar('abrirLicao(0,1);LIC.etapa="questao";pintarLicao()');
    a.avaliar('const q0=LIC.qs[0];LIC.resp=q0.answer;conferir();avancar();LIC.resp="__errada__";conferir();avancar();');
    const r = a.avaliar(`(()=>{const tot={n:0,a:0};Object.keys(S.habil).forEach(k=>{tot.n+=S.habil[k].n;tot.a+=S.habil[k].a;});
      const s2=estadoDe(JSON.parse(JSON.stringify(S)));let n2=0;Object.keys(s2.habil).forEach(k=>{n2+=s2.habil[k].n;});return {n:tot.n,a:tot.a,n2:n2,ks:Object.keys(S.habil)};})()`);
    A.ok(r.n >= 2, 'respostas de primeira: ' + r.n);
    A.ok(r.a <= r.n);
    A.strictEqual(r.n2, r.n, 'habil se perdeu ao reler o estado');
    r.ks.forEach((k) => A.ok(/^\d+\.\d+:\d+$/.test(k), 'chave fora do padrao: ' + k));
    /* lixo no estado nao entra */
    const lixo = a.avaliar(`Object.keys(estadoDe({habil:{'__proto__':{p:9},'x:1':{p:1},'1.1:0':{p:7,n:-3,a:99}}}).habil).join(',')`);
    A.strictEqual(lixo, '1.1:0');
    const h = a.avaliar(`JSON.parse(JSON.stringify(estadoDe({habil:{'1.1:0':{p:7,n:-3,a:99}}}).habil['1.1:0']))`);
    A.ok(h.p <= 0.999 && h.n === 0 && h.a === 0, JSON.stringify(h));
  });

  resumo();
})();
