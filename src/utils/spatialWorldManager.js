/**
 * Spatial World Event Bus and Navigation Coordinator
 * Connects the full-page 3D WebGL Megastructure with the React UI Flight Deck
 */

export const SPATIAL_EVENTS = {
  JUMP_SECTOR: 'spatial:jump_sector',
  RESET_CAMERA: 'spatial:reset_camera',
  TELEMETRY_UPDATE: 'spatial:telemetry_update',
  WAYPOINT_HOVER: 'spatial:waypoint_hover'
};

export const SECTORS = [
  {
    id: 0,
    key: 'hero',
    name: 'CORE NEXUS // SINGULARITY',
    code: 'SEC-00',
    sectionId: 'hero',
    title: 'Executive Terminal',
    description: 'Central Quantum Core, AI Engineering Hub & Primary Directives',
    coords: { x: '00.0', y: '+02.0', z: '+28.0' },
    status: 'OPTIMAL'
  },
  {
    id: 1,
    key: 'about',
    name: 'BIOMETRIC ARCHIVE // DOSSIER',
    code: 'SEC-01',
    sectionId: 'about',
    title: 'Academic Dossier',
    description: 'Neural Architecture, Student Profile & Core Engineering Ethos',
    coords: { x: '-22.0', y: '-38.0', z: '-15.0' },
    status: 'ACTIVE'
  },
  {
    id: 2,
    key: 'skills',
    name: 'COMPUTE FOUNDRY // MATRIX',
    code: 'SEC-02',
    sectionId: 'skills',
    title: 'Synaptic Substrates',
    description: 'Languages, Deep Learning Frameworks & Machine Intelligence',
    coords: { x: '+26.0', y: '-78.0', z: '-10.0' },
    status: 'OVERCLOCKED'
  },
  {
    id: 3,
    key: 'projects',
    name: 'RESEARCH DRYDOCK // PORTALS',
    code: 'SEC-03',
    sectionId: 'projects',
    title: 'Production Prototypes',
    description: 'Live AI Systems, Computer Vision Portals & Deployed Codebases',
    coords: { x: '-18.0', y: '-122.0', z: '-25.0' },
    status: 'STABLE'
  },
  {
    id: 4,
    key: 'contact',
    name: 'SUB-SPACE UPLINK // COMM',
    code: 'SEC-04',
    sectionId: 'contact',
    title: 'Transmission Array',
    description: 'Direct Encrypted Channels, GitHub, LinkedIn & Communication',
    coords: { x: '00.0', y: '-175.0', z: '00.0' },
    status: 'LISTENING'
  }
];

export function jumpToSector(sectorId) {
  const sector = SECTORS.find((s) => s.id === sectorId);
  if (!sector) return;

  // 1. Dispatch WebGL Camera Trajectory Event
  window.dispatchEvent(
    new CustomEvent(SPATIAL_EVENTS.JUMP_SECTOR, {
      detail: { sectorId, sector }
    })
  );

  // 2. Smoothly scroll viewport to target DOM element
  const targetElement = document.getElementById(sector.sectionId);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function resetCameraView() {
  window.dispatchEvent(new CustomEvent(SPATIAL_EVENTS.RESET_CAMERA));
}

export function broadcastTelemetry(data) {
  window.dispatchEvent(
    new CustomEvent(SPATIAL_EVENTS.TELEMETRY_UPDATE, {
      detail: data
    })
  );
}

export function broadcastWaypointHover(data) {
  window.dispatchEvent(
    new CustomEvent(SPATIAL_EVENTS.WAYPOINT_HOVER, {
      detail: data
    })
  );
}
