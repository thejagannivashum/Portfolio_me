import { educationData } from '../data/portfolioData';
import Card3DTilt from './Card3DTilt';
import { GraduationCap, Calendar, MapPin, BookOpen, CheckCircle2 } from 'lucide-react';

export default function EducationSection() {
  return (
    <section id="education" className="section-spacing" style={{ background: 'rgba(5, 8, 18, 0.4)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-badge">
            <GraduationCap size={14} />
            ACADEMIC FOUNDATION
          </div>
          <h2 className="section-title">
            Education & <span className="gradient-text">Academic Journey</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Current undergraduate degree program focusing on artificial intelligence, machine learning, and computer science principles.
          </p>
        </div>

        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <Card3DTilt
            maxTilt={7}
            elevateZ={20}
            style={{
              padding: '2.5rem',
              background: 'rgba(12, 17, 36, 0.8)',
              border: '1px solid var(--border-card-hover)',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1.5rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: 'var(--accent-soft)',
                    border: '1px solid var(--border-card-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-color)',
                    flexShrink: 0
                  }}
                >
                  <GraduationCap size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {educationData.degree}
                  </h3>
                  <div style={{ fontSize: '1.05rem', color: 'var(--accent-color)', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                    {educationData.institution}
                  </div>
                </div>
              </div>

              {/* Status Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-dim)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <Calendar size={13} color="var(--accent-color)" />
                  {educationData.currentYear} • {educationData.graduationYear}
                </span>

                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-dim)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <MapPin size={13} color="var(--accent-color)" />
                  {educationData.location}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.96rem', lineHeight: 1.75, color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
              {educationData.overview}
            </p>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.84rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-color)',
                  marginBottom: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                <BookOpen size={14} />
                Core Academic Coursework & Disciplines
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '0.75rem'
                }}
              >
                {educationData.coreAreas.map((area) => (
                  <div key={area} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={14} color="var(--accent-color)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card3DTilt>
        </div>
      </div>
    </section>
  );
}
