import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";

interface Sparkle {
  left: number;
  top: number;
  size: number;
  color: string;
  shadow: string;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
}

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface SproutItem {
  name: string;
  angle: number;
  radius: number;
  color: string;
}

const SPARKLE_COLORS = ["#ffd86a", "#ffb300", "#ff8c00"];
const SPARKLE_SHADOWS = ["rgba(255,216,106,0.8)", "rgba(255,179,0,0.7)", "rgba(255,140,0,0.6)"];

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const sparkles: Sparkle[] = Array.from({ length: 28 }, (_, i) => ({
  left: 5 + ((i * 8.3) % 90),
  top: 5 + ((i * 11) % 90),
  size: 1.5 + (i % 4) * 1.1,
  color: SPARKLE_COLORS[i % 3],
  shadow: SPARKLE_SHADOWS[i % 3],
  duration: 2.5 + (i % 5) * 0.8,
  delay: i * 0.22,
  dx: Math.cos((i / 28) * Math.PI * 2) * (10 + (i % 5) * 9),
  dy: Math.sin((i / 28) * Math.PI * 2) * (10 + (i % 5) * 9) - 8,
}));

// Tech stack items that sprout from keywords in the bio text
const stackItems: SproutItem[] = [
  { name: "React", angle: -125, radius: 95, color: "#ffd86a" },
  { name: "TypeScript", angle: -90, radius: 100, color: "#ffd86a" },
  { name: "Node.js", angle: -55, radius: 95, color: "#ff8c00" },
  { name: "Django", angle: -20, radius: 90, color: "#ffd86a" },
  { name: "Docker", angle: 15, radius: 90, color: "#ff8c00" },
];

const designItems: SproutItem[] = [
  { name: "Figma", angle: -120, radius: 90, color: "#ffd86a" },
  { name: "CSS3 / HTML5", angle: -85, radius: 95, color: "#ff8c00" },
  { name: "Framer Motion", angle: -50, radius: 100, color: "#ffd86a" },
  { name: "UI/UX Design", angle: -15, radius: 90, color: "#ff8c00" },
];

const projectItems: SproutItem[] = [
  { name: "Godot Engine", angle: -125, radius: 90, color: "#ffd86a" },
  { name: "React Native", angle: -90, radius: 95, color: "#ff8c00" },
  { name: "AI Integration", angle: -55, radius: 95, color: "#ffd86a" },
  { name: "Game Dev", angle: -20, radius: 90, color: "#ff8c00" },
];

