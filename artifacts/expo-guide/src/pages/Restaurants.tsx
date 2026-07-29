import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useListRestaurants } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Users, Star, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

export function Restaurants() {
  const { t, isRtl } = useI18n();
  const [search, setSearch] = useState("");
  const [activeZone, setActiveZone] = useState<string>("all");

  const { data: restaurants, isLoading } = useListRestaurants({ zone: activeZone !== 'all' ? activeZone : undefined });

  const filteredRestaurants = restaurants?.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.nameAr.includes(search) ||
    r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  const crowdColor = {
    low: "text-expo-green bg-expo-green/10 border-expo-green/20",
    medium: "text-expo-yellow bg-expo-yellow/10 border-expo-yellow/20",
    high: "text-expo-orange bg-expo-orange/10 border-expo-orange/20"
  };

  const zones = ["all", "Innovation Park", "Sustainability Oasis", "Cultural District", "Global Plaza"];

  return (
    <div className="container mx-auto px-4 py-8" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">{t("Dining", "المطاعم")}</h1>
          <p className="text-muted-foreground">
            {t("Taste flavors from around the world.", "تذوق نكهات من جميع أنحاء العالم.")}
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className={cn("absolute top-3 w-4 h-4 text-muted-foreground", isRtl ? "right-3" : "left-3")} />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Search restaurants...", "ابحث عن مطعم...")} 
            className={cn(isRtl ? "pr-9" : "pl-9", "bg-white/5 border-white/10")}
          />
        </div>
      </div>

      {/* Zone filters */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
        {zones.map(zone => (
          <Badge 
            key={zone}
            variant={activeZone === zone ? "glass" : "outline"}
            className={cn(
              "px-4 py-2 cursor-pointer whitespace-nowrap text-sm border-white/10 transition-colors",
              activeZone === zone ? "bg-white/20 text-white" : "hover:bg-white/5"
            )}
            onClick={() => setActiveZone(zone)}
          >
            {zone === "all" ? t("All Zones", "كل المناطق") : zone}
          </Badge>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-3xl" />
          ))
        ) : filteredRestaurants?.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-panel rounded-3xl">
            <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">{t("No restaurants found", "لم يتم العثور على مطاعم")}</h3>
          </div>
        ) : (
          filteredRestaurants?.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-3xl overflow-hidden flex flex-col relative"
            >
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <Badge variant="glass" className="bg-black/40 backdrop-blur-md">
                  <Star className="w-3 h-3 text-expo-yellow fill-expo-yellow mr-1" />
                  {restaurant.rating.toFixed(1)}
                </Badge>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-white">
                    {isRtl ? restaurant.nameAr : restaurant.name}
                  </h3>
                </div>
                
                <div className="text-expo-orange font-medium text-sm mb-4">
                  {isRtl ? restaurant.cuisineAr : restaurant.cuisine} • <span className="text-white/70">{restaurant.priceRange}</span>
                </div>

                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                  {restaurant.description}
                </p>

                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {restaurant.zone}
                </div>
                
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {restaurant.waitMinutes}m {t("wait", "انتظار")}
                    </span>
                  </div>
                  <div className={cn("flex items-center gap-1 text-xs px-2 py-1 rounded-md border", crowdColor[restaurant.crowdLevel as keyof typeof crowdColor] || crowdColor.low)}>
                    <Users className="w-3 h-3" />
                    <span className="capitalize">{restaurant.crowdLevel}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
