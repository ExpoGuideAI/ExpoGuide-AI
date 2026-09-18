import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock3,
  Footprints,
  LocateFixed,
  MapPin,
  Navigation,
  Plus,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ExpoLocation = {
  id: string;
  name: string;
  nameAr: string;
  area: string;
  areaAr: string;
  point: [number, number];
  queue: "Start" | "Low Queue" | "Fast Track" | "Moderate";
  queueAr: string;
};

const locations: ExpoLocation[] = [
  { id: "saudi", name: "Saudi Pavilion", nameAr: "الجناح السعودي", area: "Kingdom District", areaAr: "منطقة المملكة", point: [58, 225], queue: "Start", queueAr: "البداية" },
  { id: "entrance", name: "Main Entrance", nameAr: "المدخل الرئيسي", area: "Welcome Plaza", areaAr: "ساحة الترحيب", point: [52, 298], queue: "Start", queueAr: "البداية" },
  { id: "hall-1", name: "Hall 1", nameAr: "القاعة 1", area: "Exhibition Halls", areaAr: "قاعات المعرض", point: [135, 264], queue: "Start", queueAr: "البداية" },
  { id: "opportunity", name: "Opportunity District", nameAr: "منطقة الفرص", area: "Opportunity District", areaAr: "منطقة الفرص", point: [94, 110], queue: "Start", queueAr: "البداية" },
  { id: "mobility", name: "Mobility District", nameAr: "منطقة التنقل", area: "Mobility District", areaAr: "منطقة التنقل", point: [220, 145], queue: "Low Queue", queueAr: "طابور قصير" },
  { id: "innovation", name: "Innovation Hub", nameAr: "مركز الابتكار", area: "Future Zone", areaAr: "منطقة المستقبل", point: [342, 86], queue: "Fast Track", queueAr: "مسار سريع" },
  { id: "dining", name: "Central Dining", nameAr: "المطاعم المركزية", area: "Dining Promenade", areaAr: "ممشى المطاعم", point: [500, 220], queue: "Low Queue", queueAr: "طابور قصير" },
  { id: "japan", name: "Japan Pavilion", nameAr: "الجناح الياباني", area: "International District", areaAr: "المنطقة الدولية", point: [430, 295], queue: "Moderate", queueAr: "ازدحام متوسط" },
];

const startOptions = locations.slice(0, 4);
const destinationOptions = locations.slice(4);

function calculateRoute(route: ExpoLocation[]) {
  let totalDistance = 0;
  const cumulativeDistances = route.map((location, index) => {
    if (index > 0) {
      const [x1, y1] = route[index - 1].point;
      const [x2, y2] = location.point;
      totalDistance += Math.round(Math.hypot(x2 - x1, y2 - y1) * 0.85);
    }
    return totalDistance;
  });

  return {
    cumulativeDistances,
    totalDistance,
    walkingTime: Math.max(1, Math.ceil(totalDistance / 75)),
    savings: Math.max(4, 8 + (route.length - 1) * 4),
  };
}

function queueClasses(queue: ExpoLocation["queue"]) {
  if (queue === "Fast Track") return "bg-[#e6f7f3] text-[#078576]";
  if (queue === "Moderate") return "bg-amber-50 text-amber-700";
  return "bg-[#006C35]/10 text-[#006C35]";
}

