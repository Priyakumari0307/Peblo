import React, { useRef } from 'react';
import pebloLogo from '../assets/peblo_logo.png';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = React.useState('home');

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = ['home', 'studio', 'about', 'journal'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NavItem = ({ label, id }) => (
    <button 
      onClick={() => scrollToSection(id)}
      className={`text-sm transition-all duration-500 cursor-pointer ${
        activeSection === id ? 'text-white font-bold scale-110' : 'text-white/50 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="snap-container bg-background selection:bg-white/20" ref={containerRef}>
      {/* Navigation Bar - Fixed */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto mix-blend-difference">
        <div 
          className="text-3xl tracking-tight text-white flex items-center gap-2.5"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          <img src={pebloLogo} alt="Peblo" className="w-7 h-7 rounded-full object-cover border-2 border-white/40 shadow-sm" />
          Peblo
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <NavItem label="Home" id="home" active />
          <NavItem label="Studio" id="studio" />
          <NavItem label="About" id="about" />
          <NavItem label="Journal" id="journal" />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm text-white font-medium hover:opacity-70 transition-opacity cursor-pointer px-4"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white font-medium hover:scale-[1.03] transition-transform cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Section 1: Home (Hero) */}
      <section id="home" className="snap-section flex flex-col items-center justify-center relative overflow-hidden">
        {/* Fullscreen Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none brightness-75"
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" 
            type="video/mp4" 
          />
        </video>

        <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-white"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Where <em className="not-italic text-white/60">dreams</em> rise <br className="hidden md:block" />
            <em className="not-italic text-white/60">through the silence.</em>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-white/70 text-base sm:text-lg max-w-2xl mt-8 leading-relaxed"
          >
            We're designing tools for deep thinkers, bold creators, and quiet rebels. 
            Amid the chaos, we build digital spaces for sharp focus and inspired work.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-6 mt-12"
          >
            <button 
              onClick={() => navigate('/register')}
              className="liquid-glass rounded-full px-14 py-5 text-base text-white font-medium hover:scale-[1.03] transition-transform cursor-pointer"
            >
              Begin Journey
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="text-white font-medium hover:text-white/70 transition-all cursor-pointer flex items-center gap-2 group"
            >
              Explore Dashboard <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </motion.div>
        </main>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-center">
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] animate-pulse">Scroll to explore</p>
        </div>
      </section>

      {/* Section 2: Studio */}
      <section id="studio" className="snap-section flex flex-col items-center justify-center bg-background relative px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase mb-6 block">The Workspace</span>
            <h2 className="text-4xl md:text-6xl font-normal leading-[1.1] mb-8" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Your private <br />
              <em className="not-italic text-muted-foreground">creative sanctuary.</em>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-md leading-relaxed">
              Experience a minimalist canvas designed to eliminate distraction. 
              Our Studio features intuitive tools that adapt to your creative flow, not the other way around.
            </p>
            <div className="flex flex-col gap-4">
              {['AI-Assisted Drafting', 'Dynamic Canvas Layouts', 'Zen Mode Focus', 'Deep Integration'].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="glass-card aspect-[4/3] w-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-muted-foreground/20 text-8xl font-serif">Studio</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: About */}
      <section id="about" className="snap-section flex flex-col items-center justify-center bg-foreground text-background relative px-6 overflow-hidden">
        <div className="max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-sm font-medium tracking-widest text-background/40 uppercase mb-8 block">Our Philosophy</span>
            <h2 className="text-5xl md:text-7xl font-normal leading-[1.1] mb-12" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Clarity comes from <br />
              <em className="not-italic text-background/60">the silence within.</em>
            </h2>
            <div className="space-y-8 text-xl md:text-2xl text-background/80 font-light leading-relaxed">
              <p>
                In an era of endless notifications and shallow work, 
                Peblo was born from a simple realization: 
                <strong> greatness requires focus.</strong>
              </p>
              <p>
                We don't just build apps; we architect digital environments that 
                respect your attention and nourish your curiosity.
              </p>
            </div>
            <button className="mt-16 border-b border-background/20 pb-2 text-sm uppercase tracking-widest hover:border-background transition-colors">
              Read our manifesto
            </button>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-background/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-background/10 to-transparent" />
      </section>

      {/* Section 4: Journal */}
      <section id="journal" className="snap-section flex flex-col items-center justify-center bg-background relative px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-orange-500/20 blur-[100px] rounded-full animate-pulse" />
        </div>
        
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, order: 2 }}
            whileInView={{ opacity: 1, order: 2 }}
            transition={{ duration: 1 }}
            className="glass-card aspect-square w-full relative overflow-hidden lg:order-1"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-muted-foreground/20 text-8xl font-serif">Journal</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="lg:order-2"
          >
            <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase mb-6 block">The Archive</span>
            <h2 className="text-4xl md:text-6xl font-normal leading-[1.1] mb-8" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Capture the <br />
              <em className="not-italic text-muted-foreground">ephemeral thought.</em>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-md leading-relaxed">
              Your mind is for having ideas, not holding them. 
              Peblo's Journal is a friction-less vault for your daily reflections, 
              meeting notes, and midnight inspirations.
            </p>
            <button className="liquid-glass rounded-full px-10 py-4 text-sm font-medium hover:scale-[1.03] transition-transform">
              Start Writing
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
