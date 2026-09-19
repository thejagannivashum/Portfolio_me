import { personalInfo } from '../data/portfolioData';
import Card3DTilt from './Card3DTilt';
import { User, Sparkles, Compass, Rocket, CheckCircle2, GraduationCap } from 'lucide-react';

export default function AboutSection() {
  const philosophyIcons = [
    <Rocket size={22} color="var(--accent-color)" key="rocket" />,
    <Compass size={22} color="var(--accent-color)" key="compass" />,
    <Sparkles size={22} color="var(--accent-color)" key="sparkles" />
  ];

  return (
    <section id="about" className="section-spacing">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-badge">
            <User size={14} />
            BIOMETRIC & ACADEMIC DOSSIER
          </div>
          <h2 className="section-title">
            Curious by Nature, <span className="gradient-text">Driven by Code</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            A transparent overview of my academic foundation, engineering mindset, and hands-on explorations in artificial intelligence.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.2rem',
            alignItems: 'stretch'
          }}
        >
          {/* Personal Bio Card with 3D Depth */}
          <Card3DTilt
            maxTilt={8}
            elevateZ={22}
            style={{
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'rgba(12, 17, 36, 0.75)',
              border: '1px solid var(--border-card-hover)',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div>
              {/* Header with biometric status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: 'var(--accent-soft)',
                      border: '1px solid var(--border-card-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-color)',
                      boxShadow: '0 0 20px var(--accent-glow)'
                    }}
                  >
                    <GraduationCap size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.45rem', fontWeight: 800 }}>{personalInfo.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontFamily: 'var(--font-mono)' }}>
                      {personalInfo.degree}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
                  ACTIVE STUDENT
                </div>
              </div>

              {personalInfo.bio.map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '1.25rem', lineHeight: 1.8, fontSize: '0.98rem' }}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Academic & Geographic Quick Tags */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                paddingTop: '1.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {[
                'Saveetha Engineering College',
                '3rd Year Undergraduate',
                'Expected Graduation: 2028',
                'Chennai, Tamil Nadu',
                'AI & ML Exploration'
              ].map((item) => (
                <span key={item} className="tech-pill" style={{ fontSize: '0.82rem' }}>
                  <CheckCircle2 size={12} color="var(--accent-color)" />
                  {item}
                </span>
              ))}
            </div>
          </Card3DTilt>

          {/* Core Philosophy Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {personalInfo.learningPhilosophy.map((item, index) => (
              <Card3DTilt
                key={item.title}
                maxTilt={9}
                elevateZ={16}
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  flex: 1,
                  background: 'rgba(12, 17, 36, 0.65)',
                  border: '1px solid var(--border-card)'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'var(--accent-soft)',
                    border: '1px solid var(--border-card-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 0 15px var(--accent-glow)'
                  }}
                >
                  {philosophyIcons[index]}
                </div>

                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-muted)' }}>
                    {item.desc}
                  </p>
                </div>
              </Card3DTilt>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
