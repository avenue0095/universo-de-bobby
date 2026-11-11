# Fase 4 · Conferência dos distratores da escrita certa

Gerado por `node build/distratores.js` a partir de `candidatosDeGrafia` (src/conteudo/basicas.js): **todas** as escritas erradas que o app
pode mostrar para cada uma das 38 palavras do banco, sem sorteio e sem amostra, já com os filtros de legibilidade e de palavra real.
Cada linha foi lida à mão com olho de pai: palavra real (também a que só é real com acento e que a criança reconhece lendo em voz alta),
gíria, palavrão, palavra de outro país lusófono, nome próprio comum, conotação ruim em português, espanhol ou inglês.

Critério para palavra estrangeira: bloqueada se for gíria, palavrão, conotação ruim ou o nome da MESMA coisa em outra língua
(ZAPATO, TOMATO: a criança pode achar que está certo). **Palavra real do inglês corrente é sempre bloqueada**, porque o app
ensina inglês (GATE, MALE, PIPE, TADA, DENE; terceira passada, 09/11/2026). Palavra de outra língua neutra e desconhecida da
criança fica (CAZA, MOPA, UVE, MALO), com a observação na linha. Palavra que ficou com menos de 3 escritas erradas sai da escrita
certa sozinha (grafiaCerta pede 3) e continua nas outras atividades; com menos de 2, testes/distratores.js caso 5 prova que
o juntar sílabas não cai nela (PATO, MALA, VELA, GATO, PIPA, FADA).

`testes/distratores.js` reprova se: aparecer escrita nova sem leitura (A CONFERIR), algum distrator do app estiver na lista de bloqueio,
ou esta conferência e `src/conteudo/bloqueio.js` não baterem.

**Resumo:** 268 escritas possíveis, 27 bloqueadas, 241 liberadas, 0 a conferir.

## Por palavra

### BOLA (3 possíveis, 3 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| DOLA | ok |  |
| LABO | ok |  |
| OBLA | ok |  |

### DADO (6 possíveis, 4 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| BADO | ok |  |
| DABO | ok |  |
| DADU | ok |  |
| DAPO | ok |  |
| DODA | BLOQUEADA | apelido de gente (Doda) |
| DODO | BLOQUEADA | DODÔ, a ave (a criança conhece do desenho); lida em voz alta é palavra |

### PATO (4 possíveis, 2 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| PAFO | ok |  |
| PALO | BLOQUEADA | espanhol (pau), gíria sexual em alguns países |
| PATU | ok | empréstimo maori no inglês da Nova Zelândia (clava), não é palavra do inglês corrente; fica |
| POTO | BLOQUEADA | gíria chilena para bunda |

### GATO (3 possíveis, 2 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| GATE | BLOQUEADA | inglês real (portão); o app ensina inglês |
| GATU | ok |  |
| GETO | ok | lida em voz alta não é GUETO (G antes de E soa J) |

### MALA (3 possíveis, 1 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| MALE | BLOQUEADA | inglês real (macho, masculino); o app ensina inglês |
| MALO | ok | espanhol neutro (mau), a criança não conhece |
| NALA | BLOQUEADA | nome próprio que a criança conhece (O Rei Leão) e nome comum de bicho |

### CASA (3 possíveis, 3 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| CAZA | ok | espanhol neutro (caça), a criança não conhece; é o erro de verdade S por Z |
| CESA | ok | espanhol neutro (verbo cesar), a criança não conhece |
| GASA | ok | espanhol neutro (gaze), a criança não conhece |

### BOLO (2 possíveis, 2 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| BOLU | ok |  |
| OBLO | ok |  |

### VACA (3 possíveis, 3 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| VACE | ok |  |
| VECA | ok |  |
| VOCA | ok |  |

### FACA (2 possíveis, 2 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| FACO | ok | só seria FAÇO com cedilha; lida em voz alta é FACO, que não é palavra |
| FAGA | ok |  |

### LUA (2 possíveis, 2 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| ALU | ok |  |
| ULA | ok |  |

### SAPO (6 possíveis, 6 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| SABO | ok |  |
| SAPE | ok | só seria SAPÊ com acento, palavra que a criança não conhece; sem conotação |
| SAPU | ok |  |
| SEPO | ok |  |
| SOPO | ok |  |
| ZAPO | ok |  |

### TATU (7 possíveis, 6 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| FATU | ok |  |
| LATU | ok |  |
| TAFU | ok |  |
| TALU | ok | lida em voz alta soa TALO; erro de escrita, sem conotação |
| TETU | ok | lida em voz alta soa TETO; é erro de escrita de palavra comum, sem conotação |
| TOTU | ok |  |
| TUTA | BLOQUEADA | palavra real (tuta e meia) e apelido |

