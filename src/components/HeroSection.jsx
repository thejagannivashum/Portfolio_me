import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './Icons';
import { personalInfo } from '../data/portfolioData';
import SpatialFlightDeck from './SpatialFlightDeck';
import Card3DTilt from './Card3DTilt';

const ROLES = [
  '3rd-Year AI & ML Student',
  'Python, C++ & Java Programmer',
  'Computer Vision & NLP Explorer',
  'Web Development Builder',
  'Technology Enthusiast'
];

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    const updateSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentRole.substring(0, displayText.length + 1));
        if (displayText === currentRole) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }
      }
    }, updateSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        paddingTop: '7.5rem',
        paddingBottom: '4rem',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}
        >
          {/* Left Column: Hero Typography & CTAs */}
          <div style={{ zIndex: 2 }}>
            <div className="section-badge" style={{ marginBottom: '1.2rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-color)',
                  boxShadow: '0 0 10px var(--accent-color)'
                }}
              />
              {personalInfo.college} • {personalInfo.currentYear}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                color: 'var(--accent-color)',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em'
              }}
            >
              HELLO, I'M {personalInfo.name.toUpperCase()}
            </div>

            <h1
              className="cyber-shimmer-text"
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
                lineHeight: 1.1,
                marginBottom: '1.2rem',
                fontWeight: 800,
                cursor: 'default'
              }}
            >
              Building. Learning. <br />
              <span className="gradient-text">Exploring AI.</span>
            </h1>

            {/* Dynamic Typewriter Role */}
            <div
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.35rem)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem',
                minHeight: '2.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{ color: 'var(--accent-color)' }}>&gt; </span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{displayText}</span>
              <span style={{ animation: 'pulseSlow 1s infinite', color: 'var(--accent-color)' }}>_</span>
            </div>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                maxWidth: '540px',
                marginBottom: '2rem'
              }}
            >
              {personalInfo.tagline}
            </p>

            {/* CTAs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
                marginBottom: '2.5rem'
              }}
            >
              <a href="#about" className="btn btn-primary magnetic-btn">
                Explore My Journey
                <ArrowRight size={17} />
              </a>

              <a href="#contact" className="btn btn-secondary magnetic-btn">
                Let's Connect
              </a>

              <a
                href={personalInfo.socials.github}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.85rem', borderRadius: '12px' }}
                aria-label="Jagannivash's GitHub Profile"
                title="GitHub Profile"
              >
                <GithubIcon size={18} />
              </a>

              <a
                href={personalInfo.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.85rem', borderRadius: '12px' }}
                aria-label="Jagannivash's LinkedIn Profile"
                title="LinkedIn Profile"
              >
                <LinkedinIcon size={18} />
              </a>

              <a
                href={personalInfo.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.85rem', borderRadius: '12px' }}
                aria-label="Jagannivash's Instagram Profile"
                title="Instagram Profile"
              >
                <InstagramIcon size={18} />
              </a>
            </div>

            {/* Honest Identity Highlights Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-color)' }}>
                  B.Tech AI & ML
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  ACADEMIC DEGREE
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
                  Saveetha Engg
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  COLLEGE (3RD YEAR)
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
                  Grad: 2028
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  CHENNAI, INDIA
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Tactical Holo-Flight Deck */}
          <div style={{ position: 'relative', minHeight: '480px' }}>
            {/* Background Ambient Glow */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '420px',
                height: '420px',
                background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
                filter: 'blur(80px)',
                zIndex: 0,
                pointerEvents: 'none'
              }}
            />

            {/* Spatial Flight Deck HUD Component */}
            <Card3DTilt maxTilt={5} elevateZ={20}>
              <SpatialFlightDeck />
            </Card3DTilt>
          </div>
        </div>
      </div>
    </section>
  );
}
