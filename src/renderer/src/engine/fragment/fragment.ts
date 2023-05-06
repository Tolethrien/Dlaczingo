import { gameObjects, uiObjects } from "../main/engine";
import Vec2D, { Vec2DType } from "../main/vec2D";
import pluginList from "./pluginList";
import Plugin from "./plugins/plugin";

export interface FragmentProps {
  pos: { x: number; y: number };
  size: { width: number; height: number };
  layer: "gameObjects" | "uiObjects" | "mapObjects" | "independent";
  tag: string;
}
export interface FragmentType extends Fragment {}

export default class Fragment {
  position: Vec2DType;
  size: Vec2DType;
  protected attachedComponents: Plugin[];
  protected visible: boolean;
  protected updated: boolean;
  protected layer: FragmentProps["layer"];
  public tag: FragmentProps["tag"];
  protected id: string;
  protected distanceToTarget: number | undefined;
  protected distanceTargetTag:
    | { tag: string; vector: { x: number; y: number; w: number; h: number } }
    | undefined;
  [index: string]: any;

  constructor({ pos, size, layer, tag }: FragmentProps) {
    this.position = new Vec2D(pos.x, pos.y);
    this.size = new Vec2D(size.width, size.height);
    this.attachedComponents = [];
    this.visible = true;
    this.updated = true;
    this.layer = layer;
    this.tag = tag;
    this.id = this.createRandomId();
    this.distanceToTarget;
    this.distanceTargetTag;
    this.layer !== "independent" && gameObjects.push(this);
  }
  render() {
    this.visible && this.attachedComponents.forEach((e) => e.render());
  }
  update() {
    this.updated && this.attachedComponents.forEach((e) => e.update());
    if (
      this.distanceTargetTag &&
      this.tag !== this.distanceTargetTag.tag &&
      this.layer !== "uiObjects"
    )
      this.distanceToTarget = this.getDistance();
  }
  setup() {
    this.attachedComponents.forEach((e) => e.setup());
  }

  attachComponent(component: string, name?: string) {
    // const { default: myClass } = import("./plugins/renderer");
    // const myCla = new myClass();
    this.attachedComponents.push(
      new pluginList[this.componentNameToUpper(component)]({
        position: this.position,
        size: this.size,
        layer: this.layer,
        id: this.id,
        siblings: this.attachedComponents,
        referanceName: name ? name : component
      })
    );
    this[name ? name : component] = this.attachedComponents[this.attachedComponents.length - 1];
  }

  private createRandomId() {
    return "_" + Math.random().toString(36).substring(2, 9);
  }
  setTargetToDIstanceCheck(target: string) {
    const x = gameObjects.find((e: any) => e.tag === target);
    if (!x) throw new Error("Setting distance to Tag - wrong target");
    this.distanceTargetTag = { tag: x.tag, vector: x.vector };
  }
  private getDistance() {
    // distance between two points:  a2 * b2 = c
    if (!this.distanceTargetTag) return -1;
    const a =
      this.vector.x +
      this.vector.w / 2 -
      (this.distanceTargetTag.vector.x + this.distanceTargetTag.vector.w / 2);
    const b =
      this.vector.y +
      this.vector.h / 2 -
      (this.distanceTargetTag.vector.y + this.distanceTargetTag.vector.h / 2);

    return Math.round(Math.sqrt(a * a + b * b));
  }
  private componentNameToUpper(name: string) {
    // powieksz pierwsza litere nazwy, dodaj reszte nazwy(bez pierwszej litery), przerob array na string, usun przecinek po 1 literze
    return [name[0].toUpperCase(), name.slice(1)].toString().replace(",", "");
  }
}
