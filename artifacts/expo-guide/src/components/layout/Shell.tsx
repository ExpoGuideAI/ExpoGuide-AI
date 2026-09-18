import { Link, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Globe, Map, Utensils, Clock, MessageSquare, Route as RouteIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatedBackground } from "../ui/animated-background";

export function Shell({ children }: { children: React.ReactNode }) {
  const { lang, setLang, t } = useI18n();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLang = () => {
    setLang(lang === "en" ? "ar" : "en");
  };

  const navItems = [
    { href: "/pavilions", icon: Map, label: t("Pavilions", "الأجنحة") },
    { href: "/restaurants", icon: Utensils, label: t("Dining", "المطاعم") },
    { href: "/queue", icon: Clock, label: t("Live Queue", "الطوابير المباشرة") },
    { href: "/chat", icon: MessageSquare, label: t("AI Guide", "المرشد الذكي") },
    { href: "/smart-route", icon: RouteIcon, label: t("Smart Route", "المسار الذكي") },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col relative text-foreground">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/expo2030-logo.png" alt="Riyadh Expo 2030" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors flex items-center gap-2 px-4 py-2 rounded-full",
                    isActive 
                      ? "bg-[#006C35]/10 text-[#006C35]" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="text-sm font-medium text-gray-700 transition-colors px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            >
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>
            <button 
              className="md:hidden p-2 text-gray-500 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 flex flex-col p-4 gap-2 animate-in fade-in slide-in-from-top-4">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "p-4 rounded-2xl flex items-center gap-3 text-lg font-medium transition-colors",
                location === item.href 
                  ? "bg-[#006C35]/10 text-[#006C35]" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 px-2">
          {[
            { href: "/", icon: Globe, label: t("Home", "الرئيسية") },
            ...navItems
          ].map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                  isActive ? "text-[#006C35]" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
