import { gameObjects, mapObjects } from "../main/engine";
import { createRandomId, nameToUpper } from "../main/utils";
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
  public tags: FragmentProps["tags"];
  protected id: string;
  protected targetDistanceMessuring?: string;
  protected distanceToTarget?: {
    tag: string;
    distance: number | undefined;
    fragment: FragmentType | undefined;
  };
  protected relatedTo?: Vec2DType;
  constructor({ pos, size, layer, targetDistanceMessuring, tags, relatedTo }: FragmentProps) {
    this.position = new Vec2D(pos.x, pos.y);
    this.size = new Vec2D(size.width, size.height);
    this.attachedPlugins = [];
    this.visible = true;
    this.updated = true;
    this.layer = layer;
    this.tags = tags;
    this.id = createRandomId();
    relatedTo && (this.relatedTo = relatedTo);
    targetDistanceMessuring &&
      (this.distanceToTarget = {
        tag: targetDistanceMessuring,
        fragment: undefined,
        distance: undefined
      });
    this.layer === "gameObjects" ? gameObjects.push(this) : mapObjects.push(this);
  }

  render() {
    //e[name]() - escape hatch to avoid ts protected error,
    //it is the only place where i will be using this functions,
    //and it's better as protected so it cannot be accesed and invoke from user components
    this.visible && this.attachedPlugins.forEach((e) => e["render"]());
  }
  update() {
    this.updated && this.attachedPlugins.forEach((e) => e["update"]());
    if (this.distanceToTarget && this.tags.includes(this.distanceToTarget.tag))
      this.distanceToTarget.distance = this.getDistance(this.distanceToTarget.fragment);
  }
  setup() {
    this.attachedPlugins.forEach((e) => e["setup"]());
    if (this.distanceToTarget) {
      this.distanceToTarget.fragment = this.setTargetToDIstanceCheck(this.distanceToTarget.tag);
    }
  }

  attachPlugin(plugin: PluginListT, options?: { bindThis?: boolean; overrideName?: string }) {
    this.attachedPlugins.push(
      new pluginList[nameToUpper(plugin)]({
        position: this.position,
        size: this.size,
        layer: this.layer,
        id: this.id,
        siblings: this.attachedPlugins,
        referanceName: options?.overrideName ? options.overrideName : plugin,
        relatedTo: this.relatedTo
      })
    );
    if (options?.bindThis !== false) {
      this[options?.overrideName ? options.overrideName : plugin] =
        this.attachedPlugins[this.attachedPlugins.length - 1];
    }
  }
  getPlugin<T>(name: PluginListT) {
    return this.attachedPlugins.find((plugin) => plugin.constructor.name === nameToUpper(name)) as
      | T
      | undefined;
  }

  private setTargetToDIstanceCheck(target: string) {
    const fragment = gameObjects.find((e) => e.tags.includes(target));
    if (!fragment) throw new Error("Setting distance to Tag - wrong target");
    return fragment;
  }
  private getDistance(target: FragmentType | undefined) {
    if (!target) return -1;
    const a =
      this.position.get().x +
      this.size.get().x / 2 -
      (target.position.get().x + target.size.get().x / 2);
    const b =
      this.position.get().y +
      this.size.get().y / 2 -
      (target.position.get().y + target.size.get().y / 2);

    return Math.round(Math.sqrt(a ** 2 + b ** 2));
  }
}
