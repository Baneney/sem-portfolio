import { useEffect, useRef, useState } from 'react';

export default function About3() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const cardRef       = useRef<HTMLDivElement>(null);
  const orbTopRef     = useRef<HTMLDivElement>(null);
  const orbBottomRef  = useRef<HTMLDivElement>(null);
  const glowLeftRef   = useRef<HTMLDivElement>(null);
  const glowRightRef  = useRef<HTMLDivElement>(null);
  const exitGlowRef   = useRef<HTMLDivElement>(null);
  const labelRef      = useRef<HTMLParagraphElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const descRef       = useRef<HTMLParagraphElement>(null);

  const [isVisible, setIsVisible] = useState(false);

  const mouseRef  = useRef({ x: 0, y: 0 });
  const progress  = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    const snap = document.getElementById('snap-container');
    if (!el) return;

    const onMouse = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - r.left - r.width  / 2) * 0.02,
        y: (e.clientY - r.top  - r.height / 2) * 0.02,
      };
    };

    const observer = new IntersectionObserver(
      ([entry]) => { setIsVisible(entry.isIntersecting); },
      { threshold: 0.3 },
    );

    const apply = () => {
      const p = progress.current;
      const m = mouseRef.current;

      // Card — moves up, tilts back, scales down, fades
      if (cardRef.current) {
        const ty   = -p * 45;
        const rx   = -m.y - p * 12;
        const sc   = 1 - p * 0.1;
        const op   = Math.max(0, 1 - p * 1.5);
        cardRef.current.style.transform =
          `perspective(1000px) rotateX(${rx}deg) rotateY(${m.x}deg) translateZ(20px) translateY(${ty}px) scale(${sc})`;
        cardRef.current.style.opacity = String(op);
      }

      // Background orbs — drift at different speeds (parallax depth)
      if (orbTopRef.current) {
        orbTopRef.current.style.transform = `translate(${-p * 18}px, ${-p * 30}px)`;
        orbTopRef.current.style.opacity   = String(Math.max(0, 0.3 - p * 0.2));
      }
      if (orbBottomRef.current) {
        orbBottomRef.current.style.transform = `translate(${p * 25}px, ${p * 45}px)`;
        orbBottomRef.current.style.opacity   = String(Math.max(0, 0.3 - p * 0.2));
      }

      // Glow lines — stretch vertically and dissolve
      if (glowLeftRef.current) {
        glowLeftRef.current.style.transform = `scaleY(${1 + p * 2})`;
        glowLeftRef.current.style.opacity   = String(Math.max(0, 0.2 - p * 0.15));
      }
      if (glowRightRef.current) {
        glowRightRef.current.style.transform = `scaleY(${1 + p * 2})`;
        glowRightRef.current.style.opacity   = String(Math.max(0, 0.2 - p * 0.15));
      }

      // Exit glow — expands as card scrolls away
      if (exitGlowRef.current) {
        exitGlowRef.current.style.opacity   = String(Math.min(1, p * 3));
        exitGlowRef.current.style.transform = `scale(${0.6 + p * 0.8})`;
      }

      // Text — staggered drift (label slow, heading medium, desc fast)
      if (labelRef.current) {
        labelRef.current.style.transform = `translateY(${-p * 25}px)`;
        labelRef.current.style.opacity   = String(Math.max(0, 1 - p * 1.8));
      }
      if (headingRef.current) {
        headingRef.current.style.transform = `translateY(${-p * 35}px)`;
        headingRef.current.style.opacity   = String(Math.max(0, 1 - p * 1.4));
      }
      if (descRef.current) {
        descRef.current.style.transform = `translateY(${-p * 50}px)`;
        descRef.current.style.opacity   = String(Math.max(0, 1 - p * 1.1));
      }
    };

    const onScroll = () => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      progress.current = Math.max(0, Math.min(1.5, -r.top / window.innerHeight));
      apply();
    };

    observer.observe(el);
    el.addEventListener('mousemove', onMouse);
    snap?.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      el.removeEventListener('mousemove', onMouse);
      snap?.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="about3"
      className="snap-page relative flex min-h-screen flex-col justify-end items-start px-5 sm:px-10 pb-10 overflow-hidden"
    >
      {/* Parallax background gradients — only visible when in view */}
      <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}`}>
        <div
          ref={orbTopRef}
          className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-[#ffd86a] to-transparent rounded-full blur-3xl animate-float-slow opacity-30"
        />
        <div
          ref={orbBottomRef}
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-l from-[#c85000] to-transparent rounded-full blur-3xl animate-float opacity-30"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Parallax glow accent lines */}
      <div ref={glowLeftRef} className={`absolute top-1/4 left-10 w-1 h-32 bg-gradient-to-b from-[#ffd86a] to-transparent rounded-full blur-sm animate-pulse transition-all duration-300 ${isVisible ? 'opacity-20' : 'opacity-0 invisible'}`} />
      <div ref={glowRightRef} className={`absolute bottom-1/4 right-10 w-1 h-32 bg-gradient-to-t from-[#c85000] to-transparent rounded-full blur-sm animate-pulse transition-all duration-300 ${isVisible ? 'opacity-20' : 'opacity-0 invisible'}`} style={{ animationDelay: '0.5s' }} />

      {/* Radial glow effect */}
      <div className={`absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle,rgba(255,115,0,0.15),transparent_100%)] blur-3xl pointer-events-none transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}`} />

      {/* Exit glow — only visible when in view, fades on scroll */}
      <div
        ref={exitGlowRef}
        className={`absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,200,80,0.15),rgba(200,80,0,0.08),transparent_65%)] blur-3xl pointer-events-none transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}`}
      />

      {/* Main content card — scroll parallax + mouse tilt */}
      <div
        ref={cardRef}
        className="max-w-2xl w-full rounded-[28px] bg-[#070806]/20 p-6 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-md border border-[#ffd86a]/20 relative group hover-glow"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Border glow */}
        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-[#ffd86a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Decorative dots */}
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ffd86a] rounded-full opacity-0 group-hover:opacity-20 blur-sm animate-pulse transition-opacity duration-300" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#c85000] rounded-full opacity-0 group-hover:opacity-20 blur-sm animate-pulse transition-opacity duration-300" style={{ animationDelay: '0.5s' }} />

        {/* Content wrapper — staggered text parallax */}
        <div className="flex flex-col items-start z-10 space-y-4 text-left">
          <p
            ref={labelRef}
            className={`text-[#e5d4a1] text-sm font-medium tracking-widest uppercase mb-3 ${
              isVisible ? 'animate-fade-in-down delay-100' : 'opacity-0'
            }`}
          >
            What drives me
          </p>

          <h2
            ref={headingRef}
            className={`text-[190%] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffd86a] via-[#f0b43a] to-[#d18a1e] mb-4 uppercase tracking-[0.2em] animate-glow ${
              isVisible ? 'animate-scale-in delay-200' : 'opacity-0'
            }`}
          >
            Philosophy
          </h2>

          <p
            ref={descRef}
            className={`text-[#e5d4a1] leading-relaxed text-base sm:text-lg ${
              isVisible ? 'animate-fade-in-up delay-300' : 'opacity-0'
            }`}
          >
            I believe great software is built at the intersection of technical excellence and human empathy.
            Every line of code is an opportunity to make someone's life a little easier.
          </p>
        </div>

        {/* Underline accent */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-[#ffd86a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-sm" />
      </div>

    </section>
  );
}
