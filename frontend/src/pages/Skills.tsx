const skills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js',
  'Python', 'SQL', 'Git', 'Docker', 'REST APIs', 'Tailwind CSS',
]

export default function Skills() {
  return (
    <section id="skills" className="snap-page flex flex-col justify-end px-6 pb-24">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Skills</h2>
        <p className="text-center text-gray-400 mb-12">Technologies I work with</p>
        <div className="flex flex-wrap justify-center gap-3">
          {skills.map(skill => (
            <span key={skill} className="bg-black/40 border border-white/20 text-gray-200 px-5 py-2 rounded-full text-sm hover:border-indigo-400 hover:text-white transition-colors backdrop-blur-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
