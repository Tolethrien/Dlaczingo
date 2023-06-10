import Plugin from "./plugin";
import { ctx } from "../../main/engine";

interface hitboxValues {
  shape: "rect" | "elipse";
  active: boolean;
  visible: boolean;
  vectors: [number, number, number, number];
  offsetPosition: { x: number; y: number };
  initialSize: { x: number; y: number };
  relatedTo: Vec2DType | undefined;
}
interface RectangleSizeProps {
  width: number;
  height: number;
  relatedTo?: Vec2DType;
}
interface CircleSizeProps {
  radius: number;
  relatedTo?: Vec2DType;
}
interface AddHitboxProps {
  shape: hitboxValues["shape"];
  active?: hitboxValues["active"];
  visible?: hitboxValues["visible"];
  offsetPosition?: { x: number; y: number };
  size:
    | (CircleSizeProps & { width?: never; height?: never })
    | (RectangleSizeProps & { radius?: never });
}
type ModifierRect = [number, number, number, number];
type ModifierElipse = [number];
export default class Hitboxes extends Plugin {
  private hitboxes: Map<string, hitboxValues>;
  constructor(props: PluginProps) {
    super(props);
    this.hitboxes = new Map();
  }
  update() {
    this.hitboxes.forEach((hitbox) => hitbox.active && this.updateHitbox(hitbox));
  }

  render() {
    this.hitboxes.forEach(
      (hitbox) => hitbox.visible && this.hitboxFrame(hitbox.shape, hitbox.vectors)
    );
  }
  addHitbox(name: string, { active, size, visible, shape, offsetPosition }: AddHitboxProps) {
    this.hitboxes.set(name, {
      shape: shape,
      active: active ?? true,
      visible: visible ?? false,
      vectors: [this.position.get().x, this.position.get().y, this.size.get().x, this.size.get().y],
      offsetPosition: offsetPosition ?? { x: 0, y: 0 },
      initialSize: { x: size.width ?? size.radius!, y: size.height ?? size.radius! },
      relatedTo: size.relatedTo ?? undefined
    });
  }

  updateHitbox(hitbox: hitboxValues) {
    if (hitbox.shape === "rect") {
      hitbox.vectors = [
        this.position.get().x + hitbox.offsetPosition.x,
        this.position.get().y + hitbox.offsetPosition.y,
        hitbox.relatedTo ? this.size.get().x + hitbox.initialSize.x : hitbox.initialSize.x,
        hitbox.relatedTo ? this.size.get().y + hitbox.initialSize.y : hitbox.initialSize.y
      ];
    } else {
      hitbox.vectors = [
        this.position.get().x + this.size.get().x / 2 + hitbox.offsetPosition.x,
        this.position.get().y + this.size.get().y / 2 + hitbox.offsetPosition.y,
        hitbox.relatedTo ? this.size.get().x / 2 + hitbox.initialSize.x : hitbox.initialSize.x,
        hitbox.relatedTo ? this.size.get().y / 2 + hitbox.initialSize.y : hitbox.initialSize.y
      ];
    }
  }

  removeHitbox(name: string) {
    this.hitboxes.has(name)
      ? this.hitboxes.delete(name)
      : console.warn(`${name} is not exist on hitboxes list`);
  }

  get(hitboxName: string) {
    return this.hitboxes.get(hitboxName);
  }

  setIsActive(hitbox: string, value: hitboxValues["active"]) {
    this.hitboxes.get(hitbox) && (this.hitboxes.get(hitbox)!.active = value);
  }

  setIsActiveAll(value: hitboxValues["active"]) {
    this.hitboxes.forEach((hitbox) => (hitbox.active = value));
  }

  changePositionOffset(hitbox: string, value: hitboxValues["offsetPosition"]) {
    this.hitboxes.get(hitbox) && (this.hitboxes.get(hitbox)!.offsetPosition = value);
  }
  changeSize(hitbox: string, value: AddHitboxProps["size"]) {
    if (this.hitboxes.get(hitbox)) {
      value.relatedTo && (this.hitboxes.get(hitbox)!.relatedTo = value.relatedTo);
      this.hitboxes.get(hitbox)!.initialSize = {
        x: value.width ?? value.radius!,
        y: value.height ?? value.radius!
      };
    }
  }
  setVisible(hitbox: string, value: hitboxValues["visible"]) {
    this.hitboxes.get(hitbox) && (this.hitboxes.get(hitbox)!.visible = value);
  }

  setVisibleAll(value: hitboxValues["visible"]) {
    this.hitboxes.forEach((hitbox) => (hitbox.visible = value));
  }

