import { useEffect, useRef, useState } from 'react';

interface MousePos {
  x: number;
  y: number;
}

export default function About1() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.02;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.02;
      setMousePos({ x, y });
    };

    // Trigger animation when component becomes visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(container);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="about1"
      className="snap-page relative flex min-h-screen flex-col justify-end items-center text-center px-6 pb-5 overflow-hidden"
    >
      {/* Animated background gradients */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-gradient-to-r from-[#ffd86a] to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-l from-[#c85000] to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Glowing accent elements */}
      <div className="absolute top-1/4 left-10 w-1 h-32 bg-gradient-to-b from-[#ffd86a] to-transparent opacity-20 rounded-full blur-sm animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-1 h-32 bg-gradient-to-t from-[#c85000] to-transparent opacity-20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />

      {/* Radial glow effect */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle,rgba(255,115,0,0.2),transparent_100%)] blur-3xl pointer-events-none" />

      {/* Main content card with enhanced styling */}
      <div
        ref={cardRef}
        className="max-w-3xl w-full rounded-[28px] bg-[#070806]/20 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-md border border-[#ffd86a]/20 relative group hover-glow"
        style={{
          transform: `perspective(1000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg) translateZ(20px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Animated border glow effect */}
        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-[#ffd86a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Decorative floating dots */}
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ffd86a] rounded-full opacity-0 group-hover:opacity-20 blur-sm animate-pulse transition-opacity duration-300" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#c85000] rounded-full opacity-0 group-hover:opacity-20 blur-sm animate-pulse transition-opacity duration-300" style={{ animationDelay: '0.5s' }} />

        {/* Content wrapper */}
        <div className="relative z-10 space-y-4">
          {/* Label with animation */}
          <p
            className={`text-[#e5d4a1] text-sm font-medium tracking-widest uppercase mb-3 ${
              isVisible ? 'animate-fade-in-down delay-100' : 'opacity-0'
            }`}
          >
            Who I am
          </p>

          {/* Main heading with enhanced gradient and glow */}
          <h2
            className={`text-[190%] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffd86a] via-[#f0b43a] to-[#d18a1e] mb-4 uppercase tracking-[0.2em] animate-glow ${
              isVisible ? 'animate-scale-in delay-200' : 'opacity-0'
            }`}
          >
            About Me
          </h2>

          {/* Description text with staggered animation */}
          <p
            className={`flex justify-center items-center text-[#e5d4a1] leading-relaxed text-lg ${
              isVisible ? 'animate-fade-in-up delay-300' : 'opacity-0'
            }`}
          >
            I'm Sem Luiz Warain — a Full Stack Developer crafting digital
            experiences with the precision of an archer and the fire of a victor.
            I build polished web apps with elegant code, dramatic motion, and a
            fierce attention to detail.
          </p>
        </div>

        {/* Animated underline accent */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-[#ffd86a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-sm" />
      </div>

    </section>
  );
}
