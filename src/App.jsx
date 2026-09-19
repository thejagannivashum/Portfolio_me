import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ExploringSection from './components/ExploringSection';
import EducationSection from './components/EducationSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import BackgroundParticles from './components/BackgroundParticles';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import './App.css';

function App() {
  const [theme, setTheme] = useState('cyan');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="app-wrapper">
      {/* High-speed initialization preloader */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* Premium Custom Cursor (Desktop Fine Pointer Only) */}
      <CustomCursor />

      {/* Dynamic Starfield / Particle Background */}
      <BackgroundParticles />

      {/* Floating Glassmorphic Navbar with Theme Switcher */}
      <Navbar currentTheme={theme} onThemeChange={handleThemeChange} />

      <main>
        {/* Hero Section with Interactive 3D WebGL Canvas */}
        <HeroSection />

        {/* Personal About Section */}
        <AboutSection />

        {/* Skills & Explored Technologies (No fake percentages) */}
        <SkillsSection />

        {/* Currently Exploring & Active Learning Tracks */}
        <ExploringSection />

        {/* Academic Journey / Education Section */}
        <EducationSection />

        {/* Projects in Progress & Future Showcase */}
        <ProjectsSection />

        {/* Contact Hub with Confetti & Direct Verified Links */}
        <ContactSection />
      </main>

      {/* Footer with Back-to-top */}
      <Footer />
    </div>
  );
}

export default App;
