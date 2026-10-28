import * as THREE from 'three';

/**
 * Creates a procedural desk mat texture with millimeter grid lines and tech markers.
 */
export function createDeskMatTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base dark surface
  ctx.fillStyle = '#0f1422';
  ctx.fillRect(0, 0, 1024, 1024);

  // Grid lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;
  const step = 32;
  for (let x = 0; x <= 1024; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Major accent lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.lineWidth = 2;
  for (let x = 0; x <= 1024; x += step * 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += step * 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Technical corner brackets and developer labels
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 3;
  // Top-left bracket
  ctx.strokeRect(30, 30, 40, 40);
  ctx.strokeRect(954, 30, 40, 40);
  ctx.strokeRect(30, 954, 40, 40);
  ctx.strokeRect(954, 954, 40, 40);

  // Typography
  ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('DEV//DIMENSION — DUAL PLATFORM RIG', 120, 80);
  ctx.font = '14px monospace';
  ctx.fillText('SCALE: 1:1 MM / WEB & MOBILE ARCHITECTURE', 120, 105);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates dynamic animated code screen texture for the ultrawide monitor.
 */
export function createCodeScreenTexture(renderer: THREE.WebGLRenderer): {
  texture: THREE.CanvasTexture;
  update: (time: number) => void;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const codeSnippets = [
    { text: '// DevDimension Core Architecture (React Native & Web)', color: '#64748b' },
    { text: 'import { createSpatialScene, optimizeMesh } from "@web/graphics";', color: '#93c5fd' },
    { text: 'import { initBiometricAuth, syncLocalLedger } from "@mobile/core";', color: '#93c5fd' },
    { text: '', color: '#000000' },
    { text: 'export async function bootDeveloperRig(options: Config) {', color: '#38bdf8' },
    { text: '  const mobilePipeline = await initMobileEngine({', color: '#e2e8f0' },
    { text: '    architecture: "TurboModules + Fabric",', color: '#f59e0b' },
    { text: '    offlineFirst: true, // WatermelonDB + SQLite', color: '#10b981' },
    { text: '    framePacing: "60_FPS_LOCKED",', color: '#f59e0b' },
    { text: '  });', color: '#e2e8f0' },
    { text: '', color: '#000000' },
    { text: '  const webEngine = new SpatialWebRuntime({', color: '#e2e8f0' },
    { text: '    pbrLighting: "StudioACESFilmic",', color: '#a855f7' },
    { text: '    zeroLatencyStreaming: true,', color: '#ec4899' },
    { text: '  });', color: '#e2e8f0' },
    { text: '  return { status: "ONLINE", metrics: { activeUsers: "1.4M+" } };', color: '#34d399' },
    { text: '}', color: '#38bdf8' },
  ];

  function draw(time: number) {
    // Dark editor background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 1024, 512);

    // Editor Header / Tabs
    ctx.fillStyle = '#0e1626';
    ctx.fillRect(0, 0, 1024, 46);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 1024, 46);

    // Tabs
    const tabs = ['Architecture.tsx', 'MobileEngine.ts', 'ThreeScene.ts', 'FinTechWallet.swift'];
    let tabX = 16;
    tabs.forEach((tab, index) => {
      ctx.fillStyle = index === 0 ? '#1e293b' : 'transparent';
      ctx.fillRect(tabX, 8, 140, 30);
      ctx.fillStyle = index === 0 ? '#38bdf8' : '#64748b';
      ctx.font = '13px monospace';
      ctx.fillText(tab, tabX + 16, 28);
      tabX += 148;
    });

    // Window controls
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(980, 23, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(960, 23, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(940, 23, 5, 0, Math.PI * 2);
    ctx.fill();

    // Line Numbers & Code
    const startY = 80;
    const lineHeight = 22;
    codeSnippets.forEach((line, index) => {
      const y = startY + index * lineHeight;
      // Line number
      ctx.fillStyle = '#334155';
      ctx.font = '13px monospace';
      ctx.fillText(String(index + 1).padStart(2, ' '), 20, y);

      // Code text
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 65, y);
    });

    // Blinking cursor
    if (Math.sin(time * 6) > 0) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(520, startY + 13 * lineHeight - 14, 8, 16);
    }

    // Right-hand Live Performance / Preview Panel
    ctx.fillStyle = '#0d131f';
    ctx.fillRect(720, 56, 288, 440);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(720, 56, 288, 440);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('LIVE RUNTIME TELEMETRY', 740, 85);

    // Simulated FPS / Memory graph
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(740, 160);
    for (let i = 0; i < 240; i += 20) {
      const offset = Math.sin((time * 3) + (i * 0.1)) * 14 + Math.cos((time * 2) + i) * 6;
      ctx.lineTo(740 + i, 160 + offset);
    }
    ctx.stroke();

    // Stats
    ctx.fillStyle = '#22c55e';
    ctx.font = '12px monospace';
    ctx.fillText('● SYSTEM STATUS: 60 FPS OPTIMAL', 740, 220);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('● ACTIVE SESSIONS: 1,420,890', 740, 245);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('● LATENCY: 24ms (GLOBAL EDGE)', 740, 270);
    ctx.fillStyle = '#a855f7';
    ctx.fillText('● BUILDS: iOS / Android / Web', 740, 295);

    // Bottom status bar
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 484, 1024, 28);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px monospace';
    ctx.fillText('UTF-8 | TypeScript 5.8 | Git main (clean) | Prettier | Port 3000', 20, 502);
  }

  draw(0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  let lastDrawn = 0;
  return {
    texture,
    update: (time: number) => {
      // Throttle texture updates to ~15-20fps to conserve GPU memory and CPU cycles
      if (time - lastDrawn > 0.06) {
        draw(time);
        texture.needsUpdate = true;
        lastDrawn = time;
      }
    },
  };
}

/**
 * Creates mobile app screen texture (FinTech / Telemetry mobile preview).
 */
export function createMobileScreenTexture(renderer: THREE.WebGLRenderer): {
  texture: THREE.CanvasTexture;
  update: (time: number) => void;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  function draw(time: number) {
    // Phone UI background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 512, 1024);

    // Status bar (time, signal, wifi, battery)
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('9:41', 40, 55);
    ctx.fillText('5G  100%', 400, 55);

    // Dynamic Island / Notch
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(176, 25, 160, 36, 18);
    ctx.fill();

    // App Header
    ctx.fillStyle = '#64748b';
    ctx.font = '16px sans-serif';
    ctx.fillText('TOTAL BALANCE', 40, 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('$124,850.40', 40, 175);

    // P&L pill
    ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
    ctx.beginPath();
    ctx.roundRect(40, 195, 130, 32, 16);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('+18.4% (30d)', 56, 216);

    // Action buttons row (Send, Receive, Swap, Card)
    const actions = ['Send', 'Receive', 'Swap', 'Cards'];
    actions.forEach((act, idx) => {
      const x = 40 + idx * 115;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(x + 35, 280, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(act[0], x + 30, 286);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      ctx.fillText(act, x + 15, 330);
    });

    // Dynamic Sparkline Chart
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(40, 480);
    for (let x = 40; x <= 470; x += 30) {
      const wave = Math.sin((time * 2.5) + (x * 0.05)) * 25 + Math.cos((time * 1.5) + x) * 12;
      ctx.lineTo(x, 440 + wave);
    }
    ctx.stroke();

    // Recent Transactions card
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(30, 540, 452, 380, 24);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(30, 540, 452, 380);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Recent Transactions', 55, 585);

    const txs = [
      { name: 'Apple App Store', tag: 'Subscription', amount: '-$14.99', color: '#ef4444' },
      { name: 'Client Settlement', tag: 'Direct Deposit', amount: '+$8,500.00', color: '#22c55e' },
      { name: 'AWS Cloud Services', tag: 'Cloud Infra', amount: '-$124.60', color: '#ef4444' },
      { name: 'Stripe Payout', tag: 'Mobile Revenue', amount: '+$3,240.00', color: '#22c55e' },
    ];

    txs.forEach((tx, i) => {
      const ty = 640 + i * 65;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(80, ty - 6, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(tx.name, 115, ty - 12);

      ctx.fillStyle = '#64748b';
      ctx.font = '13px sans-serif';
      ctx.fillText(tx.tag, 115, ty + 10);

      ctx.fillStyle = tx.color;
      ctx.font = 'bold 16px monospace';
      ctx.fillText(tx.amount, 360, ty);
    });

    // Home indicator bar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(176, 995, 160, 6, 3);
    ctx.fill();
  }

  draw(0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  let lastDrawn = 0;
  return {
    texture,
    update: (time: number) => {
      if (time - lastDrawn > 0.08) {
        draw(time);
        texture.needsUpdate = true;
        lastDrawn = time;
      }
    },
  };
}

/**
 * Creates tablet app screen texture (Analytics & Code dashboard).
 */
export function createTabletScreenTexture(renderer: THREE.WebGLRenderer): {
  texture: THREE.CanvasTexture;
  update: (time: number) => void;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  function draw(time: number) {
    ctx.fillStyle = '#080d1a';
    ctx.fillRect(0, 0, 1024, 768);

    // Left Navigation rail
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, 90, 768);

    const icons = ['⌘', '📱', '⚡', '📊', '⚙'];
    icons.forEach((ic, i) => {
      ctx.fillStyle = i === 1 ? '#38bdf8' : '#64748b';
      ctx.font = '26px sans-serif';
      ctx.fillText(ic, 32, 80 + i * 90);
    });

    // Top Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('Cross-Platform PulseHub', 130, 60);
    ctx.fillStyle = '#64748b';
    ctx.font = '15px sans-serif';
    ctx.fillText('Real-time iOS, Android & Web User Activity Matrix', 130, 85);

    // 3 Metric Cards
    const cards = [
      { label: 'Active Sessions', val: '14,892', change: '+12.4%', color: '#38bdf8' },
      { label: '60 FPS Frame Rate', val: '99.4%', change: 'Stable', color: '#10b981' },
      { label: 'Crash-Free Users', val: '99.98%', change: '+0.04%', color: '#a855f7' },
    ];

    cards.forEach((c, idx) => {
      const cx = 130 + idx * 285;
      ctx.fillStyle = '#101a2e';
      ctx.beginPath();
      ctx.roundRect(cx, 120, 260, 120, 16);
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.strokeRect(cx, 120, 260, 120);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText(c.label, cx + 20, 150);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px monospace';
      ctx.fillText(c.val, cx + 20, 195);

      ctx.fillStyle = c.color;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(c.change, cx + 20, 222);
    });

    // Main Chart Area
    ctx.fillStyle = '#101a2e';
    ctx.beginPath();
    ctx.roundRect(130, 270, 830, 440, 20);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(130, 270, 830, 440);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Multi-Platform Throughput & Event Dispatch (100Hz)', 160, 310);

    // Interactive bar chart columns
    const barCount = 14;
    const barWidth = 36;
    for (let b = 0; b < barCount; b++) {
      const bx = 160 + b * 56;
      const height = 80 + Math.sin(time * 3 + b * 0.8) * 60 + (b * 12);
      ctx.fillStyle = b % 2 === 0 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(168, 85, 247, 0.85)';
      ctx.beginPath();
      ctx.roundRect(bx, 640 - height, barWidth, height, 6);
      ctx.fill();
    }
  }

  draw(0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  let lastDrawn = 0;
  return {
    texture,
    update: (time: number) => {
      if (time - lastDrawn > 0.1) {
        draw(time);
        texture.needsUpdate = true;
        lastDrawn = time;
      }
    },
  };
}
