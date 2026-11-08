#!/usr/bin/env node
'use strict';
/* Verbos na cena (sintese 1B, mesa 03 mudancas 1 e 2). Percorre 30 fases geradas por materia e mede:
   (a) na fase de contagem 1.1, pelo menos 5 das 8 perguntas com objetos tocaveis;
   (b) o reordenador nunca deixa 3 verbos iguais seguidos quando a fase tem verbos suficientes para evitar;
   (c) 1B2: TODA fase das 150 (20 rodadas cada) tem 3 ou mais verbos oficiais (tocar, arrastar, ligar, ordenar, tracar) e nenhuma trinca;
   (d) o ligar so monta pares de gabarito unico.
   Uso: node testes/variedade.js */
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const J = (x) => JSON.parse(JSON.stringify(x));

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
    ['tocar-objetos', 'arrastar', 'tocar-letra', 'ordenar', 'tocar-ouvir', 'ligar', 'tracar', 'arrastar-resposta'].forEach((v) => A.ok(q[v] > 0, 'nenhuma pergunta com verbo ' + v));
  });
  /* 1B2: as 150 fases, 20 rodadas cada, com o gerador de verdade (inclui ligar, tracar e arrastar a resposta) */
  const v = a.avaliar(`(()=>{const o={fases:0,rodadas:0,menos3:{},trincas:[],ligar:0,tracar:0,arrastarR:0,fasesComLigar:new Set(),ligarRuim:[],ligarRepete:[],semBase:0,dist:{}};
    ['mat','pt','en'].forEach(m=>{usarMateria(m);MATERIAS[m].units().forEach(u=>u.lessons.forEach(l=>{o.fases++;
      for(let t=0;t<20;t++){const qs=genQuestions(l,8);o.rodadas++;
        const vs=qs.map(q=>verboDe(q)),of=new Set(vs.filter(v=>VERBOS_OFICIAIS.indexOf(v)>=0));
        if(of.size<3)o.menos3[l.id]=(o.menos3[l.id]||0)+1;
        o.dist[of.size]=(o.dist[of.size]||0)+1;
        for(let i=2;i<vs.length;i++)if(vs[i]===vs[i-1]&&vs[i]===vs[i-2]){o.trincas.push(l.id+' '+vs.join(','));break;}
        const chaves=new Set(qs.filter(q=>q.verbo!=='ligar').map(chaveNucleo));
        qs.forEach(q=>{
          if(q.verbo==='tracar')o.tracar++;
          if(q.verbo==='arrastar-resposta')o.arrastarR++;
          if(q.verbo!=='ligar')return;
          o.ligar++;o.fasesComLigar.add(l.id);
          if(!q.__base||typeof q.__base.prompt!=='string')o.semBase++;
          const es=new Set(q.pares.map(p=>chaveVerbo(p.e))),rs=new Set(q.pares.map(p=>chaveVerbo(p.r)));
          const resp=q.pares.map(p=>p.e+' → '+p.r).join('; ');
          if(q.pares.length!==3||es.size!==3||rs.size!==3||q.answer!==resp||q.dir.every((d,i)=>d===i)||/—/.test(resp))o.ligarRuim.push(l.id+': '+q.answer);
          q.pares.forEach(p=>{if(chaves.has(chaveVerbo(p.e)+'|'+chaveVerbo(p.r)))o.ligarRepete.push(l.id+': '+p.e);});
        });
      }}));});
    o.fasesComLigar=o.fasesComLigar.size;return o;})()`);
  console.log('          1B2: ' + v.fases + ' fases x 20 rodadas | verbos oficiais por fase (rodadas): ' + JSON.stringify(v.dist) + ' | ligar em ' + v.fasesComLigar + ' fases (' + v.ligar + ' perguntas) | tracar ' + v.tracar + ' | arrastar a resposta ' + v.arrastarR);
  await teste('4. 1B2: TODA fase (150, 20 rodadas cada) tem pelo menos 3 verbos oficiais diferentes (tocar, arrastar, ligar, ordenar, tracar)', () => {
    A.strictEqual(v.fases, 150);
    A.deepStrictEqual(JSON.parse(JSON.stringify(v.menos3)), {}, 'fases com menos de 3 verbos: ' + JSON.stringify(v.menos3));
  });
  await teste('5. 1B2: nenhuma trinca de verbos iguais seguidos em nenhuma das 3.000 rodadas', () => {
    A.deepStrictEqual(J(v.trincas.slice(0, 5)), []);
  });
  await teste('6. 1B2: ligar tem 3 pares sem repeticao, direita embaralhada, gabarito legivel, pergunta de origem para o caderno, e nao repete pergunta da fase', () => {
    A.ok(v.ligar > 1500 && v.fasesComLigar >= 90, 'ligar em poucas fases: ' + v.fasesComLigar);
    A.deepStrictEqual(J(v.ligarRuim.slice(0, 5)), []);
    A.deepStrictEqual(J(v.ligarRepete.slice(0, 5)), []);
    A.strictEqual(v.semBase, 0);
    A.ok(v.tracar >= 2900, 'tracar em poucas rodadas: ' + v.tracar);
  });
  await teste('7. 1B2: regra do gabarito unico do ligar (pergunta de escolha so entra se as outras respostas forem distratores dela)', () => {
    const r = a.avaliar(`(()=>{const P=(q)=>parDe(q);
      const vogal=P(mc('Qual delas é uma vogal?','I',['C','B','D'])),depoisA=P(txtQ('Escreva a vogal que vem depois de A.','E')),quantas=P(inp('Quantas vogais tem PIPA?',2));
      const sil1=P(mc('Qual é a primeira sílaba de PORTA?','por',['ca','pi','lo'])),sil2=P(mc('Qual é a primeira sílaba de CANETA?','ca',['por','pi','lo'])),ult=P(mc('Qual é a última sílaba de CAMA?','ma',['ca','la','ta']));
      const conta=P(mc('Quanto é 5 × 9?','45',['50','40','14']));
      return {vogalComE:depoisA?parCombina(vogal,depoisA):false,depoisAFora:depoisA===null,contaPura:conta.unica&&conta.e==='5 × 9',silabas:parCombina(sil1,sil2)&&parCombina(sil2,sil1),
        camaCa:parCombina(ult,sil2),figura:P(mc('Este ângulo é...','reto',['agudo','obtuso'],{figure:'<svg></svg>'})),fracao:P(mc('Quanto é <span class="frac"><b>1</b><i>2</i></span> + <span class="frac"><b>1</b><i>2</i></span>?','1',['2','3'])),
        vf:P(mc('O sapo pula.','Verdadeiro',['Falso'])),quantas:!!quantas}})()`);
    A.strictEqual(r.vogalComE, false, '"Qual delas e uma vogal?" nao pode ficar ao lado da resposta E (tambem e vogal)');
    A.ok(r.depoisAFora, 'texto digitado sem numero nem ancora (revisao de 08/11/2026) fica fora do ligar');
    A.ok(r.contaPura, 'conta pura vira so a conta no cartao');
    A.ok(r.silabas, 'primeira silaba de PORTA e de CANETA combinam (ancora na palavra)');
    A.strictEqual(r.camaCa, false, 'ultima silaba de CAMA nao pode ficar ao lado de "ca" (cabe em CAMA)');
    A.strictEqual(r.figura, null); A.strictEqual(r.fracao, null); A.strictEqual(r.vf, null); A.ok(r.quantas);
  });
  await teste('8. tracar na faixa de 7 a 8 anos: no maximo 2 caminhos e eles nao se cruzam; a partir de 9 anos podem cruzar (revisao de 08/11/2026)', () => {
    const r = a.avaliar(`(()=>{
      const cruza=(p,q)=>{const s=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);let n=0;
        for(let i=4;i<p.length-1;i++)for(let j=4;j<q.length-1;j++){const a1=p[i],a2=p[i+1],b1=q[j],b2=q[j+1];
          if(s(a1,a2,b1)*s(a1,a2,b2)<0&&s(b1,b2,a1)*s(b1,b2,a2)<0)n++;}return n;};
      const o={f78max:0,f78cruza:0,f78n:0,f910cruza:0};
      S.faixa='f78';['mat','pt','en'].forEach(m=>{usarMateria(m);MATERIAS[m].units().forEach(u=>u.lessons.forEach(l=>{for(let t=0;t<3;t++)genQuestions(l,8).forEach(q=>{if(q.verbo!=='tracar')return;o.f78n++;o.f78max=Math.max(o.f78max,q.options.length);});}));});
      [2,3,4].forEach(n=>{const cs=caminhosTracar(n,true);for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)o.f78cruza+=cruza(cs[i],cs[j]);});
      const c3=caminhosTracar(3,false);o.f910cruza=cruza(c3[0],c3[1])+cruza(c3[1],c3[2])+cruza(c3[0],c3[2]);
      S.faixa='f910';const n910=[];usarMateria('pt');MATERIAS.pt.units().forEach(u=>u.lessons.forEach(l=>genQuestions(l,8).forEach(q=>{if(q.verbo==='tracar')n910.push(q.options.length);})));o.f910max=Math.max(...n910);
      S.faixa='f78';return o;})()`);
    A.ok(r.f78n > 100, 'poucas perguntas de tracar geradas: ' + r.f78n);
    A.ok(r.f78max <= 2, 'faixa 7 a 8 com ' + r.f78max + ' caminhos');
    A.strictEqual(r.f78cruza, 0, 'caminhos da faixa 7 a 8 se cruzam');
    A.ok(r.f910cruza > 0, 'a partir de 9 anos os caminhos continuam se cruzando');
  });
  resumo('variedade.js');
})();
