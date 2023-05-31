import Vec2D from "../../main/vec2D";
import Plugin from "./plugin";

type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export default class DirectionalMovement extends Plugin {
  private speed: number;
  private vel: Vec2DType;
  private goToPoint: Vec2DType | undefined;
  constructor({ position, size, layer, siblings, referanceName }) {
    super(position, size, siblings, layer, referanceName);
    this.vel = new Vec2D(0, 0);
    this.speed = 1;
    this.goToPoint = undefined;
  }

  setMovemmentSpeed(speed: number) {
    this.speed = speed;
  }

  teleportTo(x: number, y: number) {
    this.position.set(x, y);
  }
  ContinuousMove(direction: Direction) {
    switch (direction) {
      case "N":
        this.vel.set(0, -1);
        break;
      case "NE":
        this.vel.set(1, -1);
        break;
      case "E":
        this.vel.set(1, 0);
        break;
      case "SE":
        this.vel.set(1, 1);
        break;
      case "S":
        this.vel.set(0, 1);
        break;
      case "SW":
        this.vel.set(-1, 1);
        break;
      case "W":
        this.vel.set(-1, 0);
        break;
      case "NW":
        this.vel.set(-1, -1);
        break;
    }
  }
  update() {
    if (this.isMoving()) {
      const newPos = this.vel.normalize();
      this.position.add([newPos[0] * this.speed, newPos[1] * this.speed]);
    }
    this.movingTowardsPoint();
  }
  isMoving() {
    if (this.vel.get().x !== 0 || this.vel.get().y !== 0) return true;
    return false;
  }
  stopMovement() {
    this.isMoving() && this.vel.set(0, 0);
  }
  moveFromAngle(angle: number) {
    this.angleToDirection(angle);
  }

  private targetVectorToAngle(target: Vec2DType | [number, number]) {
    if (Array.isArray(target)) {
      const angleRadians = Math.round(
        Math.atan2(target[1] - this.position.get().y, target[0] - this.position.get().x) *
          (180 / Math.PI) +
          90
      );
      return angleRadians < 0 ? angleRadians + 360 : angleRadians;
    } else {
      const angleRadians = Math.round(
        Math.atan2(target.get().y - this.position.get().y, target.get().x - this.position.get().x) *
          (180 / Math.PI) +
          90
      );
      return angleRadians < 0 ? angleRadians + 360 : angleRadians;
    }
  }
  private angleToDirection(angle: number) {
    if (angle >= 0 && angle <= 45) this.ContinuousMove("N");
    if (angle > 45 && angle <= 90) this.ContinuousMove("NE");
    if (angle > 90 && angle <= 135) this.ContinuousMove("E");
    if (angle > 135 && angle <= 180) this.ContinuousMove("SE");
    if (angle > 180 && angle <= 225) this.ContinuousMove("S");
    if (angle > 225 && angle <= 270) this.ContinuousMove("SW");
    if (angle > 270 && angle <= 315) this.ContinuousMove("W");
    if (angle > 315 && angle < 359) this.ContinuousMove("NW");
  }

  isOnPoint(vector: Vec2DType) {
    return (
      this.position.get().x + this.size.get().x > vector.get().x &&
      this.position.get().x < vector.get().x &&
      this.position.get().y < vector.get().y &&
      this.position.get().y + this.size.get().y > vector.get().y &&
      true
    );
  }
  moveToPoint(vector: Vec2DType) {
    this.goToPoint = vector;
  }
  private movingTowardsPoint() {
    if (this.goToPoint) {
      if (this.isOnPoint(this.goToPoint)) {
        this.stopMovement();
        this.goToPoint = undefined;
      } else {
        this.angleToDirection(this.targetVectorToAngle(this.goToPoint));
      }
    }
  }
}
