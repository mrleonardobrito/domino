import { createContext, useContext, useEffect, useState, type ReactNode, type InputHTMLAttributes } from 'react';
import { Reorder, useDragControls } from 'motion/react';
import { ArrowLeftIcon, ArrowDownIcon, ArrowUpIcon, CheckIcon, ChevronRightIcon, DotsVerticalIcon, DragHandleDots2Icon, Pencil1Icon, PlusIcon, ResetIcon, CopyIcon, TrashIcon } from '@radix-ui/react-icons';
import { BottomSheet, FlowStack, KeyboardInput, MobileScroll, useFlow, useKeyboard, useScreenPortal } from './mobile';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';

type Task = { id: string; title: string; minutes: number; done: boolean };
type Block = { id: string; title: string; cue: string; tasks: Task[] };
let sequence = 0;
const uid = () => `domino-${Date.now().toString(36)}-${++sequence}`;
const task = (title = '', minutes = 2, done = false): Task => ({ id: uid(), title, minutes, done });
const initial: Block[] = [
  { id: 'morning', title: 'Começar o dia', cue: 'meu café estiver pronto', tasks: [task('Ler 2 páginas', 3, true), task('Definir uma prioridade', 2), task('Focar por 15 minutos', 15)] },
  { id: 'evening', title: 'Desacelerar à noite', cue: 'eu terminar de jantar', tasks: [task('Organizar a mesa', 3), task('Preparar a mochila', 2)] },
];
type Store = { blocks: Block[]; setBlocks: React.Dispatch<React.SetStateAction<Block[]>>; expanded: string; setExpanded: (id: string) => void; notify: (s: string) => void };
const Data = createContext<Store>(null!);
const useData = () => useContext(Data);
const color = (i: number) => ['coral', 'blue', 'lilac'][i % 3];

function EntryField(props: InputHTMLAttributes<HTMLInputElement>) {
  const keyboard = useKeyboard();
  return <KeyboardInput {...props} enterKeyHint="done" onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); keyboard.hide(); } }} onBlur={e => { if (!(e.relatedTarget instanceof HTMLInputElement)) keyboard.hide(); }} />;
}

export default function Prototype() {
  const { screenRef } = useScreenPortal();
  const [blocks, setBlocks] = useState(initial);
  const [expanded, setExpanded] = useState('morning');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    // Browser focus restoration must scroll MobileScroll, never the phone's chrome.
    const screen = screenRef.current;
    if (!screen) return;
    const keepChromeFixed = () => { if (screen.scrollTop || screen.scrollLeft) screen.scrollTo(0, 0); };
    keepChromeFixed();
    screen.addEventListener('scroll', keepChromeFixed);
    return () => screen.removeEventListener('scroll', keepChromeFixed);
  }, [screenRef]);
  useEffect(() => { document.title = 'Domino — uma tarefa leva à outra'; document.documentElement.lang = 'pt-BR'; }, []);
  useEffect(() => { if (notice) { const t = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(t); } }, [notice]);
  return <Data.Provider value={{ blocks, setBlocks, expanded, setExpanded, notify: setNotice }}>
    <div className="domino-app" lang="pt-BR">
      <FlowStack initial={{ id: 'home', render: () => <Home /> }} />
      {notice && <div className="toast" role="status"><CheckIcon />{notice}</div>}
    </div>
  </Data.Provider>;
}

