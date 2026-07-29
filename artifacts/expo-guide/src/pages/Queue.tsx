import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useGetQueueStatus } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Queue() {
  const { t, isRtl } = useI18n();

  // Poll every 30 seconds
  const { data: queueStatus, isLoading, isRefetching } = useGetQueueStatus({
    query: { refetchInterval: 30000 }
  });

  const sortedQueue = useMemo(() => {
    if (!queueStatus) return [];
    return [...queueStatus].sort((a, b) => a.waitMinutes - b.waitMinutes);
  }, [queueStatus]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing": return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "decreasing": return <TrendingDown className="w-4 h-4 text-expo-green" />;
      case "stable": 
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const crowdColor = {
    low: "bg-[#009943]",
    medium: "bg-[#F06724]",
    high: "bg-[#E8431B]"
  };
  
  const crowdText = {
    low: "text-[#009943]",
    medium: "text-[#F06724]",
    high: "text-[#E8431B]"
  };
  
  const crowdBorder = {
    low: "border-l-[#009943]",
    medium: "border-l-[#F06724]",
    high: "border-l-[#E8431B]"
  };

  return (
    <div className="container mx-auto px-4 py-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900 inline-flex items-center gap-3 relative">
            {t("Live Queue", "الطوابير المباشرة")}
            {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-[#08B0A0]" />}
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#1E87BD] to-[#47266C] rounded-full" />
          </h1>
          <p className="text-gray-500 mt-2">
            {t("Real-time wait times across the Expo. Refreshes every 30 seconds.", "أوقات الانتظار المباشرة في أنحاء الإكسبو. يتم التحديث كل 30 ثانية.")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="gradient-nature rounded-3xl p-6 text-white shadow-[0_4px_20px_rgba(0,108,53,0.3)]">
          <div className="text-white/80 text-sm font-medium mb-1">{t("Fastest Access", "أسرع وصول")}</div>
          <div className="text-3xl font-bold">{sortedQueue[0]?.waitMinutes || 0}m</div>
          <div className="text-sm mt-2 opacity-90 truncate">{sortedQueue[0]?.pavilionName || '-'}</div>
        </div>
        <div className="gradient-arch rounded-3xl p-6 text-white shadow-[0_4px_20px_rgba(30,135,189,0.3)]">
          <div className="text-white/80 text-sm font-medium mb-1">{t("Average Wait", "متوسط الانتظار")}</div>
          <div className="text-3xl font-bold">
            {sortedQueue.length ? Math.round(sortedQueue.reduce((a,b)=>a+b.waitMinutes,0)/sortedQueue.length) : 0}m
          </div>
          <div className="text-sm mt-2 opacity-90">{t("Across all pavilions", "في جميع الأجنحة")}</div>
        </div>
        <div className="gradient-tradition rounded-3xl p-6 text-white shadow-[0_4px_20px_rgba(232,67,27,0.3)]">
          <div className="text-white/80 text-sm font-medium mb-1">{t("Busiest", "الأكثر ازدحاماً")}</div>
          <div className="text-3xl font-bold">{sortedQueue[sortedQueue.length-1]?.waitMinutes || 0}m</div>
          <div className="text-sm mt-2 opacity-90 truncate">{sortedQueue[sortedQueue.length-1]?.pavilionName || '-'}</div>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))
        ) : (
          sortedQueue.map((item, index) => (
            <motion.div 
              key={item.pavilionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={cn(
                "expo-card p-0 flex items-center border-l-4 overflow-hidden",
                crowdBorder[item.crowdLevel as keyof typeof crowdBorder] || crowdBorder.low
              )}
            >
              <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.pavilionName}</h3>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-xs font-bold uppercase", crowdText[item.crowdLevel as keyof typeof crowdText])}>
                      {item.crowdLevel}
                    </span>
                    <div className="w-32 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", crowdColor[item.crowdLevel as keyof typeof crowdColor] || crowdColor.low)}
                        style={{ width: `${item.crowdPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">{t("Trend", "الاتجاه")}</span>
                    <div className="p-1.5 rounded-full bg-gray-50 border border-gray-100">
                      {getTrendIcon(item.trend)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 flex flex-col items-center min-w-[100px]">
                    <span className="text-2xl font-bold text-gray-900 leading-none mb-1">
                      {item.waitMinutes}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      {t("Minutes", "دقيقة")}
                    </span>
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
