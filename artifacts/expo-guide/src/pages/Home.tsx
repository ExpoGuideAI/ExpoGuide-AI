import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useListInterestCategories } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Sparkles, ArrowRight, BrainCircuit, Leaf, Landmark, Palette, Users, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

// Map string icons from API to Lucide components
const iconMap: Record<string, React.ElementType> = {
  "BrainCircuit": BrainCircuit,
  "Leaf": Leaf,
  "Landmark": Landmark,
  "Palette": Palette,
  "Users": Users,
  "Rocket": Rocket,
};

// Official Expo 2030 theme config per interest category
const categoryTheme: Record<string, {
  gradient: string;       // CSS gradient for selected state
  lightBg: string;        // Light tinted background for unselected
  border: string;         // Border color
  iconColor: string;      // Icon + label color
  textDark: boolean;      // true = use dark text on selected (for light gradients like Art)
  shadow: string;         // Shadow on selected
}> = {
  technology:   { gradient: "linear-gradient(135deg,#1E87BD,#4FB480)", lightBg: "#EBF6FC", border: "#1E87BD", iconColor: "#1E87BD", textDark: false, shadow: "0 4px 20px rgba(30,135,189,0.35)" },
  sustainability:{ gradient: "linear-gradient(135deg,#006C35,#4FB480)", lightBg: "#E8F5EE", border: "#006C35", iconColor: "#006C35", textDark: false, shadow: "0 4px 20px rgba(0,108,53,0.35)" },
  culture:      { gradient: "linear-gradient(135deg,#E8431B,#F1881D)", lightBg: "#FEF0EB", border: "#E8431B", iconColor: "#E8431B", textDark: false, shadow: "0 4px 20px rgba(232,67,27,0.35)" },
  arts:         { gradient: "linear-gradient(135deg,#FAB712,#FFEB72)", lightBg: "#FEF8E3", border: "#FAB712", iconColor: "#C68A00", textDark: true,  shadow: "0 4px 20px rgba(250,183,18,0.4)"  },
  family:       { gradient: "linear-gradient(135deg,#08B0A0,#8BCAB3)", lightBg: "#E5F6F5", border: "#08B0A0", iconColor: "#08B0A0", textDark: false, shadow: "0 4px 20px rgba(8,176,160,0.35)"  },
  innovation:   { gradient: "linear-gradient(135deg,#47266C,#95629E)", lightBg: "#F0EBF7", border: "#47266C", iconColor: "#47266C", textDark: false, shadow: "0 4px 20px rgba(71,38,108,0.35)"  },
  business:     { gradient: "linear-gradient(135deg,#1E87BD,#4FB480)", lightBg: "#EBF6FC", border: "#1E87BD", iconColor: "#1E87BD", textDark: false, shadow: "0 4px 20px rgba(30,135,189,0.35)" },
  space:        { gradient: "linear-gradient(135deg,#47266C,#95629E)", lightBg: "#F0EBF7", border: "#47266C", iconColor: "#47266C", textDark: false, shadow: "0 4px 20px rgba(71,38,108,0.35)"  },
};

export function Home() {
  const { t, isRtl } = useI18n();
  const [, setLocation] = useLocation();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const { data: categories, isLoading } = useListInterestCategories();

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleExplore = () => {
    const params = new URLSearchParams();
    if (selectedInterests.length > 0) {
      params.set("interests", selectedInterests.join(","));
    }
    setLocation(`/pavilions?${params.toString()}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-h-[90vh]">
      <div className="max-w-4xl w-full mx-auto text-center space-y-8 z-10 pt-10">
        
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 text-[#08B0A0]" />
            <span className="text-gray-700">{t("Your AI Companion", "مرافقك الذكي")}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 drop-shadow-sm">
            {t("Welcome to ", "مرحباً بك في ")}
            <span style={{ background: 'linear-gradient(135deg, #006C35, #4FB480)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t("EXPO 2030", "إكسبو 2030")}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-light">
            {t("The Era of Change — Together for a Foresighted Tomorrow.", "عصر التغيير — معاً من أجل غدٍ بعيد النظر.")}
          </p>
        </motion.div>

        {/* Interests Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-xl p-6 md:p-10 rounded-3xl mt-12 w-full text-left"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {t("What interests you?", "ما هي اهتماماتك؟")}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))
            ) : categories?.map((cat, i) => {
              const Icon = iconMap[cat.icon] || Sparkles;
              const isSelected = selectedInterests.includes(cat.id);
              
              const theme = categoryTheme[cat.id] ?? categoryTheme["family"];

              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => toggleInterest(cat.id)}
                  style={isSelected ? {
                    background: theme.gradient,
                    boxShadow: theme.shadow,
                    border: "2px solid transparent",
                  } : {
                    background: theme.lightBg,
                    border: `2px solid ${theme.border}33`,
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 gap-3 group text-center",
                    isSelected ? "scale-[1.03]" : "hover:scale-[1.02]",
                    isSelected
                      ? (theme.textDark ? "text-gray-900" : "text-white")
                      : ""
                  )}
                >
                  <Icon
                    className="w-8 h-8 transition-transform group-hover:scale-110"
                    style={{ color: isSelected ? (theme.textDark ? "#1a1a1a" : "white") : theme.iconColor }}
                  />
                  <span
                    className="font-semibold text-sm md:text-base"
                    style={{ color: isSelected ? (theme.textDark ? "#1a1a1a" : "white") : theme.iconColor }}
                  >
                    {isRtl ? cat.labelAr : cat.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-medium">
              {selectedInterests.length === 0 
                ? t("Select to personalize your recommendations.", "اختر لتخصيص توصياتك.") 
                : t(`${selectedInterests.length} selected. Ready to explore!`, `تم اختيار ${selectedInterests.length}. مستعد للاستكشاف!`)
              }
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="w-full sm:w-auto rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Link href="/chat">
                  <Sparkles className={cn("w-5 h-5 text-[#47266C]", isRtl ? "ml-2" : "mr-2")} />
                  {t("Ask AI Guide", "اسأل المرشد")}
                </Link>
              </Button>
              <button 
                onClick={handleExplore}
                className="btn-gradient-green flex items-center justify-center px-6 py-2.5 font-medium w-full sm:w-auto hover:shadow-[0_4px_20px_rgba(46,139,87,0.3)] transition-all"
              >
                {t("Start Exploring", "ابدأ الاستكشاف")}
                <ArrowRight className={cn("w-5 h-5", isRtl ? "mr-2 rotate-180" : "ml-2")} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
