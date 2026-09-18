import { motion } from 'framer-motion';
import { KineticText, MiniPill, PhoneFrame, Signal, asset } from './ScenePrimitives';

export function Scene2() {
  return (
    <motion.section
      className="scene-layer"
      initial={{ clipPath: 'circle(0% at 82% 18%)' }}
      animate={{ clipPath: 'circle(120% at 82% 18%)' }}
      exit={{ clipPath: 'circle(0% at 82% 18%)' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-[#0b2922]" />
      <div className="absolute -right-[8vw] -top-[12vw] h-[45vw] w-[45vw] rounded-full border border-[rgba(217,180,92,.24)]" />
      <div className="absolute -right-[3vw] -top-[7vw] h-[35vw] w-[35vw] rounded-full border border-dashed border-[rgba(217,180,92,.18)]" />
      <Signal left="14%" top="24%" /><Signal left="34%" top="78%" delay={1.1} />
      <div className="relative z-10 flex h-full items-center gap-[7vw] px-[10vw]">
        <div className="w-[39vw]">
          <KineticText delay={0.15}>
            <div className="eyebrow mb-[1.2vw] text-[.72vw] text-[var(--color-accent)]">01 / Ask naturally</div>
            <h2 className="display text-[4.5vw] font-semibold leading-[.94] tracking-[-.065em]">
              Your guide.<br /><span className="text-[var(--color-accent)]">In both worlds.</span>
            </h2>
          </KineticText>
          <KineticText delay={0.45} className="mt-[2vw] max-w-[29vw]">
            <p className="text-[1.06vw] leading-[1.45] text-[var(--color-text-secondary)]">
              Ask about a pavilion, a prayer room, or the best route for your family. ExpoGuide AI listens in English and Arabic.
            </p>
          </KineticText>
          <motion.div className="mt-[2.3vw] flex gap-[.7vw]" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .95, duration: .55 }}>
            <MiniPill>voice ready</MiniPill><MiniPill tone="green">عربي</MiniPill>
          </motion.div>
        </div>
        <PhoneFrame className="translate-y-[1vw]">
          <div className="flex h-full flex-col px-[1.25vw] pb-[1vw] pt-[2vw]">
            <div className="flex items-center justify-between">
              <span className="display text-[1vw] font-bold">ExpoGuide <span className="text-[#d19f42]">AI</span></span>
              <span className="h-[1.8vw] w-[1.8vw] rounded-full bg-[#dbe7d7] p-[.45vw]"><img src={asset('expo2030-logo.png')} alt="" className="h-full w-full object-contain" /></span>
            </div>
            <motion.div className="mt-[2.1vw] rounded-[1vw] bg-[#e3dfd1] px-[1vw] py-[.82vw] text-[.72vw] leading-[1.35] text-[#31584a]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .7 }}>
              Which pavilion is best for a quiet morning?
            </motion.div>
            <motion.div className="mt-[.8vw] self-end rounded-[1vw] rounded-br-[.25vw] bg-[#116b4e] px-[1vw] py-[.82vw] text-[.72vw] leading-[1.35] text-[#f7f1df]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.08 }}>
              I’d start with Japan —<br />calm, thoughtful, 8 min away.
            </motion.div>
            <motion.div className="mt-auto rounded-[.9vw] border border-[#c9d0c0] bg-[#edf0e7] px-[.9vw] py-[.72vw]" animate={{ y: [0, -.2, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <div className="flex items-center gap-[.6vw]"><span className="h-[1.4vw] w-[1.4vw] rounded-full bg-[#d19f42]" /><span className="text-[.62vw] font-semibold text-[#31584a]">Try “Where should I go next?”</span></div>
            </motion.div>
          </div>
        </PhoneFrame>
      </div>
    </motion.section>
  );
}