### DEDO (5 possíveis, 3 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| BEDO | ok |  |
| DEDU | ok |  |
| DODE | ok |  |
| DODO | BLOQUEADA | DODÔ, a ave (a criança conhece do desenho); lida em voz alta é palavra |
| PEDO | BLOQUEADA | som de PEIDO; em espanhol é peido; prefixo de pedofilia |

### PIPA (5 possíveis, 2 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| DIPA | ok |  |
| PAPI | BLOQUEADA | gíria de paquera (papi) no funk e no reggaeton |
| PIBA | BLOQUEADA | gíria (menina) na Argentina |
| PIDA | ok | espanhol neutro (verbo pedir) |
| PIPE | BLOQUEADA | inglês real (cano); o app ensina inglês |

### MAPA (8 possíveis, 8 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| AMPA | ok |  |
| MABA | ok |  |
| MADA | ok |  |
| MAPE | ok |  |
| MAPO | ok |  |
| MEPA | ok |  |
| MOPA | ok | espanhol neutro (esfregão) |
| PAMA | ok |  |

### RATO (2 possíveis, 2 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| ARTO | ok | espanhol raro (arto, planta espinhosa), a criança não conhece; sem conotação |
| RATU | ok | título fijiano que alguns dicionários de inglês listam, não é palavra do inglês corrente; fica |

### UVA (2 possíveis, 2 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| UVE | ok | espanhol neutro (nome da letra V) |
| UVO | ok |  |

### OVO (2 possíveis, 2 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| OFO | ok |  |
| OVU | ok |  |

### NUVEM (6 possíveis, 6 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| MUVEM | ok |  |
| NUFEM | ok |  |
| NUVAM | ok |  |
| NUVE | ok |  |
| NUVOM | ok |  |
| UNVEM | ok |  |

### JANELA (10 possíveis, 10 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| GANELA | ok |  |
| JAMELA | ok |  |
| JANALA | ok |  |
| JANELE | ok |  |
| JANELO | ok |  |
| JANETA | ok | lembra o nome JANETE, mas não é ele |
| JANOLA | ok |  |
| JENELA | ok |  |
| JONELA | ok |  |
| NEJALA | ok |  |

### BONECA (10 possíveis, 10 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| BANECA | ok |  |
| BENECA | ok |  |
| BOMECA | ok |  |
| BONACA | ok |  |
| BONECE | ok |  |
| BONEGA | ok |  |
| BONOCA | ok |  |
| DONECA | ok |  |
| NEBOCA | ok |  |
| PONECA | ok |  |

### MACACO (10 possíveis, 10 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| CAMACO | ok |  |
| MACACE | ok |  |
| MACACU | ok | nome de rio e cidade no RJ, pouco conhecido; sem conotação |
| MACAGO | ok |  |
| MACECO | ok |  |
| MACOCO | ok |  |
| MAGACO | ok |  |
| MECACO | ok |  |
| MOCACO | ok |  |
| NACACO | ok |  |

### SAPATO (14 possíveis, 13 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| ASPATO | ok |  |
| CAPATO | ok |  |
| PASATO | ok |  |
| SABATO | ok | italiano neutro (sábado), sem conotação |
| SADATO | ok |  |
| SAPAFO | ok |  |
| SAPALO | ok |  |
| SAPATE | ok |  |
| SAPATU | ok |  |
| SAPETO | ok |  |
| SAPOTO | ok |  |
| SEPATO | ok |  |
| SOPATO | ok |  |
| ZAPATO | BLOQUEADA | espanhol para sapato: a criança pode achar que também está certo |

### TOMATE (13 possíveis, 12 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| FOMATE | ok |  |
| LOMATE | ok |  |
| MATOTE | ok |  |
| TAMATE | ok |  |
| TEMATE | ok |  |
| TOMAFE | ok |  |
| TOMALE | ok |  |
| TOMATA | ok |  |
| TOMATI | ok |  |
| TOMATO | BLOQUEADA | inglês para tomate (o app ensina inglês): pode parecer certo |
| TOMETE | ok |  |
| TOMOTE | ok |  |
| TONATE | ok |  |

### PANELA (11 possíveis, 10 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| BANELA | ok |  |
| DANELA | ok |  |
| NEPALA | ok |  |
| PAMELA | BLOQUEADA | nome próprio comum (Pâmela) |
| PANALA | ok |  |
| PANELE | ok |  |
| PANELO | ok |  |
| PANETA | ok |  |
| PANOLA | ok |  |
| PENELA | ok | nome de vila em Portugal, pouco conhecido; sem conotação |
| PONELA | ok |  |

