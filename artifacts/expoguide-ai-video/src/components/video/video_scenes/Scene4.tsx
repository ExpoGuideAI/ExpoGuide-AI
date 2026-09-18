import { motion } from 'framer-motion';
import { KineticText, MiniPill, Signal } from './ScenePrimitives';

export function Scene4() {
  return (
    <motion.section
      className="scene-layer"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(100% 0 0 0)' }}
      transition={{ duration: .85, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-[#092620]" />
      <div className="absolute -left-[10vw] top-[18vw] h-[28vw] w-[28vw] rounded-full bg-[#b76747]/20 blur-[4vw]" />
      <div className="absolute right-[3vw] -top-[9vw] h-[33vw] w-[33vw] rounded-full bg-[#d9b45c]/14 blur-[5vw]" />
      <Signal left="11%" top="26%" /><Signal left="88%" top="72%" delay={1} />
      <div className="relative z-10 flex h-full flex-col justify-center px-[10vw]">
        <div className="flex items-end justify-between">
          <div className="w-[37vw]">
            <KineticText delay={.1}>
              <div className="eyebrow mb-[1vw] text-[.72vw] text-[var(--color-accent)]">03 / Make time for wonder</div>
              <h2 className="display text-[4.45vw] font-semibold leading-[.95] tracking-[-.07em]">Eat well.<br /><span className="text-[var(--color-coral)]">Wait less.</span></h2>
            </KineticText>
            <KineticText delay={.42} className="mt-[1.7vw] max-w-[30vw]">
              <p className="text-[1.04vw] leading-[1.45] text-[var(--color-text-secondary)]">Know what’s open, what’s worth the walk, and whether the queue is moving before you move.</p>
            </KineticText>
          </div>
          <MiniPill tone="green">live now</MiniPill>
        </div>
        <div className="mt-[3vw] flex gap-[1.2vw]">
          {[
            { title: 'Saudi Table', sub: 'Najdi · 6 min', status: 'Open', accent: '#d9b45c', width: '24vw' },
            { title: 'Future Food Hall', sub: 'Global · 14 min', status: 'Busy', accent: '#e78159', width: '28vw' },
            { title: 'Japan Pavilion', sub: 'Queue · 08 min', status: 'Moving', accent: '#78c7a2', width: '20vw' },
          ].map((card, index) => (
            <motion.div key={card.title} className="glass rounded-[1.25vw] p-[1.25vw]" style={{ width: card.width }} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6 + index * .15, duration: .65, ease: [0.16, 1, 0.3, 1] }}>
              <div className="mb-[1.4vw] flex items-center justify-between"><span className="h-[2.15vw] w-[2.15vw] rounded-[.65vw]" style={{ background: `${card.accent}28` }} /><span className="mono text-[.6vw] uppercase tracking-[.12em]" style={{ color: card.accent }}>{card.status}</span></div>
              <h3 className="display text-[1.35vw] font-semibold">{card.title}</h3>
              <div className="mt-[.55vw] flex items-center justify-between"><span className="text-[.7vw] text-[var(--color-text-muted)]">{card.sub}</span><span className="text-[.8vw]" style={{ color: card.accent }}>↗</span></div>
              <div className="mt-[1.1vw] h-[.22vw] w-full overflow-hidden rounded-full bg-[#254b40]"><motion.div className="h-full rounded-full" style={{ background: card.accent }} initial={{ width: 0 }} animate={{ width: `${42 + index * 18}%` }} transition={{ delay: 1.1 + index * .16, duration: .7 }} /></div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}