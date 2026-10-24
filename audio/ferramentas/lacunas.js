// Varre o app (somente leitura) atras de falas sem clipe. Uso: node lacunas.js <rodadas> <sementes separadas por virgula> <saida.json>
const fs=require('fs'),path=require('path');
const REPO='/Users/filipealvesesilva/Projetos/universo-de-bobby';
const { carregarApp } = require(REPO+'/testes/lib/carregar.js');
const RODADAS=+process.argv[2]||40, SEMENTES=(process.argv[3]||'1').split(',').map(Number), SAIDA=process.argv[4]||'novos.json';
const min=JSON.parse(fs.readFileSync(REPO+'/audio/manifesto-min.json','utf8'));
const ign=new Set(['__']);
const novos=new Map(); // chave classe|idioma|texto -> item
const add=(classe,idioma,texto,materia,origem)=>{const k=classe+'|'+idioma+'|'+texto;if(!novos.has(k))novos.set(k,{classe,idioma,texto,materia,origem});};
for(const sem of SEMENTES){
  const app=carregarApp(sem);
  app.ctx.__min=min; app.avaliar('audioIndexar(__min)'); app.avaliar('AUDIO.semAudio=false;AUDIO.pronto=Promise.resolve(true)');
  const seq=(h,l,m)=>{app.ctx.__t=h;app.ctx.__l=l;app.ctx.__m=m;return app.avaliar('(function(){const s=audioSequencia(__t,__l,__m);return {f:s.faltas,n:s.chaves.length,t:s.texto}})()');};
  const trata=(h,l,m,origem)=>{
    const r=seq(h,l,m);
    if(l==='en-US'){ if(r.f.length||!r.n) add('en-alvo','en-US',r.t,m,origem); return; }
    r.f.forEach(f=>{
      if(f.startsWith('quadro:')){const q=f.slice(7); if(!ign.has(q)) add('quadro-enunciado','pt-BR',q,m,origem);}
      else add('?'+f.split(':')[0],'pt-BR',f.slice(f.indexOf(':')+1),m,origem);
    });
  };
  // frases inteiras novas
  const frases=Object.values(app.avaliar('BILHETES')).concat(['Por hoje chega! Você fez um ótimo trabalho.','10 unidades viraram 1 dezena!','10 dezenas viraram 1 centena!']);
  frases.forEach(t=>{const r=seq(t,'pt-BR','mat'); if(!r.n||r.f.length) add('feedback','pt-BR',r.t,'core','falas novas da Fase 2');});
  const UN=[['mat','UNITS_MAT'],['pt','UNITS_PT'],['en','UNITS_EN']];
  const CAP={mat:['CAPITULOS','MISSOES'],pt:['CAPITULOS_PT','MISSOES_PT'],en:['CAPITULOS_EN','MISSOES_EN']};
  for(const [m,U] of UN){
    app.avaliar("MATERIA='"+m+"'");
    const units=app.avaliar(U), caps=app.avaliar(CAP[m][0]), miss=app.avaliar(CAP[m][1]);
    units.forEach((u,ui)=>u.lessons.forEach((l,li)=>{
      const passos=app.avaliar('passosDe('+U+'['+ui+'].lessons['+li+'])');
      passos.forEach(p=>{trata(p.t+'. '+p.c,'pt-BR',m,'aula'); for(const mm of String(p.fig||'').matchAll(/data-ler="([^"]*)"/g)) trata(decodeURIComponent(mm[1]),'en-US',m,'cartao');});
      app.avaliar('LIC.l='+U+'['+ui+'].lessons['+li+']');
      if(li===0&&caps[u.n]) trata(caps[u.n].abre,'pt-BR',m,'capitulo');
      if(miss[l.id]) trata(miss[l.id].t+'. '+miss[l.id].abre,'pt-BR',m,'missao');
      for(let r=0;r<RODADAS;r++){
        const qs=app.avaliar('genQuestions('+U+'['+ui+'].lessons['+li+'],8)');
        qs.forEach((q,qi)=>{
          trata(q.ouvir||q.prompt,q.lang||'pt-BR',m,'pergunta');
          app.ctx.__q=q;
          // dica e ajuda extra
          let d=''; try{ d=app.avaliar('dicaDaPergunta(__q)'); }catch(e){}
          if(d) trata(d,'pt-BR',m,'dica');
          const A=[];
          if(q.type==='mc'){[1,2,3].forEach(n=>A.push('Tirei '+n+' resposta'+(n>1?'s':'')+' errada'+(n>1?'s':'')+'. Agora escolha entre as que sobraram.'));}
          else if(q.type==='blocos')A.push('Já coloquei as placas e as barrinhas para você. Agora complete só os <b>cubinhos</b>.');
          else if(q.type==='fracao')A.push('Pintei quase tudo. Falta pintar <b>1 parte</b>.');
          else if(q.type==='grupinhos')A.push('Já montei os grupos. Agora coloque <b>'+q.alvoP+'</b> em cada um.');
          else if(q.type==='texto'||q.type==='input'){const a=String(q.answer);A.push('A resposta começa com <b>'+a.slice(0,1)+'</b> e tem <b>'+a.length+'</b> '+(a.length>1?'caracteres':'caractere')+'.');}
          else if(q.type==='silabas')A.push('A primeira sílaba é <b>'+String(q.answer).slice(0,2)+'</b>.');
          else A.push('Leia devagar e tente de novo. Você consegue.');
          A.forEach(a=>trata(a,'pt-BR',m,'ajuda extra'));
        });
      }
    }));
  }
}
const arr=[...novos.values()];
fs.writeFileSync(SAIDA,JSON.stringify(arr,null,0));
const c={};arr.forEach(x=>c[x.classe+'/'+x.origem]=(c[x.classe+'/'+x.origem]||0)+1);
console.log(arr.length,JSON.stringify(c));