### CAVALO (9 possíveis, 8 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| CAFALO | ok |  |
| CAVALU | ok |  |
| CAVATO | ok |  |
| CAVELO | ok |  |
| CAVOLO | BLOQUEADA | italiano, usado como palavrão leve (che cavolo) |
| CEVALO | ok |  |
| COVALO | ok |  |
| GAVALO | ok |  |
| VACALO | ok |  |

### BANANA (10 possíveis, 10 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| BAMANA | ok |  |
| BANAMA | ok |  |
| BANANE | ok | francês neutro (banana) |
| BANENA | ok |  |
| BANONA | ok |  |
| BENANA | ok |  |
| BONANA | ok |  |
| DANANA | ok |  |
| NABANA | ok |  |
| PANANA | ok |  |

### MENINO (8 possíveis, 7 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| MANINO | ok |  |
| MEMINO | ok |  |
| MENIMO | ok |  |
| MENINE | BLOQUEADA | linguagem neutra: assunto de debate, não é erro de escrita para mostrar à criança |
| MENINU | ok |  |
| MONINO | ok |  |
| NENINO | ok |  |
| NIMENO | ok |  |

### PETECA (11 possíveis, 10 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| BETECA | ok |  |
| DETECA | ok |  |
| PATECA | ok | regionalismo antigo (melancia), a criança não conhece; sem conotação |
| PEFECA | ok |  |
| PELECA | ok |  |
| PETACA | BLOQUEADA | gíria mexicana para bunda; garrafinha de bebida na Espanha |
| PETECE | ok |  |
| PETEGA | ok |  |
| PETOCA | ok |  |
| POTECA | ok |  |
| TEPECA | ok |  |

### TAPETE (11 possíveis, 9 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| FAPETE | ok | não é palavra; mesma observação de FAPA; fica |
| LAPETE | ok |  |
| PETATE | BLOQUEADA | gíria (morrer) no espanhol do México |
| TABETE | ok |  |
| TADETE | ok |  |
| TAPATE | ok |  |
| TAPEFE | ok |  |
| TAPELE | ok |  |
| TAPETI | BLOQUEADA | palavra real (tapeti, coelho do mato) |
| TAPOTE | ok |  |
| TEPETE | ok |  |

### GALINHA (6 possíveis, 4 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| AGLINHA | ok |  |
| GALINA | BLOQUEADA | nome próprio (russo); bloqueado pela regra conservadora adotada na terceira passada, confirmada pelo Filipe em 10/11/2026 |
| GELINHA | ok |  |
| GOLINHA | BLOQUEADA | palavra real (gola pequena) |
| JALINHA | ok |  |
| LIGANHA | ok |  |

### ABACATE (14 possíveis, 14 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| ABACAFE | ok |  |
| ABACALE | ok |  |
| ABACATA | ok |  |
| ABACATI | ok |  |
| ABACATO | ok |  |
| ABACETE | ok |  |
| ABACOTE | ok |  |
| ABAGATE | ok |  |
| ABECATE | ok |  |
| ABOCATE | ok |  |
| ADACATE | ok |  |
| APACATE | ok |  |
| EBACATE | ok |  |
| OBACATE | ok |  |

### BORBOLETA (22 possíveis, 22 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| BARBOLETA | ok |  |
| BERBOLETA | ok |  |
| BOBOLETA | ok |  |
| BOBORLETA | ok |  |
| BOBROLETA | ok |  |
| BOLBOLETA | ok |  |
| BORBALETA | ok |  |
| BORBELETA | ok |  |
| BORBOLATA | ok |  |
| BORBOLEFA | ok |  |
| BORBOLELA | ok |  |
| BORBOLETE | ok |  |
| BORBOLETO | ok |  |
| BORBOLOTA | ok |  |
| BORBOTETA | ok |  |
| BORDOLETA | ok |  |
| BOROBLETA | ok |  |
| BOROLETA | ok |  |
| BORPOLETA | ok |  |
| BROBOLETA | ok |  |
| DORBOLETA | ok |  |
| PORBOLETA | ok |  |

### FOGUETE (12 possíveis, 12 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| FAGUETE | ok |  |
| FEGUETE | ok |  |
| FOGUEFE | ok |  |
| FOGUELE | ok |  |
| FOGUETA | ok |  |
| FOGUETI | ok |  |
| FOGUETO | ok |  |
| FOJUETE | ok |  |
| FOQUETE | ok |  |
| GUEFOTE | ok |  |
| TOGUETE | ok |  |
| VOGUETE | ok |  |

