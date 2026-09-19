import { useState, useMemo } from 'react';
import { skillsCategories } from '../data/portfolioData';
import Card3DTilt from './Card3DTilt';
import { Code2, Brain, Wrench, Globe, Sparkles, CheckCircle2, Search, Filter } from 'lucide-react';

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryIcons = {
    all: <Filter size={15} />,
    Programming: <Code2 size={15} />,
    'AI & Machine Learning': <Brain size={15} />,
    'Tools & Libraries': <Wrench size={15} />,
    Development: <Globe size={15} />
  };

  const categories = [
    { id: 'all', label: 'All Technologies' },
    ...skillsCategories.map((cat) => ({ id: cat.category, label: cat.category }))
  ];

  // Flattened or filtered skills list
  const filteredSkills = useMemo(() => {
    let pool = [];
    if (activeCategory === 'all') {
      skillsCategories.forEach((cat) => {
        cat.skills.forEach((s) => pool.push({ ...s, parentCategory: cat.category }));
      });
    } else {
      const selected = skillsCategories.find((c) => c.category === activeCategory);
      if (selected) {
        pool = selected.skills.map((s) => ({ ...s, parentCategory: selected.category }));
      }
    }

    if (!searchQuery.trim()) return pool;

    const q = searchQuery.toLowerCase().trim();
    return pool.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.focus.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q) ||
        s.parentCategory.toLowerCase().includes(q)
    );
  }, [activeCategory, searchQuery]);

  const getStatusBadgeStyle = (status) => {
    const s = status.toLowerCase();
    if (s.includes('hands-on') || s.includes('regularly')) {
      return {
        bg: 'var(--accent-soft)',
        border: 'var(--border-card-hover)',
        color: 'var(--accent-color)'
      };
    }
    if (s.includes('exploring') || s.includes('experimenting')) {
      return {
        bg: 'rgba(121, 40, 202, 0.18)',
        border: 'rgba(168, 85, 247, 0.35)',
        color: '#c084fc'
      };
    }
    if (s.includes('learning')) {
      return {
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.35)',
        color: '#34d399'
      };
    }
    return {
      bg: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.1)',
      color: 'var(--text-dim)'
    };
  };

  return (
    <section id="skills" className="section-spacing" style={{ background: 'rgba(5, 8, 18, 0.4)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-badge">
            <Sparkles size={14} />
            TECHNICAL REPERTOIRE
          </div>
          <h2 className="section-title">
            Skills & <span className="gradient-text">Explored Technologies</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
            A transparent overview of languages, frameworks, and AI tools explored through coursework, independent study, and hands-on experiments.
          </p>

          {/* Search & Quick Filter Bar */}
          <div
            style={{
              maxWidth: '520px',
              margin: '0 auto 1.75rem',
              position: 'relative'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.65rem 1.15rem',
                borderRadius: '12px',
                background: 'rgba(15, 20, 38, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Search size={16} color="var(--accent-color)" />
              <input
                type="text"
                placeholder="Quick search (e.g. Python, OpenCV, PyTorch, Web)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.92rem'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: 'inline-flex',
              gap: '8px',
              padding: '6px',
              borderRadius: '9999px',
              background: 'rgba(15, 20, 38, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '7px 16px',
                    borderRadius: '20px',
                    fontSize: '0.86rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: isActive ? 700 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive ? 'var(--accent-color)' : 'transparent',
                    color: isActive ? '#070913' : 'var(--text-muted)',
                    transition: 'all 0.25s ease',
                    boxShadow: isActive ? '0 0 16px var(--accent-glow)' : 'none'
                  }}
                >
                  {categoryIcons[cat.id]}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredSkills.map((skill) => {
            const badgeStyle = getStatusBadgeStyle(skill.status);
            return (
              <Card3DTilt
                key={skill.name}
                maxTilt={9}
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '0.85rem'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '1.18rem', color: 'var(--text-main)', display: 'block' }}>
                        {skill.name}
                      </span>
                      {activeCategory === 'all' && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                          {skill.parentCategory}
                        </span>
                      )}
                    </div>

                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontFamily: 'var(--font-mono)',
                        color: badgeStyle.color,
                        padding: '3px 9px',
                        borderRadius: '6px',
                        background: badgeStyle.bg,
                        border: `1px solid ${badgeStyle.border}`,
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {skill.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {skill.focus}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '1.25rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.76rem',
                    color: 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <CheckCircle2 size={13} color="var(--accent-color)" />
                  <span>Academic & practical exposure</span>
                </div>
              </Card3DTilt>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <p>No technologies matched "{searchQuery}". Try searching for Python, OpenCV, or Web.</p>
          </div>
        )}
      </div>
    </section>
  );
}
