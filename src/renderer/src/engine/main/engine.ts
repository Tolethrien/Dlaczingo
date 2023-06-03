import { CameraType } from "../components/camera";
import { keysHandles, mouseHandlers } from "./inputHandlers";

(function () {
  // if (!document.getElementById("CanvasContainer")) throw new Error("No Cante");
  if (!document.getElementById("loadingScreen")) throw new Error("No load");
  // if (!document.getElementById("gameWindow")) throw new Error("No Canvas");
})();
export let fixedTime = 0;
export const canvasContainer = document.getElementById("CanvasContainer")!;
const loadingScreen = document.getElementById("loadingScreen")!;
export const canvas = document.getElementById("gameWindow") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d")!;
// setResolution();
const messureTime = document.getElementById("fps-output");
messureTime!.innerText = String(0);
export const gameObjects: FragmentType[] = [];
export const mapObjects: FragmentType[] = [];
export const uiObjects: FragmentType[] = [];
export const cameraObjects: Map<string, CameraType> = new Map();
let mod = 0;
// function setSizeofCanvas() {
//   //TODO: gonna need some way to reload game on every change of size
//   canvasContainer.style.width = innerWidth;
//   canvasContainer.style.height = innerHeight;
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// }
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
    canvas.style.display = "inline-block";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "start";
    this.setup();
    keysHandles();
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
    ctx.setTransform(
      cameraObjects.get("main")?.zoom ?? 1,
      0,
      0,
      cameraObjects.get("main")?.zoom ?? 1,
      0,
      0
    );
    this.render();
    this.meter.tick();
    tick(x);
    requestAnimationFrame(() => this.loop());
  }
}
const tick = (x: number) => {
  mod % 15 === 0 && mod !== 0
    ? ((messureTime!.innerText = `${(performance.now() - x).toFixed(2)}MS`), (mod = 0))
    : mod++;
};
