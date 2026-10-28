import { Project, SkillCategory, ExperienceItem } from '../types';

export const DEVELOPER_PROFILE = {
  name: 'Ahmed Hakeem',
  title: 'Senior Web & Mobile Engineer',
  specialty: 'Cross-Platform React Native, iOS (Swift), Modern Web & 3D Graphics',
  location: 'San Francisco, CA / Remote',
  email: 'ahmed.hakeem.dev@gmail.com',
  github: 'https://github.com/ahmedhakeem',
  linkedin: 'https://linkedin.com/in/ahmed-hakeem',
  status: 'Open to Senior Engineering & Lead Roles',
  summary:
    'Staff-level Web and Mobile Developer with 7+ years building high-impact consumer apps and enterprise platforms. Specialized in React Native & Swift for mobile, Next.js & Three.js for interactive web, and microservices architecture powering millions of transactions.',
  stats: [
    { label: 'Years Experience', value: '7+' },
    { label: 'Shipped Apps', value: '26' },
    { label: 'Active Users', value: '1.4M+' },
    { label: 'App Store Rating', value: '4.9 ★' },
  ],
};

export const PROJECTS: Project[] = [
  {
    id: 'aeropay-mobile',
    title: 'AeroPay Mobile',
    subtitle: 'Next-Gen Cross-Platform FinTech Wallet & FX Engine',
    category: 'mobile',
    secondaryCategories: ['uiux'],
    platform: 'iOS & Android',
    description:
      'High-performance cross-platform financial application with biometric authentication, sub-second peer-to-peer transfers, offline ledger synchronization, and live currency hedging.',
    longDescription:
      'AeroPay is a high-volume mobile payment suite built to handle frictionless borderless payments. Engineered with an offline-first state architecture using WatermelonDB and SQLite, synchronized via WebSockets when connectivity resumes. Includes native iOS FaceID / Android BiometricPrompt bridging, custom canvas-rendered financial charts, and end-to-end tokenized payload encryption.',
    highlights: [
      'Engineered offline-first reconciliation engine resolving sync conflicts in <100ms',
      'Architected 60 FPS animated wallet gestures using React Native Reanimated 3',
      'Implemented biometric hardware key attestation (Secure Enclave & KeyStore)',
      'Reduced initial app cold-start boot time from 2.4s to 680ms',
    ],
    metrics: [
      { label: 'Monthly Volume', value: '$42M+' },
      { label: 'Crash-Free Rate', value: '99.98%' },
      { label: 'App Store Rank', value: '#4 FinTech' },
    ],
    tags: ['React Native', 'TypeScript', 'Swift', 'Kotlin', 'WebSockets', 'SQLite', 'Tailwind', 'UI/UX'],
    architecture: [
      'Client: React Native with New Architecture (Fabric & TurboModules)',
      'Security: Hardware Secure Enclave tokenization with AES-256 GCM',
      'Real-time: Bidirectional WebSocket push channel for live rate book',
      'State: TanStack Query + Zustand with persistent MMKV key-value cache',
    ],
    color: '#06b6d4',
    featured: true,
    interactiveType: 'fintech',
    quickStats: {
      duration: '4 Months',
      techCount: 8,
      githubStars: '2.4k ★',
      teamRole: 'Lead Architect',
    },
  },
  {
    id: 'nebula-studio-web',
    title: 'Nebula 3D Studio',
    subtitle: 'Browser-Based Spatial Scene Editor & Asset Pipeline',
    category: 'web',
    secondaryCategories: ['uiux'],
    platform: 'Web & Cloud',
    description:
      'Collaborative in-browser 3D scene builder, PBR material previewer, and model optimization suite powered by Three.js, WebGL2, and WebAssembly.',
    longDescription:
      'Nebula Studio empowers designers and game engineers to inspect, light, and optimize complex 3D meshes right inside Google Chrome and Safari. Features an advanced procedural lighting rig, glTF/GLB draco mesh decompression, customizable HDR skyboxes, and real-time multiplayer cursor synchronization via WebRTC data channels.',
    highlights: [
      'Custom PBR shader pipeline with real-time ACES Filmic tone mapping and bloom',
      'WebAssembly mesh decimation reducing complex polygon footprints by up to 70%',
      'Multi-user live editing room with WebRTC low-latency state replication',
      'Integrated node-based shader graph for real-time procedural texture synthesis',
    ],
    metrics: [
      { label: 'Frame Rate', value: '60 FPS stable' },
      { label: 'Export Formats', value: 'glTF / USDZ' },
      { label: 'WebAssembly Speedup', value: '4.8x faster' },
    ],
    tags: ['Three.js', 'WebGL', 'React 19', 'TypeScript', 'WebAssembly', 'Tailwind', 'Zustand'],
    architecture: [
      'Rendering: Custom Three.js render loop with instancing & occlusion culling',
      'Core Engine: Rust compiled to WebAssembly for spatial indexing (BVH)',
      'UI Layer: Zero-occlusion floating HUD built with React and Tailwind CSS',
    ],
    color: '#8b5cf6',
    featured: true,
    interactiveType: 'editor',
    quickStats: {
      duration: '5 Months',
      techCount: 7,
      githubStars: '3.8k ★',
      teamRole: 'Solo 3D Engine',
    },
  },
  {
    id: 'krypton-design-system',
    title: 'Krypton UI/UX System',
    subtitle: 'Multi-Platform Design System & Micro-Interaction Engine',
    category: 'uiux',
    secondaryCategories: ['web', 'mobile'],
    platform: 'Design System & Multi-Platform',
    description:
      'Cross-platform design token architecture and accessible component library serving 4 production web and mobile apps, with fluid spring physics and automated Figma synchronization.',
    longDescription:
      'Krypton eliminates handoff friction between design and engineering. Built on semantic design tokens parsed from Figma REST APIs and compiled into native iOS Swift constants, Android Jetpack Compose themes, and Tailwind CSS configuration. Features 54+ accessible components with built-in spring gestures and dark mode contrast calibration.',
    highlights: [
      'Zero-drift design tokens exported automatically from Figma to iOS, Android, and Web',
      'Pre-baked 60 FPS gestural micro-interactions with Reanimated and Motion physics',
      '100% accessible keyboard navigation and screen-reader VoiceOver audit passed (WCAG AAA)',
      'Reduced design-to-production QA turnaround time by 58% across sprint cycles',
    ],
    metrics: [
      { label: 'Components', value: '54+' },
      { label: 'Accessibility', value: 'WCAG AAA' },
      { label: 'Drift Index', value: '0.00%' },
    ],
    tags: ['Design Tokens', 'UI/UX', 'Tailwind', 'Figma API', 'React Native', 'Framer Motion', 'Accessibility'],
    architecture: [
      'Token Pipeline: Style Dictionary compiling JSON tokens to Swift, Kotlin & CSS',
      'Physics: Damped second-order spring kinematics for fluid sheet drags & modals',
      'Documentation: Interactive Storybook with automated visual regression testing',
    ],
    color: '#f43f5e',
    featured: true,
    quickStats: {
      duration: '3 Months',
      techCount: 7,
      githubStars: '1.9k ★',
      teamRole: 'Staff Design Eng',
    },
  },
  {
    id: 'pulsehealth-os',
    title: 'PulseHealth OS',
    subtitle: 'Preventive Health Telemetry & Wearable Sync Hub',
    category: 'mobile',
    secondaryCategories: ['uiux'],
    platform: 'iOS & Android',
    description:
      'Preventive health monitoring application interfacing with continuous Bluetooth Low Energy (BLE) biometric sensors, Apple HealthKit, and Google Health Connect.',
    longDescription:
      'PulseHealth provides real-time cardiovascular telemetry, sleep phase tracking, and anomaly detection. Engineered background BLE peripherals synchronization with automatic reconnect logic and battery-optimized sleep cycle sampling. Includes on-device statistical regression to alert patients to irregularities before clinical onset.',
    highlights: [
      'Low-power background Bluetooth LE peripheral driver with 99.4% connection retention',
      'Native HealthKit and Health Connect bridges for continuous bi-directional sync',
      'Interactive physiological graph visualization rendered with GPU-accelerated Skia',
      'HIPAA-compliant on-device database encryption with zero cloud data leaks',
    ],
    metrics: [
      { label: 'Active Patients', value: '180K+' },
      { label: 'BLE Sync Uptime', value: '99.9%' },
      { label: 'Battery Overhead', value: '<2.1% daily' },
    ],
    tags: ['React Native', 'Swift', 'Kotlin', 'Bluetooth LE', 'Skia', 'HealthKit', 'Zustand', 'UI/UX'],
    architecture: [
      'BLE Transport: Custom Native Modules for CoreBluetooth & Android BLE GATT',
      'Data Layer: High-speed ring buffer for 100Hz ECG waveform streams',
      'Visualization: React Native Skia canvas with GPU shader smoothing',
    ],
    color: '#10b981',
    featured: true,
    interactiveType: 'fitness',
    quickStats: {
      duration: '6 Months',
      techCount: 8,
      githubStars: '1.4k ★',
      teamRole: 'Senior iOS/RN',
    },
  },
  {
    id: 'artisan-ar-commerce',
    title: 'Artisan Atelier & AR',
    subtitle: 'High-Fidelity 3D Product Configurator & Virtual Try-On',
    category: 'uiux',
    secondaryCategories: ['web', 'mobile'],
    platform: 'React Native & Web',
    description:
      'Luxury bespoke fashion and timepiece showcase featuring interactive WebGL 3D configuration, tactile material swatches, and instant mobile AR camera projection.',
    longDescription:
      'Artisan provides an experiential shopping journey for luxury timepieces and jewelry. Customers can customize bezel metals, dial guilloché textures, and strap leathers in real-time 3D, then tap to project the physical-scale model onto their desk or wrist via WebXR / Apple AR Quick Look.',
    highlights: [
      'Physically accurate procedural reflections using roughness/metallic mapping',
      'Seamless handoff from Web 3D inspection directly to iOS AR QuickLook (USDZ)',
      'Sub-2 second load time with progressive texture streaming and LOD mipmapping',
    ],
    metrics: [
      { label: 'Conversion Lift', value: '+34%' },
      { label: 'Avg Session Time', value: '4m 12s' },
      { label: 'Model Size', value: '1.8 MB' },
    ],
    tags: ['Three.js', 'UI/UX', 'React', 'WebXR', 'USDZ', 'Tailwind', 'Shopify API'],
    architecture: [
      'Renderer: Three.js with anisotropic materials for brushed titanium & gold',
      'AR Pipeline: Automated server-side GLB to USDZ conversion pipeline',
    ],
    color: '#eab308',
    featured: false,
    quickStats: {
      duration: '2.5 Months',
      techCount: 7,
      githubStars: '890 ★',
      teamRole: 'Spatial Web Lead',
    },
  },
  {
    id: 'hyperflow-observability',
    title: 'HyperFlow Cloud',
    subtitle: 'Distributed Web & Mobile Telemetry Observability Suite',
    category: 'fullstack',
    secondaryCategories: ['web'],
    platform: 'Web & Cloud',
    description:
      'Real-time observability platform that aggregates crash dumps, frame stutter profiles, and distributed API traces across 10M+ mobile and web sessions.',
    longDescription:
      'HyperFlow bridges the gap between client-side UX issues and backend microservices. Developed an SDK for mobile and browser that batches symbolicated stack traces, Network HAR logs, and user interaction breadcrumbs, streaming them into a high-throughput ingestion pipeline.',
    highlights: [
      'Built custom client-side SDK footprint under 14KB gzipped',
      'Aggregates over 15,000 telemetry events per second with sub-second alert dispatch',
      'Interactive flame graph timeline for identifying React render bottlenecks',
    ],
    metrics: [
      { label: 'Ingestion Rate', value: '15k evt/sec' },
      { label: 'SDK Footprint', value: '13.8 KB' },
      { label: 'MTTR Reduction', value: '45%' },
    ],
    tags: ['Next.js', 'Node.js', 'TypeScript', 'ClickHouse', 'Tailwind', 'Docker'],
    architecture: [
      'Collector: Edge-deployed proxy running on Cloudflare Workers',
      'Storage: TimescaleDB and ClickHouse for columnar analytical aggregation',
      'Frontend: Next.js App Router with streaming server-sent events (SSE)',
    ],
    color: '#f59e0b',
    featured: false,
    quickStats: {
      duration: '4.5 Months',
      techCount: 6,
      githubStars: '1.6k ★',
      teamRole: 'Full-Stack Eng',
    },
  },
  {
    id: 'voyage-ai-travel',
    title: 'VoyageAI Guide',
    subtitle: 'Conversational Travel Companion with Offline Vectors',
    category: 'mobile',
    secondaryCategories: ['uiux'],
    platform: 'Cross-Platform',
    description:
      'Mobile itinerary planner and live travel concierge featuring on-device vector search, offline vector caches, multilingual speech translation, and interactive vector maps.',
    longDescription:
      'VoyageAI allows travelers to explore cities abroad even with roaming data disabled. Bundles localized city guides with SQLite vector embeddings, enabling natural language questions like "Find a quiet espresso bar near the modern art museum" directly offline.',
    highlights: [
      'Offline semantic similarity query engine executed in under 45ms on mobile CPU',
      'Dynamic Mapbox vector styling with 3D terrain and interactive custom POI pins',
      'Integrated real-time currency calculation with live FX cache and tip calculator',
    ],
    metrics: [
      { label: 'Offline Guides', value: '45 Cities' },
      { label: 'App Rating', value: '4.9 ★ (12k)' },
      { label: 'Search Latency', value: '38ms' },
    ],
    tags: ['React Native', 'Expo', 'Vector Embeddings', 'Mapbox', 'TypeScript', 'Tailwind'],
    architecture: [
      'Offline AI: Quantized embedding model compiled with ONNX Runtime Mobile',
      'Mapping: Mapbox Native SDK with custom vector tile cache',
      'UI: Fluid gestural bottom sheets with reanimated bottom-sheet',
    ],
    color: '#ec4899',
    featured: false,
    quickStats: {
      duration: '2 Months',
      techCount: 6,
      githubStars: '1.1k ★',
      teamRole: 'Mobile AI Dev',
    },
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Mobile Engineering',
    iconName: 'Smartphone',
    skills: [
      {
        name: 'React Native & Expo',
        level: 96,
        experience: '6 Years',
        description: 'New Architecture (TurboModules, Fabric), Reanimated 3, native bridging',
        badge: 'Core Specialist',
      },
      {
        name: 'iOS / Swift & SwiftUI',
        level: 88,
        experience: '5 Years',
        description: 'CoreBluetooth, HealthKit, Secure Enclave, Combine, Metal basics',
        badge: 'Native iOS',
      },
      {
        name: 'Android / Kotlin',
        level: 82,
        experience: '4 Years',
        description: 'Jetpack Compose, Android Keystore, BLE GATT, WorkManager',
        badge: 'Native Android',
      },
      {
        name: 'Offline-First & Local DBs',
        level: 92,
        experience: '6 Years',
        description: 'WatermelonDB, SQLite, MMKV, Realm, conflict-free sync (CRDTs)',
      },
    ],
  },
  {
    title: 'Modern Web & 3D',
    iconName: 'Globe',
    skills: [
      {
        name: 'React 19 & Next.js',
        level: 98,
        experience: '7 Years',
        description: 'App Router, Server Components, Concurrent Features, State patterns',
        badge: 'Expert',
      },
      {
        name: 'Three.js & WebGL',
        level: 90,
        experience: '4 Years',
        description: 'PBR materials, RoomEnvironment, custom GLSL shaders, camera damping',
        badge: '3D Graphics',
      },
      {
        name: 'TypeScript & Architecture',
        level: 95,
        experience: '7 Years',
        description: 'Strict type safety, monorepo design (Turborepo), clean code standards',
      },
      {
        name: 'Tailwind CSS & Design Systems',
        level: 94,
        experience: '5 Years',
        description: 'Responsive viewport-first layouts, accessible UI, micro-animations',
      },
    ],
  },
  {
    title: 'Backend, Cloud & DevOps',
    iconName: 'Server',
    skills: [
      {
        name: 'Node.js, Express & Bun',
        level: 90,
        experience: '6 Years',
        description: 'REST, GraphQL, WebSocket real-time servers, high concurrency',
      },
      {
        name: 'PostgreSQL & Cloud SQL',
        level: 88,
        experience: '5 Years',
        description: 'Relational data modeling, indexing, Prisma, Drizzle, migrations',
      },
      {
        name: 'Docker & Cloud Deployment',
        level: 85,
        experience: '5 Years',
        description: 'Containerization, Google Cloud Run, AWS ECS, CI/CD pipelines',
      },
      {
        name: 'Testing & Performance',
        level: 89,
        experience: '6 Years',
        description: 'Jest, Playwright, Maestro mobile E2E, Lighthouse 95+ profiling',
      },
    ],
  },
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    period: '2023 — Present',
    role: 'Staff Web & Mobile Architect',
    company: 'Apex Digital Labs',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description:
      'Spearheading mobile and web architecture across 4 flagship digital products. Championed migration to React Native New Architecture and introduced Three.js web configurators boosting sales by 35%.',
    achievements: [
      'Led team of 14 mobile and fullstack engineers across US and Europe',
      'Architected cross-platform design system utilized across 6 production apps',
      'Improved mobile crash-free users from 98.2% to 99.98% across 1M+ MAU',
    ],
    technologies: ['React Native', 'Swift', 'TypeScript', 'Three.js', 'Next.js', 'GraphQL'],
  },
  {
    period: '2021 — 2023',
    role: 'Senior Mobile Engineer (iOS & RN)',
    company: 'Veloce Health Technologies',
    location: 'Boston, MA (Remote)',
    type: 'Full-time',
    description:
      'Engineered core BLE wearable integration and real-time biometric telemetry engine for HIPAA-compliant clinical care app.',
    achievements: [
      'Created custom background synchronization protocol with BLE peripheral sensors',
      'Engineered smooth 60 FPS ECG and pulse graphs using React Native Skia',
      'Cut mobile memory consumption by 40% using native buffer streaming',
    ],
    technologies: ['React Native', 'Swift', 'Kotlin', 'Bluetooth LE', 'SQLite', 'Node.js'],
  },
  {
    period: '2019 — 2021',
    role: 'Full-Stack Frontend Engineer',
    company: 'Luminary Systems',
    location: 'Austin, TX',
    type: 'Full-time',
    description:
      'Built interactive data visualization dashboards, analytics tooling, and high-performance React web applications.',
    achievements: [
      'Designed real-time event pipeline processing 10k messages/sec',
      'Reduced web initial bundle size by 52% using dynamic route code splitting',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'WebGL', 'Tailwind', 'Docker'],
  },
];

