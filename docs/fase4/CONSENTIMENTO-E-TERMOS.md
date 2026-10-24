# Fase 4 · Consentimento parental, termos e política (RASCUNHO, precisa de advogado)

Data: 24/10/2026. Tudo neste arquivo é **RASCUNHO, precisa de advogado**. Nenhum texto aqui vai ao ar antes de parecer de advogado de proteção de dados e direito digital. Os artigos citados vêm de `pesquisa/03-etica-e-lgpd-infantil.md` (que abriu a Lei 15.211/2025, o Decreto 12.880/2026 e a LGPD no Planalto) e de `docs/AUDITORIA-SEGURANCA-LGPD.md`; não reabri o texto oficial nesta rodada. O CDC art. 49 está citado de memória na mesa 05 e aqui também: o advogado confirma.

Marcas: **[ADV]** decisão do advogado; **[CONT]** decisão do contador; **[FILIPE]** decisão dele.

---

## 1. Princípios que o texto e o fluxo obedecem

1. **A conta é do adulto; a criança nunca é titular de conta.** Dela só existem apelido, cor, faixa etária e progresso.
2. **Consentimento separado dos termos**, específico e em destaque (LGPD art. 14 §1º). Três caixas, três textos curtos, nenhuma pré-marcada, nenhuma condicionada a outra que não seja necessária.
3. **Revogar é tão fácil quanto aceitar** (LGPD art. 8º §5º; Decreto art. 10 III): mesma tela, um toque, sem telefone.
4. **Nada de dado além do necessário** como condição para jogar (LGPD art. 14 §4º). O relatório por e-mail é opt-in à parte.
5. **Linguagem simples**, em português do Brasil, e uma versão para a criança com áudio (LGPD art. 14 §6º).
6. **Cada aceite deixa prova**: tipo, versão do texto, hash do texto, data, user agent, hash do IP (`consentimento`). Mudou o texto, muda a versão e o app pede aceite de novo só do que mudou.
7. **Nada pago pela criança, nunca; nenhum preço na tela dela** (ECA Digital art. 18 II; Decreto art. 10). A tela de assinatura vive atrás do PIN e da sessão do adulto.

---

## 2. Fluxo de consentimento (telas, em ordem)

```
[Área do responsável, atrás do PIN]
   └─ "Criar conta ou entrar"
        └─ e-mail → "Enviamos um link para <e-mail>" → abre o link → volta logado
             └─ Tela ÚNICA de aceites (só na primeira vez, e quando uma versão mudar):
                  ┌───────────────────────────────────────────────────────────────┐
                  │ Antes de continuar, três coisas para você ler e decidir.      │
                  │                                                               │
                  │ [ ] Li e aceito os Termos de uso (versão 2026-11-10)  [ler]   │
                  │ [ ] Li a Política de privacidade (versão 2026-11-10)  [ler]   │
                  │ [ ] Sou pai, mãe ou responsável legal e AUTORIZO que o        │
                  │     Universo de Bobby guarde o apelido, a cor, a faixa de     │
                  │     idade e o progresso da(s) criança(s) desta conta, só      │
                  │     para o jogo funcionar e para eu acompanhar. Posso         │
                  │     retirar esta autorização quando quiser, na mesma tela.    │
                  │                                                     [ler]    │
                  │                                                               │
                  │ Opcional, pode marcar depois:                                 │
                  │ [ ] Quero receber por e-mail, uma vez por semana, o resumo    │
                  │     do que ela treinou. Dá para parar em qualquer e-mail.     │
                  │                                                               │
                  │ Declaro ter 18 anos ou mais.  [Continuar]                     │
                  └───────────────────────────────────────────────────────────────┘
                       │  grava 3 (ou 4) linhas em `consentimento` com versão e hash
                       └─ Escolher plano → checkout do provedor → volta
```

Regras da tela:

- Os três primeiros são **obrigatórios para usar a nuvem** porque sem eles o serviço não existe; o quarto é opcional e aparece visualmente separado ("Opcional").
- Nenhuma caixa vem marcada. O botão só ativa com as três obrigatórias.
- "Ler" abre o texto inteiro dentro do app (não só link externo), com a versão e a data no topo.
- A declaração de 18 anos é texto fixo acima do botão; aceitar o botão é aceitar a declaração (OPINIÃO; se o advogado pedir caixa própria, vira a quarta obrigatória).
- **Revogação:** em "Para o responsável → Conta e privacidade", cada um dos quatro aparece com data do aceite e botão "Retirar". Retirar o parental = o app explica que os perfis saem da nuvem (ficam só no aparelho) e pede confirmação única. Retirar o e-mail = para de enviar na hora.
- **Mudança de versão:** o app compara a versão aceita com a vigente; se mudou, mostra só o item que mudou, com "o que mudou" em 3 linhas, e pede o aceite de novo. Nada em silêncio.

