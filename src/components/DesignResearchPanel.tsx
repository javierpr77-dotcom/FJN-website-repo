import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Upload, Settings, TrendingUp, Palette, Layout, Zap } from 'lucide-react';
import { FirecrawlService } from '@/services/FirecrawlService';
import { ReferenceManager } from '@/services/ReferenceManager';
import { DesignCategory, DesignReference } from '@/types/design';

export const DesignResearchPanel = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiKey, setApiKey] = useState(FirecrawlService.getApiKey() || '');
  const [researchPrompt, setResearchPrompt] = useState('');
  const [results, setResults] = useState<DesignReference[]>([]);

  const handleApiKeySubmit = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu API key de Firecrawl",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const isValid = await FirecrawlService.testApiKey(apiKey);
    
    if (isValid) {
      FirecrawlService.saveApiKey(apiKey);
      toast({
        title: "✅ API Key Configurada",
        description: "Firecrawl está listo para investigar tendencias de diseño",
      });
    } else {
      toast({
        title: "❌ API Key Inválida",
        description: "Verifica tu API key de Firecrawl",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  // Analizador de prompts inteligente
  const analyzePrompt = (prompt: string) => {
    const keywords = {
      categories: {
        'web-design': ['website', 'landing page', 'homepage', 'web'],
        'mobile-app': ['mobile app', 'app', 'ios', 'android', 'smartphone'],
        'dashboard': ['dashboard', 'admin', 'analytics', 'panel'],
        'e-commerce': ['ecommerce', 'store', 'shop', 'cart', 'product'],
        'fintech': ['fintech', 'bank', 'finance', 'payment', 'crypto'],
        'healthcare': ['healthcare', 'medical', 'health', 'hospital'],
        'saas': ['saas', 'software', 'platform', 'tool'],
        'portfolio': ['portfolio', 'personal', 'creative'],
      },
      platforms: {
        'dribbble': ['creative', 'colorful', 'modern', 'trendy'],
        'behance': ['professional', 'portfolio', 'creative'],
        'awwwards': ['award', 'innovative', 'cutting-edge'],
        'mobbin': ['mobile', 'app', 'ui/ux'],
      }
    };

    const lowercasePrompt = prompt.toLowerCase();
    
    // Detectar categoría más relevante
    let detectedCategory: DesignCategory = 'web-design';
    let maxScore = 0;
    
    Object.entries(keywords.categories).forEach(([category, terms]) => {
      const score = terms.reduce((acc, term) => 
        acc + (lowercasePrompt.includes(term) ? 1 : 0), 0
      );
      if (score > maxScore) {
        maxScore = score;
        detectedCategory = category as DesignCategory;
      }
    });

    // Detectar plataformas relevantes
    const relevantPlatforms = Object.entries(keywords.platforms)
      .filter(([platform, terms]) => 
        terms.some(term => lowercasePrompt.includes(term))
      )
      .map(([platform]) => platform);

    // Si no hay plataformas específicas, usar orden de prioridad
    const platforms = relevantPlatforms.length > 0 
      ? relevantPlatforms 
      : ['dribbble', 'behance', 'awwwards', 'mobbin'];

    // Extraer términos de búsqueda principales
    const searchTerms = prompt
      .replace(/[.,!?]/g, '')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 5)
      .join(' ');

    return {
      category: detectedCategory,
      platforms: platforms as Array<'dribbble' | 'behance' | 'awwwards' | 'mobbin'>,
      searchTerms: searchTerms || prompt,
      originalPrompt: prompt
    };
  };

  const handleSearch = async () => {
    if (!researchPrompt.trim()) {
      toast({
        title: "Error",
        description: "Describe lo que necesitas investigar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    
    try {
      const analysis = analyzePrompt(researchPrompt);
      console.log('Análisis de prompt:', analysis);
      
      setProgress(20);
      
      const allResults: DesignReference[] = [];
      
      // Buscar en múltiples plataformas según el análisis
      for (let i = 0; i < Math.min(2, analysis.platforms.length); i++) {
        const platform = analysis.platforms[i];
        setProgress(20 + (i * 30));
        
        try {
          const result = await FirecrawlService.scrapeDesignPlatform(
            platform, 
            analysis.searchTerms, 
            analysis.category
          );
          
          if (result.success && result.data) {
            allResults.push(...result.data);
          }
        } catch (error) {
          console.log(`Error en ${platform}:`, error);
        }
      }
      
      setProgress(90);
      
      if (allResults.length > 0) {
        // Eliminar duplicados y organizar resultados
        const uniqueResults = allResults.filter((item, index, self) => 
          index === self.findIndex(t => t.url === item.url)
        );
        
        setResults(uniqueResults);
        ReferenceManager.saveReferences(uniqueResults);
        
        toast({
          title: "🎨 Investigación Completada",
          description: `Encontradas ${uniqueResults.length} referencias para: "${analysis.originalPrompt}"`,
        });
        
        setProgress(100);
      } else {
        toast({
          title: "Sin Resultados",
          description: "No se encontraron referencias para tu búsqueda. Intenta con términos diferentes.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      toast({
        title: "Error",
        description: "Falló la investigación de diseño",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleExportData = () => {
    const data = ReferenceManager.exportReferences();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-references-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "📁 Datos Exportados",
      description: "Referencias descargadas exitosamente",
    });
  };

  const statistics = ReferenceManager.getStatistics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 shadow-elegant">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Sistema de Investigación de Diseño
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Analiza tendencias del mercado, extrae referencias de plataformas líderes 
            y genera insights inteligentes para tus proyectos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="gradient-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Referencias</p>
                  <p className="text-2xl font-bold">{statistics.totalReferences}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Palette className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categorías</p>
                  <p className="text-2xl font-bold">{statistics.categoriesCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/20">
                  <Layout className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Industrias</p>
                  <p className="text-2xl font-bold">{statistics.industriesCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-glow/20">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fuentes</p>
                  <p className="text-2xl font-bold">{statistics.sourcesCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">🔍 Investigar</TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Configuración</TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="gradient-card shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Nueva Investigación
                </CardTitle>
                <CardDescription>
                  Busca tendencias de diseño en las principales plataformas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Describe tu Investigación</label>
                    <Textarea
                      placeholder="Describe libremente lo que necesitas investigar para tu proyecto...

Ejemplos:
• Necesito referencias de diseños coloridos y modernos para una app de fintech dirigida a jóvenes
• Busco inspiración de landing pages minimalistas para una startup de salud mental
• Quiero ver dashboards innovadores con gráficos interactivos para una plataforma de analytics
• Necesito ejemplos de e-commerce con diseño oscuro y efectos neón para productos gaming
• Busco portfolios creativos con animaciones suaves para un diseñador freelancer"
                      value={researchPrompt}
                      onChange={(e) => setResearchPrompt(e.target.value)}
                      className="min-h-[120px] transition-all resize-none"
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 El sistema analizará automáticamente tu descripción y buscará en las plataformas más relevantes
                    </p>
                  </div>
                </div>

                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Investigando tendencias...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <Button 
                  onClick={handleSearch}
                  disabled={isLoading || !FirecrawlService.getApiKey()}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-all"
                >
                  {isLoading ? 'Investigando...' : '🚀 Iniciar Investigación'}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {results.length > 0 && (
              <Card className="gradient-card shadow-elegant">
                <CardHeader>
                  <CardTitle>Resultados de la Investigación</CardTitle>
                  <CardDescription>
                    {results.length} referencias encontradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {results.slice(0, 9).map((ref) => (
                      <div key={ref.id} className="p-4 rounded-lg border bg-background/50 hover:bg-background/70 transition-all space-y-3 group">
                        {ref.imageUrl ? (
                          <img
                            src={ref.imageUrl}
                            alt={ref.title}
                            className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                            <Palette className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {ref.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {ref.source} • {ref.category}
                          </p>
                          {ref.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {ref.description}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {ref.tags.slice(0, 4).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          {ref.colors && (
                            <div className="flex gap-1">
                              {ref.colors.extracted.slice(0, 5).map((color, i) => (
                                <div
                                  key={i}
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        {ref.url && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Ver original →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="gradient-card shadow-elegant">
              <CardHeader>
                <CardTitle>Analytics y Tendencias</CardTitle>
                <CardDescription>
                  Insights generados automáticamente de tus referencias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  📊 Analytics detallados próximamente...
                  <br />
                  <span className="text-sm">Recolecta más referencias para generar insights</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="gradient-card shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración API
                </CardTitle>
                <CardDescription>
                  Configura tu API key de Firecrawl para acceder a las funciones de scraping
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Firecrawl API Key</label>
                  <Input
                    type="password"
                    placeholder="fc-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Obtén tu API key gratuita en{' '}
                    <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      firecrawl.dev
                    </a>
                  </p>
                </div>

                <Button 
                  onClick={handleApiKeySubmit}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Verificando...' : 'Configurar API Key'}
                </Button>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Gestión de Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={handleExportData}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Referencias
                  </Button>

                  <Button 
                    onClick={() => {
                      ReferenceManager.clearAllReferences();
                      toast({
                        title: "🗑️ Datos Limpiados",
                        description: "Todas las referencias han sido eliminadas",
                      });
                    }}
                    variant="destructive"
                    className="w-full"
                  >
                    Limpiar Todo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
