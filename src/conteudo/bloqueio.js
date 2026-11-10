/* Escritas que NUNCA aparecem como opção errada para a criança, mesmo que o corretor do macOS não as reconheça como palavra.
   Duas partes, cada palavra com o motivo:
   (1) CONFERIDAS: saíram da leitura inteira, à mão, de TODOS os distratores possíveis das 38 palavras do banco
       (docs/fase4/DISTRATORES-CONFERENCIA.md, gerado por build/distratores.js). Palavra real que o corretor não conhece,
       gíria, palavrão, palavra de outro país lusófono, nome próprio comum ou conotação ruim.
   (2) PREVENTIVAS: palavrões e gírias que o gerador ainda não produz, para não depender só do corretor se o banco crescer.
   testes/distratores.js confere: nenhum distrator gerado está aqui; todo distrator gerado foi lido na conferência; esta lista e a
   conferência batem uma com a outra. */
const BLOQUEIO_MOTIVO={
  /* (1) conferidas */
  dodo:'DODÔ, a ave (a criança conhece do desenho); lida em voz alta é palavra',
  doda:'apelido de gente (Doda)',
  pedo:'som de PEIDO; em espanhol é peido; prefixo de pedofilia',
  palo:'espanhol (pau), gíria sexual em alguns países',
  poto:'gíria chilena para bunda',
  nala:'nome próprio que a criança conhece (O Rei Leão) e nome comum de bicho',
  papi:'gíria de paquera (papi) no funk e no reggaeton',
  piba:'gíria (menina) na Argentina',
  tuta:'palavra real (tuta e meia) e apelido',
  zapato:'espanhol para sapato: a criança pode achar que também está certo',
  tomato:'inglês para tomate (o app ensina inglês): pode parecer certo',
  pamela:'nome próprio comum (Pâmela)',
  cavolo:'italiano, usado como palavrão leve (che cavolo)',
  menine:'linguagem neutra: assunto de debate, não é erro de escrita para mostrar à criança',
  petaca:'gíria mexicana para bunda; garrafinha de bebida na Espanha',
  petate:'gíria (morrer) no espanhol do México',
  tapeti:'palavra real (tapeti, coelho do mato)',
  golinha:'palavra real (gola pequena)',
  dante:'nome próprio comum (Dante)',
  fela:'gíria ofensiva do Nordeste (fela da mãe)',
  /* terceira passada (09/11/2026): palavra real em inglês é sempre bloqueada, porque o app ensina inglês e a criança pode achar
     que a escrita existe (regra mais conservadora do próprio documento, adotada na terceira passada, a confirmar com o Filipe) */
  gate:'inglês real (portão); o app ensina inglês',
  male:'inglês real (macho, masculino); o app ensina inglês',
  pipe:'inglês real (cano); o app ensina inglês',
  tada:'inglês real (ta-da, a interjeição de mágica); o app ensina inglês',
  dene:'inglês real (vale estreito, no inglês britânico); o app ensina inglês',
  galina:'nome próprio (russo); bloqueado pela regra conservadora adotada na terceira passada, a confirmar com o Filipe',
  /* (2) preventivas */
  bosta:'palavrão',merda:'palavrão',porra:'palavrão',puta:'palavrão',puto:'palavrão e gíria de raiva',caralho:'palavrão',
  cacete:'palavrão',buceta:'palavrão',boceta:'palavrão',piroca:'palavrão',pica:'palavrão',xota:'palavrão',xoxota:'palavrão',
  xereca:'palavrão',foder:'palavrão',foda:'palavrão',fuder:'palavrão',porcaria:'xingamento',bunda:'corpo, vira piada',
  peido:'vira piada',cocô:'vira piada',coco:'vira piada (cocô)',xixi:'vira piada',pinto:'conotação sexual',rola:'conotação sexual',
  pau:'conotação sexual',cu:'palavrão',viado:'xingamento homofóbico',bicha:'xingamento homofóbico',corno:'xingamento',
  otario:'xingamento',otário:'xingamento',idiota:'xingamento',burro:'xingamento',burra:'xingamento',besta:'xingamento',
  trouxa:'xingamento',chato:'xingamento',chata:'xingamento',feio:'xingamento',feia:'xingamento',gordo:'xingamento',gorda:'xingamento',
  mata:'violência',morte:'violência',morto:'violência',matar:'violência',arma:'violência',droga:'droga e xingamento',
  pó:'droga',maconha:'droga',vagabunda:'xingamento',vagabundo:'xingamento',safado:'conotação sexual',safada:'conotação sexual',
  tesão:'conotação sexual',teta:'corpo, conotação sexual',peito:'corpo, vira piada'
};
const PALAVRAS_BLOQUEADAS=new Set(Object.keys(BLOQUEIO_MOTIVO));
