import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Use same device frame component everywhere to keep consistency.
export function DeviceFrame({ children, tiltAngle = 30, className = "" }: { children: React.ReactNode, tiltAngle?: number, className?: string }) {
  return (
    <motion.div
      className={`glass-card rounded-[2.5vw] flex flex-col overflow-hidden shadow-[0_2vw_5vw_rgba(11,93,59,0.15)] border-[4px] border-white bg-white/40 backdrop-blur-xl relative z-20 ${className}`}
      initial={{ rotateY: tiltAngle, rotateX: 10, scale: 0.9 }}
      animate={{ rotateY: tiltAngle, rotateX: 5, scale: 1 }}
      transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1500px',
      }}
    >
      <div className="bg-white/80 border-b border-gray-200/50 p-[1.5vw] flex items-center justify-center shrink-0">
        <div className="w-[4vw] h-[0.5vw] bg-gray-300 rounded-full" />
      </div>
      <div className="flex-1 w-full h-full relative bg-white/60">
        {children}
      </div>
    </motion.div>
  );
}

export function Scene1() {
  const [typedText, setTypedText] = useState('');
  const fullText = "Fastest way to visit AI Startups?";

  useEffect(() => {
    let currentText = '';
    let i = 0;
    
    const typingTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        currentText += fullText[i];
        setTypedText(currentText);
        i++;
        if (i >= fullText.length) clearInterval(interval);
      }, 40); 
      return () => clearInterval(interval);
    }, 1800);

    return () => clearTimeout(typingTimeout);
  }, []);

  return (
    <motion.div 
      className="scene-layer flex items-center justify-center relative p-[4vw]"
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
    >
      {/* 3D floating smartphone frame tilted at a dynamic 30-degree perspective angle. */}
      <div className="flex w-full h-full justify-between items-center z-10 perspective-[2000px]">
        
        {/* Left Content */}
        <div className="flex flex-col flex-1 pl-[5vw] pr-[2vw] relative z-20">
          <motion.div
            className="bg-[var(--color-primary)] text-white px-[1.5vw] py-[0.6vw] rounded-full text-[1.2vw] font-bold tracking-wide uppercase mb-[2vw] shadow-xl w-fit"
            initial={{ opacity: 0, y: -20, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Your AI Companion
          </motion.div>
          
          <motion.h1
            className="display text-[5vw] font-extrabold text-[var(--color-text-dark)] leading-tight drop-shadow-sm"
            initial={{ opacity: 0, y: 30, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Welcome to <br/><span className="text-[var(--color-primary)]">EXPO 2030</span>
          </motion.h1>
        </div>

        {/* Right Device */}
        <motion.div 
          className="flex-1 flex justify-center items-center h-[90%] relative z-10"
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
           <DeviceFrame tiltAngle={-25} className="w-[30vw] h-[45vw]">
            <div className="flex-1 p-[2vw] flex flex-col justify-end gap-[1.5vw] h-full">
              {/* User Message */}
              <AnimatePresence>
                {typedText.length > 0 && (
                  <motion.div 
                    className="self-end bg-[var(--color-primary)] text-white text-[1.3vw] px-[1.5vw] py-[1vw] rounded-t-[1.5vw] rounded-bl-[1.5vw] shadow-md max-w-[85%]"
                    initial={{ opacity: 0, scale: 0.8, transformOrigin: "bottom right" }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {typedText}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* AI Response */}
              <AnimatePresence>
                {typedText === fullText && (
                  <motion.div
                    className="self-start bg-white text-[var(--color-text-dark)] text-[1.3vw] p-[1.5vw] rounded-t-[1.5vw] rounded-br-[1.5vw] shadow-[0_1vw_2vw_rgba(0,0,0,0.05)] max-w-[90%] border border-gray-100/50 backdrop-blur-md"
                    initial={{ opacity: 0, x: -20, scale: 0.9, transformOrigin: "bottom left" }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 150, damping: 18 }}
                  >
                    <div className="font-bold text-[var(--color-primary)] mb-[0.8vw] flex items-center gap-[0.5vw]">
                      <span className="text-[1.8vw]">✨</span> AI Guide
                    </div>
                    <div className="font-semibold text-[1.6vw] mb-[0.5vw]">Hall 3</div>
                    <div className="text-[var(--color-primary)] bg-[var(--color-mint)] inline-block px-[1vw] py-[0.4vw] rounded-lg font-bold text-[1.1vw] shadow-sm">
                      Low Queue (5 min wait)
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
           </DeviceFrame>
        </motion.div>
      </div>
    </motion.div>
  );
}
