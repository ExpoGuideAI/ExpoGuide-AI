import { motion } from 'framer-motion';
import { DeviceFrame } from './Scene1';

export function Scene4() {
  return (
    <motion.div 
      className="scene-layer flex items-center justify-center relative p-[6vw]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex w-full max-w-[85vw] h-full items-center justify-between z-10 gap-[5vw] perspective-[2000px]">
        
        {/* Left Side: URL & Headline */}
        <motion.div 
          className="flex-1 flex flex-col justify-center gap-[2.5vw]"
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
              className="h-[8vw] object-contain mb-[1vw]" 
            />
          </motion.div>

          <h2 className="display text-[5vw] font-extrabold text-[var(--color-text-dark)] leading-tight drop-shadow-sm">
            Scan to Try <br/>
            <span className="text-[var(--color-primary)]">ExpoGuide AI Live</span>
          </h2>
          
          <motion.div 
            className="inline-flex bg-white/90 backdrop-blur-md px-[2.5vw] py-[1.5vw] rounded-2xl shadow-xl border-l-[10px] border-[var(--color-primary)] w-fit"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5, type: "spring" }}
          >
            <span className="font-mono text-[1.8vw] font-bold text-[var(--color-text-dark)]">
              expoguide-ai.replit.app
            </span>
          </motion.div>
        </motion.div>

        {/* Right Side: QR Code in Device */}
        <motion.div 
          className="flex-1 flex items-center justify-center relative h-[45vw]"
          initial={{ opacity: 0, x: 100, rotateY: 15 }}
          animate={{ opacity: 1, x: 0, rotateY: -15 }}
          transition={{ duration: 1.5, delay: 0.8, type: 'spring', bounce: 0.2 }}
        >
          <DeviceFrame tiltAngle={-15} className="w-[30vw] h-full shadow-[0_3vw_6vw_rgba(11,93,59,0.25)]">
             <div className="w-full h-full bg-white flex flex-col items-center justify-center p-[3vw] relative overflow-hidden">
                
                <h3 className="font-display font-bold text-[2vw] text-[var(--color-primary)] mb-[2vw] z-10 text-center">
                    Get Your <br/>Personal Guide
                </h3>

                <div className="relative w-[20vw] h-[20vw] z-10">
                    {/* Animated glowing pulse behind QR */}
                    <motion.div 
                        className="absolute inset-[-10%] rounded-[2vw] border-[4px] border-[var(--color-mint)]"
                        animate={{ 
                            scale: [1, 1.15, 1],
                            opacity: [0.8, 0, 0.8],
                        }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    
                    <div className="absolute inset-0 bg-white p-[1vw] rounded-[1.5vw] shadow-lg border-[4px] border-[var(--color-primary)]">
                        <img 
                        src={`${import.meta.env.BASE_URL}assets/expo-guide-qr.png`}
                        alt="ExpoGuide AI QR Code"
                        className="w-full h-full object-contain rounded-[0.5vw]"
                        />
                    </div>
                </div>

                {/* Decorative background circle in device */}
                <motion.div
                    className="absolute bottom-[-5vw] right-[-5vw] w-[20vw] h-[20vw] rounded-full bg-[var(--color-coral)] opacity-20 blur-[3vw]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
             </div>
          </DeviceFrame>
        </motion.div>

      </div>
    </motion.div>
  );
}
