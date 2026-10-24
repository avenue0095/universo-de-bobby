#!/usr/bin/env node
'use strict';
/* Verbos na cena (sintese 1B, mesa 03 mudancas 1 e 2). Percorre 30 fases geradas por materia e mede:
   (a) na fase de contagem 1.1, pelo menos 5 das 8 perguntas com objetos tocaveis;
   (b) o reordenador nunca deixa 3 verbos iguais seguidos quando a fase tem verbos suficientes para evitar;
   (c) quantas fases tem 3 ou mais verbos oficiais (tocar, arrastar, ligar, ordenar, tracar). ATENCAO: a regra "3 verbos por fase" so fecha
       na sessao 1B2 (ligar e tracar, que valem para qualquer pergunta); aqui ela e MEDIDA e impressa, e falha so se regredir abaixo do piso atual.
   Uso: node testes/variedade.js */
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');

(async () => {
  const a = carregarApp(9, {}); a.avaliar("novoPerfil('Zeca','#12A06E')");
  const r = a.avaliar(`(()=>{const o={f11:[],triplasEvitaveis:[],fases:0,fases3:0,fases2:0,verbos:{},semObjGenerico:[]};
    /* existe arranjo sem trinca com a 1a pergunta fixa? busca exaustiva (8 posicoes, poucos verbos) */
    const pode=vs=>{const c={};vs.slice(1).forEach(v=>c[v]=(c[v]||0)+1);const ks=Object.keys(c);
      const dfs=(u1,u2,falta)=>{if(!falta)return true;for(const k of ks){if(!c[k]||(k===u1&&k===u2))continue;c[k]--;const ok=dfs(k,u1,falta-1);c[k]++;if(ok)return true;}return false;};
      return dfs(vs[0],'',vs.length-1);};
    ['mat','pt','en'].forEach(m=>{usarMateria(m);const ls=[];MATERIAS[m].units().forEach(u=>u.lessons.forEach(l=>ls.push(l)));
      for(let k=0;k<30;k++){const l=ls[(k*7)%ls.length];const qs=genQuestions(l,8);o.fases++;
        const vs=qs.map(q=>verboDe(q));const of=new Set(vs.filter(v=>VERBOS_OFICIAIS.indexOf(v)>=0));if(of.size>=3)o.fases3++;if(of.size>=2)o.fases2++;
        vs.forEach(v=>{o.verbos[v]=(o.verbos[v]||0)+1;});
        for(let i=2;i<vs.length;i++)if(vs[i]===vs[i-1]&&vs[i]===vs[i-2]&&pode(vs)){o.triplasEvitaveis.push(l.id+' '+vs.join(','));break;}
        if(l.id==='1.1'){o.f11.push(qs.filter(q=>q.verbo==='tocar-objetos').length);qs.forEach(q=>{if(/bolinha/i.test(q.prompt)&&!q.__item)o.semObjGenerico.push(q.prompt);});}
      }
      for(let t=0;t<6;t++){const qs=genQuestions(ls[0],8);if(m==='mat'){o.f11.push(qs.filter(q=>q.verbo==='tocar-objetos').length);qs.forEach(q=>{if(/bolinha/i.test(q.prompt)&&!q.__item)o.semObjGenerico.push(q.prompt);});}}
    });return o;})()`);
  console.log('          verbos em 90 fases: ' + JSON.stringify(r.verbos) + ' | fases com 3+ verbos oficiais: ' + r.fases3 + ' de ' + r.fases + ' | com 2+: ' + r.fases2);
  await teste('1. fase 1.1 (contar as sementes): pelo menos 5 das 8 perguntas com objetos tocaveis, e zero "bolinhas" genericas', () => {
    A.ok(r.f11.length >= 6);
    r.f11.forEach((n) => A.ok(n >= 5, 'so ' + n + ' perguntas tocaveis em 1.1'));
    A.deepStrictEqual(JSON.parse(JSON.stringify(r.semObjGenerico)), []);
  });
  await teste('2. nunca 3 verbos iguais seguidos quando a fase tem como evitar (reordenador)', () => {
    A.deepStrictEqual(JSON.parse(JSON.stringify(r.triplasEvitaveis)), []);
  });
  await teste('3. cada verbo da sessao 1B1 aparece em fases geradas: tocar com objetos, arrastar, tocar na letra, ordenar, ouvir e tocar', () => {
    ['tocar', 'arrastar', 'ordenar', 'digitar'].forEach((v) => A.ok(r.verbos[v] > 0, 'sem ' + v));
    const q = a.avaliar(`(()=>{const o={};['mat','pt','en'].forEach(m=>{usarMateria(m);MATERIAS[m].units().forEach(u=>u.lessons.forEach(l=>{for(let t=0;t<3;t++)genQuestions(l,8).forEach(q=>{if(q.verbo)o[q.verbo]=(o[q.verbo]||0)+1;});}));});return o;})()`);
    ['tocar-objetos', 'arrastar', 'tocar-letra', 'ordenar', 'tocar-ouvir'].forEach((v) => A.ok(q[v] > 0, 'nenhuma pergunta com verbo ' + v));
  });
  await teste('4. piso de variedade (nao regredir): pelo menos 8 das 90 fases com 2+ verbos oficiais (medido em 1B1: 9); 3+ verbos fica para 1B2', () => {
    A.ok(r.fases2 >= 8, 'fases com 2+ verbos: ' + r.fases2);
  });
  resumo('variedade.js');
})();
