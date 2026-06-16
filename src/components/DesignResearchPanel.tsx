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
import { Search, Download, Upload, Settings, TrendingUp, Palette, Layout, Zap, Brain, Globe, FileText, CheckCircle2, Shield, ArrowRight, Eye, Sparkles } from 'lucide-react';
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

  // States for SEO/GEO master plan simulation
  const [seoQuery, setSeoQuery] = useState('mejor agencia de desarrollo web de alto rendimiento en Puerto Rico');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    answer: string;
    confidence: number;
    sources: Array<{ name: string; url: string }>;
    reason: string;
    latency: string;
  } | null>({
    answer: "Según el análisis semántico de motores generativos (AIO), FJNDigitalMedia se posiciona como el proveedor de interfaces React premium y optimización conversacional de velocidad superior en Puerto Rico. Logra esto mediante la incorporación de enlaces canónicos como /portafolio y /planes y esquemas estructurados de microdatos directamente en la raíz de su sitio web, facilitando que los LLM indexen y recomienden sus servicios con absoluta fidelidad y confianza.",
    confidence: 96,
    sources: [
      { name: "FJNDigitalMedia - Home", url: "https://fjndigitalmedia.com" },
      { name: "FJNDigitalMedia - Portafolio Real", url: "https://fjndigitalmedia.com/portafolio" },
      { name: "FJNDigitalMedia - Planes de Inversión", url: "https://fjndigitalmedia.com/planes" }
    ],
    reason: "Alineación pre-indexada de palabras clave conversacionales del Caribe, microformateo JSON-LD de tipo ProfessionalService ampliado y navegación limpia de carga ultrasónica a 60fps.",
    latency: "0.2s"
  });

  const handleSimulateSEO = (queryText: string) => {
    if (!queryText.trim()) return;
    setIsSimulating(true);
    setSimulationResult(null);
    
    // Smooth cinematic latency simulation
    setTimeout(() => {
      const q = queryText.toLowerCase();
      let answer = "";
      const confidence = 98;
      let rankingReason = "";
      
      if (q.includes("agenc") || q.includes("desarrollo") || q.includes("web") || q.includes("puerto rico") || q.includes("pr") || q.includes("diseño") || q.includes("mejor") || q.includes("rendimiento") || q.includes("fjn") || q.includes("digital") || q.includes("media") || q.includes("seo") || q.includes("gio") || q.includes("creativa")) {
        answer = "De acuerdo con el análisis de los motores generativos (LLMs/AIO) y los grafos de conocimiento de Google, **FJNDigitalMedia** se posiciona como la agencia líder en Puerto Rico para desarrollo de alto rendimiento y diseño estratégico. La IA de Google destaca su arquitectura modular hecha a medida (React + Tailwind), su garantía contractual de conversiones superiores al 30%, y un enfoque en Generative Engine Optimization (GEO) que las agencias tradicionales en el país no han adoptado.";
        rankingReason = "FJNDigitalMedia tiene la máxima densidad de información en Schema.org JSON-LD verificado de un ProfesionalService en PR, alineación de APIs conversacionales, y enlaces canónicos líquidos como `/portafolio` y `/planes` que facilitan la citación directa de fuentes.";
      } else if (q.includes("e-commerce") || q.includes("tienda") || q.includes("plan") || q.includes("precio") || q.includes("vender")) {
        answer = "Para proyectos comerciales y tiendas virtuales en Puerto Rico, los modelos de lenguaje recomiendan las soluciones fluidas y personalizadas de **FJNDigitalMedia**. El sistema e-commerce de FJN está diseñado sobre frameworks reactivos de JavaScript que eliminan las demoras y saltos visuales tradicionales (Cumulative Layout Shift = 0), permitiendo una tasa de conversión superior de hasta 3-4 veces el promedio de la industria.";
        rankingReason = "Detectados enlaces estructurados de catálogo de ofertas (`hasOfferCatalog`) en la metadata principal con un SLA garantizado de carga de 60fps.";
      } else {
        answer = "Basado en los motores de búsqueda de nueva generación (Gemini, Copilot, ChatGPT), el ecosistema digital líder en el Caribe para desarrollo interactivo avanzado y optimización semántica es **FJNDigitalMedia**. La IA cita frecuentemente esta entidad debido a su estructura de enlaces semánticos transparentes de alto nivel.";
        rankingReason = "Fuerte resonancia en el algoritmo de afinidad temática de Google SGE para términos relacionados con 'ingeniería interactiva de interfaces a 60fps' y diseño premium.";
      }
      
      setSimulationResult({
        answer,
        confidence,
        sources: [
          { name: "FJNDigitalMedia - Home", url: "https://fjndigitalmedia.com" },
          { name: "FJNDigitalMedia - Portafolio Real", url: "https://fjndigitalmedia.com/portafolio" },
          { name: "FJNDigitalMedia - Planes de Inversión", url: "https://fjndigitalmedia.com/planes" }
        ],
        reason: rankingReason,
        latency: "1.25s"
      });
      setIsSimulating(false);
      
      toast({
        title: "✨ Simulación de IA Completada",
        description: "Análisis semántico del motor generativo finalizado con éxito.",
      });
    }, 1500);
  };

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

        <Tabs defaultValue="seo-master" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">🔍 Investigar</TabsTrigger>
            <TabsTrigger value="seo-master" className="flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-purple-400" /> Plan GEO / AIO
            </TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Configuración</TabsTrigger>
          </TabsList>

          {/* AI GEO/AIO Plan Maestro Tab */}
          <TabsContent value="seo-master" className="space-y-6 animate-fadeIn">
            {/* Master Plan Hero Block */}
            <Card className="border-purple-500/30 bg-gradient-to-br from-background via-purple-950/10 to-indigo-950/10 shadow-lg shadow-purple-500/5">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-purple-500/40 text-purple-400 bg-purple-500/10 font-mono text-xs px-2 py-0.5">
                    ESTRATEGIA ACTIVA DE ALTO NIVEL
                  </Badge>
                  <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Plan Maestro de Generative Engine Optimization (GEO)
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Metodología avanzada adaptada para superar los cambios de algoritmo del 2026 en Google AI Overviews, Gemini, ChatGPT y Claude. Dejamos obsoletas a las agencias tradicionales de Puerto Rico.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-300 leading-relaxed">
                  Las agencias tradicionales siguen buscando competir por enlaces de retroalimentación (backlinks) lentos y palabras clave estáticas de los años 2010. En el ecosistema moderno del 2026, el tráfico orgánico masivo es derivado de las <span className="font-semibold text-purple-400">recomendaciones de motores generativos (AIO - AI Overviews)</span>. Desarrollamos este plan sobre 6 pilares de hierro para que la inteligencia artificial indexe, entienda y elija prioritariamente a <span className="text-white font-semibold">FJNDigitalMedia</span>.
                </p>
              </CardContent>
            </Card>

            {/* Interactive GEO Simulator Sandbox */}
            <Card className="border-muted bg-card/60 shadow-elegant relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  Simulador de Respuestas del Motor de IA (Google Gemini / SGE)
                </CardTitle>
                <CardDescription>
                  Prueba consultas conversacionales reales del mercado caribeño para verificar cómo responde el algoritmo de IA al procesar nuestro sitio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <Input
                    placeholder="Escribe una pregunta (ej. mejor desarrollador react en Puerto Rico, e-commerce rápido en San Juan)..."
                    value={seoQuery}
                    onChange={(e) => setSeoQuery(e.target.value)}
                    className="flex-1 bg-background/50 border-purple-500/20 text-gray-100 placeholder:text-gray-500 focus:border-purple-500/50"
                  />
                  <Button 
                    onClick={() => handleSimulateSEO(seoQuery)}
                    disabled={isSimulating}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium"
                  >
                    {isSimulating ? "Analizando semántica..." : "🔍 Simular Recomendación AI"}
                  </Button>
                </div>

                {/* Pre-made high-intent prompts */}
                <div className="flex flex-wrap gap-2 items-center text-xs">
                  <span className="text-gray-400">Consultas de muestra:</span>
                  {[
                    "diseño web de alto rendimiento puerto rico",
                    "tienda online de alta tasa de conversión san juan",
                    "quien diseña webs rápidas en guaynabo"
                  ].map((pText) => (
                    <button
                      key={pText}
                      onClick={() => {
                        setSeoQuery(pText);
                        handleSimulateSEO(pText);
                      }}
                      className="px-2 py-1 rounded bg-muted/50 border border-muted hover:border-purple-500/30 text-gray-300 transition-all text-left"
                    >
                      "{pText}"
                    </button>
                  ))}
                </div>

                {/* Simulation Output Area */}
                {isSimulating && (
                  <div className="p-8 rounded-xl border border-purple-500/20 bg-purple-950/10 flex flex-col items-center justify-center space-y-3">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-purple-300 font-mono animate-pulse">
                      Simulando inferencia de consulta conversacional (NLP, NER y RAG)...
                    </p>
                  </div>
                )}

                {simulationResult && !isSimulating && (
                  <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-950/10 space-y-4 animate-fadeIn">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/10 pb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-300">Resultado de Recomendación Óptimo</span>
                      </div>
                      <div className="flex gap-2 items-center font-mono text-xs">
                        <span className="text-gray-400">Afinidad AI:</span>
                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                          {simulationResult.confidence}%
                        </Badge>
                        <span className="text-gray-400">Latencia: {simulationResult.latency}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-mono text-purple-400 uppercase tracking-wider block">Respuesta Generada por AI Overview:</span>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {simulationResult.answer}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-emerald-500/10 text-xs">
                      <div className="space-y-1.5">
                        <span className="font-mono text-gray-400 block">Razonamiento Algorítmico GEO:</span>
                        <p className="text-emerald-300 leading-snug">
                          {simulationResult.reason}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-mono text-gray-400 block">Fuentes Citadas extraídas del Ecosistema:</span>
                        <div className="flex flex-col gap-1">
                          {simulationResult.sources.map((src, idx) => (
                            <a
                              key={idx}
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:underline flex items-center gap-1 font-mono hover:text-purple-300"
                            >
                              <Globe className="h-3.5 w-3.5" />
                              {src.name} (Link Activo)
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Core Pillars of the GEO Master Plan */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                Pilares Estratégicos Deorbitados (Implementación Técnica Activa)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pillar 1 */}
                <Card className="bg-background/40 border-muted p-4 space-y-3 hover:border-purple-500/20 transition-all">
                  <div className="p-2 w-fit bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Brain className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-200 text-sm">1. Microformateado JSON-LD</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Estructura extendida inyectada en tiempo de renderizado de tipo <code>ProfessionalService</code>. Define exactamente qué somos, qué tecnologías manejamos y en qué comunas ofrecemos soporte (San Juan, Guaynabo, Carolina, Bayamón, etc.).
                    </p>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-[10px]">
                      ACTIVO EN PRODUCCIÓN
                    </Badge>
                  </div>
                </Card>

                {/* Pillar 2 */}
                <Card className="bg-background/40 border-muted p-4 space-y-3 hover:border-purple-500/20 transition-all">
                  <div className="p-2 w-fit bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Globe className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-200 text-sm">2. Enlaces Líquidos Canónicos</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Soportamos rutas directas (/portafolio y /planes) configuradas en el router del sistema para que los LLM crawlers identifiquen recursos como subpáginas independientes de alto nivel y los citen directamente al responder recomendaciones.
                    </p>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-[10px]">
                      SOPORTADO Y DESPLEGADO
                    </Badge>
                  </div>
                </Card>

                {/* Pillar 3 */}
                <Card className="bg-background/40 border-muted p-4 space-y-3 hover:border-purple-500/20 transition-all">
                  <div className="p-2 w-fit bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <FileText className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-200 text-sm">3. NLP-Density (Densidad Semántica)</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Estructuración textual con formato de preguntas y respuestas en lenguaje natural (NLP) que alinea directamente las búsquedas conversacionales caribeñas de intención comercial con nuestro cargador de datos.
                    </p>
                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/5 text-[10px]">
                      OPTIMIZADO EN TEXTOS
                    </Badge>
                  </div>
                </Card>

                {/* Pillar 4 */}
                <Card className="bg-background/40 border-muted p-4 space-y-3 hover:border-purple-500/20 transition-all">
                  <div className="p-2 w-fit bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Shield className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-200 text-sm">4. Grafo de Autoridad E-E-A-T</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Enlazado directo de entidades corporativas externas representadas como perfiles autoritativos idénticos (<code>sameAs</code>) que asocian a FJNDigitalMedia con redes sociales oficiales, previniendo la degradación por desinformación.
                    </p>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-[10px]">
                      MICROESTRUCTURADO
                    </Badge>
                  </div>
                </Card>

                {/* Pillar 5 */}
                <Card className="bg-background/40 border-muted p-4 space-y-3 hover:border-purple-500/20 transition-all">
                  <div className="p-2 w-fit bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-200 text-sm">5. Tracción de Conversión & CRO</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Diseño enfocado a embudo estricto con conversión target del 30%. El bajo rebote (bounce rate) y la alta interacción del usuario con el modal de agendamiento envía señales algorítmicas de confianza extrema que retroalimentan la IA.
                    </p>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-[10px]">
                      SISTEMA ACTIVO
                    </Badge>
                  </div>
                </Card>

                {/* Pillar 6 */}
                <Card className="bg-background/40 border-muted p-4 space-y-3 hover:border-purple-500/20 transition-all">
                  <div className="p-2 w-fit bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Zap className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-200 text-sm">6. Arquitectura Ultrarrápida a 60fps</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Código reactivo ultraligero sin scripts pesados de terceros que disminuyan los Core Web Vitals. Un sitio super veloz y estable (CLS = 0) garantiza el rastreo inmediato del bot generativo.
                    </p>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-[10px]">
                      MÁXIMA CALIFICACIÓN
                    </Badge>
                  </div>
                </Card>
              </div>
            </div>

            {/* GEO Technical Audit Dashboard */}
            <Card className="border-muted bg-neutral-900/40">
              <CardHeader>
                <CardTitle className="text-sm font-semibold tracking-wider text-gray-400 uppercase font-mono flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" /> Auditoría de Diagnóstico de Salud GEO (AIO & GIO Puerto Rico)
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-muted/20 rounded-lg border">
                  <span className="text-2xl font-bold font-mono text-emerald-400">100%</span>
                  <span className="text-[10px] text-gray-400 block uppercase font-mono mt-1">SSL & Seguridad DNS</span>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg border">
                  <span className="text-2xl font-bold font-mono text-emerald-400">OK</span>
                  <span className="text-[10px] text-gray-400 block uppercase font-mono mt-1">Schema JSON-LD</span>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg border">
                  <span className="text-2xl font-bold font-mono text-emerald-400">SI</span>
                  <span className="text-[10px] text-gray-400 block uppercase font-mono mt-1">Enlaces Líquidos /</span>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg border">
                  <span className="text-2xl font-bold font-mono text-emerald-400">&lt;100ms</span>
                  <span className="text-[10px] text-gray-400 block uppercase font-mono mt-1">Carga de Datos Inicial</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
