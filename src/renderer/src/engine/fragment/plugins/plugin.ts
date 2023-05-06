import { Vec2DType } from "../../main/vec2D";

export default abstract class Plugin {
  position: Vec2DType;
  size: Vec2DType;
  protected siblings: Plugin[];
  layer: string;
  referanceName: string;
  constructor(
    position: Vec2DType,
    size: Vec2DType,
    siblings: [],
    layer: string,
    referanceName: string
  ) {
    this.position = position;
    this.size = size;
    this.siblings = siblings;
    this.layer = layer;
    this.referanceName = referanceName;
  }

  setup(): void {}
  update(): void {}
  render(): void {}
}
