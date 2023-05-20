import Fragment, { FragmentProps, FragmentType } from "../fragment/fragment";
import { keyEventsType } from "../fragment/plugins/keyEvents";
import { ctx, canvas, fixedTime, gameObjects } from "../main/engine";
import Vec2D, { Vec2DType } from "../main/vec2D";
import { MovementRestrictionType } from "../fragment/plugins/movementRestriction";
interface CameraProps {
  type: "follow" | "free";
  isBounded: boolean;
  boundaries: object;
  tag: FragmentProps["tag"];
  followTag: string;
  offset?: { x: number; y: number };
}
export interface CameraType extends Camera {}
export default class Camera extends Fragment {
  camOffSet: Vec2DType;
  type: "follow" | "free";
  isBounded: boolean;
  boundaries: object;
  ObjectToFollow: FragmentType | undefined;
  keyEvents?: keyEventsType;
  movementRestriction?: MovementRestrictionType;
  zoom: number;
  private selfPos?: Vec2DType;
  constructor({ type, isBounded, boundaries, followTag, tag, offset }: CameraProps) {
    super({
      tag,
      pos: { x: 40, y: 10 },
      layer: "independent",
      size: { height: 80, width: 80 }
    });
    this.camOffSet = new Vec2D(0, 0);
    this.zoom = 1;
    this.type = type;
    this.isBounded = isBounded;
    this.boundaries = boundaries;
    offset
      ? this.camOffSet.set(offset.x, offset.y)
      : this.camOffSet.set(canvas.width / 2, canvas.height / 2);
    this.ObjectToFollow = gameObjects.find((e) => e.tag === followTag);
    if (!this.ObjectToFollow) throw new Error("no obj");
    // this.attachPlugin("movementRestriction");
    this.movementRestriction?.setCameraBoundaries({
      camera: this,
      boundXAxis: true,
      boundYAxis: true,
      boundries: { xMax: 500, xMin: -300, yMax: 500, yMin: -300 }
    });
    if (type === "free") {
      this.selfPos = new Vec2D(0, 0);
      this.attachPlugin("keyEvents");
      this.movement();
    }
    window.camera = this;
  }

  off() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  on() {
    ctx.setTransform(this.zoom, 0, 0, this.zoom, 0, 0);
    ctx.translate(-this.position.get().x / this.zoom, -this.position.get().y / this.zoom);
  }
  setZoom(newZoom: number) {
    this.zoom = newZoom;
  }

  start() {
    this.type === "follow" ? this.cameraFollow() : this.cameraFree();
    ctx.translate(-this.position.get().x / this.zoom, -this.position.get().y / this.zoom);
  }
  private cameraFollow() {
    this.movementRestriction ? this.movementRestriction.boundCamera() : this.noneRestrictedcamera();
  }
  private cameraFree() {
    this.position.set(
      Math.round(this.selfPos!.get().x - canvas.width / 2),
      Math.round(this.selfPos!.get().y - canvas.height / 2)
    );
  }
  private noneRestrictedcamera() {
    this.position.set(
      (this.ObjectToFollow!.position.get().x + this.ObjectToFollow!.size.get().x / 2) * this.zoom -
        this.camOffSet.get().x,
      (this.ObjectToFollow!.position.get().y + this.ObjectToFollow!.size.get().y / 2) * this.zoom -
        this.camOffSet.get().y
    );
  }

  private movement() {
    // ustawianie klawiszy ruchu wrac z callbackiem co maja robic
    this.keyEvents?.onKeyHold("a", () => this.selfPos?.add([-1, 0])); //left
  }
}
