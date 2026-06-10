import hgPin from '../assets/hg-big-pin.png'
import FireCanvas from '../components/FireCanvas'
import PinShine from '../components/PinShine'

export default function Hero() {
  return (
    <section id="about" className="snap-page relative flex flex-col justify-between px-10 md:px-16 py-10 overflow-hidden w-full">

      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#080400]">
        {/* Fire container — change translateX to move fire left/right, translateY to move up/down */}
        <div className="absolute inset-0" style={{ transform: 'translateX(6%)' }}>
          <div className="absolute top-[0%] right-[-20%] w-[90%] h-[100%] rounded-full bg-[#c85000]/80 blur-[120px]" />
          <div className="absolute top-[5%] right-[-10%] w-[65%] h-[85%] rounded-full bg-[#e86000]/70 blur-[70px]" />
          <div className="absolute top-[12%] right-[0%] w-[45%] h-[70%] rounded-full bg-[#ff8c00]/80 blur-[40px]" />
          <div className="absolute top-[18%] right-[8%] w-[30%] h-[55%] rounded-full bg-[#ffb300]/70 blur-[20px]" />
          <div className="absolute top-[22%] right-[14%] w-[18%] h-[40%] rounded-full bg-[#ffd700]/80 blur-[10px]" />
          <div className="absolute top-[27%] right-[19%] w-[8%] h-[22%] rounded-full bg-[#fff5c0]/60 blur-[5px]" />
        </div>
        {/* dark crush — left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080400] from-30% via-[#080400]/70 via-50% to-transparent" />
        {/* dark top & bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080400]/80 via-transparent to-[#080400]/80" />
      </div>

      {/* Fire canvas — bottom left */}
      <FireCanvas />

      {/* Mockingjay pin — right side with shine */}
      <div className="absolute right-[-5%] top-[-5%] h-[137%] pointer-events-none" style={{ zIndex: 2 }}>
        <PinShine src={hgPin} />
      </div>

      {/* Top-left tagline */}
      <div className="mt-16 max-w-lg relative" style={{ zIndex: 3 }}>
        <p className="text-white/70 text-2xl leading-relaxed">
          Quiet creator, <em>bringing ideas to life,</em><br />
          through motion, detail and softness.
        </p>
      </div>

      {/* Big name */}
      <div className="flex items-end gap-[2vw] w-[80%] leading-none relative" style={{ zIndex: 3 }}>
        <span className="text-[10vw] font-bold text-white leading-none tracking-tight whitespace-nowrap">
          Sem
        </span>
        <span className="text-[10vw] leading-none tracking-tight text-[#c9952a] whitespace-nowrap">
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
