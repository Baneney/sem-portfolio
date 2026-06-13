import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ExperienceCard from '../components/ExperienceCard';

interface MousePos { x: number; y: number; }

const internships = [
  {
    role: "UI/UX & Frontend Design Intern",
    company: "Camtastic Corp.",
    period: "Jan 2025 – Mar 2025",
    description: "Assisted in UI/UX design by creating wireframes, website layouts, and application graphics. Developed responsive frontend interfaces using HTML and CSS while ensuring a consistent and user-friendly experience.",
    tags: ["HTML5", "CSS"],
  },
  {
    role: "Full Stack Intern",
    company: "Lifewood Data Technology",
    period: "Mar 2025 – June 2025",
    description: "Developed web-based projects and interactive applications, including a company showcase website and game project to demonstrate development capabilities. Gained experience with AI tools, assisted with SEO strategies and content enhancements.",
    tags: ["Node.js", "PostgreSQL", "Docker"],
  },
];

export default function About2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [front, setFront] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setFront(prev => (prev + 1) % internships.length), 4000);
  }, []);

  useEffect(() => {
    if (isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      startInterval();
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isHovered, startInterval]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.02;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.02;
      setMousePos({ x, y });
    };

    const observer = new IntersectionObserver(
      ([entry]) => { setIsVisible(entry.isIntersecting); },
      { threshold: 0.3 }
    );

    observer.observe(container);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  const swap = () => setFront(prev => (prev + 1) % internships.length);

  return (
    <section
      ref={containerRef}
      id="about2"
      className="snap-page relative flex min-h-screen flex-col justify-end items-end px-5 sm:px-20 py-10 overflow-hidden"
    >
      <div className="noise-texture absolute inset-0 pointer-events-none z-[1]" style={{ opacity: 0.15 }} />
      <div className="amber-vignette absolute inset-0 pointer-events-none z-[1]" />

      <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}`}>
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-[#ffd86a] to-transparent rounded-full blur-3xl animate-float-slow opacity-30" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-l from-[#c85000] to-transparent rounded-full blur-3xl animate-float opacity-30" style={{ animationDelay: '1s' }} />
      </div>

      <div className={`absolute top-1/4 left-10 w-1 h-32 bg-gradient-to-b from-[#ffd86a] to-transparent rounded-full blur-sm animate-pulse transition-all duration-300 ${isVisible ? 'opacity-20' : 'opacity-0 invisible'}`} />
      <div className={`absolute bottom-1/4 right-10 w-1 h-32 bg-gradient-to-t from-[#c85000] to-transparent rounded-full blur-sm animate-pulse transition-all duration-300 ${isVisible ? 'opacity-20' : 'opacity-0 invisible'}`} style={{ animationDelay: '0.5s' }} />

      <div className={`absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle,rgba(255,115,0,0.2),transparent_100%)] blur-3xl pointer-events-none transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}`} />

      {/* Stacked cards */}
      <div
        className="max-w-2xl w-full relative z-10 cursor-pointer"
        style={{ height: '380px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={swap}
      >
        {/* Back card edges - fanned out like stacked papers */}
        <motion.div
          className="absolute rounded-[24px] bg-[#1a160e]/50 border border-[#ffd86a]/8"
          style={{
            width: '96%',
            height: '96%',
            top: -10,
            left: -8,
            zIndex: 5,
          }}
          animate={{
            rotate: front === 0 ? -2 : 2,
            x: front === 0 ? -6 : 6,
            y: front === 0 ? -8 : -8,
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <motion.div
          className="absolute rounded-[24px] bg-[#15120c]/35 border border-[#ffd86a]/5"
          style={{
            width: '93%',
            height: '93%',
            top: -18,
            left: -14,
            zIndex: 4,
          }}
          animate={{
            rotate: front === 0 ? -4 : 4,
            x: front === 0 ? -10 : 10,
            y: front === 0 ? -14 : -14,
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Main cards */}
        {internships.map((item, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-[24px] bg-[#070806]/50 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-md border border-[#ffd86a]/20 overflow-hidden"
            animate={{
              scale: front === i ? 1 : 0.92,
              y: front === i ? 0 : 16,
              opacity: front === i ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              zIndex: front === i ? 20 : 10,
              transform: `perspective(1000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`,
              pointerEvents: front === i ? 'auto' : 'none',
            }}
          >
            {/* Corner glows */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ffd86a]/8 rounded-full blur-[60px]" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#c85000]/8 rounded-full blur-[60px]" />

            {/* Header inside card */}
            <p className="text-[#e5d4a1] text-xs sm:text-sm font-medium tracking-[0.3em] uppercase mb-2">
              My background
            </p>
            <h2 className="text-[140%] sm:text-[190%] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffd86a] via-[#f0b43a] to-[#d18a1e] mb-5 uppercase tracking-[0.2em]">
              Experience
            </h2>

            <ExperienceCard {...item} />
            {/* Fixed bottom hint + dots */}
            <div className="absolute bottom-4 inset-x-0 flex flex-col items-center gap-2 pointer-events-auto">
              <div className="flex items-center justify-center gap-3">
                {internships.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setFront(i); if (intervalRef.current) clearInterval(intervalRef.current); startInterval(); }}
                    className="relative flex items-center justify-center w-5 h-5"
                  >
                    <span className={`absolute rounded-full transition-all duration-500 ${
                      i === front
                        ? 'w-2.5 h-2.5 bg-[#ffd86a] shadow-[0_0_12px_rgba(255,216,106,0.6)]'
                        : 'w-2 h-2 bg-white/15 hover:bg-white/30'
                    }`} />
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-white/20 tracking-wider uppercase">click to swap</p>
            </div>
          </motion.div>
        ))}

        {/* Hover glow on front card */}
        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[#ffd86a]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[21]" />
      </div>
    </section>
  );
}
