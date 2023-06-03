import { CameraType } from "../../components/camera";
import { canvas } from "../../main/engine";
import Plugin from "./plugin";

type boundry = { xMin: number; xMax: number; yMin: number; yMax: number };

export default class MovementRestriction extends Plugin {
  protected cameraBoundry?: boundry;
  protected wordlBoundry?: boundry;
  private xAxis: boolean;
  private yAxis: boolean;
  private camera?: CameraType;

  constructor(pluginProps: PluginProps) {
    super(pluginProps);
    this.xAxis = false;
    this.yAxis = false;
  }

  setCameraBoundaries({
    boundXAxis,
    boundYAxis,
    boundries,
    camera
  }: {
    boundXAxis: boolean;
    boundYAxis: boolean;
    boundries: boundry;
    camera: CameraType;
  }) {
    this.xAxis = boundXAxis;
    this.yAxis = boundYAxis;
    this.cameraBoundry = boundries;
    this.camera = camera;
  }

  boundCamera() {
    if (!this.camera || !this.cameraBoundry || !this.camera.ObjectToFollow)
      throw new Error("no camera to restrict");
    this.position.set(
      this.xAxis
        ? this.clamp(
            (this.camera.ObjectToFollow.position.get().x +
              this.camera.ObjectToFollow.size.get().x / 2) *
              this.camera.zoom -
              this.camera.camOffSet.get().x,
            this.cameraBoundry.xMin,
            this.cameraBoundry.xMax * this.camera.zoom - canvas.width
          )
        : (this.camera.ObjectToFollow.position.get().x +
            this.camera.ObjectToFollow.size.get().x / 2) *
            this.camera.zoom -
            this.camera.camOffSet.get().x,
      this.yAxis
        ? this.clamp(
            (this.camera.ObjectToFollow!.position.get().y +
              this.camera.ObjectToFollow!.size.get().y / 2) *
              this.camera.zoom -
              this.camera.camOffSet.get().y,
            this.cameraBoundry.yMin,
            this.cameraBoundry.yMax * this.camera.zoom - canvas.height
          )
        : (this.camera.ObjectToFollow.position.get().y +
            this.camera.ObjectToFollow.size.get().y / 2) *
            this.camera.zoom -
            this.camera.camOffSet.get().y
    );
  }

  private clamp(value: number, min: number, max: number) {
    if (value < min) return min;
    else if (value > max) return max;
    return value;
  }

  //   boundGameObject() {
  //     this.worldBounds.hasOwnProperty("minX") &&
  //       this.worldBounds.hasOwnProperty("maxX") &&
  //       (this.vector.x = this.clamp(
  //         this.vector.x,
  //         this.worldBounds.minX,
  //         this.worldBounds.maxX - this.vector.w
  //       )),
  //       this.worldBounds.hasOwnProperty("minY") &&
  //         this.worldBounds.hasOwnProperty("maxY") &&
  //         (this.vector.y = this.clamp(this.vector.y, this.worldBounds.minY, this.worldBounds.maxY));
  //   }
}
