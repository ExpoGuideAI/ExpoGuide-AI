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
    // Navigate to pavilions, passing interests via state or query param
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-expo-teal text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{t("Your AI Companion", "مرافقك الذكي")}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">
            {t("Welcome to the Future", "مرحباً بك في المستقبل")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
            {t("Discover Riyadh Expo 2030 through an intelligent, personalized journey.", "اكتشف إكسبو الرياض 2030 من خلال رحلة ذكية ومخصصة.")}
          </p>
        </motion.div>

        {/* Interests Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="glass-panel p-6 md:p-8 rounded-3xl mt-12 w-full text-left"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <h2 className="text-2xl font-semibold mb-6 text-white">
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
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => toggleInterest(cat.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-3 group text-center",
                    isSelected 
                      ? "bg-expo-teal/20 border-expo-teal text-white shadow-[0_0_15px_rgba(76,201,176,0.3)]" 
                      : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className={cn("w-8 h-8 transition-transform group-hover:scale-110", isSelected && "text-expo-teal")} />
                  <span className="font-medium text-sm md:text-base">
                    {isRtl ? cat.labelAr : cat.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
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
                className="w-full sm:w-auto rounded-2xl backdrop-blur-md"
              >
                <Link href="/chat">
                  <Sparkles className={cn("w-5 h-5", isRtl ? "ml-2" : "mr-2")} />
                  {t("Ask AI Guide", "اسأل المرشد")}
                </Link>
              </Button>
              <Button 
                variant="gradient" 
                size="lg" 
                onClick={handleExplore}
                className="w-full sm:w-auto rounded-2xl shadow-[0_0_20px_rgba(46,139,87,0.4)]"
              >
                {t("Start Exploring", "ابدأ الاستكشاف")}
                <ArrowRight className={cn("w-5 h-5", isRtl ? "mr-2 rotate-180" : "ml-2")} />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
