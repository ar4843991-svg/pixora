import { Helmet } from 'react-helmet-async'

function SEO({ title, description }) {
  const canonicalUrl = window.location.origin + window.location.pathname

  return (
    <Helmet>
      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />
    </Helmet>
  )
}

export default SEO