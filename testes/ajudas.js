#!/usr/bin/env node
'use strict';
/* Ajuda por pergunta: nas 150 fases, toda pergunta de todo gerador tem ajuda PROPRIA (do gerador ou de um modelo reconhecido pelo texto),
   nunca a generica, e a ajuda cita a resposta ou um numero/palavra da pergunta. O "Como fazer" antes de responder nao entrega a resposta.
   Uso: node testes/ajudas.js */
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');

(async () => {
  const a = carregarApp(5, {}); a.avaliar("novoPerfil('Zeca','#12A06E')");
  const r = a.avaliar(`(()=>{const o={fontes:{},gen:[],semCita:[],tot:0,fases:0,revela:[]};const txt=h=>String(h).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\\s+/g,' ').trim();
    ['mat','pt','en'].forEach(m=>{usarMateria(m);MATERIAS[m].units().forEach(u=>u.lessons.forEach(l=>{o.fases++;l.makers.forEach((mk,mi)=>{for(let t=0;t<4;t++){let q;try{q=mk();}catch(e){continue;}if(!q)continue;o.tot++;
      const h=ajudaDe(q);o.fontes[h.fonte]=(o.fontes[h.fonte]||0)+1;const p=txt(q.prompt),ans=txt(q.answer),all=txt(h.metodo+' '+h.resposta);
      const nums=p.match(/\\d+/g)||[],words=(p.match(/\\b[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,}\\b/g)||[]).concat((p.match(/[“"]([^”"]+)[”"]/)||[]).slice(1));
      const cita=all.indexOf(ans)>=0||nums.some(x=>all.indexOf(x)>=0)||words.some(x=>all.indexOf(x)>=0);
      if(h.fonte==='generica')o.gen.push(m+' '+l.id+': '+p.slice(0,60));
      if(!cita)o.semCita.push(m+' '+l.id+': '+p.slice(0,60)+' => '+all.slice(0,50));
      if(!h.resposta||!txt(h.metodo))o.semCita.push(m+' '+l.id+': ajuda vazia');}});}))});return o;})()`);
  await teste('1. 150 fases: nenhuma pergunta cai na ajuda generica (' + r.tot + ' perguntas; fontes ' + JSON.stringify(r.fontes) + ')', () => {
    A.strictEqual(r.fases, 150);
    A.deepStrictEqual(JSON.parse(JSON.stringify(r.gen)), []);
  });
  await teste('2. toda ajuda cita a resposta ou um numero/palavra da propria pergunta, e tem metodo e resposta', () => {
    A.deepStrictEqual(JSON.parse(JSON.stringify(r.semCita)), []);
  });
  await teste('3. a ajuda da pergunta "Qual numero vem antes do 4?" fala de contar para tras a partir do 4, nao de bolinhas; antes de responder nao entrega a resposta', () => {
    const h = a.avaliar("JSON.parse(JSON.stringify(ajudaDe({type:'mc',prompt:'Qual número vem antes do <b>4</b>?',answer:'3',options:['3','5','2']})))");
    A.ok(/Conte para trás a partir do 4/.test(h.metodo) && !/bolinha/.test(h.metodo), h.metodo);
    A.ok(/Antes do 4 vem o 3/.test(h.resposta));
    A.ok(!/\b3\b/.test(h.metodo), 'o metodo nao pode entregar a resposta');
    const h2 = a.avaliar("JSON.parse(JSON.stringify(ajudaDe({type:'mc',prompt:'Quantas bolinhas tem aqui?',answer:'7',options:['7','8','6'],figure:'<svg></svg>'})))");
    A.ok(/Toque em cada bolinha/.test(h2.metodo) && /7/.test(h2.resposta));
    // na fase: antes de responder mostra so o metodo; depois do erro, metodo e resposta
    a.avaliar("abrirLicao(0,0);LIC.etapa='questao';LIC.i=0;LIC.qs=[{type:'mc',prompt:'Qual número vem antes do <b>4</b>?',answer:'3',options:['3','5','2']}];pintarLicao()");
    A.ok(!/vem o 3/.test(a.avaliar('dicaDaPergunta(LIC.qs[0])')), 'dica antes de responder entregou a resposta');
    a.avaliar("LIC.resp='5';conferir()");
    A.ok(/Antes do 4 vem o 3/.test(a.avaliar('dicaDaPergunta(LIC.qs[0])')), 'depois do erro a ajuda deveria fechar a conta');
  });
  resumo('ajudas.js');
})();
