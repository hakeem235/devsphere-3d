import React, { useState, useEffect } from 'react';
import { CameraPreset, LightingPreset, Project } from './types';
import { ThreeCanvas } from './components/ThreeCanvas';
import { BottomDock } from './components/BottomDock';
import { TopNav } from './components/TopNav';
import { PortfolioSection } from './components/PortfolioSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { ProjectModal } from './components/ProjectModal';
import { ContactModal } from './components/ContactModal';
import { soundManager } from './utils/audio';
import { DEVELOPER_PROFILE, PROJECTS } from './data/portfolioData';
import {
  Sparkles,
  Smartphone,
  Globe,
  Layers,
  X,
  Compass,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  // 3D Scene State
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('OVERVIEW');
  const [explodedProgress, setExplodedProgress] = useState<number>(0);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('CYBER_NEON');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Active View / Drawer
  const [activeView, setActiveView] = useState<
    'studio' | 'projects' | 'skills' | 'experience' | 'terminal'
  >('studio');

  // Modals
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.isMuted());

  // Interactive 3D Hotspot selection
  const handleSelectHotspot = (hotspotId: string) => {
    if (hotspotId === 'mobile-lab') {
      const mobileProj = PROJECTS.find((p) => p.id === 'aeropay-mobile') || PROJECTS[0];
      setSelectedProject(mobileProj);
    } else if (hotspotId === 'web-workstation') {
      const webProj = PROJECTS.find((p) => p.id === 'nebula-studio-web') || PROJECTS[1];
      setSelectedProject(webProj);
    } else if (hotspotId === 'tech-core') {
      setActiveView('skills');
    }
  };

  const handleToggleMute = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleFocusCameraFromPortfolio = (preset: CameraPreset) => {
    setCameraPreset(preset);
    setActiveView('studio');
  };

  // Keyboard shortcut: 'H' for dock toggle, 'Escape' to close drawers/modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProject) setSelectedProject(null);
        else if (isContactOpen) setIsContactOpen(false);
        else if (activeView !== 'studio') setActiveView('studio');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, isContactOpen, activeView]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-graphite text-paper font-sans">
      {/* 1. Full-Bleed Three.js 3D WebGL Canvas (100vw x 100vh) */}
      <div className="absolute inset-0 z-0">
        <ThreeCanvas
          cameraPreset={cameraPreset}
          explodedProgress={explodedProgress}
          lightingPreset={lightingPreset}
          wireframe={wireframe}
          autoRotate={autoRotate}
          onSelectHotspot={handleSelectHotspot}
          onPresetChange={(preset) => setCameraPreset(preset)}
        />
      </div>

      {/* 2. Top Navigation Bar */}
      <TopNav
        activeView={activeView}
        onSelectView={(v) => setActiveView(v)}
        onOpenContact={() => setIsContactOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* 3. Hero Spec Panel when in 3D Studio Mode (left-anchored, leaves the rig unobstructed) */}
      {activeView === 'studio' && (
        <div className="pointer-events-none absolute inset-x-0 bottom-28 sm:bottom-32 z-10 flex flex-col items-start px-4 sm:px-10">
          <div className="pointer-events-auto max-w-sm space-y-3">
            <p className="text-xs text-paper/50 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-copper" />
              <span>Interactive engineering rig — click a device or explore below</span>
            </p>

            <h1 className="font-display text-2xl sm:text-4xl font-bold text-paper tracking-tight">
              {DEVELOPER_PROFILE.name}
            </h1>
            <p className="text-xs sm:text-sm text-paper/60 leading-relaxed">
              {DEVELOPER_PROFILE.specialty}
            </p>

            {/* Hero stat readout */}
            <div className="tick-panel bg-panel/90 border border-hairline rounded-md px-3.5 py-2.5 shadow-lg inline-flex flex-col gap-1.5">
              {DEVELOPER_PROFILE.stats.map((s, idx) => (
                <div key={idx} className="flex items-baseline justify-between gap-6 text-xs">
                  <span className="text-paper/50">{s.label}</span>
                  <span className="font-mono font-semibold text-copper">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Collapsible Bottom Dock (Only when in 3D Studio mode) */}
      {activeView === 'studio' && (
        <BottomDock
          cameraPreset={cameraPreset}
          onSelectCamera={(p) => setCameraPreset(p)}
          explodedProgress={explodedProgress}
          onExplodedChange={(val) => setExplodedProgress(val)}
          lightingPreset={lightingPreset}
          onSelectLighting={(l) => setLightingPreset(l)}
          wireframe={wireframe}
          onToggleWireframe={() => setWireframe(!wireframe)}
          autoRotate={autoRotate}
          onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
          onOpenProjects={() => setActiveView('projects')}
        />
      )}

      {/* 5. Non-Obstructive Full Content Overlay Panel (When Projects, Skills, Timeline, or CLI is active) */}
      {activeView !== 'studio' && (
        <div className="absolute inset-0 z-30 pt-16 pb-8 bg-graphite/95 overflow-y-auto">
          {/* Close Panel Button */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveView('studio');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-panel border border-hairline text-xs font-medium text-copper hover:text-paper hover:bg-graphite transition-colors cursor-pointer shadow-lg"
            >
              <Compass className="w-4 h-4" />
              <span>Return to 3D Workspace</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveView('studio');
              }}
              className="p-2 rounded-lg bg-panel border border-hairline text-paper/50 hover:text-paper transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Render Active View */}
          {activeView === 'projects' && (
            <PortfolioSection
              onSelectProject={(p) => setSelectedProject(p)}
              onFocus3DCamera={handleFocusCameraFromPortfolio}
            />
          )}

          {activeView === 'skills' && <SkillsSection />}

          {activeView === 'experience' && <ExperienceTimeline />}

          {activeView === 'terminal' && <InteractiveTerminal />}
        </div>
      )}

      {/* 6. Case Study Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* 7. Contact / Hire Me Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
