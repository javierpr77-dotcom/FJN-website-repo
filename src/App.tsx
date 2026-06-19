import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MouseFollower from "@/components/MouseFollower";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DesignResearch from "./pages/DesignResearch";
import FAQ from "./pages/FAQ";

import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <MouseFollower />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<Index />} />
              <Route path="/portafolio" element={<Index />} />
              <Route path="/planes" element={<Index />} />
              <Route path="/pricing" element={<Index />} />
              <Route path="/services" element={<Index />} />
              <Route path="/servicios" element={<Index />} />
              <Route path="/reviews" element={<Index />} />
              <Route path="/resenas" element={<Index />} />
              <Route path="/reseñas" element={<Index />} />
              <Route path="/casos-de-exito" element={<Index />} />
              <Route path="/casos de éxito" element={<Index />} />
              <Route path="/casos de exito" element={<Index />} />
              <Route path="/success-stories" element={<Index />} />
              <Route path="/success stories" element={<Index />} />
              <Route path="/contact" element={<Index />} />
              <Route path="/consultas" element={<Index />} />
              <Route path="/consultations" element={<Index />} />
              <Route path="/design-research" element={<DesignResearch />} />
              <Route path="/faq" element={<FAQ />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <LanguageSwitcher />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
