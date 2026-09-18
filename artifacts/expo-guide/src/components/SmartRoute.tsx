import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock3,
  Footprints,
  MapPin,
  Navigation,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type RouteStop = {
  name: string;
  nameAr: string;
  area: string;
  areaAr: string;
  walk: string;
  position: string;
};

const routeStops: RouteStop[] = [
  {
    name: "Saudi Pavilion",
    nameAr: "الجناح السعودي",
    area: "Starting point",
    areaAr: "نقطة البداية",
    walk: "0 m",
    position: "left-[8%] top-[62%]",
  },
  {
    name: "Mobility District",
    nameAr: "منطقة التنقل",
    area: "Next stop",
    areaAr: "المحطة التالية",
    walk: "120 m",
    position: "left-[30%] top-[38%]",
  },
  {
    name: "Innovation Hub",
    nameAr: "مركز الابتكار",
    area: "Low queue",
    areaAr: "طابور قصير",
    walk: "210 m",
    position: "left-[57%] top-[20%]",
  },
  {
    name: "Central Dining",
    nameAr: "المطاعم المركزية",
    area: "Finish",
    areaAr: "النهاية",
    walk: "450 m",
    position: "left-[80%] top-[61%]",
  },
];

export function SmartRoute() {
  const { t, isRtl } = useI18n();
  const [selectedStop, setSelectedStop] = useState(0);
  const activeStop = routeStops[selectedStop];

  const metrics = [
    {
      label: t("Total Walking Distance", "إجمالي مسافة المشي"),
      value: "450 m",
      detail: t("Across 4 stops", "عبر 4 محطات"),
      icon: Footprints,
    },
    {
      label: t("Estimated Walking Time", "وقت المشي المتوقع"),
      value: "6 mins",
      detail: t("Comfortable pace", "بسرعة مريحة"),
      icon: Clock3,
    },
    {
      label: t("Crowd-Avoidance Savings", "التوفير بتجنب الازدحام"),
      value: "20 mins",
      detail: t("Compared with the busy route", "مقارنة بالمسار المزدحم"),
      icon: ShieldCheck,
    },
  ];

  return (
    <div
      className="container mx-auto flex-1 px-4 py-8 pb-24 md:pb-10"
      dir={isRtl ? "rtl" : "ltr"}
    >
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
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              {t("Route status", "حالة المسار")}
            </p>
            <p className="font-bold text-[#006C35]">
              {t("Low Queue Route", "مسار بطوابير قصيرة")}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="expo-card relative overflow-hidden p-5"
            >
              <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#006C35]/5" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold tabular-nums text-gray-900">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{metric.detail}</p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#006C35]/10 text-[#006C35]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="expo-card overflow-hidden p-4 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <RouteIcon className="h-5 w-5 text-[#006C35]" />
                {t("Optimized walking path", "مسار المشي المحسّن")}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {t("Tap a stop to inspect the route", "اضغط على محطة لاستعراض المسار")}
              </p>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full bg-[#006C35]/10 px-3 py-1.5 text-xs font-bold text-[#006C35] sm:inline-flex">
              <Zap className="h-3.5 w-3.5" />
              {t("20 min saved", "وفر 20 دقيقة")}
            </span>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[24px] border border-[#006C35]/10 bg-[#f4faf6]">
            <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(#d9ecdf_1px,transparent_1px),linear-gradient(90deg,#d9ecdf_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="absolute -left-16 top-10 h-44 w-44 rounded-full bg-[#4FB480]/20 blur-3xl" />
            <div className="absolute -right-10 bottom-2 h-48 w-48 rounded-full bg-[#08B0A0]/10 blur-3xl" />

            <svg
              viewBox="0 0 600 360"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label={t("Route map from Saudi Pavilion to Central Dining", "خريطة المسار من الجناح السعودي إلى المطاعم المركزية")}
            >
              <path
                d="M 58 225 C 145 185, 145 140, 220 145 S 290 95, 342 86 S 430 95, 500 220"
                fill="none"
                stroke="#d5e7da"
                strokeWidth="24"
                strokeLinecap="round"
              />
              <motion.path
                d="M 58 225 C 145 185, 145 140, 220 145 S 290 95, 342 86 S 430 95, 500 220"
                fill="none"
                stroke="#006C35"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="12 9"
                initial={{ strokeDashoffset: 120 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
              {routeStops.map((stop, index) => {
                const points = [
                  [58, 225],
                  [220, 145],
                  [342, 86],
                  [500, 220],
                ][index];
                return (
                  <g key={stop.name}>
                    <circle cx={points[0]} cy={points[1]} r="17" fill="white" stroke="#006C35" strokeWidth="4" />
                    <circle
                      cx={points[0]}
                      cy={points[1]}
                      r={selectedStop === index ? "8" : "5"}
                      fill={selectedStop === index ? "#006C35" : "#4FB480"}
                    />
                  </g>
                );
              })}
            </svg>

            {routeStops.map((stop, index) => (
              <button
                key={stop.name}
                type="button"
                onClick={() => setSelectedStop(index)}
                aria-pressed={selectedStop === index}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2.5 py-2 text-left shadow-sm transition-all",
                  stop.position,
                  selectedStop === index
                    ? "z-20 border-[#006C35] bg-[#006C35] text-white shadow-lg shadow-[#006C35]/20"
                    : "z-10 border-white/80 bg-white/90 text-gray-700 hover:-translate-x-1/2 hover:-translate-y-[calc(50%+2px)] hover:border-[#006C35]/30",
                )}
              >
                <span className="block max-w-[120px] whitespace-nowrap text-[10px] font-bold sm:text-xs">
                  {isRtl ? stop.nameAr : stop.name}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-[9px]",
                    selectedStop === index ? "text-white/75" : "text-gray-400",
                  )}
                >
                  {isRtl ? stop.areaAr : stop.area}
                </span>
              </button>
            ))}

            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm">
              <MapPin className="h-3.5 w-3.5 text-[#006C35]" />
              {t("Riyadh Expo grounds", "موقع إكسبو الرياض")}
            </div>
          </div>
        </section>

        <section className="expo-card p-4 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {t("Your route", "مسارك")}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {t("4 stops · updated just now", "4 محطات · تم التحديث الآن")}
              </p>
            </div>
            <span className="rounded-full bg-[#006C35]/10 px-3 py-1.5 text-xs font-bold text-[#006C35]">
              {t("Live", "مباشر")}
            </span>
          </div>

          <div className="space-y-1">
            {routeStops.map((stop, index) => {
              const isSelected = selectedStop === index;
              return (
                <div key={stop.name} className="relative">
                  {index < routeStops.length - 1 && (
                    <div className="absolute left-[19px] top-11 h-10 w-px bg-[#006C35]/20" />
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedStop(index)}
                    aria-pressed={isSelected}
                    className={cn(
                      "relative flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors",
                      isSelected ? "bg-[#006C35]/10" : "hover:bg-gray-50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 text-xs font-bold",
                        isSelected
                          ? "border-[#006C35]/20 bg-[#006C35] text-white"
                          : "border-[#006C35]/10 bg-white text-[#006C35]",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-gray-900">
                        {isRtl ? stop.nameAr : stop.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-gray-500">
                        {isRtl ? stop.areaAr : stop.area}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-gray-400">
                      {stop.walk}
                    </span>
                    <ArrowRight
                      className={cn(
                        "h-4 w-4 shrink-0 text-gray-300",
                        isRtl && "rotate-180",
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-[#006C35]/15 bg-[#f5fbf7] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#006C35] text-white">
                <Navigation className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#006C35]">
                  {t("Selected stop", "المحطة المحددة")}
                </p>
                <p className="mt-1 font-bold text-gray-900">
                  {isRtl ? activeStop.nameAr : activeStop.name}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  {selectedStop === 0
                    ? t(
                        "Start here and follow the green route to avoid the busiest paths.",
                        "ابدأ من هنا واتبع المسار الأخضر لتجنب الطرق الأكثر ازدحاماً.",
                      )
                    : selectedStop === routeStops.length - 1
                      ? t(
                          "You made it. Central Dining is the final stop on this optimized route.",
                          "لقد وصلت. المطاعم المركزية هي المحطة الأخيرة في هذا المسار المحسّن.",
                        )
                      : t(
                          `Continue ${activeStop.walk} to ${activeStop.name} for the next low-queue stop.`,
                          `تابع مسافة ${activeStop.walk} إلى ${activeStop.nameAr} للمحطة التالية ذات الطوابير القصيرة.`,
                        )}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}