import { Sparkles, Heart } from "lucide-react";
import logoImage from "@/assets/Logo.png";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-transparent">
              <img 
                src={logoImage} 
                alt="Clube dos Cisnes Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-base sm:text-lg">Clube dos Cisnes</h3>
              <p className="text-xs sm:text-sm opacity-70">Automação & Inteligência Artificial</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center order-3 md:order-2">
            <p className="text-xs sm:text-sm opacity-70">
              © {new Date().getFullYear()} Clube dos Cisnes. <br />Todos os direitos reservados.
            </p>
            <p className="text-[10px] sm:text-xs opacity-50 mt-1 flex items-center justify-center gap-1">
              Feito no Brasil.
            </p>
            <p className="text-[9px] sm:text-[10px] opacity-40 mt-2 max-w-md mx-auto">
              * O site oferecido é uma única landing page. Esta oferta é válida apenas durante o período da campanha do Carnaval.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm order-2 md:order-3">
            <a href="#" className="opacity-70 hover:opacity-100 transition-opacity whitespace-nowrap">
              Privacidade
            </a>
            <a href="#" className="opacity-70 hover:opacity-100 transition-opacity whitespace-nowrap">
              Termos
            </a>
            <a href="#" className="opacity-70 hover:opacity-100 transition-opacity whitespace-nowrap">
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
