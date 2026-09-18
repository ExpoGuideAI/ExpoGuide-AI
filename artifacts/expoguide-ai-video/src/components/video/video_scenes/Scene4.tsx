import { motion } from 'framer-motion';

export function Scene4() {
  return (
    <motion.div 
      className="scene-layer flex items-center justify-center relative p-[6vw] bg-[var(--color-bg-main)]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex w-full max-w-[85vw] h-full items-center justify-between z-10 gap-[5vw]">
        
        {/* Left Side: URL & Headline */}
        <motion.div 
          className="flex-1 flex flex-col justify-center gap-[3vw]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8, type: "spring" }}
          >
            <img 
              src={`${import.meta.env.BASE_URL}assets/expo2030-logo.png`} 
              alt="Expo 2030" 
              className="h-[8vw] object-contain mb-[2vw]" 
            />
          </motion.div>

          <h2 className="display text-[5vw] font-extrabold text-[var(--color-text-dark)] leading-tight">
            Scan to Try <br/>
            <span className="text-[var(--color-primary)]">ExpoGuide AI Live</span>
          </h2>
          
          <motion.div 
            className="inline-flex bg-white px-[2.5vw] py-[1.5vw] rounded-2xl shadow-xl border-l-[10px] border-[var(--color-primary)] w-fit"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5, type: "spring" }}
          >
            <span className="font-mono text-[1.8vw] font-bold text-[var(--color-text-dark)]">
              expoguide-ai.replit.app
            </span>
          </motion.div>
        </motion.div>

        {/* Right Side: QR Code */}
        <motion.div 
          className="w-[35vw] flex items-center justify-center relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        >
          {/* Glowing Border Background */}
          <motion.div 
            className="absolute inset-0 bg-[var(--color-primary)] rounded-[3vw] opacity-30 blur-[2vw]"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          <div className="bg-white p-[3vw] rounded-[3vw] shadow-2xl relative z-10 border-[6px] border-[var(--color-primary)]">
            <img 
              src={`${import.meta.env.BASE_URL}assets/expo-guide-qr.png`}
              alt="ExpoGuide AI QR Code"
              className="w-full h-auto object-contain rounded-[1vw]"
            />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
