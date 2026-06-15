import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, X, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay, isBefore, startOfDay } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import confetti from "canvas-confetti";

const ContactForm = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    goal: ""
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isCalendarModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCalendarModalOpen]);

  // Listen to open booking modal triggers
  useEffect(() => {
    const handleOpen = () => {
      setIsBookingModalOpen(true);
    };
    window.addEventListener("open-booking-modal", handleOpen);
    return () => {
      window.removeEventListener("open-booking-modal", handleOpen);
    };
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDayOfMonth = getDay(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const today = startOfDay(new Date());

  const isDayDisabled = (date: Date) => {
    return isBefore(date, today) || getDay(date) === 0; // 0 is Sunday
  };

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const triggerPremiumConfetti = () => {
    const colors = ["#145BFF", "#3B7BFF", "#000000", "#FFFFFF", "#7C3AED"];
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: colors
    });
    
    // extra bursts from sides
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: colors
      });
    }, 150);
    
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: colors
      });
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, email, goal } = formData;
    
    const dateFormatted = selectedDate ? format(selectedDate, 'PPP', { locale: language === 'es' ? es : enUS }) : (language === 'es' ? 'No seleccionada' : 'Not selected');
    const timeFormatted = selectedTime || (language === 'es' ? 'No seleccionada' : 'Not selected');

    // Send to Netlify in the background silently
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "contact",
        name,
        phone,
        email,
        goal,
        date: dateFormatted,
        time: timeFormatted
      }).toString()
    })
      .then(() => console.log("Netlify form submission successful"))
      .catch((error) => console.error("Netlify submission error:", error));

    // Send instant email notification using our secure serverless function with Resend
    fetch("/.netlify/functions/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        goal,
        date: dateFormatted,
        time: timeFormatted
      })
    })
      .then((response) => response.json())
      .then((data) => console.log("Resend secure email notification sent:", data))
      .catch((error) => console.error("Resend secure email notification error:", error));

    triggerPremiumConfetti();
    setIsSubmitted(true);
  };

  const renderFormContent = (isModalLayout = false) => {
    return (
      <div className={isModalLayout ? "w-full" : "relative z-10 w-full"}>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-body text-sm text-white/70 ml-1 text-left">
                  {language === 'es' ? 'Tu Nombre' : 'Your Name'}
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={language === 'es' ? "Ej. Carlos Rodríguez" : "Ex. Carlos Rodriguez"}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 font-body hover:border-white/10 hover:shadow-[0_0_15px_rgba(20,91,255,0.4)] focus:outline-none focus:border-white/10 focus:shadow-[0_0_20px_rgba(20,91,255,0.6)] focus:ring-0 transition-all duration-300"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-body text-sm text-white/70 ml-1 text-left">
                  {language === 'es' ? 'Tu Teléfono' : 'Your Phone'}
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={language === 'es' ? "Ej. +1 234 567 8900" : "Ex. +1 234 567 8900"}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 font-body hover:border-white/10 hover:shadow-[0_0_15px_rgba(20,91,255,0.4)] focus:outline-none focus:border-white/10 focus:shadow-[0_0_20px_rgba(20,91,255,0.6)] focus:ring-0 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-body text-sm text-white/70 ml-1 text-left">
                {language === 'es' ? '¿Cuál es tu objetivo principal?' : 'What is your main goal?'}
              </label>
              <textarea 
                name="goal"
                required
                value={formData.goal}
                onChange={handleChange}
                rows={4}
                placeholder={language === 'es' ? "Ej. Quiero aumentar mis leads mensuales en un 50%..." : "Ex. I want to increase my monthly leads by 50%..."}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 font-body hover:border-white/10 hover:shadow-[0_0_15px_rgba(20,91,255,0.4)] focus:outline-none focus:border-white/10 focus:shadow-[0_0_20px_rgba(20,91,255,0.6)] focus:ring-0 transition-all duration-300 resize-none"
              />
            </div>

            {/* Calendar Trigger */}
            <div className="flex flex-col gap-3">
              <label className="font-body text-sm text-white/70 ml-1 text-left flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#145BFF]" />
                  {language === 'es' ? 'Agendar Asesoría (Opcional)' : 'Schedule Consultation (Optional)'}
                </span>
                {(selectedDate && selectedTime) && (
                  <span className="text-xs text-[#145BFF] flex items-center gap-1 bg-[#145BFF]/10 px-2 py-1 rounded-full border border-[#145BFF]/20">
                    <Check className="w-3 h-3" />
                    {language === 'es' ? 'Agendado' : 'Scheduled'}
                  </span>
                )}
              </label>
              
              <button
                type="button"
                onClick={() => setIsCalendarModalOpen(true)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.05] hover:border-[#145BFF]/50 transition-all group/calendar-btn"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#145BFF]/10 flex items-center justify-center border border-[#145BFF]/20 group-hover/calendar-btn:scale-110 transition-transform">
                    <CalendarIcon className="w-5 h-5 text-[#145BFF]" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-white font-body text-sm font-medium">
                      {selectedDate && selectedTime 
                        ? `${format(selectedDate, 'MMM d, yyyy', { locale: language === 'es' ? es : enUS })} · ${selectedTime}`
                        : (language === 'es' ? 'Seleccionar día y hora' : 'Select day and time')}
                    </span>
                    <span className="text-white/40 text-xs font-body">
                       {language === 'es' ? 'Lunes - Sábado, 9:00 AM - 6:00 PM' : 'Monday - Saturday, 9:00 AM - 6:00 PM'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover/calendar-btn:text-white/70 transition-colors group-hover/calendar-btn:translate-x-1 duration-300" />
              </button>
            </div>

            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(20,91,255,0.8)" }}
              animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="group relative w-full flex items-center justify-center gap-2 mt-2 px-8 py-4 font-body font-bold text-white transition-all duration-500 rounded-xl overflow-hidden cursor-pointer"
              style={{
                backgroundImage: 'linear-gradient(90deg, #145BFF, #FFFFFF, #145BFF)',
                backgroundSize: '200% auto',
                boxShadow: '0 0 20px rgba(20,91,255,0.6)',
                color: '#030712'
              }}
            >
              <span className="relative flex items-center gap-2">
                {language === 'es' ? 'Solicitar Agenda' : 'Request Consultation'}
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </span>
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#145BFF]/20 border border-[#145BFF]/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(20,91,255,0.3)]">
              <Check className="w-8 h-8 text-[#145BFF]" />
            </div>
            <h3 className="font-heading text-2xl text-white font-medium mb-3">
              {language === 'es' ? '¡Solicitud Recibida!' : 'Request Received!'}
            </h3>
            <p className="text-[#CFCFD4]/85 font-body text-sm font-light leading-relaxed max-w-sm mb-6">
              {language === 'es' 
                ? 'Gracias por contactarnos. Hemos recibido tu información de asesoría. Nos pondremos en contacto contigo por teléfono muy pronto.' 
                : 'Thank you for reaching out. We have received your consultation details. We will contact you by phone very soon.'}
            </p>
            
            {selectedDate && selectedTime && (
              <div className="bg-[#145BFF]/5 border border-white/5 rounded-2xl p-4 w-full text-left mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#145BFF]" />
                <p className="text-xs font-body text-[#CFCFD4]/60 uppercase tracking-widest mb-1.5">
                  {language === 'es' ? 'Asesoría Agendada' : 'Scheduled Call'}
                </p>
                <p className="text-white font-body text-sm font-medium">
                  {format(selectedDate, 'PPPP', { locale: language === 'es' ? es : enUS })}
                </p>
                <p className="text-[#3B7BFF] font-body text-xs mt-1 font-semibold">
                  {selectedTime} ({language === 'es' ? 'Llamada telefónica' : 'Phone consult'})
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: "", phone: "", email: "", goal: "" });
                setSelectedDate(null);
                setSelectedTime(null);
                if (isModalLayout) {
                  setIsBookingModalOpen(false);
                }
              }}
              className="py-2.5 px-6 rounded-xl border border-white/10 text-[#CFCFD4]/70 hover:text-white font-body text-xs cursor-pointer hover:bg-white/5 transition-all duration-300"
            >
              {language === 'es' ? 'Enviar otro mensaje' : 'Submit another request'}
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <section id="contact" className="pt-12 pb-24 md:pt-16 md:pb-32 lg:py-32 relative overflow-hidden bg-transparent">
      {/* Background Electric Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.5, 0.9, 0.5],
            x: [0, 150, -100, 0],
            y: [0, -100, 150, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[radial-gradient(ellipse_at_center,rgba(20,91,255,0.4)_0%,transparent_60%)] blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4],
            x: [0, -150, 100, 0],
            y: [0, 150, -100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25)_0%,transparent_60%)] blur-[120px]"
        />
        {/* Intense Core */}
        <motion.div 
          animate={{ 
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-[radial-gradient(circle_at_center,rgba(20,91,255,0.6)_0%,transparent_50%)] blur-[80px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Copy & CTA Info */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{
                background: 'rgba(20,91,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(20,91,255,0.8)',
                boxShadow: '0 0 15px rgba(20,91,255,0.5), inset 0 0 8px rgba(20,91,255,0.2)'
              }}
            >
              <Sparkles className="w-4 h-4 text-[#3B7BFF] drop-shadow-[0_0_8px_rgba(20,91,255,0.8)]" />
              <span className="text-white font-body text-xs md:text-sm tracking-[0.2em] uppercase font-medium drop-shadow-[0_0_8px_rgba(20,91,255,0.5)]">
                {language === 'es' ? 'Asesoría Estratégica' : 'Strategic Consulting'}
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-[200] text-white leading-[1.1] tracking-tight mb-6"
            >
              {language === 'es' ? '¿Tienes dudas sobre qué plan elegir?' : 'Not sure which plan to choose?'} <br />
              <motion.span 
                animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="bg-[linear-gradient(90deg,#145BFF,#FFFFFF,#145BFF)] bg-[length:200%_auto] bg-clip-text text-transparent italic font-[300] drop-shadow-[0_0_15px_rgba(20,91,255,0.5)]"
              >
                {language === 'es' ? 'Agenda una cita y te orientamos' : 'Schedule a call and we will guide you'}
              </motion.span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#CFCFD4] font-body text-lg md:text-xl font-light leading-relaxed mb-8 max-w-xl"
            >
              {language === 'es' ? 'Cuéntanos sobre tu ' : 'Tell us about your '} <motion.span 
                animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="bg-[linear-gradient(90deg,#145BFF,#FFFFFF,#145BFF)] bg-[length:200%_auto] bg-clip-text text-transparent font-medium drop-shadow-[0_0_10px_rgba(20,91,255,0.6)]"
              >{language === 'es' ? 'negocio' : 'business'}</motion.span> {language === 'es' ? ' y te guiaremos hacia el plan estratégico exacto para ti.' : ' and we will guide you towards the exact strategic plan for you.'}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-4 w-full"
            >
              <div className="flex items-center gap-4 text-white/80 text-left">
                <div className="w-12 h-12 rounded-full bg-[#145BFF]/10 border border-[#145BFF]/30 flex items-center justify-center shadow-[0_0_15px_rgba(20,91,255,0.2)] shrink-0">
                  <span className="font-heading font-bold text-[#145BFF]">1</span>
                </div>
                <p className="font-body text-base">{language === 'es' ? 'Llena el ' : 'Fill out the '} <motion.span 
                  animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="bg-[linear-gradient(90deg,#145BFF,#FFFFFF,#145BFF)] bg-[length:200%_auto] bg-clip-text text-transparent font-medium drop-shadow-[0_0_10px_rgba(20,91,255,0.6)]"
                >{language === 'es' ? 'formulario' : 'form'}</motion.span> {language === 'es' ? ' con los detalles de tu negocio.' : ' with your business details.'}</p>
              </div>
              <div className="flex items-center gap-4 text-white/80 text-left">
                <div className="w-12 h-12 rounded-full bg-[#145BFF]/10 border border-[#145BFF]/30 flex items-center justify-center shadow-[0_0_15px_rgba(20,91,255,0.2)] shrink-0">
                  <span className="font-heading font-bold text-[#145BFF]">2</span>
                </div>
                <p className="font-body text-base">{language === 'es' ? 'Recibiremos tu solicitud directamente por WhatsApp y Email.' : 'We will receive your request directly via WhatsApp and Email.'}</p>
              </div>
              <div className="flex items-center gap-4 text-white/80 text-left">
                <div className="w-12 h-12 rounded-full bg-[#145BFF]/10 border border-[#145BFF]/30 flex items-center justify-center shadow-[0_0_15px_rgba(20,91,255,0.2)] shrink-0">
                  <span className="font-heading font-bold text-[#145BFF]">3</span>
                </div>
                <p className="font-body text-base">{language === 'es' ? 'Agendamos una llamada para trazar tu ' : 'We schedule a call to chart your '} <motion.span 
                  animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="bg-[linear-gradient(90deg,#145BFF,#FFFFFF,#145BFF)] bg-[length:200%_auto] bg-clip-text text-transparent font-medium drop-shadow-[0_0_10px_rgba(20,91,255,0.6)]"
                >{language === 'es' ? 'plan de acción' : 'action plan'}</motion.span>.</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Premium Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full"
          >
            {/* Soft Ambient Glow Behind the Card */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#145BFF] via-[#FFFFFF] to-[#145BFF] opacity-20 blur-2xl pointer-events-none"></div>
            
            <div 
              className="relative w-full rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_50px_rgba(20,91,255,0.1)] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(13,18,32,0.15) 0%, rgba(5,5,7,0.25) 100%)',
                backdropFilter: 'blur(4px)',
              }}
            >
              {/* True Gradient Border Edge */}
              <div 
                className="absolute inset-0 rounded-3xl border-2 border-transparent pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, #145BFF, #FFFFFF, #145BFF) border-box',
                  WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'destination-out',
                  maskComposite: 'exclude'
                }}
              />
              
              {renderFormContent(false)}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Global Booking Dialog Modal centered on Mobile/everywhere */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent 
          className="bg-[#050507]/95 backdrop-blur-xl border-white/[0.08] text-white max-w-lg w-[95vw] rounded-3xl p-6 md:p-8 overflow-y-auto max-h-[90vh] shadow-[0_0_50px_rgba(20,91,255,0.2)] scrollbar-thin"
        >
          <DialogHeader className="mb-4 text-left">
            <div className="flex items-center gap-2 mb-2 font-heading text-[#145BFF] font-medium text-sm tracking-widest uppercase">
              <Sparkles className="w-4 h-4" />
              {language === 'es' ? 'Asesoría VIP' : 'Elite Consultation'}
            </div>
            <DialogTitle className="font-heading text-2xl font-light text-[#F2F2F4]">
              {language === 'es' ? 'Completa tu' : 'Complete your'} <span className="text-[#145BFF] font-medium">{language === 'es' ? 'agendamiento' : 'booking'}</span>
            </DialogTitle>
            <DialogDescription className="text-[#CFCFD4]/70 font-body text-xs mt-1">
              {language === 'es' ? 'Elige tus horarios y dinos sobre tu negocio para preparar un plan de conversión personalizado.' : 'Choose times and tell us about your business to draft a custom high-performance plan.'}
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-2">
            {renderFormContent(true)}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Calendar Modal */}
      <AnimatePresence>
        {isCalendarModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCalendarModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[360px] bg-[#000000] border border-white/10 rounded-3xl p-5 md:p-6 shadow-[0_0_50px_rgba(20,91,255,0.15),inset_0_0_20px_rgba(255,255,255,0.02)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#145BFF] to-transparent opacity-50" />
              
              {/* Electric Orbs */}
              <motion.div 
                animate={{
                  x: [0, 30, -20, 0],
                  y: [0, -40, 20, 0],
                  scale: [1, 1.2, 0.9, 1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#145BFF]/30 blur-[60px] rounded-full mix-blend-screen pointer-events-none" 
              />
              <motion.div 
                animate={{
                  x: [0, -40, 30, 0],
                  y: [0, 30, -20, 0],
                  scale: [1, 0.8, 1.1, 1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[#3B7BFF]/20 blur-[50px] rounded-full mix-blend-screen pointer-events-none" 
              />
              <motion.div 
                animate={{
                  x: [0, 50, -20, 0],
                  y: [0, -20, 40, 0],
                  scale: [1, 1.3, 0.8, 1]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40%] right-[-20%] w-[40%] h-[40%] bg-[#5EEAD4]/10 blur-[40px] rounded-full mix-blend-screen pointer-events-none" 
              />

              <div className="relative z-10 flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-heading text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 leading-none">
                    {language === 'es' ? 'Disponibilidad' : 'Availability'}
                  </h3>
                  <p className="text-white/40 text-[11px] font-body mt-1">
                    {language === 'es' ? 'Horario de Lunes a Sábado' : 'Monday to Saturday hours'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsCalendarModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all group"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
              
              {/* Calendar Control */}
              <div className="relative z-10 flex items-center justify-between mb-3 bg-white/[0.02] p-1.5 rounded-xl border border-white/5 backdrop-blur-sm">
                <button 
                  type="button" 
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-white/10 text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h4 className="text-white font-body font-medium capitalize tracking-wide">
                  {format(currentMonth, 'MMMM yyyy', { locale: language === 'es' ? es : enUS })}
                </h4>
                <button 
                  type="button" 
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-white/10 text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="relative z-10 grid grid-cols-7 gap-1 mb-5">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, i) => (
                  <div key={day} className="text-center text-[10px] font-body text-white/40 mb-2">
                    {language === 'es' ? day : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
                  </div>
                ))}
                
                {Array.from({ length: startDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-1"></div>
                ))}

                {daysInMonth.map((date, i) => {
                  const disabled = isDayDisabled(date);
                  const selected = selectedDate ? isSameDay(date, selectedDate) : false;
                  const isCurrentMonth = isSameMonth(date, currentMonth);

                  if (!isCurrentMonth) return null;

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        setSelectedDate(date);
                        // Reset time if day changes to ensure they select a new valid time
                        setSelectedTime(null);
                      }}
                      className={`
                        relative aspect-square rounded-xl flex items-center justify-center font-body text-xs transition-all duration-300
                        ${disabled ? 'text-white/20 cursor-not-allowed' : 'text-white hover:bg-white/10 cursor-pointer'}
                        ${selected ? 'bg-gradient-to-br from-[#145BFF] to-[#3B7BFF] text-white shadow-[0_0_15px_rgba(20,91,255,0.6)] font-medium border border-[#3B7BFF]/50' : 'bg-transparent border border-transparent'}
                      `}
                    >
                      <span className="relative z-10">{format(date, 'd')}</span>
                      {selected && (
                         <motion.div 
                           layoutId="selectedDayGlow"
                           className="absolute inset-0 rounded-xl bg-[#145BFF]/20 blur-md pointer-events-none"
                         />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Time Selection */}
              <div className="relative z-10 h-[100px]">
                <AnimatePresence mode="popLayout">
                  {!selectedDate ? (
                    <motion.div 
                      key="prompt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]"
                    >
                      <CalendarIcon className="w-6 h-6 text-white/20 mb-2" />
                      <p className="text-white/40 text-sm font-body">
                        {language === 'es' ? 'Selecciona un día para ver los horarios' : 'Select a day to view time slots'}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="times"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="h-full"
                    >
                      <label className="font-body text-xs text-white/70 mb-2 block flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#145BFF]" />
                        {language === 'es' ? 'Horas disponibles (' : 'Available times ('}{format(selectedDate, 'MMM d', { locale: language === 'es' ? es : enUS })})
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 overflow-y-auto max-h-[75px] pr-1 pb-1 custom-scrollbar">
                        {timeSlots.map((time, i) => {
                          const selected = selectedTime === time;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`
                                py-1.5 px-1 rounded-lg text-[10px] font-body transition-all duration-300 border
                                ${selected 
                                  ? 'bg-[#145BFF] border-[#3B7BFF] text-white shadow-[0_0_10px_rgba(20,91,255,0.4)]' 
                                  : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white hover:shadow-[0_0_8px_rgba(255,255,255,0.3)]'}
                              `}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setIsCalendarModalOpen(false);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 font-body text-sm font-medium transition-all"
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="button"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setIsCalendarModalOpen(false)}
                  className={`
                    flex-[2] py-3 px-4 rounded-xl font-body text-sm font-medium transition-all flex items-center justify-center gap-2
                    ${(!selectedDate || !selectedTime)
                      ? 'bg-white/5 border border-white/5 text-white/30 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#145BFF] to-[#3B7BFF] text-white border border-[#3B7BFF]/50 shadow-[0_0_15px_rgba(20,91,255,0.3)] hover:shadow-[0_0_25px_rgba(20,91,255,0.5)]'}
                  `}
                >
                  <Check className="w-4 h-4" />
                  {language === 'es' ? 'Confirmar Fecha y Hora' : 'Confirm Date and Time'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 91, 255, 0.5);
        }
      `}} />
    </section>
  );
};

export default ContactForm;
