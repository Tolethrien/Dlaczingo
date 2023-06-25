export interface Vec2DType extends Vec2D {}
export default class Vec2D {
  private vector: [number, number];
  constructor(x: number, y: number) {
    this.vector = [x, y];
  }
  public add(targetVec: Vec2DType | [number, number]) {
    if (Array.isArray(targetVec)) {
      this.vector = [this.vector[0] + targetVec[0], this.vector[1] + targetVec[1]];
    } else {
      this.vector = [this.vector[0] + targetVec.vector[0], this.vector[1] + targetVec.vector[1]];
    }
  }
  public set(x: number, y: number) {
    this.vector = [x, y];
  }
  public setAxis(axis: "x" | "y", value: number) {
    axis === "x"
      ? (this.vector = [value, this.vector[1]])
      : (this.vector = [this.vector[0], value]);
  }
  public sub(targetVec: Vec2DType | [number, number]) {
    if (Array.isArray(targetVec)) {
      this.vector = [this.vector[0] - targetVec[0], this.vector[1] - targetVec[1]];
    } else {
      this.vector = [this.vector[0] - targetVec.vector[0], this.vector[1] - targetVec.vector[1]];
    }
  }
  public get() {
    return { x: this.vector[0], y: this.vector[1] };
  }
  public getRound() {
    return { x: Math.round(this.vector[0]), y: Math.round(this.vector[1]) };
  }
  public normalize(): [number, number] {
    const length = Math.sqrt(this.vector.reduce((acc, val) => acc + val ** 2, 0));
    // console.log(Math.sqrt(this.vector[0] ** 2 + this.vector[1] ** 2));
    return [this.vector[0] / length, this.vector[1] / length];
  }
  public scale(scalarX: number, scalarY?: number) {
    if (!scalarY) this.vector = [this.vector[0] * scalarX, this.vector[1] * scalarX];
    else this.vector = [this.vector[0] * scalarX, this.vector[1] * scalarY];
  }
  public length() {
    return Math.sqrt(this.vector.reduce((acc, cur) => acc + cur ** 2, 0));
  }
  public distanceToOtherVec2D(other: Vec2DType) {
    return Math.sqrt(
      (this.vector[0] - other.get().x) * (this.vector[0] - other.get().x) +
        (this.vector[1] - other.get().y) * (this.vector[1] - other.get().y)
    );
  }
  // To-Do
  // public lerp(start: number, end: number, t: number) {
  //   return (1 - t) * start + t * end;
  // }
}
