import { 
  DesignReference, 
  TrendAnalysis, 
  Trend, 
  AnalysisResult,
  DesignCategory,
  DesignMetadata 
} from '@/types/design';

export class DesignAnalyzer {
  static analyzeReferences(references: DesignReference[]): AnalysisResult {
    const analysis: AnalysisResult = {
      totalReferences: references.length,
      categories: this.analyzeCategoryDistribution(references),
      industries: this.analyzeIndustryDistribution(references),
      colorTrends: this.analyzeColorTrends(references),
      layoutTrends: this.analyzeLayoutTrends(references),
      componentTrends: this.analyzeComponentTrends(references)
    };

    return analysis;
  }

  static generateTrendAnalysis(
    references: DesignReference[],
    category: DesignCategory,
    industry: string
  ): TrendAnalysis {
    const filteredRefs = references.filter(ref => 
      ref.category === category && ref.industry.includes(industry)
    );

    const trends: Trend[] = [
      ...this.detectColorTrends(filteredRefs),
      ...this.detectLayoutTrends(filteredRefs),
      ...this.detectComponentTrends(filteredRefs),
      ...this.detectStyleTrends(filteredRefs),
      ...this.detectInteractionTrends(filteredRefs)
    ];

    return {
      id: `analysis_${Date.now()}`,
      category,
      industry,
      period: '30d',
      trends: trends.sort((a, b) => b.confidence - a.confidence),
      generatedAt: new Date()
    };
  }

  private static analyzeCategoryDistribution(references: DesignReference[]): Record<DesignCategory, number> {
    const distribution: Record<string, number> = {};
    
    references.forEach(ref => {
      distribution[ref.category] = (distribution[ref.category] || 0) + 1;
    });

    return distribution as Record<DesignCategory, number>;
  }

