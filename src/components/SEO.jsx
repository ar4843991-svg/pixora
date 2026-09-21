import { Helmet } from 'react-helmet-async'

function SEO({ title, description }) {
  const canonicalUrl =
    window.location.origin + window.location.pathname

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="robots"
        content="index, follow"
      />

      {/* Canonical */}
      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {/* Open Graph */}
      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      {/* Twitter */}
      <meta
        name="twitter:card"
        content="summary"
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
      />
    </Helmet>
  )
}

export default SEO