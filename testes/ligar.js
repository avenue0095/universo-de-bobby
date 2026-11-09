#!/usr/bin/env node
'use strict';
/* O LIGAR de verdade (revisao independente da 1B2, 08/11/2026): gera as fases pelo genQuestions, como o app faz, e julga cada ligar montado
   com regras PROPRIAS do teste (nao reusa parDe/parCombina):
   (a) nenhum cartao que so se responde ouvindo (o cartao nao tem audio): pergunta com 'ouvir', verbo tocar-ouvir ou texto "ouça/escute/listen";
   (b) nenhum cartao com lacuna (GAT___, MA - ___) ou "falta": a lacuna aceita mais de uma resposta;
   (c) nenhuma resposta de um par serve para o enunciado de outro par do mesmo ligar:
       conta pura: o valor calculado do enunciado so bate com a propria resposta;
       pergunta de escolha: a resposta de outro par, se aparece nas opcoes, e distrator (nunca a resposta); se nao aparece, so vale com ancora
       (palavra em MAIUSCULAS ou entre aspas) que nao contenha a outra resposta;
       pergunta digitada: so com resposta numero.
   E o ligar continua existindo (a fase nao perde o verbo sem trocar por outro: isso fica em testes/variedade.js).
   Uso: node testes/ligar.js [--rodadas=12] */
const A = require('assert');
const { carregarApp } = require('./lib/carregar.js');
const { teste, resumo } = require('./lib/mini.js');
const arg = (n, d) => { const x = process.argv.find((v) => v.startsWith('--' + n + '=')); return x ? +x.slice(n.length + 3) : d; };
const RODADAS = arg('rodadas', 12);

