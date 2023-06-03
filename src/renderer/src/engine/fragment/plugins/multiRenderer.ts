import { ctx } from "../../main/engine";
import Plugin from "./plugin";
type DisplayT = "shape" | "sprite" | "spritesheet";
type displayConfig = SpriteConfiguration | SpritesheetConfiguration | ShapeConfiguration;
interface SpriteConfiguration {
  sprite: ImageFileType;
  debugText: string | number;
}

export interface SpritesheetConfiguration {
  spritesheet: ImageFileType;
  crop: { x: number; y: number };
  cropSize: { width: number; height: number };
  debugText: string | number;
}
interface ShapeConfiguration {
  fill?: { color: [number, number, number]; alpha?: number };
  round: number;
  stroke?: { size: number; color: [number, number, number] };
  debugText: string | number;
}

export default class MultiRenderer extends Plugin {
  protected debug: boolean;
  protected offset: { x: number; y: number; w: number; h: number };
  protected displayType?: DisplayT;
  renderConfig!: displayConfig;
  constructor(pluginProps: PluginProps) {
    super(pluginProps);
    this.debug = false;
    this.offset = { x: 0, y: 0, w: 0, h: 0 };
    this.debug = true;
    this.renderObjects = [];
  }
  addShape(shape) {
    this.renderObjects.push({ crop: shape.crop, cropSize: shape.cropSize });
  }
  setSpritesheet(img) {
    this.spritesheet = img;
  }
  render() {
    this.renderObjects.forEach((e) => this.renderSprite(e));
    this.debug && this.renderDebugWindow();
  }
  createShape() {}
  display(type, config) {
    this.displayType = type;
    this.e = config;
    // console.log(this.style.spritesheet);
  }
}
