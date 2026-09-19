import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

export default function Preloader({ onComplete }) {
  const [stepText, setStepText] = useState('INITIALIZING NEURAL INTERFACE...');
  const [progress, setProgress] = useState(25);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStepText('CALIBRATING 3D TENSORS...');
      setProgress(70);
    }, 180);

    const t2 = setTimeout(() => {
      setStepText('SYSTEM READY.');
      setProgress(100);
    }, 380);

    const t3 = setTimeout(() => {
      setIsFading(true);
    }, 520);

    const t4 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 750);

    const handleSkip = () => {
      if (onComplete) onComplete();
    };

    window.addEventListener('keydown', handleSkip, { once: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('keydown', handleSkip);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: '#070913',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.25s ease',
        pointerEvents: isFading ? 'none' : 'auto',
        cursor: 'pointer'
      }}
      onClick={() => onComplete && onComplete()}
      title="Click or press any key to enter"
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--accent-color), #7928ca)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#070913',
          boxShadow: '0 0 25px var(--accent-glow)'
        }}
      >
        <Terminal size={22} strokeWidth={2.5} />
      </div>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.86rem',
          color: 'var(--accent-color)',
          letterSpacing: '0.1em',
          fontWeight: 600
        }}
      >
        {stepText}
      </div>

      {/* Minimal Progress Line */}
      <div
        style={{
          width: '180px',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--accent-color), #7928ca)',
            transition: 'width 0.2s ease'
          }}
        />
      </div>
    </div>
  );
}