(async () => {
  const a = carregarApp(11, {}); a.avaliar("novoPerfil('Zeca','#12A06E')");
  const r = a.avaliar(`(()=>{
    const txt=s=>String(s==null?'':s).replace(/<br\\s*\\/?>/gi,' ').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\\s+/g,' ').trim();
    const ch=s=>txt(s).toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');
    const letras=s=>ch(s).replace(/[^a-z0-9]/g,'');
    const ouvir=q=>!!q.ouvir||q.verbo==='tocar-ouvir'||/\\b(ouça|ouvir|ouviu|ouve|escute|escutou|listen|hear)\\b/i.test(txt(q.prompt));
    const lacuna=e=>/_{2,}|\\bfalta\\b|complete/i.test(e);
    const valor=e=>{const x=e.replace(/^Quanto é /i,'').replace(/\\?$/,'').replace(/= *\\??$/,'').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/:/g,'/').replace(/,/g,'.');
      if(!/^[\\d\\s+\\-*/().]+$/.test(x)||!/\\d/.test(x))return null;try{const v=Function('return ('+x+')')();return isFinite(v)?v:null;}catch(e){return null;}};
    const num=s=>{const t=txt(s).replace(',','.');return /^-?\\d+(\\.\\d+)?$/.test(t)?+t:null;};
    const ancoras=e=>(e.match(/["“][^"“”]{2,}["”]/g)||[]).concat(e.match(/(?:^|[^\\p{L}])([A-ZÁÉÍÓÚÂÊÔÃÕÇ]{3,})(?=$|[^\\p{L}])/gu)||[]).map(letras).filter(Boolean);
    /* a resposta R (de outro par) serve para o enunciado da pergunta q? true = ambiguo */
    const serve=(q,R)=>{
      const e=txt(q.prompt),v=valor(e),n=num(R);
      if(v!=null)return n!=null&&Math.abs(n-v)<1e-9;
      const ops=(q.options||[]).map(ch);
      if(ops.length&&ops.indexOf(ch(R))>=0)return ch(R)===ch(q.answer);
      const an=ancoras(e);
      if(an.length)return an.some(x=>x.indexOf(letras(R))>=0||letras(R).indexOf(x)===0);
      if(q.type!=='mc'&&num(q.answer)!=null)return n!=null&&n===num(q.answer);
      return true;      /* sem como provar que nao serve: conta como ambiguo */
    };
    const o={ligar:0,porMat:{mat:0,pt:0,en:0},ouvir:[],lacuna:[],ambiguo:[],semOrigem:0};
    ['mat','pt','en'].forEach(m=>{usarMateria(m);MATERIAS[m].units().forEach(u=>u.lessons.forEach(l=>{
      for(let t=0;t<${RODADAS};t++)genQuestions(l,8).forEach(q=>{
        if(q.verbo!=='ligar')return;
        o.ligar++;o.porMat[m]++;
        const og=q.__origens;if(!Array.isArray(og)||og.length!==q.pares.length){o.semOrigem++;return;}
        og.forEach((qi,i)=>{
          if(ouvir(qi))o.ouvir.push(l.id+': '+q.pares[i].e);
          if(lacuna(q.pares[i].e))o.lacuna.push(l.id+': '+q.pares[i].e);
          q.pares.forEach((pj,j)=>{if(j!==i&&serve(qi,pj.r))o.ambiguo.push(l.id+': "'+q.pares[i].e+'" aceita "'+pj.r+'" (de "'+pj.e+'")');});
        });
      });
    }));});
    return o;})()`);
  const J = (x) => JSON.parse(JSON.stringify(x));
  const amostra = (l) => [...new Set(J(l))].slice(0, 8).join(' | ');
  console.log('          ligar gerados: ' + r.ligar + ' ' + JSON.stringify(r.porMat) + ' em ' + RODADAS + ' rodadas por fase');
  await teste('1. o ligar existe nas tres materias e todo ligar guarda as perguntas de origem', () => {
    ['mat', 'pt', 'en'].forEach((m) => A.ok(r.porMat[m] > 0, 'nenhum ligar em ' + m));
    A.strictEqual(r.semOrigem, 0);
  });
  await teste('2. nenhum cartao de ligar que so se responde ouvindo (o cartao nao tem audio)', () => {
    A.ok(r.ouvir.length === 0, r.ouvir.length + ' cartoes de ouvir: ' + amostra(r.ouvir));
  });
  await teste('3. nenhum cartao com lacuna (___, "falta", "complete")', () => {
    A.ok(r.lacuna.length === 0, r.lacuna.length + ' com lacuna: ' + amostra(r.lacuna));
  });
  await teste('4. nenhuma resposta de um par serve para o enunciado de outro par do mesmo ligar', () => {
    A.ok(r.ambiguo.length === 0, r.ambiguo.length + ' pares ambiguos: ' + amostra(r.ambiguo));
  });
  await teste('5. caderno do ligar: errar so o par 3 guarda a pergunta de origem do par 3 (e nao a do par 1) no caderno, na revisao e no historico', () => {
    const b = carregarApp(13, {}); b.avaliar("novoPerfil('Lia','#12A06E');usarMateria('mat')");
    const r = b.avaliar(`(()=>{
      let ui=-1,li=-1,q=null;
      for(let u=0;u<UNITS.length&&!q;u++)for(let l=0;l<UNITS[u].lessons.length&&!q;l++)for(let t=0;t<10&&!q;t++){const x=genQuestions(UNITS[u].lessons[l],8).find(z=>z.verbo==='ligar'&&Array.isArray(z.__origens));if(x){q=x;ui=u;li=l;}}
      if(!q)return {semLigar:true};
      abrirLicao(ui,li);LIC.etapa='questao';LIC.qs=[q,genQuestions(UNITS[ui].lessons[li],8).find(z=>z.verbo!=='ligar')];LIC.i=0;LIC.base=2;pintarLicao();
      S.errados={};S.revisao.itens={};S.revisao.congelados={};
      VER.lig={0:0,1:1,2:1};LIC.resp=textoDoLigar(q,VER.lig);conferir();
      const n=MATERIA+LIC.u.n,lista=S.errados[n]||[],ch=x=>chaveQ(x);
      const o=q.__origens;
      return {n:lista.length,tem3:lista.some(x=>ch(x)===ch(o[2])),tem1:lista.some(x=>ch(x)===ch(o[0])),tem2:lista.some(x=>ch(x)===ch(o[1])),
        rev3:!!S.revisao.congelados[chaveItem(o[2])],rev1:!!S.revisao.congelados[chaveItem(o[0])],
        hist:LIC.hist.map(h=>h.ok),histQ:LIC.hist.map(h=>ch(h.q)===ch(o[0])?1:ch(h.q)===ch(o[1])?2:ch(h.q)===ch(o[2])?3:0)};})()`);
    A.ok(!r.semLigar, 'nenhum ligar gerado em matematica');
    A.strictEqual(r.tem3, true, 'o par 3 (errado) nao foi para o caderno');
    A.strictEqual(r.tem1, false, 'o par 1 (certo) foi para o caderno');
    A.strictEqual(r.tem2, false, 'o par 2 (certo) foi para o caderno');
    A.strictEqual(r.n, 1);
    A.strictEqual(r.rev3, true, 'o par 3 nao entrou na revisao espacada'); A.strictEqual(r.rev1, false);
    A.deepStrictEqual(J(r.hist), [true, true, false]); A.deepStrictEqual(J(r.histQ), [1, 2, 3]);
  });
  await teste('6. frequencia do ligar por materia (pendencia de 08/11: o revisor nao viu ligar de ingles em 40 sorteios): ingles em pelo menos 50% das rodadas nas 3 faixas, toda materia acima de 15%', () => {
    const a = carregarApp(17, {}); a.avaliar("novoPerfil('Zeca','#12A06E')");
    const r = J(a.avaliar(`(()=>{const o={};['f78','f910','f1112'].forEach(fx=>{S.faixa=fx;['mat','pt','en'].forEach(m=>{let rod=0,c=0;
      MATERIAS[m].units().forEach(u=>u.lessons.forEach(l=>{for(let k=0;k<4;k++){rod++;if(genQuestions(l,8).some(q=>q.verbo==='ligar'))c++;}}));
      o[fx+':'+m]=c/rod;});});return o;})()`));
    console.log('          ' + Object.keys(r).map((k) => k + ' ' + Math.round(r[k] * 100) + '%').join(' | '));
    Object.keys(r).forEach((k) => { A.ok(r[k] >= 0.15, k + ': ligar em ' + Math.round(r[k] * 100) + '% das rodadas'); if (/:en$/.test(k)) A.ok(r[k] >= 0.5, k + ': ingles com ligar em so ' + Math.round(r[k] * 100) + '%'); });
  });
  resumo('ligar.js');
})();
