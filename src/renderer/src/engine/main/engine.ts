import { CameraType } from "../components/camera";
// import type { FragmentType } from "../fragment/fragment";
import { keysHandles, mouseHandlers } from "./inputHandlers";
import { loadFile } from "./utils";

(function () {
  if (!document.getElementById("CanvasContainer")) throw new Error("No Cante");
  if (!document.getElementById("loadingScreen")) throw new Error("No load");
  if (!document.getElementById("gameWindow")) throw new Error("No Canvas");
})();
export let fixedTime = 0;
export const canvasContainer = document.getElementById("CanvasContainer")!;
const loadingScreen = document.getElementById("loadingScreen")!;
export const canvas = document.getElementById("gameWindow") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d")!;
export const gameObjects: FragmentType[] = [];
export const mapObjects: FragmentType[] = [];
export const uiObjects: FragmentType[] = [];
export const cameraObjects: Map<string, CameraType> = new Map();
export default class Engine {
  private preload: EngineConfig["preload"];
  private update: EngineConfig["update"];
  private render: EngineConfig["render"];
  private setup: EngineConfig["setup"];
  private fps: EngineConfig["fps"];
  private oldTimeStamp: number;
  private meter: FPSM;
  constructor({ update, render, fps, setup, preload }: EngineConfig) {
    this.preload = preload;
    this.update = update;
    this.render = render;
    this.setup = setup;
    this.fps = fps;
    this.meter = new FPSMeter() as FPSM;
    this.oldTimeStamp = 0;
    window.engine = this;
    this.preloader();
  }

  private preloader = () => {
    this.preload();
    ctx.imageSmoothingEnabled = false;
    loadingScreen.style.display = "none";
    canvas.style.display = "block";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "start";
    keysHandles();
    this.setup();
    mouseHandlers(canvas, cameraObjects.get("main"));
    this.loop();
    this.fps ? this.meter.show() : this.meter.hide();
  };

  private loop() {
    const x = performance.now();
    fixedTime = Number(((performance.now() - this.oldTimeStamp) / 1000).toFixed(4));
    this.oldTimeStamp = Number(performance.now().toFixed(4));
    this.update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setTransform(
      cameraObjects.get("main")?.zoom ?? 1,
      0,
      0,
      cameraObjects.get("main")?.zoom ?? 1,
      0,
      0
    );
    this.render();
    ctx.restore();
    this.meter.tick();
    tick(x);
    window.requestAnimationFrame(() => this.loop());
  }
}
const tick = (x: number) => {
  ctx.font = "20px Arial";
  ctx.fillText(
    `MS: ${(performance.now() - x).toFixed(2)}, FPS: ${(1000 / (performance.now() - x)).toFixed(
      0
    )}`,
    400,
    25
  );
};
