import { useEffect } from 'react';
import { X, CheckCircle, Sparkles, Layers } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(3, 5, 12, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          background: 'rgba(12, 17, 36, 0.95)',
          border: '1px solid var(--border-card-hover)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px var(--accent-glow)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close project modal"
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={18} />
        </button>

        {/* Project Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span className="section-badge" style={{ marginBottom: '0.8rem' }}>
            <Sparkles size={12} />
            {project.category.toUpperCase()}
          </span>
          <h2 id="modal-project-title" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {project.title}
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--accent-color)', fontFamily: 'var(--font-heading)' }}>
            {project.tagline}
          </p>
        </div>

        {/* Hero Image */}
        <div
          style={{
            width: '100%',
            height: '260px',
            borderRadius: '14px',
            overflow: 'hidden',
            marginBottom: '1.75rem',
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              padding: '6px 12px',
              background: 'rgba(7, 9, 19, 0.85)',
              backdropFilter: 'blur(8px)',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-color)'
            }}
          >
            ● {project.status}
          </div>
        </div>

        {/* Full Description */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', color: 'var(--text-main)' }}>
            Exploration Overview
          </h4>
          <p style={{ lineHeight: 1.75, fontSize: '0.98rem', color: 'var(--text-muted)' }}>
            {project.description}
          </p>
        </div>

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--text-main)' }}>
              Key Focus & Implementation Goals
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {project.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle size={16} color="var(--accent-color)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Pills */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--text-main)' }}>
            Technologies & Tools
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {project.tags.map((t) => (
              <span key={t} className="tech-pill" style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}>
                <Layers size={13} color="var(--accent-color)" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            <GithubIcon size={16} />
            Explore on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
