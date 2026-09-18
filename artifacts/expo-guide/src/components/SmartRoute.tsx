import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bath,
  Building2,
  Check,
  Clock3,
  Footprints,
  LocateFixed,
  MapPin,
  Navigation,
  Plus,
  Route as RouteIcon,
  Search,
  ShieldCheck,
  Sparkles,
  Utensils,
  Info,
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
const quickSuggestionIds = ["saudi", "japan", "dining"];
const mapHubs = [
  { id: "hub-pavilions", type: "pavilion", label: "Pavilion Hub", labelAr: "مركز الأجنحة", status: "Queue: 5 mins", statusAr: "الطابور: 5 دقائق", point: [275, 268] as [number, number] },
  { id: "hub-dining", type: "dining", label: "Dining Hall B", labelAr: "قاعة المطاعم ب", status: "Seats available", statusAr: "مقاعد متاحة", point: [516, 152] as [number, number] },
  { id: "hub-restroom", type: "restroom", label: "Restrooms", labelAr: "دورات المياه", status: "Open · No wait", statusAr: "مفتوح · بدون انتظار", point: [365, 282] as [number, number] },
  { id: "hub-info", type: "info", label: "Info Desk", labelAr: "مكتب المعلومات", status: "Fast Track Available", statusAr: "المسار السريع متاح", point: [168, 96] as [number, number] },
] as const;

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
  const [searchTerm, setSearchTerm] = useState("");
  const [customLocations, setCustomLocations] = useState<ExpoLocation[]>([]);
  const [activeHubId, setActiveHubId] = useState<string | null>(null);

  const allLocations = useMemo(() => [...locations, ...customLocations], [customLocations]);

  const routeStops = useMemo(
    () =>
      [generatedPlan.startId, ...generatedPlan.destinationIds]
        .map((id) => allLocations.find((location) => location.id === id))
        .filter((location): location is ExpoLocation => Boolean(location)),
    [allLocations, generatedPlan],
  );
  const routeData = useMemo(() => calculateRoute(routeStops), [routeStops]);
  const activeStop = routeStops[selectedStop] ?? routeStops[0];
  const pathData = routeStops
    .map((stop, index) => `${index === 0 ? "M" : "L"} ${stop.point[0]} ${stop.point[1]}`)
    .join(" ");
  const nextStopIndex = Math.min(selectedStop + 1, routeStops.length - 1);
  const nextStop = routeStops[nextStopIndex];
  const guidanceDistance = Math.max(
    0,
    routeData.cumulativeDistances[nextStopIndex] - routeData.cumulativeDistances[selectedStop],
  );
  const concourseName = selectedStop % 2 === 0
    ? t("North Concourse", "الممر الشمالي")
    : t("Central Promenade", "الممشى المركزي");

  const filteredLocations = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase();
    if (!query) return [];
    return allLocations
      .filter(
        (location) =>
          !destinationIds.includes(location.id) &&
          [location.name, location.nameAr, location.area, location.areaAr]
            .some((value) => value.toLocaleLowerCase().includes(query)),
      )
      .slice(0, 5);
  }, [allLocations, destinationIds, searchTerm]);

  const addDestination = (id: string) => {
    setDestinationIds((current) => current.includes(id) ? current : [...current, id]);
    setSearchTerm("");
  };

  const removeDestination = (id: string) => {
    setDestinationIds((current) => current.filter((item) => item !== id));
  };

  const addSearchDestination = () => {
    const value = searchTerm.trim();
    if (!value) return;

    const existingLocation = allLocations.find(
      (location) =>
        location.name.toLocaleLowerCase() === value.toLocaleLowerCase() ||
        location.nameAr.toLocaleLowerCase() === value.toLocaleLowerCase(),
    );
    if (existingLocation) {
      addDestination(existingLocation.id);
      return;
    }

    const customIndex = customLocations.length;
    const customLocation: ExpoLocation = {
      id: `custom-${customIndex}-${value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: value,
      nameAr: value,
      area: "Custom stop",
      areaAr: "محطة مخصصة",
      point: [
        145 + ((customIndex * 97) % 315),
        95 + ((customIndex * 73) % 185),
      ],
      queue: "Moderate",
      queueAr: "ازدحام متوسط",
    };
    setCustomLocations((current) => [...current, customLocation]);
    setDestinationIds((current) => [...current, customLocation.id]);
    setSearchTerm("");
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
              <div className="relative">
                <div className="flex items-center rounded-2xl border border-[#006C35]/20 bg-white px-3 transition focus-within:border-[#006C35] focus-within:ring-4 focus-within:ring-[#006C35]/10">
                  <Search className="h-5 w-5 shrink-0 text-[#006C35]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSearchDestination();
                      }
                    }}
                    placeholder={t(
                      "Type a pavilion, hall, booth, or custom stop...",
                      "اكتب جناحاً أو قاعة أو منصة أو محطة مخصصة...",
                    )}
                    className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    aria-label={t("Search or add a destination", "ابحث عن وجهة أو أضفها")}
                  />
                  <button
                    type="button"
                    onClick={addSearchDestination}
                    disabled={!searchTerm.trim()}
                    className="rounded-xl bg-[#006C35] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#00592d] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t("Add", "إضافة")}
                  </button>
                </div>

                {filteredLocations.length > 0 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-2xl border border-[#006C35]/15 bg-white p-1.5 shadow-xl">
                    {filteredLocations.map((location) => (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => addDestination(location.id)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#f2f9f4]"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#006C35]/10 text-[#006C35]">
                          <MapPin className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-gray-800">{isRtl ? location.nameAr : location.name}</span>
                          <span className="block truncate text-xs text-gray-500">{isRtl ? location.areaAr : location.area}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 min-h-[48px] rounded-2xl border border-[#006C35]/10 bg-[#f7fbf8] p-2.5">
                <div className="flex flex-wrap gap-2">
                  {destinationIds.map((id) => {
                    const location = allLocations.find((item) => item.id === id);
                    if (!location) return null;
                    return (
                      <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-[#006C35] py-2 pl-3 pr-2 text-sm font-bold text-white shadow-sm">
                        {isRtl ? location.nameAr : location.name}
                        <button
                          type="button"
                          onClick={() => removeDestination(id)}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/30"
                          aria-label={t(`Remove ${location.name}`, `إزالة ${location.nameAr}`)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    );
                  })}
                  {destinationIds.length === 0 && (
                    <span className="px-1 py-1.5 text-xs text-gray-400">{t("No destinations selected yet", "لم يتم اختيار وجهات بعد")}</span>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  {t("Popular Quick-Add Suggestions", "اقتراحات شائعة للإضافة السريعة")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestionIds.map((id) => {
                    const location = locations.find((item) => item.id === id)!;
                    const selected = destinationIds.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        disabled={selected}
                        onClick={() => addDestination(id)}
                        className="inline-flex items-center gap-1 rounded-full border border-[#006C35]/15 bg-white px-2.5 py-1.5 text-xs font-bold text-[#006C35] transition hover:border-[#006C35]/40 hover:bg-[#f2f9f4] disabled:cursor-default disabled:opacity-40"
                      >
                        <Plus className="h-3 w-3" />
                        {isRtl ? location.nameAr : location.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">{t(`${destinationIds.length} destinations selected`, `تم اختيار ${destinationIds.length} وجهات`)}</p>
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

          <div className="relative min-h-[430px] overflow-hidden rounded-[24px] border border-[#006C35]/15 bg-[#edf4ec] shadow-inner">
            <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label={t("Interactive Expo venue masterplan", "المخطط التفاعلي لموقع إكسبو")}>
              <defs>
                <linearGradient id="venueGround" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f7f2e6" />
                  <stop offset="52%" stopColor="#eef5e9" />
                  <stop offset="100%" stopColor="#e3f1e8" />
                </linearGradient>
                <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#244b35" floodOpacity="0.15" />
                </filter>
              </defs>

              <rect width="600" height="360" fill="url(#venueGround)" />
              <path d="M -20 325 C 95 278, 168 330, 270 290 S 450 276, 635 322 L 635 380 L -20 380 Z" fill="#b9ddd6" opacity="0.72" />
              <path d="M -10 52 C 100 18, 175 43, 256 25 S 430 8, 615 48" fill="none" stroke="#d7e8cf" strokeWidth="34" opacity="0.8" />

              <g opacity="0.95">
                <path d="M 28 225 L 530 220" fill="none" stroke="#fffdf7" strokeWidth="32" strokeLinecap="round" />
                <path d="M 58 298 L 135 264 L 220 145 L 342 86 L 500 220 L 430 295" fill="none" stroke="#fffdf7" strokeWidth="26" strokeLinejoin="round" strokeLinecap="round" />
                <path d="M 94 110 L 220 145 L 275 268 L 365 282" fill="none" stroke="#fffdf7" strokeWidth="22" strokeLinejoin="round" strokeLinecap="round" />
                <path d="M 342 86 L 516 152 L 500 220" fill="none" stroke="#fffdf7" strokeWidth="20" strokeLinejoin="round" strokeLinecap="round" />
              </g>
              <g fill="none" stroke="#c8d7c5" strokeWidth="1.5" strokeDasharray="4 7" opacity="0.9">
                <path d="M 28 225 L 530 220" fill="none" />
                <path d="M 58 298 L 135 264 L 220 145 L 342 86 L 500 220 L 430 295" fill="none" />
                <path d="M 94 110 L 220 145 L 275 268 L 365 282" fill="none" />
              </g>

              <g filter="url(#mapShadow)">
                <path d="M 20 72 L 122 54 L 150 132 L 42 150 Z" fill="#dce9cf" stroke="#b9cfaa" />
                <path d="M 178 74 L 298 48 L 319 125 L 199 145 Z" fill="#d8eee3" stroke="#acd2bd" />
                <path d="M 365 34 L 540 62 L 526 137 L 357 112 Z" fill="#e6dfc8" stroke="#d2c59d" />
                <path d="M 245 230 L 392 218 L 410 323 L 238 331 Z" fill="#dcead8" stroke="#b7cfb0" />
                <path d="M 445 242 L 565 225 L 578 316 L 452 330 Z" fill="#e9dfd2" stroke="#d2bfa9" />
              </g>

              <g fill="#f9fbf6" stroke="#9fbea7" strokeWidth="1">
                <rect x="42" y="86" width="36" height="24" rx="6" />
                <rect x="88" y="75" width="39" height="28" rx="7" />
                <rect x="189" y="90" width="43" height="28" rx="7" />
                <rect x="242" y="72" width="40" height="31" rx="8" />
                <rect x="388" y="61" width="45" height="31" rx="8" />
                <rect x="446" y="75" width="51" height="30" rx="8" />
                <rect x="265" y="248" width="42" height="30" rx="7" />
                <rect x="321" y="236" width="47" height="34" rx="8" />
                <rect x="464" y="265" width="43" height="29" rx="7" />
                <rect x="518" y="251" width="39" height="32" rx="7" />
              </g>

              <g fontFamily="Arial, sans-serif" textAnchor="middle">
                <text x="82" y="128" fontSize="9" fontWeight="700" fill="#58715d">{t("OPPORTUNITY", "الفرص")}</text>
                <text x="245" y="120" fontSize="9" fontWeight="700" fill="#3e7860">{t("MOBILITY", "التنقل")}</text>
                <text x="444" y="123" fontSize="9" fontWeight="700" fill="#7b704d">{t("INNOVATION", "الابتكار")}</text>
                <text x="323" y="309" fontSize="9" fontWeight="700" fill="#58715d">{t("PAVILION PARK", "حديقة الأجنحة")}</text>
                <text x="511" y="310" fontSize="9" fontWeight="700" fill="#80664e">{t("DINING", "المطاعم")}</text>
                <text x="302" y="211" fontSize="8" fontWeight="700" fill="#8a9a8b">{t("CENTRAL PROMENADE", "الممشى المركزي")}</text>
              </g>

              <path d={pathData} fill="none" stroke="#ffffff" strokeWidth="18" strokeLinejoin="round" strokeLinecap="round" opacity="0.94" />
              <motion.path
                key={generatedPlan.version}
                d={pathData}
                fill="none"
                stroke="#006C35"
                strokeWidth="7"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray="13 9"
                initial={{ pathLength: 0, strokeDashoffset: 120 }}
                animate={{ pathLength: 1, strokeDashoffset: 0 }}
                transition={{ pathLength: { duration: 0.9 }, strokeDashoffset: { duration: 5, repeat: Infinity, ease: "linear" } }}
              />
              {routeStops.map((stop, index) => (
                <g key={stop.id}>
                  {selectedStop === index && (
                    <motion.circle
                      cx={stop.point[0]}
                      cy={stop.point[1]}
                      r="18"
                      fill="none"
                      stroke="#08a35a"
                      strokeWidth="3"
                      initial={{ opacity: 0.8, scale: 0.7 }}
                      animate={{ opacity: 0, scale: 1.5 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ transformOrigin: `${stop.point[0]}px ${stop.point[1]}px` }}
                    />
                  )}
                  <circle cx={stop.point[0]} cy={stop.point[1]} r="13" fill={selectedStop === index ? "#006C35" : "#ffffff"} stroke="#006C35" strokeWidth="3" />
                  <text x={stop.point[0]} y={stop.point[1] + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={selectedStop === index ? "#ffffff" : "#006C35"}>{index + 1}</text>
                </g>
              ))}
            </svg>

            {routeStops.map((stop, index) => (
              <button
                key={stop.id}
                type="button"
                onClick={() => {
                  setSelectedStop(index);
                  setActiveHubId(null);
                }}
                aria-pressed={selectedStop === index}
                aria-label={t(`Focus ${stop.name}`, `عرض ${stop.nameAr}`)}
                style={{ left: `${(stop.point[0] / 600) * 100}%`, top: `${(stop.point[1] / 360) * 100}%` }}
                className="absolute z-20 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent"
              />
            ))}

            {mapHubs.map((hub) => {
              const HubIcon = hub.type === "dining" ? Utensils : hub.type === "restroom" ? Bath : hub.type === "info" ? Info : Building2;
              const isOpen = activeHubId === hub.id;
              return (
                <div
                  key={hub.id}
                  className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(hub.point[0] / 600) * 100}%`, top: `${(hub.point[1] / 360) * 100}%` }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveHubId(isOpen ? null : hub.id)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-md transition hover:scale-110",
                      isOpen ? "bg-[#006C35] text-white" : "bg-white text-[#006C35]",
                    )}
                    aria-expanded={isOpen}
                    aria-label={isRtl ? hub.labelAr : hub.label}
                  >
                    <HubIcon className="h-4 w-4" />
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute bottom-10 left-1/2 w-40 -translate-x-1/2 rounded-xl border border-[#006C35]/15 bg-white p-3 text-left shadow-xl"
                    >
                      <p className="text-xs font-bold text-gray-900">{isRtl ? hub.labelAr : hub.label}</p>
                      <p className="mt-1 text-[11px] font-semibold text-[#006C35]">{isRtl ? hub.statusAr : hub.status}</p>
                    </motion.div>
                  )}
                </div>
              );
            })}

            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-2 text-[11px] font-semibold text-gray-600 shadow-sm backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5 text-[#006C35]" />
              {t("Riyadh Expo masterplan", "المخطط العام لإكسبو الرياض")}
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#006C35]/15 bg-[#f3faf5] p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#006C35] text-white">
              <Navigation className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#006C35]">{t("Turn-by-turn guidance", "إرشادات خطوة بخطوة")}</p>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-gray-700">
                {selectedStop === routeStops.length - 1
                  ? t(`You have arrived at ${activeStop.name}.`, `لقد وصلت إلى ${activeStop.nameAr}.`)
                  : t(
                      `From ${activeStop.name}, walk ${guidanceDistance}m along ${concourseName} to ${nextStop.name}.`,
                      `من ${activeStop.nameAr}، امشِ ${guidanceDistance}م عبر ${concourseName} إلى ${nextStop.nameAr}.`,
                    )}
              </p>
            </div>
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