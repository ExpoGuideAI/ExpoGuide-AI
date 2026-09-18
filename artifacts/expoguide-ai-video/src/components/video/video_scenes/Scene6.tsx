import { motion } from 'framer-motion';
import { KineticText, MiniPill, Signal, asset } from './ScenePrimitives';

export function Scene6() {
  return (
    <motion.section
      className="scene-layer"
      initial={{ opacity: 0, scale: .96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,#1a664d_0%,#0b2c24_40%,#071b19_100%)]" />
      <div className="grid-lines absolute inset-0 opacity-25" />
      <Signal left="17%" top="21%" /><Signal left="79%" top="79%" delay={.7} /><Signal left="52%" top="12%" delay={1.5} />
      <div className="relative z-10 flex h-full items-center justify-between px-[11vw]">
        <div className="w-[47vw]">
          <motion.img src={asset('expo2030-logo.png')} alt="Riyadh Expo 2030" className="mb-[1.5vw] h-[5.3vw] w-[5.3vw] object-contain object-top mix-blend-screen" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18, duration: .6 }} />
          <KineticText delay={.28}>
            <h2 className="display text-[5.7vw] font-semibold leading-[.9] tracking-[-.08em]">Go further<br /><span className="text-[var(--color-accent)]">with a guide.</span></h2>
          </KineticText>
          <KineticText delay={.66} className="mt-[1.6vw]">
            <p className="max-w-[26vw] text-[1.08vw] leading-[1.4] text-[var(--color-text-secondary)]">One app for the Expo that’s waiting to be explored.</p>
            <div className="mt-[1.7vw] flex items-center gap-[.8vw]"><MiniPill>expo guide ai</MiniPill><span className="mono text-[.66vw] uppercase tracking-[.16em] text-[var(--color-text-muted)]">scan to enter</span></div>
          </KineticText>
        </div>
        <motion.div className="flex flex-col items-center" initial={{ opacity: 0, scale: .6, rotate: 8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: .4, duration: 1, type: 'spring', stiffness: 160, damping: 20 }}>
          <div className="qr-frame w-[16.5vw] rounded-[1.35vw] p-[.9vw]"><img src={asset('expo-guide-qr.png')} alt="Scan to open ExpoGuide AI" className="block w-full" /></div>
          <motion.div className="mt-[1.5vw] rounded-full border border-[rgba(217,180,92,.42)] px-[1.1vw] py-[.55vw] text-center" animate={{ y: ['0vw', '-.35vw', '0vw'] }} transition={{ duration: 2.2, repeat: Infinity }}><span className="mono text-[.65vw] uppercase tracking-[.18em] text-[var(--color-accent)]">Scan to explore</span></motion.div>
        </motion.div>
      </div>
      <motion.div className="absolute bottom-[2.4vw] left-1/2 -translate-x-1/2 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15, duration: .6 }}>
        <div className="mono text-[.62vw] uppercase tracking-[.18em] text-[var(--color-text-muted)]">A bilingual guide for Riyadh Expo 2030</div>
      </motion.div>
    </motion.section>
  );
}