import { useRef, useEffect } from 'react';

/**
 * Card3DTilt: Physical 3D Floating Glassmorphic Container
 * 
 * Features:
 * - Multi-layer Z-space depth separation (elevates inner elements)
 * - Inertial spring physics (lerped rotation for tactile weight)
 * - Virtual light tracking: dynamic specular sheen + edge glow
 * - Touch-safe fallback for mobile
 */
export default function Card3DTilt({
  children,
  className = '',
  maxTilt = 10,
  glare = true,
  elevateZ = 20,
  style = {},
  onClick
}) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const borderLightRef = useRef(null);
  const isTouchDevice = useRef(false);

  // Animation frame state for smooth lerped physics
  const animState = useRef({
    currentRotX: 0,
    currentRotY: 0,
    targetRotX: 0,
    targetRotY: 0,
    isHovered: false,
    rafId: null
  });

  useEffect(() => {
    isTouchDevice.current = window.matchMedia('(pointer: coarse)').matches;

    const state = animState.current;
    const card = cardRef.current;
    if (!card) return;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const updatePhysics = () => {
      state.currentRotX = lerp(state.currentRotX, state.targetRotX, 0.12);
      state.currentRotY = lerp(state.currentRotY, state.targetRotY, 0.12);

      const scale = state.isHovered ? 1.02 : 1;

      card.style.transform = `perspective(1200px) rotateX(${state.currentRotX.toFixed(3)}deg) rotateY(${state.currentRotY.toFixed(3)}deg) scale3d(${scale}, ${scale}, ${scale})`;

      // Keep RAF running while motion is significant or card is hovered
      const diff = Math.abs(state.currentRotX - state.targetRotX) + Math.abs(state.currentRotY - state.targetRotY);
      if (state.isHovered || diff > 0.05) {
        state.rafId = requestAnimationFrame(updatePhysics);
      } else {
        card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        state.rafId = null;
      }
    };

    const startAnimation = () => {
      if (!state.rafId) {
        state.rafId = requestAnimationFrame(updatePhysics);
      }
    };

    const handleMouseMove = (e) => {
      if (isTouchDevice.current || !cardRef.current) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      state.targetRotX = ((y - centerY) / centerY) * -maxTilt;
      state.targetRotY = ((x - centerX) / centerX) * maxTilt;
      state.isHovered = true;

      startAnimation();

      // Specular glare reflection tracking
      if (glare && glareRef.current) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glareRef.current.style.background = `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255, 255, 255, 0.38), transparent 60%)`;
        glareRef.current.style.opacity = '0.25';
      }

      // Border edge illumination tracking
      if (borderLightRef.current) {
        const lightAngle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 180;
        borderLightRef.current.style.background = `linear-gradient(${lightAngle.toFixed(1)}deg, var(--border-card-hover) 0%, transparent 60%)`;
        borderLightRef.current.style.opacity = '1';
      }
    };

    const handleMouseEnter = () => {
      if (isTouchDevice.current) return;
      state.isHovered = true;
      startAnimation();
    };

    const handleMouseLeave = () => {
      if (isTouchDevice.current) return;
      state.targetRotX = 0;
      state.targetRotY = 0;
      state.isHovered = false;

      if (glare && glareRef.current) {
        glareRef.current.style.opacity = '0';
        glareRef.current.style.transition = 'opacity 0.4s ease';
      }
      if (borderLightRef.current) {
        borderLightRef.current.style.opacity = '0';
        borderLightRef.current.style.transition = 'opacity 0.4s ease';
      }

      startAnimation();
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      if (state.rafId) cancelAnimationFrame(state.rafId);
    };
  }, [maxTilt, glare]);

  return (
    <div
      ref={cardRef}
      className={`glass-card ${className}`}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        position: 'relative',
        willChange: 'transform',
        ...style
      }}
    >
      {/* Dynamic Border Edge Illumination */}
      <div
        ref={borderLightRef}
        style={{
          position: 'absolute',
          inset: '-1px',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          zIndex: 2
        }}
      />

      {/* Specular Glare Reflection Layer */}
      {glare && (
        <div
          ref={glareRef}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            opacity: 0,
            transition: 'opacity 0.15s ease',
            zIndex: 3
          }}
        />
      )}

      {/* 3D Elevated Content Layer */}
      <div
        style={{
          transform: `translateZ(${elevateZ}px)`,
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 4
        }}
      >
        {children}
      </div>
    </div>
  );
}
