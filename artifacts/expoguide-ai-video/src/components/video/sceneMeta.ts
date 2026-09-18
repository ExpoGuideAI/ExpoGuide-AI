export interface SceneDetails {
  title: string;
  filePath: string;
}

export const SCENE_DETAILS: Record<string, SceneDetails> = {
  scene1: { title: 'Welcome & Hook', filePath: 'src/components/video/video_scenes/Scene1.tsx' },
  scene2: { title: 'Feature Walkthrough', filePath: 'src/components/video/video_scenes/Scene2.tsx' },
  scene3: { title: 'Core Values', filePath: 'src/components/video/video_scenes/Scene3.tsx' },
  scene4: { title: 'Call to Action', filePath: 'src/components/video/video_scenes/Scene4.tsx' },
};
