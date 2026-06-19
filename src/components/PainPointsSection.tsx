import { AlertTriangle, TrendingDown, Users, Clock, ArrowDown } from "lucide-react";

const PainPointsSection = () => {
  const painPoints = [
    {
      icon: TrendingDown,
      title: "Tráfico que No Convierte",
      description: "El 87% de los empresarios caribeños dirigen visitas costosas a páginas lentas que tardan más de 3 segundos en cargar, perdiendo de inmediato la mitad de sus prospectos."
    },
    {
      icon: Users,
      title: "Dependencia de Referidos",
      description: "Depender únicamente del 'boca en boca' limita tu alcance comercial. Sin un sistema autónomo de captación, quedas rezagado frente a marcas que automatizan su flujo."
    },
    {
      icon: AlertTriangle,
      title: "Desperdicio en Anuncios",
      description: "Invertir cientos de dólares en Meta o Google Ads que apuntan a formularios fríos o menús digitales genéricos que no cierran la venta, disparando tu costo de adquisición."
    },
    {
      icon: Clock,
      title: "Comisiones de Terceros",
      description: "Entregar hasta el 25% de tus ingresos a portales intermediarios (Airbnb, Booking, UberEats) por no contar con una plataforma propia de reservas y cobros directos."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            ¿Te Sientes <span className="text-primary">Identificado?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estos son los problemas más comunes que enfrentan los empresarios como tú
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {painPoints.map((point, index) => (
            <div 
              key={index}
              className="group p-6 rounded-xl glassmorphism-neon"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                <point.icon className="w-8 h-8 text-destructive" />
              </div>
              
              <h3 className="text-xl font-semibold text-center mb-3 text-card-foreground">
                {point.title}
              </h3>
              
              <p className="text-muted-foreground text-center leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-2xl font-semibold text-primary mb-4">
            ¡Ya no tienes que seguir sufriendo estos problemas!
          </p>
          {/* Scroll Indicator */}
          <div className="flex justify-center mt-6">
            <ArrowDown 
              className="w-6 h-6 text-primary opacity-70 animate-bounce cursor-pointer hover:opacity-100 transition-opacity" 
              onClick={() => {
                if (window.innerWidth < 1024) {
                  window.dispatchEvent(new CustomEvent("open-booking-modal"));
                } else {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection;
