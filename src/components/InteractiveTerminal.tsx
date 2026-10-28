import React, { useState, useRef, useEffect } from 'react';
import { TERMINAL_COMMANDS } from '../data/portfolioData';
import { soundManager } from '../utils/audio';
import { Terminal, CornerDownLeft, Trash2 } from 'lucide-react';

export const InteractiveTerminal: React.FC = () => {
  const [history, setHistory] = useState<Array<{ command: string; output: string }>>([
    {
      command: 'whoami',
      output: TERMINAL_COMMANDS.whoami,
    },
    {
      command: 'help',
      output: TERMINAL_COMMANDS.help,
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    soundManager.playSwitch(true);

    if (cmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    let response = '';
    if (cmd === 'benchmark') {
      const gl = document.createElement('canvas').getContext('webgl2');
      const maxTex = gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 4096;
      response = `[Diagnostic Benchmark]
Renderer       : Three.js PBR Engine (WebGL2)
Max Texture    : ${maxTex}x${maxTex}px
Device Memory  : High-throughput GPU Pipeline
Frame Target   : 60 FPS Locked
Status         : All subsystems operational (Green)`;
    } else if (TERMINAL_COMMANDS[cmd]) {
      response = TERMINAL_COMMANDS[cmd];
    } else {
      response = `Command not recognized: '${cmd}'. Type 'help' for a list of available commands.`;
    }

    setHistory((prev) => [...prev, { command: inputVal, output: response }]);
    setInputVal('');
  };

  const handleKeyDown = () => {
    soundManager.playKeyTap();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Container */}
      <div className="bg-panel border border-hairline rounded-lg shadow-xl overflow-hidden font-mono">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-graphite border-b border-hairline">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-solder/80" />
            </div>
            <span className="text-xs text-paper/50 ml-2">dev-rig@ahmedhakeem:~ (zsh)</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setHistory([]);
            }}
            title="Clear terminal"
            className="flex items-center gap-1 text-[11px] text-paper/50 hover:text-paper px-2 py-1 rounded bg-graphite border border-hairline transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-6 text-xs sm:text-sm text-paper/80 min-h-[360px] max-h-[500px] overflow-y-auto space-y-4">
          <div className="text-paper/50 text-xs pb-2 border-b border-hairline">
            DevDimension Interactive Terminal v2.4 — Type <span className="text-copper">help</span> to view available system commands.
          </div>

          {history.map((item, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center gap-2 text-copper">
                <span className="text-paper/40">ahmed@devrig:~$</span>
                <span className="font-semibold text-paper">{item.command}</span>
              </div>
              <pre className="text-paper/70 whitespace-pre-wrap leading-relaxed pl-4 border-l border-copper/30 text-xs">
                {item.output}
              </pre>
            </div>
          ))}

          {/* Active Input Line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
            <span className="text-paper/40 shrink-0">ahmed@devrig:~$</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type 'projects', 'skills', 'contact'..."
              className="w-full bg-transparent text-copper focus:outline-none font-mono text-xs sm:text-sm"
              autoFocus
            />
            <button
              type="submit"
              className="p-1 rounded text-paper/50 hover:text-copper transition-colors"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};