### O que conta como "esforço razoável" de verificar que é um adulto [ADV]

Hoje, no desenho: (a) e-mail próprio confirmado por link; (b) declaração de maioridade; (c) **pagamento por cartão ou Pix em nome de um adulto** (no Asaas o pagador informa CPF para a nota; isso fica no provedor, não no Bobby). A pesquisa 03 registra que o guia definitivo da ANPD sobre aferição de idade ainda não saiu (orientações preliminares em 20/03/2026). O advogado decide se (a)+(b)+(c) bastam ou se é preciso mais (por exemplo, confirmação por segundo canal). O que **não** faremos: pedir documento ou foto do adulto para guardar no Bobby.

---

## 3. Rascunho dos Termos de uso (linguagem simples) · RASCUNHO, precisa de advogado

> **Termos de uso do Universo de Bobby** · versão RASCUNHO de 24/10/2026
>
> **Quem somos.** O Universo de Bobby é um aplicativo de estudo de matemática, português e inglês para crianças de 7 a 12 anos, feito por [RAZÃO SOCIAL], CNPJ [●], com sede em [CIDADE/UF], e-mail [contato@●]. [FILIPE] [CONT]
>
> **Quem pode criar conta.** Só pessoas com 18 anos ou mais, que sejam pai, mãe ou responsável legal da criança. A criança não cria conta, não informa e-mail e não paga nada.
>
> **O que você contrata.** Uma assinatura por família, que libera o jogo completo para até 4 perfis de criança, nos aparelhos em que você entrar com a sua conta. Planos e preços: mensal R$ 19,90 e anual R$ 149,00 (valores de [data]; mudanças são avisadas por e-mail com 30 dias de antecedência e nunca valem para o período já pago). [FILIPE]
>
> **Como funciona o pagamento.** O pagamento é feito na página do nosso provedor de pagamento ([Asaas/●]); nós não vemos nem guardamos o número do seu cartão. A renovação é automática. Avisamos por e-mail antes de cada cobrança do plano anual e você pode cancelar a qualquer momento.
>
> **Cancelar.** Em "Para o responsável → Assinatura → Cancelar", com um toque. O acesso continua até o fim do período já pago. Não há multa.
>
> **Arrependimento.** Se você assinar e mudar de ideia em até 7 dias, devolvemos o valor pago, pelo mesmo meio. [ADV: CDC art. 49, confirmar prazo e redação]
>
> **O que acontece se parar de pagar.** O jogo volta a mostrar a tela de assinatura. **Nenhum progresso é apagado**, nem no aparelho nem na nossa nuvem. Você pode exportar tudo ou apagar a conta quando quiser.
>
> **O que você não pode fazer.** Usar o app para outra coisa que não o estudo da criança; copiar, revender ou redistribuir o conteúdo; tentar acessar dados de outras famílias.
>
> **Classificação indicativa.** [●] [ADV: rito para app só na web; ver seção 7]
>
> **Compras dentro do app.** Não existem. As moedas do jogo só se ganham jogando e não podem ser compradas. Não há anúncios, não há sorteios, não há caixas com prêmio aleatório.
>
> **Disponibilidade.** O app funciona sem internet; a sincronização e a área da conta precisam de conexão. Podemos fazer manutenção e avisamos quando for programada.
>
> **Suporte.** [e-mail de suporte], resposta em até [2] dias úteis. [FILIPE]
>
> **Mudanças nestes termos.** Avisamos por e-mail e dentro do app, com a versão e a data. Continuar usando depois do aviso é aceitar; se não aceitar, você pode cancelar e exportar seus dados.
>
> **Lei e foro.** Lei brasileira; foro do domicílio do consumidor. [ADV]

---

## 4. Rascunho da Política de privacidade (linguagem simples) · RASCUNHO, precisa de advogado

