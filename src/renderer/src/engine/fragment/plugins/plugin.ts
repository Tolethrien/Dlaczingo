import { nameToUpper } from "../../main/utils";
import { Vec2DType } from "../../main/vec2D";

export default abstract class Plugin {
  position: Vec2DType;
  size: Vec2DType;
  protected siblings: Plugin[];
  layer: FragmentProps["layer"];
  referanceName: string;
  relatedTo?: Vec2DType;

  constructor({ position, size, siblings, layer, referanceName, relatedTo }: PluginProps) {
    this.position = position;
    this.size = size;
    this.siblings = siblings;
    this.layer = layer;
    this.referanceName = referanceName;
    this.relatedTo = relatedTo;
  }

  setup(): void {}
  update(): void {}
  render(): void {}
  getSibling<T>(name: fragmentPluginListT) {
    return this.siblings.find((plugin) => plugin.constructor.name === nameToUpper(name)) as
      | T
      | undefined;
  }
}
