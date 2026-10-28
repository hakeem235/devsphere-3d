import React, { useState } from 'react';
import { CameraPreset, LightingPreset } from '../types';
import { soundManager } from '../utils/audio';
import {
  Layers,
  Sun,
  Camera,
  Maximize2,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Eye,
  Sliders,
} from 'lucide-react';

interface BottomDockProps {
  cameraPreset: CameraPreset;
  onSelectCamera: (preset: CameraPreset) => void;
  explodedProgress: number;
  onExplodedChange: (val: number) => void;
  lightingPreset: LightingPreset;
  onSelectLighting: (preset: LightingPreset) => void;
  wireframe: boolean;
  onToggleWireframe: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onOpenProjects: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  cameraPreset,
  onSelectCamera,
  explodedProgress,
  onExplodedChange,
  lightingPreset,
  onSelectLighting,
  wireframe,
  onToggleWireframe,
  autoRotate,
  onToggleAutoRotate,
  onOpenProjects,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'exploded' | 'lighting'>('camera');

  const toggleCollapse = () => {
    soundManager.playSwitch(!isCollapsed);
    setIsCollapsed(!isCollapsed);
  };

  const handleCameraChange = (preset: CameraPreset) => {
    soundManager.playCameraWhoosh();
    onSelectCamera(preset);
  };

  const handleTabChange = (tab: 'camera' | 'exploded' | 'lighting') => {
    soundManager.playClick();
    setActiveTab(tab);
  };

  return (
    <div
      className="fixed z-30 transition-transform duration-300 ease-out"
      style={{
        bottom: '16px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isCollapsed ? 'calc(100% - 28px)' : '0'})`,
        maxWidth: 'min(940px, 94vw)',
        width: '100%',
      }}
    >
      {/* Top Collapse / Expand Handle */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={toggleCollapse}
          className="flex items-center gap-1.5 px-4 py-1 text-xs font-mono font-medium rounded-t-md bg-panel border-t border-x border-hairline text-paper/70 hover:text-copper hover:bg-panel/80 transition-colors shadow-lg cursor-pointer"
          title="Toggle Dock (H)"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-copper" />
              <span>Expand 3D Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-paper/50" />
              <span>Collapse HUD</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container (Using solid/rgba surfaces instead of backdrop-filter over WebGL) */}
      <div className="rounded-md border border-hairline bg-panel text-paper/90 shadow-2xl p-2.5 sm:p-3">
        {/* Navigation Tabs inside Dock */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-hairline">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => handleTabChange('camera')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'camera'
                  ? 'bg-copper/15 text-copper border border-copper/30'
                  : 'text-paper/50 hover:text-paper/80 hover:bg-graphite'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Views</span>
            </button>

            <button
              onClick={() => handleTabChange('exploded')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'exploded'
                  ? 'bg-copper/15 text-copper border border-copper/30'
                  : 'text-paper/50 hover:text-paper/80 hover:bg-graphite'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Exploded Stack</span>
              {explodedProgress > 0 && (
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-copper/20 text-copper">
                  {Math.round(explodedProgress * 100)}%
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabChange('lighting')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'lighting'
                  ? 'bg-copper/15 text-copper border border-copper/30'
                  : 'text-paper/50 hover:text-paper/80 hover:bg-graphite'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Studio Lighting</span>
            </button>
          </div>

          {/* Quick Utility Toggles (Rotate & Wireframe) */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleAutoRotate();
              }}
              title="Toggle Auto-Rotation"
              className={`p-1.5 rounded-md text-xs transition-colors ${
                autoRotate
                  ? 'bg-copper/15 text-copper border border-copper/40'
                  : 'text-paper/50 hover:text-paper/80 hover:bg-graphite border border-transparent'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onToggleWireframe();
              }}
              title="Toggle Technical Wireframe"
              className={`p-1.5 rounded-md text-xs transition-colors ${
                wireframe
                  ? 'bg-solder/20 text-solder border border-solder/40'
                  : 'text-paper/50 hover:text-paper/80 hover:bg-graphite border border-transparent'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenProjects();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-copper hover:bg-copper-dim text-graphite shadow-sm transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Explore Projects</span>
              <span className="sm:hidden">Portfolio</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'camera' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: 'OVERVIEW', label: 'Studio Overview', icon: '🖥' },
              { id: 'MOBILE_LAB', label: 'Mobile Device Lab', icon: '📱' },
              { id: 'CODE_STATION', label: 'Web Code Station', icon: '💻' },
              { id: 'TECH_CORE', label: 'Holo Tech Core', icon: '☁️' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handleCameraChange(p.id as CameraPreset)}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-mono transition-all text-left ${
                  cameraPreset === p.id
                    ? 'bg-copper/15 border border-copper/60 text-copper shadow-sm'
                    : 'bg-graphite border border-hairline text-paper/60 hover:border-hairline hover:bg-panel/60'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{p.icon}</span>
                  <span className="font-sans font-medium">{p.label}</span>
                </span>
                {cameraPreset === p.id && (
                  <span className="text-[10px] font-bold text-solder">Active</span>
                )}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'exploded' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1">
            <div className="flex items-center gap-2 text-xs text-paper/70 w-full sm:w-auto">
              <Sliders className="w-4 h-4 text-copper shrink-0" />
              <span>Exploded view architecture separation:</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-80">
              <span className="text-[11px] font-mono text-paper/50">Assembled</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedProgress}
                onChange={(e) => onExplodedChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-hairline rounded-lg appearance-none cursor-pointer accent-copper"
              />
              <span className="text-[11px] font-mono text-copper w-10 text-right">
                {Math.round(explodedProgress * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onExplodedChange(0)}
                className="px-2.5 py-1 text-[11px] rounded bg-graphite text-paper/70 hover:text-paper border border-hairline"
              >
                Reset
              </button>
              <button
                onClick={() => onExplodedChange(1)}
                className="px-2.5 py-1 text-[11px] rounded bg-copper/15 text-copper hover:bg-copper/25 border border-copper/40"
              >
                Full (100%)
              </button>
            </div>
          </div>
        )}

        {activeTab === 'lighting' && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'CYBER_NEON', name: 'Cyber Neon', color: '#06b6d4', desc: 'Vibrant tech accents' },
              { id: 'STUDIO_CLEAN', name: 'Studio PBR', color: '#f8fafc', desc: 'Neutral daylight rig' },
              { id: 'DEEP_OBSIDIAN', name: 'Deep Obsidian', color: '#6366f1', desc: 'High-contrast dark' },
            ].map((light) => (
              <button
                key={light.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectLighting(light.id as LightingPreset);
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-all ${
                  lightingPreset === light.id
                    ? 'bg-graphite border border-copper/60 text-paper'
                    : 'bg-graphite border border-hairline text-paper/60 hover:bg-panel/60'
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow-sm"
                  style={{ backgroundColor: light.color }}
                />
                <div>
                  <div className="text-xs font-medium leading-tight">{light.name}</div>
                  <div className="text-[10px] text-paper/50 font-mono">{light.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