export const TERMINAL_COMMANDS: Record<string, string> = {
  help: `Available Commands:
  - whoami       : Display developer profile and background
  - skills       : List core tech stack and proficiencies
  - projects     : Output summary of flagship projects
  - contact      : Show communication channels & email
  - benchmark    : Run client-side rendering & WebGL diagnostic
  - hire         : Availability & project engagement details
  - clear        : Clear terminal output`,
  whoami: `Ahmed Hakeem — Senior Web & Mobile Engineer
Experience: 7+ Years building production iOS, Android, and Web applications.
Philosophy: "Delightful 60 FPS interactions, rock-solid offline sync, and clean modular code."`,
  skills: `Core Stack:
[Mobile]   React Native (Fabric/TurboModules), Swift (iOS), Kotlin (Android), BLE, SQLite
[Web]      React 19, Next.js, Three.js (WebGL/PBR), TypeScript, Tailwind CSS
[Backend]  Node.js, Express, PostgreSQL, WebSockets, Docker, Cloud Run, GraphQL`,
  projects: `Flagship Projects:
1. AeroPay Mobile         [FinTech / React Native + Swift] - $42M+ Monthly Volume
2. Nebula 3D Studio       [WebGL / Three.js + React]       - 60 FPS browser spatial editor
3. PulseHealth OS         [Health / Swift + React Native]  - BLE wearable telemetry hub
4. HyperFlow Cloud        [DevOps / Next.js + ClickHouse]  - Distributed telemetry pipeline`,
  contact: `Direct Contact:
Email    : ahmed.hakeem.dev@gmail.com
LinkedIn : https://linkedin.com/in/ahmed-hakeem
GitHub   : https://github.com/ahmedhakeem
Status   : Open for Staff Engineer / Senior Fullstack & Mobile roles`,
  hire: `Engagement Options:
- Full-Time Senior / Staff Mobile or Web Architect
- High-Impact Mobile App MVP Architecture & Development
- 3D Interactive Web / WebGL Experience Development
Ready to ship production code from day one.`,
};
