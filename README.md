# Domino

Protótipo mobile em português brasileiro de um gerenciador de tarefas com intenções SE–ENTÃO.

## Como funciona
Um bloco tem um nome, um gatilho inicial e uma sequência ordenada de tarefas. Apenas a primeira tarefa pendente pode ser iniciada. Ao concluí-la, a próxima fica disponível.

- Criar, editar, duplicar e excluir blocos.
- Adicionar, editar e remover tarefas; definir duração estimada.
- Reordenar por arraste ou pelos comandos acessíveis de mover para cima/baixo.
- Acompanhar e reiniciar o progresso de um bloco.
- Prévia de iPhone e Pixel 10 com teclado simulado.

## Executar
Requer Node.js compatível com Vite 8 (22.12+).

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

```sh
npm run build
npm run check:runtime
```

## Escopo
Frontend React/TypeScript e Vite. Os dados existem apenas na sessão e voltam aos exemplos ao recarregar a página. Não há autenticação, backend, notificações ou sincronização. As durações são estimativas, não temporizadores.

O código de produto está em `src/Prototype.tsx` e `src/prototype.css`. O shell de dispositivo é fornecido pelo template e está protegido; leia `AGENTS.md` antes de alterá-lo.
