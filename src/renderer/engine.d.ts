import Fragment from "./src/engine/fragment/fragment";
import { ClipShape } from "./src/engine/main/shapes";
import Vec2D from "./src/engine/main/vec2D";
import DynamicGrid from "./src/engine/ui/dynamicGrid";
export declare global {
  interface EngineConfig {
    update: () => void;
    setup: () => void;
    preload: () => void;
    render: () => void;
    fps: boolean;
    // preCollisionDetection: "QuadTree";
    // collisionDetection: "AABB";
  }
  interface FPSM {
    tick: () => void;
    show: () => void;
    hide: () => void;
  }

  interface FragmentType extends Fragment {}
  interface UIFrameType extends UIFrame {}
  interface DynamicGridType<T> extends DynamicGrid<T> {}
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
  interface ShapeSprite {
    sprite: ImageFileType;
    position: Vec2DType;
    size: Vec2DType;
    relatedTo?: Vec2DType;
    offset?: { x: number; y: number; w: number; h: number };
  }
  interface ShapeSpritesheet {
    spritesheet: ImageFileType;
    crop: { x: number; y: number };
    cropSize: { width: number; height: number };
    position: Vec2DType;
    size: Vec2DType;
    relatedTo?: Vec2DType;
    offset?: { x: number; y: number; w: number; h: number };
  }
  interface ShapeRect {
    position: Vec2DType;
    size: Vec2DType;
    relatedTo?: Vec2DType;
    offset?: { x: number; y: number; w: number; h: number };
    fill?: { color: [number, number, number]; alpha?: number };
    round?: number;
    stroke?: { size: number; color: [number, number, number] };
  }
  interface StaticGridConfiguration {
    numberOfCols: number;
    numberOfRows: number;
    startPoint: { x: number; y: number; relatedTo?: Vec2DType };
    sizeOfElement: { width: number; height: number };
    gap: { x: number; y: number };
  }
  interface DynamicGridConfiguration {
    maxRows: number;
    maxItems?: number;
    startPoint: { x: number; y: number; relatedTo?: Vec2DType };
    sizeOfElement: { width: number; height: number };
    gap: { x: number; y: number };
    numberOfItems: number;
  }
  interface ClipShapeType extends ClipShape {}
}
