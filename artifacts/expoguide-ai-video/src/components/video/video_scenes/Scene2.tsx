import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setActiveTab(1), 4500);
    const t2 = setTimeout(() => setActiveTab(2), 9000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const tabs = [
    { label: "AI Guide", icon: "✨" },
    { label: "Live Queue", icon: "📊" },
    { label: "Smart Itinerary", icon: "🗺️" }
  ];

  return (
    <motion.div 
      className="scene-layer flex items-center justify-center relative p-[4vw]"
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-[85vw] h-[45vw] glass-card rounded-[2vw] flex overflow-hidden shadow-2xl border-[4px] border-white relative z-10">
        
        {/* Sidebar */}
        <div className="w-[22vw] bg-white/60 border-r border-white/40 p-[2vw] flex flex-col gap-[1vw]">
          <div className="font-display font-bold text-[1.8vw] text-[var(--color-primary)] mb-[2vw]">
            ExpoGuide
          </div>
          
          {tabs.map((tab, idx) => (
            <motion.div 
              key={idx}
              className={`flex items-center gap-[1vw] px-[1.5vw] py-[1vw] rounded-xl font-bold text-[1.3vw] transition-colors ${
                activeTab === idx 
                  ? 'bg-[var(--color-primary)] text-white shadow-lg' 
                  : 'text-[var(--color-text-dark)] hover:bg-white/50'
              }`}
              animate={{
                scale: activeTab === idx ? 1.05 : 1,
                x: activeTab === idx ? 10 : 0
              }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </motion.div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/40 relative overflow-hidden p-[3vw]">
          <AnimatePresence mode="popLayout">
            {activeTab === 0 && <TabAIGuide key="tab0" />}
            {activeTab === 1 && <TabLiveQueue key="tab1" />}
            {activeTab === 2 && <TabItinerary key="tab2" />}
          </AnimatePresence>
        </div>
        
      </div>
    </motion.div>
  );
}

function TabAIGuide() {
  return (
    <motion.div 
      className="w-full h-full flex flex-col justify-end pb-[2vw]"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-[2vw] font-display font-bold text-[var(--color-primary)] mb-auto">Multilingual Assistant</div>
      
      <div className="flex flex-col gap-[1.5vw]">
        <motion.div 
          className="self-end bg-[var(--color-primary)] text-white text-[1.4vw] px-[2vw] py-[1.2vw] rounded-2xl shadow-md max-w-[70%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ¿Dónde está el Pabellón de Japón?
        </motion.div>
        
        <motion.div 
          className="self-start bg-white text-[var(--color-text-dark)] text-[1.4vw] px-[2vw] py-[1.2vw] rounded-2xl shadow-md max-w-[70%] border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          El Pabellón de Japón se encuentra en la Zona de Oportunidad, a 5 minutos caminando desde su ubicación actual.
        </motion.div>
      </div>
    </motion.div>
  );
}

function TabLiveQueue() {
  return (
    <motion.div 
      className="w-full h-full flex flex-col"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-[2vw] font-display font-bold text-[var(--color-primary)] mb-[2vw]">Crowd Density Status</div>
      
      <div className="bg-white rounded-2xl p-[2vw] shadow-xl flex flex-col gap-[1.5vw] flex-1">
        <div className="flex justify-between items-center border-b border-gray-100 pb-[1vw]">
          <span className="text-[1.5vw] font-bold">Innovation Pavilion</span>
          <motion.div 
            className="px-[1.5vw] py-[0.5vw] rounded-full font-bold text-white text-[1.2vw]"
            initial={{ backgroundColor: "#EF4444" }} // Red (High)
            animate={{ backgroundColor: "#10B981" }} // Green (Recommended)
            transition={{ delay: 1.5, duration: 1 }}
          >
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 1.2, duration: 0.3 }}
              className="absolute"
            >
              High Wait (45m)
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.3 }}
            >
              Recommended (5m)
            </motion.span>
          </motion.div>
        </div>

        <div className="flex justify-between items-center border-b border-gray-100 pb-[1vw]">
          <span className="text-[1.5vw] font-bold">Tech Dome</span>
          <div className="px-[1.5vw] py-[0.5vw] rounded-full font-bold bg-[#F59E0B] text-white text-[1.2vw]">
            Moderate (20m)
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TabItinerary() {
  return (
    <motion.div 
      className="w-full h-full flex flex-col"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-[2vw] font-display font-bold text-[var(--color-primary)] mb-[2vw]">Optimized Schedule</div>
      
      <div className="flex flex-col gap-[1vw]">
        {[
          { time: "10:00 AM", title: "Arrival & Welcome Center", color: "var(--color-blue)" },
          { time: "11:15 AM", title: "AI Startups Pavilion", color: "var(--color-mint)" },
          { time: "01:00 PM", title: "Lunch at The Oasis", color: "var(--color-coral)" },
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            className="bg-white p-[1.5vw] rounded-xl shadow-md flex items-center gap-[2vw] border-l-[8px]"
            style={{ borderLeftColor: item.color }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + (idx * 0.2), duration: 0.5, type: "spring" }}
          >
            <div className="font-mono text-[1.2vw] text-gray-500 font-bold">{item.time}</div>
            <div className="font-bold text-[1.4vw] text-[var(--color-text-dark)]">{item.title}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
