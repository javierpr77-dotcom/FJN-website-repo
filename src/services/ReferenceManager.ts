import { 
  DesignReference, 
  SearchQuery, 
  AnalysisResult, 
  TrendAnalysis,
  DesignCategory 
} from '@/types/design';
import { DesignAnalyzer } from './DesignAnalyzer';

export class ReferenceManager {
  private static STORAGE_KEY = 'design_references';
  private static ANALYTICS_KEY = 'design_analytics';
  private static MAX_REFERENCES = 1000; // Limit storage

  // Reference Management
  static saveReferences(references: DesignReference[]): void {
    const existing = this.getAllReferences();
    const combined = [...existing, ...references];
    
    // Remove duplicates and limit storage
    const unique = this.removeDuplicates(combined).slice(0, this.MAX_REFERENCES);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(unique));
    
    // Update analytics
    this.updateAnalytics(unique);
    
    console.log(`Saved ${references.length} new references. Total: ${unique.length}`);
  }

  static getAllReferences(): DesignReference[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading references:', error);
      return [];
    }
  }

  static getReference(id: string): DesignReference | null {
    const references = this.getAllReferences();
    return references.find(ref => ref.id === id) || null;
  }

  static deleteReference(id: string): boolean {
    const references = this.getAllReferences();
    const filtered = references.filter(ref => ref.id !== id);
    
    if (filtered.length !== references.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      this.updateAnalytics(filtered);
      return true;
    }
    
    return false;
  }

  static clearAllReferences(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.ANALYTICS_KEY);
    console.log('All references cleared');
  }

  // Search and Filtering
  static searchReferences(query: SearchQuery): DesignReference[] {
    const references = this.getAllReferences();
    
    return references.filter(ref => {
      // Text search
      if (query.term) {
        const searchTerm = query.term.toLowerCase();
        const searchableText = `
          ${ref.title} 
          ${ref.description} 
          ${ref.tags.join(' ')} 
          ${ref.industry.join(' ')}
        `.toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Category filter
      if (query.category && ref.category !== query.category) {
        return false;
      }

      // Industry filter
      if (query.industry && !ref.industry.includes(query.industry)) {
        return false;
      }

      // Tags filter
      if (query.tags && query.tags.length > 0) {
        const hasMatchingTag = query.tags.some(tag => 
          ref.tags.includes(tag.toLowerCase())
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      // Color filter
      if (query.colors && query.colors.length > 0) {
        const hasMatchingColor = query.colors.some(color => 
          ref.colors.extracted.includes(color) ||
          ref.colors.primary === color ||
          ref.colors.secondary === color ||
          ref.colors.accent === color
        );
        if (!hasMatchingColor) {
          return false;
        }
      }

      // Source filter
      if (query.source && ref.source !== query.source) {
        return false;
      }

      // Date range filter
      if (query.dateRange) {
        const refDate = new Date(ref.dateScraped);
        if (refDate < query.dateRange.from || refDate > query.dateRange.to) {
          return false;
        }
      }

      return true;
    });
  }

  static getUniqueCategories(): DesignCategory[] {
    const references = this.getAllReferences();
    const categories = new Set(references.map(ref => ref.category));
    return Array.from(categories);
  }

  static getUniqueIndustries(): string[] {
    const references = this.getAllReferences();
    const industries = new Set(references.flatMap(ref => ref.industry));
    return Array.from(industries).sort();
  }

  static getUniqueTags(): string[] {
    const references = this.getAllReferences();
    const tags = new Set(references.flatMap(ref => ref.tags));
    return Array.from(tags).sort();
  }

  static getUniqueSources(): string[] {
    const references = this.getAllReferences();
    const sources = new Set(references.map(ref => ref.source));
    return Array.from(sources);
  }

  // Analytics and Insights
  static getAnalytics(): AnalysisResult | null {
    try {
      const stored = localStorage.getItem(this.ANALYTICS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading analytics:', error);
      return null;
    }
  }

  static updateAnalytics(references?: DesignReference[]): void {
    const refs = references || this.getAllReferences();
    const analysis = DesignAnalyzer.analyzeReferences(refs);
    
    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify({
      ...analysis,
      lastUpdated: new Date().toISOString()
    }));
  }

  static generateTrendReport(category?: DesignCategory, industry?: string): TrendAnalysis | null {
    const references = this.getAllReferences();
    
    if (references.length === 0) {
      return null;
    }

    // Use defaults if not specified
    const targetCategory = category || this.getMostCommonCategory();
    const targetIndustry = industry || this.getMostCommonIndustry();

    return DesignAnalyzer.generateTrendAnalysis(references, targetCategory, targetIndustry);
  }

  // Statistics
  static getStatistics(): {
    totalReferences: number;
    categoriesCount: number;
    industriesCount: number;
    sourcesCount: number;
    latestScrape: Date | null;
    oldestScrape: Date | null;
  } {
    const references = this.getAllReferences();
    
    const dates = references.map(ref => new Date(ref.dateScraped));
    
    return {
      totalReferences: references.length,
      categoriesCount: this.getUniqueCategories().length,
      industriesCount: this.getUniqueIndustries().length,
      sourcesCount: this.getUniqueSources().length,
      latestScrape: dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null,
      oldestScrape: dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : null
    };
  }

  // Export/Import
  static exportReferences(): string {
    const references = this.getAllReferences();
    const analytics = this.getAnalytics();
    
    return JSON.stringify({
      references,
      analytics,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }

  static importReferences(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.references && Array.isArray(data.references)) {
        this.saveReferences(data.references);
        
        if (data.analytics) {
          localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(data.analytics));
        }
        
        console.log(`Imported ${data.references.length} references`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error importing references:', error);
      return false;
    }
  }

  // Utility Methods
  private static removeDuplicates(references: DesignReference[]): DesignReference[] {
    const seen = new Set();
    return references.filter(ref => {
      const key = `${ref.url}_${ref.title}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private static getMostCommonCategory(): DesignCategory {
    const references = this.getAllReferences();
    const counts: Record<string, number> = {};
    
    references.forEach(ref => {
      counts[ref.category] = (counts[ref.category] || 0) + 1;
    });
    
    const mostCommon = Object.entries(counts)
      .sort(([,a], [,b]) => b - a)[0];
    
    return (mostCommon?.[0] as DesignCategory) || 'web-design';
  }

  private static getMostCommonIndustry(): string {
    const references = this.getAllReferences();
    const counts: Record<string, number> = {};
    
    references.forEach(ref => {
      ref.industry.forEach(industry => {
        counts[industry] = (counts[industry] || 0) + 1;
      });
    });
    
    const mostCommon = Object.entries(counts)
      .sort(([,a], [,b]) => b - a)[0];
    
    return mostCommon?.[0] || 'general';
  }

  // Quick Access Methods
  static getRecentReferences(limit: number = 10): DesignReference[] {
    const references = this.getAllReferences();
    return references
      .sort((a, b) => new Date(b.dateScraped).getTime() - new Date(a.dateScraped).getTime())
      .slice(0, limit);
  }

  static getRandomReferences(limit: number = 5): DesignReference[] {
    const references = this.getAllReferences();
    const shuffled = [...references].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }

  static getReferencesByColor(color: string, tolerance: number = 10): DesignReference[] {
    const references = this.getAllReferences();
    
    return references.filter(ref => {
      const colors = [
        ref.colors.primary,
        ref.colors.secondary,
        ref.colors.accent,
        ...ref.colors.extracted
      ];
      
      return colors.some(refColor => this.isColorSimilar(color, refColor, tolerance));
    });
  }

  private static isColorSimilar(color1: string, color2: string, tolerance: number): boolean {
    // Simple color similarity check - could be enhanced with proper color distance calculation
    return color1.toLowerCase() === color2.toLowerCase();
  }
}
