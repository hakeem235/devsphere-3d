import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { soundManager } from '../utils/audio';
import { Smartphone, Globe, Server, CheckCircle2, Award, Zap } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const icons = [Smartphone, Globe, Server];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-hairline text-left">
        <div className="flex items-center gap-2 text-xs text-copper mb-1">
          <Zap className="w-4 h-4" />
          <span>Technical arsenal & proficiencies</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-paper tracking-tight">
          Specialized Web & Mobile Engineering Stack
        </h2>
        <p className="text-sm text-paper/60 mt-1 max-w-2xl">
          Deep expertise across native mobile runtime performance, high-throughput web frontends, and
          distributed cloud systems.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
        {SKILL_CATEGORIES.map((cat, idx) => {
          const Icon = icons[idx] || Smartphone;
          const isSelected = selectedCategory === idx;
          return (
            <button
              key={cat.title}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(idx);
              }}
              className={`flex items-center gap-3 p-4 rounded-md text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-graphite border-copper/60 text-paper shadow-md'
                  : 'bg-panel border-hairline text-paper/50 hover:text-paper/80 hover:bg-panel/70'
              }`}
            >
              <div
                className={`p-2.5 rounded-md ${
                  isSelected ? 'bg-copper/20 text-copper' : 'bg-panel text-paper/50'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold">{cat.title}</div>
                <div className="text-[11px] font-mono text-paper/50">
                  {cat.skills.length} core disciplines
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Category Skill Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SKILL_CATEGORIES[selectedCategory].skills.map((skill) => (
          <div
            key={skill.name}
            className="bg-panel border border-hairline rounded-md p-5 hover:border-copper/40 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-paper">{skill.name}</span>
                {skill.badge && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-copper/10 text-copper border border-copper/30">
                    {skill.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-copper font-semibold">{skill.level}%</span>
            </div>

            {/* Proficiency Bar */}
            <div className="w-full h-2 bg-graphite rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-copper rounded-full transition-all duration-500"
                style={{ width: `${skill.level}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-paper/50">
              <span className="font-mono">{skill.experience} production use</span>
              <span className="text-paper/70 text-right">{skill.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
