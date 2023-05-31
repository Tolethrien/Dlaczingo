export default abstract class UIPlugin {
  position: Vec2DType;
  size: Vec2DType;
  protected siblings: UIPlugin[];
  layer: string;
  referanceName: string;
  relatedTo: Vec2DType;

  constructor(
    position: Vec2DType,
    size: Vec2DType,
    siblings: [],
    referanceName: string,
    relatedTo: Vec2DType
  ) {
    this.position = position;
    this.relatedTo = relatedTo;
    this.size = size;
    this.siblings = siblings;
    this.layer = "uiObjects";
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
