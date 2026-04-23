import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  MapPin, ShieldCheck, Globe, CheckCircle2,
  ArrowRight, Menu, X, MessageCircle, Search,
  Bed, Square, Building2, Shield, Star, Users,
  Target, Eye, Heart, Briefcase, Award, Play, Trophy, Layout
} from "lucide-react";
import FloorPlan3D from "./FloorPlan3D";

// ============================================================
// BRANDING & DATA
// ============================================================
const BRAND = {
  teal: "#00c2cb",
  navy: "#050d1a",
  logo: "https://sidaigroup.com/wp-content/uploads/2024/04/cropped-Refub-Logo-2-1-e1707234674845-removebg-preview_11zon.png"
};

const PROJECTS = [
  { id: "p1", name: "The Lavington Sanctuary", location: "Lavington, Nairobi",  price: "KES 185M",   category: "House", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200", tag: "Exclusive",        beds: 5, sqft: 8500 },
  { id: "p2", name: "Kamangu Heritage Ridge",  location: "Kiambu County",        price: "KES 850,000",category: "Land",  image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200", tag: "Ready Title",      beds: 0, sqft: 8000 },
  { id: "p3", name: "Boma Gated Sanctuary",    location: "Juja",                 price: "KES 16M",    category: "House", image: "https://images.unsplash.com/photo-1592595894597-6461a243a81a?q=80&w=1200", tag: "Affordable Luxury",beds: 4, sqft: 3200 },
  { id: "p4", name: "Karen Heights Villa",     location: "Karen, Nairobi",       price: "KES 120M",   category: "Villa", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200", tag: "Modern Living",    beds: 4, sqft: 5200 }
];

const CINEMATIC_IMAGES = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2000",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000",
  "https://sidaigroup.com/wp-content/uploads/2025/01/Screenshot-from-2025-01-30-13-31-43_11zon.png"
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const { scrollY } = useScroll();
  
  const bgY = useTransform(scrollY, [0, 5000], [0, 400]);

  const [calc, setCalc] = useState({ price: 15000000, down: 20, rate: 13, term: 15 });
  const principal = calc.price * (1 - calc.down / 100);
  const mRate     = calc.rate / 100 / 12;
  const n         = calc.term * 12;
  const monthly   = mRate === 0
    ? principal / n
    : (principal * mRate * Math.pow(1 + mRate, n)) / (Math.pow(1 + mRate, n) - 1);

  useEffect(() => {
    const timer = setInterval(() => setImgIndex(p => (p + 1) % CINEMATIC_IMAGES.length), 7000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    
  const openWA = (msg: string) =>
    window.open(`https://wa.me/254724200600?text=${encodeURIComponent(msg)}`, "_blank");

  return (
    <div className="relative text-white font-sans bg-[#050d1a] overflow-x-hidden selection:bg-[#00c2cb] selection:text-white"
      style={{ WebkitUserSelect: "none" } as React.CSSProperties}>

      {/* --- CINEMATIC BACKGROUND SLIDER --- */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={imgIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.35, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
            style={{
              y: bgY,
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "120%",
            }}
          >
            <img
              src={CINEMATIC_IMAGES[imgIndex]}
              className="w-full h-full object-cover"
              alt="Background"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-linear-to-b from-[#050d1a]/80 via-[#050d1a]/30 to-[#050d1a]" />
      </div>

      {/* --- NAVIGATION --- */}
      <nav className={`fixed w-full z-100 transition-all duration-500 ${
        scrolled
          ? "bg-[#050d1a]/95 backdrop-blur-md py-4 border-b border-white/5 shadow-2xl"
          : "bg-transparent py-8"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <img
            src={BRAND.logo} alt="Sidai"
            className="h-10 md:h-12 brightness-0 invert cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
          <div className="hidden md:flex gap-10 items-center text-[10px] font-black uppercase tracking-[0.3em]">
            <button onClick={() => scrollTo("portfolio")} className="hover:text-[#00c2cb] transition-colors">Portfolio</button>
            <button onClick={() => scrollTo("about")}     className="hover:text-[#00c2cb] transition-colors">About</button>
            <button onClick={() => scrollTo("calculator")}className="hover:text-[#00c2cb] transition-colors">Calculator</button>
            <button
              onClick={() => openWA("I'd like to book a site visit")}
              className="bg-[#00c2cb] px-6 py-2.5 rounded-sm hover:scale-105 transition-transform shadow-lg text-white font-bold">
              Site Visit
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center z-10 text-center px-6 pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-full flex flex-col items-center"
        >
          <span className="text-[#00c2cb] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
            Interactive Architecture
          </span>
          <h1 className="text-4xl md:text-7xl font-serif italic mb-6 leading-[1.1] drop-shadow-2xl text-white">
            Transforming Livelihoods, <br />
            <span className="text-[#00c2cb]">Giving Dignity.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/70 text-lg md:text-xl font-light mb-12">
            Explore our elite designs in 360°. High-fidelity architectural visualization 
            allowing Kenyans to invest with absolute certainty.
          </p>

          <div className="w-full max-w-6xl mx-auto rounded-4xl border border-white/10
            bg-[#0d1520]/60 backdrop-blur-sm relative overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.5)] 
            aspect-video md:aspect-21/9">
            <div className="absolute top-6 left-8 z-20 flex items-center gap-3">
              <Layout className="text-[#00c2cb]" size={16} />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                Architectural Model • Interactive View
              </span>
            </div>
            <FloorPlan3D svgUrl="/floor-plan-HK.svg" />
            <div className="absolute bottom-6 right-8 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/60">
                Drag to Rotate • Scroll to Zoom • Explore Layout
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- PROPERTY CATALOG (UPDATED BACKGROUND) --- */}
      <section id="portfolio" className="relative z-10 py-32 bg-transparent text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-[#00c2cb] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
                Featured Collection
              </span>
              <h2 className="text-5xl font-serif italic text-white drop-shadow-md">Private Portfolio</h2>
            </div>
            <p className="text-white/40 text-sm max-w-xs text-right italic font-light">
              Clear titles. Verified boundaries. Generational wealth assets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {PROJECTS.map(p => (
              <motion.div
                key={p.id}
                whileHover={{ y: -10 }}
                className="group bg-[#0d1520]/80 backdrop-blur-md rounded-4xl overflow-hidden shadow-2xl border border-white/5 transition-all duration-500 hover:border-[#00c2cb]/30">
                <div className="relative aspect-4/5 overflow-hidden">
                  <img
                    src={p.image}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                    alt={p.name}
                  />
                  <div className="absolute top-6 left-6 bg-[#00c2cb] text-white px-4 py-1.5
                    text-[9px] font-black uppercase rounded-full shadow-lg">
                    {p.tag}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-serif italic 
                        group-hover:text-[#00c2cb] transition-colors text-white">{p.name}</h3>
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-2 flex items-center gap-2">
                        <MapPin size={12} className="text-[#00c2cb]" /> {p.location}
                      </p>
                    </div>
                    <p className="text-[#00c2cb] font-black text-lg">{p.price}</p>
                  </div>
                  <div className="flex gap-6 py-4 border-y border-white/5 text-white/50 mb-6">
                    {p.beds !== 0 && (
                      <span className="flex items-center gap-2 text-[10px] font-bold">
                        <Bed size={14} /> {p.beds} BEDS
                      </span>
                    )}
                    <span className="flex items-center gap-2 text-[10px] font-bold">
                      <Square size={14} /> {p.sqft.toLocaleString()} SQFT
                    </span>
                  </div>
                  <button
                    onClick={() => openWA(`I'm interested in ${p.name}`)}
                    className="w-full bg-white/5 text-white py-4 rounded-xl text-[9px]
                      font-black uppercase tracking-widest hover:bg-[#00c2cb] hover:text-white transition-all duration-300 border border-white/10">
                    Enquire Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="relative py-40 z-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-start mb-40">
            <div className="space-y-10">
              <div>
                <span className="text-[#00c2cb] text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">
                  Our Heritage
                </span>
                <h2 className="text-6xl font-serif italic mb-10 text-white drop-shadow-md">
                  About Sidai Group
                </h2>
                <div className="space-y-6 text-white/90 text-lg font-light leading-relaxed">
                  <p>
                    Sidai G. Agencies is a formidable Real Estate company that mainly deals in the land
                    investment sector; which is a growing and highly rewarding sector of our economy.
                  </p>
                  <p>
                    Our plots are located on a flat terrain surrounded by evergreen hills which give one
                    a magical and peaceful feeling with a 360 panoramic view.
                  </p>
                  <p>
                    We specialize in parcels of land ranging from 50x100 plots to 1000 acres of prime
                    land with <strong>Ready Title Deeds</strong>. SGA is where affordability meets
                    value for money.
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#050d1a]/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
                  <h4 className="text-[10px] font-black uppercase text-[#00c2cb] mb-4">Our Vision</h4>
                  <p className="text-sm font-light text-stone-200 italic">
                    "Become Kenya's premier real estate firm, offering affordable properties to all
                    Kenyans locally and in the diaspora."
                  </p>
                </div>
                <div className="bg-[#050d1a]/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
                  <h4 className="text-[10px] font-black uppercase text-[#00c2cb] mb-4">Our Mission</h4>
                  <p className="text-sm font-light text-stone-200">
                    "Narrowing the gap in the Real Estate sector by offering affordable properties
                    across the nation."
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#0d1520]/90 backdrop-blur-md text-white p-10 rounded-4xl shadow-2xl lg:sticky lg:top-32 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="text-[#00c2cb]" size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  RESA Awards Winner
                </span>
              </div>
              <h3 className="text-3xl font-serif italic mb-6">Most Reliable Firm 2024</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="rounded-2xl overflow-hidden border border-white/10 aspect-4/5">
                  <img
                    src="https://sidaigroup.com/wp-content/uploads/2025/01/Screenshot-from-2025-01-30-13-31-43_11zon.png"
                    className="w-full h-full object-cover"
                    alt="Award"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden bg-black border border-white/10 aspect-4/5">
                  <iframe
                    className="w-full h-full border-none"
                    src="https://www.youtube.com/embed/NHiUQyKJXok"
                    title="Trust Video"
                  />
                </div>
              </div>
              <p className="text-white/50 text-sm italic text-center leading-relaxed font-light">
                "Dedicated to making land ownership accessible to all Kenyans with integrity."
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-24 items-center mb-40">
            <div className="rounded-4xl overflow-hidden shadow-2xl border border-white/10 order-2 lg:order-1">
              <img
                src="https://sidaigroup.com/wp-content/uploads/2024/02/mg-6491-11zon-65c329b52bf0a-1024x576.webp"
                alt="Team"
                className="w-full grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-8 text-white">
              <span className="text-[#00c2cb] text-[10px] font-black uppercase tracking-[0.4em] block">
                Our Staff
              </span>
              <h2 className="text-5xl font-serif italic leading-tight text-white drop-shadow-md">
                Our Primary Asset
              </h2>
              <p className="text-white/70 text-lg font-light leading-relaxed">
                We recognize that a truly successful company needs to be a rewarding work environment
                for its staff. Our team is encouraged to reach their optimum potential through a
                culture of mutual respect. Success is built together.
              </p>
              <div className="h-px bg-white/10 w-full" />
              <button
                onClick={() => openWA("Hello Sidai Team")}
                className="flex items-center gap-3 text-[#00c2cb] text-[10px] font-black uppercase tracking-[0.3em] group">
                Connect with our team
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- CALCULATOR & FOOTER RETAINED AS IS --- */}
      <section id="calculator" className="relative z-10 py-32 bg-[#050d1a]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[#00c2cb] text-[10px] font-black uppercase tracking-[0.4em] block mb-4">
              Investment Analysis
            </span>
            <h2 className="text-5xl font-serif italic text-white mb-8">Mortgage Calculator</h2>
            <div className="space-y-12">
              <div>
                <div className="flex justify-between text-[10px] font-black tracking-widest mb-6 uppercase">
                  <span className="text-stone-400">Asset Value</span>
                  <span className="text-[#00c2cb] font-bold">KES {calc.price.toLocaleString()}</span>
                </div>
                <input
                  type="range" min="1000000" max="100000000" step="500000"
                  value={calc.price}
                  onChange={e => setCalc({ ...calc, price: +e.target.value })}
                  className="w-full h-1 bg-white/10 accent-[#00c2cb]"
                />
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black tracking-widest mb-4 uppercase text-stone-400">
                    Down Payment %
                  </label>
                  <input
                    type="number" value={calc.down}
                    onChange={e => setCalc({ ...calc, down: +e.target.value })}
                    className="bg-transparent border-b border-white/20 w-full py-2 outline-none
                      focus:border-[#00c2cb] text-white font-bold"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black tracking-widest mb-4 uppercase text-stone-400">
                    Term (Years)
                  </label>
                  <input
                    type="number" value={calc.term}
                    onChange={e => setCalc({ ...calc, term: +e.target.value })}
                    className="bg-transparent border-b border-white/20 w-full py-2 outline-none
                      focus:border-[#00c2cb] text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0d1520] p-12 rounded-[3rem] border border-white/5 shadow-2xl relative text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00c2cb]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-4">
              Estimated Monthly Repayment
            </p>
            <h3 className="text-5xl font-serif italic text-[#00c2cb] mb-10">
              KES {Math.round(monthly).toLocaleString()}
            </h3>
            <button
              onClick={() => openWA("I'd like to discuss financing")}
              className="w-full bg-[#00c2cb] text-white py-5 rounded-xl font-black text-[10px]
                uppercase tracking-widest hover:scale-105 transition-transform">
              Consult Finance Expert
            </button>
          </div>
        </div>
      </section>

      <footer id="contact" className="relative z-10 bg-[#050d1a] py-24 border-t border-white/5 text-center">
        <img src={BRAND.logo} alt="Sidai" className="h-14 mx-auto mb-12 brightness-0 invert" />
        <div className="flex flex-wrap justify-center gap-12 text-stone-500 text-[10px] font-black uppercase tracking-[0.3em] mb-12">
          <p>Mutall Building, Kiserian</p>
          <p>+254 724 200 600</p>
          <p>invest@sidaigroup.com</p>
        </div>
        <p className="text-stone-800 text-[9px] font-bold uppercase tracking-[0.5em]">
          © 2024 Sidai Genuine Agencies. All Rights Reserved.
        </p>
      </footer>

      <button
        onClick={() => openWA("Hello Sidai Group")}
        className="fixed bottom-10 right-10 z-200 bg-[#25D366] w-16 h-16 rounded-full
          flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
        <MessageCircle size={32} color="white" />
      </button>
    </div>
  );
}