import React from 'react';
import { EXPERIENCE_ITEMS } from '../data/portfolioData';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export const ExperienceTimeline: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-hairline text-left">
        <div className="flex items-center gap-2 text-xs text-copper mb-1">
          <Briefcase className="w-4 h-4" />
          <span>Career track record</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-paper tracking-tight">
          Leadership & Engineering Experience
        </h2>
        <p className="text-sm text-paper/60 mt-1 max-w-2xl">
          Track record of delivering scalable web platforms, high-ranking consumer mobile apps, and
          mentoring high-performance software teams.
        </p>
      </div>

      {/* Timeline items */}
      <div className="mt-8 relative border-l-2 border-hairline ml-3 sm:ml-6 space-y-8 pl-6 sm:pl-8">
        {EXPERIENCE_ITEMS.map((item, index) => (
          <div key={index} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-panel border-2 border-copper group-hover:bg-copper transition-colors" />

            <div className="bg-panel border border-hairline rounded-lg p-5 sm:p-6 space-y-4 shadow-lg">
              {/* Top Row: Period & Role */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-paper">{item.role}</h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-paper/50 font-mono mt-0.5">
                    <span className="text-copper font-semibold">{item.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-paper/30" />
                      {item.location}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-graphite text-paper/70 border border-hairline">
                      {item.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-copper bg-copper/10 px-3 py-1.5 rounded-md border border-copper/30 self-start sm:self-auto">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.period}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-paper/70">{item.description}</p>

              {/* Achievements */}
              <div className="space-y-2 pt-2 border-t border-hairline">
                <div className="text-xs text-paper/50">Key achievements</div>
                <div className="grid grid-cols-1 gap-2">
                  {item.achievements.map((ach, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-2 text-xs text-paper/70">
                      <CheckCircle2 className="w-4 h-4 text-solder mt-0.5 shrink-0" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-graphite text-paper/50 border border-hairline"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
