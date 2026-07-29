import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useListRestaurants } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Users, Star, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

const emojiMap: Record<string, string> = {
  "Middle Eastern": "🥘",
  "Japanese": "🍣",
  "International": "🌍",
  "Italian": "🍱",
  "Cafe": "☕",
  "Indian": "🍜",
  "Mexican": "🍕"
};

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
    low: "text-[#009943] bg-[#009943]/10 border-[#009943]/20",
    medium: "text-[#F06724] bg-[#F06724]/10 border-[#F06724]/20",
    high: "text-[#E8431B] bg-red-50 border-red-100"
  };

  // Map cuisine types to official Expo colors
  const cuisineGradients: Record<string, string> = {
    "Middle Eastern": "gradient-tradition",
    "Saudi": "gradient-tradition",
    "Arabic": "gradient-tradition",
    "Japanese": "gradient-arch",
    "Asian": "gradient-arch",
    "Italian": "gradient-art",
    "European": "gradient-art",
    "Mexican": "gradient-tradition",
    "Latin": "gradient-tradition",
    "Indian": "gradient-science",
    "Cafe": "gradient-nature",
    "International": "gradient-nature"
  };

  const zones = ["all", "Innovation Park", "Sustainability Oasis", "Cultural District", "Global Plaza"];

  return (
    <div className="container mx-auto px-4 py-8" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900 inline-block relative">
            {t("Dining", "المطاعم")}
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#E8431B] to-[#FAB712] rounded-full" />
          </h1>
          <p className="text-gray-500 mt-2">
            {t("Taste flavors from around the world.", "تذوق نكهات من جميع أنحاء العالم.")}
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className={cn("absolute top-3 w-4 h-4 text-gray-400", isRtl ? "right-3" : "left-3")} />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Search restaurants...", "ابحث عن مطعم...")} 
            className={cn(isRtl ? "pr-9" : "pl-9", "bg-white border-gray-200 shadow-sm rounded-full")}
          />
        </div>
      </div>

      {/* Zone filters */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
        {zones.map(zone => {
          const isActive = activeZone === zone;
          return (
            <button 
              key={zone}
              className={cn(
                "px-5 py-2 cursor-pointer whitespace-nowrap text-sm rounded-full transition-all shadow-sm font-medium border",
                isActive 
                  ? "bg-[#F06724] text-white border-transparent" 
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              )}
              onClick={() => setActiveZone(zone)}
            >
              {zone === "all" ? t("All Zones", "كل المناطق") : zone}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-3xl" />
          ))
        ) : filteredRestaurants?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white border border-gray-100 shadow-sm rounded-3xl">
            <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2 text-gray-800">{t("No restaurants found", "لم يتم العثور على مطاعم")}</h3>
          </div>
        ) : (
          filteredRestaurants?.map((restaurant, index) => {
            const emoji = emojiMap[restaurant.cuisine] || "🍽️";
            const gradientClass = cuisineGradients[restaurant.cuisine] || "gradient-nature";
            return (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="expo-card overflow-hidden flex flex-col relative group"
              >
                {/* Top gradient strip */}
                <div className={cn("h-2 w-full", gradientClass)} />
                
                <div className="absolute top-6 right-4 z-10">
                  <span className="bg-white border border-gray-100 shadow-sm text-gray-700 text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center">
                    <Star className="w-3.5 h-3.5 text-[#FAB712] fill-[#FAB712] mr-1" />
                    {restaurant.rating.toFixed(1)}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col pt-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E8431B]/20 to-[#FAB712]/20 flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                      {emoji}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {isRtl ? restaurant.nameAr : restaurant.name}
                      </h3>
                      <div className="text-[#08B0A0] font-semibold text-sm mt-1">
                        {isRtl ? restaurant.cuisineAr : restaurant.cuisine} <span className="text-gray-400 mx-1">•</span> <span className="text-[#009943]">{restaurant.priceRange}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                    {restaurant.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4 bg-gray-50 w-fit px-3 py-1 rounded-md border border-gray-100">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    {restaurant.zone}
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-700">
                        {restaurant.waitMinutes}m {t("wait", "انتظار")}
                      </span>
                    </div>
                    <div className={cn("flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold border", crowdColor[restaurant.crowdLevel as keyof typeof crowdColor] || crowdColor.low)}>
                      <Users className="w-3.5 h-3.5" />
                      <span className="capitalize">{restaurant.crowdLevel}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  );
}
