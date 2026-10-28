import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CameraPreset, LightingPreset } from '../types';
import {
  createDeskMatTexture,
  createCodeScreenTexture,
  createMobileScreenTexture,
  createTabletScreenTexture,
} from '../utils/proceduralTextures';
import { soundManager } from '../utils/audio';

// Pre-allocated math objects to ensure zero GC in animation loop
const _vCamPos = new THREE.Vector3();
const _vCamTarget = new THREE.Vector3();
const _vDollyOffset = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();

interface ThreeCanvasProps {
  cameraPreset: CameraPreset;
  explodedProgress: number;
  lightingPreset: LightingPreset;
  wireframe: boolean;
  autoRotate: boolean;
  onSelectHotspot: (hotspotId: string) => void;
  onPresetChange?: (preset: CameraPreset) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  cameraPreset,
  explodedProgress,
  lightingPreset,
  wireframe,
  autoRotate,
  onSelectHotspot,
  onPresetChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    cameraPreset,
    explodedProgress,
    lightingPreset,
    wireframe,
    autoRotate,
  });

  // Keep stateRef fresh without triggering canvas re-creation
  useEffect(() => {
    stateRef.current = {
      cameraPreset,
      explodedProgress,
      lightingPreset,
      wireframe,
      autoRotate,
    };
  }, [cameraPreset, explodedProgress, lightingPreset, wireframe, autoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Initialize Renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Scene & Studio PBR Environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x15171c);
    scene.fog = new THREE.FogExp2(0x15171c, 0.038);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Camera & Damped Controls
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 80);
    camera.position.set(0, 3.2, 5.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep camera above floor
    controls.minDistance = 1.5;
    controls.maxDistance = 12;
    controls.target.set(0, 1.2, 0);

    // 5. Studio 3-Point Lighting Rig
    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.8);
    keyLight.position.set(4, 6.5, 4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -3.5;
    keyLight.shadow.camera.right = 3.5;
    keyLight.shadow.camera.top = 3.5;
    keyLight.shadow.camera.bottom = -3.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.4);
    scene.add(hemiLight);

    // Rim / Backlight
    const rimLight = new THREE.DirectionalLight(0x818cf8, 1.8);
    rimLight.position.set(-4, 4, -4);
    scene.add(rimLight);

    // Subtle Cyan Desk Accent Point Light
    const accentPointLight = new THREE.PointLight(0x06b6d4, 1.5, 5);
    accentPointLight.position.set(0, 1.8, 0.8);
    scene.add(accentPointLight);

    // 6. Ground & Contact Shadow Plane
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x060911,
      roughness: 0.85,
      metalness: 0.2,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = 0;
    groundMesh.receiveShadow = !isSoftwareGl;
    scene.add(groundMesh);

    // Soft Radial Contact Shadow Texture
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);
    const contactShadowTex = new THREE.CanvasTexture(shadowCanvas);

    const contactShadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 3),
      new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      })
    );
    contactShadowPlane.rotation.x = -Math.PI / 2;
    contactShadowPlane.position.set(0, 0.01, 0);
    scene.add(contactShadowPlane);

    // 7. Track materials for wireframe toggle and dispose
    const managedMaterials: THREE.Material[] = [];
    function trackMat<T extends THREE.Material>(mat: T): T {
      managedMaterials.push(mat);
      return mat;
    }

    // Interactive Raycast Targets
    const interactiveTargets: { mesh: THREE.Object3D; id: string; label: string }[] = [];

    // ==========================================
    // 8. PROCEDURAL 3D MODELS (Composite 3-12 Parts)
    // ==========================================

    // Root Rig Group
    const workstationRig = new THREE.Group();
    workstationRig.position.set(0, 0, 0);
    scene.add(workstationRig);

    // --- A. Ergonomic Cyber-Desk ---
    const deskGroup = new THREE.Group();
    workstationRig.add(deskGroup);

    // 1. Tabletop
    const tabletopMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x111726,
        roughness: 0.5,
        metalness: 0.3,
      })
    );
    const tabletop = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 2.0), tabletopMat);
    tabletop.position.set(0, 1.0, 0);
    tabletop.castShadow = !isSoftwareGl;
    tabletop.receiveShadow = !isSoftwareGl;
    deskGroup.add(tabletop);

    // 2. Desk Legs (Structural Aluminum Trestle)
    const legMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.25,
        metalness: 0.85,
      })
    );
    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.98, 1.8), legMat);
    leftLeg.position.set(-1.9, 0.49, 0);
    leftLeg.castShadow = !isSoftwareGl;
    deskGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.98, 1.8), legMat);
    rightLeg.position.set(1.9, 0.49, 0);
    rightLeg.castShadow = !isSoftwareGl;
    deskGroup.add(rightLeg);

    // 3. Structural Crossbar
    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.06, 0.08), legMat);
    crossbar.position.set(0, 0.45, -0.4);
    deskGroup.add(crossbar);

    // 4. Millimeter Desk Mat with Procedural Canvas Texture
    const deskMatTexture = createDeskMatTexture(renderer);
    const deskMatMaterial = trackMat(
      new THREE.MeshStandardMaterial({
        map: deskMatTexture,
        roughness: 0.7,
        metalness: 0.1,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    );
    const deskMatMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.6), deskMatMaterial);
    deskMatMesh.rotation.x = -Math.PI / 2;
    deskMatMesh.position.set(0, 1.041, 0.05);
    deskMatMesh.receiveShadow = !isSoftwareGl;
    deskGroup.add(deskMatMesh);

    // --- B. Ultrawide Curved Workstation Monitor (Web Engine) ---
    const monitorRig = new THREE.Group();
    monitorRig.position.set(0, 1.04, -0.45);
    workstationRig.add(monitorRig);

    // Stand Base
    const standMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.2,
        metalness: 0.9,
      })
    );
    const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.03, 32), standMat);
    standBase.position.set(0, 0.015, 0);
    standBase.castShadow = !isSoftwareGl;
    monitorRig.add(standBase);

    // Stand Neck / Arm
    const standNeck = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 0.12), standMat);
    standNeck.position.set(0, 0.35, -0.05);
    standNeck.rotation.x = -0.12;
    standNeck.castShadow = !isSoftwareGl;
    monitorRig.add(standNeck);

    // Monitor Screen Group (For Exploded View Separation)
    const monitorScreenGroup = new THREE.Group();
    monitorScreenGroup.position.set(0, 0.62, 0);
    monitorRig.add(monitorScreenGroup);

    // Monitor Bezel Back / Chassis
    const bezelMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.35,
        metalness: 0.8,
      })
    );
    const monitorBack = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.88, 0.06), bezelMat);
    monitorBack.position.set(0, 0, -0.02);
    monitorBack.castShadow = !isSoftwareGl;
    monitorScreenGroup.add(monitorBack);

    // Procedural Dynamic Code Screen
    const codeScreen = createCodeScreenTexture(renderer);
    const screenMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: codeScreen.texture,
        roughness: 0.2,
        metalness: 0.1,
        emissive: new THREE.Color(0x38bdf8),
        emissiveIntensity: 0.35,
        emissiveMap: codeScreen.texture,
      })
    );
    const monitorDisplay = new THREE.Mesh(new THREE.PlaneGeometry(2.54, 0.82), screenMat);
    monitorDisplay.position.set(0, 0, 0.015);
    monitorScreenGroup.add(monitorDisplay);

    // Monitor Glass Front Protective Layer
    const monitorGlassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: isSoftwareGl ? 0.2 : 0.35,
        clearcoat: 1.0,
      })
    );
    const monitorGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.54, 0.82), monitorGlassMat);
    monitorGlass.position.set(0, 0, 0.025);
    monitorScreenGroup.add(monitorGlass);

    // Bottom Ambient LED Bar under Monitor
    const ledBar = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.015, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    ledBar.position.set(0, -0.43, 0.02);
    monitorScreenGroup.add(ledBar);

    // Register monitor as interactive target
    interactiveTargets.push({
      mesh: monitorDisplay,
      id: 'web-workstation',
      label: 'Web & Graphics Workstation',
    });

    // --- C. Mobile Testing Station: Flagship Smartphone (iOS / Android) ---
    const phoneGroup = new THREE.Group();
    phoneGroup.position.set(1.15, 1.04, 0.18);
    phoneGroup.rotation.y = -0.35;
    workstationRig.add(phoneGroup);

    // Phone Magnetic Stand Dock
    const dockMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.3,
        metalness: 0.8,
      })
    );
    const phoneDock = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.04, 24), dockMat);
    phoneDock.position.set(0, 0.02, 0);
    phoneGroup.add(phoneDock);

    const phonePillar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 16), dockMat);
    phonePillar.position.set(0, 0.12, -0.04);
    phonePillar.rotation.x = -0.25;
    phoneGroup.add(phonePillar);

    // Phone Body Assembly (supports exploded separation)
    const phoneBody = new THREE.Group();
    phoneBody.position.set(0, 0.26, 0);
    phoneBody.rotation.x = -0.28;
    phoneGroup.add(phoneBody);

    // Phone Chassis (Titanium)
    const phoneChassisMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x222c3c,
        roughness: 0.18,
        metalness: 0.95,
      })
    );
    const phoneChassis = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.72, 0.025), phoneChassisMat);
    phoneChassis.castShadow = !isSoftwareGl;
    phoneBody.add(phoneChassis);

    // Phone Camera Bump (3 Lenses)
    const camBump = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.16, 0.015),
      new THREE.MeshStandardMaterial({ color: 0x182030, roughness: 0.2, metalness: 0.9 })
    );
    camBump.position.set(-0.08, 0.24, -0.018);
    phoneBody.add(camBump);

    const lensGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.01, 16);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x0a0f1d, roughness: 0.1, metalness: 0.9 });
    const lens1 = new THREE.Mesh(lensGeo, lensMat);
    lens1.rotation.x = Math.PI / 2;
    lens1.position.set(-0.11, 0.27, -0.025);
    phoneBody.add(lens1);
    const lens2 = new THREE.Mesh(lensGeo, lensMat);
    lens2.rotation.x = Math.PI / 2;
    lens2.position.set(-0.05, 0.27, -0.025);
    phoneBody.add(lens2);
    const lens3 = new THREE.Mesh(lensGeo, lensMat);
    lens3.rotation.x = Math.PI / 2;
    lens3.position.set(-0.08, 0.21, -0.025);
    phoneBody.add(lens3);

    // Phone Dynamic Screen
    const mobileScreen = createMobileScreenTexture(renderer);
    const phoneScreenMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: mobileScreen.texture,
        roughness: 0.15,
        metalness: 0.05,
        emissive: new THREE.Color(0x06b6d4),
        emissiveIntensity: 0.35,
        emissiveMap: mobileScreen.texture,
      })
    );
    const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.70), phoneScreenMat);
    phoneScreen.position.set(0, 0, 0.014);
    phoneBody.add(phoneScreen);

    // Phone Glass
    const phoneGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.34, 0.70),
      new THREE.MeshPhysicalMaterial({
        transparent: true,
        opacity: isSoftwareGl ? 0.15 : 0.25,
        roughness: 0.04,
        clearcoat: 1.0,
      })
    );
    phoneGlass.position.set(0, 0, 0.018);
    phoneBody.add(phoneGlass);

    interactiveTargets.push({
      mesh: phoneScreen,
      id: 'mobile-lab',
      label: 'Flagship Mobile Testing Device',
    });

    // --- D. Mobile Testing Station: Tablet Device (iPad Pro Style) ---
    const tabletGroup = new THREE.Group();
    tabletGroup.position.set(-1.18, 1.04, 0.16);
    tabletGroup.rotation.y = 0.32;
    workstationRig.add(tabletGroup);

    const tabletDock = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.2), dockMat);
    tabletDock.position.set(0, 0.02, 0);
    tabletGroup.add(tabletDock);

    const tabletPillar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.04), dockMat);
    tabletPillar.position.set(0, 0.15, -0.05);
    tabletPillar.rotation.x = -0.22;
    tabletGroup.add(tabletPillar);

    const tabletBody = new THREE.Group();
    tabletBody.position.set(0, 0.32, 0);
    tabletBody.rotation.x = -0.25;
    tabletGroup.add(tabletBody);

    const tabletChassis = new THREE.Mesh(
      new THREE.BoxGeometry(0.88, 0.62, 0.02),
      phoneChassisMat
    );
    tabletChassis.castShadow = !isSoftwareGl;
    tabletBody.add(tabletChassis);

    const tabletScreen = createTabletScreenTexture(renderer);
    const tabletScreenMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: tabletScreen.texture,
        roughness: 0.18,
        metalness: 0.05,
        emissive: new THREE.Color(0x38bdf8),
        emissiveIntensity: 0.3,
        emissiveMap: tabletScreen.texture,
      })
    );
    const tabletDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.59), tabletScreenMat);
    tabletDisplay.position.set(0, 0, 0.012);
    tabletBody.add(tabletDisplay);

    interactiveTargets.push({
      mesh: tabletDisplay,
      id: 'tablet-hub',
      label: 'Cross-Platform Telemetry Tablet',
    });

    // --- E. Mechanical Keyboard & Precision Mouse ---
    const keyboardGroup = new THREE.Group();
    keyboardGroup.position.set(0, 1.041, 0.26);
    workstationRig.add(keyboardGroup);

    // Keyboard Base Chassis
    const kbBaseMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.4,
        metalness: 0.7,
      })
    );
    const kbBase = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.035, 0.32), kbBaseMat);
    kbBase.position.set(0, 0.017, 0);
    kbBase.castShadow = !isSoftwareGl;
    keyboardGroup.add(kbBase);

    // Wrist Rest
    const wristRest = new THREE.Mesh(
      new THREE.BoxGeometry(0.88, 0.025, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, metalness: 0.1 })
    );
    wristRest.position.set(0, 0.012, 0.22);
    keyboardGroup.add(wristRest);

    // Instanced Keycaps (6 rows x 15 keys = 90 keycaps)
    const keyGeo = new THREE.BoxGeometry(0.046, 0.02, 0.042);
    const keyMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.45,
        metalness: 0.3,
      })
    );
    const keyInstMesh = new THREE.InstancedMesh(keyGeo, keyMat, 90);
    keyInstMesh.castShadow = !isSoftwareGl;

    const dummy = new THREE.Object3D();
    let keyIdx = 0;
    const accentColor = new THREE.Color(0x38bdf8);
    const regularColor = new THREE.Color(0x1e293b);
    const specialColor = new THREE.Color(0x06b6d4);

    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 15; c++) {
        const kx = -0.38 + c * 0.054;
        const kz = -0.11 + r * 0.048;
        dummy.position.set(kx, 0.038, kz);
        dummy.updateMatrix();
        keyInstMesh.setMatrixAt(keyIdx, dummy.matrix);

        // Accentuate Space, Esc, and Enter keys
        if ((r === 5 && c >= 5 && c <= 9) || (r === 0 && c === 0)) {
          keyInstMesh.setColorAt(keyIdx, accentColor);
        } else if (r === 2 && c === 14) {
          keyInstMesh.setColorAt(keyIdx, specialColor);
        } else {
          keyInstMesh.setColorAt(keyIdx, regularColor);
        }
        keyIdx++;
      }
    }
    keyInstMesh.instanceMatrix.needsUpdate = true;
    if (keyInstMesh.instanceColor) keyInstMesh.instanceColor.needsUpdate = true;
    keyboardGroup.add(keyInstMesh);

    // Mouse / Trackball
    const mouseGroup = new THREE.Group();
    mouseGroup.position.set(0.65, 1.041, 0.28);
    workstationRig.add(mouseGroup);

    const mouseBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 24, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 })
    );
    mouseBody.scale.set(0.7, 0.45, 1.25);
    mouseBody.position.set(0, 0.035, 0);
    mouseBody.castShadow = !isSoftwareGl;
    mouseGroup.add(mouseBody);

    const mouseGlow = new THREE.Mesh(
      new THREE.TorusGeometry(0.04, 0.005, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    mouseGlow.rotation.x = Math.PI / 2;
    mouseGlow.position.set(0, 0.05, -0.02);
    mouseGroup.add(mouseGlow);

    // --- F. Studio Audio Monitor (Left Desk) ---
    const speakerGroup = new THREE.Group();
    speakerGroup.position.set(-1.8, 1.04, -0.3);
    speakerGroup.rotation.y = 0.45;
    workstationRig.add(speakerGroup);

    const speakerCabinet = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.62, 0.38),
      new THREE.MeshStandardMaterial({ color: 0x0b1120, roughness: 0.6, metalness: 0.2 })
    );
    speakerCabinet.position.set(0, 0.31, 0);
    speakerCabinet.castShadow = !isSoftwareGl;
    speakerGroup.add(speakerCabinet);

    // Woofer Cone
    const woofer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.04, 0.03, 24),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.6 })
    );
    woofer.rotation.x = Math.PI / 2;
    woofer.position.set(0, 0.22, 0.19);
    speakerGroup.add(woofer);

    // Tweeter
    const tweeter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.02, 0.02, 20),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9 })
    );
    tweeter.rotation.x = Math.PI / 2;
    tweeter.position.set(0, 0.45, 0.19);
    speakerGroup.add(tweeter);

    // --- G. Holographic Cloud Core / Floating Tech Matrix ---
    const cloudCoreGroup = new THREE.Group();
    cloudCoreGroup.position.set(0, 2.5, -0.4);
    workstationRig.add(cloudCoreGroup);

    // Central Polyhedral Core
    const coreMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.24, 0),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          roughness: 0.1,
          metalness: 0.9,
          wireframe: false,
          emissive: new THREE.Color(0x06b6d4),
          emissiveIntensity: 0.4,
        })
      )
    );
    cloudCoreGroup.add(coreMesh);

    // Inner glowing sphere
    const innerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    cloudCoreGroup.add(innerGlow);

    // Orbital Ring 1
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.008, 12, 48),
      new THREE.MeshBasicMaterial({ color: 0x818cf8 })
    );
    cloudCoreGroup.add(ring1);

    // Orbital Ring 2
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.68, 0.008, 12, 48),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    ring2.rotation.x = Math.PI / 3;
    cloudCoreGroup.add(ring2);

    // Floating Platform Badges / Satellite nodes (React, Swift, TypeScript, Node)
    const satelliteGroup = new THREE.Group();
    cloudCoreGroup.add(satelliteGroup);

    const satGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const satColors = [0x38bdf8, 0xf97316, 0x3b82f6, 0x22c55e];
    const satellites: THREE.Mesh[] = [];

    for (let s = 0; s < 4; s++) {
      const sat = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: satColors[s] }));
      satelliteGroup.add(sat);
      satellites.push(sat);
    }

    interactiveTargets.push({
      mesh: coreMesh,
      id: 'tech-core',
      label: 'Cloud & Fullstack Tech Core',
    });

    // 8b. Per-Device Soft Contact Shadows (grounds each object onto the desk mat)
    function addContactShadow(
      parent: THREE.Object3D,
      width: number,
      depth: number,
      opacity: number,
      y = 0.002
    ) {
      const blob = new THREE.Mesh(
        new THREE.PlaneGeometry(width, depth),
        new THREE.MeshBasicMaterial({
          map: contactShadowTex,
          transparent: true,
          opacity,
          depthWrite: false,
        })
      );
      blob.rotation.x = -Math.PI / 2;
      blob.position.y = y;
      parent.add(blob);
      return blob;
    }

    addContactShadow(monitorRig, 0.95, 0.55, 0.45);
    addContactShadow(phoneGroup, 0.3, 0.3, 0.4);
    addContactShadow(tabletGroup, 0.55, 0.38, 0.4);
    addContactShadow(keyboardGroup, 1.05, 0.42, 0.4);
    addContactShadow(mouseGroup, 0.22, 0.22, 0.35);
    addContactShadow(speakerGroup, 0.48, 0.48, 0.4);

    // 8c. Additive Glow Sprites — lightweight bloom-like halo on key emissive accents
    // (billboarded, additive-blended sprites; avoids post-processing pipeline entirely
    // so it can't wash out the PBR/clearcoat screens the way a full-scene bloom pass did)
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const glowCtx = glowCanvas.getContext('2d')!;
    const glowGrad = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    glowGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
    glowGrad.addColorStop(0.35, 'rgba(255,255,255,0.3)');
    glowGrad.addColorStop(1, 'rgba(255,255,255,0)');
    glowCtx.fillStyle = glowGrad;
    glowCtx.fillRect(0, 0, 128, 128);
    const glowTex = new THREE.CanvasTexture(glowCanvas);

    function addGlowSprite(
      parent: THREE.Object3D,
      color: number,
      size: number,
      opacity: number,
      position: [number, number, number] = [0, 0, 0]
    ) {
      const mat = trackMat(
        new THREE.SpriteMaterial({
          map: glowTex,
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(size, size, 1);
      sprite.position.set(...position);
      parent.add(sprite);
      return sprite;
    }

    addGlowSprite(cloudCoreGroup, 0x38bdf8, 0.8, 0.85); // tech-core halo (the focal glow)
    addGlowSprite(monitorScreenGroup, 0x38bdf8, 0.55, 0.3, [0, 0, 0.02]);
    addGlowSprite(phoneBody, 0x06b6d4, 0.24, 0.35, [0, 0, 0.02]);
    addGlowSprite(tabletBody, 0x38bdf8, 0.34, 0.3, [0, 0, 0.02]);
    addGlowSprite(mouseGroup, 0x38bdf8, 0.12, 0.6, [0, 0.05, -0.02]);

    // 9. Camera Preset Positions & Targets
    const PRESETS = {
      OVERVIEW: {
        pos: new THREE.Vector3(0, 2.7, 4.4),
        target: new THREE.Vector3(0, 1.25, 0),
      },
      MOBILE_LAB: {
        pos: new THREE.Vector3(1.1, 1.6, 1.15),
        target: new THREE.Vector3(1.05, 1.28, 0.15),
      },
      CODE_STATION: {
        pos: new THREE.Vector3(0, 1.7, 0.95),
        target: new THREE.Vector3(0, 1.66, -0.45),
      },
      TECH_CORE: {
        pos: new THREE.Vector3(0, 2.7, 1.2),
        target: new THREE.Vector3(0, 2.45, -0.4),
      },
    };

    // 10. Pointer Raycasting for Hotspots
    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);
      const meshesToTest = interactiveTargets.map((t) => t.mesh);
      const hits = _raycaster.intersectObjects(meshesToTest, true);

      if (hits.length > 0) {
        const hitMesh = hits[0].object;
        const target = interactiveTargets.find(
          (t) => t.mesh === hitMesh || t.mesh.children.includes(hitMesh)
        );
        if (target) {
          soundManager.playClick();
          onSelectHotspot(target.id);
          if (target.id === 'mobile-lab') onPresetChange?.('MOBILE_LAB');
          else if (target.id === 'web-workstation') onPresetChange?.('CODE_STATION');
          else if (target.id === 'tech-core') onPresetChange?.('TECH_CORE');
        }
      }
    };

    renderer.domElement.addEventListener('click', handlePointerDown);

    // 11. Lighting Preset Applier
    function applyLighting(preset: LightingPreset) {
      if (preset === 'CYBER_NEON') {
        keyLight.color.setHex(0x38bdf8);
        keyLight.intensity = 2.4;
        hemiLight.color.setHex(0x06b6d4);
        hemiLight.groundColor.setHex(0x3b0764);
        rimLight.color.setHex(0xd946ef);
        rimLight.intensity = 2.2;
        accentPointLight.color.setHex(0x06b6d4);
        scene.fog?.color.setHex(0x08091a);
        scene.background = new THREE.Color(0x08091a);
      } else if (preset === 'STUDIO_CLEAN') {
        keyLight.color.setHex(0xfff8ee);
        keyLight.intensity = 3.0;
        hemiLight.color.setHex(0x94a3b8);
        hemiLight.groundColor.setHex(0x1e293b);
        rimLight.color.setHex(0xe2e8f0);
        rimLight.intensity = 1.6;
        accentPointLight.color.setHex(0x38bdf8);
        scene.fog?.color.setHex(0x0f172a);
        scene.background = new THREE.Color(0x0f172a);
      } else {
        // DEEP_OBSIDIAN
        keyLight.color.setHex(0x38bdf8);
        keyLight.intensity = 1.8;
        hemiLight.color.setHex(0x1e293b);
        hemiLight.groundColor.setHex(0x020617);
        rimLight.color.setHex(0x6366f1);
        rimLight.intensity = 1.6;
        accentPointLight.color.setHex(0x0ea5e9);
        scene.fog?.color.setHex(0x030712);
        scene.background = new THREE.Color(0x030712);
      }
    }

    // 12. Resize Handler — on narrow/portrait viewports, dolly the camera back
    // (relative to each preset's target) so the whole rig stays in frame instead
    // of being cropped. Presets themselves are untouched; this just scales distance.
    const FIT_REFERENCE_ASPECT = 1.6; // the aspect the presets were tuned for
    let cameraFitScale = 1;
    const updateCameraFitScale = (w: number, h: number) => {
      const aspect = w / h;
      cameraFitScale = THREE.MathUtils.clamp(FIT_REFERENCE_ASPECT / aspect, 1, 2.15);
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updateCameraFitScale(w, h);
    };
    updateCameraFitScale(width, height);
    window.addEventListener('resize', handleResize);

    // 13. Smooth Render Loop (Paced for Software WebGL & Lossless 60fps)
    let animationFrameId = 0;
    let clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          animationFrameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          animationFrameId = window.setTimeout(cb, 80);
        }
      };
      animationFrameId = window.setTimeout(poll, 5);
    }

    let currentPreset = cameraPreset;
    let currentExploded = explodedProgress;

    function tick() {
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();
      const state = stateRef.current;

      // Update Dynamic Screen Textures
      codeScreen.update(elapsedTime);
      mobileScreen.update(elapsedTime);
      tabletScreen.update(elapsedTime);

      // Rotate Cloud Core & Satellites
      coreMesh.rotation.y = elapsedTime * 0.4;
      coreMesh.rotation.x = elapsedTime * 0.2;
      ring1.rotation.z = elapsedTime * 0.5;
      ring2.rotation.y = -elapsedTime * 0.35;

      satellites.forEach((sat, i) => {
        const angle = elapsedTime * 0.8 + (i * Math.PI) / 2;
        const rad = 0.82;
        sat.position.set(Math.cos(angle) * rad, Math.sin(angle * 1.5) * 0.15, Math.sin(angle) * rad);
        sat.rotation.x = elapsedTime;
        sat.rotation.y = elapsedTime;
      });

      // Smooth Camera Interpolation towards Target Preset
      const activePresetConfig = PRESETS[state.cameraPreset] || PRESETS.OVERVIEW;
      _vCamPos.copy(activePresetConfig.pos);
      _vCamTarget.copy(activePresetConfig.target);

      // Dolly back proportionally on narrow/portrait screens so the rig fits in frame
      if (cameraFitScale > 1.001) {
        _vDollyOffset.copy(_vCamPos).sub(_vCamTarget).multiplyScalar(cameraFitScale);
        _vCamPos.copy(_vCamTarget).add(_vDollyOffset);
      }

      // Damped camera motion: 1 - Math.exp(-k * dt)
      const dampFactor = 1 - Math.exp(-5.0 * dt);
      camera.position.lerp(_vCamPos, dampFactor);
      controls.target.lerp(_vCamTarget, dampFactor);
      controls.autoRotate = state.autoRotate;
      controls.autoRotateSpeed = 0.8;
      controls.update();

      // Smooth Exploded View Layer Separation
      currentExploded = THREE.MathUtils.damp(currentExploded, state.explodedProgress, 6.0, dt);
      if (currentExploded > 0.001) {
        monitorDisplay.position.z = 0.015 + currentExploded * 0.35;
        monitorGlass.position.z = 0.025 + currentExploded * 0.6;
        monitorBack.position.z = -0.02 - currentExploded * 0.25;

        phoneScreen.position.z = 0.014 + currentExploded * 0.22;
        phoneGlass.position.z = 0.018 + currentExploded * 0.42;
        camBump.position.z = -0.018 - currentExploded * 0.2;

        keyInstMesh.position.y = currentExploded * 0.12;
        cloudCoreGroup.position.y = 2.5 + currentExploded * 0.6;
      } else {
        monitorDisplay.position.z = 0.015;
        monitorGlass.position.z = 0.025;
        monitorBack.position.z = -0.02;
        phoneScreen.position.z = 0.014;
        phoneGlass.position.z = 0.018;
        camBump.position.z = -0.018;
        keyInstMesh.position.y = 0;
        cloudCoreGroup.position.y = 2.5;
      }

      // Wireframe Mode
      managedMaterials.forEach((m) => {
        if ('wireframe' in m) {
          (m as THREE.MeshStandardMaterial).wireframe = state.wireframe;
        }
      });

      // Lighting updates
      applyLighting(state.lightingPreset);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    }

    // Pre-warm shaders
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    tick();

    // 14. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handlePointerDown);

      controls.dispose();
      contactShadowTex.dispose();
      glowTex.dispose();
      deskMatTexture.dispose();
      codeScreen.texture.dispose();
      mobileScreen.texture.dispose();
      tabletScreen.texture.dispose();

      managedMaterials.forEach((m) => m.dispose());
      scene.clear();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full select-none">
      {/* Three.js Canvas Container mounted stably outside React re-rendering tree */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
