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
  getSibling<T>(name: pluginListT) {
    return this.siblings.find(
      (plugin) => plugin.constructor.name === this.pluginNameToUpper(name)
    ) as T | undefined;
  }
  private pluginNameToUpper(name: string) {
    return [name[0].toUpperCase(), name.slice(1)].toString().replace(",", "");
  }
}
