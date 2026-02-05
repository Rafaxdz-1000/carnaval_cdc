import { useState, useEffect } from "react";
import { Clock, Zap } from "lucide-react";

export const UrgencyBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set carnival date to February 14, 2026
    const carnivalDate = new Date(2026, 1, 14); // Month is 0-indexed, so 1 = February

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = carnivalDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="gradient-carnival text-primary-foreground py-2 sm:py-3 px-3 sm:px-4 relative overflow-hidden">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base font-medium">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse flex-shrink-0" />
          <span className="font-bold text-center sm:text-left">O Carnaval está chegando!</span>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <div className="flex gap-0.5 sm:gap-1">
            <TimeBlock value={timeLeft.days} label="dias" />
            <span>:</span>
            <TimeBlock value={timeLeft.hours} label="hrs" />
            <span>:</span>
            <TimeBlock value={timeLeft.minutes} label="min" />
            <span>:</span>
            <TimeBlock value={timeLeft.seconds} label="seg" />
          </div>
        </div>
        
        <span className="hidden md:inline">| Garanta seu Diagnóstico GRÁTIS!</span>
      </div>
    </div>
  );
};

const TimeBlock = ({ value, label }: { value: number; label: string }) => (
  <div className="flex items-center gap-0.5">
    <span className="bg-primary-foreground/20 px-1 sm:px-1.5 py-0.5 rounded font-mono font-bold text-xs sm:text-sm">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[10px] sm:text-xs opacity-80">{label}</span>
  </div>
);
