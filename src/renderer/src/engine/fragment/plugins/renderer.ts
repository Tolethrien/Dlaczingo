import { ctx } from "../../main/engine";
import Plugin from "./plugin";
type DisplayT = "shape" | "sprite" | "spritesheet";
type StyleI = SpriteI | ShapeI | SpriteSheetI;
interface SpriteI {
  sprite: HTMLImageElement;
}
interface SpriteSheetI {
  spritesheet: HTMLImageElement;
  crop: { x: number; y: number };
  cropSize: { width: number; height: number };
}
interface ShapeI {
  color?: [number, number, number];
  alpha?: number;
  round?: number;
  stroke?: { size: number; color: [number, number, number] };
}
export interface RendererType extends Renderer {}

export default class Renderer extends Plugin {
  protected debug: boolean;
  protected offset: { x: number; y: number; w: number; h: number };
  protected displayType?: DisplayT;
  protected style?: StyleI;
  constructor({ position, size, siblings, referanceName }) {
    super(position, size, siblings, referanceName);
    this.debug = false;
    this.offset = { x: 0, y: 0, w: 0, h: 0 };
  }
  display(type: DisplayT, config: StyleI) {
    this.displayType = type;
    this.style = config;
  }

  render() {
    this.displayType === "shape" ? this.renderShape() : this.renderSprite();
    this.debug && this.renderDebugWindow();
  }

  change(props: Partial<ShapeI>) {
    Object.entries(props).forEach((e) => (this.style![e[0]] = e[1]));
    // {...object,...props}
    // this.style[property] = value;
  }
  setup() {
    if (!this.displayType || !this.style) throw new Error("rendered need to call a display()");
  }
  offsetVector(offset: { x: number; y: number; w: number; h: number }) {
    this.offset = offset;
  }
  renderSprite() {
    //render spritesheet
    if ("spritesheet" in this.style!) {
      ctx.save();
      ctx.drawImage(
        this.style.spritesheet,
        this.style.crop.x,
        this.style.crop.y,
        this.style.cropSize.width,
        this.style.cropSize.height,
        this.position.get().x + this.offset.x,
        this.position.get().y + this.offset.y,
        this.size.get().x + this.offset.w,
        this.size.get().y + this.offset.h
      );
      ctx.restore();
    }
    //render Static Sprite
    if ("sprite" in this.style!) {
      ctx.save();
      ctx.drawImage(
        this.style!.sprite,
        this.position.get().x + this.offset.x,
        this.position.get().y + this.offset.y,
        this.size.get().x + this.offset.w,
        this.size.get().y + this.offset.h
      );
      ctx.restore();
    }
  }

  renderShape() {
    if ("color" in this.style!) {
      ctx.save();
      // drawing fill rect
      // ctx.filter = "brightness(350%)";
      this.style!.color &&
        ((ctx.fillStyle = `rgba(${
          this.style.color[0] +
          "," +
          this.style.color[1] +
          "," +
          this.style.color[2] +
          "," +
          this.style.alpha
        })`),
        ctx.beginPath(),
        ctx.roundRect(
          this.position.get().x + +this.offset.x + (this.style.stroke ? 1 : 0),
          this.position.get().y + this.offset.y + (this.style.stroke ? 1 : 0),
          this.size.get().x + this.offset.w - (this.style.stroke ? 2 : 0),
          this.size.get().y + this.offset.h - (this.style.stroke ? 2 : 0),
          this.style.round ? this.style.round : 0
        ),
        ctx.fill(),
        ctx.closePath());
      // drawing stroke with this.offset to inside
      this.style.stroke &&
        ((ctx.lineWidth = this.style.stroke.size),
        (ctx.strokeStyle = `rgba(${
          this.style.stroke.color[0] +
          "," +
          this.style.stroke.color[1] +
          "," +
          this.style.stroke.color[2] +
          "," +
          this.style.alpha
        })`),
        ctx.beginPath(),
        ctx.roundRect(
          this.position.get().x + this.offset.x + this.style.stroke.size / 2,
          this.position.get().y + this.offset.y + this.style.stroke.size / 2,
          this.size.get().x + this.offset.w - this.style.stroke.size,
          this.size.get().y + this.offset.h - this.style.stroke.size,
          this.style.round ? this.style.round : 0
        ),
        ctx.stroke(),
        ctx.closePath());
      ctx.restore();
    }
  }
  renderDebugWindow() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(0, 255, 0)";
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.roundRect(
      this.position.get().x + this.offset.x + 1,
      this.position.get().y + this.offset.y + 1,
      this.size.get().x + this.offset.w - 2,
      this.size.get().y + this.offset.h - 2,
      0
    );
    ctx.fillRect(
      this.position.get().x + this.offset.x + this.size.get().x / 2 - 1,
      this.position.get().y + this.offset.y + this.size.get().y / 2 - 1,
      2,
      2
    );
    ctx.stroke();
    ctx.font = `${this.size.get().x / 2 - this.size.get().x / 4}px Arial`;
    ctx.fillText(
      "ID",
      this.position.get().x + this.offset.x + 4,
      this.position.get().y + this.offset.y + this.size.get().x / 2 - this.size.get().x / 4,
      this.size.get().x - this.size.get().x / 8
    );
    ctx.closePath();
  }
}
