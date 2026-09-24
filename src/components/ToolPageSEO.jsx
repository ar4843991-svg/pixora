import SEO from './SEO'

function ToolPageSEO({
  title,
  description,
}) {
  const pageTitle = `${title} | Pixora`

  return (
    <SEO
      title={pageTitle}
      description={description}
    />
  )
}

export default ToolPageSEO