  private static analyzeIndustryDistribution(references: DesignReference[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    references.forEach(ref => {
      ref.industry.forEach(industry => {
        distribution[industry] = (distribution[industry] || 0) + 1;
      });
    });

    return distribution;
  }

  private static analyzeColorTrends(references: DesignReference[]): Array<{
    color: string;
    frequency: number;
    contexts: string[];
  }> {
    const colorFrequency: Record<string, { count: number; contexts: Set<string> }> = {};

    references.forEach(ref => {
      const colors = [
        ref.colors.primary,
        ref.colors.secondary,
        ref.colors.accent,
        ...ref.colors.extracted
      ];

      colors.forEach(color => {
        if (!colorFrequency[color]) {
          colorFrequency[color] = { count: 0, contexts: new Set() };
        }
        colorFrequency[color].count++;
        colorFrequency[color].contexts.add(ref.category);
        ref.industry.forEach(industry => {
          colorFrequency[color].contexts.add(industry);
        });
      });
    });

    return Object.entries(colorFrequency)
      .map(([color, { count, contexts }]) => ({
        color,
        frequency: count,
        contexts: Array.from(contexts)
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 20);
  }

  private static analyzeLayoutTrends(references: DesignReference[]): Array<{
    layout: DesignMetadata['layout'];
    frequency: number;
    industries: string[];
  }> {
    const layoutFrequency: Record<string, { count: number; industries: Set<string> }> = {};

    references.forEach(ref => {
      const layout = ref.metadata.layout;
      if (!layoutFrequency[layout]) {
        layoutFrequency[layout] = { count: 0, industries: new Set() };
      }
      layoutFrequency[layout].count++;
      ref.industry.forEach(industry => {
        layoutFrequency[layout].industries.add(industry);
      });
    });

    return Object.entries(layoutFrequency)
      .map(([layout, { count, industries }]) => ({
        layout: layout as DesignMetadata['layout'],
        frequency: count,
        industries: Array.from(industries)
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }

  private static analyzeComponentTrends(references: DesignReference[]): Array<{
    component: string;
    frequency: number;
    categories: DesignCategory[];
  }> {
    const componentFrequency: Record<string, { count: number; categories: Set<DesignCategory> }> = {};

    references.forEach(ref => {
      ref.metadata.components.forEach(component => {
        if (!componentFrequency[component]) {
          componentFrequency[component] = { count: 0, categories: new Set() };
        }
        componentFrequency[component].count++;
        componentFrequency[component].categories.add(ref.category);
      });
    });

    return Object.entries(componentFrequency)
      .map(([component, { count, categories }]) => ({
        component,
        frequency: count,
        categories: Array.from(categories)
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 15);
  }

  private static detectColorTrends(references: DesignReference[]): Trend[] {
    const colorAnalysis = this.analyzeColorTrends(references);
    const trends: Trend[] = [];

    // Detect dominant colors
    const dominantColors = colorAnalysis.slice(0, 5);
    dominantColors.forEach((colorData, index) => {
      trends.push({
        type: 'color',
        name: `Dominant Color #${index + 1}`,
        description: `${colorData.color} appears in ${colorData.frequency} designs across ${colorData.contexts.join(', ')}`,
        frequency: colorData.frequency,
        examples: references
          .filter(ref => 
            ref.colors.primary === colorData.color || 
            ref.colors.secondary === colorData.color ||
            ref.colors.extracted.includes(colorData.color)
          )
          .slice(0, 3)
          .map(ref => ref.id),
        confidence: Math.min(colorData.frequency / references.length, 1)
      });
    });

    // Detect color schemes
    const gradientCount = references.filter(ref => 
      ref.tags.includes('gradient') || ref.metadata.style === 'gradient'
    ).length;

    if (gradientCount > references.length * 0.3) {
      trends.push({
        type: 'color',
        name: 'Gradient Trend',
        description: `${Math.round((gradientCount / references.length) * 100)}% of designs use gradients`,
        frequency: gradientCount,
        examples: references
          .filter(ref => ref.tags.includes('gradient'))
          .slice(0, 3)
          .map(ref => ref.id),
        confidence: gradientCount / references.length
      });
    }

    return trends;
  }

  private static detectLayoutTrends(references: DesignReference[]): Trend[] {
    const layoutAnalysis = this.analyzeLayoutTrends(references);
    const trends: Trend[] = [];

    layoutAnalysis.forEach(layout => {
      const confidence = layout.frequency / references.length;
      
      if (confidence > 0.2) { // Only include layouts used in 20%+ of designs
        trends.push({
          type: 'layout',
          name: `${layout.layout} Layout`,
          description: `${layout.layout} layout is trending with ${layout.frequency} occurrences across ${layout.industries.join(', ')}`,
          frequency: layout.frequency,
          examples: references
            .filter(ref => ref.metadata.layout === layout.layout)
            .slice(0, 3)
            .map(ref => ref.id),
          confidence
        });
      }
    });

    return trends;
  }

  private static detectComponentTrends(references: DesignReference[]): Trend[] {
    const componentAnalysis = this.analyzeComponentTrends(references);
    const trends: Trend[] = [];

    componentAnalysis.slice(0, 10).forEach(component => {
      trends.push({
        type: 'component',
        name: `${component.component} Component`,
        description: `${component.component} appears in ${component.frequency} designs across ${component.categories.join(', ')}`,
        frequency: component.frequency,
        examples: references
          .filter(ref => ref.metadata.components.includes(component.component))
          .slice(0, 3)
          .map(ref => ref.id),
        confidence: component.frequency / references.length
      });
    });

    return trends;
  }

  private static detectStyleTrends(references: DesignReference[]): Trend[] {
    const styleFrequency: Record<string, number> = {};
    
    references.forEach(ref => {
      styleFrequency[ref.metadata.style] = (styleFrequency[ref.metadata.style] || 0) + 1;
    });

    const trends: Trend[] = [];
    
    Object.entries(styleFrequency).forEach(([style, frequency]) => {
      const confidence = frequency / references.length;
      
      if (confidence > 0.15) {
        trends.push({
          type: 'style',
          name: `${style} Style`,
          description: `${style} style is used in ${frequency} designs (${Math.round(confidence * 100)}%)`,
          frequency,
          examples: references
            .filter(ref => ref.metadata.style === style)
            .slice(0, 3)
            .map(ref => ref.id),
          confidence
        });
      }
    });

    return trends;
  }

  private static detectInteractionTrends(references: DesignReference[]): Trend[] {
    const interactionFrequency: Record<string, number> = {};
    
    references.forEach(ref => {
      ref.metadata.interactions.forEach(interaction => {
        interactionFrequency[interaction] = (interactionFrequency[interaction] || 0) + 1;
      });
    });

    const trends: Trend[] = [];
    
    Object.entries(interactionFrequency).forEach(([interaction, frequency]) => {
      const confidence = frequency / references.length;
      
      if (confidence > 0.2) {
        trends.push({
          type: 'interaction',
          name: `${interaction} Interaction`,
          description: `${interaction} interactions are used in ${frequency} designs`,
          frequency,
          examples: references
            .filter(ref => ref.metadata.interactions.includes(interaction))
            .slice(0, 3)
            .map(ref => ref.id),
          confidence
        });
      }
    });

    return trends;
  }

  static getDesignInsights(analysis: AnalysisResult): string[] {
    const insights: string[] = [];

    // Category insights
    const topCategory = Object.entries(analysis.categories)
      .sort(([,a], [,b]) => b - a)[0];
    if (topCategory) {
      insights.push(`${topCategory[0]} is the most common design category with ${topCategory[1]} examples`);
    }

    // Industry insights
    const topIndustry = Object.entries(analysis.industries)
      .sort(([,a], [,b]) => b - a)[0];
    if (topIndustry) {
      insights.push(`${topIndustry[0]} industry dominates with ${topIndustry[1]} designs`);
    }

    // Color insights
    if (analysis.colorTrends.length > 0) {
      const topColor = analysis.colorTrends[0];
      insights.push(`${topColor.color} is the trending color with ${topColor.frequency} occurrences`);
    }

    // Layout insights
    if (analysis.layoutTrends.length > 0) {
      const topLayout = analysis.layoutTrends[0];
      insights.push(`${topLayout.layout} layout is preferred with ${topLayout.frequency} implementations`);
    }

    // Component insights
    if (analysis.componentTrends.length > 0) {
      const topComponent = analysis.componentTrends[0];
      insights.push(`${topComponent.component} is the most used component in ${topComponent.frequency} designs`);
    }

    return insights;
  }

  static compareAnalyses(current: AnalysisResult, previous: AnalysisResult): string[] {
    const comparisons: string[] = [];

    // Compare total references
    const refChange = current.totalReferences - previous.totalReferences;
    if (refChange > 0) {
      comparisons.push(`Added ${refChange} new design references`);
    }

    // Compare color trends
    const newTopColor = current.colorTrends[0];
    const oldTopColor = previous.colorTrends[0];
    
    if (newTopColor && oldTopColor && newTopColor.color !== oldTopColor.color) {
      comparisons.push(`Trending color shifted from ${oldTopColor.color} to ${newTopColor.color}`);
    }

    return comparisons;
  }
}
