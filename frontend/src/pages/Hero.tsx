export default function Hero() {
  return (
    <section id="about" className="snap-page flex flex-col justify-center items-center text-center px-6">
      <p className="text-indigo-300 text-sm font-medium tracking-widest uppercase mb-3">Hello, I'm</p>
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">John Doe</h1>
      <p className="text-xl md:text-2xl text-indigo-200 mb-6">Full Stack Developer</p>
      <p className="max-w-xl text-gray-300 mb-10">
        I build modern, performant web applications with clean code and great user experiences.
        Passionate about turning ideas into real products.
      </p>
      <div className="flex gap-4 justify-center">
        <a href="#projects" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">View Projects</a>
        <a href="#contact" className="border border-white/40 hover:border-white text-white px-6 py-3 rounded-lg font-medium transition-colors">Contact Me</a>
      </div>
    </section>
  )
}
