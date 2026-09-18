import { motion } from 'framer-motion';

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
        className="display text-[3.5vw] font-extrabold text-[var(--color-text-dark)] leading-tight text-center max-w-[80%] mb-[5vw] z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        The Era of Change — <br/>
        <span className="text-[var(--color-primary)]">Together for a Foresighted Tomorrow</span>
      </motion.h2>

      <div className="flex gap-[3vw] z-10 w-full max-w-[85vw] justify-center">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            className="flex-1 rounded-[2vw] p-[3vw] flex flex-col items-center justify-center text-center shadow-xl border border-white/50"
            style={{ backgroundColor: card.color }}
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ 
              duration: 1, 
              delay: 1.2 + (idx * 0.3), 
              type: "spring", 
              stiffness: 100, 
              damping: 15 
            }}
          >
            <motion.div 
              className="text-[4vw] mb-[2vw]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.6 + (idx * 0.3), type: "spring", bounce: 0.6 }}
            >
              {card.icon}
            </motion.div>
            <h3 className="font-display font-bold text-[2vw] text-[var(--color-text-dark)] leading-tight">
              {card.title}
            </h3>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
