import Vec2D from "../../main/vec2D";
import Plugin from "./plugin";

// velocity,
interface MotionParamsI {
  movemanSpeed: number;
  colideCheck: boolean;
}
type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export default class DirectionalMovement extends Plugin {
  speed: number;
  isColide: MotionParamsI["colideCheck"];
  vel: Vec2DType;
  constructor({ position, size, layer, siblings, referanceName }) {
    super(position, size, siblings, layer, referanceName);
    this.isColide = false;
    this.vel = new Vec2D(0, 0);
    this.speed = 1;
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
  }
  isMoving() {
    if (this.vel.get().x !== 0 || this.vel.get().y !== 0) return true;
    return false;
  }
  stopMovement() {
    this.isMoving() && this.vel.set(0, 0);
  }
  moveFromAngle() {}
  moveFromDirection() {}
  impulse() {}
}
