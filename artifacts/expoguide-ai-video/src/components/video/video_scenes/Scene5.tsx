import { motion } from 'framer-motion';
import { KineticText, MiniPill, PhoneFrame, Signal } from './ScenePrimitives';

export function Scene5() {
  return (
    <motion.section
      className="scene-layer"
      initial={{ clipPath: 'circle(0% at 14% 82%)' }}
      animate={{ clipPath: 'circle(125% at 14% 82%)' }}
      exit={{ clipPath: 'circle(0% at 14% 82%)' }}
      transition={{ duration: .95, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-[#eadfbd]" />
      <div className="absolute inset-0 opacity-45" style={{ backgroundImage: 'linear-gradient(rgba(15,105,77,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(15,105,77,.12) 1px,transparent 1px)', backgroundSize: '4.7vw 4.7vw' }} />
      <Signal left="77%" top="18%" /><Signal left="20%" top="72%" delay={1} />
      <div className="relative z-10 flex h-full items-center justify-between px-[10vw] text-[#123d32]">
        <div className="w-[37vw]">
          <KineticText delay={.12}>
            <div className="eyebrow mb-[1vw] text-[.72vw] text-[#0f694d]">04 / Keep your day moving</div>
            <h2 className="display text-[4.35vw] font-semibold leading-[.94] tracking-[-.07em]">The right place,<br /><span className="text-[#0f694d]">at the right time.</span></h2>
          </KineticText>
          <KineticText delay={.44} className="mt-[1.8vw] max-w-[29vw]">
            <p className="text-[1.03vw] leading-[1.45] text-[#496e5f]">Your plan flexes with Riyadh. Live queues, walkable routes, and a next stop that feels like your own discovery.</p>
          </KineticText>
          <div className="mt-[2.2vw] flex gap-[.7vw]"><MiniPill tone="green">walkable routes</MiniPill><MiniPill tone="gold">live queues</MiniPill></div>
        </div>
        <PhoneFrame className="mr-[3vw] border-[#0f694d]/50">
          <div className="h-full px-[1.1vw] pb-[1vw] pt-[2vw]">
            <div className="flex items-center justify-between"><span className="text-[.72vw] font-bold text-[#31584a]">Your day at Expo</span><span className="h-[1.5vw] w-[1.5vw] rounded-full bg-[#d7e2d3]" /></div>
            <div className="mt-[1.2vw] rounded-[.9vw] bg-[#dfe6d9] p-[.8vw]"><div className="flex items-center justify-between"><span className="mono text-[.53vw] uppercase tracking-[.12em] text-[#688272]">Next stop</span><span className="text-[.53vw] text-[#0f694d]">4 min</span></div><div className="mt-[.55vw] text-[.82vw] font-semibold text-[#31584a]">Saudi Pavilion</div><div className="mt-[.75vw] flex items-center gap-[.3vw]"><span className="h-[.28vw] w-[3.7vw] rounded-full bg-[#0f694d]" /><span className="h-[.28vw] w-[4.2vw] rounded-full bg-[#b8c9b7]" /></div></div>
            <div className="relative mt-[1vw] h-[19vw] overflow-hidden rounded-[1vw] bg-[#c9dbc9]">
              <svg viewBox="0 0 240 320" className="h-full w-full opacity-70"><path d="M20 275 C60 220 42 182 92 150 S174 120 208 44 M43 280 C91 244 116 228 125 176 S162 116 190 82" fill="none" stroke="#4d8a6a" strokeWidth="7" strokeLinecap="round" /><path d="M34 44 L75 88 L119 48 L184 65 L207 129 L154 165 L80 152 L34 205" fill="none" stroke="#9ab59c" strokeWidth="2" strokeDasharray="5 5" /></svg>
              <motion.div className="absolute left-[49%] top-[45%] h-[2.3vw] w-[2.3vw] rounded-full border-[.15vw] border-[#f6f0dc] bg-[#d19f42] p-[.48vw] shadow-md" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}><div className="h-full w-full rounded-full bg-[#fff4c9]" /></motion.div>
              <div className="absolute bottom-[.75vw] left-[.75vw] right-[.75vw] rounded-[.7vw] bg-[#f5f1e7]/90 px-[.7vw] py-[.6vw] text-[.58vw] font-semibold text-[#31584a]">A cooler route is available ↗</div>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </motion.section>
  );
}