import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SPATIAL_EVENTS, SECTORS, jumpToSector, broadcastTelemetry, broadcastWaypointHover } from '../utils/spatialWorldManager';
import { Navigation } from 'lucide-react';

/**
 * SpatialWorldCanvas: Full-Viewport Interactive 3D Cybernetic Megastructure
 * 
 * Features:
 * - Colossal multi-tier 3D cybernetic environment (Core Nexus, Biometric Archive, Compute Foundry, Research Drydock, Sub-Space Uplink)
 * - Multi-depth scale: Foreground debris -> Midground megastructures -> Distant planetary rings -> Deep cosmic nebula
 * - Game-grade materials: Obsidian gunmetal, brushed titanium, translucent glass, and dynamic emissive conduits
 * - Real-time cinematic lighting: Key directional sun, deep violet rim, core singularity glow, and dynamic pointer searchlight
 * - Cinematic camera flight trajectory synchronized with page scroll and sector coordinates
 * - 3D Raycasting with interactive Holographic Waypoint Beacons that highlight on hover and fly camera on click
 * - Interactive Orbit / Free Drag mode with inertial damping and smooth auto-realign
 * - Real-time HUD broadcast of telemetry, sector coordinates, and camera vectors
 * - Auto-optimized for mobile with adaptive geometry density
 */
