export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://peerbie.com/#organization',
        name: 'Peerbie',
        alternateName: 'Peerbie Agent Studio',
        description:
          'Open-source AI agent workflow builder used by developers at trail-blazing startups to Fortune 500 companies',
        url: 'https://peerbie.com',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://peerbie.com/#logo',
          url: 'https://peerbie.com/logo/b&w/text/b&w.svg',
          contentUrl: 'https://peerbie.com/logo/b&w/text/b&w.svg',
          width: 49.78314,
          height: 24.276,
          caption: 'Peerbie Logo',
        },
        image: { '@id': 'https://peerbie.com/#logo' },
        sameAs: [
          'https://x.com/simdotai',
          'https://github.com/simstudioai/sim',
          'https://www.linkedin.com/company/simstudioai/',
          'https://discord.gg/Hr4UWYEcTT',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          availableLanguage: ['en'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://peerbie.com/#website',
        url: 'https://peerbie.com',
        name: 'Peerbie - AI Agent Workflow Builder',
        description:
          'Sim is the open-source platform to build AI agents and run your agentic workforce. Connect 1,000+ integrations and LLMs to deploy and orchestrate agentic workflows. Join 100,000+ builders.',
        publisher: {
          '@id': 'https://peerbie.com/#organization',
        },
        potentialAction: [
          {
            '@type': 'SearchAction',
            '@id': 'https://peerbie.com/#searchaction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://peerbie.com/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        ],
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebPage',
        '@id': 'https://peerbie.com/#webpage',
        url: 'https://peerbie.com',
        name: 'Peerbie - Workflows for LLMs | Build AI Agent Workflows',
        isPartOf: {
          '@id': 'https://peerbie.com/#website',
        },
        about: {
          '@id': 'https://peerbie.com/#software',
        },
        datePublished: '2024-01-01T00:00:00+00:00',
        dateModified: new Date().toISOString(),
        description:
          'Build and deploy AI agent workflows with Peerbie Agent Studio. Visual drag-and-drop interface for creating powerful LLM-powered automations.',
        breadcrumb: {
          '@id': 'https://peerbie.com/#breadcrumb',
        },
        inLanguage: 'en-US',
        potentialAction: [
          {
            '@type': 'ReadAction',
            target: ['https://peerbie.com'],
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://peerbie.com/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://peerbie.com',
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://peerbie.com/#software',
        name: 'Peerbie Agent Studio - AI Agent Workflow Builder',
        description:
          'Sim is the open-source platform to build AI agents and run your agentic workforce. Connect 1,000+ integrations and LLMs to deploy and orchestrate agentic workflows. Create agents, workflows, knowledge bases, tables, and docs. Trusted by over 100,000 builders. SOC2 and HIPAA compliant.',
        applicationCategory: 'DeveloperApplication',
        applicationSubCategory: 'AI Development Tools',
        operatingSystem: 'Web, Windows, macOS, Linux',
        softwareVersion: '1.0',
        offers: [
          {
            '@type': 'Offer',
            '@id': 'https://peerbie.com/#offer-free',
            name: 'Community Plan',
            price: '0',
            priceCurrency: 'USD',
            priceValidUntil: '2026-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability: 'https://schema.org/InStock',
            seller: {
              '@id': 'https://peerbie.com/#organization',
            },
            eligibleRegion: {
              '@type': 'Place',
              name: 'Worldwide',
            },
          },
          {
            '@type': 'Offer',
            '@id': 'https://peerbie.com/#offer-pro',
            name: 'Pro Plan',
            price: '20',
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '20',
              priceCurrency: 'USD',
              unitText: 'MONTH',
              billingIncrement: 1,
            },
            priceValidUntil: '2026-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability: 'https://schema.org/InStock',
            seller: {
              '@id': 'https://peerbie.com/#organization',
            },
          },
          {
            '@type': 'Offer',
            '@id': 'https://peerbie.com/#offer-team',
            name: 'Team Plan',
            price: '40',
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '40',
              priceCurrency: 'USD',
              unitText: 'MONTH',
              billingIncrement: 1,
            },
            priceValidUntil: '2026-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability: 'https://schema.org/InStock',
            seller: {
              '@id': 'https://peerbie.com/#organization',
            },
          },
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '150',
          bestRating: '5',
          worstRating: '1',
        },
        featureList: [
          'AI agent creation',
          'Agentic workflow orchestration',
          '1,000+ integrations',
          'LLM orchestration (OpenAI, Anthropic, Google, xAI, Mistral, Perplexity)',
          'Knowledge base creation',
          'Table creation',
          'Document creation',
          'API access',
          'Custom functions',
          'Scheduled workflows',
          'Event triggers',
        ],
        screenshot: [
          {
            '@type': 'ImageObject',
            url: 'https://peerbie.com/screenshots/workflow-builder.png',
            caption: 'Sim workflow builder interface',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://peerbie.com/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Sim?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim is the open-source platform to build AI agents and run your agentic workforce. Teams connect 1,000+ integrations and LLMs to deploy and orchestrate agentic workflows. Create agents, workflows, knowledge bases, tables, and docs. Trusted by over 100,000 builders. SOC2 and HIPAA compliant.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which AI models does Sim support?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim supports all major AI models including OpenAI (GPT-5, GPT-4o), Anthropic (Claude), Google (Gemini), xAI (Grok), Mistral, Perplexity, and many more. You can also connect to open-source models via Ollama.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need coding skills to use Sim?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No coding skills are required. Sim provides a visual interface for building AI agents and agentic workflows. Developers can also use custom functions, the API, and the CLI/SDK for advanced use cases.',
            },
          },
        ],
      },
    ],
  }

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
