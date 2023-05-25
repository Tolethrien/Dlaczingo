import { gameObjects, mapObjects, uiObjects } from "../main/engine";
import Vec2D, { Vec2DType } from "../main/vec2D";
import pluginList from "./pluginList";
import Plugin from "./plugins/plugin";

export default class Fragment {
  public position: Vec2DType;
  public size: Vec2DType;
  protected attachedPlugins: Plugin[];
  protected visible: boolean;
  protected updated: boolean;
  protected layer: FragmentProps["layer"];
  public tag: FragmentProps["tag"];
  protected id: string;
  protected targetDistanceMessuring?: string;
  protected distanceToTarget?: Map<
    "tag" | "distance" | "fragment",
    number | string | FragmentType | undefined
  >;
  constructor({ pos, size, layer, targetDistanceMessuring, tag }: FragmentProps) {
    this.position = new Vec2D(pos.x, pos.y);
    this.size = new Vec2D(size.width, size.height);
    this.attachedPlugins = [];
    this.visible = true;
    this.updated = true;
    this.layer = layer;
    this.tag = tag;
    this.id = this.createRandomId();
    targetDistanceMessuring &&
      (this.distanceToTarget = new Map([
        ["tag", targetDistanceMessuring],
        ["fragment", undefined],
        ["distance", undefined]
      ]));
    this.layerList();
  }
  private layerList() {
    if (this.layer === "gameObjects") gameObjects.push(this);
    else if (this.layer === "uiObjects") uiObjects.push(this);
    else if (this.layer === "mapObjects") mapObjects.push(this);
  }
  render() {
    this.visible && this.attachedPlugins.forEach((e) => e.render());
  }
  update() {
    this.updated && this.attachedPlugins.forEach((e) => e.update());
    if (
      this.distanceToTarget &&
      this.tag !== this.distanceToTarget.get("tag") &&
      this.layer !== "uiObjects"
    )
      this.distanceToTarget?.set(
        "distance",
        this.getDistance(this.distanceToTarget.get("fragment") as FragmentType)
      );
  }
  setup() {
    this.attachedPlugins.forEach((e) => e.setup());
    if (this.distanceToTarget) {
      this.distanceToTarget.set(
        "fragment",
        this.setTargetToDIstanceCheck(this.distanceToTarget.get("tag") as string)
      );
    }
  }

  attachPlugin(plugin: pluginListT, options?: { bindThis?: boolean; overrideName?: string }) {
    this.attachedPlugins.push(
      new pluginList[this.pluginNameToUpper(plugin)]({
        position: this.position,
        size: this.size,
        layer: this.layer,
        id: this.id,
        siblings: this.attachedPlugins,
        referanceName: options?.overrideName ? options.overrideName : plugin
      })
    );
    if (options?.bindThis !== false) {
      this[options?.overrideName ? options.overrideName : plugin] =
        this.attachedPlugins[this.attachedPlugins.length - 1];
    }
  }
  getPlugin<T>(name: pluginListT) {
    return this.attachedPlugins.find(
      (plugin) => plugin.constructor.name === this.pluginNameToUpper(name)
    ) as T | undefined;
  }
  private createRandomId() {
    return "_" + Math.random().toString(36).substring(2, 9);
  }
  private setTargetToDIstanceCheck(target: string) {
    const fragment = gameObjects.find((e) => e.tag === target);
    if (!fragment) throw new Error("Setting distance to Tag - wrong target");
    return fragment;
  }
  private getDistance(target: FragmentType) {
    if (!this.distanceToTarget) return -1;
    const a =
      this.position.get().x +
      this.size.get().x / 2 -
      (target.position.get().x + target.size.get().x / 2);
    const b =
      this.position.get().y +
      this.size.get().y / 2 -
      (target.position.get().y + target.size.get().y / 2);

    return Math.round(Math.sqrt(a * a + b * b));
  }
  private pluginNameToUpper(name: string) {
    return [name[0].toUpperCase(), name.slice(1)].toString().replace(",", "");
  }
}
