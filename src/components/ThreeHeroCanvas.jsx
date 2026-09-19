import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Orbit, RefreshCw } from 'lucide-react';

export default function ThreeHeroCanvas() {
  const containerRef = useRef(null);
  const [currentMode, setCurrentMode] = useState('plexus'); // 'plexus' | 'torus' | 'cyber'
  const [isRotating, setIsRotating] = useState(true);
  const currentModeRef = useRef('plexus');
  const isRotatingRef = useRef(true);
  const buildGeometryRef = useRef(null);
  const sceneRef = useRef(null);
  const animFrameId = useRef(null);
  const activeObjects = useRef({
    group: null,
    particles: null,
    lines: null,
    innerCore: null,
    rings: []
  });

  // Keep refs synchronized
  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    currentModeRef.current = currentMode;
    if (buildGeometryRef.current) {
      buildGeometryRef.current(currentMode);
    }
  }, [currentMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    activeObjects.current.group = rootGroup;

    // Get primary color from CSS variable
    const getAccentHex = () => {
      const computed = getComputedStyle(document.documentElement);
      const hue = computed.getPropertyValue('--accent-hue').trim() || '188';
      const color = new THREE.Color(`hsl(${hue}, 95%, 60%)`);
      return color;
    };

    let accentColor = getAccentHex();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(accentColor, 3, 50);
    pointLight1.position.set(10, 10, 15);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7928ca, 2.5, 50);
    pointLight2.position.set(-12, -10, -10);
    scene.add(pointLight2);

    // BUILD CURRENT MODE GEOMETRY
    const buildGeometry = (mode) => {
      // Clear previous children in rootGroup
      while (rootGroup.children.length > 0) {
        const obj = rootGroup.children[0];
        rootGroup.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      }
      activeObjects.current.rings = [];

      accentColor = getAccentHex();
      pointLight1.color = accentColor;

      if (mode === 'plexus') {
        // Plexus Sphere with interconnected points
        const particleCount = 220;
        const radius = 7.5;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
          const u = Math.random();
          const v = Math.random();
          const theta = u * 2.0 * Math.PI;
          const phi = Math.acos(2.0 * v - 1.0);
          const r = radius * (0.8 + Math.random() * 0.4);

          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = r * Math.cos(phi);

          velocities.push(
            (Math.random() - 0.5) * 0.012,
            (Math.random() - 0.5) * 0.012,
            (Math.random() - 0.5) * 0.012
          );
        }

        const pointGeo = new THREE.BufferGeometry();
        pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const pointMat = new THREE.PointsMaterial({
          color: accentColor,
          size: 0.28,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending
        });

        const points = new THREE.Points(pointGeo, pointMat);
        rootGroup.add(points);
        activeObjects.current.particles = { points, velocities, positions, count: particleCount };

        // Connecting lines buffer
        const maxLines = 450;
        const linePositions = new Float32Array(maxLines * 6);
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

        const lineMat = new THREE.LineBasicMaterial({
          color: accentColor,
          transparent: true,
          opacity: 0.25,
          blending: THREE.AdditiveBlending
        });

        const lines = new THREE.LineSegments(lineGeo, lineMat);
        rootGroup.add(lines);
        activeObjects.current.lines = { lines, linePositions };

        // Inner glowing core
        const coreGeo = new THREE.IcosahedronGeometry(2.8, 2);
        const coreMat = new THREE.MeshStandardMaterial({
          color: accentColor,
          wireframe: true,
          emissive: accentColor,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.45
        });
        const innerCore = new THREE.Mesh(coreGeo, coreMat);
        rootGroup.add(innerCore);
        activeObjects.current.innerCore = innerCore;

      } else if (mode === 'torus') {
        // High-tech quantum torus knot
        const torusGeo = new THREE.TorusKnotGeometry(4.8, 1.3, 140, 24, 2, 3);
        const torusMat = new THREE.MeshStandardMaterial({
          color: accentColor,
          wireframe: true,
          roughness: 0.2,
          metalness: 0.8,
          emissive: accentColor,
          emissiveIntensity: 0.35
        });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        rootGroup.add(torus);

        // Surrounding orbital ring
        const ringGeo = new THREE.RingGeometry(8, 8.2, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.3
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.5;
        rootGroup.add(ring);
        activeObjects.current.rings.push(ring);

      } else if (mode === 'cyber') {
        // Futuristic Cyber Gyroscope / Multi-ring sphere
        const baseCore = new THREE.Mesh(
          new THREE.SphereGeometry(2.2, 32, 32),
          new THREE.MeshStandardMaterial({
            color: 0x070913,
            roughness: 0.1,
            metalness: 0.9,
            emissive: accentColor,
            emissiveIntensity: 0.2
          })
        );
        rootGroup.add(baseCore);

        // 3 Gimbal Rings
        const ringConfigs = [
          { r: 4.6, rotX: 0.4, rotY: 0.2 },
          { r: 6.2, rotX: -0.6, rotY: 0.8 },
          { r: 7.8, rotX: 0.9, rotZ: 0.5 }
        ];

        ringConfigs.forEach((cfg) => {
          const rGeo = new THREE.TorusGeometry(cfg.r, 0.12, 16, 80);
          const rMat = new THREE.MeshStandardMaterial({
            color: accentColor,
            roughness: 0.3,
            metalness: 0.8,
            emissive: accentColor,
            emissiveIntensity: 0.3
          });
          const rMesh = new THREE.Mesh(rGeo, rMat);
          rMesh.rotation.set(cfg.rotX, cfg.rotY, cfg.rotZ || 0);
          rootGroup.add(rMesh);
          activeObjects.current.rings.push(rMesh);
        });

        // Surrounding dust points
        const count = 300;
        const dustPos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
          dustPos[i] = (Math.random() - 0.5) * 22;
          dustPos[i + 1] = (Math.random() - 0.5) * 22;
          dustPos[i + 2] = (Math.random() - 0.5) * 22;
        }
        const dustGeo = new THREE.BufferGeometry();
        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
        const dustMat = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.15,
          transparent: true,
          opacity: 0.6
        });
        const dust = new THREE.Points(dustGeo, dustMat);
        rootGroup.add(dust);
      }
    };

    buildGeometryRef.current = buildGeometry;
    buildGeometry(currentModeRef.current);

    // Interactive Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;

      if (isDragging) {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        rootGroup.rotation.y += deltaX * 0.008;
        rootGroup.rotation.x += deltaY * 0.008;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
      }
    };

    const handlePointerDown = (e) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // Watch for theme changes dynamically
    const observer = new MutationObserver(() => {
      accentColor = getAccentHex();
      pointLight1.color = accentColor;
      buildGeometry(currentModeRef.current);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Animation Loop
    const startTime = performance.now();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse follow
      if (!isDragging) {
        targetRotY = mouseX * 0.7;
        targetRotX = -mouseY * 0.7;

        rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.05;
        rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.05;

        if (isRotatingRef.current) {
          rootGroup.rotation.y += 0.0035;
        }
      }

      // Mode-specific animations
      const activeMode = currentModeRef.current;
      if (activeMode === 'plexus' && activeObjects.current.particles) {
        const { positions, velocities, count, points } = activeObjects.current.particles;
        for (let i = 0; i < count; i++) {
          positions[i * 3] += velocities[i * 3];
          positions[i * 3 + 1] += velocities[i * 3 + 1];
          positions[i * 3 + 2] += velocities[i * 3 + 2];

          // Boundary bounce
          const dist = Math.sqrt(
            positions[i * 3] ** 2 +
            positions[i * 3 + 1] ** 2 +
            positions[i * 3 + 2] ** 2
          );
          if (dist > 9.5 || dist < 4.5) {
            velocities[i * 3] *= -1;
            velocities[i * 3 + 1] *= -1;
            velocities[i * 3 + 2] *= -1;
          }
        }
        points.geometry.attributes.position.needsUpdate = true;

        // Update lines between nearby nodes
        if (activeObjects.current.lines) {
          const { lines, linePositions } = activeObjects.current.lines;
          let lineIdx = 0;
          const maxLines = 450;
          const maxDist = 3.3;

          for (let i = 0; i < count && lineIdx < maxLines; i++) {
            for (let j = i + 1; j < count && lineIdx < maxLines; j++) {
              const dx = positions[i * 3] - positions[j * 3];
              const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
              const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
              const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

              if (d < maxDist) {
                linePositions[lineIdx * 6] = positions[i * 3];
                linePositions[lineIdx * 6 + 1] = positions[i * 3 + 1];
                linePositions[lineIdx * 6 + 2] = positions[i * 3 + 2];
                linePositions[lineIdx * 6 + 3] = positions[j * 3];
                linePositions[lineIdx * 6 + 4] = positions[j * 3 + 1];
                linePositions[lineIdx * 6 + 5] = positions[j * 3 + 2];
                lineIdx++;
              }
            }
          }
          lines.geometry.setDrawRange(0, lineIdx * 2);
          lines.geometry.attributes.position.needsUpdate = true;
        }

        if (activeObjects.current.innerCore) {
          activeObjects.current.innerCore.rotation.x = elapsedTime * 0.4;
          activeObjects.current.innerCore.rotation.y = elapsedTime * 0.6;
        }
      }

      if (activeMode === 'torus') {
        rootGroup.children.forEach((child, i) => {
          if (i === 0) {
            child.rotation.x = elapsedTime * 0.3;
            child.rotation.y = elapsedTime * 0.45;
          }
        });
      }

      if (activeMode === 'cyber') {
        activeObjects.current.rings.forEach((ring, idx) => {
          const speed = (idx + 1) * 0.4;
          ring.rotation.z += 0.008 * speed;
          ring.rotation.x += 0.004 * speed;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId.current);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '480px' }}>
      {/* Three.js canvas mount */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '480px',
          cursor: 'grab',
          touchAction: 'none'
        }}
      />

      {/* Futuristic Floating 3D Controls Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          background: 'rgba(10, 15, 30, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '9999px',
          zIndex: 10,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}
      >
        <button
          onClick={() => setCurrentMode('plexus')}
          className="btn-mode"
          style={{
            background: currentMode === 'plexus' ? 'var(--accent-color)' : 'transparent',
            color: currentMode === 'plexus' ? '#070913' : 'var(--text-muted)',
            fontWeight: currentMode === 'plexus' ? '700' : '500',
            border: 'none',
            borderRadius: '20px',
            padding: '5px 12px',
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={13} />
          Plexus
        </button>

        <button
          onClick={() => setCurrentMode('torus')}
          className="btn-mode"
          style={{
            background: currentMode === 'torus' ? 'var(--accent-color)' : 'transparent',
            color: currentMode === 'torus' ? '#070913' : 'var(--text-muted)',
            fontWeight: currentMode === 'torus' ? '700' : '500',
            border: 'none',
            borderRadius: '20px',
            padding: '5px 12px',
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s ease'
          }}
        >
          <Orbit size={13} />
          Torus
        </button>

        <button
          onClick={() => setCurrentMode('cyber')}
          className="btn-mode"
          style={{
            background: currentMode === 'cyber' ? 'var(--accent-color)' : 'transparent',
            color: currentMode === 'cyber' ? '#070913' : 'var(--text-muted)',
            fontWeight: currentMode === 'cyber' ? '700' : '500',
            border: 'none',
            borderRadius: '20px',
            padding: '5px 12px',
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s ease'
          }}
        >
          <RefreshCw size={13} />
          Cyber
        </button>

        <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)', margin: '0 2px' }} />

        <button
          onClick={() => setIsRotating(!isRotating)}
          title="Toggle Auto Rotation"
          style={{
            background: isRotating ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            color: isRotating ? 'var(--accent-color)' : 'var(--text-dim)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          <RotateCw size={13} style={{ transform: isRotating ? 'rotate(0deg)' : 'none' }} />
        </button>
      </div>

      {/* Subtle Hint */}
      <span
        style={{
          position: 'absolute',
          top: '12px',
          right: '16px',
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          pointerEvents: 'none',
          letterSpacing: '0.05em'
        }}
      >
        [ DRAG TO ORBIT 3D ]
      </span>
    </div>
  );
}
