import hgPin from '../assets/hg-big-pin.png'
import FireCanvas from '../components/FireCanvas'

export default function Hero() {
  return (
    <section id="about" className="snap-page relative flex flex-col justify-between px-10 md:px-16 py-10 overflow-hidden w-full">

      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#050400]">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[90%] rounded-full bg-[#c45a00]/50 blur-[140px]" />
        <div className="absolute top-[10%] right-[5%] w-[45%] h-[60%] rounded-full bg-[#e87a00]/30 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[35%] h-[50%] rounded-full bg-[#ff6a00]/20 blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050400] via-[#050400]/80 to-transparent" />
      </div>

      {/* Fire canvas — bottom left */}
      <FireCanvas />

      {/* Mockingjay pin — right side */}
      <img
        src={hgPin}
        alt=""
        className="absolute right-[-5%] top-[-5%] h-[110%] w-auto object-contain pointer-events-none opacity-90"
        style={{ zIndex: 2 }}
      />

      {/* Top-left tagline */}
      <div className="mt-16 max-w-xs relative" style={{ zIndex: 3 }}>
        <p className="text-white/70 text-sm leading-relaxed">
          Quiet creator, <em>bringing ideas to life,</em><br />
          through motion, detail and softness.
        </p>
      </div>

      {/* Big name */}
      <div className="flex items-end gap-[4vw] w-full leading-none relative" style={{ zIndex: 3 }}>
        <span className="text-[13vw] font-bold text-white leading-none tracking-tight whitespace-nowrap">
          Sem
        </span>
        <span
          className="text-[13vw] leading-none tracking-tight text-[#c9952a] whitespace-nowrap"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
        >
          Warain.
        </span>
      </div>

      {/* Bottom bar */}
      <div className="flex justify-between items-center border-t border-white/20 pt-4 text-xs tracking-widest uppercase text-white/60 relative" style={{ zIndex: 3 }}>
        <span>→ V1.0</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <span>/</span>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </div>
        <div className="flex gap-6">
          <a href="#about1" className="hover:text-white transition-colors">About</a>
          <a href="#skills" className="hover:text-white transition-colors">Skills</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>

    </section>
  )
}
