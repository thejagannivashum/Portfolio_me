import { useState, useEffect } from 'react';
import { Menu, X, Terminal, ArrowUpRight, Palette } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Navbar({ currentTheme, onThemeChange }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Exploring', href: '#exploring' },
    { name: 'Education', href: '#education' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ];

  const themes = [
    { id: 'cyan', label: 'Cyan Neon', color: '#00f2fe' },
    { id: 'violet', label: 'Electric Violet', color: '#a855f7' },
    { id: 'emerald', label: 'Matrix Emerald', color: '#10b981' },
    { id: 'amber', label: 'Solar Amber', color: '#f59e0b' },
    { id: 'rose', label: 'Cyber Rose', color: '#f43f5e' }
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);

          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (maxScroll > 0) {
            setScrollProgress((window.scrollY / maxScroll) * 100);
          }

          const sections = ['hero', 'about', 'skills', 'exploring', 'education', 'projects', 'contact'];
          const scrollPos = window.scrollY + 220;

          for (const section of sections) {
            const el = document.getElementById(section);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPos >= top && scrollPos < top + height) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleGlobalClick = (e) => {
      if (!e.target.closest('#theme-picker-wrapper')) {
        setShowThemePicker(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowThemePicker(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* Precision Scroll Progress Indicator */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${scrollProgress}%`,
          height: '2.5px',
          background: 'linear-gradient(90deg, var(--accent-color), #7928ca)',
          boxShadow: '0 0 10px var(--accent-glow)',
          zIndex: 1001,
          pointerEvents: 'none',
          transition: 'width 0.08s linear'
        }}
      />

      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
          transition: 'all 0.3s ease',
          background: isScrolled
            ? 'rgba(7, 9, 19, 0.86)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
        }}
      >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <a
          href="#hero"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'var(--text-main)'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-color), #7928ca)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px var(--accent-glow)'
            }}
          >
            <Terminal size={18} color="#070913" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
              {personalInfo.name.toUpperCase()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.68rem', color: 'var(--accent-color)', fontFamily: 'var(--font-mono)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)', display: 'inline-block', boxShadow: '0 0 8px var(--accent-color)' }} />
              3RD YEAR B.TECH AI & ML
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(15, 20, 38, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '4px 8px',
            borderRadius: '9999px',
            backdropFilter: 'blur(12px)'
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#070913' : 'var(--text-muted)',
                  background: isActive ? 'var(--accent-color)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 14px var(--accent-glow)' : 'none'
                }}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right Actions: Theme Selector & Contact CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme Switcher Button */}
          <div id="theme-picker-wrapper" style={{ position: 'relative' }}>
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              aria-label="Change Accent Color Theme"
              aria-haspopup="true"
              aria-expanded={showThemePicker}
              title="Change Accent Color Theme"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--accent-color)',
                transition: 'all 0.2s ease'
              }}
            >
              <Palette size={17} />
            </button>

            {/* Theme Dropdown Popover */}
            {showThemePicker && (
              <div
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  background: 'rgba(12, 16, 32, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-card-hover)',
                  borderRadius: '14px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  minWidth: '150px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                  zIndex: 200
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', padding: '2px 8px', fontFamily: 'var(--font-mono)' }}>
                  ACCENT PALETTE
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onThemeChange(t.id);
                      setShowThemePicker(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: currentTheme === t.id ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                      border: 'none',
                      color: currentTheme === t.id ? 'var(--text-main)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.84rem',
                      fontFamily: 'var(--font-heading)',
                      textAlign: 'left'
                    }}
                  >
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: t.color,
                        boxShadow: `0 0 8px ${t.color}`
                      }}
                    />
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="#contact"
            className="btn btn-primary magnetic-btn"
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem', display: 'none' }}
            id="desktop-contact-btn"
          >
            Let's Connect
            <ArrowUpRight size={15} />
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="mobile-menu-btn"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'rgba(7, 9, 19, 0.97)',
            backdropFilter: 'blur(25px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-main)',
                textDecoration: 'none',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {link.name}
              <ArrowUpRight size={16} color="var(--accent-color)" />
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Let's Connect
          </a>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          #desktop-contact-btn {
            display: inline-flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
    </>
  );
}
