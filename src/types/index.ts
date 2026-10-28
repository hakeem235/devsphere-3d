export type CameraPreset = 'OVERVIEW' | 'MOBILE_LAB' | 'CODE_STATION' | 'TECH_CORE';

export type LightingPreset = 'CYBER_NEON' | 'STUDIO_CLEAN' | 'DEEP_OBSIDIAN';

export type ProjectCategory = 'all' | 'web' | 'mobile' | 'uiux' | 'fullstack';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'web' | 'mobile' | 'uiux' | 'fullstack';
  secondaryCategories?: ('web' | 'mobile' | 'uiux' | 'fullstack')[];
  platform: 'iOS & Android' | 'Web & Cloud' | 'Cross-Platform' | 'React Native & Web' | 'Design System & Multi-Platform';
  description: string;
  longDescription: string;
  highlights: string[];
  metrics: { label: string; value: string }[];
  tags: string[];
  architecture: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  color: string;
  interactiveType?: 'fintech' | 'fitness' | 'editor';
  quickStats?: {
    duration: string;
    techCount: number;
    githubStars: string;
    teamRole?: string;
  };
}

export interface SkillCategory {
  title: string;
  iconName: string;
  skills: {
    name: string;
    level: number; // 0-100
    experience: string;
    description: string;
    badge?: string;
  }[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Scene3DState {
  cameraPreset: CameraPreset;
  explodedProgress: number; // 0 to 1
  lightingPreset: LightingPreset;
  wireframe: boolean;
  autoRotate: boolean;
  activeHotspot: string | null;
}
