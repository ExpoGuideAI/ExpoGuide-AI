import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export const asset = (name: string) =>
  `${import.meta.env.BASE_URL}assets/${name}`;

export function KineticText({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: '2.5vw', filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: '-1.5vw', filter: 'blur(8px)' }}
      transition={{ delay, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Signal({
  left = '8%',
  top = '18%',
  delay = 0,
}: {
  left?: string;
  top?: string;
  delay?: number;
}) {
  return (
    <motion.span
      className="absolute h-[.55vw] w-[.55vw] rounded-full bg-[var(--color-accent)]"
      style={{ left, top, boxShadow: '0 0 0 .35vw rgba(243,201,105,.12)' }}
      animate={{ scale: [1, 1.5, 1], opacity: [0.45, 1, 0.45] }}
      transition={{ duration: 2.8, repeat: Infinity, delay }}
    />
  );
}

export function PhoneFrame({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: '3vw', rotate: 3 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 1.06, rotate: -2 }}
      transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`phone-shell relative aspect-[.53] w-[24vw] max-w-[25rem] rounded-[2.8vw] p-[.55vw] ${className}`}
    >
      <div className="absolute left-1/2 top-[.55vw] z-10 h-[1.1vw] w-[7vw] -translate-x-1/2 rounded-full bg-[#102a24]" />
      <div className="phone-screen h-full w-full overflow-hidden rounded-[2.35vw]">
        {children}
      </div>
    </motion.div>
  );
}

export function MiniPill({
  children,
  tone = 'gold',
}: {
  children: ReactNode;
  tone?: 'gold' | 'green' | 'coral';
}) {
  const colors = {
    gold: 'rgba(217,180,92,.16)',
    green: 'rgba(120,199,162,.16)',
    coral: 'rgba(231,129,89,.16)',
  };
  return (
    <span
      className="mono inline-flex items-center gap-[.4vw] rounded-full px-[.72vw] py-[.35vw] text-[.62vw] font-medium uppercase tracking-[.12em]"
      style={{ color: tone === 'coral' ? '#f2aa8d' : tone === 'green' ? '#a5ddbc' : '#f3d68c', background: colors[tone] }}
    >
      <span className="h-[.32vw] w-[.32vw] rounded-full bg-current" />
      {children}
    </span>
  );
}