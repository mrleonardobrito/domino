# Domino

Web app responsivo em português brasileiro de um gerenciador de tarefas com intenções SE–ENTÃO.

## Como funciona
Um bloco tem um nome, um gatilho inicial e uma sequência ordenada de tarefas. Apenas a primeira tarefa pendente pode ser iniciada. Ao concluí-la, a próxima fica disponível.

- Criar, editar, duplicar e excluir blocos.
- Adicionar, editar e remover tarefas; definir duração estimada.
- Reordenar por arraste ou pelos comandos acessíveis de mover para cima/baixo.
- Acompanhar e reiniciar o progresso de um bloco.
- Layout responsivo: funciona no navegador do celular e no desktop.

## Executar
Requer Node.js compatível com Vite 8 (22.12+).

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

```sh
npm run build
```

## Deploy na Vercel
O arquivo `vercel.json` configura o deploy como site estático:

- Instalação com `npm ci` e build com `npm run build`.
- Saída publicada a partir de `dist/client`.
- Rotas desconhecidas fazem fallback para `index.html`.
- JS, CSS e fontes com hash em `/assets/` recebem cache imutável.

Importe o repositório na Vercel (Node.js 22.x ou superior) ou rode `npx vercel` na raiz do projeto.

## Escopo
Frontend React/TypeScript e Vite. Os dados existem apenas na sessão e voltam aos exemplos ao recarregar a página. Não há autenticação, backend, notificações ou sincronização. As durações são estimativas, não temporizadores.

O código do app está em `src/Prototype.tsx` e `src/prototype.css`.
