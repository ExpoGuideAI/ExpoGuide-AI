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

export const SCENE_DURATIONS = {
  scene1: 8000,
  scene2: 14000,
  scene3: 8000,
  scene4: 10000,
};

const VIDEO_ASPECT_RATIO: VideoAspectRatio = '16:9';

const SCENE_COMPONENTS: Record<string, ComponentType> = {
  scene1: Scene1,
  scene2: Scene2,
  scene3: Scene3,
  scene4: Scene4,
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
        style={{ backgroundColor: 'var(--color-bg-main)' }}
      >
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Drifting Pastel Shapes */}
          <motion.div
            className="absolute top-[-10vw] left-[-10vw] h-[50vw] w-[50vw] rounded-full bg-[var(--color-blue)] opacity-50 blur-[8vw]"
            animate={{
              x: sceneIndex % 2 === 0 ? '5vw' : '15vw',
              y: sceneIndex > 1 ? '10vw' : '0vw',
              scale: sceneIndex === 3 ? 1.2 : 1,
            }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[-15vw] right-[-5vw] h-[60vw] w-[60vw] rounded-full bg-[var(--color-mint)] opacity-50 blur-[9vw]"
            animate={{
              x: sceneIndex % 2 === 0 ? '0vw' : '-10vw',
              y: sceneIndex === 2 ? '-15vw' : '0vw',
              scale: sceneIndex === 1 ? 1.1 : 1,
            }}
            transition={{ duration: 3.5, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-[30vw] left-[40vw] h-[40vw] w-[40vw] rounded-full bg-[var(--color-coral)] opacity-40 blur-[7vw]"
            animate={{
              x: sceneIndex === 0 ? '0vw' : '10vw',
              y: sceneIndex === 3 ? '-20vw' : '10vw',
              scale: sceneIndex % 2 === 0 ? 1 : 1.3,
            }}
            transition={{ duration: 4, ease: 'easeInOut' }}
          />
        </div>
        
        {/* Persistent Brand Watermark */}
        <motion.div
          className="pointer-events-none absolute top-[3vw] left-[4vw] z-30 flex items-center gap-[1vw]"
          animate={{
            opacity: sceneIndex === 3 ? 0 : 0.8,
            y: sceneIndex === 0 ? 0 : '1vw'
          }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}assets/expo2030-logo.png`} 
            alt="Expo 2030" 
            className="h-[3.5vw] object-contain" 
          />
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
