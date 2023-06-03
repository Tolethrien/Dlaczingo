import Fragment from "./src/engine/fragment/fragment";
import UIElement from "./src/engine/ui/uiElement";
import Vec2D from "./src/engine/main/vec2D";
export declare global {
  interface EngineConfig {
    update: () => void;
    setup: () => void;
    preload: () => void;
    render: () => void;
    fps: boolean;
  }
  interface FPSM {
    tick: () => void;
    show: () => void;
    hide: () => void;
  }

  interface FragmentType extends Fragment {}
  interface UIElementType extends UIElement {}
  interface FragmentProps {
    pos: { x: number; y: number };
    size: { width: number; height: number };
    layer: FragmentLayer;
    tags: string[];
    targetDistanceMessuring?: string;
    relatedTo?: Vec2DType;
  }
  type FragmentLayer = "gameObjects" | "uiObjects" | "mapObjects" | "cameraObject" | "independent";
  interface AudioFileType {
    play: () => void;
    loop: boolean;
    volume: number;
  }
  interface ImageFileType {}
  interface Vec2DType extends Vec2D {}
}
