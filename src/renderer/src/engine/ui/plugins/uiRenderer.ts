import { ctx } from "../../main/engine";
import { renderRect, renderSprite, renderSpriteSheet } from "../../main/shapes";
import UIPlugin from "./uiPlugin";
type DisplayT = "shape" | "sprite" | "spritesheet";
type displayConfig = SpriteConfiguration | SpritesheetConfiguration | ShapeConfiguration;
interface SpriteConfiguration {
  sprite: ImageFileType;
}

export interface SpritesheetConfiguration {
  spritesheet: ImageFileType;
  crop: { x: number; y: number };
  cropSize: { width: number; height: number };
}
interface ShapeConfiguration {
  fill?: { color: [number, number, number]; alpha?: number };
  round?: number;
  stroke?: { size: number; color: [number, number, number] };
}

export default class UiRenderer extends UIPlugin {
  protected debug: boolean;
  protected offset: { x: number; y: number; w: number; h: number };
  protected displayType?: DisplayT;
  renderConfig!: displayConfig;
  constructor({ position, size, siblings, referanceName, relatedTo }) {
    super(position, size, siblings, referanceName, relatedTo);
    this.debug = false;
    this.offset = { x: 0, y: 0, w: 0, h: 0 };
  }
  display(type: DisplayT, config: displayConfig) {
    this.displayType = type;
    this.renderConfig = config;
  }

  render() {
    switch (this.displayType) {
      case "shape":
        renderRect({
          position: this.position,
          size: this.size,
          offset: this.offset,
          relatedTo: this.relatedTo,
          ...this.renderConfig
        });
        break;
      case "sprite":
        renderSprite({
          position: this.position,
          size: this.size,
          offset: this.offset,
          relatedTo: this.relatedTo,
          ...this.renderConfig
        } as ShapeSprite);
        break;
      case "spritesheet":
        renderSpriteSheet({
          position: this.position,
          size: this.size,
          offset: this.offset,
          relatedTo: this.relatedTo,
          ...this.renderConfig
        } as ShapeSpritesheet);
        break;
    }

    this.debug && this.renderDebugWindow();
  }

  change(props: displayConfig) {
    this.renderConfig = { ...this.renderConfig, ...props };
  }
  setup() {
    if (!this.displayType || !this.displayType)
      throw new Error("rendered need to call a display()");
  }
  offsetVector(offset: { x: number; y: number; w: number; h: number }) {
    this.offset = offset;
  }

  renderDebugWindow() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(0, 255, 0)";
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.roundRect(
      this.position.getRound().x + this.offset.x + 1,
      this.position.getRound().y + this.offset.y + 1,
      this.size.get().x + this.offset.w - 2,
      this.size.get().y + this.offset.h - 2,
      0
    );
    ctx.fillRect(
      this.position.getRound().x + this.offset.x + this.size.get().x / 2 - 1,
      this.position.getRound().y + this.offset.y + this.size.get().y / 2 - 1,
      2,
      2
    );
    ctx.stroke();
    ctx.font = `${this.size.get().x / 2 - this.size.get().x / 4}px Arial`;
    ctx.fillText(
      "ID",
      this.position.getRound().x + this.offset.x + 4,
      this.position.getRound().y + this.offset.y + this.size.get().x / 2 - this.size.get().x / 4,
      this.size.get().x - this.size.get().x / 8
    );
    ctx.closePath();
  }
}
