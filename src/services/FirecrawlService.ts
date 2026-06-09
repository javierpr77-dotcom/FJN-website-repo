import FirecrawlApp from '@mendable/firecrawl-js';
import { DesignReference, DesignCategory, ColorPalette, DesignMetadata } from '@/types/design';

interface CrawlResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_design_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('Firecrawl API key saved for design research');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      const testResponse = await this.firecrawlApp.scrapeUrl('https://dribbble.com');
      return testResponse.success;
    } catch (error) {
      console.error('Error testing Firecrawl API key:', error);
      return false;
    }
  }

  static async scrapeDesignPlatform(
    platform: 'dribbble' | 'behance' | 'awwwards' | 'mobbin',
    searchTerm: string,
    category?: DesignCategory
  ): Promise<CrawlResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found' };
    }

    try {
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const url = this.buildSearchUrl(platform, searchTerm, category);
      console.log(`🔍 Scraping ${platform} for: "${searchTerm}"`);
      console.log(`📍 URL: ${url}`);

      const response = await this.firecrawlApp.scrapeUrl(url, {
        formats: ['markdown', 'html'],
        includeTags: ['img', 'a', 'div', 'article', 'h1', 'h2', 'h3', 'p'],
        excludeTags: ['script', 'style', 'nav', 'footer'],
        onlyMainContent: true,
        waitFor: 2000
      });

      console.log('📦 Firecrawl Response:', {
        success: response.success
      });

      if (!response.success) {
        console.error('❌ Scraping failed:', response);
        return { success: false, error: 'Failed to scrape content' };
      }

      // TypeScript fix: access data property correctly
      const responseData = (response as any).data || response;
      console.log('📊 Response data structure:', {
        hasMarkdown: !!responseData?.markdown,
        hasHtml: !!responseData?.html,
        markdownLength: responseData?.markdown?.length || 0,
        htmlLength: responseData?.html?.length || 0
      });

      const processedData = await this.processScrapedData(responseData, platform, searchTerm);
      console.log(`✅ Processed ${processedData.length} design references`);
      
      return { success: true, data: processedData };

    } catch (error) {
      console.error(`❌ Error scraping ${platform}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private static buildSearchUrl(
    platform: string, 
    searchTerm: string, 
    category?: DesignCategory
  ): string {
    const encodedTerm = encodeURIComponent(searchTerm);
    
    switch (platform) {
      case 'dribbble':
        return `https://dribbble.com/search/shots/popular?q=${encodedTerm}`;
      case 'behance':
        return `https://www.behance.net/search/projects?search=${encodedTerm}`;
      case 'awwwards':
        return `https://www.awwwards.com/websites/?text=${encodedTerm}`;
      case 'mobbin':
        return `https://mobbin.com/browse/ios/apps?search=${encodedTerm}`;
      default:
        return `https://dribbble.com/search/shots/popular?q=${encodedTerm}`;
    }
  }

  private static async processScrapedData(
    data: any, 
    platform: string,
    searchTerm: string
  ): Promise<DesignReference[]> {
    const references: DesignReference[] = [];

    try {
      console.log('🔄 Processing scraped data...');
      
      // Use multiple extraction methods for better results
      const elements = [
        ...this.extractFromMarkdown(data.markdown, platform, searchTerm),
        ...this.extractFromHtml(data.html, platform),
        ...this.extractGenericContent(data, platform, searchTerm)
      ];

      console.log(`📊 Extracted ${elements.length} raw elements`);

      // Remove duplicates and process
      const uniqueElements = this.removeDuplicateElements(elements);
      
      for (const element of uniqueElements) {
        const reference: DesignReference = {
          id: this.generateId(),
          title: element.title || `${searchTerm} Design Reference`,
          url: element.url || '',
          imageUrl: element.imageUrl,
          description: element.description || `Design reference from ${platform}`,
          category: this.detectCategory(element, searchTerm),
          industry: this.detectIndustry(element, searchTerm),
          tags: this.extractTags(element, searchTerm),
          colors: await this.extractColors(element.imageUrl),
          dateScraped: new Date(),
          source: platform as any,
          metadata: this.analyzeMetadata(element)
        };

        references.push(reference);
      }

      console.log(`✅ Created ${references.length} design references`);

    } catch (error) {
      console.error('❌ Error processing scraped data:', error);
    }

    return references;
  }

  private static extractFromMarkdown(markdown: string, platform: string, searchTerm: string): any[] {
    if (!markdown) return [];
    
    const elements: any[] = [];
    console.log('📝 Extracting from markdown...');

    try {
      // Extract links with context
      const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      const links = [...markdown.matchAll(linkPattern)];
      
      // Extract images
      const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
      const images = [...markdown.matchAll(imagePattern)];
      
      // Extract headings and content blocks
      const headingPattern = /^#{1,3}\s+(.+)$/gm;
      const headings = [...markdown.matchAll(headingPattern)];
      
      // Create elements from extracted data
      for (let i = 0; i < Math.max(links.length, images.length, headings.length); i++) {
        const title = headings[i]?.[1] || links[i]?.[1] || `${searchTerm} Reference ${i + 1}`;
        const url = links[i]?.[2] || '';
        const imageUrl = images[i]?.[2] || '';
        
        // Extract context around the element
        const contextStart = Math.max(0, (links[i]?.index || 0) - 200);
        const contextEnd = Math.min(markdown.length, (links[i]?.index || 0) + 200);
        const context = markdown.slice(contextStart, contextEnd);
        
        elements.push({
          title: title.trim(),
          url: this.normalizeUrl(url),
          imageUrl: this.normalizeUrl(imageUrl),
          description: this.extractDescription(context),
          platform,
          context
        });
      }
      
    } catch (error) {
      console.error('Error extracting from markdown:', error);
    }

    return elements;
  }

  private static extractFromHtml(html: string, platform: string): any[] {
    if (!html) return [];
    
    const elements: any[] = [];
    console.log('🌐 Extracting from HTML...');

    try {
      // Generic patterns that work across platforms
      const patterns = [
        // Images with titles
        /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g,
        // Links with meaningful text
        /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g,
        // Article/card containers
        /<article[^>]*>(.*?)<\/article>/gs,
        /<div[^>]*class="[^"]*card[^"]*"[^>]*>(.*?)<\/div>/gs
      ];

      patterns.forEach(pattern => {
        const matches = [...html.matchAll(pattern)];
        matches.forEach((match, index) => {
          elements.push({
            title: match[2] || `Design ${index + 1}`,
            url: this.normalizeUrl(match[1]),
            imageUrl: pattern.source.includes('img') ? this.normalizeUrl(match[1]) : '',
            description: '',
            platform
          });
        });
      });
      
    } catch (error) {
      console.error('Error extracting from HTML:', error);
    }

    return elements;
  }

  private static extractGenericContent(data: any, platform: string, searchTerm: string): any[] {
    const elements: any[] = [];
    console.log('🔧 Extracting generic content...');

    try {
      // Fallback: create references based on search term and platform
      if (data.markdown || data.html) {
        const content = data.markdown || data.html || '';
        const words = content.split(/\s+/).length;
        
        if (words > 50) { // Ensure there's meaningful content
          elements.push({
            title: `${searchTerm} - ${platform} Reference`,
            url: '',
            imageUrl: '',
            description: `Design reference found on ${platform} for ${searchTerm}`,
            platform,
            content: content.slice(0, 500) // First 500 chars as description
          });
        }
      }
    } catch (error) {
      console.error('Error extracting generic content:', error);
    }

    return elements;
  }

  private static removeDuplicateElements(elements: any[]): any[] {
    const seen = new Set();
    return elements.filter(el => {
      const key = `${el.title}-${el.url}-${el.imageUrl}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private static normalizeUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return `https://example.com${url}`; // Will be replaced with actual domain
    return url;
  }

  private static extractDescription(context: string): string {
    // Extract meaningful description from context
    const sentences = context.split(/[.!?]+/).filter(s => s.trim().length > 10);
    return sentences[0]?.trim() || '';
  }

  // Legacy methods - kept for backward compatibility but now unused

  private static detectCategory(element: any, searchTerm: string = ''): DesignCategory {
    const title = (element.title || '').toLowerCase();
    const description = (element.description || '').toLowerCase();
    const context = (element.context || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    const text = `${title} ${description} ${context} ${search}`;

    // Enhanced category detection with search term context
    const categoryPatterns = {
      'mobile-app': ['mobile', 'app', 'ios', 'android', 'flutter', 'react native', 'smartphone', 'tablet'],
      'dashboard': ['dashboard', 'admin', 'analytics', 'metrics', 'control panel', 'management', 'crm'],
      'landing-page': ['landing', 'hero', 'homepage', 'marketing', 'campaign', 'conversion', 'sales page'],
      'e-commerce': ['ecommerce', 'shop', 'store', 'retail', 'commerce', 'shopping', 'marketplace', 'cart'],
      'portfolio': ['portfolio', 'personal', 'showcase', 'gallery', 'creative', 'artist', 'designer'],
      'saas': ['saas', 'software', 'platform', 'service', 'subscription', 'cloud', 'tool'],
      'fintech': ['fintech', 'banking', 'finance', 'payment', 'crypto', 'investment', 'trading'],
      'healthcare': ['healthcare', 'medical', 'health', 'doctor', 'hospital', 'clinic', 'wellness']
    };

    for (const [category, patterns] of Object.entries(categoryPatterns)) {
      if (patterns.some(pattern => text.includes(pattern))) {
        return category as DesignCategory;
      }
    }

    return 'web-design';
  }

  private static detectIndustry(element: any, searchTerm: string = ''): string[] {
    const industries: string[] = [];
    const title = (element.title || '').toLowerCase();
    const description = (element.description || '').toLowerCase();
    const context = (element.context || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    const text = `${title} ${description} ${context} ${search}`;

    const industryKeywords = {
      'fintech': ['finance', 'banking', 'payment', 'crypto', 'investment', 'trading', 'wallet', 'exchange'],
      'healthcare': ['health', 'medical', 'doctor', 'hospital', 'wellness', 'clinic', 'pharmacy', 'patient'],
      'education': ['education', 'learning', 'course', 'school', 'university', 'training', 'academy', 'student'],
      'entertainment': ['entertainment', 'music', 'video', 'game', 'streaming', 'movie', 'show', 'media'],
      'saas': ['saas', 'software', 'platform', 'tool', 'service', 'cloud', 'api', 'subscription'],
      'e-commerce': ['shop', 'store', 'retail', 'commerce', 'marketplace', 'cart', 'product', 'buy'],
      'real-estate': ['real estate', 'property', 'house', 'apartment', 'rent', 'buy', 'mortgage'],
      'travel': ['travel', 'hotel', 'booking', 'flight', 'vacation', 'tourism', 'trip'],
      'food': ['food', 'restaurant', 'recipe', 'cooking', 'delivery', 'kitchen', 'meal'],
      'fitness': ['fitness', 'gym', 'workout', 'exercise', 'sport', 'health', 'training'],
      'automotive': ['car', 'auto', 'vehicle', 'driving', 'automotive', 'transportation'],
      'construction': ['construction', 'building', 'architecture', 'contractor', 'renovation', 'home improvement']
    };

    Object.entries(industryKeywords).forEach(([industry, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        industries.push(industry);
      }
    });

    return industries.length > 0 ? industries : ['general'];
  }

  private static extractTags(element: any, searchTerm: string = ''): string[] {
    const tags: string[] = [];
    const title = (element.title || '').toLowerCase();
    const description = (element.description || '').toLowerCase();
    const context = (element.context || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    const text = `${title} ${description} ${context} ${search}`;

    const tagCategories = {
      style: ['minimal', 'modern', 'clean', 'elegant', 'sleek', 'sophisticated', 'luxury', 'premium', 'bold', 'creative'],
      theme: ['dark', 'light', 'colorful', 'monochrome', 'vibrant', 'pastel', 'neon', 'gradient'],
      layout: ['grid', 'cards', 'hero', 'sidebar', 'fullscreen', 'split', 'masonry', 'timeline'],
      interaction: ['animation', 'hover', 'scroll', 'parallax', 'transition', 'interactive', 'dynamic'],
      device: ['responsive', 'mobile', 'desktop', 'tablet', 'cross-platform'],
      framework: ['react', 'vue', 'angular', 'flutter', 'swift', 'kotlin'],
      design: ['ui', 'ux', 'flat', 'material', 'ios', 'android', 'web', 'app', 'interface'],
      content: ['dashboard', 'form', 'table', 'chart', 'graph', 'calendar', 'map', 'gallery']
    };

    Object.values(tagCategories).flat().forEach(tag => {
      if (text.includes(tag)) {
        tags.push(tag);
      }
    });

    // Add search term as a tag if it's meaningful
    if (search && search.length > 2 && !tags.includes(search)) {
      tags.push(search);
    }

    return [...new Set(tags)].slice(0, 10); // Limit to 10 tags
  }

  private static async extractColors(imageUrl?: string): Promise<ColorPalette> {
    // Placeholder for color extraction - would need image processing library
    return {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1F2937',
      extracted: ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444']
    };
  }

  private static analyzeMetadata(element: any): DesignMetadata {
    return {
      layout: 'grid',
      style: 'modern',
      components: ['button', 'card', 'navigation'],
      interactions: ['hover', 'click'],
      responsive: true,
      darkMode: false
    };
  }

  private static generateId(): string {
    return `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static async searchTrends(
    industry: string,
    category: DesignCategory,
    timeframe: '7d' | '30d' | '90d' = '30d'
  ): Promise<CrawlResult> {
    const searchTerms = this.buildTrendSearchTerms(industry, category);
    const results: DesignReference[] = [];

    for (const term of searchTerms) {
      const result = await this.scrapeDesignPlatform('dribbble', term, category);
      if (result.success && result.data) {
        results.push(...result.data);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { success: true, data: results };
  }

  private static buildTrendSearchTerms(industry: string, category: DesignCategory): string[] {
    const baseTerms = [
      `${industry} ${category}`,
      `${industry} ui design`,
      `${category} trends 2024`,
      `modern ${industry} design`
    ];

    return baseTerms;
  }
}
