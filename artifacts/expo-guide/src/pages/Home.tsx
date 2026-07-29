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

// Map interest categories to official Expo 2030 theme colors
const categoryColors: Record<string, string> = {
  "technology": "border-[#1E87BD] text-[#1E87BD]", // Architecture
  "sustainability": "border-[#006C35] text-[#006C35]", // Nature
  "culture": "border-[#E8431B] text-[#E8431B]", // Tradition
  "arts": "border-[#FAB712] text-[#FAB712]", // Art
  "family": "border-[#08B0A0] text-[#08B0A0]", // Science
  "innovation": "border-[#47266C] text-[#47266C]", // Technology
  "business": "border-[#1E87BD] text-[#1E87BD]", // Architecture
  "space": "border-[#47266C] text-[#47266C]" // Technology
};

const categoryBgColors: Record<string, string> = {
  "technology": "text-white shadow-[0_4px_20px_rgba(30,135,189,0.4)]", // Architecture
  "sustainability": "text-white shadow-[0_4px_20px_rgba(0,108,53,0.4)]", // Nature
  "culture": "text-white shadow-[0_4px_20px_rgba(232,67,27,0.4)]", // Tradition
  "arts": "text-gray-900 shadow-[0_4px_20px_rgba(250,183,18,0.4)]", // Art (dark text on yellow)
  "family": "text-white shadow-[0_4px_20px_rgba(8,176,160,0.4)]", // Science
  "innovation": "text-white shadow-[0_4px_20px_rgba(71,38,108,0.4)]", // Technology
  "business": "text-white shadow-[0_4px_20px_rgba(30,135,189,0.4)]", // Architecture
  "space": "text-white shadow-[0_4px_20px_rgba(71,38,108,0.4)]" // Technology
};

const categoryGradients: Record<string, string> = {
  "technology": "gradient-arch",
  "sustainability": "gradient-nature",
  "culture": "gradient-tradition",
  "arts": "gradient-art",
  "family": "gradient-science",
  "innovation": "gradient-tech",
  "business": "gradient-arch",
  "space": "gradient-tech"
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
              
              // Fallback to science teal if category id doesn't match
              const colorClass = categoryColors[cat.id] || "border-[#08B0A0] text-[#08B0A0]";
              const bgClass = categoryBgColors[cat.id] || "text-white shadow-[0_4px_20px_rgba(8,176,160,0.4)]";
              const gradientClass = categoryGradients[cat.id] || "gradient-science";

              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => toggleInterest(cat.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 gap-3 group text-center border-2",
                    isSelected 
                      ? `${gradientClass} ${bgClass} border-transparent scale-[1.02]` 
                      : `bg-white border-gray-100 hover:${colorClass} hover:bg-gray-50 text-gray-600`
                  )}
                >
                  <Icon className={cn("w-8 h-8 transition-transform group-hover:scale-110", !isSelected && "text-gray-400 group-hover:text-inherit")} />
                  <span className="font-semibold text-sm md:text-base">
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
