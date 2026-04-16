import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Globe, 
  Zap,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Solutions', href: '#solutions' },
    { name: 'Services', href: '#services' },
    { name: 'About Us', href: '#about' },
    { name: 'Careers', href: '/jobs' },
    { name: 'Portal', href: '/login', isPortal: true }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-zealous-black/90 backdrop-blur-md py-4 border-b border-zinc-800' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center font-bold text-black text-xl">Z</div>
          <div className="hidden sm:block">
            <div className="font-bold text-xl tracking-tighter text-white leading-none">ZEALOUS</div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-zealous-gold">SOLUTIONS</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href.startsWith('#') ? '/' : link.href}
              className={`text-sm font-semibold tracking-wide transition-colors ${link.isPortal ? 'text-zealous-gold hover:text-zealous-gold-light' : 'text-zinc-400 hover:text-white'}`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/login" className="gold-gradient text-black px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform">
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-zealous-black border-b border-zinc-800 p-6 space-y-4"
        >
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href.startsWith('#') ? '/' : link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-bold text-zinc-400 hover:text-zealous-gold"
            >
              {link.name}
            </Link>
          ))}
          <Link to="/login" className="block gold-gradient text-black text-center py-3 rounded-xl font-bold">
            Portal Access
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-zealous-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-zealous-gold/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zealous-gold text-xs font-bold tracking-widest uppercase"
          >
            <Zap size={14} className="fill-zealous-gold" /> The Future of Workforce Management
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white uppercase italic"
          >
            DRIVING <br />
            <span className="gold-text-gradient">ZEALOUS</span> IMPACT.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-xl max-w-xl leading-relaxed font-medium"
          >
            Precision recruitment, automated HR infrastructure, and performance-driven workforce solutions for global enterprises.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/login" className="gold-gradient text-black px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all uppercase tracking-widest">
              Launch Portal <ArrowRight size={20} />
            </Link>
            <Link to="/jobs" className="bg-zinc-900 border border-zinc-800 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all text-center uppercase tracking-widest">
              Careers
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-6 pt-8 border-t border-zinc-900"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-zealous-black bg-zinc-800 overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="user" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
              Trusted by <span className="text-white">500+</span> Professionals
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="relative hidden lg:block"
        >
          <div className="aspect-[4/3] bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden p-8 relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-zealous-gold/10 to-transparent" />
            <div className="w-full h-full bg-zealous-black rounded-2xl border border-zinc-800 p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-zinc-800 rounded-full" />
                  <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center font-bold text-black">Z</div>
                </div>
                <div className="space-y-3">
                  <div className="h-8 w-full bg-zinc-900 rounded-xl" />
                  <div className="h-3 w-3/4 bg-zinc-900 rounded-full" />
                  <div className="h-3 w-1/2 bg-zinc-900 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 bg-zinc-900 rounded-2xl border border-zinc-800 p-4 flex flex-col justify-end">
                  <div className="h-2 w-full bg-zinc-800 rounded-full mb-2" />
                  <div className="h-1 w-3/4 bg-zealous-gold rounded-full" />
                </div>
                <div className="h-24 bg-zinc-900 rounded-2xl border border-zinc-800 p-4 flex flex-col justify-end">
                  <div className="h-2 w-full bg-zinc-800 rounded-full mb-2" />
                  <div className="h-1 w-3/4 bg-zealous-gold rounded-full" />
                </div>
                <div className="h-24 bg-zinc-900 rounded-2xl border border-zinc-800 p-4 flex flex-col justify-end">
                  <div className="h-2 w-full bg-zinc-800 rounded-full mb-2" />
                  <div className="h-1 w-3/4 bg-zealous-gold rounded-full" />
                </div>
              </div>
              <div className="h-14 gold-gradient rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-black shadow-lg shadow-zealous-gold/20">
                Authorized Access
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-10 -right-10 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl space-y-4 max-w-[240px] z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 gold-gradient text-black rounded-xl flex items-center justify-center font-bold">
                <ShieldCheck size={18} />
              </div>
              <span className="text-xs font-black text-white uppercase tracking-widest">Protocol Verified</span>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Efficiency Rate</div>
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full gold-gradient w-[94%]" />
                </div>
                <span className="text-[10px] font-black text-zealous-gold">94%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Partners = () => {
  return (
    <div className="py-12 bg-zinc-900/50 border-y border-zinc-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
          {['TECHCORP', 'GLOBALDATA', 'INNOVATE', 'NEXUS', 'PRIME'].map(name => (
            <div key={name} className="text-2xl font-black text-white tracking-tighter italic">{name}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: Users,
      title: 'Talent Acquisition',
      desc: 'Smart recruitment workflows that find and onboard the best in the industry, seamlessly.'
    },
    {
      icon: BarChart3,
      title: 'Predictive Analytics',
      desc: 'Real-time performance data processed into actionable insights for team leads and management.'
    },
    {
      icon: ShieldCheck,
      title: 'Compliance & Safety',
      desc: 'Enterprise-grade security and automated compliance monitoring across all HR verticals.'
    },
    {
      icon: Globe,
      title: 'Global Infrastructure',
      desc: 'Manage decentralized teams with a unified portal accessible from anywhere, any time.'
    }
  ];

  return (
    <section id="solutions" className="py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">Our Ecosystem</h2>
          <h3 className="text-4xl md:text-6xl font-black text-white leading-tight">THE ZEALOUS EDGE.</h3>
          <p className="text-zinc-400 text-lg">We don't just manage workers; we cultivate a high-performance culture through sophisticated digital infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-zealous-gold transition-all group"
            >
              <div className="w-14 h-14 gold-gradient rounded-2xl flex items-center justify-center text-black mb-8 group-hover:scale-110 transition-transform">
                <f.icon size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">{f.title}</h4>
              <p className="text-zinc-500 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  return (
    <section className="py-24 border-y border-zinc-900 bg-zealous-black">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center text-white">
        <div>
          <div className="text-5xl font-black gold-text-gradient mb-2">98%</div>
          <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Client Satisfaction</div>
        </div>
        <div>
          <div className="text-5xl font-black gold-text-gradient mb-2">15k+</div>
          <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Training sessions</div>
        </div>
        <div>
          <div className="text-5xl font-black gold-text-gradient mb-2">500+</div>
          <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Workforce Managed</div>
        </div>
        <div>
          <div className="text-5xl font-black gold-text-gradient mb-2">24/7</div>
          <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Support Uptime</div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-zealous-black border-t border-zinc-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center font-bold text-black text-xl">Z</div>
              <div>
                <div className="font-bold text-xl tracking-tighter text-white leading-none uppercase">Zealous</div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-zealous-gold">SOLUTIONS</div>
              </div>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Redefining HR Excellence through automated infrastructure and people-first solutions.
            </p>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-6">Company</h5>
            <ul className="space-y-4 text-zinc-500 text-sm font-medium">
              <li><Link to="/" className="hover:text-zealous-gold transition-colors">Our Story</Link></li>
              <li><Link to="/jobs" className="hover:text-zealous-gold transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-zealous-gold transition-colors">Press Kit</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">Product</h5>
            <ul className="space-y-4 text-zinc-500 text-sm font-medium">
              <li><Link to="/login" className="hover:text-zealous-gold transition-colors">Portal Login</Link></li>
              <li><Link to="/" className="hover:text-zealous-gold transition-colors">Recruitment</Link></li>
              <li><Link to="/" className="hover:text-zealous-gold transition-colors">Training</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-white font-bold mb-6">Newsletter</h5>
            <p className="text-zinc-500 text-sm">Get the latest HR insights delivered weekly.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="email@address.com" 
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zealous-gold"
              />
              <button className="gold-gradient text-black px-4 py-2 rounded-lg font-bold text-sm">Join</button>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-600 text-xs font-bold uppercase tracking-widest">
          <p>© 2024 ZEALOUS SOLUTIONS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function MainLandingPage() {
  return (
    <div className="bg-zealous-black scroll-smooth">
      <Navbar />
      <Hero />
      <Partners />
      <Stats />
      <Features />
      
      {/* About Section */}
      <section id="about" className="py-32 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">Who We Are</h3>
            <h4 className="text-4xl md:text-6xl font-black text-white tracking-tight">CRAFTED FOR <br /><span className="gold-text-gradient">EXCELLENCE.</span></h4>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Founded on the principles of efficiency and innovation, Zealous Solutions provides the digital lattice for the modern workforce. We believe that technology should serve humanity, not replace it.
            </p>
            <button className="text-zealous-gold font-bold flex items-center gap-2 group">
              Learn more about our mission <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="aspect-[4/5] bg-zinc-900 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <img src="https://picsum.photos/seed/office1/600/800" alt="office" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-square bg-zealous-gold rounded-3xl flex items-center justify-center p-8">
                <ShieldCheck size={48} className="text-black" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-square bg-zinc-800 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <img src="https://picsum.photos/seed/office2/600/600" alt="office" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-[4/5] bg-zinc-900 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <img src="https://picsum.photos/seed/office3/600/800" alt="office" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="gold-gradient p-12 md:p-24 rounded-[3rem] text-black grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none mb-6">READY TO BE <br />ZEALOUS?</h2>
              <p className="text-black/70 text-lg font-bold max-w-sm">Join the ecosystem that is powering the next generation of high-performance teams.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link to="/login" className="bg-black text-white px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Launch Portal <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
