import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title,
  description,
  image = 'https://midomain.com/og-image.jpg', // Replace with an actual OpenGraph image URL later
  url = 'https://midomain.com',
  type = 'website'
}: SEOProps) => {
  const { language } = useLanguage();

  // Default SEO texts based on language
  const defaultTitle = language === 'es' 
    ? 'Desarrollo Web Estratégico | Alto Rendimiento' 
    : 'Strategic Web Development | High Performance';

  const defaultDescription = language === 'es'
    ? 'Desarrollamos websites estratégicos que transforman visitantes en clientes. Sin plantillas genéricas. Sin excusas. Solo resultados garantizados.'
    : 'We develop strategic websites that transform visitors into clients. No generic templates. No excuses. Just guaranteed results.';

  const seoTitle = title ? `${title} | Agence` : defaultTitle;
  const seoDescription = description || defaultDescription;

  // Schema.org JSON-LD
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Web Development Agency",
    "description": seoDescription,
    "url": url,
    "image": image,
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Puerto Rico"
    },
    "knowsAbout": ["Web Development", "Conversion Rate Optimization", "SEO", "React", "TypeScript", "Tailwind CSS"]
  };

  return (
    <Helmet htmlAttributes={{ lang: language }}>
      {/* Standard Metadata */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={url} />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
