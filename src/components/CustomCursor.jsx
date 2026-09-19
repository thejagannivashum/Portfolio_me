import { useEffect, useRef } from 'react';

/**
 * Precision AI Tensor Reticle & Kinetic Synapse
 * 
 * Design Concept:
 * - Primary Anchor: 0ms lag, locked synchronously to client pointer.
 * - Kinetic Vector Ticks: Micro 4-corner targeting brackets [ + ] that dynamically
 *   respond to velocity, direction, and acceleration.
 * - Adaptive AI Acquisition: Morphologically adapts to buttons (lock-on brackets + magnetic pull),
 *   links (caret indicators), 3D canvas (spatial axis reticle), and project cards (scanner corners).
 * - Shutter Click: 120ms optical sensor pulse.
 * - Performance: 100% GPU transforms (translate3d), 0 React re-renders on move, disabled on touch.
 */
export default function CustomCursor() {
  const containerRef = useRef(null);
  const coreRef = useRef(null);
  const bracketsRef = useRef(null);
  const coordRef = useRef(null);
  const vectorRef = useRef(null);
  const canvasTrailRef = useRef(null);

  useEffect(() => {
    // Disable on touch / coarse devices
    const isFinePointer = window.matchMedia('(pointer: fine)').matches &&
                          !window.matchMedia('(pointer: coarse)').matches;
    if (!isFinePointer) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Add active class to body for custom cursor
    document.body.classList.add('precision-cursor-active');

    const core = coreRef.current;
    const brackets = bracketsRef.current;
    const coord = coordRef.current;
    const vectorLine = vectorRef.current;
    const canvas = canvasTrailRef.current;
    if (!core || !brackets || !canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Coordinate state (instant core, smoothed secondary ticks)
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let velocity = 0;
    let angle = 0;
    let isVisible = false;
    let isDown = false;
    let activeMagneticElement = null;

    // Hover state
    let hoverType = 'default'; // 'button' | 'link' | 'card' | 'canvas' | 'text' | 'default'

    // Cached accent hue to avoid getComputedStyle thrashing in RAF
    let cachedHue = '188';
    const updateCachedHue = () => {
      const computed = getComputedStyle(document.documentElement);
      cachedHue = computed.getPropertyValue('--accent-hue').trim() || '188';
    };
    updateCachedHue();

    const themeObserver = new MutationObserver(updateCachedHue);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Micro-sparks for clicks
    const sparks = [];

    // Pointer move: Synchronous zero-lag update for primary core
    const onPointerMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = x;
        ringY = y;
        if (containerRef.current) containerRef.current.style.opacity = '1';
      }

      const dx = x - mouseX;
      const dy = y - mouseY;
      velocity = Math.hypot(dx, dy);
      if (velocity > 1) {
        angle = Math.atan2(dy, dx);
      }

      mouseX = x;
      mouseY = y;

      // INSTANT PRIMARY CORE UPDATE (0ms lag, direct GPU composite)
      core.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      // Coordinate readout (throttled visually by velocity)
      if (coord && velocity > 2) {
        coord.textContent = `${Math.round(x)},${Math.round(y)}`;
      }

      // Check hovered element
      const target = e.target;
      if (!target) return;

      const btn = target.closest('button, .btn, [role="button"], .magnetic-btn');
      const link = target.closest('a');
      const card = target.closest('.glass-card');
      const canvasTarget = target.closest('canvas');
      const input = target.closest('input, textarea');

      // MAGNETIC BUTTON ATTRACTION
      if (btn) {
        hoverType = 'button';
        activeMagneticElement = btn;
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distFromCenter = Math.hypot(x - centerX, y - centerY);

        if (distFromCenter < 80) {
          const pullX = (x - centerX) * 0.22;
          const pullY = (y - centerY) * 0.22;
          btn.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0)`;
          btn.style.transition = 'transform 0.1s ease-out';
        }
      } else {
        if (activeMagneticElement) {
          activeMagneticElement.style.transform = 'translate3d(0, 0, 0)';
          activeMagneticElement.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
          activeMagneticElement = null;
        }

        if (link) {
          hoverType = 'link';
        } else if (canvasTarget && !canvasTarget.isEqualNode(canvas)) {
          hoverType = 'canvas';
        } else if (card) {
          hoverType = 'card';
        } else if (input) {
          hoverType = 'text';
        } else {
          hoverType = 'default';
        }
      }
    };

    const onPointerDown = () => {
      isDown = true;
      // Emit 4 precision orthogonal sparks on click
      if (!reducedMotion) {
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2;
          sparks.push({
            x: mouseX,
            y: mouseY,
            vx: Math.cos(a) * 4.5,
            vy: Math.sin(a) * 4.5,
            alpha: 0.9,
            life: 1
          });
        }
      }
    };

    const onPointerUp = () => {
      isDown = false;
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (containerRef.current) containerRef.current.style.opacity = '0';
      if (activeMagneticElement) {
        activeMagneticElement.style.transform = 'translate3d(0, 0, 0)';
        activeMagneticElement = null;
      }
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (containerRef.current) containerRef.current.style.opacity = '1';
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    // High-performance animation frame loop (handles secondary vector ticks & sparks)
    let animId;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const render = () => {
      animId = requestAnimationFrame(render);

      // Fast lerp for secondary targeting brackets (0.35 factor ensures instant tracking with high fluidity)
      const followFactor = reducedMotion ? 1 : 0.36;
      ringX = lerp(ringX, mouseX, followFactor);
      ringY = lerp(ringY, mouseY, followFactor);

      // Velocity decays smoothly
      velocity = lerp(velocity, 0, 0.15);

      // Dynamic Reticle Transformation
      let scale;
      let rot = 0;

      if (hoverType === 'button') {
        scale = isDown ? 1.25 : 1.55;
        rot = 45; // Diamond lock orientation on button acquisition
      } else if (hoverType === 'link') {
        scale = 1.35;
        rot = 0;
      } else if (hoverType === 'card') {
        scale = 1.45;
        rot = 0;
      } else if (hoverType === 'canvas') {
        scale = 1.5;
        rot = (Date.now() * 0.05) % 360; // Subtle continuous radar spin over 3D canvas
      } else {
        scale = isDown ? 0.85 : 1;
        // Kinetic vector tilt based on movement angle
        if (velocity > 3 && !reducedMotion) {
          rot = (angle * 180) / Math.PI;
        }
      }

      brackets.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${rot}deg) scale(${scale})`;

      // Kinetic Velocity Vector Line
      if (vectorLine && !reducedMotion) {
        if (velocity > 4 && hoverType === 'default') {
          const len = Math.min(velocity * 1.8, 24);
          vectorLine.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) rotate(${angle}rad)`;
          vectorLine.style.width = `${len}px`;
          vectorLine.style.opacity = `${Math.min(velocity / 18, 0.7)}`;
        } else {
          vectorLine.style.opacity = '0';
        }
      }

      // Render micro-sparks on 2D canvas
      ctx.clearRect(0, 0, width, height);

      if (sparks.length > 0) {
        for (let i = sparks.length - 1; i >= 0; i--) {
          const sp = sparks[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vx *= 0.88;
          sp.vy *= 0.88;
          sp.alpha *= 0.85;

          if (sp.alpha <= 0.03) {
            sparks.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${cachedHue}, 98%, 60%, ${sp.alpha})`;
          ctx.shadowColor = `hsl(${cachedHue}, 98%, 60%)`;
          ctx.shadowBlur = 4;
          ctx.fill();
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      themeObserver.disconnect();
      document.body.classList.remove('precision-cursor-active');
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      if (activeMagneticElement) {
        activeMagneticElement.style.transform = 'translate3d(0, 0, 0)';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0,
        transition: 'opacity 0.2s ease',
        contain: 'strict'
      }}
    >
      {/* Micro Sparks Canvas */}
      <canvas
        ref={canvasTrailRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />

      {/* Kinetic Velocity Vector Line */}
      <div
        ref={vectorRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '1.5px',
          background: 'linear-gradient(90deg, var(--accent-color), transparent)',
          transformOrigin: '0 50%',
          opacity: 0,
          pointerEvents: 'none',
          willChange: 'transform, opacity'
        }}
      />

      {/* Synchronous Precision Core (0ms latency dot) */}
      <div
        ref={coreRef}
        style={{
          position: 'absolute',
          top: '-2.5px',
          left: '-2.5px',
          width: '5px',
          height: '5px',
          borderRadius: '1px',
          background: '#ffffff',
          boxShadow: '0 0 8px var(--accent-color), 0 0 2px #ffffff',
          pointerEvents: 'none',
          willChange: 'transform'
        }}
      >
        {/* Micro coordinate HUD label */}
        <div
          ref={coordRef}
          style={{
            position: 'absolute',
            top: '-14px',
            left: '8px',
            fontSize: '8px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-color)',
            opacity: 0.65,
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Kinetic 4-Corner Targeting Brackets [ + ] */}
      <div
        ref={bracketsRef}
        style={{
          position: 'absolute',
          top: '-12px',
          left: '-12px',
          width: '24px',
          height: '24px',
          pointerEvents: 'none',
          willChange: 'transform',
          transition: 'border-color 0.2s ease'
        }}
      >
        {/* Top-Left Corner Tick */}
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '5px',
            height: '5px',
            borderTop: '1.5px solid var(--accent-color)',
            borderLeft: '1.5px solid var(--accent-color)'
          }}
        />
        {/* Top-Right Corner Tick */}
        <span
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '5px',
            height: '5px',
            borderTop: '1.5px solid var(--accent-color)',
            borderRight: '1.5px solid var(--accent-color)'
          }}
        />
        {/* Bottom-Left Corner Tick */}
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '5px',
            height: '5px',
            borderBottom: '1.5px solid var(--accent-color)',
            borderLeft: '1.5px solid var(--accent-color)'
          }}
        />
        {/* Bottom-Right Corner Tick */}
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '5px',
            height: '5px',
            borderBottom: '1.5px solid var(--accent-color)',
            borderRight: '1.5px solid var(--accent-color)'
          }}
        />
      </div>
    </div>
  );
}
