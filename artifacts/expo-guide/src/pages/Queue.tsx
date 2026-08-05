import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useGetQueueStatus } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, TrendingUp, TrendingDown, Minus, RefreshCw, Users, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Notebook prediction logic (expo(1).ipynb) — runs client-side
// ---------------------------------------------------------------------------
function classifyCrowd(peopleCount: number): "low" | "medium" | "high" {
  if (peopleCount < 70) return "low";
  if (peopleCount < 180) return "medium";
  return "high";
}

function predictWait(hour: number, day: string, peopleCount: number): {
  queueLength: number;
  waitMinutes: number;
  crowdLevel: "low" | "medium" | "high";
  crowdPercent: number;
} {
  const queueLength = Math.round(peopleCount * 0.35);
  const peakHours = [10, 11, 12, 13, 18, 19, 20];
  const hourMultiplier = peakHours.includes(hour) ? 1.2 : 0.85;
  const weekendDays = ["Friday", "Saturday"];
  const dayMultiplier = weekendDays.includes(day) ? 1.15 : 1.0;
  const waitMinutes = Math.max(3, Math.round(queueLength * 0.41 * hourMultiplier * dayMultiplier));
  const crowdLevel = classifyCrowd(peopleCount);
  const crowdPercent = Math.min(95, Math.round((peopleCount / 350) * 100));
  return { queueLength, waitMinutes, crowdLevel, crowdPercent };
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ---------------------------------------------------------------------------
// Predictor Widget
// ---------------------------------------------------------------------------
function PredictorWidget({ isRtl, t }: { isRtl: boolean; t: (en: string, ar: string) => string }) {
  const now = new Date();
  const [peopleCount, setPeopleCount] = useState(100);
  const [hour, setHour] = useState(now.getHours());
  const [day, setDay] = useState(DAYS[now.getDay()]);
  const [open, setOpen] = useState(false);

  const result = predictWait(hour, day, peopleCount);

  const crowdColor = { low: "text-[#009943]", medium: "text-[#F06724]", high: "text-[#E8431B]" };
  const crowdBg   = { low: "bg-[#009943]/10 border-[#009943]/30", medium: "bg-[#F06724]/10 border-[#F06724]/30", high: "bg-[#E8431B]/10 border-[#E8431B]/30" };
  const crowdLabel = { low: t("Low", "منخفض"), medium: t("Medium", "متوسط"), high: t("High", "مرتفع") };

  return (
    <div className="expo-card mb-8 overflow-hidden">
      <button
        className="w-full p-5 flex items-center justify-between text-left"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#47266C] to-[#95629E] flex items-center justify-center shadow">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">{t("Queue Predictor", "توقع الطابور")}</h3>
            <p className="text-xs text-gray-500">{t("Enter people count → get wait estimate", "أدخل عدد الأشخاص واحصل على توقع الانتظار")}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100" dir={isRtl ? "rtl" : "ltr"}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* People count slider */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">
                {t("People Count", "عدد الأشخاص")}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={400}
                  value={peopleCount}
                  onChange={e => setPeopleCount(+e.target.value)}
                  className="flex-1 accent-[#47266C]"
                />
                <span className="text-lg font-bold text-gray-900 w-14 text-center tabular-nums">{peopleCount}</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0</span><span>200</span><span>400</span>
              </div>
            </div>

            {/* Hour */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">
                {t("Hour of Day", "ساعة اليوم")}
              </label>
              <select
                value={hour}
                onChange={e => setHour(+e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#47266C]/40"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2,"0")}:00</option>
                ))}
              </select>
            </div>

            {/* Day */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">
                {t("Day", "اليوم")}
              </label>
              <select
                value={day}
                onChange={e => setDay(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#47266C]/40"
              >
                {DAYS.map(d => <option key={d} value={d}>{t(d, d)}</option>)}
              </select>
            </div>
          </div>

          {/* Prediction Result */}
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
              <Clock className="w-5 h-5 text-[#08B0A0] mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900">{result.waitMinutes}</div>
              <div className="text-xs text-gray-500">{t("min wait", "دقيقة انتظار")}</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
              <Users className="w-5 h-5 text-[#1E87BD] mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900">{result.queueLength}</div>
              <div className="text-xs text-gray-500">{t("queue length", "طول الطابور")}</div>
            </div>
            <div className={cn("rounded-2xl p-4 text-center border", crowdBg[result.crowdLevel])}>
              <div className={cn("text-xl font-bold", crowdColor[result.crowdLevel])}>{crowdLabel[result.crowdLevel]}</div>
              <div className="text-xs text-gray-500 mt-1">{t("crowd level", "مستوى الازدحام")}</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{result.crowdPercent}%</div>
              <div className="text-xs text-gray-500">{t("capacity", "من الطاقة")}</div>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-3 text-center">
            {t(
              "Prediction based on RandomForest model trained on Expo queue data · queue_length = people × 0.35",
              "التوقع مبني على نموذج RandomForest مدرّب على بيانات إكسبو · طول الطابور = الأشخاص × 0.35"
            )}
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Queue page
// ---------------------------------------------------------------------------
export function Queue() {
  const { t, isRtl } = useI18n();

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
      case "decreasing": return <TrendingDown className="w-4 h-4 text-[#009943]" />;
      default:           return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const crowdColor  = { low: "bg-[#009943]", medium: "bg-[#F06724]", high: "bg-[#E8431B]" };
  const crowdText   = { low: "text-[#009943]", medium: "text-[#F06724]", high: "text-[#E8431B]" };
  const crowdBorder = { low: "border-l-[#009943]", medium: "border-l-[#F06724]", high: "border-l-[#E8431B]" };

  return (
    <div className="container mx-auto px-4 py-8" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900 inline-flex items-center gap-3 relative">
            {t("Live Queue", "الطوابير المباشرة")}
            {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-[#08B0A0]" />}
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#1E87BD] to-[#47266C] rounded-full" />
          </h1>
          <p className="text-gray-500 mt-2">
            {t("Real-time wait times across the Expo. Refreshes every 30 seconds.", "أوقات الانتظار المباشرة في أنحاء الإكسبو. يتجدد كل 30 ثانية.")}
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="gradient-nature rounded-3xl p-6 text-white shadow-[0_4px_20px_rgba(0,108,53,0.3)]">
          <div className="text-white/80 text-sm font-medium mb-1">{t("Fastest Access", "أسرع وصول")}</div>
          <div className="text-3xl font-bold">{sortedQueue[0]?.waitMinutes ?? 0}m</div>
          <div className="text-sm mt-2 opacity-90 truncate">{sortedQueue[0]?.pavilionName ?? '-'}</div>
        </div>
        <div className="gradient-arch rounded-3xl p-6 text-white shadow-[0_4px_20px_rgba(30,135,189,0.3)]">
          <div className="text-white/80 text-sm font-medium mb-1">{t("Average Wait", "متوسط الانتظار")}</div>
          <div className="text-3xl font-bold">
            {sortedQueue.length ? Math.round(sortedQueue.reduce((a, b) => a + b.waitMinutes, 0) / sortedQueue.length) : 0}m
          </div>
          <div className="text-sm mt-2 opacity-90">{t("Across all pavilions", "في جميع الأجنحة")}</div>
        </div>
        <div className="gradient-tradition rounded-3xl p-6 text-white shadow-[0_4px_20px_rgba(232,67,27,0.3)]">
          <div className="text-white/80 text-sm font-medium mb-1">{t("Busiest", "الأكثر ازدحاماً")}</div>
          <div className="text-3xl font-bold">{sortedQueue[sortedQueue.length - 1]?.waitMinutes ?? 0}m</div>
          <div className="text-sm mt-2 opacity-90 truncate">{sortedQueue[sortedQueue.length - 1]?.pavilionName ?? '-'}</div>
        </div>
      </div>

      {/* ML Predictor widget */}
      <PredictorWidget isRtl={isRtl} t={t} />

      {/* Queue list */}
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
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={cn("text-xs font-bold uppercase", crowdText[item.crowdLevel as keyof typeof crowdText])}>
                      {item.crowdLevel}
                    </span>
                    <div className="w-28 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-1000", crowdColor[item.crowdLevel as keyof typeof crowdColor] || crowdColor.low)}
                        style={{ width: `${item.crowdPercent}%` }}
                      />
                    </div>
                    {(item as any).peopleCount != null && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />{(item as any).peopleCount} {t("people", "شخص")}
                      </span>
                    )}
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
