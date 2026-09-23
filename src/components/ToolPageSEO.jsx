import SEO from './SEO'

function ToolPageSEO({
  title,
  description,
}) {
  return (
    <SEO
      title={`${title} | Pixora`}
      description={description}
    />
  )
}

export default ToolPageSEO