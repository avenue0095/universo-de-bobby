// Gera pal.json (lista PAL do index.html: palavras e silabas) para o prep.py decidir "e" final x "ê".
const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync(process.argv[2]||'../../index.html','utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>!/document\.querySelector|serviceWorker/.test(s)&&!/Desenhos para colorir/.test(s));
const ctx=vm.createContext({console,Math,Date,JSON,Array,Object,String,Number,Set,Map,RegExp,parseInt,parseFloat});
sc.forEach(s=>{try{vm.runInContext(s,ctx)}catch(e){}});
fs.writeFileSync('pal.json',JSON.stringify(vm.runInContext('PAL',ctx)));
