import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { DeviceFrame } from './Scene1';

export function Scene2() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Timing matches the 14 second scene duration
    const t1 = setTimeout(() => setActiveTab(1), 4000);
    const t2 = setTimeout(() => setActiveTab(2), 9000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const tabs = [
    { label: "AI Guide", icon: "✨" },
    { label: "Live Queue", icon: "📊" },
    { label: "Smart Itinerary", icon: "🗺️" }
  ];

  const badges = [
    "Instant AI Guidance",
    "Live Queues",
    "Smart Schedules"
  ];

  return (
    <motion.div 
      className="scene-layer flex items-center justify-center relative p-[4vw]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.1 }}
      transition={{ duration: 1 }}
    >
      <div className="flex w-full h-full items-center justify-center relative z-10 perspective-[2000px]">
        
        {/* Dynamic Badges that change with tabs */}
        <div className="absolute left-[5vw] top-[50%] -translate-y-[50%] z-30">
            <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeTab}
                  className="bg-[var(--color-primary)] text-white px-[2vw] py-[1.5vw] rounded-2xl text-[2vw] font-bold shadow-2xl"
                  initial={{ opacity: 0, x: -50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.8 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                >
                  {badges[activeTab]}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Floating Device/Dashboard panning and rotating */}
        <motion.div
            className="w-[60vw] h-[35vw] relative z-20"
            initial={{ rotateY: -15, rotateX: 5, x: 100 }}
            animate={{ 
                rotateY: [ -15, -5, -20 ], 
                rotateX: [ 5, 2, 8 ],
                x: [ 100, 50, 120 ],
                y: [-5, 5, -5]
            }}
            transition={{
                duration: 14,
                ease: "easeInOut",
                times: [0, 0.5, 1]
            }}
        >
             <div className="w-full h-full glass-card rounded-[2vw] flex overflow-hidden shadow-[0_2vw_5vw_rgba(11,93,59,0.15)] border-[4px] border-white bg-white/40 backdrop-blur-xl relative z-10">
                {/* Sidebar */}
                <div className="w-[18vw] bg-white/70 border-r border-white/40 p-[2vw] flex flex-col gap-[1vw] z-20 shadow-[1vw_0_2vw_rgba(0,0,0,0.03)]">
                <div className="font-display font-bold text-[1.8vw] text-[var(--color-primary)] mb-[2vw]">
                    ExpoGuide
                </div>
                
                {tabs.map((tab, idx) => (
                    <motion.div 
                    key={idx}
                    className={`flex items-center gap-[1vw] px-[1.2vw] py-[1vw] rounded-xl font-bold text-[1.2vw] transition-colors ${
                        activeTab === idx 
                        ? 'bg-[var(--color-primary)] text-white shadow-lg' 
                        : 'text-[var(--color-text-dark)]'
                    }`}
                    animate={{
                        scale: activeTab === idx ? 1.05 : 1,
                        x: activeTab === idx ? 5 : 0
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
      </div>
    </motion.div>
  );
}

function TabAIGuide() {
  return (
    <motion.div 
      className="w-full h-full flex flex-col justify-end pb-[1vw]"
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-[2vw] font-display font-bold text-[var(--color-primary)] mb-auto tracking-tight">Multilingual Assistant</div>
      
      <div className="flex flex-col gap-[1vw]">
        <motion.div 
          className="self-end bg-[var(--color-primary)] text-white text-[1.2vw] px-[1.5vw] py-[1vw] rounded-t-[1.5vw] rounded-bl-[1.5vw] shadow-md max-w-[75%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ¿Dónde está el Pabellón de Japón?
        </motion.div>
        
        <motion.div 
          className="self-start bg-white text-[var(--color-text-dark)] text-[1.2vw] px-[1.5vw] py-[1vw] rounded-t-[1.5vw] rounded-br-[1.5vw] shadow-md max-w-[75%] border border-white/50 backdrop-blur-sm"
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
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-[2vw] font-display font-bold text-[var(--color-primary)] mb-[1.5vw] tracking-tight">Crowd Density</div>
      
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-[1.5vw] shadow-xl flex flex-col gap-[1vw] flex-1 border border-white">
        <div className="flex justify-between items-center border-b border-gray-200/50 pb-[1vw]">
          <span className="text-[1.3vw] font-bold text-[var(--color-text-dark)]">Innovation Pavilion</span>
          <motion.div 
            className="px-[1.2vw] py-[0.5vw] rounded-full font-bold text-white text-[1vw] shadow-sm relative overflow-hidden"
            initial={{ backgroundColor: "#EF4444" }} // Red (High)
            animate={{ backgroundColor: "#10B981" }} // Green (Recommended)
            transition={{ delay: 1.5, duration: 1 }}
          >
            <motion.span
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -20 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="block absolute inset-0 flex items-center justify-center"
            >
              High Wait (45m)
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.4 }}
              className="block"
            >
              Recommended (5m)
            </motion.span>
          </motion.div>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200/50 pb-[1vw]">
          <span className="text-[1.3vw] font-bold text-[var(--color-text-dark)]">Tech Dome</span>
          <div className="px-[1.2vw] py-[0.5vw] rounded-full font-bold bg-[#F59E0B] text-white text-[1vw] shadow-sm">
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
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-[2vw] font-display font-bold text-[var(--color-primary)] mb-[1.5vw] tracking-tight">Smart Schedule</div>
      
      <div className="flex flex-col gap-[0.8vw]">
        {[
          { time: "10:00", title: "Welcome Center", color: "var(--color-blue)" },
          { time: "11:15", title: "AI Startups", color: "var(--color-mint)" },
          { time: "13:00", title: "The Oasis", color: "var(--color-coral)" },
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            className="bg-white/80 backdrop-blur-md p-[1.2vw] rounded-xl shadow-md flex items-center gap-[1.5vw] border-l-[6px] border-r border-t border-b border-white"
            style={{ borderLeftColor: item.color }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + (idx * 0.2), duration: 0.5, type: "spring" }}
          >
            <div className="font-mono text-[1vw] text-gray-500 font-bold w-[4vw]">{item.time}</div>
            <div className="font-bold text-[1.2vw] text-[var(--color-text-dark)]">{item.title}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
