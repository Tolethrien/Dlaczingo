import { ctx } from "../../main/engine";
import { renderDebugerFrame, renderRect, renderSprite, renderSpriteSheet } from "../../main/shapes";
import Plugin from "./plugin";
type DisplayT = "shape" | "sprite" | "spritesheet";
type DisplayConfig = SpriteConfiguration | SpritesheetConfiguration | ShapeConfiguration;
interface SpriteConfiguration {
  sprite: ImageFileType;
  debugText: string | number;
  offset: { x: number; y: number; w: number; h: number };
}

export interface SpritesheetConfiguration {
  spritesheet: ImageFileType;
  crop: { x: number; y: number };
  cropSize: { width: number; height: number };
  debugText: string | number;
  offset: { x: number; y: number; w: number; h: number };
}
interface ShapeConfiguration {
  fill?: { color: [number, number, number]; alpha?: number };
  round: number;
  stroke?: { size: number; color: [number, number, number] };
  debugText: string | number;
  offset: { x: number; y: number; w: number; h: number };
}

export default class MultiRenderer extends Plugin {
  protected debug: boolean;
  protected displayType?: DisplayT;
  //   renderConfig!: displayConfig;
  rendererList: { type: DisplayT; config: DisplayConfig }[];
  constructor(pluginProps: PluginProps) {
    super(pluginProps);
    this.debug = false;
    this.rendererList = [];
  }
  addShape(type: DisplayT, obj: DisplayConfig) {
    this.rendererList.push({ type, config: obj });
  }
  getConfigFromIndex(index: number | undefined) {
    if (index === undefined) throw new Error("no index given");
    return this.rendererList[index].config;
  }
  render() {
    this.rendererList.forEach((e) => {
      switch (e.type) {
        case "shape":
          renderRect({
            position: this.position,
            size: this.size,
            relatedTo: this.relatedTo,
            ...e.config
          } as ShapeRect);
          break;
        case "sprite":
          renderSprite({
            position: this.position,
            size: this.size,
            relatedTo: this.relatedTo,
            ...e.config
          } as ShapeSprite);
          break;
        case "spritesheet":
          renderSpriteSheet({
            position: this.position,
            size: this.size,
            relatedTo: this.relatedTo,
            ...e.config
          } as ShapeSpritesheet);
          break;
      }
      this.debug &&
        renderDebugerFrame({
          position: this.position,
          size: this.size,
          offset: e.config.offset,
          relatedTo: this.relatedTo,
          text: e.config.debugText as string
        });
    });
  }
}
