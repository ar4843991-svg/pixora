import Card from '../components/Card'
import tools from '../Data/tools'
function ToolsSection() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#5E3122]">
            Our Tools
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#1D4533] sm:text-4xl">
            Image Tools
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Everything you need to compress, resize and convert your images.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <Card
              key={tool.slug}
              title={tool.title}
              description={tool.description}
              slug={tool.slug}
              icon={tool.icon}
              action={tool.action}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ToolsSection