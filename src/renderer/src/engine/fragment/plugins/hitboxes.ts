import Plugin from "./plugin";
import { ctx } from "../../main/engine";

/**array takes settings of individual hitbox:
 * [0]: active, [1]: visible [2]: array of position and size [3]: array of offset
 */
type hitboxValues = [
  boolean,
  boolean,
  [number, number, number, number],
  [number, number, number, number]
];
interface addHitboxProps {
  active: hitboxValues[0];
  visible?: hitboxValues[1];
  offset: { x: number; y: number; w: number; h: number };
}
export default class Hitboxes extends Plugin {
  private hitboxes: Map<string, hitboxValues>;
  constructor({ position, size, layer, siblings, referanceName }) {
    super(position, size, siblings, layer, referanceName);
    this.hitboxes = new Map();
  }
  update() {
    this.hitboxes.forEach((hitbox) => hitbox[0] && this.updateHitbox(hitbox));
  }

  render() {
    this.hitboxes.forEach((hitbox) => hitbox[1] && this.renderHitbox(hitbox[2]));
  }

  addHitbox(name: string, { active, offset, visible }: addHitboxProps) {
    this.hitboxes.set(name, [
      active,
      visible ?? false,
      [this.position.get().x, this.position.get().y, this.size.get().x, this.size.get().y],
      [offset.x, offset.y, offset.w, offset.h]
    ]);
  }

  removeHitbox(name: string) {
    this.hitboxes.has(name)
      ? this.hitboxes.delete(name)
      : console.log(`${name} is not exist on hitboxes list`);
  }

  get(hitboxName: string) {
    return this.hitboxes.get(hitboxName);
  }

  setIsActive(hitbox: string, value: hitboxValues[0]) {
    this.hitboxes.get(hitbox) && (this.hitboxes.get(hitbox)![0] = value);
  }

  setIsActiveAll(value: hitboxValues[0]) {
    this.hitboxes.forEach((hitbox) => (hitbox[0] = value));
  }

  changeOffset(hitbox: string, value: addHitboxProps["offset"]) {
    this.hitboxes.get(hitbox) &&
      (this.hitboxes.get(hitbox)![3] = [value.x, value.y, value.w, value.h]);
  }

  setVisible(hitbox: string, value: hitboxValues[1]) {
    this.hitboxes.get(hitbox) && (this.hitboxes.get(hitbox)![1] = value);
  }

  setVisibleAll(value: hitboxValues[1]) {
    this.hitboxes.forEach((hitbox) => (hitbox[1] = value));
  }

  updateHitbox(hitbox: hitboxValues) {
    hitbox[2] = [
      this.position.get().x + hitbox[3][0],
      this.position.get().y + hitbox[3][1],
      this.size.get().x + hitbox[3][2],
      this.size.get().y + hitbox[3][3]
    ];
  }

  renderHitbox(position: hitboxValues[2]) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(255, 255, 0)";
    ctx.beginPath();
    ctx.strokeRect(position[0], position[1], position[2], position[3]);
    ctx.stroke();
    ctx.closePath();
  }

  isColliding(hitbox: hitboxValues, target: hitboxValues) {
    if (!hitbox[0] || hitbox === target) return;
    return (
      hitbox[2][1] + hitbox[2][3] > target[2][1] &&
      hitbox[2][1] < target[2][1] + target[2][3] &&
      hitbox[2][0] + hitbox[2][2] > target[2][0] &&
      hitbox[2][0] < target[2][0] + target[2][2] &&
      true
    );
  }
  /**array takes settings of individual hitbox:
   * [0]: active, [1]: visible [2]: array of position and size [3]: array of offset
   */
  willBeColliding(
    hitbox: hitboxValues,
    target: hitboxValues,
    modifier: [number, number, number, number]
  ) {
    if (!hitbox[0] || hitbox === target) return;

    return (
      //player.y + player.h + 5 <= target.y
      hitbox[2][1] + hitbox[2][3] + modifier[2] > target[2][1] &&
      //player.Y - 5 <= target.y + target.h
      hitbox[2][1] - modifier[0] < target[2][1] + target[2][3] &&
      hitbox[2][0] + hitbox[2][2] + modifier[1] > target[2][0] &&
      hitbox[2][0] - modifier[3] < target[2][0] + target[2][2] &&
      true
    );
  }
}
