import Fragment from "../fragment/fragment";
import { ctx, canvas, gameObjects } from "../main/engine";
import Vec2D, { Vec2DType } from "../main/vec2D";
interface CameraProps {
  type: "follow" | "free";
  isBounded: boolean;
  boundaries: object;
  tags: FragmentProps["tags"];
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
  followedTag: FragmentProps["tags"][0];
  private selfPos?: Vec2DType;
  constructor({ type, isBounded, boundaries, followTag, tags, offset }: CameraProps) {
    super({
      tags,
      pos: { x: 40, y: 10 },
      layer: "independent",
      size: { height: 80, width: 80 }
    });
    this.camOffSet = new Vec2D(0, 0);
    this.zoom = 1;
    this.type = type;
    this.followedTag = followTag;
    this.isBounded = isBounded;
    this.boundaries = boundaries;
    offset
      ? this.camOffSet.set(offset.x, offset.y)
      : this.camOffSet.set(canvas.width / 2, canvas.height / 2);

    this.isBounded && this.attachPlugin("movementRestriction");
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
  setup() {
    this.ObjectToFollow = gameObjects.find((e) => e.tags.includes(this.followedTag));
    if (!this.ObjectToFollow) throw new Error("no obj");
  }
  off() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  on() {
    ctx.setTransform(this.zoom, 0, 0, this.zoom, 0, 0);
    ctx.translate(-this.position.getRound().x / this.zoom, -this.position.getRound().y / this.zoom);
  }
  setZoom(newZoom: number) {
    this.zoom = newZoom;
  }

  start() {
    this.type === "follow" ? this.cameraFollow() : this.cameraFree();
    ctx.translate(
      -Math.round(this.position.getRound().x) / this.zoom,
      -Math.round(this.position.getRound().y) / this.zoom
    );
  }
  private cameraFollow() {
    this.movementRestriction ? this.movementRestriction.boundCamera() : this.noneRestrictedcamera();
  }
  private cameraFree() {
    this.position.set(
      this.selfPos!.getRound().x - canvas.width / 2,
      this.selfPos!.getRound().y - canvas.height / 2
    );
  }
  private noneRestrictedcamera() {
    this.position.set(
      (this.ObjectToFollow!.position.getRound().x + this.ObjectToFollow!.size.get().x / 2) *
        this.zoom -
        this.camOffSet.get().x,
      (this.ObjectToFollow!.position.getRound().y + this.ObjectToFollow!.size.get().y / 2) *
        this.zoom -
        this.camOffSet.get().y
    );
  }

  private movement() {
    // ustawianie klawiszy ruchu wrac z callbackiem co maja robic
    this.keyEvents?.onKeyHold(["a"], () => this.selfPos?.add([-1, 0])); //left
  }
}
