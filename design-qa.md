# Domino — revisão de design e interação

final result: passed

## Referência e evidências
- Referência escolhida: `qa/reference-domino.png` (853 × 1844 pixels), o conceito Domino com blocos encadeados.
- Implementação: `qa/home-final.png`, `qa/editor-final.png`.
- Comparação conjunta: `qa/comparison-final.png`; detalhe da peça: `qa/tile-comparison.png`.
- Navegador: prévia local aberta no navegador em nuvem.
- Viewport do navegador: 1363 × 936. iPhone: viewport lógico 393 × 852; Pixel 10: 427 × 952.
- Normalização: o shell se ajustou ao navegador em escala 0,917355 no iPhone. Capturas da região de tela de aproximadamente 361 × 782 foram normalizadas para 393 × 852. Não se afirma equivalência pixel a pixel nem captura nativa em escala 1. A API do navegador disponível não oferece ajuste de viewport. Essa limitação de precisão foi preservada no registro, sem alterar o shell protegido.
- A referência gerada tem duas colunas muito mais altas que uma viewport mobile real. A composição mantém as proporções originais da referência. A implementação adapta a densidade ao dispositivo real, mantém rolagem para formulários longos e preserva os componentes de aparelho do template.
- Estados comparados: bloco inicial com primeira etapa concluída; editor com as três tarefas do mesmo bloco e campos preenchidos. A tradução pt-BR é uma alteração solicitada. A referência usa criação, enquanto a captura final do formulário usa edição, com os mesmos campos e peças.

## Superfícies de fidelidade
- Tipografia: Barlow Condensed 600/700 aproxima o grotesco condensado da referência; Barlow para campos e textos auxiliares. Títulos, números e tarefas têm hierarquia clara. Textos localizados cabem nos cartões; nomes longos quebram na lista.
- Espaçamento e composição: amarelo contínuo, bloco expandido, gatilho SE, três peças em degraus, setas de sequência, bloco secundário recolhido e CTA de novo bloco preservados. Formulário mantém nome, gatilho e peças numeradas reordenáveis. Conteúdo longo usa rolagem.
- Cores: fundo #fff268, coral #ff8d87, azul #98cbf8, lilás #bea0ee e tinta #151511; sombras pretas deslocadas, divisória numérica e contornos preservados. Fundos planos substituem pequenas irregularidades da geração raster.
- Imagens e ícones: não existem fotos ou ilustrações de produto na referência. Peças são componentes editáveis, marca é texto; ícones padronizados Radix. Moldura/teclado/status do template preservados e protegidos.
- Conteúdo: toda a interface de produto está em português brasileiro, incluindo erros, estados, opções, confirmação, etapas e rótulos acessíveis. O seletor técnico de aparelho e as imagens de teclado pertencem ao template.

## Histórico de correções
1. [P1, corrigido] Uso de randomUUID indisponível no HTTP da prévia impedia carregamento. Substituído por identificadores locais com contador. Build e carregamento confirmados.
2. [P2, corrigido] Densidade inicial empurrava a ação principal para fora da primeira tela. Ajustados espaçamentos e altura das peças; captura final mostra ação de próxima etapa e novo bloco.
3. [P1, corrigido] Restauração de foco rolava o contêiner externo do aparelho e deslocava teclado/status, mesmo com teclado fechado. Guard de rolagem no código da aplicação mantém a moldura imóvel e preserva a rolagem de MobileScroll. Evidência final: screenScroll=0; teclado false; editor no topo; retorno à lista após salvar verificado. Nenhum arquivo protegido foi alterado.
4. [P2, corrigido] Tecla Enter não encerrava a entrada simulada. Campos agora fecham teclado ao confirmar/pressionar Escape e ao perder foco para controles não textuais.

## Interações verificadas no navegador
- Iniciar etapa 2, concluir e desbloquear etapa 3; concluir o bloco inteiro.
- Bloqueio das etapas futuras e marcação de concluídas.
- Validação de bloco vazio.
- Criação de um bloco com nome, gatilho e múltiplas tarefas em pt-BR.
- Alteração da duração e da ordem pelos comandos acessíveis.
- Arraste real da primeira peça para depois da segunda, confirmado na ordem dos campos.
- Salvamento e reabertura do bloco editado.
- Entrada em campo de tarefa, Enter, fechamento de teclado e salvamento sem deslocar aparelho.
- Seleção do Pixel 10, revisão de layout e abertura/fechamento da etapa.
- Console de aplicação sem erros após correções; mensagens da extensão de navegador não pertencem ao app.
- `npm run build` e `npm run check:runtime` aprovados.

## Limites e refinamentos
- Dados em memória, apenas durante a sessão; não existe backend nem persistência entre recargas.
- Testes manuais não exaustivos; ações secundárias de duplicar/excluir estão implementadas, mas não fizeram parte do percurso principal completo.
- [P3] Captura nativa 1:1 em viewport maior poderá melhorar a comparação tipográfica fina; não é uma garantia de fidelidade pixel a pixel.
- [P3] Setas padrão são retas, enquanto algumas conexões desenhadas na referência são levemente curvas.

## Checklist final
- [x] Fluxos principais funcionando.
- [x] Português brasileiro aplicado.
- [x] Comparação de referência e capturas no mesmo painel.
- [x] Problemas de rolagem/teclado corrigidos e rechecados.
- [x] Build e integridade do runtime aprovados.