export function SmartRoute() {
  const { t, isRtl } = useI18n();
  const [startId, setStartId] = useState("saudi");
  const [destinationIds, setDestinationIds] = useState(["mobility", "innovation", "dining"]);
  const [generatedPlan, setGeneratedPlan] = useState({
    startId: "saudi",
    destinationIds: ["mobility", "innovation", "dining"],
    version: 0,
  });
  const [selectedStop, setSelectedStop] = useState(0);
  const [locationDetected, setLocationDetected] = useState(false);

  const routeStops = useMemo(
    () =>
      [generatedPlan.startId, ...generatedPlan.destinationIds]
        .map((id) => locations.find((location) => location.id === id))
        .filter((location): location is ExpoLocation => Boolean(location)),
    [generatedPlan],
  );
  const routeData = useMemo(() => calculateRoute(routeStops), [routeStops]);
  const activeStop = routeStops[selectedStop] ?? routeStops[0];
  const pathData = routeStops
    .map((stop, index) => `${index === 0 ? "M" : "L"} ${stop.point[0]} ${stop.point[1]}`)
    .join(" ");

  const toggleDestination = (id: string) => {
    setDestinationIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const generateRoute = () => {
    setGeneratedPlan({
      startId,
      destinationIds: [...destinationIds],
      version: generatedPlan.version + 1,
    });
    setSelectedStop(0);
  };

  const detectLocation = () => {
    setStartId("entrance");
    setLocationDetected(true);
  };

  const metrics = [
    {
      label: t("Total Walking Distance", "إجمالي مسافة المشي"),
      value: `${routeData.totalDistance} m`,
      detail: t(`Across ${routeStops.length} stops`, `عبر ${routeStops.length} محطات`),
      icon: Footprints,
    },
    {
      label: t("Estimated Walking Time", "وقت المشي المتوقع"),
      value: t(`${routeData.walkingTime} mins`, `${routeData.walkingTime} دقائق`),
      detail: t("Comfortable pace", "بسرعة مريحة"),
      icon: Clock3,
    },
    {
      label: t("Crowd-Avoidance Savings", "التوفير بتجنب الازدحام"),
      value: t(`${routeData.savings} mins`, `${routeData.savings} دقيقة`),
      detail: t("Compared with the busy route", "مقارنة بالمسار المزدحم"),
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="container mx-auto flex-1 px-4 py-8 pb-24 md:pb-10" dir={isRtl ? "rtl" : "ltr"}>
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006C35]/10 px-3 py-1.5 text-xs font-bold text-[#006C35]">
              <Sparkles className="h-3.5 w-3.5" />
              {t("ExpoGuide optimization", "تحسينات إكسبو جايد")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#006C35]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#006C35]">
              <Check className="h-3.5 w-3.5" />
              {t("Optimal Path", "المسار الأمثل")}
            </span>
          </div>
          <h1 className="relative inline-block text-4xl font-bold text-gray-900 md:text-5xl">
            {t("Smart Route", "المسار الذكي")}
            <span className="absolute -bottom-2 left-0 h-1 w-2/3 rounded-full bg-gradient-to-r from-[#006C35] to-[#4FB480]" />
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg">
            {t(
              "A crowd-aware walking plan that connects the places you want to see with less waiting along the way.",
              "خطة مشي تراعي الازدحام وتربط بين الأماكن التي تريد زيارتها مع وقت انتظار أقل.",
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[#006C35]/15 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006C35]/10 text-[#006C35]">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">{t("Route status", "حالة المسار")}</p>
            <p className="font-bold text-[#006C35]">{t("Low Queue Route", "مسار بطوابير قصيرة")}</p>
          </div>
        </div>
      </div>

      <section className="expo-card relative mb-8 overflow-hidden border border-[#006C35]/15 bg-gradient-to-br from-white via-[#f8fcf9] to-[#eaf7ef] p-5 md:p-7">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#4FB480]/10 blur-2xl" />
        <div className="relative">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#006C35]">{t("Route planner", "مخطط المسار")}</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">{t("Where would you like to go?", "إلى أين تود الذهاب؟")}</h2>
            <p className="mt-1 text-sm text-gray-500">{t("Choose your starting point and add stops in the order you want to visit them.", "اختر نقطة البداية وأضف المحطات بالترتيب الذي ترغب في زيارتها.")}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <label htmlFor="route-start" className="mb-2 block text-sm font-bold text-gray-800">{t("Starting location", "موقع البداية")}</label>
              <div className="flex items-center rounded-2xl border border-[#006C35]/20 bg-white px-4 transition focus-within:border-[#006C35] focus-within:ring-4 focus-within:ring-[#006C35]/10">
                <MapPin className="h-5 w-5 shrink-0 text-[#006C35]" />
                <select
                  id="route-start"
                  value={startId}
                  onChange={(event) => {
                    setStartId(event.target.value);
                    setLocationDetected(false);
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3.5 font-semibold text-gray-800 outline-none"
                >
                  {startOptions.map((location) => <option key={location.id} value={location.id}>{isRtl ? location.nameAr : location.name}</option>)}
                </select>
              </div>
              <button type="button" onClick={detectLocation} className="mt-3 inline-flex items-center gap-2 rounded-xl px-1 py-1 text-sm font-bold text-[#006C35] transition hover:text-[#005229]">
                <LocateFixed className="h-4 w-4" />
                {locationDetected ? t("Location detected", "تم تحديد الموقع") : t("Detect My Location", "تحديد موقعي")}
                {locationDetected && <Check className="h-4 w-4" />}
              </button>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-gray-800">{t("Destinations", "الوجهات")}</p>
              <div className="min-h-[92px] rounded-2xl border border-[#006C35]/20 bg-white p-3">
                <div className="flex flex-wrap gap-2">
                  {destinationOptions.map((location) => {
                    const selected = destinationIds.includes(location.id);
                    return (
                      <button
                        key={location.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleDestination(location.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-bold transition",
                          selected
                            ? "border-[#006C35] bg-[#006C35] text-white shadow-sm"
                            : "border-[#006C35]/15 bg-[#f5fbf7] text-[#006C35] hover:border-[#006C35]/40",
                        )}
                      >
                        {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        {isRtl ? location.nameAr : location.name}
                        {selected && <X className="h-3.5 w-3.5 opacity-75" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">{t(`${destinationIds.length} destinations selected · tap a pill to add or remove`, `تم اختيار ${destinationIds.length} وجهات · اضغط للإضافة أو الإزالة`)}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              disabled={destinationIds.length === 0}
              onClick={generateRoute}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006C35] px-6 py-4 font-bold text-white shadow-lg shadow-[#006C35]/20 transition hover:bg-[#00592d] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
            >
              <Sparkles className="h-5 w-5" />
              {t("Generate Optimal Route", "إنشاء المسار الأمثل")}
              <ArrowRight className={cn("h-4 w-4", isRtl && "rotate-180")} />
            </motion.button>
          </div>
        </div>
      </section>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div key={`${generatedPlan.version}-${metric.label}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="expo-card relative overflow-hidden p-5">
              <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#006C35]/5" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400">{metric.label}</p>
                  <p className="mt-2 text-3xl font-bold tabular-nums text-gray-900">{metric.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{metric.detail}</p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#006C35]/10 text-[#006C35]"><Icon className="h-5 w-5" /></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="expo-card overflow-hidden p-4 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900"><RouteIcon className="h-5 w-5 text-[#006C35]" />{t("Optimized walking path", "مسار المشي المحسّن")}</h2>
              <p className="mt-1 text-sm text-gray-500">{t("Tap a stop to inspect the route", "اضغط على محطة لاستعراض المسار")}</p>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full bg-[#006C35]/10 px-3 py-1.5 text-xs font-bold text-[#006C35] sm:inline-flex"><Zap className="h-3.5 w-3.5" />{t(`${routeData.savings} min saved`, `وفر ${routeData.savings} دقيقة`)}</span>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[24px] border border-[#006C35]/10 bg-[#f4faf6]">
            <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(#d9ecdf_1px,transparent_1px),linear-gradient(90deg,#d9ecdf_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="absolute -left-16 top-10 h-44 w-44 rounded-full bg-[#4FB480]/20 blur-3xl" />
            <div className="absolute -right-10 bottom-2 h-48 w-48 rounded-full bg-[#08B0A0]/10 blur-3xl" />
            <svg viewBox="0 0 600 360" className="absolute inset-0 h-full w-full" role="img" aria-label={t("Generated Expo walking route", "مسار المشي المُنشأ في إكسبو")}>
              <path d={pathData} fill="none" stroke="#d5e7da" strokeWidth="24" strokeLinejoin="round" strokeLinecap="round" />
              <motion.path key={generatedPlan.version} d={pathData} fill="none" stroke="#006C35" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="12 9" initial={{ pathLength: 0, strokeDashoffset: 120 }} animate={{ pathLength: 1, strokeDashoffset: 0 }} transition={{ pathLength: { duration: 0.8 }, strokeDashoffset: { duration: 5, repeat: Infinity, ease: "linear" } }} />
              {routeStops.map((stop, index) => (
                <g key={stop.id}>
                  <circle cx={stop.point[0]} cy={stop.point[1]} r="17" fill="white" stroke="#006C35" strokeWidth="4" />
                  <circle cx={stop.point[0]} cy={stop.point[1]} r={selectedStop === index ? "8" : "5"} fill={selectedStop === index ? "#006C35" : "#4FB480"} />
                </g>
              ))}
            </svg>
            {routeStops.map((stop, index) => (
              <button
                key={stop.id}
                type="button"
                onClick={() => setSelectedStop(index)}
                aria-pressed={selectedStop === index}
                style={{ left: `${(stop.point[0] / 600) * 100}%`, top: `${(stop.point[1] / 360) * 100}%` }}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2.5 py-2 text-left shadow-sm transition-all",
                  selectedStop === index ? "z-20 border-[#006C35] bg-[#006C35] text-white shadow-lg shadow-[#006C35]/20" : "z-10 border-white/80 bg-white/90 text-gray-700 hover:border-[#006C35]/30",
                )}
              >
                <span className="block max-w-[120px] whitespace-nowrap text-[10px] font-bold sm:text-xs">{isRtl ? stop.nameAr : stop.name}</span>
                <span className={cn("mt-0.5 block text-[9px]", selectedStop === index ? "text-white/75" : "text-gray-400")}>{index === 0 ? t("Starting point", "نقطة البداية") : isRtl ? stop.queueAr : stop.queue}</span>
              </button>
            ))}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm"><MapPin className="h-3.5 w-3.5 text-[#006C35]" />{t("Riyadh Expo grounds", "موقع إكسبو الرياض")}</div>
          </div>
        </section>

        <section className="expo-card p-4 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t("Your route", "مسارك")}</h2>
              <p className="mt-1 text-sm text-gray-500">{t(`${routeStops.length} stops · updated just now`, `${routeStops.length} محطات · تم التحديث الآن`)}</p>
            </div>
            <span className="rounded-full bg-[#006C35]/10 px-3 py-1.5 text-xs font-bold text-[#006C35]">{t("Live", "مباشر")}</span>
          </div>
          <div className="space-y-1">
            {routeStops.map((stop, index) => {
              const isSelected = selectedStop === index;
              return (
                <div key={stop.id} className="relative">
                  {index < routeStops.length - 1 && <div className="absolute left-[19px] top-11 h-10 w-px bg-[#006C35]/20" />}
                  <button type="button" onClick={() => setSelectedStop(index)} aria-pressed={isSelected} className={cn("relative flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors", isSelected ? "bg-[#006C35]/10" : "hover:bg-gray-50")}>
                    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 text-xs font-bold", isSelected ? "border-[#006C35]/20 bg-[#006C35] text-white" : "border-[#006C35]/10 bg-white text-[#006C35]")}>{index + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-gray-900">{isRtl ? stop.nameAr : stop.name}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                        <span>{isRtl ? stop.areaAr : stop.area}</span>
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", queueClasses(stop.queue))}>{isRtl ? stop.queueAr : stop.queue}</span>
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold tabular-nums text-gray-400">{routeData.cumulativeDistances[index]} m</span>
                    <ArrowRight className={cn("h-4 w-4 shrink-0 text-gray-300", isRtl && "rotate-180")} />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-2xl border border-[#006C35]/15 bg-[#f5fbf7] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#006C35] text-white"><Navigation className="h-4 w-4" /></div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#006C35]">{t("Selected stop", "المحطة المحددة")}</p>
                <p className="mt-1 font-bold text-gray-900">{isRtl ? activeStop.nameAr : activeStop.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  {selectedStop === 0
                    ? t("Start here and follow the green route to avoid the busiest paths.", "ابدأ من هنا واتبع المسار الأخضر لتجنب الطرق الأكثر ازدحاماً.")
                    : t(`Continue to ${activeStop.name}. The route currently shows ${activeStop.queue.toLowerCase()} access.`, `تابع إلى ${activeStop.nameAr}. يعرض المسار حالياً ${activeStop.queueAr}.`)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}