export default function SpatialWorldCanvas() {
  const containerRef = useRef(null);
  const [hoveredWaypoint, setHoveredWaypoint] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene & Atmosphere Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040711, 0.012);

    let width = window.innerWidth;
    let height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1200);
    camera.position.set(0, 2, 28);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: !isMobile,
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x040711, 1);
    container.appendChild(renderer.domElement);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Accent Color helper
    const getAccentColor = () => {
      const computed = getComputedStyle(document.documentElement);
      const hue = computed.getPropertyValue('--accent-hue').trim() || '188';
      const sat = computed.getPropertyValue('--accent-sat').trim() || '95%';
      const light = computed.getPropertyValue('--accent-light').trim() || '55%';
      return new THREE.Color(`hsl(${hue}, ${sat}, ${light})`);
    };

    let accentColor = getAccentColor();

    // 2. Cinematic Lighting System
    const ambientLight = new THREE.AmbientLight(0x162035, 1.4);
    scene.add(ambientLight);

    const sunKeyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunKeyLight.position.set(45, 55, 35);
    scene.add(sunKeyLight);

    const rimFillLight = new THREE.DirectionalLight(0x6366f1, 1.8);
    rimFillLight.position.set(-45, -35, -25);
    scene.add(rimFillLight);

    const coreSingularityLight = new THREE.PointLight(accentColor, 8, 45);
    coreSingularityLight.position.set(0, 0, 0);
    scene.add(coreSingularityLight);

    // Dynamic Tactical Pointer Light (sweeps over surfaces as mouse moves!)
    const pointerLight = new THREE.PointLight(accentColor, 4, 30);
    pointerLight.position.set(0, 0, 15);
    scene.add(pointerLight);

    // 3. Materials Library
    const darkObsidianMat = new THREE.MeshStandardMaterial({
      color: 0x050812,
      metalness: 0.95,
      roughness: 0.12
    });

    const brushedTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x18243b,
      metalness: 0.9,
      roughness: 0.28
    });

    const industrialAlloyMat = new THREE.MeshStandardMaterial({
      color: 0x0a1020,
      metalness: 0.85,
      roughness: 0.42
    });

    const translucentGlassMat = new THREE.MeshStandardMaterial({
      color: 0x121e36,
      metalness: 0.2,
      roughness: 0.08,
      transparent: true,
      opacity: 0.55
    });

    const emissiveAccentMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.8
    });

    const wireframeHoloMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    const dynamicAccentMaterials = [emissiveAccentMat, wireframeHoloMat];

    // ==========================================
    // SECTOR 00: CORE NEXUS & SINGULARITY (Hero Zone, Y: 0)
    // ==========================================
    const sector0Group = new THREE.Group();
    sector0Group.position.set(0, 0, 0);
    worldGroup.add(sector0Group);

    // Central Floating Obsidian Singularity Core
    const coreObelisk = new THREE.Mesh(new THREE.OctahedronGeometry(4.2, 0), darkObsidianMat);
    sector0Group.add(coreObelisk);

    const coreInnerOrb = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 24, 24),
      new THREE.MeshBasicMaterial({ color: accentColor })
    );
    sector0Group.add(coreInnerOrb);

    // 3 Precision Aerospace Gimbals
    const gimbals = [
      { r: 7.2, thick: 0.24, rx: 0.4, ry: 0.2, spd: 0.007 },
      { r: 9.6, thick: 0.28, rx: -0.6, ry: 0.8, spd: -0.005 },
      { r: 12.4, thick: 0.32, rx: 0.8, rz: 0.5, spd: 0.004 }
    ];
    const gimbalMeshes = [];

    gimbals.forEach((g) => {
      const ringGeo = new THREE.TorusGeometry(g.r, g.thick, 14, isMobile ? 32 : 64);
      const ringMesh = new THREE.Mesh(ringGeo, brushedTitaniumMat);
      ringMesh.rotation.set(g.rx, g.ry || 0, g.rz || 0);
      sector0Group.add(ringMesh);
      gimbalMeshes.push({ mesh: ringMesh, spd: g.spd });
    });

    // Massive Hexagonal Citadel Docking Platform
    const dockPlatform = new THREE.Mesh(
      new THREE.CylinderGeometry(18, 21, 2.2, 6),
      industrialAlloyMat
    );
    dockPlatform.position.y = -7.5;
    sector0Group.add(dockPlatform);

    const dockHazardRing = new THREE.Mesh(
      new THREE.RingGeometry(18.2, 18.6, 6),
      emissiveAccentMat
    );
    dockHazardRing.rotation.x = -Math.PI / 2;
    dockHazardRing.position.y = -6.38;
    sector0Group.add(dockHazardRing);

    // 6 Perimeter Monolithic Pylons around the Core
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const px = Math.cos(angle) * 16.5;
      const pz = Math.sin(angle) * 16.5;

      const pylon = new THREE.Mesh(new THREE.BoxGeometry(1.6, 30, 2.4), darkObsidianMat);
      pylon.position.set(px, 5, pz);
      pylon.rotation.y = angle + Math.PI / 2;
      sector0Group.add(pylon);

      const conduit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 29, 0.3), emissiveAccentMat);
      conduit.position.set(px * 0.96, 5, pz * 0.96);
      sector0Group.add(conduit);
    }

    // Overhead Cantilevered Trusses
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI;
      const truss = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 33), industrialAlloyMat);
      truss.position.set(0, 19.5, 0);
      truss.rotation.y = angle;
      sector0Group.add(truss);
    }

    // ==========================================
    // SECTOR 01: BIOMETRIC ARCHIVE VAULT (About Zone, Y: -38, X: -22, Z: -15)
    // ==========================================
    const sector1Group = new THREE.Group();
    sector1Group.position.set(-22, -38, -15);
    worldGroup.add(sector1Group);

    const archiveMonoliths = [];
    const monolithOffsets = [
      { x: -5, z: -4, h: 28 },
      { x: 5, z: -3, h: 32 },
      { x: -3, z: 5, h: 26 },
      { x: 4, z: 4, h: 30 }
    ];

    monolithOffsets.forEach((pos) => {
      const mono = new THREE.Mesh(new THREE.BoxGeometry(3.6, pos.h, 5.2), translucentGlassMat);
      mono.position.set(pos.x, pos.h / 2 - 14, pos.z);
      sector1Group.add(mono);

      const innerLattice = new THREE.Mesh(new THREE.BoxGeometry(2.8, pos.h - 2, 4.2), wireframeHoloMat);
      innerLattice.position.copy(mono.position);
      sector1Group.add(innerLattice);
      archiveMonoliths.push({ mono, lattice: innerLattice });
    });

    const scanRings = [];
    for (let i = 0; i < 3; i++) {
      const sRing = new THREE.Mesh(new THREE.TorusGeometry(10 + i * 2, 0.12, 8, 48), emissiveAccentMat);
      sRing.rotation.x = Math.PI / 2;
      sRing.position.y = -5 + i * 6;
      sector1Group.add(sRing);
      scanRings.push(sRing);
    }

    const memoryPrisms = [];
    for (let i = 0; i < 6; i++) {
      const prism = new THREE.Mesh(new THREE.OctahedronGeometry(1.2, 0), darkObsidianMat);
      prism.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 20);
      sector1Group.add(prism);
      memoryPrisms.push({ mesh: prism, rotSpd: (Math.random() - 0.5) * 0.02, baseY: prism.position.y });
    }

    // ==========================================
    // SECTOR 02: SYNAPTIC COMPUTE FOUNDRY (Skills Zone, Y: -78, X: 26, Z: -10)
    // ==========================================
    const sector2Group = new THREE.Group();
    sector2Group.position.set(26, -78, -10);
    worldGroup.add(sector2Group);

    const computeBase = new THREE.Mesh(new THREE.CylinderGeometry(15, 17, 1.4, 6), industrialAlloyMat);
    sector2Group.add(computeBase);

    const computeCores = [];
    for (let r = 0; r < 2; r++) {
      const count = r === 0 ? 4 : 8;
      const rad = r === 0 ? 5.5 : 11;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (r * 0.3);
        const cx = Math.cos(angle) * rad;
        const cz = Math.sin(angle) * rad;

        const coreCube = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.8), darkObsidianMat);
        coreCube.position.set(cx, 1.8, cz);
        sector2Group.add(coreCube);

        const coreEmitter = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.2), emissiveAccentMat);
        coreEmitter.position.set(cx, 2.8, cz);
        sector2Group.add(coreEmitter);

        computeCores.push({ cube: coreCube, emitter: coreEmitter, phase: i });
      }
    }

    const busbarRing = new THREE.Mesh(new THREE.TorusGeometry(11, 0.16, 8, 48), brushedTitaniumMat);
    busbarRing.rotation.x = Math.PI / 2;
    busbarRing.position.y = 1.4;
    sector2Group.add(busbarRing);

    const pulseCount = 8;
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    const pulseMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.85,
      blending: THREE.AdditiveBlending
    });
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    sector2Group.add(pulsePoints);

    // ==========================================
    // SECTOR 03: RESEARCH DRYDOCK & PROJECT PORTALS (Projects Zone, Y: -122, X: -18, Z: -25)
    // ==========================================
    const sector3Group = new THREE.Group();
    sector3Group.position.set(-18, -122, -25);
    worldGroup.add(sector3Group);

    const drydockArch = new THREE.Mesh(new THREE.TorusGeometry(18, 1.5, 12, 48, Math.PI), brushedTitaniumMat);
    drydockArch.rotation.z = Math.PI;
    drydockArch.position.y = 4;
    sector3Group.add(drydockArch);

    const projectPortals = [];
    [-9, 0, 9].forEach((xOffset, idx) => {
      const portalRing = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.28, 12, 36), emissiveAccentMat);
      portalRing.position.set(xOffset, 4, (idx % 2) * 3);
      sector3Group.add(portalRing);

      const innerPrism = new THREE.Mesh(new THREE.IcosahedronGeometry(2.0, 1), wireframeHoloMat);
      innerPrism.position.copy(portalRing.position);
      sector3Group.add(innerPrism);

      projectPortals.push({ ring: portalRing, prism: innerPrism, spd: (idx + 1) * 0.008 });
    });

    const craneArm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 32), industrialAlloyMat);
    craneArm.position.set(0, 19, 0);
    craneArm.rotation.y = 0.4;
    sector3Group.add(craneArm);

    // ==========================================
    // SECTOR 04: SUB-SPACE UPLINK SPHERICAL ARRAY (Contact Zone, Y: -175, X: 0, Z: 0)
    // ==========================================
    const sector4Group = new THREE.Group();
    sector4Group.position.set(0, -175, 0);
    worldGroup.add(sector4Group);

    const dishGeo = new THREE.SphereGeometry(15, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.38);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0x141f33,
      roughness: 0.2,
      metalness: 0.9,
      side: THREE.DoubleSide
    });
    const uplinkDish = new THREE.Mesh(dishGeo, dishMat);
    uplinkDish.rotation.x = Math.PI;
    uplinkDish.position.y = -6;
    sector4Group.add(uplinkDish);

    const spireMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 1.8, 55, 12), darkObsidianMat);
    spireMesh.position.y = 20;
    sector4Group.add(spireMesh);

    const beamGeo = new THREE.CylinderGeometry(0.9, 6.0, 140, 24, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const transmissionBeam = new THREE.Mesh(beamGeo, beamMat);
    transmissionBeam.position.y = 70;
    sector4Group.add(transmissionBeam);
    dynamicAccentMaterials.push(beamMat);

    const relaySatellites = [];
    for (let i = 0; i < 3; i++) {
      const sat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 2.4), darkObsidianMat);
      sector4Group.add(sat);
      relaySatellites.push({ mesh: sat, rad: 18 + i * 4, angle: (i / 3) * Math.PI * 2, spd: 0.012 - i * 0.003 });
    }

    // ==========================================
    // INTERACTIVE 3D WAYPOINT BEACONS
    // ==========================================
    const waypointConfigs = [
      { sectorId: 0, pos: [0, 4, 12], name: 'CORE NEXUS // HERO', desc: 'Central Quantum Compute' },
      { sectorId: 1, pos: [-22, -34, -4], name: 'BIOMETRIC ARCHIVE // ABOUT', desc: 'Neural Dossier & Academic Records' },
      { sectorId: 2, pos: [26, -74, 2], name: 'COMPUTE FOUNDRY // SKILLS', desc: 'AI Frameworks & Languages' },
      { sectorId: 3, pos: [-18, -118, -12], name: 'RESEARCH DRYDOCK // PROJECTS', desc: 'Deployed Systems & Code Portals' },
      { sectorId: 4, pos: [0, -168, 12], name: 'SUB-SPACE UPLINK // CONTACT', desc: 'Direct Transmission Array' }
    ];

    const interactiveWaypoints = [];
    const raycastHitMeshes = [];

    waypointConfigs.forEach((cfg) => {
      const wpGroup = new THREE.Group();
      wpGroup.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      worldGroup.add(wpGroup);

      const wpDiamond = new THREE.Mesh(new THREE.OctahedronGeometry(1.4, 0), emissiveAccentMat);
      wpGroup.add(wpDiamond);

      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.09, 8, 32), wireframeHoloMat);
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.07, 8, 32), wireframeHoloMat);
      ring2.rotation.x = Math.PI / 3;
      wpGroup.add(ring1, ring2);

      const hitSphereGeo = new THREE.SphereGeometry(4.0, 12, 12);
      const hitSphereMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitSphere = new THREE.Mesh(hitSphereGeo, hitSphereMat);
      hitSphere.userData = { waypointId: cfg.sectorId, name: cfg.name, desc: cfg.desc };
      wpGroup.add(hitSphere);
      raycastHitMeshes.push(hitSphere);

      interactiveWaypoints.push({
        ...cfg,
        diamond: wpDiamond,
        ring1,
        ring2
      });
    });

    // ==========================================
    // MULTI-DEPTH SCALE LAYERING
    // ==========================================
    // Foreground Micro-Debris
    const debrisCount = isMobile ? 120 : 300;
    const debrisPositions = new Float32Array(debrisCount * 3);
    for (let i = 0; i < debrisCount; i++) {
      debrisPositions[i * 3] = (Math.random() - 0.5) * 90;
      debrisPositions[i * 3 + 1] = Math.random() * -190 + 10;
      debrisPositions[i * 3 + 2] = (Math.random() - 0.5) * 60 + 15;
    }
    const debrisGeo = new THREE.BufferGeometry();
    debrisGeo.setAttribute('position', new THREE.BufferAttribute(debrisPositions, 3));
    const debrisMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.35,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const debrisPoints = new THREE.Points(debrisGeo, debrisMat);
    worldGroup.add(debrisPoints);

    // Giant Distant Planetary Ring
    const megaRingGeo = new THREE.RingGeometry(180, 260, isMobile ? 32 : 64);
    const megaRingMat = new THREE.MeshBasicMaterial({
      color: 0x172554,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28
    });
    const megaRing = new THREE.Mesh(megaRingGeo, megaRingMat);
    megaRing.position.set(0, -90, -320);
    megaRing.rotation.set(0.6, 0.4, 0);
    worldGroup.add(megaRing);

    // Horizon Cybernetic Grid
    const horizonGrid = new THREE.GridHelper(320, 50, accentColor, 0x111c33);
    horizonGrid.position.set(0, -220, -50);
    worldGroup.add(horizonGrid);

    // Deep Cosmic Nebula Starfield
    const starCount = isMobile ? 600 : 1400;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 450;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 450 - 80;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 400 - 150;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xc7d2fe,
      size: 0.42,
      transparent: true,
      opacity: 0.75
    });
    const stars = new THREE.Points(starGeo, starMat);
    worldGroup.add(stars);

    // ==========================================
    // DYNAMIC CAMERA FLIGHT CONTROLLER
    // ==========================================
    const cameraKnots = [
      { p: 0.0, cam: [0, 2, 28], target: [0, 0, 0], sector: 0 },
      { p: 0.22, cam: [-18, -32, 24], target: [-22, -38, -15], sector: 1 },
      { p: 0.48, cam: [22, -72, 28], target: [26, -78, -10], sector: 2 },
      { p: 0.72, cam: [-12, -114, 34], target: [-18, -122, -25], sector: 3 },
      { p: 0.86, cam: [0, -145, 24], target: [0, -150, -10], sector: 3 },
      { p: 1.0, cam: [0, -168, 28], target: [0, -175, 0], sector: 4 }
    ];

    let currentScrollProgress = 0;
    let targetScrollProgress = 0;

    let targetCamPos = new THREE.Vector3(0, 2, 28);
    let targetCamLookAt = new THREE.Vector3(0, 0, 0);

    let mouseNormX = 0;
    let mouseNormY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    let isDragging = false;
    let dragOrbitX = 0;
    let dragOrbitY = 0;
    let prevDragPointerX = 0;
    let prevDragPointerY = 0;

    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2(-999, -999);

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      targetScrollProgress = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handlePointerMove = (e) => {
      pointerNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;

      targetMouseX = pointerNDC.x;
      targetMouseY = pointerNDC.y;

      if (isDragging) {
        const deltaX = e.clientX - prevDragPointerX;
        const deltaY = e.clientY - prevDragPointerY;
        dragOrbitX += deltaX * 0.006;
        dragOrbitY += deltaY * 0.006;
        dragOrbitY = THREE.MathUtils.clamp(dragOrbitY, -Math.PI * 0.35, Math.PI * 0.35);
        prevDragPointerX = e.clientX;
        prevDragPointerY = e.clientY;
      }
    };

    const handlePointerDown = (e) => {
      if (e.target.closest('button, a, input, textarea')) return;
      isDragging = true;
      prevDragPointerX = e.clientX;
      prevDragPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleCanvasClick = (e) => {
      if (e.target.closest('button, a, input, textarea')) return;
      raycaster.setFromCamera(pointerNDC, camera);
      const intersects = raycaster.intersectObjects(raycastHitMeshes, true);
      if (intersects.length > 0) {
        const hit = intersects[0].object.userData;
        if (hit && hit.waypointId !== undefined) {
          jumpToSector(hit.waypointId);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('click', handleCanvasClick);

    const handleJumpEvent = () => {
      dragOrbitX = 0;
      dragOrbitY = 0;
    };
    window.addEventListener(SPATIAL_EVENTS.JUMP_SECTOR, handleJumpEvent);

    const handleResetEvent = () => {
      dragOrbitX = 0;
      dragOrbitY = 0;
    };
    window.addEventListener(SPATIAL_EVENTS.RESET_CAMERA, handleResetEvent);

    // Theme Mutation Observer
    const themeObserver = new MutationObserver(() => {
      accentColor = getAccentColor();
      coreSingularityLight.color = accentColor;
      pointerLight.color = accentColor;
      coreInnerOrb.material.color = accentColor;
      dynamicAccentMaterials.forEach((m) => {
        if (m.color) m.color = accentColor;
        if (m.emissive) m.emissive = accentColor;
      });
      horizonGrid.material.color = accentColor;
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // 4. Main Engine Animation Loop
    let animId;
    let lastTelemetryTime = performance.now();
    let activeHovered = null;

    const interpolateKnot = (progress) => {
      if (progress <= cameraKnots[0].p) return { cam: cameraKnots[0].cam, target: cameraKnots[0].target, sector: 0 };
      if (progress >= cameraKnots[cameraKnots.length - 1].p) {
        const last = cameraKnots[cameraKnots.length - 1];
        return { cam: last.cam, target: last.target, sector: last.sector };
      }

      for (let i = 0; i < cameraKnots.length - 1; i++) {
        const k1 = cameraKnots[i];
        const k2 = cameraKnots[i + 1];
        if (progress >= k1.p && progress <= k2.p) {
          const t = (progress - k1.p) / (k2.p - k1.p);
          const easeT = 0.5 - 0.5 * Math.cos(t * Math.PI);

          const cx = THREE.MathUtils.lerp(k1.cam[0], k2.cam[0], easeT);
          const cy = THREE.MathUtils.lerp(k1.cam[1], k2.cam[1], easeT);
          const cz = THREE.MathUtils.lerp(k1.cam[2], k2.cam[2], easeT);

          const tx = THREE.MathUtils.lerp(k1.target[0], k2.target[0], easeT);
          const ty = THREE.MathUtils.lerp(k1.target[1], k2.target[1], easeT);
          const tz = THREE.MathUtils.lerp(k1.target[2], k2.target[2], easeT);

          return { cam: [cx, cy, cz], target: [tx, ty, tz], sector: easeT > 0.5 ? k2.sector : k1.sector };
        }
      }
      return { cam: cameraKnots[0].cam, target: cameraKnots[0].target, sector: 0 };
    };

    const currentLookAt = new THREE.Vector3(0, 0, 0);

    const renderLoop = (time) => {
      animId = requestAnimationFrame(renderLoop);
      const elapsed = time * 0.001;

      const scrollLerpSpeed = prefersReducedMotion ? 0.2 : 0.065;
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * scrollLerpSpeed;
      mouseNormX += (targetMouseX - mouseNormX) * 0.08;
      mouseNormY += (targetMouseY - mouseNormY) * 0.08;

      const knotData = interpolateKnot(currentScrollProgress);
      targetCamPos.set(knotData.cam[0], knotData.cam[1], knotData.cam[2]);
      targetCamLookAt.set(knotData.target[0], knotData.target[1], knotData.target[2]);

      if (!isDragging) {
        dragOrbitX *= 0.985;
        dragOrbitY *= 0.985;
      }

      const orbitRadius = targetCamPos.distanceTo(targetCamLookAt);
      const baseAngle = Math.atan2(targetCamPos.x - targetCamLookAt.x, targetCamPos.z - targetCamLookAt.z);
      const finalAngle = baseAngle + dragOrbitX + mouseNormX * 0.15;

      const finalCamX = targetCamLookAt.x + Math.sin(finalAngle) * orbitRadius;
      const finalCamY = targetCamPos.y + dragOrbitY * 12 - mouseNormY * 2.5;
      const finalCamZ = targetCamLookAt.z + Math.cos(finalAngle) * orbitRadius;

      camera.position.lerp(new THREE.Vector3(finalCamX, finalCamY, finalCamZ), 0.08);

      currentLookAt.lerp(
        new THREE.Vector3(
          targetCamLookAt.x + mouseNormX * 1.5,
          targetCamLookAt.y + mouseNormY * 1.2,
          targetCamLookAt.z
        ),
        0.08
      );
      camera.lookAt(currentLookAt);

      // Dynamic Pointer Searchlight follows unprojected mouse
      const vector = new THREE.Vector3(mouseNormX, mouseNormY, 0.5).unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = 18;
      const pointerTargetPos = camera.position.clone().add(dir.multiplyScalar(distance));
      pointerLight.position.lerp(pointerTargetPos, 0.15);

      // Structure Animations
      coreObelisk.rotation.x = elapsed * 0.3;
      coreObelisk.rotation.y = elapsed * 0.45;
      coreSingularityLight.intensity = 6 + Math.sin(elapsed * 2.5) * 3;

      gimbalMeshes.forEach((g) => {
        g.mesh.rotation.z += g.spd;
        g.mesh.rotation.y += g.spd * 0.7;
      });

      archiveMonoliths.forEach((m, idx) => {
        m.lattice.rotation.y = elapsed * 0.2 * (idx % 2 === 0 ? 1 : -1);
      });
      scanRings.forEach((r, idx) => {
        r.rotation.z += 0.01 * (idx === 0 ? 1 : -1.2);
      });
      memoryPrisms.forEach((p) => {
        p.mesh.rotation.x += p.rotSpd;
        p.mesh.rotation.y += p.rotSpd * 1.5;
        p.mesh.position.y = p.baseY + Math.sin(elapsed * 1.5 + p.mesh.position.x) * 0.8;
      });

      computeCores.forEach((c) => {
        c.cube.rotation.y = elapsed * 0.25;
        c.emitter.material.emissiveIntensity = 0.5 + Math.sin(elapsed * 4 + c.phase) * 0.4;
      });

      for (let i = 0; i < pulseCount; i++) {
        const angle = elapsed * 1.2 + (i / pulseCount) * Math.PI * 2;
        pulsePositions[i * 3] = Math.cos(angle) * 11;
        pulsePositions[i * 3 + 1] = 1.4 + Math.sin(elapsed * 3 + i) * 0.4;
        pulsePositions[i * 3 + 2] = Math.sin(angle) * 11;
      }
      pulsePoints.geometry.attributes.position.needsUpdate = true;

      projectPortals.forEach((p) => {
        p.ring.rotation.z += p.spd;
        p.prism.rotation.x = elapsed * 0.35;
        p.prism.rotation.y = elapsed * 0.5;
      });

      transmissionBeam.rotation.y = elapsed * 0.2;
      relaySatellites.forEach((sat) => {
        sat.angle += sat.spd;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.rad;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.rad;
        sat.mesh.position.y = -6 + Math.sin(sat.angle * 2) * 2;
        sat.mesh.rotation.y = sat.angle + Math.PI / 2;
      });

      stars.rotation.y += 0.00015;
      horizonGrid.position.z = -50 + ((elapsed * 2) % 10);

      // Raycasting
      raycaster.setFromCamera(pointerNDC, camera);
      const intersects = raycaster.intersectObjects(raycastHitMeshes, true);

      let foundHovered = null;
      interactiveWaypoints.forEach((wp) => {
        wp.ring1.rotation.z += 0.015;
        wp.ring2.rotation.z -= 0.02;

        const isHit = intersects.length > 0 && intersects[0].object.userData.waypointId === wp.sectorId;
        if (isHit) {
          foundHovered = wp;
          wp.diamond.scale.set(1.4, 1.4, 1.4);
          wp.diamond.rotation.y += 0.06;
          wp.ring1.scale.set(1.2, 1.2, 1.2);
          wp.ring2.scale.set(1.2, 1.2, 1.2);
        } else {
          wp.diamond.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          wp.diamond.rotation.y += 0.015;
          wp.ring1.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          wp.ring2.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
      });

      if (foundHovered !== activeHovered) {
        activeHovered = foundHovered;
        setHoveredWaypoint(foundHovered);
        broadcastWaypointHover(foundHovered ? { name: foundHovered.name, desc: foundHovered.desc } : null);
      }

      if (time - lastTelemetryTime > 180) {
        broadcastTelemetry({
          camX: camera.position.x.toFixed(1),
          camY: camera.position.y.toFixed(1),
          camZ: camera.position.z.toFixed(1),
          sector: SECTORS[knotData.sector]?.name || 'UNKNOWN',
          sectorId: knotData.sector,
          progress: (currentScrollProgress * 100).toFixed(0)
        });
        lastTelemetryTime = time;
      }

      renderer.render(scene, camera);
    };

    renderLoop(performance.now());

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      themeObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener(SPATIAL_EVENTS.JUMP_SECTOR, handleJumpEvent);
      window.removeEventListener(SPATIAL_EVENTS.RESET_CAMERA, handleResetEvent);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'auto',
          touchAction: 'none',
          overflow: 'hidden'
        }}
      />

      {hoveredWaypoint && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(8, 12, 26, 0.88)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--accent-color)',
            boxShadow: '0 0 25px var(--accent-glow)',
            borderRadius: '12px',
            padding: '8px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 999,
            pointerEvents: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <Navigation size={14} color="var(--accent-color)" />
          <div>
            <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>
              {hoveredWaypoint.name}
            </span>
            <span style={{ color: 'var(--text-dim)', marginLeft: '8px' }}>
              • CLICK TO ENGAGE FLIGHT
            </span>
          </div>
        </div>
      )}
    </>
  );
}
