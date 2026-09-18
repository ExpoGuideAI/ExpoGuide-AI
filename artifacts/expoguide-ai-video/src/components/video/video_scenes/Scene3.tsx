import { motion } from 'framer-motion';
import { DeviceFrame } from './Scene1';

export function Scene3() {
  const featurePreviews = [
    { 
      type: "chat",
      title: "Interactive Chat",
      color: "var(--color-blue)",
      content: (
        <div className="flex flex-col gap-[0.6vw] w-full mt-[1vw]">
          <motion.div 
            className="self-end bg-[var(--color-primary)] text-white text-[0.85vw] px-[1vw] py-[0.6vw] rounded-[1vw] rounded-tr-[0.2vw] w-max shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
          >
            Find nearest coffee
          </motion.div>
          <motion.div 
            className="self-start bg-gray-50 text-gray-800 text-[0.85vw] px-[1vw] py-[0.6vw] rounded-[1vw] rounded-tl-[0.2vw] max-w-[90%] shadow-sm text-left leading-snug border border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3 }}
          >
            Al Baik is just a 3 min walk north from you.
          </motion.div>
        </div>
      )
    },
    { 
      type: "queue",
      title: "Live Density",
      color: "var(--color-mint)",
      content: (
        <div className="w-full mt-[1vw] flex flex-col gap-[0.6vw]">
          <div className="flex justify-between items-center">
            <span className="text-[0.9vw] font-bold text-gray-600">Japan Pavilion</span>
            <span className="text-[#EF4444] text-[0.75vw] font-bold bg-[#EF4444]/10 px-[0.6vw] py-[0.2vw] rounded-full border border-[#EF4444]/20">High Wait</span>
          </div>
          <div className="flex gap-[0.15vw] h-[3vw] items-end w-full">
            {[20, 30, 25, 40, 50, 70, 80, 95, 90, 85, 75, 60, 45, 30].map((h, i) => (
              <motion.div 
                key={i} 
                className="flex-1 rounded-t-[0.1vw]" 
                style={{ backgroundColor: h > 70 ? "#EF4444" : h > 40 ? "#F59E0B" : "#10B981" }}
                initial={{ height: 0 }} 
                animate={{ height: `${h}%` }} 
                transition={{ delay: 2 + (i * 0.05) }} 
              />
            ))}
          </div>
        </div>
      )
    },
    { 
      type: "map",
      title: "Smart Route",
      color: "var(--color-coral)",
      content: (
        <div className="w-full mt-[1.5vw] mb-[0.5vw] relative h-[3vw] flex flex-col justify-start pt-[0.5vw]">
           <div className="relative w-full h-[0.4vw] bg-gray-100 rounded-full">
             <motion.div 
               className="absolute left-0 top-0 bottom-0 bg-[var(--color-primary)] rounded-full" 
               initial={{ width: 0 }} 
               animate={{ width: "75%" }} 
               transition={{ delay: 2.2, duration: 1.5, ease: "easeInOut" }} 
             />
             {[
               { pos: 0, label: "Entrance", active: true }, 
               { pos: 45, label: "AI Dome", active: true }, 
               { pos: 90, label: "Dining", active: false }
             ].map((node, i) => (
                <div key={i} className="absolute top-1/2 flex flex-col items-center" style={{ left: `${node.pos}%`, transform: 'translate(-50%, -50%)' }}>
                  <motion.div 
                    className="w-[1.2vw] h-[1.2vw] bg-white border-[0.3vw] rounded-full z-10 shadow-sm" 
                    style={{ borderColor: node.active ? 'var(--color-primary)' : '#E5E7EB' }}
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ delay: 1.8 + (i * 0.3), type: "spring" }} 
                  />
                  <motion.div 
                    className="absolute top-[1.2vw] text-[0.7vw] font-bold text-gray-500 whitespace-nowrap"
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.0 + (i * 0.3) }}
                  >
                    {node.label}
                  </motion.div>
                </div>
             ))}
           </div>
        </div>
      )
    }
  ];

  return (
    <motion.div 
      className="scene-layer flex flex-col items-center justify-center relative p-[4vw]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="display text-[3.5vw] font-extrabold text-[var(--color-text-dark)] leading-tight text-center max-w-[80%] mb-[1vw] z-30 drop-shadow-sm"
        initial={{ opacity: 0, y: -30, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        The Era of Change — <br/>
        <span className="text-[var(--color-primary)]">Together for a Foresighted Tomorrow</span>
      </motion.h2>

      <div className="relative w-full max-w-[85vw] flex items-center justify-center h-[35vw] perspective-[2000px] z-10 mt-[-3vw]">
        
        {/* Center Device fading to flat front view */}
        <motion.div
            className="absolute z-10 w-[42vw] h-[28vw]"
            initial={{ rotateY: -15, rotateX: 5, scale: 0.9, y: 30 }}
            animate={{ rotateY: 0, rotateX: 0, scale: 1, y: 0 }}
            transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
        >
             <DeviceFrame tiltAngle={0} className="w-full h-full shadow-[0_3vw_6vw_rgba(11,93,59,0.2)]">
                <div className="w-full h-full bg-[var(--color-primary)] flex items-center justify-center relative overflow-hidden">
                    <motion.div 
                        className="absolute inset-0 opacity-20"
                        animate={{
                            backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        style={{
                            backgroundImage: 'radial-gradient(circle at center, white 2px, transparent 2px)',
                            backgroundSize: '20px 20px'
                        }}
                    />
                    <img 
                        src={`${import.meta.env.BASE_URL}assets/expo2030-logo.png`} 
                        alt="Expo 2030" 
                        className="h-[12vw] object-contain filter brightness-0 invert opacity-90" 
                    />
                </div>
             </DeviceFrame>
        </motion.div>

        {/* Floating UI Previews */}
        {featurePreviews.map((card, idx) => {
            const isLeft = idx === 0;
            const isRight = idx === 2;
            const isCenter = idx === 1;
            
            let xPos = 0;
            let yPos = 0;
            let rotation = 0;

            if (isLeft) {
                xPos = -32;
                yPos = 0;
                rotation = -6;
            } else if (isRight) {
                xPos = 32;
                yPos = 0;
                rotation = 6;
            } else if (isCenter) {
                xPos = 0;
                yPos = 11;
                rotation = 0;
            }

            return (
                <motion.div
                    key={idx}
                    className="absolute z-30 w-[24vw] rounded-[1.5vw] p-[1.5vw] flex flex-col bg-white/95 backdrop-blur-xl shadow-[0_1.5vw_3vw_rgba(0,0,0,0.12)] border border-white/60"
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                    animate={{ 
                        opacity: 1, 
                        x: `${xPos}vw`, 
                        y: `${yPos}vw`, 
                        rotateZ: rotation,
                        scale: 1
                    }}
                    transition={{ 
                        duration: 1.2, 
                        delay: 1.2 + (idx * 0.2), 
                        type: "spring", 
                        stiffness: 80, 
                        damping: 12 
                    }}
                >
                    <div className="flex items-center gap-[0.8vw]">
                        <div className="w-[1.8vw] h-[1.8vw] rounded-full" style={{ backgroundColor: card.color }} />
                        <h3 className="font-display font-bold text-[1.2vw] text-[var(--color-text-dark)] leading-tight">
                            {card.title}
                        </h3>
                    </div>
                    {card.content}
                </motion.div>
            )
        })}
      </div>
    </motion.div>
  );
}
