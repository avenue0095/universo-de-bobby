#!/usr/bin/env node
'use strict';
/* Erro vira pergunta IRMA: quando a crianca erra, volta uma pergunta do mesmo gerador com outros numeros ou palavras (nao a mesma,
   que mede memoria da resposta), 2 perguntas depois, marcada q.reforco/__irma; o item errado vai para o caderno de erros.
   Cobre as 150 fases (3 rodadas por fase).   Uso: node testes/irmas.js */
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const novo = () => { const a = carregarApp(11, {}); a.avaliar("novoPerfil('Zeca','#12A06E')"); return a; };

(async () => {
  await teste('1. as 150 fases tem pergunta irma para toda pergunta (3 rodadas por fase), diferente de todas as da rodada', () => {
    const a = novo();
    const r = a.avaliar(`(()=>{const o={fases:0,sem:[],iguais:[],perguntas:0};
      ['mat','pt','en'].forEach(m=>MATERIAS[m].units().forEach(u=>u.lessons.forEach(l=>{o.fases++;
        for(let k=0;k<3;k++){const qs=genQuestions(l,8);LIC={l:l,qs:qs.slice(),i:0,rev:false};
          qs.forEach(q=>{o.perguntas++;const ir=irmaDe(q);
            if(!ir){o.sem.push(l.id);return;}
            if(qs.some(x=>x.prompt+'|'+x.answer===ir.prompt+'|'+ir.answer))o.iguais.push(l.id);
            if(!(ir.__rep&&ir.__irma&&ir.reforco))o.iguais.push('sem marca '+l.id);});}
      })));return o;})()`);
    A.strictEqual(r.fases, 150);
    A.deepStrictEqual(JSON.parse(JSON.stringify(r.sem)), [], 'fases sem irma: ' + JSON.stringify(r.sem));
    A.deepStrictEqual(JSON.parse(JSON.stringify(r.iguais)), [], 'irma igual a uma pergunta da rodada: ' + JSON.stringify(r.iguais));
  });

  await teste('2. ao errar, volta uma irma 2 perguntas depois; o original vai para o caderno; no maximo uma reaparicao por erro', () => {
    for (const [ui, li, mat] of [[0, 0, 'mat'], [1, 2, 'mat'], [0, 0, 'pt'], [2, 1, 'en']]) {
      const a = novo();
      a.avaliar("usarMateria('" + mat + "')");
      a.avaliar('abrirLicao(' + ui + ',' + li + ");LIC.etapa='questao';pintarLicao()");
      const orig = a.avaliar('JSON.parse(JSON.stringify({p:LIC.qs[0].prompt,a:LIC.qs[0].answer}))');
      const n0 = a.avaliar('LIC.qs.length');
      a.avaliar('LIC.resp="__errada__";conferir()');
      const r = a.avaliar('JSON.parse(JSON.stringify({n:LIC.qs.length,i:LIC.i,v:LIC.qs[LIC.i+3]&&{p:LIC.qs[LIC.i+3].prompt,a:LIC.qs[LIC.i+3].answer,irma:!!LIC.qs[LIC.i+3].__irma,ref:!!LIC.qs[LIC.i+3].reforco}}))');
      A.strictEqual(r.n, n0 + 1, mat + ': deveria entrar exatamente uma pergunta');
      A.ok(r.v && r.v.irma && r.v.ref, mat + ': a irma deveria estar 3 posicoes depois (2 perguntas no meio)');
      A.ok(!(r.v.p === orig.p && r.v.a === orig.a), mat + ': a pergunta que volta e identica a original');
      const noCaderno = a.avaliar('(S.errados[MATERIA+LIC.u.n]||[]).some(x=>x.prompt===' + JSON.stringify(orig.p) + ')');
      A.ok(noCaderno, mat + ': o original errado deveria ir para o caderno');
      // errar TUDO, inclusive as irmas: reaparicoes (irmas) <= erros de primeira tentativa
      a.avaliar('avancar()');
      const f = a.avaliar(`(()=>{let erros1=0,guard=0;LIC.vidas=99;while(LIC.etapa==='questao'&&guard++<60){const q=LIC.qs[LIC.i];if(!q.__rep)erros1++;LIC.resp='__errada__';conferir();avancar();}
        return {erros1:erros1+1,reap:LIC.qs.filter(q=>q.__rep).length,irmas:LIC.qs.filter(q=>q.__irma).length};})()`);
      A.ok(f.reap <= f.erros1, mat + ': mais reaparicoes (' + f.reap + ') que erros (' + f.erros1 + ')');
    }
  });

  await teste('3. sem irma possivel, repete a original uma vez (item do caderno nao ganha irma)', () => {
    const a = novo();
    a.avaliar("abrirLicao(0,0);LIC.etapa='questao';pintarLicao()");
    const r = a.avaliar(`(()=>{const q=Object.assign({},LIC.qs[0]);q.__item='x';q.__mk=undefined;return irmaDe(q)===null})()`);
    A.ok(r, 'item do caderno nao deveria ter irma');
  });
  resumo('irmas.js');
})();
