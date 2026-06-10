export default function Contact() {
  return (
    <section id="contact" className="snap-page snap-page-dark flex flex-col justify-center px-6 bg-gray-950/80">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Get In Touch</h2>
        <p className="text-gray-400 mb-10">
          I'm currently open to new opportunities. Whether you have a question or just want to say hi, my inbox is always open.
        </p>
        <a href="mailto:johndoe@email.com" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-block mb-10">
          Say Hello
        </a>
        <div className="flex justify-center gap-6 text-gray-400">
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
        </div>
      </div>
    </section>
  )
}
