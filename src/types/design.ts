// Design Research System Types

export interface DesignReference {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  description?: string;
  category: DesignCategory;
  industry: string[];
  tags: string[];
  colors: ColorPalette;
  dateScraped: Date;
  source: 'dribbble' | 'behance' | 'awwwards' | 'mobbin' | 'ui-movement' | 'custom';
  metadata: DesignMetadata;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  extracted: string[];
}

export interface DesignMetadata {
  layout: 'grid' | 'list' | 'card' | 'hero' | 'minimal' | 'complex';
  style: 'modern' | 'classic' | 'minimal' | 'bold' | 'gradient' | 'neumorphism' | 'glassmorphism';
  components: string[];
  interactions: string[];
  responsive: boolean;
  darkMode: boolean;
}

export type DesignCategory = 
  | 'web-design'
  | 'mobile-app'
  | 'landing-page'
  | 'dashboard'
  | 'e-commerce'
  | 'portfolio'
  | 'blog'
  | 'saas'
  | 'fintech'
  | 'healthcare'
  | 'education'
  | 'entertainment';

export interface ScrapingConfig {
  maxPages: number;
  searchTerms: string[];
  categories: DesignCategory[];
  industries: string[];
  dateRange: {
    from: Date;
    to: Date;
  };
}

export interface TrendAnalysis {
  id: string;
  category: DesignCategory;
  industry: string;
  period: string;
  trends: Trend[];
  generatedAt: Date;
}

export interface Trend {
  type: 'color' | 'layout' | 'component' | 'interaction' | 'style';
  name: string;
  description: string;
  frequency: number;
  examples: string[]; // reference IDs
  confidence: number; // 0-1
}

export interface SearchQuery {
  term?: string;
  category?: DesignCategory;
  industry?: string;
  tags?: string[];
  colors?: string[];
  source?: DesignReference['source'];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface AnalysisResult {
  totalReferences: number;
  categories: Record<DesignCategory, number>;
  industries: Record<string, number>;
  colorTrends: Array<{
    color: string;
    frequency: number;
    contexts: string[];
  }>;
  layoutTrends: Array<{
    layout: DesignMetadata['layout'];
    frequency: number;
    industries: string[];
  }>;
  componentTrends: Array<{
    component: string;
    frequency: number;
    categories: DesignCategory[];
  }>;
}
