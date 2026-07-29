import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useGetQueueStatus } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
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
      case "increasing": return <TrendingUp className="w-4 h-4 text-expo-orange" />;
      case "decreasing": return <TrendingDown className="w-4 h-4 text-expo-green" />;
      case "stable": 
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const crowdColor = {
    low: "bg-expo-green",
    medium: "bg-expo-yellow",
    high: "bg-expo-orange"
  };
  
  const crowdText = {
    low: "text-expo-green",
    medium: "text-expo-yellow",
    high: "text-expo-orange"
  };

  return (
    <div className="container mx-auto px-4 py-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
            {t("Live Queue", "الطوابير المباشرة")}
            {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-expo-teal" />}
          </h1>
          <p className="text-muted-foreground">
            {t("Real-time wait times across the Expo. Refreshes every 30 seconds.", "أوقات الانتظار المباشرة في أنحاء الإكسبو. يتم التحديث كل 30 ثانية.")}
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground text-sm">
                <th className={cn("p-4 font-medium", isRtl ? "text-right" : "text-left")}>{t("Pavilion", "الجناح")}</th>
                <th className="p-4 font-medium text-center">{t("Wait Time", "وقت الانتظار")}</th>
                <th className="p-4 font-medium">{t("Crowd Level", "مستوى الازدحام")}</th>
                <th className="p-4 font-medium text-center">{t("Trend", "الاتجاه")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="p-4"><Skeleton className="h-6 w-48" /></td>
                    <td className="p-4"><Skeleton className="h-6 w-16 mx-auto" /></td>
                    <td className="p-4"><Skeleton className="h-6 w-32" /></td>
                    <td className="p-4"><Skeleton className="h-6 w-8 mx-auto" /></td>
                  </tr>
                ))
              ) : (
                sortedQueue.map((item, index) => (
                  <motion.tr 
                    key={item.pavilionId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 font-medium text-white">
                      {item.pavilionName}
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 font-bold">
                        <Clock className="w-4 h-4 text-expo-teal" />
                        {item.waitMinutes}m
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all duration-1000", crowdColor[item.crowdLevel as keyof typeof crowdColor] || crowdColor.low)}
                            style={{ width: `${item.crowdPercent}%` }}
                          />
                        </div>
                        <span className={cn("text-xs font-medium uppercase", crowdText[item.crowdLevel as keyof typeof crowdText])}>
                          {item.crowdLevel} ({item.crowdPercent}%)
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center flex justify-center">
                      <div className="p-1.5 rounded-full bg-white/5 border border-white/10">
                        {getTrendIcon(item.trend)}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
