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
    { label: "Smart Route", icon: "🗺️" }
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
            className="w-[62vw] h-[36vw] relative z-20"
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
             <div className="w-full h-full glass-card rounded-[2vw] flex overflow-hidden shadow-[0_2vw_5vw_rgba(11,93,59,0.15)] border-[4px] border-white bg-white/50 backdrop-blur-xl relative z-10">
                {/* Sidebar */}
                <div className="w-[18vw] bg-white/70 border-r border-white/40 p-[2vw] flex flex-col gap-[1vw] z-20 shadow-[1vw_0_2vw_rgba(0,0,0,0.03)] shrink-0">
                <div className="font-display font-bold text-[1.8vw] text-[var(--color-primary)] mb-[2vw]">
                    ExpoGuide
                </div>
                
                {tabs.map((tab, idx) => (
                    <motion.div 
                    key={idx}
                    className={`flex items-center gap-[1vw] px-[1.2vw] py-[1vw] rounded-[1vw] font-bold text-[1.2vw] transition-colors ${
                        activeTab === idx 
                        ? 'bg-[var(--color-primary)] text-white shadow-lg' 
                        : 'text-[var(--color-text-dark)] bg-white/40'
                    }`}
                    animate={{
                        scale: activeTab === idx ? 1.03 : 1,
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
                <div className="flex-1 bg-white/40 relative">
                  <AnimatePresence mode="sync">
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
  const answerWords = "The Japan Pavilion is located in the Opportunity District, a 5-minute walk from your current location.".split(" ");
  return (
    <motion.div 
      className="absolute inset-[2.5vw] flex flex-col pb-[0.5vw]"
      dir="ltr"
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-[1.6vw] font-display font-bold text-[var(--color-primary)] mb-[1.5vw] flex items-center gap-[0.8vw] pb-[1vw] border-b border-gray-200/50">
        <div className="w-[2.5vw] h-[2.5vw] rounded-full bg-[var(--color-mint)] flex items-center justify-center text-[1.2vw]">✨</div>
        <div className="flex flex-col">
          <span className="leading-none text-[1.4vw]">ExpoGuide AI</span>
          <span className="text-[0.85vw] font-medium text-gray-500 mt-[0.2vw]">Online • Multilingual</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-[1.5vw] mt-auto">
        <motion.div 
          className="self-end bg-[var(--color-primary)] text-white text-[1.2vw] text-left leading-snug px-[1.5vw] py-[1vw] rounded-[1.5vw] rounded-tr-[0.2vw] shadow-md max-w-[80%]"
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          Where is the Japan Pavilion?
        </motion.div>
        
        <motion.div 
          className="self-start bg-white text-[var(--color-text-dark)] text-[1.2vw] text-left leading-snug px-[1.5vw] py-[1vw] rounded-[1.5vw] rounded-tl-[0.2vw] shadow-md max-w-[90%] border border-gray-100 flex flex-wrap gap-[0.4vw]"
          initial={{ opacity: 0, scale: 0.9, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          {answerWords.map((word, idx) => (
             <motion.span
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + (idx * 0.05) }}
             >
               {word}
             </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function TabLiveQueue() {
  const saudiBars = [20, 25, 22, 30, 35, 40, 38, 30, 25, 28, 35, 40, 35, 30, 25, 20, 22, 25, 28, 30, 25, 20, 15, 20];
  const japanBars = [40, 45, 50, 60, 70, 75, 80, 85, 80, 75, 70, 65, 70, 75, 80, 85, 90, 85, 80, 85, 90, 95, 90, 85];

  return (
    <motion.div 
      className="absolute inset-[2.5vw] flex flex-col"
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-[1.6vw] font-display font-bold text-[var(--color-primary)] mb-[1.5vw] flex items-center justify-between">
        <span>Live Queue Tracker</span>
        <div className="flex gap-[0.3vw] items-end h-[1.2vw]">
           <motion.div className="w-[0.3vw] rounded-full bg-[var(--color-primary)]" animate={{ height: ["40%", "100%", "40%"] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
           <motion.div className="w-[0.3vw] rounded-full bg-[var(--color-primary)]" animate={{ height: ["100%", "40%", "100%"] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
           <motion.div className="w-[0.3vw] rounded-full bg-[var(--color-primary)]" animate={{ height: ["60%", "100%", "60%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
        </div>
      </div>
      
      <div className="flex flex-col gap-[1.2vw] flex-1 justify-center">
        <motion.div 
          className="bg-white/90 backdrop-blur-md rounded-[1vw] p-[1.5vw] shadow-sm border border-gray-100 flex flex-col gap-[1vw]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
           <div className="flex justify-between items-center">
             <div className="flex items-center gap-[0.8vw]">
               <span className="text-[1.8vw]">🇸🇦</span>
               <span className="font-bold text-[1.4vw] text-[var(--color-text-dark)]">Saudi Pavilion</span>
             </div>
             <span className="bg-[#10B981]/15 text-[#10B981] px-[1vw] py-[0.4vw] rounded-full text-[1vw] font-bold border border-[#10B981]/20">Low • 5 min</span>
           </div>
           <div className="flex gap-[0.2vw] h-[3vw] items-end">
              {saudiBars.map((h, i) => (
                <motion.div 
                   key={i}
                   className="flex-1 rounded-t-[0.2vw]"
                   style={{ backgroundColor: i > 20 ? "#10B981" : "#E2E8F0" }}
                   initial={{ height: 0 }}
                   animate={{ height: `${h}%` }}
                   transition={{ delay: 0.5 + (i * 0.02) }}
                />
              ))}
           </div>
        </motion.div>
        
        <motion.div 
          className="bg-white/90 backdrop-blur-md rounded-[1vw] p-[1.5vw] shadow-sm border border-gray-100 flex flex-col gap-[1vw]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
           <div className="flex justify-between items-center">
             <div className="flex items-center gap-[0.8vw]">
               <span className="text-[1.8vw]">🇯🇵</span>
               <span className="font-bold text-[1.4vw] text-[var(--color-text-dark)]">Japan Pavilion</span>
             </div>
             <span className="bg-[#EF4444]/15 text-[#EF4444] px-[1vw] py-[0.4vw] rounded-full text-[1vw] font-bold border border-[#EF4444]/20">High • 35 min</span>
           </div>
           <div className="flex gap-[0.2vw] h-[3vw] items-end">
              {japanBars.map((h, i) => (
                <motion.div 
                   key={i}
                   className="flex-1 rounded-t-[0.2vw]"
                   style={{ backgroundColor: i > 20 ? "#EF4444" : "#E2E8F0" }}
                   initial={{ height: 0 }}
                   animate={{ height: `${h}%` }}
                   transition={{ delay: 0.7 + (i * 0.02) }}
                />
              ))}
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function TabItinerary() {
  return (
    <motion.div 
      className="absolute inset-[2.5vw] flex flex-col"
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-[1.6vw] font-display font-bold text-[var(--color-primary)] mb-[2vw] flex items-center justify-between">
        <span>Smart Itinerary</span>
        <span className="text-[1vw] bg-[var(--color-primary)] text-white px-[1vw] py-[0.4vw] rounded-full shadow-sm">Optimized</span>
      </div>
      
      <div className="flex flex-col gap-[1.2vw] relative flex-1 justify-center">
        <div className="absolute left-[1.8vw] top-[1vw] bottom-[1vw] w-[4px] bg-gray-200/80 z-0 rounded-full overflow-hidden">
          <motion.div 
            className="w-full bg-[var(--color-primary)]"
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
          />
        </div>
        {[
          { time: "10:00 AM", title: "Mobility District", icon: "🚀", color: "var(--color-blue)" },
          { time: "11:30 AM", title: "AI Dome", icon: "🧠", color: "var(--color-mint)" },
          { time: "01:00 PM", title: "Central Dining", icon: "🍽️", color: "var(--color-coral)" },
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            className="bg-white/90 backdrop-blur-md p-[1.2vw] rounded-[1vw] shadow-sm flex items-center gap-[1.5vw] border border-gray-100 z-10 ml-[4vw] relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + (idx * 0.2), duration: 0.5, type: "spring" }}
          >
            <motion.div 
              className="absolute left-[-2.9vw] top-[50%] mt-[-0.75vw] w-[1.5vw] h-[1.5vw] rounded-full border-[4px] border-white shadow-sm z-20 bg-[var(--color-primary)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + (idx * 0.2), type: "spring" }}
            />
            <div className="flex-1 flex justify-between items-center">
              <div>
                <div className="font-mono text-[0.9vw] text-gray-500 font-bold mb-[0.3vw]">{item.time}</div>
                <div className="font-bold text-[1.3vw] text-[var(--color-text-dark)]">{item.title}</div>
              </div>
              <div className="w-[3vw] h-[3vw] rounded-full flex items-center justify-center text-[1.4vw]" style={{ backgroundColor: item.color }}>
                {item.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