### DENTE (8 possíveis, 6 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| BENTE | ok | nome escandinavo raro no Brasil; sem conotação |
| DANTE | BLOQUEADA | nome próprio comum (Dante) |
| DENE | BLOQUEADA | inglês real (vale estreito, no inglês britânico); o app ensina inglês |
| DENFE | ok |  |
| DENLE | ok |  |
| DENTI | ok | italiano neutro (dentes); é o erro do E final que soa I |
| DETE | ok |  |
| DONTE | ok |  |

### FADA (3 possíveis, 2 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| FAPA | ok | não é palavra; a sílaba lembra gíria chula do inglês da internet que a criança não lê; fica (o Filipe confirmou em 10/11/2026) |
| TADA | BLOQUEADA | inglês real (ta-da, a interjeição de mágica); o app ensina inglês |
| VADA | ok | italiano neutro (vá) |

### VELA (2 possíveis, 1 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| FELA | BLOQUEADA | gíria ofensiva do Nordeste (fela da mãe) |
| VOLA | ok | italiano neutro (voa) |

### TIJOLO (10 possíveis, 10 liberadas)

| Escrita | Veredito | Observação |
|---|---|---|
| FIJOLO | ok |  |
| JOTILO | ok |  |
| LIJOLO | ok |  |
| TIGOLO | ok |  |
| TIJALO | ok |  |
| TIJELO | ok | lembra o erro comum TIJELA (tigela), não é palavra |
| TIJOLA | ok |  |
| TIJOLE | ok |  |
| TIJOLU | ok |  |
| TIJOTO | ok |  |

## Bloqueio preventivo (o gerador hoje não produz; fica para o banco crescer)

| Escrita | Veredito | Observação |
|---|---|---|
| ARMA | BLOQUEADA | violência |
| BESTA | BLOQUEADA | xingamento |
| BICHA | BLOQUEADA | xingamento homofóbico |
| BOCETA | BLOQUEADA | palavrão |
| BOSTA | BLOQUEADA | palavrão |
| BUCETA | BLOQUEADA | palavrão |
| BUNDA | BLOQUEADA | corpo, vira piada |
| BURRA | BLOQUEADA | xingamento |
| BURRO | BLOQUEADA | xingamento |
| CACETE | BLOQUEADA | palavrão |
| CARALHO | BLOQUEADA | palavrão |
| CHATA | BLOQUEADA | xingamento |
| CHATO | BLOQUEADA | xingamento |
| COCO | BLOQUEADA | vira piada (cocô) |
| COCÔ | BLOQUEADA | vira piada |
| CORNO | BLOQUEADA | xingamento |
| CU | BLOQUEADA | palavrão |
| DROGA | BLOQUEADA | droga e xingamento |
| FEIA | BLOQUEADA | xingamento |
| FEIO | BLOQUEADA | xingamento |
| FODA | BLOQUEADA | palavrão |
| FODER | BLOQUEADA | palavrão |
| FUDER | BLOQUEADA | palavrão |
| GORDA | BLOQUEADA | xingamento |
| GORDO | BLOQUEADA | xingamento |
| IDIOTA | BLOQUEADA | xingamento |
| MACONHA | BLOQUEADA | droga |
| MATA | BLOQUEADA | violência |
| MATAR | BLOQUEADA | violência |
| MERDA | BLOQUEADA | palavrão |
| MORTE | BLOQUEADA | violência |
| MORTO | BLOQUEADA | violência |
| OTARIO | BLOQUEADA | xingamento |
| OTÁRIO | BLOQUEADA | xingamento |
| PAU | BLOQUEADA | conotação sexual |
| PEIDO | BLOQUEADA | vira piada |
| PEITO | BLOQUEADA | corpo, vira piada |
| PICA | BLOQUEADA | palavrão |
| PINTO | BLOQUEADA | conotação sexual |
| PIROCA | BLOQUEADA | palavrão |
| PORCARIA | BLOQUEADA | xingamento |
| PORRA | BLOQUEADA | palavrão |
| PUTA | BLOQUEADA | palavrão |
| PUTO | BLOQUEADA | palavrão e gíria de raiva |
| PÓ | BLOQUEADA | droga |
| ROLA | BLOQUEADA | conotação sexual |
| SAFADA | BLOQUEADA | conotação sexual |
| SAFADO | BLOQUEADA | conotação sexual |
| TESÃO | BLOQUEADA | conotação sexual |
| TETA | BLOQUEADA | corpo, conotação sexual |
| TROUXA | BLOQUEADA | xingamento |
| VAGABUNDA | BLOQUEADA | xingamento |
| VAGABUNDO | BLOQUEADA | xingamento |
| VIADO | BLOQUEADA | xingamento homofóbico |
| XERECA | BLOQUEADA | palavrão |
| XIXI | BLOQUEADA | vira piada |
| XOTA | BLOQUEADA | palavrão |
| XOXOTA | BLOQUEADA | palavrão |
