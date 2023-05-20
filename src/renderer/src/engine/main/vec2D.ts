export interface Vec2DType extends Vec2D {}
export default class Vec2D {
  private vector: [number, number];
  constructor(x: number, y: number) {
    this.vector = [x, y];
  }
  public add(targetVec: Vec2DType | [number, number]) {
    if (Array.isArray(targetVec)) {
      this.vector = [
        Math.round(this.vector[0] + targetVec[0]),
        Math.round(this.vector[1] + targetVec[1])
      ];
    } else {
      this.vector = [
        Math.round(this.vector[0] + targetVec.vector[0]),
        Math.round(this.vector[1] + targetVec.vector[1])
      ];
    }
  }
  public set(x: number, y: number) {
    this.vector = [Math.round(x), Math.round(y)];
  }
  public sub(targetVec: Vec2DType | [number, number]) {
    if (Array.isArray(targetVec)) {
      this.vector = [
        Math.round(this.vector[0] - targetVec[0]),
        Math.round(this.vector[1] - targetVec[1])
      ];
    } else {
      this.vector = [
        Math.round(this.vector[0] - targetVec.vector[0]),
        Math.round(this.vector[1] - targetVec.vector[1])
      ];
    }
  }
  public get() {
    return { x: this.vector[0], y: this.vector[1] };
  }
  public normalize() {
    const length = Math.sqrt(this.vector.reduce((acc, val) => acc + val ** 2, 0));
    return this.vector.map((val) => Number(val / length).toFixed(2));
  }
  public scale(scalarX: number, scalarY?: number) {
    if (!scalarY) this.vector = [this.vector[0] * scalarX, this.vector[1] * scalarX];
    else this.vector = [this.vector[0] * scalarX, this.vector[1] * scalarY];
  }
  public length() {
    return Math.sqrt(this.vector.reduce((acc, cur) => acc + cur * cur, 0));
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
