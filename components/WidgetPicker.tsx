import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

const CORE_WIDGETS = [
  { id: 'search', label: 'search' },
  { id: 'datetime', label: 'datetime' },
  { id: 'stats', label: 'stats' },
  { id: 'weather', label: 'weather' },
  { id: 'todo', label: 'todo' },
  { id: 'links', label: 'links' },
];

const FUN_WIDGETS = [
  { id: 'snake', label: 'snake.exe' },
  { id: 'life', label: 'conway.life' },
  { id: 'matrix', label: 'matrix' },
  { id: 'pipes', label: 'pipes.scr' },
  { id: 'donut', label: 'donut.c' },
  { id: 'fireworks', label: 'fireworks.py' },
  { id: 'starfield', label: 'starfield.scr' },
  { id: 'rain', label: 'rain.sh' },
  { id: 'maze', label: 'maze.gen' },
];

export const WidgetPicker: React.FC = () => {
  const { activeWidgets, toggleWidget, addExtraWidget, isLayoutLocked, setIsLayoutLocked } = useAppContext();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const buttonVisible = hovered || open;

  return (
    <div
      className="absolute top-4 right-28 z-40 select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Trigger area — always present, reveals label on hover */}
      <div className="p-2 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div className={`text-[var(--color-muted)] transition-opacity duration-200 ${buttonVisible ? 'opacity-100' : 'opacity-0'}`}>
          ( widgets )
        </div>
      </div>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-[var(--color-bg)] border border-[var(--color-border)] shadow-2xl z-50 overflow-hidden">

          {/* Header + close */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border)] bg-[var(--color-hover)]">
            <span className="text-[var(--color-fg)] text-xs font-bold uppercase tracking-widest">widgets</span>
            <button
              onClick={() => setOpen(false)}
              className="text-[var(--color-muted)] hover:text-[var(--color-accent)] text-xs font-mono"
            >
              [x]
            </button>
          </div>

          {/* Lock / Unlock toggle */}
          <button
            onClick={() => setIsLayoutLocked(!isLayoutLocked)}
            className="w-full flex items-center justify-between px-3 py-2.5 border-b border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-colors"
          >
            <span className="text-sm font-mono text-[var(--color-muted)]">
              {isLayoutLocked ? 'layout locked' : 'layout unlocked'}
            </span>
            <span className={`text-xs font-mono font-bold ${isLayoutLocked ? 'text-[var(--color-muted)] opacity-50' : 'text-[var(--color-accent)]'}`}>
              {isLayoutLocked ? '[lock]' : '[unlk]'}
            </span>
          </button>

          <div className="overflow-y-auto" style={{ maxHeight: '65vh' }}>

            {/* Core widgets */}
            <div className="px-3 pt-3 pb-1">
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] opacity-60">core</span>
            </div>
            {CORE_WIDGETS.map(({ id, label }) => {
              const active = !!activeWidgets[id];
              return (
                <button
                  key={id}
                  onClick={() => toggleWidget(id)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-[var(--color-hover)] transition-colors cursor-pointer"
                >
                  <span className={`text-sm font-mono ${active ? 'text-[var(--color-fg)]' : 'text-[var(--color-muted)] opacity-50'}`}>
                    {label}
                  </span>
                  <span className={`text-xs font-mono font-bold ${active ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)] opacity-40'}`}>
                    {active ? '[on]' : '[off]'}
                  </span>
                </button>
              );
            })}

            {/* Visual / fun widgets */}
            <div className="px-3 pt-3 pb-1 border-t border-[var(--color-border)] mt-1">
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] opacity-60">visual</span>
            </div>
            {FUN_WIDGETS.map(({ id, label }) => {
              const instances = Object.keys(activeWidgets).filter(
                k => (k === id || k.startsWith(`${id}-`)) && activeWidgets[k]
              );
              const active = instances.length > 0;

              return (
                <div
                  key={id}
                  className="flex items-center justify-between px-3 py-2 hover:bg-[var(--color-hover)] transition-colors group"
                >
                  <button
                    onClick={() => toggleWidget(id)}
                    className="flex-1 flex items-center justify-between cursor-pointer"
                  >
                    <span className={`text-sm font-mono ${active ? 'text-[var(--color-fg)]' : 'text-[var(--color-muted)] opacity-50'}`}>
                      {label}
                    </span>
                    <span className={`text-xs font-mono font-bold ${active ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)] opacity-40'}`}>
                      {active ? `[${instances.length}]` : '[off]'}
                    </span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); addExtraWidget(id); }}
                    className="ml-3 text-[var(--color-muted)] hover:text-[var(--color-accent)] text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                    title={`Add another ${label}`}
                  >
                    [+]
                  </button>
                </div>
              );
            })}

          </div>
        </div>
      )}
    </div>
  );
};
