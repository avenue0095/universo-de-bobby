/* ---------- tinta: balde de pintar por inundação (sem DOM, testado em Node) ----------
   O desenho é uma imagem de contorno preto sobre branco. Trabalhamos só com a luminância (0 a 255) de cada pixel.
   Pixel com luminância abaixo do limiar é linha e nunca é pintado; o resto é "área" e a tinta se espalha pelas vizinhas (4 direções).
   A cor final de um pixel pintado é a cor escolhida vezes a luminância original, então a ponta suave da linha continua suave. */
const TINTA_LIMIAR=140;

/* se o toque caiu na linha, procura uma área a até 3 pixels de distância; devolve o índice do pixel ou -1 */
function tintaSemente(lum,w,h,x,y){
  x=Math.round(x);y=Math.round(y);
  for(let r=0;r<=3;r++){
    for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
      if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
      const px=x+dx,py=y+dy;
      if(px<0||py<0||px>=w||py>=h)continue;
      if(lum[py*w+px]>=TINTA_LIMIAR)return py*w+px;
    }
  }
  return -1;
}
/* devolve os índices dos pixels da área onde o toque caiu (lista vazia se não achou área) */
function tintaRegiao(lum,w,h,x,y){
  const s=tintaSemente(lum,w,h,x,y);
  if(s<0)return [];
  const vis=new Uint8Array(w*h),out=[],pilha=[s];
  vis[s]=1;
  while(pilha.length){
    const i=pilha.pop();out.push(i);
    const px=i%w,py=(i-px)/w;
    if(px>0&&!vis[i-1]&&lum[i-1]>=TINTA_LIMIAR){vis[i-1]=1;pilha.push(i-1);}
    if(px<w-1&&!vis[i+1]&&lum[i+1]>=TINTA_LIMIAR){vis[i+1]=1;pilha.push(i+1);}
    if(py>0&&!vis[i-w]&&lum[i-w]>=TINTA_LIMIAR){vis[i-w]=1;pilha.push(i-w);}
    if(py<h-1&&!vis[i+w]&&lum[i+w]>=TINTA_LIMIAR){vis[i+w]=1;pilha.push(i+w);}
  }
  return out;
}
/* aplica uma lista de jogadas [x,y,cor] e devolve o mapa de tinta (0 = sem tinta, n = cor n-1). */
function tintaMapa(lum,w,h,jogadas){
  const mapa=new Uint8Array(w*h);
  (jogadas||[]).forEach(j=>{
    const reg=tintaRegiao(lum,w,h,j[0],j[1]),c=(j[2]|0)+1;
    for(let k=0;k<reg.length;k++)mapa[reg[k]]=c;
  });
  return mapa;
}
