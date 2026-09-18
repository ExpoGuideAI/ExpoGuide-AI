import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  const [typedText, setTypedText] = useState('');
  const fullText = "Fastest way to visit AI Startups?";

  useEffect(() => {
    let currentText = '';
    let i = 0;
    
    // Start typing at 2.5s
    const typingTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        currentText += fullText[i];
        setTypedText(currentText);
        i++;
        if (i >= fullText.length) clearInterval(interval);
      }, 50); // type speed
      return () => clearInterval(interval);
    }, 2500);

    return () => clearTimeout(typingTimeout);
  }, []);

  return (
    <motion.div 
      className="scene-layer flex flex-col items-center justify-center relative"
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
    >
      {/* Header Content */}
      <div className="absolute top-[12vw] flex flex-col items-center z-10 w-full">
        <motion.div
          className="bg-[var(--color-primary)] text-white px-[2vw] py-[0.8vw] rounded-full text-[1.2vw] font-bold tracking-wide uppercase mb-[2vw] shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Your AI Companion
        </motion.div>
        
        <motion.h1
          className="display text-[5vw] font-extrabold text-[var(--color-text-dark)] leading-tight text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Welcome to <span className="text-[var(--color-primary)]">EXPO 2030</span>
        </motion.h1>
      </div>

      {/* Mobile Chat Box */}
      <motion.div
        className="absolute bottom-[4vw] w-[32vw] h-[26vw] glass-card rounded-[2.5vw] flex flex-col overflow-hidden shadow-2xl border-[4px] border-white"
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 1.5, type: "spring", stiffness: 120, damping: 20 }}
      >
        <div className="bg-white/80 border-b border-gray-200/50 p-[1.5vw] flex items-center justify-center">
          <div className="w-[4vw] h-[0.5vw] bg-gray-300 rounded-full" />
        </div>
        
        <div className="flex-1 p-[2vw] flex flex-col justify-end gap-[1vw]">
          {/* User Message */}
          <motion.div 
            className="self-end bg-[var(--color-primary)] text-white text-[1.4vw] px-[1.5vw] py-[1vw] rounded-t-[1.5vw] rounded-bl-[1.5vw] shadow-md max-w-[85%]"
            initial={{ opacity: 0, scale: 0.8, transformOrigin: "bottom right" }}
            animate={{ opacity: typedText.length > 0 ? 1 : 0, scale: typedText.length > 0 ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {typedText || "..."}
          </motion.div>
          
          {/* AI Response */}
          <motion.div
            className="self-start bg-white text-[var(--color-text-dark)] text-[1.4vw] p-[1.2vw] rounded-t-[1.5vw] rounded-br-[1.5vw] shadow-md max-w-[90%] border border-gray-100"
            initial={{ opacity: 0, x: -20, scale: 0.9, transformOrigin: "bottom left" }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 4.8, type: "spring", stiffness: 150, damping: 18 }}
          >
            <div className="font-bold text-[var(--color-primary)] mb-[0.5vw] flex items-center gap-[0.5vw]">
              <span className="text-[1.8vw]">✨</span> AI Guide
            </div>
            <div className="font-semibold text-[1.5vw]">Hall 3</div>
            <div className="text-[var(--color-primary)] bg-[var(--color-mint)] inline-block px-[1vw] py-[0.3vw] rounded-md mt-[0.5vw] font-bold text-[1.1vw]">
              Low Queue (5 min wait)
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
