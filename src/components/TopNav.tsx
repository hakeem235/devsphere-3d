import React from 'react';
import { DEVELOPER_PROFILE } from '../data/portfolioData';
import { soundManager } from '../utils/audio';
import {
  Code2,
  FolderGit2,
  Terminal,
  Cpu,
  Mail,
  Volume2,
  VolumeX,
  Compass,
  Briefcase,
} from 'lucide-react';

interface TopNavProps {
  activeView: 'studio' | 'projects' | 'skills' | 'experience' | 'terminal';
  onSelectView: (view: 'studio' | 'projects' | 'skills' | 'experience' | 'terminal') => void;
  onOpenContact: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  onSelectView,
  onOpenContact,
  isMuted,
  onToggleMute,
}) => {
  const handleNavClick = (view: 'studio' | 'projects' | 'skills' | 'experience' | 'terminal') => {
    soundManager.playClick();
    onSelectView(view);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-3 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Developer Spec Badge */}
        <div className="pointer-events-auto flex items-center gap-3 bg-panel border border-hairline rounded-lg px-3.5 py-2 text-paper/90 shadow-xl">
          <div className="w-8 h-8 rounded-md bg-copper flex items-center justify-center text-paper font-bold text-sm shadow-md">
            AH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-paper tracking-wide">
                {DEVELOPER_PROFILE.name}
              </span>
              {/* Clean static indicator - NO pulsating dots as required by guidelines */}
              <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-paper/60">
                <span className="w-1.5 h-1.5 rounded-full bg-solder"></span>
                <span>Available</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-paper/50 font-mono">
              Web & Mobile Software Architect
            </p>
          </div>
        </div>

        {/* Central Nav Links */}
        <nav className="pointer-events-auto hidden lg:flex items-center gap-1 bg-panel border border-hairline rounded-lg p-1.5 shadow-xl">
          <button
            onClick={() => handleNavClick('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeView === 'studio'
                ? 'bg-copper/15 text-copper border border-copper/40'
                : 'text-paper/50 hover:text-paper/80 hover:bg-graphite'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-copper" />
            <span>3D Workspace</span>
          </button>

          <button
            onClick={() => handleNavClick('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeView === 'projects'
                ? 'bg-copper/15 text-copper border border-copper/40'
                : 'text-paper/50 hover:text-paper/80 hover:bg-graphite'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-copper" />
            <span>Projects & Demos</span>
          </button>

          <button
            onClick={() => handleNavClick('skills')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeView === 'skills'
                ? 'bg-copper/15 text-copper border border-copper/40'
                : 'text-paper/50 hover:text-paper/80 hover:bg-graphite'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-copper" />
            <span>Tech Stack</span>
          </button>

          <button
            onClick={() => handleNavClick('experience')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeView === 'experience'
                ? 'bg-copper/15 text-copper border border-copper/40'
                : 'text-paper/50 hover:text-paper/80 hover:bg-graphite'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-copper" />
            <span>Experience</span>
          </button>

          <button
            onClick={() => handleNavClick('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              activeView === 'terminal'
                ? 'bg-copper/15 text-copper border border-copper/40'
                : 'text-paper/50 hover:text-paper/80 hover:bg-graphite'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-copper" />
            <span>CLI</span>
          </button>
        </nav>

        {/* Right Actions: Audio Mute, Contact Button, Mobile Menu */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Audio Synthesizer Mute Toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            title={isMuted ? 'Unmute Web Audio FX' : 'Mute Web Audio FX'}
            className="p-2 rounded-lg bg-panel border border-hairline text-paper/70 hover:text-copper hover:bg-graphite transition-colors shadow-xl"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-paper/40" />
            ) : (
              <Volume2 className="w-4 h-4 text-copper" />
            )}
          </button>

          {/* Quick Action Hire / Contact */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenContact();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-copper hover:bg-copper-dim text-graphite shadow-xl transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Get In Touch</span>
            <span className="sm:hidden">Contact</span>
          </button>

          {/* Mobile Quick Drawer Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectView(activeView === 'studio' ? 'projects' : 'studio');
            }}
            className="lg:hidden flex items-center gap-1 px-2.5 py-2 rounded-lg bg-panel border border-hairline text-xs font-medium text-paper/70 hover:text-paper"
          >
            {activeView === 'studio' ? 'Portfolio' : '3D View'}
          </button>
        </div>
      </div>
    </header>
  );
};
