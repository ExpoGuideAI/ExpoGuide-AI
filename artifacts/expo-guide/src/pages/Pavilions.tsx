import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useListPavilions, useGetRecommendedPavilions, useGetQueueStatus } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Users, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Official Expo 2030 colors for categories
const categoryColors: Record<string, string> = {
  "sustainability": "bg-[#009943] text-white", // Nature secondary
  "tech": "bg-[#009ED5] text-white", // Architecture secondary
  "technology": "bg-[#009ED5] text-white", // Architecture secondary
  "culture": "bg-[#F06724] text-white", // Tradition secondary
  "arts": "bg-[#FFCC3F] text-gray-900", // Art secondary (dark text)
  "family": "bg-[#87CABF] text-gray-900", // Science light (dark text)
  "innovation": "bg-[#773A87] text-white", // Technology secondary
  "business": "bg-[#009ED5] text-white", // Architecture secondary
  "all": "bg-gray-100 text-gray-800"
};

// Zone gradients using official theme colors
const zoneGradients: Record<string, string> = {
  "Zone A": "from-[#006C35] to-[#4FB480]", // Nature
  "Zone B": "from-[#1E87BD] to-[#4FB480]", // Architecture
  "Zone C": "from-[#E8431B] to-[#F1881D]", // Tradition
  "Zone D": "from-[#47266C] to-[#95629E]", // Technology
  "Zone E": "from-[#08B0A0] to-[#8BCAB3]", // Science
  "Zone F": "from-[#FAB712] to-[#FFEB72]", // Art
  "Innovation Park": "from-[#47266C] to-[#95629E]", // Technology
  "Sustainability Oasis": "from-[#006C35] to-[#4FB480]", // Nature
  "Cultural District": "from-[#E8431B] to-[#F1881D]", // Tradition
  "Global Plaza": "from-[#1E87BD] to-[#4FB480]" // Architecture
};

