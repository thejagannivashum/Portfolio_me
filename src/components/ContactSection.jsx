import { useState } from 'react';
import { personalInfo } from '../data/portfolioData';
import Card3DTilt from './Card3DTilt';
import confetti from 'canvas-confetti';
import {
  Mail,
  Copy,
  Check,
  Send,
  MapPin,
  GraduationCap,
  MessageSquare
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './Icons';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    const subjectText = formData.subject.trim()
      ? `[Portfolio Contact] ${formData.subject.trim()}`
      : `[Portfolio Inquiry] From ${formData.name}`;

    const bodyText = `Hi Jagannivash,\n\n${formData.message}\n\n---\nSender: ${formData.name}\nEmail: ${formData.email}`;
    const mailtoUri = `mailto:${personalInfo.email}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#a855f7', '#10b981', '#ffffff']
      });

      // Directly trigger mail client
      window.location.href = mailtoUri;

      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 8000);
    }, 600);
  };

  return (
    <section id="contact" className="section-spacing">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-badge">
            <MessageSquare size={14} />
            LET'S CONNECT
          </div>
          <h2 className="section-title">
            Start a <span className="gradient-text">Conversation</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            I'm always open to learning, building, and connecting with people who enjoy technology.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Direct Info & Quick Copy */}
          <Card3DTilt
            maxTilt={7}
            elevateZ={18}
            style={{
              padding: '2.5rem',
              background: 'rgba(12, 17, 36, 0.75)',
              border: '1px solid var(--border-card-hover)',
              boxShadow: '0 18px 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Direct Channels
            </h3>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Feel free to send an email, connect on LinkedIn, check out my code on GitHub, or follow along on Instagram.
            </p>

            {/* Email Copy Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-card-hover)',
                marginBottom: '1.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <Mail size={18} color="var(--accent-color)" />
                <a
                  href={`mailto:${personalInfo.email}`}
                  style={{
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                  }}
                  title="Click to email directly"
                >
                  {personalInfo.email}
                </a>
              </div>

              <button
                onClick={handleCopyEmail}
                style={{
                  background: copied ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.08)',
                  color: copied ? '#070913' : 'var(--text-main)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Academic & Geo Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                <GraduationCap size={18} color="var(--accent-color)" />
                <span style={{ fontSize: '0.92rem' }}>{personalInfo.college} • 3rd Year</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                <MapPin size={18} color="var(--accent-color)" />
                <span style={{ fontSize: '0.92rem' }}>{personalInfo.location}</span>
              </div>
            </div>

            {/* Social Links */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
                PROFILES & PLATFORMS
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a
                  href={personalInfo.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    fontSize: '0.86rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                    e.currentTarget.style.color = 'var(--accent-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }}
                >
                  <GithubIcon size={17} />
                  GitHub
                </a>

                <a
                  href={personalInfo.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    fontSize: '0.86rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                    e.currentTarget.style.color = 'var(--accent-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }}
                >
                  <LinkedinIcon size={17} />
                  LinkedIn
                </a>

                <a
                  href={personalInfo.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    fontSize: '0.86rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                    e.currentTarget.style.color = 'var(--accent-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }}
                >
                  <InstagramIcon size={17} />
                  Instagram
                </a>
              </div>
            </div>
          </Card3DTilt>

          {/* Right Column: Transmission Form */}
          <Card3DTilt
            maxTilt={7}
            elevateZ={18}
            style={{
              padding: '2.5rem',
              background: 'rgba(12, 17, 36, 0.75)',
              border: '1px solid var(--border-card-hover)',
              boxShadow: '0 18px 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Send a Transmission
            </h3>

            {submitted ? (
              <div
                style={{
                  padding: '2rem',
                  borderRadius: '14px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#070913',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}
                >
                  <Check size={24} strokeWidth={3} />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#10b981' }}>
                  Transmission Sent!
                </h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                  Thank you for reaching out. Your message has been noted and I'll reply promptly!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-card)',
                        color: 'var(--text-main)',
                        fontSize: '0.94rem',
                        fontFamily: 'var(--font-body)',
                        outline: 'none',
                        transition: 'border 0.2s ease'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent-color)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-card)')}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-card)',
                        color: 'var(--text-main)',
                        fontSize: '0.94rem',
                        fontFamily: 'var(--font-body)',
                        outline: 'none',
                        transition: 'border 0.2s ease'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent-color)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-card)')}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    placeholder="Collaboration / Tech Discussion / General Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.94rem',
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                      transition: 'border 0.2s ease'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent-color)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border-card)')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    MESSAGE *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hello Jagannivash, let's connect regarding..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.94rem',
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border 0.2s ease'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent-color)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border-card)')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {isSubmitting ? (
                    'Transmitting...'
                  ) : (
                    <>
                      Transmit Message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </Card3DTilt>
        </div>
      </div>
    </section>
  );
}
