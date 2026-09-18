import { motion } from 'framer-motion';
import { KineticText, MiniPill, PhoneFrame, Signal } from './ScenePrimitives';

const pavilions = [
  { name: 'Japan', meta: 'Culture · 8 min', color: '#e78159', angle: -14 },
  { name: 'Singapore', meta: 'Future · 12 min', color: '#69b9b0', angle: 8 },
  { name: 'Saudi', meta: 'Roots · 4 min', color: '#d9b45c', angle: 22 },
];

export function Scene3() {
  return (
    <motion.section
      className="scene-layer"
      initial={{ clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)' }}
      animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      exit={{ clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)' }}
      transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-[#123d32]" />
      <div className="grid-lines absolute inset-0 opacity-55" />
      <Signal left="82%" top="18%" /><Signal left="23%" top="76%" delay={.9} /><Signal left="57%" top="13%" delay={1.6} />
      <div className="relative z-10 flex h-full items-center justify-between px-[9vw]">
        <div className="w-[38vw]">
          <KineticText delay={.1}>
            <div className="eyebrow mb-[1vw] text-[.72vw] text-[var(--color-accent)]">02 / Find your next</div>
            <h2 className="display text-[4.5vw] font-semibold leading-[.95] tracking-[-.07em]">
              A whole world,<br /><span className="text-[var(--color-accent)]">one good turn.</span>
            </h2>
          </KineticText>
          <KineticText delay={.42} className="mt-[1.8vw] max-w-[28vw]">
            <p className="text-[1.04vw] leading-[1.45] text-[var(--color-text-secondary)]">
              Discover pavilions by mood, time, accessibility, or curiosity — not by getting lost in a map.
            </p>
          </KineticText>
          <div className="mt-[2.3vw] flex items-center gap-[1vw]">
            <MiniPill>16 pavilions</MiniPill>
            <span className="mono text-[.7vw] tracking-[.08em] text-[var(--color-text-muted)]">PERSONALIZED TO YOU</span>
          </div>
        </div>
        <PhoneFrame className="mr-[3vw] -rotate-2">
          <div className="h-full px-[1.1vw] pb-[1vw] pt-[2vw]">
            <div className="flex items-center justify-between"><span className="text-[.72vw] font-bold text-[#31584a]">Explore near you</span><span className="mono text-[.53vw] text-[#849b8d]">9:42 AM</span></div>
            <div className="relative mt-[1.35vw] h-[22vw] overflow-hidden rounded-[1vw] bg-[#dfe6d9]">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#93ae9c 1px,transparent 1px),linear-gradient(90deg,#93ae9c 1px,transparent 1px)', backgroundSize: '2.2vw 2.2vw' }} />
              <motion.div className="absolute left-[42%] top-[48%] h-[3.3vw] w-[3.3vw] rounded-full border-[.18vw] border-[#d19f42] bg-[#f8f2e3] p-[.7vw] shadow-lg" animate={{ scale: [1, 1.13, 1] }} transition={{ repeat: Infinity, duration: 2.2 }}>
                <div className="h-full w-full rounded-full bg-[#d19f42]" />
              </motion.div>
              {pavilions.map((pavilion, index) => (
                <motion.div key={pavilion.name} className="absolute" style={{ left: `${22 + index * 25}%`, top: `${27 + (index % 2) * 30}%`, rotate: pavilion.angle }} initial={{ opacity: 0, scale: .4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .65 + index * .18, duration: .5, type: 'spring' }}>
                  <div className="h-[1.55vw] w-[1.55vw] rounded-full border-[.16vw] border-[#f8f2e3] shadow-md" style={{ background: pavilion.color }} />
                  <div className="mt-[.28vw] whitespace-nowrap rounded-full bg-[#f8f2e3] px-[.5vw] py-[.22vw] text-[.5vw] font-semibold text-[#31584a] shadow-sm">{pavilion.name}</div>
                </motion.div>
              ))}
              <div className="absolute bottom-[.8vw] left-[.8vw] right-[.8vw] rounded-[.72vw] bg-[#f8f2e3]/90 px-[.7vw] py-[.58vw] backdrop-blur"><div className="flex items-center justify-between text-[.56vw] font-semibold text-[#31584a]"><span>Good for a calm morning</span><span className="text-[#d19f42]">→</span></div></div>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </motion.section>
  );
}