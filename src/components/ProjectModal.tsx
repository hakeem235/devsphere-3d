import React, { useState } from 'react';
import { Project } from '../types';
import { soundManager } from '../utils/audio';
import { generateProjectCaseStudyPDF } from '../utils/pdfGenerator';
import { InteractiveDeviceDemo } from './InteractiveDeviceDemo';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle,
  Cpu,
  Layers,
  Sparkles,
  Clock,
  Star,
  User,
  FileDown,
  Check,
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'generating' | 'done'>('idle');

  if (!project) return null;

  const handleDownloadPDF = () => {
    soundManager.playSwitch(true);
    setDownloadStatus('generating');
    setTimeout(() => {
      try {
        generateProjectCaseStudyPDF(project);
        setDownloadStatus('done');
        setTimeout(() => setDownloadStatus('idle'), 2500);
      } catch (err) {
        console.error('Failed to generate PDF:', err);
        setDownloadStatus('idle');
      }
    }, 120);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 overflow-y-auto">
      {/* Modal Card - Solid dark background to prevent WebGL slowdown */}
      <div className="relative w-full max-w-4xl bg-panel border border-hairline rounded-lg shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-hairline bg-graphite gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-3.5 h-3.5 rounded-full shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-lg sm:text-xl font-bold text-paper tracking-tight truncate">
                  {project.title}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-copper/10 text-copper border border-copper/30">
                  {project.platform}
                </span>
              </div>
              <p className="text-xs text-paper/50 font-mono mt-0.5 truncate">{project.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Download Case Study Button in Header */}
            <button
              onClick={handleDownloadPDF}
              disabled={downloadStatus === 'generating'}
              title="Generate printable PDF case study"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-copper/15 hover:bg-copper/25 border border-copper/40 text-copper text-xs font-mono font-medium transition-all shadow-sm cursor-pointer"
            >
              {downloadStatus === 'generating' ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-copper border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : downloadStatus === 'done' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-solder" />
                  <span className="text-solder font-semibold">Downloaded!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-copper" />
                  <span className="hidden sm:inline">Download Case Study (PDF)</span>
                  <span className="sm:hidden">PDF</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 rounded-md bg-graphite border border-hairline text-paper/50 hover:text-paper hover:bg-panel transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Stats Metadata Bar */}
          {project.quickStats && (
            <div className="tick-panel flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4 sm:py-2.5 rounded-md bg-graphite border border-hairline text-xs font-mono text-paper/70 shadow-sm">
              <div className="flex items-center gap-1.5" title="Engineering Duration">
                <Clock className="w-3.5 h-3.5 text-copper shrink-0" />
                <span className="text-paper/50">Timeline:</span>
                <span className="text-paper font-semibold">{project.quickStats.duration}</span>
              </div>

              <div className="flex items-center gap-1.5" title="Stack Depth">
                <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="text-paper/50">Tech depth:</span>
                <span className="text-paper font-semibold">{project.quickStats.techCount} technologies</span>
              </div>

              <div className="flex items-center gap-1.5" title="Community Adoption">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
                <span className="text-paper/50">GitHub:</span>
                <span className="text-amber-300 font-semibold">{project.quickStats.githubStars}</span>
              </div>

              {project.quickStats.teamRole && (
                <div className="flex items-center gap-1.5" title="Role in Project">
                  <User className="w-3.5 h-3.5 text-solder shrink-0" />
                  <span className="text-paper/50">Role:</span>
                  <span className="text-solder font-semibold">{project.quickStats.teamRole}</span>
                </div>
              )}
            </div>
          )}

          {/* Top Key Metrics Row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {project.metrics.map((metric, i) => (
              <div
                key={i}
                className="bg-graphite border border-hairline rounded-md p-3 text-center"
              >
                <div className="text-xs text-paper/50 font-mono">{metric.label}</div>
                <div className="text-base sm:text-xl font-bold font-mono text-copper mt-1">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Demo Sandbox / Live Emulator */}
          {project.interactiveType && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-paper/70">
                <Sparkles className="w-4 h-4 text-copper" />
                <span>Live interactive sandbox — try the features below</span>
              </div>
              <InteractiveDeviceDemo project={project} />
            </div>
          )}

          {/* Deep Architectural Narrative */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-paper/80 flex items-center gap-2">
              <Layers className="w-4 h-4 text-copper" />
              <span>Project overview & engineering rationale</span>
            </h4>
            <p className="text-sm leading-relaxed text-paper/70">
              {project.longDescription}
            </p>
          </div>

          {/* Engineering Highlights */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-paper/80 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-solder" />
              <span>Key technical highlights & impact</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-md bg-graphite border border-hairline text-xs text-paper/70"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-copper mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Architecture */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-paper/80 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>System & software architecture</span>
            </h4>
            <div className="bg-graphite border border-hairline rounded-md p-3.5 space-y-2">
              {project.architecture.map((arch, index) => (
                <div key={index} className="flex items-start gap-2 text-xs font-mono text-paper/70">
                  <span className="text-copper font-bold">›</span>
                  <span>{arch}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className="space-y-2">
            <span className="text-xs text-paper/50">Technologies & tooling</span>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-graphite text-paper/70 border border-hairline"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-hairline bg-graphite flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-paper/50 font-mono self-start sm:self-auto">
            Category: <span className="text-copper font-semibold">{project.category}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Primary Download Button in Footer */}
            <button
              onClick={handleDownloadPDF}
              disabled={downloadStatus === 'generating'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-copper/15 hover:bg-copper/25 border border-copper/40 text-copper transition-colors cursor-pointer shadow-sm"
            >
              {downloadStatus === 'generating' ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-copper border-t-transparent rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : downloadStatus === 'done' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-solder" />
                  <span className="text-solder font-semibold">PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-copper" />
                  <span>Download Case Study</span>
                </>
              )}
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => soundManager.playClick()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-copper hover:bg-copper-dim text-graphite transition-colors shadow-md"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-md text-xs font-medium bg-graphite hover:bg-panel/80 text-paper/70 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
