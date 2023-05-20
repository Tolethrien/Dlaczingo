import Fragment from "./src/engine/fragment/fragment";
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
}