function Button({ children, onClick, outline = false, disabled = false }: { children: ReactNode; onClick?: () => void; outline?: boolean; disabled?: boolean }) {
  return <button className={`main-button ${outline ? 'outline' : ''}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

function Home() {
  const { blocks, setBlocks, expanded, setExpanded, notify } = useData();
  const flow = useFlow();
  const [menu, setMenu] = useState<string | null>(null);
  const [running, setRunning] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const selected = blocks.find(b => b.id === menu);
  const activeBlock = blocks.find(b => b.id === running);
  const activeTask = activeBlock?.tasks.find(t => !t.done);
  const edit = (block?: Block) => flow.push({ id: 'editor', render: () => <Editor block={block} /> });
  const complete = () => {
    if (!activeBlock || !activeTask) return;
    const last = activeBlock.tasks.filter(t => !t.done).length === 1;
    setBlocks(bs => bs.map(b => b.id === activeBlock.id ? { ...b, tasks: b.tasks.map(t => t.id === activeTask.id ? { ...t, done: true } : t) } : b));
    setRunning(null);
    notify(last ? 'Bloco concluído. Boa!' : 'Etapa concluída. A próxima está pronta!');
  };
  return <>
    <MobileScroll className="domino-scroll">
      <main className="home-content">
        <div className="wordmark">DOMINO</div>
        <h1>Uma tarefa<br />leva à outra.</h1>
        <p className="intro">Pequenos passos. Um dia mais leve.</p>
        <div className="blocks">
          {blocks.map(b => {
            const done = b.tasks.filter(t => t.done).length;
            const next = b.tasks.findIndex(t => !t.done);
            const open = b.id === expanded;
            return <section key={b.id} className={`block ${open ? 'expanded' : ''}`}>
              {open ? <>
                <div className="block-heading"><h2>{b.title}</h2><button className="icon-button" aria-label={`Opções de ${b.title}`} onClick={() => { setDeleting(false); setMenu(b.id); }}><DotsVerticalIcon /></button></div>
                <p className="progress">{done} de {b.tasks.length} concluídas</p>
                <div className="cue"><strong>SE</strong><span>{b.cue}</span></div>
                <div className="task-chain">
                  {b.tasks.map((t, i) => <div className={`chain-step step-${i % 2}`} key={t.id}>
                    <div className="connector"><ArrowDownIcon /></div>
                    <button className={`domino-tile ${color(i)} ${t.done ? 'done' : ''}`} disabled={i !== next} aria-label={`${t.title}, ${t.done ? 'concluída' : i === next ? 'próxima tarefa' : 'aguardando etapa anterior'}`} onClick={() => setRunning(b.id)}>
                      <span className="tile-number">{t.done ? <CheckIcon /> : i + 1}</span>
                      <span className="tile-content"><strong>{t.title}</strong><small>{t.done ? 'Concluída' : `${i === next ? 'A SEGUIR' : 'DEPOIS'} · ${t.minutes} min`}</small></span>
                    </button>
                  </div>)}
                </div>
                {next >= 0 ? <Button onClick={() => setRunning(b.id)}>Começar etapa {next + 1}</Button> : <div className="finished"><CheckIcon /><strong>Bloco concluído!</strong><button onClick={() => { setBlocks(bs => bs.map(x => x.id === b.id ? { ...x, tasks: x.tasks.map(t => ({ ...t, done: false })) } : x)); }}>Recomeçar bloco</button></div>}
              </> : <button className="collapsed" aria-expanded={false} onClick={() => setExpanded(b.id)}><h2>{b.title}</h2><span>{done === b.tasks.length ? 'Concluído' : `${b.tasks.length} tarefas`}</span><ChevronRightIcon /></button>}
            </section>;
          })}
          {!blocks.length && <div className="empty"><h2>Tudo começa com uma peça.</h2><p>Escolha um momento do dia e conecte suas primeiras tarefas.</p></div>}
        </div>
        <Button outline onClick={() => edit()}><PlusIcon />Novo bloco</Button>
        <p className="closing-note">Não precisa fazer tudo. Só a próxima.</p>
      </main>
    </MobileScroll>
    <BottomSheet open={!!running} onOpenChange={v => { if (!v) setRunning(null); }} title={activeBlock?.title || 'Sua próxima etapa'}>
      {activeTask && <div className="sheet-body"><span className="eyebrow">ETAPA {(activeBlock?.tasks.findIndex(t => t.id === activeTask.id) || 0) + 1} · {activeTask.minutes} MIN</span><h2 className="focus-title">{activeTask.title}</h2><p>Uma coisa de cada vez. Quando terminar, avance para a próxima peça.</p><Button onClick={complete}><CheckIcon />Concluir etapa</Button><button className="text-button" onClick={() => setRunning(null)}>Continuar depois</button></div>}
    </BottomSheet>
    <BottomSheet open={!!menu} onOpenChange={v => { if (!v) setMenu(null); }} title={deleting ? 'Excluir este bloco?' : selected?.title || 'Opções do bloco'}>
      {selected && <div className="sheet-body">{deleting ? <><p>O bloco “{selected.title}” e suas tarefas serão removidos desta sessão.</p><Button onClick={() => { setBlocks(bs => bs.filter(b => b.id !== selected.id)); if (expanded === selected.id) setExpanded(blocks.find(b => b.id !== selected.id)?.id || ''); setMenu(null); notify('Bloco excluído'); }}>Excluir bloco</Button><button className="text-button" onClick={() => setDeleting(false)}>Cancelar</button></> : <>
        <button className="menu-action" onClick={() => { setMenu(null); edit(selected); }}><Pencil1Icon />Editar bloco</button>
        <button className="menu-action" onClick={() => { const copy = { ...selected, id: uid(), title: `${selected.title} (cópia)`, tasks: selected.tasks.map(t => ({ ...t, id: uid(), done: false })) }; setBlocks(bs => [...bs, copy]); setExpanded(copy.id); setMenu(null); notify('Bloco duplicado'); }}><CopyIcon />Duplicar bloco</button>
        <button className="menu-action" onClick={() => { setBlocks(bs => bs.map(b => b.id === selected.id ? { ...b, tasks: b.tasks.map(t => ({ ...t, done: false })) } : b)); setMenu(null); notify('Bloco pronto para recomeçar'); }}><ResetIcon />Reiniciar progresso</button>
        <button className="menu-action danger" onClick={() => setDeleting(true)}><TrashIcon />Excluir bloco</button>
      </>}</div>}
    </BottomSheet>
  </>;
}

function Editor({ block }: { block?: Block }) {
  const { setBlocks, setExpanded, notify } = useData();
  const flow = useFlow();
  const keyboard = useKeyboard();
  const [name, setName] = useState(block?.title || '');
  const [cue, setCue] = useState(block?.cue || '');
  const [tasks, setTasks] = useState<Task[]>(() => block ? block.tasks.map(t => ({ ...t })) : [task()]);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<string | null>(null);
  const [discard, setDiscard] = useState(false);
  const currentIndex = tasks.findIndex(t => t.id === options);
  const current = tasks[currentIndex];
  const dirty = name !== (block?.title || '') || cue !== (block?.cue || '') || JSON.stringify(tasks.map(t => [t.title, t.minutes, t.id])) !== JSON.stringify((block?.tasks || []).map(t => [t.title, t.minutes, t.id]));
  const change = (id: string, patch: Partial<Task>) => setTasks(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));
  const move = (delta: number) => setTasks(ts => { const a = [...ts]; [a[currentIndex], a[currentIndex + delta]] = [a[currentIndex + delta], a[currentIndex]]; return a; });
  const save = () => {
    keyboard.hide();
    if (!name.trim() || !cue.trim() || !tasks.length || tasks.some(t => !t.title.trim())) { setError('Preencha o nome, o gatilho e todas as tarefas.'); return; }
    const result: Block = { id: block?.id || uid(), title: name.trim(), cue: cue.trim(), tasks: tasks.map(t => ({ ...t, title: t.title.trim() })) };
    let pending = false;
    result.tasks = result.tasks.map(t => { pending ||= !t.done; return { ...t, done: !pending }; });
    setBlocks(bs => block ? bs.map(b => b.id === block.id ? result : b) : [...bs, result]);
    setExpanded(result.id); notify(block ? 'Alterações salvas' : 'Seu novo bloco está pronto'); flow.pop();
  };
  return <>
    <MobileScroll className="domino-scroll">
      <main className="editor-content">
        <button className="back-button icon-button" aria-label="Voltar" onClick={() => { keyboard.hide(); if (dirty && (name || cue || tasks.some(t => t.title))) setDiscard(true); else flow.pop(); }}><ArrowLeftIcon /></button>
        <h1>{block ? 'Ajuste sua sequência.' : 'Crie uma sequência.'}</h1>
        <p className="intro">Dê um nome ao bloco e conecte as tarefas.</p>
        <label className="field-label" htmlFor="block-name">NOME DO BLOCO</label>
        <EntryField id="block-name" className="form-input" value={name} maxLength={50} placeholder="Ex.: Começar o dia" onChange={e => { setName(e.target.value); setError(''); }} />
        <label className="field-label" htmlFor="block-cue">SE</label>
        <div className="cue-input"><EntryField id="block-cue" className="form-input" value={cue} maxLength={100} placeholder="Ex.: meu café estiver pronto" onChange={e => { setCue(e.target.value); setError(''); }} /><Pencil1Icon /></div>
        <div className="field-label sequence-label">ENTÃO, UMA DE CADA VEZ</div>
        <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="edit-chain">
          {tasks.map((t, i) => <EditableTask key={t.id} task={t} index={i} last={i === tasks.length - 1} change={change} onOptions={() => { keyboard.hide(); setOptions(t.id); }} />)}
        </Reorder.Group>
        <button className="add-task" onClick={() => { keyboard.hide(); setTasks(ts => [...ts, task()]); setError(''); }}><PlusIcon />Adicionar tarefa</button>
        <p className="reorder-hint">Arraste as peças para mudar a ordem.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button onClick={save}>Salvar bloco</Button>
      </main>
    </MobileScroll>
    <BottomSheet open={!!options} onOpenChange={v => { if (!v) setOptions(null); }} title={`Etapa ${currentIndex + 1}`}>
      {current && <div className="sheet-body"><h3>{current.title || 'Nova tarefa'}</h3><label className="duration-label">Duração estimada<select aria-label="Duração estimada" value={current.minutes} onChange={e => change(current.id, { minutes: +e.target.value })}>{[1, 2, 3, 5, 10, 15, 20, 25, 30, 45, 60].map(n => <option key={n} value={n}>{n} min</option>)}</select></label>
        <button className="menu-action" disabled={currentIndex === 0} onClick={() => move(-1)}><ArrowUpIcon />Mover para cima</button>
        <button className="menu-action" disabled={currentIndex === tasks.length - 1} onClick={() => move(1)}><ArrowDownIcon />Mover para baixo</button>
        <button className="menu-action danger" disabled={tasks.length === 1} onClick={() => { setTasks(ts => ts.filter(t => t.id !== current.id)); setOptions(null); }}><TrashIcon />Remover tarefa</button>
        <button className="text-button" onClick={() => setOptions(null)}>Pronto</button>
      </div>}
    </BottomSheet>
    <BottomSheet open={discard} onOpenChange={setDiscard} title="Descartar alterações?"><div className="sheet-body"><p>As alterações deste bloco ainda não foram salvas.</p><Button onClick={() => { setDiscard(false); flow.pop(); }}>Descartar e voltar</Button><button className="text-button" onClick={() => setDiscard(false)}>Continuar editando</button></div></BottomSheet>
  </>;
}

function EditableTask({ task: t, index, last, change, onOptions }: { task: Task; index: number; last: boolean; change: (id: string, patch: Partial<Task>) => void; onOptions: () => void }) {
  const controls = useDragControls();
  const keyboard = useKeyboard();
  return <Reorder.Item value={t} dragListener={false} dragControls={controls} className="edit-step" whileDrag={{ zIndex: 5, scale: 1.02 }}>
    <div className={`domino-tile editable ${color(index)}`}>
      <span className="tile-number">{index + 1}</span>
      <div className="tile-content"><EntryField aria-label={`Tarefa ${index + 1}`} placeholder="O que você vai fazer?" value={t.title} maxLength={70} onChange={e => change(t.id, { title: e.target.value })} /><button className="duration-button" aria-label={`Opções da tarefa ${index + 1}`} onClick={onOptions}>{t.minutes} min <Pencil1Icon /></button></div>
      <button className="drag-handle" aria-label={`Reordenar tarefa ${index + 1}`} data-scroll-drag="ignore" onPointerDown={e => { keyboard.hide(); controls.start(e); }} onClick={onOptions}><DragHandleDots2Icon /></button>
    </div>
    {!last && <div className="edit-connector"><ArrowDownIcon /></div>}
  </Reorder.Item>;
}
