import { Helmet } from 'react-helmet-async'

function SEO({ title, description }) {
  const canonicalUrl =
    window.location.origin + window.location.pathname

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Pixora',
    url: canonicalUrl,
    description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <Helmet>
      {/* Basic SEO */}
      <html lang="en" />

      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <meta
        name="googlebot"
        content="index, follow"
      />

      {/* Canonical */}
      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {/* Open Graph */}
      <meta
        property="og:locale"
        content="en_US"
      />

      <meta
        property="og:site_name"
        content="Pixora"
      />

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

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  )
}

export default SEO