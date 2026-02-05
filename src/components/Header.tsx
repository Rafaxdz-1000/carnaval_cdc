import { Sparkles } from "lucide-react";
import logoImage from "@/assets/logo.png";

export const Header = () => {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo Space */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center shadow-carnival flex-shrink-0 bg-transparent">
            <img 
              src={logoImage} 
              alt="Clube dos Cisnes Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-base sm:text-lg text-foreground truncate">Clube dos Cisnes</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Automação & IA</p>
          </div>
        </div>

        {/* CTA */}
        <button 
          onClick={scrollToBottom}
          className="hidden sm:flex items-center gap-2 gradient-cta text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm hover:scale-105 transition-transform shadow-carnival flex-shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Diagnóstico + Site
        </button>
      </div>
    </header>
  );
};
