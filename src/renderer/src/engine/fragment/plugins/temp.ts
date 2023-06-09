import Plugin from "./plugin";
import { ctx } from "../../main/engine";

interface hitboxValues {
  shape: "rect" | "elipse";
  active: boolean;
  visible: boolean;
  vectors: [number, number, number, number];
  offsetPos: { x: number; y: number };
  initialSize: { x: number; y: number };
  relatedTo: Vec2DType | undefined;
}
interface AddProps {
  shape: hitboxValues["shape"];
  active?: hitboxValues["active"];
  visible?: hitboxValues["visible"];
  offsetPos?: { x: number; y: number };
  size: { relatedTo?: Vec2DType; width?: number; height?: number; radius?: number };
}

export default class Hitboxes extends Plugin {
  private hitboxes: Map<string, hitboxValues>;
  constructor(props: PluginProps) {
    super(props);
    this.hitboxes = new Map();
  }
  addHitbox(name: string, { active, size, visible, shape, offsetPos }: AddProps) {
    this.hitboxes.set(name, {
      shape: shape,
      active: active ?? true,
      visible: visible ?? false,
      vectors: [this.position.get().x, this.position.get().y, this.size.get().x, this.size.get().y],
      offsetPos: offsetPos ?? { x: 0, y: 0 },
      initialSize: { x: size.width ?? size.radius!, y: size.height ?? size.radius! },
      relatedTo: size.relatedTo ?? undefined
    });
  }
  updateHitbox(hitbox: hitboxValues) {
    if (hitbox.shape === "rect") {
      hitbox.vectors = [
        this.position.get().x + hitbox.offsetPos.x,
        this.position.get().y + hitbox.offsetPos.y,
        hitbox.relatedTo ? this.size.get().x + hitbox.initialSize.x : hitbox.initialSize.x,
        hitbox.relatedTo ? this.size.get().y + hitbox.initialSize.y : hitbox.initialSize.y
      ];
    } else {
      hitbox.vectors = [
        this.position.get().x + this.size.get().x / 2 + hitbox.offsetPos.x,
        this.position.get().y + this.size.get().y / 2 + hitbox.offsetPos.y,
        hitbox.relatedTo ? this.size.get().x / 2 + hitbox.initialSize.x : hitbox.initialSize.x,
        hitbox.relatedTo ? this.size.get().y / 2 + hitbox.initialSize.y : hitbox.initialSize.y
      ];
    }
  }
}
