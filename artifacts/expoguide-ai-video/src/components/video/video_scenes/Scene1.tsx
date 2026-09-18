import { motion } from 'framer-motion';
import { KineticText, Signal, asset } from './ScenePrimitives';

export function Scene1() {
  return (
    <motion.section
      className="scene-layer"
      initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
      animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      exit={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(217,180,92,.2),transparent_34%),linear-gradient(120deg,rgba(7,28,24,.72),rgba(12,64,48,.32))]" />
      <motion.img
        src={asset('riyadh-night-grid.png')}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen"
        initial={{ scale: 1.13, x: '2vw' }}
        animate={{ scale: 1.02, x: '-1vw' }}
        transition={{ duration: 7.5, ease: 'linear' }}
      />
      <div className="grid-lines absolute inset-0 opacity-40" />
      <Signal left="67%" top="23%" delay={0.2} />
      <Signal left="78%" top="61%" delay={1.2} />
      <Signal left="44%" top="74%" delay={0.6} />
      <div className="relative z-10 flex h-full flex-col justify-center pl-[10vw]">
        <motion.img
          src={asset('expo2030-logo.png')}
          alt="Riyadh Expo 2030"
          className="mb-[2vw] h-[7.2vw] w-[7.2vw] object-contain object-top mix-blend-screen"
          initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: 'backOut' }}
        />
        <KineticText delay={0.22} className="max-w-[53vw]">
          <div className="eyebrow mb-[1.1vw] text-[.78vw] text-[var(--color-accent)]">
            A human way through Riyadh
          </div>
          <h1 className="display text-[6.8vw] font-semibold leading-[.9] tracking-[-.075em] text-[#f5f0df]">
            ExpoGuide
            <span className="text-[var(--color-accent)]"> AI</span>
          </h1>
        </KineticText>
        <KineticText delay={0.55} className="mt-[1.8vw] max-w-[34vw]">
          <p className="text-[1.3vw] leading-[1.35] text-[var(--color-text-secondary)]">
            Riyadh Expo 2030, in your language.
          </p>
          <p className="mono mt-[1.1vw] text-[.72vw] uppercase tracking-[.15em] text-[var(--color-accent)]">
            عربي&nbsp;&nbsp;·&nbsp;&nbsp;English
          </p>
        </KineticText>
      </div>
      <motion.div
        className="absolute bottom-[5vw] right-[8vw] h-[11vw] w-[11vw] rounded-full border border-[rgba(217,180,92,.35)]"
        animate={{ scale: [1, 1.16, 1], rotate: [0, 90, 180] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-[1vw] rounded-full border border-dashed border-[rgba(217,180,92,.4)]" />
        <div className="absolute left-1/2 top-1/2 h-[.7vw] w-[.7vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]" />
      </motion.div>
    </motion.section>
  );
}