// Interactive sprout element for the bio keywords
function InteractiveSprout({ text, items }: { text: string; items: SproutItem[] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      className="relative inline-block cursor-help font-bold text-[#ffd86a] underline decoration-[#ffd86a]/40 decoration-wavy underline-offset-4 hover:decoration-[#ffd86a] transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {text}
      <AnimatePresence>
        {hovered && (
          <span className="absolute inset-0 pointer-events-none z-30">
            {items.map((item, idx) => {
              const startX = Math.cos((item.angle * Math.PI) / 180) * item.radius;
              const startY = Math.sin((item.angle * Math.PI) / 180) * item.radius;
              return (
                <motion.span
                  key={idx}
                  className="absolute pointer-events-auto px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border bg-[#0f0a02]/95 backdrop-blur-md shadow-lg shadow-black/40 whitespace-nowrap"
                  initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    x: startX,
                    opacity: 1,
                    y: [startY, startY - 3, startY], // smooth floating
                    transition: {
                      scale: { type: "spring", stiffness: 300, damping: 15, delay: idx * 0.02 },
                      x: { type: "spring", stiffness: 220, damping: 18, delay: idx * 0.02 },
                      y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.15 },
                      default: { type: "spring", stiffness: 220, damping: 18, delay: idx * 0.02 }
                    }
                  }}
                  exit={{
                    scale: 0,
                    x: 0,
                    y: 0,
                    opacity: 0,
                    transition: { duration: 0.18, ease: "easeIn" }
                  }}
                  style={{
                    left: "50%",
                    top: "0%",
                    transform: "translate(-50%, -50%)",
                    borderColor: `${item.color}40`,
                    color: item.color,
                    boxShadow: `0 0 10px ${item.color}10`,
                  }}
                  whileHover={{
                    scale: 1.1,
                    borderColor: item.color,
                    boxShadow: `0 0 15px ${item.color}44`,
                  }}
                >
                  {item.name}
                </motion.span>
              );
            })}
          </span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default function About1({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas particle trails
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: TrailParticle[] = [];
    const mouse = { x: -1000, y: -1000, active: false };

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || window.innerWidth;
      canvas.height = rect?.height || window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      // Spawn trail particles on move
      if (Math.random() < 0.4) {
        const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
        particles.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 1.3 - 0.5,
          size: Math.random() * 2 + 1,
          alpha: 1,
          color,
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove, { passive: true });
      parent.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;
        p.size *= 0.98;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 40, damping: 30 });

  const { scrollYProgress: exitProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const smoothExit = useSpring(exitProgress, { stiffness: 45, damping: 25 });
  const contentOpacity = useTransform(smoothExit, [0, 0.7], [1, 0]);

  const words = ["I", "build", "things", "that", "move."];

  return (
    <motion.section
      ref={sectionRef}
      id="about1"
      className="section-page relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080400]"
    >
      {/* Dynamic Cursor Canvas Trail */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />

      {/* Fire background glows — top-left heavy (chapter 1 of 3) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[65%] h-[55%] rounded-full bg-[#c85000]/20 blur-[130px]" />
        <div className="absolute top-[40%] right-[-10%] w-[45%] h-[40%] rounded-full bg-[#e86000]/12 blur-[100px]" />
        <div className="absolute bottom-[5%] left-[15%] w-[35%] h-[30%] rounded-full bg-[#ff8c00]/10 blur-[80px]" />
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkles.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={
              {
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                background: s.color,
                boxShadow: `0 0 ${6 + (i % 4) * 3}px ${s.shadow}`,
                opacity: 0,
                animation: `project-scatter ${s.duration}s ease-out ${s.delay}s infinite`,
                "--scatter-x": `${s.dx}vw`,
                "--scatter-y": `${s.dy}vh`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Parallax glow orb */}
      <motion.div
        className="absolute w-[55vw] h-[55vw] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,140,0,0.08) 0%, rgba(200,80,0,0.03) 50%, transparent 70%)",
          y: useTransform(smooth, [0, 1], [80, -80]),
          x: useTransform(smooth, [0, 1], [-20, 20]),
          top: "15%",
          left: "25%",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-20 text-center px-5 max-w-3xl mx-auto"
        style={{ opacity: contentOpacity }}
      >
        {/* Gold accent line */}
        <motion.div
          className="mx-auto mb-8 h-px bg-gradient-to-r from-transparent via-[#ffd86a]/40 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 120, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <motion.p
          className="text-[#c9952a] text-xs tracking-[0.3em] uppercase mb-6 font-semibold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Who I am
        </motion.p>

        {/* Headline words react with springy scale & shadow on hover */}
        <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-5 gap-y-2 mb-12">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="text-[8vw] sm:text-[5vw] font-bold text-white/90 leading-none cursor-default select-none inline-block"
              variants={wordVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              custom={i}
              whileHover={{
                scale: 1.15,
                y: -6,
                color: "#ffd86a",
                textShadow: "0 0 35px #ffd86a",
                transition: { type: "spring", stiffness: 450, damping: 12 },
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Bio paragraph with interactive sprout highlights */}
        <motion.p
          className="text-[#e5d4a1]/70 text-[110%] leading-relaxed max-w-2xl mx-auto mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          I'm <span className="font-semibold text-white">Sem Luiz Warain</span> — a{" "}
          <InteractiveSprout text="Full Stack Developer" items={stackItems} /> who blends{" "}
          <InteractiveSprout text="technology and design" items={designItems} /> to create
          polished digital experiences. I build web applications,{" "}
          <InteractiveSprout text="interactive projects" items={projectItems} />, and intuitive
          interfaces with a mindset that every output represents my craft.
        </motion.p>

        <span className="text-[10px] tracking-[0.2em] text-[#e5d4a1]/80 uppercase select-none block mt-12 mb-4 animate-pulse italic">
          💡 hover over the underlined text to see my stack
        </span>

        {/* Animated bottom divider */}
        <motion.div
          className="mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-[#c85000]/30 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 80, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 1 }}
        />
      </motion.div>
    </motion.section>
  );
}
