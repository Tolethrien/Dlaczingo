import Fragment, { FragmentProps, FragmentType } from "../fragment/fragment";
import { keyEventsType } from "../fragment/plugins/keyEvents";
import { ctx, canvas, fixedTime, gameObjects } from "../main/engine";
import Vec2D, { Vec2DType } from "../main/vec2D";
export const camPos = new Vec2D(0, 0);
export const camOffSet = new Vec2D(0, 0);
export let zoom = 1;
interface CameraProps {
  type: "follow" | "free";
  isBounded: boolean;
  boundaries: object;
  tag: FragmentProps["tag"];
  followTag: string;
  offset?: { x: number; y: number };
}
export default class Camera extends Fragment {
  type: "follow" | "free";
  isBounded: boolean;
  boundaries: object;
  ObjectToFollow: FragmentType | undefined;
  keyEvents?: keyEventsType;
  private selfPos?: Vec2DType;
  constructor({ type, isBounded, boundaries, followTag, tag, offset }: CameraProps) {
    super({ tag, pos: { x: 50, y: 0 }, layer: "independent", size: { height: 0, width: 0 } });
    this.type = type;
    this.isBounded = isBounded;
    this.boundaries = boundaries;
    offset ? camOffSet.set(offset.x, offset.y) : camOffSet.set(canvas.width / 2, canvas.height / 2);
    this.ObjectToFollow = gameObjects.find((e) => e.tag === followTag);
    if (!this.ObjectToFollow) throw new Error("no obj");
    if (type === "free") {
      this.selfPos = new Vec2D(0, 0);
      this.attachComponent("keyEvents");
      this.movement();
    }
    window.camera = this;
    // this.speed = 150;
    // this.vector.x = 50;
    // type === "follow" &&
    //   (this.attachComponent("movementRestriction"),
    //   this.movementRestriction.setCameraBoundaries({
    //     xAxis: true,
    //     yAxis: true,
    //     boundries: this.boundaries
    //   }));
  }

  off() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  on() {
    ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
    ctx.translate(-camPos.get().x / zoom, -camPos.get().y / zoom);
  }
  zoom(newZoom: number) {
    zoom = newZoom;
  }

  start() {
    this.type === "follow" ? this.cameraFollow() : this.cameraFree();
    ctx.translate(-camPos.get().x / zoom, -camPos.get().y / zoom);
  }
  private cameraFollow() {
    // this.boundary ? this.restrictedCamera() : this.noneRestrictedcamera();
    this.noneRestrictedcamera();
  }
  private cameraFree() {
    camPos.set(
      Math.round(this.selfPos!.get().x - canvas.width / 2),
      Math.round(this.selfPos!.get().y - canvas.height / 2)
    );
  }
  private noneRestrictedcamera() {
    camPos.set(
      Math.round(
        (this.ObjectToFollow!.position.get().x + this.ObjectToFollow!.size.get().x / 2) * zoom -
          camOffSet.get().x
      ),
      Math.round(
        (this.ObjectToFollow!.position.get().y + this.ObjectToFollow!.size.get().y / 2) * zoom -
          camOffSet.get().y
      )
    );
  }
  private restrictedCamera() {
    // camPos = this.movementRestriction.boundCamera(this.followedObject);
  }

  private movement() {
    // ustawianie klawiszy ruchu wrac z callbackiem co maja robic
    this.keyEvents?.addKeyHold("a", () => this.selfPos?.add([-1, 0])); //left
  }
}
