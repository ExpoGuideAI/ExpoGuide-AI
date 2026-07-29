import { Link, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Globe, Map, Utensils, Clock, MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatedBackground } from "../ui/animated-background";
import { Button } from "../ui/button";

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
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col relative text-foreground">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-expo-green to-expo-teal flex items-center justify-center shadow-lg shadow-expo-teal/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              ExpoGuide <span className="text-gradient">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-expo-teal flex items-center gap-2",
                  location === item.href ? "text-expo-teal" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="text-sm font-medium hover:text-expo-teal transition-colors px-2 py-1 rounded-md hover:bg-white/5"
            >
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>
            <button 
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 glass-panel border-t border-white/5 flex flex-col p-4 gap-2 animate-in fade-in slide-in-from-top-4">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "p-4 rounded-xl flex items-center gap-3 text-lg font-medium transition-colors",
                location === item.href ? "bg-white/10 text-expo-teal" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {[
            { href: "/", icon: Globe, label: t("Home", "الرئيسية") },
            ...navItems
          ].map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                location === item.href ? "text-expo-teal" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