> **Política de privacidade do Universo de Bobby** · versão RASCUNHO de 24/10/2026
>
> **Em uma frase.** Guardamos o mínimo: o seu e-mail, e da criança só um apelido, uma cor, a faixa de idade e o progresso no jogo. Nada é vendido, nada vira anúncio, e você pode baixar ou apagar tudo quando quiser.
>
> **Quem é o controlador.** [RAZÃO SOCIAL], CNPJ [●]. Encarregado (DPO): [nome], [privacidade@●]. [FILIPE] [ADV]
>
> **O que guardamos e para quê.**
>
> | Dado | De quem | Para quê | Base legal [ADV] |
> |---|---|---|---|
> | E-mail | do adulto | entrar na conta, avisos de cobrança, recibo | execução do contrato |
> | Apelido (até 18 letras), cor do boneco, faixa de idade (7 a 8, 9 a 10, 11 a 12) | da criança | mostrar o perfil e ajustar o conteúdo | consentimento do responsável |
> | Progresso: fases, estrelas, acertos e erros, itens de revisão, moedas e itens do jogo, dias e minutos de uso | da criança | o jogo funcionar em mais de um aparelho e você acompanhar | consentimento do responsável |
> | Prova dos seus aceites (versão do texto, data, navegador, código do endereço de rede) | do adulto | comprovar o consentimento | obrigação legal |
> | Dados da assinatura e dos pagamentos (plano, valor, data, status, número da nota fiscal) | do adulto | cobrar, emitir nota, atender você | contrato e obrigação legal |
>
> **O que NÃO guardamos da criança:** nome completo, data de nascimento, foto, voz, escola, localização, contatos, identificador do aparelho. O app não tem câmera, microfone nem GPS ligados.
>
> **O que não fazemos:** vender dados; anúncios; perfil para publicidade; compartilhar com redes sociais; rastrear fora do app.
>
> **Com quem compartilhamos, só o necessário:** o provedor de pagamento ([●]) recebe o que precisa para cobrar (e-mail, e CPF se você informar na página dele para a nota fiscal); o provedor de hospedagem do banco (Supabase, servidores em São Paulo) guarda os dados; o serviço de e-mail ([●]) entrega as mensagens. Todos com contrato de proteção de dados. [ADV: lista de operadores]
>
> **Onde ficam.** Em servidores no Brasil (São Paulo). O aparelho da criança também guarda uma cópia do progresso, que você pode apagar na área do responsável.
>
> **Por quanto tempo.** Enquanto a conta existir. Conta sem assinatura e sem acesso por 24 meses: avisamos por e-mail e apagamos 30 dias depois. Dados fiscais ficam pelo prazo da lei. [ADV] [CONT]
>
> **Seus direitos.** Baixar tudo (botão "Baixar tudo da minha conta"), corrigir, apagar a conta inteira (botão "Apagar conta e todos os dados"), retirar um consentimento, perguntar o que fazemos. Tudo dentro do app, sem ligar para ninguém; ou pelo e-mail do encarregado, com resposta em até 15 dias. [ADV: prazo]
>
> **Segurança.** Conexão cifrada; cada família só enxerga os próprios dados (regra aplicada no banco); ninguém da equipe vê progresso de criança sem pedido seu de suporte.
>
> **Cookies e medição.** O app não usa cookies de terceiros nem ferramentas de analytics. Ele registra, só no aparelho, eventos de uso (por exemplo "fase concluída") para o responsável ver o relatório; isso não sai do aparelho a menos que você exporte.
>
> **Mudanças.** Avisamos no app e por e-mail, com a versão e o que mudou.

---

## 5. Texto para a criança (tela "O que o Bobby guarda", com áudio) · RASCUNHO, precisa de advogado e de pedagogo

> Oi! Eu sou o Bobby. Quer saber o que eu guardo de você?
>
> Eu guardo o seu apelido, a sua cor e as estrelas que você ganhou. Assim, quando você voltar, está tudo aqui.
>
> Eu não guardo o seu nome inteiro, nem foto, nem onde você mora. Eu não conto nada para ninguém.
>
> Quem cuida disso é o adulto que preparou o foguete. Se você quiser, ele pode apagar tudo, e tudo bem.

Regras: até 60 palavras; sem "privacidade", "dados", "lei"; narrado pela voz do Bobby (clipe novo para `audio/regerar-pendentes.json`); acessível pelo botão de informação no perfil; nunca interrompe o jogo.

---

## 6. E-mails transacionais (modelos curtos; sem dado da criança dentro)

| E-mail | Assunto | Corpo (essência) |
|---|---|---|
| Magic link | "Seu link para entrar no Universo de Bobby" | "Toque para entrar. O link vale 15 minutos e só funciona uma vez. Se não foi você, ignore." |
| Confirmação de assinatura | "Assinatura confirmada" | plano, valor, próxima cobrança, link para cancelar, link da nota fiscal quando houver |
| Aviso de cobrança (anual, 7 dias antes) | "Sua assinatura anual renova em 7 dias" | valor, data, como cancelar em um toque |
| Pagamento não aprovado | "Não conseguimos renovar sua assinatura" | o que fazer; o acesso continua até [data]; nada é apagado |
| Cancelamento | "Assinatura cancelada" | acesso até [data]; progresso guardado; como voltar |
| Relatório semanal (opt-in) | "Resumo da semana de [apelido]" | 5 números, "brilhou em", 1 "vale ajudar em"; link de descadastro assinado em todo e-mail. **Único e-mail com o apelido**, e só porque o responsável pediu |
| Conta apagada | "Sua conta foi apagada" | confirmação; sem nenhum dado dentro |

---

