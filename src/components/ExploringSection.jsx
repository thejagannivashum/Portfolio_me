import { currentlyExploring } from '../data/portfolioData';
import Card3DTilt from './Card3DTilt';
import { Compass, Brain, Sparkles, Eye, MessageSquare, Globe, Code2 } from 'lucide-react';

export default function ExploringSection() {
  const iconMap = {
    Brain: <Brain size={24} color="var(--accent-color)" />,
    Sparkles: <Sparkles size={24} color="var(--accent-color)" />,
    Eye: <Eye size={24} color="var(--accent-color)" />,
    MessageSquare: <MessageSquare size={24} color="var(--accent-color)" />,
    Globe: <Globe size={24} color="var(--accent-color)" />,
    Code2: <Code2 size={24} color="var(--accent-color)" />
  };

  return (
    <section id="exploring" className="section-spacing">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-badge">
            <Compass size={14} />
            ACTIVE STUDY & EXPERIMENTATION
          </div>
          <h2 className="section-title">
            Currently <span className="gradient-text">Exploring</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            The primary technological frontiers where I am actively testing models, writing programs, and expanding my engineering horizons.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}
        >
          {currentlyExploring.map((item) => (
            <Card3DTilt
              key={item.title}
              maxTilt={9}
              elevateZ={18}
              style={{
                padding: '2.2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'rgba(12, 17, 36, 0.75)',
                border: '1px solid var(--border-card-hover)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'var(--accent-soft)',
                      border: '1px solid var(--border-card-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {iconMap[item.icon]}
                  </div>

                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent-color)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    {item.tag}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    color: 'var(--text-main)'
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.7,
                    marginBottom: '1.5rem'
                  }}
                >
                  {item.description}
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  {item.tech.map((t) => (
                    <span key={t} className="tech-pill">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Card3DTilt>
          ))}
        </div>
      </div>
    </section>
  );
}
