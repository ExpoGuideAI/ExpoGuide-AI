import {
  VideoPausedContext,
  VideoCanvas,
  type VideoAspectRatio,
  useVideoPlayer,
} from '@/lib/video';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, type ComponentType } from 'react';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { asset } from './video_scenes/ScenePrimitives';

export const SCENE_DURATIONS = {
  intro: 5200,
  assistant: 5800,
  discover: 5600,
  dining: 5100,
  route: 5200,
  close: 6000,
};

const VIDEO_ASPECT_RATIO: VideoAspectRatio = '16:9';

const SCENE_COMPONENTS: Record<string, ComponentType> = {
  intro: Scene1,
  assistant: Scene2,
  discover: Scene3,
  dining: Scene4,
  route: Scene5,
  close: Scene6,
};

const SCENE_START_SEC: Record<string, number> = (() => {
  const offsets: Record<string, number> = {};
  let cumulativeMs = 0;
  for (const [key, duration] of Object.entries(SCENE_DURATIONS)) {
    offsets[key] = cumulativeMs / 1000;
    cumulativeMs += duration;
  }
  return offsets;
})();

const AUDIO_SEEK_EPSILON_SEC = 0.18;

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  paused = false,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  paused?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop, paused });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSceneKeyRef = useRef<string | null>(null);
  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;

    if (paused) {
      audio.pause();
      return;
    }

    if (lastSceneKeyRef.current !== currentSceneKey) {
      lastSceneKeyRef.current = currentSceneKey;
      const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
      if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON_SEC) {
        audio.currentTime = targetTime;
      }
    }
    audio.play().catch(() => {});
  }, [baseSceneKey, currentSceneKey, muted, paused]);

  return (
    <VideoPausedContext.Provider value={paused}>
      <VideoCanvas
        aspectRatio={VIDEO_ASPECT_RATIO}
        className="video-root"
        style={{ backgroundColor: 'var(--color-bg-light)' }}
      >
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute -left-[12vw] -top-[18vw] h-[52vw] w-[52vw] rounded-full bg-[#0d5c46]/30 blur-[6vw]"
            animate={{
              x: sceneIndex % 2 === 0 ? '0vw' : '12vw',
              y: sceneIndex > 2 ? '13vw' : '0vw',
              scale: sceneIndex === 5 ? 1.25 : 1,
            }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute -bottom-[20vw] right-[0vw] h-[55vw] w-[55vw] rounded-full bg-[#d9b45c]/10 blur-[7vw]"
            animate={{
              x: sceneIndex % 2 === 0 ? '0vw' : '-8vw',
              y: sceneIndex === 4 ? '-15vw' : '0vw',
              scale: sceneIndex === 3 ? 1.22 : 1,
            }}
            transition={{ duration: 1.55, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.img
            src={asset('riyadh-night-grid.png')}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[.06] mix-blend-screen"
            animate={{
              scale: [1.02, 1.06, 1.02],
              x: ['0vw', '-1vw', '0vw'],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <motion.div
          className="pointer-events-none absolute right-[5vw] top-[4vw] z-30 flex items-center gap-[.75vw]"
          animate={{
            opacity: sceneIndex === 5 ? 0.9 : 0.56,
            x: sceneIndex === 0 ? 0 : 2,
          }}
          transition={{ duration: 0.6 }}
        >
          <span className="mono text-[.58vw] uppercase tracking-[.18em] text-[var(--color-text-secondary)]">
            EXPOGUIDE AI
          </span>
          <span className="h-[.42vw] w-[.42vw] rounded-full bg-[var(--color-accent)]" />
        </motion.div>
        <AnimatePresence mode="sync" initial={false}>
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
        <audio
          ref={audioRef}
          src={`${import.meta.env.BASE_URL}audio/bg_music.mp3`}
          preload="auto"
          autoPlay
          muted={muted}
        />
      </VideoCanvas>
    </VideoPausedContext.Provider>
  );
}
