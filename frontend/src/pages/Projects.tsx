const projects = [
  {
    title: 'E-Commerce App',
    description: 'A full-stack online store with cart, auth, and payment integration.',
    tech: ['React', 'Node.js', 'MongoDB'],
    github: '#', live: '#',
  },
  {
    title: 'Task Manager',
    description: 'A productivity app to manage tasks with drag-and-drop and real-time sync.',
    tech: ['TypeScript', 'React', 'Firebase'],
    github: '#', live: '#',
  },
  {
    title: 'Weather Dashboard',
    description: 'Displays real-time weather data using a public API with interactive charts.',
    tech: ['JavaScript', 'Python', 'REST API'],
    github: '#', live: '#',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="free-page snap-page-dark flex flex-col justify-end px-6 pb-24">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Projects</h2>
        <p className="text-center text-gray-400 mb-12">Things I've built</p>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.title} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex flex-col hover:border-indigo-400 transition-colors">
              <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
              <p className="text-gray-300 text-sm flex-1 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tech.map(t => (
                  <span key={t} className="bg-indigo-900/60 text-indigo-200 text-xs px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
              <div className="flex gap-4 text-sm">
                <a href={project.github} className="text-gray-300 hover:text-white transition-colors">GitHub →</a>
                <a href={project.live} className="text-indigo-300 hover:text-indigo-200 transition-colors">Live →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
