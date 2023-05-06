export interface EngineConfig {
  update: () => void;
  setup: () => void;
  preload: () => void;
  render: () => void;
  fps: boolean;
}
export interface FPSM {
  tick: () => void;
  show: () => void;
  hide: () => void;
}
