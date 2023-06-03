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

export default class Renderer extends Plugin {
  protected debug: boolean;
  protected offset: { x: number; y: number; w: number; h: number };
  protected displayType?: DisplayT;
  renderConfig!: displayConfig;
  constructor(pluginProps: PluginProps) {
    super(pluginProps);
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
        this.renderRect();
        break;
      case "sprite":
        this.renderSprite();
        break;
      case "spritesheet":
        this.renderSpriteSheet();
        break;
    }

    this.debug && this.renderDebugerFrame();
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
  private renderSprite() {
    ctx.drawImage(
      (this.renderConfig as SpriteConfiguration).sprite as HTMLImageElement,
      (this.relatedTo ? this.relatedTo.getRound().x : 0) +
        this.position.getRound().x +
        (this.offset ? this.offset.x : 0),
      (this.relatedTo ? this.relatedTo.getRound().y : 0) +
        this.position.getRound().y +
        (this.offset ? this.offset.y : 0),
      this.size.get().x + (this.offset ? this.offset.w : 0),
      this.size.get().y + (this.offset ? this.offset.h : 0)
    );
  }
  private renderSpriteSheet() {
    if ("spritesheet" in this.renderConfig) {
      ctx.drawImage(
        this.renderConfig.spritesheet as HTMLImageElement,
        this.renderConfig.crop.x,
        this.renderConfig.crop.y,
        this.renderConfig.cropSize.width,
        this.renderConfig.cropSize.height,
        (this.relatedTo ? this.relatedTo.getRound().x : 0) +
          this.position.getRound().x +
          (this.offset ? this.offset.x : 0),
        (this.relatedTo ? this.relatedTo.getRound().y : 0) +
          this.position.getRound().y +
          (this.offset ? this.offset.y : 0),
        this.size.get().x + (this.offset ? this.offset.w : 0),
        this.size.get().y + (this.offset ? this.offset.h : 0)
      );
    }
  }
  private renderRect() {
    if ("round" in this.renderConfig) {
      ctx.beginPath();
      if (this.renderConfig.fill) {
        ctx.fillStyle = `rgba(${this.renderConfig.fill.color}, ${
          this.renderConfig.fill.alpha ?? 1
        })`;
        ctx.roundRect(
          (this.relatedTo ? this.relatedTo.getRound().x : 0) +
            this.position.getRound().x +
            (this.offset ? this.offset.x : 0) +
            (this.renderConfig.stroke ? 1 : 0),
          (this.relatedTo ? this.relatedTo.getRound().y : 0) +
            this.position.getRound().y +
            (this.offset ? this.offset.y : 0) +
            (this.renderConfig.stroke ? 1 : 0),
          this.size.get().x +
            (this.offset ? this.offset.w : 0) -
            (this.renderConfig.stroke ? 2 : 0),
          this.size.get().y +
            (this.offset ? this.offset.h : 0) -
            (this.renderConfig.stroke ? 2 : 0),
          this.renderConfig.round ?? 0
        );
        ctx.fill();
      }
      // drawing stroke with this.offset to inside
      if (this.renderConfig.stroke) {
        ctx.lineWidth = this.renderConfig.stroke.size;
        ctx.strokeStyle = `rgba(${this.renderConfig.stroke.color})`;
        ctx.roundRect(
          (this.relatedTo ? this.relatedTo.getRound().x : 0) +
            this.position.getRound().x +
            (this.offset ? this.offset.x : 0) +
            this.renderConfig.stroke.size / 2,
          (this.relatedTo ? this.relatedTo.getRound().y : 0) +
            this.position.getRound().y +
            (this.offset ? this.offset.y : 0) +
            this.renderConfig.stroke.size / 2,
          this.size.get().x + (this.offset ? this.offset.w : 0) - this.renderConfig.stroke.size,
          this.size.get().y + (this.offset ? this.offset.h : 0) - this.renderConfig.stroke.size,
          this.renderConfig.round ?? 0
        );
        ctx.stroke();
      }
      ctx.closePath();
    }
  }
  private renderDebugerFrame() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    //stroke
    ctx.strokeStyle = "rgb(100, 255, 0)";
    //dot
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.roundRect(
      (this.relatedTo ? this.relatedTo.getRound().x : 0) +
        this.position.getRound().x +
        (this.offset ? this.offset.x : 0),
      (this.relatedTo ? this.relatedTo.getRound().y : 0) +
        this.position.getRound().y +
        (this.offset ? this.offset.y : 0),
      this.size.get().x + (this.offset ? this.offset.w : 0) - 2,
      this.size.get().y + (this.offset ? this.offset.h : 0) - 2,
      0
    );
    ctx.fillRect(
      (this.relatedTo ? this.relatedTo.getRound().x : 0) +
        this.position.getRound().x +
        (this.offset ? this.offset.x : 0) +
        this.size.get().x / 2 -
        1,
      (this.relatedTo ? this.relatedTo.getRound().y : 0) +
        this.position.getRound().y +
        (this.offset ? this.offset.y : 0) +
        this.size.get().y / 2 -
        1,
      2,
      2
    );
    ctx.stroke();
    ctx.font = `${this.size.get().x / 2 - this.size.get().x / 4}px Arial`;
    ctx.fillText(
      this.renderConfig.debugText as string,
      (this.relatedTo ? this.relatedTo.getRound().x : 0) +
        this.position.getRound().x +
        (this.offset ? this.offset.x : 0) +
        4,
      (this.relatedTo ? this.relatedTo.getRound().y : 0) +
        this.position.getRound().y +
        (this.offset ? this.offset.y : 0) +
        this.size.get().x / 2 -
        this.size.get().x / 5,
      this.size.get().x - this.size.get().x / 8
    );
    ctx.closePath();
  }
}
