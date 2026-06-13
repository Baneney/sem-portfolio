import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MousePos {
  x: number;
  y: number;
}

const internships = [
  {
    role: "UI/UX & Frontend Design Intern",
    company: "Camtastic Corp.",
    period: "Jan 2025 – Mar 2025",
    description:
      "Assisted in UI/UX design by creating wireframes, website layouts, and application graphics. Developed responsive frontend interfaces using HTML and CSS while ensuring a consistent and user-friendly experience.",
    tags: ["HTML5", "CSS"],
  },
  {
    role: "Full Stack Intern",
    company: "Lifewood Data Technology",
    period: "Mar 2025 – June 2025",
    description:
      "Developed web-based projects and interactive applications, including a company showcase website and game project to demonstrate development capabilities. Gained experience with AI tools, assisted with SEO strategies and content enhancements to improve user experience and online visibility.",
    tags: ["Node.js", "PostgreSQL", "Docker"],
  },
];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 20 : -20, filter: 'blur(6px)' }),
  center: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -20 : 20, filter: 'blur(6px)' }),
};

export default function About2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActive(prev => (prev + 1) % internships.length);
    }, 4000);
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

  const goTo = (idx: number) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
    if (intervalRef.current) clearInterval(intervalRef.current);
    startInterval();
  };

  return (
    <section
      ref={containerRef}
      id="about2"
      className="snap-page relative flex min-h-screen flex-col justify-end items-end px-5 sm:px-10 pb-10 overflow-hidden"
    >
      {/* Noise + amber vignette overlays */}
      <div className="noise-texture absolute inset-0 pointer-events-none z-[1]" style={{ opacity: 0.15 }} />
      <div className="amber-vignette absolute inset-0 pointer-events-none z-[1]" />

      {/* Animated background gradients */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}`}>
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-[#ffd86a] to-transparent rounded-full blur-3xl animate-float-slow opacity-30" />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-l from-[#c85000] to-transparent rounded-full blur-3xl animate-float opacity-30"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Glowing accent elements */}
      <div className={`absolute top-1/4 left-10 w-1 h-32 bg-gradient-to-b from-[#ffd86a] to-transparent rounded-full blur-sm animate-pulse transition-all duration-300 ${isVisible ? 'opacity-20' : 'opacity-0 invisible'}`} />
      <div
        className={`absolute bottom-1/4 right-10 w-1 h-32 bg-gradient-to-t from-[#c85000] to-transparent rounded-full blur-sm animate-pulse transition-all duration-300 ${isVisible ? 'opacity-20' : 'opacity-0 invisible'}`}
        style={{ animationDelay: '0.5s' }}
      />

      {/* Radial glow effect */}
      <div className={`absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle,rgba(255,115,0,0.2),transparent_100%)] blur-3xl pointer-events-none transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}`} />

      {/* Main content card */}
      <div
        className="max-w-2xl w-full rounded-[28px] bg-[#070806]/20 p-6 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-md border border-[#ffd86a]/20 relative group hover-glow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: `perspective(1000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg) translateZ(20px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Animated border glow effect */}
        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-[#ffd86a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Decorative floating dots */}
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ffd86a] rounded-full opacity-0 group-hover:opacity-20 blur-sm animate-pulse transition-opacity duration-300" />
        <div
          className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#c85000] rounded-full opacity-0 group-hover:opacity-20 blur-sm animate-pulse transition-opacity duration-300"
          style={{ animationDelay: '0.5s' }}
        />

        {/* Content wrapper */}
        <div className="relative z-10 space-y-4">
          <p
            className={`text-[#e5d4a1] text-sm font-medium tracking-widest uppercase mb-3 ${
              isVisible ? 'animate-fade-in-down delay-100' : 'opacity-0'
            }`}
          >
            My background
          </p>

          <h2
            className={`text-[190%] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffd86a] via-[#f0b43a] to-[#d18a1e] mb-4 uppercase tracking-[0.2em] animate-glow ${
              isVisible ? 'animate-scale-in delay-200' : 'opacity-0'
            }`}
          >
            Experience
          </h2>

          {/* Swappable internship card */}
          <div className="relative min-h-[200px] overflow-hidden cursor-pointer pt-2" onClick={() => goTo((active + 1) % internships.length)}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                  <div>
                    <h3 className="text-white text-base sm:text-lg font-bold leading-tight">
                      {internships[active].role}
                    </h3>
                    <p className="text-[#ffd86a]/70 text-sm font-medium mt-0.5">
                      {internships[active].company}
                    </p>
                  </div>
                  <span className="text-white/25 text-[11px] tracking-wider sm:whitespace-nowrap mt-1">
                    {internships[active].period}
                  </span>
                </div>

                <p className="text-[#e5d4a1]/80 leading-relaxed text-sm">
                  {internships[active].description}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {internships[active].tags.map(t => (
                    <span
                      key={t}
                      className="text-[10px] px-2.5 py-1 rounded-full border text-[#ffd86a]/60 border-[#ffd86a]/15 bg-[#ffd86a]/[0.04]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {internships.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                className="relative flex items-center justify-center w-5 h-5 group"
              >
                <span
                  className={`absolute rounded-full transition-all duration-500 ${
                    i === active
                      ? 'w-2.5 h-2.5 bg-[#ffd86a] shadow-[0_0_12px_rgba(255,216,106,0.6)]'
                      : 'w-2 h-2 bg-white/15 group-hover:bg-white/30'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Animated underline accent */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-[#ffd86a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-sm" />
      </div>
    </section>
  );
}
