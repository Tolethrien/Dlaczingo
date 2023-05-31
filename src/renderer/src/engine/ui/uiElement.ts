import Vec2D from "../main/vec2D";
import uiPluginList from "./uiPluginList";
import UIPlugin from "./plugins/uiPlugin";
import { createRandomId, nameToUpper } from "../main/utils";

export default class UIElement {
  protected attachedUIPlugins: UIPlugin[];
  public tags: UIElementProps["tags"];
  protected id: string;
  public position: Vec2DType;
  public size: Vec2DType;
  public relatedTo: Vec2DType;
  constructor({ position, size, tags }: UIElementProps) {
    this.attachedUIPlugins = [];
    this.tags = tags;
    this.position = new Vec2D(position.x, position.y);
    this.relatedTo = position.relatedTo;
    this.size = new Vec2D(size.width, size.height);
    this.id = createRandomId();
  }
  render() {
    this.attachedUIPlugins.forEach((e) => e.render());
  }
  update() {
    this.attachedUIPlugins.forEach((e) => e.update());
  }
  setup() {
    this.attachedUIPlugins.forEach((e) => e.setup());
  }

  attachPlugin(plugin: uiPluginListT, options?: { bindThis?: boolean; overrideName?: string }) {
    this.attachedUIPlugins.push(
      new uiPluginList[nameToUpper(plugin)]({
        position: this.position,
        relatedTo: this.relatedTo,
        size: this.size,
        id: this.id,
        siblings: this.attachedUIPlugins,
        referanceName: options?.overrideName ? options.overrideName : plugin
      })
    );
    if (options?.bindThis !== false) {
      this[options?.overrideName ? options.overrideName : plugin] =
        this.attachedUIPlugins[this.attachedUIPlugins.length - 1];
    }
  }
  getPlugin<T>(name: uiPluginListT) {
    return this.attachedUIPlugins.find(
      (plugin) => plugin.constructor.name === nameToUpper(name)
    ) as T | undefined;
  }
}
