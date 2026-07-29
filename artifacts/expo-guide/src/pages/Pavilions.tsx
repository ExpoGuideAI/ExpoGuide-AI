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

// Re-using the types from API implicitly.
// Pavilion has id, name, nameAr, country, description, descriptionAr, categories, zone, location, imageUrl, highlights, openingHours.

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
    // For manual triggering without query params, we could show a dialog to pick, 
    // but we'll use a placeholder array or the ones from the home page.
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
    low: "text-expo-green bg-expo-green/10 border-expo-green/20",
    medium: "text-expo-yellow bg-expo-yellow/10 border-expo-yellow/20",
    high: "text-expo-orange bg-expo-orange/10 border-expo-orange/20"
  };

  const categories = ["all", "sustainability", "tech", "culture", "arts", "family", "innovation"];

  return (
    <div className="container mx-auto px-4 py-8" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">{t("Pavilions", "الأجنحة")}</h1>
          <p className="text-muted-foreground">
            {t("Explore world-class exhibitions and experiences.", "استكشف معارض وتجارب عالمية المستوى.")}
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className={cn("absolute top-3 w-4 h-4 text-muted-foreground", isRtl ? "right-3" : "left-3")} />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search pavilions...", "ابحث عن جناح...")} 
              className={cn(isRtl ? "pr-9" : "pl-9", "bg-white/5 border-white/10")}
            />
          </div>
          <Button 
            onClick={recommended ? () => setRecommended(null) : handleRecommend}
            variant={recommended ? "secondary" : "gradient"} 
            className="shrink-0"
            disabled={recommendMutation.isPending}
          >
            {recommendMutation.isPending ? (
              <span className="animate-pulse">{t("Thinking...", "جاري التفكير...")}</span>
            ) : recommended ? (
              t("Show All", "عرض الكل")
            ) : (
              <>
                <Sparkles className={cn("w-4 h-4", isRtl ? "ml-2" : "mr-2")} />
                {t("For Me", "مقترح لي")}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Category filters */}
      {!recommended && (
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
          {categories.map(cat => (
            <Badge 
              key={cat}
              variant={activeCategory === cat ? "glass" : "outline"}
              className={cn(
                "px-4 py-2 cursor-pointer whitespace-nowrap text-sm border-white/10 transition-colors",
                activeCategory === cat ? "bg-white/20 text-white" : "hover:bg-white/5"
              )}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === "all" ? t("All", "الكل") : t(cat.charAt(0).toUpperCase() + cat.slice(1), cat)}
            </Badge>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loadingPavilions ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-3xl" />
          ))
        ) : filteredPavilions?.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-panel rounded-3xl">
            <h3 className="text-xl font-medium mb-2">{t("No pavilions found", "لم يتم العثور على أجنحة")}</h3>
            <p className="text-muted-foreground">{t("Try adjusting your filters.", "حاول تعديل خيارات البحث.")}</p>
          </div>
        ) : (
          filteredPavilions?.map((pavilion, index) => {
            const queue = getQueueInfo(pavilion.id);
            const isRec = pavilion.relevanceScore && pavilion.relevanceScore > 0;
            
            return (
              <Dialog key={pavilion.id} open={selectedPavilion === pavilion.id} onOpenChange={(open) => !open && setSelectedPavilion(null)}>
                <DialogTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedPavilion(pavilion.id)}
                    className="glass-card rounded-3xl overflow-hidden cursor-pointer group hover:border-white/30 transition-colors flex flex-col"
                  >
                    {/* Image placeholder / banner */}
                    <div className="h-40 bg-gradient-to-br from-white/5 to-white/10 relative p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <Badge variant="glass" className="bg-black/40 border-none font-medium">
                          {pavilion.country}
                        </Badge>
                        {isRec && (
                          <Badge variant="gradient" className="bg-gradient-to-r from-expo-teal to-expo-blue border-none">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            {Math.round(pavilion.relevanceScore * 100)}% Match
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2 mt-auto">
                        {pavilion.categories.slice(0, 2).map((cat: string) => (
                          <Badge key={cat} variant="outline" className="bg-black/30 border-white/10 text-white/80 text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-1 text-white group-hover:text-expo-teal transition-colors">
                        {isRtl ? pavilion.nameAr : pavilion.name}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        {pavilion.zone} • {pavilion.location}
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {queue ? `${queue.waitMinutes}m` : '--'}
                          </span>
                        </div>
                        {queue && (
                          <div className={cn("flex items-center gap-1 text-xs px-2 py-1 rounded-md border", crowdColor[queue.crowdLevel as keyof typeof crowdColor] || crowdColor.low)}>
                            <Users className="w-3 h-3" />
                            <span className="capitalize">{queue.crowdLevel}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </DialogTrigger>

                <DialogContent className="max-w-2xl" dir={isRtl ? 'rtl' : 'ltr'}>
                  <div className="h-48 -mt-6 -mx-6 mb-6 bg-gradient-to-br from-expo-teal/20 to-expo-blue/20 rounded-t-3xl relative">
                    {/* Fake image cover */}
                  </div>
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="glass">{pavilion.country}</Badge>
                      <Badge variant="outline">{pavilion.zone}</Badge>
                    </div>
                    <DialogTitle className="text-3xl mb-2">{isRtl ? pavilion.nameAr : pavilion.name}</DialogTitle>
                    <DialogDescription className="text-base text-white/70">
                      {isRtl ? pavilion.descriptionAr : pavilion.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                      <Clock className="w-6 h-6 text-expo-teal mb-2" />
                      <span className="text-sm text-muted-foreground mb-1">{t("Wait Time", "وقت الانتظار")}</span>
                      <span className="text-xl font-bold text-white">{queue ? `${queue.waitMinutes} mins` : t("Unknown", "غير معروف")}</span>
                    </div>
                    <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                      <Users className="w-6 h-6 text-expo-blue mb-2" />
                      <span className="text-sm text-muted-foreground mb-1">{t("Crowd Level", "مستوى الازدحام")}</span>
                      <span className="text-xl font-bold text-white capitalize">{queue ? queue.crowdLevel : t("Unknown", "غير معروف")}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">{t("Highlights", "أبرز المعالم")}</h4>
                    <ul className="space-y-2">
                      {pavilion.highlights.map((highlight: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-expo-teal mt-1.5 shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <Button variant="outline" className="rounded-xl">{t("Close", "إغلاق")}</Button>
                    <Button variant="gradient" className="rounded-xl">{t("Navigate Here", "الذهاب إلى هنا")}</Button>
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
