export default function About1() {
  return (
    <section
      id="about1"
      className="snap-page relative flex min-h-screen flex-col justify-end items-center text-center px-6 pb-5 overflow-hidden"
    >
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(circle,rgba(255,115,0,0.14),transparent_100%)] blur-2xl pointer-events-none" />

      <div className="max-w-3xl w-full rounded-[28px] bg-[#070806]/10 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <p className="text-[#e5d4a1] text-sm font-medium tracking-widest uppercase mb-3">
          Who I am
        </p>
        <h2 className="text-[190%] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffd86a] via-[#f0b43a] to-[#d18a1e] mb-2 uppercase tracking-[0.2em]">
          About Me
        </h2>
        <p className="flex justify-center items-center text-[#e5d4a1] leading-relaxed text-lg">
          I'm Sem Luiz Warain — a Full Stack Developer crafting digital
          experiences with the precision of an archer and the fire of a victor.
          I build polished web apps with elegant code, dramatic motion, and a
          fierce attention to detail.
        </p>
      </div>
    </section>
  );
}
