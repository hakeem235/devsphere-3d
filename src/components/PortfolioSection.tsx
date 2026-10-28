import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PROJECTS } from '../data/portfolioData';
import { Project, ProjectCategory, CameraPreset } from '../types';
import { soundManager } from '../utils/audio';
import {
  Smartphone,
  Globe,
  Palette,
  Server,
  Layers,
  Search,
  X,
  Sparkles,
  Camera,
  ArrowRight,
  Filter,
  Check,
  Clock,
  Star,
  Cpu,
  Code2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface PortfolioSectionProps {
  onSelectProject: (p: Project) => void;
  onFocus3DCamera: (preset: CameraPreset) => void;
  onClose?: () => void;
}

interface FilterTabConfig {
  id: ProjectCategory;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const FILTER_TABS: FilterTabConfig[] = [
  {
    id: 'all',
    label: 'All Projects',
    shortLabel: 'All',
    icon: Layers,
    description: 'Complete cross-platform engineering catalogue',
    color: '#38bdf8',
  },
  {
    id: 'web',
    label: 'Web & 3D',
    shortLabel: 'Web',
    icon: Globe,
    description: 'React 19, Three.js WebGL & high-speed web apps',
    color: '#8b5cf6',
  },
  {
    id: 'mobile',
    label: 'Mobile (iOS & Android)',
    shortLabel: 'Mobile',
    icon: Smartphone,
    description: 'React Native (New Arch), Swift & Kotlin apps',
    color: '#06b6d4',
  },
  {
    id: 'uiux',
    label: 'UI/UX & Design Systems',
    shortLabel: 'UI/UX',
    icon: Palette,
    description: 'Design tokens, 60fps gesture physics & micro-interactions',
    color: '#f43f5e',
  },
  {
    id: 'fullstack',
    label: 'Full-Stack & Cloud',
    shortLabel: 'Full-Stack',
    icon: Server,
    description: 'Distributed microservices, WebSockets & telemetry',
    color: '#f59e0b',
  },
];

// Popular tech stack keywords for 1-click search filtering
const TECH_SEARCH_KEYWORDS = [
  'React Native',
  'Three.js',
  'Swift',
  'TypeScript',
  'Kotlin',
  'WebGL',
  'Design Tokens',
  'Tailwind',
  'WebSockets',
  'Bluetooth LE',
  'Next.js',
];

/**
 * 3D Tilt & Elevation Card with dynamic specular glare, multi-layer depth,
 * and search keyword highlighting.
 */
interface TiltProjectCardProps {
  project: Project;
  searchQuery: string;
  onCardClick: (project: Project) => void;
  onTagClick: (tag: string) => void;
  onFocusDevice: (e: React.MouseEvent, project: Project) => void;
}

const TiltProjectCard: React.FC<TiltProjectCardProps> = ({
  project,
  searchQuery,
  onCardClick,
  onTagClick,
  onFocusDevice,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>(
    'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  );
  const [glareStyle, setGlareStyle] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const cleanQuery = searchQuery.trim().toLowerCase();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / (rect.height || 1); // 0 to 1

    // Rotation angles: subtle, elegant tilt (max ~9 degrees)
    const rotateY = ((x - 0.5) * 16).toFixed(2);
    const rotateX = ((0.5 - y) * 16).toFixed(2);

    setTransformStyle(
      `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.028, 1.028, 1.028) translateZ(10px)`
    );

    setGlareStyle({
      x: x * 100,
      y: y * 100,
      opacity: 0.85,
    });
  };

  const handleMouseEnter = () => {
    soundManager.playHover();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)');
    setGlareStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  // Check if title or tags match current search query for visual cues
  const isTitleMatch = cleanQuery && (
    project.title.toLowerCase().includes(cleanQuery) ||
    project.subtitle.toLowerCase().includes(cleanQuery)
  );

  return (
    <div
      ref={cardRef}
      onClick={() => onCardClick(project)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.15s ease-out'
          : 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.45s ease',
      }}
      className={`group relative flex flex-col justify-between bg-panel border rounded-lg p-5 cursor-pointer will-change-transform select-none overflow-hidden ${
        isHovered
          ? 'border-copper/70 shadow-xl'
          : isTitleMatch
          ? 'border-copper/50 shadow-md'
          : 'border-hairline shadow-lg'
      }`}
    >
      {/* Dynamic Specular Glare Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-lg transition-opacity duration-300"
        style={{
          opacity: glareStyle.opacity,
          background: `radial-gradient(circle 280px at ${glareStyle.x}% ${glareStyle.y}%, rgba(193, 122, 69, 0.16), transparent 75%)`,
        }}
      />

      {/* Top Bar with Platform & Interactive Badge (Elevated in 3D) */}
      <div style={{ transform: 'translateZ(26px)', transformStyle: 'preserve-3d' }}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-graphite text-copper border border-hairline">
            {project.category === 'mobile' ? (
              <Smartphone className="w-3 h-3 text-copper" />
            ) : project.category === 'uiux' ? (
              <Palette className="w-3 h-3 text-rose-400" />
            ) : project.category === 'web' ? (
              <Globe className="w-3 h-3 text-purple-400" />
            ) : (
              <Server className="w-3 h-3 text-amber-400" />
            )}
            <span>{project.platform}</span>
          </span>

          {project.interactiveType && (
            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-solder/15 text-solder border border-solder/30">
              <Sparkles className="w-3 h-3" />
              <span>Interactive Demo</span>
            </span>
          )}
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-lg font-bold text-paper group-hover:text-copper transition-colors flex items-center justify-between">
          <span>{project.title}</span>
          {isTitleMatch && (
            <span className="text-[10px] font-mono font-normal text-copper bg-copper/10 px-2 py-0.5 rounded border border-copper/30">
              Title Match
            </span>
          )}
        </h3>
        <p className="text-xs text-paper/50 font-mono mt-0.5 mb-3">{project.subtitle}</p>

        <p className="text-xs leading-relaxed text-paper/70 line-clamp-3 mb-3.5">
          {project.description}
        </p>

        {/* Quick Stats Bar (Completion Time, Tech Stack Count, GitHub Stars) */}
        {project.quickStats && (
          <div
            style={{ transform: 'translateZ(20px)' }}
            className="flex items-center justify-between gap-1.5 px-3 py-2 rounded-md bg-graphite/90 border border-hairline text-[11px] font-mono text-paper/70 mb-3.5 shadow-sm"
          >
            {/* Completion Time / Duration */}
            <div
              className="flex items-center gap-1.5 text-paper/70"
              title={`Engineering Completion Time: ${project.quickStats.duration}`}
            >
              <Clock className="w-3.5 h-3.5 text-copper shrink-0" />
              <span>{project.quickStats.duration}</span>
            </div>

            <span className="text-paper/20">|</span>

            {/* Tech Stack Count */}
            <div
              className="flex items-center gap-1.5 text-paper/70"
              title={`Tech Stack Depth: ${project.quickStats.techCount} Technologies`}
            >
              <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>{project.quickStats.techCount} Techs</span>
            </div>

            <span className="text-paper/20">|</span>

            {/* GitHub Stars / Community */}
            <div
              className="flex items-center gap-1.5 text-paper/70"
              title={`GitHub Community Stars: ${project.quickStats.githubStars}`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
              <span className="text-amber-300 font-semibold">{project.quickStats.githubStars}</span>
            </div>
          </div>
        )}

        {/* Metrics Highlights (Popped Forward in 3D Space) */}
        <div
          style={{ transform: 'translateZ(18px)' }}
          className="grid grid-cols-3 gap-1.5 bg-graphite p-2.5 rounded-md border border-hairline mb-4"
        >
          {project.metrics.map((m, idx) => (
            <div key={idx} className="text-center">
              <div className="text-[10px] text-paper/50 font-mono truncate">{m.label}</div>
              <div className="text-xs font-bold font-mono text-copper">{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags & Action Link (Elevated in 3D) */}
      <div style={{ transform: 'translateZ(22px)', transformStyle: 'preserve-3d' }}>
        <div className="flex flex-wrap gap-1 mb-4">
          {project.tags.slice(0, 5).map((tag) => {
            const isTagMatch = cleanQuery && tag.toLowerCase().includes(cleanQuery);
            return (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  isTagMatch
                    ? 'bg-copper/20 text-copper border border-copper font-semibold'
                    : 'bg-graphite text-paper/50 border border-hairline hover:border-copper/50 hover:text-copper'
                }`}
              >
                {tag}
              </button>
            );
          })}
          {project.tags.length > 5 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-paper/40">
              +{project.tags.length - 5}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-hairline">
          <button
            type="button"
            onClick={(e) => onFocusDevice(e, project)}
            title="Focus 3D Scene on this Device"
            className="flex items-center gap-1.5 text-xs text-paper/50 hover:text-copper transition-colors py-1 px-2 rounded-md hover:bg-graphite cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Inspect in 3D</span>
          </button>

          <span className="flex items-center gap-1 text-xs font-medium text-copper group-hover:translate-x-1 transition-transform">
            <span>Case Study</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onSelectProject,
  onFocus3DCamera,
  onClose,
}) => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sectionRootRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const PROJECTS_PER_PAGE = 6;

  // Reset to page 1 whenever active filter category, search query, or tag changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery, selectedTag]);

  // Automatically scroll container to top whenever filter category, search query, tag, or page changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const scrollContainer = sectionRootRef.current?.closest('.overflow-y-auto') as HTMLElement | null;
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      sectionRootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeFilter, searchQuery, selectedTag, currentPage]);

  // Global hotkey: press '/' to focus the search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute counts for each filter tab dynamically
  const tabCounts = useMemo(() => {
    const counts: Record<ProjectCategory, number> = {
      all: PROJECTS.length,
      web: 0,
      mobile: 0,
      uiux: 0,
      fullstack: 0,
    };

    PROJECTS.forEach((p) => {
      if (p.category === 'web' || p.secondaryCategories?.includes('web')) counts.web++;
      if (p.category === 'mobile' || p.secondaryCategories?.includes('mobile')) counts.mobile++;
      if (p.category === 'uiux' || p.secondaryCategories?.includes('uiux')) counts.uiux++;
      if (p.category === 'fullstack' || p.secondaryCategories?.includes('fullstack')) counts.fullstack++;
    });

    return counts;
  }, []);

  // Filter projects by active tab, search query (title or tech stack name), and selected tag
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      // 1. Tab category filter
      if (activeFilter !== 'all') {
        const matchesCategory =
          project.category === activeFilter ||
          project.secondaryCategories?.includes(activeFilter);
        if (!matchesCategory) return false;
      }

      // 2. Tag filter
      if (selectedTag) {
        const matchesTag = project.tags.some(
          (t) => t.toLowerCase() === selectedTag.toLowerCase()
        );
        if (!matchesTag) return false;
      }

      // 3. Search query filter: specifically search within titles, subtitles, tech stack names, and architecture
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle =
          project.title.toLowerCase().includes(q) ||
          project.subtitle.toLowerCase().includes(q);
        const matchesTech = project.tags.some((t) => t.toLowerCase().includes(q));
        const matchesArch = project.architecture.some((a) => a.toLowerCase().includes(q));

        if (!matchesTitle && !matchesTech && !matchesArch) return false;
      }

      return true;
    });
  }, [activeFilter, selectedTag, searchQuery]);

  // Pagination computations (6 projects per page)
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE));
  const clampedPage = Math.min(currentPage, totalPages);

  const paginatedProjects = useMemo(() => {
    const startIndex = (clampedPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);
  }, [filteredProjects, clampedPage]);

  const startIndexDisplay = filteredProjects.length === 0 ? 0 : (clampedPage - 1) * PROJECTS_PER_PAGE + 1;
  const endIndexDisplay = Math.min(clampedPage * PROJECTS_PER_PAGE, filteredProjects.length);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === clampedPage) return;
    soundManager.playSwitch(newPage > clampedPage);
    setCurrentPage(newPage);
  };

  const handleTabChange = (tabId: ProjectCategory) => {
    soundManager.playClick();
    setActiveFilter(tabId);
  };

  const handleTagClick = (tag: string) => {
    soundManager.playClick();
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
      setSearchQuery(''); // clear free-form search when selecting a tag
    }
  };

  const handleKeywordChipClick = (keyword: string) => {
    soundManager.playClick();
    setSearchQuery(keyword);
    setSelectedTag(null);
    searchInputRef.current?.focus();
  };

  const handleCardClick = (project: Project) => {
    soundManager.playClick();
    onSelectProject(project);
  };

  const handleFocusDevice = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    soundManager.playCameraWhoosh();
    if (project.category === 'mobile' || project.secondaryCategories?.includes('mobile')) {
      onFocus3DCamera('MOBILE_LAB');
    } else if (project.category === 'web') {
      onFocus3DCamera('CODE_STATION');
    } else {
      onFocus3DCamera('TECH_CORE');
    }
  };

  const handleResetFilters = () => {
    soundManager.playClick();
    setActiveFilter('all');
    setSearchQuery('');
    setSelectedTag(null);
    searchInputRef.current?.focus();
  };

  return (
    <div ref={sectionRootRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* 1. Header Section */}
      <div className="pb-5 border-b border-hairline text-left">
        <div className="flex items-center gap-2 text-xs text-copper mb-1">
          <Layers className="w-4 h-4" />
          <span>Portfolio & flagship architecture</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-paper tracking-tight">
          Production Engineering Showcase
        </h2>
        <p className="text-xs sm:text-sm text-paper/60 mt-1 max-w-2xl leading-relaxed">
          Filter through enterprise Web apps, cross-platform Mobile systems, UI/UX design systems,
          and low-latency cloud infrastructure.
        </p>
      </div>

      {/* 2. DEDICATED SEARCH BAR FOR TITLES & TECH STACK NAMES */}
      <div className="bg-panel border border-hairline rounded-lg p-4 sm:p-5 space-y-3.5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-paper/70">
            <Search className="w-4 h-4 text-copper" />
            <span className="font-semibold text-paper">Search by project title or tech stack</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-paper/50">
            <span className="hidden sm:inline-flex items-center gap-1 bg-graphite px-2 py-0.5 rounded border border-hairline">
              <kbd className="text-copper font-bold">/</kbd> to focus
            </span>

            {searchQuery && (
              <span className="text-copper bg-copper/10 px-2.5 py-0.5 rounded-full border border-copper/30">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'match' : 'matches'}
              </span>
            )}
          </div>
        </div>

        {/* Search Input Field */}
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-copper/70" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (selectedTag) setSelectedTag(null);
            }}
            placeholder="Type any keyword e.g. 'AeroPay', 'React Native', 'Three.js', 'Swift', 'Tailwind', 'Docker'..."
            className="w-full pl-11 pr-24 py-3 bg-graphite border border-hairline hover:border-copper/50 focus:border-copper rounded-md text-sm text-paper placeholder-paper/30 focus:outline-none focus:ring-1 focus:ring-copper/50 transition-all font-mono shadow-inner"
          />

          {searchQuery && (
            <button
              onClick={() => {
                soundManager.playClick();
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              title="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 rounded-md bg-panel hover:bg-panel/70 text-paper/70 hover:text-paper text-xs font-mono transition-colors cursor-pointer border border-hairline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Popular Tech Stack Keyword Quick-Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-paper/40 flex items-center gap-1 mr-1">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Tech Keywords:</span>
          </span>

          {TECH_SEARCH_KEYWORDS.map((keyword) => {
            const isChipActive = searchQuery.toLowerCase().trim() === keyword.toLowerCase();
            return (
              <button
                key={keyword}
                onClick={() => handleKeywordChipClick(keyword)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                  isChipActive
                    ? 'bg-copper/20 text-copper border border-copper font-semibold'
                    : 'bg-graphite text-paper/50 border border-hairline hover:text-paper/80 hover:border-hairline'
                }`}
              >
                {isChipActive && <Check className="w-3 h-3 text-copper" />}
                <span>{keyword}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DYNAMIC FILTER TAB SYSTEM (Web, Mobile, UI/UX, Full-Stack, All) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-paper/50">
            <Filter className="w-3.5 h-3.5 text-copper" />
            <span>Domain filter tabs</span>
          </div>

          {(activeFilter !== 'all' || selectedTag || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[11px] font-mono text-paper/50 hover:text-copper transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {/* Filter Tab Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-panel p-1.5 rounded-lg border border-hairline">
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            const count = tabCounts[tab.id];

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex flex-col items-start p-2.5 sm:p-3 rounded-md text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-graphite border-copper/70 text-paper shadow-md'
                    : 'bg-graphite/60 border-transparent text-paper/50 hover:text-paper/80 hover:bg-graphite hover:border-hairline'
                }`}
              >
                {/* Top Row: Icon + Count */}
                <div className="flex items-center justify-between w-full mb-1">
                  <div
                    className={`p-1.5 rounded-md ${
                      isActive ? 'bg-copper/20 text-copper' : 'bg-panel text-paper/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-copper/20 text-copper border border-copper/40'
                        : 'bg-panel text-paper/50'
                    }`}
                  >
                    {count}
                  </span>
                </div>

                {/* Tab Label */}
                <div className="font-bold text-xs sm:text-sm text-paper/90 flex items-center gap-1">
                  <span>{tab.label}</span>
                </div>

                {/* Micro Description */}
                <span className="hidden sm:block text-[10px] text-paper/40 line-clamp-1 mt-0.5 font-sans">
                  {tab.description}
                </span>

                {/* Active Indicator Underline */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ backgroundColor: tab.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Results Status Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-paper/50 pt-1">
        <div>
          Showing{' '}
          <span className="font-bold text-copper">
            {filteredProjects.length === 0 ? 0 : `${startIndexDisplay}–${endIndexDisplay}`}
          </span>{' '}
          of <span className="text-paper/70">{filteredProjects.length}</span> projects
          {totalPages > 1 && (
            <span className="ml-1 text-paper/40 font-semibold">
              (Page {clampedPage} of {totalPages})
            </span>
          )}
          {searchQuery && (
            <span className="ml-1 text-paper/50">
              matching <span className="text-copper font-semibold">"{searchQuery}"</span>
            </span>
          )}
          {activeFilter !== 'all' && (
            <span className="ml-1 text-paper/40">
              in <span className="text-paper/70">{activeFilter}</span>
            </span>
          )}
          {selectedTag && (
            <span className="ml-1 text-paper/40">
              tagged with <span className="text-copper">"{selectedTag}"</span>
            </span>
          )}
        </div>

        <div className="text-[11px] text-paper/40 hidden sm:block">
          Hover to inspect 3D perspective tilt — click for architecture diagrams & live emulators
        </div>
      </div>

      {/* 5. Projects Grid with 3D Tilt Cards */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-panel rounded-lg border border-hairline space-y-3">
          <div className="w-12 h-12 rounded-full bg-graphite border border-hairline flex items-center justify-center mx-auto text-paper/50">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-paper">
            No projects found matching &ldquo;{searchQuery || selectedTag}&rdquo;
          </h3>
          <p className="text-xs text-paper/50 max-w-sm mx-auto">
            Try searching for a different title or tech stack (e.g. React Native, Three.js, Swift, TypeScript), or reset filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-md text-xs font-semibold bg-copper hover:bg-copper-dim text-graphite transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Paginated 6-Project 3D Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
            {paginatedProjects.map((project) => (
              <TiltProjectCard
                key={project.id}
                project={project}
                searchQuery={searchQuery}
                onCardClick={handleCardClick}
                onTagClick={handleTagClick}
                onFocusDevice={handleFocusDevice}
              />
            ))}
          </div>

          {/* 6. Pagination Controls (Next & Previous with Page Indicators) */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 pb-2 border-t border-hairline bg-panel/70 p-4 rounded-lg border">
              <div className="text-xs font-mono text-paper/50">
                Displaying{' '}
                <span className="font-bold text-copper">
                  {startIndexDisplay}–{endIndexDisplay}
                </span>{' '}
                of <span className="text-paper/80 font-semibold">{filteredProjects.length}</span> projects
                <span className="ml-2 text-paper/40 font-medium">
                  • Page <span className="text-paper">{clampedPage}</span> / {totalPages}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Previous Page Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(clampedPage - 1)}
                  disabled={clampedPage <= 1}
                  title="Navigate to Previous Page"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-mono font-medium transition-all border cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed bg-graphite border-hairline text-paper/70 hover:text-paper hover:border-copper/50 hover:bg-panel"
                >
                  <ChevronLeft className="w-4 h-4 text-copper" />
                  <span>Previous</span>
                </button>

                {/* Page Number Indicator Pills */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isCurrent = pageNum === clampedPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        title={`Go to Page ${pageNum}`}
                        className={`w-8 h-8 rounded-md text-xs font-mono font-bold transition-all border cursor-pointer ${
                          isCurrent
                            ? 'bg-copper/20 border-copper text-copper'
                            : 'bg-graphite border-hairline text-paper/50 hover:text-paper hover:border-hairline'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(clampedPage + 1)}
                  disabled={clampedPage >= totalPages}
                  title="Navigate to Next Page"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-mono font-medium transition-all border cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed bg-graphite border-hairline text-paper/70 hover:text-paper hover:border-copper/50 hover:bg-panel"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4 text-copper" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
