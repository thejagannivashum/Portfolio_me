import { useState } from 'react';
import { projectsShowcase } from '../data/portfolioData';
import Card3DTilt from './Card3DTilt';
import ProjectModal from './ProjectModal';
import { FolderGit2, Eye, Construction } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="section-spacing">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-badge">
            <FolderGit2 size={14} />
            PROJECTS & BUILDS
          </div>
          <h2 className="section-title">
            Active Builds & <span className="gradient-text">Explorations</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Practical projects, algorithmic tests, and web platforms currently being engineered.
          </p>
        </div>

        {/* Informative Notice Banner */}
        <div
          style={{
            maxWidth: '780px',
            margin: '0 auto 3rem',
            padding: '1.25rem 1.75rem',
            borderRadius: '16px',
            background: 'rgba(15, 20, 38, 0.65)',
            border: '1px solid var(--border-card-hover)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--accent-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-color)',
              flexShrink: 0
            }}
          >
            <Construction size={20} />
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            I am continuously building, testing models, and turning coursework into tangible applications.
            Explore the active builds below or visit my{' '}
            <a
              href="https://github.com/JAGANNIVASH18"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--accent-color)', fontWeight: 600, textDecoration: 'none' }}
            >
              GitHub profile
            </a>{' '}
            to view my repositories and commits.
          </p>
        </div>

        {/* Projects Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem'
          }}
        >
          {projectsShowcase.map((project) => (
            <Card3DTilt
              key={project.id}
              maxTilt={9}
              elevateZ={18}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0',
                overflow: 'hidden',
                background: 'rgba(12, 17, 36, 0.75)',
                border: '1px solid var(--border-card-hover)',
                boxShadow: '0 18px 40px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Image banner with overlay */}
              <div
                style={{
                  position: 'relative',
                  height: '210px',
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(12, 17, 34, 0.95) 0%, rgba(12, 17, 34, 0.2) 60%, transparent 100%)'
                  }}
                />

                {/* Status Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(7, 9, 19, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-color)'
                  }}
                >
                  ● {project.status}
                </div>

                {/* GitHub link icon */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px'
                  }}
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(7, 9, 19, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-main)',
                      textDecoration: 'none'
                    }}
                    title="View GitHub Repository"
                  >
                    <GithubIcon size={16} />
                  </a>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
                    {project.category}
                  </div>
                  <h3
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      marginBottom: '0.4rem',
                      color: 'var(--text-main)'
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-dim)',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: '0.85rem'
                    }}
                  >
                    {project.tagline}
                  </p>
                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem'
                    }}
                  >
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tech stack tags */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '1.5rem'
                    }}
                  >
                    {project.tags.map((tag) => (
                      <span key={tag} className="tech-pill">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Deep Dive Modal Trigger */}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '0.9rem', padding: '0.7rem' }}
                  >
                    <Eye size={15} />
                    View Build Details & Focus
                  </button>
                </div>
              </div>
            </Card3DTilt>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
