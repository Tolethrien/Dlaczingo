import Fragment from "./src/engine/fragment/fragment";
import Vec2D from "./src/engine/main/vec2D";
export declare global {
  declare interface EngineConfig {
    update: () => void;
    setup: () => void;
    preload: () => void;
    render: () => void;
    fps: boolean;
  }
  declare interface FPSM {
    tick: () => void;
    show: () => void;
    hide: () => void;
  }
  declare interface SataProps {
    value: string;
    type: number;
  }
  declare interface FragmentType extends Fragment {}
  declare interface FragmentProps {
    pos: { x: number; y: number };
    size: { width: number; height: number };
    layer: "gameObjects" | "uiObjects" | "mapObjects" | "cameraObject" | "independent";
    tag: string;
    targetDistanceMessuring?: string;
  }
  declare interface AudioFileType {
    play: () => void;
    loop: boolean;
    volume: number;
  }
  declare interface ImageFileType {}
  declare interface Vec2DType extends Vec2D {}
}
