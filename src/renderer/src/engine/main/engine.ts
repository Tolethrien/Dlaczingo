import { zoom } from "../components/camera";
import type { FragmentType } from "../fragment/fragment";
import type { EngineConfig, FPSM } from "./engine.d";
import { keyHoldEventUpdate, keysHandles, mouseHandlers } from "./inputHandlers";

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
    mouseHandlers();
    keysHandles();
    this.preloader();
  }

  private preloader = () => {
    this.preload();
    ctx.imageSmoothingEnabled = false;
    loadingScreen.style.display = "none";
    canvas.style.display = "block";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "start";
    this.setup();
    this.loop();
    this.fps ? this.meter.show() : this.meter.hide();
  };

  private loop() {
    fixedTime = Number(((performance.now() - this.oldTimeStamp) / 1000).toFixed(4));
    this.oldTimeStamp = Number(performance.now().toFixed(4));
    keyHoldEventUpdate();
    this.update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
    this.render();
    ctx.restore();
    this.meter.tick();
    window.requestAnimationFrame(() => this.loop());
  }
}