## 7. Lista exata do que advogado e contador precisam decidir

### Advogado [ADV]

1. **Base legal por finalidade** (tabela da seção 4): contrato para o dado do adulto e consentimento parental para o da criança, ou outra combinação (Enunciado ANPD 1/2023 e art. 14).
2. **Redação final do consentimento parental** e se a declaração de maioridade vira caixa própria.
3. **O que conta como esforço razoável de verificar o responsável** (e-mail + declaração + pagamento por adulto) à luz das orientações preliminares da ANPD de 20/03/2026 e do guia definitivo quando sair.
4. **Prazo de retenção** de conta inativa (proposto 24 meses + 30 dias), de `consentimento` após exclusão e de `pagamento` (com o contador).
5. **Direito de arrependimento** (CDC art. 49): prazo de 7 dias vale para mensal e anual? Redação. Reembolso proporcional ou integral.
6. **Classificação indicativa para app distribuído só na web** (Portaria MJSP 502/2021, Decreto 12.880 art. 12 §4º): qual rito, que texto vai nos termos, se é autoclassificação.
7. **Relatório de impacto (RIPD)** e gerenciamento de risco das funcionalidades (ECA Digital art. 16 e art. 8º I): escopo e quem assina.
8. **Parecer sobre as mecânicas** já listadas na síntese 00 (dias de exploração, baú com escolha, loja da semana, petisco, missões) e sobre o muro de assinatura.
9. **Contratos com operadores**: Supabase (DPA), provedor de pagamento, e-mail transacional, Cloudflare.
10. **Encarregado**: pode ser o próprio Filipe? Texto da nomeação.
11. **Política de resposta a incidente** (LGPD art. 48): o que comunicar, a quem, em quanto tempo.
12. **Licença das vozes (Kokoro)** e das imagens geradas (pendência herdada do README da fase 3).
13. **Termos de beta** se houver famílias antes do lançamento público.
14. **Revisão dos textos das seções 3, 4, 5 e 6** antes de ir ao ar.

### Contador [CONT]

1. **Abertura da ME no Simples Nacional** (MEI não cobre CNAE de licenciamento de software, mesa 05 §4.1): CNAE, anexo, fator R, estimativa de imposto sobre R$ 19,90 e R$ 149.
2. **NFS-e**: município de emissão, padrão nacional, emissão automática pelo provedor (Asaas) ou pelo sistema do contador; CPF do pagador é obrigatório na nota? (isso define o que o checkout pede).
3. **Prazo de guarda** dos registros de pagamento (define a retenção de `pagamento`).
4. **Reembolso**: como estornar a nota; como lançar o cancelamento.
5. **Receita via loja de apps no futuro** (intermediada) contra receita direta na web: diferença de tratamento.

### Filipe [FILIPE]

1. Razão social, CNPJ, endereço e e-mails (contato, suporte, privacidade).
2. Quem é o encarregado.
3. Confirmar o muro `tudo-pago` contra "3 etapas grátis" (mesa 05 e síntese Q3).
4. Pix só no anual ou também no mensal (10% de taxa no Asaas).
5. Prazo de resposta do suporte que vai nos termos.
6. Aprovar os textos depois do advogado.

---

## 8. O que este desenho já faz pela lei, para o advogado conferir rápido

| Exigência (pesquisa 03) | Onde está |
|---|---|
| Consentimento específico e em destaque de um dos pais (LGPD art. 14 §1º) | Tela única de aceites, caixa separada, texto próprio, prova em `consentimento` |
| Informação pública sobre dados e direitos (art. 14 §2º) | Política pública no site e dentro do app |
| Não condicionar a dado além do necessário (art. 14 §4º) | Relatório por e-mail é opcional e separado; nenhum dado extra da criança |
| Informação à criança, com recurso audiovisual (art. 14 §6º) | Tela do Bobby com áudio (seção 5) |
| Revogação fácil (art. 8º §5º; Decreto art. 10 III) | Mesma tela, um toque |
| Controle parental real: ver, limitar, restringir compras (ECA Digital art. 17 e 18) | Conta do adulto; compra só atrás do PIN e da sessão; limites de tempo já existem no app |
| Sem recompensa por tempo, sem urgência fabricada, sem loot box (art. 17 §4º II, Decreto arts. 9º e 10, Lei art. 20) | Sem preço na tela da criança, sem contagem, sem desconto; moeda nunca vendida |
| Exclusão completa (LGPD arts. 15, 16, 18) | `apagar-conta` + `apagarTudoDoAparelho()` + e-mail final |
| Representante no Brasil (ECA Digital art. 40) | Empresa brasileira; documentar |
| Dado no mínimo e seguro (art. 46) | 11 tabelas com RLS; nada sensível além do necessário; hashes em vez de IP e texto |