export function Pavilions() {
  const { t, isRtl } = useI18n();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const urlInterests = searchParams.get("interests")?.split(",") || [];
  
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedPavilion, setSelectedPavilion] = useState<number | null>(null);

  // Data fetching
  const { data: pavilions, isLoading: loadingPavilions } = useListPavilions({ category: activeCategory !== 'all' ? activeCategory : undefined });
  const { data: queueStatus } = useGetQueueStatus();
  
  const recommendMutation = useGetRecommendedPavilions();
  
  const [recommended, setRecommended] = useState<any[] | null>(null);

  // If navigated with interests, automatically fetch recommendations
  useEffect(() => {
    if (urlInterests.length > 0 && !recommended && !recommendMutation.isPending) {
      recommendMutation.mutate({ data: { interests: urlInterests } }, {
        onSuccess: (data) => {
          setRecommended(data);
        }
      });
    }
  }, [urlInterests]);

  const handleRecommend = () => {
    recommendMutation.mutate({ data: { interests: ["sustainability", "tech"] } }, {
      onSuccess: (data) => {
        setRecommended(data);
      }
    });
  };

  const displayPavilions = recommended ? recommended : pavilions;
  const filteredPavilions = displayPavilions?.filter(p => 
    (p.name.toLowerCase().includes(search.toLowerCase()) || 
     p.nameAr.includes(search))
  );

  const getQueueInfo = (pavilionId: number) => {
    return queueStatus?.find(q => q.pavilionId === pavilionId);
  };

  const crowdColor = {
    low: "text-[#009943] bg-[#009943]/10 border-[#009943]/20",
    medium: "text-[#F06724] bg-[#F06724]/10 border-[#F06724]/20",
    high: "text-red-500 bg-red-50 border-red-100"
  };

  const categories = ["all", "sustainability", "tech", "culture", "arts", "family", "innovation", "business"];

  return (
    <div className="container mx-auto px-4 py-8" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900 inline-block relative">
            {t("Pavilions", "الأجنحة")}
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#006C35] to-[#4FB480] rounded-full" />
          </h1>
          <p className="text-gray-500 mt-2">
            {t("Explore world-class exhibitions and experiences.", "استكشف معارض وتجارب عالمية المستوى.")}
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className={cn("absolute top-3 w-4 h-4 text-gray-400", isRtl ? "right-3" : "left-3")} />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search pavilions...", "ابحث عن جناح...")} 
              className={cn(isRtl ? "pr-9" : "pl-9", "bg-white border-gray-200 shadow-sm rounded-full")}
            />
          </div>
          <button 
            onClick={recommended ? () => setRecommended(null) : handleRecommend}
            disabled={recommendMutation.isPending}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full font-medium transition-all shadow-sm flex items-center gap-2",
              recommended 
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                : "btn-gradient-orange hover:shadow-[0_4px_15px_rgba(232,67,27,0.3)]"
            )}
          >
            {recommendMutation.isPending ? (
              <span className="animate-pulse">{t("Thinking...", "جاري التفكير...")}</span>
            ) : recommended ? (
              t("Show All", "عرض الكل")
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t("For Me", "مقترح لي")}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category filters */}
      {!recommended && (
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            const bgClass = isActive ? (categoryColors[cat] || "bg-gray-800 text-white") : "bg-white text-gray-600 border border-gray-200";
            return (
              <button 
                key={cat}
                className={cn(
                  "px-5 py-2 cursor-pointer whitespace-nowrap text-sm rounded-full transition-all shadow-sm font-medium",
                  bgClass,
                  !isActive && "hover:bg-gray-50"
                )}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === "all" ? t("All", "الكل") : t(cat.charAt(0).toUpperCase() + cat.slice(1), cat)}
              </button>
            )
          })}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loadingPavilions ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-3xl" />
          ))
        ) : filteredPavilions?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white border border-gray-100 shadow-sm rounded-3xl">
            <h3 className="text-xl font-medium mb-2 text-gray-800">{t("No pavilions found", "لم يتم العثور على أجنحة")}</h3>
            <p className="text-gray-500">{t("Try adjusting your filters.", "حاول تعديل خيارات البحث.")}</p>
          </div>
        ) : (
          filteredPavilions?.map((pavilion, index) => {
            const queue = getQueueInfo(pavilion.id);
            const isRec = pavilion.relevanceScore && pavilion.relevanceScore > 0;
            const gradientClass = zoneGradients[pavilion.zone] || "from-[#006C35] to-[#4FB480]";
            
            return (
              <Dialog key={pavilion.id} open={selectedPavilion === pavilion.id} onOpenChange={(open) => !open && setSelectedPavilion(null)}>
                <DialogTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedPavilion(pavilion.id)}
                    className="expo-card overflow-hidden cursor-pointer group flex flex-col"
                  >
                    {/* Gradient Header — name + country inside */}
                    <div className={cn("h-44 relative p-5 flex flex-col justify-between bg-gradient-to-br", gradientClass)}>
                      {/* Top row: country + match badge */}
                      <div className="flex justify-between items-start">
                        <span className="bg-black/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {pavilion.country}
                        </span>
                        {isRec && (
                          <span className="bg-white/90 text-[#006C35] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                            <Star className="w-3 h-3 fill-current" />
                            {Math.round(pavilion.relevanceScore * 100)}%
                          </span>
                        )}
                      </div>

                      {/* Bottom: name + zone */}
                      <div>
                        <h3 className="text-xl font-bold text-white drop-shadow mb-1 leading-tight">
                          {isRtl ? pavilion.nameAr : pavilion.name}
                        </h3>
                        <div className="flex items-center gap-1 text-white/80 text-xs">
                          <MapPin className="w-3 h-3" />
                          {pavilion.zone}
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex-1 flex flex-col gap-3">
                      {/* Categories */}
                      <div className="flex gap-1.5 flex-wrap">
                        {pavilion.categories.slice(0, 2).map((cat: string) => (
                          <span key={cat} className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide", categoryColors[cat] || "bg-gray-100 text-gray-600")}>
                            {cat}
                          </span>
                        ))}
                      </div>

                      {/* Wait + crowd */}
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock className="w-4 h-4 text-[#08B0A0]" />
                          <span className="text-sm font-bold">{queue ? `${queue.waitMinutes} min` : '--'}</span>
                          <span className="text-xs text-gray-400">{t("wait", "انتظار")}</span>
                        </div>
                        {queue && (
                          <div className={cn("flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold border", crowdColor[queue.crowdLevel as keyof typeof crowdColor] || crowdColor.low)}>
                            <Users className="w-3 h-3" />
                            <span className="capitalize">{t(queue.crowdLevel, queue.crowdLevel === 'low' ? 'منخفض' : queue.crowdLevel === 'medium' ? 'متوسط' : 'مرتفع')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </DialogTrigger>

                <DialogContent className="max-w-2xl bg-white border-none rounded-3xl" dir={isRtl ? 'rtl' : 'ltr'}>
                  <div className={cn("h-48 -mt-6 -mx-6 mb-6 rounded-t-3xl relative bg-gradient-to-br", gradientClass)}>
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
                  </div>
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-800">{pavilion.country}</Badge>
                      <Badge variant="outline" className="border-gray-200 text-gray-600">{pavilion.zone}</Badge>
                    </div>
                    <DialogTitle className="text-3xl mb-2 text-gray-900">{isRtl ? pavilion.nameAr : pavilion.name}</DialogTitle>
                    <DialogDescription className="text-base text-gray-600">
                      {isRtl ? pavilion.descriptionAr : pavilion.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                      <Clock className="w-6 h-6 text-[#08B0A0] mb-2" />
                      <span className="text-sm text-gray-500 mb-1">{t("Wait Time", "وقت الانتظار")}</span>
                      <span className="text-xl font-bold text-gray-900">{queue ? `${queue.waitMinutes} mins` : t("Unknown", "غير معروف")}</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                      <Users className="w-6 h-6 text-[#E8431B] mb-2" />
                      <span className="text-sm text-gray-500 mb-1">{t("Crowd Level", "مستوى الازدحام")}</span>
                      <span className="text-xl font-bold text-gray-900 capitalize">{queue ? queue.crowdLevel : t("Unknown", "غير معروف")}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-bold text-gray-900 mb-3">{t("Highlights", "أبرز المعالم")}</h4>
                    <ul className="space-y-2">
                      {pavilion.highlights.map((highlight: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#47266C] mt-1.5 shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <Button variant="outline" className="rounded-full border-gray-200 text-gray-700">{t("Close", "إغلاق")}</Button>
                    <button className="btn-gradient-green px-6 py-2 rounded-full font-medium">{t("Navigate Here", "الذهاب إلى هنا")}</button>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })
        )}
      </div>
    </div>
  );
}
