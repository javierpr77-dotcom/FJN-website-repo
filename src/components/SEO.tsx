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

  // Schema.org JSON-LD for advanced GEO / GIO optimization
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://fjndigitalmedia.com/#agency",
    "name": "FJNDigitalMedia",
    "alternateName": ["FJN Digital Media", "FJN Digital Media Agency", "FJNDigitalMedia Puerto Rico"],
    "description": seoDescription,
    "url": "https://fjndigitalmedia.com",
    "logo": image || "https://fjndigitalmedia.com/logo.jpg",
    "image": image,
    "priceRange": "$$$",
    "telephone": "+17870000000",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Juan",
      "addressRegion": "PR",
      "postalCode": "00901",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.4655",
      "longitude": "-66.1180"
    },
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Puerto Rico",
        "sameAs": "https://en.wikipedia.org/wiki/Puerto_Rico"
      },
      {
        "@type": "AdministrativeArea",
        "name": "San Juan",
        "sameAs": "https://en.wikipedia.org/wiki/San_Juan,_Puerto_Rico"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Guaynabo",
        "sameAs": "https://en.wikipedia.org/wiki/Guaynabo,_Puerto_Rico"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Bayamón",
        "sameAs": "https://en.wikipedia.org/wiki/Bayam%C3%B3n,_Puerto_Rico"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Carolina",
        "sameAs": "https://en.wikipedia.org/wiki/Carolina,_Puerto_Rico"
      }
    ],
    "knowsAbout": [
      "Web Design & Development",
      "Conversion Rate Optimization (CRO)",
      "Generative Engine Optimization (GEO)",
      "Search Engine Optimization (SEO)",
      "High-Converting Funnels",
      "React & Next.js Development",
      "Enterprise software architecture",
      "Digital Marketing and Lead Generation"
    ],
    "sameAs": [
      "https://facebook.com/fjndigitalmedia",
      "https://instagram.com/fjndigitalmedia",
      "https://linkedin.com/company/fjndigitalmedia"
    ],
    "founder": {
      "@type": "Person",
      "name": "FJN Digital Team"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "E-Commerce & Strategic Web Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Strategic Web System (E-commerce / Landing)",
            "description": "Custom coded React web systems optimized for 30%+ conversions, built with modern UI and smooth 60fps animations."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Generative Engine Optimization (GEO)",
            "description": "Next-gen AIO and LLM visibility strategy to position brands within Google AI Overviews, Gemini, and ChatGPT recommendations."
          }
        }
      ]
    }
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
