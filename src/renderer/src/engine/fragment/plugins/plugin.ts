import { nameToUpper } from "../../main/utils";

export default abstract class Plugin {
  position: Vec2DType;
  size: Vec2DType;
  protected siblings: Plugin[];
  layer: FragmentProps["layer"];
  referanceName: string;
  relatedTo?: { parent: Vec2DType; offset: Vec2DType };

  constructor({ position, size, siblings, layer, referanceName, relatedTo }: PluginProps) {
    this.position = position;
    this.size = size;
    this.siblings = siblings;
    this.layer = layer;
    this.referanceName = referanceName;
    this.relatedTo = relatedTo;
  }

  protected setup?(): void;
  protected update?(): void;
  protected render?(): void;
  protected getSibling<T>(name: PluginListT) {
    return this.siblings.find((plugin) => plugin.constructor.name === nameToUpper(name)) as
      | T
      | undefined;
  }
}
