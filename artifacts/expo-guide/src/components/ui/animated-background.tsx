import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundProps {
  className?: string;
}

// Official Expo 2030 Palm Leaf Shapes
// Each represents a theme from the logo

// Nature: Large rounded palm frond
const NatureLeaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 140" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nature-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#006C35', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#4FB480', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fill="url(#nature-grad)" d="M60,10 Q80,30 85,60 Q88,90 80,120 Q70,135 60,138 Q50,135 40,120 Q32,90 35,60 Q40,30 60,10 Z M60,25 Q50,45 48,65 Q47,85 52,105 L68,105 Q73,85 72,65 Q70,45 60,25 Z" />
  </svg>
);

// Architecture: Geometric triangular structural lines
const ArchLeaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill="#1E87BD" d="M50,5 L85,40 L75,50 L50,25 L25,50 L15,40 Z M50,35 L75,60 L70,70 L50,50 L30,70 L25,60 Z M50,65 L65,80 L60,90 L50,80 L40,90 L35,80 Z M50,95 L55,105 L50,115 L45,105 Z" />
  </svg>
);

// Art: Flowing ribbon/script shape
const ArtLeaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 130" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="art-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#FAB712', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#FFEB72', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fill="url(#art-grad)" d="M20,20 Q40,10 60,25 Q80,40 70,60 Q60,80 50,85 Q40,90 35,100 Q30,110 40,120 Q30,125 20,115 Q10,100 20,85 Q30,70 25,55 Q20,40 10,35 Q15,25 20,20 Z" />
  </svg>
);

// Science: Molecular network (dots and lines)
const ScienceLeaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="science-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#08B0A0', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#8BCAB3', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <g fill="url(#science-grad)">
      <circle cx="50" cy="20" r="6" />
      <circle cx="30" cy="40" r="5" />
      <circle cx="70" cy="40" r="5" />
      <circle cx="20" cy="65" r="4" />
      <circle cx="50" cy="65" r="6" />
      <circle cx="80" cy="65" r="4" />
      <circle cx="35" cy="90" r="5" />
      <circle cx="65" cy="90" r="5" />
      <circle cx="50" cy="110" r="5" />
      <line x1="50" y1="20" x2="30" y2="40" stroke="url(#science-grad)" strokeWidth="2" />
      <line x1="50" y1="20" x2="70" y2="40" stroke="url(#science-grad)" strokeWidth="2" />
      <line x1="30" y1="40" x2="20" y2="65" stroke="url(#science-grad)" strokeWidth="1.5" />
      <line x1="30" y1="40" x2="50" y2="65" stroke="url(#science-grad)" strokeWidth="2" />
      <line x1="70" y1="40" x2="80" y2="65" stroke="url(#science-grad)" strokeWidth="1.5" />
      <line x1="70" y1="40" x2="50" y2="65" stroke="url(#science-grad)" strokeWidth="2" />
      <line x1="50" y1="65" x2="35" y2="90" stroke="url(#science-grad)" strokeWidth="2" />
      <line x1="50" y1="65" x2="65" y2="90" stroke="url(#science-grad)" strokeWidth="2" />
      <line x1="35" y1="90" x2="50" y2="110" stroke="url(#science-grad)" strokeWidth="1.5" />
      <line x1="65" y1="90" x2="50" y2="110" stroke="url(#science-grad)" strokeWidth="1.5" />
    </g>
  </svg>
);

// Tradition: Chevron/arrow pattern
const TraditionLeaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 130" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tradition-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#E8431B', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#F1881D', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fill="url(#tradition-grad)" d="M50,10 L70,30 L60,30 L60,45 L70,45 L50,65 L30,45 L40,45 L40,30 L30,30 Z M50,70 L65,85 L58,85 L58,95 L65,95 L50,110 L35,95 L42,95 L42,85 L35,85 Z" />
  </svg>
);

// Technology: Wavy parallel lines (purple)
const TechLeaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 130" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tech-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#47266C', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#95629E', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <g fill="none" stroke="url(#tech-grad)" strokeWidth="4" strokeLinecap="round">
      <path d="M15,20 Q25,30 15,40 Q5,50 15,60 Q25,70 15,80 Q5,90 15,100 Q25,110 15,120" />
      <path d="M35,15 Q45,25 35,35 Q25,45 35,55 Q45,65 35,75 Q25,85 35,95 Q45,105 35,115" />
      <path d="M55,20 Q65,30 55,40 Q45,50 55,60 Q65,70 55,80 Q45,90 55,100 Q65,110 55,120" />
    </g>
  </svg>
);

export function AnimatedBackground({ className }: BackgroundProps) {
  return (
    <div className={cn("fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-white", className)}>
      {/* Nature leaf - top left */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-16 -left-12 opacity-[0.14] w-56 h-64"
      >
        <NatureLeaf className="w-full h-full" />
      </motion.div>
      
      {/* Architecture leaf - top right */}
      <motion.div
        animate={{ y: [0, 25, 0], rotate: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[8%] -right-8 opacity-[0.16] w-48 h-56"
      >
        <ArchLeaf className="w-full h-full" />
      </motion.div>

      {/* Art leaf - left mid */}
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, 18, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[35%] -left-10 opacity-[0.15] w-44 h-58"
      >
        <ArtLeaf className="w-full h-full" />
      </motion.div>

      {/* Science leaf - center right */}
      <motion.div
        animate={{ y: [0, 35, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-[28%] right-[5%] opacity-[0.12] w-40 h-48"
      >
        <ScienceLeaf className="w-full h-full" />
      </motion.div>
      
      {/* Tradition leaf - bottom right */}
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-[60%] right-[12%] opacity-[0.18] w-52 h-60"
      >
        <TraditionLeaf className="w-full h-full" />
      </motion.div>

      {/* Technology leaf - bottom left */}
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute -bottom-20 left-[25%] opacity-[0.13] w-36 h-58"
      >
        <TechLeaf className="w-full h-full" />
      </motion.div>
      
      {/* Additional scattered leaves for depth */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        className="absolute top-[72%] -left-8 opacity-[0.1] w-32 h-44"
      >
        <NatureLeaf className="w-full h-full" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute bottom-[8%] right-[35%] opacity-[0.11] w-38 h-50"
      >
        <ArtLeaf className="w-full h-full" />
      </motion.div>
    </div>
  );
}
