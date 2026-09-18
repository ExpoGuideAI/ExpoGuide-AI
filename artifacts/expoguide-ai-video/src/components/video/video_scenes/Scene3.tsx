import { motion } from 'framer-motion';
import { DeviceFrame } from './Scene1';

export function Scene3() {
  const cards = [
    { title: "Zero Wait Times", color: "var(--color-blue)", icon: "⚡" },
    { title: "Instant Gemini Guidance", color: "var(--color-mint)", icon: "🧠" },
    { title: "Personalized Navigation", color: "var(--color-coral)", icon: "🗺️" }
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
        className="display text-[3.5vw] font-extrabold text-[var(--color-text-dark)] leading-tight text-center max-w-[80%] mb-[3vw] z-30 drop-shadow-sm"
        initial={{ opacity: 0, y: -30, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        The Era of Change — <br/>
        <span className="text-[var(--color-primary)]">Together for a Foresighted Tomorrow</span>
      </motion.h2>

      <div className="relative w-full max-w-[85vw] flex items-center justify-center h-[35vw] perspective-[2000px] z-10">
        
        {/* Center Device fading to flat front view */}
        <motion.div
            className="absolute z-20 w-[45vw] h-[30vw]"
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

        {/* Floating Value Cards */}
        {cards.map((card, idx) => {
            const isLeft = idx === 0;
            const isRight = idx === 2;
            const isCenter = idx === 1;
            
            let xPos = 0;
            let yPos = 0;
            let rotation = 0;

            if (isLeft) {
                xPos = -30;
                yPos = 5;
                rotation = -10;
            } else if (isRight) {
                xPos = 30;
                yPos = 5;
                rotation = 10;
            } else if (isCenter) {
                xPos = 0;
                yPos = 15;
                rotation = 0;
            }

            return (
                <motion.div
                    key={idx}
                    className="absolute z-10 w-[22vw] rounded-[2vw] p-[2vw] flex flex-col items-center justify-center text-center shadow-xl border border-white bg-white/90 backdrop-blur-xl"
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
                    <div className="w-[4vw] h-[4vw] rounded-full flex items-center justify-center mb-[1vw]" style={{ backgroundColor: card.color }}>
                        <motion.div 
                        className="text-[2vw]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.8 + (idx * 0.2), type: "spring", bounce: 0.6 }}
                        >
                        {card.icon}
                        </motion.div>
                    </div>
                    <h3 className="font-display font-bold text-[1.4vw] text-[var(--color-text-dark)] leading-tight">
                        {card.title}
                    </h3>
                </motion.div>
            )
        })}
      </div>
    </motion.div>
  );
}
