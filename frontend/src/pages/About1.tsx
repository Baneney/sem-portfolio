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

  return (
    <section
      ref={containerRef}
      id="about1"
      className="snap-page relative flex min-h-screen flex-col justify-end items-center text-center px-5 sm:px-10 py-10 overflow-hidden"
    >
      {/* Noise + amber vignette overlays */}
      <div className="noise-texture absolute inset-0 pointer-events-none z-[1]" style={{ opacity: 0.15 }} />
      <div className="amber-vignette absolute inset-0 pointer-events-none z-[1]" />

      {/* Animated background gradients */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}`}>
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-[#ffd86a] to-transparent rounded-full blur-3xl animate-float-slow opacity-30" />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-l from-[#c85000] to-transparent rounded-full blur-3xl animate-float opacity-30"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Glowing accent elements */}
      <div className={`absolute top-1/4 left-10 w-1 h-32 bg-gradient-to-b from-[#ffd86a] to-transparent rounded-full blur-sm animate-pulse transition-all duration-300 ${isVisible ? 'opacity-20' : 'opacity-0 invisible'}`} />
      <div
        className={`absolute bottom-1/4 right-10 w-1 h-32 bg-gradient-to-t from-[#c85000] to-transparent rounded-full blur-sm animate-pulse transition-all duration-300 ${isVisible ? 'opacity-20' : 'opacity-0 invisible'}`}
        style={{ animationDelay: "0.5s" }}
      />

      {/* Radial glow effect */}
      <div className={`absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle,rgba(255,115,0,0.2),transparent_100%)] blur-3xl pointer-events-none transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}`} />

      {/* Main content card with enhanced styling */}
      <div
        ref={cardRef}
        className="max-w-3xl w-full rounded-[24px] bg-[#070806]/80 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-md border border-[#ffd86a]/20 relative overflow-hidden"
        style={{
          transform: `perspective(1000px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg) translateZ(20px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Corner glows */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ffd86a]/8 rounded-full blur-[60px]" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#c85000]/8 rounded-full blur-[60px]" />

        {/* Content wrapper */}
        <div className="relative z-10 space-y-4">
          {/* Label with animation */}
          <p
            className={`text-[#e5d4a1] text-sm font-medium tracking-widest uppercase mb-3 ${
              isVisible ? "animate-fade-in-down delay-100" : "opacity-0"
            }`}
          >
            Who I am
          </p>

          {/* Main heading with enhanced gradient and glow */}
          <h2
            className={`text-[190%] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffd86a] via-[#f0b43a] to-[#d18a1e] mb-4 uppercase tracking-[0.2em] animate-glow ${
              isVisible ? "animate-scale-in delay-200" : "opacity-0"
            }`}
          >
            About Me
          </h2>

          {/* Description text with staggered animation */}
          <p
            className={`flex justify-center items-center text-[#e5d4a1] leading-relaxed text-base sm:text-lg ${
              isVisible ? "animate-fade-in-up delay-300" : "opacity-0"
            }`}
          >
            I'm Sem Luiz Warain — a Full Stack Developer who blends technology
            and design to create polished digital experiences. I build web
            applications, interactive projects, and intuitive interfaces with a
            mindset that every output represents my craft, where good design is
            the foundation of great results.
          </p>
        </div>
      </div>
    </section>
  );
}