  isColliding(hitbox: hitboxValues, target: hitboxValues) {
    if (!hitbox.active || !target.active || hitbox === target) return;
    if (hitbox.shape === "rect" && target.shape === "rect")
      return this.colideRectangleWithRectangle(hitbox, target);
    else if (
      (hitbox.shape === "elipse" && target.shape === "rect") ||
      (hitbox.shape === "rect" && target.shape === "elipse")
    )
      return this.colideCircleWithRectangle(
        hitbox.shape === "elipse" ? hitbox : target,
        hitbox.shape === "rect" ? hitbox : target
      );
    else if (hitbox.shape === "elipse" && target.shape === "elipse")
      return this.colideCircleWithCircle(hitbox, target);
    return Error("none of those are rect or elipse");
  }
  willBeColliding(
    hitbox: hitboxValues,
    target: hitboxValues,
    modifier: ModifierElipse | ModifierRect
  ) {
    if (!hitbox.active || !target.active || hitbox === target) return;
    if (hitbox.shape === "rect" && target.shape === "rect")
      return this.willColideRectangleWithRectangle(hitbox, target, modifier as ModifierRect);
    else if (hitbox.shape === "elipse" && target.shape === "elipse")
      return this.willColideCircleWithCircle(hitbox, target, modifier as ModifierElipse);
    else if (
      (hitbox.shape === "elipse" && target.shape === "rect") ||
      (hitbox.shape === "rect" && target.shape === "elipse")
    )
      return this.willCollideCircleWithRectangle(
        hitbox.shape === "elipse" ? hitbox : target,
        hitbox.shape === "rect" ? hitbox : target,
        modifier as ModifierRect
      );
    return Error("none of those are rect or elipse");
  }

  private colideCircleWithRectangle(circle: hitboxValues, rect: hitboxValues) {
    const distX = Math.round(Math.abs(circle.vectors[0] - rect.vectors[0] - rect.vectors[2] / 2));
    const distY = Math.round(Math.abs(circle.vectors[1] - rect.vectors[1] - rect.vectors[3] / 2));
    if (
      distX > rect.vectors[2] / 2 + circle.vectors[2] ||
      distY > rect.vectors[3] / 2 + circle.vectors[2]
    )
      return false;
    if (distX <= rect.vectors[2] / 2 || distY <= rect.vectors[3] / 2) return true;
    return (
      Math.sqrt((distX - rect.vectors[2] / 2) ** 2 + (distY - rect.vectors[3] / 2) ** 2) <=
      Math.sqrt(circle.vectors[2] ** 2)
    );
  }
  private colideCircleWithCircle(circleA: hitboxValues, circleB: hitboxValues) {
    return (
      (circleA.vectors[2] + circleB.vectors[2]) ** 2 >
      (circleB.vectors[0] - circleA.vectors[0]) ** 2 +
        (circleB.vectors[1] - circleA.vectors[1]) ** 2
    );
  }
  private colideRectangleWithRectangle(hitbox: hitboxValues, target: hitboxValues) {
    if (!hitbox.active || hitbox === target) return;
    return (
      hitbox.vectors[1] + hitbox.vectors[3] > target.vectors[1] &&
      hitbox.vectors[1] < target.vectors[1] + target.vectors[3] &&
      hitbox.vectors[0] + hitbox.vectors[2] > target.vectors[0] &&
      hitbox.vectors[0] < target.vectors[0] + target.vectors[2] &&
      true
    );
  }
  private willColideRectangleWithRectangle(
    hitbox: hitboxValues,
    target: hitboxValues,
    modifier: ModifierRect
  ) {
    if (!hitbox.active || hitbox === target) return;
    return (
      hitbox.vectors[1] + hitbox.vectors[3] + modifier[2] > target.vectors[1] &&
      hitbox.vectors[1] - modifier[0] < target.vectors[1] + target.vectors[3] &&
      hitbox.vectors[0] + hitbox.vectors[2] + modifier[1] > target.vectors[0] &&
      hitbox.vectors[0] - modifier[3] < target.vectors[0] + target.vectors[2] &&
      true
    );
  }
  private willColideCircleWithCircle(
    circleA: hitboxValues,
    circleB: hitboxValues,
    modifier: ModifierElipse
  ) {
    return (
      (circleA.vectors[2] + modifier[0] + circleB.vectors[2]) ** 2 >
      (circleB.vectors[0] - circleA.vectors[0]) ** 2 +
        (circleB.vectors[1] - circleA.vectors[1]) ** 2
    );
  }

  private willCollideCircleWithRectangle(
    circle: hitboxValues,
    rect: hitboxValues,
    modifier: ModifierRect
  ) {
    const distX = Math.round(
      Math.abs(
        circle.vectors[0] +
          (modifier[0] !== 0 ? modifier[0] : -modifier[2]) -
          rect.vectors[0] -
          rect.vectors[2] / 2
      )
    );
    const distY = Math.round(
      Math.abs(
        circle.vectors[1] +
          (modifier[1] !== 0 ? modifier[1] : -modifier[3]) -
          rect.vectors[1] -
          rect.vectors[3] / 2
      )
    );
    if (
      distX > rect.vectors[2] / 2 + circle.vectors[2] ||
      distY > rect.vectors[3] / 2 + circle.vectors[2]
    )
      return false;
    if (distX <= rect.vectors[2] / 2 || distY <= rect.vectors[3] / 2) return true;

    return (
      Math.sqrt((distX - rect.vectors[2] / 2) ** 2 + (distY - rect.vectors[3] / 2) ** 2) <=
      Math.sqrt(circle.vectors[2] ** 2)
    );
  }

  private hitboxFrame(shape: hitboxValues["shape"], vector: hitboxValues["vectors"]) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(255, 255, 0)";
    if (shape === "rect") {
      ctx.strokeRect(vector[0], vector[1], vector[2], vector[3]);
    } else {
      ctx.beginPath();
      ctx.ellipse(vector[0], vector[1], vector[2], vector[3], 0, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
    }
  }
}
